/**
 * 安全存储工具 - 提供加密的 localStorage 访问
 *
 * 功能：
 * - AES加密/解密数据
 * - 自动处理序列化/反序列化
 * - 错误处理和降级方案
 * - 类型安全的存储操作
 */

import CryptoJS from 'crypto-js';

// 从环境变量获取加密密钥
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'default-dev-key-change-in-production';

// 开发环境警告
if (process.env.NODE_ENV === 'development' && ENCRYPTION_KEY === 'default-dev-key-change-in-production') {
  console.warn('⚠️ 警告: 使用默认加密密钥，请在 .env 文件中设置 REACT_APP_ENCRYPTION_KEY');
}

/**
 * 加密数据
 * @param {any} data - 要加密的数据
 * @returns {string} 加密后的字符串
 */
export function encryptData(data) {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('数据加密失败:', error);
    throw new Error('数据加密失败');
  }
}

/**
 * 解密数据
 * @param {string} encryptedData - 加密的数据字符串
 * @returns {any} 解密后的数据
 */
export function decryptData(encryptedData) {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);

    if (!jsonString) {
      throw new Error('解密结果为空');
    }

    return JSON.parse(jsonString);
  } catch (error) {
    console.error('数据解密失败:', error);
    throw new Error('数据解密失败');
  }
}

/**
 * 安全存储类 - 提供加密的 localStorage API
 */
class SecureStorage {
  /**
   * 加密并存储数据
   * @param {string} key - 存储键名
   * @param {any} value - 要存储的值
   * @returns {boolean} 是否成功
   */
  setItem(key, value) {
    try {
      const encrypted = encryptData(value);
      localStorage.setItem(key, encrypted);
      return true;
    } catch (error) {
      console.error(`安全存储失败 [${key}]:`, error);
      return false;
    }
  }

  /**
   * 读取并解密数据
   * @param {string} key - 存储键名
   * @param {any} defaultValue - 默认值（如果读取失败）
   * @returns {any} 解密后的数据或默认值
   */
  getItem(key, defaultValue = null) {
    try {
      const encrypted = localStorage.getItem(key);

      if (!encrypted) {
        return defaultValue;
      }

      return decryptData(encrypted);
    } catch (error) {
      console.error(`安全读取失败 [${key}]:`, error);
      // 如果解密失败，删除损坏的数据
      this.removeItem(key);
      return defaultValue;
    }
  }

  /**
   * 删除存储项
   * @param {string} key - 存储键名
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`删除存储项失败 [${key}]:`, error);
    }
  }

  /**
   * 清除所有存储
   */
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('清除存储失败:', error);
    }
  }

  /**
   * 检查键是否存在
   * @param {string} key - 存储键名
   * @returns {boolean}
   */
  hasItem(key) {
    return localStorage.getItem(key) !== null;
  }

  /**
   * 获取所有键名
   * @returns {string[]}
   */
  keys() {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('获取键名列表失败:', error);
      return [];
    }
  }
}

/**
 * 普通存储类 - 不加密的 localStorage 包装器
 * 用于非敏感数据（如UI设置）
 */
class PlainStorage {
  setItem(key, value) {
    try {
      const jsonString = JSON.stringify(value);
      localStorage.setItem(key, jsonString);
      return true;
    } catch (error) {
      console.error(`存储失败 [${key}]:`, error);
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    try {
      const jsonString = localStorage.getItem(key);

      if (!jsonString) {
        return defaultValue;
      }

      return JSON.parse(jsonString);
    } catch (error) {
      console.error(`读取失败 [${key}]:`, error);
      return defaultValue;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`删除失败 [${key}]:`, error);
    }
  }

  clear() {
    localStorage.clear();
  }

  hasItem(key) {
    return localStorage.getItem(key) !== null;
  }
}

// 导出单例实例
export const secureStorage = new SecureStorage();
export const plainStorage = new PlainStorage();

// 存储键名常量 - 集中管理
export const STORAGE_KEYS = {
  // 敏感数据 - 使用加密存储
  USER: 'user',
  AUTH_TOKEN: 'auth_token',

  // 非敏感数据 - 可使用普通存储
  THEME: 'theme',
  LANGUAGE: 'language',
  UI_SETTINGS: 'ui_settings',

  // 业务数据
  QUOTATION_HISTORY: 'quotation_history',
  SELECTION_HISTORY: 'selection_history',
  PRICE_HISTORY: 'price_history',
};

/**
 * 迁移旧数据到加密存储
 * 用于从明文localStorage迁移到加密存储
 */
export function migrateToSecureStorage() {
  try {
    // 迁移用户数据
    const oldUser = localStorage.getItem('user');
    if (oldUser) {
      try {
        const userData = JSON.parse(oldUser);
        secureStorage.setItem(STORAGE_KEYS.USER, userData);
        localStorage.removeItem('user'); // 删除旧的明文数据
        console.log('✅ 用户数据已迁移到加密存储');
      } catch (e) {
        console.error('用户数据迁移失败:', e);
      }
    }

    // 清理旧的认证数据
    const oldKeys = ['gearbox_users', 'current_user'];
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });

    console.log('✅ 存储迁移完成');
  } catch (error) {
    console.error('存储迁移失败:', error);
  }
}

// 默认导出
export default secureStorage;
