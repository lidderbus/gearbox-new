// P0-4: 资料库权限提示横幅 — 当前用户无下载权时提示
import React from 'react';
import { Alert } from 'react-bootstrap';
import { useLibraryPermissions } from '../../hooks/useLibraryPermissions';

const LibraryPermissionBanner = ({ scope = '资料库' }) => {
  const { canRead, canDownload, role, isAuthenticated } = useLibraryPermissions();
  if (!isAuthenticated || !canRead) {
    return (
      <Alert variant="warning" className="py-2 mb-3" style={{ fontSize: '0.85em' }}>
        <i className="bi bi-shield-lock me-2"></i>
        当前未登录或无访问权限,部分{scope}内容受限。请联系管理员。
      </Alert>
    );
  }
  if (!canDownload) {
    return (
      <Alert variant="info" className="py-2 mb-3" style={{ fontSize: '0.85em' }}>
        <i className="bi bi-info-circle me-2"></i>
        当前角色 <strong>{role}</strong> 仅可浏览预览{scope},如需下载原件请联系管理员升级权限 (EDITOR/ADMIN)。
      </Alert>
    );
  }
  return null;
};

export default LibraryPermissionBanner;
