// src/components/ProductCenter/useProductFilter.js
// 产品筛选逻辑Hook

import { useState, useMemo, useCallback } from 'react';

// 系列配置 (注意: 更具体的前缀必须放在前面!)
// 例如: HCD/HCM/HCT 必须在 HC 之前，否则 'HCD400'.startsWith('HC') 会错误匹配
export const SERIES_CONFIG = [
  { key: 'hcm', label: 'HCM系列', prefix: ['HCM'] },
  { key: 'hcd', label: 'HCD系列', prefix: ['HCD', 'HCDS'] },
  { key: 'hct', label: 'HCT系列', prefix: ['HCT'] },
  { key: 'hcq', label: 'HCQ系列', prefix: ['HCQ'] },
  { key: 'hca', label: 'HCA系列', prefix: ['HCA'] },
  { key: 'hcv', label: 'HCV系列', prefix: ['HCV'] },
  { key: 'hcl', label: 'HCL系列', prefix: ['HCL'] },
  { key: 'hcg', label: 'HCG系列', prefix: ['HCG'] },
  { key: 'hcs', label: 'HCS系列', prefix: ['HCS'] },
  { key: 'hc', label: 'HC系列', prefix: ['HC', '40', '120', 'MB'] },  // 放在HC*系列最后
  { key: 'gw', label: 'GW系列', prefix: ['GW', '2GW'] },
  { key: 'gc', label: 'GC系列', prefix: ['GC', 'GCS', 'GCH', 'GCHE', 'GCHT'] },
  { key: 'dt', label: 'DT系列', prefix: ['DT', 'D3', 'T3'] },
  { key: 'mv', label: 'MV系列', prefix: ['MV', 'MA', 'MB'] },
  { key: 'other', label: '其他系列', prefix: [] }
];

// 默认筛选条件
const DEFAULT_FILTERS = {
  searchText: '',
  series: [],           // 选中的系列key
  powerRange: [0, 3000],
  speedRange: [0, 4000],
  ratioRange: [1, 10],
  interfaceType: '全部', // '全部' | 'sae' | 'domestic'
  interfaceSpec: '',
  priceRange: [0, 500000],
  hasPrice: false,      // 仅显示有价格的
  sortBy: 'model',
  sortOrder: 'asc'
};

// 排序选项
export const SORT_OPTIONS = [
  { value: 'model', label: '型号 (A-Z)' },
  { value: 'model-desc', label: '型号 (Z-A)' },
  { value: 'power-asc', label: '功率 (低→高)' },
  { value: 'power-desc', label: '功率 (高→低)' },
  { value: 'price-asc', label: '价格 (低→高)' },
  { value: 'price-desc', label: '价格 (高→低)' },
  { value: 'weight-asc', label: '重量 (轻→重)' },
  { value: 'weight-desc', label: '重量 (重→轻)' }
];

// 判断型号属于哪个系列
function getSeriesKey(model) {
  const upperModel = (model || '').toUpperCase();
  for (const series of SERIES_CONFIG) {
    if (series.prefix.length === 0) continue;
    for (const prefix of series.prefix) {
      if (upperModel.startsWith(prefix.toUpperCase())) {
        return series.key;
      }
    }
  }
  return 'other';
}

// 计算功率范围 (基于传递能力和转速)
function getPowerRange(product) {
  const capacities = product.transferCapacity || product.transmissionCapacityPerRatio || [];
  const speeds = product.inputSpeedRange || [1000, 2000];

  if (capacities.length === 0) {
    return { minPower: 0, maxPower: 0 };
  }

  const maxCapacity = Math.max(...capacities);
  const minCapacity = Math.min(...capacities.filter(c => c > 0));

  // 功率 = 传递能力 × 转速
  const minPower = Math.round(minCapacity * speeds[0]);
  const maxPower = Math.round(maxCapacity * speeds[1]);

  return { minPower, maxPower };
}

/**
 * 产品筛选Hook
 * @param {Array} allProducts - 所有产品数据
 * @returns {Object} 筛选状态和方法
 */
