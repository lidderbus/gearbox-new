import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { userRoles } from '../auth/roles';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 认证加载中状态
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" /> <span className='ms-2'>认证中...</span>
      </div>
    );
  }

  // 未认证，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果需要特定角色
  if (requiredRole) {
    // 检查用户角色是否满足要求（包括管理员继承权限）
    const userHasRequiredRole =
      user &&
      (user.role === requiredRole ||
        user.role === userRoles.SUPER_ADMIN || // 超级管理员可以访问任何地方
        (requiredRole === userRoles.ADMIN && user.role === userRoles.SUPER_ADMIN) || // 超级管理员可以访问管理员路由
        (requiredRole === userRoles.EDITOR && (user.role === userRoles.ADMIN || user.role === userRoles.SUPER_ADMIN)) || // 管理员/超管可以访问编辑者路由
        (requiredRole === userRoles.VIEWER && (user.role === userRoles.EDITOR || user.role === userRoles.ADMIN || user.role === userRoles.SUPER_ADMIN))); // 编辑者/管理员/超管可以访问查看者路由

    if (!userHasRequiredRole) {
      console.warn(`用户 ${user.username} (角色: ${user.role}) 尝试访问需要角色 ${requiredRole} 的受限路由。正在重定向...`);
      // 如果角色不足，重定向到主页
      return <Navigate to="/" replace />;
    }
  }

  // 认证通过且角色满足要求（或不需要特定角色），渲染子组件
  return children;
};

export default ProtectedRoute; 