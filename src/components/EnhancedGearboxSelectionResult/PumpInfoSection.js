// src/components/EnhancedGearboxSelectionResult/PumpInfoSection.js
// 备用泵信息展示组件
import React from 'react';
import { Table, Badge, Alert } from 'react-bootstrap';
import ValidationWarnings from './ValidationWarnings';
import { formatPrice } from '../../utils/priceFormatter';

/**
 * 备用泵信息展示组件
 * 显示选型的备用泵详细信息和备选型号
 */
const PumpInfoSection = ({
  pumpResult,
  needsPumpFlag,
  selectedGearbox,
  validation,
  colors = {}
}) => {
  // 检查是否需要备用泵
  if (!needsPumpFlag) {
    return (
      <Alert variant="info">
        <i className="bi bi-info-circle me-2"></i>
        <strong>当前选择的齿轮箱型号 {selectedGearbox?.model} 不需要配备备用泵。</strong>
        <p className="mt-2 mb-0">
          根据配套规则，此型号齿轮箱无需配备备用泵。如有特殊需求，可以在报价单选项中手动添加。
        </p>
      </Alert>
    );
  }

  // 正常情况 - 需要备用泵但未找到匹配
  if (!pumpResult || !pumpResult.success) {
    return (
      <Alert variant="warning">
        <i className="bi bi-exclamation-triangle me-2"></i>
        未能找到匹配的备用泵，但该齿轮箱型号需要配备备用泵
        {pumpResult && pumpResult.message && (
          <p className="mt-2 mb-0"><small>{pumpResult.message}</small></p>
        )}
        <hr className="my-2" />
        <small>
          <i className="bi bi-telephone me-1"></i>
          技术支持: 0571-83802269 / 0571-83802268
        </small>
      </Alert>
    );
  }

  // 判断是否为电动泵 (DT系列专用)
  const isElectricPump = pumpResult.type === 'electric' || pumpResult.series === '2CYA';
  const isDTGearbox = selectedGearbox?.model?.startsWith('DT');

  return (
    <div className="pump-section">
      <h6 style={{ color: colors?.headerText }} className="d-flex align-items-center">
        备用泵: {pumpResult.model}
        {isElectricPump && (
          <Badge bg="primary" className="ms-2">DT系列电动泵</Badge>
        )}
        {!isElectricPump && (
          <Badge bg="secondary" className="ms-2">D系列齿轮泵</Badge>
        )}
        {pumpResult.matchType && (
          <Badge
            bg={pumpResult.matchType === '直接匹配' || pumpResult.matchType === '最佳匹配' ? 'success' :
                pumpResult.matchType === '良好匹配' || pumpResult.matchType === '系列匹配' ? 'info' : 'warning'}
            className="ms-2"
          >
            {pumpResult.matchType}
          </Badge>
        )}
      </h6>
      {pumpResult.matchType === '默认选择' && (
        <Alert variant="warning" className="py-2 mb-2">
          <i className="bi bi-exclamation-circle me-1"></i>
          <small>泵为默认推荐，建议联系技术支持确认。电话: 0571-83802269</small>
        </Alert>
      )}
      {pumpResult.matchType && pumpResult.matchType.includes('模糊') && (
        <Alert variant="info" className="py-2 mb-2">
          <i className="bi bi-info-circle me-1"></i>
          <small>基于流量计算推荐，建议订货前联系技术支持确认型号。</small>
        </Alert>
      )}
      <Table bordered size="sm" style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
        <tbody>
          <tr>
            <td width="30%">型号</td>
            <td><strong>{pumpResult.model}</strong></td>
          </tr>
          <tr>
            <td>系列</td>
            <td>
              {isElectricPump ? '2CYA系列 (DT电推专用电动泵)' : '2CY-D系列 (传统齿轮泵)'}
            </td>
          </tr>
          <tr>
            <td>流量</td>
            <td>{pumpResult.flow} L/min</td>
          </tr>
          <tr>
            <td>压力</td>
            <td>{pumpResult.pressure} MPa</td>
          </tr>
          <tr>
            <td>电机功率</td>
            <td>{pumpResult.motorPower} kW</td>
          </tr>
          {isElectricPump && (
            <tr>
              <td>电源规格</td>
              <td>{pumpResult.voltage || '380V'} {pumpResult.phase || '三相'}</td>
            </tr>
          )}
          <tr>
            <td>重量</td>
            <td>{pumpResult.weight || '-'} kg</td>
          </tr>
          <tr>
            <td>市场价</td>
            <td className="text-danger fw-bold">{formatPrice(pumpResult.marketPrice)}</td>
          </tr>
          <tr>
            <td>配套依据</td>
            <td>
              {pumpResult.matchType || '-'}
              {pumpResult.matchInfo && <small className="d-block text-muted">{pumpResult.matchInfo}</small>}
            </td>
          </tr>
          {pumpResult.notes && (
            <tr>
              <td>备注</td>
              <td><small>{pumpResult.notes}</small></td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* DT系列特殊说明 */}
      {isDTGearbox && isElectricPump && (
        <Alert variant="info" className="mt-2">
          <i className="bi bi-lightning-charge me-2"></i>
          <strong>DT电力推进系统说明：</strong>
          <p className="mb-0 mt-1">
            <small>DT系列齿轮箱采用电力推进技术，需配套2CYA系列电动备用泵。该泵采用380V三相交流电驱动，适用于DT系列的低流量、低压力润滑需求。</small>
          </p>
        </Alert>
      )}

      {/* 显示备选型号 */}
      {pumpResult.alternatives && pumpResult.alternatives.length > 0 && (
        <div className="mt-3">
          <h6 style={{ color: colors?.headerText }}>备选型号</h6>
          <Table bordered size="sm" style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
            <thead>
              <tr>
                <th>型号</th>
                <th>流量</th>
                <th>压力</th>
                <th>功率</th>
                <th>价格</th>
              </tr>
            </thead>
            <tbody>
              {pumpResult.alternatives.slice(0, 3).map((alt, idx) => (
                <tr key={idx}>
                  <td>
                    {alt.model}
                    {alt.type === 'electric' && <Badge bg="primary" className="ms-1" style={{ fontSize: '0.65em' }}>电动</Badge>}
                  </td>
                  <td>{alt.flow} L/min</td>
                  <td>{alt.pressure} MPa</td>
                  <td>{alt.motorPower} kW</td>
                  <td>{formatPrice(alt.marketPrice)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {pumpResult.warning && (
        <Alert variant="info" className="mt-2">
          <i className="bi bi-info-circle me-2"></i>
          {pumpResult.warning}
        </Alert>
      )}

      {/* 备用泵数据验证警告 */}
      <ValidationWarnings validation={validation} type="pump" />
    </div>
  );
};

export default PumpInfoSection;
