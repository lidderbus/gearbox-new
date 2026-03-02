/**
 * 技术对比矩阵组件
 * Technology Comparison Matrix
 */

import React, { useMemo } from 'react';
import { Card, Table, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { techDimensionsTemplate } from '../../data/competitorDataEnhanced';
import { getManufacturerInfo } from '../../utils/competitorAnalysis';
import { manufacturerColors } from '../../data/competitorData';

const techDimensions = [
  { key: 'propellerType', label: '螺旋桨类型', description: 'FPP定距桨/CPP调距桨支持' },
  { key: 'noiseClass', label: '噪声等级', description: 'IMO噪声标准等级' },
  { key: 'digitalMonitoring', label: '数字监控', description: '是否支持远程数字监控系统' },
  { key: 'hybridReady', label: '混动兼容', description: '混合动力/电力推进兼容' },
  { key: 'efficiencyClass', label: '效率等级', description: '传动效率等级' },
  { key: 'clutchType', label: '离合器类型', description: '离合器技术方案' },
  { key: 'environmentalCompliance', label: '环保合规', description: '环保法规认证' }
];

const StatusBadge = ({ value, type }) => {
  if (type === 'boolean') {
    if (value === true) return <Badge bg="success">✓ 支持</Badge>;
    if (value === 'partial') return <Badge bg="warning" text="dark">◐ 部分</Badge>;
    return <Badge bg="secondary">✗ 不支持</Badge>;
  }
  if (type === 'array') {
    if (!value || value.length === 0) return <span className="text-muted">-</span>;
    return (
      <div className="d-flex flex-wrap gap-1">
        {value.map((v, i) => <Badge key={i} bg="info" className="fw-normal" style={{ fontSize: '0.7rem' }}>{v}</Badge>)}
      </div>
    );
  }
  if (type === 'efficiency') {
    const colorMap = { premium: 'success', high: 'primary', standard: 'secondary' };
    const labelMap = { premium: '卓越', high: '优良', standard: '标准' };
    return <Badge bg={colorMap[value] || 'secondary'}>{labelMap[value] || value || '-'}</Badge>;
  }
  return <span>{value || '-'}</span>;
};

const getFieldType = (key) => {
  if (key === 'digitalMonitoring' || key === 'hybridReady') return 'boolean';
  if (key === 'environmentalCompliance') return 'array';
  if (key === 'efficiencyClass') return 'efficiency';
  return 'text';
};

const getTechReadinessScore = (techData) => {
  let score = 0, max = 0;
  if (techData.propellerType === 'both') score += 3; else if (techData.propellerType === 'CPP') score += 2; else score += 1;
  max += 3;
  if (techData.noiseClass === 'IMO Tier III') score += 3; else if (techData.noiseClass === 'IMO Tier II') score += 2; else score += 1;
  max += 3;
  if (techData.digitalMonitoring === true) score += 2; else if (techData.digitalMonitoring === 'partial') score += 1;
  max += 2;
  if (techData.hybridReady === true) score += 3; else if (techData.hybridReady === 'partial') score += 1;
  max += 3;
  if (techData.efficiencyClass === 'premium') score += 3; else if (techData.efficiencyClass === 'high') score += 2; else score += 1;
  max += 3;
  if (techData.environmentalCompliance) score += Math.min(techData.environmentalCompliance.length, 3);
  max += 3;
  return { score, max, percent: Math.round(score / max * 100) };
};

const TechnologyMatrix = ({ hangchiProduct, competitors = [], colors }) => {
  const techDataMap = useMemo(() => {
    const map = {};
    // Hangchi
    map['HANGCHI'] = techDimensionsTemplate['HANGCHI'] || {};
    // Competitors
    competitors.forEach(comp => {
      map[comp.manufacturer] = techDimensionsTemplate[comp.manufacturer] || {};
    });
    return map;
  }, [competitors]);

  if (!hangchiProduct || competitors.length === 0) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center text-muted py-5">
          <i className="bi bi-grid-3x3 fs-1 mb-3 d-block"></i>
          请选择杭齿产品和竞品查看技术矩阵
        </Card.Body>
      </Card>
    );
  }

  const hangchiTech = techDataMap['HANGCHI'] || {};
  const hangchiScore = getTechReadinessScore(hangchiTech);

  return (
    <Card className="shadow-sm">
      <Card.Header style={{ background: colors?.primary || '#2c5282', color: 'white' }}>
        <i className="bi bi-grid-3x3-gap me-2"></i>
        技术对比矩阵
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table bordered hover className="mb-0">
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ width: '150px' }}>技术维度</th>
                <th style={{ backgroundColor: manufacturerColors?.HANGCHI || '#fd7e14', color: 'white', minWidth: '160px' }}>
                  <div className="text-center">
                    <i className="bi bi-star-fill me-1"></i>杭齿前进
                    <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{hangchiProduct.model}</div>
                  </div>
                </th>
                {competitors.map(comp => (
                  <th key={comp.model} style={{ backgroundColor: manufacturerColors?.[comp.manufacturer] || '#666', color: 'white', minWidth: '160px' }}>
                    <div className="text-center">
                      {getManufacturerInfo(comp.manufacturer)?.shortName || comp.manufacturer}
                      <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{comp.model}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {techDimensions.map(dim => (
                <tr key={dim.key}>
                  <td>
                    <OverlayTrigger placement="right" overlay={<Tooltip>{dim.description}</Tooltip>}>
                      <span style={{ cursor: 'help' }}>
                        {dim.label} <i className="bi bi-info-circle text-muted" style={{ fontSize: '0.7rem' }}></i>
                      </span>
                    </OverlayTrigger>
                  </td>
                  <td className="text-center" style={{ backgroundColor: 'rgba(253, 126, 20, 0.05)' }}>
                    <StatusBadge value={hangchiTech[dim.key]} type={getFieldType(dim.key)} />
                  </td>
                  {competitors.map(comp => {
                    const compTech = techDataMap[comp.manufacturer] || {};
                    return (
                      <td key={comp.model} className="text-center">
                        <StatusBadge value={compTech[dim.key]} type={getFieldType(dim.key)} />
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* 技术就绪度评分 */}
              <tr className="table-light">
                <td><strong>技术就绪度</strong></td>
                <td className="text-center" style={{ backgroundColor: 'rgba(253, 126, 20, 0.1)' }}>
                  <div>
                    <Badge bg={hangchiScore.percent >= 70 ? 'success' : hangchiScore.percent >= 50 ? 'warning' : 'danger'} style={{ fontSize: '1rem' }}>
                      {hangchiScore.percent}%
                    </Badge>
                  </div>
                  <small className="text-muted">{hangchiScore.score}/{hangchiScore.max}</small>
                </td>
                {competitors.map(comp => {
                  const compScore = getTechReadinessScore(techDataMap[comp.manufacturer] || {});
                  return (
                    <td key={comp.model} className="text-center">
                      <div>
                        <Badge bg={compScore.percent >= 70 ? 'success' : compScore.percent >= 50 ? 'warning' : 'danger'} style={{ fontSize: '1rem' }}>
                          {compScore.percent}%
                        </Badge>
                      </div>
                      <small className="text-muted">{compScore.score}/{compScore.max}</small>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="p-3 border-top bg-light">
          <small className="text-muted">
            <i className="bi bi-info-circle me-1"></i>
            技术数据基于厂商公开资料和行业评估，按厂商默认技术水平标注。实际产品可能因型号不同而有差异。
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TechnologyMatrix;
