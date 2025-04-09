// components/PriceCalculator.js
import React, { useMemo, useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Container, Row, Col } from 'react-bootstrap';

/**
 * 价格格式化函数 - 按用户要求显示整数
 * @param {number} price - 待格式化的价格
 * @param {boolean} includeCurrency - 是否包含货币符号
 * @returns {string} 格式化后的价格字符串
 */
const formatPrice = (price, includeCurrency = true) => {
  if (typeof price !== 'number' || isNaN(price)) return includeCurrency ? '¥0' : '0';
  
  // 四舍五入到整数并转成字符串
  const roundedPrice = Math.round(price);
  
  // 简单格式化，不使用千分位分隔符，避免宽度问题
  const formattedPrice = roundedPrice.toString();
  
  return includeCurrency ? `¥${formattedPrice}` : formattedPrice;
};

/**
 * 计算加价百分比
 * @param {number} factoryPrice - 成本价
 * @param {number} marketPrice - 市场价
 * @returns {number} 加价百分比
 */
const calculateMarkupPercentage = (factoryPrice, marketPrice) => {
  if (!factoryPrice || factoryPrice === 0) return 0;
  return Math.round(((marketPrice / factoryPrice) - 1) * 100);
};

/**
 * 价格输入组件
 */
const PriceInput = ({ value, onChange, readOnly = false, theme, colors }) => {
  const priceInputStyle = {
    textAlign: 'right',
    paddingRight: '5px',
    fontSize: '0.9rem',
    backgroundColor: colors.inputBg,
    color: colors.text,
    borderColor: colors.inputBorder
  };
  
  return (
    <InputGroup size="sm">
      <Form.Control
        size="sm"
        type="text"
        value={value}
        onChange={onChange}
        style={priceInputStyle}
        readOnly={readOnly}
      />
      <InputGroup.Text style={{ 
        backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748',
        color: colors.text,
        borderColor: colors.inputBorder
      }}>元</InputGroup.Text>
    </InputGroup>
  );
};

/**
 * 组件行 - 显示单个组件的价格信息
 */
const ComponentRow = ({ label, component, componentKey, onPriceChange, theme, colors }) => {
  if (!component) return null;
  
  // 处理价格输入变化
  const handlePriceChange = (priceType, value) => {
    // 移除非数字字符
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    // 验证是否为有效数字
    if (cleanValue === '' || isNaN(parseFloat(cleanValue))) {
      onPriceChange(componentKey, priceType, 0);
      return;
    }
    
    onPriceChange(componentKey, priceType, parseFloat(cleanValue));
  };
  
  return (
    <tr>
      <td>{label}</td>
      <td>
        <PriceInput 
          value={formatPrice(component.factoryPrice, false)}
          readOnly={true}
          theme={theme}
          colors={colors}
        />
      </td>
      <td>
        <PriceInput 
          value={formatPrice(component.price, false)}
          onChange={(e) => handlePriceChange('price', e.target.value)}
          theme={theme}
          colors={colors}
        />
      </td>
      <td>
        <PriceInput 
          value={formatPrice(component.marketPrice, false)}
          onChange={(e) => handlePriceChange('marketPrice', e.target.value)}
          theme={theme}
          colors={colors}
        />
        {label === '齿轮箱' && (
          <div 
            className="text-end mt-1" 
            style={{ 
              fontSize: '0.75rem', 
              color: colors.muted 
            }}
          >
            加价: {calculateMarkupPercentage(component.factoryPrice, component.marketPrice)}%
          </div>
        )}
      </td>
    </tr>
  );
};

/**
 * 移动设备布局组件
 */
const MobileLayout = ({ selectedComponents, packagePrice, marketPrice, onPriceChange, theme, colors }) => {
  const { gearbox, coupling, pump } = selectedComponents || {};
  
  if (!gearbox) {
    return (
      <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          价格计算
        </Card.Header>
        <Card.Body>
          <p style={{ color: colors.text }}>请先选择齿轮箱</p>
        </Card.Body>
      </Card>
    );
  }
  
  return (
    <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        价格计算
      </Card.Header>
      <Card.Body>
        {/* 齿轮箱部分 */}
        <div className="mb-3">
          <h6>齿轮箱</h6>
          <div className="d-flex justify-content-between mb-2">
            <span>成本价:</span>
            <span>{formatPrice(gearbox.factoryPrice)} 元</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>原价/打包价:</span>
            <span>{formatPrice(gearbox.price)} 元</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>市场价:</span>
            <span>{formatPrice(gearbox.marketPrice)} 元</span>
          </div>
          <div className="text-end" style={{ fontSize: '0.75rem', color: colors.muted }}>
            加价: {calculateMarkupPercentage(gearbox.factoryPrice, gearbox.marketPrice)}%
          </div>
        </div>
        
        {/* 联轴器部分 */}
        {coupling && (
          <div className="mb-3">
            <h6>高弹性联轴器</h6>
            <div className="d-flex justify-content-between mb-2">
              <span>成本价:</span>
              <span>{formatPrice(coupling.factoryPrice)} 元</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>原价/打包价:</span>
              <span>{formatPrice(coupling.price)} 元</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>市场价:</span>
              <span>{formatPrice(coupling.marketPrice)} 元</span>
            </div>
          </div>
        )}
        
        {/* 备用泵部分 */}
        {pump && (
          <div className="mb-3">
            <h6>备用泵</h6>
            <div className="d-flex justify-content-between mb-2">
              <span>成本价:</span>
              <span>{formatPrice(pump.factoryPrice)} 元</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>原价/打包价:</span>
              <span>{formatPrice(pump.price)} 元</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>市场价:</span>
              <span>{formatPrice(pump.marketPrice)} 元</span>
            </div>
          </div>
        )}
        
        {/* 总价部分 */}
        <div className="d-flex justify-content-between font-weight-bold mt-3 pt-2 border-top">
          <h6>总价:</h6>
          <div>
            <div>{formatPrice(packagePrice)} 元</div>
            <div>{formatPrice(marketPrice)} 元</div>
          </div>
        </div>
      </Card.Body>
      
      {/* 价格说明脚注 */}
      <Card.Footer style={{ 
        backgroundColor: theme === 'light' ? '#f0f7f0' : '#1a202c',
        borderTop: `1px solid ${colors.border}`,
        padding: '0.75rem 1rem',
        fontSize: '0.85rem',
        color: colors.muted
      }}>
        <ul className="mb-0 ps-3">
          <li>成本价：基于出厂价和折扣率计算，不可直接修改</li>
          <li>打包价：齿轮箱、联轴器、备用泵的组合优惠价</li>
          <li>市场价：向客户最终报价的价格，可手动调整</li>
        </ul>
      </Card.Footer>
    </Card>
  );
};

