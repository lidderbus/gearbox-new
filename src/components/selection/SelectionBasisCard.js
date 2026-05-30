// src/components/selection/SelectionBasisCard.js
// 选型校核依据 — 透明化展示引擎已计算的校核结果
// 设计原则: 纯展示, 只读引擎已返回的值(selectedCapacity / capacityMargin / safetyFactor /
//           ratioDiffPercent / selectedRatio), 绝不在 UI 重算选型判定逻辑, 防止口径分叉。
import React from 'react';
import { Card, Table, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import MarginIndicator from './MarginIndicator';

const fmt = (v, digits = 2) =>
  (v === undefined || v === null || isNaN(v)) ? '-' : Number(v).toFixed(digits);

const SelectionBasisCard = ({ selectedGearbox, result }) => {
  if (!selectedGearbox || !result) return null;

  const power = result.enginePower;
  const speed = result.engineSpeed;
  // 优先取引擎计算的所需能力; 缺失时按公式兜底(仅用于展示)
  const required = (result.requiredTransferCapacity != null)
    ? result.requiredTransferCapacity
    : (power && speed > 0 ? power / speed : null);

  const capacity = selectedGearbox.selectedCapacity;
  const margin = (selectedGearbox.capacityMargin == null) ? null : Number(selectedGearbox.capacityMargin);
  const safetyFactor = selectedGearbox.safetyFactor;            // 引擎值, 不重算
  const selectedRatio = (selectedGearbox.selectedRatio != null) ? selectedGearbox.selectedRatio : selectedGearbox.ratio;
  const targetRatio = result.targetRatio;
  const ratioDiff = selectedGearbox.ratioDiffPercent;
  const workCondition = result.options?.workCondition;

  const marginNegative = margin != null && margin < 0;

  // 精确匹配 vs 插值估算: 目标速比正好落在某离散档位 → 精确; 否则传递能力按插值估算
  let ratioMatchBadge = null;
  if (selectedRatio != null && targetRatio) {
    const isExact = Math.abs(selectedRatio - targetRatio) <= 0.01;
    ratioMatchBadge = isExact
      ? <Badge bg="success" className="ms-2">精确匹配</Badge>
      : (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>目标速比 {fmt(targetRatio)} 介于齿轮箱离散档位之间,该档传递能力按单调三次 / 线性插值估算</Tooltip>}
        >
          <Badge bg="info" className="ms-2" style={{ cursor: 'help' }}>
            插值估算 <i className="bi bi-info-circle ms-1" />
          </Badge>
        </OverlayTrigger>
      );
  }

  return (
    <Card className="mb-3 border-primary" style={{ backgroundColor: '#f0f7ff' }}>
      <Card.Body className="py-2 px-3">
        <div className="d-flex align-items-center mb-2">
          <i className="bi bi-clipboard-check text-primary me-2" />
          <strong style={{ fontSize: '0.9rem' }}>选型校核依据</strong>
        </div>
        <Table borderless size="sm" className="mb-1" style={{ fontSize: '0.83rem' }}>
          <tbody>
            <tr>
              <td className="text-muted align-top" style={{ width: '36%' }}>所需传递能力</td>
              <td>
                所需 = P / n = <strong>{power ?? '-'}</strong> kW / <strong>{speed ?? '-'}</strong> r/min
                {required != null && <> = <strong>{fmt(required, 6)}</strong> kW/(r·min⁻¹)</>}
              </td>
            </tr>
            <tr>
              <td className="text-muted align-top">齿轮箱传递能力</td>
              <td>{capacity != null ? <><strong>{fmt(capacity, 6)}</strong> kW/(r·min⁻¹)</> : '-'}</td>
            </tr>
            <tr>
              <td className="text-muted align-top">能力余量</td>
              <td>
                {margin != null
                  ? <span className={marginNegative ? 'text-danger fw-bold' : ''}>{fmt(margin, 1)}%{marginNegative ? '(不满足)' : ''}</span>
                  : '-'}
                {margin != null && !marginNegative && <MarginIndicator margin={margin} />}
              </td>
            </tr>
            <tr>
              <td className="text-muted align-top">安全系数 Sf</td>
              <td>
                {safetyFactor != null
                  ? <><strong>{fmt(safetyFactor, 2)}</strong> <span className="text-muted">( = 齿轮箱能力 / 所需能力 )</span></>
                  : '-'}
              </td>
            </tr>
            <tr>
              <td className="text-muted align-top">减速比匹配</td>
              <td>
                <strong>{selectedRatio != null ? fmt(selectedRatio, 2) : '-'}</strong>
                {targetRatio
                  ? <span className="text-muted"> vs 目标 {fmt(targetRatio, 2)}</span>
                  : <span className="text-muted"> (未指定目标速比)</span>}
                {(ratioDiff != null && targetRatio) ? <span className="text-muted">,偏差 {fmt(ratioDiff, 1)}%</span> : null}
                {ratioMatchBadge}
              </td>
            </tr>
            {workCondition && (
              <tr>
                <td className="text-muted align-top">工况等级</td>
                <td>
                  <Badge bg="secondary">{workCondition}</Badge>
                  <span className="text-muted d-block mt-1" style={{ fontSize: '0.72rem' }}>
                    工况等级仅影响推荐排序甜区,不改变合格判定门槛
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <small className="text-muted d-block">
          <i className="bi bi-info-circle me-1" />
          合格判定:手册传递能力已含安全系数,齿轮箱能力 ≥ 所需能力(余量 ≥ 0%)即判定合格。
        </small>
      </Card.Body>
    </Card>
  );
};

export default SelectionBasisCard;
