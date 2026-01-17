// src/hooks/useExportHandlers.js
// 导出相关处理函数 Hook (技术协议和销售合同)

import { useCallback } from 'react';
import { logger } from '../config/logging';
import { generateContract, exportContractToWord } from '../utils/contractGenerator';
import { exportAgreementToWord, exportAgreementToPDFFormat } from '../utils/agreementGenerator';
import { optimizedHtmlToPdf } from '../utils/pdfExportUtils';

/**
 * 导出相关处理函数 Hook
 *
 * @param {Object} params - Hook 参数
 * @param {Object} params.selectedComponents - 已选组件
 * @param {Object} params.selectionResult - 选型结果
 * @param {Object} params.projectInfo - 项目信息
 * @param {Object} params.quotation - 当前报价单
 * @param {Object} params.agreement - 当前技术协议
 * @param {Object} params.contract - 当前销售合同
 * @param {Object} params.priceData - 价格数据
 * @param {string} params.agreementSpecialRequirements - 协议特殊要求
 * @param {Function} params.setSelectionResult - 设置选型结果
 * @param {Function} params.setContract - 设置销售合同
 * @param {Function} params.setLoading - 设置加载状态
 * @param {Function} params.setError - 设置错误信息
 * @param {Function} params.setSuccess - 设置成功信息
 * @param {Function} params.setActiveTab - 设置活动标签页
 */
const useExportHandlers = ({
  selectedComponents,
  selectionResult,
  projectInfo,
  quotation,
  agreement,
  contract,
  priceData,
  agreementSpecialRequirements,
  setSelectionResult,
  setContract,
  setLoading,
  setError,
  setSuccess,
  setActiveTab
}) => {

  // 生成技术协议 - 跳转到技术协议选项卡
  const handleGenerateAgreement = useCallback(() => {
    if (!selectedComponents.gearbox) {
      setError('请先完成选型，确保有选中的齿轮箱');
      return;
    }
    if (!selectionResult || !selectionResult.success) {
      setError('当前的选型结果无效，无法生成技术协议。');
      return;
    }

    // 确保selectionResult包含最新的价格信息
    if (selectionResult && !selectionResult.priceData) {
      setSelectionResult(prev => ({
        ...prev,
        priceData: { ...priceData }
      }));
    }

    setActiveTab('agreement');
    setSuccess('请在技术协议选项卡中选择所需的协议模板和配置');
  }, [selectedComponents, selectionResult, priceData, setActiveTab, setError, setSuccess, setSelectionResult]);

  // 导出技术协议
  const handleExportAgreement = useCallback(async (format) => {
    if (!agreement) {
      setError('请先生成技术协议');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(`正在导出技术协议为 ${format.toUpperCase()}...`);
    try {
      const filename = `${projectInfo.projectName || '未命名项目'}-技术协议`;
      if (format === 'word') {
        exportAgreementToWord(agreement, filename);
        setSuccess('技术协议已导出为Word格式');
      } else if (format === 'pdf') {
        const previewElement = document.querySelector('.agreement-preview-content');

        if (previewElement) {
          await optimizedHtmlToPdf(previewElement, {
            filename: `${filename}.pdf`,
            orientation: 'portrait',
            format: 'a4',
            scale: 2,
            fontSize: '14px',
            lineHeight: '1.5'
          });
          setSuccess('技术协议已导出为PDF格式');
        } else {
          await exportAgreementToPDFFormat(agreement, filename);
          setSuccess('技术协议已导出为PDF格式');
        }
      } else if (format === 'copy') {
        const contentToCopy = agreement?.details || JSON.stringify(agreement, null, 2);
        navigator.clipboard.writeText(contentToCopy)
          .then(() => setSuccess('技术协议内容已复制到剪贴板'))
          .catch(err => {
            logger.error("复制失败:", err);
            setError('复制技术协议失败: ' + err.message);
          })
          .finally(() => setLoading(false));
        return;
      } else {
        setError('不支持的导出格式');
      }
    } catch (error) {
      logger.error("导出技术协议错误:", error);
      setError('导出技术协议失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [agreement, projectInfo.projectName, setLoading, setError, setSuccess]);

  // 生成销售合同
  const handleGenerateContract = useCallback(() => {
    if (!selectedComponents.gearbox) {
      setError('请先完成选型，确保有选中的齿轮箱');
      return;
    }
    if (!quotation) {
      setError('请先生成报价单，合同需要报价信息');
      setActiveTab('quotation');
      return;
    }
    if (!selectionResult || !selectionResult.success) {
      setError('当前的选型结果无效，无法生成合同。');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('正在生成销售合同...');

    try {
      const contractPackagePrice = quotation.summary?.packagePrice;
      const contractMarketPrice = quotation.summary?.marketPrice;
      const contractTotalMarketPrice = quotation.summary?.totalMarketPrice;

      const contractData = generateContract(
        selectionResult,
        projectInfo,
        selectedComponents,
        {
          packagePrice: contractPackagePrice,
          marketPrice: contractMarketPrice,
          totalMarketPrice: contractTotalMarketPrice,
          quotationDetails: quotation,
          needsPump: quotation.options?.needsPump,
          includePump: quotation.options?.includePump,
          hasSpecialPackagePrice: quotation.usingSpecialPackagePrice,
          specialPackageConfig: quotation.specialPackageConfig,
          specialRequirements: agreementSpecialRequirements
        }
      );

      setContract(contractData);
      setActiveTab('contract');
      setSuccess('销售合同生成成功');
    } catch (error) {
      logger.error("生成销售合同错误:", error);
      setError('生成销售合同失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [selectedComponents, selectionResult, projectInfo, quotation, setActiveTab, agreementSpecialRequirements, setLoading, setError, setSuccess, setContract]);

  // 导出销售合同
  const handleExportContract = useCallback(async (format) => {
    if (!contract) {
      setError('请先生成销售合同');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(`正在导出销售合同为 ${format.toUpperCase()}...`);

    try {
      const filename = `${projectInfo.projectName || '未命名项目'}-销售合同`;

      if (format === 'word') {
        exportContractToWord(contract, filename);
        setSuccess('销售合同已导出为Word格式');
        setLoading(false);
      } else if (format === 'pdf') {
        const previewElement = document.querySelector('.contract-preview-content');

        if (previewElement) {
          setTimeout(async () => {
            try {
              await optimizedHtmlToPdf(previewElement, {
                filename: `${filename}.pdf`,
                orientation: 'portrait',
                format: 'a4',
                scale: 2,
                fontSize: '14px',
                lineHeight: '1.5',
                useCORS: true,
                allowTaint: true,
                logging: true
              });
              setSuccess('销售合同已导出为PDF格式');
            } catch (pdfError) {
              logger.error("PDF导出详细错误:", pdfError);
              setError('PDF导出失败: ' + pdfError.message);
            }
            setLoading(false);
          }, 800);
        } else {
          setError('无法找到合同预览内容，请确保合同正确生成');
          setLoading(false);
        }
      } else {
        setError('不支持的导出格式');
        setLoading(false);
      }
    } catch (error) {
      logger.error("导出销售合同错误:", error);
      setError('导出销售合同失败: ' + error.message);
      setLoading(false);
    }
  }, [contract, projectInfo.projectName, setLoading, setError, setSuccess]);

  return {
    handleGenerateAgreement,
    handleExportAgreement,
    handleGenerateContract,
    handleExportContract
  };
};

export default useExportHandlers;
