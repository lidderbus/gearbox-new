// src/components/ProductCenter/index.js
// 产品中心模块入口

import ProductCenter from './ProductCenter';

export { ProductCenter };
export { useProductFilter, SERIES_CONFIG, SORT_OPTIONS } from './useProductFilter';
export { default as FilterPanel } from './FilterPanel';
export { default as ProductGrid } from './ProductGrid';
export { default as ProductCard } from './ProductCard';
export { default as ProductDetail } from './ProductDetail';
export { default as CompareDrawer } from './CompareDrawer';
export { default as CompareView } from './CompareView';
export { default as ExportDialog } from './ExportDialog';

export default ProductCenter;
