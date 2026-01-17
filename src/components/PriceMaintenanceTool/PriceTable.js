// src/components/PriceMaintenanceTool/PriceTable.js
// 可编辑价格表组件 - 支持虚拟化渲染大数据量
import React, { memo } from 'react';
import { Table, Form, InputGroup, Alert } from 'react-bootstrap';
import { FixedSizeList } from 'react-window';

// 虚拟化表格阈值 - 超过此数量时启用虚拟化
const VIRTUALIZATION_THRESHOLD = 50;

/**
 * 虚拟化行组件 - 用于大数据量时的渲染优化
 */
const VirtualizedPriceRow = memo(({ index, style, data }) => {
  const { items, onPriceChange, colors, theme } = data;
  const item = items[index];

  return (
    <div style={{ ...style, display: 'flex', borderBottom: '1px solid #dee2e6' }} className={index % 2 === 0 ? 'bg-light' : ''}>
      <div style={{ width: '50px', padding: '8px', borderRight: '1px solid #dee2e6' }}>{index + 1}</div>
      <div style={{ width: '150px', padding: '4px', borderRight: '1px solid #dee2e6' }}>
        <Form.Control
          size="sm"
          type="text"
          value={item.model || ''}
          onChange={(e) => onPriceChange(index, 'model', e.target.value)}
          style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
        />
      </div>
      <div style={{ flex: 1, padding: '4px', borderRight: '1px solid #dee2e6' }}>
        <Form.Control
          size="sm"
          type="number"
          value={item.basePrice || 0}
          onChange={(e) => onPriceChange(index, 'basePrice', e.target.value)}
          style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
        />
      </div>
      <div style={{ flex: 1, padding: '4px', borderRight: '1px solid #dee2e6' }}>
        <InputGroup size="sm">
          <Form.Control
            type="number"
            value={((item.discountRate || 0) * 100).toFixed(0)}
            onChange={(e) => onPriceChange(index, 'discountRate', e.target.value)}
            min="0"
            max="100"
            style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
          />
          <InputGroup.Text style={{ backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748', color: colors.text, borderColor: colors.inputBorder }}>%</InputGroup.Text>
        </InputGroup>
      </div>
      <div style={{ flex: 1, padding: '4px', borderRight: '1px solid #dee2e6' }}>
        <Form.Control
          size="sm"
          type="number"
          value={item.factoryPrice || 0}
          onChange={(e) => onPriceChange(index, 'factoryPrice', e.target.value)}
          style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
        />
      </div>
      <div style={{ flex: 1, padding: '4px' }}>
        <Form.Control
          size="sm"
          type="number"
          value={item.marketPrice || 0}
          onChange={(e) => onPriceChange(index, 'marketPrice', e.target.value)}
          style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
        />
      </div>
    </div>
  );
});

/**
 * 标准表格行组件
 */
const StandardPriceRow = ({ item, index, onPriceChange, colors, theme }) => (
  <tr key={`${item.model}-${index}`}>
    <td>{index + 1}</td>
    <td>
      <Form.Control
        size="sm"
        type="text"
        value={item.model || ''}
        onChange={(e) => onPriceChange(index, 'model', e.target.value)}
        style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
      />
    </td>
    <td>
      <Form.Control
        size="sm"
        type="number"
        value={item.basePrice || 0}
        onChange={(e) => onPriceChange(index, 'basePrice', e.target.value)}
        style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
      />
    </td>
    <td>
      <InputGroup size="sm">
        <Form.Control
          type="number"
          value={((item.discountRate || 0) * 100).toFixed(0)}
          onChange={(e) => onPriceChange(index, 'discountRate', e.target.value)}
          min="0"
          max="100"
          style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
        />
        <InputGroup.Text style={{
          backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748',
          color: colors.text,
          borderColor: colors.inputBorder
        }}>%</InputGroup.Text>
      </InputGroup>
    </td>
    <td>
      <Form.Control
        size="sm"
        type="number"
        value={item.factoryPrice || 0}
        onChange={(e) => onPriceChange(index, 'factoryPrice', e.target.value)}
        style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
      />
    </td>
    <td>
      <Form.Control
        size="sm"
        type="number"
        value={item.marketPrice || 0}
        onChange={(e) => onPriceChange(index, 'marketPrice', e.target.value)}
        style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
      />
    </td>
  </tr>
);

/**
 * 可编辑价格表
 * 显示和编辑价格数据，支持虚拟化渲染大数据量
 */
const PriceTable = ({
  priceData,
  loading,
  onPriceChange,
  colors = {},
  theme = 'light'
}) => {
  if (!priceData || priceData.length === 0) {
    return (
      <Alert variant="info">
        {loading ? '正在加载数据...' : '没有可显示的价格数据'}
      </Alert>
    );
  }

  // 根据数据量决定使用虚拟化还是标准表格
  const useVirtualization = priceData.length > VIRTUALIZATION_THRESHOLD;

  if (useVirtualization) {
    // 虚拟化表格 - 用于大数据量
    return (
      <div className="table-responsive">
        <div style={{ border: '1px solid #dee2e6', borderRadius: '4px' }}>
          {/* 虚拟表格头部 */}
          <div style={{ display: 'flex', backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>
            <div style={{ width: '50px', padding: '8px', borderRight: '1px solid #dee2e6' }}>#</div>
            <div style={{ width: '150px', padding: '8px', borderRight: '1px solid #dee2e6' }}>型号</div>
            <div style={{ flex: 1, padding: '8px', borderRight: '1px solid #dee2e6' }}>基础价格 (元)</div>
            <div style={{ flex: 1, padding: '8px', borderRight: '1px solid #dee2e6' }}>折扣率 (%)</div>
            <div style={{ flex: 1, padding: '8px', borderRight: '1px solid #dee2e6' }}>出厂价格 (元)</div>
            <div style={{ flex: 1, padding: '8px' }}>市场价格 (元)</div>
          </div>
          {/* 虚拟化列表 */}
          <div style={{ height: '500px' }}>
            <FixedSizeList
              height={500}
              width="100%"
              itemCount={priceData.length}
              itemSize={45}
              itemData={{ items: priceData, onPriceChange, colors, theme }}
            >
              {VirtualizedPriceRow}
            </FixedSizeList>
          </div>
          <div style={{ padding: '8px', backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748', borderTop: '1px solid #dee2e6', fontSize: '12px', color: '#6c757d' }}>
            虚拟化渲染 - 共 {priceData.length} 条记录
          </div>
        </div>
      </div>
    );
  }

  // 标准表格 - 用于小数据量
  return (
    <div className="table-responsive">
      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>#</th>
            <th style={{ width: '150px' }}>型号</th>
            <th>基础价格 (元)</th>
            <th>折扣率 (%)</th>
            <th>出厂价格 (元)</th>
            <th>市场价格 (元)</th>
          </tr>
        </thead>
        <tbody>
          {priceData.map((item, index) => (
            <StandardPriceRow
              key={`${item.model}-${index}`}
              item={item}
              index={index}
              onPriceChange={onPriceChange}
              colors={colors}
              theme={theme}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PriceTable;
