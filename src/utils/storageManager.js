// src/utils/storageManager.js
// 数据存储管理器 - 支持版本控制、迁移和错误恢复

import { APP_DATA_VERSION } from '../config';

// 存储键名
const STORAGE_KEYS = {
  APP_DATA: 'appData',
  BACKUP: 'appData_backup',
  METADATA: 'appData_meta',
  ANALYTICS: '_analytics'
};

// 存储大小限制 (bytes)
const STORAGE_LIMITS = {
  WARNING: 4 * 1024 * 1024,  // 4MB - 发出警告
  CRITICAL: 8 * 1024 * 1024  // 8MB - 接近限制
};

/**
 * 数据存储管理器
 */
export const StorageManager = {
  /**
   * 获取存储的数据（带版本检查和自动迁移）
   * @returns {Object|null} 存储的数据或null
   */
  getData: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APP_DATA);
      if (!stored) return null;

      const data = JSON.parse(stored);
      const storedVersion = data._version || 0;

      // 版本检查
      if (storedVersion < APP_DATA_VERSION) {
        console.log(`StorageManager: 检测到旧版本数据 (v${storedVersion} -> v${APP_DATA_VERSION})，开始迁移...`);
        const migrated = StorageManager.migrateData(data, storedVersion, APP_DATA_VERSION);

        // 保存迁移后的数据
        StorageManager.saveData(migrated);
        return migrated;
      }

      return data;
    } catch (e) {
      console.error('StorageManager: 读取数据失败', e);

      // 尝试从备份恢复
      const backup = StorageManager.getBackup();
      if (backup) {
        console.log('StorageManager: 尝试从备份恢复...');
        return backup;
      }

      return null;
    }
  },

  /**
   * 保存数据（带版本标记和备份）
   * @param {Object} data - 要保存的数据
   * @param {Object} options - 选项
   * @returns {boolean} 是否成功
   */
  saveData: (data, options = { createBackup: true }) => {
    try {
      const toSave = {
        ...data,
        _version: APP_DATA_VERSION,
        _savedAt: Date.now(),
        _savedBy: 'StorageManager'
      };

      const json = JSON.stringify(toSave);
      const size = json.length;

      // 检查存储大小
      if (size > STORAGE_LIMITS.CRITICAL) {
        console.error(`StorageManager: 数据过大 (${(size / 1024 / 1024).toFixed(2)}MB)，接近存储限制`);
        // 触发清理
        StorageManager.cleanup();
      } else if (size > STORAGE_LIMITS.WARNING) {
        console.warn(`StorageManager: 数据较大 (${(size / 1024 / 1024).toFixed(2)}MB)，建议优化`);
      }

      // 创建备份（在保存新数据前）
      if (options.createBackup) {
        StorageManager.createBackup();
      }

      localStorage.setItem(STORAGE_KEYS.APP_DATA, json);

      // 更新元数据
      StorageManager.updateMetadata({
        lastSaved: Date.now(),
        version: APP_DATA_VERSION,
        size: size
      });

      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('StorageManager: 存储配额已满，尝试清理...');
        StorageManager.cleanup();

        // 重试一次
        try {
          localStorage.setItem(STORAGE_KEYS.APP_DATA, JSON.stringify(data));
          return true;
        } catch (retryError) {
          console.error('StorageManager: 清理后仍无法保存', retryError);
        }
      }
      return false;
    }
  },

  /**
   * 数据版本迁移
   * @param {Object} data - 原数据
   * @param {number} fromVersion - 原版本
   * @param {number} toVersion - 目标版本
   * @returns {Object} 迁移后的数据
   */
  migrateData: (data, fromVersion, toVersion) => {
    let migrated = { ...data };

    // v1 -> v2: 添加 series 字段
    if (fromVersion < 2) {
      console.log('StorageManager: 执行 v1->v2 迁移...');
      // 迁移逻辑
    }

    // v2 -> v3: 标准化价格字段
    if (fromVersion < 3) {
      console.log('StorageManager: 执行 v2->v3 迁移...');
      // 迁移逻辑
    }

    // v3 -> v4: 添加 transmissionCapacityPerRatio 数组
    if (fromVersion < 4) {
      console.log('StorageManager: 执行 v3->v4 迁移...');
      const gearboxKeys = Object.keys(migrated).filter(k => k.endsWith('Gearboxes'));
      gearboxKeys.forEach(key => {
        if (Array.isArray(migrated[key])) {
          migrated[key] = migrated[key].map(gearbox => {
            if (gearbox.ratios && !gearbox.transmissionCapacityPerRatio) {
              // 使用默认值填充
              gearbox.transmissionCapacityPerRatio = gearbox.ratios.map(() =>
                gearbox.transferCapacity || 0.1
              );
            }
            return gearbox;
          });
        }
      });
    }

    // 标记迁移信息
    migrated._version = toVersion;
    migrated._migratedFrom = fromVersion;
    migrated._migratedAt = Date.now();

    console.log(`StorageManager: 迁移完成 (v${fromVersion} -> v${toVersion})`);
    return migrated;
  },

  /**
   * 创建备份
   */
  createBackup: () => {
    try {
      const current = localStorage.getItem(STORAGE_KEYS.APP_DATA);
      if (current) {
        localStorage.setItem(STORAGE_KEYS.BACKUP, current);
        console.log('StorageManager: 备份已创建');
      }
    } catch (e) {
      console.warn('StorageManager: 创建备份失败', e);
    }
  },

  /**
   * 获取备份数据
   * @returns {Object|null}
   */
  getBackup: () => {
    try {
      const backup = localStorage.getItem(STORAGE_KEYS.BACKUP);
      return backup ? JSON.parse(backup) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * 从备份恢复
   * @returns {boolean}
   */
  restoreFromBackup: () => {
    const backup = StorageManager.getBackup();
    if (backup) {
      try {
        localStorage.setItem(STORAGE_KEYS.APP_DATA, JSON.stringify(backup));
        console.log('StorageManager: 已从备份恢复');
        return true;
      } catch (e) {
        console.error('StorageManager: 恢复失败', e);
      }
    }
    return false;
  },

  /**
   * 清理存储空间
   */
  cleanup: () => {
    console.log('StorageManager: 开始清理存储空间...');

    // 清除分析数据
    localStorage.removeItem(STORAGE_KEYS.ANALYTICS);

    // 清除旧备份
    localStorage.removeItem(STORAGE_KEYS.BACKUP);

    console.log('StorageManager: 清理完成');
  },

  /**
   * 更新元数据
   * @param {Object} meta
   */
  updateMetadata: (meta) => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.METADATA) || '{}');
      localStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify({
        ...existing,
        ...meta
      }));
    } catch (e) {
      // 忽略元数据错误
    }
  },

  /**
   * 获取存储使用情况
   * @returns {Object}
   */
  getStorageInfo: () => {
    let total = 0;
    const details = {};

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const size = (localStorage.getItem(key) || '').length;
        total += size;
        details[key] = size;
      }
    }

    return {
      used: total,
      usedMB: (total / (1024 * 1024)).toFixed(2),
      usedKB: (total / 1024).toFixed(2),
      details: details,
      limit: '5-10MB (varies by browser)',
      warningThreshold: `${(STORAGE_LIMITS.WARNING / 1024 / 1024).toFixed(0)}MB`,
      status: total > STORAGE_LIMITS.CRITICAL ? 'critical' :
              total > STORAGE_LIMITS.WARNING ? 'warning' : 'ok'
    };
  },

  /**
   * 清除所有数据（危险操作）
   * @param {boolean} confirm - 确认标志
   */
  clearAll: (confirm = false) => {
    if (!confirm) {
      console.warn('StorageManager: clearAll 需要确认参数');
      return false;
    }

    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });

    console.log('StorageManager: 所有数据已清除');
    return true;
  },

  /**
   * 导出数据
   * @returns {string} JSON字符串
   */
  exportData: () => {
    const data = StorageManager.getData();
    if (data) {
      return JSON.stringify(data, null, 2);
    }
    return null;
  },

  /**
   * 导入数据
   * @param {string} jsonString - JSON字符串
   * @returns {boolean}
   */
  importData: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      return StorageManager.saveData(data);
    } catch (e) {
      console.error('StorageManager: 导入失败', e);
      return false;
    }
  }
};

export default StorageManager;
