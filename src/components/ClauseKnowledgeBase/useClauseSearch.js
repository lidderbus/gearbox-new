// src/components/ClauseKnowledgeBase/useClauseSearch.js
// 条款搜索状态管理Hook

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  createClauseSearchEngine,
  searchClauses,
  getClauseStats
} from '../../utils/clauseSearch';
import clauseKbData from '../../data/clause-kb.json';

/**
 * 条款搜索自定义Hook
 * 管理条款数据加载、搜索状态和结果
 */
const useClauseSearch = () => {
  // 数据状态 - 直接从导入的JSON初始化
  const [clauses] = useState(clauseKbData.clauses || []);
  const [categories] = useState(clauseKbData.categories || []);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  // 搜索状态
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSeries, setActiveSeries] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // 选中状态 (用于对比)
  const [selectedClauses, setSelectedClauses] = useState([]);

  // 详情弹窗状态
  const [detailClause, setDetailClause] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // 对比视图状态
  const [showCompare, setShowCompare] = useState(false);

  // 初始化搜索引擎
  useEffect(() => {
    // 初始化Fuse.js搜索引擎
    createClauseSearchEngine(clauses);

    // 初始显示全部
    setSearchResults(
      clauses.map(item => ({ item, score: 0, matches: [] }))
    );

    setLoading(false);
  }, [clauses]);

  // 执行搜索
  const search = useCallback((query, options = {}) => {
    const results = searchClauses(query, {
      category: options.category || activeCategory,
      series: options.series || activeSeries,
      ...options
    });
    setSearchResults(results);
    return results;
  }, [activeCategory, activeSeries]);

  // 搜索词变化时自动搜索
  useEffect(() => {
    if (!loading) {
      search(searchTerm);
    }
  }, [searchTerm, activeCategory, activeSeries, loading, search]);

  // 清除搜索
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setActiveCategory('all');
    setActiveSeries('');
  }, []);

  // 切换条款选中状态 (用于对比)
  const toggleClauseSelection = useCallback((clause) => {
    setSelectedClauses(prev => {
      const isSelected = prev.some(c => c.id === clause.id);
      if (isSelected) {
        return prev.filter(c => c.id !== clause.id);
      }
      // 最多选择4个进行对比
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, clause];
    });
  }, []);

  // 清除所有选中
  const clearSelection = useCallback(() => {
    setSelectedClauses([]);
  }, []);

  // 打开条款详情
  const openDetail = useCallback((clause) => {
    setDetailClause(clause);
    setShowDetail(true);
  }, []);

  // 关闭条款详情
  const closeDetail = useCallback(() => {
    setShowDetail(false);
    setDetailClause(null);
  }, []);

  // 打开对比视图
  const openCompare = useCallback(() => {
    if (selectedClauses.length >= 2) {
      setShowCompare(true);
    }
  }, [selectedClauses]);

  // 关闭对比视图
  const closeCompare = useCallback(() => {
    setShowCompare(false);
  }, []);

  // 统计信息
  const stats = useMemo(() => {
    if (loading || !clauses.length) {
      return { total: 0, byCategory: {}, bySeries: {} };
    }
    return getClauseStats();
  }, [clauses, loading]);

  // 可用系列列表
  const availableSeries = useMemo(() => {
    const series = new Set();
    clauses.forEach(c => {
      if (c.applicableSeries) {
        c.applicableSeries.forEach(s => series.add(s));
      }
    });
    return Array.from(series).sort();
  }, [clauses]);

  return {
    // 数据
    clauses,
    categories,
    loading,
    error,
    stats,
    availableSeries,

    // 搜索状态
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    activeSeries,
    setActiveSeries,
    searchResults,

    // 搜索方法
    search,
    clearSearch,

    // 选中状态
    selectedClauses,
    toggleClauseSelection,
    clearSelection,

    // 详情弹窗
    detailClause,
    showDetail,
    openDetail,
    closeDetail,

    // 对比视图
    showCompare,
    openCompare,
    closeCompare
  };
};

export default useClauseSearch;
