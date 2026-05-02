// src/components/ProductCenter/ProductCenter.js
// 产品中心主组件

import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { Container, Row, Col, Alert, Tabs, Tab, Spinner } from 'react-bootstrap';
import FilterPanel from './FilterPanel';
import ProductGrid from './ProductGrid';
import ProductDetail from './ProductDetail';
import CompareDrawer from './CompareDrawer';
import CompareView from './CompareView';
import ExportDialog from './ExportDialog';
import { useProductFilter } from './useProductFilter';

const HCMSelectionModule = lazy(() => import('../HCMSelectionModule'));

const ProductCenter = ({
  gearboxData = [],
  colors = {},
  theme = 'light',
  onNavigateToQuotation
}) => {
  // 将所有系列数据合并为单一数组
  const allProducts = useMemo(() => {
    if (Array.isArray(gearboxData)) {
      return gearboxData;
    }

    // 如果是对象格式 (各系列分组)，则合并
    const products = [];
    const seriesArrays = [
      'hcGearboxes', 'hcmGearboxes', 'hcdGearboxes',
      'gwGearboxes', 'gcGearboxes', 'dtGearboxes',
      'gcsGearboxes', 'othersGearboxes'
    ];

    for (const key of seriesArrays) {
      if (Array.isArray(gearboxData[key])) {
        products.push(...gearboxData[key]);
      }
    }

    // 如果有 gearboxes 数组
    if (Array.isArray(gearboxData.gearboxes)) {
      products.push(...gearboxData.gearboxes);
    }

    return products;
  }, [gearboxData]);

  // 使用筛选Hook
  const {
    filters,
    updateFilter,
    resetFilters,
    filteredProducts,
    totalCount,
    seriesCounts,
    compareList,
    toggleCompare,
    clearCompare,
    isInCompare
  } = useProductFilter(allProducts);

  // 模态框状态
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showExport, setShowExport] = useState(false);

  // 顶部视图切换:全部产品 / HCM 高速专区
  // 通过 sessionStorage `product_center_preset` 接收侧栏深链(/hcm-selection)的预设
  const [activeView, setActiveView] = useState(() => {
    try {
      const preset = sessionStorage.getItem('product_center_preset');
      if (preset === 'hcm') {
        sessionStorage.removeItem('product_center_preset');
        return 'hcm';
      }
    } catch (e) { /* ignore */ }
    return 'all';
  });

  // 也支持组件挂载后 preset 才被设置(异步路由场景)
  useEffect(() => {
    const handler = () => {
      try {
        const preset = sessionStorage.getItem('product_center_preset');
        if (preset === 'hcm') {
          sessionStorage.removeItem('product_center_preset');
          setActiveView('hcm');
        }
      } catch (e) { /* ignore */ }
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  // 查看详情
  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setShowDetail(true);
  };

  // 开始对比
  const handleStartCompare = () => {
    if (compareList.length >= 2) {
      setShowCompare(true);
    }
  };

  // 生成报价单
  const handleGenerateQuotation = (products) => {
    if (onNavigateToQuotation) {
      // 传递选中的产品到报价页面
      const productList = Array.isArray(products) ? products : [products];
      onNavigateToQuotation(productList);
    }
  };

  // 打开导出对话框
  const handleExport = () => {
    setShowExport(true);
  };

  // 处理排序变化
  const handleSortChange = (sortBy) => {
    updateFilter('sortBy', sortBy);
  };

  if (allProducts.length === 0) {
    return (
      <Container className="py-4">
        <Alert variant="warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          未加载产品数据。请确保数据已正确加载。
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-3" style={{ paddingBottom: compareList.length > 0 ? '80px' : '20px' }}>
      <Tabs
        activeKey={activeView}
        onSelect={(k) => setActiveView(k || 'all')}
        className="mb-3"
        mountOnEnter
      >
        <Tab eventKey="all" title={<span><i className="bi bi-box-seam me-1"></i>全部产品</span>}>
          <Row>
            {/* 左侧筛选面板 */}
            <Col lg={3} md={4} className="mb-3">
              <FilterPanel
                filters={filters}
                updateFilter={updateFilter}
                resetFilters={resetFilters}
                seriesCounts={seriesCounts}
                totalCount={totalCount}
                filteredCount={filteredProducts.length}
                colors={colors}
                theme={theme}
              />
            </Col>

            {/* 右侧产品列表 */}
            <Col lg={9} md={8}>
              <ProductGrid
                products={filteredProducts}
                onViewDetail={handleViewDetail}
                onToggleCompare={toggleCompare}
                isInCompare={isInCompare}
                sortBy={filters.sortBy}
                onSortChange={handleSortChange}
                onExport={handleExport}
                colors={colors}
                theme={theme}
              />
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="hcm" title={<span><i className="bi bi-speedometer2 me-1"></i>HCM 高速专区</span>}>
          <Suspense fallback={<div className="text-center py-5"><Spinner animation="border" /></div>}>
            <HCMSelectionModule />
          </Suspense>
        </Tab>
      </Tabs>

      {/* 底部对比栏 */}
      <CompareDrawer
        compareList={compareList}
        onRemove={toggleCompare}
        onClear={clearCompare}
        onCompare={handleStartCompare}
        colors={colors}
        theme={theme}
      />

      {/* 产品详情模态框 */}
      <ProductDetail
        show={showDetail}
        onHide={() => setShowDetail(false)}
        product={selectedProduct}
        onAddToCompare={toggleCompare}
        onGenerateQuotation={handleGenerateQuotation}
        isInCompare={selectedProduct ? isInCompare(selectedProduct.model) : false}
        colors={colors}
        theme={theme}
      />

      {/* 对比视图模态框 */}
      <CompareView
        show={showCompare}
        onHide={() => setShowCompare(false)}
        products={compareList}
        onRemove={toggleCompare}
        onGenerateQuotation={handleGenerateQuotation}
        colors={colors}
        theme={theme}
      />

      {/* 导出对话框 */}
      <ExportDialog
        show={showExport}
        onHide={() => setShowExport(false)}
        products={filteredProducts}
        compareList={compareList}
        colors={colors}
        theme={theme}
      />
    </Container>
  );
};

export default ProductCenter;
