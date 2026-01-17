import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card, ListGroup, Button, Badge, Form, Modal,
  InputGroup, Dropdown, ButtonGroup, Alert, Row, Col, ProgressBar
} from 'react-bootstrap';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  getFavoritesList,
  getAllTags,
  removeFavorite,
  updateFavoriteNotes,
  updateFavoriteTags,
  exportFavorites,
  importFavorites,
  clearAllFavorites,
  getFavoritesCount
} from '../utils/favorites';

// 颜色配置
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const FavoritesPanel = ({ onSelectModel, dwgTechParams }) => {
  const [favorites, setFavorites] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [filterTag, setFilterTag] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [editingModel, setEditingModel] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editTags, setEditTags] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importMerge, setImportMerge] = useState(true);
  const [message, setMessage] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'stats', 'recent'
  const [recentViews, setRecentViews] = useState([]);
  const [showStats, setShowStats] = useState(true);

  // 加载最近浏览记录
  useEffect(() => {
    try {
      const savedViews = localStorage.getItem('dwg_recent_views');
      if (savedViews) {
        setRecentViews(JSON.parse(savedViews).slice(0, 10));
      }
    } catch (e) {
      console.warn('加载最近浏览失败:', e);
    }
  }, []);

  // 统计数据 - 按类型分布
  const typeStats = useMemo(() => {
    const gearbox = favorites.filter(f => f.type === 'gearbox').length;
    const coupling = favorites.filter(f => f.type === 'coupling').length;
    return [
      { name: '齿轮箱', value: gearbox },
      { name: '联轴器', value: coupling }
    ].filter(item => item.value > 0);
  }, [favorites]);

  // 统计数据 - 按系列分布
  const seriesStats = useMemo(() => {
    const seriesMap = {};
    favorites.forEach(item => {
      if (dwgTechParams && dwgTechParams[item.model]) {
        const series = dwgTechParams[item.model].series || '其他';
        seriesMap[series] = (seriesMap[series] || 0) + 1;
      } else {
        seriesMap['其他'] = (seriesMap['其他'] || 0) + 1;
      }
    });
    return Object.entries(seriesMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [favorites, dwgTechParams]);

  // 统计数据 - 按标签分布
  const tagStats = useMemo(() => {
    const tagMap = {};
    favorites.forEach(item => {
      (item.tags || []).forEach(tag => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });
    return Object.entries(tagMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [favorites]);

  // 刷新收藏列表
  const refreshFavorites = useCallback(() => {
    setFavorites(getFavoritesList());
    setAllTags(getAllTags());
  }, []);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  // 过滤收藏
  const filteredFavorites = favorites.filter(item => {
    // 按标签过滤
    if (filterTag && !(item.tags || []).includes(filterTag)) return false;
    // 按类型过滤
    if (filterType !== 'all' && item.type !== filterType) return false;
    // 按搜索文本过滤
    if (searchText) {
      const search = searchText.toLowerCase();
      if (!item.model.toLowerCase().includes(search) &&
          !(item.notes || '').toLowerCase().includes(search)) {
        return false;
      }
    }
    return true;
  });

  // 移除收藏
  const handleRemove = (model) => {
    if (window.confirm(`确定要取消收藏 ${model} 吗？`)) {
      removeFavorite(model);
      refreshFavorites();
      setMessage({ type: 'success', text: `已取消收藏 ${model}` });
      setTimeout(() => setMessage(null), 2000);
    }
  };

  // 开始编辑
  const handleStartEdit = (item) => {
    setEditingModel(item.model);
    setEditNotes(item.notes || '');
    setEditTags((item.tags || []).join(', '));
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (editingModel) {
      updateFavoriteNotes(editingModel, editNotes);
      const tagsArray = editTags.split(',').map(t => t.trim()).filter(t => t);
      updateFavoriteTags(editingModel, tagsArray);
      refreshFavorites();
      setEditingModel(null);
      setMessage({ type: 'success', text: '保存成功' });
      setTimeout(() => setMessage(null), 2000);
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingModel(null);
  };

  // 导出收藏
  const handleExport = () => {
    const json = exportFavorites();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dwg-favorites-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: 'success', text: '导出成功' });
    setTimeout(() => setMessage(null), 2000);
  };

  // 导入收藏
  const handleImport = () => {
    const result = importFavorites(importJson, importMerge);
    if (result.success) {
      refreshFavorites();
      setShowImportModal(false);
      setImportJson('');
      setMessage({ type: 'success', text: result.message });
    } else {
      setMessage({ type: 'danger', text: result.message });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  // 清空收藏
  const handleClearAll = () => {
    if (window.confirm('确定要清空所有收藏吗？此操作不可恢复！')) {
      clearAllFavorites();
      refreshFavorites();
      setMessage({ type: 'success', text: '已清空所有收藏' });
      setTimeout(() => setMessage(null), 2000);
    }
  };

  // 获取型号附加信息
  const getModelInfo = (model) => {
    if (dwgTechParams && dwgTechParams[model]) {
      const data = dwgTechParams[model];
      return {
        series: data.series,
        dwgCount: data.dwgCount,
        matched: data.matchStatus === 'matched'
      };
    }
    return null;
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="favorites-panel">
      {/* 消息提示 */}
      {message && (
        <Alert variant={message.type} dismissible onClose={() => setMessage(null)} className="mb-3">
          {message.text}
        </Alert>
      )}

      {/* 工具栏 */}
      <Card className="mb-3">
        <Card.Body className="py-2">
          <div className="d-flex flex-wrap align-items-center gap-2">
            {/* 搜索 */}
            <InputGroup size="sm" style={{ maxWidth: '200px' }}>
              <InputGroup.Text>
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="搜索型号/备注"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </InputGroup>

            {/* 标签筛选 */}
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" size="sm">
                {filterTag || '所有标签'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFilterTag('')}>所有标签</Dropdown.Item>
                <Dropdown.Divider />
                {allTags.map(tag => (
                  <Dropdown.Item key={tag} onClick={() => setFilterTag(tag)}>
                    {tag}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* 类型筛选 */}
            <ButtonGroup size="sm">
              <Button
                variant={filterType === 'all' ? 'primary' : 'outline-primary'}
                onClick={() => setFilterType('all')}
              >
                全部
              </Button>
              <Button
                variant={filterType === 'gearbox' ? 'primary' : 'outline-primary'}
                onClick={() => setFilterType('gearbox')}
              >
                齿轮箱
              </Button>
              <Button
                variant={filterType === 'coupling' ? 'primary' : 'outline-primary'}
                onClick={() => setFilterType('coupling')}
              >
                联轴器
              </Button>
            </ButtonGroup>

            <div className="ms-auto d-flex gap-2">
              <Button variant="outline-success" size="sm" onClick={handleExport}>
                <i className="bi bi-download me-1"></i>导出
              </Button>
              <Button variant="outline-primary" size="sm" onClick={() => setShowImportModal(true)}>
                <i className="bi bi-upload me-1"></i>导入
              </Button>
              <Button variant="outline-danger" size="sm" onClick={handleClearAll} disabled={favorites.length === 0}>
                <i className="bi bi-trash me-1"></i>清空
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* 视图模式切换 */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted">
          共 {getFavoritesCount()} 个收藏
          {filteredFavorites.length !== favorites.length &&
            `，显示 ${filteredFavorites.length} 个`}
        </span>
        <ButtonGroup size="sm">
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('list')}
          >
            <i className="bi bi-list me-1"></i>列表
          </Button>
          <Button
            variant={viewMode === 'stats' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('stats')}
          >
            <i className="bi bi-pie-chart me-1"></i>统计
          </Button>
          <Button
            variant={viewMode === 'recent' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('recent')}
          >
            <i className="bi bi-clock-history me-1"></i>最近
          </Button>
        </ButtonGroup>
      </div>

      {/* 统计视图 */}
      {viewMode === 'stats' && favorites.length > 0 && (
        <Row className="mb-3 g-3">
          {/* 类型分布饼图 */}
          <Col md={6}>
            <Card>
              <Card.Header className="py-2">
                <i className="bi bi-pie-chart me-2"></i>类型分布
              </Card.Header>
              <Card.Body className="p-2">
                {typeStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={typeStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {typeStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted py-4">暂无数据</div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* 系列分布 */}
          <Col md={6}>
            <Card>
              <Card.Header className="py-2">
                <i className="bi bi-bar-chart me-2"></i>系列分布
              </Card.Header>
              <Card.Body className="p-2">
                {seriesStats.length > 0 ? (
                  seriesStats.map((item, index) => (
                    <div key={item.name} className="mb-2">
                      <div className="d-flex justify-content-between small mb-1">
                        <span>{item.name}</span>
                        <span>{item.value}</span>
                      </div>
                      <ProgressBar
                        now={(item.value / favorites.length) * 100}
                        variant={['primary', 'success', 'info', 'warning', 'danger'][index % 5]}
                        style={{ height: '8px' }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-4">暂无数据</div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* 标签统计 */}
          {tagStats.length > 0 && (
            <Col md={12}>
              <Card>
                <Card.Header className="py-2">
                  <i className="bi bi-tags me-2"></i>标签统计
                </Card.Header>
                <Card.Body className="p-2">
                  <div className="d-flex flex-wrap gap-2">
                    {tagStats.map(item => (
                      <Badge
                        key={item.name}
                        bg="secondary"
                        style={{ cursor: 'pointer' }}
                        onClick={() => { setFilterTag(item.name); setViewMode('list'); }}
                      >
                        {item.name} ({item.value})
                      </Badge>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      )}

      {/* 最近浏览视图 */}
      {viewMode === 'recent' && (
        <Card className="mb-3">
          <Card.Header className="py-2">
            <i className="bi bi-clock-history me-2"></i>最近浏览 ({recentViews.length})
          </Card.Header>
          <Card.Body className="p-0">
            {recentViews.length === 0 ? (
              <div className="text-center text-muted py-4">暂无浏览记录</div>
            ) : (
              <ListGroup variant="flush">
                {recentViews.map((item, index) => (
                  <ListGroup.Item
                    key={`${item.model}-${index}`}
                    action
                    className="d-flex justify-content-between align-items-center py-2"
                    onClick={() => onSelectModel && onSelectModel(item.model)}
                  >
                    <div>
                      <span className="fw-bold text-primary">{item.model}</span>
                      <Badge bg={item.type === 'coupling' ? 'info' : 'secondary'} className="ms-2 small">
                        {item.type === 'coupling' ? '联轴器' : '齿轮箱'}
                      </Badge>
                    </div>
                    <small className="text-muted">
                      {new Date(item.time).toLocaleString('zh-CN', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      )}

      {/* 收藏列表 */}
      {viewMode === 'list' && (
        filteredFavorites.length === 0 ? (
          <Alert variant="info">
            <i className="bi bi-info-circle me-2"></i>
            {favorites.length === 0 ? '暂无收藏，点击型号旁的星标即可收藏' : '没有匹配的收藏项'}
          </Alert>
        ) : (
        <ListGroup>
          {filteredFavorites.map(item => {
            const modelInfo = getModelInfo(item.model);
            const isEditing = editingModel === item.model;

            return (
              <ListGroup.Item key={item.model} className="py-2">
                {isEditing ? (
                  // 编辑模式
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong>{item.model}</strong>
                      <div>
                        <Button variant="success" size="sm" className="me-1" onClick={handleSaveEdit}>
                          <i className="bi bi-check"></i> 保存
                        </Button>
                        <Button variant="outline-secondary" size="sm" onClick={handleCancelEdit}>
                          取消
                        </Button>
                      </div>
                    </div>
                    <Form.Group className="mb-2">
                      <Form.Label className="small mb-1">备注</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        size="sm"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="添加备注..."
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="small mb-1">标签 (用逗号分隔)</Form.Label>
                      <Form.Control
                        type="text"
                        size="sm"
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        placeholder="例如: 常用, 推进, 大型"
                      />
                    </Form.Group>
                  </div>
                ) : (
                  // 显示模式
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="fw-bold text-primary"
                          style={{ cursor: 'pointer' }}
                          onClick={() => onSelectModel && onSelectModel(item.model)}
                        >
                          {item.model}
                        </span>
                        <Badge bg={item.type === 'coupling' ? 'info' : 'secondary'} className="small">
                          {item.type === 'coupling' ? '联轴器' : '齿轮箱'}
                        </Badge>
                        {modelInfo && (
                          <>
                            <Badge bg="light" text="dark" className="small">
                              {modelInfo.series}系列
                            </Badge>
                            <Badge bg="light" text="dark" className="small">
                              {modelInfo.dwgCount}个DWG
                            </Badge>
                            {modelInfo.matched && (
                              <Badge bg="success" className="small">已匹配</Badge>
                            )}
                          </>
                        )}
                      </div>

                      {/* 标签 */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-1">
                          {item.tags.map(tag => (
                            <Badge
                              key={tag}
                              bg="primary"
                              className="me-1 small"
                              style={{ cursor: 'pointer' }}
                              onClick={() => setFilterTag(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* 备注 */}
                      {item.notes && (
                        <div className="text-muted small mt-1">
                          <i className="bi bi-chat-text me-1"></i>
                          {item.notes}
                        </div>
                      )}

                      {/* 时间 */}
                      <div className="text-muted small mt-1">
                        <i className="bi bi-clock me-1"></i>
                        {formatDate(item.addedAt)}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => onSelectModel && onSelectModel(item.model)}
                        title="查看"
                      >
                        <i className="bi bi-eye"></i>
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleStartEdit(item)}
                        title="编辑"
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemove(item.model)}
                        title="取消收藏"
                      >
                        <i className="bi bi-star-fill"></i>
                      </Button>
                    </div>
                  </div>
                )}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
        )
      )}

      {/* 导入Modal */}
      <Modal show={showImportModal} onHide={() => setShowImportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>导入收藏</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>粘贴JSON数据</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='{"favorites": {...}}'
            />
          </Form.Group>
          <Form.Check
            type="checkbox"
            label="合并到现有收藏（否则覆盖）"
            checked={importMerge}
            onChange={(e) => setImportMerge(e.target.checked)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImportModal(false)}>
            取消
          </Button>
          <Button variant="primary" onClick={handleImport} disabled={!importJson.trim()}>
            导入
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FavoritesPanel;
