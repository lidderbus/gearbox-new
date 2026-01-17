// src/pages/CouplingSelection/ClassificationComparisonPanel.js
// 多船级社对比面板 - 显示不同船检标准下的选型校核结果

import React, { useMemo } from 'react';
import { Card, Table, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  ClassificationType,
  getCertificateRequirements,
  getClassificationShortName,
  requiresOnSiteInspection,
  requiresEnglishDocuments
} from '../../utils/classificationCertificates';
import {
  couplingWorkFactorMap_Factory,
  couplingWorkFactorMap_JB_CCS
} from '../../data/gearboxMatchingMaps';

/**
 * 各船级社的最小扭矩余量要求
 */
const SOCIETY_MARGIN_REQUIREMENTS = {
  CCS: { minMargin: 10, recommended: 15, description: '中国船级社' },
  DNV: { minMargin: 15, recommended: 20, description: 'DNV-GL' },
  LR: { minMargin: 12, recommended: 18, description: '劳氏船级社' },
  ABS: { minMargin: 10, recommended: 15, description: '美国船级社' },
  BV: { minMargin: 12, recommended: 15, description: '法国船级社' },
  NK: { minMargin: 10, recommended: 15, description: '日本海事协会' },
  KR: { minMargin: 10, recommended: 15, description: '韩国船级社' },
  ZY: { minMargin: 10, recommended: 15, description: '渔检' },
  FACTORY: { minMargin: 5, recommended: 10, description: '厂家标准' }
};

/**
 * 计算在指定工况系数下的所需扭矩
 */
const calculateRequiredTorque = (power, speed, workCondition, workFactorMap) => {
  const K = workFactorMap[workCondition] || 1.4; // 默认III类
  const baseTorque = (power * 9550) / speed;
  return baseTorque * K / 1000; // 转换为kN·m
};

/**
 * 检查联轴器是否满足船级社要求
 */
const checkCompliance = (couplingTorque, requiredTorque, society) => {
  const margin = ((couplingTorque - requiredTorque) / requiredTorque) * 100;
  const requirement = SOCIETY_MARGIN_REQUIREMENTS[society] || SOCIETY_MARGIN_REQUIREMENTS.FACTORY;

  return {
    margin: margin.toFixed(1),
    isCompliant: margin >= requirement.minMargin,
    isRecommended: margin >= requirement.recommended,
    minMargin: requirement.minMargin,
    recommended: requirement.recommended
  };
};

/**
 * 多船级社对比面板组件
 */
