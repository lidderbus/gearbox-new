// src/components/TorsionalReportView.js
// 扭振计算书生成与管理 - 连接真实计算引擎
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, ListGroup, ProgressBar, Modal } from 'react-bootstrap';
import { buildProfessionalReportData, generateProfessionalReport } from '../utils/torsionalReportGenerator';
import { calculateTwoMassFrequency, calculateCriticalSpeed, CRITICAL_SPEED_AVOIDANCE,
  DIESEL_EXCITATION_ORDERS, PROPELLER_EXCITATION_ORDERS } from '../utils/torsionalVibration';

const STORAGE_KEY = 'torsional_reports';
const MAX_REPORTS = 50;
const TEMPLATES = [
  { id: 'standard', name: '标准扭振计算书', desc: 'CCS/DNV标准格式，含自由振动+强迫振动分析', pages: '~35页' },
  { id: 'simplified', name: '简化计算书', desc: '单频激励快速评估，适用于常规项目', pages: '~15页' },
  { id: 'detailed', name: '详细分析报告', desc: '含多阶模态分析、阻尼器选型建议', pages: '~50页' },
];
const SEEDS = [
  { id: 's1', project: '浙嵊渔冷05688', engine: 'CAT C18 597kW@1800rpm', power: 597, speed: 1800, gearbox: 'HCD400A', bladeCount: 4, society: 'CCS 中国船级社', template: 'standard', language: '中文', date: '2026-03-18', status: '已完成' },
  { id: 's2', project: '闽霞渔运09166', engine: 'KTA19 522kW@1800rpm', power: 522, speed: 1800, gearbox: 'HC300', bladeCount: 4, society: 'CCS 中国船级社', template: 'standard', language: '中文', date: '2026-03-15', status: '已完成' },
  { id: 's3', project: '粤珠海拖0236', engine: 'CAT C32 970kW@1800rpm', power: 970, speed: 1800, gearbox: 'HCD800', bladeCount: 4, society: 'CCS 中国船级社', template: 'detailed', language: '中文', date: '2026-03-12', status: '审核中' },
  { id: 's4', project: '长航集02068', engine: 'KTA38 895kW@1800rpm', power: 895, speed: 1800, gearbox: 'HCD600A', bladeCount: 4, society: 'DNV', template: 'standard', language: '中英双语', date: '2026-03-10', status: '已完成' },
];
const STAGES = [
  [15, '加载计算数据...'], [35, '计算固有频率...'], [55, '临界转速校核...'],
  [75, '组装报告内容...'], [90, '生成图表与表格...'], [100, '排版输出...'],
];
const getStageLabel = pct => (STAGES.find(([t]) => pct <= t) || [])[1] || '完成';
const STD_MAP = { 'CCS 中国船级社': 'CCS_INLAND_2016', 'DNV': 'DNV_GL_2015', 'LR 劳氏': 'LR_2014', 'ABS': 'ABS_2016', 'BV 法国船级社': 'BV_2015' };

function loadReports() {
  try { const a = JSON.parse(localStorage.getItem(STORAGE_KEY)); if (Array.isArray(a) && a.length) return a; } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEEDS));
  return [...SEEDS];
}
function saveReports(list) {
  const t = list.slice(0, MAX_REPORTS);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(t)); } catch {}
  return t;
}

