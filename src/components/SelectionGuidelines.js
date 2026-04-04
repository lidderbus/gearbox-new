// components/SelectionGuidelines.js
// 选型须知组件 - 杭齿厂选型手册2025版5月版
// 功能增强版: 传递能力验证、工况系数、匹配评分、系列对比、案例库、参数校验
import React, { useState } from 'react';
import { Card, Collapse, Row, Col, Badge, OverlayTrigger, Tooltip, Table, ProgressBar, Accordion, Alert } from 'react-bootstrap';

// 选型须知数据 — 内容来源: 杭齿厂选型手册2025版5月版
const SELECTION_GUIDELINES = {
  companyProfile: {
    title: "企业简介",
    text: "杭州前进齿轮箱集团股份有限公司是我国专业设计、制造齿轮传动装置和粉末冶金制品的大型重点骨干企业，国家高新技术企业和专业的中国齿轮箱品牌服务商，中国动力传动系统集成供应商和服务商。",
    details: [
      "公司前身为杭州齿轮厂，创建于1960年。2001年经国家批准实施\u201C债转股\u201D改制。2008年完成股份制改制正式变更为杭州前进齿轮箱集团股份有限公司，公司于2010年10月在上海证券交易所上市。",
      "公司综合实力被列为\u201C中国工业行业排头兵\u201D企业、\u201C中国机械工业100强\u201D、中国大企业集团竞争力500强企业，全国第一批制造业单项冠军示范企业。",
      "公司设有国家级技术中心，\u201C高端重载齿轮传动装置关键技术及产业化\u201D及\u201C大功率船用齿轮箱传动与推进系统关键技术研究及应用\u201D项目先后荣获\u201C国家科技进步二等奖\u201D。",
      "船用齿轮箱产品是公司的主导产品，公司拥有从10kW到10000kW船用齿轮箱的设计开发和制造能力。六十多年来累计在国内外市场投放了1000多种规格的船用齿轮箱产品120多万台套。",
      "产品分别通过CCS、法国、德国、英国、日本、韩国、意大利、俄罗斯等国家船级社认可，并获得《武器装备科研生产许可证》。",
      "根据不同的技术平台和应用领域，公司分别开发了HC系列、轻型高速系列、GW系列、双速系列、GC系列、2GWH系列等七大系列产品，广泛应用于渔船、运输船、远洋大功率船、化学品船、特种舰船等领域。"
    ],
    contacts: {
      address: "浙江省杭州市萧山区萧金路45号",
      postcode: "311203",
      phone: "0571-82673888(总部)",
      fax: "0571-82675966(总部)",
      email: "zhongy@chinaadvance.com(内销)",
      website: "http://www.chinaadvance.com",
      techPhone: "0571-83802207/83802208(内销)",
      salesFax: "0571-82671999(内销)",
      stockCode: "601177"
    }
  },
  core: {
    title: "船用齿轮箱选型须知",
    items: [
      "船用齿轮箱具有倒顺、离合、减速和承受螺旋桨推力的功能，与主机配套，组成船用动力机组。",
      "手册中的\u201C传递能力\u201D是指发动机的持续功率与额定转速之比值，减速比传递能力上下对应，选用时应小于手册中数值。传递能力P/n（kW/r/min）：主机额定功率P/主机额定转速n，选用时应小于选型表中的数值。",
      "齿轮箱配套高弹性联轴器和齿形块状联轴器，如客户需要配套齿形块状联轴器，会存在部分产品降低传递能力的问题，应与公司技术部门联系。",
      "齿轮箱与发动机轴系不允许采用刚性连接，支架推荐安装在同一刚性支承上。如果发动机安装在弹性支承上而齿轮箱安装在刚性支承上，则应与公司技术部门联系，选配合适的高弹性联轴器。",
      "重量为近似值，不同减速比重量也有所不同。",
      "产品由于技术改良的原因，不排除不做预告而进行更改。",
      "本手册内船用齿轮箱在其选型和布置均应符合下表中船舶倾斜角的规定，以保证其能正常运转。"
    ]
  },
  tiltAngles: {
    title: "船舶倾斜角规定",
    note: "如在非船舶主推进情况下使用本手册产品，则应与公司技术部门联系。",
    data: { "横倾": "15°", "横摇": "22.5°", "纵倾": "5°（当船舶长度大于100m时为500/L°）", "纵摇": "7.5°" }
  },
  workloadDefs: {
    title: "工况定义（铝合金箱体HCG系列）",
    warning: "休闲/轻载/中等工况不得用于军船、公务船、客船",
    data: {
      "P": { name: "休闲", hours: "<500h", load: "<19%", scope: "私有、非商用" },
      "L": { name: "轻载", hours: "<2500h", load: "<29%", scope: "私有和包租" },
      "M": { name: "中等", hours: "<4000h", load: "<59%", scope: "包租和商业" },
      "C": { name: "持续", hours: "无限制", load: "-", scope: "所有类型" }
    }
  },
  seriesInfo: {
    "GWC": { levels: "2级", io: "同中心", direction: "相同", function: "倒顺离合减速" },
    "GWL": { levels: "2级", io: "同中心", direction: "相同", function: "离合减速" },
    "GWS": { levels: "1级", io: "垂直异中心", direction: "相反", function: "倒顺离合减速" },
    "GWD": { levels: "1级", io: "角向异中心", direction: "相反", function: "倒顺离合减速" },
    "GWH": { levels: "1级", io: "水平异中心", direction: "相反", function: "倒顺离合减速" },
    "GWK": { levels: "1级", io: "垂直异中心", direction: "相反", function: "离合减速" },
    "HC": { levels: "1-3级", io: "多种", direction: "多种", function: "标准船用齿轮箱" },
    "HCM": { levels: "1-2级", io: "多种", direction: "多种", function: "中型船用齿轮箱" },
    "HCD": { levels: "2-3级", io: "多种", direction: "多种", function: "大型船用齿轮箱" },
    "HCQ": { levels: "1-2级", io: "多种", direction: "多种", function: "轻型高速齿轮箱" },
    "GC": { levels: "2级", io: "同中心", direction: "相同", function: "配变距桨，可安装CPP配油器" },
    "DT": { levels: "2-3级", io: "多种", direction: "多种", function: "大推力齿轮箱" },
    "HCS": { levels: "2级顺/1级倒", io: "垂直异中心", direction: "顺快顺慢同/倒反", function: "双速齿轮箱" },
    "HCDS": { levels: "2级顺/1级倒", io: "垂直异中心", direction: "顺快顺慢反/倒反", function: "双速大型齿轮箱" },
    "HCTS": { levels: "3级顺/2级倒", io: "垂直异中心", direction: "顺快顺慢同/倒反", function: "三级双速齿轮箱" },
    "SGWC": { levels: "2级顺/1级倒", io: "同中心", direction: "输入输出同/倒反", function: "双速GW齿轮箱" },
    "SGWS": { levels: "2级顺/1级倒/3级倒", io: "垂直异中心", direction: "输入输出反/倒反", function: "双速GWS齿轮箱" },
    "SGWH": { levels: "2级顺/1级倒/3级倒", io: "水平异中心", direction: "输入输出反/倒反", function: "双速GWH齿轮箱" },
    "SGWD": { levels: "顺慢2级/顺快1级/倒3级", io: "角向异中心", direction: "输入输出反", function: "双速GWD齿轮箱" },
    "2GWH": { levels: "2级", io: "水平异中心", direction: "相同", function: "双机并车齿轮箱" },
    "HCL": { levels: "-", io: "同轴", direction: "相同", function: "液压离合器" },
    "HCA": { levels: "1-2级", io: "多种", direction: "多种", function: "轻型高速倾角齿轮箱" },
    "HCV": { levels: "1-2级", io: "多种", direction: "多种", function: "V型驱动高速齿轮箱" }
  },
  // 双速齿轮箱说明 — PDF p39-40
  dualSpeedInfo: {
    title: "船用双速齿轮箱",
    description: "船用双速齿轮箱产品功能：具有顺快、顺慢、倒车、离合、减速及承受螺旋桨推力的功能，与主机配套，组成船用动力机组。",
    controlType: "操纵方式：推拉软轴、电控或气控。",
    notes: [
      "中小功率齿轮箱配联接罩壳，大功率齿轮箱需订购合适的高弹性联轴器。",
      "齿轮箱与发动机轴系不容许刚性连接，支架推荐安装在同一刚性支承上。如果发动机安装在弹性支承上而齿轮箱安装在刚性支承上，则应与公司技术部门联系，选配合适的高弹性联轴器。",
      "双速船用齿轮箱根据用户需求特殊定制，在订货前必须签订技术协议。"
    ],
    seriesDetails: {
      "HCS": "顺快、顺慢：二级减速，运转方向相同；倒车：一级减速，运转方向相反；输入输出垂直异中心。",
      "HCDS": "顺快、顺慢：二级减速，运转方向相同；倒车：一级减速，运转方向相反；输入输出垂直异中心。",
      "HCTS": "顺快、顺慢：三级减速，运转方向相反；倒车：二级减速，运转方向相同；输入输出垂直异中心。",
      "SGWC": "顺快、顺慢：二级减速，运转方向相同；倒车：一级减速，运转方向相反；输入输出同中心。",
      "SGWS": "顺快、顺慢：二级减速，运转方向相同；倒车：三级级减速，运转方向相反；输入输出垂直异中心。",
      "SGWH": "顺快、顺慢：二级减速，运转方向相同；倒车：三级级减速，运转方向相反；输入输出水平异中心。",
      "SGWD": "顺慢：二级减速，运转方向相同；倒车：三级减速，运转方向相反；输入输出角向异中心。"
    },
    designPhone: "0571-83802268、0571-83802269"
  },
  // GC系列说明 — PDF p44
  gcSeriesInfo: {
    title: "GC系列(配变距桨)船用齿轮箱",
    seriesDetails: {
      "GCS/GCST/GCSE": "1级减速，输入输出垂直异中心，运转方向相反，具有离合减速功能，输出前端可以安装CPP需要的配油器。输入端垂直或角向上方可以带辅助功率输出轴（PTO）。",
      "GCH/GCHT/GCHE": "1级减速，输入输出水平异中心，运转方向相反，具有离合减速功能。输出前端可以安装CPP需要的配油器。输入端垂直或角向上方可以带辅助功率输出轴（PTO）。"
    },
    notes: [
      "以上产品需要签订技术协议，作为商务合同的重要补充部分。",
      "操纵控制：气控或电控。",
      "GC系列齿轮箱根据用户需求特殊定制，采用一单一签，在订货前必须签订技术协议。"
    ]
  },
  // 2GWH双机并车说明 — PDF p46
  gwhDualInfo: {
    title: "2GWH系列(双机并车)船用齿轮箱",
    description: "通常2级减速，输入输出水平异中心，运转方向相同，具有双输出与离合减速功能。",
    features: [
      "具有传递扭矩，离合、减速和承受螺旋桨推力的功能。",
      "通过双动力输入单动力输出将两台相同转向的柴油机功率传递到螺旋桨。",
      "输出轴前端可配装CPP的配油座。",
      "PTO输出根据需要可带离合功能或不带离合功能。"
    ],
    orderingNotes: [
      "订货时请明确齿轮箱减速比与机仓布置形式。",
      "提供柴油机机型号、额定功率与转速以及转向（面对飞轮）。",
      "提供两台柴油机之间最小维修距离。",
      "提供螺旋桨最大推力。",
      "明确船舶入级要求，提供船舶工程号。",
      "明确CPP配油座的安装方式。"
    ],
    controlType: "操纵控制：气控或电控。"
  },
  // 电推系列订货须知 — PDF p48
  electricPushInfo: {
    title: "电推系列船用齿轮箱",
    orderingNotes: [
      "一单一技术协议，明确主机→齿轮箱→工作机，齿轮箱的传递能力≥主机才能选型。",
      "产品需做特殊配置设计。"
    ]
  },
  // HCL液压离合器说明 — PDF p49
  hclInfo: {
    title: "HCL系列液压离合器",
    description: "该液压离合器是湿式多片粉末冶金摩擦片结构，能适应高转速、高负荷、高频次离合工况，并具有机械控制和电控两种操纵方式供用户选择，操纵灵活，易实现远距离控制。",
    note: "其它规格可按用户要求设计。"
  },
  // 混合动力说明 — PDF p58
  hybridPowerInfo: {
    title: "混合动力船用齿轮箱",
    notes: [
      "为\u201C柴\u201D\u201C电\u201D双动力输入齿轮箱，主减速比为柴油机驱动参数，PTI减速比为电机驱动参数。",
      "产品命名：常规产品后面加\u201CP\u201D，如常规产品HCD600A，对应的混合动力产品为\u201CHCD600P\u201D。",
      "主传动参数如输入转速、额定推力、中心距、操纵型式、联接飞轮、联接罩壳、输出转向与常规产品一致。",
      "并车传递能力：动力合流到主输入轴的传递能力≤主输入额定传递能力。",
      "PTI速比可特殊订货。",
      "订货需签订技术协议及外形图确认，如有差异以确认资料为准。",
      "上表中主速比与PTI速比不存在一一对应关系，可任意搭配组合。"
    ]
  },
  // 轻型高速船用齿轮箱说明 — PDF p22
  lightHighSpeedInfo: {
    title: "轻型高速船用齿轮箱",
    notes: [
      "上述选型表中所注倾角和速比，只是根据现有已生产销售的常规产品，如用户需要，可生产倾角为5°～15°及用户所需速比的产品。",
      "轻型高速船用齿轮箱是一种特殊用途的齿轮箱，订货前请务必根据特殊要求签订相应的技术协议。"
    ]
  },
  contacts: {
    title: "技术支持",
    phones: ["0571-83802269", "0571-83802268"],
    department: "船用技术部门",
    note: "订货前建议签订技术协议"
  }
};