const ClassificationComparisonPanel = ({
  selectionResult,
  selectedCoupling,
  power,
  speed,
  workCondition = 'III类:扭矩变化中等',
  currentClassification = ClassificationType.NONE
}) => {
  // 主要船级社列表
  const mainSocieties = ['CCS', 'DNV', 'LR', 'ABS'];

  // 计算各船级社下的校核结果
  const comparisonResults = useMemo(() => {
    if (!selectedCoupling || !power || !speed) {
      return null;
    }

    const couplingTorque = selectedCoupling.ratedTorque || selectedCoupling.torque || 0;

    // 使用JB/CCS标准计算（船检通常使用此标准）
    const requiredTorque = calculateRequiredTorque(
      parseFloat(power),
      parseFloat(speed),
      workCondition,
      couplingWorkFactorMap_JB_CCS
    );

    // 厂家标准计算
    const requiredTorqueFactory = calculateRequiredTorque(
      parseFloat(power),
      parseFloat(speed),
      workCondition,
      couplingWorkFactorMap_Factory
    );

    return {
      couplingTorque,
      requiredTorque,
      requiredTorqueFactory,
      workFactor: couplingWorkFactorMap_JB_CCS[workCondition] || 2.5,
      workFactorFactory: couplingWorkFactorMap_Factory[workCondition] || 1.4,
      societies: mainSocieties.map(society => ({
        society,
        ...checkCompliance(couplingTorque, requiredTorque, society)
      })),
      factoryResult: checkCompliance(couplingTorque, requiredTorqueFactory, 'FACTORY')
    };
  }, [selectedCoupling, power, speed, workCondition, mainSocieties]);

  if (!comparisonResults) {
    return null;
  }

  // 获取当前船检配置
  const currentConfig = getCertificateRequirements(currentClassification);

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-shield-check me-2"></i>
            多船级社对比
          </span>
          {currentClassification !== ClassificationType.NONE && (
            <Badge bg="primary">
              当前选择: {currentConfig.name}
            </Badge>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        {/* 工况系数对比 */}
        <div className="mb-3">
          <small className="text-muted">
            当前工况: {workCondition} |
            JB/CCS系数: <strong>{comparisonResults.workFactor}</strong> |
            厂家系数: <strong>{comparisonResults.workFactorFactory}</strong>
          </small>
        </div>

        {/* 校核结果表格 */}
        <Table striped bordered hover size="sm" className="mb-3">
          <thead className="table-light">
            <tr>
              <th>项目</th>
              {comparisonResults.societies.map(s => (
                <th key={s.society} className="text-center">
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        {SOCIETY_MARGIN_REQUIREMENTS[s.society]?.description || s.society}
                        <br />
                        最小余量: {s.minMargin}%
                        <br />
                        推荐余量: {s.recommended}%
                      </Tooltip>
                    }
                  >
                    <span style={{ cursor: 'help' }}>{s.society}</span>
                  </OverlayTrigger>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>工况系数 (III类)</td>
              {comparisonResults.societies.map(s => (
                <td key={s.society} className="text-center">2.5</td>
              ))}
            </tr>
            <tr>
              <td>最小扭矩余量</td>
              {comparisonResults.societies.map(s => (
                <td key={s.society} className="text-center">{s.minMargin}%</td>
              ))}
            </tr>
            <tr>
              <td>当前余量</td>
              {comparisonResults.societies.map(s => (
                <td key={s.society} className="text-center">
                  <span className={s.isRecommended ? 'text-success' : s.isCompliant ? 'text-warning' : 'text-danger'}>
                    {s.margin}%
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td>校核结果</td>
              {comparisonResults.societies.map(s => (
                <td key={s.society} className="text-center">
                  {s.isRecommended ? (
                    <Badge bg="success">
                      <i className="bi bi-check-circle me-1"></i>
                      推荐
                    </Badge>
                  ) : s.isCompliant ? (
                    <Badge bg="warning" text="dark">
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      合格
                    </Badge>
                  ) : (
                    <Badge bg="danger">
                      <i className="bi bi-x-circle me-1"></i>
                      不通过
                    </Badge>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </Table>

        {/* 证书要求对比 */}
        <div className="mt-3">
          <h6 className="text-muted mb-2">
            <i className="bi bi-file-earmark-text me-1"></i>
            证书要求对比
          </h6>
          <div className="d-flex flex-wrap gap-2">
            {mainSocieties.map(society => {
              // 找到对应船检类型
              const classType = Object.values(ClassificationType).find(ct => {
                const config = getCertificateRequirements(ct);
                return config.society === society;
              }) || ClassificationType.NONE;

              const config = getCertificateRequirements(classType);
              const needsInspection = requiresOnSiteInspection(classType);
              const needsEnglish = requiresEnglishDocuments(classType);

              return (
                <OverlayTrigger
                  key={society}
                  placement="top"
                  overlay={
                    <Tooltip>
                      <div className="text-start">
                        <strong>{config.name || society}</strong>
                        <hr className="my-1" />
                        {config.certificates?.slice(0, 3).map((cert, i) => (
                          <div key={i}>- {cert.name}</div>
                        ))}
                        {config.certificates?.length > 3 && (
                          <div>...及其他 {config.certificates.length - 3} 项</div>
                        )}
                      </div>
                    </Tooltip>
                  }
                >
                  <Badge
                    bg={currentConfig.society === society ? 'primary' : 'secondary'}
                    className="d-flex align-items-center gap-1"
                    style={{ cursor: 'help' }}
                  >
                    {society}
                    {needsInspection && <i className="bi bi-eye-fill" title="需现场检验"></i>}
                    {needsEnglish && <i className="bi bi-globe" title="需英文文档"></i>}
                  </Badge>
                </OverlayTrigger>
              );
            })}
          </div>
        </div>

        {/* 当前选择的证书清单提示 */}
        {currentClassification !== ClassificationType.NONE && (
          <div className="mt-3 p-2 bg-light rounded">
            <small>
              <strong>当前选择 ({currentConfig.name}) 需要证书:</strong>
              <ul className="mb-0 ps-3 mt-1">
                {currentConfig.certificates?.filter(c => c.required).map((cert, i) => (
                  <li key={i}>{cert.name}</li>
                ))}
              </ul>
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ClassificationComparisonPanel;
