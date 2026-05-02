// src/hooks/useLibraryPermissions.js
// P0-4: 资料库统一权限检查
// 角色 → 权限映射:
//   USER         : 仅 read (浏览预览)
//   EDITOR/ADMIN : read + download
//   ADMIN/SUPER  : 加 publish (发布新版本/上传)

import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission, permissions } from '../auth/roles';

export const useLibraryPermissions = () => {
  const { user } = useAuth();
  return useMemo(() => {
    const role = user?.role || null;
    if (!role) {
      return { canRead: false, canDownload: false, canPublish: false, role: null, isAuthenticated: false };
    }
    return {
      canRead: hasPermission(role, permissions.LIBRARY_READ),
      canDownload: hasPermission(role, permissions.LIBRARY_DOWNLOAD),
      canPublish: hasPermission(role, permissions.LIBRARY_PUBLISH),
      role,
      isAuthenticated: true,
    };
  }, [user]);
};

export default useLibraryPermissions;
