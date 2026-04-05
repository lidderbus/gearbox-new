// src/hooks/useKeyboardShortcuts.js
// 全局快捷键系统
import { useEffect, useCallback } from 'react';

/**
 * 注册全局快捷键
 * @param {Object} shortcuts - { 'ctrl+s': handler, 'ctrl+p': handler, ... }
 * @param {boolean} enabled - 是否启用
 */
export default function useKeyboardShortcuts(shortcuts, enabled = true) {
  const handler = useCallback((e) => {
    if (!enabled) return;
    // Skip if user is typing in input/textarea/select
    const tag = e.target.tagName;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) && !e.ctrlKey && !e.metaKey) return;

    const keys = [];
    if (e.ctrlKey || e.metaKey) keys.push('ctrl');
    if (e.shiftKey) keys.push('shift');
    if (e.altKey) keys.push('alt');
    keys.push(e.key.toLowerCase());
    const combo = keys.join('+');

    const fn = shortcuts[combo];
    if (fn) {
      e.preventDefault();
      e.stopPropagation();
      fn(e);
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handler]);
}
