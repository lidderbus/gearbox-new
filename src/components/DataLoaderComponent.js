// src/components/DataLoaderComponent.js
// 性能优化: 使用动态导入实现数据懒加载，减少首屏加载时间
import { useEffect, useState } from 'react';
import { adaptEnhancedData } from '../utils/dataAdapter';
import { logger } from '../config/logging';

/**
 * 改进的数据加载器组件 - 懒加载版
 *
 * 性能优化:
 * - 使用动态import()按需加载大型数据文件
 * - 数据文件将被webpack分割成单独的chunk
 * - 首屏加载时间预计减少40-50%
 *
 * 此组件会：
 * 1. 动态加载嵌入式数据
 * 2. 适配数据格式
 * 3. 传递给应用
 */
const EnhancedDataLoader = ({ onDataLoaded, setLoading, setError }) => {
  const [loadingState, setLoadingState] = useState('idle');

  useEffect(() => {
    // 立即设置加载状态
    setLoading(true);
    setLoadingState('loading');
    logger.debug('DataLoader: 开始懒加载数据...');

    // 使用动态导入加载数据
    const loadData = async () => {
      try {
        const startTime = performance.now();

        // 1. 动态导入嵌入式数据 (webpackChunkName用于命名分割后的chunk)
        setLoadingState('loading-gearbox');
        logger.debug('DataLoader: 动态导入齿轮箱数据...');
        const { embeddedGearboxData } = await import(
          /* webpackChunkName: "gearbox-data" */
          '../data/embeddedData'
        );

        if (!embeddedGearboxData) {
          throw new Error('嵌入式数据为空');
        }

        // 2. 动态导入联轴器数据
        setLoadingState('loading-couplings');
        logger.debug('DataLoader: 动态导入联轴器数据...');
        const { flexibleCouplings } = await import(
          /* webpackChunkName: "coupling-data" */
          '../data/flexibleCouplings'
        );

        // 3. 合并数据
        setLoadingState('merging');
        logger.debug('DataLoader: 合并数据');
        const processedData = {
          ...embeddedGearboxData,
          flexibleCouplings: flexibleCouplings || []
        };

        // 4. 适配数据格式
        setLoadingState('adapting');
        logger.debug('DataLoader: 适配数据');
        const adaptedData = adaptEnhancedData(processedData);

        // 5. 保存到本地存储
        try {
          localStorage.setItem('appData', JSON.stringify(adaptedData));
          logger.debug('DataLoader: 数据已保存到本地存储');
        } catch (storageError) {
          logger.warn('DataLoader: 保存到本地存储失败', storageError);
        }

        const loadTime = performance.now() - startTime;
        logger.log(`DataLoader: 数据懒加载完成, 耗时${loadTime.toFixed(0)}ms`);

        // 6. 完成加载
        setLoadingState('complete');
        onDataLoaded(adaptedData);
        setLoading(false);
      } catch (error) {
        logger.error('DataLoader: 数据加载失败', error);
        setLoadingState('error');
        setError('数据加载失败：' + (error.message || '未知错误'));
        setLoading(false);
      }
    };

    loadData();
  }, [onDataLoaded, setLoading, setError]);

  return null;
};

// 最小合法性验证
const validateDataCompleteness = (data) => {
  if (!data) return { valid: false, messages: ['数据为空'] };
  return { valid: true, messages: [] };
};

export default EnhancedDataLoader;