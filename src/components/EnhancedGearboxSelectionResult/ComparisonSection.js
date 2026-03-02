// src/components/EnhancedGearboxSelectionResult/ComparisonSection.js
// 齿轮箱对比展示组件
import React, { useState, useMemo } from 'react';
import { Table, Badge, Button, Alert } from 'react-bootstrap';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { DataCompletenessBadge } from '../selection/GearboxScorer';
import { formatPrice } from '../../utils/priceFormatter';

/**
 * Extract series name from model string
 */
const getSeriesFromModel = (model) => {
  if (!model) return '其他';
  const upper = model.toUpperCase();
  if (upper.startsWith('HCG')) return 'HCG系列';
  if (upper.startsWith('HCS')) return 'HCS系列';
  if (upper.startsWith('HCD')) return 'HCD系列';
  if (upper.startsWith('HCM')) return 'HCM系列';
  if (upper.startsWith('HCT')) return 'HCT系列';
  if (upper.startsWith('HCQ')) return 'HCQ系列';
  if (upper.startsWith('HC')) return 'HC系列';
  if (upper.startsWith('GWC') || upper.startsWith('GWS')) return 'GW系列';
  if (upper.startsWith('GC')) return 'GC系列';
  if (upper.startsWith('DT')) return 'DT系列';
  if (upper.startsWith('J')) return 'J系列';
  return '其他';
};

/**
 * Compute average score for a comparison item
 */
const getAvgScore = (item) => (
  (item.capacityScore + item.ratioMatchScore + item.thrustCapacity + item.efficiencyScore + item.pricePerformanceScore) / 5
);

/**
 * 对比表格组件 (with sort + best-value highlighting)
 */
