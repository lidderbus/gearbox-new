// components/SelectionGuidelines.js
// 选型须知组件 - 杭齿厂选型手册2025版5月版
// 功能增强版: 传递能力验证、工况系数、匹配评分、系列对比、案例库、参数校验
import React, { useState } from 'react';
import { Card, Collapse, Row, Col, Badge, OverlayTrigger, Tooltip, Table, ProgressBar, Accordion, Alert } from 'react-bootstrap';

// 选型须知数据
const SELECTION_GUIDELINES = {
  core: {
    title: "选型须知",
    items: [
      "船用齿轮箱具有倒顺、离合、减速和承受螺旋桨推力的功能",
      "传递能力 = 发动机持续功率 ÷ 额定转速 (kW/r·min⁻¹)",
      "齿轮箱与发动机轴系不允许采用刚性连接",
      "重量为近似值，不同减速比重量有所不同"
    ]
  },
  tiltAngles: {
    title: "船舶倾斜角规定",
    data: { "横倾": "15°", "横摇": "22.5°", "纵倾": "5°", "纵摇": "7.5°" }
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
    "HCS": { levels: "2级顺/1级倒", io: "垂直异中心", direction: "顺同/倒反", function: "双速齿轮箱" },
    "HCDS": { levels: "2级顺/1级倒", io: "垂直异中心", direction: "顺同/倒反", function: "双速大型齿轮箱" },
    "2GWH": { levels: "1级", io: "双输入单输出", direction: "相反", function: "双机并车齿轮箱" }
  },
  contacts: {
    title: "技术支持",
    phones: ["0571-83802269", "0571-83802268"],
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
  const prefixes = ['2GWH', 'HCDS', 'HCS', 'GWC', 'GWL', 'GWS', 'GWD', 'GWH', 'GWK', 'HCM', 'HCD', 'HCQ', 'HC', 'GC', 'DT'];
  for (const prefix of prefixes) {
    if (upper.startsWith(prefix) && SELECTION_GUIDELINES.seriesInfo[prefix]) {
      return { prefix, ...SELECTION_GUIDELINES.seriesInfo[prefix] };
    }
  }
  return null;
};

// 主组件
const SelectionGuidelines = ({ colors = {}, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const cardStyle = {
    backgroundColor: colors.card || '#f8f9fa',
    borderColor: colors.border || '#dee2e6',
    marginBottom: '1rem'
  };

  const headerStyle = {
    backgroundColor: '#e6f4ff',
    color: '#1890ff',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    fontWeight: 'bold',
    borderBottom: isOpen ? '1px solid #91caff' : 'none'
  };

  return (
    <Card style={cardStyle}>
      <Card.Header
        style={headerStyle}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>📋 选型须知（点击{isOpen ? '收起' : '展开'}）</span>
        <span style={{ fontSize: '14px' }}>{isOpen ? '▲' : '▼'}</span>
      </Card.Header>
      <Collapse in={isOpen}>
        <Card.Body style={{ padding: '16px' }}>
          {/* 核心须知 */}
          <div style={{ marginBottom: '16px' }}>
            <h6 style={{ color: '#1890ff', marginBottom: '10px' }}>📌 核心要点</h6>
            <ul style={{ margin: 0, paddingLeft: '20px', color: colors.text || '#333' }}>
              {SELECTION_GUIDELINES.core.items.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '5px' }}>{item}</li>
              ))}
            </ul>
          </div>

          {/* 倾斜角规格 */}
          <div style={{ marginBottom: '16px' }}>
            <h6 style={{ color: '#1890ff', marginBottom: '10px' }}>📐 船舶倾斜角规定</h6>
            <Row>
              {Object.entries(SELECTION_GUIDELINES.tiltAngles.data).map(([key, value]) => (
                <Col xs={6} md={3} key={key} style={{ marginBottom: '8px' }}>
                  <Badge bg="light" text="dark" style={{
                    display: 'block',
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6'
                  }}>
                    {key}: <strong>{value}</strong>
                  </Badge>
                </Col>
              ))}
            </Row>
          </div>

          {/* 工况定义 */}
          <div style={{ marginBottom: '16px' }}>
            <h6 style={{ color: '#1890ff', marginBottom: '10px' }}>⚙️ 工况定义（HCG铝合金系列）</h6>
            <div style={{
              backgroundColor: '#fff7e6',
              border: '1px solid #ffc069',
              borderRadius: '4px',
              padding: '8px 12px',
              marginBottom: '10px',
              fontSize: '13px'
            }}>
              ⚠️ {SELECTION_GUIDELINES.workloadDefs.warning}
            </div>
            <Row>
              {Object.entries(SELECTION_GUIDELINES.workloadDefs.data).map(([code, info]) => (
                <Col xs={6} md={3} key={code} style={{ marginBottom: '8px' }}>
                  <div style={{
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    padding: '8px',
                    fontSize: '12px',
                    backgroundColor: '#fff'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{code} - {info.name}</div>
                    <div>年工时: {info.hours}</div>
                    <div>载荷系数: {info.load}</div>
                    <div style={{ color: '#666' }}>{info.scope}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* 技术支持 */}
          <div style={{
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: '4px',
            padding: '10px 15px'
          }}>
            <span style={{ fontWeight: 'bold' }}>📞 技术支持热线：</span>
            {SELECTION_GUIDELINES.contacts.phones.join(' / ')}
            <span style={{ marginLeft: '15px', color: '#666', fontSize: '13px' }}>
              （{SELECTION_GUIDELINES.contacts.note}）
            </span>
          </div>
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
