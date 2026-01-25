// src/components/ClauseKnowledgeBase/ClauseKnowledgeBase.js
// 条款知识库主容器组件

import React from 'react';
import { Alert, Spinner, Badge } from 'react-bootstrap';
import useClauseSearch from './useClauseSearch';
import ClauseSearchPanel from './ClauseSearchPanel';
import ClauseResultList from './ClauseResultList';
import ClauseDetailModal from './ClauseDetailModal';
import ClauseCompareView from './ClauseCompareView';
import './clauseKnowledgeBase.css';

/**
 * 条款知识库主组件
 * 整合搜索面板、结果列表、详情弹窗和对比视图
 */
const ClauseKnowledgeBase = ({ colors, theme }) => {
  const {
    // 数据状态
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
  } = useClauseSearch();

  // 加载状态
  if (loading) {
    return (
      <div className="clause-kb-loading text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3" style={{ color: colors?.muted }}>
          正在加载条款知识库...
        </p>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <Alert variant="danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        加载条款知识库失败: {error}
      </Alert>
    );
  }

  return (
    <div className="clause-knowledge-base">
      {/* 头部统计 */}
      <div className="clause-kb-header mb-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h5 className="mb-1" style={{ color: colors?.headerText }}>
              <i className="bi bi-book me-2"></i>
              技术协议条款知识库
            </h5>
            <small style={{ color: colors?.muted }}>
              共 <Badge bg="primary">{stats.total}</Badge> 条标准条款，
              覆盖 <Badge bg="info">{categories.length}</Badge> 个分类
            </small>
          </div>

          {/* 选中条款操作 */}
          {selectedClauses.length > 0 && (
            <div className="d-flex align-items-center gap-2">
              <Badge bg="success">
                已选 {selectedClauses.length} 条
              </Badge>
              {selectedClauses.length >= 2 && (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={openCompare}
                >
                  <i className="bi bi-columns-gap me-1"></i>
                  对比查看
                </button>
              )}
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={clearSelection}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 搜索面板 */}
      <ClauseSearchPanel
        colors={colors}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        activeSeries={activeSeries}
        setActiveSeries={setActiveSeries}
        categories={categories}
        availableSeries={availableSeries}
        stats={stats}
        onClear={clearSearch}
      />

      {/* 搜索结果统计 */}
      <div className="clause-kb-result-stats mb-2">
        <small style={{ color: colors?.muted }}>
          {searchTerm || activeCategory !== 'all' || activeSeries ? (
            <>
              找到 <strong>{searchResults.length}</strong> 条匹配结果
              {searchTerm && <> - 关键词: "{searchTerm}"</>}
            </>
          ) : (
            <>显示全部 <strong>{searchResults.length}</strong> 条条款</>
          )}
        </small>
      </div>

      {/* 结果列表 */}
      <ClauseResultList
        colors={colors}
        results={searchResults}
        selectedClauses={selectedClauses}
        onSelect={toggleClauseSelection}
        onViewDetail={openDetail}
      />

      {/* 条款详情弹窗 */}
      <ClauseDetailModal
        show={showDetail}
        onHide={closeDetail}
        clause={detailClause}
        colors={colors}
      />

      {/* 条款对比视图 */}
      <ClauseCompareView
        show={showCompare}
        onHide={closeCompare}
        clauses={selectedClauses}
        colors={colors}
        categories={categories}
      />

      {/* 使用提示 */}
      <div
        className="clause-kb-tips mt-4 p-3 rounded"
        style={{
          backgroundColor: colors?.headerBg,
          borderColor: colors?.border,
          border: '1px solid'
        }}
      >
        <h6 style={{ color: colors?.headerText }}>
          <i className="bi bi-lightbulb me-2"></i>
          使用提示
        </h6>
        <ul className="mb-0 small" style={{ color: colors?.text }}>
          <li><strong>搜索</strong>: 输入关键词搜索条款标题、内容或关键词标签</li>
          <li><strong>筛选</strong>: 按分类或产品系列筛选相关条款</li>
          <li><strong>对比</strong>: 勾选2-4条条款，点击"对比查看"并排比较</li>
          <li><strong>复制</strong>: 点击条款卡片可查看详情并复制内容</li>
        </ul>
      </div>
    </div>
  );
};

export default ClauseKnowledgeBase;