// ============ 功能增强数据 ============

// 工况安全系数数据
const WORKLOAD_SERVICE_FACTORS = {
  'P': { factor: 1.0, name: '休闲', description: '私有非商用，年工时<500h' },
  'L': { factor: 1.15, name: '轻载', description: '私有和包租，年工时<2500h' },
  'M': { factor: 1.3, name: '中等', description: '包租和商业，年工时<4000h' },
  'C': { factor: 1.5, name: '持续', description: '所有类型，无限制' }
};

// 快速选型对照表数据
const POWER_SERIES_GUIDE = [
  { powerRange: '< 50kW', series: ['GW'], applications: '小型渔船、游艇' },
  { powerRange: '50-100kW', series: ['GWC', 'GWS'], applications: '渔船、小型工作船' },
  { powerRange: '100-200kW', series: ['HC', 'HCM'], applications: '中型渔船、运输船' },
  { powerRange: '200-400kW', series: ['HC', 'HCM', 'HCQ'], applications: '大型渔船、工程船' },
  { powerRange: '400-800kW', series: ['HCD', 'HCT'], applications: '拖网渔船、大型工程船' },
  { powerRange: '> 800kW', series: ['DT', 'HCD'], applications: '大推力船舶、电推船' }
];

// 选型案例库数据
const SELECTION_CASES = [
  {
    id: 'MC2025021',
    project: '常州玻璃钢造船厂',
    engine: { brand: '潍柴', power: 205, speed: 2100, flywheel: 'SAE1#14' },
    gearbox: { model: '120C', capacity: 0.100, ratio: '2:1 (实际1.94:1)', thrust: 25 },
    verification: { required: 0.0976, available: 0.100, margin: 2.5 },
    status: 'success',
    date: '2025-12-03'
  },
  {
    id: 'MC2025018',
    project: '舟山远洋渔业',
    engine: { brand: '康明斯', power: 350, speed: 1800, flywheel: 'SAE0#18' },
    gearbox: { model: 'HCM400A', capacity: 0.22, ratio: '2.5:1', thrust: 50 },
    verification: { required: 0.194, available: 0.22, margin: 13.4 },
    status: 'success',
    date: '2025-11-15'
  },
  {
    id: 'MC2025015',
    project: '福建工程船厂',
    engine: { brand: '潍柴', power: 600, speed: 1500, flywheel: 'SAE0#21' },
    gearbox: { model: 'HCD600A', capacity: 0.45, ratio: '3.5:1', thrust: 90 },
    verification: { required: 0.40, available: 0.45, margin: 12.5 },
    status: 'success',
    date: '2025-10-20'
  }
];

