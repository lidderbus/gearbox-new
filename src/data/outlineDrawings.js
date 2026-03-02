// src/data/outlineDrawings.js
// 齿轮箱和联轴器外形图数据索引

// 导入DWG数据
import {
  gearboxDwgDrawings,
  couplingDwgDrawings,
  dwgSeriesInfo,
  DWG_BASE_URL,
  getDwgDownloadUrl as _getDwgDownloadUrl,
  getShareCADPreviewUrl as _getShareCADPreviewUrl,
  getPdfPreviewUrl as _getPdfPreviewUrl
} from './dwgDrawings';

/**
 * 外形图数据结构
 * - gearboxDrawings: 齿轮箱外形图
 * - couplingDrawings: 联轴器外形图
 *
 * 每个型号可包含:
 * - mainView: 主视图
 * - sideView: 侧视图
 * - topView: 俯视图
 * - dimensions: 尺寸图
 * - installationGuide: 安装图
 * - thumbnail: 缩略图
 */

// 齿轮箱系列信息
export const gearboxSeriesInfo = {
  'HC': { name: 'HC系列', description: '标准船用齿轮箱', powerRange: '30-500kW' },
  'HCD': { name: 'HCD系列', description: '大功率船用齿轮箱', powerRange: '200-2000kW' },
  'HCT': { name: 'HCT系列', description: '推力型船用齿轮箱', powerRange: '100-800kW' },
  'HCM': { name: 'HCM系列', description: '中型船用齿轮箱', powerRange: '50-400kW' },
  'HCQ': { name: 'HCQ系列', description: '轻型船用齿轮箱', powerRange: '20-150kW' },
  'GCS': { name: 'GCS系列', description: '工程船用齿轮箱', powerRange: '200-1500kW' },
  'GWS': { name: 'GWS系列', description: '双输出工程船用齿轮箱', powerRange: '300-2000kW' },
  'DT': { name: 'DT系列', description: '电力推进齿轮箱', powerRange: '500-5000kW' },
  'HCS': { name: 'HCS系列', description: '标准型船用齿轮箱', powerRange: '100-600kW' },
  'HCDS': { name: 'HCDS系列', description: '大功率双输出齿轮箱', powerRange: '400-2500kW' },
};

// 联轴器系列信息
export const couplingSeriesInfo = {
  'HGTH': { name: 'HGTH系列', description: '高弹性联轴器(标准型)', torqueRange: '0.5-25kN·m' },
  'HGTHT': { name: 'HGTHT系列', description: '高弹性联轴器(高扭矩型)', torqueRange: '2-50kN·m' },
  'HGTHB': { name: 'HGTHB系列', description: '高弹性联轴器(大扭矩型)', torqueRange: '5-80kN·m' },
  'HGTL': { name: 'HGTL系列', description: '高弹性联轴器(轻型)', torqueRange: '0.2-10kN·m' },
  'HGTQ': { name: 'HGTQ系列', description: '高扭矩齿式弹性联轴器', torqueRange: '3-100kN·m' },
  'HGT': { name: 'HGT系列', description: '标准齿式弹性联轴器', torqueRange: '1-50kN·m' },
};

