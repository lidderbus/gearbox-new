// src/hooks/__tests__/useHistoryHandlers.test.js
import { renderHook, act } from '@testing-library/react';

jest.mock('../../config/logging', () => ({
  logger: { log: jest.fn(), warn: jest.fn(), error: jest.fn() }
}));

import useHistoryHandlers from '../useHistoryHandlers';

function makeSetters() {
  return {
    setSelectionHistory: jest.fn(),
    setProjectInfo: jest.fn(),
    setEngineData: jest.fn(),
    setRequirementData: jest.fn(),
    setGearboxType: jest.fn(),
    setSelectionResult: jest.fn(),
    setSelectedComponents: jest.fn(),
    setQuotation: jest.fn(),
    setAgreement: jest.fn(),
    setContract: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    setSuccess: jest.fn(),
    setActiveTab: jest.fn()
  };
}

const sampleEntry = {
  id: 'h-001',
  projectInfo: { projectName: 'P1', customerName: 'C1' },
  engineData: { power: 1000, speed: 1500 },
  requirementData: { targetRatio: 3 },
  selectionResult: { gearboxTypeUsed: 'HC', selectedGearbox: { model: 'HC400' } },
  selectedComponents: { gearbox: { model: 'HC400' } }
};

describe('useHistoryHandlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('handleLoadHistoryEntry', () => {
    test('找到 entry → 恢复 5 个状态字段 + 切到 result tab + 清 quotation/agreement/contract', () => {
      const setters = makeSetters();
      const { result } = renderHook(() => useHistoryHandlers({
        selectionHistory: [sampleEntry],
        ...setters
      }));

      act(() => result.current.handleLoadHistoryEntry('h-001'));

      expect(setters.setProjectInfo).toHaveBeenCalledWith(sampleEntry.projectInfo);
      expect(setters.setEngineData).toHaveBeenCalledWith(sampleEntry.engineData);
      expect(setters.setRequirementData).toHaveBeenCalledWith(sampleEntry.requirementData);
      expect(setters.setGearboxType).toHaveBeenCalledWith('HC');
      expect(setters.setSelectionResult).toHaveBeenCalledWith(sampleEntry.selectionResult);
      expect(setters.setQuotation).toHaveBeenCalledWith(null);
      expect(setters.setAgreement).toHaveBeenCalledWith(null);
      expect(setters.setContract).toHaveBeenCalledWith(null);
      expect(setters.setActiveTab).toHaveBeenCalledWith('result');
      expect(setters.setSuccess).toHaveBeenCalledWith(expect.stringContaining('h-001'));
    });

    test('未找到 entry → 设 error, 不切 tab', () => {
      const setters = makeSetters();
      const { result } = renderHook(() => useHistoryHandlers({
        selectionHistory: [],
        ...setters
      }));

      act(() => result.current.handleLoadHistoryEntry('not-exist'));

      expect(setters.setError).toHaveBeenCalledWith(expect.stringContaining('未找到'));
      expect(setters.setActiveTab).not.toHaveBeenCalled();
    });

    test('entry 缺 selectionResult → 当作未找到', () => {
      const setters = makeSetters();
      const { result } = renderHook(() => useHistoryHandlers({
        selectionHistory: [{ id: 'h-002', projectInfo: {} }], // 无 selectionResult
        ...setters
      }));

      act(() => result.current.handleLoadHistoryEntry('h-002'));
      expect(setters.setError).toHaveBeenCalled();
      expect(setters.setActiveTab).not.toHaveBeenCalled();
    });

    test('entry 缺 gearboxTypeUsed → 默认 auto', () => {
      const setters = makeSetters();
      const e = { ...sampleEntry, selectionResult: { selectedGearbox: {} } };
      const { result } = renderHook(() => useHistoryHandlers({
        selectionHistory: [e],
        ...setters
      }));
      act(() => result.current.handleLoadHistoryEntry(e.id));
      expect(setters.setGearboxType).toHaveBeenCalledWith('auto');
    });
  });

  describe('handleDeleteHistoryEntry', () => {
    let originalConfirm;
    beforeEach(() => {
      originalConfirm = window.confirm;
    });
    afterEach(() => {
      window.confirm = originalConfirm;
    });

    test('用户确认 → 过滤数组 + 写 localStorage + setSuccess', () => {
      window.confirm = jest.fn(() => true);
      const setters = makeSetters();
      const { result } = renderHook(() => useHistoryHandlers({
        selectionHistory: [],
        ...setters
      }));

      act(() => result.current.handleDeleteHistoryEntry('h-001'));

      expect(setters.setSelectionHistory).toHaveBeenCalled();
      const updater = setters.setSelectionHistory.mock.calls[0][0];
      const next = updater([sampleEntry, { id: 'h-002' }]);
      expect(next.length).toBe(1);
      expect(next[0].id).toBe('h-002');
      expect(setters.setSuccess).toHaveBeenCalledWith(expect.stringContaining('删除'));
      expect(localStorage.getItem('selectionHistory')).toContain('h-002');
    });

    test('用户取消 → 不调 setSelectionHistory', () => {
      window.confirm = jest.fn(() => false);
      const setters = makeSetters();
      const { result } = renderHook(() => useHistoryHandlers({
        selectionHistory: [sampleEntry],
        ...setters
      }));

      act(() => result.current.handleDeleteHistoryEntry('h-001'));

      expect(setters.setSelectionHistory).not.toHaveBeenCalled();
    });
  });

  describe('handleLoadFromHistoryManager', () => {
    test('完整 entry → 5 个 setter 都被调 + 切到 input tab', () => {
      const setters = makeSetters();
      const { result } = renderHook(() => useHistoryHandlers({
        selectionHistory: [],
        ...setters
      }));

      act(() => result.current.handleLoadFromHistoryManager(sampleEntry));

      expect(setters.setEngineData).toHaveBeenCalled();
      expect(setters.setRequirementData).toHaveBeenCalled();
      expect(setters.setProjectInfo).toHaveBeenCalled();
      expect(setters.setSelectionResult).toHaveBeenCalledWith(sampleEntry.selectionResult);
      expect(setters.setSelectedComponents).toHaveBeenCalledWith(sampleEntry.selectedComponents);
      expect(setters.setActiveTab).toHaveBeenCalledWith('input');
    });

    test('null entry → 直接 return, 无 setter 调用', () => {
      const setters = makeSetters();
      const { result } = renderHook(() => useHistoryHandlers({
        selectionHistory: [],
        ...setters
      }));

      act(() => result.current.handleLoadFromHistoryManager(null));

      expect(setters.setActiveTab).not.toHaveBeenCalled();
      expect(setters.setSuccess).not.toHaveBeenCalled();
    });

    test('部分缺失字段 → 仅可恢复字段被调用', () => {
      const setters = makeSetters();
      const { result } = renderHook(() => useHistoryHandlers({
        selectionHistory: [],
        ...setters
      }));

      act(() => result.current.handleLoadFromHistoryManager({
        engineData: { power: 800 }
        // 其它字段缺失
      }));

      expect(setters.setEngineData).toHaveBeenCalled();
      expect(setters.setRequirementData).not.toHaveBeenCalled();
      expect(setters.setProjectInfo).not.toHaveBeenCalled();
      expect(setters.setSelectionResult).not.toHaveBeenCalled();
      expect(setters.setActiveTab).toHaveBeenCalledWith('input');
    });
  });
});
