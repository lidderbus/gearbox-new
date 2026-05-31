// src/components/EnhancedGearboxSelectionResult.js
import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { toast } from '../utils/toast';
import { Card, Row, Col, Table, Badge, Button, Tabs, Tab, Alert, Form, ListGroup, Spinner } from 'react-bootstrap';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend } from 'recharts';
import { needsStandbyPump } from '../utils/enhancedPumpSelection';
import { validateGearbox, validateCoupling, validatePump } from '../utils/dataValidator';
import ProductThumbnail from './ProductThumbnail';
import ProductImageModal from './ProductImageModal';
import { SeriesCharacteristicsBadge } from './SelectionGuidelines';
import { DataCompletenessBadge } from './selection/GearboxScorer';
import { useIsMobile } from '../hooks/useIsMobile';
import SwipeableResultCards from './responsive/SwipeableResultCards';
import { getManualInfo } from '../data/gearboxManuals';
// 2026-05-23 BUG FIX: P2-11 实际应改这个 Enhanced 组件 (SelectionResultTab dynamic-import 用), 而非 dead-code GearboxSelectionResult
import { modelPdfPage, isExactModelPage, MANUAL_PDF_URL } from '../utils/pdfAnchor';
import { formatPrice, getDisplayPrice, getPriceModeLabel, isPriceMissing, getPriceBadge } from '../utils/priceFormatter';
import { getPriceMode, setPriceMode, PRICE_MODE } from '../data/priceDiscount';
import MarginIndicator from './selection/MarginIndicator';
import RecommendationReasonCard from './selection/RecommendationReasonCard';
import SelectionBasisCard from './selection/SelectionBasisCard';
import StructuralFormFilter from './selection/StructuralFormFilter';
import { getGwSubSeries, GW_SUB_SERIES_META, GW_SUB_SERIES_LIST } from '../utils/gwStructuralForm';
import RelaxationSuggestions from './selection/RelaxationSuggestions';
import DataCompletenessCard from './selection/DataCompletenessCard';
import ScoreBreakdownCard from './selection/ScoreBreakdownCard';
import MiniScoreBar from './selection/MiniScoreBar';
import NearMatchBanner from './selection/NearMatchBanner';
import CopilotRulesChips from './EnhancedGearboxSelectionResult/CopilotRulesChips';
import { exportSelectionSummary } from '../utils/selectionSummaryExport';
import { calculatePowerRange, extractSeriesFromModel } from '../utils/gearboxDataEnhancer';
import EquipmentInfoCard from './EquipmentInfoCard';
import marketEnrichment from '../data/marketEnrichment.json';
import { evaluatePTOThermalMargin } from '../utils/ptoThermalMargin';
import { resolvePackage } from '../utils/packageResolver';
import { savePackageQuotation } from '../utils/quotationManager';
import { recommendCoupling as recommendCopilotCoupling, recommendPump as recommendCopilotPump } from '../services/copilotDataLoader';

// 导入子组件
import {
  ValidationWarnings,
  PumpInfoSection,
  CouplingInfoSection,
  PropulsionSection,
  ComparisonTable,
  PriceComparisonChart,
  PerformanceChart
} from './EnhancedGearboxSelectionResult/index';

// IMOCompliancePanel 转 lazy: 拉走 cppSystemData(49KB) + energyEfficiencyCompliance + imoComplianceEngine
const IMOCompliancePanel = lazy(() => import(/* webpackChunkName: "imo-compliance" */ './imo/IMOCompliancePanel'));

// SelectionComparisonCharts 走 lazy: 它把 echarts (~1MB) 拉进主包, 仅"可视化对比"Tab 需要
const SelectionComparisonCharts = lazy(() => import(/* webpackChunkName: "selection-comparison-charts" */ './SelectionComparisonCharts'));

const HOT_THRESHOLD = (marketEnrichment && marketEnrichment._meta && marketEnrichment._meta.hotSellerThreshold) || 7;

// 懒加载选型漏斗图
const SelectionFunnelChart = lazy(() => import('./SelectionFunnelChart'));

// 懒加载3D预览组件 (拉 three.js + react-three/fiber ~905KB)
const Gearbox3DPreview = lazy(() => import(/* webpackChunkName: "three-3d-preview" */ './Gearbox3DPreview'));

// 动态导入选型报告生成器（避免bundle膨胀）
const loadReportGenerator = () => import('../utils/selectionReportGenerator');

/**
 * 增强的齿轮箱选型结果组件
 * 包含齿轮箱选型结果、高弹联轴器信息和对比功能
 */
