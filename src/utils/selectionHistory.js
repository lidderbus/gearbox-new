// src/utils/selectionHistory.js
import { logger } from '../config/logging';

const HISTORY_KEY = 'selectionHistory'; // localStorage 键名
const MAX_HISTORY_ITEMS = 50; // 最大保存条数

/**
 * 规范化 projectInfo 数据结构
 * 将旧格式的 projectInfo 转换为标准格式
 * @param {object} projectInfo - 原始 projectInfo 对象
 * @returns {object} { normalized, selectionType }
 */
const normalizeProjectInfo = (projectInfo) => {
  if (!projectInfo || typeof projectInfo !== 'object') {
    return {
      normalized: {
        projectName: '',
        customerName: '',
        projectNumber: '',
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        engineModel: ''
      },
      selectionType: null
    };
  }

  // 处理旧格式：{ name: '...', date: '...', type: '...' }
  const normalized = {
    projectName: projectInfo.projectName || projectInfo.name || '',
    customerName: projectInfo.customerName || '',
    projectNumber: projectInfo.projectNumber || '',
    contactPerson: projectInfo.contactPerson || '',
    contactPhone: projectInfo.contactPhone || '',
    contactEmail: projectInfo.contactEmail || '',
    engineModel: projectInfo.engineModel || ''
  };

  // 提取 selectionType (如果在 projectInfo 中错误地存储了)
  const selectionType = projectInfo.type || projectInfo.selectionType || null;

  return { normalized, selectionType };
};

/**
 * 迁移旧版历史数据到新格式
 * @param {Array} history - 历史记录数组
 * @returns {object} { migratedData, migrationInfo }
 */
const migrateHistoryData = (history) => {
  if (!Array.isArray(history)) return { migratedData: [], migrationInfo: { count: 0, hadErrors: false } };

  let migratedCount = 0;
  let errorCount = 0;

  const migratedData = history.map(entry => {
    // 如果已经是新格式，直接返回
    if (entry.projectInfo?.projectName !== undefined && entry.selectionType !== undefined) {
      return entry;
    }

    // 迁移旧格式
    migratedCount++;
    try {
      const { normalized: normalizedProjectInfo, selectionType } = normalizeProjectInfo(entry.projectInfo);

      return {
        ...entry,
        projectInfo: normalizedProjectInfo,
        selectionType: selectionType || entry.selectionType || 'single',
        _migrated: true,  // 标记为已迁移
        _migrationDate: new Date().toISOString()
      };
    } catch (error) {
      errorCount++;
      logger.error("迁移单条记录失败:", error, entry);
      return entry;  // 保留原始数据
    }
  });

  return {
    migratedData,
    migrationInfo: {
      count: migratedCount,
      errorCount,
      hadErrors: errorCount > 0
    }
  };
};

/**
 * 验证选型历史条目的数据完整性
 * @param {object} entry - 历史记录条目
 * @returns {object} { valid: boolean, errors: Array, warnings: Array }
 */
