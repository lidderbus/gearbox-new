// src/components/InventoryManagement.js
// 库存管理组件 - 解决审计发现的存货管理问题

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Container, Row, Col, Card, Table, Button, Badge, Form,
  Modal, Alert, InputGroup, Tabs, Tab, ProgressBar
} from 'react-bootstrap';
import {
  InventoryOwnership,
  DocumentType,
  createStockDocument,
  initialInventory,
  calculateInventoryStats,
  validateStockOut
} from '../data/inventory';

// 库存管理主组件
const InventoryManagement = ({ colors = {}, theme = 'light' }) => {
  // 状态管理
  const [inventory, setInventory] = useState([]);
  const [stockDocuments, setStockDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOwnership, setFilterOwnership] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Modal状态
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockModalType, setStockModalType] = useState(DocumentType.STOCK_IN);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockReason, setStockReason] = useState('');
  const [stockOperator, setStockOperator] = useState('');

  // 警告和错误
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });

  // 初始化数据
  useEffect(() => {
    const savedInventory = localStorage.getItem('shanghai_inventory');
    const savedDocuments = localStorage.getItem('shanghai_stock_documents');

    if (savedInventory) {
      try {
        setInventory(JSON.parse(savedInventory));
      } catch (e) {
        setInventory(initialInventory);
      }
    } else {
      setInventory(initialInventory);
    }

    if (savedDocuments) {
      try {
        setStockDocuments(JSON.parse(savedDocuments));
      } catch (e) {
        setStockDocuments([]);
      }
    }
  }, []);

  // 保存数据
  useEffect(() => {
    if (inventory.length > 0) {
      localStorage.setItem('shanghai_inventory', JSON.stringify(inventory));
    }
  }, [inventory]);

  useEffect(() => {
    if (stockDocuments.length > 0) {
      localStorage.setItem('shanghai_stock_documents', JSON.stringify(stockDocuments));
    }
  }, [stockDocuments]);

  // 计算统计数据
  const stats = useMemo(() => calculateInventoryStats(inventory), [inventory]);

  // 过滤库存列表
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchSearch = searchTerm === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());

      const matchOwnership = filterOwnership === 'all' || item.ownership === filterOwnership;
      const matchCategory = filterCategory === 'all' || item.category === filterCategory;

      return matchSearch && matchOwnership && matchCategory;
    });
  }, [inventory, searchTerm, filterOwnership, filterCategory]);

  // 负数库存项目
  const negativeStockItems = useMemo(() =>
    inventory.filter(item => item.quantity < 0), [inventory]);

  // 低库存项目
  const lowStockItems = useMemo(() =>
    inventory.filter(item => item.quantity > 0 && item.quantity <= item.minStock), [inventory]);

  // 显示提示
  const showAlert = useCallback((variant, message) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => setAlert({ show: false, variant: '', message: '' }), 5000);
  }, []);

  // 打开出入库Modal
  const handleOpenStockModal = useCallback((type, item = null) => {
    setStockModalType(type);
    setSelectedItem(item);
    setStockQuantity('');
    setStockReason('');
    setStockOperator('');
    setShowStockModal(true);
  }, []);

  // 执行出入库操作
  const handleStockOperation = useCallback(() => {
    if (!selectedItem || !stockQuantity || parseInt(stockQuantity) <= 0) {
      showAlert('danger', '请选择库存项目并输入有效数量');
      return;
    }

    const quantity = parseInt(stockQuantity);

    // 出库校验 - 防止负数库存
    if (stockModalType === DocumentType.STOCK_OUT) {
      const validation = validateStockOut(inventory, selectedItem.id, quantity);
      if (!validation.valid) {
        showAlert('danger', validation.message);
        return;
      }
    }

    // 创建单据
    const document = createStockDocument({
      type: stockModalType,
      inventoryId: selectedItem.id,
      sku: selectedItem.sku,
      productName: selectedItem.name,
      quantity: quantity,
      operator: stockOperator,
      reason: stockReason
    });

    // 更新库存数量
    setInventory(prev => prev.map(item => {
      if (item.id === selectedItem.id) {
        const newQuantity = stockModalType === DocumentType.STOCK_IN
          ? item.quantity + quantity
          : item.quantity - quantity;
        return {
          ...item,
          quantity: newQuantity,
          lastUpdated: new Date().toISOString()
        };
      }
      return item;
    }));

    // 保存单据
    setStockDocuments(prev => [document, ...prev]);

    // 关闭Modal并显示成功
    setShowStockModal(false);
    showAlert('success',
      `${stockModalType === DocumentType.STOCK_IN ? '入库' : '出库'}成功! 单据号: ${document.documentNo}`
    );
  }, [selectedItem, stockQuantity, stockModalType, stockOperator, stockReason, inventory, showAlert]);

  // 渲染统计卡片
  const renderStatsCards = () => (
    <Row className="mb-4">
      <Col md={3}>
        <Card className="h-100 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <Card.Body className="text-center">
            <h6 className="text-muted mb-2">库存总价值</h6>
            <h3 className="text-primary mb-0">¥{stats.totalValue.toLocaleString()}</h3>
            <small className="text-muted">
              自有: ¥{stats.ownedValue.toLocaleString()} | 代管: ¥{stats.consignedValue.toLocaleString()}
            </small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="h-100 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <Card.Body className="text-center">
            <h6 className="text-muted mb-2">库存项目</h6>
            <h3 className="text-info mb-0">{stats.totalItems}</h3>
            <small className="text-muted">
              整机: {stats.gearboxCount} | 配件: {stats.accessoryCount}
            </small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="h-100 shadow-sm border-danger" style={{ backgroundColor: colors.card }}>
          <Card.Body className="text-center">
            <h6 className="text-muted mb-2">负数库存</h6>
            <h3 className={stats.negativeStockCount > 0 ? 'text-danger' : 'text-success'}>
              {stats.negativeStockCount}
            </h3>
            {stats.negativeStockCount > 0 && (
              <Badge bg="danger">需要核实</Badge>
            )}
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="h-100 shadow-sm border-warning" style={{ backgroundColor: colors.card }}>
          <Card.Body className="text-center">
            <h6 className="text-muted mb-2">低库存预警</h6>
            <h3 className={stats.lowStockCount > 0 ? 'text-warning' : 'text-success'}>
              {stats.lowStockCount}
            </h3>
            {stats.lowStockCount > 0 && (
              <Badge bg="warning" text="dark">需要补货</Badge>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // 渲染负数库存警告
  const renderNegativeStockAlert = () => {
    if (negativeStockItems.length === 0) return null;

    return (
      <Alert variant="danger" className="mb-4">
        <Alert.Heading>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          负数库存警告 (审计问题)
        </Alert.Heading>
        <p>以下库存项目存在负数余额，需要立即核实并调整:</p>
        <Table size="sm" className="mb-0">
          <thead>
            <tr>
              <th>物料编码</th>
              <th>产品名称</th>
              <th>型号</th>
              <th>当前库存</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {negativeStockItems.map(item => (
              <tr key={item.id}>
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.model}</td>
                <td className="text-danger fw-bold">{item.quantity}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => handleOpenStockModal(DocumentType.STOCK_IN, item)}
                  >
                    调整入库
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Alert>
    );
  };

  // 渲染库存列表
  const renderInventoryTable = () => (
    <Card className="shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <Row className="align-items-center">
          <Col md={4}>
            <InputGroup size="sm">
              <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
              <Form.Control
                placeholder="搜索产品名称/型号/编码..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={2}>
            <Form.Select
              size="sm"
              value={filterOwnership}
              onChange={e => setFilterOwnership(e.target.value)}
            >
              <option value="all">全部归属</option>
              <option value={InventoryOwnership.OWNED}>自有库存</option>
              <option value={InventoryOwnership.CONSIGNED}>代管库存</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              size="sm"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="all">全部类别</option>
              <option value="gearbox">整机</option>
              <option value="accessory">配件</option>
            </Form.Select>
          </Col>
          <Col md={4} className="text-end">
            <Button
              size="sm"
              variant="success"
              className="me-2"
              onClick={() => handleOpenStockModal(DocumentType.STOCK_IN)}
            >
              <i className="bi bi-box-arrow-in-down me-1"></i>入库
            </Button>
            <Button
              size="sm"
              variant="warning"
              onClick={() => handleOpenStockModal(DocumentType.STOCK_OUT)}
            >
              <i className="bi bi-box-arrow-up me-1"></i>出库
            </Button>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <Table striped hover size="sm">
          <thead className="sticky-top bg-light">
            <tr>
              <th>物料编码</th>
              <th>产品名称</th>
              <th>型号规格</th>
              <th>归属</th>
              <th>位置</th>
              <th className="text-end">库存</th>
              <th className="text-end">单价</th>
              <th className="text-end">金额</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map(item => (
              <tr key={item.id} className={item.quantity < 0 ? 'table-danger' : ''}>
                <td><code>{item.sku}</code></td>
                <td>{item.name}</td>
                <td>{item.model}</td>
                <td>
                  <Badge bg={item.ownership === InventoryOwnership.OWNED ? 'primary' : 'secondary'}>
                    {item.ownership === InventoryOwnership.OWNED ? '自有' : '代管'}
                  </Badge>
                </td>
                <td>{item.location}</td>
                <td className={`text-end ${item.quantity < 0 ? 'text-danger fw-bold' : ''}`}>
                  {item.quantity} {item.unit}
                </td>
                <td className="text-end">¥{item.unitPrice.toLocaleString()}</td>
                <td className="text-end">¥{(item.quantity * item.unitPrice).toLocaleString()}</td>
                <td>
                  {item.quantity < 0 && <Badge bg="danger">负数</Badge>}
                  {item.quantity > 0 && item.quantity <= item.minStock && <Badge bg="warning" text="dark">低库存</Badge>}
                  {item.quantity > item.minStock && <Badge bg="success">正常</Badge>}
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-success"
                    className="me-1"
                    onClick={() => handleOpenStockModal(DocumentType.STOCK_IN, item)}
                    title="入库"
                  >
                    <i className="bi bi-plus"></i>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-warning"
                    onClick={() => handleOpenStockModal(DocumentType.STOCK_OUT, item)}
                    title="出库"
                    disabled={item.quantity <= 0}
                  >
                    <i className="bi bi-dash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  // 渲染出入库记录
  const renderDocumentsTable = () => (
    <Card className="shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <i className="bi bi-journal-text me-2"></i>出入库记录
      </Card.Header>
      <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {stockDocuments.length === 0 ? (
          <div className="text-center text-muted py-4">
            <i className="bi bi-inbox fs-1 d-block mb-2"></i>
            暂无出入库记录
          </div>
        ) : (
          <Table striped hover size="sm">
            <thead className="sticky-top bg-light">
              <tr>
                <th>单据编号</th>
                <th>类型</th>
                <th>物料编码</th>
                <th>产品名称</th>
                <th className="text-end">数量</th>
                <th>操作人</th>
                <th>原因</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              {stockDocuments.map(doc => (
                <tr key={doc.id}>
                  <td><code>{doc.documentNo}</code></td>
                  <td>
                    <Badge bg={doc.type === DocumentType.STOCK_IN ? 'success' : 'warning'}>
                      {doc.type === DocumentType.STOCK_IN ? '入库' : '出库'}
                    </Badge>
                  </td>
                  <td>{doc.sku}</td>
                  <td>{doc.productName}</td>
                  <td className="text-end">{doc.quantity}</td>
                  <td>{doc.operator || '-'}</td>
                  <td>{doc.reason || '-'}</td>
                  <td>{new Date(doc.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  // 出入库Modal
  const renderStockModal = () => (
    <Modal show={showStockModal} onHide={() => setShowStockModal(false)} centered>
      <Modal.Header closeButton style={{ backgroundColor: colors.headerBg }}>
        <Modal.Title>
          <i className={`bi ${stockModalType === DocumentType.STOCK_IN ? 'bi-box-arrow-in-down text-success' : 'bi-box-arrow-up text-warning'} me-2`}></i>
          {stockModalType === DocumentType.STOCK_IN ? '库存入库' : '库存出库'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>选择库存项目 *</Form.Label>
            <Form.Select
              value={selectedItem?.id || ''}
              onChange={e => {
                const item = inventory.find(i => i.id === e.target.value);
                setSelectedItem(item);
              }}
            >
              <option value="">-- 请选择 --</option>
              {inventory.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} - {item.model} (当前库存: {item.quantity})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {selectedItem && (
            <Alert variant="info" className="py-2">
              <small>
                <strong>当前库存:</strong> {selectedItem.quantity} {selectedItem.unit} |
                <strong> 位置:</strong> {selectedItem.location}
              </small>
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>{stockModalType === DocumentType.STOCK_IN ? '入库' : '出库'}数量 *</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={stockQuantity}
              onChange={e => setStockQuantity(e.target.value)}
              placeholder="请输入数量"
            />
            {stockModalType === DocumentType.STOCK_OUT && selectedItem && (
              <Form.Text className="text-muted">
                最大可出库: {Math.max(0, selectedItem.quantity)} {selectedItem?.unit}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>操作人</Form.Label>
            <Form.Control
              type="text"
              value={stockOperator}
              onChange={e => setStockOperator(e.target.value)}
              placeholder="请输入操作人姓名"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>原因说明</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={stockReason}
              onChange={e => setStockReason(e.target.value)}
              placeholder="请输入出入库原因"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowStockModal(false)}>
          取消
        </Button>
        <Button
          variant={stockModalType === DocumentType.STOCK_IN ? 'success' : 'warning'}
          onClick={handleStockOperation}
        >
          确认{stockModalType === DocumentType.STOCK_IN ? '入库' : '出库'}
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
            <i className="bi bi-box-seam me-2"></i>
            库存管理
          </h4>
          <small className="text-muted">
            解决审计发现的存货管理问题：负数库存、出入库单据混乱、自有/代管库存混放
          </small>
        </Col>
      </Row>

      {/* 统计卡片 */}
      {renderStatsCards()}

      {/* 负数库存警告 */}
      {renderNegativeStockAlert()}

      {/* 标签页 */}
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
        <Tab eventKey="overview" title={<span><i className="bi bi-grid me-1"></i>库存概览</span>}>
          {renderInventoryTable()}
        </Tab>
        <Tab eventKey="documents" title={<span><i className="bi bi-journal-text me-1"></i>出入库记录 ({stockDocuments.length})</span>}>
          {renderDocumentsTable()}
        </Tab>
        <Tab eventKey="alerts" title={
          <span>
            <i className="bi bi-bell me-1"></i>预警
            {(negativeStockItems.length + lowStockItems.length) > 0 && (
              <Badge bg="danger" className="ms-1">
                {negativeStockItems.length + lowStockItems.length}
              </Badge>
            )}
          </span>
        }>
          <Row>
            <Col md={6}>
              <Card className="shadow-sm border-danger mb-3">
                <Card.Header className="bg-danger text-white">
                  <i className="bi bi-exclamation-triangle me-2"></i>负数库存 ({negativeStockItems.length})
                </Card.Header>
                <Card.Body>
                  {negativeStockItems.length === 0 ? (
                    <div className="text-center text-success py-3">
                      <i className="bi bi-check-circle fs-3"></i>
                      <p className="mb-0 mt-2">无负数库存</p>
                    </div>
                  ) : (
                    <ul className="list-unstyled mb-0">
                      {negativeStockItems.map(item => (
                        <li key={item.id} className="mb-2 pb-2 border-bottom">
                          <strong>{item.name}</strong> ({item.model})
                          <br />
                          <small className="text-danger">库存: {item.quantity} {item.unit}</small>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm border-warning">
                <Card.Header className="bg-warning text-dark">
                  <i className="bi bi-exclamation-circle me-2"></i>低库存预警 ({lowStockItems.length})
                </Card.Header>
                <Card.Body>
                  {lowStockItems.length === 0 ? (
                    <div className="text-center text-success py-3">
                      <i className="bi bi-check-circle fs-3"></i>
                      <p className="mb-0 mt-2">库存充足</p>
                    </div>
                  ) : (
                    <ul className="list-unstyled mb-0">
                      {lowStockItems.map(item => (
                        <li key={item.id} className="mb-2 pb-2 border-bottom">
                          <strong>{item.name}</strong> ({item.model})
                          <br />
                          <small className="text-warning">
                            库存: {item.quantity} / 最低: {item.minStock} {item.unit}
                          </small>
                          <ProgressBar
                            now={(item.quantity / item.minStock) * 100}
                            variant="warning"
                            className="mt-1"
                            style={{ height: '5px' }}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      {/* 出入库Modal */}
      {renderStockModal()}
    </Container>
  );
};

export default InventoryManagement;