const EnhancedGearboxSelectionResult = ({
  result,
  selectedIndex = 0,
  onSelectGearbox,
  onGenerateQuotation,
  onGenerateAgreement,
  onGenerateFullPackage,
  colors,
  theme = 'light',
  propulsionConfig = null
}) => {
  // 状态管理 - 所有Hooks必须在组件顶层无条件调用
  const [activeTab, setActiveTab] = useState('details');
  const [priceMode, setPriceModeState] = useState(getPriceMode());
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparedGearboxes, setComparedGearboxes] = useState([]);
  const [showLowScore, setShowLowScore] = useState(false);
  // GW 子系列结构形式过滤（空数组 = 不限制）
  const [structuralFilter, setStructuralFilter] = useState([]);
  const [selectedAccessories, setSelectedAccessories] = useState({
    coupling: null,
    pump: null
  });

  // 图片弹窗状态
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageModalData, setImageModalData] = useState({ model: '', type: 'gearbox' });

  // 图片点击处理
  const handleImageClick = useCallback((data) => {
    setImageModalData({ model: data.model, type: data.type });
    setImageModalOpen(true);
  }, []);

  const handleCloseImageModal = useCallback(() => {
    setImageModalOpen(false);
  }, []);

  // 获取高弹联轴器和备用泵数据
  const couplingResult = result?.flexibleCoupling || null;
  const pumpResult = result?.standbyPump || null;

  // 判断是否需要备用泵
  const needsPumpFlag = useMemo(() => {
    if (!result || !result.recommendations || !result.recommendations[selectedIndex]) {
      return false;
    }
    
    const gearbox = result.recommendations[selectedIndex];
    // 优先使用备用泵选型结果中的requiresPump标志
    if (pumpResult && 'requiresPump' in pumpResult) {
      return pumpResult.requiresPump;
    }
    
    // 如果没有备用泵选型结果，使用增强版备用泵选型函数判断
    return needsStandbyPump(gearbox.model, {
      power: gearbox.power
    });
  }, [result, selectedIndex, pumpResult]);

  // 计算选中齿轮箱、联轴器、备用泵的数据验证结果
  const validationResults = useMemo(() => {
    const results = {
      gearbox: { valid: true, errors: [], warnings: [] },
      coupling: { valid: true, errors: [], warnings: [] },
      pump: { valid: true, errors: [], warnings: [] }
    };

    // 验证选中的齿轮箱
    if (result && result.recommendations && result.recommendations[selectedIndex]) {
      results.gearbox = validateGearbox(result.recommendations[selectedIndex]);
    }

    // 验证联轴器
    if (couplingResult && couplingResult.success) {
      results.coupling = validateCoupling(couplingResult);
    }

    // 验证备用泵
    if (pumpResult && pumpResult.success) {
      results.pump = validatePump(pumpResult);
    }

    return results;
  }, [result, selectedIndex, couplingResult, pumpResult]);

  // 在组件挂载或依赖项更改时初始化已选配件
  useEffect(() => {
    if (couplingResult && couplingResult.success) {
      setSelectedAccessories(prev => ({
        ...prev,
        coupling: couplingResult
      }));
    }

    if (pumpResult && pumpResult.success) {
      setSelectedAccessories(prev => ({
        ...prev,
        pump: pumpResult
      }));
    }
  }, [couplingResult, pumpResult]);

  // Copilot 官方配套推荐 (复用 copilotDataLoader, 86 联轴器映射 + 50 泵映射 + 兜底链)
  // 优先级: 官方映射 → 扭矩公式 / applicableGearbox 反查 → 中心距经验 → null
  const [copilotAux, setCopilotAux] = useState({ coupling: null, pump: null });
  useEffect(() => {
    const top = result?.recommendations?.[selectedIndex] || result?.recommendations?.[0];
    const model = top?.gearbox?.model || top?.model;
    if (!model) {
      setCopilotAux({ coupling: null, pump: null });
      return;
    }
    const power = result?.enginePower || top?.gearbox?.power || top?.power || 0;
    const speed = result?.engineSpeed || 1500;
    const cd = top?.gearbox?.centerDistance || top?.centerDistance;
    Promise.all([
      recommendCopilotCoupling(model, power, speed, 1.5).catch(() => ({ coupling: null, source: 'none' })),
      recommendCopilotPump(model, cd).catch(() => ({ pump: null, source: 'none' })),
    ]).then(([c, p]) => setCopilotAux({ coupling: c, pump: p }));
  }, [result, selectedIndex]);

  // Mobile/Tablet responsive layout
  const { isMobile, isTablet } = useIsMobile();
  const useResponsiveLayout = isMobile || isTablet;

  // 移动端使用滑动卡片视图
  if (useResponsiveLayout) {
    return (
      <SwipeableResultCards
        result={result}
        selectedIndex={selectedIndex}
        onSelectGearbox={onSelectGearbox}
        onGenerateQuotation={onGenerateQuotation}
        onGenerateAgreement={onGenerateAgreement}
        onBack={() => window.history.back()}
      />
    );
  }

  // 如果没有结果，提前返回
  if (!result || !result.recommendations || result.recommendations.length === 0) {
    return (
      <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors?.card || 'white', borderColor: colors?.border || '#ddd' }} role="region" aria-live="polite" aria-label="选型结果">
        <Card.Header style={{ backgroundColor: colors?.headerBg || '#f5f5f5', color: colors?.headerText || '#333' }}>
          <i className="bi bi-gear-fill me-2"></i>选型结果
        </Card.Header>
        <Card.Body>
          <div className="text-center py-4">
            <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '2rem' }}></i>
            <p className="mt-3">没有找到符合条件的齿轮箱。建议尝试：降低功率要求、放宽转速范围、或切换系列类型后重试。</p>
            {result && result.message && (
              <Alert variant="warning" className="mt-3">
                <i className="bi bi-info-circle-fill me-2"></i>
                {result.message}
              </Alert>
            )}
          </div>
          <RelaxationSuggestions suggestions={result?.relaxationSuggestions} />
        </Card.Body>
      </Card>
    );
  }

  // 获取必要数据
  const recommendations = result.recommendations || [];
  const selectedGearbox = recommendations[selectedIndex];
  const isPartialMatch = selectedGearbox.isPartialMatch === true;

  // 对比功能处理
  const toggleCompareGearbox = (gearbox) => {
    if (comparedGearboxes.some(g => g.model === gearbox.model)) {
      setComparedGearboxes(comparedGearboxes.filter(g => g.model !== gearbox.model));
    } else {
      // 最多比较4个齿轮箱
      if (comparedGearboxes.length < 4) {
        setComparedGearboxes([...comparedGearboxes, gearbox]);
      } else {
        toast.warning('最多可以比较4个齿轮箱');
      }
    }
  };

  // 计算齿轮箱性能指标
  const calculatePerformanceMetrics = (gearbox) => {
    return {
      capacityScore: Math.min(100, 100 - Math.abs(gearbox.capacityMargin - 15) * 2),
      ratioMatchScore: Math.max(0, 100 - gearbox.ratioDiffPercent * 5),
      thrustCapacity: gearbox.thrust ? Math.min(100, (gearbox.thrust / 300) * 100) : 50,
      efficiencyScore: gearbox.efficiency ? gearbox.efficiency * 100 : 95,
      pricePerformanceScore: Math.max(0, 100 - ((gearbox.marketPrice / 300000) * 100))
    };
  };

  // 生成齿轮箱对比数据
  const generateComparisonData = () => {
    const comparisonItems = [selectedGearbox, ...comparedGearboxes.filter(g => g.model !== selectedGearbox.model)];

    return comparisonItems.map(gearbox => {
      const metrics = calculatePerformanceMetrics(gearbox);

      return {
        name: gearbox.model,
        '传递能力': gearbox.selectedCapacity || 0,
        '减速比': gearbox.selectedRatio || gearbox.ratio || 0,
        '能力余量(%)': gearbox.capacityMargin || 0,
        '减速比偏差(%)': gearbox.ratioDiffPercent || 0,
        '推力(kN)': gearbox.thrust || 0,
        '重量(kg)': gearbox.weight || 0,
        '价格(元)': getDisplayPrice(gearbox) || 0,
        ...metrics,
        isSelected: gearbox.model === selectedGearbox.model,
        // 添加备用泵需求判断
        requiresPump: needsStandbyPump(gearbox.model, { power: gearbox.power }),
        // 保留原始齿轮箱对象引用，用于DataCompletenessBadge
        _gearbox: gearbox
      };
    });
  };

  // 渲染比较模式内容
  const renderComparisonContent = () => {
    return (
      <div className="comparison-mode mb-4">
        <Alert variant="info">
          <div className="d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-info-circle me-2"></i>
              比较模式已启用。请选择要比较的齿轮箱（最多4个）。
            </span>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => setComparisonMode(false)}
            >
              退出比较
            </Button>
          </div>
        </Alert>
        
        <Form>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {recommendations.map((gearbox, index) => (
              <Form.Check
                key={`compare-${gearbox.model}`}
                type="checkbox"
                id={`compare-${gearbox.model}`}
                label={`${gearbox.model} ${gearbox === selectedGearbox ? '(当前选择)' : ''}`}
                checked={comparedGearboxes.some(g => g.model === gearbox.model) || gearbox === selectedGearbox}
                onChange={() => toggleCompareGearbox(gearbox)}
                disabled={gearbox === selectedGearbox} // 当前选中齿轮箱不可取消
              />
            ))}
          </div>
        </Form>
        
        <ComparisonTable
          comparisonData={generateComparisonData()}
          recommendations={recommendations}
          onSelectGearbox={onSelectGearbox}
          thrustRequirement={result.thrustRequirement}
          colors={colors}
        />
        <PriceComparisonChart
          comparisonData={generateComparisonData()}
          colors={colors}
          theme={theme}
        />
        <PerformanceChart
          comparisonData={generateComparisonData()}
          colors={colors}
          theme={theme}
        />
        
        <div className="d-flex justify-content-center mt-4">
          <Button 
            variant="primary"
            onClick={() => {
              setComparisonMode(false);
              setActiveTab('details');
            }}
          >
            返回详细信息
          </Button>
        </div>
        
        {result.warning && (
          <Alert variant="warning" className="mt-4">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {result.warning}
          </Alert>
        )}

        {result.priceInfo && (
          <Alert variant="info" className="mt-2">
            <i className="bi bi-info-circle me-2"></i>
            {result.priceInfo}
          </Alert>
        )}

        {/* UI-接入#2 (2026-04-24): 冰级推力放大提示 */}
        {result.iceFactor > 1 && result.thrustRequirementRaw > 0 && (
          <Alert variant="info" className="mt-2">
            <i className="bi bi-snow me-2"></i>
            冰级 <strong>{result.iceClass}</strong> 已激活,推力需求按 <strong>×{result.iceFactor}</strong> 放大:
            {' '}{result.thrustRequirementRaw.toFixed(1)}kN → <strong>{result.thrustRequirement.toFixed(1)}kN</strong>
            {' '}(考虑冰块冲击峰值载荷)
          </Alert>
        )}

        <div className="d-flex justify-content-end mt-4 gap-2 flex-wrap">
          {onGenerateFullPackage && (
            <Button
              variant="primary"
              onClick={onGenerateFullPackage}
              title="一键生成报价单 + 技术协议,并自动跳转合同 Tab"
            >
              <i className="bi bi-stack me-1"></i> 一键生成完整文件包
            </Button>
          )}
          <Button
            variant="outline-primary"
            onClick={onGenerateQuotation}
          >
            <i className="bi bi-currency-yen me-1"></i> 生成报价单
          </Button>
          <Button
            variant="outline-success"
            onClick={onGenerateAgreement}
          >
            <i className="bi bi-file-earmark-text me-1"></i> 生成技术协议
          </Button>
        </div>
      </div>
    );
  };

  // 渲染标签页内容
  const renderTabsContent = () => {
    return (
      <>
        {/* 价格模式切换 */}
        <div className="d-flex align-items-center gap-3 mb-3 px-2 py-2" style={{ background: 'rgba(0,0,0,0.03)', borderRadius: 8, fontSize: '0.85rem' }}>
          <span className="text-muted fw-bold">价格显示:</span>
          <Form.Check
            type="radio"
            id="price-mode-external"
            label="外部报价（含利润）"
            name="priceMode"
            checked={priceMode === PRICE_MODE.EXTERNAL}
            onChange={() => { setPriceMode(PRICE_MODE.EXTERNAL); setPriceModeState(PRICE_MODE.EXTERNAL); }}
            inline
          />
          <Form.Check
            type="radio"
            id="price-mode-internal"
            label="内部进价（采购成本）"
            name="priceMode"
            checked={priceMode === PRICE_MODE.INTERNAL}
            onChange={() => { setPriceMode(PRICE_MODE.INTERNAL); setPriceModeState(PRICE_MODE.INTERNAL); }}
            inline
          />
          <Badge bg={priceMode === PRICE_MODE.INTERNAL ? 'info' : 'success'}>
            {priceMode === PRICE_MODE.INTERNAL ? '进价模式' : '报价模式'}
          </Badge>
        </div>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
          style={{ borderBottomColor: colors?.border || '#ddd' }}
        >
          {/* 全部候选列表视图 */}
          <Tab eventKey="list" title={`全部候选 (${recommendations.length})${result.success === false ? ' ⚠' : ''}`}>
            {(() => {
              const hasPartials = recommendations.some(g => g.isPartialMatch);
              return (
            <Table striped hover size="sm">
              <thead>
                <tr>
                  <th>#</th><th>型号</th><th>评分</th><th>系列</th><th>减速比</th><th>传递能力</th><th>余量</th><th>推力kN</th><th>重量kg</th><th>{priceMode === PRICE_MODE.INTERNAL ? '进价' : '报价'}</th>
                  {hasPartials && <th style={{fontSize:'0.75rem'}}>不满足项</th>}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map((g, idx) => (
                  <tr key={g.model + idx}
                    className={idx === selectedIndex ? 'table-primary' : g.isPartialMatch ? 'table-warning' : ''}
                    style={{cursor:'pointer'}} onClick={() => onSelectGearbox(idx)}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>{g.model}</strong>
                      {g.isPartialMatch && <i className="bi bi-exclamation-triangle-fill text-warning ms-1" style={{fontSize:'0.7rem'}}></i>}
                    </td>
                    <td><MiniScoreBar gearbox={g} /></td>
                    <td><Badge bg={g.model?.startsWith('GW') ? 'danger' : g.model?.startsWith('HCM') ? 'success' : 'primary'} className="small">{(g.originalType || g.model?.match(/^[A-Z]+/)?.[0] || '')}</Badge></td>
                    <td>{g.selectedRatio || g.ratio || '-'}</td>
                    <td>{g.selectedCapacity?.toFixed(4) || '-'}</td>
                    <td>
                      {g.capacityMargin != null ? `${g.capacityMargin.toFixed(1)}%` : '-'}
                      {g.capacityMargin <= 0 ? <Badge bg="danger" className="ms-1">危险</Badge> : g.capacityMargin < 5 ? <Badge bg="warning" className="ms-1">低</Badge> : null}
                    </td>
                    <td>{g.thrust || '-'}</td>
                    <td>{g.weight || '-'}</td>
                    <td>{(() => {
                      const p = getDisplayPrice(g);
                      if (p > 0) return `${(p/10000).toFixed(1)}万`;
                      const badge = getPriceBadge(g);
                      return (
                        <Badge bg={badge.variant} title={badge.tooltip}>
                          <i className="bi bi-telephone me-1"></i>{badge.text}
                        </Badge>
                      );
                    })()}</td>
                    {hasPartials && (
                      <td style={{fontSize:'0.7rem', maxWidth:160}}>
                        {g.failureReason ? (
                          <span className="text-danger">{g.failureReason.length > 40 ? g.failureReason.substring(0, 38) + '…' : g.failureReason}</span>
                        ) : g.isPartialMatch ? (
                          <span className="text-muted">-</span>
                        ) : (
                          <Badge bg="success" style={{fontSize:'0.65rem'}}>全部满足</Badge>
                        )}
                      </td>
                    )}
                    <td>{idx === selectedIndex ? <Badge bg="primary">当前</Badge> : <Button size="sm" variant="outline-primary" onClick={(e) => {e.stopPropagation(); onSelectGearbox(idx);}}>选择</Button>}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
              );
            })()}
          </Tab>
          {/* 齿轮箱详细信息标签页 */}
          <Tab eventKey="details" title="齿轮箱详情">
            <Row>
              <Col md={6}>
                <div className="d-flex align-items-start mb-3">
                  <ProductThumbnail
                    model={selectedGearbox.model}
                    type="gearbox"
                    size={80}
                    onClick={handleImageClick}
                    className="me-3"
                  />
                  <div>
                    <h5 style={{ color: colors?.headerText || '#333', marginBottom: '4px' }}>
                      选中齿轮箱: {selectedGearbox.model}
                      <DataCompletenessBadge gearbox={selectedGearbox} className="ms-2" />
                      {selectedGearbox.marketData && selectedGearbox.marketData.salesCount >= HOT_THRESHOLD && (
                        <Badge
                          bg="danger"
                          className="ms-2"
                          title={`累计售出 ${selectedGearbox.marketData.salesCount} 台 / ${selectedGearbox.marketData.customerCount} 家客户${selectedGearbox.marketData.lastSoldDate ? ' / 最近 ' + selectedGearbox.marketData.lastSoldDate : ''}`}
                        >
                          <i className="bi bi-fire me-1"></i>畅销
                        </Badge>
                      )}
                    </h5>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <small style={{ color: '#666' }}>点击图片查看大图和技术图纸</small>
                      {getManualInfo(selectedGearbox.model) && (
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => window.open(getManualInfo(selectedGearbox.model).path, '_blank', 'noopener,noreferrer')}
                          title={getManualInfo(selectedGearbox.model).title}
                        >
                          <i className="bi bi-file-earmark-pdf me-1"></i>
                          查看说明书
                        </Button>
                      )}
                      {/* 2026-05-23 P2-11 真实接入: 跳官方 2025-05 选型手册对应章节 (32 页 PDF) */}
                      {(() => {
                        const pg = modelPdfPage(selectedGearbox.model, selectedGearbox.series_code || selectedGearbox.series);
                        if (!pg) return null;
                        const exact = isExactModelPage(selectedGearbox.model);
                        return (
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => window.open(MANUAL_PDF_URL + '#page=' + pg, '_blank', 'noopener,noreferrer')}
                            title={exact ? `跳官方 2025-05 选型手册 ${selectedGearbox.model} 精确页 p${pg}` : `跳官方 2025-05 选型手册 章节起始页 p${pg}`}
                          >
                            <i className="bi bi-bookmark-check me-1"></i>
                            官方手册 p{pg}
                            {exact && <span style={{ background: 'rgba(52,211,153,0.25)', color: '#059669', fontSize: '0.7em', padding: '0 4px', borderRadius: 4, marginLeft: 4 }}>✓</span>}
                          </Button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
                {/* 系列特性徽章 - 杭齿选型手册2025版 */}
                <SeriesCharacteristicsBadge
                  seriesType={selectedGearbox.model}
                  style={{ marginBottom: '12px' }}
                />
                {/* 系列适配匹配信息 */}
                {selectedGearbox._seriesMatchInfo && selectedGearbox._seriesMatchInfo.reasons.length > 0 && (
                  <div style={{
                    backgroundColor: '#f6ffed',
                    border: '1px solid #b7eb8f',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    marginBottom: '12px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: 'bold', color: '#52c41a', marginRight: '4px' }}>
                      ✓ 系列适配
                    </span>
                    {selectedGearbox._seriesMatchInfo.reasons.map((reason, idx) => (
                      <span key={idx} style={{
                        backgroundColor: '#52c41a',
                        color: 'white',
                        padding: '1px 8px',
                        borderRadius: '10px',
                        fontSize: '11px'
                      }}>
                        {reason}
                      </span>
                    ))}
                  </div>
                )}
                <RecommendationReasonCard
                  selectedGearbox={selectedGearbox}
                  allRecommendations={recommendations}
                  targetRatio={result.targetRatio}
                />
                <ScoreBreakdownCard
                  selectedGearbox={selectedGearbox}
                  allRecommendations={recommendations}
                  thrustRequirement={result.thrustRequirement || 0}
                  targetRatio={result.targetRatio}
                />
                <DataCompletenessCard gearbox={selectedGearbox} />
                <SelectionBasisCard
                  selectedGearbox={selectedGearbox}
                  result={result}
                />
                <Table striped bordered style={{ backgroundColor: colors?.card || 'white', color: colors?.text || '#333', borderColor: colors?.border || '#ddd' }}>
                  <tbody>
                    <tr>
                      <td>功率范围</td>
                      <td>
                        {(() => {
                          if (selectedGearbox.minPower && selectedGearbox.maxPower)
                            return `${selectedGearbox.minPower} - ${selectedGearbox.maxPower} kW`;
                          const pr = calculatePowerRange(
                            selectedGearbox.transmissionCapacityPerRatio || selectedGearbox.transferCapacity,
                            selectedGearbox.inputSpeedRange
                          );
                          return pr.minPower != null ? `${pr.minPower} - ${pr.maxPower} kW` : '-';
                        })()}
                      </td>
                    </tr>
                    <tr>
                      <td>转速范围</td>
                      <td>
                        {selectedGearbox.minSpeed && selectedGearbox.maxSpeed
                          ? `${selectedGearbox.minSpeed} - ${selectedGearbox.maxSpeed} r/min`
                          : Array.isArray(selectedGearbox.inputSpeedRange) && selectedGearbox.inputSpeedRange.length === 2
                            ? `${selectedGearbox.inputSpeedRange[0]} - ${selectedGearbox.inputSpeedRange[1]} r/min`
                            : '-'}
                      </td>
                    </tr>
                    <tr>
                      <td>传递能力</td>
                      <td>
                        {typeof selectedGearbox.selectedCapacity !== 'undefined' 
                          ? `${selectedGearbox.selectedCapacity.toFixed(6)} kW/rpm` 
                          : (typeof selectedGearbox.power === 'object' 
                            ? `标准: ${selectedGearbox.power.standard} kW / 特殊: ${selectedGearbox.power.special} kW` 
                            : `${selectedGearbox.power || '-'} kW`)}
                      </td>
                    </tr>
                    <tr>
                      <td>所需能力</td>
                      <td>{result.requiredTransferCapacity ? `${result.requiredTransferCapacity.toFixed(6)} kW/rpm` : '-'}</td>
                    </tr>
                    <tr>
                      <td>能力余量</td>
                      <td>
                        {selectedGearbox.capacityMargin !== undefined 
                          ? `${selectedGearbox.capacityMargin.toFixed(1)}%` 
                          : '-'}
                        {selectedGearbox.capacityMargin < 5 ? (
                          <Badge bg="danger" className="ms-2">过低</Badge>
                        ) : selectedGearbox.capacityMargin > 40 ? (
                          <Badge bg="warning" className="ms-2">过高</Badge>
                        ) : (
                          <Badge bg="success" className="ms-2">合适</Badge>
                        )}
                        <MarginIndicator margin={selectedGearbox.capacityMargin} />
                      </td>
                    </tr>
                    {selectedGearbox.capacityMargin !== undefined && selectedGearbox.capacityMargin < 5 && (
                      <tr>
                        <td colSpan={2} style={{ padding: 0 }}>
                          <Alert variant="warning" className="mb-0 py-2" style={{ borderRadius: 0 }}>
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <strong>余量不足警告：</strong>传递能力余量仅 {selectedGearbox.capacityMargin.toFixed(1)}%，低于5%安全阈值，建议选择更大型号或降低输入功率。
                          </Alert>
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td>输入转速</td>
                      <td>{result.engineSpeed || selectedGearbox.inputSpeed} r/min</td>
                    </tr>
                    {/* 2026-05-31 P1: 输出(螺旋桨)轴转速 — 船用减速齿轮箱最关键派生量 */}
                    {(() => {
                      const inSpd = result.engineSpeed || selectedGearbox.inputSpeed;
                      const r = selectedGearbox.selectedRatio
                        || (Array.isArray(selectedGearbox.ratios) ? selectedGearbox.ratios[0] : selectedGearbox.ratio);
                      const out = (inSpd && r) ? (inSpd / r) : null;
                      return out ? (
                        <tr>
                          <td>输出(螺旋桨)转速</td>
                          <td><strong>{out.toFixed(0)} r/min</strong> <small className="text-muted">= 输入 {inSpd} ÷ 减速比 {Number(r).toFixed(2)}</small></td>
                        </tr>
                      ) : null;
                    })()}
                    <tr>
                      <td>减速比</td>
                      <td>
                        {selectedGearbox.selectedRatio 
                          ? selectedGearbox.selectedRatio.toFixed(2) 
                          : (Array.isArray(selectedGearbox.ratios) 
                            ? selectedGearbox.ratios.map(r => typeof r === 'number' ? r.toFixed(2) : r).join(', ') 
                            : selectedGearbox.ratio?.toFixed(2) || '-')}
                      </td>
                    </tr>
                    <tr>
                      <td>目标减速比</td>
                      <td>
                        {result.targetRatio?.toFixed(2) || '-'}
                      </td>
                    </tr>
                    <tr>
                      <td>减速比偏差</td>
                      <td>
                        {selectedGearbox.ratioDiffPercent !== undefined
                          ? `${selectedGearbox.ratioDiffPercent.toFixed(1)}%`
                          : '-'}
                        {selectedGearbox.ratioDiffPercent > 15 && (
                          <Badge bg="warning" className="ms-2">偏差较大</Badge>
                        )}
                      </td>
                    </tr>
                    {selectedGearbox.thrust && (
                      <tr>
                        <td>额定推力</td>
                        <td>
                          {selectedGearbox.thrust} kN
                          {result.thrustRequirement > 0 && (
                            selectedGearbox.thrustMet 
                              ? <Badge bg="success" className="ms-2">满足要求</Badge>
                              : <Badge bg="danger" className="ms-2">不满足要求</Badge>
                          )}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td>备用泵需求</td>
                      <td>
                        {needsPumpFlag ? (
                          <Badge bg="primary">需要配备备用泵</Badge>
                        ) : (
                          <Badge bg="secondary">不需要配备备用泵</Badge>
                        )}
                      </td>
                    </tr>
                    {/* 2026-05-31 P1: 中心距 — 数据全覆盖, 影响布置/对中, 应展示 */}
                    {(selectedGearbox.centerDistance || selectedGearbox.center_distance) && (
                      <tr>
                        <td>中心距</td>
                        <td>{selectedGearbox.centerDistance || selectedGearbox.center_distance} mm</td>
                      </tr>
                    )}
                    <tr>
                      <td>重量</td>
                      <td>{selectedGearbox.weight || '-'} kg</td>
                    </tr>
                    <tr>
                      <td>价格</td>
                      <td>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <strong>{formatPrice(getDisplayPrice(selectedGearbox))}</strong>
                          <Badge bg={getPriceMode() === PRICE_MODE.INTERNAL ? 'info' : 'success'} className="ms-1">
                            {getPriceModeLabel()}
                          </Badge>
                          {selectedGearbox.factoryPrice > 0 && selectedGearbox.marketPrice > 0 && (
                            <small className="text-muted">
                              (进价 {formatPrice(selectedGearbox.factoryPrice)} / 报价 {formatPrice(selectedGearbox.marketPrice)})
                            </small>
                          )}
                        </div>
                      </td>
                    </tr>
                    {selectedGearbox.marketData && (selectedGearbox.marketData.avgSalePrice || selectedGearbox.marketData.salesCount > 0) && (
                      <tr>
                        <td>
                          市场数据
                          <div><small className="text-muted">近15月 ERP 实际成交</small></div>
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            {selectedGearbox.marketData.avgSalePrice && (
                              <div>
                                <strong className="text-primary">市场参考价 {formatPrice(selectedGearbox.marketData.avgSalePrice)}</strong>
                                {selectedGearbox.marketData.realMarginPct != null && (
                                  <Badge
                                    bg={selectedGearbox.marketData.realMarginPct >= 20 ? 'success' : selectedGearbox.marketData.realMarginPct >= 10 ? 'warning' : 'danger'}
                                    className="ms-2"
                                  >
                                    毛利 {selectedGearbox.marketData.realMarginPct}%
                                  </Badge>
                                )}
                                {selectedGearbox.marketData.priceAnomaly && (
                                  <Badge
                                    bg="warning"
                                    text="dark"
                                    className="ms-2"
                                    title={`目录价 ${formatPrice(selectedGearbox.marketData.priceAnomaly.catalogPrice)} / 实际成交 ${selectedGearbox.marketData.priceAnomaly.ratio}x — ${selectedGearbox.marketData.priceAnomaly.hint}`}
                                  >
                                    <i className="bi bi-exclamation-triangle me-1"></i>价差 {selectedGearbox.marketData.priceAnomaly.ratio}x
                                  </Badge>
                                )}
                              </div>
                            )}
                            {selectedGearbox.marketData.salesCount > 0 && (
                              <div className="d-flex align-items-center gap-1 flex-wrap">
                                <Badge bg="info">累计 {selectedGearbox.marketData.salesCount} 台</Badge>
                                <Badge bg="secondary">{selectedGearbox.marketData.customerCount} 家客户</Badge>
                                {selectedGearbox.marketData.lastSoldDate && (
                                  <small className="text-muted">最近成交 {selectedGearbox.marketData.lastSoldDate}</small>
                                )}
                              </div>
                            )}
                            {selectedGearbox.marketData.topCustomers && selectedGearbox.marketData.topCustomers.length > 0 && (
                              <div className="d-flex align-items-center gap-1 flex-wrap" style={{ fontSize: '0.85em' }}>
                                <small className="text-muted">TOP 客户:</small>
                                {selectedGearbox.marketData.topCustomers.slice(0, 3).map((c, i) => (
                                  <Badge key={i} bg="light" text="dark" className="border">{c}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                    {isPartialMatch && selectedGearbox.failureReason && (
                      <tr className="table-warning">
                        <td>匹配度不足原因</td>
                        <td>{selectedGearbox.failureReason}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                {/* 选型安全警告 (结构化warnings数组) */}
                {selectedGearbox.warnings && selectedGearbox.warnings.length > 0 && (
                  <Alert variant={isPartialMatch ? 'danger' : 'warning'} className="py-2 mb-2">
                    <div className="d-flex align-items-center mb-1">
                      <i className={`bi ${isPartialMatch ? 'bi-exclamation-octagon-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
                      <strong>选型安全提示 ({selectedGearbox.warnings.length})</strong>
                    </div>
                    <ul className="mb-0 ps-4" style={{ fontSize: '0.85rem' }}>
                      {selectedGearbox.warnings.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </Alert>
                )}
                {/* 数据验证警告 */}
                <ValidationWarnings validation={validationResults.gearbox} type="gearbox" />
                {/* 临界转速预检结果 */}
                {result?.criticalSpeedCheck && (
                  <Card className={`mt-2 border-${result.criticalSpeedCheck.safe ? 'success' : 'danger'}`}>
                    <Card.Body className="py-2 px-3" style={{ fontSize: '0.85rem' }}>
                      <div className="d-flex align-items-center mb-1">
                        <i className={`bi ${result.criticalSpeedCheck.safe ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'} me-2`}></i>
                        <strong>临界转速预检 ({result.criticalSpeedCheck.method})</strong>
                      </div>
                      <div className="d-flex flex-wrap gap-3">
                        <span>固有频率: <strong>{result.criticalSpeedCheck.naturalFreqHz} Hz</strong></span>
                        <span>工作频率: <strong>{result.criticalSpeedCheck.operatingFreqHz} Hz</strong></span>
                        <span>裕度: <strong className={result.criticalSpeedCheck.marginPercent < 20 ? 'text-danger' : 'text-success'}>{result.criticalSpeedCheck.marginPercent}%</strong></span>
                      </div>
                      <div className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>{result.criticalSpeedCheck.recommendation}</div>
                    </Card.Body>
                  </Card>
                )}
              </Col>
              <Col md={6}>
                {(() => {
                  const allOthers = recommendations
                    .map((gearbox, index) => ({ gearbox, index }))
                    .filter(({ index }) => index !== selectedIndex);

                  // GW 子系列计数（基于 allOthers，过滤前），供 chip 显示数量
                  const subSeriesCounts = GW_SUB_SERIES_LIST.reduce((acc, sub) => {
                    acc[sub] = allOthers.filter(({ gearbox }) => getGwSubSeries(gearbox.model) === sub).length;
                    return acc;
                  }, {});
                  const hasGwCandidates = Object.values(subSeriesCounts).some((c) => c > 0);

                  // 应用结构形式过滤（仅 GW 受影响，非 GW 直通）
                  const others = structuralFilter.length === 0
                    ? allOthers
                    : allOthers.filter(({ gearbox }) => {
                        const sub = getGwSubSeries(gearbox.model);
                        return !sub || structuralFilter.includes(sub);
                      });

                  const highScore = others.filter(({ gearbox }) => (gearbox.score || 0) >= 60).slice(0, 10);
                  const lowScore = others.filter(({ gearbox }) => (gearbox.score || 0) < 60).slice(0, 10);

                  // v62: 无备选时显示占位, 不再展示空表头 (0/0)
                  if (allOthers.length === 0) {
                    return (
                      <Card className="mb-3" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
                        <Card.Body className="text-center text-muted py-3">
                          <i className="bi bi-info-circle me-2"></i>暂无其他匹配齿轮箱
                          <div style={{ fontSize: '0.8rem', marginTop: 4 }}>当前推荐已是最优匹配, 或工况筛选过严</div>
                        </Card.Body>
                      </Card>
                    );
                  }

                  const renderRow = ({ gearbox, index }) => {
                    const gwSub = getGwSubSeries(gearbox.model);
                    const gwMeta = gwSub ? GW_SUB_SERIES_META[gwSub] : null;
                    return (
                    <tr key={gearbox.model + index} className={gearbox.isPartialMatch ? 'table-warning' : ''}>
                      <td>
                        {gearbox.model}
                        {gearbox.isPartialMatch && <Badge bg="warning" className="ms-1">部分</Badge>}
                        {gearbox.warnings?.length > 0 && (
                          <Badge bg="danger" className="ms-1" title={gearbox.warnings.join('; ')}>
                            <i className="bi bi-exclamation-triangle-fill"></i> {gearbox.warnings.length}
                          </Badge>
                        )}
                        <DataCompletenessBadge gearbox={gearbox} className="ms-1" size="sm" />
                      </td>
                      <td><MiniScoreBar gearbox={gearbox} width={60} /></td>
                      <td>
                        {gearbox.series || extractSeriesFromModel(gearbox.model)}
                        {gwMeta && (
                          <Badge bg="info" className="ms-1" title={gwMeta.desc} style={{ fontSize: '0.7rem' }}>
                            {gwMeta.bucket}
                          </Badge>
                        )}
                      </td>
                      <td>
                        {gearbox.selectedRatio?.toFixed(2) || gearbox.ratio?.toFixed(2) || '-'}
                        {gearbox.ratioDiffPercent && (
                          <small className="d-block text-muted">
                            偏差: {gearbox.ratioDiffPercent.toFixed(1)}%
                          </small>
                        )}
                      </td>
                      <td>
                        {gearbox.selectedCapacity?.toFixed(4) ||
                         (typeof gearbox.power === 'object'
                          ? gearbox.power.standard
                          : gearbox.power || '-')}
                        {gearbox.capacityMargin && (
                          <small className="d-block text-muted">
                            余量: {gearbox.capacityMargin.toFixed(1)}%
                          </small>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => onSelectGearbox(index)}
                          className="me-1"
                        >
                          选择
                        </Button>
                        {getManualInfo(gearbox.model) && (
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => window.open(getManualInfo(gearbox.model).path, '_blank', 'noopener,noreferrer')}
                            title={getManualInfo(gearbox.model).title}
                          >
                            <i className="bi bi-file-earmark-pdf"></i>
                          </Button>
                        )}
                      </td>
                    </tr>
                    );
                  };

                  const totalShown = highScore.length + (showLowScore ? lowScore.length : 0);
                  return (
                    <>
                      <h5 style={{ color: colors?.headerText || '#333' }}>
                        其他推荐齿轮箱 ({Math.min(others.length, 10)}/{others.length}
                        {structuralFilter.length > 0 && ` · 已过滤 ${allOthers.length - others.length}`})
                      </h5>
                      {hasGwCandidates && (
                        <Card className="mb-2" style={{ backgroundColor: colors?.card || '#fafafa', borderColor: colors?.border || '#e0e0e0' }}>
                          <Card.Body className="py-2 px-3">
                            <StructuralFormFilter
                              value={structuralFilter}
                              onChange={setStructuralFilter}
                              counts={subSeriesCounts}
                              compact={false}
                              title="GW 子系列结构形式过滤"
                            />
                          </Card.Body>
                        </Card>
                      )}
                      {others.length === 0 && structuralFilter.length > 0 && (
                        <Alert variant="info" className="py-2">
                          <i className="bi bi-info-circle me-2"></i>
                          当前结构形式筛选下无候选齿轮箱
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 ms-2"
                            onClick={() => setStructuralFilter([])}
                          >
                            清除筛选
                          </Button>
                        </Alert>
                      )}
                      {others.length > 0 && (
                        <div className="table-responsive">
                          <Table striped bordered hover size="sm" style={{ backgroundColor: colors?.card || 'white', color: colors?.text || '#333', borderColor: colors?.border || '#ddd' }}>
                            <thead>
                              <tr>
                                <th>型号</th>
                                <th>评分</th>
                                <th>系列</th>
                                <th>减速比</th>
                                <th>传递能力</th>
                                <th>操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              {highScore.map(renderRow)}
                              {showLowScore && lowScore.map(renderRow)}
                            </tbody>
                          </Table>
                          {lowScore.length > 0 && (
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="mb-2"
                              onClick={() => setShowLowScore(!showLowScore)}
                            >
                              <i className={`bi bi-chevron-${showLowScore ? 'up' : 'down'} me-1`}></i>
                              {showLowScore ? '收起低匹配度候选' : `展开 ${lowScore.length} 个低匹配度候选 (评分<60)`}
                            </Button>
                          )}
                          {others.length > 10 && (
                            <small className="text-muted d-block">显示前 {totalShown} 个推荐, 共 {others.length} 个可选型号</small>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
              </Col>
            </Row>
          </Tab>
          
          {/* 联轴器信息标签页 */}
          <Tab eventKey="coupling" title="高弹联轴器">
            {/* Copilot 官方推荐 (映射 86 条 + 扭矩公式兜底) */}
            {copilotAux.coupling?.coupling && (
              <Alert variant="light" className="mb-2" style={{ borderLeft: '4px solid #28a745' }}>
                <div className="d-flex justify-content-between align-items-start flex-wrap">
                  <div>
                    <i className="bi bi-stars text-success me-2"></i>
                    <strong>Copilot 官方推荐:</strong> {copilotAux.coupling.coupling.model}
                    {copilotAux.coupling.coupling.torque != null && (
                      <span className="text-muted ms-2">扭矩 {copilotAux.coupling.coupling.torque} kN·m</span>
                    )}
                    {copilotAux.coupling.coupling.maxSpeed != null && (
                      <span className="text-muted ms-2">最高转速 {copilotAux.coupling.coupling.maxSpeed} rpm</span>
                    )}
                    {copilotAux.coupling.coupling.weight != null && (
                      <span className="text-muted ms-2">重量 {copilotAux.coupling.coupling.weight} kg</span>
                    )}
                    {copilotAux.coupling.coupling.price != null && (
                      <span className="text-muted ms-2">参考价 {formatPrice(copilotAux.coupling.coupling.price)}</span>
                    )}
                  </div>
                  <Badge bg={copilotAux.coupling.source === 'official' ? 'success' : 'warning'} style={{ fontSize: '0.78em' }}>
                    {copilotAux.coupling.source === 'official' ? '官方映射 (杭齿手册)'
                      : copilotAux.coupling.source === 'torque-formula' ? '扭矩公式兜底 (T=9.55·P/n·K)'
                      : '兜底'}
                  </Badge>
                </div>
              </Alert>
            )}
            <CouplingInfoSection
              couplingResult={couplingResult}
              options={result.options}
              validation={validationResults.coupling}
              colors={colors}
              onImageClick={handleImageClick}
            />
          </Tab>

          {/* 备用泵标签页 */}
          <Tab eventKey="pump" title="备用泵">
            {/* Copilot 官方推荐 (映射 50 条 + applicableGearbox 反查 + 中心距经验) */}
            {copilotAux.pump?.pump && (
              <Alert variant="light" className="mb-2" style={{ borderLeft: '4px solid #28a745' }}>
                <div className="d-flex justify-content-between align-items-start flex-wrap">
                  <div>
                    <i className="bi bi-stars text-success me-2"></i>
                    <strong>Copilot 官方推荐:</strong> {copilotAux.pump.pump.model}
                    {copilotAux.pump.pump.flow != null && (
                      <span className="text-muted ms-2">流量 {copilotAux.pump.pump.flow} L/min</span>
                    )}
                    {copilotAux.pump.pump.pressure != null && (
                      <span className="text-muted ms-2">压力 {copilotAux.pump.pump.pressure} MPa</span>
                    )}
                    {copilotAux.pump.pump.motorPower != null && (
                      <span className="text-muted ms-2">电机 {copilotAux.pump.pump.motorPower} kW</span>
                    )}
                    {copilotAux.pump.pump.price != null && (
                      <span className="text-muted ms-2">参考价 {formatPrice(copilotAux.pump.pump.price)}</span>
                    )}
                  </div>
                  <Badge
                    bg={
                      copilotAux.pump.source === 'official' ? 'success'
                        : copilotAux.pump.source === 'applicable-gearbox' ? 'info'
                        : 'warning'
                    }
                    style={{ fontSize: '0.78em' }}
                  >
                    {copilotAux.pump.source === 'official' ? '官方映射 (杭齿手册)'
                      : copilotAux.pump.source === 'applicable-gearbox' ? '适配清单反查'
                      : copilotAux.pump.source === 'center-distance' ? '中心距经验'
                      : '兜底'}
                  </Badge>
                </div>
              </Alert>
            )}
            <PumpInfoSection
              pumpResult={pumpResult}
              needsPumpFlag={needsPumpFlag}
              selectedGearbox={selectedGearbox}
              validation={validationResults.pump}
              inputSpeed={result?.engineSpeed}
              ratio={selectedGearbox?.selectedRatio}
              temperature={result?.requirementData?.temperature}
              colors={colors}
            />
          </Tab>

          {/* 推进配置标签页 */}
          <Tab eventKey="propulsion" title="推进配置">
            <PropulsionSection
              propulsionConfig={propulsionConfig}
              selectedGearbox={selectedGearbox}
              colors={colors}
            />
            {/* UI-接入#3 (2026-04-24): PTO/PTI 热功率建模 */}
            {result?.hybridConfig && (result.hybridConfig.modes?.pto || result.hybridConfig.modes?.pti) && (() => {
              const tm = evaluatePTOThermalMargin({
                enginePower: result.enginePower,
                ratedCapacity: selectedGearbox?.selectedCapacity,
                engineSpeed: result.engineSpeed,
                hybridConfig: result.hybridConfig
              });
              const utilVariant = tm.utilizationPct > 100 ? 'danger'
                : tm.utilizationPct > 85 ? 'warning' : 'success';
              return (
                <Alert variant={utilVariant} className="mt-3">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-thermometer-half me-2" style={{ fontSize: '1.2rem' }}></i>
                    <strong>PTO/PTI 热功率评估</strong>
                    <Badge bg={utilVariant} className="ms-2">热利用率 {tm.utilizationPct}%</Badge>
                    {!tm.safe && <Badge bg="danger" className="ms-1">过热风险</Badge>}
                  </div>
                  <div className="small mb-1">
                    {tm.notes}
                  </div>
                  <div className="small">
                    负载: <strong>{tm.thermalLoadKW} kW</strong> / 散热上限: <strong>{tm.thermalLimitKW} kW</strong>
                  </div>
                  {tm.warnings.length > 0 && (
                    <ul className="mb-0 mt-2 ps-3" style={{ fontSize: '0.82rem' }}>
                      {tm.warnings.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  )}
                </Alert>
              );
            })()}
          </Tab>

          {/* 可视化对比标签页 */}
          <Tab eventKey="charts" title="可视化对比">
            <Suspense fallback={<div className="text-center p-4"><Spinner animation="border" size="sm" /> 加载图表...</div>}>
              <SelectionComparisonCharts
                recommendations={recommendations}
                theme={theme}
                colors={colors}
                targetRatio={result.targetRatio}
              />
              <SelectionFunnelChart result={result} />
            </Suspense>
          </Tab>

          {/* 产品图库标签页 (替代3D预览) */}
          <Tab eventKey="preview3d" title="产品图库">
            <div className="p-3">
              <h6 className="mb-3"><i className="bi bi-images me-2"></i>{selectedGearbox.model} 产品图片</h6>
              <Row>
                <Col md={6} className="mb-3">
                  <Card>
                    <Card.Header className="py-1 small">产品实拍</Card.Header>
                    <Card.Body className="text-center p-2">
                      <ProductThumbnail model={selectedGearbox.model} type="gearbox" size={280} onClick={handleImageClick} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className="mb-3">
                  <Card>
                    <Card.Header className="py-1 small">外形尺寸图</Card.Header>
                    <Card.Body className="text-center p-2">
                      <ProductThumbnail model={selectedGearbox.model} type="gearbox" size={280} useTechnical onClick={handleImageClick} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <div className="text-muted small mt-2">
                <i className="bi bi-info-circle me-1"></i>点击图片可放大查看。图片来源: 杭齿前进官方产品资料
              </div>
            </div>
          </Tab>

          {/* 3D预览标签页 */}
          <Tab eventKey="3d" title={<><i className="bi bi-box me-1"></i>3D预览</>}>
            <Suspense fallback={<div className="text-center py-4">加载3D预览...</div>}>
              <Gearbox3DPreview gearbox={selectedGearbox} />
            </Suspense>
          </Tab>

          {/* 组合选型标签页 */}
          <Tab eventKey="combined" title="组合选型">
            {/* S2: 配套包推荐 (跨系列扩展到 HC/HCT/HCD) */}
            {(() => {
              if (!selectedGearbox?.model) return null;
              const pkg = resolvePackage(selectedGearbox.model);
              if (!pkg) return null;
              const handleGeneratePackage = () => {
                try {
                  const ok = savePackageQuotation(pkg, {});
                  if (ok) toast.success('配套包已保存到报价管理');
                  else toast.error('保存配套包失败');
                } catch (e) {
                  toast.error(`保存配套包失败: ${e.message || e}`);
                }
              };
              return (
                <Alert variant="primary" className="mb-3 d-flex align-items-start justify-content-between">
                  <div style={{ flex: 1 }}>
                    <div className="d-flex align-items-center mb-1">
                      <i className="bi bi-box-seam me-2"></i>
                      <strong>配套包推荐</strong>
                      <Badge bg="info" className="ms-2">来源: {pkg.source}</Badge>
                      {pkg.hasInquiry && <Badge bg="warning" text="dark" className="ms-1">含询价项</Badge>}
                    </div>
                    <small className="text-muted">
                      齿轮箱 <strong>{pkg.gearbox?.model || '—'}</strong>
                      {' + '} 高弹 <strong>{pkg.coupling?.model || '—'}</strong>
                      {' + '} 备用泵 <strong>{pkg.pump?.model || '—'}</strong>
                      <br/>
                      包装价: {pkg.packagePrice != null
                        ? <strong className="text-danger">{formatPrice(pkg.packagePrice)}</strong>
                        : <span>组件价之和 {formatPrice(pkg.totalCalculated)} (含询价)</span>
                      }
                      <span className="ms-2 text-muted">{pkg.priceVersionTag}</span>
                    </small>
                  </div>
                  <Button size="sm" variant="primary" onClick={handleGeneratePackage}>
                    <i className="bi bi-save me-1"></i>一键生成配套包报价
                  </Button>
                </Alert>
              );
            })()}
            <Row>
              <Col md={6}>
                <h6 style={{ color: colors?.headerText }}>齿轮箱</h6>
                <ListGroup>
                  <ListGroup.Item style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{selectedGearbox.model}</strong>
                        <DataCompletenessBadge gearbox={selectedGearbox} className="ms-2" size="sm" />
                        <div>
                          <small>减速比: {selectedGearbox.selectedRatio?.toFixed(2) || selectedGearbox.ratio?.toFixed(2)}</small>
                          <small className="ms-3">能力余量: {selectedGearbox.capacityMargin?.toFixed(1)}%</small>
                        </div>
                      </div>
                      <Badge bg="success">已选择</Badge>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
                
                <h6 className="mt-4" style={{ color: colors?.headerText }}>高弹联轴器</h6>
                {couplingResult && couplingResult.success ? (
                  <>
                  <EquipmentInfoCard type="coupling" data={couplingResult} />
                  {/* Downgrade suggestion when margin > 50% */}
                  {couplingResult.torqueMargin > 50 && couplingResult.recommendations?.length > 1 && (() => {
                    const better = couplingResult.recommendations.find(
                      c => c.model !== couplingResult.model && c.torqueMargin >= 15 && c.torqueMargin <= 35
                    );
                    return better ? (
                      <Alert variant="info" className="mt-2 mb-0 py-2">
                        <i className="bi bi-lightbulb me-1"></i>
                        当前余量 {couplingResult.torqueMargin.toFixed(1)}% 偏高，建议选用 <strong>{better.model}</strong> (余量 {better.torqueMargin.toFixed(1)}%)，更经济适配
                      </Alert>
                    ) : null;
                  })()}
                  </>
                ) : (
                  <Alert variant="warning">未找到合适的联轴器</Alert>
                )}
                
                <h6 className="mt-4" style={{ color: colors?.headerText }}>备用泵</h6>
                {!needsPumpFlag ? (
                  <Alert variant="info">
                    <i className="bi bi-info-circle me-2"></i>
                    当前选择的齿轮箱型号不需要配备备用泵
                  </Alert>
                ) : pumpResult && pumpResult.success ? (
                  <EquipmentInfoCard type="pump" data={pumpResult} />
                ) : (
                  <Alert variant="warning">未找到合适的备用泵，但该齿轮箱型号需要配备备用泵</Alert>
                )}
              </Col>
              
              <Col md={6}>
                <Card style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
                  <Card.Header style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
                    总价格摘要
                  </Card.Header>
                  <Card.Body>
                    <Table bordered style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
                      <tbody>
                        <tr>
                          <td width="40%">齿轮箱价格</td>
                          <td>{formatPrice(selectedGearbox.marketPrice)}</td>
                        </tr>
                        <tr>
                          <td>联轴器价格</td>
                          <td>{formatPrice(couplingResult?.marketPrice)}</td>
                        </tr>
                        {needsPumpFlag && (
                          <tr>
                            <td>备用泵价格</td>
                            <td>{formatPrice(pumpResult?.marketPrice)}</td>
                          </tr>
                        )}
                        <tr className="table-info">
                          <td><strong>总价格</strong></td>
                          <td><strong>{formatPrice((selectedGearbox.marketPrice || 0) +
                                      (couplingResult?.marketPrice || 0) +
                                      (needsPumpFlag ? (pumpResult?.marketPrice || 0) : 0))}</strong></td>
                        </tr>
                      </tbody>
                    </Table>
                    
                    <div className="mt-3">
                      <h6 style={{ color: colors?.headerText }}>价格组成比例</h6>
                      <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={[
                                { name: '齿轮箱', value: selectedGearbox.marketPrice || 0, fill: '#8884d8' },
                                { name: '联轴器', value: couplingResult?.marketPrice || 0, fill: '#82ca9d' },
                                { name: '备用泵', value: needsPumpFlag ? (pumpResult?.marketPrice || 0) : 0, fill: '#ffc658' }
                              ]}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                            </Pie>
                            <Tooltip formatter={(value) => formatPrice(value)} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          {/* B4: IMO 合规评估 (EEXI / EEDI / CII) — 选型完成后可对船型/DWT/Vref 做合规评估 */}
          <Tab eventKey="imo" title={<><i className="bi bi-globe me-1"></i>IMO 合规</>}>
            {activeTab === 'imo' && (
              <Suspense fallback={<div className="text-center p-4"><Spinner animation="border" size="sm" className="me-2" />加载 IMO 合规模块...</div>}>
                <IMOCompliancePanel
                  selectionResult={{
                    engineId: result?.engineId,
                    enginePower: selectedGearbox?.enginePower || result?.enginePower
                  }}
                  colors={colors}
                />
              </Suspense>
            )}
          </Tab>
        </Tabs>
          
        {result.warning && (
          <Alert variant="warning" className="mt-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {result.warning}
          </Alert>
        )}

        {/* Constraint relaxation suggestions for failed/partial selections */}
        <RelaxationSuggestions suggestions={result.relaxationSuggestions} />

        {result.priceInfo && (
          <Alert variant="info" className="mt-2">
            <i className="bi bi-info-circle me-2"></i>
            {result.priceInfo}
          </Alert>
        )}

        {/* 说明书快速链接汇总 */}
        {(() => {
          const manualsAvailable = recommendations
            .slice(0, 5)
            .map(g => ({ model: g.model, manual: getManualInfo(g.model) }))
            .filter(item => item.manual);

          if (manualsAvailable.length > 0) {
            return (
              <Card className="mt-3" style={{ backgroundColor: colors?.headerBg, borderColor: colors?.border }}>
                <Card.Body className="py-2">
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <span style={{ color: colors?.headerText, fontWeight: 500 }}>
                      <i className="bi bi-book me-2"></i>
                      说明书快速链接:
                    </span>
                    {manualsAvailable.map(({ model, manual }) => (
                      <Button
                        key={model}
                        variant={model === selectedGearbox.model ? "info" : "outline-info"}
                        size="sm"
                        onClick={() => window.open(manual.path, '_blank', 'noopener,noreferrer')}
                        title={manual.title}
                      >
                        <i className="bi bi-file-earmark-pdf me-1"></i>
                        {model}
                      </Button>
                    ))}
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => window.location.hash = '#manuals'}
                      title="查看全部说明书"
                    >
                      更多...
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            );
          }
          return null;
        })()}

        {/* Quick navigation to related modules */}
        <Card className="mt-3 mb-3" style={{ backgroundColor: '#f8f9fa' }}>
          <Card.Body className="py-2">
            <small className="text-muted d-block mb-2">快捷导航到相关分析模块:</small>
            <div className="d-flex flex-wrap gap-2">
              <Button variant="outline-info" size="sm" onClick={() => { window.location.hash = '#energy'; }}>
                <i className="bi bi-lightning-charge me-1"></i>能效分析
              </Button>
              <Button variant="outline-info" size="sm" onClick={() => { window.location.hash = '#torsional'; }}>
                <i className="bi bi-activity me-1"></i>扭振分析
              </Button>
              <Button variant="outline-info" size="sm" onClick={() => { window.location.hash = '#coupling-selection'; }}>
                <i className="bi bi-link-45deg me-1"></i>联轴器选型
              </Button>
              <Button variant="outline-info" size="sm" onClick={() => { window.location.hash = '#pump-selection'; }}>
                <i className="bi bi-droplet me-1"></i>备用泵选型
              </Button>
            </div>
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-end mt-4 flex-wrap gap-2">
          <Button
            variant="outline-danger"
            onClick={async () => {
              try {
                const { generateSelectionReportPDF } = await loadReportGenerator();
                await generateSelectionReportPDF(
                  result,
                  result?.engineData || {},
                  result?.requirementData || {},
                  result?.projectInfo || {},
                  { coupling: result?.flexibleCoupling, pump: result?.standbyPump }
                );
                toast.success('选型报告PDF已生成');
              } catch (e) {
                console.error('PDF report generation failed:', e);
                toast.error('PDF生成失败: ' + e.message);
              }
            }}
          >
            <i className="bi bi-file-earmark-pdf me-1"></i> 导出选型报告
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => exportSelectionSummary(selectedGearbox, result)}
          >
            <i className="bi bi-printer me-1"></i> 导出摘要
          </Button>
          {onGenerateFullPackage && (
            <Button
              variant="primary"
              onClick={onGenerateFullPackage}
              title="一键生成报价单 + 技术协议,并自动跳转合同 Tab"
            >
              <i className="bi bi-stack me-1"></i> 一键生成完整文件包
            </Button>
          )}
          <Button
            variant="outline-primary"
            onClick={onGenerateQuotation}
          >
            <i className="bi bi-currency-yen me-1"></i> 生成报价单
          </Button>
          <Button
            variant="outline-success"
            onClick={onGenerateAgreement}
          >
            <i className="bi bi-file-earmark-text me-1"></i> 生成技术协议
          </Button>
        </div>
      </>
    );
  };

  // 渲染主界面
  return (
    <Card className="shadow-sm" style={{ backgroundColor: colors?.card || 'white', borderColor: colors?.border || '#ddd' }} role="region" aria-live="polite" aria-label="选型结果">
      <Card.Header style={{ backgroundColor: colors?.headerBg || '#f5f5f5', color: colors?.headerText || '#333' }}>
        <div className="d-flex justify-content-between align-items-center">
          <span><i className="bi bi-gear-fill me-2"></i>选型结果 - {selectedGearbox.model}</span>
          <div>
            <Button 
              variant={comparisonMode ? "success" : "outline-primary"} 
              size="sm" 
              className="me-2"
              onClick={() => setComparisonMode(!comparisonMode)}
            >
              <i className={`bi bi-${comparisonMode ? 'check-circle' : 'bar-chart'} me-1`}></i>
              {comparisonMode ? '退出对比' : '对比模式'}
            </Button>
            {isPartialMatch ? (
              <Badge bg="warning" style={{ fontSize: '0.75rem' }}>
                <i className="bi bi-exclamation-triangle-fill me-1"></i>近似匹配
              </Badge>
            ) : result.success !== false ? null : (
              <Badge bg="info" style={{ fontSize: '0.75rem' }}>
                <i className="bi bi-search me-1"></i>近似结果
              </Badge>
            )}
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {/* 近似匹配横幅 — 选型未完全成功时显示 */}
        <NearMatchBanner result={result} recommendations={recommendations} />
        {/* Phase 3 规则溯源 — Copilot 9 硬约束触发标签 + 自动推断 + 评分模式 */}
        <CopilotRulesChips diagnostics={result?._diagnostics} />
        {/* 添加备用泵需求提示 */}
        <Alert variant={needsPumpFlag ? "primary" : "info"} className="mb-3">
          <i className="bi bi-info-circle me-2"></i>
          <strong>备用泵需求：</strong>
          {needsPumpFlag ?
            "该齿轮箱型号需要配备备用泵" :
            "该齿轮箱型号不需要配备备用泵"}
        </Alert>
        
        {/* 根据模式渲染不同内容 */}
        {comparisonMode ? renderComparisonContent() : renderTabsContent()}
      </Card.Body>

      {/* 产品图片弹窗 */}
      <ProductImageModal
        isOpen={imageModalOpen}
        onClose={handleCloseImageModal}
        model={imageModalData.model}
        type={imageModalData.type}
      />
    </Card>
  );
};

export default EnhancedGearboxSelectionResult;