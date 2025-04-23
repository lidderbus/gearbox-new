// src/components/selection/CouplingScorer.js
// 联轴器评分器组件 - 计算和展示联轴器的匹配分数

import React, { useState, useEffect } from 'react';
import { Card, Table, ProgressBar, Form, Row, Col, Alert } from 'react-bootstrap';
import { couplingWorkFactorMap, getTemperatureFactor } from '../../data/gearboxMatchingMaps';

/**
 * 联轴器评分器组件
 * @param {Object} props - 组件属性
 * @param {Object} props.coupling - 联轴器数据
 * @param {Object} props.gearbox - 齿轮箱数据
 * @param {number} props.engineTorque - 发动机扭矩 (N·m)
 * @param {string} props.workCondition - 工况条件
 * @param {number} props.temperature - 工作温度
 * @param {string} props.recommendedPrefix - 推荐前缀
 * @param {string} props.recommendedModel - 推荐型号
 * @param {number} props.engineSpeed - 发动机转速
 * @param {Object} props.theme - 主题设置
 * @param {Object} props.colors - 颜色设置
 * @returns {JSX.Element}
 */
const CouplingScorer = ({
  coupling,
  gearbox,
  engineTorque,
  workCondition = "III类:扭矩变化中等",
  temperature = 30,
  recommendedPrefix,
  recommendedModel,
  engineSpeed,
  theme = 'light',
  colors = {}
}) => {
  // 评分状态
  const [scores, setScores] = useState({
    torqueMargin: 0,    // 扭矩余量评分 (0-50分)
    modelMatch: 0,      // 型号匹配评分 (0-30分)
    speedFit: 0,        // 转速匹配评分 (0-10分)
    weightPrice: 0,     // 重量价格评分 (0-10分)
    total: 0            // 总评分 (0-100分)
  });
  
  const [requiredTorque, setRequiredTorque] = useState(0);
  const [torqueMargin, setTorqueMargin] = useState(0);
  const [warnings, setWarnings] = useState([]);
  
  // 计算评分
  useEffect(() => {
    if (!coupling || !engineTorque) {
      return;
    }
    
    // 重置警告
    const newWarnings = [];
    
    // 1. 计算所需联轴器扭矩
    const kFactor = couplingWorkFactorMap[workCondition] || couplingWorkFactorMap.default;
    const stFactor = getTemperatureFactor(parseFloat(temperature));
    const requiredCouplingTorque = engineTorque * kFactor * stFactor / 1000;
    setRequiredTorque(requiredCouplingTorque);
    
    // 2. 计算各项评分
    let torqueMarginScore = 0;
    let modelMatchScore = 0;
    let speedFitScore = 0;
    let weightPriceScore = 0;
    
    // 2.1 扭矩余量评分 (50分)
    if (coupling.torque >= requiredCouplingTorque) {
      const margin = ((coupling.torque / requiredCouplingTorque) - 1) * 100;
      setTorqueMargin(margin);
      
      if (margin >= 10 && margin <= 30) {
        torqueMarginScore = 50; // 最佳余量范围(10-30%)
      } else if (margin > 30 && margin <= 50) {
        torqueMarginScore = 40; // 余量偏大(30-50%)
        newWarnings.push(`扭矩余量偏大(${margin.toFixed(1)}%)，可能造成过度选型`);
      } else if (margin > 50) {
        torqueMarginScore = 30; // 余量过大(>50%)
        newWarnings.push(`扭矩余量过大(${margin.toFixed(1)}%)，强烈建议选择更小型号`);
      } else { // 0 <= margin < 10
        torqueMarginScore = 35; // 余量偏小但满足要求(0-10%)
        newWarnings.push(`扭矩余量较小(${margin.toFixed(1)}%)，建议选择更大型号`);
      }
    } else {
      torqueMarginScore = 0; // 不满足扭矩要求
      newWarnings.push(`该联轴器扭矩(${coupling.torque}kN·m)不满足要求(${requiredCouplingTorque.toFixed(3)}kN·m)`);
    }
    
    // 2.2 型号匹配评分 (30分)
    if (recommendedModel && coupling.model === recommendedModel) {
      modelMatchScore = 30; // 完全匹配
    } else if (recommendedPrefix && coupling.model.startsWith(recommendedPrefix)) {
      modelMatchScore = 20; // 前缀匹配
    } else {
      modelMatchScore = 5; // 无匹配
      if (recommendedModel) {
        newWarnings.push(`该联轴器(${coupling.model})与推荐型号(${recommendedModel})不匹配`);
      } else if (recommendedPrefix) {
        newWarnings.push(`该联轴器(${coupling.model})与推荐型号前缀(${recommendedPrefix})不匹配`);
      }
    }
    
    // 2.3 转速匹配评分 (10分)
    if (coupling.maxSpeed && engineSpeed) {
      if (coupling.maxSpeed >= engineSpeed) {
        const speedMargin = ((coupling.maxSpeed / engineSpeed) - 1) * 100;
        if (speedMargin <= 20) {
          speedFitScore = 10; // 理想转速范围
        } else if (speedMargin <= 50) {
          speedFitScore = 8; // 转速余量较大
        } else {
          speedFitScore = 5; // 转速余量过大
        }
      } else {
        speedFitScore = 0; // 转速不满足要求
        newWarnings.push(`该联轴器最大转速(${coupling.maxSpeed}r/min)低于发动机转速(${engineSpeed}r/min)`);
      }
    } else {
      speedFitScore = 5; // 无转速数据
    }
    
    // 2.4 重量和价格评分 (10分)
    // 假设重量超过2000kg得0分
    const weightScore = Math.max(0, 5 - (coupling.weight / 2000) * 5);
    // 假设价格超过100000元得0分
    const priceScore = Math.max(0, 5 - (coupling.price / 100000) * 5);
    weightPriceScore = weightScore + priceScore;
    
    // 计算总分
    const totalScore = torqueMarginScore + modelMatchScore + speedFitScore + weightPriceScore;
    
    // 更新评分
    setScores({
      torqueMargin: torqueMarginScore,
      modelMatch: modelMatchScore,
      speedFit: speedFitScore,
      weightPrice: weightPriceScore,
      total: totalScore
    });
    
    // 更新警告
    setWarnings(newWarnings);
    
  }, [coupling, engineTorque, workCondition, temperature, recommendedModel, recommendedPrefix, engineSpeed]);

  // 如果没有联轴器数据，显示提示
  if (!coupling) {
    return (
      <Alert variant="info">
        <i className="bi bi-info-circle me-2"></i>
        请先选择联轴器
      </Alert>
    );
  }

  // 根据评分获取进度条变体样式
  const getVariant = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  };

  // 安全数字格式化
  const safeNumberFormat = (value, decimals = 2) => {
    const num = parseFloat(value);
    if (typeof num !== 'number' || isNaN(num)) {
      return '-';
    }
    return num.toFixed(decimals);
  };
  
  return (
    <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <i className="bi bi-graph-up me-2"></i>
        联轴器评分详情: {coupling.model}
      </Card.Header>
      <Card.Body>
        {/* 警告信息 */}
        {warnings.length > 0 && (
          <Alert variant="warning" className="mb-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <strong>注意事项:</strong>
            <ul className="mb-0 mt-1">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </Alert>
        )}
        
        {/* 总评分 */}
        <div className="text-center mb-4">
          <h4 style={{ color: colors.headerText }}>总评分</h4>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            color: scores.total >= 80 ? '#28a745' : scores.total >= 60 ? '#ffc107' : '#dc3545'
          }}>
            {scores.total}/100
          </div>
          <ProgressBar 
            variant={getVariant(scores.total, 100)}
            now={scores.total} 
            min={0}
            max={100}
            style={{ height: '1rem' }}
            className="mt-2"
          />
        </div>
        
        {/* 分项评分 */}
        <h5 style={{ color: colors.headerText }}>分项评分</h5>
        <Table bordered responsive style={{ color: colors.text }}>
          <thead>
            <tr>
              <th>评分项目</th>
              <th>得分</th>
              <th>满分</th>
              <th>评分详情</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>扭矩余量</td>
              <td>{scores.torqueMargin}</td>
              <td>50</td>
              <td>
                <div className="mb-1">
                  <ProgressBar 
                    variant={getVariant(scores.torqueMargin, 50)}
                    now={scores.torqueMargin} 
                    min={0}
                    max={50}
                  />
                </div>
                <small>
                  余量: {safeNumberFormat(torqueMargin, 1)}%
                  {torqueMargin >= 10 && torqueMargin <= 30 ? 
                    " (最佳范围)" : torqueMargin > 30 ? " (偏大)" : " (偏小)"}
                </small>
              </td>
            </tr>
            <tr>
              <td>型号匹配</td>
              <td>{scores.modelMatch}</td>
              <td>30</td>
              <td>
                <div className="mb-1">
                  <ProgressBar 
                    variant={getVariant(scores.modelMatch, 30)}
                    now={scores.modelMatch} 
                    min={0}
                    max={30}
                  />
                </div>
                <small>
                  {scores.modelMatch === 30 ? "完全匹配" : 
                   scores.modelMatch === 20 ? "前缀匹配" : "无匹配"}
                  {recommendedModel ? ` (推荐: ${recommendedModel})` : 
                   recommendedPrefix ? ` (推荐前缀: ${recommendedPrefix})` : ""}
                </small>
              </td>
            </tr>
            <tr>
              <td>转速适配</td>
              <td>{scores.speedFit}</td>
              <td>10</td>
              <td>
                <div className="mb-1">
                  <ProgressBar 
                    variant={getVariant(scores.speedFit, 10)}
                    now={scores.speedFit} 
                    min={0}
                    max={10}
                  />
                </div>
                <small>
                  {coupling.maxSpeed ? `最大转速: ${coupling.maxSpeed} r/min` : "无转速数据"}
                  {engineSpeed ? ` (发动机: ${engineSpeed} r/min)` : ""}
                </small>
              </td>
            </tr>
            <tr>
              <td>重量与价格</td>
              <td>{scores.weightPrice}</td>
              <td>10</td>
              <td>
                <div className="mb-1">
                  <ProgressBar 
                    variant={getVariant(scores.weightPrice, 10)}
                    now={scores.weightPrice} 
                    min={0}
                    max={10}
                  />
                </div>
                <small>
                  重量: {coupling.weight ? `${coupling.weight} kg` : "未知"}，
                  价格: {coupling.price ? `${coupling.price} 元` : "未知"}
                </small>
              </td>
            </tr>
          </tbody>
        </Table>
        
        {/* 基本参数 */}
        <h5 style={{ color: colors.headerText }} className="mt-4">基本参数</h5>
        <Row>
          <Col md={6}>
            <Table bordered responsive size="sm" style={{ color: colors.text }}>
              <tbody>
                <tr>
                  <td style={{ width: '40%', fontWeight: 'bold' }}>型号</td>
                  <td>{coupling.model}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>额定扭矩</td>
                  <td>{safeNumberFormat(coupling.torque, 3)} kN·m</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>所需扭矩</td>
                  <td>{safeNumberFormat(requiredTorque, 3)} kN·m</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>最大转速</td>
                  <td>{coupling.maxSpeed ? `${coupling.maxSpeed} r/min` : '-'}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
          <Col md={6}>
            <Table bordered responsive size="sm" style={{ color: colors.text }}>
              <tbody>
                <tr>
                  <td style={{ width: '40%', fontWeight: 'bold' }}>工况</td>
                  <td>{workCondition}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>工况系数</td>
                  <td>{couplingWorkFactorMap[workCondition] || couplingWorkFactorMap.default}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>温度</td>
                  <td>{temperature}°C</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>温度系数</td>
                  <td>{safeNumberFormat(getTemperatureFactor(parseFloat(temperature)), 4)}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CouplingScorer;
