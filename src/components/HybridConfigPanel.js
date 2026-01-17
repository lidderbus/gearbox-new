/**
 * 混合动力配置面板组件
 * Hybrid Propulsion Configuration Panel
 *
 * 创建日期: 2026-01-03
 * 功能: 配置PTI/PTO/PTH混合动力参数
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Form, Row, Col, Badge, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  HYBRID_MODES,
  HYBRID_SELECTION_PARAMS,
  VESSEL_HYBRID_SUITABILITY,
  EMISSION_FACTORS,
  getHybridDataByBrand,
  getBrandHybridPowerComparison
} from '../data/hybridPropulsionData';
import BrandSelector from './BrandSelector';
import { BRAND_IDS, DEFAULT_BRAND, getBrandConfig, isBrandHybridEnabled } from '../data/brandConfig';

/**
 * 帮助提示组件
 */
const HelpIcon = ({ content }) => (
  <OverlayTrigger
    placement="top"
    overlay={<Tooltip>{content}</Tooltip>}
  >
    <span
      style={{
        cursor: 'help',
        marginLeft: '5px',
        color: '#6c757d',
        fontSize: '0.85em'
      }}
    >
      ⓘ
    </span>
  </OverlayTrigger>
);

/**
 * 混合动力配置面板
 * @param {Object} props
 * @param {Object} props.hybridConfig - 混合动力配置状态
 * @param {Function} props.setHybridConfig - 更新配置函数
 * @param {number} props.enginePower - 主机功率 (kW)
 * @param {Object} props.colors - 主题颜色
 * @param {boolean} props.collapsed - 是否折叠
 */