export function useProductFilter(allProducts) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [compareList, setCompareList] = useState([]); // 对比列表

  // 更新单个筛选条件
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // 重置筛选条件
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // 添加/移除对比
  const toggleCompare = useCallback((product) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.model === product.model);
      if (exists) {
        return prev.filter(p => p.model !== product.model);
      }
      if (prev.length >= 5) {
        return prev; // 最多5个
      }
      return [...prev, product];
    });
  }, []);

  // 清空对比列表
  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  // 处理后的产品数据 (添加系列标识和功率范围)
  const processedProducts = useMemo(() => {
    return allProducts.map(product => {
      const seriesKey = getSeriesKey(product.model);
      const { minPower, maxPower } = getPowerRange(product);
      const seriesInfo = SERIES_CONFIG.find(s => s.key === seriesKey);

      return {
        ...product,
        seriesKey,
        seriesLabel: seriesInfo?.label || '其他',
        minPower,
        maxPower,
        minSpeed: product.inputSpeedRange?.[0] || 0,
        maxSpeed: product.inputSpeedRange?.[1] || 0,
        minRatio: product.ratios?.length > 0 ? Math.min(...product.ratios) : 0,
        maxRatio: product.ratios?.length > 0 ? Math.max(...product.ratios) : 0,
        displayPrice: product.marketPrice || product.price || product.basePrice || 0
      };
    });
  }, [allProducts]);

  // 筛选后的产品
  const filteredProducts = useMemo(() => {
    let result = processedProducts;

    // 1. 文本搜索
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      result = result.filter(p =>
        p.model?.toLowerCase().includes(searchLower) ||
        p.seriesLabel?.toLowerCase().includes(searchLower) ||
        p.notes?.toLowerCase().includes(searchLower)
      );
    }

    // 2. 系列筛选
    if (filters.series.length > 0) {
      result = result.filter(p => filters.series.includes(p.seriesKey));
    }

    // 3. 功率范围
    result = result.filter(p =>
      p.maxPower >= filters.powerRange[0] && p.minPower <= filters.powerRange[1]
    );

    // 4. 转速范围
    result = result.filter(p =>
      p.maxSpeed >= filters.speedRange[0] && p.minSpeed <= filters.speedRange[1]
    );

    // 5. 减速比范围
    result = result.filter(p =>
      p.maxRatio >= filters.ratioRange[0] && p.minRatio <= filters.ratioRange[1]
    );

    // 6. 接口类型筛选
    if (filters.interfaceType !== '全部' && filters.interfaceSpec) {
      result = result.filter(p => {
        const interfaces = p.inputInterfaces;
        if (!interfaces) return false;

        if (filters.interfaceType === 'sae') {
          const saeList = interfaces.sae || [];
          return saeList.some(spec =>
            spec.toUpperCase().includes(filters.interfaceSpec.toUpperCase())
          );
        } else if (filters.interfaceType === 'domestic') {
          const domesticList = interfaces.domestic || [];
          return domesticList.some(spec =>
            spec.includes(filters.interfaceSpec)
          );
        }
        return true;
      });
    }

    // 7. 价格范围
    result = result.filter(p =>
      p.displayPrice >= filters.priceRange[0] &&
      p.displayPrice <= filters.priceRange[1]
    );

    // 8. 仅显示有价格的
    if (filters.hasPrice) {
      result = result.filter(p => p.displayPrice > 0);
    }

    // 9. 排序
    const [sortField, sortDir] = filters.sortBy.includes('-')
      ? filters.sortBy.split('-')
      : [filters.sortBy, filters.sortOrder];

    result.sort((a, b) => {
      let aVal, bVal;

      switch (sortField) {
        case 'model':
          aVal = a.model || '';
          bVal = b.model || '';
          return sortDir === 'desc'
            ? bVal.localeCompare(aVal)
            : aVal.localeCompare(bVal);
        case 'power':
          aVal = a.maxPower || 0;
          bVal = b.maxPower || 0;
          break;
        case 'price':
          aVal = a.displayPrice || 0;
          bVal = b.displayPrice || 0;
          break;
        case 'weight':
          aVal = a.weight || 0;
          bVal = b.weight || 0;
          break;
        default:
          return 0;
      }

      return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
    });

    return result;
  }, [processedProducts, filters]);

  // 统计每个系列的数量
  const seriesCounts = useMemo(() => {
    const counts = {};
    SERIES_CONFIG.forEach(s => { counts[s.key] = 0; });

    // 基于当前筛选条件（除系列外）统计
    let baseFiltered = processedProducts;

    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      baseFiltered = baseFiltered.filter(p =>
        p.model?.toLowerCase().includes(searchLower) ||
        p.seriesLabel?.toLowerCase().includes(searchLower)
      );
    }

    baseFiltered.forEach(p => {
      if (counts[p.seriesKey] !== undefined) {
        counts[p.seriesKey]++;
      }
    });

    return counts;
  }, [processedProducts, filters.searchText]);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    filteredProducts,
    totalCount: processedProducts.length,
    seriesCounts,
    compareList,
    toggleCompare,
    clearCompare,
    isInCompare: (model) => compareList.some(p => p.model === model)
  };
}

export default useProductFilter;
