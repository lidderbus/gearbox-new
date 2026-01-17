// src/components/AppHeader.js
// 应用头部组件 - 包含工具栏和提示信息

import React from 'react';
import { Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
                <Button variant="outline-info" size="sm" onClick={() => setShowDiagnosticPanel(true)} title="系统诊断">
                  <i className="bi bi-wrench-adjustable me-1"></i> 系统诊断
                </Button>
              </>
            )}
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
