// src/components/BatchSelectionView.js
// 批量选型功能组件 - 支持多个选型需求的批量处理

import React, { useState, useCallback, useMemo } from 'react';
import { Card, Button, Table, Form, Row, Col, Badge, Spinner, Alert, Modal, ProgressBar } from 'react-bootstrap';
import { autoSelectGearbox } from '../utils/selectionAlgorithm';
import { inferPropellerType } from '../utils/copilotRules';
import { saveSelectionToHistory } from '../utils/selectionHistory';
import { initialData } from '../data/initialData';
import { formatPrice } from '../utils/priceCalculator';
import ExportToolbar from './ExportToolbar';
import EquipmentInfoCard from './EquipmentInfoCard';

/**
 * 默认选型需求模板
 */
const DEFAULT_REQUIREMENT = {
  id: '',
  name: '',
  motorPower: '',
  motorSpeed: '',
  targetRatio: '',
  thrust: '',
  application: 'propulsion',
  workCondition: 'III类:扭矩变化中等',
  temperature: '30',
  safetyFactor: '1.2',
  notes: '',
  // 单行可选: 船型 (用于桨型自动推断, 留空则不推断)
  shipType: ''
};

/**
 * 全局 Copilot 硬约束默认值 (应用到全部需求行, 默认全关)
 */
const DEFAULT_COPILOT_OPTIONS = {
  twinEngine: false,
  gearType: '',
  strictThrust: false,
  strictClassification: false,
  classification: 'CCS',
  enableInferPropeller: false
};

/**
 * 工作条件选项
 */
const WORK_CONDITIONS = [
  'I类:扭矩变化很小',
  'II类:扭矩变化小',
  'III类:扭矩变化中等',
  'IV类:扭矩变化大',
  'V类:扭矩变化很大'
];

/**
 * 批量选型视图组件
 */