// 齿轮箱外形图数据
export const gearboxDrawings = {
  // HC系列
  'HC65': {
    series: 'HC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/default-1.jpg',
    dimensions: '/drawings/gearbox/hc65-dims.svg',
    description: 'HC65船用齿轮箱',
    powerRange: '15-30kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/default-1.jpg',
    available: true // 标记是否有实际图纸
  },
  'HC85': {
    series: 'HC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/default-2.jpg',
    dimensions: '/drawings/gearbox/hc85-dims.svg',
    description: 'HC85船用齿轮箱',
    powerRange: '20-50kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/default-2.jpg',
    available: true
  },
  'HC135': {
    series: 'HC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/default-3.jpg',
    dimensions: '/drawings/gearbox/hc135-dims.svg',
    description: 'HC135船用齿轮箱',
    powerRange: '40-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/default-3.jpg',
    available: true
  },
  'HC200': {
    series: 'HC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/default-4.jpg',
    dimensions: '/drawings/gearbox/hc200-dims.svg',
    description: 'HC200船用齿轮箱',
    powerRange: '60-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/default-4.jpg',
    available: true
  },
  'HC300': {
    series: 'HC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hc400-1.jpg',
    dimensions: '/drawings/gearbox/hc300-dims.svg',
    description: 'HC300船用齿轮箱',
    powerRange: '100-180kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hc400-1.jpg',
    available: true
  },
  'HC400': {
    series: 'HC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hc400-1.jpg',
    sideView: '/drawings/gearbox/hc400-side.svg',
    dimensions: '/drawings/gearbox/hc400-dims.svg',
    installationGuide: '/drawings/gearbox/hc400-install.svg',
    description: 'HC400船用齿轮箱',
    powerRange: '150-280kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hc400-1.jpg',
    available: true
  },
  'HC600': {
    series: 'HC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hc1000-1.jpg',
    dimensions: '/drawings/gearbox/hc600-dims.svg',
    description: 'HC600船用齿轮箱',
    powerRange: '200-400kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hc1000-1.jpg',
    available: true
  },

  // HCD系列
  'HCD400A': {
    series: 'HCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hcd400-1.jpg',
    sideView: '/drawings/gearbox/hcd400a-side.svg',
    dimensions: '/drawings/gearbox/hcd400a-dims.svg',
    description: 'HCD400A大功率船用齿轮箱',
    powerRange: '220-350kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hcd400-1.jpg',
    available: true
  },
  'HCD600A': {
    series: 'HCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hcd400-1.jpg',
    sideView: '/drawings/gearbox/hcd600a-side.svg',
    dimensions: '/drawings/gearbox/hcd600a-dims.svg',
    installationGuide: '/drawings/gearbox/hcd600a-install.svg',
    description: 'HCD600A大功率船用齿轮箱',
    powerRange: '350-550kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hcd400-1.jpg',
    available: true
  },
  'HCD800': {
    series: 'HCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hc1000-2.jpg',
    sideView: '/drawings/gearbox/hcd800-side.svg',
    dimensions: '/drawings/gearbox/hcd800-dims.svg',
    description: 'HCD800大功率船用齿轮箱',
    powerRange: '500-800kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hc1000-2.jpg',
    available: true
  },
  'HCD1000': {
    series: 'HCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hc1000-3.jpg',
    dimensions: '/drawings/gearbox/hcd1000-dims.svg',
    description: 'HCD1000大功率船用齿轮箱',
    powerRange: '700-1200kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hc1000-3.jpg',
    available: true
  },
  'HCD1400': {
    series: 'HCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hc1000-1.jpg',
    dimensions: '/drawings/gearbox/hcd1400-dims.svg',
    description: 'HCD1400大功率船用齿轮箱',
    powerRange: '1000-1600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hc1000-1.jpg',
    available: true
  },

  // HCM系列
  'HCM200': {
    series: 'HCM',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hcm-large.jpg',
    dimensions: '/drawings/gearbox/hcm200-dims.svg',
    description: 'HCM200中型船用齿轮箱',
    powerRange: '70-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hcm-large.jpg',
    available: true
  },
  'HCM300': {
    series: 'HCM',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hcm-large.jpg',
    dimensions: '/drawings/gearbox/hcm300-dims.svg',
    description: 'HCM300中型船用齿轮箱',
    powerRange: '100-220kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hcm-large.jpg',
    available: true
  },
  'HCM400': {
    series: 'HCM',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hcm-thumb.jpg',
    sideView: '/drawings/gearbox/hcm400-side.svg',
    dimensions: '/drawings/gearbox/hcm400-dims.svg',
    description: 'HCM400中型船用齿轮箱',
    powerRange: '150-300kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hcm-thumb.jpg',
    available: true
  },
  'HCM400A': {
    series: 'HCM',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hcm-thumb.jpg',
    dimensions: '/drawings/gearbox/hcm400a-dims.svg',
    description: 'HCM400A中型船用齿轮箱',
    powerRange: '180-350kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hcm-thumb.jpg',
    available: true
  },

  // GCS系列
  'GCS320': {
    series: 'GCS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/gc-large.jpg',
    dimensions: '/drawings/gearbox/gcs320-dims.svg',
    description: 'GCS320工程船用齿轮箱',
    powerRange: '200-400kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/gc-large.jpg',
    available: true
  },
  'GCS400': {
    series: 'GCS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/gc-tech.jpg',
    dimensions: '/drawings/gearbox/gcs400-dims.svg',
    description: 'GCS400工程船用齿轮箱',
    powerRange: '300-550kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/gc-tech.jpg',
    available: true
  },

  // DT系列 (电力推进)
  'DT1400': {
    series: 'DT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/default-1.jpg',
    sideView: '/drawings/gearbox/dt1400-side.svg',
    dimensions: '/drawings/gearbox/dt1400-dims.svg',
    installationGuide: '/drawings/gearbox/dt1400-install.svg',
    description: 'DT1400电力推进齿轮箱',
    powerRange: '1000-2000kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/default-1.jpg',
    available: true
  },
  'DT2000': {
    series: 'DT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/default-2.jpg',
    dimensions: '/drawings/gearbox/dt2000-dims.svg',
    description: 'DT2000电力推进齿轮箱',
    powerRange: '1500-3000kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/default-2.jpg',
    available: true
  },

  // 120C系列 (案例中提到的型号)
  '120C': {
    series: 'HC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-120C-HCV120.webp',
    sideView: '/drawings/gearbox/120c-side.svg',
    dimensions: '/drawings/gearbox/120c-dims.svg',
    installationGuide: '/drawings/gearbox/120c-install.svg',
    description: '120C船用齿轮箱 (205kW配套)',
    powerRange: '100-205kW',
    specs: {
      inputSpeed: '1000-2500rpm',
      ratio: '2:1 (1.94:1)',
      thrust: '25kN',
      weight: '225kg',
      dimensions: '432×440×650mm'
    },
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-120C-HCV120.webp',
    available: true
  },

  // ==================== HCQ系列 (轻型) ====================
  'HCQ100': {
    series: 'HCQ',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ100-MV100A.webp',
    description: 'HCQ100轻型船用齿轮箱',
    powerRange: '30-60kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ100-MV100A.webp',
    available: true
  },
  'HCQ138': {
    series: 'HCQ',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/HCQ138-HCA138-.webp',
    description: 'HCQ138轻型船用齿轮箱',
    powerRange: '40-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/HCQ138-HCA138-.webp',
    available: true
  },
  'HCQ300': {
    series: 'HCQ',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300-301-302_4_11zon.webp',
    description: 'HCQ300轻型船用齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300-301-302_4_11zon.webp',
    available: true
  },
  'HCQ400': {
    series: 'HCQ',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp',
    description: 'HCQ400轻型船用齿轮箱',
    powerRange: '100-200kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp',
    available: true
  },
  'HCQ401': {
    series: 'HCQ',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp',
    description: 'HCQ401轻型船用齿轮箱',
    powerRange: '100-200kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp',
    available: true
  },
  'HCQ500': {
    series: 'HCQ',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp',
    description: 'HCQ500轻型船用齿轮箱',
    powerRange: '150-280kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp',
    available: true
  },
  'HCQ501': {
    series: 'HCQ',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp',
    description: 'HCQ501轻型船用齿轮箱',
    powerRange: '150-280kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp',
    available: true
  },
  'HCQ700': {
    series: 'HCQ',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp',
    description: 'HCQ700轻型船用齿轮箱',
    powerRange: '200-400kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp',
    available: true
  },
  'HCQ701': {
    series: 'HCQ',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp',
    description: 'HCQ701轻型船用齿轮箱',
    powerRange: '200-400kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp',
    available: true
  },
  'HCQ1000': {
    series: 'HCQ',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp',
    description: 'HCQ1000轻型船用齿轮箱',
    powerRange: '300-600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp',
    available: true
  },
  'HCQ1400': {
    series: 'HCQ',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp',
    description: 'HCQ1400轻型船用齿轮箱',
    powerRange: '400-800kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp',
    available: true
  },

  // ==================== HCA系列 (倾角型) ====================
  'HCA138': {
    series: 'HCA',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/HCQ138-HCA138-.webp',
    description: 'HCA138倾角型船用齿轮箱',
    powerRange: '40-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/HCQ138-HCA138-.webp',
    available: true
  },
  'HCA300': {
    series: 'HCA',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300-301-302_4_11zon.webp',
    description: 'HCA300倾角型船用齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300-301-302_4_11zon.webp',
    available: true
  },
  'HCA700': {
    series: 'HCA',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp',
    description: 'HCA700倾角型船用齿轮箱',
    powerRange: '200-400kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp',
    available: true
  },
  'HCA1000': {
    series: 'HCA',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp',
    description: 'HCA1000倾角型船用齿轮箱',
    powerRange: '300-600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp',
    available: true
  },
  'HCA1400': {
    series: 'HCA',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp',
    description: 'HCA1400倾角型船用齿轮箱',
    powerRange: '400-800kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp',
    available: true
  },

  // ==================== HCT系列 (推力型) ====================
  'HCT400A': {
    series: 'HCT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hct600-1.jpg',
    description: 'HCT400A推力型船用齿轮箱',
    powerRange: '150-280kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hct600-1.jpg',
    available: true
  },
  'HCT600': {
    series: 'HCT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hct600-1.jpg',
    description: 'HCT600推力型船用齿轮箱',
    powerRange: '200-400kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hct600-1.jpg',
    available: true
  },
  'HCT600A': {
    series: 'HCT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hct600-1.jpg',
    description: 'HCT600A推力型船用齿轮箱',
    powerRange: '220-450kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hct600-1.jpg',
    available: true
  },
  'HCT800': {
    series: 'HCT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hct1280-1.jpg',
    description: 'HCT800推力型船用齿轮箱',
    powerRange: '300-550kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hct1280-1.jpg',
    available: true
  },
  'HCT1000': {
    series: 'HCT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hct1280-1.jpg',
    description: 'HCT1000推力型船用齿轮箱',
    powerRange: '400-700kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hct1280-1.jpg',
    available: true
  },
  'HCT1200': {
    series: 'HCT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hct1280-1.jpg',
    description: 'HCT1200推力型船用齿轮箱',
    powerRange: '500-900kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hct1280-1.jpg',
    available: true
  },
  'HCT1400': {
    series: 'HCT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hct1280-3.jpg',
    description: 'HCT1400推力型船用齿轮箱',
    powerRange: '600-1100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hct1280-3.jpg',
    available: true
  },
  'HCT1600': {
    series: 'HCT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1600.webp',
    description: 'HCT1600推力型船用齿轮箱',
    powerRange: '700-1300kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1600.webp',
    available: true
  },
  'HCT2000': {
    series: 'HCT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2000.webp',
    description: 'HCT2000推力型船用齿轮箱',
    powerRange: '900-1600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2000.webp',
    available: true
  },

  // ==================== HCS系列 (标准型) ====================
  'HCS138': {
    series: 'HCS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC138-.webp',
    description: 'HCS138标准型船用齿轮箱',
    powerRange: '40-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC138-.webp',
    available: true
  },
  'HCS201': {
    series: 'HCS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-200-201-230.webp',
    description: 'HCS201标准型船用齿轮箱',
    powerRange: '60-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-200-201-230.webp',
    available: true
  },
  'HCS302': {
    series: 'HCS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300-301-302_4_11zon.webp',
    description: 'HCS302标准型船用齿轮箱',
    powerRange: '80-180kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300-301-302_4_11zon.webp',
    available: true
  },
  'HCS400': {
    series: 'HCS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hc400-1.jpg',
    description: 'HCS400标准型船用齿轮箱',
    powerRange: '120-250kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hc400-1.jpg',
    available: true
  },
  'HCS600': {
    series: 'HCS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC600A.webp',
    description: 'HCS600标准型船用齿轮箱',
    powerRange: '200-400kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC600A.webp',
    available: true
  },
  'HCS1000': {
    series: 'HCS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    description: 'HCS1000标准型船用齿轮箱',
    powerRange: '400-700kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    available: true
  },
  'HCS1200': {
    series: 'HCS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1100-1200.webp',
    description: 'HCS1200标准型船用齿轮箱',
    powerRange: '500-900kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1100-1200.webp',
    available: true
  },
  'HCS1600': {
    series: 'HCS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1600.webp',
    description: 'HCS1600标准型船用齿轮箱',
    powerRange: '700-1200kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1600.webp',
    available: true
  },
  'HCS2000': {
    series: 'HCS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2000.webp',
    description: 'HCS2000标准型船用齿轮箱',
    powerRange: '900-1500kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2000.webp',
    available: true
  },
  'HCS2700': {
    series: 'HCS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    description: 'HCS2700标准型船用齿轮箱',
    powerRange: '1200-2000kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    available: true
  },

  // ==================== HCV系列 (V型) ====================
  'HCV120': {
    series: 'HCV',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-120C-HCV120.webp',
    description: 'HCV120 V型船用齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-120C-HCV120.webp',
    available: true
  },

  // ==================== GWC系列 (渔船用) ====================
  'GWC36.39': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC36.39渔船用齿轮箱',
    powerRange: '200-350kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC42.45': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC42.45渔船用齿轮箱',
    powerRange: '250-450kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC52.59': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC52.59渔船用齿轮箱',
    powerRange: '350-600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC60.66': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC60.66渔船用齿轮箱',
    powerRange: '400-700kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC70.82': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC70.82渔船用齿轮箱',
    powerRange: '500-900kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },

  // ==================== GWH系列 (渔船用液压) ====================
  'GWH36.39': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH36.39渔船用液压齿轮箱',
    powerRange: '200-350kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH45.49': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH45.49渔船用液压齿轮箱',
    powerRange: '280-500kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH52.59': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH52.59渔船用液压齿轮箱',
    powerRange: '350-600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH63.71': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH63.71渔船用液压齿轮箱',
    powerRange: '450-800kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },

  // ==================== GWS系列 (双速) ====================
  'GWS36.39': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS36.39双速渔船齿轮箱',
    powerRange: '200-350kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS45.49': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS45.49双速渔船齿轮箱',
    powerRange: '280-500kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS52.59': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS52.59双速渔船齿轮箱',
    powerRange: '350-600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS60.66': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS60.66双速渔船齿轮箱',
    powerRange: '400-700kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },

  // ==================== GWD系列 ====================
  'GWD36.39': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD36.39渔船用齿轮箱',
    powerRange: '200-350kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD45.49': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD45.49渔船用齿轮箱',
    powerRange: '280-500kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD52.59': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD52.59渔船用齿轮箱',
    powerRange: '350-600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },

  // ==================== GWK/GWL系列 ====================
  'GWK36.39': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK36.39渔船用齿轮箱',
    powerRange: '200-350kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWL36.39': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL36.39渔船用齿轮箱',
    powerRange: '200-350kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL52.59': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL52.59渔船用齿轮箱',
    powerRange: '350-600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },

  // ==================== 2GWH系列 ====================
  '2GWH600': {
    series: '2GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    description: '2GWH600双机并车齿轮箱',
    powerRange: '400-800kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    available: true
  },
  '2GWH1060': {
    series: '2GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    description: '2GWH1060双机并车齿轮箱',
    powerRange: '700-1200kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    available: true
  },
  '2GWH1830': {
    series: '2GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    description: '2GWH1830双机并车齿轮箱',
    powerRange: '1200-2000kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    available: true
  },

  // ==================== MA/MB系列 ====================
  'MA100': {
    series: 'MA',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/MA.webp',
    description: 'MA100船用齿轮箱',
    powerRange: '50-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/MA.webp',
    available: true
  },
  'MA125': {
    series: 'MA',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/MA.webp',
    description: 'MA125船用齿轮箱',
    powerRange: '60-130kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/MA.webp',
    available: true
  },
  'MB170': {
    series: 'MB',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-MB.webp',
    description: 'MB170船用齿轮箱',
    powerRange: '80-170kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-MB.webp',
    available: true
  },
  'MB242': {
    series: 'MB',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-MB.webp',
    description: 'MB242船用齿轮箱',
    powerRange: '120-250kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-MB.webp',
    available: true
  },
  'MB270A': {
    series: 'MB',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-MB.webp',
    description: 'MB270A船用齿轮箱',
    powerRange: '150-280kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-MB.webp',
    available: true
  },

  // ==================== MV系列 ====================
  'MV100A': {
    series: 'MV',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ100-MV100A.webp',
    description: 'MV100A V型船用齿轮箱',
    powerRange: '50-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ100-MV100A.webp',
    available: true
  },

  // ==================== HC更多型号 ====================
  'HC138': {
    series: 'HC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC138-.webp',
    description: 'HC138船用齿轮箱',
    powerRange: '40-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC138-.webp',
    available: true
  },
  'HC1000': {
    series: 'HC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    description: 'HC1000船用齿轮箱',
    powerRange: '400-700kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    available: true
  },
  'HC1200': {
    series: 'HC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1100-1200.webp',
    description: 'HC1200船用齿轮箱',
    powerRange: '500-900kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1100-1200.webp',
    available: true
  },
  'HC1600': {
    series: 'HC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1600.webp',
    description: 'HC1600船用齿轮箱',
    powerRange: '700-1200kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1600.webp',
    available: true
  },
  'HC2000': {
    series: 'HC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2000.webp',
    description: 'HC2000船用齿轮箱',
    powerRange: '900-1500kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2000.webp',
    available: true
  },

  // ==================== HCD更多型号 ====================
  'HCD138': {
    series: 'HCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-135.webp',
    description: 'HCD138大功率船用齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-135.webp',
    available: true
  },
  'HCD350': {
    series: 'HCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/hcd400-1.jpg',
    description: 'HCD350大功率船用齿轮箱',
    powerRange: '180-300kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/hcd400-1.jpg',
    available: true
  },
  'HCD400': {
    series: 'HCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCD400A.webp',
    description: 'HCD400大功率船用齿轮箱',
    powerRange: '200-350kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCD400A.webp',
    available: true
  },
  'HCD600': {
    series: 'HCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC600A.webp',
    description: 'HCD600大功率船用齿轮箱',
    powerRange: '350-550kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC600A.webp',
    available: true
  },
  'HCD1200': {
    series: 'HCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1100-1200.webp',
    description: 'HCD1200大功率船用齿轮箱',
    powerRange: '700-1100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1100-1200.webp',
    available: true
  },
  'HCD1600': {
    series: 'HCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1600.webp',
    description: 'HCD1600大功率船用齿轮箱',
    powerRange: '900-1400kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1600.webp',
    available: true
  },
  'HCD2000': {
    series: 'HCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2000.webp',
    description: 'HCD2000大功率船用齿轮箱',
    powerRange: '1200-1800kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2000.webp',
    available: true
  },
  'HCD2700': {
    series: 'HCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    description: 'HCD2700大功率船用齿轮箱',
    powerRange: '1500-2500kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    available: true
  },

  // ==================== GC系列 ====================
  'GC600': {
    series: 'GC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GC600工程船用齿轮箱',
    powerRange: '300-500kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GC800': {
    series: 'GC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GC800工程船用齿轮箱',
    powerRange: '400-700kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GC1000': {
    series: 'GC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GC1000工程船用齿轮箱',
    powerRange: '500-900kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },

  // GWC系列 (渔船专用齿轮箱)
  'GWC20.34': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC20.34渔船齿轮箱',
    powerRange: '15-25kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC20.54': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC20.54渔船齿轮箱',
    powerRange: '15-25kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC26.58': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC26.58渔船齿轮箱',
    powerRange: '20-35kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC28.30': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC28.30渔船齿轮箱',
    powerRange: '20-40kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC28.30P': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC28.30P渔船齿轮箱(带PTO)',
    powerRange: '20-40kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC30.32': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC30.32渔船齿轮箱',
    powerRange: '25-45kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC30.32P': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC30.32P渔船齿轮箱(带PTO)',
    powerRange: '25-45kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC32.35': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC32.35渔船齿轮箱',
    powerRange: '25-50kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC32.35P': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC32.35P渔船齿轮箱(带PTO)',
    powerRange: '25-50kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC36.39': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC36.39渔船齿轮箱',
    powerRange: '30-55kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC36.39P': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC36.39P渔船齿轮箱(带PTO)',
    powerRange: '30-55kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC36.58': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC36.58渔船齿轮箱',
    powerRange: '30-55kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC36.59': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC36.59渔船齿轮箱',
    powerRange: '30-55kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC39.41': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC39.41渔船齿轮箱',
    powerRange: '35-60kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC39.41P': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC39.41P渔船齿轮箱(带PTO)',
    powerRange: '35-60kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC42.45': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC42.45渔船齿轮箱',
    powerRange: '40-70kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC42.45P': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC42.45P渔船齿轮箱(带PTO)',
    powerRange: '40-70kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC45.49': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC45.49渔船齿轮箱',
    powerRange: '45-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC45.49P': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC45.49P渔船齿轮箱(带PTO)',
    powerRange: '45-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC45.52': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC45.52渔船齿轮箱',
    powerRange: '45-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC46.59': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC46.59渔船齿轮箱',
    powerRange: '45-85kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC46.60': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC46.60渔船齿轮箱',
    powerRange: '45-85kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC49.54': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC49.54渔船齿轮箱',
    powerRange: '50-90kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC49.54P': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC49.54P渔船齿轮箱(带PTO)',
    powerRange: '50-90kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC49.59': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC49.59渔船齿轮箱',
    powerRange: '50-90kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC52.59': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC52.59渔船齿轮箱',
    powerRange: '55-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC52.59P': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC52.59P渔船齿轮箱(带PTO)',
    powerRange: '55-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC52.62': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC52.62渔船齿轮箱',
    powerRange: '55-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC56.61': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC56.61渔船齿轮箱',
    powerRange: '60-110kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC60.66': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC60.66渔船齿轮箱',
    powerRange: '65-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC60.66P': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC60.66P渔船齿轮箱(带PTO)',
    powerRange: '65-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC60.74': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC60.74渔船齿轮箱',
    powerRange: '65-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC61.65': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC61.65渔船齿轮箱',
    powerRange: '65-125kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC63.71': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC63.71渔船齿轮箱',
    powerRange: '70-130kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC63.71P': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC63.71P渔船齿轮箱(带PTO)',
    powerRange: '70-130kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC66.75': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC66.75渔船齿轮箱',
    powerRange: '75-140kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC70.76': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC70.76渔船齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC70.82': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC70.82渔船齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC70.85': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC70.85渔船齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC75.90': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC75.90渔船齿轮箱',
    powerRange: '85-160kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC78.88': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC78.88渔船齿轮箱',
    powerRange: '90-170kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC78.96': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC78.96渔船齿轮箱',
    powerRange: '90-170kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC80.95': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC80.95渔船齿轮箱',
    powerRange: '95-180kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWC85.100': {
    series: 'GWC',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWC85.100渔船齿轮箱',
    powerRange: '100-200kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },

  // GWCD系列 (渔船双速齿轮箱)
  'GWCD26.70': {
    series: 'GWCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWCD26.70渔船双速齿轮箱',
    powerRange: '20-40kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWCD36.70': {
    series: 'GWCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWCD36.70渔船双速齿轮箱',
    powerRange: '30-55kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWCD46.71': {
    series: 'GWCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWCD46.71渔船双速齿轮箱',
    powerRange: '45-85kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWCD56.72': {
    series: 'GWCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWCD56.72渔船双速齿轮箱',
    powerRange: '60-110kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWCD67.80': {
    series: 'GWCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWCD67.80渔船双速齿轮箱',
    powerRange: '75-140kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWCD79.85': {
    series: 'GWCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWCD79.85渔船双速齿轮箱',
    powerRange: '90-170kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },
  'GWCD90.100': {
    series: 'GWCD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    description: 'GWCD90.100渔船双速齿轮箱',
    powerRange: '110-220kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWC.webp',
    available: true
  },

  // GWH系列 (高速渔船齿轮箱)
  'GWH28.30': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH28.30高速渔船齿轮箱',
    powerRange: '20-40kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH30.32A': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH30.32A高速渔船齿轮箱',
    powerRange: '25-45kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH32.35': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH32.35高速渔船齿轮箱',
    powerRange: '25-50kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH36.39': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH36.39高速渔船齿轮箱',
    powerRange: '30-55kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH36.54': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH36.54高速渔船齿轮箱',
    powerRange: '30-55kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH39.41': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH39.41高速渔船齿轮箱',
    powerRange: '35-60kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH39.57': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH39.57高速渔船齿轮箱',
    powerRange: '35-60kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH42.45': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH42.45高速渔船齿轮箱',
    powerRange: '40-70kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH42.63': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH42.63高速渔船齿轮箱',
    powerRange: '40-70kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH45.49': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH45.49高速渔船齿轮箱',
    powerRange: '45-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH45.68B': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH45.68B高速渔船齿轮箱',
    powerRange: '45-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH49.54': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH49.54高速渔船齿轮箱',
    powerRange: '50-90kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH49.74': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH49.74高速渔船齿轮箱',
    powerRange: '50-90kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH52.59': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH52.59高速渔船齿轮箱',
    powerRange: '55-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH52.82': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH52.82高速渔船齿轮箱',
    powerRange: '55-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH60.66': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH60.66高速渔船齿轮箱',
    powerRange: '65-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH60.92': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH60.92高速渔船齿轮箱',
    powerRange: '65-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH63.71': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH63.71高速渔船齿轮箱',
    powerRange: '70-130kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH63.95': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH63.95高速渔船齿轮箱',
    powerRange: '70-130kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH66.75': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH66.75高速渔船齿轮箱',
    powerRange: '75-140kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH66.106': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH66.106高速渔船齿轮箱',
    powerRange: '75-140kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH70.76': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH70.76高速渔船齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH70.82': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH70.82高速渔船齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },
  'GWH70.111': {
    series: 'GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    description: 'GWH70.111高速渔船齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWH.webp',
    available: true
  },

  // GWD系列 (双机并车齿轮箱)
  'GWD28.30': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD28.30双机并车齿轮箱',
    powerRange: '20-40kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD30.32A': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD30.32A双机并车齿轮箱',
    powerRange: '25-45kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD32.35': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD32.35双机并车齿轮箱',
    powerRange: '25-50kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD36.39': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD36.39双机并车齿轮箱',
    powerRange: '30-55kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD36.54': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD36.54双机并车齿轮箱',
    powerRange: '30-55kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD39.41': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD39.41双机并车齿轮箱',
    powerRange: '35-60kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD39.57': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD39.57双机并车齿轮箱',
    powerRange: '35-60kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD42.45': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD42.45双机并车齿轮箱',
    powerRange: '40-70kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD42.63': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD42.63双机并车齿轮箱',
    powerRange: '40-70kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD45.49': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD45.49双机并车齿轮箱',
    powerRange: '45-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD45.68': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD45.68双机并车齿轮箱',
    powerRange: '45-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD49.54': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD49.54双机并车齿轮箱',
    powerRange: '50-90kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD49.74': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD49.74双机并车齿轮箱',
    powerRange: '50-90kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD52.59': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD52.59双机并车齿轮箱',
    powerRange: '55-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD52.82': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD52.82双机并车齿轮箱',
    powerRange: '55-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD60.66': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD60.66双机并车齿轮箱',
    powerRange: '65-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD60.92': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD60.92双机并车齿轮箱',
    powerRange: '65-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD63.71': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD63.71双机并车齿轮箱',
    powerRange: '70-130kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD63.95': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD63.95双机并车齿轮箱',
    powerRange: '70-130kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD66.75': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD66.75双机并车齿轮箱',
    powerRange: '75-140kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD66.106': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD66.106双机并车齿轮箱',
    powerRange: '75-140kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD70.76': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD70.76双机并车齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD70.82': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD70.82双机并车齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },
  'GWD70.111': {
    series: 'GWD',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    description: 'GWD70.111双机并车齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWD.webp',
    available: true
  },

  // GWK系列 (可调螺距桨齿轮箱)
  'GWK28.30': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK28.30可调螺距桨齿轮箱',
    powerRange: '20-40kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK30.32A': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK30.32A可调螺距桨齿轮箱',
    powerRange: '25-45kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK32.35': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK32.35可调螺距桨齿轮箱',
    powerRange: '25-50kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK36.39': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK36.39可调螺距桨齿轮箱',
    powerRange: '30-55kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK36.54': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK36.54可调螺距桨齿轮箱',
    powerRange: '30-55kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK39.41': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK39.41可调螺距桨齿轮箱',
    powerRange: '35-60kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK42.45': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK42.45可调螺距桨齿轮箱',
    powerRange: '40-70kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK42.63': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK42.63可调螺距桨齿轮箱',
    powerRange: '40-70kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK45.49': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK45.49可调螺距桨齿轮箱',
    powerRange: '45-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK45.68': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK45.68可调螺距桨齿轮箱',
    powerRange: '45-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK49.54': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK49.54可调螺距桨齿轮箱',
    powerRange: '50-90kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK49.74': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK49.74可调螺距桨齿轮箱',
    powerRange: '50-90kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK52.59': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK52.59可调螺距桨齿轮箱',
    powerRange: '55-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK52.82': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK52.82可调螺距桨齿轮箱',
    powerRange: '55-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK60.66': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK60.66可调螺距桨齿轮箱',
    powerRange: '65-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK60.92': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK60.92可调螺距桨齿轮箱',
    powerRange: '65-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK63.71': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK63.71可调螺距桨齿轮箱',
    powerRange: '70-130kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK63.95': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK63.95可调螺距桨齿轮箱',
    powerRange: '70-130kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK66.75': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK66.75可调螺距桨齿轮箱',
    powerRange: '75-140kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK66.106': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK66.106可调螺距桨齿轮箱',
    powerRange: '75-140kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK70.76': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK70.76可调螺距桨齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK70.82': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK70.82可调螺距桨齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },
  'GWK70.111': {
    series: 'GWK',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    description: 'GWK70.111可调螺距桨齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWK.webp',
    available: true
  },

  // GWL系列 (轻型渔船齿轮箱)
  'GWL28.30': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL28.30轻型渔船齿轮箱',
    powerRange: '20-40kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL30.32': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL30.32轻型渔船齿轮箱',
    powerRange: '25-45kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL32.35': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL32.35轻型渔船齿轮箱',
    powerRange: '25-50kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL36.39': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL36.39轻型渔船齿轮箱',
    powerRange: '30-55kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL39.41': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL39.41轻型渔船齿轮箱',
    powerRange: '35-60kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL42.45': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL42.45轻型渔船齿轮箱',
    powerRange: '40-70kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL45.49': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL45.49轻型渔船齿轮箱',
    powerRange: '45-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL45.52': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL45.52轻型渔船齿轮箱',
    powerRange: '45-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL49.54': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL49.54轻型渔船齿轮箱',
    powerRange: '50-90kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL49.59': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL49.59轻型渔船齿轮箱',
    powerRange: '50-90kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL52.59': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL52.59轻型渔船齿轮箱',
    powerRange: '55-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL52.62': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL52.62轻型渔船齿轮箱',
    powerRange: '55-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL60.66': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL60.66轻型渔船齿轮箱',
    powerRange: '65-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL60.74': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL60.74轻型渔船齿轮箱',
    powerRange: '65-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL66.75': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL66.75轻型渔船齿轮箱',
    powerRange: '75-140kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL70.76': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL70.76轻型渔船齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL70.82': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL70.82轻型渔船齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL70.85': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL70.85轻型渔船齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL75.90': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL75.90轻型渔船齿轮箱',
    powerRange: '85-160kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL78.88': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL78.88轻型渔船齿轮箱',
    powerRange: '90-170kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL80.95': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL80.95轻型渔船齿轮箱',
    powerRange: '95-180kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },
  'GWL85.100': {
    series: 'GWL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    description: 'GWL85.100轻型渔船齿轮箱',
    powerRange: '100-200kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWL.webp',
    available: true
  },

  // GWS系列 (双输出渔船齿轮箱)
  'GWS28.30': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS28.30双输出渔船齿轮箱',
    powerRange: '20-40kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS28.30P': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS28.30P双输出渔船齿轮箱(带PTO)',
    powerRange: '20-40kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS30.32A': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS30.32A双输出渔船齿轮箱',
    powerRange: '25-45kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS30.32P': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS30.32P双输出渔船齿轮箱(带PTO)',
    powerRange: '25-45kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS32.35': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS32.35双输出渔船齿轮箱',
    powerRange: '25-50kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS32.35P': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS32.35P双输出渔船齿轮箱(带PTO)',
    powerRange: '25-50kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS36.39': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS36.39双输出渔船齿轮箱',
    powerRange: '30-55kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS36.39P': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS36.39P双输出渔船齿轮箱(带PTO)',
    powerRange: '30-55kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS36.54': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS36.54双输出渔船齿轮箱',
    powerRange: '30-55kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS39.41': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS39.41双输出渔船齿轮箱',
    powerRange: '35-60kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS39.41P': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS39.41P双输出渔船齿轮箱(带PTO)',
    powerRange: '35-60kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS39.57': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS39.57双输出渔船齿轮箱',
    powerRange: '35-60kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS42.45': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS42.45双输出渔船齿轮箱',
    powerRange: '40-70kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS42.45P': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS42.45P双输出渔船齿轮箱(带PTO)',
    powerRange: '40-70kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS42.63': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS42.63双输出渔船齿轮箱',
    powerRange: '40-70kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS45.49': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS45.49双输出渔船齿轮箱',
    powerRange: '45-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS45.49P': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS45.49P双输出渔船齿轮箱(带PTO)',
    powerRange: '45-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS45.68': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS45.68双输出渔船齿轮箱',
    powerRange: '45-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS49.54': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS49.54双输出渔船齿轮箱',
    powerRange: '50-90kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS49.54P': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS49.54P双输出渔船齿轮箱(带PTO)',
    powerRange: '50-90kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS49.61': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS49.61双输出渔船齿轮箱',
    powerRange: '50-90kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS49.74': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS49.74双输出渔船齿轮箱',
    powerRange: '50-90kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS52.59': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS52.59双输出渔船齿轮箱',
    powerRange: '55-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS52.59P': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS52.59P双输出渔船齿轮箱(带PTO)',
    powerRange: '55-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS52.71': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS52.71双输出渔船齿轮箱',
    powerRange: '55-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS52.82': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS52.82双输出渔船齿轮箱',
    powerRange: '55-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS60.66': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS60.66双输出渔船齿轮箱',
    powerRange: '65-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS60.66P': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS60.66P双输出渔船齿轮箱(带PTO)',
    powerRange: '65-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS60.75': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS60.75双输出渔船齿轮箱',
    powerRange: '65-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS60.92': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS60.92双输出渔船齿轮箱',
    powerRange: '65-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS63.71': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS63.71双输出渔船齿轮箱',
    powerRange: '70-130kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS63.95': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS63.95双输出渔船齿轮箱',
    powerRange: '70-130kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS66.75': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS66.75双输出渔船齿轮箱',
    powerRange: '75-140kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS66.106': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS66.106双输出渔船齿轮箱',
    powerRange: '75-140kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS70.76': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS70.76双输出渔船齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS70.82': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS70.82双输出渔船齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'GWS70.111': {
    series: 'GWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'GWS70.111双输出渔船齿轮箱',
    powerRange: '80-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },

  // ========== SGW系列 (单机渔船齿轮箱) ==========
  'SGW30.32': {
    series: 'SGW',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'SGW30.32单机渔船齿轮箱',
    powerRange: '30-60kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'SGW32.35': {
    series: 'SGW',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'SGW32.35单机渔船齿轮箱',
    powerRange: '35-70kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'SGW39.41': {
    series: 'SGW',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'SGW39.41单机渔船齿轮箱',
    powerRange: '40-80kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'SGW42.45': {
    series: 'SGW',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'SGW42.45单机渔船齿轮箱',
    powerRange: '45-90kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'SGW49.54': {
    series: 'SGW',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'SGW49.54单机渔船齿轮箱',
    powerRange: '50-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },

  // ========== SGWS系列 (双输出单机渔船齿轮箱) ==========
  'SGWS49.54': {
    series: 'SGWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'SGWS49.54双输出单机渔船齿轮箱',
    powerRange: '50-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'SGWS52.59': {
    series: 'SGWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'SGWS52.59双输出单机渔船齿轮箱',
    powerRange: '55-110kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'SGWS60.66': {
    series: 'SGWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'SGWS60.66双输出单机渔船齿轮箱',
    powerRange: '65-130kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'SGWS66.75': {
    series: 'SGWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'SGWS66.75双输出单机渔船齿轮箱',
    powerRange: '70-140kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },
  'SGWS70.76': {
    series: 'SGWS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    description: 'SGWS70.76双输出单机渔船齿轮箱',
    powerRange: '75-150kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GWS.webp',
    available: true
  },

  // ========== 2GWH系列 (双机高速渔船齿轮箱) ==========
  '2GWH400': {
    series: '2GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    description: '2GWH400双机高速渔船齿轮箱',
    powerRange: '200-400kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    available: true
  },
  '2GWH600': {
    series: '2GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    description: '2GWH600双机高速渔船齿轮箱',
    powerRange: '300-600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    available: true
  },
  '2GWH800': {
    series: '2GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    description: '2GWH800双机高速渔船齿轮箱',
    powerRange: '400-800kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    available: true
  },
  '2GWH1060': {
    series: '2GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    description: '2GWH1060双机高速渔船齿轮箱',
    powerRange: '500-1060kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    available: true
  },
  '2GWH1830': {
    series: '2GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    description: '2GWH1830双机高速渔船齿轮箱',
    powerRange: '900-1830kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    available: true
  },
  '2GWH3140': {
    series: '2GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    description: '2GWH3140双机高速渔船齿轮箱',
    powerRange: '1500-3140kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    available: true
  },
  '2GWH4100': {
    series: '2GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    description: '2GWH4100双机高速渔船齿轮箱',
    powerRange: '2000-4100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    available: true
  },
  '2GWH5410': {
    series: '2GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    description: '2GWH5410双机高速渔船齿轮箱',
    powerRange: '2700-5410kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    available: true
  },
  '2GWH7050': {
    series: '2GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    description: '2GWH7050双机高速渔船齿轮箱',
    powerRange: '3500-7050kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    available: true
  },
  '2GWH9250': {
    series: '2GWH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    description: '2GWH9250双机高速渔船齿轮箱',
    powerRange: '4600-9250kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2GWH.webp',
    available: true
  },

  // ========== HCL系列 (轻型船用齿轮箱) ==========
  'HCL30': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    description: 'HCL30轻型船用齿轮箱',
    powerRange: '20-40kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    available: true
  },
  'HCL30F': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    description: 'HCL30F轻型船用齿轮箱',
    powerRange: '20-40kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    available: true
  },
  'HCL30S': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    description: 'HCL30S轻型船用齿轮箱',
    powerRange: '20-40kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    available: true
  },
  'HCL100': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    description: 'HCL100轻型船用齿轮箱',
    powerRange: '50-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    available: true
  },
  'HCL100F': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    description: 'HCL100F轻型船用齿轮箱',
    powerRange: '50-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    available: true
  },
  'HCL100S': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    description: 'HCL100S轻型船用齿轮箱',
    powerRange: '50-100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    available: true
  },
  'HCL250': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    description: 'HCL250轻型船用齿轮箱',
    powerRange: '100-250kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    available: true
  },
  'HCL250A': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    description: 'HCL250A轻型船用齿轮箱',
    powerRange: '100-250kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    available: true
  },
  'HCL250F': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    description: 'HCL250F轻型船用齿轮箱',
    powerRange: '100-250kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    available: true
  },
  'HCL250S': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    description: 'HCL250S轻型船用齿轮箱',
    powerRange: '100-250kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    available: true
  },
  'HCL320': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    description: 'HCL320轻型船用齿轮箱',
    powerRange: '150-320kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    available: true
  },
  'HCL320F': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    description: 'HCL320F轻型船用齿轮箱',
    powerRange: '150-320kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    available: true
  },
  'HCL320S': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    description: 'HCL320S轻型船用齿轮箱',
    powerRange: '150-320kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC65.webp',
    available: true
  },
  'HCL600': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC600A.webp',
    description: 'HCL600轻型船用齿轮箱',
    powerRange: '300-600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC600A.webp',
    available: true
  },
  'HCL600F': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC600A.webp',
    description: 'HCL600F轻型船用齿轮箱',
    powerRange: '300-600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC600A.webp',
    available: true
  },
  'HCL600S': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC600A.webp',
    description: 'HCL600S轻型船用齿轮箱',
    powerRange: '300-600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC600A.webp',
    available: true
  },
  'HCL800': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    description: 'HCL800轻型船用齿轮箱',
    powerRange: '400-800kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    available: true
  },
  'HCL800F': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    description: 'HCL800F轻型船用齿轮箱',
    powerRange: '400-800kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    available: true
  },
  'HCL800S': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    description: 'HCL800S轻型船用齿轮箱',
    powerRange: '400-800kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    available: true
  },
  'HCL1000': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    description: 'HCL1000轻型船用齿轮箱',
    powerRange: '500-1000kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    available: true
  },
  'HCL1000F': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    description: 'HCL1000F轻型船用齿轮箱',
    powerRange: '500-1000kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    available: true
  },
  'HCL1000S': {
    series: 'HCL',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    description: 'HCL1000S轻型船用齿轮箱',
    powerRange: '500-1000kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    available: true
  },

  // ========== HCG系列 (工程船用齿轮箱) ==========
  'HCG1068': {
    series: 'HCG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    description: 'HCG1068工程船用齿轮箱',
    powerRange: '500-1068kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    available: true
  },
  'HCG1220': {
    series: 'HCG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1100-1200.webp',
    description: 'HCG1220工程船用齿轮箱',
    powerRange: '600-1220kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1100-1200.webp',
    available: true
  },
  'HCG1400': {
    series: 'HCG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1400.webp',
    description: 'HCG1400工程船用齿轮箱',
    powerRange: '700-1400kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1400.webp',
    available: true
  },
  'HCG1500': {
    series: 'HCG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1400.webp',
    description: 'HCG1500工程船用齿轮箱',
    powerRange: '750-1500kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1400.webp',
    available: true
  },
  'HCG1665': {
    series: 'HCG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1600.webp',
    description: 'HCG1665工程船用齿轮箱',
    powerRange: '800-1665kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1600.webp',
    available: true
  },
  'HCG2050': {
    series: 'HCG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2000.webp',
    description: 'HCG2050工程船用齿轮箱',
    powerRange: '1000-2050kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2000.webp',
    available: true
  },
  'HCG3050': {
    series: 'HCG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    description: 'HCG3050工程船用齿轮箱',
    powerRange: '1500-3050kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    available: true
  },
  'HCG5050': {
    series: 'HCG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    description: 'HCG5050工程船用齿轮箱',
    powerRange: '2500-5050kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    available: true
  },
  'HCG6400': {
    series: 'HCG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    description: 'HCG6400工程船用齿轮箱',
    powerRange: '3200-6400kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    available: true
  },
  'HCG7650': {
    series: 'HCG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    description: 'HCG7650工程船用齿轮箱',
    powerRange: '3800-7650kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    available: true
  },
  'HCG9060': {
    series: 'HCG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    description: 'HCG9060工程船用齿轮箱',
    powerRange: '4500-9060kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    available: true
  },

  // ========== HCDS系列 (HCD双输出齿轮箱) ==========
  'HCDS302': {
    series: 'HCDS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300.webp',
    description: 'HCDS302双输出船用齿轮箱',
    powerRange: '150-300kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300.webp',
    available: true
  },
  'HCDS400': {
    series: 'HCDS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCD400A.webp',
    description: 'HCDS400双输出船用齿轮箱',
    powerRange: '200-400kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCD400A.webp',
    available: true
  },
  'HCDS600': {
    series: 'HCDS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC600A.webp',
    description: 'HCDS600双输出船用齿轮箱',
    powerRange: '300-600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC600A.webp',
    available: true
  },
  'HCDS800': {
    series: 'HCDS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    description: 'HCDS800双输出船用齿轮箱',
    powerRange: '400-800kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    available: true
  },
  'HCDS1200': {
    series: 'HCDS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1100-1200.webp',
    description: 'HCDS1200双输出船用齿轮箱',
    powerRange: '600-1200kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1100-1200.webp',
    available: true
  },
  'HCDS1400': {
    series: 'HCDS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1400.webp',
    description: 'HCDS1400双输出船用齿轮箱',
    powerRange: '700-1400kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1400.webp',
    available: true
  },
  'HCDS1600': {
    series: 'HCDS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1600.webp',
    description: 'HCDS1600双输出船用齿轮箱',
    powerRange: '800-1600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1600.webp',
    available: true
  },
  'HCDS2000': {
    series: 'HCDS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2000.webp',
    description: 'HCDS2000双输出船用齿轮箱',
    powerRange: '1000-2000kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2000.webp',
    available: true
  },
  'HCDS2700': {
    series: 'HCDS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    description: 'HCDS2700双输出船用齿轮箱',
    powerRange: '1350-2700kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    available: true
  },

  // ========== HCTS系列 (HCT双输出齿轮箱) ==========
  'HCTS800': {
    series: 'HCTS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    description: 'HCTS800双输出推力型齿轮箱',
    powerRange: '400-800kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    available: true
  },
  'HCTS1200': {
    series: 'HCTS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1100-1200.webp',
    description: 'HCTS1200双输出推力型齿轮箱',
    powerRange: '600-1200kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1100-1200.webp',
    available: true
  },
  'HCTS1400': {
    series: 'HCTS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1400.webp',
    description: 'HCTS1400双输出推力型齿轮箱',
    powerRange: '700-1400kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1400.webp',
    available: true
  },
  'HCTS1600': {
    series: 'HCTS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1600.webp',
    description: 'HCTS1600双输出推力型齿轮箱',
    powerRange: '800-1600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1600.webp',
    available: true
  },
  'HCTS2000': {
    series: 'HCTS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2000.webp',
    description: 'HCTS2000双输出推力型齿轮箱',
    powerRange: '1000-2000kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2000.webp',
    available: true
  },
  'HCTS2700': {
    series: 'HCTS',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    description: 'HCTS2700双输出推力型齿轮箱',
    powerRange: '1350-2700kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    available: true
  },

  // ========== HCDX系列 (HCD增强型齿轮箱) ==========
  'HCDX300': {
    series: 'HCDX',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300.webp',
    description: 'HCDX300增强型船用齿轮箱',
    powerRange: '150-300kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300.webp',
    available: true
  },
  'HCDX400': {
    series: 'HCDX',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCD400A.webp',
    description: 'HCDX400增强型船用齿轮箱',
    powerRange: '200-400kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCD400A.webp',
    available: true
  },
  'HCDX600': {
    series: 'HCDX',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC600A.webp',
    description: 'HCDX600增强型船用齿轮箱',
    powerRange: '300-600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC600A.webp',
    available: true
  },
  'HCDX800': {
    series: 'HCDX',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    description: 'HCDX800增强型船用齿轮箱',
    powerRange: '400-800kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    available: true
  },

  // ========== HCQH系列 (HCQ高速型齿轮箱) ==========
  'HCQH700': {
    series: 'HCQH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp',
    description: 'HCQH700高速型船用齿轮箱',
    powerRange: '350-700kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp',
    available: true
  },
  'HCQH1000': {
    series: 'HCQH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp',
    description: 'HCQH1000高速型船用齿轮箱',
    powerRange: '500-1000kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp',
    available: true
  },
  'HCQH1600': {
    series: 'HCQH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1600.webp',
    description: 'HCQH1600高速型船用齿轮箱',
    powerRange: '800-1600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1600.webp',
    available: true
  },

  // ========== HCAM系列 (HCA电控型齿轮箱) ==========
  'HCAM303': {
    series: 'HCAM',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300.webp',
    description: 'HCAM303电控型船用齿轮箱',
    powerRange: '150-303kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300.webp',
    available: true
  },
  'HCAM403': {
    series: 'HCAM',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp',
    description: 'HCAM403电控型船用齿轮箱',
    powerRange: '200-403kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp',
    available: true
  },

  // ========== HCAG系列 (HCA燃气轮机齿轮箱) ==========
  'HCAG1090': {
    series: 'HCAG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    description: 'HCAG1090燃气轮机船用齿轮箱',
    powerRange: '545-1090kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-800-1000.webp',
    available: true
  },
  'HCAG3050': {
    series: 'HCAG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    description: 'HCAG3050燃气轮机船用齿轮箱',
    powerRange: '1525-3050kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    available: true
  },
  'HCAG5050': {
    series: 'HCAG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    description: 'HCAG5050燃气轮机船用齿轮箱',
    powerRange: '2525-5050kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    available: true
  },
  'HCAG6400': {
    series: 'HCAG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    description: 'HCAG6400燃气轮机船用齿轮箱',
    powerRange: '3200-6400kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    available: true
  },
  'HCAG7650': {
    series: 'HCAG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    description: 'HCAG7650燃气轮机船用齿轮箱',
    powerRange: '3825-7650kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    available: true
  },
  'HCAG9055': {
    series: 'HCAG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    description: 'HCAG9055燃气轮机船用齿轮箱',
    powerRange: '4528-9055kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    available: true
  },

  // ========== GCH系列 (GC高速系列) ==========
  'GCH320': {
    series: 'GCH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCH320高速工业齿轮箱',
    powerRange: '160-320kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCH350': {
    series: 'GCH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCH350高速工业齿轮箱',
    powerRange: '175-350kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCH390': {
    series: 'GCH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCH390高速工业齿轮箱',
    powerRange: '195-390kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCH410': {
    series: 'GCH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCH410高速工业齿轮箱',
    powerRange: '205-410kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCH490': {
    series: 'GCH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCH490高速工业齿轮箱',
    powerRange: '245-490kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCH540': {
    series: 'GCH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCH540高速工业齿轮箱',
    powerRange: '270-540kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCH590': {
    series: 'GCH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCH590高速工业齿轮箱',
    powerRange: '295-590kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCH660': {
    series: 'GCH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCH660高速工业齿轮箱',
    powerRange: '330-660kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCH750': {
    series: 'GCH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCH750高速工业齿轮箱',
    powerRange: '375-750kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCH760': {
    series: 'GCH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCH760高速工业齿轮箱',
    powerRange: '380-760kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCH850': {
    series: 'GCH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCH850高速工业齿轮箱',
    powerRange: '425-850kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCH880': {
    series: 'GCH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCH880高速工业齿轮箱',
    powerRange: '440-880kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCH900': {
    series: 'GCH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCH900高速工业齿轮箱',
    powerRange: '450-900kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCH950': {
    series: 'GCH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCH950高速工业齿轮箱',
    powerRange: '475-950kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCH1000': {
    series: 'GCH',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCH1000高速工业齿轮箱',
    powerRange: '500-1000kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },

  // ========== GCHE系列 (GC电控系列) ==========
  'GCHE5': {
    series: 'GCHE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHE5电控工业齿轮箱',
    powerRange: '3-5kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHE6': {
    series: 'GCHE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHE6电控工业齿轮箱',
    powerRange: '4-6kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHE9': {
    series: 'GCHE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHE9电控工业齿轮箱',
    powerRange: '5-9kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHE11': {
    series: 'GCHE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHE11电控工业齿轮箱',
    powerRange: '6-11kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHE15': {
    series: 'GCHE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHE15电控工业齿轮箱',
    powerRange: '8-15kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHE20': {
    series: 'GCHE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHE20电控工业齿轮箱',
    powerRange: '10-20kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHE26': {
    series: 'GCHE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHE26电控工业齿轮箱',
    powerRange: '13-26kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHE33': {
    series: 'GCHE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHE33电控工业齿轮箱',
    powerRange: '17-33kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHE44': {
    series: 'GCHE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHE44电控工业齿轮箱',
    powerRange: '22-44kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },

  // ========== GCHT系列 (GC变矩器系列) ==========
  'GCHT5': {
    series: 'GCHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHT5变矩器工业齿轮箱',
    powerRange: '3-5kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHT6': {
    series: 'GCHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHT6变矩器工业齿轮箱',
    powerRange: '4-6kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHT9': {
    series: 'GCHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHT9变矩器工业齿轮箱',
    powerRange: '5-9kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHT11': {
    series: 'GCHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHT11变矩器工业齿轮箱',
    powerRange: '6-11kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHT15': {
    series: 'GCHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHT15变矩器工业齿轮箱',
    powerRange: '8-15kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHT20': {
    series: 'GCHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHT20变矩器工业齿轮箱',
    powerRange: '10-20kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHT26': {
    series: 'GCHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHT26变矩器工业齿轮箱',
    powerRange: '13-26kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHT33': {
    series: 'GCHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHT33变矩器工业齿轮箱',
    powerRange: '17-33kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHT44': {
    series: 'GCHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHT44变矩器工业齿轮箱',
    powerRange: '22-44kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHT66': {
    series: 'GCHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHT66变矩器工业齿轮箱',
    powerRange: '33-66kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHT77': {
    series: 'GCHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHT77变矩器工业齿轮箱',
    powerRange: '39-77kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHT91': {
    series: 'GCHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHT91变矩器工业齿轮箱',
    powerRange: '46-91kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHT108': {
    series: 'GCHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHT108变矩器工业齿轮箱',
    powerRange: '54-108kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHT115': {
    series: 'GCHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHT115变矩器工业齿轮箱',
    powerRange: '58-115kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHT135': {
    series: 'GCHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHT135变矩器工业齿轮箱',
    powerRange: '68-135kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCHT170': {
    series: 'GCHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCHT170变矩器工业齿轮箱',
    powerRange: '85-170kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },

  // ========== GCSE系列 (GC双速电控系列) ==========
  'GCSE5': {
    series: 'GCSE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCSE5双速电控工业齿轮箱',
    powerRange: '3-5kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCSE6': {
    series: 'GCSE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCSE6双速电控工业齿轮箱',
    powerRange: '4-6kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCSE9': {
    series: 'GCSE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCSE9双速电控工业齿轮箱',
    powerRange: '5-9kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCSE11': {
    series: 'GCSE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCSE11双速电控工业齿轮箱',
    powerRange: '6-11kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCSE15': {
    series: 'GCSE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCSE15双速电控工业齿轮箱',
    powerRange: '8-15kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCSE20': {
    series: 'GCSE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCSE20双速电控工业齿轮箱',
    powerRange: '10-20kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCSE26': {
    series: 'GCSE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCSE26双速电控工业齿轮箱',
    powerRange: '13-26kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCSE33': {
    series: 'GCSE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCSE33双速电控工业齿轮箱',
    powerRange: '17-33kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCSE44': {
    series: 'GCSE',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCSE44双速电控工业齿轮箱',
    powerRange: '22-44kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },

  // ========== GCST系列 (GC双速变矩器系列) ==========
  'GCST5': {
    series: 'GCST',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCST5双速变矩器工业齿轮箱',
    powerRange: '3-5kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCST6': {
    series: 'GCST',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCST6双速变矩器工业齿轮箱',
    powerRange: '4-6kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCST9': {
    series: 'GCST',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCST9双速变矩器工业齿轮箱',
    powerRange: '5-9kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCST11': {
    series: 'GCST',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCST11双速变矩器工业齿轮箱',
    powerRange: '6-11kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCST15': {
    series: 'GCST',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCST15双速变矩器工业齿轮箱',
    powerRange: '8-15kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCST20': {
    series: 'GCST',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCST20双速变矩器工业齿轮箱',
    powerRange: '10-20kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCST26': {
    series: 'GCST',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCST26双速变矩器工业齿轮箱',
    powerRange: '13-26kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCST33': {
    series: 'GCST',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCST33双速变矩器工业齿轮箱',
    powerRange: '17-33kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCST44': {
    series: 'GCST',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCST44双速变矩器工业齿轮箱',
    powerRange: '22-44kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCST66': {
    series: 'GCST',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCST66双速变矩器工业齿轮箱',
    powerRange: '33-66kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCST77': {
    series: 'GCST',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCST77双速变矩器工业齿轮箱',
    powerRange: '39-77kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCST91': {
    series: 'GCST',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCST91双速变矩器工业齿轮箱',
    powerRange: '46-91kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCST108': {
    series: 'GCST',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCST108双速变矩器工业齿轮箱',
    powerRange: '54-108kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCST115': {
    series: 'GCST',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCST115双速变矩器工业齿轮箱',
    powerRange: '58-115kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCST135': {
    series: 'GCST',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCST135双速变矩器工业齿轮箱',
    powerRange: '68-135kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },
  'GCST170': {
    series: 'GCST',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    description: 'GCST170双速变矩器工业齿轮箱',
    powerRange: '85-170kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-GC.webp',
    available: true
  },

  // ========== HGTHJB系列 (高弹联轴器) ==========
  'HGTHJB5': {
    series: 'HGTHJB',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    description: 'HGTHJB5高弹性联轴器',
    torque: '5 kN·m',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    available: true
  },
  'HGTHJB6.3': {
    series: 'HGTHJB',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    description: 'HGTHJB6.3高弹性联轴器',
    torque: '6.3 kN·m',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    available: true
  },
  'HGTHJB8': {
    series: 'HGTHJB',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    description: 'HGTHJB8高弹性联轴器',
    torque: '8 kN·m',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    available: true
  },
  'HGTHJB10': {
    series: 'HGTHJB',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    description: 'HGTHJB10高弹性联轴器',
    torque: '10 kN·m',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    available: true
  },

  // ========== 单型号系列 ==========
  'HCN120': {
    series: 'HCN',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/HCN120.webp',
    description: 'HCN120船用齿轮箱',
    powerRange: '60-120kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/HCN120.webp',
    available: true
  },
  'HCNM280T': {
    series: 'HCNM',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-200-201-230.webp',
    description: 'HCNM280T船用齿轮箱',
    powerRange: '140-280kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-200-201-230.webp',
    available: true
  },
  'HCVG3710': {
    series: 'HCVG',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    description: 'HCVG3710 V型驱动船用齿轮箱',
    powerRange: '1855-3710kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-2700.webp',
    available: true
  },
  'HCW1100': {
    series: 'HCW',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1100-1200.webp',
    description: 'HCW1100船用齿轮箱',
    powerRange: '550-1100kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-1100-1200.webp',
    available: true
  },
  'D300A': {
    series: 'D',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300.webp',
    description: 'D300A船用齿轮箱',
    powerRange: '150-300kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300.webp',
    available: true
  },
  'J300': {
    series: 'J',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300.webp',
    description: 'J300船用齿轮箱',
    powerRange: '150-300kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300.webp',
    available: true
  },
  'T300': {
    series: 'T',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300.webp',
    description: 'T300船用齿轮箱',
    powerRange: '150-300kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-300.webp',
    available: true
  },
  'X6110C': {
    series: 'X',
    mainView: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC600A.webp',
    description: 'X6110C船用齿轮箱',
    powerRange: '300-600kW',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/gearbox/Advance-HC600A.webp',
    available: true
  }
};

// 联轴器外形图数据
export const couplingDrawings = {
  // HGTHT系列 (高扭矩型)
  'HGTHT4': {
    series: 'HGTHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    dimensions: '/drawings/coupling/hgtht4-dims.svg',
    description: 'HGTHT4高弹性联轴器 (高扭矩型)',
    torque: '4 kN·m',
    maxTorque: '10 kN·m',
    boreRange: '40-80mm',
    specs: {
      ratedTorque: '4 kN·m',
      maxTorque: '10 kN·m',
      maxSpeed: '2400 rpm',
      weight: '90 kg'
    },
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    available: true,
    // 64T项目推荐型号
    recommended: true
  },
  'HGTHT4.5': {
    series: 'HGTHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    dimensions: '/drawings/coupling/hgtht45-dims.svg',
    description: 'HGTHT4.5高弹性联轴器',
    torque: '4.5 kN·m',
    maxTorque: '12 kN·m',
    boreRange: '45-90mm',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    available: true
  },
  'HGTHT5': {
    series: 'HGTHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    dimensions: '/drawings/coupling/hgtht5-dims.svg',
    description: 'HGTHT5高弹性联轴器',
    torque: '5 kN·m',
    maxTorque: '12.5 kN·m',
    boreRange: '50-95mm',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    available: true
  },
  'HGTHT6.3': {
    series: 'HGTHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    dimensions: '/drawings/coupling/hgtht63-dims.svg',
    description: 'HGTHT6.3高弹性联轴器',
    torque: '6.3 kN·m',
    maxTorque: '16 kN·m',
    boreRange: '55-100mm',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    available: true
  },
  'HGTHT8': {
    series: 'HGTHT',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    dimensions: '/drawings/coupling/hgtht8-dims.svg',
    description: 'HGTHT8高弹性联轴器',
    torque: '8 kN·m',
    maxTorque: '20 kN·m',
    boreRange: '60-110mm',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-T.png',
    available: true
  },

  // HGTHB系列 (大扭矩型)
  'HGTHB5': {
    series: 'HGTHB',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-D.png',
    dimensions: '/drawings/coupling/hgthb5-dims.svg',
    description: 'HGTHB5高弹性联轴器 (大扭矩型)',
    torque: '5 kN·m',
    maxTorque: '12.5 kN·m',
    boreRange: '50-100mm',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-D.png',
    available: true
  },
  'HGTHB6.3': {
    series: 'HGTHB',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-D.png',
    dimensions: '/drawings/coupling/hgthb63-dims.svg',
    description: 'HGTHB6.3高弹性联轴器',
    torque: '6.3 kN·m',
    maxTorque: '16 kN·m',
    boreRange: '55-110mm',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-D.png',
    available: true
  },
  'HGTHB8': {
    series: 'HGTHB',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-D.png',
    dimensions: '/drawings/coupling/hgthb8-dims.svg',
    description: 'HGTHB8高弹性联轴器',
    torque: '8 kN·m',
    maxTorque: '20 kN·m',
    boreRange: '60-120mm',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-D.png',
    available: true
  },
  'HGTHB10': {
    series: 'HGTHB',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-D.png',
    dimensions: '/drawings/coupling/hgthb10-dims.svg',
    description: 'HGTHB10高弹性联轴器',
    torque: '10 kN·m',
    maxTorque: '25 kN·m',
    boreRange: '70-130mm',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH-D.png',
    available: true
  },

  // HGTH系列 (标准型)
  'HGTH2': {
    series: 'HGTH',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH.png',
    dimensions: '/drawings/coupling/hgth2-dims.svg',
    description: 'HGTH2高弹性联轴器 (标准型)',
    torque: '2 kN·m',
    maxTorque: '5 kN·m',
    boreRange: '30-60mm',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH.png',
    available: true
  },
  'HGTH3.15': {
    series: 'HGTH',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH.png',
    dimensions: '/drawings/coupling/hgth315-dims.svg',
    description: 'HGTH3.15高弹性联轴器',
    torque: '3.15 kN·m',
    maxTorque: '8 kN·m',
    boreRange: '35-70mm',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH.png',
    available: true
  },
  'HGTH4': {
    series: 'HGTH',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH.png',
    dimensions: '/drawings/coupling/hgth4-dims.svg',
    description: 'HGTH4高弹性联轴器',
    torque: '4 kN·m',
    maxTorque: '10 kN·m',
    boreRange: '40-80mm',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTH.png',
    available: true
  },

  // HGTQ系列 (齿式)
  'HGTQ280': {
    series: 'HGTQ',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTQ-1.png',
    dimensions: '/drawings/coupling/hgtq280-dims.svg',
    description: 'HGTQ280高扭矩齿式弹性联轴器',
    torque: '6.3 kN·m',
    maxTorque: '16 kN·m',
    boreRange: '40-70mm',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTQ-1.png',
    available: true
  },
  'HGTQ320': {
    series: 'HGTQ',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTQ-1.png',
    dimensions: '/drawings/coupling/hgtq320-dims.svg',
    description: 'HGTQ320高扭矩齿式弹性联轴器',
    torque: '8 kN·m',
    maxTorque: '20 kN·m',
    boreRange: '50-80mm',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTQ-1.png',
    available: true
  },
  'HGTQ400': {
    series: 'HGTQ',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTQ-T.png',
    dimensions: '/drawings/coupling/hgtq400-dims.svg',
    description: 'HGTQ400高扭矩齿式弹性联轴器',
    torque: '16 kN·m',
    maxTorque: '40 kN·m',
    boreRange: '60-100mm',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTQ-T.png',
    available: true
  },
  'HGTQ450': {
    series: 'HGTQ',
    mainView: 'https://qj-gearbox.duckdns.org/images/couplings/HGTQ-W.png',
    dimensions: '/drawings/coupling/hgtq450-dims.svg',
    description: 'HGTQ450高扭矩齿式弹性联轴器',
    torque: '20 kN·m',
    maxTorque: '50 kN·m',
    boreRange: '70-110mm',
    thumbnail: 'https://qj-gearbox.duckdns.org/images/couplings/HGTQ-W.png',
    available: true
  }
};

// 获取齿轮箱外形图
export const getGearboxDrawing = (model) => {
  // 直接查找
  if (gearboxDrawings[model]) {
    return gearboxDrawings[model];
  }

  // 尝试模糊匹配 (去除后缀如A, B, P等)
  const baseModel = model.replace(/[A-Z]$/, '');
  if (gearboxDrawings[baseModel]) {
    return gearboxDrawings[baseModel];
  }

  return null;
};

// 获取联轴器外形图
export const getCouplingDrawing = (model) => {
  // 直接查找
  if (couplingDrawings[model]) {
    return couplingDrawings[model];
  }

  // 尝试模糊匹配
  const normalizedModel = model.replace(/[.-]/g, '');
  for (const [key, value] of Object.entries(couplingDrawings)) {
    if (key.replace(/[.-]/g, '') === normalizedModel) {
      return value;
    }
  }

  return null;
};

/**
 * 联轴器推荐 — 基于功率/转速计算扭矩，支持工况类别安全系数
 * @param {number} power - 功率(kW)
 * @param {number} speed - 转速(rpm)
 * @param {number} safetyFactor - 安全系数(默认1.5)
 *   I类(扭矩变化很小):1.0  II类(小):1.25  III类(中等):1.5
 *   IV类(大):1.75  V类(很大):2.0
 */
export const recommendCouplingByPower = (power, speed = 1500, safetyFactor = 1.5) => {
  // 计算扭矩 T = 9550 × P / n (N·m → kN·m)
  const torque = (9550 * power / speed) / 1000;
  const requiredTorque = torque * safetyFactor;

  // 筛选合适的联轴器
  const suitable = Object.entries(couplingDrawings)
    .filter(([_, data]) => {
      const maxTorque = parseFloat(data.maxTorque) || 0;
      return maxTorque >= requiredTorque;
    })
    .sort((a, b) => {
      const torqueA = parseFloat(a[1].maxTorque) || 0;
      const torqueB = parseFloat(b[1].maxTorque) || 0;
      return torqueA - torqueB;
    });

  return suitable.slice(0, 5).map(([model, data]) => ({
    model,
    ...data,
    calculatedTorque: torque.toFixed(2),
    requiredTorque: requiredTorque.toFixed(2),
    safetyFactor
  }));
};

// 获取所有齿轮箱系列
export const getAllGearboxSeries = () => {
  const series = new Set();
  Object.values(gearboxDrawings).forEach(item => {
    if (item.series) series.add(item.series);
  });
  return Array.from(series).map(s => ({
    code: s,
    ...gearboxSeriesInfo[s]
  }));
};

// 获取所有联轴器系列
export const getAllCouplingSeries = () => {
  const series = new Set();
  Object.values(couplingDrawings).forEach(item => {
    if (item.series) series.add(item.series);
  });
  return Array.from(series).map(s => ({
    code: s,
    ...couplingSeriesInfo[s]
  }));
};

// 按系列获取齿轮箱
export const getGearboxesBySeries = (seriesCode) => {
  return Object.entries(gearboxDrawings)
    .filter(([_, data]) => data.series === seriesCode)
    .map(([model, data]) => ({ model, ...data }));
};

// 按系列获取联轴器
export const getCouplingsBySeries = (seriesCode) => {
  return Object.entries(couplingDrawings)
    .filter(([_, data]) => data.series === seriesCode)
    .map(([model, data]) => ({ model, ...data }));
};

// 搜索外形图
export const searchDrawings = (keyword, type = 'all') => {
  const results = [];
  const searchKey = keyword.toUpperCase();

  const searchKeyLower = keyword.toLowerCase();

  if (type === 'all' || type === 'gearbox') {
    Object.entries(gearboxDrawings).forEach(([model, data]) => {
      if (model.toUpperCase().includes(searchKey) ||
          (data.description && data.description.toLowerCase().includes(searchKeyLower))) {
        results.push({ type: 'gearbox', model, ...data });
      }
    });
  }

  if (type === 'all' || type === 'coupling') {
    Object.entries(couplingDrawings).forEach(([model, data]) => {
      if (model.toUpperCase().includes(searchKey) ||
          (data.description && data.description.toLowerCase().includes(searchKeyLower))) {
        results.push({ type: 'coupling', model, ...data });
      }
    });
  }

  return results;
};

// 统计信息
export const getDrawingsStats = () => {
  const gearboxCount = Object.keys(gearboxDrawings).length;
  const couplingCount = Object.keys(couplingDrawings).length;
  const availableGearbox = Object.values(gearboxDrawings).filter(d => d.available).length;
  const availableCoupling = Object.values(couplingDrawings).filter(d => d.available).length;

  return {
    total: gearboxCount + couplingCount,
    gearbox: { total: gearboxCount, available: availableGearbox },
    coupling: { total: couplingCount, available: availableCoupling }
  };
};

// ==================== DWG图纸支持 ====================
// 重新导出DWG相关常量和函数
export { DWG_BASE_URL, dwgSeriesInfo };
export const getDwgDownloadUrl = _getDwgDownloadUrl;
export const getShareCADPreviewUrl = _getShareCADPreviewUrl;
export const getPdfPreviewUrl = _getPdfPreviewUrl;

// 构建小写→原始键名映射表（一次性，用于大小写不敏感查询）
const buildLowerCaseMap = (source) => {
  const map = {};
  Object.keys(source).forEach(key => { map[key.toLowerCase()] = key; });
  return map;
};
const gearboxDwgKeyMap = buildLowerCaseMap(gearboxDwgDrawings);
const couplingDwgKeyMap = buildLowerCaseMap(couplingDwgDrawings);

// 获取型号的DWG文件列表（大小写不敏感）
export const getDwgFilesForModel = (model, type = 'gearbox') => {
  if (!model) return [];
  const source = type === 'gearbox' ? gearboxDwgDrawings : couplingDwgDrawings;
  const keyMap = type === 'gearbox' ? gearboxDwgKeyMap : couplingDwgKeyMap;
  // 先精确匹配，再尝试小写映射
  return source[model] || source[keyMap[model.toLowerCase()]] || [];
};

// 按系列获取所有DWG文件
export const getDwgFilesBySeries = (seriesCode) => {
  const results = [];

  // 搜索齿轮箱
  Object.entries(gearboxDwgDrawings).forEach(([model, files]) => {
    files.forEach(file => {
      if (file.series === seriesCode) {
        results.push({ ...file, model, type: 'gearbox' });
      }
    });
  });

  // 搜索联轴器
  Object.entries(couplingDwgDrawings).forEach(([model, files]) => {
    files.forEach(file => {
      if (file.series === seriesCode) {
        results.push({ ...file, model, type: 'coupling' });
      }
    });
  });

  return results;
};

// 获取DWG统计信息
export const getDwgStats = () => {
  let gearboxFileCount = 0;
  let couplingFileCount = 0;
  const seriesStats = {};

  // 统计齿轮箱
  Object.values(gearboxDwgDrawings).forEach(files => {
    gearboxFileCount += files.length;
    files.forEach(file => {
      const series = file.series || 'OTHER';
      seriesStats[series] = (seriesStats[series] || 0) + 1;
    });
  });

  // 统计联轴器
  Object.values(couplingDwgDrawings).forEach(files => {
    couplingFileCount += files.length;
    files.forEach(file => {
      const series = file.series || 'OTHER';
      seriesStats[series] = (seriesStats[series] || 0) + 1;
    });
  });

  return {
    total: gearboxFileCount + couplingFileCount,
    gearbox: gearboxFileCount,
    coupling: couplingFileCount,
    gearboxModels: Object.keys(gearboxDwgDrawings).length,
    couplingModels: Object.keys(couplingDwgDrawings).length,
    seriesStats
  };
};

// 搜索DWG文件（支持搜索型号和文件名）
export const searchDwgFiles = (keyword) => {
  const results = [];
  const searchKey = keyword.toLowerCase();

  // 搜索齿轮箱
  Object.entries(gearboxDwgDrawings).forEach(([model, files]) => {
    const modelMatch = model.toLowerCase().includes(searchKey);
    files.forEach(file => {
      if (modelMatch || (file.fileName && file.fileName.toLowerCase().includes(searchKey))) {
        results.push({ ...file, model, type: 'gearbox' });
      }
    });
  });

  // 搜索联轴器
  Object.entries(couplingDwgDrawings).forEach(([model, files]) => {
    const modelMatch = model.toLowerCase().includes(searchKey);
    files.forEach(file => {
      if (modelMatch || (file.fileName && file.fileName.toLowerCase().includes(searchKey))) {
        results.push({ ...file, model, type: 'coupling' });
      }
    });
  });

  return results;
};

// 获取所有DWG系列列表（带统计）
export const getAllDwgSeries = () => {
  const stats = getDwgStats();
  const seriesList = [];

  Object.entries(stats.seriesStats)
    .sort((a, b) => b[1] - a[1]) // 按数量降序
    .forEach(([code, count]) => {
      const info = dwgSeriesInfo[code] || { name: code, description: '其他类型', type: 'other' };
      seriesList.push({
        code,
        name: info.name,
        description: info.description,
        type: info.type,
        count
      });
    });

  return seriesList;
};

// 导出DWG数据对象（供组件直接使用）
export { gearboxDwgDrawings, couplingDwgDrawings };

export default {
  gearboxDrawings,
  couplingDrawings,
  gearboxSeriesInfo,
  couplingSeriesInfo,
  getGearboxDrawing,
  getCouplingDrawing,
  recommendCouplingByPower,
  getAllGearboxSeries,
  getAllCouplingSeries,
  getGearboxesBySeries,
  getCouplingsBySeries,
  searchDrawings,
  getDrawingsStats
};
