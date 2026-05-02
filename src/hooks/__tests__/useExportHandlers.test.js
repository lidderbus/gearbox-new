// src/hooks/__tests__/useExportHandlers.test.js
import { renderHook, act } from '@testing-library/react';

// Mock heavy export deps
jest.mock('../../config/logging', () => ({
  logger: { log: jest.fn(), warn: jest.fn(), error: jest.fn() }
}));
jest.mock('../../utils/contractGenerator', () => ({
  generateContract: jest.fn(() => ({ contractNumber: 'CONT-2026-001' })),
  exportContractToWord: jest.fn(() => Promise.resolve())
}));
jest.mock('../../utils/agreementGenerator', () => ({
  exportAgreementToWord: jest.fn(() => Promise.resolve()),
  exportAgreementToPDFFormat: jest.fn(() => Promise.resolve())
}));
jest.mock('../../utils/pdfExportUtils', () => ({
  optimizedHtmlToPdf: jest.fn(() => Promise.resolve())
}));

import useExportHandlers from '../useExportHandlers';

function makeProps(overrides = {}) {
  return {
    selectedComponents: { gearbox: { model: 'HC400' }, coupling: null, pump: null },
    selectionResult: { success: true, selectedGearbox: { model: 'HC400' } },
    projectInfo: { projectName: 'P1', customerName: 'C1' },
    quotation: null,
    agreement: null,
    contract: null,
    priceData: { packagePrice: 10000 },
    agreementSpecialRequirements: '',
    setSelectionResult: jest.fn(),
    setContract: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    setSuccess: jest.fn(),
    setActiveTab: jest.fn(),
    ...overrides
  };
}

describe('useExportHandlers', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('handleGenerateAgreement', () => {
    test('无 gearbox → setError, 不切 tab', () => {
      const props = makeProps({ selectedComponents: { gearbox: null } });
      const { result } = renderHook(() => useExportHandlers(props));
      act(() => result.current.handleGenerateAgreement());
      expect(props.setError).toHaveBeenCalledWith(expect.stringContaining('选型'));
      expect(props.setActiveTab).not.toHaveBeenCalled();
    });

    test('selectionResult.success=false → setError', () => {
      const props = makeProps({ selectionResult: { success: false } });
      const { result } = renderHook(() => useExportHandlers(props));
      act(() => result.current.handleGenerateAgreement());
      expect(props.setError).toHaveBeenCalledWith(expect.stringContaining('选型结果无效'));
      expect(props.setActiveTab).not.toHaveBeenCalled();
    });

    test('selectionResult 为 null → setError', () => {
      const props = makeProps({ selectionResult: null });
      const { result } = renderHook(() => useExportHandlers(props));
      act(() => result.current.handleGenerateAgreement());
      expect(props.setError).toHaveBeenCalled();
      expect(props.setActiveTab).not.toHaveBeenCalled();
    });

    test('完整数据 → 切到 agreement tab + setSuccess', () => {
      const props = makeProps();
      const { result } = renderHook(() => useExportHandlers(props));
      act(() => result.current.handleGenerateAgreement());
      expect(props.setActiveTab).toHaveBeenCalledWith('agreement');
      expect(props.setSuccess).toHaveBeenCalled();
    });

    test('selectionResult 缺 priceData → 触发 setSelectionResult 同步价格', () => {
      const props = makeProps({
        selectionResult: { success: true, selectedGearbox: { model: 'HC400' } } // 无 priceData
      });
      const { result } = renderHook(() => useExportHandlers(props));
      act(() => result.current.handleGenerateAgreement());
      expect(props.setSelectionResult).toHaveBeenCalled();
    });
  });

  describe('handleExportAgreement', () => {
    test('无 agreement → setError, 不调用导出', async () => {
      const props = makeProps({ agreement: null });
      const { result } = renderHook(() => useExportHandlers(props));
      await act(async () => {
        await result.current.handleExportAgreement('word');
      });
      expect(props.setError).toHaveBeenCalledWith(expect.stringContaining('生成'));
    });

    test('有 agreement word 格式 → 调 exportAgreementToWord', async () => {
      const { exportAgreementToWord } = require('../../utils/agreementGenerator');
      const props = makeProps({ agreement: { html: '<div>x</div>', metadata: {} } });
      const { result } = renderHook(() => useExportHandlers(props));
      await act(async () => {
        await result.current.handleExportAgreement('word');
      });
      expect(exportAgreementToWord).toHaveBeenCalled();
      expect(props.setSuccess).toHaveBeenCalled();
    });
  });
});
