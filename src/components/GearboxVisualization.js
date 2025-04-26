// src/components/GearboxVisualization.js
import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

/**
 * 齿轮箱选型数据可视化组件
 * 提供各种图表展示选型结果
 */
const GearboxVisualization = ({ 
  selectionResult, 
  selectedGearbox, 
  recommendations = [], 
  colors, 
  theme = 'light' 
}) => {
  if (!selectionResult || !selectedGearbox) return null;
  
  // 获取需要比较的齿轮箱，最多5个
  const compareItems = recommendations.slice(0, 5).map(item => ({
    name: item.model,
    ratio: item.selectedRatio || item.ratio || 0,
    ratioDiffPercent: item.ratioDiffPercent || 0, 
    capacity: item.selectedCapacity || (Array.isArray(item.transferCapacity) ? item.transferCapacity[0] : 0),
    capacityMargin: item.capacityMargin || 0,
    price: item.marketPrice || 0,
    weight: item.weight || 0,
    thrust: item.thrust || 0,
    isSelected: item.model === selectedGearbox.model
  }));
  
  // 为饼图生成数据
  const createCapacityPieData = () => {
    // 确保所需能力和已选能力存在
    const requiredCapacity = selectionResult.requiredTransferCapacity || 0;
    const selectedCapacity = selectedGearbox.selectedCapacity || 
      (Array.isArray(selectedGearbox.transferCapacity) ? selectedGearbox.transferCapacity[0] : 0);
    
    // 计算余量
    const margin = Math.max(0, selectedCapacity - requiredCapacity);
    
    return [
      { name: '所需能力', value: requiredCapacity, fill: '#82ca9d' },
      { name: '能力余量', value: margin, fill: '#8884d8' }
    ];
  };
  
  // 为雷达图生成数据
  const createRadarData = () => {
    // 获取前3个推荐的齿轮箱
    const compareItems = recommendations.slice(0, 3).map(item => {
      // 计算每个指标的得分 (满分100)
      const score = {
        name: item.model,
        '减速比': 100 - Math.min(item.ratioDiffPercent || 0, 100),
        '传递能力': Math.min(((item.capacityMargin || 0) <= 50 ? item.capacityMargin || 0 : 100 - ((item.capacityMargin || 0) - 50)), 100),
        '重量': 100 - Math.min(((item.weight || 0) / (selectedGearbox.weight || 1) * 100) - 100, 100),
        '价格': 100 - Math.min(((item.marketPrice || 0) / (selectedGearbox.marketPrice || 1) * 100) - 100, 100),
        '推力': Math.min((item.thrust || 0) / (selectionResult.thrustRequirement || 1) * 100, 100)
      };
      return score;
    });
    
    return compareItems;
  };
  
  // 为柱状图生成数据
  const createBarData = () => {
    return recommendations.slice(0, 5).map(item => ({
      name: item.model,
      '传递能力': item.selectedCapacity || (Array.isArray(item.transferCapacity) ? item.transferCapacity[0] : 0),
      '能力余量(%)': item.capacityMargin || 0,
      '减速比': item.selectedRatio || item.ratio || 0,
      '推力(kN)': item.thrust || 0,
      isSelected: item.model === selectedGearbox.model
    }));
  };
  
  // 自定义工具提示
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="custom-tooltip" 
          style={{ 
            backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(33, 33, 33, 0.9)',
            border: `1px solid ${colors.border}`,
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
          }}
        >
          <p style={{ color: colors.text, fontWeight: 'bold', margin: '0 0 5px 0' }}>{payload[0].payload.name}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color, margin: '2px 0' }}>
              {`${entry.name}: ${entry.value.toFixed(entry.name.includes('%') ? 1 : 4)}`}
            </p>
          ))}
          {payload[0].payload.isSelected && (
            <p style={{ color: '#ff7300', fontWeight: 'bold', margin: '5px 0 0 0' }}>已选择</p>
          )}
        </div>
      );
    }
    return null;
  };
  
  // 雷达图字体样式
  const radarFontStyle = {
    fontSize: 12,
    fill: colors.text
  };
  
  // 返回可视化组件
  return (
    <div className="gearbox-visualization">
      <div className="row">
        <div className="col-md-6 mb-4">
          <h6 style={{ color: colors.headerText }}>传递能力组成</h6>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={createCapacityPieData()}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {createCapacityPieData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="col-md-6 mb-4">
          <h6 style={{ color: colors.headerText }}>性能雷达图</h6>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart outerRadius={90} data={createRadarData()}>
              <PolarGrid stroke={theme === 'light' ? '#e0e0e0' : '#4a4a4a'} />
              <PolarAngleAxis dataKey="name" tick={radarFontStyle} />
              <PolarRadiusAxis domain={[0, 100]} tick={radarFontStyle} />
              {createRadarData().map((entry, index) => (
                <Radar
                  key={entry.name}
                  name={entry.name}
                  dataKey={(key) => key !== 'name' ? entry[key] : 0}
                  stroke={entry.name === selectedGearbox.model ? '#ff7300' : `hsl(${index * 120}, 70%, 50%)`}
                  fill={entry.name === selectedGearbox.model ? '#ff7300' : `hsl(${index * 120}, 70%, 50%)`}
                  fillOpacity={0.3}
                />
              ))}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="row mt-2">
        <div className="col-12">
          <h6 style={{ color: colors.headerText }}>齿轮箱性能对比</h6>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={createBarData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e0e0e0' : '#4a4a4a'} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: colors.text, angle: -45, textAnchor: 'end' }} 
                height={60} 
              />
              <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
              <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ bottom: 0 }} />
              <Bar yAxisId="left" dataKey="传递能力" fill="#82ca9d" />
              <Bar yAxisId="right" dataKey="能力余量(%)" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GearboxVisualization;