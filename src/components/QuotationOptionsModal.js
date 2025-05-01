import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { needsStandbyPump } from '../utils/enhancedPumpSelection';

/**
 * 报价单选项设置对话框
 * 用于配置报价单的显示选项、价格选项等
 */
const QuotationOptionsModal = ({ 
  show, 
  onHide, 
  onApply, 
  selectedComponents, 
  hasSpecialPackagePrice,
  specialPackageConfig,
  needsPump,
  colors,
  theme
}) => {
  // 默认选项
  const defaultOptions = {
    showCouplingPrice: true,    // 默认显示联轴器单独价格
    showPumpPrice: true,        // 默认显示备用泵单独价格
    includePump: true,          // 默认包含备用泵
    taxRate: 13,                // 默认税率
    discountPercentage: 0,      // 默认折扣
    validityDays: 30,           // 默认有效期
    paymentTerms: '合同签订后支付30%预付款，发货前付清全款',
    deliveryTime: '合同签订生效后3个月内发货',
    includeDelivery: false,     // 默认不包含运输
    deliveryCost: 0,            // 默认运输费用
    includeInstallation: false, // 默认不包含安装
    installationCost: 0,        // 默认安装费用
    includeTax: true,           // 默认含税
    deliveryTerm: 'EXW-工厂交货' // 默认交货条款
  };

  // 状态
  const [options, setOptions] = useState(defaultOptions);
  const [error, setError] = useState('');

  // 交货条款选项
  const deliveryTermOptions = [
    { value: 'EXW-工厂交货', label: 'EXW-工厂交货' },
    { value: 'FOB-装运港离岸价', label: 'FOB-装运港离岸价' },
    { value: 'CIF-目的港到岸价', label: 'CIF-目的港到岸价' },
    { value: 'DDU-目的地未完税', label: 'DDU-目的地未完税' },
    { value: 'DDP-目的地完税价', label: 'DDP-目的地完税价' }
  ];

  // 初始化
  useEffect(() => {
    if (show) {
      // 检查备用泵需求
      const needsPumpFlag = selectedComponents?.gearbox?.model 
        ? needsStandbyPump(selectedComponents.gearbox.model, { 
            power: selectedComponents.gearbox.power 
          }) 
        : false;
      
      // 特殊处理：如果是GW系列特殊打包价格，强制不单独显示配件价格
      if (hasSpecialPackagePrice) {
        setOptions({
          ...defaultOptions,
          showCouplingPrice: false,
          showPumpPrice: false,
          includePump: needsPumpFlag, // 根据需求设置是否包含备用泵
          needsPump: needsPumpFlag // 添加备用泵需求标记
        });
      } 
      // 特殊处理：如果不是GW系列齿轮箱，默认配件价格包含在齿轮箱中
      else if (selectedComponents?.gearbox?.model && 
               !selectedComponents.gearbox.model.toUpperCase().includes('GW')) {
        setOptions({
          ...defaultOptions,
          showCouplingPrice: false,
          showPumpPrice: false,
          includePump: needsPumpFlag, // 根据需求设置是否包含备用泵
          needsPump: needsPumpFlag // 添加备用泵需求标记
        });
      }
      // 默认设置
      else {
        setOptions({
          ...defaultOptions,
          includePump: needsPumpFlag, // 根据需求设置是否包含备用泵
          needsPump: needsPumpFlag // 添加备用泵需求标记
        });
      }

      // 清除错误信息
      setError('');
    }
  }, [show, hasSpecialPackagePrice, selectedComponents]);

  // 处理输入变化
  const handleChange = (field, value) => {
    if (field === 'taxRate' || field === 'discountPercentage' || 
        field === 'validityDays' || field === 'deliveryCost' || field === 'installationCost') {
      // 数字类型字段
      value = value === '' ? 0 : parseFloat(value);
      if (isNaN(value)) value = 0;
    }

    setOptions(prevOptions => ({ ...prevOptions, [field]: value }));
  };

  // 检查输入是否有效
  const isValid = () => {
    if (options.taxRate < 0 || options.taxRate > 100) {
      setError('税率必须在0-100%之间');
      return false;
    }
    if (options.discountPercentage < 0 || options.discountPercentage > 100) {
      setError('折扣必须在0-100%之间');
      return false;
    }
    if (options.validityDays <= 0) {
      setError('有效期必须大于0天');
      return false;
    }
    if (options.includeDelivery && options.deliveryCost <= 0) {
      setError('包含运输时，运输费用必须大于0');
      return false;
    }
    if (options.includeInstallation && options.installationCost <= 0) {
      setError('包含安装时，安装费用必须大于0');
      return false;
    }
    return true;
  };

  // 应用选项
  const handleApply = () => {
    if (!isValid()) return;
    onApply(options);
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      style={{ color: colors?.text }}
    >
      <Modal.Header 
        closeButton
        style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}
      >
        <Modal.Title>报价单选项</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: colors?.card }}>
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}

        {/* 特殊打包价格提示 */}
        {hasSpecialPackagePrice && (
          <Alert variant="info" className="mb-3">
            <i className="bi bi-info-circle-fill me-2"></i>
            <strong>特别说明：</strong> GW系列齿轮箱使用市场常规打包价格 ({specialPackageConfig?.packagePrice?.toLocaleString()} 元)，配件价格已包含在内。
          </Alert>
        )}

        {/* 非GW系列默认配置提示 */}
        {!hasSpecialPackagePrice && selectedComponents?.gearbox?.model && 
        !selectedComponents.gearbox.model.toUpperCase().includes('GW') && (
          <Alert variant="info" className="mb-3">
            <i className="bi bi-info-circle-fill me-2"></i>
            <strong>默认配置：</strong> 非GW系列齿轮箱默认将配件价格包含在齿轮箱价格中。
          </Alert>
        )}

        <Form>
          <h6 className="mb-3" style={{ color: colors?.headerText }}>显示选项</h6>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="showCouplingPrice">
                <Form.Check 
                  type="checkbox"
                  label="联轴器单独显示价格"
                  checked={options.showCouplingPrice}
                  onChange={(e) => handleChange('showCouplingPrice', e.target.checked)}
                  disabled={hasSpecialPackagePrice} // GW系列特殊打包价格时禁用选项
                />
                <Form.Text className="text-muted">
                  {options.showCouplingPrice ? 
                    '联轴器将作为单独项目显示在报价单中' : 
                    '联轴器价格将包含在齿轮箱价格中'}
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="showPumpPrice">
                <Form.Check 
                  type="checkbox"
                  label="备用泵单独显示价格"
                  checked={options.showPumpPrice}
                  onChange={(e) => handleChange('showPumpPrice', e.target.checked)}
                  disabled={hasSpecialPackagePrice || !needsPump} // GW系列特殊打包价格或不需要备用泵时禁用选项
                />
                <Form.Text className="text-muted">
                  {needsPump ? 
                    (options.showPumpPrice ? 
                      '备用泵将作为单独项目显示在报价单中' : 
                      '备用泵价格将包含在齿轮箱价格中') : 
                    '当前选型不需要备用泵'}
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="includePump">
                <Form.Check 
                  type="checkbox"
                  label="包含备用泵"
                  checked={options.includePump}
                  onChange={(e) => handleChange('includePump', e.target.checked)}
                  disabled={!needsPump} // 不需要备用泵时禁用选项
                />
                <Form.Text className="text-muted">
                  {needsPump ? 
                    (options.includePump ? 
                      '报价单将包含备用泵' : 
                      '报价单不包含备用泵') : 
                    '当前选型不需要备用泵'}
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <h6 className="mb-3 mt-4" style={{ color: colors?.headerText }}>价格选项</h6>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="taxRate">
                <Form.Label>增值税税率 (%)</Form.Label>
                <Form.Control 
                  type="number" 
                  value={options.taxRate}
                  onChange={(e) => handleChange('taxRate', e.target.value)}
                  min="0"
                  max="100"
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
                <Form.Text className="text-muted">
                  0表示不含税，标准税率为13%
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="includeTax">
                <Form.Check 
                  type="checkbox"
                  className="mt-4"
                  label="价格含税"
                  checked={options.includeTax}
                  onChange={(e) => handleChange('includeTax', e.target.checked)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="discountPercentage">
                <Form.Label>折扣百分比 (%)</Form.Label>
                <Form.Control 
                  type="number" 
                  value={options.discountPercentage}
                  onChange={(e) => handleChange('discountPercentage', e.target.value)}
                  min="0"
                  max="100"
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
                <Form.Text className="text-muted">
                  0表示不打折
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <h6 className="mb-3 mt-4" style={{ color: colors?.headerText }}>额外服务</h6>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="includeDelivery">
                <Form.Check 
                  type="checkbox"
                  label="包含运输服务"
                  checked={options.includeDelivery}
                  onChange={(e) => handleChange('includeDelivery', e.target.checked)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="deliveryCost">
                <Form.Label>运输费用 (元)</Form.Label>
                <Form.Control 
                  type="number" 
                  value={options.deliveryCost}
                  onChange={(e) => handleChange('deliveryCost', e.target.value)}
                  disabled={!options.includeDelivery}
                  min="0"
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="includeInstallation">
                <Form.Check 
                  type="checkbox"
                  label="包含安装调试服务"
                  checked={options.includeInstallation}
                  onChange={(e) => handleChange('includeInstallation', e.target.checked)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="installationCost">
                <Form.Label>安装费用 (元)</Form.Label>
                <Form.Control 
                  type="number" 
                  value={options.installationCost}
                  onChange={(e) => handleChange('installationCost', e.target.value)}
                  disabled={!options.includeInstallation}
                  min="0"
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <h6 className="mb-3 mt-4" style={{ color: colors?.headerText }}>其他设置</h6>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="validityDays">
                <Form.Label>有效期天数</Form.Label>
                <Form.Control 
                  type="number" 
                  value={options.validityDays}
                  onChange={(e) => handleChange('validityDays', e.target.value)}
                  min="1"
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="deliveryTerm">
                <Form.Label>交货条款</Form.Label>
                <Form.Select
                  value={options.deliveryTerm}
                  onChange={(e) => handleChange('deliveryTerm', e.target.value)}
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                >
                  {deliveryTermOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="paymentTerms">
                <Form.Label>付款条件</Form.Label>
                <Form.Control 
                  type="text" 
                  value={options.paymentTerms}
                  onChange={(e) => handleChange('paymentTerms', e.target.value)}
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="deliveryTime">
                <Form.Label>交货时间</Form.Label>
                <Form.Control 
                  type="text" 
                  value={options.deliveryTime}
                  onChange={(e) => handleChange('deliveryTime', e.target.value)}
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: colors?.card }}>
        <Button variant="secondary" onClick={onHide}>
          取消
        </Button>
        <Button variant="primary" onClick={handleApply}>
          生成报价单
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuotationOptionsModal;