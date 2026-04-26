// src/components/common/LazyMountOnVisible.js
// 包装组件：等到自身首次进入视口才挂载 children。
// 用于在大型图表面板中按需挂载多张 ECharts，避免一次性吃掉首屏 CPU。

import React from 'react';
import useInViewport from '../../hooks/useInViewport';

/**
 * @param {Object} props
 * @param {number} [props.minHeight=180] 占位高度（避免 layout shift）
 * @param {React.ReactNode} [props.placeholder] 自定义占位（不传则灰底文字）
 * @param {React.ReactNode} props.children 真实渲染内容
 */
const LazyMountOnVisible = ({ minHeight = 180, placeholder, children }) => {
  const [ref, visible] = useInViewport();
  return (
    <div ref={ref} style={{ minHeight }}>
      {visible
        ? children
        : (placeholder || (
            <div
              style={{
                minHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                fontSize: '0.85em',
                background: 'rgba(0,0,0,0.02)',
                borderRadius: 4
              }}
            >
              滚动至此处加载图表…
            </div>
          ))}
    </div>
  );
};

export default LazyMountOnVisible;
