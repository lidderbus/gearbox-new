/**
 * 船检证书需求生成器
 * 根据船检类型动态生成证书和文件需求清单
 *
 * 支持的船检类型:
 * - 国内: CCS入级/非入级/远洋渔船, ZY国内渔船
 * - 国外: DNV, LR, ABS, BV, NK, KR
 *
 * @author Claude Code
 * @date 2026-01-10
 */

// 船检类型枚举
export const ClassificationType = {
  NONE: 'NONE',                 // 无船检要求
  CCS_ENTRY: 'CCS_ENTRY',       // CCS入级
  CCS_NON_ENTRY: 'CCS_NON_ENTRY', // CCS非入级
  CCS_FISHING: 'CCS_FISHING',   // CCS远洋渔船
  ZY_FISHING: 'ZY_FISHING',     // ZY国内渔船
  DNV: 'DNV',                   // DNV-GL
  LR: 'LR',                     // 劳氏船级社
  ABS: 'ABS',                   // 美国船级社
  BV: 'BV',                     // 法国船级社
  NK: 'NK',                     // 日本海事协会
  KR: 'KR',                     // 韩国船级社
  OTHER: 'OTHER'                // 其他国外船检
};

// 船检类型分组
export const classificationGroups = {
  none: {
    label: '无要求',
    types: [ClassificationType.NONE]
  },
  domestic: {
    label: '国内船检',
    types: [
      ClassificationType.CCS_ENTRY,
      ClassificationType.CCS_NON_ENTRY,
      ClassificationType.CCS_FISHING,
      ClassificationType.ZY_FISHING
    ]
  },
  international: {
    label: '国外船检',
    types: [
      ClassificationType.DNV,
      ClassificationType.LR,
      ClassificationType.ABS,
      ClassificationType.BV,
      ClassificationType.NK,
      ClassificationType.KR,
      ClassificationType.OTHER
    ]
  }
};

/**
 * 各船检类型的证书需求配置
 */
