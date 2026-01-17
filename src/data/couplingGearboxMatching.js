/**
 * 齿轮箱-联轴器匹配映射数据
 * 定义每个联轴器型号对应的推荐齿轮箱型号
 * 数据来源: http://47.99.181.195/coupling-selection-enhanced.html
 */

// 联轴器 -> 齿轮箱 映射
export const couplingGearboxMatching = {
  // HGTH系列 - 增强扭转型
  "HGTH4": ["HC65", "HC85", "HC100", "HC120"],
  "HGTH5": ["HC135", "HC138", "HC140", "HCW138", "HCW140"],
  "HGTH6": ["HC200", "HC201", "HCW200", "HCM200"],
  "HGTH8": ["HC300", "HC301", "HCW300", "HCM300"],
  "HGTH10": ["HC400", "HCW400", "HCM400"],
  "HGTH12": ["HC500", "HCM500"],
  "HGTH14": ["HC600A", "HCM600"],
  "HGTH16": ["HCD600", "HCD600A"],
  "HGTH18": ["HC800", "HCD800"],
  "HGTH20": ["HCD1000", "HCT800"],
  "HGTH25": ["HCT1000", "HCT1100"],
  "HGTH28": ["HC1200", "HC1250"],
  "HGTH32": ["HC1400", "HCQ1400"],
  "HGTH35": ["HC1600", "HCQ1600"],
  "HGTH40": ["HC1800"],

  // HGTL系列 - 中小功率型
  "HGTL1.8": ["HC65", "HC85"],
  "HGTL1.8A": ["HC65", "HC85", "HC100"],
  "HGTL1.8B": ["HC85", "HC100", "HC120"],
  "HGTL2.2": ["HC100", "HC120", "HC135"],
  "HGTL2.2A": ["HC120", "HC135", "HC138"],
  "HGTL3.5": ["HC135", "HC138", "HC140"],
  "HGTL3.5Q": ["HC138", "HC140", "HC200"],

  // HGTLX系列 - 带过载保护
  "HGTLX3.5": ["HC138", "HC140", "HC200"],
  "HGTLX4.5": ["HC200", "HC201", "HCM200"],
  "HGTLX4.9": ["HC200", "HC201", "HCW200"],
  "HGTLX6.0": ["HCM200", "HC300"],
  "HGTLX7.5": ["HCM300", "HC300", "HC301"],
  "HGTLX7.5Q": ["HCM300", "HC301", "HCW300"],
  "HGTLX8.6": ["HCM400", "HC400"],

  // HGTQ系列 - 中大马力齿轮箱
  "HGTQ5": ["HC400", "HCM400", "HCW400"],
  "HGTQ6.3": ["HC500", "HCM500"],
  "HGTQ8": ["HC600A", "HCM600"],
  "HGTQ10": ["HCD600", "HCD600A"],
  "HGTQ12.5": ["HCD800", "HC800"],
  "HGTQ16": ["HCD1000", "HCT800", "HCT900"],
  "HGTQ20": ["HCT1000", "HCT1100"],
  "HGTQ25": ["HC1200", "HC1250", "HCT1200"],
  "HGTQ31.5": ["HC1400", "HCQ1400"],

  // HGT标准系列
  "HGT4": ["HC65", "HC85", "HC100"],
  "HGT5": ["HC120", "HC135", "HC138"],
  "HGT6": ["HC140", "HC200", "HCM200"],
  "HGT8": ["HC300", "HCM300", "HCW300"],
  "HGT10": ["HC400", "HCM400"],
  "HGT12": ["HC500", "HCM500"],
  "HGT14": ["HC600A", "HCM600"],
  "HGT16": ["HCD600", "HCD600A"],
  "HGT18": ["HCD800", "HC800"],
  "HGT20": ["HCD1000", "HCT800"],

  // HGTHB系列 - B型双排并联
  "HGTHB5": ["HC138", "HC140", "HC200"],
  "HGTHB5A": ["HC140", "HC200", "HCM200"],
  "HGTHB8": ["HC300", "HCM300", "HCW300"],
  "HGTHB8A": ["HCM300", "HC301", "HCW300"],
  "HGTHB10": ["HC400", "HCM400", "HCW400"],
  "HGTHB10A": ["HCM400", "HC500"],
  "HGTHB12.5": ["HC500", "HCM500"],
  "HGTHB12.5A": ["HCM500", "HC600A"],

  // HGTHT系列 - 重型
  "HGTHT4": ["HC200", "HCM200", "HCW200"],
  "HGTHT5": ["HC300", "HCM300"],
  "HGTHT6.3": ["HCM400", "HC400"],
  "HGTHT6.3A": ["HC400", "HC500"],
  "HGTHT8.6": ["HC500", "HCM500", "HC600A"]
};

