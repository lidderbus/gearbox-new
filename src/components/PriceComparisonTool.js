// src/components/PriceComparisonTool.js
import React, { useState, useEffect } from 'react';
import { Table, Form, Alert, Spinner, Badge } from 'react-bootstrap';

/**
 * 价格对比工具组件
 * 用于比较不同价格数据之间的差异
 */
const PriceComparisonTool = ({ currentData, previousData, theme = 'light', colors }) => {
  const [comparisonResults, setComparisonResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    showOnlyDifferences: true,
    differenceThreshold: 5, // 差异阈值，百分比
    sortBy: 'model',
    sortDirection: 'asc'
  });
  
  // 进行价格对比
  useEffect(() => {
    if (!currentData || !previousData) return;
    
    setLoading(true);
    
    // 延迟执行以避免UI阻塞
    setTimeout(() => {
      try {
        // 合并两个数据集的型号
        const allModels = new Set([
          ...currentData.map(item => item.model),
          ...previousData.map(item => item.model)
        ]);
        
        // 比较结果
        const results = [];
        
        allModels.forEach(model => {
          // 查找当前和之前的数据
          const current = currentData.find(item => item.model === model) || {};
          const previous = previousData.find(item => item.model === model) || {};
          
          // 计算差异百分比
          const basePrice = {
            current: current.basePrice || 0,
            previous: previous.basePrice || 0,
            difference: 0,
            percentChange: 0
          };
          
          const marketPrice = {
            current: current.marketPrice || 0,
            previous: previous.marketPrice || 0,
            difference: 0,
            percentChange: 0
          };
          
          // 计算基础价格差异
          if (basePrice.current > 0 && basePrice.previous > 0) {
            basePrice.difference = basePrice.current - basePrice.previous;
            basePrice.percentChange = (basePrice.difference / basePrice.previous) * 100;
          }
          
          // 计算市场价格差异
          if (marketPrice.current > 0 && marketPrice.previous > 0) {
            marketPrice.difference = marketPrice.current - marketPrice.previous;
            marketPrice.percentChange = (marketPrice.difference / marketPrice.previous) * 100;
          }
          
          // 添加到结果
          results.push({
            model,
            basePrice,
            marketPrice,
            status: !previous.model 
              ? 'new' 
              : !current.model 
                ? 'removed' 
                : 'existing'
          });
        });
        
        setComparisonResults(results);
      } catch (err) {
        console.error("价格比较失败:", err);
      } finally {
        setLoading(false);
      }
    }, 0);
  }, [currentData, previousData]);
  
  // 根据过滤选项筛选和排序结果
  const filteredResults = () => {
    if (!comparisonResults || comparisonResults.length === 0) return [];
    
    // 应用显示差异的过滤
    let filtered = [...comparisonResults];
    const { showOnlyDifferences, differenceThreshold, sortBy, sortDirection } = filterOptions;
    
    if (showOnlyDifferences) {
      filtered = filtered.filter(result => {
        // 新增或删除的项目始终显示
        if (result.status === 'new' || result.status === 'removed') return true;
        
        // 基础价格或市场价格差异超过阈值的项目显示
        const basePriceDiffExceedsThreshold = Math.abs(result.basePrice.percentChange) >= differenceThreshold;
        const marketPriceDiffExceedsThreshold = Math.abs(result.marketPrice.percentChange) >= differenceThreshold;
        
        return basePriceDiffExceedsThreshold || marketPriceDiffExceedsThreshold;
      });
    }
    
    // 应用排序
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'model':
          comparison = a.model.localeCompare(b.model);
          break;
        case 'basePriceDiff':
          comparison = a.basePrice.percentChange - b.basePrice.percentChange;
          break;
        case 'marketPriceDiff':
          comparison = a.marketPrice.percentChange - b.marketPrice.percentChange;
          break;
        case 'status':
          // 优先显示新增的，然后是删除的，最后是现有的
          const statusOrder = { new: 0, removed: 1, existing: 2 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  };
  
  // 获取状态徽章
  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <Badge bg="success">新增</Badge>;
      case 'removed':
        return <Badge bg="danger">删除</Badge>;
      default:
        return <Badge bg="secondary">现有</Badge>;
    }
  };
  
  // 获取差异徽章
  const getDifferenceBadge = (percentChange) => {
    if (Math.abs(percentChange) < 0.01) return null;
    
    const variant = percentChange > 0 ? 'danger' : 'success';
    const prefix = percentChange > 0 ? '+' : '';
    
    return (
      <Badge bg={variant}>{prefix}{percentChange.toFixed(2)}%</Badge>
    );
  };
  
  return (
    <div className="price-comparison-tool">
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">正在比较价格数据...</p>
        </div>
      ) : comparisonResults.length === 0 ? (
        <Alert variant="info">
          没有可比较的价格数据，请确保当前和之前的数据集都已加载。
        </Alert>
      ) : (
        <>
          <div className="mb-3 d-flex flex-wrap align-items-center">
            <Form.Group className="me-3 mb-2">
              <Form.Check
                type="switch"
                id="show-only-differences"
                label="仅显示有差异的项目"
                checked={filterOptions.showOnlyDifferences}
                onChange={(e) => setFilterOptions({
                  ...filterOptions,
                  showOnlyDifferences: e.target.checked
                })}
              />
            </Form.Group>
            
            <Form.Group className="me-3 mb-2">
              <Form.Label>差异阈值 (%)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                value={filterOptions.differenceThreshold}
                onChange={(e) => setFilterOptions({
                  ...filterOptions,
                  differenceThreshold: parseFloat(e.target.value) || 0
                })}
                style={{
                  width: '80px',
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: colors.inputBorder
                }}
              />
            </Form.Group>
            
            <Form.Group className="me-3 mb-2">
              <Form.Label>排序方式</Form.Label>
              <Form.Select
                value={filterOptions.sortBy}
                onChange={(e) => setFilterOptions({
                  ...filterOptions,
                  sortBy: e.target.value
                })}
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: colors.inputBorder
                }}
              >
                <option value="model">型号</option>
                <option value="basePriceDiff">基础价格差异</option>
                <option value="marketPriceDiff">市场价格差异</option>
                <option value="status">状态</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-2">
              <Form.Label>排序方向</Form.Label>
              <Form.Select
                value={filterOptions.sortDirection}
                onChange={(e) => setFilterOptions({
                  ...filterOptions,
                  sortDirection: e.target.value
                })}
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: colors.inputBorder
                }}
              >
                <option value="asc">升序</option>
                <option value="desc">降序</option>
              </Form.Select>
            </Form.Group>
          </div>
          
          <div className="table-responsive">
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th rowSpan="2">型号</th>
                  <th rowSpan="2">状态</th>
                  <th colSpan="3" className="text-center">基础价格 (元)</th>
                  <th colSpan="3" className="text-center">市场价格 (元)</th>
                </tr>
                <tr>
                  <th>之前</th>
                  <th>当前</th>
                  <th>差异</th>
                  <th>之前</th>
                  <th>当前</th>
                  <th>差异</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults().map((result, index) => (
                  <tr key={`${result.model}-${index}`}>
                    <td>{result.model}</td>
                    <td>{getStatusBadge(result.status)}</td>
                    <td className={result.status === 'new' ? 'text-muted' : ''}>
                      {result.basePrice.previous.toLocaleString()}
                    </td>
                    <td className={result.status === 'removed' ? 'text-muted' : ''}>
                      {result.basePrice.current.toLocaleString()}
                    </td>
                    <td>
                      {result.status === 'existing' && (
                        <>
                          {result.basePrice.difference.toLocaleString()}
                          <div>{getDifferenceBadge(result.basePrice.percentChange)}</div>
                        </>
                      )}
                    </td>
                    <td className={result.status === 'new' ? 'text-muted' : ''}>
                      {result.marketPrice.previous.toLocaleString()}
                    </td>
                    <td className={result.status === 'removed' ? 'text-muted' : ''}>
                      {result.marketPrice.current.toLocaleString()}
                    </td>
                    <td>
                      {result.status === 'existing' && (
                        <>
                          {result.marketPrice.difference.toLocaleString()}
                          <div>{getDifferenceBadge(result.marketPrice.percentChange)}</div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          
          <div className="mt-2 text-muted">
            <small>
              共显示 {filteredResults().length} 项，
              {filterOptions.showOnlyDifferences 
                ? `差异阈值 ${filterOptions.differenceThreshold}%` 
                : '显示全部项目'}
            </small>
          </div>
        </>
      )}
    </div>
  );
};

export default PriceComparisonTool;