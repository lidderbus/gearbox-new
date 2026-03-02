/**
 * 船用轴系计算规范数据库
 * 移植自 erp-dashboard/public/js/standards-database.js → ES module
 *
 * 支持规范: CCS内河/海船, ABS, DNV, LR, BV, DNV-GL增强版
 */

export const STANDARDS_DATABASE = {
  CCS_INLAND_2016: {
    code: 'CCS_INLAND_2016',
    name: 'CCS内河规范2016',
    fullName: '中国船级社《钢质内河船舶建造规范》2016',
    region: 'China',
    type: 'inland',
    shaftFormula: {
      formula: 'd = F × K × [Ne × 560 / ne / (Rm + 160)]^(1/3)',
      coefficients: {
        F: { propellerShaft: 100, intermediateShaft: 95, thrustShaft: 100 },
        K: { propellerShaft: 1.26, intermediateShaft: 1.0, thrustShaft: 1.0, sealingSection: 1.15 },
        materialFactor: { stainlessSteel: 0.9, carbonSteel: 1.0 }
      }
    },
    flangeRequirements: { thicknessRatio: 0.2, radiusRatio: 0.08 },
    bearingRequirements: { sternBearingLength: 2.0, bracketBearingLength: 4.0 },
    torsionalVibration: {
      forbiddenZone: { min: 0.90, max: 1.03 },
      operatingMargin: 0.10,
      dampingMethod: 'standard',
      analysisRequired: true,
      allowableStress: {
        intermediate: { formula: 'tau_c = 18 + Rm/36', transientFactor: 1.7 },
        propeller: { formula: 'tau_c = 18*sqrt(560/(Rm+160)) + Rm/48', transientFactor: 1.7 }
      }
    },
    taperRatios: ['1:12', '1:15', '1:20'],
    defaultTaper: '1:12'
  },

  CCS_MARINE_2024: {
    code: 'CCS_MARINE_2024',
    name: 'CCS海船规范2024',
    fullName: '中国船级社《钢质海船入级规范》2024',
    region: 'China',
    type: 'marine',
    shaftFormula: {
      formula: 'd = F × K × [Ne × 560 / ne / (Rm + 160)]^(1/3)',
      coefficients: {
        F: { propellerShaft: 100, intermediateShaft: 95, thrustShaft: 100 },
        K: { propellerShaft: 1.26, intermediateShaft: 1.0, thrustShaft: 1.0, sealingSection: 1.15 },
        materialFactor: { stainlessSteel: 0.9, carbonSteel: 1.0 }
      }
    },
    flangeRequirements: { thicknessRatio: 0.2, radiusRatio: 0.08 },
    bearingRequirements: { sternBearingLength: 2.0, bracketBearingLength: 4.0 },
    torsionalVibration: {
      forbiddenZone: { min: 0.85, max: 1.05 },
      operatingMargin: 0.15,
      dampingMethod: 'standard',
      analysisRequired: true,
      allowableStress: {
        intermediate: { formula: 'tau_c = 18 + Rm/36', transientFactor: 1.7 },
        propeller: { formula: 'tau_c = 18*sqrt(560/(Rm+160)) + Rm/48', transientFactor: 1.7 }
      }
    },
    taperRatios: ['1:12', '1:15', '1:20'],
    defaultTaper: '1:12'
  },

  ABS_2023: {
    code: 'ABS_2023',
    name: 'ABS Rules 2023',
    fullName: 'American Bureau of Shipping Rules 2023',
    region: 'USA',
    type: 'marine',
    shaftFormula: {
      formula: 'd = k × [P / n]^(1/3) × c',
      coefficients: { k: 100, c: { forgedSteel: 1.0, castSteel: 1.08, stainlessSteel: 0.95 } }
    },
    flangeRequirements: { thicknessRatio: 0.2, radiusRatio: 0.075 },
    bearingRequirements: { sternBearingLength: 2.0, bracketBearingLength: 4.0 },
    torsionalVibration: {
      forbiddenZone: { min: 0.80, max: 1.05 },
      operatingMargin: 0.20,
      dampingMethod: 'holzer',
      analysisRequired: true,
      allowableStress: {
        intermediate: { formula: 'tau_c = 18 + Rm/36', transientFactor: 1.7 },
        propeller: { formula: 'tau_c = 18*sqrt(560/(Rm+160)) + Rm/48', transientFactor: 1.7 }
      }
    },
    taperRatios: ['1:12', '1:16', '1:20'],
    defaultTaper: '1:12'
  },

  DNV_2024: {
    code: 'DNV_2024',
    name: 'DNV Rules 2024',
    fullName: 'Det Norske Veritas Rules 2024',
    region: 'Norway',
    type: 'marine',
    shaftFormula: {
      formula: 'd = F × [P / (n × σ)]^(1/3)',
      coefficients: { F: { propellerShaft: 160, intermediateShaft: 152, thrustShaft: 160 } }
    },
    flangeRequirements: { thicknessRatio: 0.22, radiusRatio: 0.08 },
    bearingRequirements: { sternBearingLength: 2.0, bracketBearingLength: 3.5 },
    torsionalVibration: {
      forbiddenZone: { min: 0.80, max: 1.05 },
      operatingMargin: 0.20,
      dampingMethods: ['Archer', 'Frahm', 'Schwaneke'],
      defaultDampingMethod: 'Archer',
      analysisRequired: true,
      allowableStress: {
        intermediate: { formula: 'tau_c = 18 + Rm/36', transientFactor: 1.7 },
        propeller: { formula: 'tau_c = 18*sqrt(560/(Rm+160)) + Rm/48', transientFactor: 1.7 }
      }
    },
    taperRatios: ['1:12', '1:15', '1:20'],
    defaultTaper: '1:15'
  },

  LR_2024: {
    code: 'LR_2024',
    name: 'LR Rules 2024',
    fullName: "Lloyd's Register Rules 2024",
    region: 'UK',
    type: 'marine',
    shaftFormula: {
      formula: 'd = K × [P / n]^(1/3)',
      coefficients: { K: { propellerShaft: 104, intermediateShaft: 99, thrustShaft: 104 } }
    },
    torsionalVibration: {
      forbiddenZone: { min: 0.85, max: 1.05 },
      operatingMargin: 0.15,
      analysisRequired: true,
      allowableStress: {
        intermediate: { formula: 'tau_c = 18 + Rm/36', transientFactor: 1.7 },
        propeller: { formula: 'tau_c = 18*sqrt(560/(Rm+160)) + Rm/48', transientFactor: 1.7 }
      }
    },
    taperRatios: ['1:12', '1:16', '1:20'],
    defaultTaper: '1:12'
  },

  BV_2024: {
    code: 'BV_2024',
    name: 'BV Rules 2024',
    fullName: 'Bureau Veritas Rules 2024',
    region: 'France',
    type: 'marine',
    shaftFormula: {
      formula: 'd = k × [P / n]^(1/3) × c',
      coefficients: { k: 100, c: 1.0 }
    },
    torsionalVibration: {
      forbiddenZone: { min: 0.85, max: 1.05 },
      operatingMargin: 0.15,
      analysisRequired: true,
      allowableStress: {
        intermediate: { formula: 'tau_c = 18 + Rm/36', transientFactor: 1.7 },
        propeller: { formula: 'tau_c = 18*sqrt(560/(Rm+160)) + Rm/48', transientFactor: 1.7 }
      }
    },
    taperRatios: ['1:12', '1:15', '1:20'],
    defaultTaper: '1:12'
  },

  DNV_GL_2024: {
    code: 'DNV_GL_2024',
    name: 'DNV-GL Rules 2024',
    fullName: 'DNV-GL Enhanced Torsional Vibration Analysis 2024',
    region: 'Norway',
    type: 'marine',
    shaftFormula: {
      formula: 'd = F × [P / (n × σ)]^(1/3)',
      coefficients: { F: { propellerShaft: 160, intermediateShaft: 152, thrustShaft: 160 } }
    },
    flangeRequirements: { thicknessRatio: 0.22, radiusRatio: 0.08 },
    bearingRequirements: { sternBearingLength: 2.0, bracketBearingLength: 3.5 },
    torsionalVibration: {
      forbiddenZone: { min: 0.80, max: 1.05 },
      operatingMargin: 0.15,
      dampingMethods: ['Archer', 'Frahm', 'Schwaneke', 'Wilson-Ker-Wilson'],
      defaultDampingMethod: 'Archer',
      analysisRequired: true,
      allowableStress: {
        intermediate: { formula: 'tau_c = 18 + Rm/36', transientFactor: 1.7 },
        propeller: { formula: 'tau_c = 18*sqrt(560/(Rm+160)) + Rm/48', transientFactor: 1.7 }
      },
      dualFuelRequirements: {
        gasMode: { marginMultiplier: 1.2, forbiddenZone: { min: 0.75, max: 1.08 } },
        dieselMode: { marginMultiplier: 1.0, forbiddenZone: { min: 0.80, max: 1.05 } }
      },
      iceClass: {
        PC1: { randomLoadFactor: 1.5, peakTorqueMultiplier: 3.0 },
        PC2: { randomLoadFactor: 1.45, peakTorqueMultiplier: 2.9 },
        PC3: { randomLoadFactor: 1.4, peakTorqueMultiplier: 2.8 },
        PC4: { randomLoadFactor: 1.35, peakTorqueMultiplier: 2.7 },
        PC5: { randomLoadFactor: 1.3, peakTorqueMultiplier: 2.5 },
        PC6: { randomLoadFactor: 1.25, peakTorqueMultiplier: 2.3 },
        PC7: { randomLoadFactor: 1.2, peakTorqueMultiplier: 2.0 }
      }
    },
    taperRatios: ['1:12', '1:15', '1:20'],
    defaultTaper: '1:15'
  }
};

