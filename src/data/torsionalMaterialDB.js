/**
 * 船用轴系材料数据库 + 联轴器规格库
 * 移植自 erp-dashboard/public/js/material-database.js → ES module
 * 合并 torsional-analysis-engine.js 联轴器刚度/阻尼数据
 */

// ============ 轴系材料 ============
export const SHAFT_MATERIALS = {
  '35_FORGED': {
    id: '35_FORGED', name: '35#锻钢', nameEn: '35# Forged Steel',
    Rm: 530, Re: 315, density: 7850, E: 206000, G: 79000,
    category: 'carbon', coefficient: 1.0, standard: 'GB/T 699'
  },
  '45_STEEL': {
    id: '45_STEEL', name: '45钢', nameEn: '45# Steel',
    Rm: 600, Re: 355, density: 7850, E: 210000, G: 80000,
    category: 'carbon', coefficient: 1.0, standard: 'GB/T 699'
  },
  '40CR': {
    id: '40CR', name: '40Cr合金钢', nameEn: '40Cr Alloy Steel',
    Rm: 785, Re: 540, density: 7850, E: 211000, G: 81000,
    category: 'alloy', coefficient: 0.9, standard: 'GB/T 3077'
  },
  'S30408': {
    id: 'S30408', name: 'S30408不锈钢', nameEn: '304 Stainless Steel',
    Rm: 520, Re: 205, density: 7930, E: 193000, G: 74000,
    category: 'stainless', coefficient: 0.9, standard: 'GB/T 1220'
  },
  'S31603': {
    id: 'S31603', name: 'S31603不锈钢', nameEn: '316L Stainless Steel',
    Rm: 485, Re: 170, density: 7980, E: 193000, G: 74000,
    category: 'stainless', coefficient: 0.9, standard: 'GB/T 1220'
  },
  '42CRMO': {
    id: '42CRMO', name: '42CrMo合金钢', nameEn: '42CrMo Alloy Steel',
    Rm: 1080, Re: 930, density: 7850, E: 212000, G: 82000,
    category: 'alloy', coefficient: 0.9, standard: 'GB/T 3077'
  }
};

// ============ 联轴器数据库 (含刚度/阻尼/惯量) ============
export const COUPLING_DATABASE = {
  // HGTQ系列 — 高扭矩齿式弹性联轴器
  'HGTQ400': { series: 'HGTQ', name: 'HGTQ400', stiffness: 25.7, damping: 1.13, maxTorque: 4000, inertia: 0.8, maxSpeed: 2500 },
  'HGTQ450': { series: 'HGTQ', name: 'HGTQ450', stiffness: 35.2, damping: 1.15, maxTorque: 5500, inertia: 1.2, maxSpeed: 2500 },
  'HGTQ500': { series: 'HGTQ', name: 'HGTQ500', stiffness: 48.5, damping: 1.18, maxTorque: 7500, inertia: 1.8, maxSpeed: 2200 },
  'HGTQ560': { series: 'HGTQ', name: 'HGTQ560', stiffness: 65.3, damping: 1.20, maxTorque: 10000, inertia: 2.5, maxSpeed: 2200 },
  'HGTQ630': { series: 'HGTQ', name: 'HGTQ630', stiffness: 89.7, damping: 1.22, maxTorque: 14000, inertia: 3.5, maxSpeed: 2000 },
  'HGTQ710': { series: 'HGTQ', name: 'HGTQ710', stiffness: 125.0, damping: 1.25, maxTorque: 20000, inertia: 5.0, maxSpeed: 1800 },
  'HGTQ800': { series: 'HGTQ', name: 'HGTQ800', stiffness: 175.0, damping: 1.27, maxTorque: 28000, inertia: 7.5, maxSpeed: 1500 },
  // HGT系列
  'HGT400':  { series: 'HGT', name: 'HGT400',  stiffness: 32.0, damping: 1.10, maxTorque: 4500, inertia: 0.9, maxSpeed: 2500 },
  'HGT450':  { series: 'HGT', name: 'HGT450',  stiffness: 45.0, damping: 1.12, maxTorque: 6000, inertia: 1.4, maxSpeed: 2500 },
  'HGT500':  { series: 'HGT', name: 'HGT500',  stiffness: 62.0, damping: 1.15, maxTorque: 8500, inertia: 2.0, maxSpeed: 2200 },
  'HGT560':  { series: 'HGT', name: 'HGT560',  stiffness: 85.0, damping: 1.18, maxTorque: 12000, inertia: 3.0, maxSpeed: 2000 },
  'HGT630':  { series: 'HGT', name: 'HGT630',  stiffness: 115.0, damping: 1.20, maxTorque: 16000, inertia: 4.2, maxSpeed: 1800 },
  // HGTHT系列 — 特殊高弹
  'HGTHT4.5/14': { series: 'HGTHT', name: 'HGTHT4.5/14', stiffness: 36.0, damping: 1.15, maxTorque: 1800, inertia: 0.305, maxSpeed: 3000 }
};

