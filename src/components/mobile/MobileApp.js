/**
 * MobileApp - 移动端齿轮箱选型系统
 * 与桌面版功能一致的移动优化界面
 */
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Home, Crosshair, Package, FileText, User, Search, X, ChevronDown, ChevronUp,
  ChevronRight, Zap, RotateCcw, Gauge, Award, Moon, Sun, Monitor, LogOut,
  Info, Database, Clock, Settings, Box, ArrowRight, Calculator, Trash2, Filter,
  Star, Weight, Anchor, Compass, Wrench, BookOpen, Image, BarChart3
} from 'lucide-react';
import { selectGearbox, autoSelectGearbox } from '../../utils/selectionAlgorithm';
import { correctPriceData } from '../../utils/priceManager';
import { enhanceGearboxData } from '../../utils/gearboxDataEnhancer';
import { gearboxPriceData } from '../../data/gearboxPricing';
import './MobileApp.css';

// 通过型号名查找价格
const getGearboxPrice = (model) => {
  if (!model) return 0;
  const m = model.trim();
  const entry = gearboxPriceData.find(p =>
    p.model === m || m.includes(p.model) || p.model.includes(m)
  );
  return entry?.discountedPrice || entry?.basePrice || 0;
};

// ==================== 工具函数 ====================
const formatPrice = (price) => {
  if (!price || price <= 0) return '询价';
  return '¥' + Number(price).toLocaleString('zh-CN');
};

// ==================== Tab 定义 ====================
const TABS = { HOME: 'home', SELECTION: 'selection', PRODUCTS: 'products', DOCS: 'docs', PROFILE: 'profile' };

const TAB_CONFIG = [
  { key: TABS.HOME, label: '首页', Icon: Home },
  { key: TABS.SELECTION, label: '选型', Icon: Crosshair },
  { key: TABS.PRODUCTS, label: '产品库', Icon: Package },
  { key: TABS.DOCS, label: '文档', Icon: FileText },
  { key: TABS.PROFILE, label: '我的', Icon: User },
];

