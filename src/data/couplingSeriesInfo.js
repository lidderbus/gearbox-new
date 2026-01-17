/**
 * 联轴器系列信息数据
 * 包含每个系列的名称、描述、特性、图片URL等
 * 数据来源: http://www.hzcoupling.com
 */

// 图片基础URL
const COUPLING_IMAGE_BASE = 'http://www.hzcoupling.com/wp-content/uploads/2022/02';

export const couplingSeriesInfo = {
  'HGTS': {
    name: 'HGT(S)系列高弹性联轴器',
    description: '额定扭矩范围：10-630 kN·m，共多个尺寸组',
    features: [
      '扭转型高弹性联轴器，以橡胶为主要传扭元件',
      '弹性元件单件为扇形，四件一组留间隙布置呈环状',
      '多排结构动态刚度小，并联时交叉布置有利于通风散热',
      '膜片部件可衰减轴向反作用力，保护主辅机',
      'I、II、III型适应不同安装空间和工况'
    ],
    torqueRange: '10-630 kN·m',
    productImage: `${COUPLING_IMAGE_BASE}/HGTSbanner.png`,
    structureImage: `${COUPLING_IMAGE_BASE}/jishucanshu-1.jpg`,
    technicalImage: `${COUPLING_IMAGE_BASE}/HGTS-T.png`,
    dimensionsImage: `${COUPLING_IMAGE_BASE}/HGTS-W.png`,
    detailUrl: 'http://www.hzcoupling.com/215.html'
  },

  'HGTH': {
    name: 'HGTH(J)(B)系列高弹性联轴器',
    description: '额定扭矩范围：4-40 kN·m，增强扭转型',
    features: [
      '增强扭转型高弹性联轴器，齿部受剪切可靠性更高',
      'J表示齿部加强结构，B表示双排并联结构',
      '以耐热橡胶为减震材料，有效减小和吸收震动',
      '轴向插入式设计，能补偿较大轴向位移',
      '型号带J许用环境温度为-30~80°C'
    ],
    torqueRange: '4-40 kN·m',
    productImage: `${COUPLING_IMAGE_BASE}/HGTHJB.jpg`,
    structureImage: `${COUPLING_IMAGE_BASE}/HGTH.png`,
    technicalImage: `${COUPLING_IMAGE_BASE}/HGTH-T.png`,
    dimensionsImage: `${COUPLING_IMAGE_BASE}/HGTH-D.png`,
    dimensionsImage2: `${COUPLING_IMAGE_BASE}/HGTH－２.png`,
    matchingTable: `${COUPLING_IMAGE_BASE}/HGTH-PT.png`,
    detailUrl: 'http://www.hzcoupling.com/222.html'
  },

  'HGTQ': {
    name: 'HGTQ系列高弹性联轴器',
    description: '额定扭矩范围：5-31.5 kN·m，共九个尺寸组',
    features: [
      '扭转型高弹性联轴器，适用于中、大马力齿轮箱',
      '弹性元件为整体环形，径向留有通风孔便于散热',
      '弹性板可有效减少轴向力，保护主机与辅机',
      '径向刚度较小，位移补偿能力强',
      '已匹配HCT1100、HC1200、HC1250及HCQ1400百余台'
    ],
    torqueRange: '5-31.5 kN·m',
    productImage: `${COUPLING_IMAGE_BASE}/HGTQ.gif`,
    structureImage: `${COUPLING_IMAGE_BASE}/HGTQ-1.png`,
    technicalImage: `${COUPLING_IMAGE_BASE}/HGTQ-T.png`,
    dimensionsImage: `${COUPLING_IMAGE_BASE}/HGTQ-W.png`,
    detailUrl: 'http://www.hzcoupling.com/218.html'
  },

  'HGTL': {
    name: 'HGTL(X)系列高弹性联轴器',
    description: '额定扭矩范围：0.63-10 kN·m，适用于中小功率',
    features: [
      '扭转型高弹性联轴器，适用于中、小功率齿轮箱',
      '弹性体齿形为渐开线，可满足旧机组改造需求',
      'HGTLX系列带有过载保护的限位装置',
      '弹性元件最高工作温度60°C',
      '采用轴向插入式，安装方便'
    ],
    torqueRange: '0.63-10 kN·m',
    productImage: `${COUPLING_IMAGE_BASE}/HGTLX.jpg`,
    structureImage: `${COUPLING_IMAGE_BASE}/HGTLX.png`,
    technicalImage: `${COUPLING_IMAGE_BASE}/HGTLX-T.png`,
    dimensionsImage: `${COUPLING_IMAGE_BASE}/HGTLX-W.png`,
    drawings: [
      { model: 'HGTL1.8-2.2', url: `${COUPLING_IMAGE_BASE}/HGTL1.8-2.2.png` },
      { model: 'HGTLX3.5-4.5', url: `${COUPLING_IMAGE_BASE}/HGTLX3.5-4.5.png` },
      { model: 'HGTLX4.9-6.0', url: `${COUPLING_IMAGE_BASE}/HGTLX4.9-6.0.png` },
      { model: 'HGTLX7.5-8.6', url: `${COUPLING_IMAGE_BASE}/HGTLX7.5-8.6.png` }
    ],
    detailUrl: 'http://www.hzcoupling.com/220.html'
  },

  'HGTLX': {
    name: 'HGTLX系列高弹性联轴器（带过载保护）',
    description: '额定扭矩范围：3.5-8.6 kN·m，带过载保护限位装置',
    features: [
      '扭转型高弹性联轴器，带过载保护限位装置',
      '弹性体齿形为渐开线，可满足旧机组改造需求',
      '弹性元件最高工作温度60°C',
      '采用轴向插入式，安装方便',
      '适用于振动较大的工况'
    ],
    torqueRange: '3.5-8.6 kN·m',
    productImage: `${COUPLING_IMAGE_BASE}/HGTLX.jpg`,
    structureImage: `${COUPLING_IMAGE_BASE}/HGTLX.png`,
    technicalImage: `${COUPLING_IMAGE_BASE}/HGTLX-T.png`,
    dimensionsImage: `${COUPLING_IMAGE_BASE}/HGTLX-W.png`,
    detailUrl: 'http://www.hzcoupling.com/220.html'
  },

  'HQTQ': {
    name: 'HQTQ系列高弹性联轴器',
    description: '消化吸收德国技术，性价比极高',
    features: [
      '在消化、吸收德国先进技术基础上改进研制',
      '结构紧凑，安装维护方便，性价比极高',
      '高弹性，吸收冲击振动能力强',
      '能有效调节传动系统的扭振特性，减震降噪',
      '可在较高转速下工作，补偿能力强'
    ],
    torqueRange: '多规格可选',
    productImage: `${COUPLING_IMAGE_BASE}/HQTQ.png`,
    applications: ['柴油机', '发电机', '水泵', '泥浆泵', '压缩机', '工程机械', '风力发电装置'],
    detailUrl: 'http://www.hzcoupling.com/224.html'
  },

  'HGTHT': {
    name: 'HGTHT系列（重型）',
    description: '额定扭矩范围：4-8.6 kN·m，重载设计',
    features: [
      '重载设计，传递能力更强',
      '适用于拖网渔船等重载工况',
      '增强型橡胶元件，耐磨性好',
      '抗冲击能力强',
      '使用寿命长'
    ],
    torqueRange: '4-8.6 kN·m',
    productImage: `${COUPLING_IMAGE_BASE}/HGTH.png`,
    technicalImage: `${COUPLING_IMAGE_BASE}/HGTH-T.png`,
    dimensionsImage: `${COUPLING_IMAGE_BASE}/HGTH-D.png`,
    detailUrl: 'http://www.hzcoupling.com/222.html'
  },

  'HGTHB': {
    name: 'HGTHB系列（B型双排并联）',
    description: '额定扭矩范围：0.5-40 kN·m，传递能力为单排2倍',
    features: [
      'B型设计，双排弹性体并联',
      '传递能力、动态刚度均为单排2倍',
      '适用于特殊安装要求',
      '结构紧凑，可靠性高',
      '适用于大扭矩传递场合'
    ],
    torqueRange: '0.5-40 kN·m',
    productImage: `${COUPLING_IMAGE_BASE}/HGTH.png`,
    technicalImage: `${COUPLING_IMAGE_BASE}/HGTH-T.png`,
    dimensionsImage: `${COUPLING_IMAGE_BASE}/HGTH-D.png`,
    detailUrl: 'http://www.hzcoupling.com/222.html'
  },

  'HGTHJ': {
    name: 'HGTHJ系列（J型加强齿部）',
    description: '额定扭矩范围：4-40 kN·m，齿部加强设计',
    features: [
      'J型设计，齿部加强结构',
      '齿部受剪切可靠性更高',
      '许用环境温度为-30~80°C',
      '适用于高温或低温环境',
      '使用寿命比普通型更长'
    ],
    torqueRange: '4-40 kN·m',
    productImage: `${COUPLING_IMAGE_BASE}/HGTH.png`,
    technicalImage: `${COUPLING_IMAGE_BASE}/HGTH-T.png`,
    matchingTable: `${COUPLING_IMAGE_BASE}/HGTH-PT.png`,
    detailUrl: 'http://www.hzcoupling.com/222.html'
  },

  'HGT': {
    name: 'HGT系列标准高弹性联轴器',
    description: '标准型高弹性联轴器，适用范围广',
    features: [
      '标准型高弹性联轴器',
      '以橡胶为主要传扭元件',
      '结构简单，安装方便',
      '适用于一般船用传动系统',
      '性价比高'
    ],
    torqueRange: '多规格可选',
    productImage: `${COUPLING_IMAGE_BASE}/HGTHJB.jpg`,
    structureImage: `${COUPLING_IMAGE_BASE}/HGTH.png`,
    technicalImage: `${COUPLING_IMAGE_BASE}/HGTH-T.png`,
    dimensionsImage: `${COUPLING_IMAGE_BASE}/HGTH-D.png`,
    detailUrl: 'http://www.hzcoupling.com/222.html'
  }
};

