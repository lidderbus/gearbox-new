/**
 * 竞品对比表格组件
 * Comparison Table Component
 *
 * 并排展示杭齿产品与竞品的详细对比
 */

import React from 'react';
import { Table, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  calculateAdvantages,
  formatPrice,
  formatDelivery,
  getManufacturerInfo
} from '../../utils/competitorAnalysis';
import { hangchiAdvantages, manufacturerColors } from '../../data/competitorData';
import { techDimensionsTemplate } from '../../data/competitorDataEnhanced';
import { FreshnessDot } from './DataFreshnessIndicator';
import { formatPowerRange } from '../../utils/gearboxDataEnhancer';

const ComparisonTable = ({
  hangchiProduct,
  competitors,
  colors,
  showAdvantages = true
}) => {
  if (!hangchiProduct || competitors.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <i className="bi bi-table fs-1 mb-3 d-block"></i>
        请选择杭齿产品和竞品进行对比
      </div>
    );
  }

  // 计算每个竞品的优势
  const competitorAdvantages = competitors.map(comp =>
    calculateAdvantages(hangchiProduct, comp)
  );

  // 判断杭齿是否有优势的样式
  const getAdvantageStyle = (isAdvantage) => {
    if (!showAdvantages) return {};
    return isAdvantage
      ? { backgroundColor: 'rgba(25, 135, 84, 0.1)', fontWeight: 'bold' }
      : {};
  };

  // 渲染优势标记
  const renderAdvantageTag = (isAdvantage, text) => {
    if (!showAdvantages || !isAdvantage) return null;
    return (
      <Badge bg="success" className="ms-1" style={{ fontSize: '0.65rem' }}>
        {text}
      </Badge>
    );
  };

  const renderTooltip = (text) => (
    <Tooltip>{text}</Tooltip>
  );

  return (
    <div className="table-responsive">
      <Table bordered hover className="mb-0 comparison-table">
        <thead>
          <tr style={{ backgroundColor: colors?.primary || '#2c5282', color: 'white' }}>
            <th style={{ width: '150px' }}>对比项</th>
            <th
              style={{
                backgroundColor: manufacturerColors.HANGCHI,
                minWidth: '180px'
              }}
            >
              <div className="d-flex align-items-center justify-content-center">
                <i className="bi bi-star-fill me-2"></i>
                杭齿前进
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                {hangchiProduct.model || '待选型'}
              </div>
            </th>
            {competitors.map((comp, idx) => (
              <th
                key={comp.model}
                style={{
                  backgroundColor: manufacturerColors[comp.manufacturer] || '#666',
                  minWidth: '180px'
                }}
              >
                <div>{getManufacturerInfo(comp.manufacturer)?.shortName} <FreshnessDot model={comp.model} /></div>
                <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                  {comp.model}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 厂商信息组 */}
          <tr className="table-secondary">
            <td colSpan={2 + competitors.length}>
              <strong><i className="bi bi-building me-2"></i>厂商信息</strong>
            </td>
          </tr>
          <tr>
            <td>厂商全称</td>
            <td>杭州前进齿轮箱集团</td>
            {competitors.map(comp => (
              <td key={comp.model}>
                {getManufacturerInfo(comp.manufacturer)?.name}
              </td>
            ))}
          </tr>
          <tr>
            <td>产品系列</td>
            <td>{hangchiProduct.series || '-'}</td>
            {competitors.map(comp => (
              <td key={comp.model}>{comp.series}</td>
            ))}
          </tr>
          <tr>
            <td>船级社认证</td>
            <td>
              <OverlayTrigger
                placement="top"
                overlay={renderTooltip('CCS, ABS, LR, BV, DNV, NK, RINA')}
              >
                <span>CCS, ABS, LR +4</span>
              </OverlayTrigger>
            </td>
            {competitors.map(comp => (
              <td key={comp.model}>
                <OverlayTrigger
                  placement="top"
                  overlay={renderTooltip(
                    getManufacturerInfo(comp.manufacturer)?.certifications?.join(', ') || '-'
                  )}
                >
                  <span>
                    {getManufacturerInfo(comp.manufacturer)?.certifications?.slice(0, 3).join(', ')}
                    {getManufacturerInfo(comp.manufacturer)?.certifications?.length > 3 && ' +...'}
                  </span>
                </OverlayTrigger>
              </td>
            ))}
          </tr>

          {/* 技术参数组 */}
          <tr className="table-secondary">
            <td colSpan={2 + competitors.length}>
              <strong><i className="bi bi-gear me-2"></i>技术参数</strong>
            </td>
          </tr>
          <tr>
            <td>功率范围</td>
            <td>
              {formatPowerRange(hangchiProduct)}
            </td>
            {competitors.map(comp => (
              <td key={comp.model}>
                {comp.powerRange[0]}-{comp.powerRange[1]} kW
              </td>
            ))}
          </tr>
          <tr>
            <td>转速范围</td>
            <td>
              {hangchiProduct.speedRange?.length === 2
                ? `${hangchiProduct.speedRange[0]}-${hangchiProduct.speedRange[1]} rpm`
                : '-'}
            </td>
            {competitors.map(comp => (
              <td key={comp.model}>
                {comp.speedRange[0]}-{comp.speedRange[1]} rpm
              </td>
            ))}
          </tr>
          <tr>
            <td>速比范围</td>
            <td>
              {hangchiProduct.ratios?.length
                ? `${Math.min(...hangchiProduct.ratios)}-${Math.max(...hangchiProduct.ratios)}`
                : '-'}
            </td>
            {competitors.map(comp => (
              <td key={comp.model}>
                {Math.min(...comp.ratios)}-{Math.max(...comp.ratios)}
              </td>
            ))}
          </tr>
          <tr>
            <td>
              传递能力
              <small className="text-muted d-block">kW/(r/min)</small>
            </td>
            <td style={getAdvantageStyle(competitorAdvantages.some(a => a.capacityAdvantage?.isAdvantage))}>
              {typeof hangchiProduct.transferCapacity === 'number' ? hangchiProduct.transferCapacity.toFixed(3) : (parseFloat(hangchiProduct.transferCapacity) || '-')}
              {competitorAdvantages.some(a => a.capacityAdvantage?.isAdvantage) &&
                renderAdvantageTag(true, '领先')}
            </td>
            {competitors.map((comp, idx) => (
              <td key={comp.model}>
                {typeof comp.transferCapacity === 'number' ? comp.transferCapacity.toFixed(3) : (parseFloat(comp.transferCapacity) || '-')}
              </td>
            ))}
          </tr>
          <tr>
            <td>推力 (kN)</td>
            <td>{hangchiProduct.thrust || '-'}</td>
            {competitors.map(comp => (
              <td key={comp.model}>{comp.thrust || '-'}</td>
            ))}
          </tr>
          <tr>
            <td>重量 (kg)</td>
            <td style={getAdvantageStyle(competitorAdvantages.some(a => a.weightAdvantage?.isAdvantage))}>
              {hangchiProduct.weight || '-'}
              {competitorAdvantages.some(a => a.weightAdvantage?.isAdvantage) &&
                renderAdvantageTag(true, '更轻')}
            </td>
            {competitors.map(comp => (
              <td key={comp.model}>{comp.weight || '-'}</td>
            ))}
          </tr>

          {/* 商务条款组 */}
          <tr className="table-secondary">
            <td colSpan={2 + competitors.length}>
              <strong><i className="bi bi-currency-yen me-2"></i>商务条款</strong>
            </td>
          </tr>
          <tr>
            <td>市场价格</td>
            <td style={getAdvantageStyle(competitorAdvantages.some(a => a.priceAdvantage?.isAdvantage))}>
              {formatPrice(hangchiProduct.price)}
              {competitorAdvantages.some(a => a.priceAdvantage?.isAdvantage) &&
                renderAdvantageTag(true, '优惠')}
            </td>
            {competitors.map((comp, idx) => (
              <td key={comp.model}>
                {formatPrice(comp.estimatedPrice)}
                {competitorAdvantages[idx]?.priceAdvantage?.isAdvantage && (
                  <small className="text-danger d-block">
                    贵 {competitorAdvantages[idx].priceAdvantage.percent}%
                  </small>
                )}
              </td>
            ))}
          </tr>
          <tr>
            <td>交货周期</td>
            <td style={getAdvantageStyle(competitorAdvantages.some(a => a.deliveryAdvantage?.isAdvantage))}>
              {formatDelivery(hangchiProduct.deliveryWeeks || hangchiAdvantages.deliveryAdvantage.hangchiWeeks)}
              {competitorAdvantages.some(a => a.deliveryAdvantage?.isAdvantage) &&
                renderAdvantageTag(true, '更快')}
            </td>
            {competitors.map((comp, idx) => (
              <td key={comp.model}>
                {formatDelivery(comp.deliveryWeeks)}
                {competitorAdvantages[idx]?.deliveryAdvantage?.isAdvantage && (
                  <small className="text-danger d-block">
                    慢 {competitorAdvantages[idx].deliveryAdvantage.diff}周
                  </small>
                )}
              </td>
            ))}
          </tr>
          <tr>
            <td>质保期限</td>
            <td style={getAdvantageStyle(competitorAdvantages.some(a => a.warrantyAdvantage?.isAdvantage))}>
              {hangchiProduct.warrantyMonths || hangchiAdvantages.warrantyAdvantage.hangchiMonths}个月
              {competitorAdvantages.some(a => a.warrantyAdvantage?.isAdvantage) &&
                renderAdvantageTag(true, '更长')}
            </td>
            {competitors.map((comp, idx) => (
              <td key={comp.model}>
                {comp.warrantyMonths}个月
              </td>
            ))}
          </tr>

          {/* 服务支持组 */}
          <tr className="table-secondary">
            <td colSpan={2 + competitors.length}>
              <strong><i className="bi bi-headset me-2"></i>服务支持</strong>
            </td>
          </tr>
          <tr>
            <td>售后响应</td>
            <td style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)' }}>
              <strong className="text-success">{hangchiAdvantages.serviceAdvantage.responseTime}小时</strong>
            </td>
            {competitors.map(comp => {
              const info = getManufacturerInfo(comp.manufacturer);
              const isImport = ['ZF', 'Reintjes', 'TwinDisc', 'MassonMarine'].includes(comp.manufacturer);
              return (
                <td key={comp.model} className="text-muted">
                  {isImport ? '48-72小时' : '24-48小时'}
                </td>
              );
            })}
          </tr>
          <tr>
            <td>服务网点</td>
            <td style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)' }}>
              <strong className="text-success">
                全国{hangchiAdvantages.serviceAdvantage.servicePoints}个
              </strong>
            </td>
            {competitors.map(comp => {
              const isImport = ['ZF', 'Reintjes', 'TwinDisc', 'MassonMarine'].includes(comp.manufacturer);
              const isDomesticLarge = ['CZCG', 'NGC'].includes(comp.manufacturer);
              return (
                <td key={comp.model} className="text-muted">
                  {isImport ? '进口配件周期长' : isDomesticLarge ? '20+服务点' : '10+服务点'}
                </td>
              );
            })}
          </tr>
          <tr>
            <td>配件供应</td>
            <td style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)' }}>
              <strong className="text-success">{hangchiAdvantages.serviceAdvantage.spareParts}</strong>
            </td>
            {competitors.map(comp => {
              const isImport = ['ZF', 'Reintjes', 'TwinDisc', 'MassonMarine'].includes(comp.manufacturer);
              return (
                <td key={comp.model} className="text-muted">
                  {isImport ? '进口4-8周' : '国产1-2周'}
                </td>
              );
            })}
          </tr>

          {/* 技术对比组 */}
          <tr className="table-secondary">
            <td colSpan={2 + competitors.length}>
              <strong><i className="bi bi-cpu me-2"></i>技术特性</strong>
            </td>
          </tr>
          {(() => {
            const hangchiTech = techDimensionsTemplate?.['HANGCHI'] || {};
            const techRows = [
              { key: 'propellerType', label: '螺旋桨支持', format: v => v === 'both' ? 'FPP+CPP' : v || '-' },
              { key: 'digitalMonitoring', label: '数字监控', format: v => v === true ? '✓ 支持' : v === 'partial' ? '◐ 部分' : '✗' },
              { key: 'hybridReady', label: '混动兼容', format: v => v === true ? '✓ 支持' : v === 'partial' ? '◐ 部分' : '✗' },
              { key: 'efficiencyClass', label: '效率等级', format: v => ({ premium: '卓越', high: '优良', standard: '标准' }[v] || '-') },
            ];
            return techRows.map(row => (
              <tr key={row.key}>
                <td>{row.label}</td>
                <td style={{ backgroundColor: 'rgba(253, 126, 20, 0.05)' }}>
                  {row.format(hangchiTech[row.key])}
                </td>
                {competitors.map(comp => {
                  const compTech = techDimensionsTemplate?.[comp.manufacturer] || {};
                  return <td key={comp.model}>{row.format(compTech[row.key])}</td>;
                })}
              </tr>
            ));
          })()}

          {/* 优势汇总 */}
          {showAdvantages && (
            <>
              <tr className="table-warning">
                <td colSpan={2 + competitors.length}>
                  <strong><i className="bi bi-trophy me-2"></i>杭齿优势汇总</strong>
                </td>
              </tr>
              <tr>
                <td>综合评分</td>
                <td>
                  <div className="d-flex align-items-center justify-content-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <i
                        key={star}
                        className="bi bi-star-fill text-warning me-1"
                        style={{ fontSize: '1.2rem' }}
                      ></i>
                    ))}
                  </div>
                </td>
                {competitors.map((comp, idx) => {
                  const score = 5 - (competitorAdvantages[idx]?.overallScore || 0) / 2;
                  const fullStars = Math.floor(score);
                  const hasHalf = score % 1 >= 0.5;
                  return (
                    <td key={comp.model}>
                      <div className="d-flex align-items-center justify-content-center">
                        {[...Array(fullStars)].map((_, i) => (
                          <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                        ))}
                        {hasHalf && <i className="bi bi-star-half text-warning me-1"></i>}
                        {[...Array(5 - fullStars - (hasHalf ? 1 : 0))].map((_, i) => (
                          <i key={i} className="bi bi-star text-warning me-1"></i>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td>核心优势</td>
                <td colSpan={1 + competitors.length}>
                  <div className="d-flex flex-wrap gap-2">
                    {competitorAdvantages.flatMap((a, idx) => a.highlights).filter((v, i, arr) =>
                      arr.indexOf(v) === i
                    ).map((highlight, i) => (
                      <Badge key={i} bg="success">{highlight}</Badge>
                    ))}
                  </div>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ComparisonTable;
