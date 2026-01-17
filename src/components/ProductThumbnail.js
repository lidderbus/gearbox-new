/**
 * 产品缩略图组件
 * 显示齿轮箱/联轴器的产品图片缩略图
 *
 * 2025-12-26: 统一图片数据源，优先使用外形图汇总数据
 */

import React, { useState, useCallback } from 'react';
import { gearboxDrawings, couplingDrawings } from '../data/outlineDrawings';

// 图片映射配置 (作为回退方案)
const CDN_BASE = 'https://omo-oss-image.thefastimg.com/portal-saas/pg2025042513131070105/cms/image';
// 本地服务器存储的联轴器图片 (从 hzcoupling.com 爬取)
const COUPLING_BASE = '/images/couplings';

// 齿轮箱系列图片映射 (包含技术图)
const GEARBOX_IMAGES = {
  'HCM': {
    thumbnail: `${CDN_BASE}/1c21568a-f26d-44cf-be28-53a0bc0e7dde.jpg`,
    large: `${CDN_BASE}/d4c76c7b-c395-4fc6-88eb-3da515a9e4dc.jpg`,
    technical: `${CDN_BASE}/21463442-71ff-4b43-957c-6bc0d1d2a679.png`,
  },
  'HCD': {
    thumbnail: `${CDN_BASE}/3bdf9f59-4b4b-4055-b89a-a6d92fdaa77e.png`,
    large: `${CDN_BASE}/f15657c4-9e95-4b8b-a68a-304076b1d97b.png`,
    technical: `${CDN_BASE}/f47ed8f6-256d-44de-a6bc-ec0e250ea8e5.png`,
  },
  'HC': {
    thumbnail: `${CDN_BASE}/4c7728a1-637b-44dc-8f6c-0cd4c8fffe0d.png`,
    large: `${CDN_BASE}/abb8b14e-e09e-47cf-8972-9066cc6e3746.png`,
    technical: `${CDN_BASE}/039fda90-3f95-4bd8-88b3-5d8ba5a21e69.png`,
  },
  'GW': {
    thumbnail: `${CDN_BASE}/3078e1cd-4ddd-4313-b1c1-01b7ae0f9fba.png`,
    large: `${CDN_BASE}/8b4843d6-40d1-4737-98e2-04126a4ebc51.jpg`,
    technical: `${CDN_BASE}/d15e784a-d381-4db5-9813-e73e301d5b92.jpg`,
  },
  'GC': {
    thumbnail: `${CDN_BASE}/3f438b6c-6cc7-4c7e-8360-69cac9dbb07f.jpg`,
    large: `${CDN_BASE}/da81945f-66f7-49d1-b21c-98201ea0b93b.jpg`,
    technical: `${CDN_BASE}/be58e953-a768-40c7-a5c7-653b07f01362.jpg`,
  },
  'HCT': {
    thumbnail: `${CDN_BASE}/c703226d-a925-4dec-a60a-ccee9aa9dc12.jpg`,
    large: `${CDN_BASE}/c703226d-a925-4dec-a60a-ccee9aa9dc12.jpg`,
  },
  'HCQ': {
    thumbnail: `${CDN_BASE}/7dbf10ed-d1fb-4ff9-aa5a-5174b6db4f40.png`,
    large: `${CDN_BASE}/7dbf10ed-d1fb-4ff9-aa5a-5174b6db4f40.png`,
  },
  'DT': {
    thumbnail: '/images/gearbox/Advance-DT.webp',
    large: '/images/gearbox/Advance-DT.webp',
  },
  'DEFAULT': {
    thumbnail: `${CDN_BASE}/d32e1032-7b27-4589-8e98-ac03b9f52c36.png`,
    large: `${CDN_BASE}/e072ed5a-1083-48cc-b3bc-0f75557b9b0e.jpg`,
    technical: `${CDN_BASE}/840a36e7-bf03-48fc-b698-4ce65b80c7fc.png`,
  },
};