const HybridConfigPanel = ({
  hybridConfig = {},
  setHybridConfig,
  enginePower = 0,
  colors = {},
  collapsed = true,
  selectedBrand = DEFAULT_BRAND,
  onBrandChange
}) => {
  // 本地状态
  const [isExpanded, setIsExpanded] = useState(!collapsed);
  const [localBrand, setLocalBrand] = useState(selectedBrand);

  // 品牌变更处理
  const handleBrandChange = (brandId) => {
    setLocalBrand(brandId);
    if (onBrandChange) {
      onBrandChange(brandId);
    }
  };

  // 获取当前品牌的混动数据
  const currentBrandHybridData = useMemo(() => {
    return getHybridDataByBrand(localBrand);
  }, [localBrand]);

  // 检查当前品牌是否支持混动
  const brandHybridEnabled = isBrandHybridEnabled(localBrand);
  const brandConfig = getBrandConfig(localBrand);

  // 默认配置
  const defaultConfig = {
    enabled: false,
    modes: {
      pto: false,
      pti: false,
      pth: false
    },
    ptiPower: '',      // kW
    ptoPower: '',      // kW
    vesselType: '',    // 船型
    fuelType: 'MGO',   // 燃油类型
    notes: ''
  };

  // 合并配置
  const config = { ...defaultConfig, ...hybridConfig };

  // 更新配置
  const updateConfig = (field, value) => {
    if (setHybridConfig) {
      setHybridConfig({ ...config, [field]: value });
    }
  };

  // 更新模式配置
  const updateMode = (mode, enabled) => {
    const newModes = { ...config.modes, [mode]: enabled };
    updateConfig('modes', newModes);
  };

  // 计算推荐的PTI/PTO功率
  const recommendedPowers = useMemo(() => {
    const power = parseFloat(enginePower) || 0;
    const params = HYBRID_SELECTION_PARAMS;

    return {
      ptiTypical: Math.round(power * params.ptiPowerRatio.typical),
      ptiMin: Math.round(power * params.ptiPowerRatio.min),
      ptiMax: Math.round(power * params.ptiPowerRatio.max),
      ptoTypical: Math.round(power * params.ptoPowerRatio.typical),
      ptoMin: Math.round(power * params.ptoPowerRatio.min),
      ptoMax: Math.round(power * params.ptoPowerRatio.max)
    };
  }, [enginePower]);

  // 计算预估节能效果
  const estimatedSavings = useMemo(() => {
    const savings = HYBRID_SELECTION_PARAMS.fuelSavingsEstimate;
    const modesEnabled = [];

    if (config.modes.pto) modesEnabled.push('PTO');
    if (config.modes.pti) modesEnabled.push('PTI');
    if (config.modes.pth) modesEnabled.push('PTH');

    if (modesEnabled.length === 0) {
      return { min: 0, max: 0, modes: [] };
    }

    // 综合计算节能范围
    let minSaving = 0;
    let maxSaving = 0;

    if (config.modes.pto) {
      minSaving = Math.max(minSaving, savings.ptoMode.min);
      maxSaving = Math.max(maxSaving, savings.ptoMode.max);
    }
    if (config.modes.pti) {
      minSaving = Math.max(minSaving, savings.ptiMode.min);
      maxSaving = Math.max(maxSaving, savings.ptiMode.max);
    }
    if (config.modes.pth) {
      // PTH模式在港区使用，不计入整体节能
    }

    return { min: minSaving, max: maxSaving, modes: modesEnabled };
  }, [config.modes]);

  // 获取船型适用性评级
  const getSuitabilityRating = (vesselType) => {
    const high = VESSEL_HYBRID_SUITABILITY.highSuitability.find(v => v.type === vesselType);
    if (high) return { level: 'high', color: 'success', label: '非常适合', reason: high.reason };

    const medium = VESSEL_HYBRID_SUITABILITY.mediumSuitability.find(v => v.type === vesselType);
    if (medium) return { level: 'medium', color: 'warning', label: '中等适合', reason: medium.reason };

    const low = VESSEL_HYBRID_SUITABILITY.lowSuitability.find(v => v.type === vesselType);
    if (low) return { level: 'low', color: 'secondary', label: '一般适合', reason: low.reason };

    return null;
  };

  // 船型选项
  const vesselTypeOptions = [
    { value: '', label: '-- 选择船型 --' },
    { value: 'ferry', label: '渡轮' },
    { value: 'offshore_supply', label: '海工供应船' },
    { value: 'tug', label: '拖轮' },
    { value: 'cruise', label: '邮轮' },
    { value: 'research', label: '科考船' },
    { value: 'fishing', label: '渔船' },
    { value: 'cargo', label: '货船' },
    { value: 'tanker', label: '油轮' },
    { value: 'container', label: '集装箱船' },
    { value: 'bulk', label: '散货船' }
  ];

  // 当前船型的适用性
  const currentSuitability = config.vesselType ? getSuitabilityRating(config.vesselType) : null;

  return (
    <Card
      className="mb-4"
      style={{
        backgroundColor: colors.card || '#fff',
        borderColor: config.enabled ? '#28a745' : (colors.border || '#dee2e6'),
        borderWidth: config.enabled ? '2px' : '1px'
      }}
    >
      <Card.Header
        style={{
          backgroundColor: config.enabled ? '#d4edda' : (colors.headerBg || '#f8f9fa'),
          color: config.enabled ? '#155724' : (colors.headerText || '#212529'),
          borderBottomColor: colors.border || '#dee2e6',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2em' }}>⚡</span>
          <span>混合动力配置 (PTI/PTO)</span>
          {config.enabled && (
            <Badge bg="success" style={{ fontSize: '0.75em' }}>已启用</Badge>
          )}
          <Badge bg="info" style={{ fontSize: '0.7em' }}>新功能</Badge>
        </div>
        <span>{isExpanded ? '▲' : '▼'}</span>
      </Card.Header>

      {isExpanded && (
        <Card.Body style={{ padding: '1.5rem' }}>
          {/* 启用开关 */}
          <Form.Group className="mb-4">
            <Form.Check
              type="switch"
              id="hybrid-enabled"
              label={
                <span>
                  <strong>启用混合动力选型</strong>
                  <HelpIcon content="启用后可配置PTI/PTO/PTH功能，筛选支持混合动力的齿轮箱" />
                </span>
              }
              checked={config.enabled}
              onChange={(e) => updateConfig('enabled', e.target.checked)}
              style={{ fontSize: '1.1em' }}
            />
          </Form.Group>

          {config.enabled && (
            <>
              {/* 品牌选择器 */}
              <BrandSelector
                selectedBrand={localBrand}
                onBrandChange={handleBrandChange}
                requiredPower={enginePower}
                showDetails={true}
                collapsed={false}
                colors={colors}
              />

              {/* 品牌混动支持状态 */}
              {!brandHybridEnabled && (
                <Alert variant="warning" className="mb-3">
                  <strong>⚠️ 注意:</strong> {brandConfig?.shortName || localBrand} 目前混动数据待完善。
                  建议选择杭州前进(ADVANCE)或ZF Marine获取完整混动配置支持。
                </Alert>
              )}

              {brandHybridEnabled && currentBrandHybridData && (
                <Alert variant="success" className="mb-3" style={{ fontSize: '0.9em' }}>
                  <strong>✓ {brandConfig?.shortName} 混动支持:</strong>
                  <div className="mt-2">
                    {currentBrandHybridData.hybridStatus && (
                      <>
                        <Badge bg="success" className="me-2">
                          {currentBrandHybridData.hybridStatus.available ? '混动可用' : '待确认'}
                        </Badge>
                        {currentBrandHybridData.hybridStatus.hybridSeries && (
                          <span className="me-3">
                            系列: {currentBrandHybridData.hybridStatus.hybridSeries.join(', ')}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </Alert>
              )}

              {/* 杭齿GC系列PTO/PTI详情 (2026-01-15新增) */}
              {localBrand === BRAND_IDS.ADVANCE && currentBrandHybridData?.gcSeries && (
                <Card className="mb-3" style={{ backgroundColor: colors.card || '#f8f9fa', border: '1px solid #17a2b8' }}>
                  <Card.Header style={{ backgroundColor: '#17a2b8', color: 'white', padding: '0.5rem 1rem' }}>
                    <strong>GC系列船用齿轮箱 (带PTO/PTI)</strong>
                    <Badge bg="light" text="dark" className="ms-2" style={{ fontSize: '0.7em' }}>官网数据</Badge>
                  </Card.Header>
                  <Card.Body style={{ padding: '1rem' }}>
                    <p style={{ fontSize: '0.85em', marginBottom: '0.75rem' }}>
                      {currentBrandHybridData.gcSeries.description}
                    </p>

                    {/* GC系列子系列表格 - 2026-01-15更新: 增加详细技术参数 */}
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', fontSize: '0.75em', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ backgroundColor: colors.headerBg || '#e9ecef' }}>
                            <th style={{ padding: '0.4rem', border: '1px solid #dee2e6', textAlign: 'left' }}>系列</th>
                            <th style={{ padding: '0.4rem', border: '1px solid #dee2e6', textAlign: 'left' }}>配置</th>
                            <th style={{ padding: '0.4rem', border: '1px solid #dee2e6', textAlign: 'center' }}>速比</th>
                            <th style={{ padding: '0.4rem', border: '1px solid #dee2e6', textAlign: 'center' }}>传递能力</th>
                            <th style={{ padding: '0.4rem', border: '1px solid #dee2e6', textAlign: 'center' }}>输入转速</th>
                            <th style={{ padding: '0.4rem', border: '1px solid #dee2e6', textAlign: 'center' }}>混动</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentBrandHybridData.gcSeries.subSeries.map((series, idx) => (
                            <tr
                              key={series.code}
                              style={{
                                backgroundColor: series.highlight
                                  ? '#d4edda'  // 高亮支持PTI的系列
                                  : (idx % 2 === 0 ? 'transparent' : (colors.rowAlt || '#f8f9fa'))
                              }}
                            >
                              <td style={{ padding: '0.35rem 0.4rem', border: '1px solid #dee2e6', fontWeight: 'bold' }}>
                                {series.code}
                                {series.highlight && (
                                  <Badge bg="warning" text="dark" className="ms-1" style={{ fontSize: '0.6em' }}>混动</Badge>
                                )}
                              </td>
                              <td style={{ padding: '0.35rem 0.4rem', border: '1px solid #dee2e6' }}>
                                {series.config}/{series.stages}级
                              </td>
                              <td style={{ padding: '0.35rem 0.4rem', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                {series.specs?.ratioRange
                                  ? `${series.specs.ratioRange.min}-${series.specs.ratioRange.max}`
                                  : '-'}
                              </td>
                              <td style={{ padding: '0.35rem 0.4rem', border: '1px solid #dee2e6', textAlign: 'center', fontSize: '0.9em' }}>
                                {series.specs?.transmissionCapacity
                                  ? `${series.specs.transmissionCapacity.min}-${series.specs.transmissionCapacity.max}`
                                  : '-'}
                                <br />
                                <span style={{ fontSize: '0.8em', color: '#6c757d' }}>kW/(r/min)</span>
                              </td>
                              <td style={{ padding: '0.35rem 0.4rem', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                {series.specs?.inputSpeedRange
                                  ? `${series.specs.inputSpeedRange.min}-${series.specs.inputSpeedRange.max}`
                                  : '-'}
                                <br />
                                <span style={{ fontSize: '0.8em', color: '#6c757d' }}>rpm</span>
                              </td>
                              <td style={{ padding: '0.35rem 0.4rem', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                {series.hybridModes.map(mode => (
                                  <Badge
                                    key={mode}
                                    bg={mode === 'PTI' ? 'primary' : 'success'}
                                    className="me-1"
                                    style={{ fontSize: '0.65em' }}
                                  >
                                    {mode}
                                  </Badge>
                                ))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* PTI说明 */}
                    <div className="mt-2 p-2" style={{ backgroundColor: '#fff3cd', borderRadius: '4px', fontSize: '0.8em' }}>
                      <strong>核心混动系列:</strong>
                      <span className="ms-2">GCST/GCHT系列同时支持PTO和PTI混动功能，速比4-6，传递能力3.446-6.99 kW/(r/min)</span>
                    </div>

                    {/* 辅助齿轮箱信息 */}
                    {currentBrandHybridData.auxiliaryGearbox && (
                      <div className="mt-3 p-2" style={{ backgroundColor: colors.inputBg || '#fff', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                        <strong style={{ fontSize: '0.85em' }}>船舶辅助齿轮箱 (专用PTO输出):</strong>
                        <p style={{ fontSize: '0.8em', marginBottom: '0.5rem', marginTop: '0.25rem' }}>
                          {currentBrandHybridData.auxiliaryGearbox.description}
                        </p>
                        <div style={{ fontSize: '0.75em' }}>
                          应用: {currentBrandHybridData.auxiliaryGearbox.applications.join('、')}
                        </div>
                      </div>
                    )}

                    {/* 应用案例 */}
                    {currentBrandHybridData.applicationCases && currentBrandHybridData.applicationCases.length > 0 && (
                      <div className="mt-3 p-2" style={{ backgroundColor: '#d4edda', borderRadius: '4px' }}>
                        <strong style={{ fontSize: '0.85em' }}>应用案例:</strong>
                        {currentBrandHybridData.applicationCases.map((caseItem, idx) => (
                          <div key={idx} style={{ fontSize: '0.8em', marginTop: '0.25rem' }}>
                            <Badge bg="success" style={{ fontSize: '0.7em' }}>{caseItem.status}</Badge>
                            <span className="ms-2">{caseItem.vessel} ({caseItem.type}) - {caseItem.owner} {caseItem.year}年</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              )}

              {/* 模式说明 */}
              <Alert variant="info" className="mb-4" style={{ fontSize: '0.9em' }}>
                <strong>混合动力工作模式说明:</strong>
                <ul className="mb-0 mt-2">
                  <li><strong>PTO (轴带发电)</strong>: 主机驱动发电机,减少辅机运行,节省5-15%燃油</li>
                  <li><strong>PTI (混合动力)</strong>: 电机辅助推进,提供10-15%额外功率</li>
                  <li><strong>PTH (纯电推)</strong>: 港区零排放航行或紧急回港</li>
                </ul>
              </Alert>

              <Row>
                <Col md={6}>
                  {/* 船型选择 */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      船舶类型
                      <HelpIcon content="不同船型对混合动力的适用性不同" />
                    </Form.Label>
                    <Form.Select
                      value={config.vesselType}
                      onChange={(e) => updateConfig('vesselType', e.target.value)}
                      style={{
                        backgroundColor: colors.inputBg || '#fff',
                        color: colors.text || '#212529',
                        borderColor: colors.inputBorder || '#ced4da'
                      }}
                    >
                      {vesselTypeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Form.Select>
                    {currentSuitability && (
                      <div className="mt-2">
                        <Badge bg={currentSuitability.color}>{currentSuitability.label}</Badge>
                        <small className="ms-2" style={{ color: colors.muted || '#6c757d' }}>
                          {currentSuitability.reason}
                        </small>
                      </div>
                    )}
                  </Form.Group>

                  {/* 模式选择 */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      选择工作模式
                      <HelpIcon content="可同时选择多种模式，齿轮箱需支持相应接口" />
                    </Form.Label>
                    <div className="d-flex flex-column gap-2">
                      <Form.Check
                        type="checkbox"
                        id="mode-pto"
                        label={
                          <span>
                            <strong>PTO</strong> - 轴带发电模式
                            <Badge bg="success" className="ms-2" style={{ fontSize: '0.7em' }}>
                              节能5-15%
                            </Badge>
                          </span>
                        }
                        checked={config.modes.pto}
                        onChange={(e) => updateMode('pto', e.target.checked)}
                      />
                      <Form.Check
                        type="checkbox"
                        id="mode-pti"
                        label={
                          <span>
                            <strong>PTI</strong> - 混合动力模式
                            <Badge bg="primary" className="ms-2" style={{ fontSize: '0.7em' }}>
                              +10-15%功率
                            </Badge>
                          </span>
                        }
                        checked={config.modes.pti}
                        onChange={(e) => updateMode('pti', e.target.checked)}
                      />
                      <Form.Check
                        type="checkbox"
                        id="mode-pth"
                        label={
                          <span>
                            <strong>PTH</strong> - 纯电推模式
                            <Badge bg="info" className="ms-2" style={{ fontSize: '0.7em' }}>
                              零排放
                            </Badge>
                          </span>
                        }
                        checked={config.modes.pth}
                        onChange={(e) => updateMode('pth', e.target.checked)}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  {/* PTI功率配置 */}
                  {config.modes.pti && (
                    <Form.Group className="mb-3">
                      <Form.Label>
                        PTI电机功率 (kW)
                        <HelpIcon content={`建议范围: ${recommendedPowers.ptiMin}-${recommendedPowers.ptiMax} kW (主机功率的10-20%)`} />
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={config.ptiPower}
                        onChange={(e) => updateConfig('ptiPower', e.target.value)}
                        placeholder={`推荐: ${recommendedPowers.ptiTypical} kW`}
                        style={{
                          backgroundColor: colors.inputBg || '#fff',
                          color: colors.text || '#212529',
                          borderColor: colors.inputBorder || '#ced4da'
                        }}
                      />
                      <Form.Text className="text-muted">
                        推荐范围: {recommendedPowers.ptiMin} - {recommendedPowers.ptiMax} kW
                      </Form.Text>
                    </Form.Group>
                  )}

                  {/* PTO功率配置 */}
                  {config.modes.pto && (
                    <Form.Group className="mb-3">
                      <Form.Label>
                        PTO发电机功率 (kW)
                        <HelpIcon content={`建议范围: ${recommendedPowers.ptoMin}-${recommendedPowers.ptoMax} kW (主机功率的8-18%)`} />
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={config.ptoPower}
                        onChange={(e) => updateConfig('ptoPower', e.target.value)}
                        placeholder={`推荐: ${recommendedPowers.ptoTypical} kW`}
                        style={{
                          backgroundColor: colors.inputBg || '#fff',
                          color: colors.text || '#212529',
                          borderColor: colors.inputBorder || '#ced4da'
                        }}
                      />
                      <Form.Text className="text-muted">
                        推荐范围: {recommendedPowers.ptoMin} - {recommendedPowers.ptoMax} kW
                      </Form.Text>
                    </Form.Group>
                  )}

                  {/* 燃油类型 */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      燃油类型
                      <HelpIcon content="用于计算碳排放估算" />
                    </Form.Label>
                    <Form.Select
                      value={config.fuelType}
                      onChange={(e) => updateConfig('fuelType', e.target.value)}
                      style={{
                        backgroundColor: colors.inputBg || '#fff',
                        color: colors.text || '#212529',
                        borderColor: colors.inputBorder || '#ced4da'
                      }}
                    >
                      {Object.entries(EMISSION_FACTORS.fuelTypes).map(([key, fuel]) => (
                        <option key={key} value={key}>{fuel.name} ({fuel.nameEN})</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* 预估节能效果 */}
              {estimatedSavings.modes.length > 0 && (
                <Alert
                  variant="success"
                  className="mt-3"
                  style={{
                    backgroundColor: '#d4edda',
                    borderColor: '#c3e6cb',
                    color: '#155724'
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.5em' }}>🌿</span>
                    <div>
                      <strong>预估节能效果:</strong>
                      <span className="ms-2">
                        每航次节省燃油 {estimatedSavings.min}-{estimatedSavings.max}%
                      </span>
                      <div className="mt-1">
                        <small>
                          已启用模式: {estimatedSavings.modes.join(' + ')}
                          {config.modes.pth && ' | PTH模式可在港区实现零排放'}
                        </small>
                      </div>
                    </div>
                  </div>
                </Alert>
              )}

              {/* 备注 */}
              <Form.Group className="mt-3">
                <Form.Label>备注</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={config.notes}
                  onChange={(e) => updateConfig('notes', e.target.value)}
                  placeholder="其他混合动力相关需求说明..."
                  style={{
                    backgroundColor: colors.inputBg || '#fff',
                    color: colors.text || '#212529',
                    borderColor: colors.inputBorder || '#ced4da'
                  }}
                />
              </Form.Group>

              {/* 提示信息 */}
              <Alert variant="warning" className="mt-3" style={{ fontSize: '0.85em' }}>
                <strong>注意:</strong> 混合动力齿轮箱为定制产品，需联系杭州前进齿轮箱集团获取详细技术参数和报价。
                联系电话: 0571-XXXXXXXX
              </Alert>
            </>
          )}
        </Card.Body>
      )}
    </Card>
  );
};

export default HybridConfigPanel;
