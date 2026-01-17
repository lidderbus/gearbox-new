/**
 * useIsMobile - 响应式Hook用于检测移动设备
 *
 * 功能:
 * - 检测设备是否为移动端
 * - 监听窗口大小变化
 * - 提供多种断点检测
 */
import { useState, useEffect, useCallback } from 'react';

// 断点定义
const BREAKPOINTS = {
  xs: 480,   // 小型手机
  sm: 640,   // 普通手机
  md: 768,   // 平板竖屏
  lg: 1024,  // 平板横屏/小笔记本
  xl: 1280,  // 桌面
  xxl: 1536  // 大屏桌面
};

/**
 * 主Hook - useIsMobile
 * @returns {Object} 包含各种设备检测状态
 */
export function useIsMobile() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  const handleResize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  useEffect(() => {
    // 初始化
    handleResize();

    // 添加resize监听
    window.addEventListener('resize', handleResize);

    // 清理
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const { width, height } = windowSize;

  return {
    // 基础尺寸
    width,
    height,

    // 设备类型判断
    isMobile: width < BREAKPOINTS.md,           // < 768px
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,  // 768-1024px
    isDesktop: width >= BREAKPOINTS.lg,         // >= 1024px

    // 细分断点
    isXs: width < BREAKPOINTS.xs,               // < 480px (小型手机)
    isSm: width >= BREAKPOINTS.xs && width < BREAKPOINTS.sm,  // 480-640px
    isMd: width >= BREAKPOINTS.sm && width < BREAKPOINTS.md,  // 640-768px
    isLg: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,  // 768-1024px
    isXl: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,  // 1024-1280px
    isXxl: width >= BREAKPOINTS.xl,             // >= 1280px

    // 方向判断
    isLandscape: width > height,
    isPortrait: width <= height,

    // 触摸设备检测
    isTouchDevice: typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0),

    // 断点常量
    breakpoints: BREAKPOINTS
  };
}

/**
 * useMediaQuery - 自定义媒体查询Hook
 * @param {string} query - CSS媒体查询字符串
 * @returns {boolean} 是否匹配
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event) => setMatches(event.matches);

    // 兼容旧版浏览器
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
}

/**
 * useViewportSize - 获取视口尺寸
 * @returns {Object} { width, height, vw, vh }
 */
export function useViewportSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    vw: typeof window !== 'undefined' ? window.innerWidth / 100 : 0,
    vh: typeof window !== 'undefined' ? window.innerHeight / 100 : 0
  });

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
        vw: window.innerWidth / 100,
        vh: window.innerHeight / 100
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}

export default useIsMobile;
