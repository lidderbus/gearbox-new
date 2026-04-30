// src/components/AppHeader.js
// 应用头部组件 - 包含工具栏和提示信息

import React, { lazy, Suspense, useMemo } from 'react';
import { Row, Col, Button, Alert, Spinner, Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// P2#9 (2026-04-30) — 诊断面板红角标 + hover 显示前 3 条空数据集
const DIAGNOSTIC_COLLECTIONS = [
  { key: 'hcGearboxes', name: 'HC系列齿轮箱' },
  { key: 'gwGearboxes', name: 'GW系列齿轮箱' },
  { key: 'hcmGearboxes', name: 'HCM系列齿轮箱' },
  { key: 'dtGearboxes', name: 'DT系列齿轮箱' },
  { key: 'hcqGearboxes', name: 'HCQ系列齿轮箱' },
  { key: 'gcGearboxes', name: 'GC系列齿轮箱' },
  { key: 'hcaGearboxes', name: 'HCA系列齿轮箱' },
  { key: 'hcvGearboxes', name: 'HCV系列齿轮箱' },
  { key: 'hcxGearboxes', name: 'HCX系列齿轮箱' },
  { key: 'mvGearboxes', name: 'MV系列齿轮箱' },
  { key: 'otherGearboxes', name: '其他系列齿轮箱' },
  { key: 'flexibleCouplings', name: '高弹性联轴器' },
  { key: 'standbyPumps', name: '备用泵' },
];

const NotificationCenter = lazy(() => import('./NotificationCenter'));

/**
 * 应用头部工具栏组件
 */
const AppHeader = ({
  // 用户信息
  user,
  isAdmin,
  logout,

  // 主题
  theme,
  toggleTheme,
  colors,

  // 状态
  loading,
  error,
  success,
  setError,
  setSuccess,
  setShowDiagnosticPanel,

  // 数据状态
  appDataState
}) => {
  // P2#9 — 计算诊断空集合数 (前 3 条用于 hover 预览)
  const diagnostics = useMemo(() => {
    const issues = DIAGNOSTIC_COLLECTIONS
      .map(col => ({
        ...col,
        count: Array.isArray(appDataState?.[col.key]) ? appDataState[col.key].length : 0
      }))
      .filter(c => c.count === 0);
    return { issues, total: issues.length, top: issues.slice(0, 3) };
  }, [appDataState]);

  const diagnosticPopover = (
    <Popover id="diagnostic-preview" style={{ maxWidth: 320 }}>
      <Popover.Header as="h6" style={{ fontSize: '0.85rem' }}>
        <i className="bi bi-exclamation-triangle-fill text-warning me-1"></i>
        待处理诊断 ({diagnostics.total})
      </Popover.Header>
      <Popover.Body style={{ fontSize: '0.85rem', padding: '8px 12px' }}>
        {diagnostics.total === 0 ? (
          <span className="text-success">
            <i className="bi bi-check-circle-fill me-1"></i>所有数据集就绪
          </span>
        ) : (
          <>
            {diagnostics.top.map(item => (
              <div key={item.key} className="d-flex align-items-center mb-1">
                <i className="bi bi-circle-fill text-danger me-2" style={{ fontSize: '0.5rem' }}></i>
                <span>{item.name} <small className="text-muted">(空)</small></span>
              </div>
            ))}
            {diagnostics.total > 3 && (
              <div className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
                其余 {diagnostics.total - 3} 项点击展开...
              </div>
            )}
          </>
        )}
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <div className="app-header">
        <h1>船用齿轮箱选型系统</h1>
        <p>自动选型、报价和技术协议生成</p>
      </div>
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center gap-2">
            {user && <span style={{ color: colors.muted, fontSize: '0.9em' }} className="me-2">用户: {user.username} ({user.role})</span>}
            {isAdmin && (
              <>
                <Button as={Link} to="/users" variant="outline-success" size="sm" title="管理用户">
                  <i className="bi bi-people me-1"></i> 用户管理
                </Button>
                <Button as={Link} to="/database" variant="outline-success" size="sm" title="管理数据库">
                  <i className="bi bi-database me-1"></i> 数据库管理
                </Button>
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="bottom"
                  overlay={diagnosticPopover}
                  delay={{ show: 200, hide: 100 }}
                >
                  <Button
                    variant={diagnostics.total > 0 ? 'outline-danger' : 'outline-info'}
                    size="sm"
                    onClick={() => setShowDiagnosticPanel(true)}
                    title={`系统诊断 (${diagnostics.total} 项待处理)`}
                    style={{ position: 'relative' }}
                  >
                    <i className="bi bi-wrench-adjustable me-1"></i>
                    系统诊断
                    {diagnostics.total > 0 && (
                      <Badge
                        bg="danger"
                        pill
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          fontSize: '0.65rem',
                          minWidth: 18,
                          padding: '2px 5px'
                        }}
                      >
                        {diagnostics.total}
                      </Badge>
                    )}
                  </Button>
                </OverlayTrigger>
              </>
            )}
            <Suspense fallback={null}>
              <NotificationCenter />
            </Suspense>
            <Button
              variant={theme === 'light' ? 'outline-secondary' : 'outline-light'}
              size="sm"
              onClick={toggleTheme}
              title={`切换${theme === 'light' ? '深色' : '浅色'}主题`}
              style={{ borderColor: colors.inputBorder, color: colors.muted }}
              className="theme-toggle-button"
            >
              <i className={`bi bi-${theme === 'light' ? 'moon-stars-fill' : 'sun-fill'} me-1`}></i>
            </Button>
            {user && (
              <Button variant="outline-danger" size="sm" onClick={logout} title="退出登录">
                <i className="bi bi-box-arrow-right me-1"></i> 退出
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert
              variant={error.includes('成功') ? 'success' : error.includes('警告') || error.includes('无法加载') || error.includes('注意') || error.includes('失败') || error.includes('错误') ? 'warning' : 'danger'}
              onClose={() => setError('')}
              dismissible={!loading}
              className={`app-alert alert-${theme}`}
            >
              {loading && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />}
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {success && (
        <Row className="mb-4">
          <Col>
            <Alert
              variant="success"
              onClose={() => setSuccess('')}
              dismissible
              className={`app-alert alert-${theme}`}
            >
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
            </Alert>
          </Col>
        </Row>
      )}

      {loading && !error && !success && (
        <Row className="mb-4">
          <Col className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2" style={{ color: colors.text }}>正在执行操作...</p>
          </Col>
        </Row>
      )}

      {(!appDataState || Object.keys(appDataState).length === 0) && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i> 系统数据正在加载中或加载失败。
            </Alert>
          </Col>
        </Row>
      )}
    </>
  );
};

export default AppHeader;