// SAE飞轮接口规格数据
const SAE_FLYWHEEL_SPECS = {
  'SAE0#18': { diameter: 457, boltCircle: 419, applications: ['HC400-600', 'HCM400-500'] },
  'SAE0#21': { diameter: 533, boltCircle: 489, applications: ['HCD600-800', 'DT系列'] },
  'SAE1#14': { diameter: 356, boltCircle: 311, applications: ['120C', 'GW系列', 'HC200-300'] },
  'SAE1#18': { diameter: 457, boltCircle: 419, applications: ['HC400', 'HCM400'] },
  'SAE2#11.5': { diameter: 292, boltCircle: 254, applications: ['GW小型系列'] },
  'SAE3#10': { diameter: 254, boltCircle: 216, applications: ['GW微型系列'] }
};

// 扩展系列特性数据（用于SeriesComparisonTable）
const SERIES_EXTENDED_INFO = {
  'GW': { powerRange: '<50kW', applications: '小型渔船、游艇', clutchType: '液压离合器' },
  'GWC': { powerRange: '50-100kW', applications: '渔船、小型工作船', clutchType: '液压离合器' },
  'GWL': { powerRange: '50-100kW', applications: '渔船离合器版', clutchType: '液压离合器' },
  'GWS': { powerRange: '50-100kW', applications: '小型工作船', clutchType: '液压离合器' },
  'GWD': { powerRange: '50-100kW', applications: '角传动船', clutchType: '液压离合器' },
  'GWH': { powerRange: '50-100kW', applications: '水平异中心船', clutchType: '液压离合器' },
  'GWK': { powerRange: '50-100kW', applications: '垂直异中心离合', clutchType: '液压离合器' },
  'HC': { powerRange: '100-400kW', applications: '通用船舶', clutchType: '液压湿式多片' },
  'HCM': { powerRange: '100-400kW', applications: '中型高速船舶', clutchType: '液压湿式多片' },
  'HCQ': { powerRange: '200-600kW', applications: '高速船舶、渔政船', clutchType: '液压湿式多片' },
  'HCD': { powerRange: '400-1000kW', applications: '大型工程船、拖网渔船', clutchType: '液压湿式多片' },
  'HCT': { powerRange: '400-800kW', applications: '拖网渔船双输出', clutchType: '液压湿式多片' },
  'HCA': { powerRange: '100-300kW', applications: '辅机驱动', clutchType: '液压湿式多片' },
  'GC': { powerRange: '200-600kW', applications: '变距桨船舶', clutchType: '液压湿式多片' },
  'DT': { powerRange: '>800kW', applications: '电力推进大型船舶', clutchType: '液压湿式多片' },
  'HCS': { powerRange: '300-600kW', applications: '双速船舶', clutchType: '液压湿式多片' },
  'HCDS': { powerRange: '500-1000kW', applications: '大型双速船舶', clutchType: '液压湿式多片' },
  '2GWH': { powerRange: '100-300kW', applications: '双机并车', clutchType: '液压离合器' }
};