// 联轴器系列图片映射 (包含尺寸图、参数表、结构图)
const COUPLING_IMAGES = {
  'HGTQ': {
    thumbnail: `${COUPLING_BASE}/HGTQ-1.png`,
    large: `${COUPLING_BASE}/HGTQ-1.png`,
    technical: `${COUPLING_BASE}/HGTQ-T.png`,
    dimensions: `${COUPLING_BASE}/HGTQ-W.png`,
  },
  'HGT': {
    thumbnail: `${COUPLING_BASE}/HGTS-1.jpg`,
    large: `${COUPLING_BASE}/HGTS-1.jpg`,
    technical: `${COUPLING_BASE}/HGTS-T.png`,
    dimensions: `${COUPLING_BASE}/HGTS-W.png`,
  },
  'HGTS': {
    thumbnail: `${COUPLING_BASE}/HGTS-1.jpg`,
    large: `${COUPLING_BASE}/HGTS-1.jpg`,
    technical: `${COUPLING_BASE}/HGTS-T.png`,
    dimensions: `${COUPLING_BASE}/HGTS-W.png`,
  },
  'HGTH': {
    thumbnail: `${COUPLING_BASE}/HGTH.png`,
    large: `${COUPLING_BASE}/HGTH.png`,
    technical: `${COUPLING_BASE}/HGTH-T.png`,
    dimensions: `${COUPLING_BASE}/HGTH-D.png`,
    paramTable: `${COUPLING_BASE}/HGTH-PT.png`,
  },
  'HGTHB': {
    thumbnail: `${COUPLING_BASE}/HGTH.png`,
    large: `${COUPLING_BASE}/HGTH.png`,
    technical: `${COUPLING_BASE}/HGTH-T.png`,
    dimensions: `${COUPLING_BASE}/HGTH-D.png`,
  },
  'HGTHJ': {
    thumbnail: `${COUPLING_BASE}/HGTH.png`,
    large: `${COUPLING_BASE}/HGTH.png`,
    technical: `${COUPLING_BASE}/HGTH-T.png`,
    dimensions: `${COUPLING_BASE}/HGTH-PT.png`,
  },
  'HGTHT': {
    thumbnail: `${COUPLING_BASE}/HGTH.png`,
    large: `${COUPLING_BASE}/HGTH.png`,
    technical: `${COUPLING_BASE}/HGTH-T.png`,
  },
  'HGTL': {
    thumbnail: `${COUPLING_BASE}/HGTLX.png`,
    large: `${COUPLING_BASE}/HGTLX.png`,
    technical: `${COUPLING_BASE}/HGTLX-T.png`,
    dimensions: `${COUPLING_BASE}/HGTLX-W.png`,
  },
  'HGTLX': {
    thumbnail: `${COUPLING_BASE}/HGTLX.png`,
    large: `${COUPLING_BASE}/HGTLX.png`,
    technical: `${COUPLING_BASE}/HGTLX-T.png`,
    dimensions: `${COUPLING_BASE}/HGTLX-W.png`,
  },
  'HQTQ': {
    thumbnail: `${COUPLING_BASE}/HQTQ.png`,
    large: `${COUPLING_BASE}/HQTQ.png`,
  },
};

/**
 * 从型号提取系列
 */
function extractSeries(model, type) {
  if (!model) return 'DEFAULT';
  const upperModel = model.toUpperCase();

  if (type === 'coupling') {
    const match = upperModel.match(/^(HGTH?[BJLT]?Q?S?X?)/);
    return match ? match[1] : 'HGTQ';
  }

  // 齿轮箱
  const match = upperModel.match(/^(HCM|HCD|HCT|HCQ|HC|GW|GC|DT)/);
  return match ? match[1] : 'DEFAULT';
}

/**
 * 获取图片URL
 * 优先级: 1.外形图精确匹配 → 2.外形图模糊匹配 → 3.系列默认图片
 */
function getImageUrl(model, type = 'gearbox', size = 'thumbnail') {
  if (!model) {
    const defaultImages = type === 'coupling' ? COUPLING_IMAGES['HGTQ'] : GEARBOX_IMAGES['DEFAULT'];
    return defaultImages[size] || defaultImages.thumbnail;
  }

  // 1. 优先从外形图数据获取（精确匹配）
  const drawingSource = type === 'coupling' ? couplingDrawings : gearboxDrawings;
  const drawingData = drawingSource[model];

  if (drawingData) {
    if (size === 'large' && drawingData.mainView) return drawingData.mainView;
    if (size === 'thumbnail' && drawingData.thumbnail) return drawingData.thumbnail;
    if (size === 'technical' && drawingData.dimensions) return drawingData.dimensions;
  }

  // 2. 模糊匹配（去除后缀如A, B, P等）
  const baseModel = model.replace(/[A-Z]$/, '');
  if (baseModel !== model) {
    const baseDrawing = drawingSource[baseModel];
    if (baseDrawing) {
      if (size === 'large' && baseDrawing.mainView) return baseDrawing.mainView;
      if (size === 'thumbnail' && baseDrawing.thumbnail) return baseDrawing.thumbnail;
      if (size === 'technical' && baseDrawing.dimensions) return baseDrawing.dimensions;
    }
  }

  // 3. 回退到系列默认图片
  const series = extractSeries(model, type);

  if (type === 'coupling') {
    const images = COUPLING_IMAGES[series] || COUPLING_IMAGES['HGTQ'];
    return images[size] || images.thumbnail;
  }

  const images = GEARBOX_IMAGES[series] || GEARBOX_IMAGES['DEFAULT'];
  return images[size] || images.thumbnail;
}

