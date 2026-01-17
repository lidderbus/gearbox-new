// src/pages/CouplingSelection/CouplingSelectionPage.js
// 联轴器选型系统主页面

import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { Container, Row, Col, Alert, Button, Card, Badge, Spinner, Nav } from 'react-bootstrap';
import CouplingSelectionForm from './CouplingSelectionForm';
import CouplingRecommendationList from './CouplingRecommendationList';
import CouplingTechnicalParams from './CouplingTechnicalParams';
import ClassificationComparisonPanel from './ClassificationComparisonPanel';
import { selectCouplingStandalone, getAllCouplings } from '../../services/couplingSelectionService';
import { ClassificationType } from '../../utils/classificationCertificates';

// 懒加载可视化组件（较大的依赖）
const CouplingCharts = lazy(() => import('./CouplingCharts'));
const Coupling3DPreview = lazy(() => import('./Coupling3DPreview'));

// 懒加载占位符
const ChartLoadingFallback = () => (
  <Card className="h-100 shadow-sm">
    <Card.Body className="d-flex align-items-center justify-content-center" style={{ minHeight: 300 }}>
      <div className="text-center">
        <Spinner animation="border" variant="primary" size="sm" />
        <div className="mt-2 small text-muted">加载可视化组件...</div>
      </div>
    </Card.Body>
  </Card>
);

/**
 * 联轴器选型系统主页面
 */