// ============ 船型预设 ============
export const VESSEL_PRESETS = {
  '33.2m': {
    name: '33.2m 搜救船',
    motorPower: 480, motorSpeed: 1800, gearRatio: 2.5,
    shaftDiameter: 100, shaftLength: 4500,
    materialId: '45_STEEL', materialStrength: 600,
    couplingModel: 'HGTQ560',
    motorInertia: 2.5, propellerInertia: 4.5, bladeCount: 4, cylinderCount: 6
  },
  '34.6m': {
    name: '34.6m 搜救船',
    motorPower: 400, motorSpeed: 1800, gearRatio: 2.625,
    shaftDiameter: 95, shaftLength: 4800,
    materialId: '45_STEEL', materialStrength: 600,
    couplingModel: 'HGTQ500',
    motorInertia: 2.0, propellerInertia: 5.0, bladeCount: 4, cylinderCount: 6
  },
  '36m': {
    name: '36m 搜救船',
    motorPower: 450, motorSpeed: 1800, gearRatio: 2.625,
    shaftDiameter: 100, shaftLength: 5200,
    materialId: '45_STEEL', materialStrength: 600,
    couplingModel: 'HGTQ560',
    motorInertia: 2.2, propellerInertia: 5.5, bladeCount: 4, cylinderCount: 6
  },
  '38.1m': {
    name: '38.1m 搜救船',
    motorPower: 400, motorSpeed: 1800, gearRatio: 2.95,
    shaftDiameter: 95, shaftLength: 5500,
    materialId: '45_STEEL', materialStrength: 600,
    couplingModel: 'HGTQ500',
    motorInertia: 2.0, propellerInertia: 6.0, bladeCount: 4, cylinderCount: 6
  },
  // --- 渔船 ---
  'fishing_25m': {
    name: '25m 拖网渔船',
    motorPower: 220, motorSpeed: 1500, gearRatio: 3.0,
    shaftDiameter: 80, shaftLength: 3500,
    materialId: '45_STEEL', materialStrength: 600,
    couplingModel: 'HGTQ400',
    motorInertia: 1.2, propellerInertia: 3.0, bladeCount: 3, cylinderCount: 6
  },
  'fishing_35m': {
    name: '35m 围网渔船',
    motorPower: 350, motorSpeed: 1500, gearRatio: 3.5,
    shaftDiameter: 90, shaftLength: 4200,
    materialId: '45_STEEL', materialStrength: 600,
    couplingModel: 'HGTQ500',
    motorInertia: 1.8, propellerInertia: 4.5, bladeCount: 4, cylinderCount: 6
  },
  // --- 货船 ---
  'cargo_50m': {
    name: '50m 内河货船',
    motorPower: 350, motorSpeed: 1500, gearRatio: 3.5,
    shaftDiameter: 90, shaftLength: 5000,
    materialId: '45_STEEL', materialStrength: 600,
    couplingModel: 'HGTQ500',
    motorInertia: 1.8, propellerInertia: 6.0, bladeCount: 4, cylinderCount: 6
  },
  'cargo_65m': {
    name: '65m 沿海货船',
    motorPower: 600, motorSpeed: 1000, gearRatio: 4.0,
    shaftDiameter: 120, shaftLength: 6500,
    materialId: '45_STEEL', materialStrength: 600,
    couplingModel: 'HGTQ710',
    motorInertia: 3.5, propellerInertia: 8.0, bladeCount: 4, cylinderCount: 6
  },
  // --- 拖轮 ---
  'tug_30m': {
    name: '30m 港作拖轮',
    motorPower: 800, motorSpeed: 1800, gearRatio: 5.0,
    shaftDiameter: 110, shaftLength: 4000,
    materialId: '40CR', materialStrength: 785,
    couplingModel: 'HGTQ710',
    motorInertia: 3.0, propellerInertia: 5.0, bladeCount: 4, cylinderCount: 8
  },
  // --- 客渡船 ---
  'passenger_40m': {
    name: '40m 客渡船',
    motorPower: 500, motorSpeed: 1800, gearRatio: 2.8,
    shaftDiameter: 100, shaftLength: 5000,
    materialId: '45_STEEL', materialStrength: 600,
    couplingModel: 'HGTQ560',
    motorInertia: 2.5, propellerInertia: 5.5, bladeCount: 4, cylinderCount: 6
  },
  // --- 工程船 / 工作艇 ---
  'workboat_20m': {
    name: '20m 工作艇',
    motorPower: 300, motorSpeed: 2100, gearRatio: 2.0,
    shaftDiameter: 75, shaftLength: 3000,
    materialId: '45_STEEL', materialStrength: 600,
    couplingModel: 'HGTQ400',
    motorInertia: 1.0, propellerInertia: 2.0, bladeCount: 3, cylinderCount: 4
  },
  'engineering_45m': {
    name: '45m 工程船',
    motorPower: 700, motorSpeed: 1200, gearRatio: 4.5,
    shaftDiameter: 115, shaftLength: 5500,
    materialId: '40CR', materialStrength: 785,
    couplingModel: 'HGTQ630',
    motorInertia: 3.2, propellerInertia: 7.0, bladeCount: 4, cylinderCount: 6
  },
  // --- 公务艇 ---
  'patrol_28m': {
    name: '28m 公务艇',
    motorPower: 550, motorSpeed: 2100, gearRatio: 2.2,
    shaftDiameter: 85, shaftLength: 3800,
    materialId: '45_STEEL', materialStrength: 600,
    couplingModel: 'HGTQ500',
    motorInertia: 1.5, propellerInertia: 2.8, bladeCount: 4, cylinderCount: 8
  }
};

