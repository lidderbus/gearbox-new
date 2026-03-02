/**
 * 市场情报分析工具
 * Market Intelligence Utilities
 */

import { marketSegments, swotBySegment, segmentSalesPitches } from '../data/competitorDataEnhanced';

const mfgColors = {
  HANGCHI: '#D4AF37', CZCG: '#C41E3A', NGC: '#1E90FF', ZF: '#003366',
  Reintjes: '#4169E1', TwinDisc: '#B22222', DCSG: '#228B22',
  FADA: '#FF8C00', Fenjin: '#9ACD32', others: '#999'
};

const mfgLabels = {
  HANGCHI: '杭齿', CZCG: '重齿', NGC: '南高精', ZF: 'ZF',
  Reintjes: '莱茵齿', TwinDisc: 'Twin Disc', DCSG: '大连船齿',
  FADA: '发达', Fenjin: '奋进', others: '其他'
};

// shares可能是对象{HANGCHI:45}或数组[{manufacturer,share}]，统一转为数组
const normalizeShares = (shares) => {
  if (!shares) return [];
  if (Array.isArray(shares)) return shares;
  return Object.entries(shares).map(([manufacturer, share]) => ({ manufacturer, share }));
};

export const getSegmentList = () => {
  if (!marketSegments) return [];
  return Object.values(marketSegments).map(s => ({
    id: s.id, name: s.name, description: s.description
  }));
};

export const getSegmentAnalysis = (segmentId) => {
  const seg = marketSegments?.[segmentId];
  if (!seg) return null;
  const sharesArr = normalizeShares(seg.shares);
  const hangchiEntry = sharesArr.find(s => s.manufacturer === 'HANGCHI');
  const sorted = [...sharesArr].sort((a, b) => b.share - a.share);
  const hangchiRank = sorted.findIndex(s => s.manufacturer === 'HANGCHI') + 1;
  return {
    segment: { id: seg.id, name: seg.name, description: seg.description, powerRange: seg.powerRange },
    shares: sharesArr,
    hangchiShare: hangchiEntry?.share || 0,
    hangchiRank: hangchiRank || '-',
    keyBuyingFactors: seg.keyBuyingFactors || seg.keyFactors || [],
    hangchiPosition: seg.hangchiPosition || seg.notes || ''
  };
};

export const getMarketShareData = (segmentId) => {
  const seg = marketSegments?.[segmentId];
  if (!seg || !seg.shares) return null;
  const sharesArr = normalizeShares(seg.shares);
  return {
    data: sharesArr.map(s => ({
      name: `${mfgLabels[s.manufacturer] || s.manufacturer} ${s.share}%`,
      value: s.share
    })),
    colors: sharesArr.map(s => mfgColors[s.manufacturer] || mfgColors.others)
  };
};

export const generatePositioningMapData = (segmentId, products) => {
  if (!products || products.length === 0) return null;
  return {
    data: products.map(p => ({
      name: p.model,
      value: [(p.estimatedPrice || p.price || 0) / 10000, p.transferCapacity || 0],
      symbol: p.manufacturer === 'HANGCHI' ? 'diamond' : 'circle',
      symbolSize: p.manufacturer === 'HANGCHI' ? 20 : 14,
      color: mfgColors[p.manufacturer] || '#999'
    }))
  };
};