// ==================== 主组件 ====================
const MobileApp = ({ user, onLogout, appData, onSwitchToDesktop }) => {
  const [activeTab, setActiveTab] = useState(TABS.HOME);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [productFilter, setProductFilter] = useState('all'); // 跨Tab系列过滤

  // 导航到产品库并按系列过滤
  const navigateToProducts = useCallback((series) => {
    setProductFilter(series || 'all');
    setActiveTab(TABS.PRODUCTS);
  }, []);

  // 切换到桌面版并跳转到指定模块
  const switchToDesktopAt = useCallback((hash) => {
    localStorage.setItem('forceDesktop', 'true');
    window.location.hash = hash || '';
    window.location.reload();
  }, []);

  // 全量齿轮箱数据 — 从数组键名提取系列信息
  const allGearboxes = useMemo(() => {
    if (!appData) return [];
    const keyToSeries = {
      hcGearboxes: 'HC', gwGearboxes: 'GW', hcmGearboxes: 'HCM',
      dtGearboxes: 'DT', hcqGearboxes: 'HCQ', gcGearboxes: 'GC',
      hcaGearboxes: 'HCA', hcvGearboxes: 'HCV', hcxGearboxes: 'HCX',
      mvGearboxes: 'MV', otherGearboxes: 'OTHER',
    };
    const items = [];
    Object.keys(appData).filter(k => k.endsWith('Gearboxes')).forEach(key => {
      const arr = appData[key];
      if (!Array.isArray(arr)) return;
      const series = keyToSeries[key] || key.replace('Gearboxes', '').toUpperCase();
      arr.forEach(item => {
        if (item && item.model) {
          items.push({ ...item, _series: series, series: item.series || series });
        }
      });
    });
    return enhanceGearboxData(items);
  }, [appData]);

  // 系列统计
  const seriesStats = useMemo(() => {
    const map = {};
    allGearboxes.forEach(g => {
      const s = (g.series || g._series || '其他').toUpperCase();
      map[s] = (map[s] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [allGearboxes]);

  // 主题
  useEffect(() => { localStorage.setItem('theme', theme); }, [theme]);
  const toggleTheme = useCallback(() => setTheme(t => t === 'light' ? 'dark' : 'light'), []);
  const isDark = theme === 'dark';

  return (
    <div className={`m-app ${isDark ? 'm-dark' : 'm-light'}`}>
      {/* 顶部导航 */}
      <header className="m-header">
        <div className="m-header-left">
          <Settings size={20} />
          <span className="m-header-title">齿轮箱选型</span>
        </div>
        <button className="m-icon-btn" onClick={toggleTheme} aria-label="切换主题">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* 主内容 */}
      <main className="m-body">
        {activeTab === TABS.HOME && (
          <HomeTab allGearboxes={allGearboxes} seriesStats={seriesStats} user={user} appData={appData}
            onNavigate={setActiveTab} onNavigateProducts={navigateToProducts} />
        )}
        {activeTab === TABS.SELECTION && (
          <SelectionTab appData={appData} allGearboxes={allGearboxes} />
        )}
        {activeTab === TABS.PRODUCTS && (
          <ProductsTab allGearboxes={allGearboxes} initialFilter={productFilter}
            onFilterChange={setProductFilter} />
        )}
        {activeTab === TABS.DOCS && (
          <DocsTab switchToDesktopAt={switchToDesktopAt} />
        )}
        {activeTab === TABS.PROFILE && (
          <ProfileTab user={user} onLogout={onLogout} onSwitchToDesktop={onSwitchToDesktop}
            isDark={isDark} toggleTheme={toggleTheme} totalModels={allGearboxes.length} />
        )}
      </main>

      {/* 底部导航 */}
      <nav className="m-bottom-nav">
        {TAB_CONFIG.map(({ key, label, Icon }) => (
          <button key={key} className={`m-nav-item ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}>
            <Icon size={22} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MobileApp;

// ==================== 首页 Tab ====================
function HomeTab({ allGearboxes, seriesStats, user, appData, onNavigate, onNavigateProducts }) {
  const couplings = appData?.flexibleCouplings?.length || 0;
  const pumps = appData?.standbyPumps?.length || 0;
  const [quickSearch, setQuickSearch] = useState('');
  const [quickResults, setQuickResults] = useState(null);

  const recentHistory = useMemo(() => {
    try {
      const stored = localStorage.getItem('selectionHistory');
      if (stored) {
        const arr = JSON.parse(stored);
        if (Array.isArray(arr)) return arr.slice(0, 5);
      }
    } catch (e) { /* ignore */ }
    return [];
  }, []);

  // 快速搜索
  const handleQuickSearch = useCallback((val) => {
    setQuickSearch(val);
    if (!val.trim()) { setQuickResults(null); return; }
    const kw = val.trim().toLowerCase();
    const found = allGearboxes.filter(g =>
      (g.model || '').toLowerCase().includes(kw)
    ).slice(0, 5);
    setQuickResults(found.length > 0 ? found : []);
  }, [allGearboxes]);

  return (
    <div className="m-page">
      {/* 欢迎横幅 */}
      <div className="m-welcome">
        <h2><Settings size={24} /> 船用齿轮箱选型系统</h2>
        <p>{user?.displayName || user?.username || '用户'}，欢迎使用</p>
      </div>

      {/* 快速型号搜索 */}
      <div className="m-quick-search">
        <div className="m-search-input">
          <Search size={18} className="m-search-icon" />
          <input type="text" placeholder="快速搜索型号，如 HC600A..."
            value={quickSearch} onChange={e => handleQuickSearch(e.target.value)} />
          {quickSearch && <button className="m-search-clear" onClick={() => handleQuickSearch('')}><X size={16} /></button>}
        </div>
        {quickResults !== null && (
          <div className="m-quick-results">
            {quickResults.length === 0 ? (
              <div className="m-quick-empty">未找到匹配型号</div>
            ) : (
              quickResults.map(g => {
                const price = getGearboxPrice(g.model) || g.price || g.marketPrice;
                return (
                  <div key={g.model} className="m-quick-item" onClick={() => onNavigate(TABS.PRODUCTS)}>
                    <div>
                      <span className="m-series-badge">{(g.series || g._series || '').toUpperCase()}</span>
                      <strong>{g.model}</strong>
                    </div>
                    <span className="m-quick-price">{formatPrice(price)}</span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* 数据统计 */}
      <div className="m-stats">
        <StatCard number={allGearboxes.length} label="齿轮箱型号" onClick={() => onNavigate(TABS.PRODUCTS)} />
        <StatCard number={seriesStats.length} label="产品系列" />
        <StatCard number={couplings} label="联轴器" />
        <StatCard number={pumps} label="备用泵" />
      </div>

      {/* 快捷操作 */}
      <SectionTitle text="快捷操作" />
      <div className="m-actions">
        <ActionBtn Icon={Crosshair} label="齿轮箱选型" color="#1976d2" onClick={() => onNavigate(TABS.SELECTION)} />
        <ActionBtn Icon={Search} label="型号查询" color="#2e7d32" onClick={() => onNavigate(TABS.PRODUCTS)} />
        <ActionBtn Icon={FileText} label="文档中心" color="#0288d1" onClick={() => onNavigate(TABS.DOCS)} />
        <ActionBtn Icon={Image} label="外形图库" color="#ed6c02" onClick={() => onNavigate(TABS.DOCS)} />
      </div>

      {/* 产品系列 */}
      <SectionTitle text="产品系列分布" />
      <div className="m-chips">
        {seriesStats.map(([name, count]) => (
          <span key={name} className="m-chip clickable" onClick={() => onNavigateProducts(name)}>
            {name} <strong>{count}</strong>
          </span>
        ))}
      </div>

      {/* 最近选型 */}
      {recentHistory.length > 0 && (
        <>
          <SectionTitle text="最近选型" />
          <div className="m-history-list">
            {recentHistory.map((item, idx) => (
              <div key={idx} className="m-history-item" onClick={() => onNavigate(TABS.SELECTION)}>
                <div className="m-history-model">
                  <Award size={14} />
                  {item.model || item.selectedModel || (item.count ? item.count + '个匹配' : '选型记录')}
                </div>
                <div className="m-history-params">
                  {(item.power || item.enginePower) ? (item.power || item.enginePower) + 'kW' : ''}
                  {(item.speed || item.engineSpeed) ? ' / ' + (item.speed || item.engineSpeed) + 'rpm' : ''}
                </div>
                <div className="m-history-time">
                  {item.timestamp ? new Date(item.timestamp).toLocaleDateString('zh-CN') : ''}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ==================== 选型 Tab ====================
function SelectionTab({ appData, allGearboxes }) {
  // 基础参数
  const [power, setPower] = useState('');
  const [speed, setSpeed] = useState('');
  const [ratio, setRatio] = useState('');
  const [thrust, setThrust] = useState('');
  const [gearboxType, setGearboxType] = useState('auto');
  // 专业参数
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [workCondition, setWorkCondition] = useState('III类:扭矩变化中等');
  const [application, setApplication] = useState('propulsion');
  const [primeType, setPrimeType] = useState('none'); // none/diesel/electric
  const [hasClutch, setHasClutch] = useState(null); // null=不限, true=需要, false=不需要
  const [engineConfig, setEngineConfig] = useState('single');
  const [inputRotation, setInputRotation] = useState('clockwise');
  const [outputRotation, setOutputRotation] = useState('clockwise');
  // 状态
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [expandedIdx, setExpandedIdx] = useState(null);
  const resultRef = useRef(null);

  const seriesOptions = [
    { value: 'auto', label: '自动匹配 (推荐)' },
    { value: 'HC', label: 'HC 系列' }, { value: 'GW', label: 'GW 系列' },
    { value: 'HCM', label: 'HCM 高速系列' }, { value: 'DT', label: 'DT 系列' },
    { value: 'HCQ', label: 'HCQ 系列' }, { value: 'GC', label: 'GC 系列' },
    { value: 'HCA', label: 'HCA 倾角系列' }, { value: 'HCV', label: 'HCV 系列' },
    { value: 'MV', label: 'MV 系列' },
  ];

  const workConditions = [
    { value: 'I类:扭矩变化很小', label: 'I类 扭矩变化很小' },
    { value: 'II类:扭矩变化小', label: 'II类 扭矩变化小' },
    { value: 'III类:扭矩变化中等', label: 'III类 扭矩变化中等' },
    { value: 'IV类:扭矩变化大', label: 'IV类 扭矩变化大' },
    { value: 'V类:扭矩变化很大', label: 'V类 扭矩变化很大' },
  ];

  const appOptions = [
    { value: 'propulsion', label: '主推进' },
    { value: 'auxiliary', label: '辅助推进' },
    { value: 'winch', label: '绞车' },
    { value: 'other', label: '其他' },
  ];

  const handleSelection = useCallback(() => {
    const p = parseFloat(power);
    const s = parseFloat(speed);
    const r = parseFloat(ratio);
    const t = parseFloat(thrust) || 0;

    if (!p || p <= 0) { setError('请输入有效的发动机功率'); return; }
    if (!s || s <= 0) { setError('请输入有效的发动机转速'); return; }
    if (!r || r <= 0) { setError('请输入有效的目标减速比'); return; }

    setError('');
    setLoading(true);
    setResult(null);
    setExpandedIdx(null);

    // 构造选型选项 — 与桌面版一致
    const options = {
      workCondition,
      application,
      temperature: 30,
      hasCover: false,
      hasClutch,
      seriesRequirements: {
        needsClutch: hasClutch === true ? true : undefined,
        needsReverse: undefined,
      },
    };

    setTimeout(() => {
      try {
        let res;
        if (gearboxType === 'auto') {
          res = autoSelectGearbox({
            motorPower: p, motorSpeed: s, targetRatio: r, thrust: t,
            ...options,
          }, appData);
        } else {
          res = selectGearbox(p, s, r, t, gearboxType, appData, options);
        }

        if (res && res.success && res.recommendations?.length > 0) {
          res.recommendations = res.recommendations.map(g => correctPriceData({ ...g }));
          setResult(res);
          // 保存到选型历史
          try {
            const history = JSON.parse(localStorage.getItem('selectionHistory') || '[]');
            history.unshift({
              model: res.recommendations[0].model,
              enginePower: p, engineSpeed: s, ratio: r, power: p, speed: s,
              timestamp: Date.now(), count: res.recommendations.length,
              application, workCondition, gearboxType,
            });
            localStorage.setItem('selectionHistory', JSON.stringify(history.slice(0, 50)));
          } catch (e) { /* ignore */ }
          setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        } else {
          setError(res?.message || '未找到匹配的齿轮箱型号，请调整参数后重试');
        }
      } catch (e) {
        setError('选型计算出错: ' + e.message);
      }
      setLoading(false);
    }, 50);
  }, [power, speed, ratio, thrust, gearboxType, appData, workCondition, application, hasClutch]);

  const handleClear = () => {
    setPower(''); setSpeed(''); setRatio(''); setThrust('');
    setGearboxType('auto'); setResult(null); setError(''); setExpandedIdx(null);
    setWorkCondition('III类:扭矩变化中等'); setApplication('propulsion');
    setHasClutch(null); setEngineConfig('single'); setPrimeType('none');
  };

  return (
    <div className="m-page">
      <SectionTitle text="齿轮箱选型" icon={<Crosshair size={18} />} />

      {/* 基础参数卡片 */}
      <div className="m-card">
        <div className="m-card-title">基础参数</div>
        <div className="m-form-grid">
          <FormField label="发动机功率" unit="kW" required
            value={power} onChange={setPower} placeholder="如 300" inputMode="decimal" />
          <FormField label="发动机转速" unit="rpm" required
            value={speed} onChange={setSpeed} placeholder="如 1500" inputMode="decimal" />
          <FormField label="目标减速比" required
            value={ratio} onChange={setRatio} placeholder="如 2.5" inputMode="decimal" />
          <FormField label="推力要求" unit="kN"
            value={thrust} onChange={setThrust} placeholder="选填" inputMode="decimal" />
        </div>

        <div className="m-form-group full">
          <label className="m-label">产品系列</label>
          <select className="m-select" value={gearboxType} onChange={e => setGearboxType(e.target.value)}>
            {seriesOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* 专业参数折叠面板 */}
      <button className="m-advanced-toggle" onClick={() => setShowAdvanced(!showAdvanced)}>
        <Settings size={16} />
        <span>专业参数</span>
        {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {(workCondition !== 'III类:扭矩变化中等' || application !== 'propulsion' || hasClutch !== null) &&
          <span className="m-param-badge">已设置</span>}
      </button>

      {showAdvanced && (
        <div className="m-card m-advanced-panel">
          {/* 工况等级 */}
          <div className="m-form-group full">
            <label className="m-label">工况等级</label>
            <div className="m-option-row">
              {workConditions.map(wc => (
                <button key={wc.value}
                  className={`m-option-btn ${workCondition === wc.value ? 'active' : ''}`}
                  onClick={() => setWorkCondition(wc.value)}>
                  {wc.label}
                </button>
              ))}
            </div>
          </div>

          {/* 应用场景 */}
          <div className="m-form-group full">
            <label className="m-label">应用场景</label>
            <div className="m-option-row">
              {appOptions.map(ao => (
                <button key={ao.value}
                  className={`m-option-btn ${application === ao.value ? 'active' : ''}`}
                  onClick={() => setApplication(ao.value)}>
                  {ao.label}
                </button>
              ))}
            </div>
          </div>

          {/* 原动机类型 */}
          <div className="m-form-group full">
            <label className="m-label">原动机类型</label>
            <div className="m-option-row">
              {[{v:'none',l:'不限'},{v:'diesel',l:'柴油机 ×1.5'},{v:'electric',l:'电机 ×1.8'}].map(pt => (
                <button key={pt.v}
                  className={`m-option-btn ${primeType === pt.v ? 'active' : ''}`}
                  onClick={() => setPrimeType(pt.v)}>
                  {pt.l}
                </button>
              ))}
            </div>
          </div>

          {/* 离合器需求 */}
          <div className="m-form-group full">
            <label className="m-label">离合器需求</label>
            <div className="m-option-row">
              {[{v:null,l:'不限'},{v:true,l:'需要离合器'},{v:false,l:'不需要'}].map(cl => (
                <button key={String(cl.v)}
                  className={`m-option-btn ${hasClutch === cl.v ? 'active' : ''}`}
                  onClick={() => setHasClutch(cl.v)}>
                  {cl.l}
                </button>
              ))}
            </div>
          </div>

          {/* 发动机配置 */}
          <div className="m-form-group full">
            <label className="m-label">发动机配置</label>
            <div className="m-option-row">
              {[{v:'single',l:'单机'},{v:'dual',l:'双机'}].map(ec => (
                <button key={ec.v}
                  className={`m-option-btn ${engineConfig === ec.v ? 'active' : ''}`}
                  onClick={() => setEngineConfig(ec.v)}>
                  {ec.l}
                </button>
              ))}
            </div>
          </div>

          {/* 旋转方向 */}
          <div className="m-form-grid">
            <div className="m-form-group">
              <label className="m-label">输入旋转方向</label>
              <select className="m-select" value={inputRotation} onChange={e => setInputRotation(e.target.value)}>
                <option value="clockwise">顺时针</option>
                <option value="counterclockwise">逆时针</option>
              </select>
            </div>
            <div className="m-form-group">
              <label className="m-label">输出旋转方向</label>
              <select className="m-select" value={outputRotation} onChange={e => setOutputRotation(e.target.value)}>
                <option value="clockwise">顺时针</option>
                <option value="counterclockwise">逆时针</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="m-form-actions" style={{ marginTop: 12 }}>
        <button className="m-btn m-btn-primary" onClick={handleSelection} disabled={loading}>
          {loading ? <><span className="m-spinner" /> 计算中...</> : <><Calculator size={18} /> 开始选型</>}
        </button>
        <button className="m-btn m-btn-ghost" onClick={handleClear}>
          <Trash2 size={16} /> 清空
        </button>
      </div>

      {/* 错误提示 */}
      {error && <div className="m-alert m-alert-error"><Info size={16} /> {error}</div>}

      {/* 选型结果 */}
      {result && result.recommendations && (
        <div ref={resultRef}>
          <SectionTitle text={`选型结果 (${result.recommendations.length}个匹配)`} icon={<Award size={18} />} />
          {result.recommendations.map((g, idx) => (
            <ResultCard key={g.model + idx} gearbox={g} index={idx}
              expanded={expandedIdx === idx}
              onToggle={() => setExpandedIdx(expandedIdx === idx ? null : idx)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== 产品库 Tab ====================
function ProductsTab({ allGearboxes, initialFilter = 'all', onFilterChange }) {
  const [search, setSearch] = useState('');
  const [filterSeries, setFilterSeries] = useState(initialFilter);
  const [sortBy, setSortBy] = useState('model');
  const [expandedModel, setExpandedModel] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(30);
  // 对比选择
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  // 收藏
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('m_favorites') || '[]'); } catch { return []; }
  });

  const toggleFavorite = useCallback((model) => {
    setFavorites(prev => {
      const next = prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model];
      localStorage.setItem('m_favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleCompare = useCallback((model) => {
    setCompareList(prev => {
      if (prev.includes(model)) return prev.filter(m => m !== model);
      if (prev.length >= 3) return prev; // 最多3个
      return [...prev, model];
    });
  }, []);

  // 响应外部过滤器变化(从首页系列点击)
  useEffect(() => {
    if (initialFilter !== 'all') {
      setFilterSeries(initialFilter);
    }
  }, [initialFilter]);

  const seriesList = useMemo(() => {
    const set = new Set();
    allGearboxes.forEach(g => {
      const s = (g.series || g.model?.replace(/[\d\-/].*/, '') || '').toUpperCase();
      if (s) set.add(s);
    });
    return ['all', ...Array.from(set).sort()];
  }, [allGearboxes]);

  const filtered = useMemo(() => {
    let list = allGearboxes;
    if (filterSeries !== 'all') {
      list = list.filter(g => {
        const s = (g.series || g.model?.replace(/[\d\-/].*/, '') || '').toUpperCase();
        return s === filterSeries;
      });
    }
    if (search.trim()) {
      const kw = search.trim().toLowerCase();
      list = list.filter(g =>
        (g.model || '').toLowerCase().includes(kw) ||
        (g.series || '').toLowerCase().includes(kw) ||
        (g.introduction || '').toLowerCase().includes(kw)
      );
    }
    list = [...list].sort((a, b) => {
      if (sortBy === 'model') return (a.model || '').localeCompare(b.model || '');
      if (sortBy === 'power') return (b.ratedPower || b.power || 0) - (a.ratedPower || a.power || 0);
      if (sortBy === 'price') return (getGearboxPrice(b.model) || 0) - (getGearboxPrice(a.model) || 0);
      return 0;
    });
    return list;
  }, [allGearboxes, search, filterSeries, sortBy]);

  useEffect(() => { setVisibleCount(30); setExpandedModel(null); }, [search, filterSeries, sortBy]);
  const visibleList = filtered.slice(0, visibleCount);

  return (
    <div className="m-page">
      {/* 系列快速过滤条 */}
      <div className="m-series-scroll">
        <button className={`m-series-btn ${filterSeries === 'all' ? 'active' : ''}`}
          onClick={() => { setFilterSeries('all'); onFilterChange?.('all'); }}>全部</button>
        {seriesList.filter(s => s !== 'all').map(s => (
          <button key={s} className={`m-series-btn ${filterSeries === s ? 'active' : ''}`}
            onClick={() => { setFilterSeries(s); onFilterChange?.(s); }}>{s}</button>
        ))}
      </div>

      {/* 搜索栏 */}
      <div className="m-search-bar">
        <div className="m-search-input">
          <Search size={18} className="m-search-icon" />
          <input type="text" placeholder="搜索型号、系列名称..." value={search}
            onChange={e => setSearch(e.target.value)} />
          {search && <button className="m-search-clear" onClick={() => setSearch('')}><X size={16} /></button>}
        </div>
        <button className={`m-filter-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}>
          <Filter size={18} />
        </button>
      </div>

      {/* 过滤器 */}
      {showFilters && (
        <div className="m-filters">
          <div className="m-filter-group">
            <span className="m-filter-label">系列</span>
            <div className="m-filter-chips">
              {seriesList.map(s => (
                <button key={s} className={`m-chip-btn ${filterSeries === s ? 'active' : ''}`}
                  onClick={() => setFilterSeries(s)}>
                  {s === 'all' ? '全部' : s}
                </button>
              ))}
            </div>
          </div>
          <div className="m-filter-group">
            <span className="m-filter-label">排序</span>
            <div className="m-filter-chips">
              {[['model','型号'],['power','功率'],['price','价格']].map(([v,l]) => (
                <button key={v} className={`m-chip-btn ${sortBy === v ? 'active' : ''}`}
                  onClick={() => setSortBy(v)}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 操作工具栏 */}
      <div className="m-toolbar">
        <div className="m-count">
          共 <strong>{filtered.length}</strong> 个型号
          {search && <span> · "{search}"</span>}
        </div>
        <div className="m-toolbar-actions">
          <button className={`m-toolbar-btn ${compareMode ? 'active' : ''}`}
            onClick={() => { setCompareMode(!compareMode); if (compareMode) setCompareList([]); }}>
            <BarChart3 size={14} /> 对比{compareMode && compareList.length > 0 ? `(${compareList.length})` : ''}
          </button>
        </div>
      </div>

      {/* 对比浮动条 */}
      {compareMode && compareList.length > 0 && (
        <div className="m-compare-bar">
          <span>已选 {compareList.length}/3: {compareList.join(', ')}</span>
          <button className="m-btn m-btn-primary" style={{padding:'8px 14px',fontSize:'.82rem'}}
            onClick={() => setShowCompare(true)} disabled={compareList.length < 2}>
            开始对比
          </button>
        </div>
      )}

      {/* 对比弹窗 */}
      {showCompare && <CompareModal models={compareList} allGearboxes={allGearboxes}
        onClose={() => setShowCompare(false)} />}

      {/* 产品列表 */}
      {visibleList.length === 0 ? (
        <div className="m-empty"><Package size={48} /><p>未找到匹配的产品</p></div>
      ) : (
        visibleList.map(g => (
          <ProductCard key={g.model} gearbox={g}
            expanded={expandedModel === g.model}
            onToggle={() => setExpandedModel(expandedModel === g.model ? null : g.model)}
            compareMode={compareMode}
            isCompared={compareList.includes(g.model)}
            onCompare={() => toggleCompare(g.model)}
            isFavorite={favorites.includes(g.model)}
            onFavorite={() => toggleFavorite(g.model)} />
        ))
      )}

      {visibleCount < filtered.length && (
        <button className="m-load-more" onClick={() => setVisibleCount(c => Math.min(c + 30, filtered.length))}>
          加载更多 ({filtered.length - visibleCount} 剩余)
        </button>
      )}
    </div>
  );
}

// ==================== 文档 Tab ====================
function DocsTab({ switchToDesktopAt }) {
  const sections = [
    { title: '文档中心', Icon: FileText, items: [
      { Icon: FileText, label: '技术询单', desc: '完整技术询价单生成', hash: '/inquiry' },
      { Icon: BarChart3, label: '报价单', desc: '产品报价管理', hash: '/quotation' },
      { Icon: FileText, label: '技术协议', desc: '技术协议文档生成', hash: '/agreement' },
      { Icon: FileText, label: '销售合同', desc: '销售合同管理', hash: '/contract' },
    ]},
    { title: '资料库', Icon: BookOpen, items: [
      { Icon: Image, label: '外形图库', desc: '产品外形图PDF', hash: '/drawings' },
      { Icon: BookOpen, label: '说明书库', desc: '产品使用说明书', hash: '/manuals' },
      { Icon: FileText, label: '协议模板库', desc: '历史技术协议模板', hash: '/templates' },
      { Icon: Settings, label: '配机案例', desc: '发动机匹配参考', hash: '/engine-cases' },
    ]},
    { title: '推进系统', Icon: Compass, items: [
      { Icon: RotateCcw, label: '可调桨(CPP)', desc: 'CPP推进系统选型', hash: '/cpp' },
      { Icon: Compass, label: '全回转推进器', desc: '全回转选型计算', hash: '/azimuth' },
      { Icon: Anchor, label: '侧推器', desc: '侧推器规格选型', hash: '/thruster' },
      { Icon: Wrench, label: '轴系设计', desc: '传动轴系计算', hash: '/shaft' },
    ]},
    { title: '分析工具', Icon: BarChart3, items: [
      { Icon: Zap, label: '扭振分析', desc: '扭振计算与分析', hash: '/torsional' },
      { Icon: Zap, label: '能效分析', desc: '能效对比分析', hash: '/energy' },
      { Icon: BarChart3, label: '数据统计', desc: '选型数据统计', hash: '/statistics' },
      { Icon: BarChart3, label: '竞品对比', desc: '16品牌竞品分析', hash: '/competitor' },
    ]},
  ];

  return (
    <div className="m-page">
      <div className="m-notice">
        <Info size={16} />
        <span>点击功能项可切换至桌面版直接使用</span>
      </div>

      {sections.map((sec, si) => (
        <div key={si} className="m-doc-section">
          <SectionTitle text={sec.title} icon={<sec.Icon size={18} />} />
          <div className="m-doc-list">
            {sec.items.map((item, ii) => (
              <div key={ii} className="m-doc-item" onClick={() => switchToDesktopAt(item.hash)}>
                <div className="m-doc-icon"><item.Icon size={20} /></div>
                <div className="m-doc-text">
                  <div className="m-doc-label">{item.label}</div>
                  <div className="m-doc-desc">{item.desc}</div>
                </div>
                <ChevronRight size={16} className="m-doc-arrow" />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="m-switch-prompt">
        <p>需要完整功能？</p>
        <button className="m-btn m-btn-primary" onClick={() => switchToDesktopAt('')}>
          <Monitor size={18} /> 切换到桌面版
        </button>
      </div>
    </div>
  );
}

// ==================== 个人中心 Tab ====================
function ProfileTab({ user, onLogout, onSwitchToDesktop, isDark, toggleTheme, totalModels }) {
  const [showAbout, setShowAbout] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('m_favorites') || '[]'); } catch { return []; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('selectionHistory') || '[]'); } catch { return []; }
  });

  const removeFavorite = useCallback((model) => {
    setFavorites(prev => {
      const next = prev.filter(m => m !== model);
      localStorage.setItem('m_favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem('selectionHistory');
    setHistory([]);
  }, []);

  const storageSize = useMemo(() => {
    try {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        total += (localStorage.getItem(key) || '').length;
      }
      return (total / 1024).toFixed(1) + ' KB';
    } catch (e) { return '未知'; }
  }, []);

  return (
    <div className="m-page">
      {/* 用户卡片 */}
      <div className="m-profile-card">
        <div className="m-avatar"><User size={32} /></div>
        <div className="m-profile-info">
          <h3>{user?.displayName || user?.username || '用户'}</h3>
          <span className="m-role">{user?.role || '普通用户'}</span>
        </div>
      </div>

      {/* 功能入口 */}
      <div className="m-profile-stats">
        <div className="m-profile-stat" onClick={() => setShowFavorites(!showFavorites)}>
          <Star size={20} color="#f59e0b" />
          <span className="m-stat-num">{favorites.length}</span>
          <span className="m-stat-label">收藏</span>
        </div>
        <div className="m-profile-stat" onClick={() => setShowHistory(!showHistory)}>
          <Clock size={20} color="#1976d2" />
          <span className="m-stat-num">{history.length}</span>
          <span className="m-stat-label">选型记录</span>
        </div>
        <div className="m-profile-stat">
          <Database size={20} color="#2e7d32" />
          <span className="m-stat-num">{totalModels}</span>
          <span className="m-stat-label">型号库</span>
        </div>
      </div>

      {/* 收藏列表 */}
      {showFavorites && (
        <div className="m-section-block">
          <SectionTitle text={`我的收藏 (${favorites.length})`} icon={<Star size={16} />} />
          {favorites.length === 0 ? (
            <div className="m-empty-sm">暂无收藏，在产品库中点击星标添加</div>
          ) : (
            <div className="m-fav-list">
              {favorites.map(model => (
                <div key={model} className="m-fav-item">
                  <strong>{model}</strong>
                  <button className="m-fav-remove" onClick={() => removeFavorite(model)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 选型历史 */}
      {showHistory && (
        <div className="m-section-block">
          <div className="m-section-header">
            <SectionTitle text={`选型历史 (${history.length})`} icon={<Clock size={16} />} />
            {history.length > 0 && (
              <button className="m-text-btn" onClick={clearHistory}>清空</button>
            )}
          </div>
          {history.length === 0 ? (
            <div className="m-empty-sm">暂无选型记录</div>
          ) : (
            <div className="m-history-detail-list">
              {history.slice(0, 20).map((item, idx) => (
                <div key={idx} className="m-history-detail">
                  <div className="m-hd-top">
                    <strong>{item.model || '选型记录'}</strong>
                    <span className="m-hd-time">
                      {item.timestamp ? new Date(item.timestamp).toLocaleString('zh-CN', {month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}) : ''}
                    </span>
                  </div>
                  <div className="m-hd-params">
                    {item.power || item.enginePower ? <span>{item.power || item.enginePower}kW</span> : null}
                    {item.speed || item.engineSpeed ? <span>{item.speed || item.engineSpeed}rpm</span> : null}
                    {item.ratio ? <span>i={item.ratio}</span> : null}
                    {item.gearboxType && item.gearboxType !== 'auto' ? <span>{item.gearboxType}</span> : null}
                    {item.count ? <span>{item.count}个匹配</span> : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 设置项 */}
      <SectionTitle text="设置" />
      <div className="m-settings">
        <div className="m-setting-item" onClick={toggleTheme}>
          <div className="m-setting-left">
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
            <span>深色模式</span>
          </div>
          <div className={`m-toggle ${isDark ? 'on' : ''}`}><div className="m-toggle-thumb" /></div>
        </div>
        <div className="m-setting-item" onClick={onSwitchToDesktop}>
          <div className="m-setting-left"><Monitor size={20} /><span>切换到桌面版</span></div>
          <ChevronRight size={18} />
        </div>
        <div className="m-setting-item" onClick={() => setShowAbout(!showAbout)}>
          <div className="m-setting-left"><Info size={20} /><span>关于系统</span></div>
          {showAbout ? <ChevronUp size={18} /> : <ChevronRight size={18} />}
        </div>
      </div>

      {showAbout && (
        <div className="m-about">
          <AboutRow label="系统名称" value="船用齿轮箱选型系统" />
          <AboutRow label="数据版本" value="v37" />
          <AboutRow label="型号数量" value={totalModels + ' 个'} />
          <AboutRow label="本地存储" value={storageSize} />
          <AboutRow label="移动端版本" value="2.0.0" />
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <button className="m-btn m-btn-danger full" onClick={onLogout}>
          <LogOut size={18} /> 退出登录
        </button>
      </div>
    </div>
  );
}

// ==================== 子组件 ====================

function SectionTitle({ text, icon }) {
  return (
    <h3 className="m-section-title">
      {icon} {text}
    </h3>
  );
}

function StatCard({ number, label, onClick }) {
  return (
    <div className="m-stat-card" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <div className="m-stat-num">{number}</div>
      <div className="m-stat-label">{label}</div>
    </div>
  );
}

function ActionBtn({ Icon, label, color, onClick }) {
  return (
    <button className="m-action-btn" onClick={onClick}>
      <div className="m-action-icon" style={{ background: color }}><Icon size={22} color="#fff" /></div>
      <span>{label}</span>
    </button>
  );
}

function FormField({ label, unit, required, value, onChange, placeholder, inputMode }) {
  return (
    <div className="m-form-group">
      <label className="m-label">
        {label}{unit && <span className="m-unit">({unit})</span>}
        {required && <span className="m-required">*</span>}
      </label>
      <input className="m-input" type="number" inputMode={inputMode || 'decimal'}
        placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function ResultCard({ gearbox: g, index, expanded, onToggle }) {
  const price = getGearboxPrice(g.model) || g.price || g.marketPrice;
  const isTop = index === 0;

  return (
    <div className={`m-result-card ${isTop ? 'top' : ''}`} onClick={onToggle}>
      <div className="m-result-header">
        <div className="m-result-title">
          {isTop && <span className="m-badge-rec">推荐</span>}
          <strong>{g.model}</strong>
        </div>
        <span className="m-result-price">{formatPrice(price)}</span>
      </div>
      <div className="m-result-specs">
        <span><Zap size={12} /> {g.ratedPower || g.power || '-'}kW</span>
        <span><RotateCcw size={12} /> {g.ratioRange || g.ratio || '-'}</span>
        <span><Gauge size={12} /> {g.maxInputSpeed || g.maxSpeed || '-'}rpm</span>
      </div>
      {expanded && (
        <div className="m-result-details" onClick={e => e.stopPropagation()}>
          <DetailGrid gearbox={g} />
        </div>
      )}
      <div className="m-expand-hint">
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        <span>{expanded ? '收起' : '展开详情'}</span>
      </div>
    </div>
  );
}

function ProductCard({ gearbox: g, expanded, onToggle, compareMode, isCompared, onCompare, isFavorite, onFavorite }) {
  const price = getGearboxPrice(g.model) || g.price || g.marketPrice;
  const series = (g.series || g._series || '').toUpperCase();

  return (
    <div className={`m-product-card ${expanded ? 'expanded' : ''} ${isCompared ? 'compared' : ''}`} onClick={onToggle}>
      <div className="m-product-main">
        <div className="m-product-left">
          {compareMode && (
            <button className={`m-check-btn ${isCompared ? 'checked' : ''}`}
              onClick={e => { e.stopPropagation(); onCompare?.(); }}>
              {isCompared ? '✓' : ''}
            </button>
          )}
          <span className="m-series-badge">{series}</span>
          <strong className="m-product-model">{g.model}</strong>
        </div>
        <div className="m-product-right">
          <span className="m-product-price">{formatPrice(price)}</span>
          <button className={`m-fav-btn ${isFavorite ? 'active' : ''}`}
            onClick={e => { e.stopPropagation(); onFavorite?.(); }}
            aria-label={isFavorite ? '取消收藏' : '收藏'}>
            <Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>
      <div className="m-product-tags">
        {(g.ratedPower || g.power || g.minPower) ? <span className="m-tag"><Zap size={11} /> {g.ratedPower || g.power || (g.minPower + '~' + g.maxPower)}kW</span> : null}
        {(g.maxInputSpeed || g.maxSpeed || g.inputSpeedRange) ? <span className="m-tag"><Gauge size={11} /> {g.maxInputSpeed || g.maxSpeed || (Array.isArray(g.inputSpeedRange) ? g.inputSpeedRange[0] + '~' + g.inputSpeedRange[g.inputSpeedRange.length-1] : g.inputSpeedRange)}rpm</span> : null}
        {(g.ratios || g.ratioRange || g.ratio) ? <span className="m-tag"><RotateCcw size={11} /> {g.ratioRange || (Array.isArray(g.ratios) ? g.ratios[0] + '~' + g.ratios[g.ratios.length-1] : g.ratio) || '-'}</span> : null}
        {g.weight ? <span className="m-tag"><Box size={11} /> {g.weight}kg</span> : null}
        {g.thrust ? <span className="m-tag"><Anchor size={11} /> {g.thrust}kN</span> : null}
      </div>
      {expanded && (
        <div className="m-product-expanded" onClick={e => e.stopPropagation()}>
          <DetailGrid gearbox={g} full />
        </div>
      )}
    </div>
  );
}

function formatValue(val) {
  if (val === null || val === undefined || val === '') return '-';
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

// ==================== 对比弹窗 ====================
function CompareModal({ models, allGearboxes, onClose }) {
  const items = models.map(m => allGearboxes.find(g => g.model === m)).filter(Boolean);
  const fields = [
    ['型号', g => g.model],
    ['系列', g => (g.series || g._series || '').toUpperCase()],
    ['额定功率', g => g.ratedPower || g.power ? (g.ratedPower || g.power) + ' kW' : '-'],
    ['转速范围', g => Array.isArray(g.inputSpeedRange) ? g.inputSpeedRange[0]+'~'+g.inputSpeedRange[g.inputSpeedRange.length-1]+' rpm' : '-'],
    ['减速比', g => Array.isArray(g.ratios) && g.ratios.length ? g.ratios[0]+'~'+g.ratios[g.ratios.length-1] : (g.ratioRange || '-')],
    ['推力', g => g.thrust ? g.thrust + ' kN' : '-'],
    ['重量', g => g.weight ? g.weight + ' kg' : '-'],
    ['中心距', g => g.centerDistance ? g.centerDistance + ' mm' : '-'],
    ['尺寸', g => g.dimensions || '-'],
    ['离合器', g => g.hasClutch ? '有' : (g.hasClutch === false ? '无' : '-')],
    ['控制方式', g => g.controlType || '-'],
    ['价格', g => formatPrice(getGearboxPrice(g.model) || g.price || g.marketPrice)],
  ];

  return (
    <div className="m-modal-overlay" onClick={onClose}>
      <div className="m-modal" onClick={e => e.stopPropagation()}>
        <div className="m-modal-header">
          <h3>型号对比</h3>
          <button className="m-modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="m-compare-table-wrap">
          <table className="m-compare-table">
            <thead>
              <tr>
                <th>参数</th>
                {items.map(g => <th key={g.model}>{g.model}</th>)}
              </tr>
            </thead>
            <tbody>
              {fields.map(([label, getter]) => (
                <tr key={label}>
                  <td className="m-compare-label">{label}</td>
                  {items.map(g => <td key={g.model}>{getter(g)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DetailGrid({ gearbox: g, full }) {
  const tc = g.transferCapacity || g.transmissionCapacityPerRatio;
  const speedRange = g.inputSpeedRange ? (Array.isArray(g.inputSpeedRange) ? g.inputSpeedRange[0] + ' ~ ' + g.inputSpeedRange[g.inputSpeedRange.length-1] : g.inputSpeedRange) : null;
  const ratioStr = g.ratioRange || (Array.isArray(g.ratios) && g.ratios.length > 0 ? g.ratios[0] + ' ~ ' + g.ratios[g.ratios.length-1] : g.ratio);
  const items = [
    ['型号', g.model],
    ['系列', (g.series || g._series || '').toUpperCase() || '-'],
    ['额定功率', g.ratedPower || g.power ? (g.ratedPower || g.power) + ' kW' : (g.minPower ? g.minPower + ' ~ ' + g.maxPower + ' kW' : '-')],
    ['转速范围', speedRange ? speedRange + ' rpm' : (g.maxInputSpeed || g.maxSpeed ? (g.maxInputSpeed || g.maxSpeed) + ' rpm' : '-')],
    ['减速比', formatValue(ratioStr)],
    ['传递能力', Array.isArray(tc) ? tc[0] + ' ~ ' + tc[tc.length-1] : formatValue(tc)],
    ['推力', g.thrust ? g.thrust + ' kN' : '-'],
    ['重量', g.weight ? g.weight + ' kg' : '-'],
  ];
  if (full) {
    items.push(
      ['尺寸(LxWxH)', g.dimensions || '-'],
      ['离合器', g.hasClutch ? '有' : (g.hasClutch === false ? '无' : '-')],
      ['旋转方向', g.rotationDirection || '-'],
      ['控制方式', g.controlType || '-'],
      ['船级社认证', g.certifications || '-'],
      ['适用场景', g.applications || g.application || '-'],
    );
  }
  return (
    <div className="m-detail-grid">
      {items.map(([label, value]) => (
        <div key={label} className="m-detail-row">
          <span className="m-detail-label">{label}</span>
          <span className="m-detail-value">{value}</span>
        </div>
      ))}
      {full && g.introduction && (
        <div className="m-detail-intro">
          <strong>产品简介</strong>
          <p>{typeof g.introduction === 'string' ? g.introduction : '-'}</p>
        </div>
      )}
    </div>
  );
}

function AboutRow({ label, value }) {
  return (
    <div className="m-about-row">
      <span>{label}</span><span>{value}</span>
    </div>
  );
}
