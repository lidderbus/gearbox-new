// src/components/EnhancedGearboxSelectionResult.js
import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { toast } from '../utils/toast';
import { Card, Row, Col, Table, Badge, Button, Tabs, Tab, Alert, Form, ListGroup } from 'react-bootstrap';
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
import { formatPrice } from '../utils/priceFormatter';
import MarginIndicator from './selection/MarginIndicator';
import RecommendationReasonCard from './selection/RecommendationReasonCard';
import CapacityCalculationCard from './selection/CapacityCalculationCard';
import { exportSelectionSummary } from '../utils/selectionSummaryExport';
import { calculatePowerRange, extractSeriesFromModel } from '../utils/gearboxDataEnhancer';

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

// 懒加载3D预览组件
const Gearbox3DPreview = lazy(() => import('./Gearbox3DPreview'));

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
  colors,
  theme = 'light',
  propulsionConfig = null
}) => {
  // 状态管理 - 所有Hooks必须在组件顶层无条件调用
  const [activeTab, setActiveTab] = useState('details');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparedGearboxes, setComparedGearboxes] = useState([]);
  const [showLowScore, setShowLowScore] = useState(false);
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
      <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors?.card || 'white', borderColor: colors?.border || '#ddd' }}>
        <Card.Header style={{ backgroundColor: colors?.headerBg || '#f5f5f5', color: colors?.headerText || '#333' }}>
          <i className="bi bi-gear-fill me-2"></i>选型结果
        </Card.Header>
        <Card.Body>
          <div className="text-center py-4">
            <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '2rem' }}></i>
            <p className="mt-3">没有找到符合条件的齿轮箱。请调整选型参数后重试。</p>
            {result && result.message && (
              <Alert variant="warning" className="mt-3">
                <i className="bi bi-info-circle-fill me-2"></i>
                {result.message}
              </Alert>
            )}
          </div>
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
        '价格(元)': gearbox.marketPrice || 0,
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

        <div className="d-flex justify-content-end mt-4">
          <Button
            variant="outline-primary"
            onClick={onGenerateQuotation}
            className="me-2"
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
        <Tabs 
          activeKey={activeTab} 
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
          style={{ borderBottomColor: colors?.border || '#ddd' }}
        >
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
                    </h5>
                    <div className="d-flex align-items-center gap-2">
                      <small style={{ color: '#666' }}>点击图片查看大图和技术图纸</small>
                      {getManualInfo(selectedGearbox.model) && (
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => window.open(getManualInfo(selectedGearbox.model).path, '_blank')}
                          title={getManualInfo(selectedGearbox.model).title}
                        >
                          <i className="bi bi-file-earmark-pdf me-1"></i>
                          查看说明书
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                {/* 系列特性徽章 - 杭齿选型手册2025版 */}
                <SeriesCharacteristicsBadge
                  seriesType={selectedGearbox.model}
                  style={{ marginBottom: '12px' }}
                />
                <RecommendationReasonCard
                  selectedGearbox={selectedGearbox}
                  allRecommendations={recommendations}
                  targetRatio={result.targetRatio}
                />
                <CapacityCalculationCard
                  power={result.enginePower}
                  speed={result.engineSpeed}
                  gearboxCapacity={selectedGearbox.selectedCapacity}
                  workCondition={result.workCondition}
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
                    <tr>
                      <td>重量</td>
                      <td>{selectedGearbox.weight || '-'} kg</td>
                    </tr>
                    <tr>
                      <td>价格</td>
                      <td>{formatPrice(selectedGearbox.marketPrice)}</td>
                    </tr>
                    {isPartialMatch && selectedGearbox.failureReason && (
                      <tr className="table-warning">
                        <td>匹配度不足原因</td>
                        <td>{selectedGearbox.failureReason}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                {/* 数据验证警告 */}
                <ValidationWarnings validation={validationResults.gearbox} type="gearbox" />
              </Col>
              <Col md={6}>
                {(() => {
                  const others = recommendations
                    .map((gearbox, index) => ({ gearbox, index }))
                    .filter(({ index }) => index !== selectedIndex);
                  const highScore = others.filter(({ gearbox }) => (gearbox.score || 0) >= 60).slice(0, 10);
                  const lowScore = others.filter(({ gearbox }) => (gearbox.score || 0) < 60).slice(0, 10);

                  const renderRow = ({ gearbox, index }) => (
                    <tr key={gearbox.model + index} className={gearbox.isPartialMatch ? 'table-warning' : ''}>
                      <td>
                        {gearbox.model}
                        {gearbox.isPartialMatch && <Badge bg="warning" className="ms-1">部分</Badge>}
                        <DataCompletenessBadge gearbox={gearbox} className="ms-1" size="sm" />
                      </td>
                      <td>{gearbox.series || extractSeriesFromModel(gearbox.model)}</td>
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
                            onClick={() => window.open(getManualInfo(gearbox.model).path, '_blank')}
                            title={getManualInfo(gearbox.model).title}
                          >
                            <i className="bi bi-file-earmark-pdf"></i>
                          </Button>
                        )}
                      </td>
                    </tr>
                  );

                  return (
                    <>
                      <h5 style={{ color: colors?.headerText || '#333' }}>其他推荐齿轮箱 ({Math.min(recommendations.length - 1, 10)}/{recommendations.length - 1})</h5>
                      <div className="table-responsive">
                        <Table striped bordered hover size="sm" style={{ backgroundColor: colors?.card || 'white', color: colors?.text || '#333', borderColor: colors?.border || '#ddd' }}>
                          <thead>
                            <tr>
                              <th>型号</th>
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
                        {recommendations.length - 1 > 10 && (
                          <small className="text-muted d-block">显示前10个推荐，共{recommendations.length - 1}个可选型号</small>
                        )}
                      </div>
                    </>
                  );
                })()}
              </Col>
            </Row>
          </Tab>
          
          {/* 联轴器信息标签页 */}
          <Tab eventKey="coupling" title="高弹联轴器">
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
            <PumpInfoSection
              pumpResult={pumpResult}
              needsPumpFlag={needsPumpFlag}
              selectedGearbox={selectedGearbox}
              validation={validationResults.pump}
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
          </Tab>

          {/* 3D预览标签页 */}
          <Tab eventKey="preview3d" title="3D预览">
            <Suspense fallback={
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">加载3D模型中...</span>
                </div>
                <p className="mt-3 text-muted">正在加载3D预览组件...</p>
              </div>
            }>
              <Gearbox3DPreview
                gearbox={selectedGearbox}
                colors={colors}
                theme={theme}
              />
            </Suspense>
          </Tab>

          {/* 组合选型标签页 */}
          <Tab eventKey="combined" title="组合选型">
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
                  <ListGroup>
                    <ListGroup.Item style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{couplingResult.model}</strong>
                          <div>
                            <small>扭矩: {couplingResult.torque} {couplingResult.torqueUnit || 'kN·m'}</small>
                            <small className="ms-3">余量: {couplingResult.torqueMargin?.toFixed(1)}%</small>
                          </div>
                        </div>
                        <Badge bg="success">已选择</Badge>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
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
                  <ListGroup>
                    <ListGroup.Item style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{pumpResult.model}</strong>
                          <div>
                            <small>流量: {pumpResult.flow} L/min</small>
                            <small className="ms-3">压力: {pumpResult.pressure} MPa</small>
                          </div>
                        </div>
                        <Badge bg="success">已选择</Badge>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
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
                          <td><strong>{((selectedGearbox.marketPrice || 0) + 
                                      (couplingResult?.marketPrice || 0) + 
                                      (needsPumpFlag ? (pumpResult?.marketPrice || 0) : 0)).toLocaleString()} 元</strong></td>
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
        </Tabs>
          
        {result.warning && (
          <Alert variant="warning" className="mt-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {result.warning}
          </Alert>
        )}

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
                        onClick={() => window.open(manual.path, '_blank')}
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

        <div className="d-flex justify-content-end mt-4">
          <Button
            variant="outline-secondary"
            onClick={() => exportSelectionSummary(selectedGearbox, result)}
            className="me-2"
          >
            <i className="bi bi-printer me-1"></i> 导出摘要
          </Button>
          <Button
            variant="outline-primary"
            onClick={onGenerateQuotation}
            className="me-2"
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
    <Card className="shadow-sm" style={{ backgroundColor: colors?.card || 'white', borderColor: colors?.border || '#ddd' }}>
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
            {isPartialMatch && (
              <Badge bg="warning">部分匹配</Badge>
            )}
          </div>
        </div>
      </Card.Header>
      <Card.Body>
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