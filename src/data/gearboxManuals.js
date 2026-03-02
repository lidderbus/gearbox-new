// src/data/gearboxManuals.js
// 齿轮箱产品说明书映射表
// 数据来源: 杭齿产品说明书电子版 (35个PDF文件)
// 更新时间: 2026-01-20

/**
 * 说明书映射表
 * key: 齿轮箱型号 (支持模糊匹配)
 * value: { path, title, category, fileSize }
 */
export const gearboxManuals = {
  // =====================
  // 中小功率系列 (15个)
  // =====================

  // 120系列
  '120B': {
    path: '/manuals/small-power/120B.PDF',
    title: '120B型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '21MB'
  },
  '120C': {
    path: '/manuals/small-power/120C.PDF',
    title: '120C型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '22MB'
  },

  // 135系列
  '135': {
    path: '/manuals/small-power/135.PDF',
    title: '135型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '33MB'
  },

  // 300系列
  '300': {
    path: '/manuals/small-power/300.pdf',
    title: '300型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '83MB'
  },
  'HC300': {
    path: '/manuals/small-power/300.pdf',
    title: '300型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '83MB'
  },

  // 40A系列
  '40A': {
    path: '/manuals/small-power/40A.PDF',
    title: '40A型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '21MB'
  },

  // HC/HCD400A系列
  'HC400A': {
    path: '/manuals/small-power/HC-HCD400A.PDF',
    title: 'HC/HCD400A型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '32MB'
  },
  'HCD400A': {
    path: '/manuals/small-power/HC-HCD400A.PDF',
    title: 'HC/HCD400A型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '32MB'
  },

  // HC600A系列
  'HC600A': {
    path: '/manuals/small-power/HC600A HCD600A HCT600A.PDF',
    title: 'HC600A/HCD600A/HCT600A型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '40MB'
  },
  'HCD600A': {
    path: '/manuals/small-power/HC600A HCD600A HCT600A.PDF',
    title: 'HC600A/HCD600A/HCT600A型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '40MB'
  },
  'HCT600A': {
    path: '/manuals/small-power/HC600A HCD600A HCT600A.PDF',
    title: 'HC600A/HCD600A/HCT600A型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '40MB'
  },

  // HCQ1400系列 (中小功率分类)
  'HCQ1400': {
    path: '/manuals/small-power/HCQ1400型船用齿轮箱.PDF',
    title: 'HCQ1400型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '48MB'
  },

  // HCT400A系列
  'HCT400A': {
    path: '/manuals/small-power/HCT400A.PDF',
    title: 'HCT400A型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '22MB'
  },

  // HCT800-3系列 (中小功率分类)
  'HCT800-3': {
    path: '/manuals/small-power/HCT800-3型船用齿轮箱使用说明书.PDF',
    title: 'HCT800-3型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '12MB'
  },

  // MB系列
  'MB170': {
    path: '/manuals/small-power/MB170.PDF',
    title: 'MB170型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '32MB'
  },
  'MB242': {
    path: '/manuals/small-power/MB242.PDF',
    title: 'MB242型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '22MB'
  },
  'MB270A': {
    path: '/manuals/small-power/MB270A.PDF',
    title: 'MB270A型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '27MB'
  },

  // T300系列
  'T300': {
    path: '/manuals/small-power/T300.PDF',
    title: 'T300型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '29MB'
  },
  'T300-1': {
    path: '/manuals/small-power/T300-1.PDF',
    title: 'T300-1型船用齿轮箱使用说明书',
    category: 'small-power',
    fileSize: '32MB'
  },

  // =====================
  // 大功率系列 (20个)
  // =====================

  // GWC系列 - 渔船齿轮箱
  'GWC32.35': {
    path: '/manuals/large-power/GWC32.35船用齿轮箱零件图册.PDF',
    title: 'GWC32.35船用齿轮箱零件图册',
    category: 'large-power',
    fileSize: '29MB'
  },
  'GWC36.39': {
    path: '/manuals/large-power/GWC36.39船用齿轮箱零件图册.PDF',
    title: 'GWC36.39船用齿轮箱零件图册',
    category: 'large-power',
    fileSize: '27MB'
  },
  'GWC39.41': {
    path: '/manuals/large-power/GWC39.41船用齿轮箱零件图册.PDF',
    title: 'GWC39.41船用齿轮箱零件图册',
    category: 'large-power',
    fileSize: '25MB'
  },
  'GWC42.45': {
    path: '/manuals/large-power/GWC42.45船用齿轮箱零件图册.PDF',
    title: 'GWC42.45船用齿轮箱零件图册',
    category: 'large-power',
    fileSize: '30MB'
  },
  'GWC49.54': {
    path: '/manuals/large-power/GWC49.54船用齿轮箱零件图册.PDF',
    title: 'GWC49.54船用齿轮箱零件图册',
    category: 'large-power',
    fileSize: '25MB'
  },
  'GWC52.59': {
    path: '/manuals/large-power/GWC52.59船用齿轮箱零件图册.PDF',
    title: 'GWC52.59船用齿轮箱零件图册',
    category: 'large-power',
    fileSize: '17MB'
  },
  'GWC60.66': {
    path: '/manuals/large-power/GWC60.66船用齿轮箱零件图册.PDF',
    title: 'GWC60.66船用齿轮箱零件图册',
    category: 'large-power',
    fileSize: '26MB'
  },
  'GWC66.75': {
    path: '/manuals/large-power/GWC66-75补充使用说明书.PDF',
    title: 'GWC66-75补充使用说明书',
    category: 'large-power',
    fileSize: '24MB'
  },
  'GWC66-75': {
    path: '/manuals/large-power/GWC66-75补充使用说明书.PDF',
    title: 'GWC66-75补充使用说明书',
    category: 'large-power',
    fileSize: '24MB'
  },

  // GWS系列 - 渔船齿轮箱
  'GWS49.54': {
    path: '/manuals/large-power/GWS49.54船用齿轮箱零件图册.PDF',
    title: 'GWS49.54船用齿轮箱零件图册',
    category: 'large-power',
    fileSize: '23MB'
  },
  'GWS66.75': {
    path: '/manuals/large-power/GWS66.75型船用齿轮箱零件目录.PDF',
    title: 'GWS66.75型船用齿轮箱零件目录',
    category: 'large-power',
    fileSize: '13MB'
  },

  // GW系列通用说明书
  'GW': {
    path: '/manuals/large-power/GW系列.PDF',
    title: 'GW系列船用齿轮箱使用说明书',
    category: 'large-power',
    fileSize: '41MB'
  },

  // HC大功率系列
  'HC900': {
    path: '/manuals/large-power/HC900型.PDF',
    title: 'HC900型船用齿轮箱使用说明书',
    category: 'large-power',
    fileSize: '24MB'
  },
  'HC1200': {
    path: '/manuals/large-power/HC1200.PDF',
    title: 'HC1200型船用齿轮箱使用说明书',
    category: 'large-power',
    fileSize: '15MB'
  },
  'HC1250': {
    path: '/manuals/large-power/HC1250型船用齿轮箱.PDF',
    title: 'HC1250型船用齿轮箱使用说明书',
    category: 'large-power',
    fileSize: '16MB'
  },

  // HCD大功率系列
  'HCD800': {
    path: '/manuals/large-power/HCD800.PDF',
    title: 'HCD800型船用齿轮箱使用说明书',
    category: 'large-power',
    fileSize: '33MB'
  },

  // HCT大功率系列
  'HCT800': {
    path: '/manuals/large-power/HCT800.PDF',
    title: 'HCT800型船用齿轮箱使用说明书',
    category: 'large-power',
    fileSize: '23MB'
  },
  'HCT800-1': {
    path: '/manuals/large-power/HCT800-1.PDF',
    title: 'HCT800-1型船用齿轮箱使用说明书',
    category: 'large-power',
    fileSize: '16MB'
  },
  'HCT1100': {
    path: '/manuals/large-power/HCT1100型船用齿箱使用说明书.PDF',
    title: 'HCT1100型船用齿轮箱使用说明书',
    category: 'large-power',
    fileSize: '31MB'
  }
};

/**
 * 获取齿轮箱说明书信息
 * @param {string} model - 齿轮箱型号
 * @returns {object|null} 说明书信息或null
 */
export function getManualInfo(model) {
  if (!model) return null;

  // 精确匹配
  if (gearboxManuals[model]) {
    return gearboxManuals[model];
  }

  // 尝试模糊匹配 (去掉后缀字母)
  const baseModel = model.replace(/[A-Z]$/, '');
  if (gearboxManuals[baseModel]) {
    return gearboxManuals[baseModel];
  }

  // 尝试前缀匹配 (如 GWC45.49 -> GWC42.45)
  for (const key of Object.keys(gearboxManuals)) {
    if (model.startsWith(key.split('.')[0]) || key.startsWith(model.split('.')[0])) {
      // GW系列的模糊匹配
      if (model.startsWith('GW') && key.startsWith('GW')) {
        return gearboxManuals[key];
      }
    }
  }

  // GW系列通用说明书
  if (model.startsWith('GW')) {
    return gearboxManuals['GW'];
  }

  return null;
}

/**
 * 获取说明书URL
 * @param {string} model - 齿轮箱型号
 * @returns {string|null} 说明书URL或null
 */
export function getManualUrl(model) {
  const info = getManualInfo(model);
  return info ? info.path : null;
}

/**
 * 检查型号是否有说明书
 * @param {string} model - 齿轮箱型号
 * @returns {boolean}
 */
export function hasManual(model) {
  return getManualInfo(model) !== null;
}

/**
 * 获取所有说明书列表 (按分类)
 * @returns {object} { smallPower: [], largePower: [] }
 */
export function getAllManuals() {
  const result = {
    smallPower: [],
    largePower: []
  };

  const seen = new Set(); // 去重用

  for (const [model, info] of Object.entries(gearboxManuals)) {
    if (seen.has(info.path)) continue;
    seen.add(info.path);

    const item = {
      model,
      ...info
    };

    if (info.category === 'small-power') {
      result.smallPower.push(item);
    } else {
      result.largePower.push(item);
    }
  }

  return result;
}

export default gearboxManuals;
