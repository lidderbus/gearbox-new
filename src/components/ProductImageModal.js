/**
 * 产品图片弹窗组件
 * 显示产品大图和技术图纸
 *
 * 2025-12-26: 使用getFullImageData获取外形图数据，支持多视图
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { getFullImageData, extractSeries } from './ProductThumbnail';

/**
 * 产品图片弹窗
 */
function ProductImageModal({
  isOpen,
  onClose,
  model,
  type = 'gearbox',
  initialTab = 'product',
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [imageError, setImageError] = useState({});
  const [isLoading, setIsLoading] = useState({});

  // 获取完整图片数据（优先使用外形图汇总数据）
  const imageData = useMemo(() => getFullImageData(model, type), [model, type]);
  const series = extractSeries(model, type);

  // 构建可用的标签页 (基于实际数据)
  const tabs = useMemo(() => {
    if (!imageData) return [];

    const tabList = [
      { key: 'product', label: '产品图', url: imageData.large || imageData.thumbnail },
    ];

    // 从外形图汇总获取的多视图
    if (imageData.fromOutlineDrawings) {
      if (imageData.sideView) tabList.push({ key: 'side', label: '侧视图', url: imageData.sideView });
      if (imageData.topView) tabList.push({ key: 'top', label: '俯视图', url: imageData.topView });
      if (imageData.technical) tabList.push({ key: 'dims', label: '尺寸图', url: imageData.technical });
      if (imageData.installationGuide) tabList.push({ key: 'install', label: '安装图', url: imageData.installationGuide });
    } else {
      // 回退方案：使用系列默认的技术图
      if (imageData.technical) tabList.push({ key: 'technical', label: '技术图', url: imageData.technical });
      if (imageData.dimensions) tabList.push({ key: 'dimensions', label: '尺寸图', url: imageData.dimensions });
      if (imageData.paramTable) tabList.push({ key: 'paramTable', label: '参数表', url: imageData.paramTable });
    }

    return tabList;
  }, [imageData]);

  // 重置状态
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setImageError({});
      setIsLoading({});
    }
  }, [isOpen, initialTab]);

  // ESC键关闭
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleImageLoad = useCallback((key) => {
    setIsLoading((prev) => ({ ...prev, [key]: false }));
  }, []);

  const handleImageError = useCallback((key) => {
    setImageError((prev) => ({ ...prev, [key]: true }));
    setIsLoading((prev) => ({ ...prev, [key]: false }));
  }, []);

  if (!isOpen) return null;

  const currentTab = tabs.find((t) => t.key === activeTab) || tabs[0];

  // 样式
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: '20px',
  };

  const modalStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    maxWidth: '900px',
    maxHeight: '90vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f8f9fa',
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  };

  const tabsStyle = {
    display: 'flex',
    gap: '8px',
    padding: '12px 20px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#fff',
  };

  const tabStyle = (isActive) => ({
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: isActive ? '#1976d2' : '#f0f0f0',
    color: isActive ? '#fff' : '#666',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: isActive ? '500' : '400',
    transition: 'all 0.2s',
  });

  const contentStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    overflow: 'auto',
    minHeight: '400px',
  };

  const imageStyle = {
    maxWidth: '100%',
    maxHeight: '60vh',
    objectFit: 'contain',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  };

  const errorStyle = {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#f8f9fa',
    fontSize: '13px',
    color: '#666',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div style={headerStyle}>
          <h3 style={titleStyle}>
            {model} - {type === 'coupling' ? '高弹联轴器' : '船用齿轮箱'}
          </h3>
          <button
            style={closeButtonStyle}
            onClick={onClose}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            ×
          </button>
        </div>

        {/* 标签页 */}
        {tabs.length > 1 && (
          <div style={tabsStyle}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                style={tabStyle(activeTab === tab.key)}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* 图片内容 */}
        <div style={contentStyle}>
          {imageError[currentTab.key] ? (
            <div style={errorStyle}>
              <p>图片加载失败</p>
              <p style={{ fontSize: '12px' }}>{currentTab.url}</p>
            </div>
          ) : (
            <img
              src={currentTab.url}
              alt={`${model} ${currentTab.label}`}
              style={imageStyle}
              onLoad={() => handleImageLoad(currentTab.key)}
              onError={() => handleImageError(currentTab.key)}
            />
          )}
        </div>

        {/* 底部 */}
        <div style={footerStyle}>
          <span>
            系列: {series}
            {imageData?.powerRange && ` | 功率: ${imageData.powerRange}`}
            {imageData?.torque && ` | 扭矩: ${imageData.torque}`}
          </span>
          <span>
            {imageData?.fromOutlineDrawings ? (
              <span style={{ color: '#4caf50' }}>✓ 外形图汇总</span>
            ) : (
              <a
                href={
                  type === 'coupling'
                    ? 'http://www.hzcoupling.com'
                    : 'https://www.chinaadvance.com'
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1976d2' }}
              >
                {type === 'coupling' ? '杭州前进高弹' : '杭州前进齿轮箱'}
              </a>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductImageModal;
