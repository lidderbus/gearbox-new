/**
 * secureStorage 单元测试
 * 测试加密存储功能的正确性
 */

import { encryptData, decryptData, secureStorage, plainStorage, STORAGE_KEYS } from '../secureStorage';

describe('secureStorage - 加密存储工具', () => {
  // 每个测试前清空localStorage
  beforeEach(() => {
    localStorage.clear();
  });

  describe('加密和解密', () => {
    test('应该能正确加密和解密字符串', () => {
      const originalData = 'test string';
      const encrypted = encryptData(originalData);
      const decrypted = decryptData(encrypted);

      expect(decrypted).toBe(originalData);
      expect(encrypted).not.toBe(originalData); // 确保已加密
    });

    test('应该能正确加密和解密对象', () => {
      const originalData = {
        username: 'admin',
        role: 'ADMIN',
        timestamp: Date.now()
      };
      const encrypted = encryptData(originalData);
      const decrypted = decryptData(encrypted);

      expect(decrypted).toEqual(originalData);
    });

    test('应该能正确加密和解密数组', () => {
      const originalData = [1, 2, 3, { name: 'test' }, 'string'];
      const encrypted = encryptData(originalData);
      const decrypted = decryptData(encrypted);

      expect(decrypted).toEqual(originalData);
    });

    test('解密无效数据应该抛出错误', () => {
      expect(() => {
        decryptData('invalid encrypted data');
      }).toThrow();
    });
  });

  describe('SecureStorage 类', () => {
    test('setItem 应该能存储并加密数据', () => {
      const testData = { username: 'testUser', role: 'USER' };
      const result = secureStorage.setItem('testKey', testData);

      expect(result).toBe(true);
      const stored = localStorage.getItem('testKey');
      expect(stored).toBeTruthy();
      expect(stored).not.toContain('testUser'); // 确保已加密
    });

    test('getItem 应该能读取并解密数据', () => {
      const testData = { username: 'testUser', role: 'USER' };
      secureStorage.setItem('testKey', testData);

      const retrieved = secureStorage.getItem('testKey');
      expect(retrieved).toEqual(testData);
    });

    test('getItem 不存在的键应该返回默认值', () => {
      const defaultValue = { default: true };
      const result = secureStorage.getItem('nonexistent', defaultValue);

      expect(result).toEqual(defaultValue);
    });

    test('getItem 损坏的数据应该返回默认值并清除', () => {
      localStorage.setItem('corruptedKey', 'corrupted data');

      const defaultValue = null;
      const result = secureStorage.getItem('corruptedKey', defaultValue);

      expect(result).toBe(defaultValue);
      expect(localStorage.getItem('corruptedKey')).toBeNull();
    });

    test('removeItem 应该删除存储项', () => {
      secureStorage.setItem('testKey', { data: 'test' });
      secureStorage.removeItem('testKey');

      expect(localStorage.getItem('testKey')).toBeNull();
    });

    test('clear 应该清空所有存储', () => {
      secureStorage.setItem('key1', 'data1');
      secureStorage.setItem('key2', 'data2');

      secureStorage.clear();

      expect(localStorage.length).toBe(0);
    });

    test('hasItem 应该正确检查键是否存在', () => {
      expect(secureStorage.hasItem('testKey')).toBe(false);

      secureStorage.setItem('testKey', 'data');
      expect(secureStorage.hasItem('testKey')).toBe(true);
    });

    test('keys 应该返回所有键名', () => {
      secureStorage.setItem('key1', 'data1');
      secureStorage.setItem('key2', 'data2');

      const keys = secureStorage.keys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
    });
  });

  describe('PlainStorage 类', () => {
    test('应该能存储和读取未加密的数据', () => {
      const testData = { theme: 'dark' };
      plainStorage.setItem('theme', testData);

      const retrieved = plainStorage.getItem('theme');
      expect(retrieved).toEqual(testData);

      // 验证未加密（可以直接解析JSON）
      const stored = localStorage.getItem('theme');
      expect(JSON.parse(stored)).toEqual(testData);
    });
  });

  describe('STORAGE_KEYS 常量', () => {
    test('应该定义必要的存储键', () => {
      expect(STORAGE_KEYS.USER).toBe('user');
      expect(STORAGE_KEYS.AUTH_TOKEN).toBe('auth_token');
      expect(STORAGE_KEYS.THEME).toBe('theme');
    });
  });

  describe('边界情况', () => {
    test('应该能处理null值', () => {
      secureStorage.setItem('nullKey', null);
      const result = secureStorage.getItem('nullKey');
      expect(result).toBeNull();
    });

    test('应该能处理undefined值', () => {
      secureStorage.setItem('undefinedKey', undefined);
      const result = secureStorage.getItem('undefinedKey');
      expect(result).toBeUndefined();
    });

    test('应该能处理空字符串', () => {
      secureStorage.setItem('emptyKey', '');
      const result = secureStorage.getItem('emptyKey');
      expect(result).toBe('');
    });

    test('应该能处理大型对象', () => {
      const largeData = {
        array: Array.from({ length: 1000 }, (_, i) => ({ id: i, value: `item-${i}` }))
      };

      secureStorage.setItem('largeKey', largeData);
      const result = secureStorage.getItem('largeKey');

      expect(result).toEqual(largeData);
    });
  });
});
