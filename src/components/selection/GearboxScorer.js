// src/components/selection/GearboxScorer.js
// 齿轮箱评分器组件 - 计算和展示齿轮箱的匹配分数，提供透明的选型理由

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, ProgressBar, Alert, Badge } from 'react-bootstrap';

/**
 * 齿轮箱评分器组件
 * @param {Object} props - 组件属性
 * @param {Object} props.gearbox - 齿轮箱数据
 * @param {number} props.inputPower - 输入功率 (kW)
 * @param {number} props.inputSpeed - 输入转速 (rpm)
 * @param {number} props.targetRatio - 目标减速比
 * @param {number} props.requiredThrust - 所需推力 (kN)
 * @param {Array} props.allResults - 所有匹配结果 (用于计算价格竞争力)
 * @param {Object} props.theme - 主题设置
 * @param {Object} props.colors - 颜色设置
 * @param {boolean} props.compact - 紧凑模式 (仅显示总分)
 * @returns {JSX.Element}
 */
const GearboxScorer = ({
  gearbox,
  inputPower = 0,
  inputSpeed = 0,
  targetRatio = 0,
  requiredThrust = 0,
  allResults = [],
  theme = 'light',
  colors = {},
  compact = false
}) => {
  // 评分状态
  const [scores, setScores] = useState({
    ratioMatch: 0,       // 减速比匹配 (0-30分)
    capacityMargin: 0,   // 传递能力余量 (0-35分)
    thrustSatisfy: 0,    // 推力满足 (0-15分)
    priceCompete: 0,     // 价格竞争力 (0-15分)
    dataComplete: 0,     // 数据完整性 (0-5分)
    total: 0             // 总评分 (0-100分)
  });

  const [details, setDetails] = useState({
    matchedRatio: null,
    ratioDiff: null,
    requiredCapacity: null,
    actualCapacity: null,
    capacityMargin: null
  });

  const [warnings, setWarnings] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // 计算数据完整性
  const dataCompleteness = useMemo(() => {
    if (!gearbox) return { score: 0, fields: [], missing: [] };

    const requiredFields = [
      { key: 'model', label: '型号' },
      { key: 'ratios', label: '速比' },
      { key: 'transferCapacity', label: '传递能力', alt: 'transmissionCapacityPerRatio' },
      { key: 'price', label: '价格' },
      { key: 'weight', label: '重量' },
      { key: 'thrust', label: '推力' },
      { key: 'inputSpeedRange', label: '转速范围' }
    ];

    let validCount = 0;
    const missing = [];

    requiredFields.forEach(field => {
      const value = gearbox[field.key] || (field.alt && gearbox[field.alt]);
      if (value && (Array.isArray(value) ? value.length > 0 : value > 0)) {
        validCount++;
      } else {
        missing.push(field.label);
      }
    });

    return {
      score: Math.round((validCount / requiredFields.length) * 100),
      percentage: Math.round((validCount / requiredFields.length) * 100),
      total: requiredFields.length,
      valid: validCount,
      missing
    };
  }, [gearbox]);

  // 计算评分
  useEffect(() => {
    if (!gearbox || !inputPower || !inputSpeed || !targetRatio) {
      return;
    }

    const newWarnings = [];
    const newRecommendations = [];

    // 计算所需传递能力
    const requiredCapacity = inputPower / inputSpeed;

    // 1. 减速比匹配评分 (30分)
    let ratioMatchScore = 0;
    let matchedRatio = null;
    let ratioDiff = null;

    const ratios = gearbox.ratios || [];
    if (ratios.length > 0) {
      // 找到最接近的速比
      let bestDiff = Infinity;
      ratios.forEach(r => {
        const diff = Math.abs(r - targetRatio) / targetRatio;
        if (diff < bestDiff) {
          bestDiff = diff;
          matchedRatio = r;
        }
      });

      ratioDiff = bestDiff * 100;

      if (ratioDiff <= 2) {
        ratioMatchScore = 30; // 偏差≤2%，满分
      } else if (ratioDiff <= 5) {
        ratioMatchScore = 25; // 偏差2-5%
      } else if (ratioDiff <= 10) {
        ratioMatchScore = 20; // 偏差5-10%
        newWarnings.push(`速比偏差${ratioDiff.toFixed(1)}%，接近10%容差上限`);
      } else {
        ratioMatchScore = 0; // 超出容差
        newWarnings.push(`速比偏差${ratioDiff.toFixed(1)}%，超出10%容差`);
      }
    }

    // 2. 传递能力余量评分 (35分)
    let capacityMarginScore = 0;
    let actualCapacity = 0;
    let capacityMarginPct = 0;

    const capacityArr = gearbox.transmissionCapacityPerRatio || gearbox.transferCapacity || [];
    if (Array.isArray(capacityArr) && capacityArr.length > 0 && matchedRatio) {
      // 找到匹配速比对应的传递能力
      const ratioIdx = ratios.findIndex(r => r === matchedRatio);
      if (ratioIdx >= 0 && ratioIdx < capacityArr.length) {
        actualCapacity = capacityArr[ratioIdx];
      } else {
        // 使用最保守值
        actualCapacity = Math.min(...capacityArr.filter(c => c > 0));
      }

      if (actualCapacity > 0 && requiredCapacity > 0) {
        capacityMarginPct = ((actualCapacity - requiredCapacity) / requiredCapacity) * 100;

        if (capacityMarginPct < 0) {
          capacityMarginScore = 0; // 能力不足
          newWarnings.push(`传递能力不足: 需要${requiredCapacity.toFixed(4)}，实际${actualCapacity.toFixed(4)}`);
        } else if (capacityMarginPct >= 10 && capacityMarginPct <= 30) {
          capacityMarginScore = 35; // 最佳余量 10-30%
          newRecommendations.push('能力余量在最佳范围(10-30%)');
        } else if (capacityMarginPct > 30 && capacityMarginPct <= 50) {
          capacityMarginScore = 28; // 余量较大
        } else if (capacityMarginPct > 50 && capacityMarginPct <= 100) {
          capacityMarginScore = 20; // 余量偏大
          newWarnings.push(`能力余量${capacityMarginPct.toFixed(0)}%偏大，可能过度选型`);
        } else if (capacityMarginPct > 100) {
          capacityMarginScore = 15; // 余量过大
          newWarnings.push(`能力余量${capacityMarginPct.toFixed(0)}%过大，建议选择更小型号`);
        } else {
          capacityMarginScore = 25; // 余量偏小(0-10%)
          newWarnings.push(`能力余量${capacityMarginPct.toFixed(1)}%偏小，建议选择更大型号`);
        }
      }
    }

    // 3. 推力满足评分 (15分)
    let thrustScore = 0;
    const thrust = gearbox.thrust || 0;

    if (!requiredThrust || requiredThrust <= 0) {
      thrustScore = 15; // 无推力要求，满分
    } else if (thrust >= requiredThrust) {
      const thrustMargin = ((thrust - requiredThrust) / requiredThrust) * 100;
      if (thrustMargin <= 50) {
        thrustScore = 15; // 推力充足
        newRecommendations.push('推力满足要求');
      } else {
        thrustScore = 12; // 推力富余过多
      }
    } else {
      thrustScore = 0;
      newWarnings.push(`推力不足: 需要${requiredThrust}kN，实际${thrust}kN`);
    }

    // 4. 价格竞争力评分 (15分)
    let priceScore = 0;
    const price = gearbox.price || 0;

    if (price > 0 && allResults.length > 0) {
      // 计算在所有结果中的价格排名
      const pricesInResults = allResults
        .filter(r => r && r.price > 0)
        .map(r => r.price)
        .sort((a, b) => a - b);

      if (pricesInResults.length > 0) {
        const rank = pricesInResults.findIndex(p => p >= price);
        const percentile = (rank / pricesInResults.length) * 100;

        if (percentile <= 20) {
          priceScore = 15; // 最便宜的20%
          newRecommendations.push('价格竞争力强');
        } else if (percentile <= 50) {
          priceScore = 12; // 中等偏下
        } else if (percentile <= 80) {
          priceScore = 8;  // 中等偏上
        } else {
          priceScore = 5;  // 最贵的20%
        }
      } else {
        priceScore = 10; // 无可比数据
      }
    } else if (price <= 0) {
      priceScore = 0;
      newWarnings.push('缺少价格数据');
    } else {
      priceScore = 10; // 无可比数据
    }

    // 5. 数据完整性评分 (5分)
    const dataScore = Math.round((dataCompleteness.percentage / 100) * 5);

    if (dataCompleteness.missing.length > 0 && dataCompleteness.missing.length <= 2) {
      newWarnings.push(`缺少数据: ${dataCompleteness.missing.join('、')}`);
    }

    // 计算总分
    const totalScore = ratioMatchScore + capacityMarginScore + thrustScore + priceScore + dataScore;

    // 更新状态
    setScores({
      ratioMatch: ratioMatchScore,
      capacityMargin: capacityMarginScore,
      thrustSatisfy: thrustScore,
      priceCompete: priceScore,
      dataComplete: dataScore,
      total: totalScore
    });

    setDetails({
      matchedRatio,
      ratioDiff,
      requiredCapacity,
      actualCapacity,
      capacityMargin: capacityMarginPct
    });

    setWarnings(newWarnings);
    setRecommendations(newRecommendations);

  }, [gearbox, inputPower, inputSpeed, targetRatio, requiredThrust, allResults, dataCompleteness]);

  // 如果没有齿轮箱数据
  if (!gearbox) {
    return (
      <Alert variant="info">
        <i className="bi bi-info-circle me-2"></i>
        请先选择齿轮箱
      </Alert>
    );
  }

  // 获取进度条样式
  const getVariant = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  };

  // 获取总分评级
  const getGrade = (score) => {
    if (score >= 90) return { text: '极佳', color: '#28a745' };
    if (score >= 80) return { text: '优秀', color: '#28a745' };
    if (score >= 70) return { text: '良好', color: '#6c757d' };
    if (score >= 60) return { text: '合格', color: '#ffc107' };
    return { text: '不推荐', color: '#dc3545' };
  };

  const grade = getGrade(scores.total);

  // 紧凑模式 - 仅显示评分徽章
  if (compact) {
    return (
      <div className="d-flex align-items-center gap-2">
        <Badge
          bg={scores.total >= 80 ? 'success' : scores.total >= 60 ? 'warning' : 'danger'}
          style={{ fontSize: '0.9rem', padding: '0.4em 0.6em' }}
        >
          {scores.total}分
        </Badge>
        {dataCompleteness.percentage < 100 && (
          <Badge bg="secondary" title={`缺少: ${dataCompleteness.missing.join('、')}`}>
            <i className="bi bi-exclamation-circle me-1"></i>
            {dataCompleteness.percentage}%
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <i className="bi bi-graph-up me-2"></i>
        选型评分: {gearbox.model}
      </Card.Header>
      <Card.Body>
        {/* 警告信息 */}
        {warnings.length > 0 && (
          <Alert variant="warning" className="mb-3 py-2">
            <small>
              <i className="bi bi-exclamation-triangle me-2"></i>
              <strong>注意:</strong>
              {warnings.map((w, i) => (
                <span key={i}> {w}{i < warnings.length - 1 ? '；' : ''}</span>
              ))}
            </small>
          </Alert>
        )}

        {/* 推荐理由 */}
        {recommendations.length > 0 && (
          <Alert variant="success" className="mb-3 py-2">
            <small>
              <i className="bi bi-check-circle me-2"></i>
              <strong>推荐理由:</strong>
              {recommendations.map((r, i) => (
                <span key={i}> {r}{i < recommendations.length - 1 ? '；' : ''}</span>
              ))}
            </small>
          </Alert>
        )}

        {/* 总评分 */}
        <div className="text-center mb-4">
          <h5 style={{ color: colors.headerText }}>综合评分</h5>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: grade.color
          }}>
            {scores.total}<small style={{ fontSize: '1rem' }}>/100</small>
            <span style={{ fontSize: '1.2rem', marginLeft: '0.5rem' }}>({grade.text})</span>
          </div>
          <ProgressBar
            variant={getVariant(scores.total, 100)}
            now={scores.total}
            min={0}
            max={100}
            style={{ height: '0.8rem' }}
            className="mt-2"
          />
        </div>

        {/* 分项评分 */}
        <h6 style={{ color: colors.headerText }}>分项明细</h6>
        <Table bordered responsive size="sm" style={{ color: colors.text, fontSize: '0.9rem' }}>
          <thead>
            <tr>
              <th style={{ width: '25%' }}>评分项</th>
              <th style={{ width: '15%' }}>得分</th>
              <th>详情</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>减速比匹配</td>
              <td><strong>{scores.ratioMatch}</strong>/30</td>
              <td>
                <ProgressBar
                  variant={getVariant(scores.ratioMatch, 30)}
                  now={scores.ratioMatch} max={30}
                  style={{ height: '0.5rem', marginBottom: '4px' }}
                />
                <small>
                  目标{targetRatio}:1，匹配{details.matchedRatio || '-'}:1
                  {details.ratioDiff != null && ` (偏差${details.ratioDiff.toFixed(1)}%)`}
                </small>
              </td>
            </tr>
            <tr>
              <td>能力余量</td>
              <td><strong>{scores.capacityMargin}</strong>/35</td>
              <td>
                <ProgressBar
                  variant={getVariant(scores.capacityMargin, 35)}
                  now={scores.capacityMargin} max={35}
                  style={{ height: '0.5rem', marginBottom: '4px' }}
                />
                <small>
                  需{details.requiredCapacity?.toFixed(4) || '-'}，
                  实际{details.actualCapacity?.toFixed(4) || '-'}
                  {details.capacityMargin != null && ` (余量${details.capacityMargin.toFixed(0)}%)`}
                </small>
              </td>
            </tr>
            <tr>
              <td>推力满足</td>
              <td><strong>{scores.thrustSatisfy}</strong>/15</td>
              <td>
                <ProgressBar
                  variant={getVariant(scores.thrustSatisfy, 15)}
                  now={scores.thrustSatisfy} max={15}
                  style={{ height: '0.5rem', marginBottom: '4px' }}
                />
                <small>
                  {requiredThrust > 0
                    ? `需${requiredThrust}kN，实际${gearbox.thrust || 0}kN`
                    : '无推力要求'}
                </small>
              </td>
            </tr>
            <tr>
              <td>价格竞争力</td>
              <td><strong>{scores.priceCompete}</strong>/15</td>
              <td>
                <ProgressBar
                  variant={getVariant(scores.priceCompete, 15)}
                  now={scores.priceCompete} max={15}
                  style={{ height: '0.5rem', marginBottom: '4px' }}
                />
                <small>
                  {gearbox.price > 0
                    ? `¥${gearbox.price.toLocaleString()}`
                    : '价格数据缺失'}
                </small>
              </td>
            </tr>
            <tr>
              <td>数据完整性</td>
              <td><strong>{scores.dataComplete}</strong>/5</td>
              <td>
                <ProgressBar
                  variant={getVariant(scores.dataComplete, 5)}
                  now={scores.dataComplete} max={5}
                  style={{ height: '0.5rem', marginBottom: '4px' }}
                />
                <small>
                  {dataCompleteness.percentage}% 完整
                  {dataCompleteness.missing.length > 0 &&
                    ` (缺: ${dataCompleteness.missing.slice(0, 2).join('、')}${dataCompleteness.missing.length > 2 ? '等' : ''})`}
                </small>
              </td>
            </tr>
          </tbody>
        </Table>

        {/* 数据完整性徽章 */}
        <div className="d-flex justify-content-end mt-2">
          <Badge
            bg={dataCompleteness.percentage >= 80 ? 'success' : dataCompleteness.percentage >= 60 ? 'warning' : 'danger'}
          >
            数据完整度: {dataCompleteness.percentage}%
          </Badge>
        </div>
      </Card.Body>
    </Card>
  );
};