const validateHistoryEntry = (entry) => {
  const errors = [];
  const warnings = [];

  // 必需字段验证
  if (!entry.id) errors.push('缺少记录ID');
  if (!entry.timestamp) errors.push('缺少时间戳');
  if (!entry.projectInfo) {
    errors.push('缺少项目信息');
  } else {
    if (!entry.projectInfo.projectName) warnings.push('缺少项目名称');
  }

  // selectionType 验证
  if (!entry.selectionType) {
    warnings.push('缺少选型类型');
  } else if (!['single', 'batch'].includes(entry.selectionType)) {
    warnings.push(`无效的选型类型: ${entry.selectionType}`);
  }

  // 选型结果验证
  if (!entry.selectionResult && !entry.selectedComponents) {
    errors.push('缺少选型结果或选中组件');
  }

  // 数据完整性检查
  if (entry.selectionResult?.recommendations) {
    if (!Array.isArray(entry.selectionResult.recommendations)) {
      errors.push('推荐结果格式错误');
    } else if (entry.selectionResult.recommendations.length === 0) {
      warnings.push('推荐结果为空');
    }
  }

  // 时间戳有效性
  if (entry.timestamp) {
    const date = new Date(entry.timestamp);
    if (isNaN(date.getTime())) {
      errors.push('时间戳格式无效');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * 批量验证历史数据
 * @param {Array} history - 历史记录数组
 * @returns {object} 验证统计信息
 */
export const validateSelectionHistory = (history = null) => {
  try {
    const data = history || getSelectionHistory();

    const results = {
      total: data.length,
      valid: 0,
      invalid: 0,
      hasWarnings: 0,
      issues: []
    };

    data.forEach((entry, index) => {
      const validation = validateHistoryEntry(entry);

      if (validation.valid) {
        results.valid++;
      } else {
        results.invalid++;
        results.issues.push({
          index,
          id: entry.id,
          timestamp: entry.timestamp,
          errors: validation.errors
        });
      }

      if (validation.warnings.length > 0) {
        results.hasWarnings++;
      }
    });

    return results;
  } catch (error) {
    logger.error("验证历史数据失败:", error);
    return {
      total: 0,
      valid: 0,
      invalid: 0,
      hasWarnings: 0,
      issues: [],
      error: error.message
    };
  }
};

/**
 * 获取选型历史记录
 * @param {object} options - 选项 { returnMigrationInfo: boolean }
 * @returns {Array|object} 历史记录数组，或包含迁移信息的对象
 */
export const getSelectionHistory = (options = {}) => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) {
      return options.returnMigrationInfo
        ? { data: [], migrationInfo: null }
        : [];
    }

    const parsed = JSON.parse(stored);

    // ✓ 迁移旧数据到新格式
    const { migratedData, migrationInfo } = migrateHistoryData(parsed);

    // ✓ 如果数据被迁移，保存回 localStorage
    if (migrationInfo.count > 0) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(migratedData));
      logger.info(`历史数据已自动迁移: ${migrationInfo.count}条记录更新到新格式` +
                  (migrationInfo.errorCount > 0 ? `, ${migrationInfo.errorCount}条失败` : ''));

      // 触发自定义事件通知UI
      if (typeof window !== 'undefined' && migrationInfo.count > 0) {
        window.dispatchEvent(new CustomEvent('historyMigrated', {
          detail: migrationInfo
        }));
      }
    }

    return options.returnMigrationInfo
      ? { data: migratedData, migrationInfo: migrationInfo.count > 0 ? migrationInfo : null }
      : migratedData;
  } catch (error) {
    logger.error("加载选型历史失败:", error);
    return options.returnMigrationInfo
      ? { data: [], migrationInfo: null, error: error.message }
      : [];
  }
};

/**
 * 保存一条新的选型历史记录
 * @param {object} selectionResult - 选型结果对象
 * @param {object} projectInfo - 项目信息对象
 * @param {object} selectedComponents - 选中的组件对象
 * @param {object} engineData - 发动机输入数据
 * @param {object} requirementData - 需求输入数据
 * @returns {boolean} 保存成功返回 true，否则 false
 */
export const saveSelectionToHistory = (selectionResult, projectInfo, selectedComponents, engineData, requirementData) => {
  try {
    const history = getSelectionHistory();

    // ✓ 规范化 projectInfo 数据
    const { normalized: normalizedProjectInfo, selectionType } = normalizeProjectInfo(projectInfo);

    const newEntry = {
      id: Date.now(), // 使用时间戳作为唯一 ID
      timestamp: new Date().toISOString(),
      projectInfo: normalizedProjectInfo,        // ✓ 使用规范化后的数据
      selectionType: selectionType || 'single',  // ✓ 在根级别存储选型类型
      selectionResult: { ...selectionResult },   // 确保保存的是副本
      selectedComponents: { ...selectedComponents },
      engineData: { ...engineData },
      requirementData: { ...requirementData }
    };

    // 添加新记录到数组开头
    history.unshift(newEntry);

    // 限制历史记录数量
    const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
    logger.debug("选型历史已保存:", newEntry);
    return true;
  } catch (error) {
    logger.error("保存选型历史失败:", error);
    return false;
  }
};

/**
 * 从历史记录中加载指定的选型数据
 * @param {number} historyId - 要加载的历史记录 ID
 * @returns {object | null} 找到的历史记录对象，或 null
 */
export const loadSelectionFromHistory = (historyId) => {
  try {
    const history = getSelectionHistory();
    const entry = history.find(item => item.id === historyId);
    if (entry) {
        logger.debug("从历史加载:", entry);
        // 返回完整的条目，让调用者处理状态更新
        return entry;
    }
    logger.warn("未找到历史记录 ID:", historyId);
    return null;
  } catch (error) {
    logger.error("加载选型历史失败:", error);
    return null;
  }
};

