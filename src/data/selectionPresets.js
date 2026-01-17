// src/data/selectionPresets.js
// 快速选型预设 - 常用船舶类型的推荐配置

/**
 * 选型预设数据
 * 基于不同船舶类型和应用场景的典型配置
 */
export const SELECTION_PRESETS = {
  // 渔船系列
  fishing: {
    category: '渔船',
    icon: '🐟',
    presets: [
      {
        id: 'fishing-small',
        name: '小型渔船',
        description: '20-30米级近海渔船',
        params: {
          motorPower: 120,
          motorSpeed: 1800,
          targetRatio: 3.5,
          thrust: 15,
          application: 'propulsion',
          workCondition: 'III类:扭矩变化中等',
          temperature: 35,
          safetyFactor: 1.3
        },
        recommendedSeries: ['HC', 'HCM'],
        typicalModels: ['120C', 'HC138']
      },
      {
        id: 'fishing-medium',
        name: '中型拖网渔船',
        description: '35-50米级中远海渔船',
        params: {
          motorPower: 300,
          motorSpeed: 1500,
          targetRatio: 4.0,
          thrust: 35,
          application: 'propulsion',
          workCondition: 'IV类:扭矩变化大',
          temperature: 40,
          safetyFactor: 1.5
        },
        recommendedSeries: ['HC', 'HCD'],
        typicalModels: ['HC300', 'HCD400A']
      },
      {
        id: 'fishing-large',
        name: '大型远洋渔船',
        description: '60米以上远洋作业船',
        params: {
          motorPower: 600,
          motorSpeed: 1200,
          targetRatio: 4.5,
          thrust: 60,
          application: 'propulsion',
          workCondition: 'IV类:扭矩变化大',
          temperature: 45,
          safetyFactor: 1.5
        },
        recommendedSeries: ['HCD', 'HCT'],
        typicalModels: ['HC600A', 'HCD600A']
      }
    ]
  },

  // 货船系列
  cargo: {
    category: '货船',
    icon: '🚢',
    presets: [
      {
        id: 'cargo-coastal',
        name: '沿海货船',
        description: '50-80米级沿海运输船',
        params: {
          motorPower: 400,
          motorSpeed: 1500,
          targetRatio: 4.0,
          thrust: 45,
          application: 'propulsion',
          workCondition: 'II类:扭矩变化小',
          temperature: 35,
          safetyFactor: 1.2
        },
        recommendedSeries: ['HCD', 'HC'],
        typicalModels: ['HCD400A', 'HC400']
      },
      {
        id: 'cargo-river',
        name: '内河货船',
        description: '内河航运货船',
        params: {
          motorPower: 250,
          motorSpeed: 1800,
          targetRatio: 3.5,
          thrust: 30,
          application: 'propulsion',
          workCondition: 'II类:扭矩变化小',
          temperature: 30,
          safetyFactor: 1.2
        },
        recommendedSeries: ['HC', 'MB'],
        typicalModels: ['MB270A', 'HC300']
      },
      {
        id: 'cargo-ocean',
        name: '远洋货船',
        description: '100米以上远洋货船',
        params: {
          motorPower: 1200,
          motorSpeed: 1000,
          targetRatio: 5.0,
          thrust: 120,
          application: 'propulsion',
          workCondition: 'II类:扭矩变化小',
          temperature: 40,
          safetyFactor: 1.3
        },
        recommendedSeries: ['HCT', 'HCD'],
        typicalModels: ['HCT1200', 'HCD1000']
      }
    ]
  },

  // 工程船系列
  workboat: {
    category: '工程船',
    icon: '⚓',
    presets: [
      {
        id: 'workboat-tug',
        name: '港口拖轮',
        description: '港作拖轮、推轮',
        params: {
          motorPower: 500,
          motorSpeed: 1500,
          targetRatio: 4.0,
          thrust: 80,
          application: 'propulsion',
          workCondition: 'V类:扭矩变化很大',
          temperature: 45,
          safetyFactor: 1.8
        },
        recommendedSeries: ['GWC', 'HCW'],
        typicalModels: ['GWC45.49', 'HCW800']
      },
      {
        id: 'workboat-dredger',
        name: '挖泥船',
        description: '航道疏浚挖泥船',
        params: {
          motorPower: 800,
          motorSpeed: 1200,
          targetRatio: 5.0,
          thrust: 100,
          application: 'propulsion',
          workCondition: 'IV类:扭矩变化大',
          temperature: 45,
          safetyFactor: 1.6
        },
        recommendedSeries: ['GWC', 'HCT'],
        typicalModels: ['GWC52.59', 'HCT800']
      },
      {
        id: 'workboat-supply',
        name: '海洋供应船',
        description: '平台供应/守护船',
        params: {
          motorPower: 1500,
          motorSpeed: 1000,
          targetRatio: 4.5,
          thrust: 150,
          application: 'propulsion',
          workCondition: 'III类:扭矩变化中等',
          temperature: 40,
          safetyFactor: 1.4
        },
        recommendedSeries: ['HCT', 'GWC'],
        typicalModels: ['HCT1400', 'GWC60.66']
      }
    ]
  },

  // 客船系列
  passenger: {
    category: '客船',
    icon: '🛳️',
    presets: [
      {
        id: 'passenger-ferry',
        name: '客渡船',
        description: '客渡轮/汽车渡轮',
        params: {
          motorPower: 350,
          motorSpeed: 1800,
          targetRatio: 3.5,
          thrust: 40,
          application: 'propulsion',
          workCondition: 'II类:扭矩变化小',
          temperature: 35,
          safetyFactor: 1.3
        },
        recommendedSeries: ['HC', 'HCD'],
        typicalModels: ['HC400', 'HCD400A']
      },
      {
        id: 'passenger-tourist',
        name: '旅游客船',
        description: '观光/游览船',
        params: {
          motorPower: 200,
          motorSpeed: 2000,
          targetRatio: 3.0,
          thrust: 25,
          application: 'propulsion',
          workCondition: 'I类:扭矩变化很小',
          temperature: 30,
          safetyFactor: 1.2
        },
        recommendedSeries: ['HC', 'MB'],
        typicalModels: ['HC200', 'MB270A']
      }
    ]
  },

  // 游艇系列
  yacht: {
    category: '游艇',
    icon: '⛵',
    presets: [
      {
        id: 'yacht-small',
        name: '小型游艇',
        description: '15-25米私人游艇',
        params: {
          motorPower: 150,
          motorSpeed: 2200,
          targetRatio: 2.5,
          thrust: 15,
          application: 'propulsion',
          workCondition: 'II类:扭矩变化小',
          temperature: 35,
          safetyFactor: 1.2
        },
        recommendedSeries: ['MB', 'HC'],
        typicalModels: ['MB170', 'MB242']
      },
      {
        id: 'yacht-medium',
        name: '中型游艇',
        description: '30-45米豪华游艇',
        params: {
          motorPower: 400,
          motorSpeed: 1800,
          targetRatio: 3.0,
          thrust: 35,
          application: 'propulsion',
          workCondition: 'II类:扭矩变化小',
          temperature: 35,
          safetyFactor: 1.2
        },
        recommendedSeries: ['HC', 'HCD'],
        typicalModels: ['HC400', 'HCD400A']
      }
    ]
  },

  // 辅助推进
  auxiliary: {
    category: '辅助推进',
    icon: '⚙️',
    presets: [
      {
        id: 'aux-generator',
        name: '发电机组',
        description: '船用发电机减速箱',
        params: {
          motorPower: 200,
          motorSpeed: 1500,
          targetRatio: 2.0,
          thrust: 0,
          application: 'auxiliary',
          workCondition: 'I类:扭矩变化很小',
          temperature: 30,
          safetyFactor: 1.1
        },
        recommendedSeries: ['HCA', 'HCQ'],
        typicalModels: ['HCA300', 'HCQ300']
      },
      {
        id: 'aux-thruster',
        name: '侧推器',
        description: '船舶侧向推进器',
        params: {
          motorPower: 100,
          motorSpeed: 1200,
          targetRatio: 3.0,
          thrust: 20,
          application: 'auxiliary',
          workCondition: 'III类:扭矩变化中等',
          temperature: 35,
          safetyFactor: 1.3
        },
        recommendedSeries: ['HCQ', 'HCA'],
        typicalModels: ['HCQ502', 'HCA301']
      }
    ]
  }
};

