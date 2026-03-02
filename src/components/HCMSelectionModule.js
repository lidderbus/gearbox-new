// src/components/HCMSelectionModule.js
/**
 * HCM系列轻型高速齿轮箱专用选型模块
 * 支持: HCM标准型, HCAM倾角型, HCVM同侧倾角型, HCRM特殊型
 * 特色功能:
 * - 主机品牌智能匹配
 * - 倾角输出筛选
 * - ZF对标显示
 * - 真实配机案例参考
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
// 性能优化: 改为动态导入
// import completeGearboxData from '../data/completeGearboxData';
import { getMatchingCasesByGearbox } from '../data/hcmEngineMatching';
import { gearboxToCouplingPrefixMap } from '../data/gearboxMatchingMaps';

// 提取HCM系列数据 (现在接受data参数)
const getHCMGearboxes = (completeGearboxData) => {
  if (!completeGearboxData) return [];
  const hcmData = completeGearboxData.hcmGearboxes || [];
  return hcmData.filter(g =>
    g.model && (
      g.model.startsWith('HCM') ||
      g.model.startsWith('HCAM') ||
      g.model.startsWith('HCVM') ||
      g.model.startsWith('HCRM')
    )
  );
};

// 主机品牌列表
const ENGINE_BRANDS = [
  { value: '', label: '-- 选择主机品牌 --' },
  { value: 'cummins', label: '康明斯 Cummins' },
  { value: 'volvo', label: '沃尔沃 Volvo Penta' },
  { value: 'cat', label: '卡特彼勒 CAT' },
  { value: 'mtu', label: 'MTU' },
  { value: 'yanmar', label: '洋马 Yanmar' },
  { value: 'weichai', label: '潍柴 Weichai' },
  { value: 'yuchai', label: '玉柴 Yuchai' },
  { value: 'other', label: '其他品牌' }
];

// 倾角选项
const ANGLE_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: '0', label: '标准型 (无倾角)' },
  { value: '7', label: '7度倾角' },
  { value: '8', label: '8度倾角' },
  { value: '10', label: '10度倾角' }
];

// 系列说明
const SERIES_INFO = {
  'HCM': { name: 'HCM标准型', description: '标准型 - 直线布置，适用于常规高速艇', color: '#1890ff' },
  'HCAM': { name: 'HCAM倾角型', description: '倾角型 - 输出轴带倾角，适用于V型布置推进系统', color: '#52c41a' },
  'HCVM': { name: 'HCVM同侧型', description: '同侧型 - 输入输出同侧，适用于空间受限船艇', color: '#faad14' },
  'HCRM': { name: 'HCRM特殊型', description: '特殊型 - 特殊需求定制', color: '#722ed1' }
};

const HCMSelectionModule = () => {
  // 输入状态
  const [inputs, setInputs] = useState({
    engineBrand: '',
    power: '',
    speed: '',
    ratio: '',
    angleFilter: 'all',
    showOnlyWithZF: false
  });

  // 选型结果
  const [selectedGearbox, setSelectedGearbox] = useState(null);
  const [showCases, setShowCases] = useState(false);

  // 性能优化: 动态加载数据
  const [completeGearboxData, setCompleteGearboxData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const module = await import(
          /* webpackChunkName: "complete-gearbox-data" */
          '../data/completeGearboxData'
        );
        setCompleteGearboxData(module.default || module);
      } catch (error) {
        console.error('HCMSelectionModule: 数据加载失败', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 获取HCM数据
  const hcmGearboxes = useMemo(() => getHCMGearboxes(completeGearboxData), [completeGearboxData]);

  // 计算传递能力需求
  const requiredCapacity = useMemo(() => {
    const power = parseFloat(inputs.power);
    const speed = parseFloat(inputs.speed);
    if (power > 0 && speed > 0) {
      return power / speed;
    }
    return 0;
  }, [inputs.power, inputs.speed]);

  // 过滤和匹配齿轮箱
  const matchedGearboxes = useMemo(() => {
    let results = [...hcmGearboxes];

    // 按倾角过滤
    if (inputs.angleFilter !== 'all') {
      const targetAngle = parseInt(inputs.angleFilter);
      results = results.filter(g => (g.angle || 0) === targetAngle);
    }

    // 按ZF对标过滤
    if (inputs.showOnlyWithZF) {
      results = results.filter(g => g.zfEquivalent);
    }

    // 如果有功率和转速输入，计算匹配度
    if (requiredCapacity > 0) {
      results = results.map(g => {
        const capacity = Array.isArray(g.transferCapacity)
          ? Math.max(...g.transferCapacity)
          : g.transferCapacity || 0;

        const margin = capacity > 0 ? ((capacity - requiredCapacity) / requiredCapacity * 100) : -100;
        const isMatch = margin >= 0 && margin <= 100; // 0-100%余量视为匹配

        // 检查减速比
        const targetRatio = parseFloat(inputs.ratio);
        let ratioMatch = true;
        let closestRatio = null;
        if (targetRatio > 0 && g.ratios && g.ratios.length > 0) {
          closestRatio = g.ratios.reduce((prev, curr) =>
            Math.abs(curr - targetRatio) < Math.abs(prev - targetRatio) ? curr : prev
          );
          const ratioDeviation = Math.abs(closestRatio - targetRatio) / targetRatio * 100;
          ratioMatch = ratioDeviation <= 15; // 15%容差
        }

        // 检查转速范围
        const inputSpeed = parseFloat(inputs.speed);
        let speedMatch = true;
        if (inputSpeed > 0 && g.inputSpeedRange) {
          speedMatch = inputSpeed >= g.inputSpeedRange[0] && inputSpeed <= g.inputSpeedRange[1];
        }

        return {
          ...g,
          capacity,
          margin,
          isMatch: isMatch && ratioMatch && speedMatch,
          closestRatio,
          speedMatch,
          ratioMatch
        };
      });

      // 排序: 匹配的优先，按余量从小到大
      results.sort((a, b) => {
        if (a.isMatch && !b.isMatch) return -1;
        if (!a.isMatch && b.isMatch) return 1;
        return a.margin - b.margin;
      });
    }

    return results;
  }, [hcmGearboxes, inputs.angleFilter, inputs.showOnlyWithZF, requiredCapacity, inputs.ratio, inputs.speed]);

  // 获取配机案例
  const relatedCases = useMemo(() => {
    if (!selectedGearbox) return [];
    return getMatchingCasesByGearbox(selectedGearbox.model);
  }, [selectedGearbox]);

  // 处理输入变化
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  // 获取联轴器推荐
  const getRecommendedCoupling = (model) => {
    return gearboxToCouplingPrefixMap[model] || '需查询';
  };

  // 获取系列信息
  const getSeriesInfo = (model) => {
    if (model.startsWith('HCVM')) return SERIES_INFO['HCVM'];
    if (model.startsWith('HCRM')) return SERIES_INFO['HCRM'];
    if (model.startsWith('HCAM')) return SERIES_INFO['HCAM'];
    return SERIES_INFO['HCM'];
  };

  // 重置
  const handleReset = () => {
    setInputs({
      engineBrand: '',
      power: '',
      speed: '',
      ratio: '',
      angleFilter: 'all',
      showOnlyWithZF: false
    });
    setSelectedGearbox(null);
  };

  // 加载中显示
  if (loading) {
    return (
      <div className="hcm-selection-module" style={{ ...styles.container, textAlign: 'center', padding: '48px' }}>
        <p>正在加载HCM系列数据...</p>
      </div>
    );
  }

  return (
    <div className="hcm-selection-module" style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>HCM系列轻型高速齿轮箱选型</h2>
        <p style={styles.subtitle}>适用于高速艇、游艇、无人艇等轻量化应用场景</p>
      </div>

      {/* 系列说明 */}
      <div style={styles.seriesLegend}>
        {Object.entries(SERIES_INFO).map(([key, info]) => (
          <span key={key} style={{ ...styles.seriesTag, backgroundColor: info.color, position: 'relative', cursor: 'help' }}
            title={info.description}>
            {info.name}
          </span>
        ))}
      </div>

      {/* 输入表单 */}
      <div style={styles.inputSection}>
        <div style={styles.inputGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>主机品牌</label>
            <select
              name="engineBrand"
              value={inputs.engineBrand}
              onChange={handleInputChange}
              style={styles.select}
            >
              {ENGINE_BRANDS.map(b => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>主机功率 (kW) *</label>
            <input
              type="number"
              name="power"
              value={inputs.power}
              onChange={handleInputChange}
              placeholder="如: 800"
              style={styles.input}
              min="0"
              step="1"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>主机转速 (rpm) *</label>
            <input
              type="number"
              name="speed"
              value={inputs.speed}
              onChange={handleInputChange}
              placeholder="如: 2300"
              style={styles.input}
              min="0"
              step="1"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>目标减速比</label>
            <input
              type="number"
              name="ratio"
              value={inputs.ratio}
              onChange={handleInputChange}
              placeholder="如: 1.5"
              style={styles.input}
              min="0"
              step="0.01"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>输出倾角</label>
            <select
              name="angleFilter"
              value={inputs.angleFilter}
              onChange={handleInputChange}
              style={styles.select}
            >
              {ANGLE_OPTIONS.map(a => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="showOnlyWithZF"
                checked={inputs.showOnlyWithZF}
                onChange={handleInputChange}
              />
              <span style={{ marginLeft: '8px' }}>仅显示有ZF对标的型号</span>
            </label>
          </div>
        </div>

        {/* 计算结果显示 */}
        {requiredCapacity > 0 && (
          <div style={styles.calcResult}>
            <span>计算所需传递能力: </span>
            <strong>{requiredCapacity.toFixed(4)} kW/(r/min)</strong>
            <span style={{ marginLeft: '16px', color: '#666' }}>
              ({inputs.power}kW / {inputs.speed}rpm)
            </span>
          </div>
        )}

        <div style={styles.buttonGroup}>
          <button onClick={handleReset} style={styles.resetButton}>重置</button>
        </div>
      </div>

      {/* 匹配结果表格 */}
      <div style={styles.resultSection}>
        <h3 style={styles.sectionTitle}>
          匹配结果
          <span style={styles.resultCount}>({matchedGearboxes.length}个型号)</span>
        </h3>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>型号</th>
                <th style={styles.th}>系列</th>
                <th style={styles.th}>传递能力</th>
                <th style={styles.th}>减速比</th>
                <th style={styles.th}>转速范围</th>
                <th style={styles.th}>倾角</th>
                <th style={styles.th}>重量</th>
                <th style={styles.th}>ZF对标</th>
                <th style={styles.th}>余量</th>
                <th style={styles.th}>操作</th>
              </tr>
            </thead>
            <tbody>
              {matchedGearboxes.slice(0, 20).map((g, idx) => {
                const seriesInfo = getSeriesInfo(g.model);
                const isSelected = selectedGearbox?.model === g.model;

                return (
                  <tr
                    key={g.model + idx}
                    style={{
                      ...styles.tr,
                      backgroundColor: isSelected ? '#e6f7ff' : (g.isMatch ? '#f6ffed' : 'transparent')
                    }}
                  >
                    <td style={styles.td}>
                      <strong>{g.model}</strong>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.seriesTagSmall,
                        backgroundColor: seriesInfo.color
                      }}>
                        {g.series || g.model.substring(0, 4)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {g.capacity?.toFixed(4) || '-'}
                    </td>
                    <td style={styles.td}>
                      {g.ratios?.join(', ') || '-'}
                      {g.closestRatio && (
                        <div style={{ fontSize: '11px', color: '#1890ff' }}>
                          最接近: {g.closestRatio}
                        </div>
                      )}
                    </td>
                    <td style={styles.td}>
                      {g.inputSpeedRange ? `${g.inputSpeedRange[0]}-${g.inputSpeedRange[1]}` : '-'}
                      {g.speedMatch === false && (
                        <span style={{ color: '#ff4d4f', fontSize: '11px' }}> 超出</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {g.angle ? `${g.angle}°` : '0°'}
                    </td>
                    <td style={styles.td}>
                      {g.totalWeight || g.weight || '-'}kg
                    </td>
                    <td style={styles.td}>
                      {g.zfEquivalent || '-'}
                    </td>
                    <td style={{ ...styles.td, minWidth: '120px' }}>
                      {g.margin !== undefined ? (
                        <div>
                          <div style={{
                            display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px',
                            color: g.margin < 0 ? '#ff4d4f' : g.margin <= 20 ? '#52c41a' : g.margin <= 50 ? '#faad14' : '#ff4d4f'
                          }}>
                            <span>{g.margin >= 0 ? '+' : ''}{g.margin.toFixed(1)}%</span>
                          </div>
                          <div style={{ height: '6px', backgroundColor: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${Math.min(Math.max(g.margin, 0), 100)}%`,
                              height: '100%',
                              borderRadius: '3px',
                              backgroundColor: g.margin < 0 ? '#ff4d4f' : g.margin <= 20 ? '#52c41a' : g.margin <= 50 ? '#faad14' : '#ff4d4f'
                            }} />
                          </div>
                        </div>
                      ) : '-'}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => {
                          setSelectedGearbox(g);
                          setShowCases(true);
                        }}
                        style={styles.detailButton}
                      >
                        详情
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
          <i>余量 = (额定能力 - 实际需求) / 实际需求 × 100%。绿色(0-20%): 最佳匹配，黄色(20-50%): 可用，红色(负数或&gt;50%): 不推荐</i>
        </div>
      </div>

      {/* 详情弹窗 */}
      {selectedGearbox && showCases && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>{selectedGearbox.model} 详情</h3>
              <button onClick={() => setShowCases(false)} style={styles.closeButton}>×</button>
            </div>

            <div style={styles.modalBody}>
              {/* 基本信息 */}
              <div style={styles.infoSection}>
                <h4>基本参数</h4>
                <div style={styles.infoGrid}>
                  <div><strong>型号:</strong> {selectedGearbox.model}</div>
                  <div><strong>系列:</strong> {selectedGearbox.series}</div>
                  <div><strong>传递能力:</strong> {selectedGearbox.capacity?.toFixed(4)} kW/(r/min)</div>
                  <div><strong>减速比:</strong> {selectedGearbox.ratios?.join(', ')}</div>
                  <div><strong>转速范围:</strong> {selectedGearbox.inputSpeedRange?.join('-')} rpm</div>
                  <div><strong>倾角:</strong> {selectedGearbox.angle || 0}°</div>
                  <div><strong>重量:</strong> {selectedGearbox.totalWeight || selectedGearbox.weight} kg</div>
                  <div><strong>ZF对标:</strong> {selectedGearbox.zfEquivalent || '无'}</div>
                  <div><strong>控制方式:</strong> {selectedGearbox.controlType}</div>
                  <div><strong>推荐联轴器:</strong> {getRecommendedCoupling(selectedGearbox.model)}</div>
                </div>
                {selectedGearbox.notes && (
                  <div style={{ marginTop: '8px', color: '#666' }}>
                    <strong>备注:</strong> {selectedGearbox.notes}
                  </div>
                )}
                {selectedGearbox.applications && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>应用场景:</strong> {selectedGearbox.applications.join(', ')}
                  </div>
                )}
              </div>

              {/* 配机案例 */}
              <div style={styles.casesSection}>
                <h4>配机案例 ({relatedCases.length}条)</h4>
                {relatedCases.length > 0 ? (
                  <div style={styles.casesList}>
                    {relatedCases.slice(0, 10).map((c, idx) => (
                      <div key={idx} style={styles.caseItem}>
                        <div style={styles.caseHeader}>
                          <strong>{c.engine || c.engineModel}</strong>
                          {c.orderNumber && <span style={styles.orderTag}>订单: {c.orderNumber}</span>}
                        </div>
                        <div style={styles.caseDetails}>
                          <span>功率: {c.power}kW</span>
                          <span>转速: {c.speed}rpm</span>
                          <span>减速比: {c.ratio}</span>
                          {c.coupling && <span>高弹: {c.coupling}</span>}
                          {c.standbyPump && <span>备用泵: {c.standbyPump}</span>}
                        </div>
                        {c.shipType && <div style={styles.caseShip}>船型: {c.shipType}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#999' }}>暂无配机案例记录</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 样式
const styles = {
  container: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  header: {
    marginBottom: '24px',
    textAlign: 'center'
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#1a1a1a',
    margin: 0
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    marginTop: '8px'
  },
  seriesLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '24px'
  },
  seriesTag: {
    padding: '4px 12px',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '13px'
  },
  seriesTagSmall: {
    padding: '2px 8px',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '11px'
  },
  inputSection: {
    backgroundColor: '#fafafa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '24px'
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '13px',
    fontWeight: 500,
    marginBottom: '6px',
    color: '#333'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    cursor: 'pointer',
    marginTop: '24px'
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    fontSize: '14px'
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#fff'
  },
  calcResult: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#e6f7ff',
    borderRadius: '4px',
    fontSize: '14px'
  },
  buttonGroup: {
    marginTop: '16px',
    display: 'flex',
    gap: '12px'
  },
  resetButton: {
    padding: '8px 24px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px'
  },
  resultSection: {
    marginTop: '24px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '16px'
  },
  resultCount: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#666',
    marginLeft: '8px'
  },
  tableContainer: {
    overflowX: 'auto',
    border: '1px solid #e8e8e8',
    borderRadius: '8px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px'
  },
  th: {
    padding: '12px 8px',
    backgroundColor: '#fafafa',
    borderBottom: '1px solid #e8e8e8',
    textAlign: 'left',
    fontWeight: 600,
    whiteSpace: 'nowrap'
  },
  tr: {
    borderBottom: '1px solid #f0f0f0'
  },
  td: {
    padding: '10px 8px',
    verticalAlign: 'middle'
  },
  detailButton: {
    padding: '4px 12px',
    border: '1px solid #1890ff',
    borderRadius: '4px',
    backgroundColor: '#fff',
    color: '#1890ff',
    cursor: 'pointer',
    fontSize: '12px'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '80vh',
    overflow: 'auto'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #f0f0f0'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#999'
  },
  modalBody: {
    padding: '20px'
  },
  infoSection: {
    marginBottom: '24px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginTop: '12px'
  },
  casesSection: {
    marginTop: '24px'
  },
  casesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '12px'
  },
  caseItem: {
    padding: '12px',
    backgroundColor: '#fafafa',
    borderRadius: '6px',
    border: '1px solid #e8e8e8'
  },
  caseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  orderTag: {
    fontSize: '11px',
    color: '#666',
    backgroundColor: '#e6f7ff',
    padding: '2px 8px',
    borderRadius: '3px'
  },
  caseDetails: {
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
    color: '#666',
    flexWrap: 'wrap'
  },
  caseShip: {
    marginTop: '6px',
    fontSize: '12px',
    color: '#1890ff'
  }
};

export default HCMSelectionModule;
