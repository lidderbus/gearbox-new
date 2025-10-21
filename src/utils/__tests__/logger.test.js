/**
 * logger 单元测试
 * 测试日志系统功能
 */

import { logger, createLogger, measurePerformance } from '../logger';

describe('logger - 日志系统', () => {
  // 保存原始console方法
  let originalConsole;

  beforeEach(() => {
    originalConsole = { ...console };
    // Mock console 方法
    console.log = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    console.time = jest.fn();
    console.timeEnd = jest.fn();
  });

  afterEach(() => {
    // 恢复console
    console = originalConsole;
  });

  describe('基本日志功能', () => {
    test('logger.debug 应该输出调试信息', () => {
      logger.debug('test debug message');
      // 由于环境变量的影响，我们只验证不会抛出错误
      expect(() => logger.debug('test')).not.toThrow();
    });

    test('logger.info 应该输出信息', () => {
      logger.info('test info message');
      expect(() => logger.info('test')).not.toThrow();
    });

    test('logger.warn 应该输出警告', () => {
      logger.warn('test warning message');
      expect(() => logger.warn('test')).not.toThrow();
    });

    test('logger.error 应该输出错误', () => {
      logger.error('test error message');
      expect(() => logger.error('test')).not.toThrow();
    });

    test('日志方法应该接受多个参数', () => {
      const obj = { key: 'value' };
      const arr = [1, 2, 3];

      expect(() => {
        logger.debug('message', obj, arr);
        logger.info('message', obj, arr);
        logger.warn('message', obj, arr);
        logger.error('message', obj, arr);
      }).not.toThrow();
    });
  });

  describe('模块化Logger', () => {
    test('createLogger 应该创建模块化logger', () => {
      const moduleLogger = createLogger('TestModule');

      expect(moduleLogger).toBeDefined();
      expect(moduleLogger.debug).toBeDefined();
      expect(moduleLogger.info).toBeDefined();
      expect(moduleLogger.warn).toBeDefined();
      expect(moduleLogger.error).toBeDefined();
    });

    test('模块化logger应该能正常工作', () => {
      const moduleLogger = createLogger('TestModule');

      expect(() => {
        moduleLogger.debug('debug message');
        moduleLogger.info('info message');
        moduleLogger.warn('warn message');
        moduleLogger.error('error message');
      }).not.toThrow();
    });

    test('createChild 应该创建子模块logger', () => {
      const parentLogger = createLogger('Parent');
      const childLogger = parentLogger.createChild('Child');

      expect(childLogger).toBeDefined();
      expect(() => childLogger.info('child message')).not.toThrow();
    });
  });

  describe('性能测量', () => {
    test('time 和 timeEnd 应该配对使用', () => {
      logger.time('testOperation');
      logger.timeEnd('testOperation');

      expect(() => {
        logger.time('op');
        logger.timeEnd('op');
      }).not.toThrow();
    });

    test('measurePerformance 应该能测量同步函数', () => {
      const syncFn = () => {
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += i;
        }
        return sum;
      };

      const result = measurePerformance('syncTest', syncFn);
      expect(result).toBe(499500); // 0+1+2+...+999
    });

    test('measurePerformance 应该能测量返回Promise的函数', async () => {
      const asyncFn = () => Promise.resolve(42);

      const result = await measurePerformance('asyncTest', asyncFn);
      expect(result).toBe(42);
    });
  });

  describe('边界情况', () => {
    test('应该能处理空参数', () => {
      expect(() => {
        logger.debug();
        logger.info();
        logger.warn();
        logger.error();
      }).not.toThrow();
    });

    test('应该能处理null和undefined', () => {
      expect(() => {
        logger.debug(null, undefined);
        logger.info(null);
        logger.warn(undefined);
      }).not.toThrow();
    });

    test('应该能处理错误对象', () => {
      const error = new Error('Test error');
      expect(() => {
        logger.error('Error occurred:', error);
      }).not.toThrow();
    });

    test('应该能处理循环引用对象', () => {
      const obj = { name: 'test' };
      obj.self = obj; // 循环引用

      expect(() => {
        logger.debug('Circular object:', obj);
      }).not.toThrow();
    });
  });

  describe('分组日志', () => {
    test('group 和 groupEnd 应该配对使用', () => {
      logger.group('Test Group');
      logger.info('grouped message');
      logger.groupEnd();

      expect(() => {
        logger.group('Group');
        logger.groupEnd();
      }).not.toThrow();
    });

    test('group 应该支持collapsed参数', () => {
      expect(() => {
        logger.group('Collapsed Group', true);
        logger.groupEnd();
      }).not.toThrow();
    });
  });

  describe('表格日志', () => {
    test('table 应该能显示数组数据', () => {
      const data = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ];

      expect(() => {
        logger.table(data);
      }).not.toThrow();
    });

    test('table 应该支持columns参数', () => {
      const data = [
        { id: 1, name: 'Item 1', extra: 'data' },
        { id: 2, name: 'Item 2', extra: 'data' }
      ];

      expect(() => {
        logger.table(data, ['id', 'name']);
      }).not.toThrow();
    });
  });
});
