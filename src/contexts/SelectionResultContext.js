// src/contexts/SelectionResultContext.js
// Global selection result context for cross-module data sharing
// P1-3 扩展: 增加 propulsionPayload (CPP/Azimuth/Thruster 选型完成后, Shaft/Torsional/Document 自动读取)

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';

const SESSION_KEY_PROPULSION = 'propulsion_payload';

const SelectionResultContext = createContext({
  selectedGearbox: null,
  engineData: {},
  requirementData: {},
  selectionResult: null,
  couplingResult: null,
  pumpResult: null,
  propulsionPayload: null,
  setSelectedGearbox: () => {},
  setSelectionResult: () => {},
  setCouplingResult: () => {},
  setPumpResult: () => {},
  setEngineData: () => {},
  setRequirementData: () => {},
  setPropulsionPayload: () => {},
  clearPropulsionPayload: () => {},
});

const readPropulsionFromSession = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY_PROPULSION);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const writePropulsionToSession = (payload) => {
  try {
    if (payload) {
      sessionStorage.setItem(SESSION_KEY_PROPULSION, JSON.stringify(payload));
    } else {
      sessionStorage.removeItem(SESSION_KEY_PROPULSION);
    }
  } catch (e) { /* ignore */ }
};

export const SelectionResultProvider = ({ children, value }) => {
  const [internalGearbox, setInternalGearbox] = useState(null);
  const [internalResult, setInternalResult] = useState(null);
  const [internalCoupling, setInternalCoupling] = useState(null);
  const [internalPump, setInternalPump] = useState(null);
  const [internalEngine, setInternalEngine] = useState({});
  const [internalReq, setInternalReq] = useState({});
  // P1-3: 推进系统输出参数 — 跨页面贯通的载荷
  const [internalPropulsion, setInternalPropulsion] = useState(() => readPropulsionFromSession());

  // 初始化时从 sessionStorage 恢复
  useEffect(() => {
    const cached = readPropulsionFromSession();
    if (cached && !internalPropulsion) setInternalPropulsion(cached);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPropulsionPayload = useCallback((payload) => {
    // payload 形态: {source, power, speed, torque, thrust, diameter, ratio, gearboxModel, ...}
    setInternalPropulsion(payload);
    writePropulsionToSession(payload);
  }, []);

  const clearPropulsionPayload = useCallback(() => {
    setInternalPropulsion(null);
    writePropulsionToSession(null);
  }, []);

  const contextValue = useMemo(() => ({
    selectedGearbox: value?.selectedGearbox ?? internalGearbox,
    engineData: value?.engineData ?? internalEngine,
    requirementData: value?.requirementData ?? internalReq,
    selectionResult: value?.selectionResult ?? internalResult,
    couplingResult: value?.couplingResult ?? internalCoupling,
    pumpResult: value?.pumpResult ?? internalPump,
    propulsionPayload: value?.propulsionPayload ?? internalPropulsion,
    setSelectedGearbox: value?.setSelectedGearbox ?? setInternalGearbox,
    setSelectionResult: value?.setSelectionResult ?? setInternalResult,
    setCouplingResult: value?.setCouplingResult ?? setInternalCoupling,
    setPumpResult: value?.setPumpResult ?? setInternalPump,
    setEngineData: value?.setEngineData ?? setInternalEngine,
    setRequirementData: value?.setRequirementData ?? setInternalReq,
    setPropulsionPayload: value?.setPropulsionPayload ?? setPropulsionPayload,
    clearPropulsionPayload: value?.clearPropulsionPayload ?? clearPropulsionPayload,
  }), [value, internalGearbox, internalEngine, internalReq,
    internalResult, internalCoupling, internalPump, internalPropulsion,
    setPropulsionPayload, clearPropulsionPayload]);

  return (
    <SelectionResultContext.Provider value={contextValue}>
      {children}
    </SelectionResultContext.Provider>
  );
};

export const useSelectionResult = () => {
  const context = useContext(SelectionResultContext);
  if (!context) {
    console.warn('useSelectionResult must be used within SelectionResultProvider');
  }
  return context;
};

export default SelectionResultContext;
