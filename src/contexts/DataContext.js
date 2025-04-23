import React, { createContext, useState, useContext, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 加载持久化数据
  const loadPersistedData = () => {
    try {
      const savedData = localStorage.getItem('appData');
      if (savedData) {
        setData(JSON.parse(savedData));
      }
    } catch (err) {
      setError('加载持久化数据失败');
    }
  };

  // 保存数据到本地存储
  const savePersistedData = (newData) => {
    try {
      localStorage.setItem('appData', JSON.stringify(newData));
    } catch (err) {
      setError('保存数据失败');
    }
  };

  // 确保数据集合存在
  const ensureDataCollections = (data) => {
    if (!data) return {};
    const collections = ['gearboxes', 'couplings', 'prices'];
    collections.forEach(collection => {
      if (!data[collection]) {
        data[collection] = [];
      }
    });
    return data;
  };

  // 验证数据完整性
  const validateDataCompleteness = (data) => {
    if (!data) return false;
    return true;
  };

  // 更新应用数据
  const updateAppData = (newData) => {
    setData(newData);
    savePersistedData(newData);
  };

  // 重置为默认数据
  const resetToDefaultData = () => {
    setData(null);
    localStorage.removeItem('appData');
  };

  // 检查数据完整性
  const checkDataIntegrity = async () => {
    setLoading(true);
    try {
      if (!data) {
        loadPersistedData();
      }
      if (!validateDataCompleteness(data)) {
        setError('数据不完整');
      }
    } catch (err) {
      setError('检查数据完整性失败');
    } finally {
      setLoading(false);
    }
  };

  // 更新项目价格
  const updateItemPrice = (item) => {
    if (!data || !data.prices) return;
    const updatedPrices = data.prices.map(price => 
      price.id === item.id ? { ...price, ...item } : price
    );
    updateAppData({ ...data, prices: updatedPrices });
  };

  // 更新类别
  const updateCategory = (catKey) => {
    if (!data || !data[catKey]) return;
    updateAppData({ ...data, [catKey]: [...data[catKey]] });
  };

  const value = {
    data,
    setData,
    loading,
    setLoading,
    error,
    setError,
    loadPersistedData,
    savePersistedData,
    ensureDataCollections,
    validateDataCompleteness,
    updateAppData,
    resetToDefaultData,
    checkDataIntegrity,
    updateItemPrice,
    updateCategory
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within a DataProvider');
  }
  return context;
};

export default DataContext; 