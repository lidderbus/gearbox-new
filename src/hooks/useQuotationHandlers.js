// src/hooks/useQuotationHandlers.js
// 报价单相关处理函数 Hook

import { useCallback } from 'react';
import { logger } from '../config/logging';
import { correctPriceData } from '../utils/priceManager';
import {
  generateQuotation,
  exportQuotationToExcel,
  exportQuotationToPDF,
  addCustomItemToQuotation,
  removeItemFromQuotation,
  numberToChinese
} from '../utils/quotationGenerator';
import {
  saveQuotation,
  loadSavedQuotation,
  compareQuotations
} from '../utils/quotationManager';
import { optimizedHtmlToPdf } from '../utils/pdfExportUtils';
import { getGWPackagePriceConfig } from '../data/packagePriceConfig';
import { needsStandbyPump } from '../utils/enhancedPumpSelection';

/**
 * 报价单相关处理函数 Hook
 *
 * @param {Object} params - Hook 参数
 * @param {Object} params.selectedComponents - 已选组件
 * @param {Object} params.selectionResult - 选型结果
 * @param {Object} params.projectInfo - 项目信息
 * @param {Object} params.quotation - 当前报价单
 * @param {Function} params.setQuotation - 设置报价单
 * @param {Function} params.setProjectInfo - 设置项目信息
 * @param {Function} params.setPriceData - 设置价格数据
 * @param {Function} params.setLoading - 设置加载状态
 * @param {Function} params.setError - 设置错误信息
 * @param {Function} params.setSuccess - 设置成功信息
 * @param {Function} params.setActiveTab - 设置活动标签页
 * @param {Function} params.setShowQuotationOptions - 设置显示报价选项弹窗
 * @param {Function} params.setComparisonResult - 设置比较结果
 * @param {Function} params.setShowComparisonModal - 设置显示比较弹窗
 * @param {Function} params.calculateAllPrices - 计算所有价格函数
 */