function runAnalysis({ power, speed, bladeCount }) {
  const J1 = 0.008 * power, J2 = 0.025 * power;
  const K = 1.2e6 * Math.sqrt(power / 500);
  const fr = calculateTwoMassFrequency({ J1, J2, K });
  const fn = parseFloat(fr.frequency);
  const orders = [...new Set([...(DIESEL_EXCITATION_ORDERS[6] || []), ...(PROPELLER_EXCITATION_ORDERS[bladeCount] || [])])].sort((a, b) => a - b);
  const cs = calculateCriticalSpeed({ naturalFrequency: fn, excitationOrders: orders });
  const warnings = [];
  cs.forEach(c => {
    const lo = c.criticalSpeed * CRITICAL_SPEED_AVOIDANCE.LOWER_RATIO;
    const hi = c.criticalSpeed * CRITICAL_SPEED_AVOIDANCE.UPPER_RATIO;
    if (speed >= lo && speed <= hi) warnings.push(`工作转速${speed}rpm落在${c.order}阶临界区(${Math.round(lo)}~${Math.round(hi)}rpm)`);
  });
  return { naturalFrequency: fn, criticalSpeed: +fr.criticalSpeed, modeRatio: fr.modeRatio,
    nodePosition: fr.nodePosition, criticalSpeeds: cs.slice(0, 8), warnings, isValid: !warnings.length };
}