// 齿轮箱 -> 联轴器 反向映射（自动生成）
export const gearboxCouplingMatching = (() => {
  const reverseMap = {};

  Object.entries(couplingGearboxMatching).forEach(([coupling, gearboxes]) => {
    gearboxes.forEach(gearbox => {
      if (!reverseMap[gearbox]) {
        reverseMap[gearbox] = [];
      }
      if (!reverseMap[gearbox].includes(coupling)) {
        reverseMap[gearbox].push(coupling);
      }
    });
  });

  return reverseMap;
})();

/**
 * 根据齿轮箱型号获取推荐的联轴器
 * @param {string} gearboxModel - 齿轮箱型号
 * @returns {string[]} - 推荐的联轴器型号列表
 */
export function getRecommendedCouplings(gearboxModel) {
  // 精确匹配
  if (gearboxCouplingMatching[gearboxModel]) {
    return gearboxCouplingMatching[gearboxModel];
  }

  // 模糊匹配（去掉后缀字母）
  const baseModel = gearboxModel.replace(/[A-Z]$/, '');
  if (gearboxCouplingMatching[baseModel]) {
    return gearboxCouplingMatching[baseModel];
  }

  // 尝试匹配系列
  const seriesMatch = gearboxModel.match(/^(HC[DWMTQSX]*)\d+/);
  if (seriesMatch) {
    const series = seriesMatch[1];
    const matchedCouplings = [];

    Object.entries(gearboxCouplingMatching).forEach(([gearbox, couplings]) => {
      if (gearbox.startsWith(series)) {
        couplings.forEach(c => {
          if (!matchedCouplings.includes(c)) {
            matchedCouplings.push(c);
          }
        });
      }
    });

    if (matchedCouplings.length > 0) {
      return matchedCouplings.slice(0, 5); // 返回最多5个推荐
    }
  }

  return [];
}

/**
 * 根据联轴器型号获取适配的齿轮箱
 * @param {string} couplingModel - 联轴器型号
 * @returns {string[]} - 适配的齿轮箱型号列表
 */
export function getMatchingGearboxes(couplingModel) {
  // 精确匹配
  if (couplingGearboxMatching[couplingModel]) {
    return couplingGearboxMatching[couplingModel];
  }

  // 尝试匹配基础型号（去掉后缀）
  const baseModel = couplingModel.replace(/[A-Z]$/, '');
  if (couplingGearboxMatching[baseModel]) {
    return couplingGearboxMatching[baseModel];
  }

  return [];
}

/**
 * 检查联轴器和齿轮箱是否匹配
 * @param {string} couplingModel - 联轴器型号
 * @param {string} gearboxModel - 齿轮箱型号
 * @returns {boolean} - 是否匹配
 */
export function isMatchingPair(couplingModel, gearboxModel) {
  const matchingGearboxes = getMatchingGearboxes(couplingModel);

  // 精确匹配
  if (matchingGearboxes.includes(gearboxModel)) {
    return true;
  }

  // 模糊匹配（去掉后缀字母）
  const baseGearbox = gearboxModel.replace(/[A-Z]$/, '');
  return matchingGearboxes.some(g => g === baseGearbox || g.replace(/[A-Z]$/, '') === baseGearbox);
}

/**
 * 获取所有联轴器型号
 * @returns {string[]} - 所有联轴器型号列表
 */
export function getAllCouplingModels() {
  return Object.keys(couplingGearboxMatching);
}

/**
 * 获取所有已映射的齿轮箱型号
 * @returns {string[]} - 所有齿轮箱型号列表
 */
export function getAllMappedGearboxes() {
  return Object.keys(gearboxCouplingMatching);
}

/**
 * 获取匹配统计信息
 * @returns {Object} - 统计信息
 */
export function getMatchingStats() {
  const couplingCount = Object.keys(couplingGearboxMatching).length;
  const gearboxCount = Object.keys(gearboxCouplingMatching).length;
  const totalMappings = Object.values(couplingGearboxMatching).reduce((sum, arr) => sum + arr.length, 0);

  // 按系列统计
  const couplingsBySeries = {};
  Object.keys(couplingGearboxMatching).forEach(coupling => {
    const series = coupling.match(/^[A-Z]+/)?.[0] || 'OTHER';
    couplingsBySeries[series] = (couplingsBySeries[series] || 0) + 1;
  });

  return {
    couplingCount,
    gearboxCount,
    totalMappings,
    couplingsBySeries
  };
}

export default couplingGearboxMatching;
