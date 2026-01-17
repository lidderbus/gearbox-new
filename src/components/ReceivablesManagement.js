// src/components/ReceivablesManagement.js
// 应收账款管理组件 - 解决审计发现的长期应收款问题

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Container, Row, Col, Card, Table, Button, Badge, Form,
  Modal, Alert, InputGroup, Tabs, Tab, ProgressBar
} from 'react-bootstrap';
import {
  AgingCategory,
  CollectionStatus,
  CreditRating,
  createCollectionRecord,
  calculateAging,
  calculateAgingDays,
  calculateProvision,
  initialReceivables,
  calculateReceivablesStats,
  getReceivablesNeedingCollection,
  summarizeByCustomer
} from '../data/receivables';

// 状态显示配置
const statusConfig = {
  [CollectionStatus.NORMAL]: { label: '正常', variant: 'success' },
  [CollectionStatus.OVERDUE]: { label: '逾期', variant: 'danger' },
  [CollectionStatus.IN_COLLECTION]: { label: '催收中', variant: 'warning' },
  [CollectionStatus.DISPUTED]: { label: '有争议', variant: 'info' },
  [CollectionStatus.BAD_DEBT]: { label: '坏账', variant: 'dark' },
  [CollectionStatus.WRITTEN_OFF]: { label: '已核销', variant: 'secondary' }
};

// 账龄显示配置
const agingConfig = {
  [AgingCategory.CURRENT]: { label: '1年以内', variant: 'success', provision: '0%' },
  [AgingCategory.ONE_TO_TWO]: { label: '1-2年', variant: 'warning', provision: '20%' },
  [AgingCategory.OVER_THREE]: { label: '3年以上', variant: 'danger', provision: '100%' }
};