// ============ 螺栓等级 ============
export const BOLT_GRADES = {
  '8.8':  { name: '8.8级', Rmb: 800, Reb: 640 },
  '10.9': { name: '10.9级', Rmb: 1000, Reb: 900 },
  '12.9': { name: '12.9级', Rmb: 1200, Reb: 1080 },
  'A4-70': { name: 'A4-70不锈钢', Rmb: 700, Reb: 450 },
  'A4-80': { name: 'A4-80不锈钢', Rmb: 800, Reb: 600 }
};

// ============ 辅助函数 ============

/** 获取材料列表 (用于下拉选择器) */
export function getMaterialList() {
  return Object.values(SHAFT_MATERIALS).map(m => ({
    id: m.id, name: m.name, nameEn: m.nameEn, Rm: m.Rm, G: m.G, category: m.category
  }));
}

/** 根据ID获取材料 */
export function getMaterial(id) {
  return SHAFT_MATERIALS[id] || SHAFT_MATERIALS['45_STEEL'];
}

/** 获取联轴器列表 */
export function getCouplingList() {
  return Object.values(COUPLING_DATABASE).map(c => ({
    id: c.name, name: c.name, series: c.series,
    stiffness: c.stiffness, maxTorque: c.maxTorque
  }));
}

/** 根据型号获取联轴器 */
export function getCoupling(model) {
  return COUPLING_DATABASE[model] || COUPLING_DATABASE['HGTQ500'];
}

/** 根据扭矩自动选型联轴器 */
export function selectCoupling(requiredTorqueNm, maxSpeed) {
  const safeTorque = requiredTorqueNm * 1.5;
  const suitable = Object.values(COUPLING_DATABASE)
    .filter(c => c.maxTorque >= safeTorque && c.maxSpeed >= maxSpeed)
    .sort((a, b) => a.maxTorque - b.maxTorque);
  return suitable[0] || null;
}

/** 获取船型预设列表 */
export function getPresetList() {
  return Object.entries(VESSEL_PRESETS).map(([key, p]) => ({
    key, name: p.name
  }));
}

/** 获取船型预设 */
export function getPreset(key) {
  return VESSEL_PRESETS[key] || null;
}

export default { SHAFT_MATERIALS, COUPLING_DATABASE, VESSEL_PRESETS, BOLT_GRADES };
