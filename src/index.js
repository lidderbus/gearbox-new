import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './loading-styles.css';
import AppWrapper from './AppWrapper';

// 获取 HTML 中的根元素
const rootElement = document.getElementById('root');

// 如果根元素存在，则创建 React 根并渲染应用
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AppWrapper />
    </React.StrictMode>
  );
} else {
  console.error("未能找到 ID 为 'root' 的 DOM 元素。请检查 public/index.html 文件。");
}