export const certificateRequirements = {
  [ClassificationType.NONE]: {
    name: '无船检要求',
    shortName: '无',
    society: null,
    certificates: [
      { name: '产品合格证书', quantity: '1份/台', required: true },
      { name: '出厂检验报告', quantity: '1份/台', required: false }
    ],
    documents: [
      { name: '使用说明书', quantity: '2份' },
      { name: '外形安装图', quantity: '2份' }
    ],
    inspectionRequirements: [],
    specialNotes: ['适用于一般工业应用，无需船检认证']
  },

  [ClassificationType.CCS_ENTRY]: {
    name: 'CCS入级',
    shortName: 'CCS入级',
    society: 'CCS',
    certificates: [
      { name: 'CCS入级船用产品证书', quantity: '1份/台', required: true },
      { name: '产品合格证书', quantity: '1份/台', required: true },
      { name: 'CCS工厂认可证书', quantity: '1份', required: true },
      { name: '型式认可证书', quantity: '1份', required: false }
    ],
    documents: [
      { name: '使用说明书', quantity: '2份' },
      { name: '外形安装图', quantity: '2份' },
      { name: '电气接线图', quantity: '2份' },
      { name: 'CCS检验报告', quantity: '1份' }
    ],
    inspectionRequirements: [
      '出厂前需经CCS验船师现场检验',
      '检验项目包括：外观检查、性能试验、密封性试验',
      '需提前5个工作日通知船检'
    ],
    specialNotes: ['适用于国内航行船舶', '需CCS验船师现场检验']
  },

  [ClassificationType.CCS_NON_ENTRY]: {
    name: 'CCS非入级',
    shortName: 'CCS非入级',
    society: 'CCS',
    certificates: [
      { name: 'CCS非入级船用产品证书', quantity: '1份/台', required: true },
      { name: '产品合格证书', quantity: '1份/台', required: true }
    ],
    documents: [
      { name: '使用说明书', quantity: '2份' },
      { name: '外形安装图', quantity: '2份' },
      { name: '电气接线图', quantity: '1份' }
    ],
    inspectionRequirements: [],
    specialNotes: ['无需现场检验', '适用于非入级船舶']
  },

  [ClassificationType.CCS_FISHING]: {
    name: 'CCS远洋渔船',
    shortName: 'CCS渔船',
    society: 'CCS',
    certificates: [
      { name: 'CCS渔船产品证书', quantity: '1份/台', required: true },
      { name: '产品合格证书', quantity: '1份/台', required: true }
    ],
    documents: [
      { name: '使用说明书', quantity: '2份' },
      { name: '外形安装图', quantity: '2份' }
    ],
    inspectionRequirements: [
      '需符合《渔船检验技术规则》要求'
    ],
    specialNotes: ['适用于远洋渔船', '需符合渔船检验规则']
  },

  [ClassificationType.ZY_FISHING]: {
    name: 'ZY国内渔船',
    shortName: 'ZY渔检',
    society: 'ZY',
    certificates: [
      { name: '渔业船舶检验证书', quantity: '1份/台', required: true },
      { name: '产品合格证书', quantity: '1份/台', required: true }
    ],
    documents: [
      { name: '使用说明书', quantity: '2份' },
      { name: '外形安装图', quantity: '2份' }
    ],
    inspectionRequirements: [
      '由渔业船舶检验局检验'
    ],
    specialNotes: ['适用于国内渔船', '由渔业船舶检验局负责检验']
  },

  [ClassificationType.DNV]: {
    name: 'DNV-GL',
    shortName: 'DNV',
    society: 'DNV',
    certificates: [
      { name: 'DNV型式认可证书 (TAC)', quantity: '1份', required: true },
      { name: 'DNV产品证书', quantity: '1份/台', required: true },
      { name: '产品合格证书', quantity: '1份/台', required: true }
    ],
    documents: [
      { name: '使用说明书 (英文)', quantity: '2份' },
      { name: '外形安装图', quantity: '2份' },
      { name: 'DNV检验报告', quantity: '1份' }
    ],
    inspectionRequirements: [
      '需DNV验船师现场检验或接受CCS代检',
      '提供英文技术文件'
    ],
    specialNotes: ['国际通用', '适用于欧洲航线', '可接受CCS代检']
  },

  [ClassificationType.LR]: {
    name: '劳氏船级社',
    shortName: 'LR',
    society: 'LR',
    certificates: [
      { name: 'LR型式认可证书', quantity: '1份', required: true },
      { name: 'LR产品证书', quantity: '1份/台', required: true },
      { name: '产品合格证书', quantity: '1份/台', required: true }
    ],
    documents: [
      { name: '使用说明书 (英文)', quantity: '2份' },
      { name: '外形安装图', quantity: '2份' }
    ],
    inspectionRequirements: [
      '需LR验船师检验或接受CCS代检'
    ],
    specialNotes: ['国际通用', '历史悠久的船级社']
  },

  [ClassificationType.ABS]: {
    name: '美国船级社',
    shortName: 'ABS',
    society: 'ABS',
    certificates: [
      { name: 'ABS型式认可证书', quantity: '1份', required: true },
      { name: 'ABS产品证书', quantity: '1份/台', required: true },
      { name: '产品合格证书', quantity: '1份/台', required: true }
    ],
    documents: [
      { name: '使用说明书 (英文)', quantity: '2份' },
      { name: '外形安装图', quantity: '2份' }
    ],
    inspectionRequirements: [
      '需ABS验船师检验或接受CCS代检'
    ],
    specialNotes: ['适用于美洲航线']
  },

  [ClassificationType.BV]: {
    name: '法国船级社',
    shortName: 'BV',
    society: 'BV',
    certificates: [
      { name: 'BV型式认可证书', quantity: '1份', required: true },
      { name: 'BV产品证书', quantity: '1份/台', required: true },
      { name: '产品合格证书', quantity: '1份/台', required: true }
    ],
    documents: [
      { name: '使用说明书 (英文/法文)', quantity: '2份' },
      { name: '外形安装图', quantity: '2份' }
    ],
    inspectionRequirements: [
      '需BV验船师检验或接受CCS代检'
    ],
    specialNotes: ['适用于欧洲及非洲法语区航线']
  },

  [ClassificationType.NK]: {
    name: '日本海事协会',
    shortName: 'NK',
    society: 'NK',
    certificates: [
      { name: 'ClassNK型式认可证书', quantity: '1份', required: true },
      { name: 'NK产品证书', quantity: '1份/台', required: true },
      { name: '产品合格证书', quantity: '1份/台', required: true }
    ],
    documents: [
      { name: '使用说明书 (英文/日文)', quantity: '2份' },
      { name: '外形安装图', quantity: '2份' }
    ],
    inspectionRequirements: [
      '需NK验船师检验或接受CCS代检'
    ],
    specialNotes: ['适用于日本及亚太航线']
  },

  [ClassificationType.KR]: {
    name: '韩国船级社',
    shortName: 'KR',
    society: 'KR',
    certificates: [
      { name: 'KR型式认可证书', quantity: '1份', required: true },
      { name: 'KR产品证书', quantity: '1份/台', required: true },
      { name: '产品合格证书', quantity: '1份/台', required: true }
    ],
    documents: [
      { name: '使用说明书 (英文/韩文)', quantity: '2份' },
      { name: '外形安装图', quantity: '2份' }
    ],
    inspectionRequirements: [
      '需KR验船师检验或接受CCS代检'
    ],
    specialNotes: ['适用于韩国航线']
  },

  [ClassificationType.OTHER]: {
    name: '其他国外船检',
    shortName: '其他',
    society: null,
    certificates: [
      { name: '对应船级社型式认可证书', quantity: '1份', required: true },
      { name: '对应船级社产品证书', quantity: '1份/台', required: true },
      { name: '产品合格证书', quantity: '1份/台', required: true }
    ],
    documents: [
      { name: '使用说明书 (英文)', quantity: '2份' },
      { name: '外形安装图', quantity: '2份' }
    ],
    inspectionRequirements: [
      '根据具体船级社要求确定'
    ],
    specialNotes: ['具体要求根据实际船级社确定', '请在备注中说明船级社名称']
  }
};

