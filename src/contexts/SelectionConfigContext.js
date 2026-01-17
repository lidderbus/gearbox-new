// src/contexts/SelectionConfigContext.js
/**
 * 选型配置状态管理Context
 * 提供全局配置状态和localStorage持久化
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  DEFAULT_SCORING_WEIGHTS,
  DEFAULT_TOLERANCES,
  PRESET_CONFIGURATIONS,
  APPLICATION_TOLERANCES,
  validateWeights,
  validateTolerances,
  normalizeWeights,
  calculateAdaptiveTolerances
} from '../config/selectionConfig';

// localStorage key
const STORAGE_KEY = 'gearbox_selection_config';

// 初始状态
const initialState = {
  // 评分权重配置
  weights: { ...DEFAULT_SCORING_WEIGHTS },
  activePreset: 'balanced',

  // 容差配置
  tolerances: { ...DEFAULT_TOLERANCES },
  activeApplication: 'propulsion',
  useAdaptiveTolerances: true,

  // 高级设置展开状态
  showAdvancedWeights: false,
  showAdvancedTolerances: false,

  // 配置有效性
  weightsValid: true,
  tolerancesValid: true,
  validationErrors: []
};

// Action Types
const ActionTypes = {
  SET_WEIGHTS: 'SET_WEIGHTS',
  SET_PRESET: 'SET_PRESET',
  SET_TOLERANCES: 'SET_TOLERANCES',
  SET_APPLICATION: 'SET_APPLICATION',
  SET_ADAPTIVE_MODE: 'SET_ADAPTIVE_MODE',
  TOGGLE_ADVANCED_WEIGHTS: 'TOGGLE_ADVANCED_WEIGHTS',
  TOGGLE_ADVANCED_TOLERANCES: 'TOGGLE_ADVANCED_TOLERANCES',
  RESET_TO_DEFAULTS: 'RESET_TO_DEFAULTS',
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE'
};

// Reducer
function selectionConfigReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_WEIGHTS: {
      const normalized = normalizeWeights(action.payload);
      const validation = validateWeights(normalized);
      return {
        ...state,
        weights: normalized,
        activePreset: 'custom',
        weightsValid: validation.valid,
        validationErrors: validation.errors
      };
    }

    case ActionTypes.SET_PRESET: {
      const preset = PRESET_CONFIGURATIONS[action.payload];
      if (!preset) return state;
      return {
        ...state,
        weights: { ...preset.weights },
        activePreset: action.payload,
        weightsValid: true,
        showAdvancedWeights: false
      };
    }

    case ActionTypes.SET_TOLERANCES: {
      const validation = validateTolerances(action.payload);
      return {
        ...state,
        tolerances: { ...action.payload },
        activeApplication: 'custom',
        tolerancesValid: validation.valid,
        validationErrors: validation.errors
      };
    }

    case ActionTypes.SET_APPLICATION: {
      const app = APPLICATION_TOLERANCES[action.payload];
      if (!app) return state;
      return {
        ...state,
        tolerances: { ...app.tolerances },
        activeApplication: action.payload,
        tolerancesValid: true,
        showAdvancedTolerances: false
      };
    }

    case ActionTypes.SET_ADAPTIVE_MODE:
      return {
        ...state,
        useAdaptiveTolerances: action.payload
      };

    case ActionTypes.TOGGLE_ADVANCED_WEIGHTS:
      return {
        ...state,
        showAdvancedWeights: !state.showAdvancedWeights
      };

    case ActionTypes.TOGGLE_ADVANCED_TOLERANCES:
      return {
        ...state,
        showAdvancedTolerances: !state.showAdvancedTolerances
      };

    case ActionTypes.RESET_TO_DEFAULTS:
      return {
        ...initialState
      };

    case ActionTypes.LOAD_FROM_STORAGE:
      return {
        ...state,
        ...action.payload,
        // 重新验证加载的配置
        weightsValid: validateWeights(action.payload.weights || DEFAULT_SCORING_WEIGHTS).valid,
        tolerancesValid: validateTolerances(action.payload.tolerances || DEFAULT_TOLERANCES).valid
      };

    default:
      return state;
  }
}

// Context
const SelectionConfigContext = createContext(null);

// Provider组件
export function SelectionConfigProvider({ children }) {
  const [state, dispatch] = useReducer(selectionConfigReducer, initialState);

  // 从localStorage加载配置
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: ActionTypes.LOAD_FROM_STORAGE, payload: parsed });
      }
    } catch (error) {
      console.warn('加载选型配置失败:', error);
    }
  }, []);

  // 保存配置到localStorage
  useEffect(() => {
    try {
      const toSave = {
        weights: state.weights,
        activePreset: state.activePreset,
        tolerances: state.tolerances,
        activeApplication: state.activeApplication,
        useAdaptiveTolerances: state.useAdaptiveTolerances
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.warn('保存选型配置失败:', error);
    }
  }, [state.weights, state.activePreset, state.tolerances, state.activeApplication, state.useAdaptiveTolerances]);

  // Actions
  const setWeights = useCallback((weights) => {
    dispatch({ type: ActionTypes.SET_WEIGHTS, payload: weights });
  }, []);

  const setPreset = useCallback((presetId) => {
    dispatch({ type: ActionTypes.SET_PRESET, payload: presetId });
  }, []);

  const setTolerances = useCallback((tolerances) => {
    dispatch({ type: ActionTypes.SET_TOLERANCES, payload: tolerances });
  }, []);

  const setApplication = useCallback((applicationId) => {
    dispatch({ type: ActionTypes.SET_APPLICATION, payload: applicationId });
  }, []);

  const setAdaptiveMode = useCallback((enabled) => {
    dispatch({ type: ActionTypes.SET_ADAPTIVE_MODE, payload: enabled });
  }, []);

  const toggleAdvancedWeights = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_ADVANCED_WEIGHTS });
  }, []);

  const toggleAdvancedTolerances = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_ADVANCED_TOLERANCES });
  }, []);

  const resetToDefaults = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_TO_DEFAULTS });
  }, []);

  // 获取当前有效配置（用于传递给选型算法）
  const getEffectiveConfig = useCallback((inputParams = {}) => {
    let effectiveTolerances = { ...state.tolerances };

    // 如果启用自适应容差，根据输入参数调整
    if (state.useAdaptiveTolerances && state.activeApplication !== 'custom') {
      effectiveTolerances = calculateAdaptiveTolerances(
        state.activeApplication,
        inputParams
      );
    }

    return {
      scoringWeights: { ...state.weights },
      tolerances: effectiveTolerances,
      presetInfo: {
        weightPreset: state.activePreset,
        applicationPreset: state.activeApplication,
        isAdaptive: state.useAdaptiveTolerances
      }
    };
  }, [state.weights, state.tolerances, state.activeApplication, state.useAdaptiveTolerances]);

  const value = {
    // State
    ...state,

    // Actions
    setWeights,
    setPreset,
    setTolerances,
    setApplication,
    setAdaptiveMode,
    toggleAdvancedWeights,
    toggleAdvancedTolerances,
    resetToDefaults,

    // Helpers
    getEffectiveConfig
  };

  return (
    <SelectionConfigContext.Provider value={value}>
      {children}
    </SelectionConfigContext.Provider>
  );
}

// Custom Hook
export function useSelectionConfig() {
  const context = useContext(SelectionConfigContext);
  if (!context) {
    throw new Error('useSelectionConfig must be used within a SelectionConfigProvider');
  }
  return context;
}

export default SelectionConfigContext;
