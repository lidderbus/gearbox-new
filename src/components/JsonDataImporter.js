// src/components/JsonDataImporter.js
import React, { useState, useCallback, useEffect } from 'react';

/**
 * JSON数据导入组件
 * 
 * 直接从前端导入JSON数据到系统中，支持数据合并、验证和适配
 */
function JsonDataImporter() {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [importStats, setImportStats] = useState(null);
  const [progress, setProgress] = useState(0);

  // 集合名称映射
  const collectionNames = {
    'hcGearboxes': 'HC系列齿轮箱',
    'gwGearboxes': 'GW系列齿轮箱',
    'hcmGearboxes': 'HCM系列齿轮箱',
    'dtGearboxes': 'DT系列齿轮箱',
    'hcqGearboxes': 'HCQ系列齿轮箱',
    'gcGearboxes': 'GC系列齿轮箱',
    'flexibleCouplings': '高弹性联轴器',
    'standbyPumps': '备用泵'
  };

  // 实时加载 gearbox-data.json 数据
  useEffect(() => {
    // 这里我们假设gearbox-data.json可以直接从前端访问
    const loadData = async () => {
      try {
        setLoading(true);
        setStatus({ type: 'info', message: '正在加载数据...' });
        
        // 使用fetch API加载JSON数据
        const response = await fetch('gearbox-data.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setJsonData(data);
        
        // 计算数据统计信息
        const stats = calculateDataStats(data);
        setImportStats(stats);
        
        setStatus({ type: 'success', message: '数据加载成功，准备导入' });
      } catch (error) {
        console.error('加载数据失败:', error);
        setStatus({ type: 'error', message: `加载数据失败: ${error.message}` });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // 计算数据统计信息
  const calculateDataStats = (data) => {
    if (!data) return null;
    
    const stats = {
      totalItems: 0,
      collections: {}
    };
    
    // 遍历所有数据集合
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        stats.collections[key] = data[key].length;
        stats.totalItems += data[key].length;
      }
    });
    
    return stats;
  };

  // 数据预处理
  const preprocessData = (data) => {
    // 深拷贝数据
    const processedData = JSON.parse(JSON.stringify(data));
    
    // 遍历所有集合
    Object.keys(processedData).forEach(key => {
      if (Array.isArray(processedData[key])) {
        // 处理每个集合中的项目
        processedData[key] = processedData[key].map(item => {
          // 确保基础价格存在
          if (!item.basePrice && item.price) {
            item.basePrice = item.price;
          }
          
          // 确保折扣率存在
          if (item.discountRate === undefined) {
            // 根据型号设置默认折扣率
            if (item.model?.startsWith('HC')) {
              item.discountRate = 0.16;
            } else if (item.model?.startsWith('GW')) {
              item.discountRate = 0.10;
            } else if (item.model?.startsWith('DT')) {
              item.discountRate = 0.10;
            } else {
              item.discountRate = 0.10; // 默认折扣率
            }
          }
          
          // 确保工厂价格存在
          if (!item.factoryPrice && item.basePrice && item.discountRate !== undefined) {
            item.factoryPrice = Math.round(item.basePrice * (1 - item.discountRate));
          }
          
          // 确保市场价格存在
          if (!item.marketPrice && item.factoryPrice) {
            // 设置一个基于型号的加成率
            let markup = 1.12; // 默认加成率
            
            if (item.model?.startsWith('GW')) {
              markup = 1.15; // GW系列加成率
            } else if (item.model?.startsWith('HCM')) {
              markup = 1.20; // HCM系列加成率
            } else if (item.model?.startsWith('DT')) {
              markup = 1.18; // DT系列加成率
            }
            
            item.marketPrice = Math.round(item.factoryPrice * markup);
          }
          
          return item;
        });
      }
    });
    
    return processedData;
  };

  // 执行导入操作
  const handleImport = useCallback(async () => {
    if (!jsonData) {
      setStatus({ type: 'error', message: '没有数据可导入' });
      return;
    }
    
    setLoading(true);
    setProgress(10);
    setStatus({ type: 'info', message: '正在处理数据...' });
    
    try {
      // 1. 预处理数据
      setProgress(30);
      const processedData = preprocessData(jsonData);
      
      // 2. 从localStorage加载现有数据
      setProgress(50);
      let existingData = {};
      try {
        const storedData = localStorage.getItem('appData');
        if (storedData) {
          existingData = JSON.parse(storedData);
        }
      } catch (error) {
        console.warn('从localStorage加载数据失败:', error);
      }
      
      // 3. 合并数据
      setProgress(70);
      setStatus({ type: 'info', message: '正在合并数据...' });
      
      const mergedData = { ...existingData };
      
      // 遍历所有集合
      Object.keys(processedData).forEach(key => {
        if (Array.isArray(processedData[key])) {
          if (!mergedData[key]) {
            mergedData[key] = [];
          }
          
          // 获取现有型号的集合（用于去重）
          const existingModels = new Set(mergedData[key].map(item => item.model));
          
          // 添加不重复的项目
          processedData[key].forEach(item => {
            if (item.model && !existingModels.has(item.model)) {
              mergedData[key].push(item);
              existingModels.add(item.model);
            }
          });
        }
      });
      
      // 4. 保存合并后的数据
      setProgress(90);
      try {
        localStorage.setItem('appData', JSON.stringify(mergedData));
        
        // 计算导入统计信息
        const importStats = calculateDataStats(mergedData);
        setImportStats(importStats);
        
        setStatus({ 
          type: 'success', 
          message: `数据导入成功！共导入 ${importStats.totalItems} 项数据。` 
        });
      } catch (error) {
        throw new Error(`保存数据失败: ${error.message}`);
      }
      
      setProgress(100);
      
    } catch (error) {
      console.error('导入数据失败:', error);
      setStatus({ type: 'error', message: `导入失败: ${error.message}` });
    } finally {
      setLoading(false);
    }
  }, [jsonData]);

  // 渲染集合统计
  const renderCollectionStats = () => {
    if (!importStats) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {Object.entries(importStats.collections).map(([key, count]) => (
          <div key={key} className="bg-white rounded-lg shadow p-4 text-center">
            <h3 className="text-lg font-medium text-gray-800">{collectionNames[key] || key}</h3>
            <div className={`text-3xl font-bold mt-2 ${count > 0 ? 'text-green-600' : 'text-gray-400'}`}>
              {count}
            </div>
            <div className="text-sm text-gray-500">项</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">船用齿轮箱数据导入工具</h2>
      
      {/* 状态消息 */}
      {status.message && (
        <div className={`mb-6 p-4 rounded-lg ${
          status.type === 'error' ? 'bg-red-100 text-red-800' : 
          status.type === 'success' ? 'bg-green-100 text-green-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {status.type === 'error' && <span className="font-bold">错误：</span>}
          {status.type === 'success' && <span className="font-bold">成功：</span>}
          {status.message}
        </div>
      )}
      
      {/* 进度条 */}
      {loading && (
        <div className="mb-6">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600 text-center">{progress}%</div>
        </div>
      )}
      
      {/* 操作按钮 */}
      <div className="mb-6">
        <button
          onClick={handleImport}
          disabled={loading || !jsonData}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white ${
            loading || !jsonData
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? '处理中...' : jsonData ? '导入数据' : '加载数据中...'}
        </button>
      </div>
      
      {/* 统计信息 */}
      {renderCollectionStats()}
      
      {/* 提示信息 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-2">说明：</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>本工具将自动加载并导入船用齿轮箱数据</li>
          <li>导入数据会与现有数据合并，以型号为唯一标识符去重</li>
          <li>数据将自动处理价格信息，包括基础价格、折扣率、工厂价和市场价</li>
          <li>所有数据将保存在浏览器本地存储中，刷新页面不会丢失</li>
        </ul>
      </div>
    </div>
  );
}

export default JsonDataImporter;