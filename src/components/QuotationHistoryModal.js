import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Badge, Row, Col, Form, Spinner, Alert } from 'react-bootstrap';
import { getSavedQuotations, deleteSavedQuotation } from '../utils/quotationManager';

/**
 * 报价单历史记录对话框
 * 用于查看、加载和管理已保存的报价单
 */
const QuotationHistoryModal = ({
  show,
  onHide,
  onLoad,
  onCompare,
  colors,
  theme
}) => {
  // 状态
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedQuotations, setSelectedQuotations] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('date-desc');
  
  // 加载保存的报价单
  useEffect(() => {
    if (show) {
      setLoading(true);
      
      try {
        const savedQuotations = getSavedQuotations();
        setQuotations(savedQuotations);
      } catch (error) {
        console.error('加载报价单历史失败:', error);
        setError('加载报价单历史失败: ' + error.message);
      } finally {
        setLoading(false);
      }
      
      // 重置其他状态
      setSelectedQuotations([]);
      setCompareMode(false);
      setSearchTerm('');
    }
  }, [show]);
  
  // 处理选择报价单
  const handleSelect = (quotationId) => {
    if (compareMode) {
      setSelectedQuotations(prev => {
        // 如果已选中，则取消选择
        if (prev.includes(quotationId)) {
          return prev.filter(id => id !== quotationId);
        }
        
        // 如果已选两项，替换最早选择的一项
        if (prev.length >= 2) {
          return [prev[1], quotationId];
        }
        
        // 否则添加到选择列表
        return [...prev, quotationId];
      });
    } else {
      // 非比较模式下，只能选一项
      setSelectedQuotations([quotationId]);
    }
  };
  
  // 处理加载报价单
  const handleLoadQuotation = () => {
    if (selectedQuotations.length !== 1) return;
    
    const quotationId = selectedQuotations[0];
    onLoad(quotationId);
    
    // 关闭对话框
    onHide();
  };
  
  // 处理比较报价单
  const handleCompareQuotations = () => {
    if (selectedQuotations.length !== 2) return;
    
    // 从所有报价单中找出已选中的两项
    const quotationA = quotations.find(q => q.id === selectedQuotations[0]);
    const quotationB = quotations.find(q => q.id === selectedQuotations[1]);
    
    if (!quotationA || !quotationB) {
      setError('无法加载选中的报价单进行比较');
      return;
    }
    
    onCompare(quotationA.data, quotationB.data);
    
    // 关闭对话框
    onHide();
  };
  
  // 处理删除报价单
  const handleDeleteQuotation = (quotationId) => {
    if (!window.confirm('确定要删除此报价单吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      deleteSavedQuotation(quotationId);
      
      // 更新列表
      setQuotations(prev => prev.filter(q => q.id !== quotationId));
      
      // 更新选中状态
      setSelectedQuotations(prev => prev.filter(id => id !== quotationId));
    } catch (error) {
      console.error('删除报价单失败:', error);
      setError('删除报价单失败: ' + error.message);
    }
  };
  
  // 处理搜索
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // 处理排序
  const handleSort = (e) => {
    setSortOrder(e.target.value);
  };
  
  // 过滤和排序报价单
  const filteredAndSortedQuotations = quotations
    .filter(quotation => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      
      return (
        (quotation.name && quotation.name.toLowerCase().includes(searchLower)) ||
        (quotation.data?.projectName && quotation.data.projectName.toLowerCase().includes(searchLower)) ||
        (quotation.projectInfo?.projectName && quotation.projectInfo.projectName.toLowerCase().includes(searchLower)) ||
        (quotation.projectInfo?.customerName && quotation.projectInfo.customerName.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'date-desc':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'date-asc':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'amount-asc':
          return (a.data?.totalAmount || 0) - (b.data?.totalAmount || 0);
        case 'amount-desc':
          return (b.data?.totalAmount || 0) - (a.data?.totalAmount || 0);
        default:
          return 0;
      }
    });
  
  // 格式化日期
  const formatDate = (timestamp) => {
    if (!timestamp) return '未知日期';
    
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // 格式化金额
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return '-';
    
    return amount.toLocaleString('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      style={{ color: colors?.text }}
    >
      <Modal.Header
        closeButton
        style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}
      >
        <Modal.Title>
          {compareMode ? '选择报价单进行比较' : '保存的报价单'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ backgroundColor: colors?.card }}>
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}
        
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="searchTerm">
              <Form.Control
                type="text"
                placeholder="搜索报价单..."
                value={searchTerm}
                onChange={handleSearch}
                style={{
                  backgroundColor: colors?.inputBg,
                  color: colors?.text,
                  borderColor: colors?.inputBorder
                }}
              />
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group controlId="sortOrder">
              <Form.Select
                value={sortOrder}
                onChange={handleSort}
                style={{
                  backgroundColor: colors?.inputBg,
                  color: colors?.text,
                  borderColor: colors?.inputBorder
                }}
              >
                <option value="date-desc">日期 (新→旧)</option>
                <option value="date-asc">日期 (旧→新)</option>
                <option value="name-asc">名称 (A→Z)</option>
                <option value="name-desc">名称 (Z→A)</option>
                <option value="amount-desc">金额 (高→低)</option>
                <option value="amount-asc">金额 (低→高)</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p className="mt-3">加载报价单历史...</p>
          </div>
        ) : filteredAndSortedQuotations.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox-fill" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
            <p className="mt-3">
              {searchTerm ? '没有找到匹配的报价单' : '还没有保存的报价单'}
            </p>
          </div>
        ) : (
          <ListGroup className="quotation-history-list">
            {filteredAndSortedQuotations.map(quotation => (
              <ListGroup.Item
                key={quotation.id}
                style={{
                  backgroundColor: selectedQuotations.includes(quotation.id) ? 
                    (theme === 'light' ? '#e8f4f8' : '#2c3e50') : 
                    'transparent',
                  color: colors?.text,
                  borderColor: colors?.border,
                  cursor: 'pointer'
                }}
                onClick={() => handleSelect(quotation.id)}
                className="d-flex justify-content-between align-items-start py-3"
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">
                    {quotation.name || (
                      quotation.projectInfo?.projectName || 
                      quotation.data?.projectName || 
                      '未命名报价单'
                    )}
                    {compareMode && selectedQuotations.includes(quotation.id) && (
                      <Badge bg="primary" className="ms-2">
                        已选择 {selectedQuotations.indexOf(quotation.id) + 1}
                      </Badge>
                    )}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.9em' }}>
                    <div>客户: {quotation.projectInfo?.customerName || quotation.data?.customerName || '未知'}</div>
                    <div>日期: {formatDate(quotation.timestamp)}</div>
                    <div>金额: {formatAmount(quotation.data?.totalAmount)}</div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuotation(quotation.id);
                    }}
                    title="删除报价单"
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      
      <Modal.Footer style={{ backgroundColor: colors?.card }}>
        <Button
          variant="secondary"
          onClick={() => {
            if (compareMode) {
              setCompareMode(false);
              setSelectedQuotations([]);
            } else {
              onHide();
            }
          }}
        >
          {compareMode ? '取消比较' : '关闭'}
        </Button>
        
        {!compareMode && (
          <Button
            variant="info"
            onClick={() => setCompareMode(true)}
            disabled={filteredAndSortedQuotations.length < 2}
          >
            <i className="bi bi-text-diff me-1"></i>
            比较报价单
          </Button>
        )}
        
        {compareMode ? (
          <Button
            variant="primary"
            onClick={handleCompareQuotations}
            disabled={selectedQuotations.length !== 2}
          >
            <i className="bi bi-bar-chart-steps me-1"></i>
            比较已选报价单
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleLoadQuotation}
            disabled={selectedQuotations.length !== 1}
          >
            <i className="bi bi-folder-symlink me-1"></i>
            加载报价单
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default QuotationHistoryModal;