export default function TorsionalReportView({ colors, theme }) {
  const [tpl, setTpl] = useState('standard');
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [reports, setReports] = useState(loadReports);
  const [modal, setModal] = useState(null);
  const [err, setErr] = useState('');
  const timer = useRef(null);
  const [project, setProject] = useState('');
  const [society, setSociety] = useState('CCS 中国船级社');
  const [lang, setLang] = useState('中文');
  const [power, setPower] = useState('');
  const [speed, setSpeed] = useState('1800');
  const [gbModel, setGbModel] = useState('');
  const [blades, setBlades] = useState('4');

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const handleGen = useCallback(async () => {
    setErr('');
    const pw = +power, sp = +speed, bl = +blades;
    if (!project.trim()) return setErr('请输入项目/船名');
    if (!pw || pw <= 0) return setErr('请输入有效的主机功率');
    if (!sp || sp <= 0) return setErr('请输入有效的主机转速');
    setBusy(true); setPct(0);
    let stg = 0;
    timer.current = setInterval(() => {
      setPct(p => {
        if (p >= (STAGES[stg]?.[0] || 100)) stg++;
        if (p >= 100) { clearInterval(timer.current); timer.current = null; return 100; }
        return Math.min(p + 3, 100);
      });
    }, 120);
    await new Promise(r => setTimeout(r, 50));
    const ratio = parseFloat(gbModel.match(/i[=:]?\s*([\d.]+)/)?.[1]) || 4.0;
    const analysis = runAnalysis({ power: pw, speed: sp, bladeCount: bl });
    const reportData = buildProfessionalReportData({
      systemInput: { powerSource: { type: 'diesel', ratedPower: pw, ratedSpeed: sp, model: gbModel || '柴油机' },
        propeller: { bladeCount: bl, type: '定距桨' }, systemLayout: { gearRatio: ratio }, units: [] },
      freeVibration: { naturalFrequencies: [{ frequency: analysis.naturalFrequency, criticalSpeed: analysis.criticalSpeed }] },
      forcedVibration: { verification: { isValid: analysis.isValid }, warnings: analysis.warnings },
      standardCode: STD_MAP[society] || 'CCS_INLAND_2016',
      projectInfo: { projectName: project, shipName: project },
    });
    await new Promise(r => { const c = setInterval(() => { if (!timer.current) { clearInterval(c); r(); } }, 100); });
    const rec = { id: `r_${Date.now()}`, project: project.trim(), engine: `${pw}kW @ ${sp}rpm`,
      power: pw, speed: sp, bladeCount: bl, gearbox: gbModel || '-', society, template: tpl, language: lang,
      date: new Date().toLocaleDateString('zh-CN'), status: '已完成', analysis, reportData };
    setReports(prev => saveReports([rec, ...prev]));
    setBusy(false);
  }, [project, society, lang, power, speed, gbModel, blades, tpl]);

  const handleDel = useCallback(id => setReports(p => { const n = p.filter(r => r.id !== id); saveReports(n); return n; }), []);
  const handleDL = useCallback(async rpt => {
    if (!rpt.reportData) return alert('此报告无计算数据');
    try { await generateProfessionalReport(rpt.reportData, { filename: `扭振计算书_${rpt.project}` }); }
    catch { alert('PDF生成失败'); }
  }, []);

  const a = modal?.analysis; // shorthand for modal view
  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-file-earmark-pdf me-2"/>扭振计算书</h5>
          <small className="text-muted">连接扭振分析引擎，自动计算并生成标准格式计算书</small></Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card className="mb-3"><Card.Header>报告模板</Card.Header>
            <ListGroup variant="flush">{TEMPLATES.map(t => (
              <ListGroup.Item key={t.id} action active={tpl === t.id} onClick={() => setTpl(t.id)}>
                <div className="d-flex justify-content-between"><strong>{t.name}</strong><Badge bg="light" text="dark">{t.pages}</Badge></div>
                <small>{t.desc}</small>
              </ListGroup.Item>))}
            </ListGroup></Card>
          <Card className="mb-3"><Card.Header>生成参数</Card.Header><Card.Body>
            <Form.Group className="mb-2"><Form.Label className="small">项目/船名 <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" placeholder="输入项目或船名" value={project} onChange={e => setProject(e.target.value)} /></Form.Group>
            <Row>
              <Col xs={6}><Form.Group className="mb-2"><Form.Label className="small">主机功率(kW) *</Form.Label>
                <Form.Control size="sm" type="number" placeholder="如 597" value={power} onChange={e => setPower(e.target.value)} /></Form.Group></Col>
              <Col xs={6}><Form.Group className="mb-2"><Form.Label className="small">主机转速(rpm) *</Form.Label>
                <Form.Control size="sm" type="number" placeholder="如 1800" value={speed} onChange={e => setSpeed(e.target.value)} /></Form.Group></Col>
            </Row>
            <Row>
              <Col xs={7}><Form.Group className="mb-2"><Form.Label className="small">齿轮箱型号</Form.Label>
                <Form.Control size="sm" placeholder="如 HCD400A i=4.06" value={gbModel} onChange={e => setGbModel(e.target.value)} /></Form.Group></Col>
              <Col xs={5}><Form.Group className="mb-2"><Form.Label className="small">螺旋桨叶数</Form.Label>
                <Form.Select size="sm" value={blades} onChange={e => setBlades(e.target.value)}>
                  <option value="3">3叶</option><option value="4">4叶</option><option value="5">5叶</option>
                </Form.Select></Form.Group></Col>
            </Row>
            <Form.Group className="mb-2"><Form.Label className="small">船级社</Form.Label>
              <Form.Select size="sm" value={society} onChange={e => setSociety(e.target.value)}>
                <option>CCS 中国船级社</option><option>DNV</option><option>LR 劳氏</option><option>ABS</option><option>BV 法国船级社</option>
              </Form.Select></Form.Group>
            <Form.Group className="mb-2"><Form.Label className="small">语言</Form.Label>
              <Form.Select size="sm" value={lang} onChange={e => setLang(e.target.value)}>
                <option>中文</option><option>英文</option><option>中英双语</option></Form.Select></Form.Group>
            {err && <Alert variant="danger" className="py-1 small mb-2">{err}</Alert>}
            {busy ? (<>
              <ProgressBar now={pct} label={`${pct}% - ${getStageLabel(pct)}`} animated striped className="mt-2" />
              <small className="text-muted d-block mt-1"><i className="bi bi-info-circle me-1"/>正在调用扭振计算引擎...</small>
            </>) : (
              <Button variant="primary" className="w-100 mt-2" onClick={handleGen}><i className="bi bi-calculator me-1"/>计算并生成计算书</Button>
            )}
            {pct >= 100 && !busy && <Alert variant="success" className="mt-2 mb-0 py-1 small">
              <i className="bi bi-check-circle me-1"/>计算书已生成！基于扭振分析引擎的实时计算结果。</Alert>}
          </Card.Body></Card>
        </Col>
        <Col md={8}><Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span>历史计算书</span><Badge bg="info">{reports.length} 份</Badge></Card.Header>
          <Card.Body className="p-0">
            {!reports.length ? <div className="text-center text-muted py-4">暂无计算书记录</div> : (
            <Table hover size="sm" className="mb-0">
              <thead><tr><th>项目</th><th>主机</th><th>齿轮箱</th><th>日期</th><th>状态</th><th style={{width:120}}>操作</th></tr></thead>
              <tbody>{reports.map(r => <tr key={r.id}>
                <td><strong>{r.project}</strong></td><td className="small">{r.engine}</td>
                <td><Badge bg="primary">{r.gearbox}</Badge></td><td className="small">{r.date}</td>
                <td><Badge bg={r.status==='已完成'?'success':'warning'}>{r.status}</Badge></td>
                <td>
                  <Button size="sm" variant="outline-primary" className="me-1" title="下载" onClick={() => handleDL(r)}><i className="bi bi-download"/></Button>
                  <Button size="sm" variant="outline-secondary" className="me-1" title="查看" onClick={() => setModal(r)}><i className="bi bi-eye"/></Button>
                  <Button size="sm" variant="outline-danger" title="删除" onClick={() => handleDel(r.id)}><i className="bi bi-trash"/></Button>
                </td></tr>)}</tbody>
            </Table>)}
          </Card.Body></Card></Col>
      </Row>

      <Modal show={!!modal} onHide={() => setModal(null)} size="lg">
        <Modal.Header closeButton><Modal.Title>计算书详情 - {modal?.project}</Modal.Title></Modal.Header>
        <Modal.Body>{modal && <div>
          <h6>项目信息</h6>
          <Table bordered size="sm"><tbody>
            {[['项目/船名', modal.project], ['主机参数', modal.engine], ['齿轮箱', modal.gearbox],
              ['螺旋桨叶数', modal.bladeCount || 4], ['船级社', modal.society || '-'],
              ['模板', TEMPLATES.find(t => t.id === modal.template)?.name || '-'], ['日期', modal.date],
            ].map(([k, v], i) => <tr key={i}><td className="fw-bold" style={{width:130}}>{k}</td><td>{v}</td></tr>)}
          </tbody></Table>
          {a && <>
            <h6 className="mt-3">扭振分析结果</h6>
            <Table bordered size="sm"><tbody>
              <tr><td className="fw-bold" style={{width:130}}>一阶固有频率</td><td>{a.naturalFrequency} Hz</td></tr>
              <tr><td className="fw-bold">一阶临界转速</td><td>{a.criticalSpeed} rpm</td></tr>
              <tr><td className="fw-bold">振型比</td><td>{a.modeRatio}</td></tr>
              <tr><td className="fw-bold">节点位置</td><td>{a.nodePosition}</td></tr>
              <tr><td className="fw-bold">校核结论</td><td><Badge bg={a.isValid?'success':'danger'}>
                {a.isValid ? '通过 - 避开临界转速区' : '警告 - 存在共振风险'}</Badge></td></tr>
            </tbody></Table>
            {a.warnings?.length > 0 && <Alert variant="warning" className="small">
              {a.warnings.map((w, i) => <div key={i}><i className="bi bi-exclamation-triangle me-1"/>{w}</div>)}</Alert>}
            {a.criticalSpeeds?.length > 0 && <>
              <h6 className="mt-3">临界转速表</h6>
              <Table bordered size="sm" className="small">
                <thead><tr><th>激励阶次</th><th>临界转速 (rpm)</th></tr></thead>
                <tbody>{a.criticalSpeeds.map((c, i) => <tr key={i}><td>{c.order}阶</td><td>{c.criticalSpeed}</td></tr>)}</tbody>
              </Table></>}
          </>}
        </div>}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleDL(modal)}><i className="bi bi-download me-1"/>下载PDF</Button>
          <Button variant="secondary" onClick={() => setModal(null)}>关闭</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
