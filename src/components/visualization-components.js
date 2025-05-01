/**
 * 可视化组件库
 * 提供各种数据分析和结果可视化组件
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, Scatter, ScatterChart, ZAxis, AreaChart, Area
} from 'recharts';
import { 
  Card, CardContent, Button, Grid, Typography, Box, Divider, 
  TextField, MenuItem, Slider, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper,
  FormControlLabel, Switch, Chip
} from '@mui/material';

// 性能雷达图
export const PerformanceRadarChart = ({ gearboxes = [], height = 400, onClick }) => {
  // 准备雷达图数据 - 移到顶层
  const radarData = useMemo(() => {
    if (!gearboxes || gearboxes.length === 0) return [];
    
    return gearboxes.map((gearbox, index) => {
      const details = gearbox.fitnessDetails || gearbox.scoreDetails || {};
      return {
        model: gearbox.model,
        efficiency: details.efficiency || 0,
        torqueReserve: details.torqueReserve || 0,
        temperature: details.temperature || 0,
        noise: details.noise || 0,
        cost: details.cost || 0,
        lifespan: details.lifespan || 0,
        _originalGearbox: gearbox,
        _index: index
      };
    });
  }, [gearboxes]);

  // 如果没有数据，显示空状态
  if (!radarData.length) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#999' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>无可视化数据</div>
          <div>请先完成选型以查看性能雷达图</div>
        </div>
      </div>
    );
  }

  // 图表配置
  const radarProps = useMemo(() => ({
    cx: '50%',
    cy: '50%',
    outerRadius: '70%',
    stroke: '#8884d8',
    fill: '#8884d8',
    dataKey: 'value'
  }), []);

  // 图表颜色
  const colors = useMemo(() => ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00C49F'], []);

  // 处理点击事件
  const handleClick = useCallback((entry) => {
    if (onClick && typeof onClick === 'function') {
      onClick(entry._index);
    }
  }, [onClick]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={radarData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        
        {radarData.map((entry, index) => {
          const radarEntries = [
            { subject: '效率', value: entry.efficiency },
            { subject: '扭矩储备', value: entry.torqueReserve },
            { subject: '温度控制', value: entry.temperature },
            { subject: '噪音控制', value: entry.noise },
            { subject: '性价比', value: entry.cost },
            { subject: '预期寿命', value: entry.lifespan }
          ];
          
          return (
            <Radar
              key={index}
              {...radarProps}
              name={entry.model}
              data={radarEntries}
              fill={colors[index % colors.length]}
              fillOpacity={0.3}
              onClick={() => handleClick(entry)}
              style={{ cursor: onClick ? 'pointer' : 'default' }}
            />
          );
        })}
        
        <Legend />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};

// 齿轮箱比较图
export const GearboxComparisonChart = ({ gearboxes = [], compareField = 'score', height = 350, onClick }) => {
  // 状态提升到顶层
  const [selectedField, setSelectedField] = useState(compareField);

  // 可比较字段配置
  const comparableFields = useMemo(() => [
    { key: 'score', name: '综合评分' },
    { key: 'efficiency', name: '效率评分' },
    { key: 'torqueReserve', name: '扭矩储备' },
    { key: 'temperature', name: '温度控制' },
    { key: 'noise', name: '噪音控制' },
    { key: 'cost', name: '性价比' },
    { key: 'lifespan', name: '预期寿命' },
    { key: 'power', name: '功率 (kW)' },
    { key: 'ratio', name: '减速比' }
  ], []);

  // 准备图表数据
  const chartData = useMemo(() => {
    if (!gearboxes || gearboxes.length === 0) return [];

    return gearboxes.map((gearbox, index) => {
      const details = gearbox.fitnessDetails || gearbox.scoreDetails || {};
      let fieldValue = 0;
      
      switch (selectedField) {
        case 'score':
          fieldValue = gearbox.score || gearbox.fitness || 0;
          break;
        case 'efficiency':
        case 'torqueReserve':
        case 'temperature':
        case 'noise':
        case 'cost':
        case 'lifespan':
          fieldValue = details[selectedField] || 0;
          break;
        default:
          fieldValue = gearbox[selectedField] || 0;
      }
      
      return {
        name: gearbox.model,
        value: fieldValue,
        _originalGearbox: gearbox,
        _index: index
      };
    });
  }, [gearboxes, selectedField]);

  // 处理字段选择变更
  const handleFieldChange = useCallback((e) => {
    setSelectedField(e.target.value);
  }, []);

  // 处理点击事件
  const handleClick = useCallback((data) => {
    if (onClick && typeof onClick === 'function') {
      onClick(data._index);
    }
  }, [onClick]);

  if (!chartData.length) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#999' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>无可视化数据</div>
          <div>请先完成选型以查看比较图</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
        <select
          value={selectedField}
          onChange={handleFieldChange}
          style={{
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#fff'
          }}
        >
          {comparableFields.map(field => (
            <option key={field.key} value={field.key}>
              {field.name}
            </option>
          ))}
        </select>
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value) => [
              value.toFixed(2), 
              comparableFields.find(f => f.key === selectedField)?.name
            ]}
          />
          <Legend />
          <Bar
            dataKey="value"
            fill="#8884d8"
            onClick={(data) => handleClick(data)}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 效率曲线图
export const EfficiencyCurveChart = ({ gearboxData, title = '效率曲线', height = 350 }) => {
  // 没有齿轮箱数据时返回空组件
  if (!gearboxData) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#999' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>无可视化数据</div>
          <div>请先选择齿轮箱以查看效率曲线</div>
        </div>
      </div>
    );
  }
  
  // 生成效率曲线数据
  const curveData = useMemo(() => {
    // 基础效率 - 根据齿轮箱类型估算
    let baseEfficiency = 0;
    
    // 根据系列和型号估算效率
    if (gearboxData.series) {
      const series = gearboxData.series.toUpperCase();
      if (series.includes('GW')) {
        baseEfficiency = 92; // GW系列基础效率较高
      } else if (series.includes('HC') || series.includes('HCM')) {
        baseEfficiency = 90; // HC/HCM系列基础效率适中
      } else if (series.includes('DT')) {
        baseEfficiency = 88; // DT系列基础效率一般
      } else {
        baseEfficiency = 85; // 其他系列基础效率较低
      }
    } else {
      // 根据型号推断
      const model = gearboxData.model.toUpperCase();
      if (model.includes('GW')) {
        baseEfficiency = 92;
      } else if (model.includes('HC') || model.includes('HCM')) {
        baseEfficiency = 90;
      } else if (model.includes('DT')) {
        baseEfficiency = 88;
      } else {
        baseEfficiency = 85;
      }
    }
    
    // 功率范围 (20% ~ 120% 的额定功率)
    const ratedPower = gearboxData.power || 100;
    
    // 生成曲线数据点
    const dataPoints = [];
    
    for (let i = 0; i <= 12; i++) {
      const powerRatio = i * 0.1; // 0%, 10%, 20%, ... 120% 的额定功率
      const power = ratedPower * powerRatio;
      
      // 根据功率比计算效率
      let efficiency = 0;
      
      if (powerRatio <= 0.2) {
        // 低负载，效率低
        efficiency = baseEfficiency - 15 + (powerRatio / 0.2) * 10;
      } else if (powerRatio <= 0.5) {
        // 中低负载，效率提升
        efficiency = baseEfficiency - 5 + (powerRatio - 0.2) / 0.3 * 5;
      } else if (powerRatio <= 0.9) {
        // 中高负载，效率最高
        efficiency = baseEfficiency;
      } else if (powerRatio <= 1.0) {
        // 接近满载，效率略降
        efficiency = baseEfficiency - (powerRatio - 0.9) / 0.1 * 1;
      } else {
        // 过载，效率明显下降
        efficiency = baseEfficiency - 1 - (powerRatio - 1.0) / 0.2 * 5;
      }
      
      dataPoints.push({
        power,
        powerRatio: Math.round(powerRatio * 100),
        efficiency: Math.round(efficiency * 10) / 10 // 保留一位小数
      });
    }
    
    return dataPoints;
  }, [gearboxData]);
  
  // 计算当前工作点
  const currentPoint = useMemo(() => {
    if (!gearboxData.power || !gearboxData.currentPower) return null;
    
    const powerRatio = gearboxData.currentPower / gearboxData.power;
    
    // 找到最接近的数据点
    let closestPoint = curveData[0];
    let minDiff = Math.abs(closestPoint.powerRatio / 100 - powerRatio);
    
    curveData.forEach(point => {
      const diff = Math.abs(point.powerRatio / 100 - powerRatio);
      if (diff < minDiff) {
        minDiff = diff;
        closestPoint = point;
      }
    });
    
    return {
      power: gearboxData.currentPower,
      powerRatio: Math.round(powerRatio * 100),
      efficiency: closestPoint.efficiency
    };
  }, [gearboxData, curveData]);
  
  return (
    <div>
      <h6 style={{ textAlign: 'center', marginBottom: '1rem' }}>{title}</h6>
      
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={curveData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="powerRatio"
            label={{ value: '功率比 (%)', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis
            domain={[70, 100]}
            label={{ value: '效率 (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value, name) => [value + '%', name === 'efficiency' ? '效率' : name]}
            labelFormatter={(label) => `功率比: ${label}%`}
          />
          <Legend />
          
          <Line
            type="monotone"
            dataKey="efficiency"
            name="效率"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 1 }}
            activeDot={{ r: 5 }}
          />
          
          {currentPoint && (
            <Scatter
              name="当前工作点"
              data={[currentPoint]}
              fill="red"
              shape="star"
              legendType="none"
            >
              <Cell fill="red" />
            </Scatter>
          )}
        </LineChart>
      </ResponsiveContainer>
      
      <div style={{ marginTop: '1rem', fontSize: '0.9em', color: '#666', textAlign: 'center' }}>
        注：效率曲线基于齿轮箱型号特性估算，仅供参考
      </div>
    </div>
  );
};

// 评分图表
export const ScoreChart = ({ gearboxes, height = 350, onClick }) => {
  // 没有齿轮箱数据时返回空组件
  if (!gearboxes || gearboxes.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#999' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>无可视化数据</div>
          <div>请先完成选型以查看评分图表</div>
        </div>
      </div>
    );
  }
  
  // 准备评分数据
  const scoreData = useMemo(() => {
    return gearboxes.map(gearbox => ({
      name: gearbox.model,
      score: gearbox.score || gearbox.fitness || 0,
      _originalGearbox: gearbox,
      _index: gearboxes.indexOf(gearbox)
    }));
  }, [gearboxes]);
  
  // 对数据按分数排序
  const sortedData = [...scoreData].sort((a, b) => b.score - a.score);
  
  // 高分阈值
  const highScoreThreshold = 80;
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={sortedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip
          formatter={(value) => [value.toFixed(1), '综合评分']}
        />
        <Legend />
        <Bar
          dataKey="score"
          fill="#8884d8"
          onClick={(data) => onClick && onClick(data._index)}
          style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
          {sortedData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.score >= highScoreThreshold ? '#4caf50' : '#8884d8'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// 评分细分图表
export const ScoreBreakdownChart = ({ gearbox, title = '评分细分', height = 350 }) => {
  // 没有齿轮箱数据时返回空组件
  if (!gearbox) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#999' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>无可视化数据</div>
          <div>请先选择齿轮箱以查看评分细分</div>
        </div>
      </div>
    );
  }
  
  // 获取详细评分
  const details = gearbox.fitnessDetails || gearbox.scoreDetails || {};
  
  // 准备评分细分数据
  const scoreCategories = [
    { name: '效率', value: details.efficiency || 0, fill: '#4caf50' },
    { name: '扭矩储备', value: details.torqueReserve || 0, fill: '#2196f3' },
    { name: '温度控制', value: details.temperature || 0, fill: '#ff9800' },
    { name: '噪音控制', value: details.noise || 0, fill: '#9c27b0' },
    { name: '性价比', value: details.cost || 0, fill: '#f44336' },
    { name: '预期寿命', value: details.lifespan || 0, fill: '#607d8b' }
  ];
  
  return (
    <div>
      <h6 style={{ textAlign: 'center', marginBottom: '1rem' }}>{title}</h6>
      
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={scoreCategories}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="name" type="category" />
          <Tooltip
            formatter={(value) => [value.toFixed(1), '评分']}
          />
          <Legend />
          <Bar dataKey="value" name="评分">
            {scoreCategories.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div style={{ marginTop: '1rem', fontSize: '0.9em', color: '#666', textAlign: 'center' }}>
        型号: {gearbox.model} | 综合评分: {(gearbox.score || gearbox.fitness || 0).toFixed(1)}
      </div>
    </div>
  );
};

// 齿轮箱比较仪表板
export const GearboxComparisonDashboard = ({ gearboxes }) => {
  // 没有齿轮箱数据时返回空组件
  if (!gearboxes || gearboxes.length < 2) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>需要至少两个齿轮箱进行比较</div>
        <div>请选择多个齿轮箱以启用比较仪表板</div>
      </div>
    );
  }
  
  // 选择比较的齿轮箱
  const [selectedBoxes, setSelectedBoxes] = useState([0, 1]);
  const maxSelectedBoxes = 3; // 最多比较3个齿轮箱
  
  // 切换选择
  const toggleSelection = (index) => {
    setSelectedBoxes(prevSelected => {
      if (prevSelected.includes(index)) {
        // 如果已选中，则移除
        return prevSelected.filter(i => i !== index);
      } else if (prevSelected.length < maxSelectedBoxes) {
        // 如果未选中且未达到最大数量，则添加
        return [...prevSelected, index];
      }
      // 如果已达到最大数量，替换最早选择的一项
      return [...prevSelected.slice(1), index];
    });
  };
  
  // 筛选选中的齿轮箱
  const selectedGearboxes = selectedBoxes.map(index => gearboxes[index]);
  
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h5 style={{ marginBottom: '1rem' }}>选择要比较的齿轮箱 (最多{maxSelectedBoxes}个)</h5>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {gearboxes.map((gearbox, index) => (
            <Button
              key={index}
              variant={selectedBoxes.includes(index) ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => toggleSelection(index)}
              style={{ marginBottom: '0.5rem' }}
            >
              {gearbox.model}
            </Button>
          ))}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <h6>性能雷达图</h6>
          <PerformanceRadarChart gearboxes={selectedGearboxes} height={300} />
        </div>
        
        <div>
          <h6>综合评分对比</h6>
          <ScoreChart gearboxes={selectedGearboxes} height={300} />
        </div>
        
        <div style={{ gridColumn: '1 / -1' }}>
          <h6>详细参数对比</h6>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>参数</TableCell>
                  {selectedGearboxes.map((gearbox, index) => (
                    <TableCell key={index} align="right">
                      {gearbox.model}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>功率 (kW)</TableCell>
                  {selectedGearboxes.map((gearbox, index) => (
                    <TableCell key={index} align="right">
                      {gearbox.power}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>减速比</TableCell>
                  {selectedGearboxes.map((gearbox, index) => (
                    <TableCell key={index} align="right">
                      {gearbox.ratio ? gearbox.ratio.toFixed(2) : '-'}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>输入转速 (r/min)</TableCell>
                  {selectedGearboxes.map((gearbox, index) => (
                    <TableCell key={index} align="right">
                      {gearbox.inputSpeed}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>输出转速 (r/min)</TableCell>
                  {selectedGearboxes.map((gearbox, index) => (
                    <TableCell key={index} align="right">
                      {gearbox.outputSpeed ? gearbox.outputSpeed.toFixed(1) : '-'}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>重量 (kg)</TableCell>
                  {selectedGearboxes.map((gearbox, index) => (
                    <TableCell key={index} align="right">
                      {gearbox.weight || '-'}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>综合评分</TableCell>
                  {selectedGearboxes.map((gearbox, index) => (
                    <TableCell key={index} align="right">
                      {(gearbox.score || gearbox.fitness || 0).toFixed(1)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

// 参数输入表单
export const ParametersInputForm = ({ initialParams, onParamsChange, onSubmit }) => {
  // 参数状态
  const [params, setParams] = useState(initialParams || {
    power: '',
    inputSpeed: '',
    targetRatio: '',
    thrustRequirement: '',
    workCondition: 'III类:扭矩变化中等',
    temperature: '30',
    hasCover: false,
    application: 'propulsion'
  });
  
  // 工况选项
  const workConditionOptions = [
    'I类:扭矩变化很小',
    'II类:扭矩变化小',
    'III类:扭矩变化中等',
    'IV类:扭矩变化大',
    'V类:扭矩变化很大'
  ];
  
  // 应用场景选项
  const applicationOptions = [
    { value: 'propulsion', label: '主推进' },
    { value: 'auxiliary', label: '辅助推进' },
    { value: 'winch', label: '绞车' },
    { value: 'other', label: '其他' }
  ];
  
  // 处理参数变化
  const handleParamChange = (name, value) => {
    const newParams = { ...params, [name]: value };
    setParams(newParams);
    
    if (onParamsChange) {
      onParamsChange(newParams);
    }
  };
  
  // 处理提交
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (onSubmit) {
      onSubmit(params);
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="主机功率 (kW)"
            value={params.power}
            onChange={(e) => handleParamChange('power', e.target.value)}
            required
            fullWidth
            type="number"
            inputProps={{ min: 1, step: "any" }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="主机转速 (r/min)"
            value={params.inputSpeed}
            onChange={(e) => handleParamChange('inputSpeed', e.target.value)}
            required
            fullWidth
            type="number"
            inputProps={{ min: 1, step: "any" }}
            helperText="常见柴油机转速范围: 750-2200 r/min"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="目标减速比"
            value={params.targetRatio}
            onChange={(e) => handleParamChange('targetRatio', e.target.value)}
            required
            fullWidth
            type="number"
            inputProps={{ min: 0.1, step: "any" }}
            helperText="常见减速比范围: 1.5-10"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="推力要求 (kN, 可选)"
            value={params.thrustRequirement}
            onChange={(e) => handleParamChange('thrustRequirement', e.target.value)}
            fullWidth
            type="number"
            inputProps={{ min: 0, step: "any" }}
            helperText="留空则不强制匹配推力"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="工作条件"
            value={params.workCondition}
            onChange={(e) => handleParamChange('workCondition', e.target.value)}
            fullWidth
            helperText="影响联轴器选型，类别越高代表负载变化越大"
          >
            {workConditionOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="工作温度 (°C)"
            value={params.temperature}
            onChange={(e) => handleParamChange('temperature', e.target.value)}
            fullWidth
            type="number"
            inputProps={{ step: 1 }}
            helperText="常规工作温度范围: -10°C ~ 50°C"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="应用场景"
            value={params.application}
            onChange={(e) => handleParamChange('application', e.target.value)}
            fullWidth
            helperText="影响服务系数和选型策略"
          >
            {applicationOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch
                checked={params.hasCover}
                onChange={(e) => handleParamChange('hasCover', e.target.checked)}
              />
            }
            label="联轴器需要带罩壳"
          />
          <Typography variant="caption" display="block" color="textSecondary">
            带罩壳联轴器有更好的保护效果，但价格更高
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            开始选型
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

// 选型结果视图
export const SelectionResultView = ({ result, onGearboxSelect }) => {
  // 没有选型结果时返回空组件
  if (!result || !result.success) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          {result ? result.message : '没有选型结果'}
        </div>
        <div>请先进行选型以查看结果</div>
      </div>
    );
  }
  
  // 获取选型结果
  const recommendations = result.recommendations || result.results || [];
  
  // 选择当前齿轮箱
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // 选择齿轮箱
  const handleSelect = (index) => {
    setSelectedIndex(index);
    
    if (onGearboxSelect) {
      onGearboxSelect(index);
    }
  };
  
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        选型结果
      </Typography>
      
      <Typography variant="body1" paragraph>
        {result.message || `找到 ${recommendations.length} 个适合的齿轮箱`}
      </Typography>
      
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          推荐齿轮箱
        </Typography>
        
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {recommendations.map((gearbox, index) => (
            <Button
              key={index}
              variant={selectedIndex === index ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => handleSelect(index)}
            >
              {gearbox.model}
              {index === 0 && ' (最佳匹配)'}
            </Button>
          ))}
        </Box>
        
        {recommendations[selectedIndex] && (
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">
              {recommendations[selectedIndex].model}
              {recommendations[selectedIndex].isPartialMatch && (
                <Chip
                  label="部分匹配"
                  color="warning"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell width="30%">系列</TableCell>
                    <TableCell>{recommendations[selectedIndex].series || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>功率 (kW)</TableCell>
                    <TableCell>{recommendations[selectedIndex].power || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>减速比</TableCell>
                    <TableCell>
                      {recommendations[selectedIndex].ratio 
                        ? recommendations[selectedIndex].ratio.toFixed(2) 
                        : '-'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>输入转速 (r/min)</TableCell>
                    <TableCell>{recommendations[selectedIndex].inputSpeed || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>输出转速 (r/min)</TableCell>
                    <TableCell>
                      {recommendations[selectedIndex].outputSpeed 
                        ? recommendations[selectedIndex].outputSpeed.toFixed(1) 
                        : '-'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>重量 (kg)</TableCell>
                    <TableCell>{recommendations[selectedIndex].weight || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>综合评分</TableCell>
                    <TableCell>
                      {(recommendations[selectedIndex].score || 
                        recommendations[selectedIndex].fitness || 0).toFixed(1)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
      
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          性能分析
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ScoreBreakdownChart
              gearbox={recommendations[selectedIndex]}
              title="评分细分"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <EfficiencyCurveChart
              gearboxData={recommendations[selectedIndex]}
              title="效率曲线"
            />
          </Grid>
        </Grid>
      </Box>
      
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          推荐比较
        </Typography>
        
        <PerformanceRadarChart
          gearboxes={recommendations.slice(0, 3)}
          height={350}
          onClick={handleSelect}
        />
      </Box>
    </div>
  );
};

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