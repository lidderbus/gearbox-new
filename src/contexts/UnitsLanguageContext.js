// src/contexts/UnitsLanguageContext.js
// 配套设备模块 — 单位制 (SI/英制) + 语言 (中/英) 全局偏好。
// 仅作用于此模块的 Provider 包裹范围, 不影响全局 App。

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const STORAGE_KEY = 'auxiliary_units_lang_pref';

const DEFAULT_PREF = {
  unitSystem: 'SI',     // 'SI' | 'imperial'
  language: 'zh'        // 'zh' | 'en'
};

// 关键术语字典 (zh ↔ en)
const DICT = {
  zh: {
    flow: '流量',
    pressure: '压力',
    power: '功率',
    speed: '转速',
    torque: '扭矩',
    weight: '重量',
    voltage: '电压',
    frequency: '频率',
    phase: '相数',
    ipRating: '防护等级',
    exRating: '防爆等级',
    npsh: 'NPSH',
    oilViscosity: '油粘度',
    certifications: '船检证书',
    marketPrice: '市场价',
    factoryPrice: '出厂价',
    model: '型号',
    series: '系列',
    inquiry: '询价',
    pumpSelection: '备用泵选型',
    couplingSelection: '联轴器配套',
    select: '选择',
    selected: '已选',
    compare: '对比'
  },
  en: {
    flow: 'Flow',
    pressure: 'Pressure',
    power: 'Power',
    speed: 'Speed',
    torque: 'Torque',
    weight: 'Weight',
    voltage: 'Voltage',
    frequency: 'Frequency',
    phase: 'Phases',
    ipRating: 'IP Rating',
    exRating: 'Ex Rating',
    npsh: 'NPSH',
    oilViscosity: 'Oil Viscosity',
    certifications: 'Class. Certificates',
    marketPrice: 'Market Price',
    factoryPrice: 'Factory Price',
    model: 'Model',
    series: 'Series',
    inquiry: 'Inquire',
    pumpSelection: 'Standby Pump Selection',
    couplingSelection: 'Coupling Match',
    select: 'Select',
    selected: 'Selected',
    compare: 'Compare'
  }
};

const Ctx = createContext({
  ...DEFAULT_PREF,
  setUnitSystem: () => {},
  setLanguage: () => {},
  t: (k) => k
});

export const UnitsLanguageProvider = ({ children }) => {
  const [pref, setPref] = useState(DEFAULT_PREF);

  // 初始化：localStorage → state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setPref(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) { /* ignore */ }
  }, []);

  // 持久化
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pref)); }
    catch (e) { /* ignore quota */ }
  }, [pref]);

  const setUnitSystem = useCallback((unitSystem) => {
    setPref(prev => ({ ...prev, unitSystem }));
  }, []);

  const setLanguage = useCallback((language) => {
    setPref(prev => ({ ...prev, language }));
  }, []);

  const t = useCallback(
    (key, fallback) => DICT[pref.language]?.[key] || fallback || key,
    [pref.language]
  );

  const value = useMemo(() => ({
    ...pref,
    setUnitSystem,
    setLanguage,
    t
  }), [pref, setUnitSystem, setLanguage, t]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useUnitsLanguage = () => useContext(Ctx);

/**
 * 嵌入式工具栏：单位制 + 语言切换按钮组
 */
export const UnitsLanguageToggle = ({ className = '' }) => {
  const { unitSystem, language, setUnitSystem, setLanguage } = useUnitsLanguage();
  return (
    <div className={`d-inline-flex align-items-center ${className}`} style={{ gap: '0.5rem' }}>
      <div className="btn-group btn-group-sm" role="group" aria-label="Unit system">
        <button
          type="button"
          className={`btn btn-outline-secondary ${unitSystem === 'SI' ? 'active' : ''}`}
          onClick={() => setUnitSystem('SI')}
        >SI</button>
        <button
          type="button"
          className={`btn btn-outline-secondary ${unitSystem === 'imperial' ? 'active' : ''}`}
          onClick={() => setUnitSystem('imperial')}
        >英制</button>
      </div>
      <div className="btn-group btn-group-sm" role="group" aria-label="Language">
        <button
          type="button"
          className={`btn btn-outline-secondary ${language === 'zh' ? 'active' : ''}`}
          onClick={() => setLanguage('zh')}
        >中</button>
        <button
          type="button"
          className={`btn btn-outline-secondary ${language === 'en' ? 'active' : ''}`}
          onClick={() => setLanguage('en')}
        >EN</button>
      </div>
    </div>
  );
};

export default UnitsLanguageProvider;
