/**
 * 日志工具 - 替代 console.log
 *
 * 功能：
 * - 根据环境和配置控制日志输出
 * - 支持多种日志级别
 * - 生产环境自动禁用调试日志
 * - 提供统一的日志格式
 * - 可扩展到远程日志服务
 */

// 日志级别常量
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

// 日志级别名称映射
const LEVEL_NAMES = {
  0: 'DEBUG',
  1: 'INFO',
  2: 'WARN',
  3: 'ERROR',
  4: 'NONE',
};

// 日志级别颜色（浏览器控制台）
const LEVEL_COLORS = {
  DEBUG: '#6366f1', // 蓝紫色
  INFO: '#3b82f6',  // 蓝色
  WARN: '#f59e0b',  // 橙色
  ERROR: '#ef4444', // 红色
};

/**
 * 获取当前日志级别
 */
function getCurrentLogLevel() {
  const envLevel = process.env.REACT_APP_LOG_LEVEL;
  const enableInProduction = process.env.REACT_APP_ENABLE_LOGGING_IN_PRODUCTION === 'true';
  const isProduction = process.env.NODE_ENV === 'production';

  // 生产环境默认只显示错误
  if (isProduction && !enableInProduction) {
    return LOG_LEVELS.ERROR;
  }

  // 根据配置设置日志级别
  switch (envLevel?.toLowerCase()) {
    case 'debug':
      return LOG_LEVELS.DEBUG;
    case 'info':
      return LOG_LEVELS.INFO;
    case 'warn':
      return LOG_LEVELS.WARN;
    case 'error':
      return LOG_LEVELS.ERROR;
    case 'none':
      return LOG_LEVELS.NONE;
    default:
      return isProduction ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG;
  }
}

const currentLogLevel = getCurrentLogLevel();

/**
 * 格式化日志消息
 */
function formatMessage(level, module, ...args) {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const moduleStr = module ? `[${module}]` : '';
  return [`[${timestamp}] ${LEVEL_NAMES[level]} ${moduleStr}`, ...args];
}

/**
 * 判断是否应该输出日志
 */
function shouldLog(level) {
  return level >= currentLogLevel;
}

/**
 * Logger类 - 提供模块化日志记录
 */
class Logger {
  constructor(moduleName = '') {
    this.moduleName = moduleName;
  }

  /**
   * 调试日志 - 仅开发环境
   */
  debug(...args) {
    if (shouldLog(LOG_LEVELS.DEBUG)) {
      const msg = formatMessage(LOG_LEVELS.DEBUG, this.moduleName, ...args);
      console.log(`%c${msg[0]}`, `color: ${LEVEL_COLORS.DEBUG}`, ...msg.slice(1));
    }
  }

  /**
   * 信息日志
   */
  info(...args) {
    if (shouldLog(LOG_LEVELS.INFO)) {
      const msg = formatMessage(LOG_LEVELS.INFO, this.moduleName, ...args);
      console.info(`%c${msg[0]}`, `color: ${LEVEL_COLORS.INFO}`, ...msg.slice(1));
    }
  }

  /**
   * 警告日志
   */
  warn(...args) {
    if (shouldLog(LOG_LEVELS.WARN)) {
      const msg = formatMessage(LOG_LEVELS.WARN, this.moduleName, ...args);
      console.warn(`%c${msg[0]}`, `color: ${LEVEL_COLORS.WARN}`, ...msg.slice(1));
    }
  }

  /**
   * 错误日志 - 总是输出
   */
  error(...args) {
    if (shouldLog(LOG_LEVELS.ERROR)) {
      const msg = formatMessage(LOG_LEVELS.ERROR, this.moduleName, ...args);
      console.error(`%c${msg[0]}`, `color: ${LEVEL_COLORS.ERROR}`, ...msg.slice(1));

      // 可以在这里添加错误上报逻辑
      // this.reportToSentry(args);
    }
  }

  /**
   * 性能日志
   */
  time(label) {
    if (shouldLog(LOG_LEVELS.DEBUG)) {
      console.time(`⏱️ ${this.moduleName ? `[${this.moduleName}] ` : ''}${label}`);
    }
  }

  timeEnd(label) {
    if (shouldLog(LOG_LEVELS.DEBUG)) {
      console.timeEnd(`⏱️ ${this.moduleName ? `[${this.moduleName}] ` : ''}${label}`);
    }
  }

  /**
   * 表格日志
   */
  table(data, columns) {
    if (shouldLog(LOG_LEVELS.DEBUG)) {
      console.table(data, columns);
    }
  }

  /**
   * 分组日志
   */
  group(label, collapsed = false) {
    if (shouldLog(LOG_LEVELS.DEBUG)) {
      const method = collapsed ? 'groupCollapsed' : 'group';
      console[method](`${this.moduleName ? `[${this.moduleName}] ` : ''}${label}`);
    }
  }

  groupEnd() {
    if (shouldLog(LOG_LEVELS.DEBUG)) {
      console.groupEnd();
    }
  }

  /**
   * 创建子模块logger
   */
  createChild(subModuleName) {
    const childName = this.moduleName
      ? `${this.moduleName}.${subModuleName}`
      : subModuleName;
    return new Logger(childName);
  }
}

/**
 * 默认logger实例
 */
export const logger = new Logger();

/**
 * 创建模块化logger
 * @param {string} moduleName - 模块名称
 * @returns {Logger}
 *
 * @example
 * const log = createLogger('SelectionAlgorithm');
 * log.debug('开始选型计算', { power: 500, speed: 1800 });
 * log.error('选型失败', error);
 */
export function createLogger(moduleName) {
  return new Logger(moduleName);
}

/**
 * 快捷日志函数 - 用于替换现有的 console.log
 */
export const log = {
  debug: (...args) => logger.debug(...args),
  info: (...args) => logger.info(...args),
  warn: (...args) => logger.warn(...args),
  error: (...args) => logger.error(...args),
  time: (label) => logger.time(label),
  timeEnd: (label) => logger.timeEnd(label),
  table: (data, columns) => logger.table(data, columns),
  group: (label, collapsed) => logger.group(label, collapsed),
  groupEnd: () => logger.groupEnd(),
};

/**
 * 性能监控辅助函数
 */
export function measurePerformance(name, fn) {
  if (shouldLog(LOG_LEVELS.DEBUG)) {
    logger.time(name);
    try {
      const result = fn();
      if (result instanceof Promise) {
        return result.finally(() => logger.timeEnd(name));
      }
      logger.timeEnd(name);
      return result;
    } catch (error) {
      logger.timeEnd(name);
      throw error;
    }
  } else {
    return fn();
  }
}

/**
 * 异步性能监控
 */
export async function measureAsync(name, asyncFn) {
  if (shouldLog(LOG_LEVELS.DEBUG)) {
    logger.time(name);
    try {
      return await asyncFn();
    } finally {
      logger.timeEnd(name);
    }
  } else {
    return await asyncFn();
  }
}

/**
 * 开发环境断言
 */
export function devAssert(condition, message) {
  if (process.env.NODE_ENV === 'development' && !condition) {
    logger.error('断言失败:', message);
    throw new Error(`Assertion failed: ${message}`);
  }
}

// 默认导出
export default logger;

// 在开发环境显示日志配置信息
if (process.env.NODE_ENV === 'development') {
  console.log(
    `%c🔧 日志系统已初始化`,
    'color: #10b981; font-weight: bold',
    `\n级别: ${LEVEL_NAMES[currentLogLevel]}`,
    `\n环境: ${process.env.NODE_ENV}`
  );
}
