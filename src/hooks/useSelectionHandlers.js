// src/hooks/useSelectionHandlers.js
// 选型相关处理函数 Hook

import { useCallback } from 'react';
import { logger } from '../config/logging';
import { correctPriceData } from '../utils/priceManager';
import { getGWPackagePriceConfig } from '../data/packagePriceConfig';
import { enhancedSelectPump, needsStandbyPump } from '../utils/enhancedPumpSelection';
import enhancedCouplingSelection from '../utils/enhancedCouplingSelection';
import { selectGearbox, autoSelectGearbox } from '../utils/selectionAlgorithm';

/**
 * 选型相关处理函数 Hook
 *
 * @param {Object} params - Hook 参数
 */
const useSelectionHandlers = ({
  selectionResult,
  appDataState,
  engineData,
  requirementData,
  gearboxType,
  hybridConfig,
  selectedComponents,
  priceData,
  projectInfo,
  isFormValid,
  getEffectiveConfig,
  calculateAllPrices,
  setSelectionResult,
  setSelectedGearboxIndex,
  setSelectedComponents,
  setSelectionHistory,
  setSelectionDiagnostics,
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
  setActiveTab
}) => {

  // 处理齿轮箱选择
  const handleGearboxSelection = useCallback((index, resultOverride = null) => {
    // 使用传入的 result 或状态中的 selectionResult
    const result = resultOverride || selectionResult;

    // 首先进行更完善的验证
    if (!result) {
      logger.error("Cannot select gearbox, selection result is null or undefined");
      setError("无法选择齿轮箱，请先进行选型。");
      return;
    }

    if (!Array.isArray(result.recommendations)) {
      logger.error("Cannot select gearbox, recommendations is not an array:", result);
      setError("无法选择齿轮箱，选型结果格式错误。");
      return;
    }

    if (index < 0 || index >= result.recommendations.length) {
      logger.error(`Cannot select gearbox, index ${index} out of range (0-${result.recommendations.length - 1})`);
      setError(`无法选择齿轮箱，索引 ${index} 超出范围。`);
      return;
    }

    // 确认可以选择齿轮箱
    setSelectedGearboxIndex(index);
    const selectedGearbox = { ...result.recommendations[index] };
    logger.log(`User selected gearbox at index ${index}:`, selectedGearbox.model);

    // 如果是部分匹配的齿轮箱，显示警告
    if (selectedGearbox.isPartialMatch) {
      setSuccess(''); // 清除成功消息
      setError(`注意: 选择的齿轮箱 ${selectedGearbox.model} 是部分匹配结果，${selectedGearbox.failureReason || '不完全满足所有要求'}`);
    } else {
      setError(''); // 清除错误消息
    }

    // 修正价格和其他数据
    const correctedGearbox = correctPriceData(selectedGearbox);

    // 检查是否有特殊打包价格配置
    const gwConfig = getGWPackagePriceConfig(correctedGearbox.model);
    if (gwConfig && !gwConfig.isSmallGWModel) {
      // 标记为特殊打包价格型号
      correctedGearbox.hasSpecialPackagePrice = true;
      correctedGearbox.gwPackageConfig = gwConfig;
      correctedGearbox.packagePrice = gwConfig.packagePrice;
      // 对于特殊打包价格，市场价等于打包价
      correctedGearbox.marketPrice = gwConfig.packagePrice;

      logger.log(`选中的齿轮箱适用GW系列特殊打包价格: ${correctedGearbox.model}, 价格: ${gwConfig.packagePrice}`);
    }

    // 确保engineTorque存在，否则使用计算值
    const engineTorque = result.engineTorque ||
                       (parseFloat(engineData.power) * 9550 / parseFloat(engineData.speed));

    // 确保appDataState包含必要的数据
    if (!appDataState || !Array.isArray(appDataState.flexibleCouplings) || !Array.isArray(appDataState.standbyPumps)) {
      setError("数据加载不完整，无法选择配件。");
      logger.error("Missing data for coupling/pump selection:", appDataState);

      // 即使缺少配件数据，也设置齿轮箱
      setSelectedComponents(prev => ({
        ...prev,
        gearbox: correctedGearbox
      }));

      // 使用统一的价格计算函数
      const newPriceData = calculateAllPrices(
        correctedGearbox,
        null,
        null,
        { includePump: true }
      );

      // 更新统一的价格状态
      setPriceData(newPriceData);

      // 保持对原有状态的更新，以便兼容性
      setPackagePrice(newPriceData.packagePrice);
      setMarketPrice(newPriceData.marketPrice);
      setTotalMarketPrice(newPriceData.totalMarketPrice);

      setActiveTab('result');
      return;
    }

    // 使用增强型联轴器选型功能
    let updatedCouplingResult;

    try {
      // 如果不是首选齿轮箱(index=0)，或者没有预先计算好的联轴器，则重新选择
      if (index !== 0 || !selectionResult || !selectionResult.flexibleCoupling) {
        // 使用增强型联轴器选型
        updatedCouplingResult = enhancedCouplingSelection(
          {
            ...(selectionResult || {}),
            recommendations: [correctedGearbox],  // 使用当前选中的齿轮箱
            engineTorque,
            engineSpeed: parseFloat(engineData.speed)
          },
          appDataState.flexibleCouplings,
          {
            workCondition: requirementData.workCondition,
            temperature: parseFloat(requirementData.temperature) || 30,
            hasCover: requirementData.hasCover
          }
        );
      } else {
        // 使用原有选型结果中的联轴器
        updatedCouplingResult = selectionResult.flexibleCoupling;
      }
    } catch (error) {
      logger.error("联轴器选择失败:", error);
      updatedCouplingResult = { success: false, message: "联轴器选择过程中出错: " + error.message };
    }

    // 获取或重新选择备用泵
    let updatedPumpResult;
    const pumpOptions = { power: correctedGearbox.power };

    try {
      // 使用增强版备用泵选型函数
      updatedPumpResult = enhancedSelectPump(
        correctedGearbox.model,
        appDataState.standbyPumps,
        pumpOptions
      );

      // 如果返回的结果表示不需要备用泵，需要进行特殊处理
      if (updatedPumpResult && !updatedPumpResult.requiresPump) {
        logger.log(`齿轮箱 ${correctedGearbox.model} 不需要配备备用泵`);
        // 在界面上可以显示不需要备用泵的提示
      }
    } catch (error) {
      logger.error("备用泵选择失败:", error);
      updatedPumpResult = {
        success: false,
        message: "备用泵选择过程中出错: " + error.message,
        requiresPump: needsStandbyPump(correctedGearbox.model, pumpOptions)
      };
    }

    const currentCoupling = updatedCouplingResult?.success ? correctPriceData({ ...updatedCouplingResult }) : null;
    const currentPump = updatedPumpResult?.success ? correctPriceData({ ...updatedPumpResult }) : null;

    setSelectedComponents({
      gearbox: correctedGearbox,
      coupling: currentCoupling,
      pump: currentPump
    });

    // 使用统一的价格计算函数
    const newPriceData = calculateAllPrices(
      correctedGearbox,
      currentCoupling,
      currentPump,
      { includePump: true } // 默认包含备用泵
    );

    // 更新统一的价格状态
    setPriceData(newPriceData);

    // 保持对原有状态的更新，以便兼容性
    setPackagePrice(newPriceData.packagePrice);
    setMarketPrice(newPriceData.marketPrice);
    setTotalMarketPrice(newPriceData.totalMarketPrice);

    logger.log("Selected Components Updated:", {
      gearbox: correctedGearbox?.model,
      coupling: currentCoupling?.model,
      pump: currentPump?.model,
      hasSpecialPackagePrice: correctedGearbox.hasSpecialPackagePrice || false,
      needsPump: newPriceData.needsPump,
      includePump: newPriceData.includePump
    });
    logger.log("Prices Updated:", {
      packagePrice: newPriceData.packagePrice,
      marketPrice: newPriceData.marketPrice,
      totalMarketPrice: newPriceData.totalMarketPrice
    });

    setQuotation(null);
    setAgreement(null);
    setContract(null);
    setActiveTab('result');
  }, [selectionResult, appDataState, requirementData, engineData, setActiveTab, calculateAllPrices, setSelectedGearboxIndex, setSelectedComponents, setPriceData, setPackagePrice, setMarketPrice, setTotalMarketPrice, setQuotation, setAgreement, setContract, setError, setSuccess]);

  // 处理联轴器选择
  const handleCouplingSelection = useCallback((index) => {
    if (!selectionResult || !selectionResult.flexibleCoupling ||
        !selectionResult.flexibleCoupling.recommendations ||
        index >= selectionResult.flexibleCoupling.recommendations.length) {
      setError('无法选择联轴器，选型结果无效或索引超出范围');
      return;
    }

    try {
      // 获取选中的联轴器
      const selectedCoupling = selectionResult.flexibleCoupling.recommendations[index];
      logger.log(`选择联轴器: ${selectedCoupling.model}`);

      // 创建新的选型结果对象，用选中的联轴器替换原来的最佳匹配
      const updatedCouplingResult = {
        ...selectionResult.flexibleCoupling,
        model: selectedCoupling.model,
        torque: selectedCoupling.torque,
        torqueUnit: selectedCoupling.torqueUnit,
        maxSpeed: selectedCoupling.maxSpeed,
        torqueMargin: selectedCoupling.torqueMargin,
        score: selectedCoupling.score,
        scoreDetails: selectedCoupling.scoreDetails,
        weight: selectedCoupling.weight,
        factoryPrice: selectedCoupling.factoryPrice,
        marketPrice: selectedCoupling.marketPrice
      };

      // 更新选型结果
      setSelectionResult(prev => ({
        ...prev,
        flexibleCoupling: updatedCouplingResult
      }));

      // 如果需要更新选中组件和价格
      const correctedCoupling = correctPriceData(selectedCoupling);

      setSelectedComponents(prev => ({
        ...prev,
        coupling: correctedCoupling
      }));

      // 使用统一的价格计算函数更新价格
      const newPriceData = calculateAllPrices(
        selectedComponents.gearbox,
        correctedCoupling,
        selectedComponents.pump,
        { includePump: priceData.includePump }
      );

      // 更新统一的价格状态
      setPriceData(newPriceData);

      // 保持对原有状态的更新，以便兼容性
      setPackagePrice(newPriceData.packagePrice);
      setMarketPrice(newPriceData.marketPrice);
      setTotalMarketPrice(newPriceData.totalMarketPrice);

      // 清除之前的报价单和协议
      setQuotation(null);
      setAgreement(null);
      setContract(null);

      setSuccess(`已选择联轴器: ${selectedCoupling.model}`);
    } catch (error) {
      logger.error("选择联轴器出错:", error);
      setError('选择联轴器时出错: ' + error.message);
    }
  }, [selectionResult, selectedComponents, priceData.includePump, calculateAllPrices, setSelectionResult, setSelectedComponents, setPriceData, setPackagePrice, setMarketPrice, setTotalMarketPrice, setQuotation, setAgreement, setContract, setError, setSuccess]);

  // 执行选型
  const handleSelectGearbox = useCallback(() => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 使用已计算的表单验证结果
      const validation = isFormValid(); // 直接调用 isFormValid
      if (!validation.isValid) { // 使用调用结果
        setError('请完成所有必填项，并确保数值有效');
        setLoading(false);
        return;
      }

      // 准备选型参数 - 添加详细日志
      const selectionParams = {
        power: parseFloat(engineData.power),
        speed: parseFloat(engineData.speed),
        targetRatio: parseFloat(requirementData.targetRatio),
        thrustRequirement: parseFloat(requirementData.thrustRequirement) || 0,
        gearboxType: gearboxType,
        application: requirementData.application
      };

      logger.log("开始进行选型，参数:", selectionParams);

      // 执行选型算法
      let result;

      // 获取选型配置 (可配置权重和容差)
      const selectionConfig = getEffectiveConfig({
        power: selectionParams.power,
        speed: selectionParams.speed,
        ratio: selectionParams.targetRatio
      });

      if (gearboxType === 'auto') {
        // 自动选型模式，传递完整选项
        result = autoSelectGearbox(
          {
            motorPower: selectionParams.power,
            motorSpeed: selectionParams.speed,
            targetRatio: selectionParams.targetRatio,
            thrust: selectionParams.thrustRequirement,
            workCondition: requirementData.workCondition,
            temperature: parseFloat(requirementData.temperature) || 30,
            hasCover: requirementData.hasCover,
            application: requirementData.application,
            hybridConfig: hybridConfig,  // 传递混动配置
            // 可配置的评分权重和容差
            scoringWeights: selectionConfig.scoringWeights,
            tolerances: selectionConfig.tolerances,
            // 接口筛选选项
            interfaceType: requirementData.interfaceType || '无要求',
            interfaceSpec: requirementData.interfaceSpec || '',
            interfaceFilterMode: requirementData.interfaceFilterMode || 'prefer'
          },
          appDataState
        );

        // 保存诊断信息用于智能提示
        if (result._diagnostics) {
          setSelectionDiagnostics(result._diagnostics);
        }
      } else {
        // 指定系列选型模式 - 使用可配置权重和容差
        result = selectGearbox(
          selectionParams.power,
          selectionParams.speed,
          selectionParams.targetRatio,
          selectionParams.thrustRequirement,
          gearboxType,
          appDataState,
          {
            workCondition: requirementData.workCondition,
            temperature: parseFloat(requirementData.temperature) || 30,
            hasCover: requirementData.hasCover,
            application: requirementData.application,
            hybridConfig: hybridConfig,  // 传递混动配置，用于筛选P后缀型号
            // 可配置的评分权重和容差
            scoringWeights: selectionConfig.scoringWeights,
            tolerances: selectionConfig.tolerances,
            // 接口筛选选项
            interfaceType: requirementData.interfaceType || '无要求',
            interfaceSpec: requirementData.interfaceSpec || '',
            interfaceFilterMode: requirementData.interfaceFilterMode || 'prefer'
          }
        );

        // 保存诊断信息用于智能提示
        if (result._diagnostics) {
          setSelectionDiagnostics(result._diagnostics);
        }
      }

      // 记录原始选型结果
      logger.log("原始选型结果:", result);

      // 如果没有联轴器选型结果，使用增强型联轴器选型
      if (result.success && result.recommendations && result.recommendations.length > 0 && !result.flexibleCoupling) {
        // 准备增强型联轴器选型参数
        const selectedGearbox = result.recommendations[0];
        const engineTorque = result.engineTorque || (selectionParams.power * 9550 / selectionParams.speed);

        try {
          logger.log("使用增强型联轴器选型...");
          const enhancedCouplingResult = enhancedCouplingSelection(
            {
              success: true,
              recommendations: [selectedGearbox],
              engineTorque,
              engineSpeed: selectionParams.speed
            },
            appDataState.flexibleCouplings,
            {
              workCondition: requirementData.workCondition,
              temperature: parseFloat(requirementData.temperature) || 30,
              hasCover: requirementData.hasCover
            }
          );

          // 将增强型联轴器选型结果添加到选型结果中
          result.flexibleCoupling = enhancedCouplingResult;
          logger.log("增强型联轴器选型结果:", enhancedCouplingResult);
        } catch (couplingError) {
          logger.error("增强型联轴器选型失败:", couplingError);
          // 联轴器选型失败不影响整体选型结果
        }
      }

      // 处理特殊打包价格 - 检查结果中的齿轮箱是否适用特殊打包价格
      if (result.success && result.recommendations && result.recommendations.length > 0) {
        result.recommendations.forEach(gearbox => {
          const gwConfig = getGWPackagePriceConfig(gearbox.model);
          if (gwConfig && !gwConfig.isSmallGWModel) {
            // 标记为特殊打包价格型号
            gearbox.hasSpecialPackagePrice = true;
            gearbox.gwPackageConfig = gwConfig;
            gearbox.packagePrice = gwConfig.packagePrice;
            gearbox.marketPrice = gwConfig.packagePrice;
            logger.log(`齿轮箱 ${gearbox.model} 适用GW系列特殊打包价格: ${gwConfig.packagePrice}`);
          }
        });
      }

      setSelectionResult(result);

      // 如果选型成功，处理推荐的齿轮箱
      if (result.success && result.recommendations && result.recommendations.length > 0) {
        // 自动选择第一个推荐项 - 传入 result 避免异步状态问题
        handleGearboxSelection(0, result);
        setActiveTab('result');

        // 检查首选齿轮箱是否有特殊打包价格
        const topRecommendation = result.recommendations[0];
        if (topRecommendation.hasSpecialPackagePrice) {
          setSuccess(`选型成功，已找到符合条件的齿轮箱。该型号采用市场常规打包价${topRecommendation.packagePrice.toLocaleString()}元。`);
        } else {
          setSuccess('选型成功，已找到符合条件的齿轮箱');
        }

        // 保存选型历史
        try {
          const historyEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            selectionResult: result,
            engineData: {...engineData},
            requirementData: {...requirementData},
            projectInfo: {...projectInfo},
            gearboxType
          };

          setSelectionHistory(prev => {
            const updatedHistory = [historyEntry, ...prev].slice(0, 20); // 限制历史记录数量
            localStorage.setItem('selectionHistory', JSON.stringify(updatedHistory));
            return updatedHistory;
          });

          logger.log("选型结果已保存到历史记录");
        } catch (historyError) {
          logger.warn("保存选型历史失败:", historyError);
        }
      } else {
        let errorMessage = result.message || '选型失败，未找到合适的齿轮箱';

        // 检查是否有近似匹配推荐
        if (result.recommendations && result.recommendations.length > 0) {
          // 显示近似匹配推荐的提示
          errorMessage += "。发现接近条件的齿轮箱，请查看结果选项卡。";
          setActiveTab('result'); // 自动切换到结果选项卡
          setSuccess('发现近似匹配的齿轮箱，但未找到完全符合条件的型号');
        } else {
          // 添加更详细的失败原因
          if (result.rejectionReasons) {
            const reasons = Object.entries(result.rejectionReasons)
              .filter(([_, count]) => count > 0)
              .map(([reason, count]) => {
                switch(reason) {
                  case 'speedRange': return `${count}个型号因转速范围不匹配被排除`;
                  case 'ratioOutOfRange': return `${count}个型号因减速比偏差过大被排除`;
                  case 'capacityTooLow': return `${count}个型号因传递能力不足被排除`;
                  case 'capacityTooHigh': return `${count}个型号因传递能力余量过大被排除`;
                  case 'thrustInsufficient': return `${count}个型号因推力不满足要求被排除`;
                  default: return `${reason}: ${count}`;
                }
              })
              .join("；");

            if (reasons) {
              errorMessage += `\n筛选情况：${reasons}`;
            }
          }

          setError(errorMessage);
        }
      }
    } catch (error) {
      logger.error('选型过程中发生错误:', error);
      setError('选型过程中发生错误: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [engineData, requirementData, gearboxType, appDataState, handleGearboxSelection, setActiveTab, isFormValid, hybridConfig, projectInfo, getEffectiveConfig, setSelectionResult, setSelectionHistory, setSelectionDiagnostics, setLoading, setError, setSuccess]);

  return {
    handleGearboxSelection,
    handleCouplingSelection,
    handleSelectGearbox
  };
};

export default useSelectionHandlers;
