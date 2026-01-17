import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Card, Row, Col, Form, InputGroup, Button, Badge,
  ButtonGroup, Dropdown, Spinner
} from 'react-bootstrap';
import {
  gearboxDwgDrawings,
  couplingDwgDrawings,
  getDwgDownloadUrl
} from '../data/outlineDrawings';
import {
  isFavorite,
  toggleFavorite
} from '../utils/favorites';

// 骨架屏组件
const SkeletonCard = () => (
  <Card className="h-100" style={{ border: '1px solid #dee2e6' }}>
    <div style={{ height: '150px', backgroundColor: '#e9ecef', position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          animation: 'skeleton-shimmer 1.5s infinite'
        }}
      />
    </div>
    <Card.Body className="p-2">
      <div style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '70%', marginBottom: '8px' }} />
      <div style={{ height: '12px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '40%' }} />
    </Card.Body>
  </Card>
);

// 骨架屏动画样式
const skeletonStyle = document.createElement('style');
skeletonStyle.textContent = `
  @keyframes skeleton-shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;
if (!document.querySelector('#skeleton-style')) {
  skeletonStyle.id = 'skeleton-style';
  document.head.appendChild(skeletonStyle);
}

// 缩略图卡片组件
const ThumbnailCard = ({ model, files, type, onSelect, onToggleFavorite, isSelected, onToggleSelect }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const iframeRef = useRef(null);
  const favorited = isFavorite(model);
  const firstFile = files[0];

  // 使用ShareCAD获取预览URL
  const previewUrl = useMemo(() => {
    if (!firstFile) return null;
    const downloadUrl = getDwgDownloadUrl(firstFile.filePath);
    return `//sharecad.org/cadframe/load?url=${encodeURIComponent(downloadUrl)}`;
  }, [firstFile]);

  // iframe加载完成
  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(false);
  }, []);

  // iframe加载错误
  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  return (
    <Card
      className="h-100 thumbnail-card"
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: isSelected ? '2px solid #0d6efd' : favorited ? '2px solid #ffc107' : '1px solid #dee2e6',
        backgroundColor: isSelected ? 'rgba(13, 110, 253, 0.05)' : 'transparent'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* 批量选择复选框 */}
      {onToggleSelect && (
        <Form.Check
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onToggleSelect(model, e.nativeEvent.shiftKey);
          }}
          style={{
            position: 'absolute',
            top: '5px',
            left: '5px',
            zIndex: 3
          }}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      {/* 缩略图预览区 */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '150px',
          backgroundColor: '#f5f5f5',
          overflow: 'hidden'
        }}
        onClick={() => onSelect(model, files)}
      >
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              zIndex: 1
            }}
          >
            <Spinner animation="border" size="sm" variant="secondary" />
          </div>
        )}
        {error ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: '#6c757d'
            }}
          >
            <i className="bi bi-file-earmark-binary" style={{ fontSize: '32px' }}></i>
            <small className="mt-1">{model}</small>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={previewUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              pointerEvents: 'none'
            }}
            title={`${model} 缩略图`}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>

      {/* 信息区 */}
      <Card.Body className="p-2" onClick={() => onSelect(model, files)}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong className="text-primary">{model}</strong>
            <div className="small text-muted">
              {files.length}个文件
            </div>
          </div>
          <div className="d-flex align-items-center">
            <Badge bg={type === 'coupling' ? 'success' : 'primary'} className="small">
              {type === 'coupling' ? '联轴器' : '齿轮箱'}
            </Badge>
          </div>
        </div>
      </Card.Body>

      {/* 收藏按钮 */}
      <Button
        variant={favorited ? 'warning' : 'outline-secondary'}
        size="sm"
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          padding: '2px 6px',
          zIndex: 2
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(model, type);
        }}
        title={favorited ? '取消收藏' : '添加收藏'}
      >
        <i className={`bi ${favorited ? 'bi-star-fill' : 'bi-star'}`}></i>
      </Button>
    </Card>
  );
};

