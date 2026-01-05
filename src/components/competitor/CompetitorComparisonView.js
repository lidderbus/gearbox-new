/**
 * 竞品对比主视图组件
 * Competitor Comparison Main View
 *
 * 整合选型对比、产品浏览、优势分析三大功能
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Container, Row, Col, Card, Tabs, Tab, Form, Button,
  InputGroup, Alert, Badge
} from 'react-bootstrap';
import CompetitorSelector from './CompetitorSelector';
import ComparisonTable from './ComparisonTable';
import AdvantageReport from './AdvantageReport';
import {
  selectCompetitorProducts,
  findEquivalentCompetitors,
  formatPrice
} from '../../utils/competitorAnalysis';

const CompetitorComparisonView = ({
  colors,
  hangchiData = [],
  onExportPDF
}) => {
  // 状态管理
  const [activeTab, setActiveTab] = useState('selection');
  const [selectedHangchi, setSelectedHangchi] = useState(null);
  const [selectedCompetitors, setSelectedCompetitors] = useState([]);

  // 选型参数
  const [power, setPower] = useState('');
  const [speed, setSpeed] = useState('');
  const [ratio, setRatio] = useState('');

  // 处理杭齿产品选择
  const handleHangchiSelect = useCallback((product) => {
    setSelectedHangchi(product);
    // 自动查找对标竞品
    const equivalents = findEquivalentCompetitors(product.model);
    if (equivalents.length > 0) {
      setSelectedCompetitors(equivalents.slice(0, 3));
    }
  }, []);

  // 根据参数筛选杭齿产品
  const filteredHangchiProducts = useMemo(() => {
    if (!power || !speed || !ratio) return hangchiData.slice(0, 20);

    const powerNum = parseFloat(power);
    const speedNum = parseFloat(speed);
    const ratioNum = parseFloat(ratio);
    const requiredCapacity = powerNum / speedNum;

    return hangchiData
      .filter(g => {
        if (powerNum < g.minPower || powerNum > g.maxPower) return false;
        if (speedNum < g.minSpeed || speedNum > g.maxSpeed) return false;
        const hasRatio = g.ratios?.some(r => Math.abs(r - ratioNum) / ratioNum <= 0.15);
        if (!hasRatio) return false;
        const capacity = g.transmissionCapacityPerRatio?.[0] || g.transferCapacity || 0;
        return capacity >= requiredCapacity * 0.8;
      })
      .slice(0, 20);
  }, [hangchiData, power, speed, ratio]);

  // 获取竞品匹配结果
  const matchedCompetitors = useMemo(() => {
    if (!power || !speed || !ratio) return [];
    return selectCompetitorProducts(
      parseFloat(power),
      parseFloat(speed),
      parseFloat(ratio)
    );
  }, [power, speed, ratio]);

  // 快速选型处理
  const handleQuickMatch = () => {
    if (filteredHangchiProducts.length > 0) {
      handleHangchiSelect(filteredHangchiProducts[0]);
    }
    if (matchedCompetitors.length > 0) {
      setSelectedCompetitors(matchedCompetitors.slice(0, 3));
    }
  };

  // 清空选择
  const handleClear = () => {
    setSelectedHangchi(null);
    setSelectedCompetitors([]);
    setPower('');
    setSpeed('');
    setRatio('');
  };

  // 导出PDF
  const handleExportPDF = useCallback((element) => {
    if (onExportPDF) {
      onExportPDF(element);
    } else {
      window.print();
    }
  }, [onExportPDF]);

  return (
    <Container fluid className="py-3">
      {/* 页面标题 */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1">
                <i className="bi bi-bar-chart-fill me-2" style={{ color: colors?.primary }}></i>
                竞品对比分析
              </h4>
              <p className="text-muted mb-0">
                对比杭齿前进与重齿、南高精、ZF等主要竞争对手的产品
              </p>
            </div>
            <div>
              {(selectedHangchi || selectedCompetitors.length > 0) && (
                <Button variant="outline-secondary" size="sm" onClick={handleClear}>
                  <i className="bi bi-x-circle me-1"></i>清空选择
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* 快速选型参数栏 */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1">功率 (kW)</Form.Label>
                <InputGroup>
                  <InputGroup.Text><i className="bi bi-lightning"></i></InputGroup.Text>
                  <Form.Control
                    type="number"
                    placeholder="如 500"
                    value={power}
                    onChange={e => setPower(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1">转速 (rpm)</Form.Label>
                <InputGroup>
                  <InputGroup.Text><i className="bi bi-speedometer2"></i></InputGroup.Text>
                  <Form.Control
                    type="number"
                    placeholder="如 1500"
                    value={speed}
                    onChange={e => setSpeed(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1">目标速比</Form.Label>
                <InputGroup>
                  <InputGroup.Text><i className="bi bi-gear"></i></InputGroup.Text>
                  <Form.Control
                    type="number"
                    step="0.1"
                    placeholder="如 3.0"
                    value={ratio}
                    onChange={e => setRatio(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Button
                variant="primary"
                className="w-100"
                onClick={handleQuickMatch}
                disabled={!power || !speed || !ratio}
                style={{ backgroundColor: colors?.primary, borderColor: colors?.primary }}
              >
                <i className="bi bi-search me-2"></i>
                快速匹配对比
              </Button>
            </Col>
          </Row>
          {power && speed && ratio && (
            <div className="mt-3 pt-3 border-top">
              <small className="text-muted">
                匹配结果:
                <Badge bg="warning" text="dark" className="mx-2">
                  杭齿 {filteredHangchiProducts.length} 个
                </Badge>
                <Badge bg="secondary" className="me-2">
                  竞品 {matchedCompetitors.length} 个
                </Badge>
                所需传递能力: {(parseFloat(speed) > 0 ? (parseFloat(power) / parseFloat(speed)).toFixed(3) : '-')} kW/(r/min)
              </small>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* 主内容区 - 三个子Tab */}
      <Tabs
        activeKey={activeTab}
        onSelect={setActiveTab}
        className="mb-4"
        fill
      >
        {/* Tab 1: 选型对比 */}
        <Tab
          eventKey="selection"
          title={<span><i className="bi bi-columns-gap me-2"></i>选型对比</span>}
        >
          <Row>
            {/* 左侧: 杭齿产品选择 */}
            <Col lg={4} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Header style={{ backgroundColor: '#fd7e14', color: 'white' }}>
                  <i className="bi bi-star-fill me-2"></i>
                  杭齿产品
                </Card.Header>
                <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {filteredHangchiProducts.length > 0 ? (
                    filteredHangchiProducts.map(product => (
                      <div
                        key={product.model}
                        className={`p-3 mb-2 rounded border ${
                          selectedHangchi?.model === product.model
                            ? 'border-warning bg-warning bg-opacity-10'
                            : 'border-light'
                        }`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleHangchiSelect(product)}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{product.model}</strong>
                            <Badge bg="secondary" className="ms-2">{product.series}</Badge>
                          </div>
                          {selectedHangchi?.model === product.model && (
                            <i className="bi bi-check-circle-fill text-warning"></i>
                          )}
                        </div>
                        <small className="text-muted d-block mt-1">
                          {product.minPower}-{product.maxPower}kW |
                          {formatPrice(product.price)}
                        </small>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted py-4">
                      <i className="bi bi-search fs-1 mb-2 d-block"></i>
                      {power && speed && ratio
                        ? '未找到符合条件的杭齿产品'
                        : '请输入参数或从列表选择产品'}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* 中间: 竞品选择 */}
            <Col lg={4} className="mb-4">
              <CompetitorSelector
                selectedProducts={selectedCompetitors}
                onProductsChange={setSelectedCompetitors}
                maxSelections={3}
                power={power ? parseFloat(power) : null}
                speed={speed ? parseFloat(speed) : null}
                ratio={ratio ? parseFloat(ratio) : null}
                colors={colors}
              />
            </Col>

            {/* 右侧: 对比预览 */}
            <Col lg={4} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Header style={{ background: colors?.primary || '#2c5282', color: 'white' }}>
                  <i className="bi bi-eye me-2"></i>
                  对比预览
                </Card.Header>
                <Card.Body>
                  {selectedHangchi ? (
                    <div>
                      <div className="mb-3 p-3 bg-warning bg-opacity-10 rounded">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-star-fill text-warning me-2 fs-4"></i>
                          <div>
                            <strong>{selectedHangchi.model}</strong>
                            <small className="d-block text-muted">
                              杭齿前进 | {formatPrice(selectedHangchi.price)}
                            </small>
                          </div>
                        </div>
                      </div>

                      <div className="text-center text-muted my-3">
                        <i className="bi bi-arrow-down-up fs-4"></i>
                        <div>VS</div>
                      </div>

                      {selectedCompetitors.length > 0 ? (
                        selectedCompetitors.map(comp => (
                          <div key={comp.model} className="mb-2 p-2 bg-light rounded">
                            <div className="d-flex justify-content-between">
                              <span>
                                <Badge
                                  className="me-2"
                                  style={{
                                    backgroundColor:
                                      comp.manufacturer === 'CZCG' ? '#dc3545' :
                                      comp.manufacturer === 'NGC' ? '#198754' : '#0d6efd'
                                  }}
                                >
                                  {comp.manufacturer}
                                </Badge>
                                {comp.model}
                              </span>
                              <small className="text-muted">
                                {formatPrice(comp.estimatedPrice)}
                              </small>
                            </div>
                          </div>
                        ))
                      ) : (
                        <Alert variant="info" className="small">
                          <i className="bi bi-info-circle me-2"></i>
                          请从左侧选择竞品进行对比
                        </Alert>
                      )}

                      {selectedCompetitors.length > 0 && (
                        <Button
                          variant="primary"
                          className="w-100 mt-3"
                          onClick={() => setActiveTab('comparison')}
                          style={{ backgroundColor: colors?.primary, borderColor: colors?.primary }}
                        >
                          <i className="bi bi-table me-2"></i>
                          查看详细对比
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-muted py-5">
                      <i className="bi bi-cursor fs-1 mb-3 d-block"></i>
                      请从左侧选择杭齿产品
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Tab 2: 对比表格 */}
        <Tab
          eventKey="comparison"
          title={<span><i className="bi bi-table me-2"></i>对比表格</span>}
        >
          <Card className="shadow-sm">
            <Card.Body>
              <ComparisonTable
                hangchiProduct={selectedHangchi}
                competitors={selectedCompetitors}
                colors={colors}
                showAdvantages={true}
              />
            </Card.Body>
          </Card>
        </Tab>

        {/* Tab 3: 优势报告 */}
        <Tab
          eventKey="report"
          title={<span><i className="bi bi-file-earmark-text me-2"></i>优势报告</span>}
        >
          <AdvantageReport
            hangchiProduct={selectedHangchi}
            competitors={selectedCompetitors}
            colors={colors}
            onExportPDF={handleExportPDF}
          />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default CompetitorComparisonView;
