// src/components/InstallationGuide.js
// 安装指导 - 齿轮箱安装调试知识库
import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Badge, ListGroup, Accordion, Tabs, Tab, Table } from 'react-bootstrap';

const INSTALL_STEPS = [
  {
    title: '1. 开箱检查',
    icon: 'bi-box-arrow-up',
    items: [
      '核对产品铭牌信息（型号、减速比、出厂编号）',
      '检查外观有无运输损伤、油漆脱落',
      '确认随机文件（合格证、说明书、装箱清单）',
      '检查防锈封存状态，确认保质期',
      '核对备用泵、联轴器等附件',
    ]
  },
  {
    title: '2. 基座安装',
    icon: 'bi-bricks',
    items: [
      '基座强度需满足齿轮箱重量的3倍以上',
      '基座平面度要求 ≤0.05mm/m',
      '预留足够的维修保养空间（各侧 ≥500mm）',
      '安装减振垫或弹性支撑（如需要）',
      '预留基础螺栓孔位，确认与图纸一致',
    ]
  },
  {
    title: '3. 对中校正',
    icon: 'bi-rulers',
    items: [
      '使用激光对中仪进行主机—齿轮箱对中',
      '径向偏差 ≤0.05mm，轴向偏差 ≤0.08mm/100mm',
      '齿轮箱输出法兰与推力轴承/螺旋桨轴对中',
      '热态补偿：考虑运行温升引起的位移量',
      '记录冷态对中数据作为基准',
    ]
  },
  {
    title: '4. 管路连接',
    icon: 'bi-moisture',
    items: [
      '润滑油管路清洁冲洗后再连接',
      '冷却水管路须接至船舶冷却系统',
      '排气管/通气管确保畅通',
      '压力表、温度计安装到位',
      '所有管接头使用密封胶带或液态密封胶',
    ]
  },
  {
    title: '5. 润滑系统',
    icon: 'bi-droplet-fill',
    items: [
      '按说明书要求加注指定品牌/型号润滑油',
      '油位在油标尺上下限之间',
      '首次注油后运转备用泵检查供油',
      '检查滤芯安装是否到位',
      '出厂防锈油需彻底排放干净',
    ]
  },
  {
    title: '6. 试车调试',
    icon: 'bi-speedometer2',
    items: [
      '空载试车：低速运转30分钟，检查油温油压',
      '正常油压 0.15~0.4 MPa（视型号）',
      '正常油温 ≤85°C（滑油），冷却水温差 ≤15°C',
      '振动检测：参照 ISO 10816 标准',
      '噪声检测：参照 GB/T 6404 标准',
      '负载试车：分25%/50%/75%/100%四级加载',
    ]
  },
  {
    title: '7. 试运行检查',
    icon: 'bi-clipboard-check',
    items: [
      '满载运行4小时以上，持续监测各项参数',
      '记录稳态油温、油压、冷却水温度',
      '检查各法兰、管路接头有无松动、渗漏',
      '高速档/低速档切换测试（双速箱适用）',
      '离合器接合/脱开操作测试，确认响应时间',
      '紧急停车测试，验证保护系统',
    ]
  },
  {
    title: '8. 交付验收',
    icon: 'bi-check2-all',
    items: [
      '编制试航/试车报告，各项参数签字确认',
      '交付操作手册、维护保养手册、备品清单',
      '向用户培训日常检查和保养要点',
      '确认质保期起始日期和质保条款',
      '登记产品序列号、报船级社备案（如需要）',
    ]
  },
];

