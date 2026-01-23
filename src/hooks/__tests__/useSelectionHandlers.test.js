// src/hooks/__tests__/useSelectionHandlers.test.js
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Define mocks inline to avoid hoisting issues
jest.mock('../../config/logging', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  }
}));

jest.mock('../../utils/priceManager', () => ({
  correctPriceData: jest.fn()
}));

jest.mock('../../data/packagePriceConfig', () => ({
  getGWPackagePriceConfig: jest.fn(() => null)
}));

jest.mock('../../utils/enhancedPumpSelection', () => ({
  enhancedSelectPump: jest.fn(),
  needsStandbyPump: jest.fn(() => false)
}));

jest.mock('../../utils/enhancedCouplingSelection', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../../utils/selectionAlgorithm', () => ({
  selectGearbox: jest.fn(),
  autoSelectGearbox: jest.fn()
}));

// Import the hook and mocked modules after mocks are set up
import useSelectionHandlers from '../useSelectionHandlers';
import { logger as mockLogger } from '../../config/logging';
import { correctPriceData as mockCorrectPriceData } from '../../utils/priceManager';
import { getGWPackagePriceConfig as mockGetGWPackagePriceConfig } from '../../data/packagePriceConfig';

describe('useSelectionHandlers', () => {
  // Default mock setters
  const createMockSetters = () => ({
    setSelectionResult: jest.fn(),
    setSelectedGearboxIndex: jest.fn(),
    setSelectedComponents: jest.fn(),
    setSelectionHistory: jest.fn(),
    setSelectionDiagnostics: jest.fn(),
    setPriceData: jest.fn(),
    setPackagePrice: jest.fn(),
    setMarketPrice: jest.fn(),
    setTotalMarketPrice: jest.fn(),
    setQuotation: jest.fn(),
    setAgreement: jest.fn(),
    setContract: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    setSuccess: jest.fn(),
    setActiveTab: jest.fn(),
  });

  // Default hook params with complete appDataState
  const createDefaultParams = (overrides = {}) => ({
    selectionResult: null,
    appDataState: {
      flexibleCouplings: [],
      standbyPumps: [],
    },
    engineData: { power: '200', speed: '1800' },
    requirementData: {},
    gearboxType: 'standard',
    hybridConfig: {},
    selectedComponents: {},
    priceData: {},
    projectInfo: {},
    isFormValid: false,
    getEffectiveConfig: jest.fn(() => ({})),
    calculateAllPrices: jest.fn(() => ({
      packagePrice: 0,
      marketPrice: 0,
      totalMarketPrice: 0,
    })),
    ...createMockSetters(),
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up the mock implementation for correctPriceData
    mockCorrectPriceData.mockImplementation((gearbox) => {
      if (!gearbox) return gearbox;
      return { ...gearbox, correctedPrice: true };
    });
  });

  describe('hook initialization', () => {
    it('returns an object with handler functions', () => {
      const { result } = renderHook(() =>
        useSelectionHandlers(createDefaultParams())
      );

      expect(result.current).toBeDefined();
      expect(typeof result.current.handleGearboxSelection).toBe('function');
    });
  });

  describe('handleGearboxSelection - validation', () => {
    it('sets error when selectionResult is null', () => {
      const setError = jest.fn();
      const { result } = renderHook(() =>
        useSelectionHandlers(createDefaultParams({
          selectionResult: null,
          setError,
        }))
      );

      act(() => {
        result.current.handleGearboxSelection(0);
      });

      expect(setError).toHaveBeenCalledWith('无法选择齿轮箱，请先进行选型。');
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('sets error when recommendations is not an array', () => {
      const setError = jest.fn();
      const { result } = renderHook(() =>
        useSelectionHandlers(createDefaultParams({
          selectionResult: { recommendations: 'not an array' },
          setError,
        }))
      );

      act(() => {
        result.current.handleGearboxSelection(0);
      });

      expect(setError).toHaveBeenCalledWith('无法选择齿轮箱，选型结果格式错误。');
    });

    it('sets error when index is negative', () => {
      const setError = jest.fn();
      const { result } = renderHook(() =>
        useSelectionHandlers(createDefaultParams({
          selectionResult: {
            recommendations: [{ model: 'HCM400A' }]
          },
          setError,
        }))
      );

      act(() => {
        result.current.handleGearboxSelection(-1);
      });

      expect(setError).toHaveBeenCalledWith(expect.stringContaining('索引 -1 超出范围'));
    });

    it('sets error when index is too large', () => {
      const setError = jest.fn();
      const { result } = renderHook(() =>
        useSelectionHandlers(createDefaultParams({
          selectionResult: {
            recommendations: [{ model: 'HCM400A' }]
          },
          setError,
        }))
      );

      act(() => {
        result.current.handleGearboxSelection(5);
      });

      expect(setError).toHaveBeenCalledWith(expect.stringContaining('索引 5 超出范围'));
    });
  });

  describe('handleGearboxSelection - selection flow', () => {
    it('sets selectedGearboxIndex at valid index', () => {
      const setSelectedGearboxIndex = jest.fn();
      const recommendations = [
        { model: 'HCM400A', price: 45000 },
        { model: 'HCM500A', price: 55000 },
      ];

      const { result } = renderHook(() =>
        useSelectionHandlers(createDefaultParams({
          selectionResult: { recommendations },
          setSelectedGearboxIndex,
        }))
      );

      act(() => {
        result.current.handleGearboxSelection(1);
      });

      expect(setSelectedGearboxIndex).toHaveBeenCalledWith(1);
    });

    it('logs selection at valid index', () => {
      const recommendations = [
        { model: 'HCM400A' },
        { model: 'HCM500A' },
      ];

      const { result } = renderHook(() =>
        useSelectionHandlers(createDefaultParams({
          selectionResult: { recommendations },
        }))
      );

      act(() => {
        result.current.handleGearboxSelection(1);
      });

      expect(mockLogger.log).toHaveBeenCalledWith(
        expect.stringContaining('User selected gearbox at index 1'),
        'HCM500A'
      );
    });

    it('shows warning for partial match gearbox', () => {
      const setError = jest.fn();
      const setSuccess = jest.fn();
      const recommendations = [{
        model: 'HCM400A',
        isPartialMatch: true,
        failureReason: '速比不完全匹配'
      }];

      const { result } = renderHook(() =>
        useSelectionHandlers(createDefaultParams({
          selectionResult: { recommendations },
          setError,
          setSuccess,
        }))
      );

      act(() => {
        result.current.handleGearboxSelection(0);
      });

      expect(setSuccess).toHaveBeenCalledWith('');
      expect(setError).toHaveBeenCalledWith(
        expect.stringContaining('部分匹配结果')
      );
    });

    it('clears error for non-partial match gearbox', () => {
      const setError = jest.fn();
      const recommendations = [{ model: 'HCM400A', isPartialMatch: false }];

      const { result } = renderHook(() =>
        useSelectionHandlers(createDefaultParams({
          selectionResult: { recommendations },
          setError,
        }))
      );

      act(() => {
        result.current.handleGearboxSelection(0);
      });

      expect(setError).toHaveBeenCalledWith('');
    });
  });

  describe('hook stability', () => {
    it('handler functions are stable between renders', () => {
      const params = createDefaultParams();
      const { result, rerender } = renderHook(() =>
        useSelectionHandlers(params)
      );

      const firstHandler = result.current.handleGearboxSelection;

      rerender();

      expect(result.current.handleGearboxSelection).toBe(firstHandler);
    });
  });
});
