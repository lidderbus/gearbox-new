// src/hooks/__tests__/useFormHandlers.test.js
import { renderHook, act } from '@testing-library/react';
import useFormHandlers from '../useFormHandlers';

function makeProps(overrides = {}) {
  return {
    engineData: { power: 1000, speed: 1500 },
    requirementData: { targetRatio: 3, thrustRequirement: 50, temperature: 25 },
    setEngineData: jest.fn(),
    setRequirementData: jest.fn(),
    setProjectInfo: jest.fn(),
    setGearboxType: jest.fn(),
    setError: jest.fn(),
    ...overrides
  };
}

describe('useFormHandlers', () => {
  describe('getFieldValidationState', () => {
    test('必填字段空值 = valid (pristine)', () => {
      const { result } = renderHook(() => useFormHandlers(makeProps()));
      expect(result.current.getFieldValidationState('enginePower', '')).toBe('valid');
      expect(result.current.getFieldValidationState('enginePower', null)).toBe('valid');
      expect(result.current.getFieldValidationState('enginePower', undefined)).toBe('valid');
    });

    test('必填字段 0 / 负数 = invalid', () => {
      const { result } = renderHook(() => useFormHandlers(makeProps()));
      expect(result.current.getFieldValidationState('enginePower', 0)).toBe('invalid');
      expect(result.current.getFieldValidationState('enginePower', -100)).toBe('invalid');
      expect(result.current.getFieldValidationState('engineSpeed', 'abc')).toBe('invalid');
    });

    test('阈值警告: power > 2500 / speed > 2200 / ratio > 8', () => {
      const { result } = renderHook(() => useFormHandlers(makeProps()));
      expect(result.current.getFieldValidationState('enginePower', 3000)).toBe('warning');
      expect(result.current.getFieldValidationState('engineSpeed', 2500)).toBe('warning');
      expect(result.current.getFieldValidationState('targetRatio', 9)).toBe('warning');
    });

    test('正常工况 = valid', () => {
      const { result } = renderHook(() => useFormHandlers(makeProps()));
      expect(result.current.getFieldValidationState('enginePower', 1000)).toBe('valid');
      expect(result.current.getFieldValidationState('engineSpeed', 1500)).toBe('valid');
      expect(result.current.getFieldValidationState('targetRatio', 3)).toBe('valid');
    });

    test('可选字段: 推力 > 150 警告; 温度 > 60 警告 (注: 实现的 numValue<0 优先级高于温度阈值, 负温度被判 invalid)', () => {
      const { result } = renderHook(() => useFormHandlers(makeProps()));
      expect(result.current.getFieldValidationState('thrustRequirement', 200)).toBe('warning');
      expect(result.current.getFieldValidationState('temperature', 70)).toBe('warning');
      expect(result.current.getFieldValidationState('temperature', 25)).toBe('valid');
      // 已知行为/边界: 负温度被 numValue<0 抢先判 invalid (即使温度域应允许 -20)
      expect(result.current.getFieldValidationState('temperature', -30)).toBe('invalid');
    });

    test('可选字段负数 = invalid', () => {
      const { result } = renderHook(() => useFormHandlers(makeProps()));
      expect(result.current.getFieldValidationState('thrustRequirement', -10)).toBe('invalid');
    });
  });

  describe('getValidationClassName', () => {
    test('返回正确 className', () => {
      const { result } = renderHook(() => useFormHandlers(makeProps()));
      expect(result.current.getValidationClassName('invalid')).toBe('is-invalid');
      expect(result.current.getValidationClassName('warning')).toBe('is-warning');
      expect(result.current.getValidationClassName('valid')).toBe('');
    });
  });

  describe('isFormValid', () => {
    test('全字段正常 → isValid=true, warnings=0', () => {
      const { result } = renderHook(() => useFormHandlers(makeProps()));
      const r = result.current.isFormValid();
      expect(r.isValid).toBe(true);
      expect(r.warnings).toBe(0);
    });

    test('必填字段缺失 → isValid=false', () => {
      const { result } = renderHook(() => useFormHandlers(makeProps({
        engineData: { power: 0, speed: 1500 }
      })));
      expect(result.current.isFormValid().isValid).toBe(false);
    });

    test('警告项不阻断 isValid', () => {
      const { result } = renderHook(() => useFormHandlers(makeProps({
        engineData: { power: 3000, speed: 1500 } // 超阈警告
      })));
      const r = result.current.isFormValid();
      expect(r.isValid).toBe(true);
      expect(r.warnings).toBeGreaterThan(0);
    });
  });

  describe('handlers', () => {
    test('handleEngineDataChange 合并数据 + 清错', () => {
      const setEngineData = jest.fn();
      const setError = jest.fn();
      const { result } = renderHook(() => useFormHandlers(makeProps({ setEngineData, setError })));
      act(() => result.current.handleEngineDataChange({ power: 1500 }));
      expect(setEngineData).toHaveBeenCalled();
      expect(setError).toHaveBeenCalledWith('');
    });

    test('handleRequirementDataChange: temperature 转字符串', () => {
      const setRequirementData = jest.fn();
      const { result } = renderHook(() => useFormHandlers(makeProps({ setRequirementData })));
      act(() => result.current.handleRequirementDataChange({ temperature: 30 }));
      const updater = setRequirementData.mock.calls[0][0];
      const next = updater({});
      expect(next.temperature).toBe('30');
      expect(typeof next.temperature).toBe('string');
    });

    test('handleGearboxTypeChange 设置类型 + 清错', () => {
      const setGearboxType = jest.fn();
      const setError = jest.fn();
      const { result } = renderHook(() => useFormHandlers(makeProps({ setGearboxType, setError })));
      act(() => result.current.handleGearboxTypeChange('HC'));
      expect(setGearboxType).toHaveBeenCalledWith('HC');
      expect(setError).toHaveBeenCalledWith('');
    });
  });
});
