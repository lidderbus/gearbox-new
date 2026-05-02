// src/hooks/useFormHandlers.js
// 表单相关处理函数 Hook

import { useCallback } from 'react';

/**
 * 表单相关处理函数 Hook
 *
 * @param {Object} params - Hook 参数
 * @param {Object} params.engineData - 发动机数据
 * @param {Object} params.requirementData - 需求数据
 * @param {Function} params.setEngineData - 设置发动机数据
 * @param {Function} params.setRequirementData - 设置需求数据
 * @param {Function} params.setProjectInfo - 设置项目信息
 * @param {Function} params.setGearboxType - 设置齿轮箱类型
 * @param {Function} params.setError - 设置错误信息
 */
const useFormHandlers = ({
  engineData,
  requirementData,
  setEngineData,
  setRequirementData,
  setProjectInfo,
  setGearboxType,
  setError
}) => {

  // 字段验证状态
  const getFieldValidationState = useCallback((fieldName, value) => {
    const numValue = parseFloat(value);
    const requiredPos = ['enginePower', 'engineSpeed', 'targetRatio'];
    const optionalNonNeg = ['thrustRequirement', 'temperature'];

    if (requiredPos.includes(fieldName)) {
      // Pristine: empty field shows no validation feedback (但 0/负数 必须报错, 不再视为 valid)
      if (value === '' || value === null || value === undefined) return 'valid';
      if (isNaN(numValue) || numValue <= 0) return 'invalid';
      // v60 阈值校准 (报告 #4): 之前阈值远超工程常用上限, 误报正常工况
      // 功率: 范围 50-3500 kW → 警告 > 2500 kW (近上限 70%)
      // 转速: 范围 750-2200 r/min → 警告 > 2200 r/min (超上限才报)
      // 减速比: 范围 1.5-10 → 警告 > 8 (近上限 80%)
      if ((fieldName === 'enginePower' && numValue > 2500) ||
          (fieldName === 'engineSpeed' && numValue > 2200) ||
          (fieldName === 'targetRatio' && numValue > 8)) return 'warning';
    }

    if (optionalNonNeg.includes(fieldName)) {
        if (value !== '' && value !== null && (isNaN(numValue) || numValue < 0)) return 'invalid';
        // v60 阈值校准: 推力 80 kN 不应报警, 主流船用上限 ~150 kN
        if (fieldName === 'thrustRequirement' && numValue > 150) return 'warning';
        if (fieldName === 'temperature' && (numValue < -20 || numValue > 60)) return 'warning';
    }

    return 'valid';
  }, []);

  // 获取验证类名
  const getValidationClassName = useCallback((state) => {
    if (state === 'invalid') return 'is-invalid';
    if (state === 'warning') return 'is-warning';
    return '';
  }, []);

  // 表单整体验证
  const isFormValid = useCallback(() => {
    // Required fields must have positive values (separate from display validation)
    const p = parseFloat(engineData.power);
    const s = parseFloat(engineData.speed);
    const r = parseFloat(requirementData.targetRatio);
    if (!p || p <= 0 || !s || s <= 0 || !r || r <= 0) {
      return { isValid: false, warnings: 0 };
    }

    const states = [
      getFieldValidationState('enginePower', engineData.power),
      getFieldValidationState('engineSpeed', engineData.speed),
      getFieldValidationState('targetRatio', requirementData.targetRatio),
      getFieldValidationState('thrustRequirement', requirementData.thrustRequirement),
      getFieldValidationState('temperature', requirementData.temperature)
    ];

    const isValid = states.every(state => state === 'valid' || state === 'warning');
    const warnings = states.filter(state => state === 'warning').length;

    return { isValid, warnings };

  }, [engineData, requirementData, getFieldValidationState]);

  // 发动机数据变更处理
  const handleEngineDataChange = useCallback((data) => {
    setEngineData(prevData => ({ ...prevData, ...data }));
    setError('');
  }, [setEngineData, setError]);

  // 需求数据变更处理
  const handleRequirementDataChange = useCallback((data) => {
    if (data.temperature !== undefined) {
        data.temperature = String(data.temperature);
    }
    setRequirementData(prevData => ({ ...prevData, ...data }));
    setError('');
  }, [setRequirementData, setError]);

  // 项目信息变更处理
  const handleProjectInfoChange = useCallback((data) => {
    setProjectInfo(prevData => ({ ...prevData, ...data }));
    setError('');
  }, [setProjectInfo, setError]);

  // 齿轮箱类型变更处理
  const handleGearboxTypeChange = useCallback((type) => {
    setGearboxType(type);
    setError('');
  }, [setGearboxType, setError]);

  return {
    // 验证函数
    getFieldValidationState,
    getValidationClassName,
    isFormValid,
    // 表单处理函数
    handleEngineDataChange,
    handleRequirementDataChange,
    handleProjectInfoChange,
    handleGearboxTypeChange
  };
};

export default useFormHandlers;