/**
 * 获取所有预设分类
 * @returns {Array} 分类列表
 */
export const getPresetCategories = () => {
  return Object.entries(SELECTION_PRESETS).map(([key, value]) => ({
    key,
    ...value,
    presetCount: value.presets.length
  }));
};

/**
 * 获取指定分类的预设
 * @param {string} categoryKey - 分类键
 * @returns {Array} 预设列表
 */
export const getPresetsForCategory = (categoryKey) => {
  return SELECTION_PRESETS[categoryKey]?.presets || [];
};

/**
 * 通过ID获取预设
 * @param {string} presetId - 预设ID
 * @returns {object|null} 预设对象
 */
export const getPresetById = (presetId) => {
  for (const category of Object.values(SELECTION_PRESETS)) {
    const preset = category.presets.find(p => p.id === presetId);
    if (preset) return preset;
  }
  return null;
};

/**
 * 搜索预设
 * @param {string} searchText - 搜索文本
 * @returns {Array} 匹配的预设列表
 */
export const searchPresets = (searchText) => {
  if (!searchText) return [];

  const searchLower = searchText.toLowerCase();
  const results = [];

  for (const [categoryKey, category] of Object.entries(SELECTION_PRESETS)) {
    for (const preset of category.presets) {
      if (preset.name.toLowerCase().includes(searchLower) ||
          preset.description.toLowerCase().includes(searchLower) ||
          preset.typicalModels.some(m => m.toLowerCase().includes(searchLower))) {
        results.push({
          ...preset,
          category: category.category,
          categoryKey
        });
      }
    }
  }

  return results;
};

/**
 * 根据功率范围推荐预设
 * @param {number} power - 功率 (kW)
 * @returns {Array} 推荐的预设列表
 */
export const recommendPresetsByPower = (power) => {
  const results = [];
  const tolerance = 0.3; // 30% 容差

  for (const [categoryKey, category] of Object.entries(SELECTION_PRESETS)) {
    for (const preset of category.presets) {
      const presetPower = preset.params.motorPower;
      if (Math.abs(presetPower - power) / presetPower <= tolerance) {
        results.push({
          ...preset,
          category: category.category,
          categoryKey,
          powerMatch: 1 - Math.abs(presetPower - power) / presetPower
        });
      }
    }
  }

  return results.sort((a, b) => b.powerMatch - a.powerMatch);
};

export default SELECTION_PRESETS;
