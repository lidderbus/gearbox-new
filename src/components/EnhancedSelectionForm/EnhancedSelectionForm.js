// src/components/EnhancedSelectionForm/EnhancedSelectionForm.js
// 增强选型表单主组件

import React, { useState } from 'react';
import { Container, Row, Col, Button, Alert, Card, Spinner, Modal, Table, Badge } from 'react-bootstrap';
import { useEnhancedSelectionForm } from './useEnhancedSelectionForm';
import { loadJsPDF } from '../../utils/dynamicImports';
import { autoSelectGearbox, selectPTOClutch } from '../../utils/selectionAlgorithm';
import { initialData } from '../../data/initialData';
import { submitInquiry } from '../../api/inquiryApi';
import CustomerInfoSection from './CustomerInfoSection';
import EngineInfoSection from './EngineInfoSection';
import BasicParamsSection from './BasicParamsSection';
import ClassificationSection from './ClassificationSection';
import PTOConfigSection from './PTOConfigSection';
import TechRequirementsSection from './TechRequirementsSection';
import QualityRequirementsSection from './QualityRequirementsSection';
import ReferenceSection from './ReferenceSection';
import OutputRequirementsSection from './OutputRequirementsSection';

// 主题颜色配置
const getThemeColors = (theme) => {
  if (theme === 'dark') {
    return {
      bg: '#1a202c',
      card: '#2d3748',
      text: '#e2e8f0',
      headerBg: '#2d3748',
      headerText: '#e2e8f0',
      border: '#4a5568',
      inputBg: '#2d3748',
      inputBorder: '#4a5568',
      muted: '#a0aec0'
    };
  }
  return {
    bg: '#f8f9fa',
    card: '#ffffff',
    text: '#212529',
    headerBg: '#f8f9fa',
    headerText: '#212529',
    border: '#dee2e6',
    inputBg: '#ffffff',
    inputBorder: '#ced4da',
    muted: '#6c757d'
  };
};

/**
 * 增强选型表单
 * 完整的技术询单表单，支持复杂配置
 * @param {Object} props - 组件属性
 * @param {string} props.theme - 主题类型 ('light' | 'dark')
 * @param {Object} props.colors - 主题颜色配置 (可选，默认根据theme生成)
 */