const TROUBLE_SHOOTING = [
  // 润滑系统
  { symptom: '油温过高（>85°C）', system: '润滑系统', causes: ['润滑油量不足', '冷却水流量低', '齿轮箱过载', '冷却器结垢'], solution: '检查油位和冷却水系统，核实实际工况是否超出额定参数。清洗冷却器。' },
  { symptom: '油压偏低（<0.1MPa）', system: '润滑系统', causes: ['润滑泵磨损', '滤芯堵塞', '内部泄漏', '吸油管进气'], solution: '更换滤芯，检查润滑泵，检修密封，排除吸油管漏气点' },
  { symptom: '漏油', system: '润滑系统', causes: ['密封件老化', '油封安装不当', '箱体裂纹', '通气口堵塞致内压升高'], solution: '更换密封件，检查密封面，排查箱体，确保通气口畅通' },
  { symptom: '润滑油质劣化（乳化/变黑）', system: '润滑系统', causes: ['冷却水泄漏进油', '油温长期过高', '超过换油周期'], solution: '排查冷却器内漏，更换润滑油和滤芯，缩短换油周期' },
  // 齿轮系统
  { symptom: '异常噪声（齿轮啸叫）', system: '齿轮系统', causes: ['对中不良', '齿面磨损', '轴承损坏', '齿侧间隙不当'], solution: '停机检查对中精度，必要时拆检齿轮和轴承，测量齿侧间隙' },
  { symptom: '齿面点蚀', system: '齿轮系统', causes: ['过载运行', '润滑油品质差', '材料热处理缺陷'], solution: '轻微点蚀(<10%齿面)监测运行，严重时更换齿轮副。改善润滑条件' },
  { symptom: '齿面胶合', system: '齿轮系统', causes: ['润滑油膜破坏', '过高载荷或速度', '润滑油添加剂不足'], solution: '立即停机，更换齿轮副。采用含EP添加剂的润滑油' },
  { symptom: '齿面磨损加速', system: '齿轮系统', causes: ['润滑油中含磨粒', '滤芯失效', '齿轮对中偏差'], solution: '更换润滑油和滤芯，进行油品分析，检查对中' },
  // 轴承系统
  { symptom: '轴承温度过高（>95°C）', system: '轴承系统', causes: ['轴承预紧力过大', '润滑不足', '轴承疲劳'], solution: '检查轴承间隙和预紧力，确认润滑油路畅通，必要时更换轴承' },
  { symptom: '轴承异响（周期性嗡鸣）', system: '轴承系统', causes: ['滚动体损伤', '内外圈剥落', '保持架磨损'], solution: '停机拆检轴承，检查滚道和滚动体表面，更换损坏轴承' },
  { symptom: '轴承间隙增大', system: '轴承系统', causes: ['正常磨损', '轴承座配合松动', '安装不当'], solution: '测量径向/轴向间隙，超标则更换。检查轴承座配合面' },
  // 密封系统
  { symptom: '输出轴油封漏油', system: '密封系统', causes: ['油封唇口磨损', '轴表面粗糙度超标', '轴偏心'], solution: '更换油封，检查轴面光洁度(Ra≤0.8μm)，排除偏心' },
  { symptom: '压力密封泄漏', system: '密封系统', causes: ['O型圈老化', '密封面划伤', '压力超限'], solution: '更换O型圈，修磨密封面，检查系统压力是否正常' },
  // 控制系统
  { symptom: '离合器打滑', system: '控制系统', causes: ['液压压力不足', '摩擦片磨损', '离合器油路堵塞'], solution: '检查液压压力，测量摩擦片厚度(磨损>50%应更换)，清洗油路' },
  { symptom: '离合器接合冲击', system: '控制系统', causes: ['接合阀调定压力过高', '蓄能器故障', '控制信号异常'], solution: '调整接合阀压力，检查蓄能器预充压力，排查电控系统' },
  { symptom: '转速信号异常', system: '控制系统', causes: ['传感器间隙过大', '齿轮盘损坏', '信号线干扰'], solution: '调整传感器间隙(0.5~1.5mm)，检查齿轮盘，改用屏蔽线' },
  // 冷却系统
  { symptom: '冷却水温差过大（>15°C）', system: '冷却系统', causes: ['冷却水流量不足', '冷却器效率下降', '齿轮箱过载'], solution: '检查水泵和管路，清洗冷却器，核实负载工况' },
  { symptom: '冷却器堵塞', system: '冷却系统', causes: ['海水侧结垢/附着海生物', '油侧积碳/油泥'], solution: '定期反冲洗(海水侧)，化学清洗(油侧)，安装防污涂层' },
  // 振动
  { symptom: '振动过大', system: '齿轮系统', causes: ['基座松动', '对中偏差', '联轴器损坏', '不平衡量超标'], solution: '紧固基础螺栓，重新对中，检查联轴器弹性元件，必要时动平衡' },
  { symptom: '共振（特定转速下振动激增）', system: '齿轮系统', causes: ['系统固有频率与激励频率重合', '基座刚度不足'], solution: '避开共振转速运行，加强基座刚度，必要时安装减振器' },
];