/**
 * 获取证书需求配置
 * @param {string} classificationType - 船检类型
 * @returns {Object} 证书需求配置
 */
export const getCertificateRequirements = (classificationType) => {
  return certificateRequirements[classificationType] || certificateRequirements[ClassificationType.NONE];
};

/**
 * 生成证书清单文本数组
 * @param {string} classificationType - 船检类型
 * @param {number} quantity - 设备数量
 * @returns {string[]} 证书清单
 */
export const generateCertificateList = (classificationType, quantity = 1) => {
  const config = getCertificateRequirements(classificationType);
  const items = [];

  // 证书类
  config.certificates.forEach(cert => {
    const qty = cert.quantity.includes('/台')
      ? cert.quantity.replace('/台', `/${quantity}台`)
      : cert.quantity;
    items.push(`${cert.name} ${qty}`);
  });

  // 文件类
  config.documents.forEach(doc => {
    items.push(`${doc.name} ${doc.quantity}`);
  });

  return items;
};

/**
 * 生成证书清单HTML表格
 * @param {string} classificationType - 船检类型
 * @param {number} quantity - 设备数量
 * @returns {string} HTML表格
 */
export const generateCertificateTable = (classificationType, quantity = 1) => {
  const config = getCertificateRequirements(classificationType);
  let html = '<table class="certificate-table"><thead><tr><th>序号</th><th>名称</th><th>数量</th></tr></thead><tbody>';

  let index = 1;

  // 证书类
  config.certificates.forEach(cert => {
    const qty = cert.quantity.includes('/台')
      ? cert.quantity.replace('/台', `/${quantity}台`)
      : cert.quantity;
    const requiredMark = cert.required ? ' *' : '';
    html += `<tr><td>${index++}</td><td>${cert.name}${requiredMark}</td><td>${qty}</td></tr>`;
  });

  // 文件类
  config.documents.forEach(doc => {
    html += `<tr><td>${index++}</td><td>${doc.name}</td><td>${doc.quantity}</td></tr>`;
  });

  html += '</tbody></table>';
  return html;
};

/**
 * 获取船检类型描述
 * @param {string} classificationType - 船检类型
 * @returns {string} 描述文字
 */
export const getClassificationDescription = (classificationType) => {
  const descriptions = {
    [ClassificationType.NONE]: '无需船检认证，适用于一般工业应用',
    [ClassificationType.CCS_ENTRY]: 'CCS入级认证，需现场检验，适用于国内航行船舶',
    [ClassificationType.CCS_NON_ENTRY]: 'CCS非入级认证，无需现场检验',
    [ClassificationType.CCS_FISHING]: 'CCS远洋渔船认证',
    [ClassificationType.ZY_FISHING]: '渔业船舶检验局认证，适用于国内渔船',
    [ClassificationType.DNV]: 'DNV-GL认证，国际通用，适用于欧洲航线',
    [ClassificationType.LR]: '劳氏船级社认证，国际通用',
    [ClassificationType.ABS]: '美国船级社认证，适用于美洲航线',
    [ClassificationType.BV]: '法国船级社认证',
    [ClassificationType.NK]: '日本海事协会认证，适用于日本及亚太航线',
    [ClassificationType.KR]: '韩国船级社认证',
    [ClassificationType.OTHER]: '其他国外船级社，请在备注中说明'
  };
  return descriptions[classificationType] || '';
};

