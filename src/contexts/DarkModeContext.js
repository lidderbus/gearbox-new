import React, { createContext, useState, useContext, useEffect } from 'react';

const DarkModeContext = createContext();

/**
 * 暗黑模式提供组件
 * 管理应用的暗黑/浅色主题切换
 */
const DarkModeProvider = ({ children }) => {
  // 检查本地存储或系统偏好
  const getInitialDarkMode = () => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    // 检查系统偏好
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  // 切换暗黑模式
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // 保存到本地存储
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    // 应用到body
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// 自定义hook便于在组件中使用
export const useDarkMode = () => useContext(DarkModeContext);

export default DarkModeProvider; 