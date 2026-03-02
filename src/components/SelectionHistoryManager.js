// src/components/SelectionHistoryManager.js
// 选型历史记录管理组件

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  getSelectionHistory,
  deleteSelectionHistory,
  clearSelectionHistory,
  searchSelectionHistory,
  getSelectionHistoryStats,
  downloadHistoryCSV,
  getAllTags,
  addTagToHistory,
  removeTagFromHistory,
  backupHistoryToFile,
  restoreHistoryFromFile
} from '../utils/selectionHistory';
import { toast } from '../utils/toast';

/**
 * 选型历史管理组件
 * 提供历史记录的浏览、搜索、筛选、删除、导出等功能
 */
const SelectionHistoryManager = ({
  onLoadFromHistory,
  isVisible = true,
  className = ''
}) => {
  // 状态管理
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [selectedEntries, setSelectedEntries] = useState(new Set());
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [sortBy, setSortBy] = useState('date'); // date, power, model
  const [sortOrder, setSortOrder] = useState('desc');
  const [showComparePanel, setShowComparePanel] = useState(false);
  const fileInputRef = React.useRef(null);

  // 加载历史记录
  const loadHistory = useCallback(() => {
    setLoading(true);
    try {
      const filters = {};
      if (searchText) filters.searchText = searchText;
      if (dateFrom) filters.dateFrom = dateFrom;
      if (dateTo) filters.dateTo = dateTo;
      if (selectedSeries) filters.gearboxSeries = selectedSeries;

      const filteredHistory = Object.keys(filters).length > 0
        ? searchSelectionHistory(filters)
        : getSelectionHistory();

      setHistory(filteredHistory);
    } catch (error) {
      console.error('加载历史记录失败:', error);
    } finally {
      setLoading(false);
    }
  }, [searchText, dateFrom, dateTo, selectedSeries]);

  // 初始加载
  useEffect(() => {
    if (isVisible) {
      loadHistory();
    }
  }, [isVisible, loadHistory]);

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      loadHistory();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText, dateFrom, dateTo, selectedSeries, loadHistory]);

  // 排序后的历史记录
  const sortedHistory = useMemo(() => {
    const sorted = [...history];
    sorted.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.timestamp) - new Date(a.timestamp);
          break;
        case 'power':
          const powerA = a.engineData?.power || a.requirementData?.motorPower || 0;
          const powerB = b.engineData?.power || b.requirementData?.motorPower || 0;
          comparison = powerB - powerA;
          break;
        case 'model':
          const modelA = a.selectionResult?.recommendations?.[0]?.model || '';
          const modelB = b.selectionResult?.recommendations?.[0]?.model || '';
          comparison = modelA.localeCompare(modelB);
          break;
        default:
          break;
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });
    return sorted;
  }, [history, sortBy, sortOrder]);

  // 加载统计信息
  const handleShowStats = useCallback(() => {
    if (!showStats) {
      const statsData = getSelectionHistoryStats();
      setStats(statsData);
    }
    setShowStats(!showStats);
  }, [showStats]);

  // 删除单条记录
  const handleDelete = useCallback((id, e) => {
    e.stopPropagation();
    if (window.confirm('确定要删除此历史记录吗？')) {
      deleteSelectionHistory(id);
      loadHistory();
    }
  }, [loadHistory]);

  // 批量删除
  const handleBatchDelete = useCallback(() => {
    if (selectedEntries.size === 0) return;
    if (window.confirm(`确定要删除选中的 ${selectedEntries.size} 条记录吗？`)) {
      selectedEntries.forEach(id => deleteSelectionHistory(id));
      setSelectedEntries(new Set());
      loadHistory();
    }
  }, [selectedEntries, loadHistory]);

  // 清空所有
  const handleClearAll = useCallback(() => {
    if (window.confirm('确定要清空所有历史记录吗？此操作不可撤销！')) {
      clearSelectionHistory();
      setHistory([]);
      setSelectedEntries(new Set());
    }
  }, []);

  // 导出CSV
  const handleExport = useCallback(() => {
    const entriesToExport = selectedEntries.size > 0
      ? history.filter(e => selectedEntries.has(e.id))
      : history;
    downloadHistoryCSV(entriesToExport, '选型历史记录');
  }, [history, selectedEntries]);

  // 备份历史记录
  const handleBackup = useCallback(() => {
    try {
      const result = backupHistoryToFile();
      if (result.success) {
        toast.success(`备份成功！文件名: ${result.filename}，记录数: ${result.data.totalRecords}`);
      } else {
        toast.error(`备份失败: ${result.error || '未知错误'}`);
      }
    } catch (error) {
      console.error('备份失败:', error);
      toast.error(`备份失败: ${error.message}`);
    }
  }, []);

  // 恢复历史记录
  const handleRestore = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // 处理文件选择
  const handleFileSelect = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 确认操作模式
    const merge = window.confirm(
      '选择恢复模式：\n\n' +
      '【确定】= 合并模式（保留现有数据，添加备份数据）\n' +
      '【取消】= 覆盖模式（清除现有数据，完全恢复备份）'
    );

    try {
      const result = await restoreHistoryFromFile(file, { merge });

      if (result.success) {
        const message = merge
          ? `合并成功！\n恢复了 ${result.restored} 条记录\n当前总数: ${result.total} 条`
          : `覆盖恢复成功！\n恢复了 ${result.restored} 条记录`;

        toast.success(message);
        loadHistory();
      } else {
        toast.error(`恢复失败: ${result.error || '未知错误'}`);
      }
    } catch (error) {
      console.error('恢复失败:', error);
      toast.error(`恢复失败: ${error.message || '未知错误'}`);
    }

    // 清空文件选择，允许再次选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [loadHistory]);

  // 选择/取消选择条目
  const toggleSelect = useCallback((id, e) => {
    e.stopPropagation();
    setSelectedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // 全选/取消全选
  const toggleSelectAll = useCallback(() => {
    if (selectedEntries.size === sortedHistory.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(sortedHistory.map(e => e.id)));
    }
  }, [sortedHistory, selectedEntries.size]);

  // Batch export selected entries to JSON
  const handleBatchExportJSON = useCallback(() => {
    if (selectedEntries.size === 0) return;
    const entriesToExport = sortedHistory.filter(e => selectedEntries.has(e.id));
    const exportData = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      totalRecords: entriesToExport.length,
      data: entriesToExport
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `选型记录_${entriesToExport.length}条_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`已导出 ${entriesToExport.length} 条记录`);
  }, [selectedEntries, sortedHistory]);

  // Compare selected entries
  const handleCompare = useCallback(() => {
    if (selectedEntries.size < 2 || selectedEntries.size > 4) return;
    setShowComparePanel(true);
  }, [selectedEntries]);

  const compareData = useMemo(() => {
    if (!showComparePanel || selectedEntries.size < 2) return [];
    return sortedHistory.filter(e => selectedEntries.has(e.id)).map(entry => {
      const gb = entry.selectionResult?.recommendations?.[0] || entry.selectedComponents?.gearbox || {};
      return {
        id: entry.id,
        date: new Date(entry.timestamp).toLocaleDateString('zh-CN'),
        model: gb.model || '未选型',
        power: entry.engineData?.power || '-',
        speed: entry.engineData?.speed || '-',
        ratio: gb.selectedRatio || gb.ratio || entry.requirementData?.targetRatio || '-',
        capacity: gb.selectedCapacity ? gb.selectedCapacity.toFixed(6) : '-',
        margin: gb.capacityMargin !== undefined ? gb.capacityMargin.toFixed(1) + '%' : '-',
        weight: gb.weight || '-',
        price: gb.price || gb.basePrice || '-',
        coupling: entry.selectedComponents?.coupling?.model || '-',
        pump: entry.selectedComponents?.pump?.model || '-',
        project: entry.projectInfo?.projectName || '-'
      };
    });
  }, [showComparePanel, selectedEntries, sortedHistory]);

  // 加载历史记录到表单
  const handleLoadEntry = useCallback((entry) => {
    if (onLoadFromHistory) {
      onLoadFromHistory(entry);
    }
  }, [onLoadFromHistory]);

  // 展开/折叠详情
  const toggleExpand = useCallback((id) => {
    setExpandedEntry(prev => prev === id ? null : id);
  }, []);

  // 格式化日期
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 获取齿轮箱系列列表
  const seriesList = useMemo(() => {
    const series = new Set();
    history.forEach(entry => {
      const model = entry.selectionResult?.recommendations?.[0]?.model ||
                   entry.selectedComponents?.gearbox?.model || '';
      const match = model.toUpperCase().match(/^(HCT|HCD|HCW|HCQ|HCA|HCM|HCL|HC|GWC|GW|DT|MB)/);
      if (match) series.add(match[1]);
    });
    return Array.from(series).sort();
  }, [history]);

  if (!isVisible) return null;

  return (
    <div className={`selection-history-manager ${className}`}>
      {/* 工具栏 */}
      <div className="history-toolbar mb-3">
        <div className="row g-2 align-items-center">
          {/* 搜索框 */}
          <div className="col-md-3">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="搜索项目/型号..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* 日期筛选 */}
          <div className="col-md-2">
            <input
              type="date"
              className="form-control form-control-sm"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="开始日期"
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control form-control-sm"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="结束日期"
            />
          </div>

          {/* 系列筛选 */}
          <div className="col-md-2">
            <select
              className="form-select form-select-sm"
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
            >
              <option value="">全部系列</option>
              {seriesList.map(s => (
                <option key={s} value={s}>{s}系列</option>
              ))}
            </select>
          </div>

          {/* 操作按钮 */}
          <div className="col-md-3 text-end">
            <div className="btn-group btn-group-sm">
              <button
                className="btn btn-outline-primary"
                onClick={handleShowStats}
                title="统计信息"
              >
                <i className="bi bi-bar-chart"></i>
              </button>
              <button
                className="btn btn-outline-success"
                onClick={handleExport}
                title="导出CSV"
                disabled={history.length === 0}
              >
                <i className="bi bi-download"></i>
              </button>
              <button
                className="btn btn-outline-info"
                onClick={handleBackup}
                title="备份历史记录到JSON文件"
                disabled={history.length === 0}
              >
                <i className="bi bi-cloud-arrow-down"></i>
              </button>
              <button
                className="btn btn-outline-warning"
                onClick={handleRestore}
                title="从JSON文件恢复历史记录"
              >
                <i className="bi bi-cloud-arrow-up"></i>
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={handleBatchExportJSON}
                title="导出选中记录为JSON"
                disabled={selectedEntries.size === 0}
              >
                <i className="bi bi-filetype-json"></i>
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={handleCompare}
                title="对比选中的记录(2-4条)"
                disabled={selectedEntries.size < 2 || selectedEntries.size > 4}
              >
                <i className="bi bi-bar-chart-line"></i> 对比({selectedEntries.size})
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={handleBatchDelete}
                title="删除选中"
                disabled={selectedEntries.size === 0}
              >
                <i className="bi bi-trash"></i> ({selectedEntries.size})
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={loadHistory}
                title="刷新"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 隐藏的文件输入用于恢复功能 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* 统计面板 */}
      {showStats && stats && (
        <div className="stats-panel card mb-3">
          <div className="card-body">
            <h6 className="card-title">选型统计</h6>
            <div className="row text-center">
              <div className="col">
                <div className="stat-value">{stats.totalCount}</div>
                <div className="stat-label text-muted">总记录数</div>
              </div>
              <div className="col">
                <div className="stat-value">{stats.avgPower} kW</div>
                <div className="stat-label text-muted">平均功率</div>
              </div>
              <div className="col">
                <div className="stat-value">{stats.avgRatio}</div>
                <div className="stat-label text-muted">平均速比</div>
              </div>
              <div className="col">
                <div className="stat-value">{stats.successRate}%</div>
                <div className="stat-label text-muted">成功率</div>
              </div>
            </div>
            {/* 系列分布 */}
            <div className="mt-2">
              <small className="text-muted">系列分布: </small>
              {Object.entries(stats.bySeries || {}).slice(0, 5).map(([series, count]) => (
                <span key={series} className="badge bg-secondary me-1">
                  {series}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comparison panel */}
      {showComparePanel && compareData.length >= 2 && (
        <div className="card mb-3 border-primary">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-2">
            <span><i className="bi bi-bar-chart-line me-2"></i>选型对比 ({compareData.length}条)</span>
            <button className="btn btn-sm btn-outline-light" onClick={() => setShowComparePanel(false)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="card-body p-0" style={{ overflowX: 'auto' }}>
            <table className="table table-sm table-bordered table-hover mb-0" style={{ fontSize: '0.85rem' }}>
              <thead className="table-light">
                <tr>
                  <th>属性</th>
                  {compareData.map(d => <th key={d.id}>{d.model}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr><td>日期</td>{compareData.map(d => <td key={d.id}>{d.date}</td>)}</tr>
                <tr><td>项目</td>{compareData.map(d => <td key={d.id}>{d.project}</td>)}</tr>
                <tr><td>功率 (kW)</td>{compareData.map(d => <td key={d.id}>{d.power}</td>)}</tr>
                <tr><td>转速 (rpm)</td>{compareData.map(d => <td key={d.id}>{d.speed}</td>)}</tr>
                <tr><td>减速比</td>{compareData.map(d => <td key={d.id}>{typeof d.ratio === 'number' ? d.ratio.toFixed(2) : d.ratio}</td>)}</tr>
                <tr><td>传递能力</td>{compareData.map(d => <td key={d.id}>{d.capacity}</td>)}</tr>
                <tr><td>能力余量</td>{compareData.map(d => <td key={d.id}>{d.margin}</td>)}</tr>
                <tr><td>重量 (kg)</td>{compareData.map(d => <td key={d.id}>{d.weight}</td>)}</tr>
                <tr><td>价格 (元)</td>{compareData.map(d => <td key={d.id}>{typeof d.price === 'number' ? d.price.toLocaleString() : d.price}</td>)}</tr>
                <tr><td>联轴器</td>{compareData.map(d => <td key={d.id}>{d.coupling}</td>)}</tr>
                <tr><td>备用泵</td>{compareData.map(d => <td key={d.id}>{d.pump}</td>)}</tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 排序和全选控制 */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <input
            type="checkbox"
            className="form-check-input me-2"
            checked={selectedEntries.size === sortedHistory.length && sortedHistory.length > 0}
            onChange={toggleSelectAll}
            id="selectAll"
          />
          <label htmlFor="selectAll" className="form-check-label small">
            全选 ({sortedHistory.length}条)
          </label>
          <span className="ms-3 text-muted small">{history.length}/200 条记录</span>
        </div>
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="date">按日期</option>
            <option value="power">按功率</option>
            <option value="model">按型号</option>
          </select>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
          >
            {sortOrder === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </div>

      {/* 历史记录列表 */}
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">加载中...</span>
          </div>
        </div>
      ) : sortedHistory.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
          <h5 className="mt-3">暂无选型历史记录</h5>
          <p>完成齿轮箱选型后，记录将自动保存到这里</p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <button className="btn btn-outline-primary btn-sm" onClick={handleRestore}>
              <i className="bi bi-cloud-arrow-up me-1"></i>从备份恢复
            </button>
          </div>
          <small className="d-block mt-3 text-muted">
            <i className="bi bi-info-circle me-1"></i>
            系统最多保存200条记录，超出后自动清理最旧记录
          </small>
        </div>
      ) : (
        <div className="history-list">
          {sortedHistory.map((entry) => {
            const gearbox = entry.selectionResult?.recommendations?.[0] ||
                           entry.selectedComponents?.gearbox || {};
            const coupling = entry.selectedComponents?.coupling || {};
            const power = entry.engineData?.power || entry.requirementData?.motorPower || '-';
            const speed = entry.engineData?.speed || entry.requirementData?.motorSpeed || '-';
            const ratio = entry.requirementData?.targetRatio || '-';
            const isExpanded = expandedEntry === entry.id;
            const isSelected = selectedEntries.has(entry.id);

            return (
              <div
                key={entry.id}
                className={`history-item card mb-2 ${isSelected ? 'border-primary' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="card-body py-2"
                  onClick={() => toggleExpand(entry.id)}
                >
                  <div className="d-flex align-items-center">
                    {/* 复选框 */}
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={isSelected}
                      onChange={(e) => toggleSelect(entry.id, e)}
                      onClick={(e) => e.stopPropagation()}
                    />

                    {/* 主要信息 */}
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong className="text-primary">
                            {gearbox.model || '未选型'}
                          </strong>
                          {coupling.model && (
                            <span className="text-muted ms-2">+ {coupling.model}</span>
                          )}
                          <div className="small text-muted">
                            {power}kW / {speed}rpm / 速比{ratio}
                          </div>
                        </div>
                        <div className="text-end">
                          <small className="text-muted">
                            {formatDate(entry.timestamp)}
                          </small>
                          <div>
                            {entry.projectInfo?.projectName && (
                              <span className="badge bg-info me-1">
                                {entry.projectInfo.projectName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="ms-2 btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadEntry(entry);
                        }}
                        title="加载此记录"
                      >
                        <i className="bi bi-box-arrow-in-down"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={(e) => handleDelete(entry.id, e)}
                        title="删除"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>

                  {/* 展开的详细信息 */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-top">
                      <div className="row g-2 small">
                        <div className="col-md-4">
                          <strong>发动机参数:</strong>
                          <ul className="mb-0 ps-3">
                            <li>功率: {power} kW</li>
                            <li>转速: {speed} rpm</li>
                            <li>飞轮: {entry.engineData?.flywheelSpec || '-'}</li>
                          </ul>
                        </div>
                        <div className="col-md-4">
                          <strong>齿轮箱:</strong>
                          <ul className="mb-0 ps-3">
                            <li>型号: {gearbox.model || '-'}</li>
                            <li>速比: {gearbox.ratio || ratio}</li>
                            <li>重量: {gearbox.weight || '-'} kg</li>
                          </ul>
                        </div>
                        <div className="col-md-4">
                          <strong>配套设备:</strong>
                          <ul className="mb-0 ps-3">
                            <li>联轴器: {coupling.model || '-'}</li>
                            <li>备用泵: {entry.selectedComponents?.pump?.model || '-'}</li>
                          </ul>
                        </div>
                      </div>
                      {/* 标签 */}
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="mt-2">
                          <small className="text-muted">标签: </small>
                          {entry.tags.map(tag => (
                            <span key={tag} className="badge bg-secondary me-1">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 底部操作栏 */}
      {history.length > 0 && (
        <div className="mt-3 text-end">
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleClearAll}
          >
            <i className="bi bi-trash"></i> 清空所有记录
          </button>
        </div>
      )}

      {/* 样式 */}
      <style>{`
        .selection-history-manager {
          max-height: 600px;
          overflow-y: auto;
        }
        .history-item:hover {
          background-color: #f8f9fa;
        }
        .history-item.border-primary {
          background-color: #e7f1ff;
        }
        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #0d6efd;
        }
        .stat-label {
          font-size: 0.75rem;
        }
        .stats-panel {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
      `}</style>
    </div>
  );
};

export default SelectionHistoryManager;
