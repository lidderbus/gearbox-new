// src/components/selection/CouplingSelector.js
// 联轴器选择器组件 - 根据参数选择最合适的联轴器

import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Table, Alert, Badge, Spinner, Tab, Tabs } from 'react-bootstrap';
import { selectFlexibleCoupling } from '../../utils/selectionAlgorithm';
import { couplingWorkFactorMap, getTemperatureFactor } from '../../data/gearboxMatchingMaps';

/**
 * 联轴器选择器组件
 * @param {Object} props - 组件属性
 * @param {Object} props.engineData - 发动机数据 {power, speed}
 * @param {Object} props.gearboxData - 选中的齿轮箱数据
 * @param {Array} props.couplingsData - 联轴器数据数组
 * @param {Function} props.onCouplingSelected - 联轴器选中回调
 * @param {Object} props.theme - 主题设置
 * @param {Object} props.colors - 颜色设置
 * @param {Object} props.initialValues - 初始值设置
 * @returns {JSX.Element}
 */
const CouplingSelector = ({
  engineData,
  gearboxData,
  couplingsData,
  onCouplingSelected,
  theme = 'light',
  colors = {},
  initialValues = {}
}) => {
  // 状态
  const [workCondition, setWorkCondition] = useState(initialValues.workCondition || "III类:扭矩变化中等");
  const [temperature, setTemperature] = useState(initialValues.temperature || "30");
  const [hasCover, setHasCover] = useState(initialValues.hasCover || false);
  const [engineTorque, setEngineTorque] = useState(0);
  const [requiredTorque, setRequiredTorque] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectionResult, setSelectionResult] = useState(null);
  const [activeTab, setActiveTab] = useState('parameters');
  const [selectedCouplingIndex, setSelectedCouplingIndex] = useState(0);

  // 工况选项
  const workConditionOptions = [
    'I类:扭矩变化很小',
    'II类:扭矩变化小',
    'III类:扭矩变化中等',
    'IV类:扭矩变化大',
    'V类:扭矩变化很大'
  ];

  // 初始化组件，计算发动机扭矩
  useEffect(() => {
    if (engineData && engineData.power > 0 && engineData.speed > 0) {
      // 计算发动机扭矩 (N·m)
      const torque = (engineData.power * 9550) / engineData.speed;
      setEngineTorque(torque);
      
      // 计算所需联轴器扭矩
      calculateRequiredTorque(torque, workCondition, temperature);
    }
  }, [engineData, workCondition, temperature]);

  // 计算所需联轴器扭矩 (kN·m)
  const calculateRequiredTorque = (torque, condition, temp) => {
    const kFactor = couplingWorkFactorMap[condition] || couplingWorkFactorMap.default;
    const stFactor = getTemperatureFactor(parseFloat(temp));
    const requiredCouplingTorque = torque * kFactor * stFactor / 1000;
    setRequiredTorque(requiredCouplingTorque);
    return requiredCouplingTorque;
  };

  // 执行联轴器选择
  const handleSelect = () => {
    if (!engineTorque || engineTorque <= 0) {
      setError("发动机扭矩无效，请检查发动机功率和转速");
      return;
    }
    
    if (!gearboxData || !gearboxData.model) {
      setError("请先选择齿轮箱");
      return;
    }
    
    if (!couplingsData || couplingsData.length === 0) {
      setError("联轴器数据缺失");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // 执行联轴器选择算法
      const result = selectFlexibleCoupling(
        engineTorque,
        gearboxData.model,
        couplingsData,
        workCondition,
        parseFloat(temperature),
        hasCover
      );
      
      setSelectionResult(result);
      setActiveTab('results');
      
      // 如果有选择结果，自动选中第一个推荐
      if (result && result.success && result.recommendations && result.recommendations.length > 0) {
        setSelectedCouplingIndex(0);
        
        // 通知父组件选中的联轴器
        if (onCouplingSelected && typeof onCouplingSelected === 'function') {
          onCouplingSelected(result.recommendations[0]);
        }
      }
    } catch (err) {
      console.error("联轴器选择出错:", err);
      setError(`联轴器选择出错: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 切换选中的联轴器
  const handleCouplingChange = (index) => {
    if (selectionResult && selectionResult.recommendations && selectionResult.recommendations[index]) {
      setSelectedCouplingIndex(index);
      
      // 通知父组件选中的联轴器
      if (onCouplingSelected && typeof onCouplingSelected === 'function') {
        onCouplingSelected(selectionResult.recommendations[index]);
      }
    }
  };
  
  // 安全数字格式化
  const safeNumberFormat = (value, decimals = 2) => {
    const num = parseFloat(value);
    if (typeof num !== 'number' || isNaN(num)) {
      return '-';
    }
    return num.toFixed(decimals);
  };

  // 输入表单部分
  const renderParametersForm = () => (
    <div>
      <Form className="mb-4">
        {/* 工况选择 */}
        <Form.Group className="mb-3">
          <Form.Label style={{ color: colors.text }}>工况</Form.Label>
          <Form.Select 
            value={workCondition}
            onChange={(e) => setWorkCondition(e.target.value)}
            style={{ 
              backgroundColor: colors.inputBg, 
              color: colors.text, 
              borderColor: colors.inputBorder 
            }}
          >
            {workConditionOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Form.Select>
          <Form.Text style={{ color: colors.muted }}>
            工况影响联轴器的工作负荷系数
          </Form.Text>
        </Form.Group>
        
        {/* 温度设置 */}
        <Form.Group className="mb-3">
          <Form.Label style={{ color: colors.text }}>工作温度 (°C)</Form.Label>
          <Form.Control
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="默认 30°C"
            style={{ 
              backgroundColor: colors.inputBg, 
              color: colors.text, 
              borderColor: colors.inputBorder 
            }}
          />
          <Form.Text style={{ color: colors.muted }}>
            高温环境会降低联轴器的额定扭矩
          </Form.Text>
        </Form.Group>
        
        {/* 罩壳选项 */}
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="联轴器需要带罩壳"
            checked={hasCover}
            onChange={(e) => setHasCover(e.target.checked)}
            style={{ color: colors.text }}
          />
          <Form.Text style={{ color: colors.muted }}>
            罩壳可以保护联轴器免受外部损伤和污染
          </Form.Text>
        </Form.Group>
      </Form>
      
      {/* 计算结果展示 */}
      <Card style={{ 
        backgroundColor: colors.card, 
        borderColor: colors.border, 
        marginBottom: '1rem' 
      }}>
        <Card.Header style={{ 
          backgroundColor: colors.headerBg, 
          color: colors.headerText 
        }}>
          <i className="bi bi-calculator me-2"></i>扭矩计算结果
        </Card.Header>
        <Card.Body>
          <Table bordered size="sm" responsive style={{ color: colors.text }}>
            <tbody>
              <tr>
                <td style={{ width: '40%', fontWeight: 'bold' }}>发动机功率</td>
                <td>{engineData ? `${safeNumberFormat(engineData.power)} kW` : '-'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>发动机转速</td>
                <td>{engineData ? `${safeNumberFormat(engineData.speed)} r/min` : '-'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>发动机扭矩</td>
                <td>{engineTorque > 0 ? `${safeNumberFormat(engineTorque)} N·m` : '-'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>工况系数</td>
                <td>{couplingWorkFactorMap[workCondition] || couplingWorkFactorMap.default}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>温度系数</td>
                <td>{safeNumberFormat(getTemperatureFactor(parseFloat(temperature)), 4)}</td>
              </tr>
              <tr className="table-primary">
                <td style={{ fontWeight: 'bold' }}>所需联轴器扭矩</td>
                <td style={{ fontWeight: 'bold' }}>{requiredTorque > 0 ? `${safeNumberFormat(requiredTorque, 3)} kN·m` : '-'}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      
      {/* 选择按钮 */}
      <div className="d-grid">
        <Button
          variant="primary"
          onClick={handleSelect}
          disabled={loading || !engineTorque || !gearboxData || !couplingsData}
          style={{
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            color: colors.primaryText
          }}
          size="lg"
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              选择中...
            </>
          ) : (
            <>
              <i className="bi bi-gear-wide-connected me-2"></i>
              开始联轴器选择
            </>
          )}
        </Button>
      </div>
    </div>
  );
  
  // 选择结果部分
  const renderResults = () => {
    if (!selectionResult) {
      return (
        <Alert variant="info">
          <i className="bi bi-info-circle me-2"></i>
          请先执行联轴器选择
        </Alert>
      );
    }
    
    if (!selectionResult.success) {
      return (
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {selectionResult.message || "未找到合适的联轴器"}
        </Alert>
      );
    }
    
    const recommendations = selectionResult.recommendations || [];
    const selectedCoupling = recommendations[selectedCouplingIndex] || {};
    
    return (
      <div>
        {/* 警告信息 */}
        {selectionResult.warning && (
          <Alert variant="warning" className="mb-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {selectionResult.warning}
          </Alert>
        )}
        
        {/* 推荐列表 */}
        <div className="mb-4">
          <h5 style={{ color: colors.headerText, marginBottom: '1rem' }}>推荐联轴器</h5>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {recommendations.map((coupling, index) => (
              <Button
                key={coupling.model}
                variant={selectedCouplingIndex === index ? "primary" : "outline-secondary"}
                size="sm"
                onClick={() => handleCouplingChange(index)}
                style={{
                  backgroundColor: selectedCouplingIndex === index ? colors.primary : 'transparent',
                  color: selectedCouplingIndex === index ? colors.primaryText : colors.text,
                  borderColor: selectedCouplingIndex === index ? colors.primary : colors.inputBorder
                }}
              >
                {coupling.model}
                <Badge bg={coupling.score >= 80 ? "success" : coupling.score >= 60 ? "warning" : "danger"} 
                      className="ms-1">
                  {coupling.score}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
        
        {/* 选中联轴器详情 */}
        <Card style={{ 
          backgroundColor: colors.card, 
          borderColor: colors.border, 
          marginBottom: '1rem' 
        }}>
          <Card.Header style={{ 
            backgroundColor: colors.headerBg, 
            color: colors.headerText 
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <span>
                <i className="bi bi-gear-fill me-2"></i>
                已选联轴器: {selectedCoupling.model}
              </span>
              <Badge 
                bg={selectedCoupling.score >= 80 ? "success" : selectedCoupling.score >= 60 ? "warning" : "danger"}
              >
                评分: {selectedCoupling.score}
              </Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <Tabs defaultActiveKey="specs" className="mb-3">
              <Tab eventKey="specs" title="技术参数">
                <Table bordered size="sm" responsive style={{ color: colors.text }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '40%', fontWeight: 'bold' }}>型号</td>
                      <td>{selectedCoupling.model}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>额定扭矩</td>
                      <td>{safeNumberFormat(selectedCoupling.torque, 3)} kN·m</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>扭矩余量</td>
                      <td>
                        <Badge 
                          bg={selectedCoupling.torqueMargin >= 10 && selectedCoupling.torqueMargin <= 30 ? "success" : 
                             selectedCoupling.torqueMargin > 30 ? "warning" : "danger"}
                        >
                          {safeNumberFormat(selectedCoupling.torqueMargin, 1)}%
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>最大转速</td>
                      <td>{selectedCoupling.maxSpeed ? `${safeNumberFormat(selectedCoupling.maxSpeed)} r/min` : '-'}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>重量</td>
                      <td>{selectedCoupling.weight ? `${safeNumberFormat(selectedCoupling.weight)} kg` : '-'}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>带罩壳</td>
                      <td>{selectedCoupling.model.includes('JB') ? '是' : '否'}</td>
                    </tr>
                  </tbody>
                </Table>
              </Tab>
              <Tab eventKey="price" title="价格信息">
                <Table bordered size="sm" responsive style={{ color: colors.text }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '40%', fontWeight: 'bold' }}>基础价格</td>
                      <td>{safeNumberFormat(selectedCoupling.basePrice)} 元</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>折扣率</td>
                      <td>{safeNumberFormat(selectedCoupling.discountRate * 100, 1)}%</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>出厂价格</td>
                      <td>{safeNumberFormat(selectedCoupling.factoryPrice)} 元</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>市场价格</td>
                      <td>{safeNumberFormat(selectedCoupling.marketPrice)} 元</td>
                    </tr>
                  </tbody>
                </Table>
              </Tab>
              <Tab eventKey="scoring" title="评分细则">
                <Table bordered size="sm" responsive style={{ color: colors.text }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '60%', fontWeight: 'bold' }}>扭矩余量 (占比50%)</td>
                      <td>
                        {selectedCoupling.torqueMargin >= 10 && selectedCoupling.torqueMargin <= 30 ? (
                          <span className="text-success">最佳 (10-30%)</span>
                        ) : selectedCoupling.torqueMargin > 30 && selectedCoupling.torqueMargin <= 50 ? (
                          <span className="text-warning">偏大 (30-50%)</span>
                        ) : selectedCoupling.torqueMargin > 50 ? (
                          <span className="text-warning">过大 (&gt;50%)</span>
                        ) : (
                          <span className="text-danger">偏小 (&lt;10%)</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>型号匹配 (占比30%)</td>
                      <td>
                        {selectedCoupling.model === gearboxData.recommendedCouplingModel ? (
                          <span className="text-success">完全匹配</span>
                        ) : selectedCoupling.model?.startsWith(gearboxData.recommendedCouplingPrefix || '') ? (
                          <span className="text-warning">前缀匹配</span>
                        ) : (
                          <span className="text-danger">无匹配</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>转速适配 (占比10%)</td>
                      <td>
                        {selectedCoupling.maxSpeed && selectedCoupling.maxSpeed >= engineData?.speed ? (
                          <span className="text-success">满足要求</span>
                        ) : (
                          <span className="text-danger">不满足要求</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>重量和价格 (占比10%)</td>
                      <td>
                        {selectedCoupling.score >= 75 ? (
                          <span className="text-success">理想</span>
                        ) : selectedCoupling.score >= 60 ? (
                          <span className="text-warning">一般</span>
                        ) : (
                          <span className="text-danger">较差</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
        
        {/* 手动调整按钮 */}
        <div className="d-grid gap-2">
          <Button
            variant="outline-primary"
            onClick={() => setActiveTab('parameters')}
            style={{
              borderColor: colors.primary,
              color: colors.primary
            }}
          >
            <i className="bi bi-sliders me-2"></i>
            调整参数重新选择
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="coupling-selector">
      {/* 错误提示 */}
      {error && (
        <Alert variant="danger" className="mb-3" dismissible onClose={() => setError("")}>
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}
      
      {/* 主要内容区 */}
      <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          <i className="bi bi-gear-wide-connected me-2"></i>
          联轴器选择
        </Card.Header>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab 
              eventKey="parameters" 
              title={<span><i className="bi bi-sliders me-1"></i>选择参数</span>}
            >
              {renderParametersForm()}
            </Tab>
            <Tab 
              eventKey="results" 
              title={<span><i className="bi bi-list-check me-1"></i>选择结果</span>}
              disabled={!selectionResult}
            >
              {renderResults()}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CouplingSelector;
