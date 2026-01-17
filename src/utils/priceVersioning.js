// src/utils/priceVersioning.js
// 价格版本和时效管理模块

/**
 * 价格版本信息
 * 每次价格更新时需要修改这些值
 */
export const PRICE_VERSION = {
  // 当前价格版本标识
  version: '2025-Q4',

  // 价格生效日期
  effectiveDate: '2025-10-01',

  // 价格过期日期（建议更新时间）
  expiryDate: '2026-03-31',

  // 价格来源
  source: '杭州前进齿轮箱集团',

  // 最后更新时间
  lastUpdated: '2025-12-30',

  // 更新说明
  changelog: [
    '2025-12-30: 新增HCM/HCAM/HCVM系列型号',
    '2025-10-01: Q4价格调整，平均上调3%',
    '2025-07-01: Q3价格调整'
  ]
};

/**
 * 价格状态枚举
 */
export const PriceStatus = {
  VALID: 'valid',           // 价格有效
  EXPIRING_SOON: 'expiring', // 即将过期（30天内）
  EXPIRED: 'expired',       // 已过期
  UNKNOWN: 'unknown'        // 未知状态
};

/**
 * 检查价格是否过期
 * @returns {boolean}
 */
export const isPriceExpired = () => {
  const now = new Date();
  const expiry = new Date(PRICE_VERSION.expiryDate);
  return now > expiry;
};

/**
 * 获取距离过期的天数
 * @returns {number} 正数表示还有多少天过期，负数表示已过期多少天
 */
export const getDaysUntilExpiry = () => {
  const now = new Date();
  const expiry = new Date(PRICE_VERSION.expiryDate);
  const diff = expiry - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * 获取价格状态
 * @returns {string} PriceStatus枚举值
 */
export const getPriceStatus = () => {
  const days = getDaysUntilExpiry();

  if (days < 0) {
    return PriceStatus.EXPIRED;
  } else if (days <= 30) {
    return PriceStatus.EXPIRING_SOON;
  } else {
    return PriceStatus.VALID;
  }
};

/**
 * 获取价格警告信息
 * @returns {Object|null} 警告对象或null
 */
export const getPriceWarning = () => {
  const status = getPriceStatus();
  const days = getDaysUntilExpiry();

  switch (status) {
    case PriceStatus.EXPIRED:
      return {
        level: 'error',
        status: status,
        days: Math.abs(days),
        title: '价格数据已过期',
        message: `价格数据已过期 ${Math.abs(days)} 天，报价可能不准确。请联系管理员更新价格数据。`,
        action: '更新价格',
        color: '#dc3545' // 红色
      };

    case PriceStatus.EXPIRING_SOON:
      return {
        level: 'warning',
        status: status,
        days: days,
        title: '价格即将过期',
        message: `价格数据将在 ${days} 天后过期（${PRICE_VERSION.expiryDate}），请提前准备更新。`,
        action: '知道了',
        color: '#ffc107' // 黄色
      };

    case PriceStatus.VALID:
    default:
      return null;
  }
};

/**
 * 格式化价格版本显示
 * @returns {string}
 */
export const formatPriceVersion = () => {
  return `${PRICE_VERSION.version} (有效期至 ${PRICE_VERSION.expiryDate})`;
};

/**
 * 检查服务器是否有新版本价格
 * @returns {Promise<Object>}
 */
export const checkPriceUpdate = async () => {
  try {
    // 尝试从服务器获取价格版本信息
    const response = await fetch('/gearbox-app/price-version.json', {
      cache: 'no-cache'
    });

    if (!response.ok) {
      // 文件不存在，表示没有设置服务器版本检查
      return {
        needsUpdate: false,
        checked: true,
        serverVersionAvailable: false
      };
    }

    const serverVersion = await response.json();

    // 比较版本
    if (serverVersion.version !== PRICE_VERSION.version) {
      return {
        needsUpdate: true,
        checked: true,
        currentVersion: PRICE_VERSION.version,
        newVersion: serverVersion.version,
        changelog: serverVersion.changelog || [],
        effectiveDate: serverVersion.effectiveDate
      };
    }

    return {
      needsUpdate: false,
      checked: true,
      currentVersion: PRICE_VERSION.version
    };
  } catch (e) {
    console.warn('priceVersioning: 检查更新失败', e);
    return {
      needsUpdate: false,
      checked: false,
      error: e.message
    };
  }
};

/**
 * 价格版本管理器
 */
export const PriceVersionManager = {
  /**
   * 获取完整版本信息
   */
  getVersionInfo: () => ({
    ...PRICE_VERSION,
    status: getPriceStatus(),
    daysUntilExpiry: getDaysUntilExpiry(),
    warning: getPriceWarning()
  }),

  /**
   * 验证价格数据是否可用
   * @param {boolean} strict - 严格模式下，过期价格会抛出错误
   * @returns {boolean}
   */
  validatePriceData: (strict = false) => {
    const status = getPriceStatus();

    if (status === PriceStatus.EXPIRED) {
      if (strict) {
        throw new Error(`价格数据已过期（${PRICE_VERSION.expiryDate}），请更新后再使用`);
      }
      console.warn('priceVersioning: 价格数据已过期，报价可能不准确');
      return false;
    }

    if (status === PriceStatus.EXPIRING_SOON) {
      console.warn(`priceVersioning: 价格数据将在 ${getDaysUntilExpiry()} 天后过期`);
    }

    return true;
  },

  /**
   * 获取报价单的价格版本声明
   * @returns {string}
   */
  getQuotationDisclaimer: () => {
    const status = getPriceStatus();
    const versionStr = formatPriceVersion();

    if (status === PriceStatus.EXPIRED) {
      return `价格版本: ${versionStr} [已过期，仅供参考]`;
    } else if (status === PriceStatus.EXPIRING_SOON) {
      return `价格版本: ${versionStr} [即将更新]`;
    }
    return `价格版本: ${versionStr}`;
  },

  /**
   * 应该显示警告横幅吗
   * @returns {boolean}
   */
  shouldShowBanner: () => {
    const status = getPriceStatus();
    return status === PriceStatus.EXPIRED || status === PriceStatus.EXPIRING_SOON;
  },

  /**
   * 记录价格使用（用于审计）
   * @param {string} action - 操作类型
   * @param {Object} details - 详细信息
   */
  logPriceUsage: (action, details = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: action,
      priceVersion: PRICE_VERSION.version,
      priceStatus: getPriceStatus(),
      details: details
    };

    // 存储到本地日志
    try {
      const logs = JSON.parse(localStorage.getItem('_priceUsageLogs') || '[]');
      logs.push(logEntry);

      // 保留最近100条
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }

      localStorage.setItem('_priceUsageLogs', JSON.stringify(logs));
    } catch (e) {
      // 忽略日志错误
    }

    return logEntry;
  }
};

/**
 * 价格警告组件的props生成器
 * @returns {Object} 适用于React组件的props
 */
export const getPriceWarningProps = () => {
  const warning = getPriceWarning();
  if (!warning) return null;

  return {
    show: true,
    variant: warning.level === 'error' ? 'danger' : 'warning',
    title: warning.title,
    message: warning.message,
    dismissible: warning.level !== 'error',
    action: warning.action,
    onAction: () => {
      // 可以在这里添加更新逻辑
      console.log('Price warning action clicked');
    }
  };
};

export default {
  PRICE_VERSION,
  PriceStatus,
  isPriceExpired,
  getDaysUntilExpiry,
  getPriceStatus,
  getPriceWarning,
  formatPriceVersion,
  checkPriceUpdate,
  PriceVersionManager,
  getPriceWarningProps
};