/**
 * 数据完整性徽章组件 (可独立使用)
 */
export const DataCompletenessBadge = ({ gearbox, showTooltip = true }) => {
  if (!gearbox) return null;

  const requiredFields = ['model', 'ratios', 'transferCapacity', 'price', 'weight', 'thrust'];
  let valid = 0;
  const missing = [];

  requiredFields.forEach(field => {
    const value = gearbox[field] || gearbox.transmissionCapacityPerRatio;
    if (value && (Array.isArray(value) ? value.length > 0 : value > 0)) {
      valid++;
    } else if (field !== 'transmissionCapacityPerRatio') {
      missing.push(field);
    }
  });

  const percentage = Math.round((valid / requiredFields.length) * 100);
  const bg = percentage >= 80 ? 'success' : percentage >= 60 ? 'warning' : 'danger';

  return (
    <Badge
      bg={bg}
      title={showTooltip && missing.length > 0 ? `缺少: ${missing.join(', ')}` : ''}
      style={{ cursor: missing.length > 0 ? 'help' : 'default' }}
    >
      {percentage >= 100 ? (
        <><i className="bi bi-check-circle me-1"></i>完整</>
      ) : (
        <><i className="bi bi-exclamation-circle me-1"></i>{percentage}%</>
      )}
    </Badge>
  );
};

export default GearboxScorer;
