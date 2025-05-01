// src/components/DataLoaderComponent.js
import { useEffect } from 'react'; 
import { adaptEnhancedData } from '../utils/dataAdapter';
import { mergeDataCollections } from '../utils/dataIntegration';
// 导入嵌入式数据
import { embeddedGearboxData, applyPriceUpdates } from '../data/embeddedData';
import { flexibleCouplings } from '../data/flexibleCouplings';

/**
 * 改进的数据加载器组件 - 简化版
 * 
 * 此组件会：
 * 1. 直接使用嵌入式数据作为基础数据
 * 2. 适配数据格式
 * 3. 传递给应用
 */
const EnhancedDataLoader = ({ onDataLoaded, setLoading, setError }) => {
  useEffect(() => {
    // 立即设置加载状态
    setLoading(true);
    console.log('DataLoader: 开始加载数据...');
    
    try {
      // 1. 使用嵌入式数据作为基础 - 简化版本
      console.log('DataLoader: 使用嵌入式数据');
      if (!embeddedGearboxData) {
        throw new Error('嵌入式数据为空');
      }
      
      // 2. 合并联轴器数据
      console.log('DataLoader: 合并联轴器数据');
      const processedData = {
        ...embeddedGearboxData,
        flexibleCouplings: flexibleCouplings || []
      };
      
      // 3. 适配数据格式
      console.log('DataLoader: 适配数据');
      const adaptedData = adaptEnhancedData(processedData);
      
      // 4. 保存到本地存储
      try {
        localStorage.setItem('appData', JSON.stringify(adaptedData));
        console.log('DataLoader: 数据已保存到本地存储');
      } catch (storageError) {
        console.warn('DataLoader: 保存到本地存储失败', storageError);
      }
      
      // 5. 完成加载
      console.log('DataLoader: 数据加载完成');
      onDataLoaded(adaptedData);
      setLoading(false);
    } catch (error) {
      console.error('DataLoader: 数据加载失败', error);
      setError('数据加载失败：' + (error.message || '未知错误'));
      setLoading(false);
    }
  }, [onDataLoaded, setLoading, setError]);

  return null;
};

// 最小合法性验证
const validateDataCompleteness = (data) => {
  if (!data) return { valid: false, messages: ['数据为空'] };
  return { valid: true, messages: [] };
};

export default EnhancedDataLoader;