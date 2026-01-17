// src/utils/encryption.js
// 价格数据加密模块 - 防止开发者工具直接查看敏感价格信息

/**
 * 简单的字符串混淆算法（不依赖外部库）
 * 注意：这不是加密级别的安全，只是防止直接查看
 */

// 价格相关的敏感字段
const SENSITIVE_FIELDS = [
  'basePrice',
  'factoryPrice',
  'marketPrice',
  'agentPrice',
  'discountRate',
  'price',
  'costPrice'
];

// 混淆密钥（每个会话生成）
const getSessionKey = () => {
  let key = sessionStorage.getItem('_dk');
  if (!key) {
    // 生成简单的会话密钥
    key = Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
    sessionStorage.setItem('_dk', key);
  }
  return key;
};

/**
 * 简单的XOR混淆
 * @param {string} str - 原字符串
 * @param {string} key - 密钥
 * @returns {string} - 混淆后的字符串（base64编码）
 */
const xorObfuscate = (str, key) => {
  const result = [];
  for (let i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  // 转为base64以便存储
  return btoa(String.fromCharCode.apply(null, result));
};

/**
 * XOR解混淆
 * @param {string} encoded - 混淆后的字符串（base64）
 * @param {string} key - 密钥
 * @returns {string} - 原字符串
 */
const xorDeobfuscate = (encoded, key) => {
  try {
    const decoded = atob(encoded);
    const result = [];
    for (let i = 0; i < decoded.length; i++) {
      result.push(String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)));
    }
    return result.join('');
  } catch (e) {
    console.warn('encryption: 解混淆失败', e);
    return encoded;
  }
};

/**
 * 加密价格数据
 * @param {Object|Array} data - 要加密的数据
 * @param {Object} options - 选项
 * @returns {Object|Array} - 加密后的数据
 */
export const encryptPriceData = (data, options = {}) => {
  if (!data) return data;

  const key = getSessionKey();
  const fields = options.fields || SENSITIVE_FIELDS;

  // 深拷贝
  const encrypted = JSON.parse(JSON.stringify(data));

  const processObject = (obj) => {
    if (Array.isArray(obj)) {
      obj.forEach(processObject);
    } else if (obj && typeof obj === 'object') {
      fields.forEach(field => {
        if (obj[field] !== undefined && obj[field] !== null) {
          // 加密该字段
          const value = String(obj[field]);
          obj[`_enc_${field}`] = xorObfuscate(value, key);
          obj[`_enc_${field}_t`] = typeof obj[field]; // 保存原始类型
          delete obj[field];
        }
      });
      // 递归处理嵌套对象
      Object.values(obj).forEach(processObject);
    }
  };

  processObject(encrypted);
  encrypted._encrypted = true;
  encrypted._encryptedAt = Date.now();

  return encrypted;
};

/**
 * 解密价格数据
 * @param {Object|Array} data - 要解密的数据
 * @returns {Object|Array} - 解密后的数据
 */
export const decryptPriceData = (data) => {
  if (!data || !data._encrypted) return data;

  const key = getSessionKey();

  // 深拷贝
  const decrypted = JSON.parse(JSON.stringify(data));

  const processObject = (obj) => {
    if (Array.isArray(obj)) {
      obj.forEach(processObject);
    } else if (obj && typeof obj === 'object') {
      // 查找所有加密字段
      const encryptedKeys = Object.keys(obj).filter(k => k.startsWith('_enc_') && !k.endsWith('_t'));

      encryptedKeys.forEach(encKey => {
        const originalKey = encKey.replace('_enc_', '');
        const typeKey = `${encKey}_t`;
        const originalType = obj[typeKey] || 'number';

        try {
          const decryptedValue = xorDeobfuscate(obj[encKey], key);

          // 根据原始类型转换
          if (originalType === 'number') {
            obj[originalKey] = parseFloat(decryptedValue);
          } else {
            obj[originalKey] = decryptedValue;
          }

          delete obj[encKey];
          delete obj[typeKey];
        } catch (e) {
          console.warn(`encryption: 解密字段 ${originalKey} 失败`, e);
        }
      });

      // 递归处理嵌套对象
      Object.values(obj).forEach(processObject);
    }
  };

  processObject(decrypted);
  delete decrypted._encrypted;
  delete decrypted._encryptedAt;

  return decrypted;
};

/**
 * 检查数据是否已加密
 * @param {Object} data
 * @returns {boolean}
 */
export const isEncrypted = (data) => {
  return data && data._encrypted === true;
};

/**
 * 安全地显示价格（用于日志等）
 * @param {number} price - 价格
 * @returns {string} - 遮蔽后的价格
 */
export const maskPrice = (price) => {
  if (price === undefined || price === null) return '***';
  const str = String(Math.round(price));
  if (str.length <= 2) return '***';
  return str.substring(0, 1) + '*'.repeat(str.length - 2) + str.substring(str.length - 1);
};

/**
 * 价格数据保护器 - 用于在控制台等地方保护价格
 */
export const PriceProtector = {
  /**
   * 包装对象，使价格字段在控制台显示为遮蔽
   * @param {Object} obj
   * @returns {Proxy}
   */
  wrap: (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    return new Proxy(obj, {
      get(target, prop) {
        const value = target[prop];
        if (SENSITIVE_FIELDS.includes(prop) && typeof value === 'number') {
          // 返回一个特殊对象，toString时显示遮蔽值
          return {
            valueOf: () => value,
            toString: () => maskPrice(value),
            [Symbol.toPrimitive]: (hint) => hint === 'number' ? value : maskPrice(value),
            _protected: true,
            _actualValue: value
          };
        }
        return value;
      }
    });
  },

  /**
   * 解包获取真实值
   * @param {any} value
   * @returns {any}
   */
  unwrap: (value) => {
    if (value && value._protected) {
      return value._actualValue;
    }
    return value;
  }
};

/**
 * 加密配置
 */
export const EncryptionConfig = {
  // 是否启用加密
  enabled: true,

  // 敏感字段列表
  sensitiveFields: SENSITIVE_FIELDS,

  // 添加自定义敏感字段
  addSensitiveField: (field) => {
    if (!SENSITIVE_FIELDS.includes(field)) {
      SENSITIVE_FIELDS.push(field);
    }
  },

  // 移除敏感字段
  removeSensitiveField: (field) => {
    const index = SENSITIVE_FIELDS.indexOf(field);
    if (index > -1) {
      SENSITIVE_FIELDS.splice(index, 1);
    }
  }
};

export default {
  encryptPriceData,
  decryptPriceData,
  isEncrypted,
  maskPrice,
  PriceProtector,
  EncryptionConfig
};
