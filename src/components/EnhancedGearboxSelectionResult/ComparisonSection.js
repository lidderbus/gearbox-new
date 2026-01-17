// src/components/EnhancedGearboxSelectionResult/ComparisonSection.js
// 齿轮箱对比展示组件
import React from 'react';
import { Table, Badge, Button, Alert } from 'react-bootstrap';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { DataCompletenessBadge } from '../selection/GearboxScorer';

/**
 * 对比表格组件
 */
export const ComparisonTable = ({
  comparisonData,
  recommendations,
  onSelectGearbox,
  thrustRequirement,
  colors = {}
}) => {
  if (comparisonData.length <= 1) {
    return (
      <Alert variant="info">
        <i className="bi bi-info-circle me-2"></i>
        请至少选择一个额外的齿轮箱进行比较
      </Alert>
    );
  }

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
            {comparisonData.map(item => (
              <th key={item.name}>
                {item.name}
                {item.isSelected && <Badge bg="success" className="ms-2">已选</Badge>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>传递能力 (kW/rpm)</strong></td>
            {comparisonData.map(item => (
              <td key={`${item.name}-capacity`}>{item['传递能力'].toFixed(6)}</td>
            ))}
          </tr>
          <tr>
            <td>减速比</td>
            {comparisonData.map(item => (
              <td key={`${item.name}-ratio`}>{item['减速比'].toFixed(2)}</td>
            ))}
          </tr>
          <tr>
            <td>能力余量 (%)</td>
            {comparisonData.map(item => (
              <td key={`${item.name}-margin`} className={
                item['能力余量(%)'] >= 5 && item['能力余量(%)'] <= 20 ? 'table-success' :
                item['能力余量(%)'] > 30 ? 'table-warning' :
                item['能力余量(%)'] < 5 ? 'table-danger' : ''
              }>
                {item['能力余量(%)'].toFixed(1)}%
              </td>
            ))}
          </tr>
          <tr>
            <td>减速比偏差 (%)</td>
            {comparisonData.map(item => (
              <td key={`${item.name}-ratio-diff`} className={
                item['减速比偏差(%)'] <= 5 ? 'table-success' :
                item['减速比偏差(%)'] > 15 ? 'table-danger' : 'table-warning'
              }>
                {item['减速比偏差(%)'].toFixed(1)}%
              </td>
            ))}
          </tr>
          <tr>
            <td>推力 (kN)</td>
            {comparisonData.map(item => (
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
            {comparisonData.map(item => (
              <td key={`${item.name}-pump-req`}>
                {item.requiresPump ?
                  <Badge bg="primary">需要</Badge> :
                  <Badge bg="secondary">不需要</Badge>}
              </td>
            ))}
          </tr>
          <tr>
            <td>重量 (kg)</td>
            {comparisonData.map(item => (
              <td key={`${item.name}-weight`}>{item['重量(kg)']}</td>
            ))}
          </tr>
          <tr>
            <td>价格 (元)</td>
            {comparisonData.map(item => (
              <td key={`${item.name}-price`}>{item['价格(元)'].toLocaleString()}</td>
            ))}
          </tr>
          <tr>
            <td>数据完整性</td>
            {comparisonData.map(item => (
              <td key={`${item.name}-completeness`}>
                <DataCompletenessBadge gearbox={item._gearbox} />
              </td>
            ))}
          </tr>
          <tr>
            <td>综合评分</td>
            {comparisonData.map(item => {
              const avgScore = (
                item.capacityScore +
                item.ratioMatchScore +
                item.thrustCapacity +
                item.efficiencyScore +
                item.pricePerformanceScore
              ) / 5;

              return (
                <td key={`${item.name}-score`} className={
                  avgScore >= 80 ? 'table-success' :
                  avgScore >= 60 ? 'table-warning' : 'table-danger'
                }>
                  {avgScore.toFixed(0)}/100
                </td>
              );
            })}
          </tr>
          <tr>
            <td>操作</td>
            {comparisonData.map(item => (
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
          <Tooltip formatter={(value) => value.toLocaleString() + ' 元'} />
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
