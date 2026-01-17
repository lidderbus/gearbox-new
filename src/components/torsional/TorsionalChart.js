/**
 * 扭振分析图表组件
 * 使用Recharts绘制临界转速柱状图和工作转速参考线
 */
import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
  Cell
} from 'recharts';

const TorsionalChart = ({
  criticalSpeeds = [],
  operatingSpeed = 0,
  avoidanceChecks = [],
  colors = {},
  theme = 'light'
}) => {
  // 准备图表数据
  const chartData = useMemo(() => {
    return criticalSpeeds.map((cs, index) => {
      const check = avoidanceChecks[index] || {};
      return {
        name: `${cs.order}阶`,
        order: cs.order,
        criticalSpeed: cs.criticalSpeed,
        lowerLimit: check.lowerLimit || cs.criticalSpeed * 0.8,
        upperLimit: check.upperLimit || cs.criticalSpeed * 1.2,
        inDangerZone: check.inDangerZone || false
      };
    });
  }, [criticalSpeeds, avoidanceChecks]);

  // 计算Y轴范围
  const yAxisMax = useMemo(() => {
    const maxSpeed = Math.max(
      operatingSpeed,
      ...chartData.map(d => d.criticalSpeed)
    );
    return Math.ceil(maxSpeed * 1.2 / 500) * 500;
  }, [chartData, operatingSpeed]);

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(33, 33, 33, 0.95)',
            border: `1px solid ${colors.border || '#ccc'}`,
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
          }}
        >
          <p style={{ color: colors.text, fontWeight: 'bold', margin: '0 0 5px 0' }}>
            {label}激励
          </p>
          <p style={{ color: '#8884d8', margin: '2px 0' }}>
            临界转速: {data.criticalSpeed} rpm
          </p>
          <p style={{ color: '#82ca9d', margin: '2px 0' }}>
            危险区间: {data.lowerLimit} ~ {data.upperLimit} rpm
          </p>
          {data.inDangerZone && (
            <p style={{ color: '#ff4444', fontWeight: 'bold', margin: '5px 0 0 0' }}>
              工作转速在共振区间内!
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="text-muted text-center py-5">
        暂无图表数据
      </div>
    );
  }

  return (
    <div className="torsional-chart">
      <h6 className="mb-2" style={{ color: colors.headerText || colors.text }}>
        临界转速分布图
      </h6>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme === 'dark' ? '#444' : '#eee'}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: colors.text || '#666' }}
            axisLine={{ stroke: colors.border || '#ccc' }}
          />
          <YAxis
            domain={[0, yAxisMax]}
            tick={{ fill: colors.text || '#666' }}
            axisLine={{ stroke: colors.border || '#ccc' }}
            label={{
              value: '转速 (rpm)',
              angle: -90,
              position: 'insideLeft',
              fill: colors.text || '#666'
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* 临界转速柱状图 */}
          <Bar
            dataKey="criticalSpeed"
            name="临界转速"
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.inDangerZone ? '#ff4444' : '#8884d8'}
              />
            ))}
          </Bar>

          {/* 工作转速参考线 */}
          <ReferenceLine
            y={operatingSpeed}
            stroke="#ff7300"
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{
              value: `工作转速 ${operatingSpeed} rpm`,
              position: 'right',
              fill: '#ff7300',
              fontSize: 12
            }}
          />

          {/* 危险区间参考区域 (显示0.8倍和1.2倍区间) */}
          <ReferenceLine
            y={operatingSpeed * 0.8}
            stroke="#28a745"
            strokeDasharray="3 3"
            strokeOpacity={0.5}
          />
          <ReferenceLine
            y={operatingSpeed * 1.2}
            stroke="#28a745"
            strokeDasharray="3 3"
            strokeOpacity={0.5}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="d-flex justify-content-center gap-4 mt-2">
        <small className="text-muted">
          <span style={{ color: '#8884d8' }}>■</span> 临界转速 (安全)
        </small>
        <small className="text-muted">
          <span style={{ color: '#ff4444' }}>■</span> 临界转速 (危险)
        </small>
        <small className="text-muted">
          <span style={{ color: '#ff7300' }}>━</span> 工作转速
        </small>
      </div>
    </div>
  );
};

export default TorsionalChart;
