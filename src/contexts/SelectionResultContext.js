// src/contexts/SelectionResultContext.js
// Global selection result context for cross-module data sharing

import React, { createContext, useContext, useState, useCallback } from 'react';

const SelectionResultContext = createContext({
  selectedGearbox: null,
  engineData: {},
  requirementData: {},
  selectionResult: null,
  couplingResult: null,
  pumpResult: null,
  setSelectedGearbox: () => {},
  setSelectionResult: () => {},
  setCouplingResult: () => {},
  setPumpResult: () => {},
  setEngineData: () => {},
  setRequirementData: () => {},
});

export const SelectionResultProvider = ({ children, value }) => {
  // Allow external state injection (from App.js) or use internal state
  const [internalGearbox, setInternalGearbox] = useState(null);
  const [internalResult, setInternalResult] = useState(null);
  const [internalCoupling, setInternalCoupling] = useState(null);
  const [internalPump, setInternalPump] = useState(null);
  const [internalEngine, setInternalEngine] = useState({});
  const [internalReq, setInternalReq] = useState({});

  const contextValue = {
    selectedGearbox: value?.selectedGearbox ?? internalGearbox,
    engineData: value?.engineData ?? internalEngine,
    requirementData: value?.requirementData ?? internalReq,
    selectionResult: value?.selectionResult ?? internalResult,
    couplingResult: value?.couplingResult ?? internalCoupling,
    pumpResult: value?.pumpResult ?? internalPump,
    setSelectedGearbox: value?.setSelectedGearbox ?? setInternalGearbox,
    setSelectionResult: value?.setSelectionResult ?? setInternalResult,
    setCouplingResult: value?.setCouplingResult ?? setInternalCoupling,
    setPumpResult: value?.setPumpResult ?? setInternalPump,
    setEngineData: value?.setEngineData ?? setInternalEngine,
    setRequirementData: value?.setRequirementData ?? setInternalReq,
  };

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
