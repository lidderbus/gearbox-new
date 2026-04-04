import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPersistedData = useCallback(() => {
    try {
      const savedData = localStorage.getItem('appData');
      if (savedData) {
        setData(JSON.parse(savedData));
      }
    } catch (err) {
      setError('加载持久化数据失败');
    }
  }, []);

  const savePersistedData = useCallback((newData) => {
    try {
      localStorage.setItem('appData', JSON.stringify(newData));
    } catch (err) {
      setError('保存数据失败');
    }
  }, []);

  const ensureDataCollections = useCallback((d) => {
    if (!d) return {};
    const collections = ['gearboxes', 'couplings', 'prices'];
    collections.forEach(collection => {
      if (!d[collection]) {
        d[collection] = [];
      }
    });
    return d;
  }, []);

  const validateDataCompleteness = useCallback((d) => {
    if (!d) return false;
    return true;
  }, []);

  const updateAppData = useCallback((newData) => {
    setData(newData);
    try {
      localStorage.setItem('appData', JSON.stringify(newData));
    } catch (err) {
      setError('保存数据失败');
    }
  }, []);

  const resetToDefaultData = useCallback(() => {
    setData(null);
    localStorage.removeItem('appData');
  }, []);

  const checkDataIntegrity = useCallback(async () => {
    setLoading(true);
    try {
      const savedData = localStorage.getItem('appData');
      if (savedData) {
        setData(JSON.parse(savedData));
      }
    } catch (err) {
      setError('检查数据完整性失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItemPrice = useCallback((item) => {
    setData(prev => {
      if (!prev || !prev.prices) return prev;
      const updatedPrices = prev.prices.map(price =>
        price.id === item.id ? { ...price, ...item } : price
      );
      const newData = { ...prev, prices: updatedPrices };
      try { localStorage.setItem('appData', JSON.stringify(newData)); } catch {}
      return newData;
    });
  }, []);

  const updateCategory = useCallback((catKey) => {
    setData(prev => {
      if (!prev || !prev[catKey]) return prev;
      const newData = { ...prev, [catKey]: [...prev[catKey]] };
      try { localStorage.setItem('appData', JSON.stringify(newData)); } catch {}
      return newData;
    });
  }, []);

  const value = useMemo(() => ({
    data, setData, loading, setLoading, error, setError,
    loadPersistedData, savePersistedData, ensureDataCollections,
    validateDataCompleteness, updateAppData, resetToDefaultData,
    checkDataIntegrity, updateItemPrice, updateCategory
  }), [data, loading, error, loadPersistedData, savePersistedData,
    ensureDataCollections, validateDataCompleteness, updateAppData,
    resetToDefaultData, checkDataIntegrity, updateItemPrice, updateCategory]);

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