/**
 * 价格计算组件
 * @param {Object} props - 组件属性
 */
const PriceCalculator = ({
  selectedComponents,
  packagePrice = 0,
  marketPrice = 0,
  onPriceChange,
  theme = 'light',
  colors = {
    card: '#ffffff',
    border: '#dee2e6',
    headerBg: '#f8f9fa',
    headerText: '#212529',
    text: '#212529',
    muted: '#6c757d',
    inputBg: '#ffffff',
    inputBorder: '#ced4da'
  }
}) => {
  // 检测是否为移动设备
  const [isMobile, setIsMobile] = useState(false);
  
  // 使用窗口大小检测移动设备
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // 初始检查
    checkIfMobile();
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', checkIfMobile);
    
    // 清理监听器
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // 如果是移动设备，使用移动布局
  if (isMobile) {
    return (
      <MobileLayout
        selectedComponents={selectedComponents}
        packagePrice={packagePrice}
        marketPrice={marketPrice}
        onPriceChange={onPriceChange}
        theme={theme}
        colors={colors}
      />
    );
  }
  
  const { gearbox, coupling, pump } = selectedComponents || {};

  // 如果没有选择齿轮箱，显示提示
  if (!gearbox) {
    return (
      <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          价格计算
        </Card.Header>
        <Card.Body>
          <p style={{ color: colors.text }}>请先选择齿轮箱</p>
        </Card.Body>
      </Card>
    );
  }

  // 处理价格输入变化
  const handlePriceChange = (componentType, priceType, value) => {
    // 处理输入验证
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      onPriceChange(componentType, priceType, 0);
      return;
    }
    
    onPriceChange(componentType, priceType, numericValue);
  };

  return (
    <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        价格计算
      </Card.Header>
      <Card.Body style={{ padding: 0 }}>
        <Table bordered responsive style={{ marginBottom: 0, color: colors.text, tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '15%' }} />
            <col style={{ width: '28%' }} />
            <col style={{ width: '28%' }} />
            <col style={{ width: '29%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>组件</th>
              <th>成本价</th>
              <th>原价 / 打包价</th>
              <th>市场价</th>
            </tr>
          </thead>
          <tbody>
            {/* 齿轮箱价格行 */}
            <ComponentRow
              label="齿轮箱"
              component={gearbox}
              componentKey="gearbox"
              onPriceChange={handlePriceChange}
              theme={theme}
              colors={colors}
            />
            
            {/* 联轴器价格行 */}
            <ComponentRow
              label="高弹性联轴器"
              component={coupling}
              componentKey="coupling"
              onPriceChange={handlePriceChange}
              theme={theme}
              colors={colors}
            />
            
            {/* 备用泵价格行 */}
            <ComponentRow
              label="备用泵"
              component={pump}
              componentKey="pump"
              onPriceChange={handlePriceChange}
              theme={theme}
              colors={colors}
            />

            {/* 总价行 */}
            <tr style={{ 
              backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748',
              fontWeight: 'bold'
            }}>
              <td colSpan="2" style={{ textAlign: 'right' }}>总价：</td>
              <td style={{ textAlign: 'right' }}>{formatPrice(packagePrice)} 元</td>
              <td style={{ textAlign: 'right' }}>{formatPrice(marketPrice)} 元</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
      
      {/* 价格说明脚注 */}
      <Card.Footer style={{ 
        backgroundColor: theme === 'light' ? '#f0f7f0' : '#1a202c',
        borderTop: `1px solid ${colors.border}`,
        padding: '0.75rem 1rem',
        fontSize: '0.85rem',
        color: colors.muted
      }}>
        <ul className="mb-0 ps-3">
          <li>成本价：基于出厂价和折扣率计算，不可直接修改</li>
          <li>打包价：齿轮箱、联轴器、备用泵的组合优惠价</li>
          <li>市场价：向客户最终报价的价格，可手动调整</li>
        </ul>
      </Card.Footer>
    </Card>
  );
};

export default PriceCalculator;