// 获取系列信息的辅助函数
export function getSeriesInfo(model) {
  // 从型号中提取系列名称
  const seriesPatterns = [
    { pattern: /^HGTLX/, series: 'HGTLX' },
    { pattern: /^HGTL/, series: 'HGTL' },
    { pattern: /^HGTHJ/, series: 'HGTHJ' },
    { pattern: /^HGTHT/, series: 'HGTHT' },
    { pattern: /^HGTHB/, series: 'HGTHB' },
    { pattern: /^HGTH/, series: 'HGTH' },
    { pattern: /^HGTS/, series: 'HGTS' },
    { pattern: /^HGTQ/, series: 'HGTQ' },
    { pattern: /^HQTQ/, series: 'HQTQ' },
    { pattern: /^HGT/, series: 'HGT' }
  ];

  for (const { pattern, series } of seriesPatterns) {
    if (pattern.test(model)) {
      return couplingSeriesInfo[series] || null;
    }
  }

  return couplingSeriesInfo['HGT']; // 默认返回HGT系列
}

// 获取所有系列名称
export function getAllSeriesNames() {
  return Object.keys(couplingSeriesInfo);
}

// 获取系列的图片列表
export function getSeriesImages(series) {
  const info = couplingSeriesInfo[series];
  if (!info) return [];

  const images = [];
  if (info.productImage) images.push({ url: info.productImage, caption: '产品外观', icon: '⚙️' });
  if (info.structureImage) images.push({ url: info.structureImage, caption: '结构示意图', icon: '🔧' });
  if (info.technicalImage) images.push({ url: info.technicalImage, caption: '技术参数表', icon: '📊' });
  if (info.dimensionsImage) images.push({ url: info.dimensionsImage, caption: '尺寸规格图', icon: '📏' });
  if (info.dimensionsImage2) images.push({ url: info.dimensionsImage2, caption: '安装尺寸图', icon: '📐' });
  if (info.matchingTable) images.push({ url: info.matchingTable, caption: '匹配对照表', icon: '📋' });

  return images;
}

export default couplingSeriesInfo;
