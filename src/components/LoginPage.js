// src/components/LoginPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const loginAttemptedRef = useRef(false); // 使用ref而不是state
  
  const { user, currentUser, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  
  // 只在组件首次挂载时清除存储，使用ref避免重复运行
  const storageCleared = useRef(false);
  useEffect(() => {
    if (!storageCleared.current) {
      localStorage.removeItem('user');
      localStorage.removeItem('gearbox_users');
      sessionStorage.removeItem('current_user');
      storageCleared.current = true;
    }
  }, []);
  
  // 检测登录状态变化并导航
  useEffect(() => {
    // 只在已认证且未导航的情况下执行一次
    if (isAuthenticated && (user || currentUser) && !loginAttemptedRef.current) {
      loginAttemptedRef.current = true; // 标记为已尝试导航
      // 使用replace模式避免历史堆栈问题
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, currentUser, navigate]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // 如果已经在加载中，不要重复提交
    if (loading) return;
    
    setError('');
    setLoading(true);
    
    try {
      // 基本表单验证
      if (!username.trim() || !password.trim()) {
        throw new Error('请输入用户名和密码');
      }
      
      // 调用登录函数
      login(username, password);
      // 不设置loginAttempted state，改用ref来避免重渲染
      loginAttemptedRef.current = true;
      
    } catch (err) {
      console.error('登录失败', err.message);
      setError(err.message || '登录失败，请重试');
      setLoading(false);
      loginAttemptedRef.current = false;
    }
  };
  
  // 如果已认证，显示简单的加载而不是整个表单
  if (isAuthenticated) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f5f7fa' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <h4 className="mt-3">登录成功，正在进入系统...</h4>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Row className="w-100">
        <Col md={6} lg={5} className="mx-auto">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-primary text-white text-center py-3">
              <h4 className="mb-0">船用齿轮箱选型系统</h4>
            </Card.Header>
            <Card.Body className="p-4">
              <h5 className="text-center mb-4">用户登录</h5>
              
              {error && (
                <Alert variant="danger" className="mb-4">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>用户名</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    placeholder="请输入用户名"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>密码</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    placeholder="请输入密码"
                    required
                  />
                </Form.Group>
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={loading}
                    className="py-2"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        登录中...
                      </>
                    ) : '登录'}
                  </Button>
                </div>
              </Form>
              
              <div className="mt-4 text-center">
                <Alert variant="warning" className="p-2">
                  <strong>安全提示：</strong>系统密码已更新，请使用新密码登录！
                </Alert>
                <div className="text-muted">
                  <p className="mb-0">管理员账号: admin / Gbox@2024!</p>
                  <p>普通用户账号: user / User@2024!</p>
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="text-center text-muted py-3 bg-light">
              <small>杭州前进齿轮箱集团股份有限公司 &copy; {new Date().getFullYear()}</small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;