const MAINTENANCE_SCHEDULE = [
  { interval: '每日', items: ['检查油位（油标尺上下限之间）', '目视检查有无漏油', '检查油温和油压表读数', '听取运转声音有无异常'] },
  { interval: '每周', items: ['检查冷却水进出口温度和流量', '检查通气口是否畅通', '检查基座螺栓有无松动', '检查联轴器弹性元件状态'] },
  { interval: '250小时', items: ['更换润滑油滤芯', '取油样送检（水分、金属颗粒、粘度）', '检查离合器油压和接合状态', '检查各传感器工作状态'] },
  { interval: '500小时', items: ['清洗或更换磁性油塞', '检查冷却器效率', '检查各密封件有无渗漏趋势', '检查弹性联轴器磨损'] },
  { interval: '1000小时', items: ['更换润滑油（首次500h，此后1000~2000h）', '清洗油箱和吸油滤网', '检查轴承间隙', '检查齿面状态（内窥镜）'] },
  { interval: '2000小时', items: ['全面更换润滑油和所有滤芯', '清洗冷却器', '检查离合器摩擦片厚度', '检查密封件状态，预防性更换'] },
  { interval: '4000小时', items: ['拆检检查齿面、轴承', '更换油封和O型圈', '检查齿轮箱紧固件扭矩', '校验温度和压力传感器'] },
  { interval: '8000小时/3年', items: ['大修：齿轮副拆检、测量、评估', '更换全部轴承和密封件', '检修润滑泵和冷却器', '重新对中校正', '全面性能测试'] },
];

export default function InstallationGuide({ colors, theme }) {
  const [activeStep, setActiveStep] = useState('0');
  const [activeTab, setActiveTab] = useState('install');
  const [filterSystem, setFilterSystem] = useState('全部');

  const systems = useMemo(() => {
    const s = new Set(TROUBLE_SHOOTING.map(t => t.system));
    return ['全部', ...s];
  }, []);

  const filteredTrouble = useMemo(() => {
    if (filterSystem === '全部') return TROUBLE_SHOOTING;
    return TROUBLE_SHOOTING.filter(t => t.system === filterSystem);
  }, [filterSystem]);

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-tools me-2"></i>安装指导</h5>
          <small className="text-muted">齿轮箱安装调试标准流程、故障排除与维保计划</small>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
        <Tab eventKey="install" title="安装流程">
          <Card>
            <Card.Header><i className="bi bi-list-check me-1"></i>安装调试流程（{INSTALL_STEPS.length}步）</Card.Header>
            <Card.Body className="p-0">
              <Accordion activeKey={activeStep} onSelect={setActiveStep}>
                {INSTALL_STEPS.map((step, i) => (
                  <Accordion.Item key={i} eventKey={String(i)}>
                    <Accordion.Header><i className={`bi ${step.icon} me-2`}></i>{step.title}</Accordion.Header>
                    <Accordion.Body>
                      <ListGroup variant="flush">
                        {step.items.map((item, j) => (
                          <ListGroup.Item key={j} className="d-flex align-items-start">
                            <Badge bg="primary" className="me-2 mt-1">{j + 1}</Badge>
                            <span>{item}</span>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="trouble" title={`故障排除 (${TROUBLE_SHOOTING.length})`}>
          <div className="d-flex gap-2 mb-3 flex-wrap">
            {systems.map(s => (
              <Badge key={s} bg={filterSystem === s ? 'primary' : 'light'} text={filterSystem === s ? 'white' : 'dark'}
                style={{ cursor: 'pointer', fontSize: '0.85rem' }} className="py-2 px-3 border"
                onClick={() => setFilterSystem(s)}>{s}</Badge>
            ))}
          </div>
          <Card>
            <Card.Body className="p-0">
              <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                <ListGroup variant="flush">
                  {filteredTrouble.map((t, i) => (
                    <ListGroup.Item key={i}>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-danger">{t.symptom}</strong>
                        <Badge bg="outline-secondary" text="secondary" className="border">{t.system}</Badge>
                      </div>
                      <div className="small mt-1">
                        <strong>可能原因：</strong>{t.causes.join('、')}
                      </div>
                      <div className="small mt-1">
                        <strong>处理方法：</strong><span className="text-success">{t.solution}</span>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="maintenance" title="维保计划">
          <Card>
            <Card.Header><i className="bi bi-calendar-check me-1"></i>定期维护保养计划</Card.Header>
            <Card.Body className="p-0">
              <Table bordered hover size="sm" className="mb-0">
                <thead className="bg-light">
                  <tr><th style={{ width: 120 }}>维护周期</th><th>检查/保养项目</th></tr>
                </thead>
                <tbody>
                  {MAINTENANCE_SCHEDULE.map((m, i) => (
                    <tr key={i}>
                      <td><Badge bg={i < 2 ? 'info' : i < 5 ? 'primary' : 'warning'} className="py-2">{m.interval}</Badge></td>
                      <td>
                        <ul className="mb-0 ps-3">
                          {m.items.map((item, j) => <li key={j} className="small">{item}</li>)}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
}
