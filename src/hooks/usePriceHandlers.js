// src/hooks/usePriceHandlers.js
// 价格相关处理函数 Hook

import { useCallback } from 'react';
import { logger } from '../config/logging';
import { needsStandbyPump } from '../utils/enhancedPumpSelection';
import { getGWPackagePriceConfig, checkPackageMatch } from '../data/packagePriceConfig';
import {
  correctPriceData,
  calculateFactoryPrice,
  calculateMarketPrice,
  calculatePackagePrice,
  getStandardDiscountRate
} from '../utils/priceManager';

/**
 * 价格相关处理函数 Hook
 *
 * @param {Object} params - Hook 参数
 * @param {Object} params.appDataState - 应用数据状态
 * @param {Object} params.priceData - 价格数据
 * @param {Function} params.updateAppDataAndPersist - 更新并持久化应用数据
 * @param {Function} params.setSelectedComponents - 设置已选组件
 * @param {Function} params.setPriceData - 设置价格数据
 * @param {Function} params.setPackagePrice - 设置打包价格
 * @param {Function} params.setMarketPrice - 设置市场价格
 * @param {Function} params.setTotalMarketPrice - 设置总市场价格
 * @param {Function} params.setQuotation - 设置报价单
 * @param {Function} params.setAgreement - 设置技术协议
 * @param {Function} params.setContract - 设置销售合同
 * @param {Function} params.setLoading - 设置加载状态
 * @param {Function} params.setError - 设置错误信息
 * @param {Function} params.setSuccess - 设置成功信息
 * @param {Function} params.setShowBatchPriceAdjustment - 设置显示批量价格调整弹窗
 */
