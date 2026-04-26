// src/hooks/useInViewport.js
// 轻量 IntersectionObserver hook：返回 [ref, isIntersecting] 二元组。
// 用于"图表面板进入视口才挂载"这类懒加载场景。

import { useEffect, useRef, useState } from 'react';

const DEFAULT_OPTIONS = {
  root: null,
  rootMargin: '120px',
  threshold: 0.01,
  once: true
};

/**
 * 监听节点是否进入视口
 * @param {Object} options - { root, rootMargin, threshold, once }
 * @returns {[React.RefObject, boolean]}
 */
export default function useInViewport(options = {}) {
  const { root, rootMargin, threshold, once } = { ...DEFAULT_OPTIONS, ...options };
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setIsIntersecting(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsIntersecting(false);
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold, once]);

  return [ref, isIntersecting];
}
