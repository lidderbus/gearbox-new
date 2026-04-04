// src/components/RoleManagement.js
// 角色权限管理 - 用户角色与功能权限设置
import React, { useState, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, ListGroup } from 'react-bootstrap';

const DEFAULT_ROLES = [
  {
    id: 'admin', name: '系统管理员', desc: '拥有所有功能权限',
    permissions: ['selection', 'quotation', 'contract', 'pricing', 'data_query', 'agreement', 'analytics', 'user_mgmt', 'backup', 'settings'],
    users: ['admin'],
  },
  {
    id: 'sales', name: '销售工程师', desc: '选型、报价、合同相关功能',
    permissions: ['selection', 'quotation', 'contract', 'data_query', 'agreement'],
    users: ['张工', '李工', '王工'],
  },
  {
    id: 'tech', name: '技术工程师', desc: '选型计算与技术分析',
    permissions: ['selection', 'data_query', 'agreement', 'analytics'],
    users: ['赵工', '钱工'],
  },
  {
    id: 'viewer', name: '只读用户', desc: '仅查看权限',
    permissions: ['data_query'],
    users: ['访客1'],
  },
];

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

export default function RoleManagement({ colors, theme }) {
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [selectedRole, setSelectedRole] = useState(null);

  const togglePermission = useCallback((roleId, permKey) => {
    setRoles(prev => prev.map(r => {
      if (r.id !== roleId) return r;
      const perms = r.permissions.includes(permKey)
        ? r.permissions.filter(p => p !== permKey)
        : [...r.permissions, permKey];
      return { ...r, permissions: perms };
    }));
  }, []);

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-people me-2"></i>角色权限管理</h5>
          <small className="text-muted">管理用户角色与功能模块访问权限</small>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>角色列表</span>
              <Badge bg="info">{roles.length} 个</Badge>
            </Card.Header>
            <ListGroup variant="flush">
              {roles.map(r => (
                <ListGroup.Item key={r.id} action active={selectedRole?.id === r.id} onClick={() => setSelectedRole(r)}>
                  <div className="d-flex justify-content-between">
                    <strong>{r.name}</strong>
                    <Badge bg="light" text="dark">{r.users.length}人</Badge>
                  </div>
                  <small>{r.desc}</small>
                  <div className="mt-1">
                    {r.permissions.length}/{ALL_PERMISSIONS.length} 项权限
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        <Col md={8}>
          {selectedRole ? (
            <>
              <Card className="mb-3">
                <Card.Header>
                  <strong>{selectedRole.name}</strong> — 权限配置
                </Card.Header>
                <Card.Body>
                  <Row>
                    {['核心功能', '管理功能', '分析功能'].map(group => {
                      const perms = ALL_PERMISSIONS.filter(p => p.group === group);
                      return (
                        <Col md={4} key={group}>
                          <h6 className="text-muted mb-2">{group}</h6>
                          {perms.map(p => (
                            <Form.Check key={p.key} type="switch" className="mb-1" id={`perm-${selectedRole.id}-${p.key}`}
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
                      );
                    })}
                  </Row>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header>
                  <strong>{selectedRole.name}</strong> — 用户 ({selectedRole.users.length})
                </Card.Header>
                <Card.Body>
                  {selectedRole.users.map((u, i) => (
                    <Badge key={i} bg="outline-primary" text="primary" className="border me-2 mb-1 py-2 px-3">
                      <i className="bi bi-person me-1"></i>{u}
                    </Badge>
                  ))}
                </Card.Body>
              </Card>
            </>
          ) : (
            <Alert variant="info"><i className="bi bi-arrow-left me-1"></i>请从左侧选择一个角色查看和编辑权限</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}