const useQuotationHandlers = ({
  selectedComponents,
  selectionResult,
  projectInfo,
  quotation,
  setQuotation,
  setProjectInfo,
  setPriceData,
  setLoading,
  setError,
  setSuccess,
  setActiveTab,
  setShowQuotationOptions,
  setComparisonResult,
  setShowComparisonModal,
  calculateAllPrices
}) => {

  // 显示报价选项对话框
  const handleGenerateQuotation = useCallback(() => {
    if (!selectedComponents.gearbox) {
      setError('请先完成选型，确保有选中的齿轮箱');
      setActiveTab('input');
      return;
    }
    if (!selectionResult || !selectionResult.success) {
      setError('当前的选型结果无效，无法生成报价单。');
      return;
    }
    setShowQuotationOptions(true);
  }, [selectedComponents, selectionResult, setActiveTab, setError, setShowQuotationOptions]);

  // 根据选项生成报价单
  const generateQuotationWithOptions = useCallback((options = {}) => {
    setLoading(true);
    setError('');
    setSuccess('正在生成报价单...');

    try {
      const finalComponents = {
        gearbox: selectedComponents.gearbox ? correctPriceData(selectedComponents.gearbox) : null,
        coupling: selectedComponents.coupling ? correctPriceData(selectedComponents.coupling) : null,
        pump: selectedComponents.pump ? correctPriceData(selectedComponents.pump) : null,
      };

      const quotationPriceData = calculateAllPrices(
        finalComponents.gearbox,
        finalComponents.coupling,
        finalComponents.pump,
        { includePump: options.includePump }
      );

      if (quotationPriceData.hasSpecialPackagePrice) {
        options.showCouplingPrice = false;
        options.showPumpPrice = false;
        logger.log("使用GW系列特殊打包价格，不显示联轴器和泵的单独价格");
      }

      logger.log("准备生成报价单，组件:", {
        gearbox: finalComponents.gearbox?.model,
        coupling: finalComponents.coupling?.model,
        pump: finalComponents.pump?.model,
        hasSpecialPackagePrice: quotationPriceData.hasSpecialPackagePrice,
        needsPump: quotationPriceData.needsPump,
        includePump: quotationPriceData.includePump,
        options
      });

      const quotationData = generateQuotation(
        selectionResult,
        projectInfo,
        finalComponents,
        {
          packagePrice: quotationPriceData.packagePrice,
          marketPrice: quotationPriceData.marketPrice,
          totalMarketPrice: quotationPriceData.totalMarketPrice,
          componentPrices: {
            gearbox: finalComponents.gearbox ? {
              factoryPrice: finalComponents.gearbox.factoryPrice,
              marketPrice: finalComponents.gearbox.marketPrice,
              basePrice: finalComponents.gearbox.basePrice || finalComponents.gearbox.price,
              packagePrice: finalComponents.gearbox.packagePrice
            } : null,
            coupling: finalComponents.coupling ? {
              factoryPrice: finalComponents.coupling.factoryPrice,
              marketPrice: finalComponents.coupling.marketPrice,
              basePrice: finalComponents.coupling.basePrice || finalComponents.coupling.price
            } : null,
            pump: finalComponents.pump ? {
              factoryPrice: finalComponents.pump.factoryPrice,
              marketPrice: finalComponents.pump.marketPrice,
              basePrice: finalComponents.pump.basePrice || finalComponents.pump.price
            } : null
          },
          needsPump: quotationPriceData.needsPump,
          includePump: quotationPriceData.includePump,
          hasSpecialPackagePrice: quotationPriceData.hasSpecialPackagePrice,
          specialPackageConfig: quotationPriceData.specialPackageConfig
        },
        options
      );

      setPriceData({
        ...quotationPriceData,
        includePump: options.includePump
      });

      setQuotation(quotationData);
      setActiveTab('quotation');
      setError('');
      setSuccess('报价单生成成功');

    } catch (error) {
      logger.error("生成报价单错误:", error);
      setError('生成报价单失败: ' + error.message);
    } finally {
      setLoading(false);
      setShowQuotationOptions(false);
    }
  }, [selectedComponents, selectionResult, projectInfo, setActiveTab, calculateAllPrices, setLoading, setError, setSuccess, setQuotation, setPriceData, setShowQuotationOptions]);

  // 添加自定义报价项目
  const handleAddCustomQuotationItem = useCallback((itemData) => {
    if (!quotation || !quotation.success) {
      setError('请先生成基本报价单');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updatedQuotation = addCustomItemToQuotation(quotation, itemData);
      setQuotation(updatedQuotation);
      setSuccess(`已添加自定义项目: ${itemData.name}`);
    } catch (error) {
      logger.error("添加自定义项目错误:", error);
      setError('添加自定义项目失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [quotation, setLoading, setError, setSuccess, setQuotation]);

  // 移除报价项目
  const handleRemoveQuotationItem = useCallback((itemId) => {
    if (!quotation || !quotation.success || !Array.isArray(quotation.items)) {
      return;
    }

    if (window.confirm("确定要从报价单中移除此项目?")) {
      setLoading(true);

      try {
        const updatedQuotation = removeItemFromQuotation(quotation, itemId);
        setQuotation(updatedQuotation);
        setSuccess('已从报价单移除项目');
      } catch (error) {
        logger.error("移除项目错误:", error);
        setError('移除项目失败: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  }, [quotation, setLoading, setError, setSuccess, setQuotation]);

  // 保存报价单
  const handleSaveQuotation = useCallback((name) => {
    if (!quotation || !quotation.success) {
      setError('请先生成报价单');
      return;
    }

    try {
      const success = saveQuotation(quotation, name, projectInfo);

      if (success) {
        setSuccess(`报价单已保存${name ? ': ' + name : ''}`);
      } else {
        setError('保存报价单失败');
      }
    } catch (error) {
      logger.error("保存报价单错误:", error);
      setError('保存报价单失败: ' + error.message);
    }
  }, [projectInfo, quotation, setError, setSuccess]);

  // 加载保存的报价单
  const handleLoadSavedQuotation = useCallback((quotationId) => {
    try {
      const savedQuotation = loadSavedQuotation(quotationId);

      if (!savedQuotation || !savedQuotation.data) {
        setError('找不到指定的保存报价单');
        return;
      }

      setQuotation(savedQuotation.data);

      if (savedQuotation.projectInfo) {
        setProjectInfo(prev => ({
          ...prev,
          projectName: savedQuotation.projectInfo.projectName || prev.projectName,
          customerName: savedQuotation.projectInfo.customerName || prev.customerName
        }));
      }

      setSuccess(`已加载保存的报价单: ${savedQuotation.name || savedQuotation.id}`);
      setActiveTab('quotation');
    } catch (error) {
      logger.error("加载保存报价单错误:", error);
      setError('加载保存报价单失败: ' + error.message);
    }
  }, [setActiveTab, setProjectInfo, setError, setSuccess, setQuotation]);

  // 比较报价单
  const handleCompareQuotations = useCallback((quotationA, quotationB) => {
    if (!quotationA || !quotationB) {
      setError('请选择两个需要比较的报价单');
      return;
    }

    try {
      const comparisonData = compareQuotations(quotationA, quotationB);

      if (!comparisonData) {
        setError('比较报价单失败：无法生成比较数据');
        return;
      }

      setComparisonResult(comparisonData);
      setShowComparisonModal(true);
    } catch (error) {
      logger.error("比较报价单错误:", error);
      setError('比较报价单失败: ' + error.message);
    }
  }, [setError, setComparisonResult, setShowComparisonModal]);

  // 更新报价单价格
  const handleUpdateQuotationPrices = useCallback(() => {
    if (!quotation || !quotation.success) {
      setError('请先生成报价单');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('正在更新报价单价格...');

    try {
      const updatedQuotation = {
        ...quotation,
        items: [...quotation.items]
      };

      let totalAmount = 0;
      let usingSpecialPackagePrice = false;
      let specialPackagePrice = 0;

      const needsPump = selectedComponents.gearbox && needsStandbyPump(
        selectedComponents.gearbox.model,
        { power: selectedComponents.gearbox.power }
      );

      const includePump = updatedQuotation.options?.includePump !== undefined ?
                         updatedQuotation.options.includePump :
                         needsPump;

      if (!needsPump || !includePump) {
        const pumpIndex = updatedQuotation.items.findIndex(item => item.name === "备用泵");
        if (pumpIndex >= 0) {
          updatedQuotation.items.splice(pumpIndex, 1);
        }
      }

      updatedQuotation.items.forEach(item => {
        if (item.name === "船用齿轮箱" && selectedComponents.gearbox) {
          const gearbox = selectedComponents.gearbox;
          const gwConfig = getGWPackagePriceConfig(gearbox.model);
          const hasSpecialPackagePrice = gwConfig && !gwConfig.isSmallGWModel;

          if (hasSpecialPackagePrice) {
            item.prices.market = gwConfig.packagePrice;
            item.prices.factory = gwConfig.packagePrice * 0.85;
            item.prices.package = gwConfig.packagePrice;
            item.hasSpecialPackagePrice = true;
            item.gwPackageConfig = gwConfig;
            usingSpecialPackagePrice = true;
            specialPackagePrice = gwConfig.packagePrice;
          } else {
            let marketPrice = gearbox.marketPrice || gearbox.factoryPrice * 1.15;
            let factoryPrice = gearbox.factoryPrice || marketPrice * 0.85;

            // 检查是否需要将配件价格包含在齿轮箱价格中
            let includedAccessoriesPrice = 0;

            // 检查联轴器是否包含在齿轮箱价格中
            if (updatedQuotation.options?.includeCouplingInGearbox && selectedComponents.coupling) {
              const couplingPrice = selectedComponents.coupling.marketPrice ||
                                   selectedComponents.coupling.factoryPrice * 1.15 || 0;
              includedAccessoriesPrice += couplingPrice;
              console.log("更新价格: 联轴器价格包含在齿轮箱中:", couplingPrice);
            }

            // 检查备用泵是否包含在齿轮箱价格中
            if (updatedQuotation.options?.includePumpInGearbox &&
                updatedQuotation.options?.needsPump &&
                selectedComponents.pump) {
              const pumpPrice = selectedComponents.pump.marketPrice ||
                               selectedComponents.pump.factoryPrice * 1.15 || 0;
              includedAccessoriesPrice += pumpPrice;
              console.log("更新价格: 备用泵价格包含在齿轮箱中:", pumpPrice);
            }

            // 将配件价格加到齿轮箱价格中
            if (includedAccessoriesPrice > 0) {
              marketPrice += includedAccessoriesPrice;
              factoryPrice += includedAccessoriesPrice * 0.88; // 估算工厂价
              console.log("更新价格: 齿轮箱含配件总价:", marketPrice);
            }

            item.prices.market = marketPrice;
            item.prices.factory = factoryPrice;
            item.prices.package = factoryPrice;
          }
        }

        if (item.name === "高弹性联轴器" && selectedComponents.coupling) {
          const coupling = selectedComponents.coupling;
          const marketPrice = coupling.marketPrice || coupling.factoryPrice * 1.15;
          item.prices.market = marketPrice;
          item.prices.factory = coupling.factoryPrice || marketPrice * 0.85;
          item.prices.package = coupling.factoryPrice || marketPrice * 0.85;
        }

        if (item.name === "备用泵" && selectedComponents.pump && needsPump && includePump) {
          const pump = selectedComponents.pump;
          const marketPrice = pump.marketPrice || pump.factoryPrice * 1.15;
          item.prices.market = marketPrice;
          item.prices.factory = pump.factoryPrice || marketPrice * 0.85;
          item.prices.package = pump.factoryPrice || marketPrice * 0.85;
        }
      });

      if (usingSpecialPackagePrice) {
        totalAmount = specialPackagePrice;
        updatedQuotation.usingSpecialPackagePrice = true;
        updatedQuotation.specialPackageConfig = updatedQuotation.items.find(
          item => item.name === "船用齿轮箱" && item.hasSpecialPackagePrice
        )?.gwPackageConfig;
      } else {
        totalAmount = updatedQuotation.items.reduce((sum, item) => sum + item.amount, 0);
      }

      updatedQuotation.totalAmount = totalAmount;
      updatedQuotation.originalAmount = totalAmount;

      if (updatedQuotation.discountPercentage > 0) {
        updatedQuotation.discountAmount = Math.round(updatedQuotation.originalAmount * (updatedQuotation.discountPercentage / 100));
        updatedQuotation.totalAmount = updatedQuotation.originalAmount - updatedQuotation.discountAmount;
      }

      updatedQuotation.totalAmountInChinese = numberToChinese(updatedQuotation.totalAmount);

      setQuotation(updatedQuotation);
      setSuccess('报价单价格已更新');
    } catch (error) {
      logger.error("更新报价单价格错误:", error);
      setError('更新报价单价格失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [quotation, selectedComponents, setLoading, setError, setSuccess, setQuotation]);

  // 导出报价单
  const handleExportQuotation = useCallback(async (format) => {
    if (!quotation) {
      setError('请先生成报价单');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(`正在导出报价单为 ${format.toUpperCase()}...`);

    try {
      const filename = `${projectInfo.projectName || '未命名项目'}-报价单`;

      if (format === 'excel') {
        try {
          await exportQuotationToExcel(quotation, filename);
          setSuccess('报价单已成功导出为Excel格式');
        } catch (excelError) {
          logger.error("Excel导出错误:", excelError);
          setError('Excel导出失败: ' + excelError.message);
        }
      } else if (format === 'pdf') {
        try {
          const previewElement = document.querySelector('.quotation-preview-content');

          if (previewElement) {
            await optimizedHtmlToPdf(previewElement, {
              filename: `${filename}.pdf`,
              orientation: 'portrait',
              format: 'a4',
              scale: 2
            });
            setSuccess('报价单已成功导出为PDF格式');
          } else {
            await exportQuotationToPDF(quotation, filename);
            setSuccess('报价单已成功导出为PDF格式');
          }
        } catch (pdfError) {
          logger.error("PDF导出错误:", pdfError);
          setError('PDF导出失败: ' + pdfError.message);
        }
      } else {
        setError('不支持的导出格式: ' + format);
      }
    } catch (error) {
      logger.error("导出报价单错误:", error);
      setError('导出报价单失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [quotation, projectInfo.projectName, setLoading, setError, setSuccess]);

  return {
    handleGenerateQuotation,
    generateQuotationWithOptions,
    handleAddCustomQuotationItem,
    handleRemoveQuotationItem,
    handleSaveQuotation,
    handleLoadSavedQuotation,
    handleCompareQuotations,
    handleUpdateQuotationPrices,
    handleExportQuotation
  };
};

export default useQuotationHandlers;
