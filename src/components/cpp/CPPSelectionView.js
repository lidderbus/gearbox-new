// src/components/cpp/CPPSelectionView.js
// CPP可调桨系统选型主界面

import React, { useState, useCallback, useMemo } from 'react';
import { toast } from '../../utils/toast';
import { Card, Row, Col, Form, Button, Table, Alert, Badge, Tabs, Tab, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { cppGearboxes, cppPropellers, oilDistributors, cppHydraulicUnits, vesselTypes, CAVITATION_PREVENTION_TECHNOLOGIES, cppModelNameMapping, getRealModelNames } from '../../data/cppSystemData';
import {
  selectCPPGearbox,
  selectCPPPropeller,
  selectOilDistributor,
  selectHydraulicUnit,
  selectCPPSystem
} from '../../utils/cppSelectionAlgorithm';
import {
  calculateHydrodynamics,
  calculatePropulsionEfficiency,
  analyzeOperatingPoints,
  estimateEEDI
} from '../../utils/cppHydrodynamics';
import HydrodynamicChart, { OperatingPointsChart, EfficiencyBreakdownChart } from './HydrodynamicChart';
import CCSCompliancePanel, { CCSComplianceSummary, CCSWarningBanner } from './CCSCompliancePanel';
import ClassificationCompliancePanel from './ClassificationCompliancePanel';
import EnergyEfficiencyPanel from './EnergyEfficiencyPanel';
import SmartMonitoringPanel from './SmartMonitoringPanel';
import { exportHtmlContentToPDF } from '../../utils/pdfExportUtils';

const CPPSelectionView = ({ colors = {}, theme = 'light', onSystemSelect }) => {
  // 输入参数
  const [power, setPower] = useState('');
  const [speed, setSpeed] = useState('');
  const [targetRatio, setTargetRatio] = useState('');
  const [series, setSeries] = useState('');
  const [propellerDiameter, setPropellerDiameter] = useState('');
  const [vesselType, setVesselType] = useState('工程船'); // 船型
  const [vesselSpeed, setVesselSpeed] = useState(''); // 航速 (knots)
  const [propellerDepth, setPropellerDepth] = useState('3'); // 桨沉深 (m)

  // 新增：空泡防护技术
  const [cavitationTech, setCavitationTech] = useState('standard');
  // 新增：能效计算参数
  const [deadweight, setDeadweight] = useState('5000'); // 载重吨
  const [shipTypeForEEXI, setShipTypeForEEXI] = useState('工程船'); // 船型用于EEXI
  // 新增：已选船级社
  const [selectedSociety, setSelectedSociety] = useState('CCS');

  // 选型结果
  const [selectionResult, setSelectionResult] = useState(null);
  const [selectedGearbox, setSelectedGearbox] = useState(null);
  const [selectedPropeller, setSelectedPropeller] = useState(null);
  const [selectedOilDistributor, setSelectedOilDistributor] = useState(null);
  const [selectedHydraulicUnit, setSelectedHydraulicUnit] = useState(null);

  // 浏览模式
  const [browseTab, setBrowseTab] = useState('gearbox');

  // 对比模式
  const [compareMode, setCompareMode] = useState(false);
  const [compareItems, setCompareItems] = useState([]);

  // 获取当前船型的伴流/推力减额系数
  const currentVesselType = useMemo(() => {
    return vesselTypes?.find(v => v.name === vesselType) || vesselTypes?.[2] || {
      name: '工程船',
      wakeCoefficient: 0.22,
      thrustDeduction: 0.18,
      description: 'DP定位作业'
    };
  }, [vesselType]);

  // 计算水动力分析结果
  const hydrodynamicsResult = useMemo(() => {
    if (!selectedGearbox || !selectedPropeller || !power || !speed) return null;

    const powerVal = parseFloat(power);
    const speedVal = parseFloat(speed);
    const D = propellerDiameter ? parseFloat(propellerDiameter) : (selectedPropeller.diameterRange?.[1] || 3.0);
    const Vs = vesselSpeed ? parseFloat(vesselSpeed) : 12; // 默认12节
    const depth = propellerDepth ? parseFloat(propellerDepth) : 3;

    // 计算进速 Va = Vs * (1 - w)
    const w = currentVesselType.wakeCoefficient;
    const Va = Vs * 0.5144 * (1 - w); // knots to m/s

    const outputSpeed = speedVal / (selectedGearbox.selectedRatio || selectedGearbox.ratios?.[0] || 3);
    const n = outputSpeed / 60; // rps

    try {
      return calculateHydrodynamics({
        power: powerVal,
        speed: outputSpeed,
        propellerDiameter: D,
        Va,
        wakeField: { w },
        propellerData: selectedPropeller
      });
    } catch (e) {
      console.error('Hydrodynamics calculation error:', e);
      return null;
    }
  }, [selectedGearbox, selectedPropeller, power, speed, propellerDiameter, vesselSpeed, currentVesselType]);

  // 计算推进效率
  const efficiencyResult = useMemo(() => {
    if (!hydrodynamicsResult) return null;

    const w = currentVesselType.wakeCoefficient;
    const t = currentVesselType.thrustDeduction;
    const etaG = selectedGearbox?.efficiency || 0.97;

    try {
      return calculatePropulsionEfficiency({
        eta0: hydrodynamicsResult.eta0,
        t,
        w,
        etaT: etaG,
        etaS: 0.98
      });
    } catch (e) {
      console.error('Efficiency calculation error:', e);
      return null;
    }
  }, [hydrodynamicsResult, currentVesselType, selectedGearbox]);

  // 工况点分析
  const operatingPointsData = useMemo(() => {
    if (!selectedGearbox || !selectedPropeller) return null;

    const D = propellerDiameter ? parseFloat(propellerDiameter) : (selectedPropeller.diameterRange?.[1] || 3.0);
    const outputSpeed = parseFloat(speed) / (selectedGearbox.selectedRatio || selectedGearbox.ratios?.[0] || 3);

    const systemConfig = {
      gearbox: selectedGearbox,
      propeller: selectedPropeller,
      propellerDiameter: D,
      propellerSpeed: outputSpeed
    };

    try {
      return analyzeOperatingPoints(systemConfig);
    } catch (e) {
      console.error('Operating points analysis error:', e);
      return null;
    }
  }, [selectedGearbox, selectedPropeller, propellerDiameter, speed]);

  // EEDI估算
  const eediResult = useMemo(() => {
    if (!power || !vesselSpeed) return null;

    try {
      return estimateEEDI({
        power: parseFloat(power),
        capacity: 5000, // 默认载重量，实际应由用户输入
        speed: parseFloat(vesselSpeed)
      });
    } catch (e) {
      return null;
    }
  }, [power, vesselSpeed]);

  // 样式
  const cardStyle = {
    backgroundColor: colors.cardBg || '#fff',
    borderColor: colors.border || '#dee2e6'
  };

  const headerStyle = {
    backgroundColor: colors.headerBg || '#f8f9fa',
    color: colors.headerText || '#212529',
    borderBottom: `1px solid ${colors.border || '#dee2e6'}`
  };

  // 执行选型
  const handleSelection = useCallback(() => {
    const powerVal = parseFloat(power);
    const speedVal = parseFloat(speed);
    const ratioVal = parseFloat(targetRatio);

    if (isNaN(powerVal) || powerVal <= 0) {
      setSelectionResult({ success: false, message: '请输入有效的功率' });
      return;
    }
    if (isNaN(speedVal) || speedVal <= 0) {
      setSelectionResult({ success: false, message: '请输入有效的转速' });
      return;
    }
    if (isNaN(ratioVal) || ratioVal <= 0) {
      setSelectionResult({ success: false, message: '请输入有效的减速比' });
      return;
    }

    const result = selectCPPSystem({
      power: powerVal,
      speed: speedVal,
      targetRatio: ratioVal,
      vesselData: {
        propellerDiameter: propellerDiameter ? parseFloat(propellerDiameter) : null
      },
      options: {
        series: series || null
      }
    });

    setSelectionResult(result);
    if (result.success) {
      setSelectedGearbox(result.system.gearbox);
      setSelectedPropeller(result.system.propeller);
      setSelectedOilDistributor(result.system.oilDistributor);
      setSelectedHydraulicUnit(result.system.hydraulicUnit);
      if (onSystemSelect) {
        onSystemSelect(result.system);
      }
    }
  }, [power, speed, targetRatio, series, propellerDiameter, onSystemSelect]);

  // 重置
  const handleReset = () => {
    setPower('');
    setSpeed('');
    setTargetRatio('');
    setSeries('');
    setPropellerDiameter('');
    setVesselType('工程船');
    setVesselSpeed('');
    setPropellerDepth('3');
    setCavitationTech('standard');
    setDeadweight('5000');
    setShipTypeForEEXI('工程船');
    setSelectedSociety('CCS');
    setSelectionResult(null);
    setSelectedGearbox(null);
    setSelectedPropeller(null);
    setSelectedOilDistributor(null);
    setSelectedHydraulicUnit(null);
  };

  // 格式化价格
  const formatPrice = (price) => {
    if (!price) return '-';
    return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(price);
  };

  // 导出PDF
  const handleExportPDF = async () => {
    if (!selectionResult || !selectionResult.success) {
      toast.warning('请先完成选型后再导出');
      return;
    }

    const today = new Date().toLocaleDateString('zh-CN');
    const htmlContent = `
      <div style="font-family: 'Microsoft YaHei', 'SimSun', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
        <h1 style="text-align: center; color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 15px;">
          CPP可调桨系统选型报告
        </h1>
        <p style="text-align: right; color: #7f8c8d;">生成日期: ${today}</p>

        <h2 style="color: #2980b9; margin-top: 30px;">一、选型参数</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background: #ecf0f1;">
            <td style="border: 1px solid #bdc3c7; padding: 10px; width: 40%;"><strong>发动机功率</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${power} kW</td>
          </tr>
          <tr>
            <td style="border: 1px solid #bdc3c7; padding: 10px;"><strong>发动机转速</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${speed} rpm</td>
          </tr>
          <tr style="background: #ecf0f1;">
            <td style="border: 1px solid #bdc3c7; padding: 10px;"><strong>目标减速比</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${targetRatio}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #bdc3c7; padding: 10px;"><strong>船舶类型</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${vesselType}</td>
          </tr>
          ${propellerDiameter ? `<tr style="background: #ecf0f1;">
            <td style="border: 1px solid #bdc3c7; padding: 10px;"><strong>螺旋桨直径</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${propellerDiameter} m</td>
          </tr>` : ''}
        </table>

        <h2 style="color: #2980b9;">二、CPP齿轮箱</h2>
        ${selectedGearbox ? `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background: #3498db; color: white;">
            <td colspan="2" style="border: 1px solid #2980b9; padding: 12px; text-align: center; font-size: 18px;">
              <strong>${selectedGearbox.model}</strong> (${selectedGearbox.series}系列)
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #bdc3c7; padding: 10px; width: 40%;"><strong>最大功率</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${selectedGearbox.maxPower} kW</td>
          </tr>
          <tr style="background: #ecf0f1;">
            <td style="border: 1px solid #bdc3c7; padding: 10px;"><strong>选定减速比</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${selectedGearbox.selectedRatio || '-'}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #bdc3c7; padding: 10px;"><strong>传递能力</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${selectedGearbox.selectedCapacity || '-'} kW/(r/min)</td>
          </tr>
          <tr style="background: #ecf0f1;">
            <td style="border: 1px solid #bdc3c7; padding: 10px;"><strong>推力</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${selectedGearbox.thrust} kN</td>
          </tr>
          <tr>
            <td style="border: 1px solid #bdc3c7; padding: 10px;"><strong>重量</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${selectedGearbox.weight} kg</td>
          </tr>
          <tr style="background: #27ae60; color: white;">
            <td style="border: 1px solid #1e8449; padding: 10px;"><strong>市场价格</strong></td>
            <td style="border: 1px solid #1e8449; padding: 10px; font-size: 16px;">${formatPrice(selectedGearbox.marketPrice)}</td>
          </tr>
        </table>
        ` : '<p style="color: #e74c3c;">未选择齿轮箱</p>'}

        <h2 style="color: #2980b9;">三、调距桨</h2>
        ${selectedPropeller ? `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background: #9b59b6; color: white;">
            <td colspan="2" style="border: 1px solid #8e44ad; padding: 12px; text-align: center; font-size: 18px;">
              <strong>${selectedPropeller.model}</strong> (${selectedPropeller.series}系列 - ${selectedPropeller.type})
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #bdc3c7; padding: 10px; width: 40%;"><strong>直径范围</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${selectedPropeller.diameterRange?.join(' - ')} m</td>
          </tr>
          <tr style="background: #ecf0f1;">
            <td style="border: 1px solid #bdc3c7; padding: 10px;"><strong>叶片数</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${selectedPropeller.bladeCount?.join(' / ')}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #bdc3c7; padding: 10px;"><strong>最大功率</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${selectedPropeller.maxPower} kW</td>
          </tr>
          <tr style="background: #ecf0f1;">
            <td style="border: 1px solid #bdc3c7; padding: 10px;"><strong>桨距范围</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${selectedPropeller.pitchRange?.join(' ~ ')}°</td>
          </tr>
          <tr>
            <td style="border: 1px solid #bdc3c7; padding: 10px;"><strong>叶片材料</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${selectedPropeller.bladeMaterial}</td>
          </tr>
          <tr style="background: #27ae60; color: white;">
            <td style="border: 1px solid #1e8449; padding: 10px;"><strong>市场价格</strong></td>
            <td style="border: 1px solid #1e8449; padding: 10px; font-size: 16px;">${formatPrice(selectedPropeller.marketPrice)}</td>
          </tr>
        </table>
        ` : '<p style="color: #7f8c8d;">未选择调距桨</p>'}

        <h2 style="color: #2980b9;">四、配套设备</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background: #34495e; color: white;">
            <th style="border: 1px solid #2c3e50; padding: 10px;">设备</th>
            <th style="border: 1px solid #2c3e50; padding: 10px;">型号</th>
            <th style="border: 1px solid #2c3e50; padding: 10px;">主要参数</th>
            <th style="border: 1px solid #2c3e50; padding: 10px;">价格</th>
          </tr>
          <tr>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">配油器</td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${selectedOilDistributor?.model || '-'}</td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${selectedOilDistributor ? `${selectedOilDistributor.maxPressure} MPa, ${selectedOilDistributor.flowRate} L/min` : '-'}</td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${formatPrice(selectedOilDistributor?.marketPrice)}</td>
          </tr>
          <tr style="background: #ecf0f1;">
            <td style="border: 1px solid #bdc3c7; padding: 10px;">液压单元</td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${selectedHydraulicUnit?.model || '-'}</td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${selectedHydraulicUnit ? `${selectedHydraulicUnit.power} kW, ${selectedHydraulicUnit.tankCapacity} L` : '-'}</td>
            <td style="border: 1px solid #bdc3c7; padding: 10px;">${formatPrice(selectedHydraulicUnit?.marketPrice)}</td>
          </tr>
        </table>

        <h2 style="color: #2980b9;">五、价格汇总</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background: #ecf0f1;">
            <td style="border: 1px solid #bdc3c7; padding: 10px; width: 60%;"><strong>CPP齿轮箱</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px; text-align: right;">${formatPrice(selectionResult.pricing?.gearbox)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #bdc3c7; padding: 10px;"><strong>调距桨</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px; text-align: right;">${formatPrice(selectionResult.pricing?.propeller)}</td>
          </tr>
          <tr style="background: #ecf0f1;">
            <td style="border: 1px solid #bdc3c7; padding: 10px;"><strong>配油器</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px; text-align: right;">${formatPrice(selectionResult.pricing?.oilDistributor)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #bdc3c7; padding: 10px;"><strong>液压单元</strong></td>
            <td style="border: 1px solid #bdc3c7; padding: 10px; text-align: right;">${formatPrice(selectionResult.pricing?.hydraulicUnit)}</td>
          </tr>
          <tr style="background: #e74c3c; color: white; font-size: 18px;">
            <td style="border: 1px solid #c0392b; padding: 12px;"><strong>系统总价</strong></td>
            <td style="border: 1px solid #c0392b; padding: 12px; text-align: right;"><strong>${formatPrice(selectionResult.pricing?.total)}</strong></td>
          </tr>
        </table>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #bdc3c7; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>杭州前进齿轮箱集团股份有限公司</p>
          <p>此报告由CPP选型系统自动生成，仅供参考</p>
        </div>
      </div>
    `;

    try {
      await exportHtmlContentToPDF(htmlContent, `CPP选型报告_${today.replace(/\//g, '-')}`, {
        orientation: 'portrait',
        format: 'a4',
        scale: 2
      });
    } catch (error) {
      console.error('PDF导出失败:', error);
      toast.error('PDF导出失败: ' + error.message);
    }
  };

  // 切换对比项目
  const toggleCompareItem = (item, type = 'gearbox') => {
    const itemWithType = { ...item, _type: type };
    const exists = compareItems.find(c => c.model === item.model && c._type === type);
    if (exists) {
      setCompareItems(compareItems.filter(c => !(c.model === item.model && c._type === type)));
    } else if (compareItems.length < 4) {
      setCompareItems([...compareItems, itemWithType]);
    }
  };

  // 检查是否在对比列表中
  const isInCompare = (model, type = 'gearbox') => {
    return compareItems.some(c => c.model === model && c._type === type);
  };

  // 选择推荐的齿轮箱
  const selectRecommendation = (recommendation) => {
    const { gearbox, matchInfo } = recommendation;
    setSelectedGearbox(gearbox);
    // 重新匹配调距桨等配套设备
    const propellerResult = selectCPPPropeller(gearbox, {
      propellerDiameter: propellerDiameter ? parseFloat(propellerDiameter) : null
    });
    if (propellerResult.success && propellerResult.recommendations.length > 0) {
      setSelectedPropeller(propellerResult.recommendations[0]);
    }
    const odResult = selectOilDistributor(gearbox);
    if (odResult.success && odResult.recommendations.length > 0) {
      setSelectedOilDistributor(odResult.recommendations[0]);
    }
    const hpuResult = selectHydraulicUnit(gearbox);
    if (hpuResult.success && hpuResult.recommendations.length > 0) {
      setSelectedHydraulicUnit(hpuResult.recommendations[0]);
    }
  };

  // 渲染对比表格
  const renderCompareTable = () => {
    if (compareItems.length === 0) return null;
    const gearboxItems = compareItems.filter(c => c._type === 'gearbox');
    const propellerItems = compareItems.filter(c => c._type === 'propeller');

    return (
      <Card className="mb-3" style={{...cardStyle, borderColor: '#17a2b8'}}>
        <Card.Header style={{...headerStyle, backgroundColor: '#17a2b8', color: 'white'}}>
          <i className="bi bi-columns-gap me-2"></i>
          型号对比 ({compareItems.length}/4)
          <Button variant="light" size="sm" className="float-end" onClick={() => setCompareItems([])}>
            <i className="bi bi-x-lg"></i> 清空
          </Button>
        </Card.Header>
        <Card.Body>
          {gearboxItems.length > 0 && (
            <>
              <h6><i className="bi bi-gear me-1"></i>齿轮箱对比</h6>
              <Table bordered size="sm" className="mb-3">
                <thead style={{backgroundColor: '#e9ecef'}}>
                  <tr>
                    <th style={{width: '120px'}}>参数</th>
                    {gearboxItems.map((g, i) => (
                      <th key={i} className="text-center">
                        <strong>{g.model}</strong>
                        <Badge bg="info" className="ms-1">{g.series}</Badge>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr><td>最大功率</td>{gearboxItems.map((g, i) => <td key={i} className="text-center">{g.maxPower} kW</td>)}</tr>
                  <tr><td>减速比</td>{gearboxItems.map((g, i) => <td key={i} className="text-center">{g.ratios?.slice(0, 3).join(', ')}...</td>)}</tr>
                  <tr><td>推力</td>{gearboxItems.map((g, i) => <td key={i} className="text-center">{g.thrust} kN</td>)}</tr>
                  <tr><td>重量</td>{gearboxItems.map((g, i) => <td key={i} className="text-center">{g.weight} kg</td>)}</tr>
                  <tr><td>市场价</td>{gearboxItems.map((g, i) => <td key={i} className="text-center text-danger">{formatPrice(g.marketPrice)}</td>)}</tr>
                  <tr>
                    <td>操作</td>
                    {gearboxItems.map((g, i) => (
                      <td key={i} className="text-center">
                        <Button size="sm" variant="outline-primary" onClick={() => setSelectedGearbox(g)}>
                          选择此型号
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </Table>
            </>
          )}
          {propellerItems.length > 0 && (
            <>
              <h6><i className="bi bi-fan me-1"></i>调距桨对比</h6>
              <Table bordered size="sm">
                <thead style={{backgroundColor: '#e9ecef'}}>
                  <tr>
                    <th style={{width: '120px'}}>参数</th>
                    {propellerItems.map((p, i) => (
                      <th key={i} className="text-center">
                        <strong>{p.model}</strong>
                        <Badge bg="warning" text="dark" className="ms-1">{p.type}</Badge>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr><td>直径范围</td>{propellerItems.map((p, i) => <td key={i} className="text-center">{p.diameterRange?.join('-')} m</td>)}</tr>
                  <tr><td>叶片数</td>{propellerItems.map((p, i) => <td key={i} className="text-center">{p.bladeCount?.join('/')}</td>)}</tr>
                  <tr><td>最大功率</td>{propellerItems.map((p, i) => <td key={i} className="text-center">{p.maxPower} kW</td>)}</tr>
                  <tr><td>市场价</td>{propellerItems.map((p, i) => <td key={i} className="text-center text-danger">{formatPrice(p.marketPrice)}</td>)}</tr>
                  <tr>
                    <td>操作</td>
                    {propellerItems.map((p, i) => (
                      <td key={i} className="text-center">
                        <Button size="sm" variant="outline-primary" onClick={() => setSelectedPropeller(p)}>
                          选择此型号
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </Table>
            </>
          )}
        </Card.Body>
      </Card>
    );
  };

  // 渲染推荐列表（带匹配质量指示）
  const renderRecommendationsList = () => {
    if (!selectionResult?.recommendations || selectionResult.recommendations.length <= 1) return null;

    return (
      <Card className="mb-3" style={{...cardStyle, borderColor: '#28a745'}}>
        <Card.Header style={{...headerStyle, backgroundColor: '#d4edda'}}>
          <i className="bi bi-list-stars me-2"></i>
          备选型号 ({selectionResult.recommendations.length} 个匹配)
        </Card.Header>
        <Card.Body className="p-2">
          <div style={{maxHeight: '200px', overflowY: 'auto'}}>
            {selectionResult.recommendations.map((rec, idx) => {
              const isSelected = selectedGearbox?.model === rec.gearbox.model;
              const marginNum = parseFloat(rec.matchInfo.margin);
              const marginColor = marginNum < 20 ? 'success' : marginNum < 50 ? 'warning' : 'danger';

              return (
                <div
                  key={idx}
                  className={`d-flex align-items-center justify-content-between p-2 mb-1 rounded ${isSelected ? 'bg-primary text-white' : 'bg-light'}`}
                  style={{cursor: 'pointer'}}
                  onClick={() => selectRecommendation(rec)}
                >
                  <div>
                    <strong>{rec.gearbox.model}</strong>
                    <Badge bg="info" className="ms-2">{rec.gearbox.series}</Badge>
                    {cppModelNameMapping.gearbox[rec.gearbox.model]?.realModels?.length > 0 && (
                      <span className="ms-2" style={{fontSize: '0.8em', color: isSelected ? '#cce5ff' : '#6c757d'}}>
                        → {cppModelNameMapping.gearbox[rec.gearbox.model].realModels.slice(0, 3).join('/')}
                      </span>
                    )}
                    <span className="ms-2 text-muted" style={{fontSize: '0.85em'}}>
                      减速比: {rec.gearbox.selectedRatio}
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Badge bg={marginColor} className="me-2">
                      余量 {rec.matchInfo.margin}%
                    </Badge>
                    <span className={isSelected ? 'text-white' : 'text-danger'} style={{fontSize: '0.9em'}}>
                      {formatPrice(rec.gearbox.marketPrice)}
                    </span>
                    {isSelected && <i className="bi bi-check-circle-fill ms-2"></i>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card.Body>
      </Card>
    );
  };

  // 渲染齿轮箱结果卡片
  const renderGearboxCard = (gearbox, matchInfo = null) => {
    if (!gearbox) return null;
    return (
      <Card className="mb-3" style={cardStyle}>
        <Card.Header style={headerStyle} className="d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-gear-fill me-2"></i>
            CPP齿轮箱: {gearbox.model}
            <Badge bg="info" className="ms-2">{gearbox.series}</Badge>
            {matchInfo && (
              <Badge bg={parseFloat(matchInfo.margin) < 20 ? 'success' : 'warning'} className="ms-2">
                余量 {matchInfo.margin}%
              </Badge>
            )}
          </div>
          <Button variant="outline-secondary" size="sm" onClick={() => setSelectedGearbox(null)} title="取消选择此齿轮箱">
            <i className="bi bi-x-circle me-1"></i>取消选择
          </Button>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Table size="sm" bordered>
                <tbody>
                  <tr><td>型号</td><td><strong>{gearbox.model}</strong></td></tr>
                  {getRealModelNames('gearbox', gearbox.model).length > 1 || getRealModelNames('gearbox', gearbox.model)[0] !== gearbox.model ? (
                    <tr><td>对应实际型号</td><td>
                      {getRealModelNames('gearbox', gearbox.model).map((m, i) => (
                        <Badge key={i} bg="outline-dark" className="me-1 mb-1" style={{border: '1px solid #6c757d', color: '#6c757d'}}>{m}</Badge>
                      ))}
                    </td></tr>
                  ) : null}
                  <tr><td>系列</td><td>{gearbox.series} - {gearbox.type}</td></tr>
                  <tr><td>输入转速范围</td><td>{gearbox.inputSpeedRange?.join(' - ')} rpm</td></tr>
                  <tr><td>最大功率</td><td>{gearbox.maxPower} kW</td></tr>
                  <tr><td>{gearbox.selectedRatio ? '选定减速比' : '可选减速比'}</td><td><strong>{gearbox.selectedRatio || (gearbox.ratios?.join(', ') || '-')}</strong></td></tr>
                  <tr><td>传递能力</td><td>{gearbox.selectedCapacity ? gearbox.selectedCapacity : (gearbox.transferCapacity?.map((c, i) => `${gearbox.ratios?.[i]}:${c}`).join(', ') || '-')} kW/(r/min)</td></tr>
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <Table size="sm" bordered>
                <tbody>
                  <tr><td>推力</td><td>{gearbox.thrust} kN</td></tr>
                  <tr><td>重量</td><td>{gearbox.weight} kg</td></tr>
                  <tr><td>油量</td><td>{gearbox.oilCapacity} L</td></tr>
                  <tr><td>尺寸</td><td>{gearbox.dimensions}</td></tr>
                  <tr><td>市场价</td><td className="text-danger">{formatPrice(gearbox.marketPrice)}</td></tr>
                  {matchInfo && (
                    <tr><td>余量</td><td><Badge bg="success">{matchInfo.margin}%</Badge></td></tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
          {gearbox.notes && <Alert variant="info" className="mb-0 mt-2"><small>{gearbox.notes}</small></Alert>}
          {cppModelNameMapping.gearbox[gearbox.model]?.projects?.length > 0 && (
            <Alert variant="success" className="mb-0 mt-2">
              <small>
                <i className="bi bi-bookmark-check me-1"></i>
                <strong>已签项目参考:</strong> {cppModelNameMapping.gearbox[gearbox.model].projects.join('、')}
              </small>
            </Alert>
          )}
        </Card.Body>
      </Card>
    );
  };

  // 渲染调距桨卡片
  const renderPropellerCard = (propeller) => {
    if (!propeller) return null;
    return (
      <Card className="mb-3" style={cardStyle}>
        <Card.Header style={headerStyle} className="d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-fan me-2"></i>
            调距桨: {propeller.model}
            <Badge bg="warning" text="dark" className="ms-2">{propeller.series}</Badge>
            <Badge bg="secondary" className="ms-2">
              {propeller.type === 'heavy-duty' ? '重载型' : propeller.type === 'high-speed' ? '高速型' : '通用型'}
            </Badge>
          </div>
          <Button variant="outline-secondary" size="sm" onClick={() => setSelectedPropeller(null)} title="取消选择此调距桨">
            <i className="bi bi-x-circle me-1"></i>取消选择
          </Button>
        </Card.Header>
        <Card.Body>
          <Table size="sm" bordered>
            <tbody>
              <tr><td>型号</td><td><strong>{propeller.model}</strong></td></tr>
              <tr><td>类型</td><td>{propeller.type === 'heavy-duty' ? '重载型' : propeller.type === 'high-speed' ? '高速型' : '通用型'}</td></tr>
              <tr><td>直径范围</td><td>{propeller.diameterRange?.join(' - ')} m</td></tr>
              <tr><td>叶片数</td><td>{propeller.bladeCount?.join(' / ')}</td></tr>
              <tr><td>最大功率</td><td>{propeller.maxPower} kW</td></tr>
              <tr><td>桨距范围</td><td>{propeller.pitchRange?.join(' ~ ')}°</td></tr>
              <tr><td>叶片材料</td><td>{propeller.bladeMaterial}</td></tr>
              <tr><td>市场价</td><td className="text-danger">{formatPrice(propeller.marketPrice)}</td></tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  // 渲染配油器和液压单元
  const renderAccessoriesCard = () => {
    if (!selectedOilDistributor && !selectedHydraulicUnit) return null;
    return (
      <Card className="mb-3" style={cardStyle}>
        <Card.Header style={headerStyle}>
          <i className="bi bi-droplet-fill me-2"></i>
          配套设备
        </Card.Header>
        <Card.Body>
          <Row>
            {selectedOilDistributor && (
              <Col md={6}>
                <h6>配油器: {selectedOilDistributor.model}</h6>
                <Table size="sm" bordered>
                  <tbody>
                    <tr><td>最大压力</td><td>{selectedOilDistributor.maxPressure} MPa</td></tr>
                    <tr><td>流量</td><td>{selectedOilDistributor.flowRate} L/min</td></tr>
                    <tr><td>价格</td><td className="text-danger">{formatPrice(selectedOilDistributor.marketPrice)}</td></tr>
                  </tbody>
                </Table>
              </Col>
            )}
            {selectedHydraulicUnit && (
              <Col md={6}>
                <h6>液压站: {selectedHydraulicUnit.model}</h6>
                <Table size="sm" bordered>
                  <tbody>
                    <tr><td>功率</td><td>{selectedHydraulicUnit.power} kW</td></tr>
                    <tr><td>压力</td><td>{selectedHydraulicUnit.pressure} MPa</td></tr>
                    <tr><td>油箱</td><td>{selectedHydraulicUnit.tankCapacity} L</td></tr>
                    <tr><td>价格</td><td className="text-danger">{formatPrice(selectedHydraulicUnit.marketPrice)}</td></tr>
                  </tbody>
                </Table>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="cpp-selection-view">
      <Row>
        {/* 左侧：输入面板 */}
        <Col lg={4}>
          <Card style={cardStyle} className="mb-3">
            <Card.Header style={headerStyle}>
              <i className="bi bi-sliders me-2"></i>
              CPP系统选型参数
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>发动机功率 (kW) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                    placeholder="50 ~ 20,000"
                    min={50} max={20000}
                    isInvalid={power !== '' && (parseFloat(power) < 50 || parseFloat(power) > 20000)}
                  />
                  <Form.Control.Feedback type="invalid">功率范围: 50 ~ 20,000 kW</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>发动机转速 (rpm) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    placeholder="300 ~ 3,600"
                    min={300} max={3600}
                    isInvalid={speed !== '' && (parseFloat(speed) < 300 || parseFloat(speed) > 3600)}
                  />
                  <Form.Control.Feedback type="invalid">转速范围: 300 ~ 3,600 rpm</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>目标减速比 <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={targetRatio}
                    onChange={(e) => setTargetRatio(e.target.value)}
                    placeholder="1.5 ~ 12"
                    min={1.5} max={12}
                    isInvalid={targetRatio !== '' && (parseFloat(targetRatio) < 1.5 || parseFloat(targetRatio) > 12)}
                  />
                  <Form.Control.Feedback type="invalid">减速比范围: 1.5 ~ 12</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>齿轮箱系列 (可选)</Form.Label>
                  <Form.Select value={series} onChange={(e) => setSeries(e.target.value)}>
                    <option value="">全部系列</option>
                    <option value="GCS">GCS - 单级减速</option>
                    <option value="GCST">GCST - 单级带PTO</option>
                    <option value="GCD">GCD - 双级减速</option>
                    <option value="GSH">GSH - 侧向输出</option>
                    <option value="GCC">GCC - 紧凑型</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>船舶类型</Form.Label>
                  <Form.Select value={vesselType} onChange={(e) => setVesselType(e.target.value)}>
                    {(vesselTypes || [
                      { name: '拖轮', description: '系泊牵引' },
                      { name: '渔船', description: '拖网作业' },
                      { name: '工程船', description: 'DP定位作业' },
                      { name: 'PSV', description: '平台供应' },
                      { name: '客船', description: '客运渡轮' }
                    ]).map((v, idx) => (
                      <option key={idx} value={v.name}>{v.name} - {v.description}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    <OverlayTrigger placement="right" overlay={<Tooltip>伴流系数(w): 螺旋桨处水流速度与船速之比的修正系数，受船体形状影响。w越大表示桨盘面处水流速度越低。</Tooltip>}>
                      <span style={{cursor: 'help', borderBottom: '1px dashed #6c757d'}}>伴流系数: {currentVesselType.wakeCoefficient}</span>
                    </OverlayTrigger>
                    {' | '}
                    <OverlayTrigger placement="right" overlay={<Tooltip>推力减额(t): 螺旋桨工作时因加速水流降低了船体压力，导致阻力增大的修正系数。t越大表示推力损失越多。</Tooltip>}>
                      <span style={{cursor: 'help', borderBottom: '1px dashed #6c757d'}}>推力减额: {currentVesselType.thrustDeduction}</span>
                    </OverlayTrigger>
                  </Form.Text>
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>螺旋桨直径 (m)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.1"
                        value={propellerDiameter}
                        onChange={(e) => setPropellerDiameter(e.target.value)}
                        placeholder="0.5 ~ 8.0"
                        min={0.5} max={8}
                        isInvalid={propellerDiameter !== '' && (parseFloat(propellerDiameter) < 0.5 || parseFloat(propellerDiameter) > 8)}
                      />
                      <Form.Control.Feedback type="invalid">直径范围: 0.5 ~ 8.0 m</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>航速 (节)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.5"
                        value={vesselSpeed}
                        onChange={(e) => setVesselSpeed(e.target.value)}
                        placeholder="3 ~ 35"
                        min={3} max={35}
                        isInvalid={vesselSpeed !== '' && (parseFloat(vesselSpeed) < 3 || parseFloat(vesselSpeed) > 35)}
                      />
                      <Form.Control.Feedback type="invalid">航速范围: 3 ~ 35 节</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>桨沉深 (m)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.5"
                    value={propellerDepth}
                    onChange={(e) => setPropellerDepth(e.target.value)}
                    placeholder="0.5 ~ 15"
                    min={0.5} max={15}
                    isInvalid={propellerDepth !== '' && propellerDepth !== '3' && (parseFloat(propellerDepth) < 0.5 || parseFloat(propellerDepth) > 15)}
                  />
                  <Form.Control.Feedback type="invalid">桨沉深范围: 0.5 ~ 15 m</Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    螺旋桨中心距水面深度，用于空泡校核
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>空泡防护技术</Form.Label>
                  <Form.Select value={cavitationTech} onChange={(e) => setCavitationTech(e.target.value)}>
                    {Object.values(CAVITATION_PREVENTION_TECHNOLOGIES || {}).map((tech, idx) => (
                      <option key={idx} value={tech.code}>
                        {tech.name} {tech.cavitationReduction > 0 ? `(-${tech.cavitationReduction}%空泡` : ''}
                        {tech.noiseReduction > 0 ? `, -${tech.noiseReduction}dB噪声)` : tech.cavitationReduction > 0 ? ')' : ''}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    选择空泡防护技术影响噪声和效率
                  </Form.Text>
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>载重吨 (DWT)</Form.Label>
                      <Form.Control
                        type="number"
                        value={deadweight}
                        onChange={(e) => setDeadweight(e.target.value)}
                        placeholder="100 ~ 300,000"
                        min={100} max={300000}
                        isInvalid={deadweight !== '' && deadweight !== '5000' && (parseFloat(deadweight) < 100 || parseFloat(deadweight) > 300000)}
                      />
                      <Form.Control.Feedback type="invalid">载重吨范围: 100 ~ 300,000</Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        用于EEXI/CII计算
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    onClick={handleSelection}
                    disabled={!power || !speed || !targetRatio ||
                      (power && (parseFloat(power) < 50 || parseFloat(power) > 20000)) ||
                      (speed && (parseFloat(speed) < 300 || parseFloat(speed) > 3600)) ||
                      (targetRatio && (parseFloat(targetRatio) < 1.5 || parseFloat(targetRatio) > 12))
                    }
                  >
                    <i className="bi bi-search me-2"></i>
                    {(!power || !speed || !targetRatio) ? '请填写必填参数 (*)' : '开始选型'}
                  </Button>
                  <Button variant="outline-secondary" onClick={handleReset}>
                    <i className="bi bi-arrow-counterclockwise me-2"></i>
                    重置
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* 选型结果摘要 */}
          {selectionResult && (
            <Card style={cardStyle}>
              <Card.Header style={{...headerStyle, backgroundColor: selectionResult.success ? '#d4edda' : '#f8d7da'}}>
                {selectionResult.success ? (
                  <><i className="bi bi-check-circle-fill me-2 text-success"></i>选型成功</>
                ) : (
                  <><i className="bi bi-x-circle-fill me-2 text-danger"></i>选型失败</>
                )}
              </Card.Header>
              <Card.Body>
                <p className="mb-2">{selectionResult.message}</p>
                {selectionResult.success && selectionResult.pricing && (
                  <Alert variant="warning" className="mb-0">
                    <strong>系统总价:</strong> {formatPrice(selectionResult.pricing.total)}
                    <br />
                    <small>
                      齿轮箱: {formatPrice(selectionResult.pricing.gearbox)} |
                      调距桨: {formatPrice(selectionResult.pricing.propeller)} |
                      配件: {formatPrice(selectionResult.pricing.oilDistributor + selectionResult.pricing.hydraulicUnit)}
                    </small>
                  </Alert>
                )}
                {selectionResult.success && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="mt-2 w-100"
                    onClick={handleExportPDF}
                  >
                    <i className="bi bi-file-pdf me-2"></i>
                    导出选型报告 (PDF)
                  </Button>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* 右侧：结果展示 */}
        <Col lg={8}>
          {/* 已选分析对象指示条 */}
          {(selectedGearbox || selectedPropeller) && (
            <Alert variant="info" className="py-2 mb-2 d-flex align-items-center justify-content-between">
              <div>
                <i className="bi bi-check2-square me-2"></i>
                <strong>已选分析对象: </strong>
                {selectedGearbox && (
                  <Badge bg="primary" className="me-2">
                    <i className="bi bi-gear me-1"></i>{selectedGearbox.model}
                  </Badge>
                )}
                {selectedPropeller && (
                  <Badge bg="success" className="me-1">
                    <i className="bi bi-fan me-1"></i>{selectedPropeller.model}
                  </Badge>
                )}
                {!selectedGearbox && <span className="text-muted me-2">(未选齿轮箱)</span>}
                {!selectedPropeller && <span className="text-muted">(未选调距桨)</span>}
              </div>
              <Button variant="outline-secondary" size="sm" onClick={() => { setSelectedGearbox(null); setSelectedPropeller(null); }}>
                <i className="bi bi-x-lg me-1"></i>清除选择
              </Button>
            </Alert>
          )}

          <Tabs activeKey={browseTab} onSelect={(k) => setBrowseTab(k)} className="mb-3">
            <Tab eventKey="gearbox" title={<><i className="bi bi-gear me-1"></i>齿轮箱{selectedGearbox ? ' \u2713' : ''}</>}>
              {selectionResult?.recommendations && renderRecommendationsList()}
              <Card style={cardStyle}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">
                      CPP齿轮箱型号浏览
                      <small className="text-muted ms-2" style={{fontSize: '0.7em'}}>点击行或选择radio按钮选定分析对象</small>
                    </h5>
                    <Button
                      variant={compareMode ? 'primary' : 'outline-secondary'}
                      size="sm"
                      onClick={() => setCompareMode(!compareMode)}
                    >
                      <i className="bi bi-columns-gap me-1"></i>
                      {compareMode ? '退出对比' : '开启对比'}
                    </Button>
                  </div>
                  {compareItems.length > 0 && renderCompareTable()}
                  <div style={{maxHeight: '420px', overflowY: 'auto'}}>
                    <Table bordered hover size="sm" className="mb-0">
                      <thead style={{position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa'}}>
                        <tr>
                          <th style={{width: '45px'}} className="text-center">选择</th>
                          {compareMode && <th style={{width: '40px'}} className="text-center">对比</th>}
                          <th>型号</th>
                          <th>系列</th>
                          <th>最大功率</th>
                          <th>减速比</th>
                          <th>推力</th>
                          <th>市场价</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cppGearboxes.map((g, idx) => {
                          const isSelected = selectedGearbox?.model === g.model;
                          return (
                            <tr
                              key={idx}
                              style={{
                                cursor: 'pointer',
                                backgroundColor: isSelected ? '#cfe2ff' : undefined,
                                borderLeft: isSelected ? '3px solid #0d6efd' : '3px solid transparent'
                              }}
                              onClick={() => setSelectedGearbox(g)}
                            >
                              <td className="text-center" onClick={(e) => e.stopPropagation()}>
                                <Form.Check
                                  type="radio"
                                  name="gearboxSelect"
                                  checked={isSelected}
                                  onChange={() => setSelectedGearbox(g)}
                                />
                              </td>
                              {compareMode && (
                                <td className="text-center" onClick={(e) => { e.stopPropagation(); toggleCompareItem(g, 'gearbox'); }}>
                                  <Form.Check
                                    type="checkbox"
                                    checked={isInCompare(g.model, 'gearbox')}
                                    onChange={() => {}}
                                    disabled={!isInCompare(g.model, 'gearbox') && compareItems.length >= 4}
                                  />
                                </td>
                              )}
                              <td><strong>{g.model}</strong> {isSelected && <i className="bi bi-check-circle-fill text-primary ms-1"></i>}</td>
                              <td><Badge bg="info">{g.series}</Badge></td>
                              <td>{g.maxPower} kW</td>
                              <td style={{fontSize: '0.85em'}}>{g.ratios?.join(', ')}</td>
                              <td>{g.thrust} kN</td>
                              <td className="text-danger">{formatPrice(g.marketPrice)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
              {selectedGearbox && renderGearboxCard(selectedGearbox, selectionResult?.recommendations?.find(r => r.gearbox.model === selectedGearbox.model)?.matchInfo)}
            </Tab>

            <Tab eventKey="propeller" title={<><i className="bi bi-fan me-1"></i>调距桨{selectedPropeller ? ' \u2713' : ''}</>}>
              {/* CPP-9: 调距桨系列类型说明 */}
              <Alert variant="light" className="py-2 mb-2" style={{fontSize: '0.85em', border: '1px solid #dee2e6'}}>
                <strong><i className="bi bi-info-circle me-1"></i>系列说明: </strong>
                <Badge bg="danger" className="me-1">HI</Badge> <strong>重载型</strong> - 适用于拖轮、AHTS、工程船等重负荷场景，高强度铜合金叶片
                <span className="mx-2">|</span>
                <Badge bg="success" className="me-1">HF</Badge> <strong>通用型</strong> - 适用于一般船舶，经济高效，优化低速性能
                <span className="mx-2">|</span>
                <Badge bg="warning" text="dark" className="me-1">HS</Badge> <strong>特种型</strong> - 适用于耙吸船、挖泥船等特种船舶，超大直径重载桨毂
              </Alert>
              <Card style={cardStyle}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">
                      调距桨型号浏览
                      <small className="text-muted ms-2" style={{fontSize: '0.7em'}}>点击行选定分析对象</small>
                    </h5>
                    <Button
                      variant={compareMode ? 'primary' : 'outline-secondary'}
                      size="sm"
                      onClick={() => setCompareMode(!compareMode)}
                    >
                      <i className="bi bi-columns-gap me-1"></i>
                      {compareMode ? '退出对比' : '开启对比'}
                    </Button>
                  </div>
                  {compareItems.length > 0 && renderCompareTable()}
                  <div style={{maxHeight: '420px', overflowY: 'auto'}}>
                    <Table bordered hover size="sm" className="mb-0">
                      <thead style={{position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa'}}>
                        <tr>
                          <th style={{width: '45px'}} className="text-center">选择</th>
                          {compareMode && <th style={{width: '40px'}} className="text-center">对比</th>}
                          <th>型号</th>
                          <th>系列</th>
                          <th>类型</th>
                          <th>直径范围</th>
                          <th>最大功率</th>
                          <th>市场价</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cppPropellers.map((p, idx) => {
                          const isSelected = selectedPropeller?.model === p.model;
                          const typeLabel = p.type === 'heavy-duty' ? '重载' : p.type === 'heavy-duty-hub' ? '特种重载' : p.type === 'high-speed' ? '高速' : '通用';
                          return (
                            <tr
                              key={idx}
                              style={{
                                cursor: 'pointer',
                                backgroundColor: isSelected ? '#d1e7dd' : undefined,
                                borderLeft: isSelected ? '3px solid #198754' : '3px solid transparent'
                              }}
                              onClick={() => setSelectedPropeller(p)}
                            >
                              <td className="text-center" onClick={(e) => e.stopPropagation()}>
                                <Form.Check
                                  type="radio"
                                  name="propellerSelect"
                                  checked={isSelected}
                                  onChange={() => setSelectedPropeller(p)}
                                />
                              </td>
                              {compareMode && (
                                <td className="text-center" onClick={(e) => { e.stopPropagation(); toggleCompareItem(p, 'propeller'); }}>
                                  <Form.Check
                                    type="checkbox"
                                    checked={isInCompare(p.model, 'propeller')}
                                    onChange={() => {}}
                                    disabled={!isInCompare(p.model, 'propeller') && compareItems.length >= 4}
                                  />
                                </td>
                              )}
                              <td><strong>{p.model}</strong> {isSelected && <i className="bi bi-check-circle-fill text-success ms-1"></i>}</td>
                              <td><Badge bg={p.series === 'HI' ? 'danger' : p.series === 'HS' ? 'warning' : 'success'} text={p.series === 'HS' ? 'dark' : undefined}>{p.series}</Badge></td>
                              <td>{typeLabel}</td>
                              <td>{p.diameterRange?.join(' - ')} m</td>
                              <td>{p.maxPower} kW</td>
                              <td className="text-danger">{formatPrice(p.marketPrice)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
              {selectedPropeller && renderPropellerCard(selectedPropeller)}
            </Tab>

            <Tab eventKey="accessories" title={<><i className="bi bi-box me-1"></i>配套设备</>}>
              {renderAccessoriesCard() || (
                <Card style={cardStyle}>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <h5>配油器</h5>
                        <Table striped bordered size="sm">
                          <thead>
                            <tr><th>型号</th><th>压力</th><th>流量</th><th>价格</th></tr>
                          </thead>
                          <tbody>
                            {oilDistributors.map((o, idx) => (
                              <tr key={idx}>
                                <td>{o.model}</td>
                                <td>{o.maxPressure} MPa</td>
                                <td>{o.flowRate} L/min</td>
                                <td>{formatPrice(o.marketPrice)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Col>
                      <Col md={6}>
                        <h5>液压单元</h5>
                        <Table striped bordered size="sm">
                          <thead>
                            <tr><th>型号</th><th>功率</th><th>油箱</th><th>价格</th></tr>
                          </thead>
                          <tbody>
                            {cppHydraulicUnits.map((h, idx) => (
                              <tr key={idx}>
                                <td>{h.model}</td>
                                <td>{h.power} kW</td>
                                <td>{h.tankCapacity} L</td>
                                <td>{formatPrice(h.marketPrice)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}
            </Tab>

            {/* 水动力分析Tab */}
            <Tab eventKey="hydrodynamics" title={<><i className="bi bi-water me-1"></i>水动力分析</>}>
              <Card style={cardStyle}>
                <Card.Body>
                  {selectedPropeller ? (
                    <>
                      {/* 敞水性能曲线 */}
                      <HydrodynamicChart
                        propeller={selectedPropeller}
                        operatingPoint={hydrodynamicsResult ? { J: hydrodynamicsResult.J, name: '设计工况' } : null}
                        height={320}
                      />

                      {/* 水动力计算结果 */}
                      {hydrodynamicsResult && (
                        <Card className="mt-3" style={{...cardStyle, background: '#f8f9fa'}}>
                          <Card.Header style={headerStyle}>
                            <i className="bi bi-calculator me-2"></i>
                            水动力计算结果
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col md={4}>
                                <Table size="sm" bordered>
                                  <tbody>
                                    <tr><td>进速系数 J</td><td><strong>{hydrodynamicsResult.J?.toFixed(4)}</strong></td></tr>
                                    <tr><td>推力系数 KT</td><td>{hydrodynamicsResult.KT?.toFixed(4)}</td></tr>
                                    <tr><td>扭矩系数 KQ</td><td>{hydrodynamicsResult.KQ?.toFixed(5)}</td></tr>
                                  </tbody>
                                </Table>
                              </Col>
                              <Col md={4}>
                                <Table size="sm" bordered>
                                  <tbody>
                                    <tr><td>敞水效率 η₀</td><td><strong>{(hydrodynamicsResult.eta0 * 100)?.toFixed(1)}%</strong></td></tr>
                                    <tr><td>推力 T</td><td>{hydrodynamicsResult.thrust?.toFixed(1)} kN</td></tr>
                                    <tr><td>扭矩 Q</td><td>{hydrodynamicsResult.torque?.toFixed(1)} kN·m</td></tr>
                                  </tbody>
                                </Table>
                              </Col>
                              <Col md={4}>
                                <Table size="sm" bordered>
                                  <tbody>
                                    <tr><td>吸收功率</td><td>{hydrodynamicsResult.absorbedPower?.toFixed(1)} kW</td></tr>
                                    <tr><td>进速 Va</td><td>{hydrodynamicsResult.Va?.toFixed(2)} m/s</td></tr>
                                    <tr><td>桨转速</td><td>{hydrodynamicsResult.n?.toFixed(2)} rps</td></tr>
                                  </tbody>
                                </Table>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      )}

                      {/* 效率分解 */}
                      {efficiencyResult && (
                        <div className="mt-3">
                          <EfficiencyBreakdownChart efficiencyData={efficiencyResult} height={180} />
                        </div>
                      )}

                      {/* 工况对比 */}
                      {operatingPointsData && operatingPointsData.length > 0 && (
                        <div className="mt-3">
                          <OperatingPointsChart operatingData={operatingPointsData} height={250} />
                        </div>
                      )}

                      {/* EEDI估算 */}
                      {eediResult && (
                        <Alert variant="info" className="mt-3 mb-0">
                          <strong>EEDI能效估算:</strong> {eediResult.eedi?.toFixed(2)} gCO₂/(t·nm)
                          <Badge bg={eediResult.phase === 'Phase 3' ? 'success' : eediResult.phase === 'Phase 2' ? 'warning' : 'danger'} className="ms-2">
                            {eediResult.phase}
                          </Badge>
                          <br />
                          <small className="text-muted">
                            基于IMO MEPC.328(76)标准，船舶载重量假设5000吨
                          </small>
                        </Alert>
                      )}
                    </>
                  ) : (
                    <Alert variant="secondary">
                      <i className="bi bi-info-circle me-2"></i>
                      请先选择调距桨以查看水动力性能分析
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            {/* CCS规范校核Tab */}
            <Tab eventKey="ccs" title={<><i className="bi bi-shield-check me-1"></i>CCS校核</>}>
              <Card style={cardStyle}>
                <Card.Body>
                  {selectedPropeller ? (
                    <>
                      {/* CCS合规摘要 */}
                      <div className="mb-3">
                        <CCSComplianceSummary propeller={selectedPropeller} />
                      </div>

                      {/* CCS详细校核面板 */}
                      <CCSCompliancePanel
                        propeller={selectedPropeller}
                        operatingParams={{
                          power: power ? parseFloat(power) : 800,
                          speed: speed ? parseFloat(speed) : 1500,
                          diameter: propellerDiameter ? parseFloat(propellerDiameter) : null,
                          Va: hydrodynamicsResult?.Va || 5,
                          depth: propellerDepth ? parseFloat(propellerDepth) : 3
                        }}
                        gearbox={selectedGearbox}
                      />

                      {/* 齿轮箱CCS信息 */}
                      {selectedGearbox?.classification && (
                        <Card className="mt-3" style={{...cardStyle, background: '#f0f5ff'}}>
                          <Card.Header style={{...headerStyle, background: '#e6f0ff'}}>
                            <i className="bi bi-gear me-2"></i>
                            齿轮箱CCS认证信息
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col md={6}>
                                <Table size="sm">
                                  <tbody>
                                    <tr><td>船级社</td><td><strong>{selectedGearbox.classification.society}</strong></td></tr>
                                    <tr><td>证书编号</td><td>{selectedGearbox.classification.certificate}</td></tr>
                                  </tbody>
                                </Table>
                              </Col>
                              <Col md={6}>
                                <Table size="sm">
                                  <tbody>
                                    <tr><td>冰区等级</td><td>{selectedGearbox.classification.iceClass || '-'}</td></tr>
                                    <tr><td>有效期</td><td>{selectedGearbox.classification.valid}</td></tr>
                                  </tbody>
                                </Table>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      )}
                    </>
                  ) : (
                    <Alert variant="secondary">
                      <i className="bi bi-info-circle me-2"></i>
                      请先选择调距桨以查看CCS规范校核结果
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            {/* 多船级社合规校核Tab */}
            <Tab eventKey="classification" title={<><i className="bi bi-globe me-1"></i>国际船检</>}>
              <Card style={cardStyle}>
                <Card.Body>
                  {selectedPropeller ? (
                    <ClassificationCompliancePanel
                      propeller={selectedPropeller}
                      gearbox={selectedGearbox}
                      operatingParams={{
                        power: power ? parseFloat(power) : 800,
                        speed: speed ? parseFloat(speed) : 1500,
                        diameter: propellerDiameter ? parseFloat(propellerDiameter) : null,
                        Va: hydrodynamicsResult?.Va || 5,
                        depth: propellerDepth ? parseFloat(propellerDepth) : 3
                      }}
                      defaultSociety={selectedSociety || 'CCS'}
                    />
                  ) : (
                    <Alert variant="secondary">
                      <i className="bi bi-info-circle me-2"></i>
                      请先选择调距桨以查看国际船检合规校核结果
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            {/* 能效合规Tab */}
            <Tab eventKey="efficiency" title={<><i className="bi bi-leaf me-1"></i>能效合规</>}>
              <Card style={cardStyle}>
                <Card.Body>
                  {(selectedPropeller || selectedGearbox) ? (
                    <EnergyEfficiencyPanel
                      gearbox={selectedGearbox}
                      vesselData={{
                        installedPower: power ? parseFloat(power) : 800,
                        referenceSpeed: vesselSpeed ? parseFloat(vesselSpeed) : 12,
                        capacity: deadweight ? parseFloat(deadweight) : 5000,
                        shipType: shipTypeForEEXI || vesselType || 'generalCargo',
                        propellerDiameter: propellerDiameter ? parseFloat(propellerDiameter) : 3,
                        fuelType: 'HFO'
                      }}
                      cppSystem={{
                        propellerEfficiency: selectedPropeller?.efficiency || 0.65,
                        hybridReady: selectedPropeller?.energyEfficiency?.hybridReady || false
                      }}
                    />
                  ) : (
                    <Alert variant="secondary">
                      <i className="bi bi-info-circle me-2"></i>
                      请先选择齿轮箱或调距桨以查看能效合规分析
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            {/* 智能监控Tab */}
            <Tab eventKey="monitoring" title={<><i className="bi bi-cpu me-1"></i>智能监控</>}>
              <Card style={cardStyle}>
                <Card.Body>
                  {selectedGearbox ? (
                    <SmartMonitoringPanel
                      gearbox={selectedGearbox}
                      propeller={selectedPropeller}
                    />
                  ) : (
                    <Alert variant="secondary">
                      <i className="bi bi-info-circle me-2"></i>
                      请先选择齿轮箱以查看智能监控配置
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default CPPSelectionView;