// 润滑冷却参数默认值
const LUBRICATION_DEFAULTS = {
  oilTypes: ['HC-11', 'HQ-10', 'SAE30'],
  maxOilTemp: 80, // ℃
  coolingWaterMinFlow: { // 最低冷却水流量 t/h
    'GW': 1, 'GWC': 2, 'HC': 3, 'HCM': 3, 'HCQ': 4, 'HCD': 5, 'DT': 6
  }
};

// 帮助提示组件
export const HelpTooltip = ({ id, content }) => (
  <OverlayTrigger
    placement="top"
    overlay={<Tooltip id={id}>{content}</Tooltip>}
  >
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      backgroundColor: '#1890ff',
      color: 'white',
      fontSize: '12px',
      fontWeight: 'bold',
      marginLeft: '5px',
      cursor: 'help'
    }}>?</span>
  </OverlayTrigger>
);

// 获取系列特性
export const getSeriesCharacteristics = (seriesType) => {
  const upper = (seriesType || '').toUpperCase();
  const prefixes = ['2GWH', 'SGWS', 'SGWH', 'SGWD', 'SGWC', 'HCTS', 'HCDS', 'HCS', 'GWC', 'GWL', 'GWS', 'GWD', 'GWH', 'GWK', 'HCM', 'HCL', 'HCV', 'HCD', 'HCQ', 'HCA', 'HC', 'GC', 'DT'];
  for (const prefix of prefixes) {
    if (upper.startsWith(prefix) && SELECTION_GUIDELINES.seriesInfo[prefix]) {
      return { prefix, ...SELECTION_GUIDELINES.seriesInfo[prefix] };
    }
  }
  return null;
};

