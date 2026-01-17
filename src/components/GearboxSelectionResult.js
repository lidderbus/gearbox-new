// src/components/GearboxSelectionResult.js 修改版
import React, { useState } from 'react';
import { Card, Row, Col, Table, Badge, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import GearboxVisualization from './GearboxVisualization'; // 导入可视化组件

const GearboxSelectionResult = ({ 
  result, 
  selectedIndex = 0, 
  onSelectGearbox, 
  onGenerateQuotation, 
  onGenerateAgreement,
  colors,
  theme = 'light'
}) => {
  // 添加状态，用于控制标签页
  const [activeTab, setActiveTab] = useState('details');
  
  // 确保结果存在且有推荐项
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

  const recommendations = result.recommendations || [];
  const selectedGearbox = recommendations[selectedIndex];

  // 可能是部分匹配的结果
  const isPartialMatch = selectedGearbox.isPartialMatch === true;

  // 修改版本 - 添加标签页
  return (
    <Card className="shadow-sm" style={{ backgroundColor: colors?.card || 'white', borderColor: colors?.border || '#ddd' }}>
      <Card.Header style={{ backgroundColor: colors?.headerBg || '#f5f5f5', color: colors?.headerText || '#333' }}>
        <div className="d-flex justify-content-between align-items-center">
          <span><i className="bi bi-gear-fill me-2"></i>齿轮箱选型结果</span>
          {isPartialMatch && (
            <Badge bg="warning">部分匹配</Badge>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        <Tabs 
          activeKey={activeTab} 
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
          style={{ borderBottomColor: colors?.border || '#ddd' }}
        >
          {/* 详细信息标签页 */}
          <Tab eventKey="details" title="详细参数">
            <Row>
              <Col md={6}>
                <h5 style={{ color: colors?.headerText || '#333' }}>选中齿轮箱: {selectedGearbox.model}</h5>
                <Table striped bordered style={{ backgroundColor: colors?.card || 'white', color: colors?.text || '#333', borderColor: colors?.border || '#ddd' }}>
                  <tbody>
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
                      </td>
                    </tr>
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
                            : selectedGearbox.ratio || '-')}
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
                      <td>重量</td>
                      <td>{selectedGearbox.weight || '-'} kg</td>
                    </tr>
                    <tr>
                      <td>价格</td>
                      <td>{(selectedGearbox.marketPrice || 0).toLocaleString()} 元</td>
                    </tr>
                    {/* 输入接口信息 */}
                    {selectedGearbox.inputInterfaces && (
                      <>
                        {selectedGearbox.inputInterfaces.sae && selectedGearbox.inputInterfaces.sae.length > 0 && (
                          <tr>
                            <td>SAE接口</td>
                            <td>
                              {selectedGearbox.inputInterfaces.sae.map((spec, idx) => (
                                <Badge
                                  key={idx}
                                  bg={selectedGearbox.interfaceMatch?.type === 'sae' && selectedGearbox.interfaceMatch?.matched ? 'success' : 'primary'}
                                  className="me-1"
                                >
                                  {spec}
                                  {selectedGearbox.interfaceMatch?.type === 'sae' &&
                                   selectedGearbox.interfaceMatch?.spec === spec &&
                                   <i className="bi bi-check-circle-fill ms-1"></i>}
                                </Badge>
                              ))}
                            </td>
                          </tr>
                        )}
                        {selectedGearbox.inputInterfaces.domestic && selectedGearbox.inputInterfaces.domestic.length > 0 && (
                          <tr>
                            <td>国内机接口</td>
                            <td>
                              {selectedGearbox.inputInterfaces.domestic.map((spec, idx) => (
                                <Badge
                                  key={idx}
                                  bg={selectedGearbox.interfaceMatch?.type === 'domestic' && selectedGearbox.interfaceMatch?.matched ? 'success' : 'info'}
                                  className="me-1"
                                >
                                  {spec}
                                  {selectedGearbox.interfaceMatch?.type === 'domestic' &&
                                   selectedGearbox.interfaceMatch?.spec === spec &&
                                   <i className="bi bi-check-circle-fill ms-1"></i>}
                                </Badge>
                              ))}
                            </td>
                          </tr>
                        )}
                        {selectedGearbox.inputInterfaces.type && (
                          <tr>
                            <td>驱动类型</td>
                            <td>
                              <Badge bg="secondary">{selectedGearbox.inputInterfaces.type}</Badge>
                              {selectedGearbox.inputInterfaces.note && (
                                <span className="ms-2 text-muted small">{selectedGearbox.inputInterfaces.note}</span>
                              )}
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                    {/* 接口兼容性状态 */}
                    {selectedGearbox.interfaceMatch && (
                      <tr className={selectedGearbox.interfaceMatch.matched ? 'table-success' : 'table-warning'}>
                        <td>接口兼容性</td>
                        <td>
                          {selectedGearbox.interfaceMatch.matched ? (
                            <>
                              <Badge bg="success"><i className="bi bi-check-circle-fill me-1"></i>匹配</Badge>
                              <span className="ms-2">
                                支持 {selectedGearbox.interfaceMatch.type === 'sae' ? 'SAE' : '国内机'} {selectedGearbox.interfaceMatch.spec}
                              </span>
                            </>
                          ) : selectedGearbox.interfaceMatch.needsAdapter ? (
                            <>
                              <Badge bg="warning" text="dark"><i className="bi bi-exclamation-triangle-fill me-1"></i>需转接</Badge>
                              <span className="ms-2 text-muted">
                                需要转接法兰 ({selectedGearbox.interfaceMatch.spec} → 可用接口)
                              </span>
                            </>
                          ) : (
                            <>
                              <Badge bg="danger"><i className="bi bi-x-circle-fill me-1"></i>不匹配</Badge>
                              <span className="ms-2 text-muted">
                                不支持 {selectedGearbox.interfaceMatch.type === 'sae' ? 'SAE' : '国内机'} {selectedGearbox.interfaceMatch.spec}
                              </span>
                            </>
                          )}
                        </td>
                      </tr>
                    )}
                    {/* 无接口数据提示 */}
                    {!selectedGearbox.inputInterfaces && (
                      <tr>
                        <td>输入接口</td>
                        <td><span className="text-muted">暂无接口数据</span></td>
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
              </Col>
              <Col md={6}>
                <h5 style={{ color: colors?.headerText || '#333' }}>其他推荐齿轮箱</h5>
                <div className="table-responsive">
                  <Table striped bordered hover size="sm" style={{ backgroundColor: colors?.card || 'white', color: colors?.text || '#333', borderColor: colors?.border || '#ddd' }}>
                    <thead>
                      <tr>
                        <th>型号</th>
                        <th>减速比</th>
                        <th>传递能力</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recommendations.map((gearbox, index) => (
                        index !== selectedIndex && (
                          <tr key={gearbox.model + index} className={gearbox.isPartialMatch ? 'table-warning' : ''}>
                            <td>
                              {gearbox.model}
                              {gearbox.isPartialMatch && <Badge bg="warning" className="ms-1">部分</Badge>}
                            </td>
                            <td>
                              {gearbox.selectedRatio?.toFixed(2) || '-'}
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
                              >
                                选择
                              </Button>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </Tab>
          
          {/* 可视化标签页 */}
          <Tab eventKey="visualization" title="图表分析">
            <GearboxVisualization 
              selectionResult={result}
              selectedGearbox={selectedGearbox}
              recommendations={recommendations}
              colors={colors}
              theme={theme}
            />
          </Tab>
        </Tabs>

        {result.warning && (
          <Alert variant="warning" className="mt-3">
            <i className="bi bi-info-circle-fill me-2"></i>
            {result.warning}
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
      </Card.Body>
    </Card>
  );
};

export default GearboxSelectionResult;