/** 获取规范列表 (用于下拉选择器) */
export function getStandardsList() {
  return Object.keys(STANDARDS_DATABASE).map(key => ({
    code: key,
    name: STANDARDS_DATABASE[key].name,
    fullName: STANDARDS_DATABASE[key].fullName,
    region: STANDARDS_DATABASE[key].region,
    type: STANDARDS_DATABASE[key].type
  }));
}

/** 获取规范详情 */
export function getStandard(code) {
  return STANDARDS_DATABASE[code] || STANDARDS_DATABASE.CCS_INLAND_2016;
}

/** 获取禁区范围 */
export function getForbiddenZone(code) {
  const standard = getStandard(code);
  return standard.torsionalVibration.forbiddenZone;
}

/**
 * 检查转速是否在禁区内
 * @param {number} operatingSpeed - 工作转速 (rpm)
 * @param {number} criticalSpeed - 临界转速 (rpm)
 * @param {string} standardCode - 规范代码
 * @returns {Object} 检查结果
 */
export function checkForbiddenZone(operatingSpeed, criticalSpeed, standardCode) {
  const standard = getStandard(standardCode);
  const zone = standard.torsionalVibration.forbiddenZone;
  const ratio = operatingSpeed / criticalSpeed;
  const isInForbiddenZone = ratio >= zone.min && ratio <= zone.max;
  const margin = Math.abs(1 - ratio) * 100;

  return {
    ratio,
    isInForbiddenZone,
    margin,
    zoneMin: zone.min,
    zoneMax: zone.max,
    status: isInForbiddenZone ? 'danger' : (margin < 15 ? 'warning' : 'safe'),
    message: isInForbiddenZone
      ? `工作转速在禁区内 (${(zone.min * 100).toFixed(0)}%~${(zone.max * 100).toFixed(0)}%)`
      : `共振裕度 ${margin.toFixed(1)}%`
  };
}

/** 获取轴径计算系数 */
export function getShaftCoefficients(standardCode, shaftType, material) {
  const standard = getStandard(standardCode);
  const formula = standard.shaftFormula;
  let F = 100, K = 1.0, materialFactor = 1.0;
  if (formula.coefficients.F) F = formula.coefficients.F[shaftType] || 100;
  if (formula.coefficients.K) K = formula.coefficients.K[shaftType] || 1.0;
  if (formula.coefficients.materialFactor) {
    materialFactor = material === 'stainlessSteel'
      ? (formula.coefficients.materialFactor.stainlessSteel || 0.9) : 1.0;
  }
  return { F, K, materialFactor };
}

export default STANDARDS_DATABASE;
