// src/components/EngineMatchingCases.js
/**
 * 配机案例库组件
 * 展示真实的齿轮箱配机案例，支持多维度搜索
 * 数据来源: 康明斯主机信息表、HCM系列匹配表
 */

import React, { useState, useMemo, useCallback } from 'react';
import { engineMatchingCases, cumminsMatchingCases, hcmMatchingCases } from '../data/hcmEngineMatching';

// 数据源选项
const DATA_SOURCES = [
  { value: 'all', label: '全部案例', count: engineMatchingCases?.length || 0 },
  { value: 'cummins', label: '康明斯主机信息', count: cumminsMatchingCases?.length || 0 },
  { value: 'hcm', label: 'HCM系列匹配表', count: hcmMatchingCases?.length || 0 }
];

// 主机品牌
const ENGINE_BRANDS = ['全部', '康明斯', '沃尔沃', 'MTU', '卡特彼勒', '潍柴', '玉柴', '洋马', '其他'];

// 齿轮箱系列
const GEARBOX_SERIES = ['全部', 'HCM', 'HCAM', 'HC', 'HCD', 'HCT', 'GW', 'DT', '其他'];

const EngineMatchingCases = () => {
  // 搜索和过滤状态
  const [filters, setFilters] = useState({
    dataSource: 'all',
    keyword: '',
    engineBrand: '全部',
    gearboxSeries: '全部',
    minPower: '',
    maxPower: '',
    minSpeed: '',
    maxSpeed: ''
  });

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // 选中的案例
  const [selectedCase, setSelectedCase] = useState(null);

  // 获取数据源
  const getDataSource = useCallback(() => {
    switch (filters.dataSource) {
      case 'cummins':
        return cumminsMatchingCases || [];
      case 'hcm':
        return hcmMatchingCases || [];
      default:
        return engineMatchingCases || [];
    }
  }, [filters.dataSource]);

  // 过滤数据
  const filteredCases = useMemo(() => {
    let data = getDataSource();

    // 关键词搜索
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      data = data.filter(c =>
        (c.engine && c.engine.toLowerCase().includes(kw)) ||
        (c.engineModel && c.engineModel.toLowerCase().includes(kw)) ||
        (c.gearbox && c.gearbox.toLowerCase().includes(kw)) ||
        (c.orderNumber && c.orderNumber.toLowerCase().includes(kw)) ||
        (c.shipType && c.shipType.toLowerCase().includes(kw)) ||
        (c.notes && c.notes.toLowerCase().includes(kw))
      );
    }

    // 主机品牌过滤
    if (filters.engineBrand !== '全部') {
      data = data.filter(c => {
        const engine = (c.engine || c.engineModel || '').toLowerCase();
        const brand = filters.engineBrand.toLowerCase();
        if (brand === '康明斯') return engine.includes('cummins') || engine.includes('康明斯');
        if (brand === '沃尔沃') return engine.includes('volvo') || engine.includes('沃尔沃');
        if (brand === 'mtu') return engine.includes('mtu');
        if (brand === '卡特彼勒') return engine.includes('cat') || engine.includes('卡特');
        if (brand === '潍柴') return engine.includes('weichai') || engine.includes('潍柴');
        if (brand === '玉柴') return engine.includes('yuchai') || engine.includes('玉柴');
        if (brand === '洋马') return engine.includes('yanmar') || engine.includes('洋马');
        return true;
      });
    }

    // 齿轮箱系列过滤
    if (filters.gearboxSeries !== '全部') {
      data = data.filter(c => {
        const gb = (c.gearbox || '').toUpperCase();
        return gb.startsWith(filters.gearboxSeries.toUpperCase());
      });
    }

    // 功率范围过滤
    if (filters.minPower) {
      data = data.filter(c => c.power >= parseFloat(filters.minPower));
    }
    if (filters.maxPower) {
      data = data.filter(c => c.power <= parseFloat(filters.maxPower));
    }

    // 转速范围过滤
    if (filters.minSpeed) {
      data = data.filter(c => c.speed >= parseFloat(filters.minSpeed));
    }
    if (filters.maxSpeed) {
      data = data.filter(c => c.speed <= parseFloat(filters.maxSpeed));
    }

    return data;
  }, [getDataSource, filters]);

  // 分页数据
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCases.slice(start, start + pageSize);
  }, [filteredCases, currentPage]);

  // 统计信息
  const statistics = useMemo(() => {
    const data = filteredCases;
    if (data.length === 0) return null;

    const powers = data.map(c => c.power).filter(p => p > 0);
    const speeds = data.map(c => c.speed).filter(s => s > 0);

    return {
      count: data.length,
      powerRange: powers.length > 0 ? [Math.min(...powers), Math.max(...powers)] : [0, 0],
      speedRange: speeds.length > 0 ? [Math.min(...speeds), Math.max(...speeds)] : [0, 0],
      avgPower: powers.length > 0 ? (powers.reduce((a, b) => a + b, 0) / powers.length).toFixed(0) : 0,
      avgSpeed: speeds.length > 0 ? (speeds.reduce((a, b) => a + b, 0) / speeds.length).toFixed(0) : 0
    };
  }, [filteredCases]);

  // 处理过滤器变化
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  }, []);

  // 重置过滤器
  const handleReset = () => {
    setFilters({
      dataSource: 'all',
      keyword: '',
      engineBrand: '全部',
      gearboxSeries: '全部',
      minPower: '',
      maxPower: '',
      minSpeed: '',
      maxSpeed: ''
    });
    setCurrentPage(1);
  };

  // 计算总页数
  const totalPages = Math.ceil(filteredCases.length / pageSize);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>配机案例库</h2>
        <p style={styles.subtitle}>基于真实订单的齿轮箱配机案例，共 {engineMatchingCases?.length || 0} 条记录</p>
      </div>

      {/* 数据源选择 */}
      <div style={styles.sourceSelector}>
        {DATA_SOURCES.map(src => (
          <button
            key={src.value}
            onClick={() => handleFilterChange({ target: { name: 'dataSource', value: src.value }})}
            style={{
              ...styles.sourceButton,
              backgroundColor: filters.dataSource === src.value ? '#1890ff' : '#fff',
              color: filters.dataSource === src.value ? '#fff' : '#333'
            }}
          >
            {src.label} ({src.count})
          </button>
        ))}
      </div>

      {/* 搜索和过滤区域 */}
      <div style={styles.filterSection}>
        <div style={styles.filterRow}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>关键词搜索</label>
            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              placeholder="搜索主机型号、齿轮箱、订单号..."
              style={styles.searchInput}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>主机品牌</label>
            <select
              name="engineBrand"
              value={filters.engineBrand}
              onChange={handleFilterChange}
              style={styles.filterSelect}
            >
              {ENGINE_BRANDS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>齿轮箱系列</label>
            <select
              name="gearboxSeries"
              value={filters.gearboxSeries}
              onChange={handleFilterChange}
              style={styles.filterSelect}
            >
              {GEARBOX_SERIES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.filterRow}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>功率范围 (kW)</label>
            <div style={styles.rangeInputs}>
              <input
                type="number"
                name="minPower"
                value={filters.minPower}
                onChange={handleFilterChange}
                placeholder="最小"
                style={styles.rangeInput}
              />
              <span>-</span>
              <input
                type="number"
                name="maxPower"
                value={filters.maxPower}
                onChange={handleFilterChange}
                placeholder="最大"
                style={styles.rangeInput}
              />
            </div>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>转速范围 (rpm)</label>
            <div style={styles.rangeInputs}>
              <input
                type="number"
                name="minSpeed"
                value={filters.minSpeed}
                onChange={handleFilterChange}
                placeholder="最小"
                style={styles.rangeInput}
              />
              <span>-</span>
              <input
                type="number"
                name="maxSpeed"
                value={filters.maxSpeed}
                onChange={handleFilterChange}
                placeholder="最大"
                style={styles.rangeInput}
              />
            </div>
          </div>

          <div style={styles.filterGroup}>
            <button onClick={handleReset} style={styles.resetButton}>
              重置筛选
            </button>
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      {statistics && (
        <div style={styles.statsBar}>
          <span>找到 <strong>{statistics.count}</strong> 条案例</span>
          <span>功率: {statistics.powerRange[0]}-{statistics.powerRange[1]} kW (平均 {statistics.avgPower})</span>
          <span>转速: {statistics.speedRange[0]}-{statistics.speedRange[1]} rpm (平均 {statistics.avgSpeed})</span>
        </div>
      )}

      {/* 案例列表 */}
      <div style={styles.caseList}>
        {paginatedCases.length > 0 ? (
          paginatedCases.map((c, idx) => (
            <div
              key={idx}
              style={styles.caseCard}
              onClick={() => setSelectedCase(c)}
            >
              <div style={styles.caseCardHeader}>
                <div style={styles.caseGearbox}>{c.gearbox}</div>
                {c.orderNumber && <div style={styles.caseOrder}>订单: {c.orderNumber}</div>}
              </div>
              <div style={styles.caseEngine}>
                <strong>主机:</strong> {c.engine || c.engineModel}
              </div>
              <div style={styles.caseSpecs}>
                <span>功率: {c.power} kW</span>
                <span>转速: {c.speed} rpm</span>
                <span>减速比: {c.ratio}</span>
              </div>
              {c.coupling && (
                <div style={styles.caseCoupling}>高弹联轴器: {c.coupling}</div>
              )}
              {c.shipType && (
                <div style={styles.caseShip}>船型: {c.shipType}</div>
              )}
              {c.notes && (
                <div style={styles.caseNotes}>{c.notes}</div>
              )}
            </div>
          ))
        ) : (
          <div style={styles.noResult}>
            没有找到匹配的案例，请调整筛选条件
          </div>
        )}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={styles.pageButton}
          >
            上一页
          </button>
          <span style={styles.pageInfo}>
            第 {currentPage} / {totalPages} 页
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={styles.pageButton}
          >
            下一页
          </button>
        </div>
      )}

      {/* 详情弹窗 */}
      {selectedCase && (
        <div style={styles.modal} onClick={() => setSelectedCase(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3>案例详情</h3>
              <button onClick={() => setSelectedCase(null)} style={styles.closeButton}>×</button>
            </div>
            <div style={styles.modalBody}>
              <table style={styles.detailTable}>
                <tbody>
                  <tr>
                    <td style={styles.detailLabel}>齿轮箱型号</td>
                    <td style={styles.detailValue}><strong>{selectedCase.gearbox}</strong></td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>主机型号</td>
                    <td style={styles.detailValue}>{selectedCase.engine || selectedCase.engineModel}</td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>额定功率</td>
                    <td style={styles.detailValue}>{selectedCase.power} kW</td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>额定转速</td>
                    <td style={styles.detailValue}>{selectedCase.speed} rpm</td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>减速比</td>
                    <td style={styles.detailValue}>{selectedCase.ratio}</td>
                  </tr>
                  {selectedCase.coupling && (
                    <tr>
                      <td style={styles.detailLabel}>高弹联轴器</td>
                      <td style={styles.detailValue}>{selectedCase.coupling}</td>
                    </tr>
                  )}
                  {selectedCase.standbyPump && (
                    <tr>
                      <td style={styles.detailLabel}>备用泵</td>
                      <td style={styles.detailValue}>{selectedCase.standbyPump}</td>
                    </tr>
                  )}
                  {selectedCase.orderNumber && (
                    <tr>
                      <td style={styles.detailLabel}>订单号</td>
                      <td style={styles.detailValue}>{selectedCase.orderNumber}</td>
                    </tr>
                  )}
                  {selectedCase.shipType && (
                    <tr>
                      <td style={styles.detailLabel}>船型</td>
                      <td style={styles.detailValue}>{selectedCase.shipType}</td>
                    </tr>
                  )}
                  {selectedCase.classification && (
                    <tr>
                      <td style={styles.detailLabel}>船检</td>
                      <td style={styles.detailValue}>{selectedCase.classification}</td>
                    </tr>
                  )}
                  {selectedCase.housing && (
                    <tr>
                      <td style={styles.detailLabel}>罩壳</td>
                      <td style={styles.detailValue}>{selectedCase.housing}</td>
                    </tr>
                  )}
                  {selectedCase.flywheel && (
                    <tr>
                      <td style={styles.detailLabel}>飞轮</td>
                      <td style={styles.detailValue}>{selectedCase.flywheel}</td>
                    </tr>
                  )}
                  {selectedCase.notes && (
                    <tr>
                      <td style={styles.detailLabel}>备注</td>
                      <td style={styles.detailValue}>{selectedCase.notes}</td>
                    </tr>
                  )}
                </tbody>
              </table>
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
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    marginBottom: '24px',
    textAlign: 'center'
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    margin: 0
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    marginTop: '8px'
  },
  sourceSelector: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    justifyContent: 'center'
  },
  sourceButton: {
    padding: '8px 16px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  filterSection: {
    backgroundColor: '#fafafa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  filterRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '12px',
    flexWrap: 'wrap'
  },
  filterGroup: {
    flex: '1',
    minWidth: '200px'
  },
  filterLabel: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    marginBottom: '6px'
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  filterSelect: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#fff'
  },
  rangeInputs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  rangeInput: {
    width: '80px',
    padding: '8px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    fontSize: '14px'
  },
  resetButton: {
    padding: '8px 24px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '24px'
  },
  statsBar: {
    display: 'flex',
    gap: '24px',
    padding: '12px 16px',
    backgroundColor: '#e6f7ff',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px',
    flexWrap: 'wrap'
  },
  caseList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '16px'
  },
  caseCard: {
    padding: '16px',
    border: '1px solid #e8e8e8',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s'
  },
  caseCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  caseGearbox: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1890ff'
  },
  caseOrder: {
    fontSize: '12px',
    color: '#999',
    backgroundColor: '#f5f5f5',
    padding: '2px 8px',
    borderRadius: '3px'
  },
  caseEngine: {
    fontSize: '14px',
    marginBottom: '8px'
  },
  caseSpecs: {
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
    color: '#666',
    marginBottom: '8px'
  },
  caseCoupling: {
    fontSize: '13px',
    color: '#52c41a',
    marginBottom: '4px'
  },
  caseShip: {
    fontSize: '13px',
    color: '#722ed1'
  },
  caseNotes: {
    fontSize: '12px',
    color: '#999',
    marginTop: '8px',
    fontStyle: 'italic'
  },
  noResult: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '40px',
    color: '#999'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '24px'
  },
  pageButton: {
    padding: '8px 16px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer'
  },
  pageInfo: {
    fontSize: '14px',
    color: '#666'
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
    maxWidth: '600px',
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
  detailTable: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  detailLabel: {
    padding: '10px',
    textAlign: 'left',
    fontWeight: 500,
    width: '120px',
    backgroundColor: '#fafafa',
    borderBottom: '1px solid #f0f0f0'
  },
  detailValue: {
    padding: '10px',
    borderBottom: '1px solid #f0f0f0'
  }
};

export default EngineMatchingCases;