/**
 * 删除一条选型历史记录
 * @param {number} historyId - 要删除的历史记录 ID
 * @returns {boolean} 删除成功返回 true，否则 false
 */
export const deleteSelectionHistory = (historyId) => {
  try {
    let history = getSelectionHistory();
    const initialLength = history.length;
    history = history.filter(item => item.id !== historyId);

    if (history.length < initialLength) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      logger.debug("历史记录已删除:", historyId);
      return true;
    }
    logger.warn("尝试删除不存在的历史记录 ID:", historyId);
    return false;
  } catch (error) {
    logger.error("删除选型历史失败:", error);
    return false;
  }
};

/**
 * 清空所有选型历史记录
 * @returns {boolean} 清空成功返回 true，否则 false
 */
export const clearSelectionHistory = () => {
    try {
        localStorage.removeItem(HISTORY_KEY);
        logger.log("选型历史已清空");
        return true;
    } catch (error) {
        logger.error("清空选型历史失败:", error);
        return false;
    }
};

/**
 * 搜索和过滤选型历史
 * @param {object} filters - 过滤条件
 * @param {string} filters.searchText - 搜索文本 (搜索项目名称、型号等)
 * @param {string} filters.dateFrom - 开始日期
 * @param {string} filters.dateTo - 结束日期
 * @param {number} filters.minPower - 最小功率
 * @param {number} filters.maxPower - 最大功率
 * @param {string} filters.gearboxSeries - 齿轮箱系列
 * @param {string} filters.type - 选型类型 (single/batch)
 * @returns {Array} 过滤后的历史记录
 */
export const searchSelectionHistory = (filters = {}) => {
  try {
    let history = getSelectionHistory();

    // 文本搜索
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      history = history.filter(entry => {
        const projectName = (entry.projectInfo?.projectName || entry.projectInfo?.name || '').toLowerCase();
        const gearboxModel = (entry.selectionResult?.recommendations?.[0]?.model ||
                             entry.selectedComponents?.gearbox?.model || '').toLowerCase();
        const couplingModel = (entry.selectedComponents?.coupling?.model || '').toLowerCase();
        return projectName.includes(searchLower) ||
               gearboxModel.includes(searchLower) ||
               couplingModel.includes(searchLower);
      });
    }

    // 日期范围过滤
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      history = history.filter(entry => new Date(entry.timestamp) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      history = history.filter(entry => new Date(entry.timestamp) <= toDate);
    }

    // 功率范围过滤
    if (filters.minPower !== undefined && filters.minPower !== '') {
      const minP = parseFloat(filters.minPower);
      history = history.filter(entry => {
        const power = entry.engineData?.power || entry.requirementData?.motorPower || 0;
        return power >= minP;
      });
    }
    if (filters.maxPower !== undefined && filters.maxPower !== '') {
      const maxP = parseFloat(filters.maxPower);
      history = history.filter(entry => {
        const power = entry.engineData?.power || entry.requirementData?.motorPower || 0;
        return power <= maxP;
      });
    }

    // 齿轮箱系列过滤
    if (filters.gearboxSeries) {
      history = history.filter(entry => {
        const model = entry.selectionResult?.recommendations?.[0]?.model ||
                     entry.selectedComponents?.gearbox?.model || '';
        return model.toUpperCase().startsWith(filters.gearboxSeries.toUpperCase());
      });
    }

    // 选型类型过滤
    if (filters.type) {
      history = history.filter(entry => {
        const entryType = entry.selectionType || 'single';  // ✓ 使用根级别的 selectionType
        return entryType === filters.type;
      });
    }

    return history;
  } catch (error) {
    logger.error("搜索选型历史失败:", error);
    return [];
  }
};

/**
 * 获取选型历史统计信息
 * @returns {object} 统计数据
 */
