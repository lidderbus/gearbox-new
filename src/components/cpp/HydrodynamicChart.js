// src/components/cpp/HydrodynamicChart.js
// CPP敞水性能曲线图表组件

import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceDot
} from 'recharts';
import { generateOpenWaterCurves } from '../../utils/cppHydrodynamics';

/**
 * 敞水性能曲线图表
 * 显示 J-KT, J-10KQ, J-η0 曲线
 */
const HydrodynamicChart = ({
  propeller,              // 调距桨数据
  operatingPoint = null,  // 工况点 {J, name}
  height = 350
}) => {
  // 生成敞水性能曲线数据
  const chartData = useMemo(() => {
    if (!propeller?.bladeGeometry) {
      // 使用默认参数
      return generateOpenWaterCurves({
        areaRatio: 0.55,
        pitchRatio: 1.0,
        bladeCount: 4
      });
    }

    const { areaRatio, pitchRatio } = propeller.bladeGeometry;
    const bladeCount = propeller.bladeCount?.[0] || 4;

    return generateOpenWaterCurves({
      areaRatio,
      pitchRatio,
      bladeCount
    });
  }, [propeller]);

  // 转换为recharts格式
  const data = useMemo(() => {
    return chartData.J.map((J, index) => ({
      J,
      KT: chartData.KT[index],
      '10KQ': chartData.KQ[index] * 10,
      eta0: chartData.eta0[index]
    }));
  }, [chartData]);

  // 最优效率点
  const optimalPoint = chartData.optimalPoint;

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>J = {label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '4px 0', color: entry.color }}>
              {entry.name}: {entry.value.toFixed(4)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', background: '#fff', borderRadius: '8px', padding: '16px' }}>
      <div style={{ marginBottom: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
          敞水性能曲线 (Wageningen B-series估算)
        </h4>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#666' }}>
          {propeller?.model ? `${propeller.model} - ` : ''}
          盘面比: {propeller?.bladeGeometry?.areaRatio || 0.55} |
          桨距比: {propeller?.bladeGeometry?.pitchRatio || 1.0} |
          叶数: {propeller?.bladeCount?.[0] || 4}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis
            dataKey="J"
            domain={[0, 1.2]}
            tickCount={7}
            label={{ value: 'J (进速系数)', position: 'bottom', offset: 0, fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            domain={[0, 0.5]}
            tickCount={6}
            label={{ value: 'KT, 10KQ', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 0.8]}
            tickCount={5}
            label={{ value: 'η₀', angle: 90, position: 'insideRight', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => {
              const labels = {
                'KT': 'KT (推力系数)',
                '10KQ': '10KQ (扭矩系数)',
                'eta0': 'η₀ (敞水效率)'
              };
              return labels[value] || value;
            }}
          />

          {/* KT曲线 */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="KT"
            stroke="#1890ff"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />

          {/* 10KQ曲线 */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="10KQ"
            stroke="#52c41a"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />

          {/* eta0曲线 */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="eta0"
            stroke="#fa541c"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />

          {/* 最优效率点 */}
          <ReferenceDot
            yAxisId="right"
            x={optimalPoint.J}
            y={optimalPoint.eta0}
            r={6}
            fill="#fa541c"
            stroke="#fff"
            strokeWidth={2}
          />

          {/* 工况点标注 */}
          {operatingPoint && (
            <ReferenceLine
              x={operatingPoint.J}
              yAxisId="left"
              stroke="#722ed1"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{
                value: operatingPoint.name || '工况点',
                position: 'top',
                fill: '#722ed1',
                fontSize: 12
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* 图例说明 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '12px',
        padding: '8px 12px',
        background: '#f5f5f5',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <span>
          <span style={{ color: '#fa541c', fontWeight: 'bold' }}>●</span>
          {' '}最优效率点: J={optimalPoint.J}, η₀={optimalPoint.eta0.toFixed(3)}
        </span>
        {operatingPoint && (
          <span>
            <span style={{ color: '#722ed1', fontWeight: 'bold' }}>|</span>
            {' '}当前工况: J={operatingPoint.J}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * 工况对比图表
 * 显示不同工况下的推力、效率等对比
 */
export const OperatingPointsChart = ({
  operatingData,  // analyzeOperatingPoints() 返回的数据
  height = 280
}) => {
  if (!operatingData || operatingData.length === 0) {
    return <div>无工况数据</div>;
  }

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = operatingData.find(d => d.condition === label);
      return (
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          <p style={{ margin: '4px 0', color: '#666' }}>{data?.description}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '4px 0', color: entry.color }}>
              {entry.name}: {entry.value.toFixed(3)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', background: '#fff', borderRadius: '8px', padding: '16px' }}>
      <div style={{ marginBottom: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
          工况性能对比
        </h4>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={operatingData}
          margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis
            dataKey="condition"
            angle={-30}
            textAnchor="end"
            height={60}
            fontSize={11}
          />
          <YAxis
            yAxisId="left"
            domain={[0, 'auto']}
            label={{ value: '推力 (kN)', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 1]}
            label={{ value: 'η₀', angle: 90, position: 'insideRight', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="thrust"
            name="推力"
            stroke="#1890ff"
            strokeWidth={2}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="eta0"
            name="敞水效率"
            stroke="#fa541c"
            strokeWidth={2}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * 效率分解图表
 * 显示推进效率各分项
 */
export const EfficiencyBreakdownChart = ({
  efficiencyData,  // calculatePropulsionEfficiency() 返回的数据
  height = 200
}) => {
  if (!efficiencyData) {
    return <div>无效率数据</div>;
  }

  const { efficiency } = efficiencyData;

  const data = [
    { name: 'η₀\n敞水', value: efficiency.eta0, color: '#1890ff' },
    { name: 'ηH\n船身', value: efficiency.etaH, color: '#52c41a' },
    { name: 'ηR\n相对旋转', value: efficiency.etaR, color: '#faad14' },
    { name: 'ηT\n传动', value: efficiency.etaT, color: '#722ed1' },
    { name: 'ηS\n轴系', value: efficiency.etaS, color: '#eb2f96' },
    { name: 'ηTotal\n总效率', value: efficiency.etaTotal, color: '#fa541c' }
  ];

  return (
    <div style={{ width: '100%', background: '#fff', borderRadius: '8px', padding: '16px' }}>
      <div style={{ marginBottom: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
          推进效率分解
        </h4>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#666' }}>
          ηTotal = η₀ × ηH × ηR × ηT × ηS = {(efficiency.etaTotal * 100).toFixed(1)}%
          {' '}
          <span style={{
            padding: '2px 8px',
            background: efficiency.etaTotal >= 0.55 ? '#d4edda' :
                       efficiency.etaTotal >= 0.50 ? '#fff3cd' : '#f8d7da',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>
            {efficiencyData.rating}
          </span>
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              textAlign: 'center',
              padding: '12px',
              minWidth: '80px'
            }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: `conic-gradient(${item.color} ${item.value * 360}deg, #eee ${item.value * 360}deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                color: item.color
              }}>
                {(item.value * 100).toFixed(0)}%
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#666', whiteSpace: 'pre-line' }}>
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HydrodynamicChart;