const EnhancedSelectionForm = ({ theme = 'light', colors: propColors }) => {
  const colors = propColors || getThemeColors(theme);

  // 使用表单Hook
  const {
    formData,
    errors,
    isSubmitting,
    isDirty,
    updateField,
    updatePTO,
    updateClassification,
    toggleOutputRequirement,
    addAttachment,
    removeAttachment,
    validateForm,
    resetForm,
    saveDraft,
    getFormSummary,
    setIsSubmitting
  } = useEnhancedSelectionForm();

  // 预览模态框状态
  const [showPreview, setShowPreview] = useState(false);
  // 提交成功状态
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // 选型结果状态
  const [selectionResult, setSelectionResult] = useState(null);
  // 选型计算中状态
  const [isCalculating, setIsCalculating] = useState(false);

  // 处理选型计算
  const handleCalculateSelection = () => {
    const { enginePower, engineSpeed, ratio } = formData;

    // 验证必填参数
    if (!enginePower || !engineSpeed || !ratio) {
      alert('请先填写主机功率、主机转速和速比');
      return;
    }

    setIsCalculating(true);

    try {
      // 构建选型需求
      const requirements = {
        motorPower: parseFloat(enginePower),
        motorSpeed: parseFloat(engineSpeed),
        targetRatio: parseFloat(ratio),
        thrust: formData.thrust && formData.thrust !== '无要求' ? parseFloat(formData.thrust) : 0,
        ratioTolerance: 0.1, // 10% 速比容差
        marginLimit: 0.5,     // 50% 余量限制
        // 接口筛选选项
        interfaceType: formData.interfaceType || '无要求',
        interfaceSpec: formData.interfaceSpec || '',
        interfaceFilterMode: formData.interfaceFilterMode || 'prefer'
      };

      // 调用自动选型
      const result = autoSelectGearbox(requirements, initialData);

      // 如果PTO启用且有功率/转速，进行PTO离合器选型 (增强版)
      if (formData.pto?.enabled && formData.pto?.power && formData.pto?.speed) {
        const ptoRequirements = {
          power: parseFloat(formData.pto.power),
          speed: parseFloat(formData.pto.speed),
          application: formData.pto.application || 'other',
          temperature: parseFloat(formData.pto.temperature) || 30,
          workFactorMode: 'FACTORY'
        };

        // 获取主推进齿轮箱
        const mainGearbox = result.recommendations?.[0]?.gearbox || result.recommendations?.[0];
        if (mainGearbox) {
          // 选择PTO离合器 (增强版，含扭矩计算、工况系数、评分)
          const clutchRecommendations = selectPTOClutch(
            ptoRequirements,
            mainGearbox,
            initialData
          );
          // 将离合器推荐添加到结果
          result.ptoClutchRecommendations = clutchRecommendations;
          // 保存PTO计算参数供显示使用
          result.ptoCalculationParams = ptoRequirements;
        }
      }

      setSelectionResult(result);

      if (!result.success || result.recommendations.length === 0) {
        alert('未找到匹配的齿轮箱，请调整参数后重试');
      }
    } catch (error) {
      console.error('选型计算失败:', error);
      alert('选型计算失败: ' + error.message);
    } finally {
      setIsCalculating(false);
    }
  };

  // 处理预览
  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  // 提交成功后的询单ID
  const [submittedInquiryId, setSubmittedInquiryId] = useState(null);

  // 处理提交
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 准备提交数据
      const inquiryData = {
        // 客户信息
        customerName: formData.customerName,
        contactPerson: formData.contactPerson,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,

        // 项目信息
        projectName: formData.projectName,
        projectNumber: formData.projectNumber,
        shipyard: formData.shipyard,
        shipType: formData.shipType,

        // 主机参数
        engineModel: formData.engineModel,
        engineBrand: formData.engineBrand,
        enginePower: formData.enginePower,
        engineSpeed: formData.engineSpeed,
        flywheelSpec: formData.flywheelSpec,
        engineRotation: formData.engineRotation,
        ratio: formData.ratio,
        layoutType: formData.layoutType,

        // 船检要求
        classification: formData.classification,

        // PTO配置
        pto: formData.pto,

        // 技术要求
        thrust: formData.thrust,
        monitoringSystem: formData.monitoringSystem,
        controlMethod: formData.controlMethod,
        inputRotation: formData.inputRotation,

        // 质量要求
        qualityRequirements: formData.qualityRequirements,

        // 参考信息
        similarModels: formData.similarModels,
        specialConditions: formData.specialConditions,
        additionalNotes: formData.additionalNotes,

        // 输出需求
        outputRequirements: formData.outputRequirements,
        deadline: formData.deadline,

        // 选型结果
        selectionResult: selectionResult
      };

      // 调用API提交
      const result = await submitInquiry(inquiryData);

      console.log('询单提交成功:', result);
      setSubmittedInquiryId(result.inquiryId);
      setSubmitSuccess(true);
      setShowPreview(false);

      // 清除本地草稿
      localStorage.removeItem('enhancedSelectionFormDraft');

      // 10秒后清除成功提示
      setTimeout(() => setSubmitSuccess(false), 10000);
    } catch (error) {
      console.error('提交失败:', error);
      alert('提交失败: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理导出PDF - 完整选型报告
  const handleExportPDF = async () => {
    try {
      setIsSubmitting(true);

      // 动态加载jsPDF
      const jsPDF = await loadJsPDF();

      // 创建PDF文档
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // 尝试加载中文字体
      try {
        const fontResponse = await fetch('/fonts/NotoSansSC-Regular.ttf');
        if (fontResponse.ok) {
          const fontData = await fontResponse.arrayBuffer();
          const base64Font = btoa(
            new Uint8Array(fontData).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          doc.addFileToVFS('NotoSansSC-Regular.ttf', base64Font);
          doc.addFont('NotoSansSC-Regular.ttf', 'NotoSansSC', 'normal');
          doc.setFont('NotoSansSC', 'normal');
        }
      } catch (fontError) {
        console.warn('字体加载失败，使用默认字体');
      }

      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      // 判断是否有选型结果
      const hasSelectionResult = selectionResult && selectionResult.recommendations?.length > 0;

      // 标题
      doc.setFontSize(18);
      doc.text(hasSelectionResult ? '技术询单 - 完整选型报告' : '技术询单', pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;

      // 日期
      doc.setFontSize(10);
      doc.text(`生成日期: ${new Date().toLocaleDateString('zh-CN')}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;

      // ==================== 第一部分: 输入参数 ====================
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text('第一部分: 输入参数', 15, yPos);
      yPos += 3;
      doc.setDrawColor(0, 51, 102);
      doc.setLineWidth(0.5);
      doc.line(15, yPos, pageWidth - 15, yPos);
      yPos += 10;

      // 获取表单摘要
      const summary = getFormSummary();

      // 遍历每个分组
      summary.forEach((group) => {
        // 检查是否需要换页
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }

        // 分组标题
        doc.setFontSize(12);
        doc.setTextColor(0, 102, 204);
        doc.text(group.group, 15, yPos);
        yPos += 2;

        // 分隔线
        doc.setDrawColor(0, 102, 204);
        doc.setLineWidth(0.3);
        doc.line(15, yPos, pageWidth - 15, yPos);
        yPos += 8;

        // 分组内容
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        group.items.forEach((item) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }

          // 标签和值
          const label = `${item.label}:`;
          const value = item.value || '-';

          doc.setTextColor(100, 100, 100);
          doc.text(label, 20, yPos);
          doc.setTextColor(0, 0, 0);

          // 处理长文本换行
          const maxWidth = pageWidth - 90;
          const lines = doc.splitTextToSize(String(value), maxWidth);
          doc.text(lines, 70, yPos);

          yPos += 6 * Math.max(1, lines.length);
        });

        yPos += 8;
      });

      // ==================== 第二部分: 选型计算 (如果有结果) ====================
      if (hasSelectionResult) {
        // 新页面开始选型结果
        doc.addPage();
        yPos = 20;

        const power = parseFloat(formData.enginePower);
        const speed = parseFloat(formData.engineSpeed);
        const ratio = parseFloat(formData.ratio);
        const requiredCapacity = power / speed;

        doc.setFontSize(14);
        doc.setTextColor(0, 51, 102);
        doc.text('第二部分: 选型计算', 15, yPos);
        yPos += 3;
        doc.setDrawColor(0, 51, 102);
        doc.setLineWidth(0.5);
        doc.line(15, yPos, pageWidth - 15, yPos);
        yPos += 12;

        // 传递能力计算
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text('传递能力计算:', 15, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(`所需传递能力 = 主机功率 / 主机转速`, 20, yPos);
        yPos += 6;
        doc.text(`            = ${power} kW / ${speed} rpm`, 20, yPos);
        yPos += 6;
        doc.setTextColor(0, 102, 0);
        doc.text(`            = ${requiredCapacity.toFixed(4)} kW/(r/min)`, 20, yPos);
        yPos += 12;

        // 匹配条件
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text('匹配条件:', 15, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(`目标速比: ${ratio} (容差 ±10%)`, 20, yPos);
        yPos += 6;
        doc.text(`余量限制: ≤50%`, 20, yPos);
        yPos += 6;
        doc.text(`匹配结果: ${selectionResult.recommendations.length} 个型号`, 20, yPos);
        yPos += 15;

        // ==================== 第三部分: 推荐结果 ====================
        doc.setFontSize(14);
        doc.setTextColor(0, 51, 102);
        doc.text('第三部分: 推荐结果', 15, yPos);
        yPos += 3;
        doc.setDrawColor(0, 51, 102);
        doc.setLineWidth(0.5);
        doc.line(15, yPos, pageWidth - 15, yPos);
        yPos += 12;

        // 显示前5个推荐结果
        const topRecommendations = selectionResult.recommendations.slice(0, 5);

        topRecommendations.forEach((rec, index) => {
          if (yPos > 240) {
            doc.addPage();
            yPos = 20;
          }

          const gearbox = rec.gearbox || rec;
          const isFirst = index === 0;

          // 型号标题
          doc.setFontSize(11);
          if (isFirst) {
            doc.setTextColor(0, 128, 0);
            doc.text(`★ 推荐型号: ${gearbox.model}`, 15, yPos);
          } else {
            doc.setTextColor(0, 0, 0);
            doc.text(`备选型号${index}: ${gearbox.model}`, 15, yPos);
          }
          yPos += 7;

          // 型号详情
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          doc.text(`系列: ${gearbox.series || '-'}`, 25, yPos);
          yPos += 5;
          doc.text(`匹配速比: ${rec.matchedRatio || rec.ratio || '-'}`, 25, yPos);
          yPos += 5;

          // 传递能力
          const capacity = rec.actualCapacity || (gearbox.transmissionCapacityPerRatio && gearbox.transmissionCapacityPerRatio[0]) || '-';
          doc.text(`传递能力: ${typeof capacity === 'number' ? capacity.toFixed(4) : capacity} kW/(r/min)`, 25, yPos);
          yPos += 5;

          // 余量
          const margin = ((rec.capacityMargin || 0) * 100).toFixed(1);
          doc.text(`余量: ${margin}%`, 25, yPos);
          yPos += 5;

          // 价格
          if (gearbox.price) {
            doc.text(`参考价格: ¥${gearbox.price.toLocaleString()}`, 25, yPos);
            yPos += 5;
          }

          // 重量
          if (gearbox.weight) {
            doc.text(`重量: ${gearbox.weight} kg`, 25, yPos);
            yPos += 5;
          }

          yPos += 8;
        });

        // ==================== 第四部分: 技术参数对比表 ====================
        if (yPos > 200) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor(0, 51, 102);
        doc.text('第四部分: 技术参数对比', 15, yPos);
        yPos += 3;
        doc.setDrawColor(0, 51, 102);
        doc.setLineWidth(0.5);
        doc.line(15, yPos, pageWidth - 15, yPos);
        yPos += 10;

        // 构建表格数据
        const tableHead = [['型号', '系列', '速比', '传递能力', '余量', '重量', '价格']];
        const tableBody = topRecommendations.map((rec, index) => {
          const gearbox = rec.gearbox || rec;
          const capacity = rec.actualCapacity || (gearbox.transmissionCapacityPerRatio && gearbox.transmissionCapacityPerRatio[0]);
          return [
            (index === 0 ? '★ ' : '') + (gearbox.model || '-'),
            gearbox.series || '-',
            rec.matchedRatio || rec.ratio || '-',
            capacity ? capacity.toFixed(4) : '-',
            `${((rec.capacityMargin || 0) * 100).toFixed(1)}%`,
            gearbox.weight ? `${gearbox.weight}kg` : '-',
            gearbox.price ? `¥${gearbox.price.toLocaleString()}` : '-'
          ];
        });

        // 使用autoTable插件绘制表格
        if (doc.autoTable) {
          doc.autoTable({
            startY: yPos,
            head: tableHead,
            body: tableBody,
            theme: 'grid',
            headStyles: {
              fillColor: [0, 102, 204],
              textColor: [255, 255, 255],
              fontSize: 9
            },
            bodyStyles: {
              fontSize: 9
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245]
            },
            columnStyles: {
              0: { cellWidth: 30 },
              1: { cellWidth: 20 },
              2: { cellWidth: 20 },
              3: { cellWidth: 30 },
              4: { cellWidth: 20 },
              5: { cellWidth: 25 },
              6: { cellWidth: 30 }
            }
          });
        } else {
          // 如果没有autoTable插件，使用简单文本表格
          doc.setFontSize(9);
          doc.setTextColor(0, 0, 0);

          // 表头
          doc.setFillColor(0, 102, 204);
          doc.rect(15, yPos, pageWidth - 30, 8, 'F');
          doc.setTextColor(255, 255, 255);
          doc.text('型号', 17, yPos + 5);
          doc.text('系列', 47, yPos + 5);
          doc.text('速比', 67, yPos + 5);
          doc.text('传递能力', 87, yPos + 5);
          doc.text('余量', 117, yPos + 5);
          doc.text('重量', 137, yPos + 5);
          doc.text('价格', 162, yPos + 5);
          yPos += 10;

          // 表格内容
          doc.setTextColor(0, 0, 0);
          tableBody.forEach((row, rowIndex) => {
            if (rowIndex % 2 === 1) {
              doc.setFillColor(245, 245, 245);
              doc.rect(15, yPos - 4, pageWidth - 30, 7, 'F');
            }
            doc.text(row[0], 17, yPos);
            doc.text(row[1], 47, yPos);
            doc.text(String(row[2]), 67, yPos);
            doc.text(row[3], 87, yPos);
            doc.text(row[4], 117, yPos);
            doc.text(row[5], 137, yPos);
            doc.text(row[6], 162, yPos);
            yPos += 7;
          });
        }
      }

      // ==================== 第五部分: PTO离合器借用建议 (增强版) ====================
      if (selectionResult?.ptoClutchRecommendations?.length > 0) {
        // 检查是否需要新页
        if (yPos > 180) {
          doc.addPage();
          yPos = 20;
        } else {
          yPos += 15;
        }

        doc.setFontSize(14);
        doc.setTextColor(0, 51, 102);
        doc.text('第五部分: PTO离合器借用建议 (科学选型)', 15, yPos);
        yPos += 3;
        doc.setDrawColor(0, 51, 102);
        doc.setLineWidth(0.5);
        doc.line(15, yPos, pageWidth - 15, yPos);
        yPos += 10;

        // PTO应用类型映射
        const ptoAppLabels = {
          generator: '轴带发电机', hydraulicPump: '液压泵', firePump: '消防泵',
          bilgePump: '舱底泵', cargoPump: '货油泵', winch: '绞车/绞盘',
          compressor: '压缩机', other: '其他'
        };

        // PTO需求计算 (增强版)
        const ptoPower = parseFloat(formData.pto?.power || 0);
        const ptoSpeed = parseFloat(formData.pto?.speed || 1);
        const ptoCapacity = ptoPower / ptoSpeed;
        const ptoApp = formData.pto?.application || 'other';
        const ptoTemp = parseFloat(formData.pto?.temperature) || 30;
        const firstRec = selectionResult.ptoClutchRecommendations[0];

        doc.setFontSize(11);
        doc.setTextColor(0, 51, 102);
        doc.text('选型计算参数', 15, yPos);
        yPos += 7;

        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(`PTO功率: ${ptoPower} kW    PTO转速: ${ptoSpeed} rpm    应用类型: ${ptoAppLabels[ptoApp] || ptoApp}`, 15, yPos);
        yPos += 5;
        doc.text(`工作温度: ${ptoTemp}°C    所需传递能力: ${ptoCapacity.toFixed(4)} kW/(r/min)`, 15, yPos);
        yPos += 5;

        if (firstRec?.requiredTorque) {
          doc.text(`扭矩计算: T = 9550 × P / n × K × St`, 15, yPos);
          yPos += 5;
          doc.text(`所需离合器扭矩: ${firstRec.requiredTorque.toFixed(3)} kN·m (含工况系数)`, 15, yPos);
          yPos += 8;
        }

        // 离合器推荐列表 (增强版)
        doc.setFontSize(11);
        doc.setTextColor(0, 51, 102);
        doc.text('推荐离合器', 15, yPos);
        yPos += 8;

        const clutchRecommendations = selectionResult.ptoClutchRecommendations.slice(0, 3);
        clutchRecommendations.forEach((rec, index) => {
          const label = index === 0 ? '★ 推荐借用' : '   备选方案';
          const badges = [];
          if (rec.isSameSeries) badges.push('[同系列]');
          if (rec.marginQuality === 'optimal') badges.push('[最优余量]');
          if (rec.marginQuality === 'marginal') badges.push('[余量偏小]');

          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(`${label}: ${rec.model}离合器 ${badges.join(' ')}`, 15, yPos);
          yPos += 5;

          doc.setFontSize(9);
          doc.setTextColor(80, 80, 80);
          doc.text(`   系列: ${rec.series}    传递能力: ${rec.clutchCapacity?.toFixed(4) || '-'} kW/(r/min)`, 15, yPos);
          yPos += 5;

          if (rec.clutchTorque) {
            doc.text(`   离合器扭矩: ${rec.clutchTorque.toFixed(3)} kN·m    扭矩余量: ${((rec.torqueMargin || rec.margin) * 100).toFixed(1)}%    评分: ${rec.score}/100`, 15, yPos);
            yPos += 5;
          }

          if (rec.reasoning) {
            doc.setTextColor(100, 100, 100);
            doc.text(`   选型理由: ${rec.reasoning}`, 15, yPos);
            yPos += 5;
          }

          // 警告信息
          if (rec.warnings && rec.warnings.length > 0) {
            doc.setTextColor(200, 0, 0);
            rec.warnings.forEach(warning => {
              doc.text(`   ⚠ ${warning}`, 15, yPos);
              yPos += 5;
            });
          }

          doc.setTextColor(0, 0, 0);
          yPos += 3;
        });

        // 最终方案总结
        yPos += 3;
        doc.setFillColor(255, 248, 220);
        doc.rect(15, yPos - 4, pageWidth - 30, 14, 'F');
        doc.setFontSize(10);
        doc.setTextColor(0, 51, 102);
        const mainRec = selectionResult.recommendations?.[0];
        const mainModel = mainRec?.gearbox?.model || mainRec?.model || '-';
        const clutchModel = clutchRecommendations[0]?.model || '-';
        doc.text(`最终方案: ${mainModel} 基型 + ${clutchModel}离合器部件组合`, 20, yPos + 3);
        if (clutchRecommendations[0]?.score) {
          doc.text(`(综合评分: ${clutchRecommendations[0].score}/100)`, 20, yPos + 9);
        }
        yPos += 18;
      }

      // 页脚
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `第 ${i} 页 / 共 ${pageCount} 页`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      // 保存PDF
      const filename = hasSelectionResult
        ? `选型报告_${new Date().toISOString().slice(0, 10)}.pdf`
        : `技术询单_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);

    } catch (error) {
      console.error('PDF导出失败:', error);
      alert('PDF导出失败: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 表单摘要数据
  const formSummary = getFormSummary();

  return (
    <Container
      fluid
      className="py-4"
      style={{ backgroundColor: colors.bg, minHeight: '100vh' }}
    >
      <Container>
        {/* 页面标题 */}
        <Row className="mb-4">
          <Col>
            <h2 style={{ color: colors.text }}>
              技术询单
            </h2>
            <p style={{ color: colors.muted }}>
              填写详细参数，提交技术询单获取外形图、技术协议等文档
            </p>
          </Col>
        </Row>

        {/* 成功提示 */}
        {submitSuccess && (
          <Alert variant="success" dismissible onClose={() => setSubmitSuccess(false)}>
            <Alert.Heading>提交成功!</Alert.Heading>
            <p>
              您的技术询单已提交，我们将尽快处理并回复。
              {submittedInquiryId && (
                <strong className="d-block mt-2">询单编号: {submittedInquiryId}</strong>
              )}
            </p>
          </Alert>
        )}

        {/* 草稿提示 */}
        {isDirty && (
          <Alert variant="info" className="d-flex justify-content-between align-items-center">
            <span>表单已自动保存草稿</span>
            <Button variant="outline-info" size="sm" onClick={saveDraft}>
              手动保存
            </Button>
          </Alert>
        )}

        {/* 表单区块 */}
        <Row>
          <Col lg={8}>
            {/* 客户与项目信息 */}
            <CustomerInfoSection
              formData={formData}
              errors={errors}
              updateField={updateField}
              colors={colors}
              theme={theme}
            />

            {/* 主机信息 */}
            <EngineInfoSection
              formData={formData}
              errors={errors}
              updateField={updateField}
              colors={colors}
              theme={theme}
            />

            {/* 基本参数 */}
            <BasicParamsSection
              formData={formData}
              errors={errors}
              updateField={updateField}
              colors={colors}
              theme={theme}
            />

            {/* 船检要求 */}
            <ClassificationSection
              formData={formData}
              errors={errors}
              updateField={updateField}
              updateClassification={updateClassification}
              colors={colors}
              theme={theme}
            />

            {/* PTO配置 */}
            <PTOConfigSection
              formData={formData}
              errors={errors}
              updateField={updateField}
              updatePTO={updatePTO}
              colors={colors}
              theme={theme}
            />

            {/* 技术要求 */}
            <TechRequirementsSection
              formData={formData}
              updateField={updateField}
              colors={colors}
              theme={theme}
            />

            {/* 质量要求 */}
            <QualityRequirementsSection
              formData={formData}
              updateField={updateField}
              colors={colors}
              theme={theme}
            />

            {/* 参考信息 */}
            <ReferenceSection
              formData={formData}
              updateField={updateField}
              colors={colors}
              theme={theme}
            />

            {/* 输出需求 */}
            <OutputRequirementsSection
              formData={formData}
              errors={errors}
              updateField={updateField}
              toggleOutputRequirement={toggleOutputRequirement}
              addAttachment={addAttachment}
              removeAttachment={removeAttachment}
              colors={colors}
              theme={theme}
            />
          </Col>

          {/* 侧边栏 - 操作按钮 */}
          <Col lg={4}>
            <Card
              className="sticky-top"
              style={{
                top: '20px',
                backgroundColor: colors.card,
                borderColor: colors.border
              }}
            >
              <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
                <strong>操作</strong>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handlePreview}
                    disabled={isSubmitting}
                  >
                    预览并提交
                  </Button>

                  <Button
                    variant="outline-secondary"
                    onClick={handleExportPDF}
                    disabled={isSubmitting}
                  >
                    导出PDF
                  </Button>

                  <Button
                    variant="success"
                    onClick={handleCalculateSelection}
                    disabled={isSubmitting || isCalculating}
                  >
                    {isCalculating ? (
                      <>
                        <Spinner size="sm" animation="border" className="me-2" />
                        计算中...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-calculator me-1"></i>
                        计算选型
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      if (window.confirm('确定要重置表单吗？所有填写的数据将被清除。')) {
                        resetForm();
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    重置表单
                  </Button>
                </div>

                <hr />

                {/* 填写进度 */}
                <div style={{ color: colors.text }}>
                  <h6>填写进度</h6>
                  <ul style={{ paddingLeft: '20px', color: colors.muted }}>
                    <li style={{ color: formData.enginePower ? '#28a745' : colors.muted }}>
                      {formData.enginePower ? '✓' : '○'} 主机功率
                    </li>
                    <li style={{ color: formData.engineSpeed ? '#28a745' : colors.muted }}>
                      {formData.engineSpeed ? '✓' : '○'} 主机转速
                    </li>
                    <li style={{ color: formData.ratio ? '#28a745' : colors.muted }}>
                      {formData.ratio ? '✓' : '○'} 速比
                    </li>
                    <li style={{ color: formData.outputRequirements?.length > 0 ? '#28a745' : colors.muted }}>
                      {formData.outputRequirements?.length > 0 ? '✓' : '○'} 输出要求
                    </li>
                  </ul>
                </div>

                {/* 选型结果 */}
                {selectionResult && selectionResult.recommendations && selectionResult.recommendations.length > 0 && (
                  <>
                    <hr />
                    <div style={{ color: colors.text }}>
                      <h6>
                        <i className="bi bi-check-circle-fill text-success me-1"></i>
                        选型结果 ({selectionResult.recommendations.length}个)
                      </h6>
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {selectionResult.recommendations.slice(0, 5).map((rec, index) => (
                          <Card
                            key={index}
                            className="mb-2"
                            style={{
                              backgroundColor: index === 0 ? (theme === 'dark' ? '#2d4a3e' : '#d4edda') : colors.inputBg,
                              borderColor: index === 0 ? '#28a745' : colors.border,
                              fontSize: '0.85em'
                            }}
                          >
                            <Card.Body className="py-2 px-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <strong>{rec.gearbox?.model || rec.model}</strong>
                                {index === 0 && <Badge bg="success">推荐</Badge>}
                              </div>
                              <div style={{ color: colors.muted, fontSize: '0.9em' }}>
                                <div>系列: {rec.gearbox?.series || rec.series}</div>
                                <div>速比: {rec.matchedRatio || rec.ratio}</div>
                                <div>余量: {((rec.capacityMargin || 0) * 100).toFixed(1)}%</div>
                                {rec.gearbox?.price && (
                                  <div>参考价: ¥{rec.gearbox.price.toLocaleString()}</div>
                                )}
                              </div>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                      {selectionResult.recommendations.length > 5 && (
                        <div className="text-muted text-center" style={{ fontSize: '0.85em' }}>
                          还有 {selectionResult.recommendations.length - 5} 个结果...
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* PTO离合器借用建议 (增强版) */}
                {selectionResult?.ptoClutchRecommendations?.length > 0 && (
                  <>
                    <hr />
                    <div style={{ color: colors.text }}>
                      <h6>
                        <i className="bi bi-gear-fill text-warning me-1"></i>
                        PTO离合器借用建议
                        <Badge bg="secondary" className="ms-2" style={{ fontSize: '0.7em' }}>科学选型</Badge>
                      </h6>

                      {/* 计算参数显示 */}
                      <div className="mb-2 p-2" style={{
                        fontSize: '0.8em',
                        backgroundColor: theme === 'dark' ? '#1a202c' : '#f1f5f9',
                        borderRadius: '4px'
                      }}>
                        <div><strong>计算参数:</strong></div>
                        <div>PTO功率: {formData.pto?.power} kW, 转速: {formData.pto?.speed} rpm</div>
                        <div>所需传递能力: {(parseFloat(formData.pto?.power || 0) / parseFloat(formData.pto?.speed || 1)).toFixed(4)} kW/(r/min)</div>
                        {selectionResult.ptoClutchRecommendations[0]?.requiredTorque && (
                          <div>所需扭矩: {selectionResult.ptoClutchRecommendations[0].requiredTorque.toFixed(3)} kN·m (含K因子)</div>
                        )}
                      </div>

                      <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                        {selectionResult.ptoClutchRecommendations.slice(0, 3).map((rec, index) => (
                          <Card
                            key={index}
                            className="mb-2"
                            style={{
                              backgroundColor: index === 0 ? (theme === 'dark' ? '#4a3e2d' : '#fff3cd') : colors.inputBg,
                              borderColor: index === 0 ? '#ffc107' : colors.border,
                              fontSize: '0.85em'
                            }}
                          >
                            <Card.Body className="py-2 px-3">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <strong>借用: {rec.model}离合器</strong>
                                <div>
                                  {rec.isSameSeries && <Badge bg="info" className="me-1">同系列</Badge>}
                                  {rec.marginQuality === 'optimal' && <Badge bg="success" className="me-1">最优</Badge>}
                                  {rec.marginQuality === 'marginal' && <Badge bg="warning" text="dark" className="me-1">偏小</Badge>}
                                  {index === 0 && <Badge bg="warning" text="dark">推荐</Badge>}
                                </div>
                              </div>

                              {/* 评分条 */}
                              <div className="mb-1">
                                <div className="d-flex justify-content-between" style={{ fontSize: '0.8em' }}>
                                  <span>综合评分</span>
                                  <span>{rec.score}/100</span>
                                </div>
                                <div style={{
                                  height: '4px',
                                  backgroundColor: theme === 'dark' ? '#4a5568' : '#e2e8f0',
                                  borderRadius: '2px',
                                  overflow: 'hidden'
                                }}>
                                  <div style={{
                                    height: '100%',
                                    width: `${rec.score}%`,
                                    backgroundColor: rec.score >= 80 ? '#48bb78' : rec.score >= 60 ? '#ecc94b' : '#f56565',
                                    transition: 'width 0.3s'
                                  }}></div>
                                </div>
                              </div>

                              <div style={{ color: colors.muted, fontSize: '0.85em' }}>
                                <div className="d-flex justify-content-between">
                                  <span>系列: {rec.series}</span>
                                  <span>传递能力: {rec.clutchCapacity?.toFixed(4)} kW/(r/min)</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                  <span>离合器扭矩: {rec.clutchTorque?.toFixed(3)} kN·m</span>
                                  <span style={{ color: rec.torqueMargin >= 0.10 && rec.torqueMargin <= 0.30 ? '#48bb78' : rec.torqueMargin < 0.10 ? '#f56565' : '#ecc94b' }}>
                                    扭矩余量: {((rec.torqueMargin || rec.margin) * 100).toFixed(1)}%
                                  </span>
                                </div>
                                {rec.reasoning && (
                                  <div style={{ color: '#718096', fontStyle: 'italic', marginTop: '2px' }}>
                                    {rec.reasoning}
                                  </div>
                                )}
                              </div>

                              {/* 警告信息 */}
                              {rec.warnings && rec.warnings.length > 0 && (
                                <div className="mt-1" style={{ fontSize: '0.8em' }}>
                                  {rec.warnings.map((warning, wIdx) => (
                                    <div key={wIdx} style={{ color: '#e53e3e' }}>
                                      <i className="bi bi-exclamation-triangle me-1"></i>
                                      {warning}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </Card.Body>
                          </Card>
                        ))}
                      </div>

                      {/* 最终方案 */}
                      <div className="mt-2 p-2" style={{
                        backgroundColor: theme === 'dark' ? '#2d3748' : '#e9ecef',
                        borderRadius: '4px',
                        fontSize: '0.85em'
                      }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>最终方案:</strong>
                            <span className="ms-1">
                              {selectionResult.recommendations?.[0]?.gearbox?.model || selectionResult.recommendations?.[0]?.model} 基型 + {selectionResult.ptoClutchRecommendations[0]?.model}离合器
                            </span>
                          </div>
                          <Badge bg="success">组合方案</Badge>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* 预览模态框 */}
        <Modal
          show={showPreview}
          onHide={() => setShowPreview(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>询单预览</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {formSummary.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-4">
                <h6 className="border-bottom pb-2">{group.group}</h6>
                <Table size="sm" bordered>
                  <tbody>
                    {group.items.map((item, itemIndex) => (
                      <tr key={itemIndex}>
                        <td style={{ width: '40%', backgroundColor: '#f8f9fa' }}>
                          {item.label}
                        </td>
                        <td>{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPreview(false)}>
              返回修改
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  提交中...
                </>
              ) : (
                '确认提交'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Container>
  );
};

export default EnhancedSelectionForm;