export const getSelectionHistoryStats = () => {
  try {
    const history = getSelectionHistory();

    const stats = {
      totalCount: history.length,
      byMonth: {},
      bySeries: {},
      byPowerRange: {
        'under100': 0,
        '100to300': 0,
        '300to500': 0,
        '500to1000': 0,
        'over1000': 0
      },
      avgPower: 0,
      avgRatio: 0,
      successRate: 0
    };

    let totalPower = 0;
    let totalRatio = 0;
    let powerCount = 0;
    let ratioCount = 0;
    let successCount = 0;

    history.forEach(entry => {
      // 按月统计
      const month = entry.timestamp.substring(0, 7); // YYYY-MM
      stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;

      // 按系列统计
      const model = entry.selectionResult?.recommendations?.[0]?.model ||
                   entry.selectedComponents?.gearbox?.model || '';
      const series = extractSeries(model);
      if (series) {
        stats.bySeries[series] = (stats.bySeries[series] || 0) + 1;
      }

      // 功率范围统计
      const power = entry.engineData?.power || entry.requirementData?.motorPower || 0;
      if (power > 0) {
        totalPower += power;
        powerCount++;
        if (power < 100) stats.byPowerRange['under100']++;
        else if (power < 300) stats.byPowerRange['100to300']++;
        else if (power < 500) stats.byPowerRange['300to500']++;
        else if (power < 1000) stats.byPowerRange['500to1000']++;
        else stats.byPowerRange['over1000']++;
      }

      // 速比统计
      const ratio = entry.requirementData?.targetRatio || 0;
      if (ratio > 0) {
        totalRatio += ratio;
        ratioCount++;
      }

      // 成功率统计
      if (entry.selectionResult?.recommendations?.length > 0 ||
          entry.selectedComponents?.gearbox) {
        successCount++;
      }
    });

    stats.avgPower = powerCount > 0 ? Math.round(totalPower / powerCount) : 0;
    stats.avgRatio = ratioCount > 0 ? Math.round(totalRatio / ratioCount * 10) / 10 : 0;
    stats.successRate = history.length > 0 ? Math.round(successCount / history.length * 100) : 0;

    return stats;
  } catch (error) {
    logger.error("获取统计信息失败:", error);
    return null;
  }
};

/**
 * 从型号中提取系列
 */
function extractSeries(model) {
  if (!model) return null;
  const match = model.toUpperCase().match(/^(HCT|HCD|HCW|HCQ|HCA|HCM|HCL|HC|GWC|GW|DT|MB)/);
  return match ? match[1] : null;
}

/**
 * 比较两个选型记录
 * @param {number} id1 - 第一个记录ID
 * @param {number} id2 - 第二个记录ID
 * @returns {object} 比较结果
 */
export const compareSelectionEntries = (id1, id2) => {
  try {
    const entry1 = loadSelectionFromHistory(id1);
    const entry2 = loadSelectionFromHistory(id2);

    if (!entry1 || !entry2) {
      return { error: '无法找到指定的历史记录' };
    }

    const g1 = entry1.selectionResult?.recommendations?.[0] || entry1.selectedComponents?.gearbox || {};
    const g2 = entry2.selectionResult?.recommendations?.[0] || entry2.selectedComponents?.gearbox || {};

    return {
      entries: [entry1, entry2],
      comparison: {
        power: {
          entry1: entry1.engineData?.power || entry1.requirementData?.motorPower || 0,
          entry2: entry2.engineData?.power || entry2.requirementData?.motorPower || 0
        },
        speed: {
          entry1: entry1.engineData?.speed || entry1.requirementData?.motorSpeed || 0,
          entry2: entry2.engineData?.speed || entry2.requirementData?.motorSpeed || 0
        },
        ratio: {
          entry1: entry1.requirementData?.targetRatio || 0,
          entry2: entry2.requirementData?.targetRatio || 0
        },
        gearbox: {
          entry1: g1.model || '-',
          entry2: g2.model || '-'
        },
        price: {
          entry1: g1.factoryPrice || g1.price || 0,
          entry2: g2.factoryPrice || g2.price || 0
        },
        weight: {
          entry1: g1.weight || 0,
          entry2: g2.weight || 0
        }
      }
    };
  } catch (error) {
    logger.error("比较选型记录失败:", error);
    return { error: error.message };
  }
};

/**
 * 导出选型历史为CSV
 * @param {Array} entries - 要导出的条目 (可选，默认导出全部)
 * @returns {string} CSV字符串
 */