/**
 * 产品缩略图组件
 */
function ProductThumbnail({
  model,
  type = 'gearbox',
  size = 60,
  onClick,
  showLabel = false,
  className = '',
}) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageUrl = getImageUrl(model, type, 'thumbnail');

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setIsLoading(false);
  }, []);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick({
        model,
        type,
        imageUrl: getImageUrl(model, type, 'large'),
        thumbnailUrl: imageUrl,
      });
    }
  }, [model, type, imageUrl, onClick]);

  const containerStyle = {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: onClick ? 'pointer' : 'default',
  };

  const imageContainerStyle = {
    width: size,
    height: size,
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #e0e0e0',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const imageStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    display: imageError || isLoading ? 'none' : 'block',
  };

  const placeholderStyle = {
    color: '#999',
    fontSize: size > 60 ? '14px' : '12px',
    textAlign: 'center',
    padding: '4px',
  };

  const labelStyle = {
    marginTop: '4px',
    fontSize: '11px',
    color: '#666',
    textAlign: 'center',
    maxWidth: size + 20,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  return (
    <div
      className={`product-thumbnail ${className}`}
      style={containerStyle}
      onClick={handleClick}
      title={`点击查看 ${model} 大图`}
    >
      <div
        className="thumbnail-image-container"
        style={imageContainerStyle}
        onMouseEnter={(e) => {
          if (onClick) {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {isLoading && !imageError && (
          <div style={placeholderStyle}>加载中...</div>
        )}
        {imageError && (
          <div style={placeholderStyle}>
            {type === 'coupling' ? '联轴器' : '齿轮箱'}
          </div>
        )}
        <img
          src={imageUrl}
          alt={model}
          style={imageStyle}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
      {showLabel && <div style={labelStyle}>{model}</div>}
    </div>
  );
}

/**
 * 获取完整的图片数据（包含多视图）
 * 用于ProductImageModal显示多标签页
 */
function getFullImageData(model, type = 'gearbox') {
  if (!model) return null;

  const drawingSource = type === 'coupling' ? couplingDrawings : gearboxDrawings;

  // 精确匹配
  let drawingData = drawingSource[model];

  // 模糊匹配
  if (!drawingData) {
    const baseModel = model.replace(/[A-Z]$/, '');
    drawingData = drawingSource[baseModel];
  }

  if (drawingData) {
    return {
      model,
      type,
      thumbnail: drawingData.thumbnail,
      large: drawingData.mainView || drawingData.thumbnail,
      technical: drawingData.dimensions,
      sideView: drawingData.sideView,
      topView: drawingData.topView,
      installationGuide: drawingData.installationGuide,
      description: drawingData.description,
      powerRange: drawingData.powerRange,
      torque: drawingData.torque,
      specs: drawingData.specs,
      fromOutlineDrawings: true
    };
  }

  // 回退到系列默认
  const series = extractSeries(model, type);
  const images = type === 'coupling'
    ? (COUPLING_IMAGES[series] || COUPLING_IMAGES['HGTQ'])
    : (GEARBOX_IMAGES[series] || GEARBOX_IMAGES['DEFAULT']);

  return {
    model,
    type,
    thumbnail: images.thumbnail,
    large: images.large,
    technical: images.technical,
    dimensions: images.dimensions,
    paramTable: images.paramTable,
    fromOutlineDrawings: false
  };
}

// 导出辅助函数供其他组件使用
export { getImageUrl, getFullImageData, extractSeries, GEARBOX_IMAGES, COUPLING_IMAGES };
export default ProductThumbnail;