const usePriceHandlers = ({
  appDataState,
  priceData,
  updateAppDataAndPersist,
  setSelectedComponents,
  setPriceData,
  setPackagePrice,
  setMarketPrice,
  setTotalMarketPrice,
  setQuotation,
  setAgreement,
  setContract,
  setLoading,
  setError,
  setSuccess,
  setShowBatchPriceAdjustment
}) => {

  // 统一的价格计算函数
  const calculateAllPrices = useCallback((gearbox, coupling, pump, options = {}) => {
    // 默认选项
    const defaultOptions = {
      includePump: true
    };

    // 合并选项
    const finalOptions = { ...defaultOptions, ...options };

    // 检查是否需要备用泵
    const needsPumpFlag = gearbox ? needsStandbyPump(gearbox.model, {
      power: gearbox.power
    }) : false;

    // 最终决定是否包含泵
    const effectiveIncludePump = needsPumpFlag && finalOptions.includePump;

    // 创建要使用的泵对象（如果不包含泵则为null）
    const pumpToUse = effectiveIncludePump ? pump : null;

    // 检查是否有特殊打包价格
    let hasSpecialPackagePrice = false;
    let specialPackageConfig = null;
    let packagePrice = 0;
    let marketPrice = 0;
    let totalMarketPrice = 0;

    if (gearbox && gearbox.model) {
      const gwConfig = getGWPackagePriceConfig(gearbox.model);
      if (gwConfig && !gwConfig.isSmallGWModel) {
        // 检查组件组合是否符合打包价格条件
        if (checkPackageMatch(gearbox, coupling, pumpToUse, gwConfig)) {
          hasSpecialPackagePrice = true;
          specialPackageConfig = gwConfig;

          // 使用特殊打包价格
          packagePrice = gwConfig.packagePrice;
          marketPrice = gwConfig.packagePrice;
          totalMarketPrice = gwConfig.packagePrice;

          logger.log(`使用GW系列特殊打包价格: ${gwConfig.packagePrice}`);
        }
      }
    }

    // 如果没有特殊打包价格，则进行常规价格计算
    if (!hasSpecialPackagePrice) {
      // 计算打包价格
      packagePrice = calculatePackagePrice(gearbox, coupling, pumpToUse);

      // 计算市场价
      marketPrice = calculateMarketPrice(gearbox, packagePrice);

      // 计算总市场价格
      totalMarketPrice = (gearbox?.marketPrice || 0) +
                        (coupling?.marketPrice || 0) +
                        (pumpToUse?.marketPrice || 0);
    }

    // 返回完整的价格数据对象
    return {
      packagePrice,
      marketPrice,
      totalMarketPrice,
      gearbox: gearbox ? { ...gearbox } : null,
      coupling: coupling ? { ...coupling } : null,
      pump: pump ? { ...pump } : null,
      hasSpecialPackagePrice,
      specialPackageConfig,
      needsPump: needsPumpFlag,
      includePump: effectiveIncludePump
    };
  }, []);

  // 价格变更处理函数
  const handlePriceChange = useCallback((component, field, value) => {
    if (value === '') {
      setSelectedComponents(prev => ({
        ...prev,
        [component]: { ...prev[component], [field]: undefined }
      }));
      return;
    }

    const parsedValue = parseFloat(value);
    if (field === 'discountRate' && (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 100)) {
        logger.warn(`Invalid input for discountRate: ${value}`);
        return;
    } else if (field !== 'discountRate' && isNaN(parsedValue)) {
        logger.warn(`Invalid number input for ${field}: ${value}`);
        return;
    }

    logger.log(`价格变更: 组件=${component}, 字段=${field}, 值=${value} (parsed=${parsedValue})`);

    setSelectedComponents(prev => {
      if (!prev[component]) {
         logger.warn(`组件 ${component} 在selectedComponents中未找到`);
         return prev;
      }

      const updatedComponent = { ...prev[component] };

       if (field === 'discountRate') {
            updatedComponent[field] = parsedValue / 100;
       } else {
            updatedComponent[field] = parsedValue;
       }

      if (field === 'basePrice' || field === 'discountRate') {
         if (updatedComponent.basePrice !== undefined && updatedComponent.discountRate !== undefined) {
            updatedComponent.factoryPrice = calculateFactoryPrice(updatedComponent);
         } else {
             updatedComponent.factoryPrice = undefined;
         }
      }

      // 检查特殊打包价格
      if (component === 'gearbox' && (field === 'basePrice' || field === 'factoryPrice' || field === 'marketPrice')) {
        // 如果是修改齿轮箱价格，检查是否有特殊打包价格
        const gwConfig = getGWPackagePriceConfig(updatedComponent.model);
        if (gwConfig && !gwConfig.isSmallGWModel) {
          // 保留特殊打包价格标记
          updatedComponent.hasSpecialPackagePrice = true;
          updatedComponent.gwPackageConfig = gwConfig;
          // 但如果用户手动修改价格，提供覆盖选项
          if (field === 'marketPrice') {
            // 如果直接修改市场价，临时关闭特殊打包价格
            updatedComponent._userOverridePrice = true;
            logger.log(`用户手动修改市场价，临时覆盖特殊打包价格`);
          }
        }
      }

      const newComponents = { ...prev, [component]: updatedComponent };

      // 使用统一的价格计算函数更新价格
      const newPriceData = calculateAllPrices(
        newComponents.gearbox,
        newComponents.coupling,
        newComponents.pump,
        { includePump: priceData.includePump }
      );

      // 更新统一的价格状态
      setPriceData(newPriceData);

      // 保持对原有状态的更新，以便兼容性
      setPackagePrice(newPriceData.packagePrice);
      setMarketPrice(newPriceData.marketPrice);
      setTotalMarketPrice(newPriceData.totalMarketPrice);

      logger.log("价格变更后更新组件:", newComponents);
      return newComponents;
    });

    setQuotation(null);
    setAgreement(null);
    setContract(null);
  }, [calculateAllPrices, priceData.includePump, setSelectedComponents, setPriceData, setPackagePrice, setMarketPrice, setTotalMarketPrice, setQuotation, setAgreement, setContract]);

  // 批量价格调整处理函数
  const handleBatchPriceAdjustment = useCallback((adjustmentInfo) => {
    const { category, field, type, value, reason } = adjustmentInfo;

     if (!appDataState || Object.keys(appDataState).length === 0) {
      setError("应用数据未加载，无法进行批量调整。");
      return;
    }
    if (!field || !type || value === undefined || value === null) {
      setError("批量调整参数无效。");
      return;
    }
    let totalAdjustedCount = 0;
    setLoading(true);
    setError('正在应用批量价格调整...');

    updateAppDataAndPersist(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));

      const updateItemPrice = (item) => {
        if (!item || typeof item !== 'object') return false;
        if (!item.model) {
            logger.warn("Skipping item without model in batch update:", item);
            return false;
        }

        if (field !== 'discountRate' && (item[field] === undefined || item[field] === null || typeof item[field] !== 'number')) {
             if (field !== 'discountRate') return false;
        }

        let originalValue = item[field];
         if (field === 'discountRate' && (originalValue === undefined || originalValue === null)) {
             originalValue = getStandardDiscountRate(item.model);
         }


        let newValue = originalValue;
        let appliedAdjustment = false;

        try {
          const adjustmentValue = parseFloat(value);
          if (isNaN(adjustmentValue)) throw new Error("调整值不是数字");

          const method = type; // 定义局部变量method，值为type参数
          if (method === 'percentage') {
            if (field === 'discountRate') {
                 const currentRate = originalValue;
                 const adjustmentFactor = adjustmentValue / 100;
                 let newRate = currentRate + adjustmentFactor;
                 newRate = Math.max(0, Math.min(1, newRate));
                 newValue = parseFloat(newRate.toFixed(4));
            } else {
                const current = originalValue || 0;
                const factor = 1 + adjustmentValue / 100;
                newValue = current * factor;
                newValue = Math.max(0, parseFloat(newValue.toFixed(2)));
            }
          } else if (method === 'amount') {
            if (field === 'discountRate') {
                const currentRate = originalValue;
                 const adjustmentDecimal = adjustmentValue / 100;
                 let newRate = currentRate + adjustmentDecimal;
                 newRate = Math.max(0, Math.min(1, newRate));
                 newValue = parseFloat(newRate.toFixed(4));
            } else {
                const current = originalValue || 0;
                newValue = current + adjustmentValue;
                newValue = Math.max(0, parseFloat(newValue.toFixed(2)));
            }
          } else {
            throw new Error(`无效的调整类型: ${type}`);
          }

          if (newValue !== originalValue) {
             item[field] = newValue;
             appliedAdjustment = true;

             let itemNeedsRecalc = false;
             if (field === 'basePrice' || field === 'discountRate' || field === 'factoryPrice') {
                  itemNeedsRecalc = true;
             }

             if (itemNeedsRecalc) {
                  const correctedItem = correctPriceData(item);
                  item.basePrice = correctedItem.basePrice;
                  item.price = correctedItem.price;
                  item.discountRate = correctedItem.discountRate;
                  item.factoryPrice = correctedItem.factoryPrice;
                  item.packagePrice = correctedItem.packagePrice;
                  item.marketPrice = correctedItem.marketPrice;
             }
          }

        } catch (e) {
          logger.error(`批量调整价格失败，项目 ${item?.model}:`, e);
        }
        return appliedAdjustment;
      };

      const updateCategory = (catKey) => {
        if (newData[catKey] && Array.isArray(newData[catKey])) {
          let adjustedCountInCategory = 0;
          newData[catKey].forEach(item => {
            if (updateItemPrice(item)) {
              adjustedCountInCategory++;
            }
          });
          totalAdjustedCount += adjustedCountInCategory;
          logger.log(`类别 ${catKey}: ${adjustedCountInCategory} 项已更新。`);
        } else {
          logger.warn(`类别 ${catKey} 在数据中未找到或不是数组。`);
        }
      };

      const allCollections = ['hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 'hcqGearboxes', 'gcGearboxes', 'flexibleCouplings', 'standbyPumps'];
      const gearboxCollections = allCollections.filter(key => key.endsWith('Gearboxes'));
      const accessoryCollections = ['flexibleCouplings', 'standbyPumps'];


      if (category === 'all') {
        allCollections.forEach(updateCategory);
      } else if (category === 'allGearboxes') {
        gearboxCollections.forEach(updateCategory);
      } else if (category === 'allAccessories') {
         accessoryCollections.forEach(updateCategory);
      }
       else if (allCollections.includes(category) && newData[category]) {
        updateCategory(category);
      } else {
        logger.warn(`批量调整指定了无效的类别: ${category}`);
        setError(`无效的调整类别: ${category}`);
        return prevData;
      }

      logger.log(`批量调整已应用。共 ${totalAdjustedCount} 项已更新。`);

      return newData;
    });

    setSuccess(`批量价格调整已应用 (${totalAdjustedCount} 项已更新${reason ? '，原因: ' + reason : ''})。请在数据库管理界面保存更改。`);
    setError('');

    setLoading(false);
    setShowBatchPriceAdjustment(false);

    setQuotation(null);
    setAgreement(null);
    setContract(null);

  }, [appDataState, updateAppDataAndPersist, setLoading, setError, setSuccess, setShowBatchPriceAdjustment, setQuotation, setAgreement, setContract]);

  return {
    calculateAllPrices,
    handlePriceChange,
    handleBatchPriceAdjustment
  };
};

export default usePriceHandlers;