// 应收账款管理主组件
const ReceivablesManagement = ({ colors = {}, theme = 'light' }) => {
  // 状态管理
  const [receivables, setReceivables] = useState([]);
  const [collectionRecords, setCollectionRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAging, setFilterAging] = useState('all');

  // Modal状态
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [selectedReceivable, setSelectedReceivable] = useState(null);
  const [collectionMethod, setCollectionMethod] = useState('phone');
  const [collectionResult, setCollectionResult] = useState('');
  const [collectionOperator, setCollectionOperator] = useState('');
  const [promisedDate, setPromisedDate] = useState('');
  const [promisedAmount, setPromisedAmount] = useState('');

  // 提示信息
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });

  // 初始化数据
  useEffect(() => {
    const savedReceivables = localStorage.getItem('shanghai_receivables');
    const savedRecords = localStorage.getItem('shanghai_collection_records');

    if (savedReceivables) {
      try {
        setReceivables(JSON.parse(savedReceivables));
      } catch (e) {
        setReceivables(initialReceivables);
      }
    } else {
      setReceivables(initialReceivables);
    }

    if (savedRecords) {
      try {
        setCollectionRecords(JSON.parse(savedRecords));
      } catch (e) {
        setCollectionRecords([]);
      }
    }
  }, []);

  // 保存数据
  useEffect(() => {
    if (receivables.length > 0) {
      localStorage.setItem('shanghai_receivables', JSON.stringify(receivables));
    }
  }, [receivables]);

  useEffect(() => {
    if (collectionRecords.length > 0) {
      localStorage.setItem('shanghai_collection_records', JSON.stringify(collectionRecords));
    }
  }, [collectionRecords]);

  // 计算统计数据
  const stats = useMemo(() => calculateReceivablesStats(receivables), [receivables]);

  // 需要催收的应收款
  const needsCollection = useMemo(() =>
    getReceivablesNeedingCollection(receivables), [receivables]);

  // 按客户汇总
  const customerSummary = useMemo(() =>
    summarizeByCustomer(receivables), [receivables]);

  // 过滤应收账款列表
  const filteredReceivables = useMemo(() => {
    return receivables.filter(item => {
      const matchSearch = searchTerm === '' ||
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = filterStatus === 'all' || item.status === filterStatus;

      const aging = calculateAging(item.invoiceDate);
      const matchAging = filterAging === 'all' || aging === filterAging;

      return matchSearch && matchStatus && matchAging;
    });
  }, [receivables, searchTerm, filterStatus, filterAging]);

  // 显示提示
  const showAlert = useCallback((variant, message) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => setAlert({ show: false, variant: '', message: '' }), 5000);
  }, []);

  // 打开催收Modal
  const handleOpenCollectionModal = useCallback((receivable) => {
    setSelectedReceivable(receivable);
    setCollectionMethod('phone');
    setCollectionResult('');
    setCollectionOperator('');
    setPromisedDate('');
    setPromisedAmount('');
    setShowCollectionModal(true);
  }, []);

  // 记录催收
  const handleRecordCollection = useCallback(() => {
    if (!selectedReceivable || !collectionResult) {
      showAlert('danger', '请填写催收结果');
      return;
    }

    const record = createCollectionRecord({
      receivableId: selectedReceivable.id,
      customerId: selectedReceivable.customerId,
      customerName: selectedReceivable.customerName,
      method: collectionMethod,
      operator: collectionOperator,
      result: collectionResult,
      promisedDate: promisedDate || null,
      promisedAmount: promisedAmount ? parseFloat(promisedAmount) : 0
    });

    // 保存催收记录
    setCollectionRecords(prev => [record, ...prev]);

    // 更新应收款状态为催收中
    setReceivables(prev => prev.map(item => {
      if (item.id === selectedReceivable.id) {
        return { ...item, status: CollectionStatus.IN_COLLECTION };
      }
      return item;
    }));

    setShowCollectionModal(false);
    showAlert('success', '催收记录已保存');
  }, [selectedReceivable, collectionMethod, collectionResult, collectionOperator, promisedDate, promisedAmount, showAlert]);

  // 渲染统计卡片
  const renderStatsCards = () => (
    <Row className="mb-4">
      <Col md={3}>
        <Card className="h-100 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <Card.Body className="text-center">
            <h6 className="text-muted mb-2">应收总额</h6>
            <h3 className="text-primary mb-0">¥{stats.totalBalance.toLocaleString()}</h3>
            <small className="text-muted">
              已收: ¥{stats.totalPaid.toLocaleString()}
            </small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="h-100 shadow-sm border-warning" style={{ backgroundColor: colors.card }}>
          <Card.Body className="text-center">
            <h6 className="text-muted mb-2">1-2年账龄</h6>
            <h3 className="text-warning mb-0">¥{stats.oneToTwoBalance.toLocaleString()}</h3>
            <small className="text-muted">
              计提20%: ¥{(stats.oneToTwoBalance * 0.2).toLocaleString()}
            </small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="h-100 shadow-sm border-danger" style={{ backgroundColor: colors.card }}>
          <Card.Body className="text-center">
            <h6 className="text-muted mb-2">3年以上账龄</h6>
            <h3 className="text-danger mb-0">¥{stats.overThreeBalance.toLocaleString()}</h3>
            <small className="text-muted">
              计提100%: ¥{stats.overThreeBalance.toLocaleString()}
            </small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="h-100 shadow-sm border-info" style={{ backgroundColor: colors.card }}>
          <Card.Body className="text-center">
            <h6 className="text-muted mb-2">坏账计提总额</h6>
            <h3 className="text-info mb-0">¥{stats.totalProvision.toLocaleString()}</h3>
            <small className="text-muted">
              逾期: {stats.overdueCount}笔 | 争议: {stats.disputedCount}笔
            </small>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // 渲染账龄分析图表
  const renderAgingChart = () => {
    const total = stats.currentBalance + stats.oneToTwoBalance + stats.overThreeBalance;
    if (total === 0) return null;

    return (
      <Card className="shadow-sm mb-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          <i className="bi bi-pie-chart me-2"></i>账龄分析
        </Card.Header>
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>1年以内</span>
                  <span>¥{stats.currentBalance.toLocaleString()} ({((stats.currentBalance / total) * 100).toFixed(1)}%)</span>
                </div>
                <ProgressBar now={(stats.currentBalance / total) * 100} variant="success" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>1-2年 (计提20%)</span>
                  <span>¥{stats.oneToTwoBalance.toLocaleString()} ({((stats.oneToTwoBalance / total) * 100).toFixed(1)}%)</span>
                </div>
                <ProgressBar now={(stats.oneToTwoBalance / total) * 100} variant="warning" />
              </div>
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span>3年以上 (计提100%)</span>
                  <span>¥{stats.overThreeBalance.toLocaleString()} ({((stats.overThreeBalance / total) * 100).toFixed(1)}%)</span>
                </div>
                <ProgressBar now={(stats.overThreeBalance / total) * 100} variant="danger" />
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <h6 className="text-muted">回款率</h6>
                <h2 className={stats.totalPaid / stats.totalReceivables > 0.5 ? 'text-success' : 'text-warning'}>
                  {((stats.totalPaid / stats.totalReceivables) * 100).toFixed(1)}%
                </h2>
                <small className="text-muted">
                  客户数: {stats.customerCount}
                </small>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  // 渲染应收账款明细表
  const renderReceivablesTable = () => (
    <Card className="shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <Row className="align-items-center">
          <Col md={4}>
            <InputGroup size="sm">
              <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
              <Form.Control
                placeholder="搜索客户名称/发票号..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={2}>
            <Form.Select
              size="sm"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="all">全部状态</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              size="sm"
              value={filterAging}
              onChange={e => setFilterAging(e.target.value)}
            >
              <option value="all">全部账龄</option>
              {Object.entries(agingConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4} className="text-end">
            <Badge bg="secondary" className="me-2">
              共 {filteredReceivables.length} 笔
            </Badge>
            <Badge bg="primary">
              合计 ¥{filteredReceivables.reduce((sum, i) => sum + i.balance, 0).toLocaleString()}
            </Badge>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <Table striped hover size="sm">
          <thead className="sticky-top bg-light">
            <tr>
              <th>客户名称</th>
              <th>发票号</th>
              <th>开票日期</th>
              <th>账龄</th>
              <th className="text-end">应收金额</th>
              <th className="text-end">已收金额</th>
              <th className="text-end">未收余额</th>
              <th>状态</th>
              <th>计提</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredReceivables.map(item => {
              const aging = calculateAging(item.invoiceDate);
              const agingDays = calculateAgingDays(item.invoiceDate);
              const provision = calculateProvision(item.balance, aging);

              return (
                <tr key={item.id} className={aging === AgingCategory.OVER_THREE ? 'table-danger' : ''}>
                  <td>
                    <strong>{item.customerName}</strong>
                    <br />
                    <small className="text-muted">{item.salesperson || '-'}</small>
                  </td>
                  <td><code>{item.invoiceNo}</code></td>
                  <td>{new Date(item.invoiceDate).toLocaleDateString()}</td>
                  <td>
                    <Badge bg={agingConfig[aging].variant}>
                      {agingConfig[aging].label}
                    </Badge>
                    <br />
                    <small className="text-muted">{agingDays}天</small>
                  </td>
                  <td className="text-end">¥{item.amount.toLocaleString()}</td>
                  <td className="text-end text-success">¥{item.paidAmount.toLocaleString()}</td>
                  <td className="text-end fw-bold">¥{item.balance.toLocaleString()}</td>
                  <td>
                    <Badge bg={statusConfig[item.status]?.variant || 'secondary'}>
                      {statusConfig[item.status]?.label || item.status}
                    </Badge>
                  </td>
                  <td className="text-end text-danger">
                    {provision > 0 ? `¥${provision.toLocaleString()}` : '-'}
                  </td>
                  <td>
                    {item.balance > 0 && (
                      <Button
                        size="sm"
                        variant="outline-warning"
                        onClick={() => handleOpenCollectionModal(item)}
                        title="记录催收"
                      >
                        <i className="bi bi-telephone"></i>
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  // 渲染需要催收的列表
  const renderCollectionAlert = () => {
    if (needsCollection.length === 0) return null;

    return (
      <Alert variant="warning" className="mb-4">
        <Alert.Heading>
          <i className="bi bi-bell-fill me-2"></i>
          催收提醒 ({needsCollection.length}笔)
        </Alert.Heading>
        <p>以下应收款需要重点跟进:</p>
        <Table size="sm" className="mb-0">
          <thead>
            <tr>
              <th>客户名称</th>
              <th>未收余额</th>
              <th>账龄</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {needsCollection.slice(0, 5).map(item => (
              <tr key={item.id}>
                <td>{item.customerName}</td>
                <td className="fw-bold">¥{item.balance.toLocaleString()}</td>
                <td>{calculateAgingDays(item.invoiceDate)}天</td>
                <td>
                  <Badge bg={statusConfig[item.status]?.variant || 'secondary'}>
                    {statusConfig[item.status]?.label || item.status}
                  </Badge>
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleOpenCollectionModal(item)}
                  >
                    催收
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {needsCollection.length > 5 && (
          <div className="text-end mt-2">
            <small className="text-muted">还有 {needsCollection.length - 5} 笔待处理...</small>
          </div>
        )}
      </Alert>
    );
  };

  // 渲染催收记录
  const renderCollectionRecords = () => (
    <Card className="shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <i className="bi bi-journal-text me-2"></i>催收记录
      </Card.Header>
      <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {collectionRecords.length === 0 ? (
          <div className="text-center text-muted py-4">
            <i className="bi bi-inbox fs-1 d-block mb-2"></i>
            暂无催收记录
          </div>
        ) : (
          <Table striped hover size="sm">
            <thead className="sticky-top bg-light">
              <tr>
                <th>客户</th>
                <th>催收方式</th>
                <th>催收人</th>
                <th>结果</th>
                <th>承诺还款</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              {collectionRecords.map(record => (
                <tr key={record.id}>
                  <td>{record.customerName}</td>
                  <td>
                    <Badge bg="info">
                      {record.method === 'phone' ? '电话' :
                        record.method === 'email' ? '邮件' :
                          record.method === 'visit' ? '上门' :
                            record.method === 'letter' ? '函件' : '法律'}
                    </Badge>
                  </td>
                  <td>{record.operator || '-'}</td>
                  <td>{record.result}</td>
                  <td>
                    {record.promisedAmount > 0 ? (
                      <span>
                        ¥{record.promisedAmount.toLocaleString()}
                        {record.promisedDate && <br />}
                        {record.promisedDate && <small className="text-muted">{record.promisedDate}</small>}
                      </span>
                    ) : '-'}
                  </td>
                  <td>{new Date(record.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  // 渲染客户汇总
  const renderCustomerSummary = () => (
    <Card className="shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <i className="bi bi-people me-2"></i>按客户汇总
      </Card.Header>
      <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <Table striped hover size="sm">
          <thead className="sticky-top bg-light">
            <tr>
              <th>客户名称</th>
              <th>信用等级</th>
              <th>发票数</th>
              <th className="text-end">应收总额</th>
              <th className="text-end">已收金额</th>
              <th className="text-end">未收余额</th>
              <th>最早发票</th>
            </tr>
          </thead>
          <tbody>
            {customerSummary
              .sort((a, b) => b.totalBalance - a.totalBalance)
              .map(cust => (
                <tr key={cust.customerId}>
                  <td><strong>{cust.customerName}</strong></td>
                  <td>
                    <Badge bg={
                      cust.creditRating === 'A' ? 'success' :
                        cust.creditRating === 'B' ? 'primary' :
                          cust.creditRating === 'C' ? 'warning' : 'danger'
                    }>
                      {CreditRating[cust.creditRating]?.label || cust.creditRating}
                    </Badge>
                  </td>
                  <td>{cust.invoiceCount}</td>
                  <td className="text-end">¥{cust.totalAmount.toLocaleString()}</td>
                  <td className="text-end text-success">¥{cust.totalPaid.toLocaleString()}</td>
                  <td className="text-end fw-bold">¥{cust.totalBalance.toLocaleString()}</td>
                  <td>{new Date(cust.oldestInvoice).toLocaleDateString()}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  // 催收Modal
  const renderCollectionModal = () => (
    <Modal show={showCollectionModal} onHide={() => setShowCollectionModal(false)} centered size="lg">
      <Modal.Header closeButton style={{ backgroundColor: colors.headerBg }}>
        <Modal.Title>
          <i className="bi bi-telephone me-2"></i>
          记录催收 - {selectedReceivable?.customerName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedReceivable && (
          <Alert variant="info" className="mb-3">
            <Row>
              <Col md={4}>
                <strong>未收余额:</strong> ¥{selectedReceivable.balance.toLocaleString()}
              </Col>
              <Col md={4}>
                <strong>发票号:</strong> {selectedReceivable.invoiceNo}
              </Col>
              <Col md={4}>
                <strong>账龄:</strong> {calculateAgingDays(selectedReceivable.invoiceDate)}天
              </Col>
            </Row>
          </Alert>
        )}
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>催收方式 *</Form.Label>
                <Form.Select
                  value={collectionMethod}
                  onChange={e => setCollectionMethod(e.target.value)}
                >
                  <option value="phone">电话催收</option>
                  <option value="email">邮件催收</option>
                  <option value="visit">上门催收</option>
                  <option value="letter">催收函</option>
                  <option value="legal">法律途径</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>催收人</Form.Label>
                <Form.Control
                  type="text"
                  value={collectionOperator}
                  onChange={e => setCollectionOperator(e.target.value)}
                  placeholder="请输入催收人姓名"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>催收结果 *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={collectionResult}
              onChange={e => setCollectionResult(e.target.value)}
              placeholder="请详细记录本次催收的沟通情况和结果..."
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>承诺还款日期</Form.Label>
                <Form.Control
                  type="date"
                  value={promisedDate}
                  onChange={e => setPromisedDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>承诺还款金额</Form.Label>
                <InputGroup>
                  <InputGroup.Text>¥</InputGroup.Text>
                  <Form.Control
                    type="number"
                    value={promisedAmount}
                    onChange={e => setPromisedAmount(e.target.value)}
                    placeholder="0"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowCollectionModal(false)}>
          取消
        </Button>
        <Button variant="warning" onClick={handleRecordCollection}>
          保存催收记录
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <Container fluid className="py-3">
      {/* 提示信息 */}
      {alert.show && (
        <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false })}>
          {alert.message}
        </Alert>
      )}

      {/* 页面标题 */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-1">
            <i className="bi bi-cash-stack me-2"></i>
            应收账款管理
          </h4>
          <small className="text-muted">
            解决审计发现的长期应收款问题：账龄分析、坏账计提、催收追踪
          </small>
        </Col>
      </Row>

      {/* 统计卡片 */}
      {renderStatsCards()}

      {/* 催收提醒 */}
      {renderCollectionAlert()}

      {/* 账龄分析 */}
      {renderAgingChart()}

      {/* 标签页 */}
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
        <Tab eventKey="overview" title={<span><i className="bi bi-table me-1"></i>应收明细</span>}>
          {renderReceivablesTable()}
        </Tab>
        <Tab eventKey="collection" title={
          <span>
            <i className="bi bi-telephone me-1"></i>催收记录
            <Badge bg="secondary" className="ms-1">{collectionRecords.length}</Badge>
          </span>
        }>
          {renderCollectionRecords()}
        </Tab>
        <Tab eventKey="customer" title={<span><i className="bi bi-people me-1"></i>客户汇总</span>}>
          {renderCustomerSummary()}
        </Tab>
      </Tabs>

      {/* 催收Modal */}
      {renderCollectionModal()}
    </Container>
  );
};

export default ReceivablesManagement;