const CouplingSelectionPage = ({
  initialParams = {},
  onCouplingSelected,
  embedded = false,
  colors = {}
}) => {
  // 状态管理
  const [selectionResult, setSelectionResult] = useState(null);
  const [selectedCoupling, setSelectedCoupling] = useState(null);
  const [selectionParams, setSelectionParams] = useState(null); // 保存选型参数
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'charts' | '3d'

  // 获取常用齿轮箱型号列表
  const commonGearboxModels = [
    'HCM200', 'HCM300', 'HCM400', 'HCM500', 'HCM600',
    'HC200', 'HC300', 'HC400', 'HC500', 'HC600', 'HC700', 'HC800',
    'HCD600', 'HCD800', 'HCD1000', 'HCD1400', 'HCD2000',
    'HCT400', 'HCT400A', 'HCT600', 'HCT800'
  ];

  // 处理选型提交
  const handleSelectionSubmit = useCallback(async (params) => {
    setIsLoading(true);
    setError(null);
    setSelectionParams(params); // 保存选型参数

    try {
      // 执行选型
      const result = selectCouplingStandalone(params);

      if (result.success) {
        setSelectionResult(result);
        // 默认选择第一个推荐
        if (result.recommendations && result.recommendations.length > 0) {
          setSelectedCoupling(result.recommendations[0]);
        }
      } else {
        setError(result.message || '选型失败，请调整参数重试');
        setSelectionResult(null);
        setSelectedCoupling(null);
      }
    } catch (err) {
      console.error('Selection error:', err);
      setError('选型过程出错: ' + err.message);
      setSelectionResult(null);
      setSelectedCoupling(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 处理联轴器选择
  const handleCouplingSelect = useCallback((coupling) => {
    setSelectedCoupling(coupling);
    if (onCouplingSelected) {
      onCouplingSelected(coupling);
    }
  }, [onCouplingSelected]);

  // 重置选型
  const handleReset = useCallback(() => {
    setSelectionResult(null);
    setSelectedCoupling(null);
    setSelectionParams(null);
    setError(null);
  }, []);

  // 如果有初始参数，自动执行选型
  useEffect(() => {
    if (initialParams && initialParams.power && initialParams.speed) {
      handleSelectionSubmit(initialParams);
    }
  }, []);

  // 联轴器数据统计
  const couplingStats = React.useMemo(() => {
    const couplings = getAllCouplings();
    return {
      total: couplings.length,
      series: [...new Set(couplings.map(c => c.model.substring(0, 4)))].length
    };
  }, []);

  return (
    <div className={embedded ? '' : 'min-vh-100 py-4'} style={{ backgroundColor: embedded ? 'transparent' : '#f0f4f8' }}>
      <Container fluid={embedded} className={embedded ? 'p-0' : ''}>
        {/* 页面标题 */}
        {!embedded && (
          <div className="text-center mb-4">
            <h2 className="mb-2">
              <i className="bi bi-gear-wide-connected me-2"></i>
              高弹性联轴器智能选型系统
            </h2>
            <p className="text-muted">
              智能匹配 • 精准计算 • 多维评分
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Badge bg="primary" className="px-3 py-2">
                <i className="bi bi-database me-1"></i>
                {couplingStats.total} 个型号
              </Badge>
              <Badge bg="success" className="px-3 py-2">
                <i className="bi bi-collection me-1"></i>
                {couplingStats.series} 个系列
              </Badge>
            </div>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        <Row>
          {/* 左侧：输入表单 */}
          <Col lg={selectionResult ? 4 : 12}>
            <CouplingSelectionForm
              onSubmit={handleSelectionSubmit}
              initialValues={initialParams}
              gearboxOptions={commonGearboxModels}
              isLoading={isLoading}
              colors={colors}
            />

            {/* 使用说明（仅在未选型时显示） */}
            {!selectionResult && !embedded && (
              <Card className="shadow-sm mb-4">
                <Card.Header>
                  <i className="bi bi-info-circle me-2"></i>
                  使用说明
                </Card.Header>
                <Card.Body>
                  <ol className="mb-0 ps-3">
                    <li className="mb-2">
                      <strong>输入发动机参数</strong>：填写功率(kW)和转速(rpm)
                    </li>
                    <li className="mb-2">
                      <strong>选择工况条件</strong>：根据实际使用场景选择K系数
                    </li>
                    <li className="mb-2">
                      <strong>可选齿轮箱型号</strong>：输入齿轮箱型号获得更精准匹配
                    </li>
                    <li className="mb-2">
                      <strong>查看推荐结果</strong>：系统将推荐多个联轴器并给出评分
                    </li>
                    <li>
                      <strong>选择最终型号</strong>：根据评分和技术参数选择合适的联轴器
                    </li>
                  </ol>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* 右侧：选型结果 */}
          {selectionResult && (
            <Col lg={8}>
              {/* 视图切换导航 */}
              <Card className="shadow-sm mb-3">
                <Card.Body className="py-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <Nav variant="pills" activeKey={viewMode} onSelect={setViewMode}>
                      <Nav.Item>
                        <Nav.Link eventKey="list" className="py-1 px-3">
                          <i className="bi bi-list-ul me-1"></i>
                          推荐列表
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="charts" className="py-1 px-3">
                          <i className="bi bi-bar-chart-line me-1"></i>
                          数据图表
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="3d" className="py-1 px-3">
                          <i className="bi bi-box me-1"></i>
                          3D预览
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Badge bg="success" className="px-2">
                      {selectionResult.recommendations?.length || 0} 个推荐
                    </Badge>
                  </div>
                </Card.Body>
              </Card>

              {/* 列表视图 */}
              {viewMode === 'list' && (
                <Row>
                  {/* 推荐列表 */}
                  <Col md={7}>
                    <CouplingRecommendationList
                      result={selectionResult}
                      selectedCoupling={selectedCoupling}
                      onSelectCoupling={handleCouplingSelect}
                      colors={colors}
                    />

                    {/* 多船级社对比面板（当有船检要求时显示） */}
                    {selectionParams && selectedCoupling && (
                      <ClassificationComparisonPanel
                        selectionResult={selectionResult}
                        selectedCoupling={selectedCoupling}
                        power={selectionParams.power}
                        speed={selectionParams.speed}
                        workCondition={selectionParams.workCondition}
                        currentClassification={selectionParams.classificationType || ClassificationType.NONE}
                      />
                    )}
                  </Col>

                  {/* 技术参数详情 */}
                  <Col md={5}>
                    {selectedCoupling && (
                      <CouplingTechnicalParams
                        coupling={selectedCoupling}
                        calculationDetails={selectionResult.calculationDetails}
                        colors={colors}
                      />
                    )}
                  </Col>
                </Row>
              )}

              {/* 图表视图 */}
              {viewMode === 'charts' && (
                <Suspense fallback={<ChartLoadingFallback />}>
                  <CouplingCharts
                    recommendations={selectionResult.recommendations || []}
                    selectedCoupling={selectedCoupling}
                    calculationDetails={selectionResult.calculationDetails}
                    onSelectCoupling={handleCouplingSelect}
                    colors={colors}
                  />
                </Suspense>
              )}

              {/* 3D预览视图 */}
              {viewMode === '3d' && (
                <Row>
                  <Col md={7}>
                    <Suspense fallback={<ChartLoadingFallback />}>
                      <Coupling3DPreview
                        coupling={selectedCoupling}
                        colors={colors}
                      />
                    </Suspense>
                  </Col>
                  <Col md={5}>
                    {selectedCoupling && (
                      <CouplingTechnicalParams
                        coupling={selectedCoupling}
                        calculationDetails={selectionResult.calculationDetails}
                        colors={colors}
                      />
                    )}
                  </Col>
                </Row>
              )}

              {/* 操作按钮 */}
              <div className="d-flex justify-content-between mt-3">
                <Button variant="outline-secondary" onClick={handleReset}>
                  <i className="bi bi-arrow-counterclockwise me-1"></i>
                  重新选型
                </Button>
                {selectedCoupling && onCouplingSelected && (
                  <Button
                    variant="success"
                    onClick={() => onCouplingSelected(selectedCoupling)}
                  >
                    <i className="bi bi-check2-circle me-1"></i>
                    确认选择: {selectedCoupling.model}
                  </Button>
                )}
              </div>
            </Col>
          )}
        </Row>

        {/* 页脚信息 */}
        {!embedded && (
          <div className="text-center mt-4 text-muted">
            <small>
              高弹性联轴器智能选型系统 V1.0 |
              数据来源: flexibleCouplings |
              算法: enhancedCouplingSelection
            </small>
          </div>
        )}
      </Container>
    </div>
  );
};

export default CouplingSelectionPage;
