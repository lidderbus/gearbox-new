// src/utils/analytics.js
// 简单的本地使用分析 - 完全离线，数据仅存储在用户本地
// 非侵入式设计：即使此模块出错也不影响主功能

const STORAGE_KEY = '_gearbox_analytics';
const MAX_EVENTS = 500; // 最多保留500条记录

/**
 * 预定义的事件类型
 */
export const EVENTS = {
  // 页面访问
  PAGE_VIEW: 'page_view',

  // 选型相关
  SELECTION_START: 'selection_start',
  SELECTION_COMPLETE: 'selection_complete',
  SELECTION_ERROR: 'selection_error',

  // 报价相关
  QUOTATION_CREATE: 'quotation_create',
  QUOTATION_EXPORT: 'quotation_export',

  // 协议相关
  AGREEMENT_CREATE: 'agreement_create',
  AGREEMENT_EXPORT: 'agreement_export',

  // 数据查询
  DATA_QUERY: 'data_query',
  DATA_EXPORT: 'data_export',

  // 功能使用
  FEATURE_USE: 'feature_use',

  // 错误
  ERROR: 'error'
};

/**
 * 获取或创建会话ID
 */
const getSessionId = () => {
  try {
    let sid = sessionStorage.getItem('_analytics_sid');
    if (!sid) {
      sid = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem('_analytics_sid', sid);
    }
    return sid;
  } catch (e) {
    return 'unknown';
  }
};

/**
 * 获取设备信息（简化版）
 */
const getDeviceInfo = () => {
  try {
    const ua = navigator.userAgent;
    return {
      isMobile: /Mobile|Android|iPhone/i.test(ua),
      browser: /Chrome/i.test(ua) ? 'Chrome' :
               /Firefox/i.test(ua) ? 'Firefox' :
               /Safari/i.test(ua) ? 'Safari' : 'Other',
      screen: `${window.screen.width}x${window.screen.height}`
    };
  } catch (e) {
    return { isMobile: false, browser: 'unknown', screen: 'unknown' };
  }
};

/**
 * 分析模块
 */
export const Analytics = {
  /**
   * 记录事件
   * @param {string} event - 事件名称
   * @param {Object} data - 事件数据
   */
  track: (event, data = {}) => {
    try {
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        event,
        data,
        timestamp: Date.now(),
        datetime: new Date().toISOString(),
        sessionId: getSessionId(),
        path: window.location.pathname
      };

      // 获取现有记录
      const events = Analytics.getEvents();
      events.push(entry);

      // 保留最近的记录
      if (events.length > MAX_EVENTS) {
        events.splice(0, events.length - MAX_EVENTS);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));

      // 开发模式下打印
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics]', event, data);
      }

      return entry;
    } catch (e) {
      // 静默失败，不影响主功能
      console.warn('Analytics track failed:', e);
      return null;
    }
  },

  /**
   * 获取所有事件
   */
  getEvents: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  },

  /**
   * 获取统计摘要
   */
  getSummary: () => {
    try {
      const events = Analytics.getEvents();
      const now = Date.now();
      const day = 24 * 60 * 60 * 1000;
      const week = 7 * day;
      const month = 30 * day;

      // 按事件类型统计
      const byEvent = {};
      const sessions = new Set();
      const todaySessions = new Set();
      const weekSessions = new Set();

      events.forEach(e => {
        // 事件计数
        byEvent[e.event] = (byEvent[e.event] || 0) + 1;

        // 会话统计
        sessions.add(e.sessionId);
        if (now - e.timestamp < day) {
          todaySessions.add(e.sessionId);
        }
        if (now - e.timestamp < week) {
          weekSessions.add(e.sessionId);
        }
      });

      // 最近7天每日事件数
      const dailyEvents = [];
      for (let i = 6; i >= 0; i--) {
        const dayStart = now - (i + 1) * day;
        const dayEnd = now - i * day;
        const count = events.filter(e => e.timestamp >= dayStart && e.timestamp < dayEnd).length;
        dailyEvents.push({
          date: new Date(dayEnd).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
          count
        });
      }

      return {
        totalEvents: events.length,
        totalSessions: sessions.size,
        todaySessions: todaySessions.size,
        weeklySessions: weekSessions.size,
        byEvent,
        dailyEvents,
        device: getDeviceInfo(),
        lastEvent: events.length > 0 ? events[events.length - 1] : null
      };
    } catch (e) {
      return { error: e.message };
    }
  },

  /**
   * 获取使用报告（用于显示给用户或管理员）
   */
  getReport: () => {
    const summary = Analytics.getSummary();
    if (summary.error) return summary;

    return {
      overview: {
        总事件数: summary.totalEvents,
        总会话数: summary.totalSessions,
        今日会话: summary.todaySessions,
        本周会话: summary.weeklySessions
      },
      topFeatures: Object.entries(summary.byEvent)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([event, count]) => ({ 功能: event, 使用次数: count })),
      weeklyTrend: summary.dailyEvents,
      device: summary.device
    };
  },

  /**
   * 清除所有数据
   */
  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * 导出数据（JSON格式）
   */
  export: () => {
    try {
      const events = Analytics.getEvents();
      return JSON.stringify({
        exportedAt: new Date().toISOString(),
        totalEvents: events.length,
        events
      }, null, 2);
    } catch (e) {
      return null;
    }
  }
};

/**
 * 便捷的追踪函数
 */
export const trackPageView = (pageName) => {
  Analytics.track(EVENTS.PAGE_VIEW, { page: pageName });
};

export const trackSelection = (params, results) => {
  Analytics.track(EVENTS.SELECTION_COMPLETE, {
    power: params.power,
    speed: params.speed,
    ratio: params.ratio,
    resultCount: results?.length || 0,
    topModel: results?.[0]?.model || null
  });
};

export const trackQuotation = (action, details = {}) => {
  Analytics.track(action === 'create' ? EVENTS.QUOTATION_CREATE : EVENTS.QUOTATION_EXPORT, details);
};

export const trackError = (error, context = {}) => {
  Analytics.track(EVENTS.ERROR, {
    message: error?.message || String(error),
    stack: error?.stack?.substring(0, 200),
    ...context
  });
};

export const trackFeature = (featureName, details = {}) => {
  Analytics.track(EVENTS.FEATURE_USE, { feature: featureName, ...details });
};

export default Analytics;
