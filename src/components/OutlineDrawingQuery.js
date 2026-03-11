// src/components/OutlineDrawingQuery.js
// 外形图库独立查询页面组件

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Row, Col, Tabs, Tab, Badge, ButtonGroup, Button } from 'react-bootstrap';
import DwgDataDashboard from './DwgDataDashboard';
import FavoritesPanel from './FavoritesPanel';
import DwgThumbnailGrid from './DwgThumbnailGrid';
import DwgCompareView from './DwgCompareView';
import {
  toggleFavorite,
  getFavoritesCount
} from '../utils/favorites';
import {
  gearboxDrawings,
  couplingDrawings,
  getAllGearboxSeries,
  getAllCouplingSeries,
  getGearboxesBySeries,
  getCouplingsBySeries,
  searchDrawings,
  getDrawingsStats,
  recommendCouplingByPower,
  // DWG相关导入
  gearboxDwgDrawings,
  couplingDwgDrawings,
  dwgSeriesInfo,
  getDwgStats,
  getDwgFilesBySeries,
  searchDwgFiles,
  getAllDwgSeries
} from '../data/outlineDrawings';
// Sub-components
import {
  StatsCard,
  SearchBox,
  SearchResults,
  SeriesBrowser,
  RecommendationSection,
  DrawingViewer,
  DwgBrowser,
  DwgViewer
} from './OutlineDrawingQuery/index';

/**
 * 外形图库查询组件
 * @param {Object} props
 * @param {Object} props.colors - 主题颜色
 * @param {string} props.theme - 主题 ('light' | 'dark')
 */
