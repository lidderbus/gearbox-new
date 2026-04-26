// src/utils/unitConverter.js
// 配套设备模块 — SI / 英制 单位转换工具
//
// 设计：以 SI 为内部存储基准, 仅在显示层做转换。
// 数值精度按各物理量典型工程精度保留 1-2 位小数。

const TABLE = {
  // power
  kW:   { hp:    { factor: 1.34102 } },
  hp:   { kW:    { factor: 1 / 1.34102 } },
  // torque
  Nm:   { 'lbf·ft': { factor: 0.737562 } },
  'lbf·ft': { Nm: { factor: 1 / 0.737562 } },
  // pressure
  MPa:  { psi:   { factor: 145.038 } },
  psi:  { MPa:   { factor: 1 / 145.038 } },
  // flow
  'L/min': { gpm: { factor: 0.264172 } },
  gpm:    { 'L/min': { factor: 1 / 0.264172 } },
  // length
  mm:   { in:    { factor: 1 / 25.4 } },
  in:   { mm:    { factor: 25.4 } },
  // mass
  kg:   { lb:    { factor: 2.20462 } },
  lb:   { kg:    { factor: 1 / 2.20462 } }
};

const SI_TO_IMPERIAL = {
  kW: 'hp',
  Nm: 'lbf·ft',
  MPa: 'psi',
  'L/min': 'gpm',
  mm: 'in',
  kg: 'lb'
};
const IMPERIAL_TO_SI = Object.fromEntries(Object.entries(SI_TO_IMPERIAL).map(([k, v]) => [v, k]));

/**
 * 转换数值
 * @param {number} value
 * @param {string} fromUnit
 * @param {string} toUnit
 * @returns {number|null}
 */
export const convertUnit = (value, fromUnit, toUnit) => {
  if (value == null || !Number.isFinite(Number(value))) return null;
  if (fromUnit === toUnit) return Number(value);
  const map = TABLE[fromUnit];
  if (!map || !map[toUnit]) return null;
  return Number(value) * map[toUnit].factor;
};

/**
 * 在指定单位制下显示数值
 * @param {number} value
 * @param {string} baseUnit - 内部存储的 SI 单位
 * @param {'SI'|'imperial'} system
 * @param {Object} [opts] - { decimals=2, withUnit=true }
 * @returns {string}
 */
export const formatValue = (value, baseUnit, system = 'SI', opts = {}) => {
  const { decimals = 2, withUnit = true } = opts;
  if (value == null || value === '' || !Number.isFinite(Number(value))) return '—';
  let displayUnit = baseUnit;
  let displayValue = Number(value);
  if (system === 'imperial' && SI_TO_IMPERIAL[baseUnit]) {
    displayUnit = SI_TO_IMPERIAL[baseUnit];
    const converted = convertUnit(value, baseUnit, displayUnit);
    if (converted != null) displayValue = converted;
  } else if (system === 'SI' && IMPERIAL_TO_SI[baseUnit]) {
    displayUnit = IMPERIAL_TO_SI[baseUnit];
    const converted = convertUnit(value, baseUnit, displayUnit);
    if (converted != null) displayValue = converted;
  }
  const fixed = displayValue.toFixed(decimals);
  return withUnit ? `${fixed} ${displayUnit}` : fixed;
};

/**
 * 取得指定 SI 单位在当前单位制下的显示符号
 */
export const displayUnit = (baseUnit, system = 'SI') =>
  (system === 'imperial' && SI_TO_IMPERIAL[baseUnit]) ? SI_TO_IMPERIAL[baseUnit] : baseUnit;

export default {
  convertUnit,
  formatValue,
  displayUnit,
  SI_TO_IMPERIAL,
  IMPERIAL_TO_SI
};
