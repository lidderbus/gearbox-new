// src/auth/roles.js

// 定义用户角色常量
export const userRoles = {
  USER: 'USER',           // 普通用户 - 可以访问基本功能
  EDITOR: 'EDITOR',       // 编辑者 - 可以编辑数据
  ADMIN: 'ADMIN',         // 管理员 - 可以管理用户和数据
  SUPER_ADMIN: 'SUPER_ADMIN' // 超级管理员 - 拥有所有权限
};

// 定义权限常量
export const permissions = {
  // 基本功能权限
  VIEW_GEARBOX_DATA: 'view_gearbox_data',
  PERFORM_SELECTION: 'perform_selection',
  VIEW_QUOTATION: 'view_quotation',
  VIEW_AGREEMENT: 'view_agreement',
  EXPORT_FILES: 'export_files',
  
  // 数据编辑权限
  EDIT_GEARBOX_DATA: 'edit_gearbox_data',
  EDIT_PRICE_DATA: 'edit_price_data',
  
  // 管理权限
  MANAGE_USERS: 'manage_users',
  MANAGE_DATABASE: 'manage_database',
  SYSTEM_SETTINGS: 'system_settings',
  
  // 高级功能权限
  BATCH_OPERATIONS: 'batch_operations',
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_REPORTS: 'export_reports'
};

// 导出默认角色
export const defaultRole = userRoles.USER;

// 定义角色权限映射
export const rolePermissions = {
  [userRoles.USER]: [
    permissions.VIEW_GEARBOX_DATA,
    permissions.PERFORM_SELECTION,
    permissions.VIEW_QUOTATION,
    permissions.VIEW_AGREEMENT,
    permissions.EXPORT_FILES
  ],
  [userRoles.EDITOR]: [
    permissions.VIEW_GEARBOX_DATA,
    permissions.PERFORM_SELECTION,
    permissions.VIEW_QUOTATION,
    permissions.VIEW_AGREEMENT,
    permissions.EXPORT_FILES,
    permissions.EDIT_GEARBOX_DATA,
    permissions.EDIT_PRICE_DATA,
    permissions.BATCH_OPERATIONS
  ],
  [userRoles.ADMIN]: [
    permissions.VIEW_GEARBOX_DATA,
    permissions.PERFORM_SELECTION,
    permissions.VIEW_QUOTATION,
    permissions.VIEW_AGREEMENT,
    permissions.EXPORT_FILES,
    permissions.EDIT_GEARBOX_DATA,
    permissions.EDIT_PRICE_DATA,
    permissions.BATCH_OPERATIONS,
    permissions.MANAGE_USERS,
    permissions.MANAGE_DATABASE,
    permissions.VIEW_ANALYTICS,
    permissions.EXPORT_REPORTS
  ],
  [userRoles.SUPER_ADMIN]: [
    permissions.VIEW_GEARBOX_DATA,
    permissions.PERFORM_SELECTION,
    permissions.VIEW_QUOTATION,
    permissions.VIEW_AGREEMENT,
    permissions.EXPORT_FILES,
    permissions.EDIT_GEARBOX_DATA,
    permissions.EDIT_PRICE_DATA,
    permissions.BATCH_OPERATIONS,
    permissions.MANAGE_USERS,
    permissions.MANAGE_DATABASE,
    permissions.SYSTEM_SETTINGS,
    permissions.VIEW_ANALYTICS,
    permissions.EXPORT_REPORTS
  ]
};

// 检查用户是否具有特定权限
export const hasPermission = (userRole, permission) => {
  // 验证输入
  if (!userRole || !permission) return false;
  if (!Object.values(userRoles).includes(userRole)) return false;
  if (!Object.values(permissions).includes(permission)) return false;

  // 超级管理员拥有所有权限
  if (userRole === userRoles.SUPER_ADMIN) return true;
  
  // 检查用户角色是否有指定的权限
  return rolePermissions[userRole]?.includes(permission) || false;
};

// 检查用户是否具有多个权限中的任意一个
export const hasAnyPermission = (userRole, requiredPermissions) => {
  if (!Array.isArray(requiredPermissions)) return false;
  return requiredPermissions.some(permission => hasPermission(userRole, permission));
};

// 检查用户是否具有所有指定的权限
export const hasAllPermissions = (userRole, requiredPermissions) => {
  if (!Array.isArray(requiredPermissions)) return false;
  return requiredPermissions.every(permission => hasPermission(userRole, permission));
};

// 获取用户角色的所有权限
export const getRolePermissions = (userRole) => {
  if (!userRole || !Object.values(userRoles).includes(userRole)) return [];
  return rolePermissions[userRole] || [];
};

// 检查一个角色是否可以管理另一个角色
export const canManageRole = (managerRole, targetRole) => {
  const roleHierarchy = {
    [userRoles.SUPER_ADMIN]: [userRoles.ADMIN, userRoles.EDITOR, userRoles.USER],
    [userRoles.ADMIN]: [userRoles.EDITOR, userRoles.USER],
    [userRoles.EDITOR]: [userRoles.USER],
    [userRoles.USER]: []
  };

  return roleHierarchy[managerRole]?.includes(targetRole) || false;
};