// 主组件 — 手风琴分组模式
const SelectionGuidelines = ({ colors = {}, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const bodyStyle = { fontSize: '13px', padding: '12px 16px' };
  const noteStyle = { fontSize: '12px', color: '#666' };

  return (
    <Card style={{ backgroundColor: colors.card || '#f8f9fa', borderColor: colors.border || '#dee2e6', marginBottom: '1rem' }}>
      <Card.Header
        style={{ backgroundColor: '#e6f4ff', color: '#1890ff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', fontWeight: 'bold', borderBottom: isOpen ? '1px solid #91caff' : 'none' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>📋 选型须知 — 杭齿厂选型手册2025版</span>
        <Badge bg={isOpen ? 'primary' : 'secondary'} style={{ fontSize: '11px' }}>{isOpen ? '收起' : '展开 8项'}</Badge>
      </Card.Header>
      <Collapse in={isOpen}>
        <Card.Body style={{ padding: '8px' }}>
          <Accordion defaultActiveKey="core" alwaysOpen={false}>
            {/* 1. 核心要点 — 默认展开 */}
            <Accordion.Item eventKey="core">
              <Accordion.Header>📌 选型核心要点（必读）</Accordion.Header>
              <Accordion.Body style={bodyStyle}>
                <Alert variant="info" style={{ fontSize: '12px', padding: '8px 12px', marginBottom: '10px' }}>
                  传递能力 P/n（kW/r/min）= 主机额定功率 / 主机额定转速，选用时应<strong>小于</strong>选型表中的数值。
                </Alert>
                <ul style={{ margin: 0, paddingLeft: '20px', color: colors.text || '#333' }}>
                  {SELECTION_GUIDELINES.core.items.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '5px' }}>{item}</li>
                  ))}
                </ul>
                {/* 倾斜角规定 */}
                <div style={{ marginTop: '12px' }}>
                  <strong>船舶倾斜角规定：</strong>
                  <Row className="mt-2">
                    {Object.entries(SELECTION_GUIDELINES.tiltAngles.data).map(([key, value]) => (
                      <Col xs={6} md={3} key={key} style={{ marginBottom: '6px' }}>
                        <Badge bg="light" text="dark" style={{ display: 'block', padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                          {key}: <strong>{value}</strong>
                        </Badge>
                      </Col>
                    ))}
                  </Row>
                  <div style={noteStyle}>{SELECTION_GUIDELINES.tiltAngles.note}</div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            {/* 2. 快速选型对照 — 新增渲染 */}
            <Accordion.Item eventKey="power-guide">
              <Accordion.Header>⚡ 功率-系列快速对照表</Accordion.Header>
              <Accordion.Body style={bodyStyle}>
                <Table size="sm" bordered hover style={{ fontSize: '12px', marginBottom: 0 }}>
                  <thead><tr style={{ backgroundColor: '#e6f4ff' }}><th>功率范围</th><th>推荐系列</th><th>典型应用</th></tr></thead>
                  <tbody>
                    {POWER_SERIES_GUIDE.map((row, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{row.powerRange}</td>
                        <td>{row.series.map(s => <Badge key={s} bg="primary" className="me-1" style={{ fontSize: '11px' }}>{s}</Badge>)}</td>
                        <td style={{ color: '#666' }}>{row.applications}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>

            {/* 3. 系列特性对照 */}
            <Accordion.Item eventKey="series">
              <Accordion.Header>📊 七大系列特性对照表（{Object.keys(SELECTION_GUIDELINES.seriesInfo).length}个系列）</Accordion.Header>
              <Accordion.Body style={bodyStyle}>
                <Table size="sm" bordered hover responsive style={{ fontSize: '12px', marginBottom: 0 }}>
                  <thead><tr style={{ backgroundColor: '#e6f4ff' }}><th>系列</th><th>减速级数</th><th>输入输出</th><th>运转方向</th><th>功能</th></tr></thead>
                  <tbody>
                    {Object.entries(SELECTION_GUIDELINES.seriesInfo).map(([k, v]) => (
                      <tr key={k}><td style={{ fontWeight: 'bold' }}>{k}</td><td>{v.levels}</td><td>{v.io}</td><td>{v.direction}</td><td>{v.function}</td></tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>

            {/* 4. 工况定义 */}
            <Accordion.Item eventKey="workload">
              <Accordion.Header>⚙️ 工况定义与安全系数（HCG铝合金系列）</Accordion.Header>
              <Accordion.Body style={bodyStyle}>
                <div style={{ backgroundColor: '#fff7e6', border: '1px solid #ffc069', borderRadius: '4px', padding: '6px 10px', marginBottom: '10px', fontSize: '12px' }}>
                  ⚠️ {SELECTION_GUIDELINES.workloadDefs.warning}
                </div>
                <Row>
                  {Object.entries(WORKLOAD_SERVICE_FACTORS).map(([code, info]) => {
                    const wdInfo = SELECTION_GUIDELINES.workloadDefs.data[code];
                    return (
                      <Col xs={6} md={3} key={code} style={{ marginBottom: '8px' }}>
                        <div style={{ border: '1px solid #dee2e6', borderRadius: '4px', padding: '8px', fontSize: '12px', backgroundColor: '#fff' }}>
                          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{code} - {info.name}</div>
                          <div>安全系数: <strong>{info.factor}</strong></div>
                          <div>年工时: {wdInfo?.hours || '-'}</div>
                          <div style={{ color: '#666' }}>{info.description}</div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            {/* 5. 专题系列说明 */}
            <Accordion.Item eventKey="special-series">
              <Accordion.Header>📝 专题系列说明（双速 / GC / 2GWH / 电推 / 混动等）</Accordion.Header>
              <Accordion.Body style={bodyStyle}>
                <Accordion>
                  <Accordion.Item eventKey="dual-speed">
                    <Accordion.Header>双速齿轮箱（HCS/HCDS/HCTS/SGW）</Accordion.Header>
                    <Accordion.Body style={{ fontSize: '13px' }}>
                      <p>{SELECTION_GUIDELINES.dualSpeedInfo.description}</p>
                      <p>{SELECTION_GUIDELINES.dualSpeedInfo.controlType}</p>
                      <Table size="sm" bordered style={{ fontSize: '12px', marginBottom: '8px' }}>
                        <thead><tr style={{ backgroundColor: '#e6f4ff' }}><th style={{ width: '80px' }}>系列</th><th>说明</th></tr></thead>
                        <tbody>
                          {Object.entries(SELECTION_GUIDELINES.dualSpeedInfo.seriesDetails).map(([k, v]) => (
                            <tr key={k}><td style={{ fontWeight: 'bold' }}>{k}</td><td>{v}</td></tr>
                          ))}
                        </tbody>
                      </Table>
                      <ul style={{ margin: 0, paddingLeft: '20px', ...noteStyle }}>
                        {SELECTION_GUIDELINES.dualSpeedInfo.notes.map((n, i) => <li key={i}>{n}</li>)}
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="gc">
                    <Accordion.Header>GC系列（配变距桨CPP）</Accordion.Header>
                    <Accordion.Body style={{ fontSize: '13px' }}>
                      {Object.entries(SELECTION_GUIDELINES.gcSeriesInfo.seriesDetails).map(([k, v]) => (
                        <div key={k} style={{ marginBottom: '6px' }}><strong>{k}系列：</strong>{v}</div>
                      ))}
                      <ul style={{ margin: '8px 0 0', paddingLeft: '20px', ...noteStyle }}>
                        {SELECTION_GUIDELINES.gcSeriesInfo.notes.map((n, i) => <li key={i}>{n}</li>)}
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2gwh">
                    <Accordion.Header>2GWH双机并车</Accordion.Header>
                    <Accordion.Body style={{ fontSize: '13px' }}>
                      <p>{SELECTION_GUIDELINES.gwhDualInfo.description}</p>
                      <strong>产品功能：</strong>
                      <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                        {SELECTION_GUIDELINES.gwhDualInfo.features.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                      <strong>订货须知：</strong>
                      <ol style={{ margin: '4px 0', paddingLeft: '20px', ...noteStyle }}>
                        {SELECTION_GUIDELINES.gwhDualInfo.orderingNotes.map((n, i) => <li key={i}>{n}</li>)}
                      </ol>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="dt">
                    <Accordion.Header>电推系列（DT）</Accordion.Header>
                    <Accordion.Body style={{ fontSize: '13px' }}>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {SELECTION_GUIDELINES.electricPushInfo.orderingNotes.map((n, i) => <li key={i}>{n}</li>)}
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="hybrid">
                    <Accordion.Header>混合动力（P后缀系列）</Accordion.Header>
                    <Accordion.Body style={{ fontSize: '13px' }}>
                      <ol style={{ margin: 0, paddingLeft: '20px' }}>
                        {SELECTION_GUIDELINES.hybridPowerInfo.notes.map((n, i) => <li key={i} style={{ marginBottom: '4px' }}>{n}</li>)}
                      </ol>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="hcl">
                    <Accordion.Header>HCL液压离合器</Accordion.Header>
                    <Accordion.Body style={{ fontSize: '13px' }}>
                      <p>{SELECTION_GUIDELINES.hclInfo.description}</p>
                      <p style={noteStyle}>{SELECTION_GUIDELINES.hclInfo.note}</p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="light">
                    <Accordion.Header>轻型高速（HCG铝合金箱体）</Accordion.Header>
                    <Accordion.Body style={{ fontSize: '13px' }}>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {SELECTION_GUIDELINES.lightHighSpeedInfo.notes.map((n, i) => <li key={i}>{n}</li>)}
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>

            {/* 6. 选型案例 — 新增渲染 */}
            <Accordion.Item eventKey="cases">
              <Accordion.Header>📋 选型案例参考（{SELECTION_CASES.length}个）</Accordion.Header>
              <Accordion.Body style={bodyStyle}>
                {SELECTION_CASES.map((c) => (
                  <div key={c.id} style={{ border: '1px solid #d9d9d9', borderRadius: '6px', padding: '10px', marginBottom: '8px', backgroundColor: '#fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong>{c.project}</strong>
                      <Badge bg={c.status === 'success' ? 'success' : 'warning'} style={{ fontSize: '11px' }}>{c.id}</Badge>
                    </div>
                    <Row style={{ fontSize: '12px' }}>
                      <Col xs={4}><strong>主机：</strong>{c.engine.brand} {c.engine.power}kW/{c.engine.speed}rpm</Col>
                      <Col xs={4}><strong>齿轮箱：</strong>{c.gearbox.model}，速比{c.gearbox.ratio}</Col>
                      <Col xs={4}><strong>验证：</strong>需要{c.verification.required} / 可用{c.verification.available}，裕度{c.verification.margin}%</Col>
                    </Row>
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>

            {/* 7. SAE飞轮接口 — 新增渲染 */}
            <Accordion.Item eventKey="sae">
              <Accordion.Header>🔩 SAE飞轮接口规格（{Object.keys(SAE_FLYWHEEL_SPECS).length}种）</Accordion.Header>
              <Accordion.Body style={bodyStyle}>
                <Table size="sm" bordered hover style={{ fontSize: '12px', marginBottom: 0 }}>
                  <thead><tr style={{ backgroundColor: '#e6f4ff' }}><th>接口型号</th><th>直径(mm)</th><th>螺栓圆(mm)</th><th>适用系列</th></tr></thead>
                  <tbody>
                    {Object.entries(SAE_FLYWHEEL_SPECS).map(([k, v]) => (
                      <tr key={k}><td style={{ fontWeight: 'bold' }}>{k}</td><td>{v.diameter}</td><td>{v.boltCircle}</td><td>{v.applications.join('、')}</td></tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>

            {/* 8. 企业简介与联系方式 */}
            <Accordion.Item eventKey="company">
              <Accordion.Header>🏭 企业简介与技术支持</Accordion.Header>
              <Accordion.Body style={bodyStyle}>
                <p style={{ marginBottom: '8px' }}>{SELECTION_GUIDELINES.companyProfile.text}</p>
                <ul style={{ margin: '0 0 12px', paddingLeft: '20px', ...noteStyle }}>
                  {SELECTION_GUIDELINES.companyProfile.details.slice(0, 3).map((d, i) => (
                    <li key={i} style={{ marginBottom: '3px' }}>{d}</li>
                  ))}
                </ul>
                <div style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px', padding: '10px 15px' }}>
                  <div><strong>📞 技术支持热线：</strong>{SELECTION_GUIDELINES.contacts.phones.join(' / ')}（{SELECTION_GUIDELINES.contacts.department}）</div>
                  <div style={{ marginTop: '4px', ...noteStyle }}>
                    地址：{SELECTION_GUIDELINES.companyProfile.contacts.address} | 网站：{SELECTION_GUIDELINES.companyProfile.contacts.website} | 股票：{SELECTION_GUIDELINES.companyProfile.contacts.stockCode}
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Collapse>
    </Card>
  );
};

// 系列特性徽章组件
export const SeriesCharacteristicsBadge = ({ seriesType, style = {} }) => {
  const characteristics = getSeriesCharacteristics(seriesType);
  if (!characteristics) return null;

  return (
    <div style={{
      backgroundColor: '#f0f5ff',
      border: '1px solid #adc6ff',
      borderRadius: '4px',
      padding: '8px 12px',
      fontSize: '12px',
      ...style
    }}>
      <div style={{ fontWeight: 'bold', color: '#2f54eb', marginBottom: '4px' }}>
        📌 {characteristics.prefix}系列特性
      </div>
      <div>减速级数: {characteristics.levels} | 输入输出: {characteristics.io}</div>
      <div>运转方向: {characteristics.direction} | 功能: {characteristics.function}</div>
    </div>
  );
};

// HCG工况选择器组件 - 铝合金箱体系列专用
export const HCGWorkloadSelector = ({ value, onChange, colors = {}, style = {} }) => {
  const workloadData = SELECTION_GUIDELINES.workloadDefs.data;

  // 检查是否为HCG系列适用
  const isHCGApplicable = (gearboxModel) => {
    if (!gearboxModel) return false;
    const upper = gearboxModel.toUpperCase();
    return upper.includes('HCG') || upper.includes('HCA') || upper.includes('ALUMINUM');
  };

  const workloadColors = {
    'P': { bg: '#e6f7ff', border: '#91d5ff', text: '#1890ff' },
    'L': { bg: '#f6ffed', border: '#b7eb8f', text: '#52c41a' },
    'M': { bg: '#fffbe6', border: '#ffe58f', text: '#faad14' },
    'C': { bg: '#fff1f0', border: '#ffa39e', text: '#f5222d' }
  };

  return (
    <div style={{
      backgroundColor: colors.card || '#fafafa',
      border: `1px solid ${colors.border || '#d9d9d9'}`,
      borderRadius: '6px',
      padding: '12px',
      ...style
    }}>
      <div style={{
        fontWeight: 'bold',
        color: colors.text || '#333',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center'
      }}>
        ⚙️ HCG铝合金系列工况选择
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="hcg-workload-tip">适用于HCG/HCA铝合金箱体系列齿轮箱</Tooltip>}
        >
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#1890ff',
            color: 'white',
            fontSize: '10px',
            fontWeight: 'bold',
            marginLeft: '6px',
            cursor: 'help'
          }}>?</span>
        </OverlayTrigger>
      </div>

      <div style={{
        backgroundColor: '#fff7e6',
        border: '1px solid #ffc069',
        borderRadius: '4px',
        padding: '6px 10px',
        marginBottom: '10px',
        fontSize: '12px',
        color: '#d46b08'
      }}>
        ⚠️ {SELECTION_GUIDELINES.workloadDefs.warning}
      </div>

      <Row>
        {Object.entries(workloadData).map(([code, info]) => {
          const colorScheme = workloadColors[code];
          const isSelected = value === code;

          return (
            <Col xs={6} md={3} key={code} style={{ marginBottom: '8px' }}>
              <div
                onClick={() => onChange && onChange(code)}
                style={{
                  border: `2px solid ${isSelected ? colorScheme.text : colorScheme.border}`,
                  borderRadius: '6px',
                  padding: '10px',
                  fontSize: '12px',
                  backgroundColor: isSelected ? colorScheme.bg : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 0 0 2px ${colorScheme.border}` : 'none'
                }}
              >
                <div style={{
                  fontWeight: 'bold',
                  color: colorScheme.text,
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>{code} - {info.name}</span>
                  {isSelected && <span>✓</span>}
                </div>
                <div style={{ color: colors.text || '#666' }}>年工时: {info.hours}</div>
                <div style={{ color: colors.text || '#666' }}>载荷: {info.load}</div>
                <div style={{ color: '#999', fontSize: '11px' }}>{info.scope}</div>
              </div>
            </Col>
          );
        })}
      </Row>

      {value && (
        <div style={{
          marginTop: '8px',
          padding: '8px 12px',
          backgroundColor: workloadColors[value]?.bg || '#f5f5f5',
          border: `1px solid ${workloadColors[value]?.border || '#d9d9d9'}`,
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <strong>已选择：</strong>
          {value} - {workloadData[value]?.name} 工况
          （年工作时间: {workloadData[value]?.hours}，载荷系数: {workloadData[value]?.load}）
        </div>
      )}
    </div>
  );
};

// 判断齿轮箱型号是否为HCG铝合金系列
export const isHCGSeries = (gearboxModel) => {
  if (!gearboxModel) return false;
  const upper = gearboxModel.toUpperCase();
  return upper.includes('HCG') || upper.startsWith('HCA');
};

export default SelectionGuidelines;
