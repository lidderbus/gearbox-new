// src/components/UserManagementView.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert, Badge, Spinner, Card, Row, Col, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userRoles } from '../auth/roles';
import { 
  createUser, updateUser, deleteUser, listUsers 
} from '../auth/Auth';

/**
 * UserManagementView组件 - 用户管理界面
 * 
 * 该组件提供用户的增删改查功能，包括:
 * - 用户列表展示
 * - 添加新用户
 * - 编辑现有用户
 * - 删除用户
 * 
 * 只有管理员和超级管理员角色可以访问该界面
 */
const UserManagementView = () => {
  // 状态定义
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');
  
  // 组件挂载时加载用户数据
  useEffect(() => {
    loadUsers();
  }, []);
  
  // 加载用户数据函数
  const loadUsers = () => {
    setLoading(true);
    try {
      const usersList = listUsers();
      setUsers(usersList);
      setError('');
    } catch (err) {
      setError('加载用户列表失败: ' + err.message);
      console.error('加载用户列表失败:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 添加用户处理函数
  const handleAddUser = () => {
    setCurrentUser({
      username: '',
      password: '',
      name: '',
      department: '',
      role: userRoles.VIEWER,
      email: '',
      phone: ''
    });
    setConfirmPassword('');
    setConfirmError('');
    setPasswordVisible(false);
    setShowModal(true);
  };
  
  // 编辑用户处理函数
  const handleEditUser = (user) => {
    setCurrentUser({
      ...user,
      password: '' // 清空密码字段，编辑时不显示原密码
    });
    setConfirmPassword('');
    setConfirmError('');
    setPasswordVisible(false);
    setShowModal(true);
  };
  
  // 删除用户处理函数
  const handleDeleteUser = (userId) => {
    if (window.confirm('确定要删除此用户吗？此操作不可撤销！')) {
      try {
        deleteUser(userId);
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        setSuccess('用户已成功删除');
        
        // 3秒后清除成功消息
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        setError('删除用户失败: ' + err.message);
        console.error('删除用户失败:', err);
      }
    }
  };
  
  // 保存用户处理函数（创建或更新）
  const handleSaveUser = () => {
    // 表单验证
    if (!currentUser.username.trim()) {
      setError('用户名不能为空');
      return;
    }
    
    // 新用户时，密码必填
    if (!currentUser.id && !currentUser.password.trim()) {
      setError('请设置密码');
      return;
    }
    
    // 如果提供了密码，需要进行密码确认验证
    if (currentUser.password.trim() && currentUser.password !== confirmPassword) {
      setConfirmError('两次输入的密码不一致');
      return;
    }
    
    // 清除之前的错误信息
    setError('');
    setConfirmError('');
    setLoading(true);
    
    try {
      // 根据是否有ID决定是创建还是更新用户
      if (currentUser.id) {
        // 更新现有用户
        updateUser(currentUser.id, currentUser);
        
        // 更新本地用户列表状态
        setUsers(prevUsers => prevUsers.map(user => 
          user.id === currentUser.id ? { ...user, ...currentUser, password: undefined } : user
        ));
        
        setSuccess('用户信息已成功更新');
      } else {
        // 创建新用户
        const newUser = createUser(currentUser);
        
        // 添加到本地用户列表状态
        setUsers(prevUsers => [...prevUsers, newUser]);
        
        setSuccess('新用户已成功创建');
      }
      
      // 关闭模态框
      setShowModal(false);
      
      // 3秒后清除成功消息
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('保存用户失败: ' + err.message);
      console.error('保存用户失败:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 表单输入变更处理函数
  const handleInputChange = (field, value) => {
    setCurrentUser({
      ...currentUser,
      [field]: value
    });
    
    // 清除相关字段的错误
    if (field === 'username' || field === 'password') {
      setError('');
    }
    if (field === 'password') {
      setConfirmError('');
    }
  };
  
  // 角色名称映射
  const getRoleName = (role) => {
    switch (role) {
      case userRoles.VIEWER:
        return '查看者';
      case userRoles.EDITOR:
        return '编辑者';
      case userRoles.ADMIN:
        return '管理员';
      case userRoles.SUPER_ADMIN:
        return '超级管理员';
      default:
        return '未知角色';
    }
  };
  
  // 角色徽章颜色映射
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case userRoles.VIEWER:
        return 'secondary';
      case userRoles.EDITOR:
        return 'info';
      case userRoles.ADMIN:
        return 'primary';
      case userRoles.SUPER_ADMIN:
        return 'danger';
      default:
        return 'light';
    }
  };
  
  return (
    <div className="container-fluid py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h3 className="mb-0">用户管理</h3>
          <p className="text-muted mb-0">管理系统用户和权限</p>
        </Col>
        <Col xs="auto">
          <Button 
            as={Link} 
            to="/"
            variant="outline-secondary"
            size="sm"
            className="me-2"
          >
            <i className="bi bi-arrow-left me-1"></i>
            返回主页
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddUser}
            disabled={loading}
          >
            <i className="bi bi-person-plus-fill me-1"></i>
            添加用户
          </Button>
        </Col>
      </Row>
      
      {/* 错误和成功消息显示 */}
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess('')} dismissible>
          <i className="bi bi-check-circle-fill me-2"></i>
          {success}
        </Alert>
      )}
      
      {/* 用户列表卡片 */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">用户列表</h5>
            <span className="text-muted small">
              {loading ? '加载中...' : `共 ${users.length} 个用户`}
            </span>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading && users.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">加载用户数据...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3 text-muted">暂无用户数据</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th width="5%">#</th>
                    <th width="15%">用户名</th>
                    <th width="15%">姓名</th>
                    <th width="15%">部门</th>
                    <th width="10%">角色</th>
                    <th width="15%">上次登录</th>
                    <th width="10%">状态</th>
                    <th width="15%" className="text-end">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.name || '-'}</td>
                      <td>{user.department || '-'}</td>
                      <td>
                        <Badge bg={getRoleBadgeVariant(user.role)} pill>
                          {getRoleName(user.role)}
                        </Badge>
                      </td>
                      <td>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '从未登录'}
                      </td>
                      <td>
                        <Badge bg={user.active ? 'success' : 'secondary'} pill>
                          {user.active ? '活跃' : '禁用'}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditUser(user)}
                          title="编辑用户"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          title="删除用户"
                          disabled={user.role === userRoles.SUPER_ADMIN} // 超级管理员不可删除
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* 用户编辑/添加模态框 */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentUser?.id ? '编辑用户' : '添加新用户'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>用户名 <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={currentUser?.username || ''}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="请输入用户名"
                  disabled={!!currentUser?.id} // 编辑模式下用户名不可修改
                  required
                />
                <Form.Text className="text-muted">
                  用户名将用于登录，创建后不可修改
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>{currentUser?.id ? '密码 (留空保持不变)' : '密码 *'}</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={passwordVisible ? "text" : "password"}
                    value={currentUser?.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={currentUser?.id ? "留空则不修改密码" : "请设置密码"}
                  />
                  <Button 
                    variant="outline-secondary"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    <i className={`bi bi-eye${passwordVisible ? '-slash' : ''}`}></i>
                  </Button>
                </InputGroup>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>确认密码</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入密码"
                  isInvalid={!!confirmError}
                />
                {confirmError && <Form.Control.Feedback type="invalid">{confirmError}</Form.Control.Feedback>}
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>姓名</Form.Label>
                <Form.Control
                  type="text"
                  value={currentUser?.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="请输入姓名"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>部门</Form.Label>
                <Form.Control
                  type="text"
                  value={currentUser?.department || ''}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="请输入部门"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>角色 <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={currentUser?.role || userRoles.VIEWER}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                >
                  <option value={userRoles.VIEWER}>查看者 - 仅可查看数据和生成报告</option>
                  <option value={userRoles.EDITOR}>编辑者 - 可修改价格和参数</option>
                  <option value={userRoles.ADMIN}>管理员 - 可管理用户和数据库</option>
                  <option value={userRoles.SUPER_ADMIN}>超级管理员 - 完全访问权限</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  不同角色拥有不同的系统访问权限
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mt-2">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>电子邮箱</Form.Label>
                <Form.Control
                  type="email"
                  value={currentUser?.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="请输入电子邮箱"
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>联系电话</Form.Label>
                <Form.Control
                  type="text"
                  value={currentUser?.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="请输入联系电话"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            取消
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveUser}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" size="sm" animation="border" className="me-1" />
                处理中...
              </>
            ) : currentUser?.id ? '保存修改' : '创建用户'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagementView;