// src/components/RoleManagement.js
// 角色权限管理 - 用户角色与功能权限设置 (localStorage持久化 + 操作日志 + 用户管理)
import React, { useState, useCallback, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, ListGroup, Collapse, InputGroup } from 'react-bootstrap';

const ALL_PERMISSIONS = [
  { key: 'selection', label: '选型计算', icon: 'bi-calculator', group: '核心功能' },
  { key: 'quotation', label: '报价管理', icon: 'bi-receipt', group: '核心功能' },
  { key: 'contract', label: '合同管理', icon: 'bi-file-earmark-text', group: '核心功能' },
  { key: 'pricing', label: '价格调整', icon: 'bi-currency-yuan', group: '管理功能' },
  { key: 'data_query', label: '数据查询', icon: 'bi-database', group: '核心功能' },
  { key: 'agreement', label: '技术协议', icon: 'bi-file-earmark-ruled', group: '核心功能' },
  { key: 'analytics', label: '统计分析', icon: 'bi-graph-up', group: '分析功能' },
  { key: 'user_mgmt', label: '用户管理', icon: 'bi-people', group: '管理功能' },
  { key: 'backup', label: '数据备份', icon: 'bi-cloud-upload', group: '管理功能' },
  { key: 'settings', label: '系统设置', icon: 'bi-gear', group: '管理功能' },
];

const DEFAULT_ROLES = [
  { id: 'admin', name: '系统管理员', desc: '拥有所有功能权限', color: 'danger',
    permissions: ALL_PERMISSIONS.map(p => p.key) },
  { id: 'sales', name: '销售工程师', desc: '选型、报价、合同相关功能', color: 'primary',
    permissions: ['selection', 'quotation', 'contract', 'data_query', 'agreement'] },
  { id: 'tech', name: '技术工程师', desc: '选型计算与技术分析', color: 'success',
    permissions: ['selection', 'data_query', 'agreement', 'analytics'] },
  { id: 'viewer', name: '只读用户', desc: '仅查看权限', color: 'secondary',
    permissions: ['data_query'] },
];

const DEFAULT_USERS = [
  { username: 'admin', displayName: '管理员', role: 'admin' },
  { username: 'zhangsan', displayName: '张三', role: 'sales' },
  { username: 'lisi', displayName: '李四', role: 'tech' },
];

const LS_ROLES = 'rbac_config';
const LS_LOG = 'rbac_audit_log';
const LS_USERS = 'rbac_users';
const MAX_LOG = 100;
const MAX_USERS = 20;

function loadJson(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

export default function RoleManagement({ colors, theme }) {
  const [roles, setRoles] = useState(() => loadJson(LS_ROLES, DEFAULT_ROLES));
  const [users, setUsers] = useState(() => loadJson(LS_USERS, DEFAULT_USERS));
  const [log, setLog] = useState(() => loadJson(LS_LOG, []));
  const [selectedRole, setSelectedRole] = useState(null);
  const [logOpen, setLogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', displayName: '', role: 'viewer' });
  const [editIdx, setEditIdx] = useState(-1);

  useEffect(() => { localStorage.setItem(LS_ROLES, JSON.stringify(roles)); }, [roles]);
  useEffect(() => { localStorage.setItem(LS_USERS, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(LS_LOG, JSON.stringify(log)); }, [log]);

  const addLog = useCallback((role, permission, action) => {
    setLog(prev => [{ timestamp: new Date().toISOString(), role, permission, action, operator: 'admin' }, ...prev].slice(0, MAX_LOG));
  }, []);

  const togglePermission = useCallback((roleId, permKey) => {
    setRoles(prev => prev.map(r => {
      if (r.id !== roleId) return r;
      const has = r.permissions.includes(permKey);
      return { ...r, permissions: has ? r.permissions.filter(p => p !== permKey) : [...r.permissions, permKey] };
    }));
    const role = roles.find(r => r.id === roleId);
    const perm = ALL_PERMISSIONS.find(p => p.key === permKey);
    const has = role?.permissions.includes(permKey);
    addLog(role?.name || roleId, perm?.label || permKey, has ? 'revoke' : 'grant');
  }, [roles, addLog]);

  const saveUser = () => {
    if (!newUser.username.trim() || !newUser.displayName.trim()) return;
    if (editIdx >= 0) {
      setUsers(prev => prev.map((u, i) => i === editIdx ? { ...newUser } : u));
      setEditIdx(-1);
    } else {
      if (users.length >= MAX_USERS || users.some(u => u.username === newUser.username.trim())) return;
      setUsers(prev => [...prev, { ...newUser, username: newUser.username.trim(), displayName: newUser.displayName.trim() }]);
    }
    setNewUser({ username: '', displayName: '', role: 'viewer' });
  };

  const roleColor = (id) => roles.find(r => r.id === id)?.color || 'secondary';
  const roleName = (id) => roles.find(r => r.id === id)?.name || id;

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-shield-lock me-2"></i>角色权限管理</h5>
          <small className="text-muted">管理用户角色与功能模块访问权限 (数据自动保存)</small>
        </Col>
      </Row>

      <Row>
        {/* Left: Role list */}
        <Col md={4}>
          <Card className="mb-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>角色列表</span><Badge bg="info">{roles.length} 个</Badge>
            </Card.Header>
            <ListGroup variant="flush">
              {roles.map(r => (
                <ListGroup.Item key={r.id} action active={selectedRole?.id === r.id} onClick={() => setSelectedRole(r)}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span><Badge bg={r.color} className="me-2">{r.name}</Badge></span>
                    <small>{r.permissions.length}/{ALL_PERMISSIONS.length} 权限</small>
                  </div>
                  <small className="text-muted">{r.desc}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>

          {/* User management */}
          <Card className="mb-3">
            <Card.Header><i className="bi bi-person-plus me-1"></i>用户管理 <Badge bg="secondary">{users.length}/{MAX_USERS}</Badge></Card.Header>
            <Card.Body style={{ maxHeight: 260, overflowY: 'auto' }}>
              <Table size="sm" hover className="mb-2">
                <thead><tr><th>用户名</th><th>姓名</th><th>角色</th><th></th></tr></thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.username}>
                      <td><code>{u.username}</code></td><td>{u.displayName}</td>
                      <td><Badge bg={roleColor(u.role)}>{roleName(u.role)}</Badge></td>
                      <td className="text-nowrap">
                        <Button size="sm" variant="link" className="p-0 me-2" onClick={() => { setNewUser({ ...u }); setEditIdx(i); }}>
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button size="sm" variant="link" className="p-0 text-danger" onClick={() => setUsers(prev => prev.filter((_, j) => j !== i))}>
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <InputGroup size="sm" className="mb-1">
                <Form.Control placeholder="用户名" value={newUser.username} onChange={e => setNewUser(p => ({ ...p, username: e.target.value }))} />
                <Form.Control placeholder="姓名" value={newUser.displayName} onChange={e => setNewUser(p => ({ ...p, displayName: e.target.value }))} />
                <Form.Select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))} style={{ maxWidth: 110 }}>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </Form.Select>
                <Button variant={editIdx >= 0 ? 'warning' : 'primary'} onClick={saveUser}>
                  {editIdx >= 0 ? '保存' : '添加'}
                </Button>
              </InputGroup>
              {editIdx >= 0 && <Button size="sm" variant="link" onClick={() => { setEditIdx(-1); setNewUser({ username: '', displayName: '', role: 'viewer' }); }}>取消编辑</Button>}
            </Card.Body>
          </Card>
        </Col>

        {/* Right: Permission matrix */}
        <Col md={8}>
          {selectedRole ? (
            <Card className="mb-3">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span><Badge bg={selectedRole.color} className="me-2">{selectedRole.name}</Badge>权限配置</span>
                <small className="text-muted">{selectedRole.desc}</small>
              </Card.Header>
              <Card.Body>
                <Row>
                  {['核心功能', '管理功能', '分析功能'].map(group => (
                    <Col md={4} key={group}>
                      <h6 className="text-muted mb-2">{group}</h6>
                      {ALL_PERMISSIONS.filter(p => p.group === group).map(p => (
                        <Form.Check key={p.key} type="switch" className="mb-2" id={`perm-${selectedRole.id}-${p.key}`}
                          label={<span><i className={`bi ${p.icon} me-1`}></i>{p.label}</span>}
                          checked={selectedRole.permissions.includes(p.key)}
                          onChange={() => {
                            togglePermission(selectedRole.id, p.key);
                            setSelectedRole(prev => ({
                              ...prev,
                              permissions: prev.permissions.includes(p.key)
                                ? prev.permissions.filter(pk => pk !== p.key)
                                : [...prev.permissions, p.key]
                            }));
                          }}
                        />
                      ))}
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          ) : (
            <Alert variant="info"><i className="bi bi-arrow-left me-1"></i>请从左侧选择一个角色查看和编辑权限</Alert>
          )}

          {/* Audit log */}
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center" style={{ cursor: 'pointer' }} onClick={() => setLogOpen(!logOpen)}>
              <span><i className={`bi bi-chevron-${logOpen ? 'down' : 'right'} me-1`}></i>操作日志 <Badge bg="secondary">{log.length}</Badge></span>
              {log.length > 0 && (
                <Button size="sm" variant="outline-danger" onClick={e => { e.stopPropagation(); setLog([]); }}>清空日志</Button>
              )}
            </Card.Header>
            <Collapse in={logOpen}>
              <div>
                <Card.Body style={{ maxHeight: 220, overflowY: 'auto', padding: log.length ? undefined : '1rem' }}>
                  {log.length === 0 ? <small className="text-muted">暂无操作记录</small> : (
                    <Table size="sm" hover>
                      <thead><tr><th>时间</th><th>角色</th><th>权限</th><th>操作</th></tr></thead>
                      <tbody>
                        {log.map((entry, i) => (
                          <tr key={i}>
                            <td><small>{new Date(entry.timestamp).toLocaleString('zh-CN')}</small></td>
                            <td>{entry.role}</td><td>{entry.permission}</td>
                            <td><Badge bg={entry.action === 'grant' ? 'success' : 'warning'}>{entry.action === 'grant' ? '授予' : '撤销'}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </div>
            </Collapse>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
