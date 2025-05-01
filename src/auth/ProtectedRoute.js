// src/auth/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from 'react-bootstrap';

/**
 * 受保护的路由组件
 * @param {Object} props - 组件参数
 * @param {React.ReactNode} props.children - 子组件
 * @param {string} props.requiredRole - 访问此路由所需的角色（可选）
 * @returns {JSX.Element} 渲染的路由组件
 */
export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 如果认证状态正在加载，显示加载指示器
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // 如果用户未登录，重定向到登录页面
  if (!isAuthenticated) {
    // 将当前位置传递给登录页面，以便登录后重定向回来
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果指定了所需角色，检查用户是否有权限
  if (requiredRole) {
    // 权限检查逻辑
    const hasPermission = 
      user.role === requiredRole || 
      user.role === 'SUPER_ADMIN' || 
      (requiredRole === 'EDITOR' && user.role === 'ADMIN');

    if (!hasPermission) {
      // 如果没有权限，重定向到首页
      return <Navigate to="/" replace />;
    }
  }

  // 有权限，渲染子组件
  return children;
};