export const ComparisonTable = ({
  comparisonData,
  recommendations,
  onSelectGearbox,
  thrustRequirement,
  colors = {}
}) => {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortCol) return comparisonData;
    return [...comparisonData].sort((a, b) => {
      let va, vb;
      if (sortCol === 'score') {
        va = getAvgScore(a); vb = getAvgScore(b);
      } else {
        va = a[sortCol] ?? 0; vb = b[sortCol] ?? 0;
      }
      return sortDir === 'asc' ? va - vb : vb - va;
    });
  }, [comparisonData, sortCol, sortDir]);

  // Compute best values for highlighting
  const best = useMemo(() => {
    if (comparisonData.length <= 1) return {};
    const margins = comparisonData.map(d => d['能力余量(%)']);
    return {
      margin: margins.reduce((a, b) => Math.abs(a - 15) <= Math.abs(b - 15) ? a : b),
      ratioDev: Math.min(...comparisonData.map(d => d['减速比偏差(%)'])),
      weight: Math.min(...comparisonData.map(d => d['重量(kg)'] || Infinity)),
      price: Math.min(...comparisonData.filter(d => d['价格(元)'] > 0).map(d => d['价格(元)'])),
      score: Math.max(...comparisonData.map(d => getAvgScore(d)))
    };
  }, [comparisonData]);

  const bestStyle = { fontWeight: 'bold', color: '#28a745' };
  const isBest = (item, field) => {
    if (field === 'margin') return item['能力余量(%)'] === best.margin;
    if (field === 'ratioDev') return item['减速比偏差(%)'] === best.ratioDev;
    if (field === 'weight') return item['重量(kg)'] === best.weight;
    if (field === 'price') return item['价格(元)'] > 0 && item['价格(元)'] === best.price;
    if (field === 'score') return getAvgScore(item) === best.score;
    return false;
  };

  if (comparisonData.length <= 1) {
    return (
      <Alert variant="info">
        <i className="bi bi-info-circle me-2"></i>
        请至少选择一个额外的齿轮箱进行比较
      </Alert>
    );
  }

  const sortIcon = (col) => {
    if (sortCol !== col) return <i className="bi bi-chevron-expand ms-1 opacity-25" style={{ fontSize: '0.7rem' }}></i>;
    return sortDir === 'asc'
      ? <i className="bi bi-caret-up-fill ms-1" style={{ fontSize: '0.7rem' }}></i>
      : <i className="bi bi-caret-down-fill ms-1" style={{ fontSize: '0.7rem' }}></i>;
  };

  const sortableHeader = (label, col) => (
    <td style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort(col)}>
      <strong>{label}</strong>{sortIcon(col)}
    </td>
  );

  return (
    <div className="comparison-table-container">
      <Table bordered hover responsive className="comparison-table" style={{
        backgroundColor: colors?.card,
        color: colors?.text,
        borderColor: colors?.border
      }}>
        <thead>
          <tr>
            <th>特性</th>
            {sortedData.map(item => (
              <th key={item.name}>
                {item.name}
                {item.isSelected && <Badge bg="success" className="ms-2">已选</Badge>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>系列</td>
            {sortedData.map(item => (
              <td key={`${item.name}-series`}>
                <Badge bg="light" text="dark" className="border">{getSeriesFromModel(item.name)}</Badge>
              </td>
            ))}
          </tr>
          <tr>
            {sortableHeader('传递能力 (kW/rpm)', '传递能力')}
            {sortedData.map(item => (
              <td key={`${item.name}-capacity`}>{item['传递能力'].toFixed(6)}</td>
            ))}
          </tr>
          <tr>
            <td>减速比</td>
            {sortedData.map(item => (
              <td key={`${item.name}-ratio`}>{item['减速比'].toFixed(2)}</td>
            ))}
          </tr>
          <tr>
            {sortableHeader('能力余量 (%)', '能力余量(%)')}
            {sortedData.map(item => (
              <td key={`${item.name}-margin`}
                className={
                  item['能力余量(%)'] >= 5 && item['能力余量(%)'] <= 20 ? 'table-success' :
                  item['能力余量(%)'] > 30 ? 'table-warning' :
                  item['能力余量(%)'] < 5 ? 'table-danger' : ''
                }
                style={isBest(item, 'margin') ? bestStyle : {}}
              >
                {item['能力余量(%)'].toFixed(1)}%
              </td>
            ))}
          </tr>
          <tr>
            {sortableHeader('减速比偏差 (%)', '减速比偏差(%)')}
            {sortedData.map(item => (
              <td key={`${item.name}-ratio-diff`}
                className={
                  item['减速比偏差(%)'] <= 5 ? 'table-success' :
                  item['减速比偏差(%)'] > 15 ? 'table-danger' : 'table-warning'
                }
                style={isBest(item, 'ratioDev') ? bestStyle : {}}
              >
                {item['减速比偏差(%)'].toFixed(1)}%
              </td>
            ))}
          </tr>
          <tr>
            <td>推力 (kN)</td>
            {sortedData.map(item => (
              <td key={`${item.name}-thrust`}>
                {item['推力(kN)'] || '-'}
                {thrustRequirement > 0 && (
                  item['推力(kN)'] >= thrustRequirement ?
                    <Badge bg="success" className="ms-2">满足</Badge> :
                    <Badge bg="danger" className="ms-2">不满足</Badge>
                )}
              </td>
            ))}
          </tr>
          <tr>
            <td>备用泵需求</td>
            {sortedData.map(item => (
              <td key={`${item.name}-pump-req`}>
                {item.requiresPump ?
                  <Badge bg="primary">需要</Badge> :
                  <Badge bg="secondary">不需要</Badge>}
              </td>
            ))}
          </tr>
          <tr>
            {sortableHeader('重量 (kg)', '重量(kg)')}
            {sortedData.map(item => (
              <td key={`${item.name}-weight`} style={isBest(item, 'weight') ? bestStyle : {}}>
                {item['重量(kg)']}
              </td>
            ))}
          </tr>
          <tr>
            {sortableHeader('价格 (元)', '价格(元)')}
            {sortedData.map(item => (
              <td key={`${item.name}-price`} style={isBest(item, 'price') ? bestStyle : {}}>
                {formatPrice(item['价格(元)'])}
              </td>
            ))}
          </tr>
          <tr>
            <td>数据完整性</td>
            {sortedData.map(item => (
              <td key={`${item.name}-completeness`}>
                <DataCompletenessBadge gearbox={item._gearbox} />
              </td>
            ))}
          </tr>
          <tr>
            {sortableHeader('综合评分', 'score')}
            {sortedData.map(item => {
              const avgScore = getAvgScore(item);
              return (
                <td key={`${item.name}-score`}
                  className={
                    avgScore >= 80 ? 'table-success' :
                    avgScore >= 60 ? 'table-warning' : 'table-danger'
                  }
                  style={isBest(item, 'score') ? bestStyle : {}}
                >
                  {avgScore.toFixed(0)}/100
                </td>
              );
            })}
          </tr>
          <tr>
            <td>操作</td>
            {sortedData.map(item => (
              <td key={`${item.name}-actions`}>
                {!item.isSelected && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => onSelectGearbox(recommendations.findIndex(g => g.model === item.name))}
                  >
                    选择
                  </Button>
                )}
                {item.isSelected && (
                  <Badge bg="success">当前选择</Badge>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

/**
 * 价格对比柱状图
 */
export const PriceComparisonChart = ({
  comparisonData,
  colors = {},
  theme = 'light'
}) => {
  if (comparisonData.length <= 1) {
    return null;
  }

  return (
    <div className="chart-container mt-4">
      <h6 style={{ color: colors?.headerText }}>价格对比</h6>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={comparisonData}
          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e0e0e0' : '#4a4a4a'} />
          <XAxis
            dataKey="name"
            tick={{ fill: colors?.text, angle: -45, textAnchor: 'end' }}
            height={70}
          />
          <YAxis />
          <Tooltip formatter={(value) => formatPrice(value)} />
          <Legend wrapperStyle={{ bottom: 0 }} />
          <Bar dataKey="价格(元)" name="市场价格" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * 性能雷达图(折线图形式)
 */
export const PerformanceChart = ({
  comparisonData,
  colors = {},
  theme = 'light'
}) => {
  if (comparisonData.length <= 1) {
    return null;
  }

  // 准备雷达图数据
  const radarData = comparisonData.map(item => ({
    name: item.name,
    '传递能力': item.capacityScore,
    '减速比匹配': item.ratioMatchScore,
    '推力能力': item.thrustCapacity,
    '效率': item.efficiencyScore,
    '性价比': item.pricePerformanceScore,
    isSelected: item.isSelected
  }));

  return (
    <div className="chart-container mt-4">
      <h6 style={{ color: colors?.headerText }}>性能雷达图</h6>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={radarData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e0e0e0' : '#4a4a4a'} />
          <XAxis dataKey="name" tick={{ fill: colors?.text }} />
          <YAxis domain={[0, 100]} tick={{ fill: colors?.text }} />
          <Tooltip />
          <Legend />
          {Object.keys(radarData[0]).filter(key => !['name', 'isSelected'].includes(key)).map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={`hsl(${index * 60}, 70%, 50%)`}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default {
  ComparisonTable,
  PriceComparisonChart,
  PerformanceChart
};
