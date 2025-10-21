/**
 * 认证相关类型定义
 */

/**
 * 用户角色
 */
export type UserRole = 'USER' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';

/**
 * 权限
 */
export type Permission =
  | 'view_data'
  | 'edit_data'
  | 'delete_data'
  | 'manage_users'
  | 'manage_database'
  | 'export_data'
  | 'import_data';

/**
 * 用户信息
 */
export interface User {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  email?: string;
  createdAt?: string;
  lastLogin?: string;
}

/**
 * 登录凭据
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * 登录结果
 */
export interface LoginResult {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

/**
 * 认证上下文
 */
export interface AuthContextType {
  user: User | null;
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: Error | null;
  login: (username: string, password: string) => LoginResult;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission?: (permission: Permission) => boolean;
}