export const getSegmentRecommendation = (segmentId) => {
  const recommendations = {
    fishing: {
      recommendation: '杭齿HC系列在渔船市场占有率25%，累计装机超10000台。建议以批量采购优惠和快速配件供应为切入点。',
      targetCustomers: ['远洋渔船船东', '渔船建造厂', '渔业公司'],
      competitiveStrategy: '价格+服务双驱动，强调国产配件现货优势，对比进口品牌长交期劣势',
      keyDifferentiators: ['性价比高', '配件现货', '沿海服务网点全覆盖', '批量折扣']
    },
    mediumCommercial: {
      recommendation: '杭齿在中型商船市场占据40%份额，是绝对主导品牌。重点维护现有客户，同时拓展高端替代市场。',
      targetCustomers: ['中型散货船东', '集装箱支线船', '沿海运输公司'],
      competitiveStrategy: '以市场领导者姿态巩固份额，提供全套解决方案（齿轮箱+联轴器+备用泵）',
      keyDifferentiators: ['市场份额第一', '全套配套能力', '交期保障', '售后网络最完善']
    },
    inland: {
      recommendation: '杭齿在内河船市场份额45%，遥遥领先。重点是标准化产品降本增效，防御低价竞品。',
      targetCustomers: ['内河航运公司', '长江船舶建造厂', '运河船舶'],
      competitiveStrategy: '标准化+批量化降低成本，建立价格壁垒。提升售后响应速度形成服务壁垒',
      keyDifferentiators: ['价格最优', '标准化交付快', '内河专用系列', '本地化服务']
    },
    engineering: {
      recommendation: '杭齿在工程船/拖轮市场份额35%排名第一。关键是大扭矩可靠性验证和快速响应能力。',
      targetCustomers: ['拖轮运营商', '工程船建造厂', '港口服务公司'],
      competitiveStrategy: '突出大扭矩工况下的可靠性，以成功案例和客户口碑拓展市场',
      keyDifferentiators: ['大扭矩可靠性', '全国服务响应快', '成功案例丰富', '配件保障']
    },
    military: {
      recommendation: '军船/公务船市场杭齿占30%仅次于重齿。国产替代政策是最大机遇，需强化军品质量体系认证。',
      targetCustomers: ['海军装备部', '海警/海事', '公务船建造厂'],
      competitiveStrategy: '强调国产自主可控、供应链安全，以GW系列高可靠性对标重齿',
      keyDifferentiators: ['国产自主可控', '军品质量认证', 'GW系列高可靠', '供应链安全']
    },
    offshore: {
      recommendation: '海工市场杭齿份额较低，NGC和ZF主导。可通过GW大功率系列逐步切入，以价格优势获得首单。',
      targetCustomers: ['海工平台运营商', '海工船建造厂'],
      competitiveStrategy: '以价格优势获取试用机会，积累海工业绩后逐步提升份额',
      keyDifferentiators: ['价格优势明显', 'GW系列大功率覆盖', '快速交付']
    },
    yacht: {
      recommendation: '游艇市场以ZF和TwinDisc为主，杭齿份额15%。可聚焦中档游艇/公务艇细分市场。',
      targetCustomers: ['国产游艇厂', '公务快艇建造厂'],
      competitiveStrategy: '差异化定位中端市场，避免与ZF在高端正面竞争',
      keyDifferentiators: ['中端性价比', '国内售后便捷', '快速交付']
    },
    largeCommercial: {
      recommendation: '大型商船市场重齿和NGC占主导，杭齿份额15%。GW大功率系列是突破口。',
      targetCustomers: ['大型散货船东', '油轮运营商', '大型船建造厂'],
      competitiveStrategy: '以GWC/GWS系列对标重齿同功率段产品，突出价格和交期优势',
      keyDifferentiators: ['GW系列大功率', '交期快于重齿', '价格优势']
    }
  };
  return recommendations[segmentId] || recommendations.mediumCommercial;
};

export const getSwotForSegment = (segmentId) => {
  return swotBySegment?.[segmentId] || swotBySegment?.mediumCommercial || {
    strengths: ['性价比高', '交期短', '售后网络完善'],
    weaknesses: ['品牌知名度不如ZF', '大功率市场份额待提升'],
    opportunities: ['国产替代趋势', '一带一路海外拓展'],
    threats: ['低价竞品冲击', '进口品牌降价策略']
  };
};

export const getSegmentPitches = (segmentId) => {
  return segmentSalesPitches?.[segmentId] || [];
};

export const getSegmentOptions = () => {
  return getSegmentList().map(s => ({ value: s.id, label: s.name }));
};
