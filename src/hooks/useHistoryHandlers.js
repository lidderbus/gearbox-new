// src/hooks/useHistoryHandlers.js
// 历史记录相关处理函数 Hook

import { useCallback } from 'react';
import { logger } from '../config/logging';

/**
 * 历史记录相关处理函数 Hook
 *
 * @param {Object} params - Hook 参数
 * @param {Array} params.selectionHistory - 选型历史记录数组
 * @param {Function} params.setSelectionHistory - 设置选型历史
 * @param {Function} params.setProjectInfo - 设置项目信息
 * @param {Function} params.setEngineData - 设置发动机数据
 * @param {Function} params.setRequirementData - 设置需求数据
 * @param {Function} params.setGearboxType - 设置齿轮箱类型
 * @param {Function} params.setSelectionResult - 设置选型结果
 * @param {Function} params.setSelectedComponents - 设置已选组件
 * @param {Function} params.setQuotation - 设置报价单
 * @param {Function} params.setAgreement - 设置技术协议
 * @param {Function} params.setContract - 设置销售合同
 * @param {Function} params.setLoading - 设置加载状态
 * @param {Function} params.setError - 设置错误信息
 * @param {Function} params.setSuccess - 设置成功信息
 * @param {Function} params.setActiveTab - 设置活动标签页
 */
const useHistoryHandlers = ({
  selectionHistory,
  setSelectionHistory,
  setProjectInfo,
  setEngineData,
  setRequirementData,
  setGearboxType,
  setSelectionResult,
  setSelectedComponents,
  setQuotation,
  setAgreement,
  setContract,
  setLoading,
  setError,
  setSuccess,
  setActiveTab
}) => {

  // 加载历史记录
  const handleLoadHistoryEntry = useCallback((historyId) => {
    const entry = selectionHistory.find(item => item.id === historyId);

    if (entry && entry.selectionResult) {
      setLoading(true);
      setError('');
      setSuccess('正在加载历史记录...');

      setProjectInfo(entry.projectInfo || { projectName: '', customerName: '', projectNumber: '', contactPerson: '', contactPhone: '', contactEmail: '', engineModel: '' });
      setEngineData(entry.engineData || { power: '', speed: '' });
      setRequirementData(entry.requirementData || { targetRatio: '', thrustRequirement: '', workCondition: "III类:扭矩变化中等", temperature: "30", hasCover: false, application: 'propulsion' });

      const historyGearboxType = entry.selectionResult?.gearboxTypeUsed || 'auto';
      setGearboxType(historyGearboxType);

      setSelectionResult(entry.selectionResult);

      setQuotation(null);
      setAgreement(null);
      setContract(null);

      setActiveTab('result');
      setLoading(false);
      setSuccess(`已成功加载历史选型数据 (ID: ${historyId})`);
    } else {
      setError('未找到指定的历史记录或历史记录无效');
      logger.error("Failed to load history entry:", entry);
      setLoading(false);
    }
  }, [selectionHistory, setActiveTab, setLoading, setError, setSuccess, setProjectInfo, setEngineData, setRequirementData, setGearboxType, setSelectionResult, setQuotation, setAgreement, setContract]);

  // 删除历史记录
  const handleDeleteHistoryEntry = useCallback((historyId) => {
    if (window.confirm("确定要删除此历史记录吗？")) {
      setSelectionHistory(prev => {
        const filtered = prev.filter(entry => entry.id !== historyId);
        try {
          localStorage.setItem('selectionHistory', JSON.stringify(filtered));
          setSuccess('历史记录已成功删除');
          setError('');
        } catch (lsError) {
          logger.error("无法更新LocalStorage中的历史记录:", lsError);
          setError('历史记录删除失败 (无法更新存储)');
        }
        return filtered;
      });
    }
  }, [setSelectionHistory, setError, setSuccess]);

  // 从历史记录管理器加载历史数据
  const handleLoadFromHistoryManager = useCallback((entry) => {
    if (!entry) return;

    // 恢复发动机数据
    if (entry.engineData) {
      setEngineData(prev => ({ ...prev, ...entry.engineData }));
    }
    // 恢复需求数据
    if (entry.requirementData) {
      setRequirementData(prev => ({ ...prev, ...entry.requirementData }));
    }
    // 恢复项目信息
    if (entry.projectInfo) {
      setProjectInfo(prev => ({ ...prev, ...entry.projectInfo }));
    }
    // 恢复选型结果
    if (entry.selectionResult) {
      setSelectionResult(entry.selectionResult);
    }
    // 恢复已选组件
    if (entry.selectedComponents) {
      setSelectedComponents(entry.selectedComponents);
    }
    // 切换到输入标签页
    setActiveTab('input');
    setSuccess('历史记录已加载，请在输入参数标签页查看');
  }, [setActiveTab, setSuccess, setEngineData, setRequirementData, setProjectInfo, setSelectionResult, setSelectedComponents]);

  return {
    handleLoadHistoryEntry,
    handleDeleteHistoryEntry,
    handleLoadFromHistoryManager
  };
};

export default useHistoryHandlers;