const OutlineDrawingQuery = ({ colors = {}, theme = 'light' }) => {
  // 状态
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'gearbox', 'coupling'
  const [selectedSeries, setSelectedSeries] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'search', 'recommend', 'dwg'

  // 推荐功能状态
  const [recommendPower, setRecommendPower] = useState('');
  const [recommendSpeed, setRecommendSpeed] = useState('1500');
  const [recommendations, setRecommendations] = useState([]);

  // DWG图库状态
  const [dwgSearchKeyword, setDwgSearchKeyword] = useState('');
  const [selectedDwgSeries, setSelectedDwgSeries] = useState('');
  const [selectedDwgFile, setSelectedDwgFile] = useState(null);

  // 收藏状态 - 用于触发重新渲染
  const [favoritesVersion, setFavoritesVersion] = useState(0);
  const favoritesCount = useMemo(() => getFavoritesCount(), [favoritesVersion]);

  // DWG视图模式: 'list' | 'grid'
  const [dwgViewMode, setDwgViewMode] = useState('list');

  // 搜索历史
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  // 最近浏览记录
  const [recentViews, setRecentViews] = useState([]);

  // 加载搜索历史和最近浏览
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('dwg_search_history');
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory).slice(0, 5));
      }
      const savedViews = localStorage.getItem('dwg_recent_views');
      if (savedViews) {
        setRecentViews(JSON.parse(savedViews).slice(0, 10));
      }
    } catch (e) {
      console.warn('加载搜索历史失败:', e);
    }
  }, []);

  // 添加搜索历史
  const addToSearchHistory = useCallback((term) => {
    if (!term.trim()) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h !== term);
      const newHistory = [term, ...filtered].slice(0, 5);
      localStorage.setItem('dwg_search_history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // 清除搜索历史
  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('dwg_search_history');
  }, []);

  // 全局快捷键
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + F: 聚焦搜索框
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('.dwg-search-input');
        if (searchInput) {
          searchInput.focus();
          setActiveTab('search');
        }
      }
      // Escape: 关闭搜索历史
      if (e.key === 'Escape') {
        setShowSearchHistory(false);
      }
      // Alt + 数字: 切换Tab
      if (e.altKey && !e.ctrlKey && !e.shiftKey) {
        const tabMap = {
          '1': 'browse',
          '2': 'search',
          '3': 'recommend',
          '4': 'dwg',
          '5': 'dashboard',
          '6': 'compare',
          '7': 'favorites'
        };
        if (tabMap[e.key]) {
          e.preventDefault();
          setActiveTab(tabMap[e.key]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // URL参数解析 - 支持从外部直接打开指定Tab
  useEffect(() => {
    const parseUrlParams = () => {
      try {
        const hash = window.location.hash;
        const queryStart = hash.indexOf('?');
        if (queryStart !== -1) {
          const queryString = hash.slice(queryStart + 1);
          const params = new URLSearchParams(queryString);
          const tab = params.get('tab');

          const validTabs = ['browse', 'search', 'recommend', 'dwg', 'dashboard', 'compare', 'favorites'];
          if (tab && validTabs.includes(tab)) {
            setActiveTab(tab);
          }

          // 支持 search 参数 - 自动填入搜索关键词并切换到搜索Tab
          const searchParam = params.get('search');
          if (searchParam) {
            setSearchKeyword(searchParam);
            setActiveTab('search');
          }
        }
      } catch (e) {
        console.warn('解析URL参数失败:', e);
      }
    };

    parseUrlParams();
    window.addEventListener('hashchange', parseUrlParams);
    return () => window.removeEventListener('hashchange', parseUrlParams);
  }, []);

  // 默认颜色配置
  const defaultColors = {
    card: theme === 'light' ? '#ffffff' : '#2d2d2d',
    text: theme === 'light' ? '#333333' : '#e0e0e0',
    headerBg: theme === 'light' ? '#f8f9fa' : '#1a1a1a',
    headerText: theme === 'light' ? '#495057' : '#e0e0e0',
    border: theme === 'light' ? '#dee2e6' : '#404040',
    primary: '#0d6efd',
    ...colors
  };

  // 统计信息
  const stats = useMemo(() => getDrawingsStats(), []);
  const dwgStats = useMemo(() => getDwgStats(), []);

  // 获取所有系列
  const gearboxSeries = useMemo(() => getAllGearboxSeries(), []);
  const couplingSeries = useMemo(() => getAllCouplingSeries(), []);
  const dwgSeries = useMemo(() => getAllDwgSeries(), []);

  // DWG搜索结果
  const dwgSearchResults = useMemo(() => {
    if (!dwgSearchKeyword.trim()) return [];
    return searchDwgFiles(dwgSearchKeyword.trim());
  }, [dwgSearchKeyword]);

  // 搜索结果
  const searchResults = useMemo(() => {
    if (!searchKeyword.trim()) return [];
    return searchDrawings(searchKeyword.trim(), filterType);
  }, [searchKeyword, filterType]);

  // 处理搜索
  const handleSearch = useCallback((e) => {
    setSearchKeyword(e.target.value);
    setSelectedModel(null);
    setShowSearchHistory(false);
  }, []);

  // 搜索提交（回车时添加到历史）
  const handleSearchSubmit = useCallback((e) => {
    if (e.key === 'Enter' && searchKeyword.trim()) {
      addToSearchHistory(searchKeyword.trim());
      setShowSearchHistory(false);
    }
  }, [searchKeyword, addToSearchHistory]);

  // 从历史选择搜索词
  const selectFromHistory = useCallback((term) => {
    setSearchKeyword(term);
    setShowSearchHistory(false);
    addToSearchHistory(term);
  }, [addToSearchHistory]);

  // 处理类型筛选
  const handleFilterType = useCallback((type) => {
    setFilterType(type);
    setSelectedSeries('');
    setSelectedModel(null);
  }, []);

  // 处理型号选择
  const handleModelSelect = useCallback((model, type) => {
    const drawingData = type === 'gearbox' ? gearboxDrawings[model] : couplingDrawings[model];
    setSelectedModel({ model, type, data: drawingData });
  }, []);

  // 处理推荐计算
  const handleRecommend = useCallback(() => {
    const power = parseFloat(recommendPower);
    const speed = parseFloat(recommendSpeed) || 1500;
    if (power > 0) {
      const results = recommendCouplingByPower(power, speed);
      setRecommendations(results);
    }
  }, [recommendPower, recommendSpeed]);

  // 处理收藏切换
  const handleToggleFavorite = useCallback((model, type, e) => {
    if (e) {
      e.stopPropagation();
    }
    toggleFavorite(model, type);
    setFavoritesVersion(v => v + 1);
  }, []);

  // 从收藏面板选择型号
  const handleFavoriteSelect = useCallback((model) => {
    // 尝试在DWG中查找
    if (gearboxDwgDrawings[model]) {
      const files = gearboxDwgDrawings[model];
      if (files && files.length > 0) {
        setSelectedDwgFile(files[0]);
        setActiveTab('dwg');
        return;
      }
    }
    if (couplingDwgDrawings[model]) {
      const files = couplingDwgDrawings[model];
      if (files && files.length > 0) {
        setSelectedDwgFile(files[0]);
        setActiveTab('dwg');
        return;
      }
    }
    // 尝试在SVG图库中查找
    if (gearboxDrawings[model]) {
      handleModelSelect(model, 'gearbox');
      setActiveTab('browse');
    } else if (couplingDrawings[model]) {
      handleModelSelect(model, 'coupling');
      setActiveTab('browse');
    }
  }, [handleModelSelect]);

  // 获取系列下的型号列表
  const getModelsForSeries = useCallback((seriesCode, type) => {
    if (type === 'gearbox') {
      return getGearboxesBySeries(seriesCode);
    } else {
      return getCouplingsBySeries(seriesCode);
    }
  }, []);

  return (
    <div className="outline-drawing-query">
      {/* 统计卡片 */}
      <StatsCard stats={stats} dwgStats={dwgStats} colors={defaultColors} />

      {/* 主标签页 */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        {/* 浏览标签页 */}
        <Tab
          eventKey="browse"
          title={<span><i className="bi bi-folder me-1"></i>浏览图库</span>}
        >
          <Row>
            <Col lg={5}>
              <SeriesBrowser
                gearboxSeries={gearboxSeries}
                couplingSeries={couplingSeries}
                selectedModel={selectedModel}
                onModelSelect={handleModelSelect}
                getModelsForSeries={getModelsForSeries}
                onToggleFavorite={handleToggleFavorite}
                colors={defaultColors}
              />
            </Col>
            <Col lg={7}>
              <DrawingViewer
                selectedModel={selectedModel}
                onClose={() => setSelectedModel(null)}
                colors={defaultColors}
                theme={theme}
              />
            </Col>
          </Row>
        </Tab>

        {/* 搜索标签页 */}
        <Tab
          eventKey="search"
          title={<span><i className="bi bi-search me-1"></i>搜索查询</span>}
        >
          <Row>
            <Col lg={5}>
              <SearchBox
                searchKeyword={searchKeyword}
                onSearch={handleSearch}
                onSearchSubmit={handleSearchSubmit}
                onClear={() => { setSearchKeyword(''); setSelectedModel(null); }}
                filterType={filterType}
                onFilterType={handleFilterType}
                searchHistory={searchHistory}
                showSearchHistory={showSearchHistory}
                onShowHistory={() => setShowSearchHistory(true)}
                onHideHistory={() => setShowSearchHistory(false)}
                onSelectHistory={selectFromHistory}
                onClearHistory={clearSearchHistory}
                colors={defaultColors}
              />
              <SearchResults
                searchKeyword={searchKeyword}
                searchResults={searchResults}
                selectedModel={selectedModel}
                onModelSelect={handleModelSelect}
                colors={defaultColors}
              />
            </Col>
            <Col lg={7}>
              <DrawingViewer
                selectedModel={selectedModel}
                onClose={() => setSelectedModel(null)}
                colors={defaultColors}
                theme={theme}
              />
            </Col>
          </Row>
        </Tab>

        {/* 推荐标签页 */}
        <Tab
          eventKey="recommend"
          title={<span><i className="bi bi-calculator me-1"></i>联轴器推荐</span>}
        >
          <Row>
            <Col lg={6}>
              <RecommendationSection
                recommendPower={recommendPower}
                recommendSpeed={recommendSpeed}
                recommendations={recommendations}
                onPowerChange={setRecommendPower}
                onSpeedChange={setRecommendSpeed}
                onRecommend={handleRecommend}
                onModelSelect={handleModelSelect}
                colors={defaultColors}
              />
            </Col>
            <Col lg={6}>
              <DrawingViewer
                selectedModel={selectedModel}
                onClose={() => setSelectedModel(null)}
                colors={defaultColors}
                theme={theme}
              />
            </Col>
          </Row>
        </Tab>

        {/* DWG图库标签页 */}
        <Tab
          eventKey="dwg"
          title={
            <span>
              <i className="bi bi-file-earmark-binary me-1"></i>
              DWG图库
              <Badge bg="info" className="ms-1">{dwgStats.total}</Badge>
            </span>
          }
        >
          {/* 视图模式切换 */}
          <div className="d-flex justify-content-end mb-3">
            <ButtonGroup size="sm">
              <Button
                variant={dwgViewMode === 'list' ? 'primary' : 'outline-primary'}
                onClick={() => setDwgViewMode('list')}
                title="列表视图"
              >
                <i className="bi bi-list-ul me-1"></i>列表
              </Button>
              <Button
                variant={dwgViewMode === 'grid' ? 'primary' : 'outline-primary'}
                onClick={() => setDwgViewMode('grid')}
                title="网格视图"
              >
                <i className="bi bi-grid-3x3-gap me-1"></i>网格
              </Button>
            </ButtonGroup>
          </div>

          {/* 根据视图模式显示内容 */}
          {dwgViewMode === 'list' ? (
            <Row>
              <Col lg={5}>
                <DwgBrowser
                  dwgStats={dwgStats}
                  dwgSearchKeyword={dwgSearchKeyword}
                  onSearchChange={setDwgSearchKeyword}
                  onClearSearch={() => setDwgSearchKeyword('')}
                  dwgSearchResults={dwgSearchResults}
                  dwgSeries={dwgSeries}
                  dwgSeriesInfo={dwgSeriesInfo}
                  getDwgFilesBySeries={getDwgFilesBySeries}
                  selectedDwgFile={selectedDwgFile}
                  onSelectFile={setSelectedDwgFile}
                  onToggleFavorite={handleToggleFavorite}
                  colors={defaultColors}
                />
              </Col>
              <Col lg={7}>
                <DwgViewer
                  selectedDwgFile={selectedDwgFile}
                  onClose={() => setSelectedDwgFile(null)}
                  onToggleFavorite={handleToggleFavorite}
                  colors={defaultColors}
                  theme={theme}
                />
              </Col>
            </Row>
          ) : (
            <DwgThumbnailGrid onSelectFile={(file) => {
              setSelectedDwgFile(file);
              setDwgViewMode('list');
            }} />
          )}
        </Tab>

        {/* DWG数据中心标签页 */}
        <Tab
          eventKey="dashboard"
          title={
            <span>
              <i className="bi bi-grid-3x3-gap me-1"></i>
              数据中心
            </span>
          }
        >
          <DwgDataDashboard />
        </Tab>

        {/* DWG对比标签页 */}
        <Tab
          eventKey="compare"
          title={
            <span>
              <i className="bi bi-layout-split me-1"></i>
              图纸对比
              <Badge bg="success" className="ms-1">NEW</Badge>
            </span>
          }
        >
          <DwgCompareView />
        </Tab>

        {/* 收藏夹标签页 */}
        <Tab
          eventKey="favorites"
          title={
            <span>
              <i className="bi bi-star me-1"></i>
              收藏夹
              {favoritesCount > 0 && (
                <Badge bg="warning" text="dark" className="ms-1">{favoritesCount}</Badge>
              )}
            </span>
          }
        >
          <FavoritesPanel
            onSelectModel={handleFavoriteSelect}
            dwgTechParams={null}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default OutlineDrawingQuery;
