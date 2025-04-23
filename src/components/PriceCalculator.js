// src/components/PriceCalculator.js
import React, { useCallback, useEffect, useState } from 'react';
import { Form, Table, Badge, Row, Col } from 'react-bootstrap';
import { safeParseFloat } from '../utils/dataHelpers';

const PriceCalculator = ({ 
  selectedComponents, 
  packagePrice, 
  marketPrice, 
  totalMarketPrice,
  onPriceChange, 
  colors, 
  theme,
  selectionDetails
}) => {
  const [editedValues, setEditedValues] = useState({});
  
  // 初始化编辑值
  useEffect(() => {
    const initialValues = {};
    if (selectedComponents.gearbox) {
      initialValues['gearbox-basePrice'] = selectedComponents.gearbox.basePrice;
      initialValues['gearbox-discountRate'] = selectedComponents.gearbox.discountRate * 100;
      initialValues['gearbox-factoryPrice'] = selectedComponents.gearbox.factoryPrice;
      initialValues['gearbox-marketPrice'] = selectedComponents.gearbox.marketPrice;
    }
    if (selectedComponents.coupling) {
      initialValues['coupling-basePrice'] = selectedComponents.coupling.basePrice;
      initialValues['coupling-discountRate'] = selectedComponents.coupling.discountRate * 100;
      initialValues['coupling-factoryPrice'] = selectedComponents.coupling.factoryPrice;
      initialValues['coupling-marketPrice'] = selectedComponents.coupling.marketPrice;
    }
    if (selectedComponents.pump) {
      initialValues['pump-basePrice'] = selectedComponents.pump.basePrice;
      initialValues['pump-discountRate'] = selectedComponents.pump.discountRate * 100;
      initialValues['pump-factoryPrice'] = selectedComponents.pump.factoryPrice;
      initialValues['pump-marketPrice'] = selectedComponents.pump.marketPrice;
    }
    setEditedValues(initialValues);
  }, [selectedComponents]);

  const handleInputChange = useCallback((component, field, value) => {
    setEditedValues(prev => ({
      ...prev,
      [`${component}-${field}`]: value
    }));
  }, []);

  const handleInputBlur = useCallback((component, field, value) => {
    if (field === 'discountRate') {
      const discountValue = safeParseFloat(value);
      if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
        onPriceChange(component, field, discountValue);
      }
    } else {
      const numValue = safeParseFloat(value);
      if (!isNaN(numValue)) {
        onPriceChange(component, field, numValue);
      }
    }
  }, [onPriceChange]);

  const renderPriceRow = useCallback((component, data) => {
    if (!data) return null;
    
    const fields = ['basePrice', 'discountRate', 'factoryPrice', 'marketPrice'];
    
    return (
      <tr key={component}>
        <td className="align-middle fw-bold">
          {component === 'gearbox' ? '齿轮箱' : 
           component === 'coupling' ? '联轴器' : '备用泵'}
          <small className="ms-2 text-muted">({data.model})</small>
        </td>
        {fields.map(field => (
          <td key={field}>
            <Form.Control
              type="number"
              size="sm"
              value={editedValues[`${component}-${field}`] || ''}
              onChange={(e) => handleInputChange(component, field, e.target.value)}
              onBlur={(e) => handleInputBlur(component, field, e.target.value)}
              style={{
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: colors.inputBorder
              }}
            />
          </td>
        ))}
      </tr>
    );
  }, [editedValues, handleInputChange, handleInputBlur, colors]);

  return (
    <div className="price-calculator">
      <Row className="mb-3">
        <Col>
          <h6 style={{ color: colors.headerText }}>价格计算器</h6>
        </Col>
        <Col xs="auto">
          <Badge bg="info" pill>
            打包价: ¥{packagePrice?.toLocaleString()}
          </Badge>
          <Badge bg="success" pill className="ms-2">
            总市场价: ¥{totalMarketPrice?.toLocaleString()}
          </Badge>
        </Col>
      </Row>

      <Table 
        size="sm" 
        bordered 
        hover 
        responsive
        style={{ color: colors.text }}
      >
        <thead>
          <tr>
            <th style={{ width: '20%' }}>组件</th>
            <th style={{ width: '20%' }}>基础价格 (¥)</th>
            <th style={{ width: '20%' }}>折扣率 (%)</th>
            <th style={{ width: '20%' }}>出厂价 (¥)</th>
            <th style={{ width: '20%' }}>市场价 (¥)</th>
          </tr>
        </thead>
        <tbody>
          {renderPriceRow('gearbox', selectedComponents.gearbox)}
          {renderPriceRow('coupling', selectedComponents.coupling)}
          {renderPriceRow('pump', selectedComponents.pump)}
        </tbody>
        <tfoot>
          <tr>
            <td className="text-end fw-bold" colSpan="3">整机打包价:</td>
            <td className="fw-bold">¥{packagePrice?.toLocaleString()}</td>
            <td className="fw-bold">¥{totalMarketPrice?.toLocaleString()}</td>
          </tr>
        </tfoot>
      </Table>

      {selectionDetails && (
        <div className="mt-3">
          <small className="text-muted">
            推荐方案评分: {selectionDetails.recommendation?.score || '-'} | 
            容量余量: {selectionDetails.capacityMargin?.toFixed(1)}% | 
            减速比偏差: {selectionDetails.ratioDiffPercent?.toFixed(1)}%
          </small>
        </div>
      )}
    </div>
  );
};

export default PriceCalculator;