/**
 * 获取船检类型显示名称
 * @param {string} classificationType - 船检类型
 * @returns {string} 显示名称
 */
export const getClassificationDisplayName = (classificationType) => {
  const config = getCertificateRequirements(classificationType);
  return config.name || classificationType;
};

/**
 * 获取船检类型短名称
 * @param {string} classificationType - 船检类型
 * @returns {string} 短名称
 */
export const getClassificationShortName = (classificationType) => {
  const config = getCertificateRequirements(classificationType);
  return config.shortName || classificationType;
};

/**
 * 获取推荐的工况系数模式
 * @param {string} classificationType - 船检类型
 * @returns {string} 工况系数模式 'FACTORY' 或 'JB_CCS'
 */
export const getRecommendedWorkFactorMode = (classificationType) => {
  // 有船检要求时建议使用JB/CCS标准
  if (classificationType === ClassificationType.NONE) {
    return 'FACTORY';
  }
  return 'JB_CCS';
};

/**
 * 判断是否为国内船检
 * @param {string} classificationType - 船检类型
 * @returns {boolean}
 */
export const isDomesticClassification = (classificationType) => {
  return classificationGroups.domestic.types.includes(classificationType);
};

/**
 * 判断是否为国外船检
 * @param {string} classificationType - 船检类型
 * @returns {boolean}
 */
export const isInternationalClassification = (classificationType) => {
  return classificationGroups.international.types.includes(classificationType);
};

/**
 * 判断是否需要英文文档
 * @param {string} classificationType - 船检类型
 * @returns {boolean}
 */
export const requiresEnglishDocuments = (classificationType) => {
  return isInternationalClassification(classificationType);
};

/**
 * 判断是否需要现场检验
 * @param {string} classificationType - 船检类型
 * @returns {boolean}
 */
export const requiresOnSiteInspection = (classificationType) => {
  const config = getCertificateRequirements(classificationType);
  return config.inspectionRequirements && config.inspectionRequirements.length > 0;
};

/**
 * 获取所有船检类型选项（用于下拉菜单）
 * @returns {Array} 分组的选项数组
 */
export const getClassificationOptions = () => {
  return [
    {
      group: '无要求',
      options: [
        { value: ClassificationType.NONE, label: '无船检要求 (工业应用)' }
      ]
    },
    {
      group: '国内船检',
      options: [
        { value: ClassificationType.CCS_ENTRY, label: 'CCS 入级' },
        { value: ClassificationType.CCS_NON_ENTRY, label: 'CCS 非入级' },
        { value: ClassificationType.CCS_FISHING, label: 'CCS 远洋渔船' },
        { value: ClassificationType.ZY_FISHING, label: 'ZY 国内渔船' }
      ]
    },
    {
      group: '国外船检',
      options: [
        { value: ClassificationType.DNV, label: 'DNV-GL (挪威/德国)' },
        { value: ClassificationType.LR, label: 'LR 劳氏 (英国)' },
        { value: ClassificationType.ABS, label: 'ABS (美国)' },
        { value: ClassificationType.BV, label: 'BV (法国)' },
        { value: ClassificationType.NK, label: 'NK/ClassNK (日本)' },
        { value: ClassificationType.KR, label: 'KR (韩国)' },
        { value: ClassificationType.OTHER, label: '其他国外船检' }
      ]
    }
  ];
};

export default {
  ClassificationType,
  classificationGroups,
  certificateRequirements,
  getCertificateRequirements,
  generateCertificateList,
  generateCertificateTable,
  getClassificationDescription,
  getClassificationDisplayName,
  getClassificationShortName,
  getRecommendedWorkFactorMode,
  isDomesticClassification,
  isInternationalClassification,
  requiresEnglishDocuments,
  requiresOnSiteInspection,
  getClassificationOptions
};
