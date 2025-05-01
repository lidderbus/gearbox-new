/**
 * 齿轮箱选型系统高级数据可视化组件
 * 提供各种图表和交互式可视化功能，增强用户体验
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  AreaChart, Area, RadarChart, Radar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell, Sector
} from 'recharts';
import { 
  Card, CardHeader, CardContent, Typography, Box, 
  Grid, Paper, Divider, Tabs, Tab, ButtonGroup, Button,
  FormControl, InputLabel, Select, MenuItem, Chip, 
  Slider, Switch, FormControlLabel, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

/**
 * 性能对比雷达图组件
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} - 渲染的组件
 */
export function PerformanceRadarChart({ gearboxes, aspectsToShow, height = 400, onClick, showLegend = true }) {
  const [activeIndex, setActiveIndex] = useState(null);
  
  // 格式化雷达图数据
  const formatRadarData = (gearboxes, aspectsToShow) => {
    if (!gearboxes || !Array.isArray(gearboxes) || gearboxes.length === 0) {
      return [];
    }
    
    // 默认展示的性能指标
    const defaultAspects = [
      { key: 'efficiency', name: '效率' },
      { key: 'torqueReserve', name: '扭矩储备' },
      { key: 'temperature', name: '温度控制' },
      { key: 'noise', name: '噪音控制' },
      { key: 'cost', name: '成本效益' },
      { key: 'lifespan', name: '预期寿命' }
    ];
    
    // 使用指定的指标，或者默认指标
    const aspects = aspectsToShow || defaultAspects;
    
    // 准备雷达图数据结构
    const radarData = aspects.map(aspect => {
      const dataPoint = {
        aspect: aspect.name || aspect.key
      };
      
      // 为每个齿轮箱添加对应指标的值
      gearboxes.forEach((gearbox, index) => {
        // 从评分数据或原始数据中获取指标值
        let value;
        
        if (gearbox.fitnessDetails && gearbox.fitnessDetails[aspect.key] !== undefined) {
          // 使用评分数据
          value = gearbox.fitnessDetails[aspect.key];
        } else if (gearbox.gearbox) {
          // 从齿轮箱数据中获取
          value = gearbox.gearbox[aspect.key];
          
          // 如果是评分数据，从fitnessDetails中获取
          if (gearbox.fitnessDetails && gearbox.fitnessDetails[aspect.key] !== undefined) {
            value = gearbox.fitnessDetails[aspect.key];
          }
        } else {
          // 直接从对象获取
          value = gearbox[aspect.key];
        }
        
        // 确保值在0-100之间
        if (typeof value === 'number') {
          value = Math.max(0, Math.min(100, value));
        } else {
          // 默认值
          value = 0;
        }
        
        // 使用型号或索引作为键
        const modelName = (gearbox.gearbox && gearbox.gearbox.model) || 
                          gearbox.model || 
                          `齿轮箱${index + 1}`;
        
        dataPoint[modelName] = value;
      });
      
      return dataPoint;
    });
    
    return radarData;
  };
  
  // 生成雷达图数据
  const radarData = formatRadarData(gearboxes, aspectsToShow);
  
  // 如果没有有效数据，显示提示信息
  if (radarData.length === 0) {
    return (
      <Box 
        sx={{ 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px dashed #ccc',
          borderRadius: '4px'
        }}
      >
        <Typography variant="subtitle1" color="textSecondary">
          无可用数据展示
        </Typography>
      </Box>
    );
  }
  
  // 提取所有齿轮箱型号
  const allModels = gearboxes.map((gearbox, index) => 
    (gearbox.gearbox && gearbox.gearbox.model) || 
    gearbox.model || 
    `齿轮箱${index + 1}`
  );
  
  // 图表颜色
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C', '#8884D8'];
  
  // 处理图例点击事件
  const handleLegendClick = (entry) => {
    const index = allModels.indexOf(entry.value);
    if (index !== -1 && onClick) {
      onClick(gearboxes[index]);
    }
  };
  
  // 配置雷达图
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart 
        cx="50%" 
        cy="50%" 
        outerRadius="70%" 
        data={radarData}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="aspect" tick={{ fill: '#666', fontSize: 12 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
        
        {/* 为每个齿轮箱绘制雷达线 */}
        {allModels.map((model, index) => (
          <Radar 
            key={`radar-${index}`}
            name={model}
            dataKey={model}
            stroke={COLORS[index % COLORS.length]}
            fill={COLORS[index % COLORS.length]}
            fillOpacity={0.2}
            activeDot={{ r: 6, onClick: () => handleLegendClick({ value: model }) }}
          />
        ))}
        
        {showLegend && (
          <Legend 
            onClick={handleLegendClick}
            wrapperStyle={{ paddingTop: '10px' }} 
          />
        )}
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}

/**
 * 齿轮箱参数对比图组件
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} - 渲染的组件
 */
export function GearboxComparisonChart({ gearboxes, parameter, title, height = 300, barColors, onClick }) {
  // 默认颜色
  const defaultColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C'];
  const colors = barColors || defaultColors;
  
  // 提取需要比较的参数数据
  const formatComparisonData = (gearboxes, parameter) => {
    if (!gearboxes || !Array.isArray(gearboxes) || gearboxes.length === 0) {
      return [];
    }
    
    return gearboxes.map((gearbox, index) => {
      // 从齿轮箱对象中提取数据和模型名称
      let value = 0;
      let modelName = '';
      
      if (gearbox.gearbox) {
        // 处理评估结果格式
        value = gearbox.gearbox[parameter] || 0;
        modelName = gearbox.gearbox.model || `型号${index + 1}`;
      } else {
        // 直接处理齿轮箱对象
        value = gearbox[parameter] || 0;
        modelName = gearbox.model || `型号${index + 1}`;
      }
      
      return {
        name: modelName,
        value: value,
        fill: colors[index % colors.length],
        originalIndex: index
      };
    });
  };
  
  // 生成比较数据
  const comparisonData = formatComparisonData(gearboxes, parameter);
  
  // 参数名称映射
  const parameterNames = {
    ratio: '减速比',
    power: '功率 (kW)',
    inputSpeed: '输入转速 (rpm)',
    outputSpeed: '输出转速 (rpm)',
    weight: '重量 (kg)',
    length: '长度 (mm)',
    width: '宽度 (mm)',
    height: '高度 (mm)',
    basePrice: '基础价格',
    efficiency: '效率得分',
    torqueReserve: '扭矩储备得分',
    temperature: '温度控制得分',
    noise: '噪音控制得分',
    cost: '成本效益得分',
    lifespan: '预期寿命得分'
  };
  
  // 获取参数显示名称
  const paramName = parameterNames[parameter] || parameter;
  
  // 如果没有有效数据，显示提示信息
  if (comparisonData.length === 0) {
    return (
      <Box 
        sx={{ 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px dashed #ccc',
          borderRadius: '4px'
        }}
      >
        <Typography variant="subtitle1" color="textSecondary">
          无可用数据展示
        </Typography>
      </Box>
    );
  }
  
  // 处理图表点击事件
  const handleClick = (data) => {
    if (onClick && typeof onClick === 'function') {
      onClick(gearboxes[data.originalIndex]);
    }
  };
  
  // 横向条形图，适合比较单个参数
  return (
    <Card>
      {title && (
        <CardHeader 
          title={title} 
          titleTypographyProps={{ variant: 'h6' }}
          sx={{ pb: 0 }}
        />
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            layout="vertical"
            data={comparisonData}
            margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" label={{ value: paramName, position: 'insideBottom', offset: -5 }} />
            <YAxis type="category" dataKey="name" width={100} />
            <Tooltip formatter={(value) => `${value} ${parameter === 'ratio' ? '' : (parameter === 'power' ? 'kW' : '')}`} />
            <Bar 
              dataKey="value" 
              onClick={handleClick}
              cursor="pointer"
            >
              {comparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/**
 * 效率曲线图组件
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} - 渲染的组件
 */
export function EfficiencyCurveChart({ gearboxData, powerRange, title, height = 400 }) {
  // 生成效率曲线数据
  const generateEfficiencyData = (gearbox, powerRange) => {
    // 如果没有有效数据，返回空数组
    if (!gearbox) return [];
    
    // 提取齿轮箱对象
    const gearboxObj = gearbox.gearbox || gearbox;
    
    // 齿轮箱额定功率
    const ratedPower = gearboxObj.power || 100;
    
    // 默认功率范围为额定功率的10%-120%
    const minPower = powerRange?.min || ratedPower * 0.1;
    const maxPower = powerRange?.max || ratedPower * 1.2;
    
    // 生成功率点（20个点）
    const powerStep = (maxPower - minPower) / 19;
    const powerPoints = Array.from({ length: 20 }, (_, i) => minPower + i * powerStep);
    
    // 计算每个功率点的效率
    return powerPoints.map(power => {
      // 功率比
      const powerRatio = power / ratedPower;
      
      // 简化的效率计算模型
      let efficiency;
      
      if (powerRatio <= 0.2) {
        // 轻载情况，效率较低
        efficiency = 0.75 + powerRatio * 0.5;
      } else if (powerRatio <= 0.4) {
        // 效率随负载上升
        efficiency = 0.85 + (powerRatio - 0.2) * 0.25;
      } else if (powerRatio <= 0.9) {
        // 正常工作区间，效率较高
        efficiency = 0.90 + (powerRatio - 0.4) * 0.08;
      } else if (powerRatio <= 1.0) {
        // 接近额定功率，效率最高
        efficiency = 0.94 + (powerRatio - 0.9) * 0.04;
      } else {
        // 超载情况，效率下降
        efficiency = 0.98 - (powerRatio - 1.0) * 0.1;
      }
      
      // 加入一些随机扰动，使曲线更真实
      const randomFactor = 1 + (Math.random() * 0.01 - 0.005);
      efficiency *= randomFactor;
      
      // 确保效率在合理范围内
      efficiency = Math.max(0.7, Math.min(0.99, efficiency));
      
      return {
        power: Math.round(power * 10) / 10, // 保留一位小数
        efficiency: Math.round(efficiency * 1000) / 10, // 转换为百分比并保留一位小数
        powerRatio: Math.round(powerRatio * 100)  // 功率比(%)
      };
    });
  };
  
  // 生成效率数据
  const efficiencyData = generateEfficiencyData(gearboxData, powerRange);
  
  // 如果没有有效数据，显示提示信息
  if (efficiencyData.length === 0) {
    return (
      <Box 
        sx={{ 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px dashed #ccc',
          borderRadius: '4px'
        }}
      >
        <Typography variant="subtitle1" color="textSecondary">
          无可用数据展示
        </Typography>
      </Box>
    );
  }
  
  // 为图表准备附加信息
  const gearbox = gearboxData.gearbox || gearboxData;
  const modelName = gearbox.model || '未指定型号';
  const ratedPower = gearbox.power || 100;
  
  // 效率曲线图（线图）
  return (
    <Card>
      {title && (
        <CardHeader 
          title={title} 
          titleTypographyProps={{ variant: 'h6' }}
          sx={{ pb: 0 }}
        />
      )}
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          型号: {modelName} | 额定功率: {ratedPower} kW
        </Typography>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={efficiencyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="power" 
              label={{ value: '功率 (kW)', position: 'insideBottomRight', offset: -10 }} 
            />
            <YAxis 
              domain={[70, 100]} 
              label={{ value: '效率 (%)', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'efficiency') return `${value} %`;
                return value;
              }} 
              labelFormatter={(value) => `功率: ${value} kW`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="efficiency" 
              stroke="#0088FE" 
              activeDot={{ r: 6 }} 
              strokeWidth={2}
              name="效率"
            />
            
            {/* 额定功率线 */}
            <ReferenceLine 
              x={ratedPower} 
              stroke="red" 
              strokeDasharray="3 3" 
              label={{ 
                value: '额定功率', 
                position: 'top',
                fill: 'red',
                fontSize: 12
              }} 
            />
            
            {/* 最佳效率点 */}
            {efficiencyData.reduce((max, point) => 
              point.efficiency > max.efficiency ? point : max, { efficiency: 0 })
              .power !== ratedPower && (
              <ReferenceLine 
                x={efficiencyData.reduce((max, point) => 
                  point.efficiency > max.efficiency ? point : max, { efficiency: 0 })
                  .power} 
                stroke="green" 
                strokeDasharray="3 3" 
                label={{ 
                  value: '最佳效率', 
                  position: 'top',
                  fill: 'green',
                  fontSize: 12
                }} 
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/**
 * 综合评分图组件
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} - 渲染的组件
 */
export function ScoreChart({ gearboxes, title, height = 300, onClick }) {
  // 准备数据
  const formatScoreData = (gearboxes) => {
    if (!gearboxes || !Array.isArray(gearboxes) || gearboxes.length === 0) {
      return [];
    }
    
    return gearboxes.map((gearbox, index) => {
      let score = 0;
      let modelName = '';
      
      if (gearbox.fitness !== undefined) {
        // 评估结果格式
        score = gearbox.fitness;
        modelName = (gearbox.gearbox && gearbox.gearbox.model) || `型号${index + 1}`;
      } else if (gearbox.score !== undefined) {
        // 原始评分格式
        score = gearbox.score;
        modelName = gearbox.model || `型号${index + 1}`;
      } else {
        // 无评分数据
        score = 0;
        modelName = gearbox.model || `型号${index + 1}`;
      }
      
      return {
        name: modelName,
        score: Math.round(score * 10) / 10, // 保留一位小数
        originalIndex: index
      };
    });
  };
  
  const scoreData = formatScoreData(gearboxes);
  
  // 如果没有有效数据，显示提示信息
  if (scoreData.length === 0) {
    return (
      <Box 
        sx={{ 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px dashed #ccc',
          borderRadius: '4px'
        }}
      >
        <Typography variant="subtitle1" color="textSecondary">
          无可用数据展示
        </Typography>
      </Box>
    );
  }
  
  // 处理图表点击事件
  const handleClick = (data) => {
    if (onClick && typeof onClick === 'function') {
      onClick(gearboxes[data.originalIndex]);
    }
  };
  
  // 使用条形图展示各齿轮箱评分
  return (
    <Card>
      {title && (
        <CardHeader 
          title={title} 
          titleTypographyProps={{ variant: 'h6' }}
          sx={{ pb: 0 }}
        />
      )}
     <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={scoreData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} label={{ value: '评分', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => `${value} 分`} />
            <Bar 
              dataKey="score" 
              onClick={handleClick}
              cursor="pointer"
            >
              {scoreData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.score >= 80 ? '#4CAF50' : 
                        entry.score >= 60 ? '#2196F3' : 
                        entry.score >= 40 ? '#FF9800' : '#F44336'} 
                />
              ))}
            </Bar>
            <ReferenceLine y={60} stroke="#FF9800" strokeDasharray="3 3" label="及格线" />
            <ReferenceLine y={80} stroke="#4CAF50" strokeDasharray="3 3" label="优秀线" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/**
 * 详细评分组成图组件
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} - 渲染的组件
 */
export function ScoreBreakdownChart({ gearbox, title, height = 350 }) {
  // 准备数据
  const formatBreakdownData = (gearbox) => {
    if (!gearbox) return [];
    
    // 提取评分详情
    let fitnessDetails;
    
    if (gearbox.fitnessDetails) {
      fitnessDetails = gearbox.fitnessDetails;
    } else if (gearbox.gearbox && gearbox.fitnessDetails) {
      fitnessDetails = gearbox.fitnessDetails;
    } else {
      // 无评分数据
      return [];
    }
    
    // 创建雷达图数据
    return [
      { name: '效率', value: fitnessDetails.efficiency || 0 },
      { name: '扭矩储备', value: fitnessDetails.torqueReserve || 0 },
      { name: '温度控制', value: fitnessDetails.temperature || 0 },
      { name: '噪音控制', value: fitnessDetails.noise || 0 },
      { name: '成本效益', value: fitnessDetails.cost || 0 },
      { name: '预期寿命', value: fitnessDetails.lifespan || 0 }
    ];
  };
  
  const breakdownData = formatBreakdownData(gearbox);
  
  // 如果没有有效数据，显示提示信息
  if (breakdownData.length === 0) {
    return (
      <Box 
        sx={{ 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px dashed #ccc',
          borderRadius: '4px'
        }}
      >
        <Typography variant="subtitle1" color="textSecondary">
          无可用评分详情
        </Typography>
      </Box>
    );
  }
  
  // 为图表准备附加信息
  const gearboxObj = gearbox.gearbox || gearbox;
  const modelName = gearboxObj.model || '未指定型号';
  const overallScore = gearbox.fitness || 0;
  
  // 定义颜色函数
  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#2196F3';
    if (score >= 40) return '#FF9800';
    return '#F44336';
  };
  
  // 使用雷达图展示评分细分
  return (
    <Card>
      {title && (
        <CardHeader 
          title={title} 
          titleTypographyProps={{ variant: 'h6' }}
          sx={{ pb: 0 }}
        />
      )}
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          型号: {modelName} | 总评分: {Math.round(overallScore * 10) / 10}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <ResponsiveContainer width="100%" height={height}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={breakdownData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#666', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="评分"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip formatter={(value) => `${value} 分`} />
              </RadarChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <TableContainer component={Paper} sx={{ height: height }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>评分项</TableCell>
                    <TableCell align="right">得分</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {breakdownData.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right" sx={{ color: getScoreColor(row.value) }}>
                        {Math.round(row.value * 10) / 10}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                      总评分
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: getScoreColor(overallScore) }}>
                      {Math.round(overallScore * 10) / 10}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

/**
 * 多齿轮箱综合对比组件
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} - 渲染的组件
 */
export function GearboxComparisonDashboard({ gearboxes, onSelectGearbox }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedGearbox, setSelectedGearbox] = useState(null);
  
  // 标签页变更处理
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  
  // 齿轮箱选择处理
  const handleGearboxSelect = (gearbox) => {
    setSelectedGearbox(gearbox);
    if (onSelectGearbox) {
      onSelectGearbox(gearbox);
    }
  };
  
  // 如果没有数据，显示提示信息
  if (!gearboxes || !Array.isArray(gearboxes) || gearboxes.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="subtitle1" color="textSecondary">
          未提供齿轮箱数据，无法进行比较
        </Typography>
      </Paper>
    );
  }
  
  // 确保选中的齿轮箱存在
  useEffect(() => {
    if (!selectedGearbox && gearboxes.length > 0) {
      setSelectedGearbox(gearboxes[0]);
    }
  }, [gearboxes, selectedGearbox]);
  
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ mb: 2 }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="性能雷达图" />
          <Tab label="综合评分" />
          <Tab label="关键参数" />
          <Tab label="效率曲线" />
          <Tab label="详细比较表" />
        </Tabs>
        
        {/* 性能雷达图 */}
        {selectedTab === 0 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              性能六维评分
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              此雷达图显示各齿轮箱在六个关键性能维度的得分，便于直观比较。点击图例或线条可选中对应齿轮箱。
            </Typography>
            <PerformanceRadarChart 
              gearboxes={gearboxes} 
              height={400}
              onClick={handleGearboxSelect}
            />
          </Box>
        )}
        
        {/* 综合评分 */}
        {selectedTab === 1 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              齿轮箱综合评分
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              此图表显示各齿轮箱的综合评分，评分由性能、成本、寿命等多方面因素综合计算得出。点击柱状可选中对应齿轮箱。
            </Typography>
            <ScoreChart 
              gearboxes={gearboxes}
              height={350}
              onClick={handleGearboxSelect}
            />
          </Box>
        )}
        
        {/* 关键参数 */}
        {selectedTab === 2 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              关键参数对比
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              以下图表展示各齿轮箱的关键技术参数，便于直观对比差异。点击柱状可选中对应齿轮箱。
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <GearboxComparisonChart 
                  gearboxes={gearboxes} 
                  parameter="ratio" 
                  title="减速比对比"
                  onClick={handleGearboxSelect}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <GearboxComparisonChart 
                  gearboxes={gearboxes} 
                  parameter="power" 
                  title="功率对比 (kW)"
                  onClick={handleGearboxSelect}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <GearboxComparisonChart 
                  gearboxes={gearboxes} 
                  parameter="weight" 
                  title="重量对比 (kg)"
                  onClick={handleGearboxSelect}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <GearboxComparisonChart 
                  gearboxes={gearboxes} 
                  parameter="inputSpeed" 
                  title="输入转速对比 (rpm)"
                  onClick={handleGearboxSelect}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* 效率曲线 */}
        {selectedTab === 3 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              效率曲线
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              此图表展示选中齿轮箱在不同负载下的效率表现。通过曲线可以判断齿轮箱在实际工况下的效率水平。
            </Typography>
            <Box sx={{ mb: 2 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="gearbox-select-label">选择齿轮箱</InputLabel>
                <Select
                  labelId="gearbox-select-label"
                  value={selectedGearbox ? gearboxes.indexOf(selectedGearbox) : 0}
                  label="选择齿轮箱"
                  onChange={(e) => handleGearboxSelect(gearboxes[e.target.value])}
                >
                  {gearboxes.map((gearbox, index) => {
                    const model = (gearbox.gearbox && gearbox.gearbox.model) || 
                                  gearbox.model || 
                                  `齿轮箱${index + 1}`;
                    return (
                      <MenuItem key={index} value={index}>
                        {model}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            {selectedGearbox && (
              <EfficiencyCurveChart 
                gearboxData={selectedGearbox}
                height={400}
              />
            )}
          </Box>
        )}
        
        {/* 详细比较表 */}
        {selectedTab === 4 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              详细参数比较
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              下表列出所有齿轮箱的详细技术参数和评分数据，便于全面对比各项指标。
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>参数</TableCell>
                    {gearboxes.map((gearbox, index) => {
                      const model = (gearbox.gearbox && gearbox.gearbox.model) || 
                                    gearbox.model || 
                                    `齿轮箱${index + 1}`;
                      return (
                        <TableCell key={index} align="right">{model}</TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* 基本参数 */}
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                      综合评分
                    </TableCell>
                    {gearboxes.map((gearbox, index) => {
                      const score = gearbox.fitness !== undefined ? 
                                    gearbox.fitness : 
                                    (gearbox.score !== undefined ? gearbox.score : 0);
                      return (
                        <TableCell 
                          key={index} 
                          align="right"
                          sx={{ color: score >= 80 ? '#4CAF50' : 
                                score >= 60 ? '#2196F3' : 
                                score >= 40 ? '#FF9800' : '#F44336', 
                               fontWeight: 'bold' }}
                        >
                          {Math.round(score * 10) / 10}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">功率 (kW)</TableCell>
                    {gearboxes.map((gearbox, index) => {
                      const power = (gearbox.gearbox && gearbox.gearbox.power) || 
                                    gearbox.power || 0;
                      return (
                        <TableCell key={index} align="right">{power}</TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">减速比</TableCell>
                    {gearboxes.map((gearbox, index) => {
                      const ratio = (gearbox.gearbox && gearbox.gearbox.ratio) || 
                                    gearbox.ratio || 0;
                      return (
                        <TableCell key={index} align="right">{ratio}</TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">输入转速 (rpm)</TableCell>
                    {gearboxes.map((gearbox, index) => {
                      const inputSpeed = (gearbox.gearbox && gearbox.gearbox.inputSpeed) || 
                                        gearbox.inputSpeed || 0;
                      return (
                        <TableCell key={index} align="right">{inputSpeed}</TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">输出转速 (rpm)</TableCell>
                    {gearboxes.map((gearbox, index) => {
                      const outputSpeed = (gearbox.gearbox && gearbox.gearbox.outputSpeed) || 
                                         gearbox.outputSpeed || 0;
                      return (
                        <TableCell key={index} align="right">{outputSpeed}</TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">重量 (kg)</TableCell>
                    {gearboxes.map((gearbox, index) => {
                      const weight = (gearbox.gearbox && gearbox.gearbox.weight) || 
                                    gearbox.weight || 0;
                      return (
                        <TableCell key={index} align="right">{weight}</TableCell>
                      );
                    })}
                  </TableRow>
                  
                  {/* 详细评分 */}
                  <TableRow>
                    <TableCell colSpan={gearboxes.length + 1} sx={{ backgroundColor: '#f5f5f5' }}>
                      <Typography variant="subtitle2">详细评分</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">效率评分</TableCell>
                    {gearboxes.map((gearbox, index) => {
                      let score = 0;
                      if (gearbox.fitnessDetails && gearbox.fitnessDetails.efficiency !== undefined) {
                        score = gearbox.fitnessDetails.efficiency;
                      }
                      return (
                        <TableCell 
                          key={index} 
                          align="right"
                          sx={{ color: score >= 80 ? '#4CAF50' : 
                                score >= 60 ? '#2196F3' : 
                                score >= 40 ? '#FF9800' : '#F44336' }}
                        >
                          {Math.round(score * 10) / 10}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">扭矩储备评分</TableCell>
                    {gearboxes.map((gearbox, index) => {
                      let score = 0;
                      if (gearbox.fitnessDetails && gearbox.fitnessDetails.torqueReserve !== undefined) {
                        score = gearbox.fitnessDetails.torqueReserve;
                      }
                      return (
                        <TableCell 
                          key={index} 
                          align="right"
                          sx={{ color: score >= 80 ? '#4CAF50' : 
                                score >= 60 ? '#2196F3' : 
                                score >= 40 ? '#FF9800' : '#F44336' }}
                        >
                          {Math.round(score * 10) / 10}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">温度控制评分</TableCell>
                    {gearboxes.map((gearbox, index) => {
                      let score = 0;
                      if (gearbox.fitnessDetails && gearbox.fitnessDetails.temperature !== undefined) {
                        score = gearbox.fitnessDetails.temperature;
                      }
                      return (
                        <TableCell 
                          key={index} 
                          align="right"
                          sx={{ color: score >= 80 ? '#4CAF50' : 
                                score >= 60 ? '#2196F3' : 
                                score >= 40 ? '#FF9800' : '#F44336' }}
                        >
                          {Math.round(score * 10) / 10}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">噪音控制评分</TableCell>
                    {gearboxes.map((gearbox, index) => {
                      let score = 0;
                      if (gearbox.fitnessDetails && gearbox.fitnessDetails.noise !== undefined) {
                        score = gearbox.fitnessDetails.noise;
                      }
                      return (
                        <TableCell 
                          key={index} 
                          align="right"
                          sx={{ color: score >= 80 ? '#4CAF50' : 
                                score >= 60 ? '#2196F3' : 
                                score >= 40 ? '#FF9800' : '#F44336' }}
                        >
                          {Math.round(score * 10) / 10}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">成本效益评分</TableCell>
                    {gearboxes.map((gearbox, index) => {
                      let score = 0;
                      if (gearbox.fitnessDetails && gearbox.fitnessDetails.cost !== undefined) {
                        score = gearbox.fitnessDetails.cost;
                      }
                      return (
                        <TableCell 
                          key={index} 
                          align="right"
                          sx={{ color: score >= 80 ? '#4CAF50' : 
                                score >= 60 ? '#2196F3' : 
                                score >= 40 ? '#FF9800' : '#F44336' }}
                        >
                          {Math.round(score * 10) / 10}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">寿命评分</TableCell>
                    {gearboxes.map((gearbox, index) => {
                      let score = 0;
                      if (gearbox.fitnessDetails && gearbox.fitnessDetails.lifespan !== undefined) {
                        score = gearbox.fitnessDetails.lifespan;
                      }
                      return (
                        <TableCell 
                          key={index} 
                          align="right"
                          sx={{ color: score >= 80 ? '#4CAF50' : 
                                score >= 60 ? '#2196F3' : 
                                score >= 40 ? '#FF9800' : '#F44336' }}
                        >
                          {Math.round(score * 10) / 10}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>
      
      {/* 详细评分细分 */}
      {selectedGearbox && (
        <ScoreBreakdownChart 
          gearbox={selectedGearbox}
          title="选中齿轮箱评分细分"
        />
      )}
    </Box>
  );
}

/**
 * 参数输入表单组件
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} - 渲染的组件
 */
export function ParametersInputForm({ initialValues, onSubmit, presets }) {
  // 表单状态
  const [formValues, setFormValues] = useState(initialValues || {
    power: '',
    inputSpeed: '',
    targetRatio: '',
    thrustRequirement: '',
    workCondition: 'III类:扭矩变化中等',
    temperature: 30,
    hasCover: false
  });
  
  // 预设工况选项
  const defaultPresets = [
    {
      name: '渔船',
      values: {
        power: 150,
        inputSpeed: 1800,
        targetRatio: 4.5,
        workCondition: 'IV类:扭矩变化大',
        temperature: 35
      }
    },
    {
      name: '货船',
      values: {
        power: 500,
        inputSpeed: 1500,
        targetRatio: 5.2,
        workCondition: 'III类:扭矩变化中等',
        temperature: 30
      }
    },
    {
      name: '客船',
      values: {
        power: 350,
        inputSpeed: 1600,
        targetRatio: 4.8,
        workCondition: 'II类:扭矩变化小',
        temperature: 28
      }
    }
  ];
  
  // 使用自定义预设或默认预设
  const workPresets = presets || defaultPresets;
  
  // 工况选项
  const workConditionOptions = [
    { value: 'I类:扭矩变化很小', label: 'I类：扭矩变化很小' },
    { value: 'II类:扭矩变化小', label: 'II类：扭矩变化小' },
    { value: 'III类:扭矩变化中等', label: 'III类：扭矩变化中等' },
    { value: 'IV类:扭矩变化大', label: 'IV类：扭矩变化大' },
    { value: 'V类:扭矩变化很大', label: 'V类：扭矩变化很大' }
  ];
  
  // 应用预设配置
  const applyPreset = (preset) => {
    setFormValues(prev => ({
      ...prev,
      ...preset.values
    }));
  };
  
  // 处理输入变化
  const handleInputChange = (field, value) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // 处理提交事件
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formValues);
    }
  };
  
  // 渲染表单
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          选型参数
        </Typography>
        
        {/* 预设配置按钮 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            快速配置预设:
          </Typography>
          <ButtonGroup variant="outlined" size="small">
            {workPresets.map((preset, index) => (
              <Button 
                key={index} 
                onClick={() => applyPreset(preset)}
              >
                {preset.name}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
        
        <Grid container spacing={3}>
          {/* 功率输入 */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="功率 (kW)"
              type="number"
              fullWidth
              required
              value={formValues.power}
              onChange={(e) => handleInputChange('power', e.target.value)}
              InputProps={{
                endAdornment: <Typography variant="caption">kW</Typography>
              }}
              helperText="发动机额定功率"
            />
          </Grid>
          
          {/* 输入转速 */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="输入转速 (rpm)"
              type="number"
              fullWidth
              required
              value={formValues.inputSpeed}
              onChange={(e) => handleInputChange('inputSpeed', e.target.value)}
              InputProps={{
                endAdornment: <Typography variant="caption">rpm</Typography>
              }}
              helperText="发动机额定转速"
            />
          </Grid>
          
          {/* 目标减速比 */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="目标减速比"
              type="number"
              fullWidth
              value={formValues.targetRatio}
              onChange={(e) => handleInputChange('targetRatio', e.target.value)}
              helperText="输入/输出转速比值 (可选)"
            />
          </Grid>
          
          {/* 推力要求 */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="推力要求 (kN)"
              type="number"
              fullWidth
              value={formValues.thrustRequirement}
              onChange={(e) => handleInputChange('thrustRequirement', e.target.value)}
              InputProps={{
                endAdornment: <Typography variant="caption">kN</Typography>
              }}
              helperText="齿轮箱承受的轴向力 (可选)"
            />
          </Grid>
          
          {/* 工况选择 */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>工况</InputLabel>
              <Select
                value={formValues.workCondition}
                label="工况"
                onChange={(e) => handleInputChange('workCondition', e.target.value)}
              >
                {workConditionOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>负载变化特性</FormHelperText>
            </FormControl>
          </Grid>
          
          {/* 环境温度 */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ width: '100%' }}>
              <Typography gutterBottom>
                环境温度: {formValues.temperature}°C
              </Typography>
              <Slider
                value={formValues.temperature}
                min={0}
                max={60}
                step={1}
                onChange={(e, newValue) => handleInputChange('temperature', newValue)}
                valueLabelDisplay="auto"
                valueLabelFormat={value => `${value}°C`}
                marks={[
                  { value: 0, label: '0°C' },
                  { value: 30, label: '30°C' },
                  { value: 60, label: '60°C' }
                ]}
              />
              <FormHelperText>工作环境温度</FormHelperText>
            </Box>
          </Grid>
          
          {/* 齿轮箱盖选项 */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formValues.hasCover}
                  onChange={(e) => handleInputChange('hasCover', e.target.checked)}
                  color="primary"
                />
              }
              label="带检修盖"
            />
            <FormHelperText>是否需要检修盖设计</FormHelperText>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large"
          >
            开始选型计算
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

/**
 * 选型结果展示组件
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} - 渲染的组件
 */
export function SelectionResultView({ results, requirements, onSelectGearbox }) {
  const [selectedGearbox, setSelectedGearbox] = useState(null);
  const [viewMode, setViewMode] = useState('visual');
  
  // 处理齿轮箱选择
  const handleGearboxSelect = (gearbox) => {
    setSelectedGearbox(gearbox);
    if (onSelectGearbox) {
      onSelectGearbox(gearbox);
    }
  };
  
  // 处理视图模式切换
  const handleViewModeChange = (e, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };
  
  // 如果无结果，显示提示信息
  if (!results || !results.results || results.results.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="subtitle1" color="textSecondary">
          未找到匹配的齿轮箱。请尝试调整选型参数。
        </Typography>
      </Paper>
    );
  }
  
  // 确保有选择的齿轮箱
  useEffect(() => {
    if (!selectedGearbox && results.results.length > 0) {
      setSelectedGearbox(results.results[0]);
    }
  }, [results, selectedGearbox]);
  
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          选型结果
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          根据您的需求，系统找到了 {results.results.length} 个匹配的齿轮箱型号。
          以下结果按综合评分排序，显示每个齿轮箱的性能、参数和适用性评估。
        </Typography>
        
        {/* 视图模式切换 */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
          >
            <ToggleButton value="visual">
              <Tooltip title="图表视图">
                <InsertChartIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="table">
              <Tooltip title="表格视图">
                <TableChartIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="card">
              <Tooltip title="卡片视图">
                <ViewModuleIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
          
          <Chip 
            label={`算法: ${results.algorithm?.type === 'genetic' ? '遗传算法' : '传统算法'}`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>
        
        {/* 图表视图 */}
        {viewMode === 'visual' && (
          <GearboxComparisonDashboard 
            gearboxes={results.results}
            onSelectGearbox={handleGearboxSelect}
          />
        )}
        
        {/* 表格视图 */}
        {viewMode === 'table' && (
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>型号</TableCell>
                  <TableCell align="right">评分</TableCell>
                  <TableCell align="right">功率 (kW)</TableCell>
                  <TableCell align="right">减速比</TableCell>
                  <TableCell align="right">输入转速 (rpm)</TableCell>
                  <TableCell align="right">输出转速 (rpm)</TableCell>
                  <TableCell align="right">重量 (kg)</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.results.map((result, index) => {
                  const gearbox = result.gearbox;
                  return (
                    <TableRow 
                      key={index}
                      selected={selectedGearbox === result}
                      hover
                      onClick={() => handleGearboxSelect(result)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell component="th" scope="row">
                        {gearbox.model}
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: result.fitness >= 80 ? '#4CAF50' : 
                                result.fitness >= 60 ? '#2196F3' : 
                                result.fitness >= 40 ? '#FF9800' : '#F44336',
                          fontWeight: 'bold'
                        }}
                      >
                        {Math.round(result.fitness * 10) / 10}
                      </TableCell>
                      <TableCell align="right">{gearbox.power}</TableCell>
                      <TableCell align="right">{gearbox.ratio}</TableCell>
                      <TableCell align="right">{gearbox.inputSpeed}</TableCell>
                      <TableCell align="right">{gearbox.outputSpeed}</TableCell>
                      <TableCell align="right">{gearbox.weight}</TableCell>
                      <TableCell align="right">
                        <Button 
                          size="small" 
                          variant={selectedGearbox === result ? "contained" : "outlined"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGearboxSelect(result);
                          }}
                        >
                          选择
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {/* 卡片视图 */}
        {viewMode === 'card' && (
          <Grid container spacing={2}>
            {results.results.map((result, index) => {
              const gearbox = result.gearbox;
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    variant={selectedGearbox === result ? "outlined" : "elevation"}
                    sx={{ 
                      cursor: 'pointer',
                      borderColor: selectedGearbox === result ? 'primary.main' : 'transparent',
                      borderWidth: selectedGearbox === result ? 2 : 0
                    }}
                    onClick={() => handleGearboxSelect(result)}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {gearbox.model}
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: result.fitness >= 80 ? '#4CAF50' : 
                                result.fitness >= 60 ? '#2196F3' : 
                                result.fitness >= 40 ? '#FF9800' : '#F44336'
                        }}
                      >
                        {Math.round(result.fitness * 10) / 10} 分
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">功率:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">{gearbox.power} kW</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">减速比:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">{gearbox.ratio}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">输入转速:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">{gearbox.inputSpeed} rpm</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">输出转速:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">{gearbox.outputSpeed} rpm</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">重量:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">{gearbox.weight} kg</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        color="primary"
                        variant={selectedGearbox === result ? "contained" : "outlined"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGearboxSelect(result);
                        }}
                        fullWidth
                      >
                        {selectedGearbox === result ? "已选择" : "选择此型号"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Paper>
      
      {/* 显示选中的齿轮箱详情 */}
      {selectedGearbox && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            已选齿轮箱详情
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ScoreBreakdownChart 
                gearbox={selectedGearbox}
                title="性能评分细分"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <EfficiencyCurveChart 
                gearboxData={selectedGearbox}
                title="效率曲线"
              />
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

export default {
  PerformanceRadarChart,
  GearboxComparisonChart,
  EfficiencyCurveChart,
  ScoreChart,
  ScoreBreakdownChart,
  GearboxComparisonDashboard,
  ParametersInputForm,
  SelectionResultView
};