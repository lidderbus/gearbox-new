// src/auth/Auth.js
import { SHA256 } from 'crypto-js';

// 用户角色定义
export const userRoles = {
  VIEWER: 'viewer',      // 只能查看并生成选型/报告
  EDITOR: 'editor',      // 可以修改参数和定价
  ADMIN: 'admin',        // 可以管理用户和数据库
  SUPER_ADMIN: 'super'   // 完全访问权限，包括系统配置
};

// 角色权限映射
export const rolePermissions = {
  [userRoles.VIEWER]: ['view_selection', 'generate_reports'],
  [userRoles.EDITOR]: ['view_selection', 'generate_reports', 'edit_prices', 'edit_parameters'],
  [userRoles.ADMIN]: ['view_selection', 'generate_reports', 'edit_prices', 'edit_parameters', 'manage_users', 'manage_database'],
  [userRoles.SUPER_ADMIN]: ['view_selection', 'generate_reports', 'edit_prices', 'edit_parameters', 'manage_users', 'manage_database', 'system_config']
};

// 初始默认用户
const defaultUsers = [
  {
    id: 1,
    username: 'admin',
    // 默认密码: admin123
    passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
    role: userRoles.ADMIN,
    name: '系统管理员',
    department: '技术部',
    lastLogin: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    username: 'user',
    // 默认密码: user123
    passwordHash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    role: userRoles.VIEWER,
    name: '普通用户',
    department: '销售部',
    lastLogin: null,
    createdAt: new Date().toISOString()
  }
];

// 内存中的用户数组
let users = [...defaultUsers];

// 存储工具
export const saveUsers = () => {
  try {
    localStorage.setItem('gearbox_users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('保存用户数据失败:', error);
    return false;
  }
};

export const loadUsers = () => {
  try {
    const savedUsers = localStorage.getItem('gearbox_users');
    if (savedUsers) {
      users = JSON.parse(savedUsers);
    } else {
      // 如果没有已保存的用户，初始化默认用户并保存
      users = [...defaultUsers];
      saveUsers();
    }
    return true;
  } catch (error) {
    console.error('加载用户数据失败:', error);
    return false;
  }
};

// 初始化加载用户
loadUsers();

// 获取用户列表
export const listUsers = () => {
  // 返回用户列表的深拷贝，移除敏感信息
  return users.map(({ passwordHash, ...user }) => ({ ...user }));
};

// 获取单个用户
export const getUser = (id) => {
  const user = users.find(u => u.id === id);
  if (user) {
    // 返回用户的深拷贝，移除敏感信息
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
  return null;
};

// 密码哈希函数
const hashPassword = (password) => {
  return SHA256(password).toString();
};

// 创建新用户
export const createUser = (userData) => {
  // 验证必填字段
  if (!userData.username || !userData.password || !userData.role) {
    throw new Error('用户名、密码和角色为必填字段');
  }
  
  // 检查用户名是否已存在
  if (users.some(u => u.username === userData.username)) {
    throw new Error('用户名已存在');
  }
  
  // 生成新ID
  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  
  // 创建新用户对象
  const newUser = {
    id: newId,
    username: userData.username,
    passwordHash: hashPassword(userData.password),
    role: userData.role,
    name: userData.name || userData.username,
    department: userData.department || '',
    lastLogin: null,
    createdAt: new Date().toISOString()
  };
  
  // 添加到用户数组
  users.push(newUser);
  
  // 保存更改
  saveUsers();
  
  // 返回新用户信息（不含密码）
  const { passwordHash, ...safeUser } = newUser;
  return safeUser;
};

// 更新用户
export const updateUser = (id, userData) => {
  // 查找用户
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    throw new Error('用户不存在');
  }
  
  const updatedUser = { ...users[userIndex] };
  
  // 更新字段（除了ID和用户名）
  if (userData.name) updatedUser.name = userData.name;
  if (userData.department) updatedUser.department = userData.department;
  if (userData.role) updatedUser.role = userData.role;
  if (userData.password && userData.password.trim() !== '') {
    updatedUser.passwordHash = hashPassword(userData.password);
  }
  
  // 应用更新
  users[userIndex] = updatedUser;
  
  // 保存更改
  saveUsers();
  
  // 返回更新后的用户信息（不含密码）
  const { passwordHash, ...safeUser } = updatedUser;
  return safeUser;
};

// 删除用户
export const deleteUser = (id) => {
  // 查找用户
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    throw new Error('用户不存在');
  }
  
  // 防止删除最后一个管理员
  const isAdmin = users[userIndex].role === userRoles.ADMIN || users[userIndex].role === userRoles.SUPER_ADMIN;
  if (isAdmin) {
    const adminCount = users.filter(u => 
      u.role === userRoles.ADMIN || u.role === userRoles.SUPER_ADMIN
    ).length;
    
    if (adminCount <= 1) {
      throw new Error('无法删除最后一个管理员账户');
    }
  }
  
  // 删除用户
  users.splice(userIndex, 1);
  
  // 保存更改
  saveUsers();
  
  return true;
};

// 登录函数
export const login = (username, password) => {
  // 查找用户
  const user = users.find(u => u.username === username);
  if (!user) {
    return null; // 用户不存在
  }
  
  // 验证密码
  const passwordHash = hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    return null; // 密码错误
  }
  
  // 更新最后登录时间
  const userIndex = users.findIndex(u => u.id === user.id);
  users[userIndex].lastLogin = new Date().toISOString();
  saveUsers();
  
  // 创建会话
  const sessionUser = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    department: user.department
  };
  
  // 保存到sessionStorage
  sessionStorage.setItem('current_user', JSON.stringify(sessionUser));
  
  return sessionUser;
};

// 登出函数
export const logout = () => {
  // 清除会话
  sessionStorage.removeItem('current_user');
  return true;
};

// 获取当前登录用户
export const getCurrentUser = () => {
  try {
    const userJson = sessionStorage.getItem('current_user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  } catch (error) {
    console.error('获取当前用户失败:', error);
    return null;
  }
};

// 检查权限
export const hasPermission = (requiredPermission) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  const userPermissions = rolePermissions[currentUser.role] || [];
  return userPermissions.includes(requiredPermission);
};