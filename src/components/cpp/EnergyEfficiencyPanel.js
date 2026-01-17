// src/components/cpp/EnergyEfficiencyPanel.js
// IMO能效合规面板组件 v1.0
// 支持: EEXI, CII, IMO 2030/2050目标评估
// 更新日期: 2026-01-09

import React, { useState, useMemo } from 'react';
import {
  calculateEEXI,
  calculateCII,
  evaluateCPPEnergyContribution,
  evaluateIMOTargets,
  evaluateHybridCompatibility,
  EEXI_REFERENCE_LINES,
  CII_RATING_BOUNDARIES
} from '../../utils/energyEfficiencyCompliance';
import { CO2_EMISSION_FACTORS } from '../../data/cppSystemData';

/**
 * IMO能效合规面板
 * 显示EEXI/CII计算结果、能效贡献、混合动力评估
 */
const EnergyEfficiencyPanel = ({
  gearbox,             // 齿轮箱数据
  vesselData = {},     // 船舶数据
  cppSystem = {},      // CPP系统配置
  showDetails = true   // 是否显示详情
}) => {
  const [activeTab, setActiveTab] = useState('eexi');
  const [shipType, setShipType] = useState(vesselData.shipType || 'generalCargo');

  // EEXI计算结果
  const eexiResult = useMemo(() => {
    if (!vesselData.installedPower || !vesselData.capacity || !vesselData.referenceSpeed) {
      return null;
    }
    return calculateEEXI({
      shipType,
      installedPower: vesselData.installedPower,
      capacity: vesselData.capacity,
      referenceSpeed: vesselData.referenceSpeed,
      fuelType: vesselData.fuelType || 'HFO',
      specificFuelConsumption: vesselData.sfc
    });
  }, [vesselData, shipType]);

  // CII计算结果
  const ciiResult = useMemo(() => {
    if (!vesselData.capacity || !vesselData.annualFuelConsumption || !vesselData.annualDistance) {
      return null;
    }
    return calculateCII({
      shipType,
      capacity: vesselData.capacity,
      annualFuelConsumption: vesselData.annualFuelConsumption,
      annualDistance: vesselData.annualDistance,
      fuelType: vesselData.fuelType || 'HFO',
      year: new Date().getFullYear()
    });
  }, [vesselData, shipType]);

  // CPP能效贡献评估
  const cppContribution = useMemo(() => {
    if (!gearbox && !cppSystem) return null;

    const systemConfig = {
      gearboxEfficiency: gearbox?.efficiency || cppSystem?.gearboxEfficiency || 0.97,
      propellerEfficiency: cppSystem?.propellerEfficiency || 0.65,
      hybridReady: gearbox?.energyEfficiency?.hybridReady || cppSystem?.hybridReady || false,
      electricCompatible: gearbox?.energyEfficiency?.electricCompatible || cppSystem?.electricCompatible || false,
      variablePitch: true
    };

    return evaluateCPPEnergyContribution(systemConfig, {
      installedPower: vesselData.installedPower || gearbox?.maxPower || 1000,
      typicalOperatingProfile: vesselData.operatingProfile || 'mixed'
    });
  }, [gearbox, cppSystem, vesselData]);

  // IMO目标评估
  const imoTargets = useMemo(() => {
    if (!ciiResult) return null;
    return evaluateIMOTargets({
      currentCII: ciiResult.attainedCII,
      shipType
    });
  }, [ciiResult, shipType]);

  // 混合动力兼容性
  const hybridCompatibility = useMemo(() => {
    if (!gearbox) return null;
    return evaluateHybridCompatibility({
      model: gearbox.model,
      series: gearbox.series,
      maxPower: gearbox.maxPower,
      hybridReady: gearbox.energyEfficiency?.hybridReady || false,
      electricCompatible: gearbox.energyEfficiency?.electricCompatible || false,
      ptoPtoCapability: gearbox.ptoPto || false,
      clutchType: gearbox.clutchType || 'mechanical'
    });
  }, [gearbox]);

  // 获取CII评级颜色
  const getCIIRatingColor = (rating) => {
    const colors = {
      A: '#52c41a',  // 绿色
      B: '#73d13d',  // 浅绿
      C: '#faad14',  // 黄色
      D: '#fa8c16',  // 橙色
      E: '#ff4d4f'   // 红色
    };
    return colors[rating] || '#d9d9d9';
  };

  // 船型列表
  const shipTypes = Object.entries(EEXI_REFERENCE_LINES).map(([key, value]) => ({
    key,
    name: value.name,
    nameEn: value.nameEn
  }));

  return (
    <div style={styles.container}>
      {/* 标题栏 */}
      <div style={styles.header}>
        <h4 style={styles.title}>IMO能效合规</h4>
        {eexiResult && (
          <span style={{
            ...styles.badge,
            background: eexiResult.compliant ? '#52c41a' : '#ff4d4f'
          }}>
            {eexiResult.compliant ? 'EEXI合规' : 'EEXI不合规'}
          </span>
        )}
      </div>

      {/* 船型选择 */}
      <div style={styles.shipTypeSelector}>
        <label style={styles.selectorLabel}>船型:</label>
        <select
          value={shipType}
          onChange={(e) => setShipType(e.target.value)}
          style={styles.select}
        >
          {shipTypes.map(type => (
            <option key={type.key} value={type.key}>
              {type.name} ({type.nameEn})
            </option>
          ))}
        </select>
      </div>

      {/* 选项卡 */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'eexi' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('eexi')}
        >
          EEXI
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'cii' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('cii')}
        >
          CII评级
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'cpp' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('cpp')}
        >
          CPP贡献
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'hybrid' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('hybrid')}
        >
          混合动力
        </button>
      </div>

      {/* EEXI面板 */}
      {activeTab === 'eexi' && (
        <div style={styles.tabContent}>
          {eexiResult ? (
            <>
              {/* EEXI仪表盘 */}
              <div style={styles.gaugeContainer}>
                <div style={styles.gaugeOuter}>
                  <div style={{
                    ...styles.gaugeInner,
                    background: eexiResult.compliant
                      ? `conic-gradient(#52c41a ${Math.min(100, (eexiResult.attainedEEXI / eexiResult.requiredEEXI) * 100)}%, #eee 0)`
                      : `conic-gradient(#ff4d4f ${Math.min(100, (eexiResult.attainedEEXI / eexiResult.requiredEEXI) * 100)}%, #eee 0)`
                  }}>
                    <div style={styles.gaugeCenter}>
                      <div style={styles.gaugeValue}>{eexiResult.attainedEEXI}</div>
                      <div style={styles.gaugeUnit}>{eexiResult.unit}</div>
                    </div>
                  </div>
                </div>
                <div style={styles.gaugeLabel}>实际EEXI</div>
              </div>

              {/* EEXI详情 */}
              <div style={styles.detailsGrid}>
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>参考EEXI</div>
                  <div style={styles.detailValue}>{eexiResult.referenceEEXI}</div>
                </div>
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>要求EEXI</div>
                  <div style={styles.detailValue}>{eexiResult.requiredEEXI}</div>
                </div>
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>削减要求</div>
                  <div style={styles.detailValue}>{eexiResult.reductionFactor}%</div>
                </div>
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>裕度</div>
                  <div style={{
                    ...styles.detailValue,
                    color: eexiResult.margin >= 0 ? '#52c41a' : '#ff4d4f'
                  }}>
                    {eexiResult.margin > 0 ? '+' : ''}{eexiResult.margin}%
                  </div>
                </div>
              </div>

              {/* 合规状态 */}
              <div style={{
                ...styles.statusBar,
                background: eexiResult.compliant ? '#d4edda' : '#f8d7da',
                borderColor: eexiResult.compliant ? '#c3e6cb' : '#f5c6cb'
              }}>
                <span style={{
                  color: eexiResult.compliant ? '#155724' : '#721c24'
                }}>
                  {eexiResult.message}
                </span>
              </div>

              {/* 标准信息 */}
              <div style={styles.standardInfo}>
                <div>标准: {eexiResult.standard}</div>
                <div>生效日期: {eexiResult.effectiveDate}</div>
                <div>燃料类型: {eexiResult.input.fuelName}</div>
                <div>SFC: {eexiResult.input.sfc} g/kWh</div>
              </div>
            </>
          ) : (
            <div style={styles.noData}>
              <div style={styles.noDataIcon}>!</div>
              <div style={styles.noDataText}>请输入船舶参数计算EEXI</div>
              <div style={styles.noDataHint}>
                需要: 装机功率、载重量、参考航速
              </div>
            </div>
          )}
        </div>
      )}

      {/* CII面板 */}
      {activeTab === 'cii' && (
        <div style={styles.tabContent}>
          {ciiResult ? (
            <>
              {/* CII评级卡片 */}
              <div style={styles.ciiRatingCard}>
                <div style={{
                  ...styles.ciiRatingBadge,
                  background: getCIIRatingColor(ciiResult.rating)
                }}>
                  {ciiResult.rating}
                </div>
                <div style={styles.ciiRatingText}>
                  {ciiResult.ratingDescription.level}
                </div>
                <div style={styles.ciiRatingAction}>
                  {ciiResult.ratingDescription.action}
                </div>
              </div>

              {/* CII条形图 */}
              <div style={styles.ciiBarChart}>
                <div style={styles.ciiBarLabel}>CII评级分布</div>
                <div style={styles.ciiBar}>
                  <div style={{ ...styles.ciiBarSegment, background: '#52c41a', flex: 1 }}>A</div>
                  <div style={{ ...styles.ciiBarSegment, background: '#73d13d', flex: 1 }}>B</div>
                  <div style={{ ...styles.ciiBarSegment, background: '#faad14', flex: 1 }}>C</div>
                  <div style={{ ...styles.ciiBarSegment, background: '#fa8c16', flex: 1 }}>D</div>
                  <div style={{ ...styles.ciiBarSegment, background: '#ff4d4f', flex: 1 }}>E</div>
                </div>
                <div style={styles.ciiMarker}>
                  <div style={{
                    ...styles.ciiMarkerArrow,
                    left: `${Math.min(95, Math.max(5, getCIIPosition(ciiResult)))}%`
                  }}>
                    ▲
                    <div style={styles.ciiMarkerValue}>{ciiResult.attainedCII}</div>
                  </div>
                </div>
              </div>

              {/* CII边界值 */}
              <div style={styles.ciiThresholds}>
                <div style={styles.thresholdItem}>
                  <span style={{ color: '#52c41a' }}>A ≤</span>
                  <span>{ciiResult.ratingBoundaries.A}</span>
                </div>
                <div style={styles.thresholdItem}>
                  <span style={{ color: '#73d13d' }}>B ≤</span>
                  <span>{ciiResult.ratingBoundaries.B}</span>
                </div>
                <div style={styles.thresholdItem}>
                  <span style={{ color: '#faad14' }}>C ≤</span>
                  <span>{ciiResult.ratingBoundaries.C}</span>
                </div>
                <div style={styles.thresholdItem}>
                  <span style={{ color: '#fa8c16' }}>D ≤</span>
                  <span>{ciiResult.ratingBoundaries.D}</span>
                </div>
              </div>

              {/* 年度数据 */}
              <div style={styles.annualData}>
                <div style={styles.annualItem}>
                  <div style={styles.annualLabel}>年CO2排放</div>
                  <div style={styles.annualValue}>{ciiResult.annualCO2} 吨</div>
                </div>
                <div style={styles.annualItem}>
                  <div style={styles.annualLabel}>年航行里程</div>
                  <div style={styles.annualValue}>{ciiResult.input.annualDistance} nm</div>
                </div>
              </div>

              {/* IMO目标进度 */}
              {imoTargets && (
                <div style={styles.imoTargets}>
                  <div style={styles.sectionTitle}>IMO减排目标进度</div>
                  <div style={styles.targetRow}>
                    <div style={styles.targetLabel}>2030目标 (40%)</div>
                    <div style={styles.targetProgress}>
                      <div style={styles.progressBg}>
                        <div style={{
                          ...styles.progressFill,
                          width: `${Math.min(100, imoTargets.target2030.progress)}%`,
                          background: imoTargets.target2030.color
                        }} />
                      </div>
                      <span>{imoTargets.target2030.progress}%</span>
                    </div>
                    <span style={{ color: imoTargets.target2030.color }}>
                      {imoTargets.target2030.icon}
                    </span>
                  </div>
                  <div style={styles.targetRow}>
                    <div style={styles.targetLabel}>2050目标 (70%)</div>
                    <div style={styles.targetProgress}>
                      <div style={styles.progressBg}>
                        <div style={{
                          ...styles.progressFill,
                          width: `${Math.min(100, imoTargets.target2050.progress)}%`,
                          background: imoTargets.target2050.color
                        }} />
                      </div>
                      <span>{imoTargets.target2050.progress}%</span>
                    </div>
                    <span style={{ color: imoTargets.target2050.color }}>
                      {imoTargets.target2050.icon}
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={styles.noData}>
              <div style={styles.noDataIcon}>!</div>
              <div style={styles.noDataText}>请输入年度运营数据计算CII</div>
              <div style={styles.noDataHint}>
                需要: 载重量、年燃料消耗、年航行里程
              </div>
            </div>
          )}
        </div>
      )}

      {/* CPP贡献面板 */}
      {activeTab === 'cpp' && (
        <div style={styles.tabContent}>
          {cppContribution ? (
            <>
              {/* 效率环形图 */}
              <div style={styles.efficiencyRings}>
                <EfficiencyRing
                  label="齿轮箱效率"
                  value={cppContribution.efficiency.gearbox}
                  color="#1890ff"
                />
                <EfficiencyRing
                  label="螺旋桨效率"
                  value={cppContribution.efficiency.propeller}
                  color="#52c41a"
                />
                <EfficiencyRing
                  label="系统效率"
                  value={cppContribution.efficiency.system}
                  color="#722ed1"
                />
              </div>

              {/* 节能潜力 */}
              <div style={styles.savingsSection}>
                <div style={styles.sectionTitle}>节能潜力分析</div>
                <div style={styles.savingsList}>
                  <div style={styles.savingItem}>
                    <span>CPP变距优化</span>
                    <span style={styles.savingValue}>-{cppContribution.savings.cppOptimization}%</span>
                  </div>
                  <div style={styles.savingItem}>
                    <span>混合动力潜力</span>
                    <span style={styles.savingValue}>-{cppContribution.savings.hybridPotential}%</span>
                  </div>
                  <div style={styles.savingItem}>
                    <span>电力推进潜力</span>
                    <span style={styles.savingValue}>-{cppContribution.savings.electricPotential}%</span>
                  </div>
                  <div style={{ ...styles.savingItem, ...styles.savingTotal }}>
                    <span>总节能潜力</span>
                    <span style={styles.savingTotalValue}>-{cppContribution.savings.total}%</span>
                  </div>
                </div>
              </div>

              {/* 年度估算 */}
              <div style={styles.annualEstimate}>
                <div style={styles.sectionTitle}>年度效益估算</div>
                <div style={styles.estimateGrid}>
                  <div style={styles.estimateItem}>
                    <div style={styles.estimateValue}>{cppContribution.annualEstimate.fuelSaved}</div>
                    <div style={styles.estimateLabel}>年节省燃料 (吨)</div>
                  </div>
                  <div style={styles.estimateItem}>
                    <div style={styles.estimateValue}>{cppContribution.annualEstimate.co2Reduced}</div>
                    <div style={styles.estimateLabel}>年减排CO2 (吨)</div>
                  </div>
                  <div style={styles.estimateItem}>
                    <div style={styles.estimateValue}>${cppContribution.annualEstimate.costSaved.toLocaleString()}</div>
                    <div style={styles.estimateLabel}>年节省成本</div>
                  </div>
                </div>
              </div>

              {/* EEXI贡献 */}
              <div style={styles.eexiContribution}>
                <span>EEXI贡献: </span>
                <span style={{
                  color: cppContribution.eexiContribution < 0 ? '#52c41a' : '#ff4d4f',
                  fontWeight: 'bold'
                }}>
                  {cppContribution.eexiContribution}%
                </span>
                <span style={styles.ciiImpact}>
                  CII影响: {cppContribution.ciiImpact.replace('_', ' ')}
                </span>
              </div>
            </>
          ) : (
            <div style={styles.noData}>
              <div style={styles.noDataIcon}>!</div>
              <div style={styles.noDataText}>请选择齿轮箱或CPP系统</div>
            </div>
          )}
        </div>
      )}

      {/* 混合动力面板 */}
      {activeTab === 'hybrid' && (
        <div style={styles.tabContent}>
          {hybridCompatibility ? (
            <>
              {/* 兼容性评分 */}
              <div style={styles.hybridScore}>
                <div style={{
                  ...styles.scoreCircle,
                  background: `conic-gradient(${getScoreColor(hybridCompatibility.score)} ${hybridCompatibility.score}%, #eee 0)`
                }}>
                  <div style={styles.scoreInner}>
                    <div style={styles.scoreValue}>{hybridCompatibility.score}</div>
                    <div style={styles.scoreLabel}>/ 100</div>
                  </div>
                </div>
                <div style={styles.scoreRating}>
                  {hybridCompatibility.ratingDescription}
                </div>
              </div>

              {/* 兼容性详情 */}
              {hybridCompatibility.compatibility && (
              <div style={styles.compatibilityList}>
                <div style={styles.sectionTitle}>混合动力兼容性</div>

                {Object.entries(hybridCompatibility.compatibility).map(([type, info]) => (
                  <div key={type} style={styles.compatItem}>
                    <div style={styles.compatHeader}>
                      <span style={styles.compatName}>
                        {getHybridTypeName(type)}
                      </span>
                      <span style={{
                        ...styles.compatStatus,
                        background: info.compatible ? '#d4edda' : '#f8d7da',
                        color: info.compatible ? '#155724' : '#721c24'
                      }}>
                        {info.readiness === 'ready' ? '即插即用' :
                         info.readiness === 'adaptable' ? '可改装' : '不兼容'}
                      </span>
                    </div>
                    {info.modifications && info.modifications.length > 0 && (
                      <div style={styles.modifications}>
                        需要: {info.modifications.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              )}

              {/* 功能状态 */}
              {hybridCompatibility.compatibility && (
              <div style={styles.featureFlags}>
                <FeatureFlag label="混合动力就绪" enabled={hybridCompatibility.compatibility?.parallelHybrid?.compatible} />
                <FeatureFlag label="电力兼容" enabled={hybridCompatibility.compatibility?.pureElectric?.compatible} />
                <FeatureFlag label="PTO/PTI" enabled={hybridCompatibility.compatibility?.dieselElectric?.compatible} />
              </div>
              )}
            </>
          ) : (
            <div style={styles.noData}>
              <div style={styles.noDataIcon}>!</div>
              <div style={styles.noDataText}>请选择齿轮箱评估混合动力兼容性</div>
            </div>
          )}
        </div>
      )}

      {/* 燃料类型说明 */}
      <div style={styles.fuelInfo}>
        <div style={styles.fuelTitle}>CO2排放系数参考</div>
        <div style={styles.fuelList}>
          {Object.entries(CO2_EMISSION_FACTORS).slice(0, 4).map(([key, fuel]) => (
            <span key={key} style={styles.fuelItem}>
              {fuel.name}: {fuel.factor}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * 效率环形图组件
 */
const EfficiencyRing = ({ label, value, color }) => (
  <div style={styles.ringContainer}>
    <div style={{
      ...styles.ring,
      background: `conic-gradient(${color} ${value}%, #eee 0)`
    }}>
      <div style={styles.ringInner}>
        {value}%
      </div>
    </div>
    <div style={styles.ringLabel}>{label}</div>
  </div>
);

/**
 * 功能标志组件
 */
const FeatureFlag = ({ label, enabled }) => (
  <div style={{
    ...styles.featureFlag,
    background: enabled ? '#d4edda' : '#f5f5f5',
    color: enabled ? '#155724' : '#999'
  }}>
    <span style={styles.featureIcon}>{enabled ? '✓' : '○'}</span>
    <span>{label}</span>
  </div>
);

/**
 * 计算CII在评级条上的位置
 */
function getCIIPosition(ciiResult) {
  const { attainedCII, ratingBoundaries } = ciiResult;
  const maxCII = ratingBoundaries.D * 1.3;
  return (attainedCII / maxCII) * 100;
}

/**
 * 获取分数颜色
 */
function getScoreColor(score) {
  if (score >= 80) return '#52c41a';
  if (score >= 60) return '#73d13d';
  if (score >= 40) return '#faad14';
  return '#ff4d4f';
}

/**
 * 获取混合动力类型名称
 */
function getHybridTypeName(type) {
  const names = {
    parallelHybrid: '并联混合',
    seriesHybrid: '串联混合',
    pureElectric: '纯电推进',
    dieselElectric: '柴电混合'
  };
  return names[type] || type;
}

// 样式定义
const styles = {
  container: {
    background: '#fff',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  title: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 'bold'
  },
  badge: {
    padding: '2px 8px',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  shipTypeSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    padding: '12px',
    background: '#f5f5f5',
    borderRadius: '8px'
  },
  selectorLabel: {
    fontSize: '13px',
    fontWeight: '500'
  },
  select: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #d9d9d9',
    fontSize: '13px'
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    marginBottom: '16px',
    borderBottom: '1px solid #eee',
    paddingBottom: '8px'
  },
  tab: {
    padding: '8px 16px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#666',
    borderRadius: '4px',
    transition: 'all 0.2s'
  },
  activeTab: {
    background: '#1890ff',
    color: '#fff'
  },
  tabContent: {
    minHeight: '300px'
  },
  gaugeContainer: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  gaugeOuter: {
    display: 'inline-block',
    padding: '10px'
  },
  gaugeInner: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gaugeCenter: {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gaugeValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333'
  },
  gaugeUnit: {
    fontSize: '10px',
    color: '#999'
  },
  gaugeLabel: {
    fontSize: '13px',
    color: '#666',
    marginTop: '8px'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginBottom: '16px'
  },
  detailItem: {
    textAlign: 'center',
    padding: '12px',
    background: '#f9f9f9',
    borderRadius: '4px'
  },
  detailLabel: {
    fontSize: '11px',
    color: '#666',
    marginBottom: '4px'
  },
  detailValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333'
  },
  statusBar: {
    padding: '12px 16px',
    borderRadius: '4px',
    border: '1px solid',
    marginBottom: '12px',
    textAlign: 'center',
    fontSize: '13px'
  },
  standardInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    fontSize: '11px',
    color: '#666'
  },
  noData: {
    textAlign: 'center',
    padding: '40px 20px'
  },
  noDataIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#f0f0f0',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    color: '#999',
    marginBottom: '12px'
  },
  noDataText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px'
  },
  noDataHint: {
    fontSize: '12px',
    color: '#999'
  },
  ciiRatingCard: {
    textAlign: 'center',
    padding: '24px',
    marginBottom: '20px'
  },
  ciiRatingBadge: {
    display: 'inline-block',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: '80px',
    marginBottom: '12px'
  },
  ciiRatingText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px'
  },
  ciiRatingAction: {
    fontSize: '13px',
    color: '#666'
  },
  ciiBarChart: {
    marginBottom: '16px'
  },
  ciiBarLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '8px'
  },
  ciiBar: {
    display: 'flex',
    height: '24px',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  ciiBarSegment: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 'bold'
  },
  ciiMarker: {
    position: 'relative',
    height: '24px'
  },
  ciiMarkerArrow: {
    position: 'absolute',
    top: '0',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    fontSize: '12px'
  },
  ciiMarkerValue: {
    fontSize: '10px',
    fontWeight: 'bold'
  },
  ciiThresholds: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '12px',
    background: '#f9f9f9',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '11px'
  },
  thresholdItem: {
    display: 'flex',
    gap: '4px'
  },
  annualData: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '16px'
  },
  annualItem: {
    padding: '12px',
    background: '#f0f7ff',
    borderRadius: '4px',
    textAlign: 'center'
  },
  annualLabel: {
    fontSize: '11px',
    color: '#666'
  },
  annualValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1890ff'
  },
  imoTargets: {
    padding: '12px',
    background: '#f9f9f9',
    borderRadius: '4px'
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 'bold',
    marginBottom: '12px'
  },
  targetRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px'
  },
  targetLabel: {
    width: '120px',
    fontSize: '12px'
  },
  targetProgress: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  progressBg: {
    flex: 1,
    height: '8px',
    background: '#eee',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px'
  },
  efficiencyRings: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px'
  },
  ringContainer: {
    textAlign: 'center'
  },
  ring: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 8px'
  },
  ringInner: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  ringLabel: {
    fontSize: '11px',
    color: '#666'
  },
  savingsSection: {
    marginBottom: '16px'
  },
  savingsList: {
    background: '#f9f9f9',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  savingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 12px',
    borderBottom: '1px solid #eee',
    fontSize: '13px'
  },
  savingValue: {
    color: '#52c41a',
    fontWeight: '500'
  },
  savingTotal: {
    background: '#e6f7ff',
    borderBottom: 'none'
  },
  savingTotalValue: {
    color: '#1890ff',
    fontWeight: 'bold'
  },
  annualEstimate: {
    marginBottom: '16px'
  },
  estimateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  },
  estimateItem: {
    textAlign: 'center',
    padding: '16px',
    background: '#f0f7ff',
    borderRadius: '4px'
  },
  estimateValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1890ff',
    marginBottom: '4px'
  },
  estimateLabel: {
    fontSize: '11px',
    color: '#666'
  },
  eexiContribution: {
    padding: '12px',
    background: '#f5f5f5',
    borderRadius: '4px',
    fontSize: '13px',
    textAlign: 'center'
  },
  ciiImpact: {
    marginLeft: '16px',
    color: '#666'
  },
  hybridScore: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  scoreCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px'
  },
  scoreInner: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scoreValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333'
  },
  scoreLabel: {
    fontSize: '12px',
    color: '#999'
  },
  scoreRating: {
    fontSize: '14px',
    color: '#666'
  },
  compatibilityList: {
    marginBottom: '16px'
  },
  compatItem: {
    padding: '12px',
    background: '#f9f9f9',
    borderRadius: '4px',
    marginBottom: '8px'
  },
  compatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  compatName: {
    fontSize: '13px',
    fontWeight: '500'
  },
  compatStatus: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px'
  },
  modifications: {
    marginTop: '8px',
    fontSize: '11px',
    color: '#666'
  },
  featureFlags: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  featureFlag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px'
  },
  featureIcon: {
    fontWeight: 'bold'
  },
  fuelInfo: {
    marginTop: '16px',
    padding: '12px',
    background: '#f0f5ff',
    borderRadius: '4px'
  },
  fuelTitle: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#1890ff',
    marginBottom: '8px'
  },
  fuelList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px'
  },
  fuelItem: {
    fontSize: '11px',
    color: '#666'
  }
};

export default EnergyEfficiencyPanel;