const BatchSelectionView = ({ onSelectionComplete, colors, theme }) => {
  // 状态管理
  const [requirements, setRequirements] = useState([
    { ...DEFAULT_REQUIREMENT, id: Date.now().toString() }
  ]);
  const [results, setResults] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [error, setError] = useState(null);
  // Copilot 全局硬约束 (应用到全部需求行)
  const [copilotOptions, setCopilotOptions] = useState({ ...DEFAULT_COPILOT_OPTIONS });
  const [showCopilotPanel, setShowCopilotPanel] = useState(false);

  /**
   * 生成唯一ID
   */
  const generateId = useCallback(() => {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  /**
   * 添加新的选型需求
   */
  const addRequirement = useCallback(() => {
    setRequirements(prev => [
      ...prev,
      { ...DEFAULT_REQUIREMENT, id: generateId(), name: `需求 ${prev.length + 1}` }
    ]);
  }, [generateId]);

  /**
   * 删除选型需求
   */
  const removeRequirement = useCallback((id) => {
    setRequirements(prev => prev.filter(r => r.id !== id));
    setResults(prev => prev.filter(r => r.requirementId !== id));
  }, []);

  /**
   * 更新选型需求
   */
  const updateRequirement = useCallback((id, field, value) => {
    setRequirements(prev => prev.map(r =>
      r.id === id ? { ...r, [field]: value } : r
    ));
  }, []);

  /**
   * 复制选型需求
   */
  const duplicateRequirement = useCallback((requirement) => {
    const newReq = {
      ...requirement,
      id: generateId(),
      name: `${requirement.name} (副本)`
    };
    setRequirements(prev => [...prev, newReq]);
  }, [generateId]);

  /**
   * 执行单个选型
   */
  const performSingleSelection = useCallback(async (requirement) => {
    const power = parseFloat(requirement.motorPower) || 0;
    const thrustNum = parseFloat(requirement.thrust) || 0;
    // Copilot 桨型自动推断 (仅 enableInferPropeller=true 且 row 填了 shipType 时触发)
    const inferredPropeller = copilotOptions.enableInferPropeller && requirement.shipType
      ? inferPropellerType([requirement.shipType], power)
      : null;
    const numericReq = {
      ...requirement,
      motorPower: power,
      motorSpeed: parseFloat(requirement.motorSpeed) || 0,
      targetRatio: parseFloat(requirement.targetRatio) || 0,
      thrust: thrustNum,
      temperature: parseFloat(requirement.temperature) || 30,
      safetyFactor: parseFloat(requirement.safetyFactor) || 1.2,
      // Copilot 全局硬约束 (从 copilotOptions 透传, 默认全关 → 不影响老 batch)
      twinEngine: !!copilotOptions.twinEngine,
      gearType: copilotOptions.gearType || null,
      minThrust: copilotOptions.strictThrust && thrustNum > 0 ? thrustNum : 0,
      classification: copilotOptions.strictClassification && copilotOptions.classification
        ? copilotOptions.classification : undefined,
      seriesRequirements: inferredPropeller
        ? { propellerType: inferredPropeller }
        : requirement.seriesRequirements
    };

    try {
      const result = await autoSelectGearbox(numericReq, initialData);
      // autoSelectGearbox 返回 { success, recommendations, flexibleCoupling, standbyPump, ... }
      const top3 = (result.recommendations || []).slice(0, 3).map(rec => ({
        model: rec.model,
        ratio: rec.selectedRatio || rec.ratio,
        capacityMargin: rec.capacityMargin,
        price: rec.marketPrice || rec.price || 0
      }));
      const bestGearbox = top3[0] || null;
      return {
        requirementId: requirement.id,
        requirementName: requirement.name || '未命名',
        input: numericReq,
        success: result.success,
        top3,
        gearbox: bestGearbox ? { model: bestGearbox.model, price: bestGearbox.price } : null,
        coupling: result.flexibleCoupling ? {
          model: result.flexibleCoupling.model,
          price: result.flexibleCoupling.price,
          torque: result.flexibleCoupling.torque,
          torqueUnit: result.flexibleCoupling.torqueUnit,
          torqueMargin: result.flexibleCoupling.torqueMargin,
          requiredTorque: result.flexibleCoupling.requiredTorque,
          maxSpeed: result.flexibleCoupling.maxSpeed,
          weight: result.flexibleCoupling.weight,
          marketPrice: result.flexibleCoupling.marketPrice,
          matchType: result.flexibleCoupling.matchType
        } : null,
        pump: result.standbyPump ? {
          model: result.standbyPump.model,
          price: result.standbyPump.price,
          flow: result.standbyPump.flow,
          pressure: result.standbyPump.pressure,
          motorPower: result.standbyPump.motorPower,
          weight: result.standbyPump.weight,
          marketPrice: result.standbyPump.marketPrice,
          matchType: result.standbyPump.matchType,
          type: result.standbyPump.type,
          series: result.standbyPump.series
        } : null,
        totalPrice: (bestGearbox?.price || 0) + (result.flexibleCoupling?.price || 0) + (result.standbyPump?.price || 0),
        message: result.message,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        requirementId: requirement.id,
        requirementName: requirement.name || '未命名',
        input: numericReq,
        success: false,
        top3: [],
        result: null,
        message: err.message,
        timestamp: new Date().toISOString()
      };
    }
  }, [copilotOptions]);

  /**
   * 执行批量选型
   */
  const performBatchSelection = useCallback(async () => {
    // 验证输入
    const validRequirements = requirements.filter(r =>
      r.motorPower && r.motorSpeed && r.targetRatio
    );

    if (validRequirements.length === 0) {
      setError('请至少填写一个完整的选型需求（功率、转速、速比）');
      return;
    }

    setProcessing(true);
    setError(null);
    setResults([]);
    setCurrentIndex(0);

    const batchResults = [];

    for (let i = 0; i < validRequirements.length; i++) {
      setCurrentIndex(i);
      const result = await performSingleSelection(validRequirements[i]);
      batchResults.push(result);
      setResults([...batchResults]);

      // 添加小延迟以显示进度
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setProcessing(false);

    // 保存成功的选型到历史
    const successfulResults = batchResults.filter(r => r.success);
    successfulResults.forEach(result => {
      if (result.result) {
        saveSelectionToHistory(
          result.result,
          {
            projectName: result.requirementName || `批量选型 ${new Date().toLocaleString()}`,
            customerName: '',
            projectNumber: '',
            contactPerson: '',
            contactPhone: '',
            contactEmail: '',
            engineModel: '',
            selectionType: 'batch'
          },
          {
            gearbox: result.result.gearbox,
            coupling: result.result.coupling,
            pump: result.result.pump
          },
          {
            power: result.input.motorPower,
            speed: result.input.motorSpeed
          },
          result.input
        );
      }
    });

    // 回调通知
    if (onSelectionComplete) {
      onSelectionComplete(batchResults);
    }
  }, [requirements, performSingleSelection, onSelectionComplete]);

  /**
   * 从文本导入需求
   * 格式: 名称,功率,转速,速比 (每行一个)
   */
  const handleImport = useCallback(() => {
    try {
      const lines = importText.trim().split('\n');
      const imported = lines.map((line, index) => {
        const parts = line.split(/[,\t]/);
        return {
          id: generateId(),
          name: parts[0]?.trim() || `导入需求 ${index + 1}`,
          motorPower: parts[1]?.trim() || '',
          motorSpeed: parts[2]?.trim() || '',
          targetRatio: parts[3]?.trim() || '',
          thrust: parts[4]?.trim() || '',
          application: 'propulsion',
          workCondition: 'III类:扭矩变化中等',
          temperature: '30',
          safetyFactor: '1.2',
          notes: parts[5]?.trim() || ''
        };
      });

      setRequirements(prev => [...prev, ...imported]);
      setShowImportModal(false);
      setImportText('');
    } catch (err) {
      setError('导入格式错误，请检查数据格式');
    }
  }, [importText, generateId]);

  /**
   * 导出结果为CSV
   */
  const exportResults = useCallback(() => {
    if (results.length === 0) return;

    const headers = ['需求名称', '功率(kW)', '转速(rpm)', '速比', '状态', '推荐齿轮箱', '推荐联轴器', '推荐备用泵', '总价格'];
    const rows = results.map(r => [
      r.requirementName,
      r.input.motorPower,
      r.input.motorSpeed,
      r.input.targetRatio,
      r.success ? '成功' : '失败',
      r.gearbox?.model || '-',
      r.coupling?.model || '-',
      r.pump?.model || '-',
      r.totalPrice || '-'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `批量选型结果_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [results]);

  /**
   * 导出结果为XLSX (2 sheets)
   */
  const exportXLSX = useCallback(async () => {
    if (results.length === 0) return;

    try {
      const { loadXLSX } = await import('../utils/dynamicImports');
      const XLSX = await loadXLSX();
      const wb = XLSX.utils.book_new();

      // Sheet 1: 选型结果
      const sheetHeaders = [
        '序号', '需求名称', '功率(kW)', '转速(rpm)', '速比', '推力(kN)',
        '推荐型号1', '速比1', '余量1(%)', '价格1',
        '推荐型号2', '速比2', '余量2(%)', '价格2',
        '推荐型号3', '速比3', '余量3(%)', '价格3',
        '联轴器', '备用泵'
      ];
      const sheetRows = results.map((r, idx) => {
        const row = [
          idx + 1,
          r.requirementName,
          r.input.motorPower,
          r.input.motorSpeed,
          r.input.targetRatio,
          r.input.thrust || '-'
        ];
        for (let i = 0; i < 3; i++) {
          const rec = r.top3?.[i];
          if (rec) {
            row.push(rec.model, rec.ratio?.toFixed(2) || '-', rec.capacityMargin?.toFixed(1) || '-', rec.price || '-');
          } else {
            row.push('-', '-', '-', '-');
          }
        }
        row.push(r.coupling?.model || '-', r.pump?.model || '-');
        return row;
      });
      const ws1 = XLSX.utils.aoa_to_sheet([sheetHeaders, ...sheetRows]);
      ws1['!cols'] = sheetHeaders.map((h) => ({ wch: h.length < 6 ? 10 : 14 }));
      XLSX.utils.book_append_sheet(wb, ws1, '选型结果');

      // Sheet 2: 汇总统计
      const successCount = results.filter(r => r.success).length;
      const failCount = results.length - successCount;
      const allModels = new Set();
      let totalEstimate = 0;
      results.forEach(r => {
        if (r.success && r.top3?.[0]) {
          allModels.add(r.top3[0].model);
          totalEstimate += r.totalPrice || 0;
        }
      });
      const summaryData = [
        ['汇总统计', ''],
        ['总需求数', results.length],
        ['成功数', successCount],
        ['失败数', failCount],
        ['成功率', `${results.length > 0 ? ((successCount / results.length) * 100).toFixed(1) : 0}%`],
        ['涉及型号数', allModels.size],
        ['总预估金额', totalEstimate > 0 ? `¥${totalEstimate.toLocaleString()}` : '-']
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(summaryData);
      ws2['!cols'] = [{ wch: 14 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, ws2, '汇总统计');

      XLSX.writeFile(wb, `批量选型结果_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error('XLSX导出失败:', err);
      setError('Excel导出失败: ' + err.message);
    }
  }, [results]);

  /**
   * ExportToolbar getData callback
   */
  const getExportData = useCallback(() => {
    if (results.length === 0) return null;
    const headers = ['需求名称', '功率(kW)', '转速(rpm)', '速比', '状态', '推荐齿轮箱', '推荐联轴器', '推荐备用泵', '总价格'];
    const rows = results.map(r => [
      r.requirementName,
      r.input.motorPower,
      r.input.motorSpeed,
      r.input.targetRatio,
      r.success ? '成功' : '失败',
      r.gearbox?.model || '-',
      r.coupling?.model || '-',
      r.pump?.model || '-',
      r.totalPrice || '-',
    ]);
    return {
      filename: `批量选型结果_${new Date().toISOString().slice(0, 10)}`,
      title: '批量选型结果',
      headers,
      rows,
    };
  }, [results]);

  /**
   * 统计信息
   */
  const stats = useMemo(() => {
    const total = results.length;
    const successful = results.filter(r => r.success).length;
    const failed = total - successful;
    // 统计推荐频次最高的型号 (取首选推荐)
    const modelCount = {};
    results.forEach(r => {
      if (r.success && r.top3?.[0]?.model) {
        const m = r.top3[0].model;
        modelCount[m] = (modelCount[m] || 0) + 1;
      }
    });
    const topModels = Object.entries(modelCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([model, count]) => ({ model, count }));
    return { total, successful, failed, topModels };
  }, [results]);

  /**
   * 进度百分比
   */
  const progress = useMemo(() => {
    if (!processing || requirements.length === 0) return 0;
    return Math.round((currentIndex + 1) / requirements.filter(r =>
      r.motorPower && r.motorSpeed && r.targetRatio
    ).length * 100);
  }, [processing, currentIndex, requirements]);

  return (
    <div className="batch-selection-view" style={{ backgroundColor: colors?.bg }}>
      <Card className="mb-4" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
        <Card.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: colors?.headerBg, color: colors?.headerText, borderBottomColor: colors?.border }}>
          <h5 className="mb-0" style={{ color: colors?.headerText }}>批量选型</h5>
          <div>
            <Button
              variant="outline-success"
              size="sm"
              className="me-2"
              onClick={() => {
                const csv = '需求名称,功率(kW),转速(rpm),目标速比,推力(kN,可选),工况类别(I~V)\n主推进1,350,1800,4.5,80,III\n主推进2,250,1500,3.5,,II\n辅机,100,1200,2.5,,I';
                const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = '批量选型导入模板.csv'; a.click();
                URL.revokeObjectURL(url);
              }}
              title="下载 CSV 模板, Excel/Numbers 可编辑后批量导入"
            >
              <i className="bi bi-download me-1"></i>下载模板
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              className="me-2"
              onClick={() => setShowImportModal(true)}
            >
              导入数据
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={addRequirement}
            >
              + 添加需求
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* v62: 空状态使用引导 - 仅 1 行且全部字段为空时提示 */}
          {requirements.length === 1 && !requirements[0].motorPower && !requirements[0].motorSpeed && !requirements[0].name && (
            <Alert variant="info" className="mb-3 py-2">
              <i className="bi bi-lightbulb me-2"></i>
              <strong>使用提示</strong>: 直接在下方第 1 行填入功率/转速/速比开始; 或点右上 <kbd>下载模板</kbd> 取 CSV 编辑后用 <kbd>导入数据</kbd> 批量上传; 输入 1 条后可点 📋 复制为新行。
            </Alert>
          )}

          {/* Copilot 全局硬约束面板 (应用到全部需求行) */}
          <Card className="mb-3" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
            <Card.Header
              className="py-2 d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer', backgroundColor: colors?.headerBg, color: colors?.headerText }}
              onClick={() => setShowCopilotPanel(v => !v)}
            >
              <div>
                <i className="bi bi-stars me-2"></i>
                <strong>Copilot 高级硬筛</strong> <small className="text-muted">应用到全部需求行</small>
                {(copilotOptions.twinEngine || copilotOptions.gearType || copilotOptions.strictThrust || copilotOptions.strictClassification || copilotOptions.enableInferPropeller) && (
                  <Badge bg="info" className="ms-2" style={{ fontSize: '0.7em' }}>已启用</Badge>
                )}
              </div>
              <i className={`bi bi-chevron-${showCopilotPanel ? 'up' : 'down'}`}></i>
            </Card.Header>
            {showCopilotPanel && (
              <Card.Body className="py-2" style={{ color: colors?.text }}>
                <Row className="g-2">
                  <Col xs={12} md={6} lg={3}>
                    <Form.Check
                      type="switch"
                      id="batch-twin-engine"
                      label="双机并车 (仅 2GWH)"
                      checked={copilotOptions.twinEngine}
                      onChange={(e) => setCopilotOptions(o => ({ ...o, twinEngine: e.target.checked }))}
                    />
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <Form.Label className="small mb-1">齿轮形式</Form.Label>
                    <Form.Select
                      size="sm"
                      value={copilotOptions.gearType}
                      onChange={(e) => setCopilotOptions(o => ({ ...o, gearType: e.target.value }))}
                    >
                      <option value="">默认 (不限)</option>
                      <option value="双速">双速 (DT)</option>
                      <option value="高速">高速 (HCG/HCAG/HCQ/HCM/HCAM/HCV/HCVG)</option>
                    </Form.Select>
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <Form.Check
                      type="switch"
                      id="batch-strict-thrust"
                      label="推力下限硬筛 (按行 thrust)"
                      checked={copilotOptions.strictThrust}
                      onChange={(e) => setCopilotOptions(o => ({ ...o, strictThrust: e.target.checked }))}
                    />
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <Form.Check
                      type="switch"
                      id="batch-infer-prop"
                      label="桨型自动推断 (需行内 shipType)"
                      checked={copilotOptions.enableInferPropeller}
                      onChange={(e) => setCopilotOptions(o => ({ ...o, enableInferPropeller: e.target.checked }))}
                    />
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <Form.Check
                      type="switch"
                      id="batch-strict-class"
                      label="船级社硬筛"
                      checked={copilotOptions.strictClassification}
                      onChange={(e) => setCopilotOptions(o => ({ ...o, strictClassification: e.target.checked }))}
                    />
                  </Col>
                  {copilotOptions.strictClassification && (
                    <Col xs={12} md={6} lg={3}>
                      <Form.Label className="small mb-1">船级社</Form.Label>
                      <Form.Select
                        size="sm"
                        value={copilotOptions.classification}
                        onChange={(e) => setCopilotOptions(o => ({ ...o, classification: e.target.value }))}
                      >
                        <option value="CCS">CCS</option>
                        <option value="DNV">DNV</option>
                        <option value="BV">BV</option>
                        <option value="LR">LR</option>
                        <option value="ABS">ABS</option>
                      </Form.Select>
                    </Col>
                  )}
                </Row>
                <div className="text-muted mt-2" style={{ fontSize: '0.78em' }}>
                  注: 默认全部关闭, 不影响老批量。开启后所有需求行受同等硬约束。
                </div>
              </Card.Body>
            )}
          </Card>

          {/* 需求列表 */}
          <div className="requirements-list mb-4">
            {requirements.map((req, index) => (
              <Card key={req.id} className="mb-2" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
                <Card.Body className="py-2" style={{ color: colors?.text }}>
                  <Row className="align-items-center">
                    <Col xs={12} md={2}>
                      <Form.Control
                        size="sm"
                        placeholder="例: 主推进1"
                        value={req.name}
                        onChange={(e) => updateRequirement(req.id, 'name', e.target.value)}
                      />
                    </Col>
                    <Col xs={6} md={2}>
                      <Form.Control
                        size="sm"
                        type="number"
                        placeholder="功率 350 kW"
                        value={req.motorPower}
                        onChange={(e) => updateRequirement(req.id, 'motorPower', e.target.value)}
                      />
                    </Col>
                    <Col xs={6} md={2}>
                      <Form.Control
                        size="sm"
                        type="number"
                        placeholder="转速 1800 rpm"
                        value={req.motorSpeed}
                        onChange={(e) => updateRequirement(req.id, 'motorSpeed', e.target.value)}
                      />
                    </Col>
                    <Col xs={6} md={2}>
                      <Form.Control
                        size="sm"
                        type="number"
                        placeholder="速比 4.5"
                        value={req.targetRatio}
                        onChange={(e) => updateRequirement(req.id, 'targetRatio', e.target.value)}
                      />
                    </Col>
                    <Col xs={6} md={2}>
                      <Form.Select
                        size="sm"
                        value={req.workCondition}
                        onChange={(e) => updateRequirement(req.id, 'workCondition', e.target.value)}
                      >
                        {WORK_CONDITIONS.map(wc => (
                          <option key={wc} value={wc}>{wc.split(':')[0]}</option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col xs={12} md={2} className="text-end">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-1"
                        onClick={() => duplicateRequirement(req)}
                        title="复制"
                      >
                        📋
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeRequirement(req.id)}
                        disabled={requirements.length === 1}
                        title="删除"
                      >
                        ×
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* 执行按钮 */}
          <div className="d-flex justify-content-center mb-4">
            <Button
              variant="success"
              size="lg"
              onClick={performBatchSelection}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  处理中...
                </>
              ) : (
                `开始批量选型 (${requirements.filter(r => r.motorPower && r.motorSpeed && r.targetRatio).length} 项)`
              )}
            </Button>
          </div>

          {/* 进度条 */}
          {processing && (
            <ProgressBar
              now={progress}
              label={`${progress}%`}
              className="mb-4"
              animated
            />
          )}

          {/* 结果统计 & 汇总 */}
          {results.length > 0 && (
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <Badge bg="primary" className="me-2">总计: {stats.total}</Badge>
                  <Badge bg="success" className="me-2">成功: {stats.successful}</Badge>
                  <Badge bg="danger" className="me-2">失败: {stats.failed}</Badge>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <ExportToolbar getData={getExportData} disabled={results.length === 0} showPrint={true} />
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={exportXLSX}
                    title="自定义双Sheet Excel导出"
                  >
                    <i className="bi bi-file-earmark-spreadsheet me-1"></i>高级Excel
                  </Button>
                </div>
              </div>
              {/* 汇总信息区 */}
              <Row className="mb-3">
                <Col md={6}>
                  <div className="small mb-1" style={{ color: colors?.text }}>
                    选型成功率: {stats.total > 0 ? ((stats.successful / stats.total) * 100).toFixed(0) : 0}%
                  </div>
                  <ProgressBar style={{ height: '8px' }}>
                    <ProgressBar variant="success" now={stats.total > 0 ? (stats.successful / stats.total) * 100 : 0} key={1} />
                    <ProgressBar variant="danger" now={stats.total > 0 ? (stats.failed / stats.total) * 100 : 0} key={2} />
                  </ProgressBar>
                </Col>
                <Col md={6}>
                  {stats.topModels.length > 0 && (
                    <div className="small" style={{ color: colors?.text }}>
                      <span style={{ fontWeight: 600 }}>推荐频次最高型号: </span>
                      {stats.topModels.map((item, i) => (
                        <Badge key={item.model} bg="light" text="dark" className="me-1" style={{ fontSize: '0.75rem' }}>
                          {item.model} x{item.count}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Col>
              </Row>
            </div>
          )}

          {/* 结果表格 */}
          {results.length > 0 && (
            <Table responsive striped bordered hover size="sm" style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
              <thead>
                <tr>
                  <th>需求名称</th>
                  <th>功率</th>
                  <th>转速</th>
                  <th>速比</th>
                  <th>状态</th>
                  <th>推荐齿轮箱 (Top 3)</th>
                  <th>联轴器</th>
                  <th>备用泵</th>
                  <th>价格</th>
                </tr>
              </thead>
              <tbody>
                {results.map(result => (
                  <tr key={result.requirementId}>
                    <td>{result.requirementName}</td>
                    <td>{result.input.motorPower} kW</td>
                    <td>{result.input.motorSpeed} rpm</td>
                    <td>{result.input.targetRatio}</td>
                    <td>
                      <Badge bg={result.success ? 'success' : 'danger'}>
                        {result.success ? '成功' : '失败'}
                      </Badge>
                    </td>
                    <td>
                      {result.top3?.length > 0 ? (
                        <div>
                          {/* 首选推荐 - 突出显示 */}
                          <div style={{ fontWeight: 600 }}>
                            {result.top3[0].model}
                            <span className="text-muted ms-1" style={{ fontSize: '0.8em' }}>
                              i={result.top3[0].ratio?.toFixed(2)} | {result.top3[0].capacityMargin?.toFixed(1)}%
                            </span>
                          </div>
                          {/* 备选推荐 */}
                          {result.top3.slice(1).map((alt, i) => (
                            <div key={i} style={{ fontSize: '0.78em', color: '#888', lineHeight: 1.4 }}>
                              {i === 0 ? '2.' : '3.'} {alt.model}
                              <span className="ms-1">
                                i={alt.ratio?.toFixed(2)} | {alt.capacityMargin?.toFixed(1)}% | {alt.price ? formatPrice(alt.price) : '询价'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : '-'}
                    </td>
                    <td style={{ minWidth: 160 }}>
                      {result.coupling ? (
                        <EquipmentInfoCard type="coupling" data={result.coupling} compact />
                      ) : '-'}
                    </td>
                    <td style={{ minWidth: 160 }}>
                      {result.pump ? (
                        <EquipmentInfoCard type="pump" data={result.pump} compact />
                      ) : '-'}
                    </td>
                    <td>
                      {result.totalPrice
                        ? formatPrice(result.totalPrice)
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* 导入模态框 */}
      <Modal show={showImportModal} onHide={() => setShowImportModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
          <Modal.Title>导入选型需求</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: colors?.card, color: colors?.text }}>
          <p className="text-muted small">
            格式: 名称,功率(kW),转速(rpm),速比,推力(可选),备注(可选)
            <br />
            每行一个需求，使用逗号或制表符分隔
          </p>
          <Button size="sm" variant="outline-info" className="mb-2" onClick={() => {
            const tpl = '名称,功率(kW),转速(rpm),目标速比,推力(kN),备注\n主推进1,350,1800,4.5,,散货船\n主推进2,250,1500,3.5,,渔船\n辅机,100,1200,2.5,,\n';
            const blob = new Blob(['\uFEFF' + tpl], {type: 'text/csv;charset=utf-8'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = '批量选型导入模板.csv'; a.click();
            URL.revokeObjectURL(url);
          }}><i className="bi bi-download me-1"></i>下载导入模板 (CSV)</Button>
          <Form.Control
            as="textarea"
            rows={10}
            placeholder={`示例:\n主推进1,350,1800,4.5\n主推进2,250,1500,3.5\n辅机,100,1200,2.5`}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: colors?.card, borderTopColor: colors?.border }}>
          <Button variant="secondary" onClick={() => setShowImportModal(false)}>
            取消
          </Button>
          <Button variant="primary" onClick={handleImport}>
            导入
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BatchSelectionView;