export const exportHistoryToCSV = (entries = null) => {
  try {
    const history = entries || getSelectionHistory();

    const headers = [
      '日期时间',
      '项目名称',
      '功率(kW)',
      '转速(rpm)',
      '目标速比',
      '齿轮箱型号',
      '联轴器型号',
      '备用泵型号',
      '价格(元)',
      '选型类型'
    ];

    const rows = history.map(entry => {
      const gearbox = entry.selectionResult?.recommendations?.[0] ||
                     entry.selectedComponents?.gearbox || {};
      const coupling = entry.selectedComponents?.coupling || {};
      const pump = entry.selectedComponents?.pump || {};

      return [
        new Date(entry.timestamp).toLocaleString(),
        entry.projectInfo?.projectName || entry.projectInfo?.name || '',
        entry.engineData?.power || entry.requirementData?.motorPower || '',
        entry.engineData?.speed || entry.requirementData?.motorSpeed || '',
        entry.requirementData?.targetRatio || '',
        gearbox.model || '',
        coupling.model || '',
        pump.model || '',
        gearbox.factoryPrice || gearbox.price || '',
        entry.selectionType || 'single'  // ✓ 使用根级别的 selectionType
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return '\uFEFF' + csvContent; // 添加BOM以支持中文
  } catch (error) {
    logger.error("导出历史失败:", error);
    return '';
  }
};

/**
 * 导出历史并下载
 * @param {Array} entries - 要导出的条目
 * @param {string} filename - 文件名
 */
export const downloadHistoryCSV = (entries = null, filename = '选型历史') => {
  const csv = exportHistoryToCSV(entries);
  if (!csv) return false;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  return true;
};

/**
 * 更新选型历史条目
 * @param {number} historyId - 历史记录ID
 * @param {object} updates - 要更新的字段
 * @returns {boolean} 成功返回true
 */
export const updateSelectionHistory = (historyId, updates) => {
  try {
    const history = getSelectionHistory();
    const index = history.findIndex(item => item.id === historyId);

    if (index === -1) {
      logger.warn("未找到历史记录 ID:", historyId);
      return false;
    }

    // 只允许更新特定字段
    const allowedUpdates = ['projectInfo', 'tags', 'notes'];
    const safeUpdates = {};

    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        safeUpdates[key] = updates[key];
      }
    }

    history[index] = {
      ...history[index],
      ...safeUpdates,
      lastModified: new Date().toISOString()
    };

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    logger.debug("历史记录已更新:", historyId);
    return true;
  } catch (error) {
    logger.error("更新选型历史失败:", error);
    return false;
  }
};

/**
 * 为选型历史添加标签
 * @param {number} historyId - 历史记录ID
 * @param {string} tag - 标签
 * @returns {boolean} 成功返回true
 */
export const addTagToHistory = (historyId, tag) => {
  try {
    const entry = loadSelectionFromHistory(historyId);
    if (!entry) return false;

    const tags = entry.tags || [];
    if (!tags.includes(tag)) {
      tags.push(tag);
      return updateSelectionHistory(historyId, { tags });
    }
    return true;
  } catch (error) {
    logger.error("添加标签失败:", error);
    return false;
  }
};

/**
 * 从选型历史移除标签
 * @param {number} historyId - 历史记录ID
 * @param {string} tag - 标签
 * @returns {boolean} 成功返回true
 */
export const removeTagFromHistory = (historyId, tag) => {
  try {
    const entry = loadSelectionFromHistory(historyId);
    if (!entry) return false;

    const tags = (entry.tags || []).filter(t => t !== tag);
    return updateSelectionHistory(historyId, { tags });
  } catch (error) {
    logger.error("移除标签失败:", error);
    return false;
  }
};

/**
 * 获取所有已使用的标签
 * @returns {Array} 标签列表及其使用次数
 */
export const getAllTags = () => {
  try {
    const history = getSelectionHistory();
    const tagCounts = {};

    history.forEach(entry => {
      (entry.tags || []).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    logger.error("获取标签失败:", error);
    return [];
  }
};

/**
 * 备份选型历史到JSON文件
 * @returns {object} { success: boolean, filename: string, data: object }
 */
export const backupHistoryToFile = () => {
  try {
    const history = getSelectionHistory();
    const validation = validateSelectionHistory(history);

    const backupData = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      totalRecords: history.length,
      validation: {
        valid: validation.valid,
        invalid: validation.invalid,
        hasWarnings: validation.hasWarnings
      },
      data: history
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `gearbox_history_backup_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;

    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    logger.info("历史记录已备份:", filename);
    return { success: true, filename, data: backupData };
  } catch (error) {
    logger.error("备份历史记录失败:", error);
    return { success: false, error: error.message };
  }
};

/**
 * 从JSON文件恢复选型历史
 * @param {File} file - 备份文件
 * @param {object} options - 恢复选项
 * @param {boolean} options.merge - 是否合并到现有数据 (默认false，覆盖)
 * @param {boolean} options.validateBeforeRestore - 恢复前验证数据 (默认true)
 * @returns {Promise<object>} { success: boolean, restored: number, errors: Array }
 */
export const restoreHistoryFromFile = (file, options = {}) => {
  const { merge = false, validateBeforeRestore = true } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const backupData = JSON.parse(event.target.result);

        // 验证备份文件格式
        if (!backupData.version || !backupData.data || !Array.isArray(backupData.data)) {
          throw new Error('备份文件格式无效');
        }

        let historyToRestore = backupData.data;

        // 可选：恢复前验证数据
        if (validateBeforeRestore) {
          const validation = validateSelectionHistory(historyToRestore);
          if (validation.invalid > 0) {
            logger.warn(`备份数据包含 ${validation.invalid} 条无效记录，这些记录将被跳过`);
            // 过滤掉无效记录
            historyToRestore = historyToRestore.filter((entry, index) => {
              return !validation.issues.some(issue => issue.index === index);
            });
          }
        }

        let finalHistory;
        if (merge) {
          // 合并模式：合并到现有数据
          const currentHistory = getSelectionHistory();
          const existingIds = new Set(currentHistory.map(e => e.id));

          // 只添加不重复的记录
          const newRecords = historyToRestore.filter(e => !existingIds.has(e.id));
          finalHistory = [...currentHistory, ...newRecords];

          logger.info(`合并模式: 添加了 ${newRecords.length} 条新记录`);
        } else {
          // 覆盖模式：直接替换
          finalHistory = historyToRestore;
          logger.info(`覆盖模式: 恢复了 ${historyToRestore.length} 条记录`);
        }

        // 限制总记录数
        if (finalHistory.length > MAX_HISTORY_ITEMS) {
          finalHistory = finalHistory.slice(0, MAX_HISTORY_ITEMS);
          logger.warn(`记录数超过上限，已截断至 ${MAX_HISTORY_ITEMS} 条`);
        }

        // 保存到localStorage
        localStorage.setItem(HISTORY_KEY, JSON.stringify(finalHistory));

        resolve({
          success: true,
          restored: historyToRestore.length,
          total: finalHistory.length,
          mode: merge ? 'merge' : 'overwrite',
          backupVersion: backupData.version,
          backupDate: backupData.exportDate
        });
      } catch (error) {
        logger.error("恢复历史记录失败:", error);
        reject({ success: false, error: error.message });
      }
    };

    reader.onerror = () => {
      reject({ success: false, error: '读取文件失败' });
    };

    reader.readAsText(file);
  });
};

/**
 * 清理历史数据（删除损坏或重复的记录）
 * @param {object} options - 清理选项
 * @param {boolean} options.removeDuplicates - 删除重复记录 (默认true)
 * @param {boolean} options.removeInvalid - 删除无效记录 (默认false)
 * @returns {object} { cleaned: number, removed: number, remaining: number }
 */
export const cleanHistoryData = (options = {}) => {
  const { removeDuplicates = true, removeInvalid = false } = options;

  try {
    let history = getSelectionHistory();
    const initialCount = history.length;

    // 删除重复记录（基于ID）
    if (removeDuplicates) {
      const seen = new Set();
      history = history.filter(entry => {
        if (seen.has(entry.id)) {
          return false;
        }
        seen.add(entry.id);
        return true;
      });
    }

    // 删除无效记录
    if (removeInvalid) {
      const validation = validateSelectionHistory(history);
      if (validation.invalid > 0) {
        const invalidIds = new Set(validation.issues.map(issue => issue.id));
        history = history.filter(entry => !invalidIds.has(entry.id));
      }
    }

    const removed = initialCount - history.length;

    if (removed > 0) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      logger.info(`数据清理完成: 删除了 ${removed} 条记录`);
    }

    return {
      cleaned: removed > 0,
      removed,
      remaining: history.length,
      initialCount
    };
  } catch (error) {
    logger.error("清理历史数据失败:", error);
    return {
      cleaned: false,
      removed: 0,
      remaining: 0,
      initialCount: 0,
      error: error.message
    };
  }
};