// 主网格组件
const DwgThumbnailGrid = ({ onSelectFile }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'gearbox', 'coupling'
  const [filterSeries, setFilterSeries] = useState('');
  const [sortBy, setSortBy] = useState('model'); // 'model', 'files', 'series'
  const [favoritesVersion, setFavoritesVersion] = useState(0);
  const [visibleCount, setVisibleCount] = useState(24); // 初始显示24个
  const [selectedModels, setSelectedModels] = useState(new Set());
  const [batchMode, setBatchMode] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const containerRef = useRef(null);

  // 初始加载骨架屏
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // 收集所有型号数据
  const allModels = useMemo(() => {
    const models = [];

    // 齿轮箱DWG
    Object.entries(gearboxDwgDrawings).forEach(([model, files]) => {
      models.push({
        model,
        files,
        type: 'gearbox',
        series: files[0]?.series || model.replace(/\d+.*$/, '') || 'OTHER',
        fileCount: files.length
      });
    });

    // 联轴器DWG
    Object.entries(couplingDwgDrawings).forEach(([model, files]) => {
      models.push({
        model,
        files,
        type: 'coupling',
        series: files[0]?.series || model.replace(/\d+.*$/, '') || 'OTHER',
        fileCount: files.length
      });
    });

    return models;
  }, []);

  // 获取所有系列
  const allSeries = useMemo(() => {
    const seriesSet = new Set();
    allModels.forEach(item => {
      if (item.series) seriesSet.add(item.series);
    });
    return Array.from(seriesSet).sort();
  }, [allModels]);

  // 过滤和排序
  const filteredModels = useMemo(() => {
    let result = [...allModels];

    // 按类型过滤
    if (filterType !== 'all') {
      result = result.filter(item => item.type === filterType);
    }

    // 按系列过滤
    if (filterSeries) {
      result = result.filter(item => item.series === filterSeries);
    }

    // 按关键词搜索
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.trim().toUpperCase();
      result = result.filter(item =>
        item.model.toUpperCase().includes(keyword) ||
        item.series.toUpperCase().includes(keyword)
      );
    }

    // 排序
    switch (sortBy) {
      case 'files':
        result.sort((a, b) => b.fileCount - a.fileCount);
        break;
      case 'series':
        result.sort((a, b) => a.series.localeCompare(b.series) || a.model.localeCompare(b.model));
        break;
      default:
        result.sort((a, b) => a.model.localeCompare(b.model));
    }

    return result;
  }, [allModels, filterType, filterSeries, searchKeyword, sortBy]);

  // 懒加载更多
  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 24, filteredModels.length));
  }, [filteredModels.length]);

  // 滚动加载和返回顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollHeight - scrollTop <= clientHeight + 200) {
          loadMore();
        }
        // 显示/隐藏返回顶部按钮
        setShowBackToTop(scrollTop > 300);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [loadMore]);

  // 返回顶部
  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // 批量选择处理 (支持Shift多选)
  const handleToggleSelect = useCallback((model, isShiftKey) => {
    setSelectedModels(prev => {
      const newSet = new Set(prev);

      if (isShiftKey && lastSelectedIndex !== null) {
        // Shift+点击：选择范围
        const currentIndex = filteredModels.findIndex(m => m.model === model);
        const start = Math.min(lastSelectedIndex, currentIndex);
        const end = Math.max(lastSelectedIndex, currentIndex);

        for (let i = start; i <= end; i++) {
          newSet.add(filteredModels[i].model);
        }
      } else {
        // 普通点击：切换选择
        if (newSet.has(model)) {
          newSet.delete(model);
        } else {
          newSet.add(model);
        }
        setLastSelectedIndex(filteredModels.findIndex(m => m.model === model));
      }

      return newSet;
    });
  }, [filteredModels, lastSelectedIndex]);

  // 全选/取消全选
  const handleSelectAll = useCallback(() => {
    if (selectedModels.size === filteredModels.length) {
      setSelectedModels(new Set());
    } else {
      setSelectedModels(new Set(filteredModels.map(m => m.model)));
    }
  }, [filteredModels, selectedModels.size]);

  // 批量收藏
  const handleBatchFavorite = useCallback(() => {
    selectedModels.forEach(model => {
      const item = allModels.find(m => m.model === model);
      if (item && !isFavorite(model)) {
        toggleFavorite(model, item.type);
      }
    });
    setFavoritesVersion(v => v + 1);
    setSelectedModels(new Set());
    setBatchMode(false);
  }, [selectedModels, allModels]);

  // 批量下载
  const handleBatchDownload = useCallback(() => {
    selectedModels.forEach((model, index) => {
      const item = allModels.find(m => m.model === model);
      if (item && item.files.length > 0) {
        // 延迟下载避免浏览器阻止
        setTimeout(() => {
          window.open(getDwgDownloadUrl(item.files[0].filePath), '_blank');
        }, index * 500);
      }
    });
  }, [selectedModels, allModels]);

  // 退出批量模式
  const exitBatchMode = useCallback(() => {
    setBatchMode(false);
    setSelectedModels(new Set());
    setLastSelectedIndex(null);
  }, []);

  // 重置visibleCount当过滤条件改变
  useEffect(() => {
    setVisibleCount(24);
  }, [filterType, filterSeries, searchKeyword, sortBy]);

  // 可见项
  const visibleModels = filteredModels.slice(0, visibleCount);

  // 处理收藏切换
  const handleToggleFavorite = useCallback((model, type) => {
    toggleFavorite(model, type);
    setFavoritesVersion(v => v + 1);
  }, []);

  // 处理选择
  const handleSelect = useCallback((model, files) => {
    if (onSelectFile && files.length > 0) {
      onSelectFile(files[0]);
    }
  }, [onSelectFile]);

  // 统计
  const stats = useMemo(() => ({
    total: allModels.length,
    gearbox: allModels.filter(m => m.type === 'gearbox').length,
    coupling: allModels.filter(m => m.type === 'coupling').length,
    filtered: filteredModels.length
  }), [allModels, filteredModels]);

  return (
    <div className="dwg-thumbnail-grid">
      {/* 工具栏 */}
      <Card className="mb-3">
        <Card.Body className="py-2">
          <Row className="align-items-center g-2">
            {/* 搜索框 */}
            <Col md={4}>
              <InputGroup size="sm">
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="搜索型号..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                {searchKeyword && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => setSearchKeyword('')}
                  >
                    <i className="bi bi-x"></i>
                  </Button>
                )}
              </InputGroup>
            </Col>

            {/* 类型筛选 */}
            <Col md={3}>
              <ButtonGroup size="sm" className="w-100">
                <Button
                  variant={filterType === 'all' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilterType('all')}
                >
                  全部 ({stats.total})
                </Button>
                <Button
                  variant={filterType === 'gearbox' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilterType('gearbox')}
                >
                  齿轮箱 ({stats.gearbox})
                </Button>
                <Button
                  variant={filterType === 'coupling' ? 'success' : 'outline-success'}
                  onClick={() => setFilterType('coupling')}
                >
                  联轴器 ({stats.coupling})
                </Button>
              </ButtonGroup>
            </Col>

            {/* 系列筛选 */}
            <Col md={2}>
              <Form.Select
                size="sm"
                value={filterSeries}
                onChange={(e) => setFilterSeries(e.target.value)}
              >
                <option value="">所有系列</option>
                {allSeries.map(series => (
                  <option key={series} value={series}>{series}系列</option>
                ))}
              </Form.Select>
            </Col>

            {/* 排序 */}
            <Col md={2}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm" className="w-100">
                  <i className="bi bi-sort-down me-1"></i>
                  {sortBy === 'model' ? '型号' : sortBy === 'files' ? '文件数' : '系列'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item active={sortBy === 'model'} onClick={() => setSortBy('model')}>
                    按型号
                  </Dropdown.Item>
                  <Dropdown.Item active={sortBy === 'files'} onClick={() => setSortBy('files')}>
                    按文件数
                  </Dropdown.Item>
                  <Dropdown.Item active={sortBy === 'series'} onClick={() => setSortBy('series')}>
                    按系列
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>

            {/* 批量模式和统计 */}
            <Col md={1} className="text-end">
              <Button
                variant={batchMode ? 'primary' : 'outline-secondary'}
                size="sm"
                onClick={() => batchMode ? exitBatchMode() : setBatchMode(true)}
                title={batchMode ? '退出批量模式' : '进入批量模式'}
              >
                <i className={`bi ${batchMode ? 'bi-x-lg' : 'bi-check2-square'}`}></i>
              </Button>
            </Col>
          </Row>

          {/* 批量操作工具栏 */}
          {batchMode && (
            <Row className="mt-2 pt-2 border-top align-items-center">
              <Col md={6} className="d-flex gap-2 align-items-center">
                <Button variant="outline-secondary" size="sm" onClick={handleSelectAll}>
                  <i className="bi bi-check2-all me-1"></i>
                  {selectedModels.size === filteredModels.length ? '取消全选' : '全选'}
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  disabled={selectedModels.size === 0}
                  onClick={handleBatchFavorite}
                >
                  <i className="bi bi-star-fill me-1"></i>
                  批量收藏 ({selectedModels.size})
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={selectedModels.size === 0}
                  onClick={handleBatchDownload}
                >
                  <i className="bi bi-download me-1"></i>
                  批量下载
                </Button>
              </Col>
              <Col md={6} className="text-end">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  按住 Shift 点击可选择范围
                </small>
                <Badge bg="info" className="ms-2">{selectedModels.size} / {stats.filtered} 已选</Badge>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* 网格容器 */}
      <div
        ref={containerRef}
        style={{
          maxHeight: 'calc(100vh - 350px)',
          overflowY: 'auto',
          paddingRight: '5px',
          position: 'relative'
        }}
      >
        <Row xs={2} sm={3} md={4} lg={6} className="g-3">
          {/* 初始加载骨架屏 */}
          {initialLoading ? (
            Array.from({ length: 12 }).map((_, index) => (
              <Col key={`skeleton-${index}`}>
                <SkeletonCard />
              </Col>
            ))
          ) : (
            visibleModels.map(item => (
              <Col key={item.model}>
                <ThumbnailCard
                  model={item.model}
                  files={item.files}
                  type={item.type}
                  onSelect={handleSelect}
                  onToggleFavorite={handleToggleFavorite}
                  isSelected={selectedModels.has(item.model)}
                  onToggleSelect={batchMode ? handleToggleSelect : null}
                />
              </Col>
            ))
          )}
        </Row>

        {/* 加载更多提示 */}
        {!initialLoading && visibleCount < filteredModels.length && (
          <div className="text-center py-3">
            <Button variant="outline-primary" onClick={loadMore}>
              加载更多 ({visibleCount}/{filteredModels.length})
            </Button>
          </div>
        )}

        {/* 空状态 */}
        {!initialLoading && filteredModels.length === 0 && (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox" style={{ fontSize: '48px' }}></i>
            <p className="mt-2">未找到匹配的DWG文件</p>
          </div>
        )}
      </div>

      {/* 返回顶部按钮 */}
      {showBackToTop && (
        <Button
          variant="primary"
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="返回顶部"
        >
          <i className="bi bi-arrow-up" style={{ fontSize: '20px' }}></i>
        </Button>
      )}
    </div>
  );
};

export default DwgThumbnailGrid;
