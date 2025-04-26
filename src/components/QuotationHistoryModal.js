// src/components/QuotationHistoryModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Alert, Badge, Dropdown } from 'react-bootstrap';
import { getSavedQuotations, deleteSavedQuotation } from '../utils/quotationManager';

/**
 * 报价单历史记录对话框组件
 * 显示保存的报价单列表，支持加载和删除操作
 */
const QuotationHistoryModal = ({
  show,
  onHide,
  onLoad,
  onCompare,
  colors,
  theme
}) => {
  const [savedQuotations, setSavedQuotations] = useState([]);
  const [selectedQuotations, setSelectedQuotations] = useState([]);
  const [error, setError] = useState('');
  
  // 加载保存的报价单
  useEffect(() => {
    if (show) {
      try {
        const saved = getSavedQuotations();
        setSavedQuotations(saved);
        setSelectedQuotations([]);
        setError('');
      } catch (error) {
        console.error("加载保存的报价单失败:", error);
        setError('加载保存的报价单失败');
        setSavedQuotations([]);
      }
    }
  }, [show]);
  
  // 处理报价单选择
  const handleSelectQuotation = (quotationId) => {
    setSelectedQuotations(prev => {
      if (prev.includes(quotationId)) {
        return prev.filter(id => id !== quotationId);
      } else {
        // 最多选择2个报价单
        if (prev.length >= 2) {
          return [prev[1], quotationId];
        }
        return [...prev, quotationId];
      }
    });
  };
  
  // 加载报价单
  const handleLoadQuotation = (quotationId) => {
    onLoad && onLoad(quotationId);
    onHide();
  };
  
  // 删除报价单
  const handleDeleteQuotation = (quotationId) => {
    if (window.confirm("确定要删除此保存的报价单?")) {
      try {
        const success = deleteSavedQuotation(quotationId);
        
        if (success) {
          // 更新列表
          setSavedQuotations(prev => prev.filter(q => q.id !== quotationId));
          
          // 更新选择
          setSelectedQuotations(prev => prev.filter(id => id !== quotationId));
        } else {
          setError('删除报价单失败');
        }
      } catch (error) {
        console.error("删除保存的报价单失败:", error);
        setError('删除报价单失败: ' + error.message);
      }
    }
  };
  
  // 比较报价单
  const handleCompareQuotations = () => {
    if (selectedQuotations.length !== 2) {
      setError('请选择两个报价单进行比较');
      return;
    }
    
    const quotationA = savedQuotations.find(q => q.id === selectedQuotations[0])?.data;
    const quotationB = savedQuotations.find(q => q.id === selectedQuotations[1])?.data;
    
    if (!quotationA || !quotationB) {
      setError('无法比较：选中的报价单数据无效');
      return;
    }
    
    onCompare && onCompare(quotationA, quotationB);
    onHide();
  };
  
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
    >
      <Modal.Header
        closeButton
        style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}
      >
        <Modal.Title>保存的报价单</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: colors?.card, color: colors?.text }}>
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}
        
        {savedQuotations.length === 0 ? (
          <Alert variant="info">
            <i className="bi bi-info-circle me-2"></i>
            没有找到保存的报价单
          </Alert>
        ) : (
          <>
            <Alert variant="info" className="mb-3">
              <i className="bi bi-info-circle me-2"></i>
              选择两个报价单可以进行比较，或者单击"加载"按钮直接载入报价单。
              {selectedQuotations.length > 0 && (
                <div className="mt-2">
                  已选择 {selectedQuotations.length} 个报价单
                  {selectedQuotations.length === 2 && (
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="ms-2"
                      onClick={handleCompareQuotations}
                    >
                      <i className="bi bi-bar-chart-fill me-1"></i> 比较所选报价单
                    </Button>
                  )}
                </div>
              )}
            </Alert>
            
            <ListGroup variant="flush">
              {savedQuotations.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  className={`d-flex justify-content-between align-items-center ${selectedQuotations.includes(item.id) ? 'selected-quotation' : ''}`}
                  style={{ 
                    backgroundColor: selectedQuotations.includes(item.id) ? (theme === 'light' ? '#e6f7ff' : '#2d4a63') : 'transparent',
                    borderColor: colors?.border,
                    color: colors?.text,
                    cursor: 'pointer',
                    padding: '12px'
                  }}
                  onClick={() => handleSelectQuotation(item.id)}
                >
                  <div>
                    <div className="fw-bold">{item.name || '未命名报价单'}</div>
                    <small style={{ color: colors?.muted }}>
                      {new Date(item.date).toLocaleString()} | 
                      客户: {item.projectInfo?.customerName || '未知客户'} | 
                      项目: {item.projectInfo?.projectName || '未知项目'} | 
                      总金额: {item.data?.totalAmount?.toLocaleString() || '0'} 元
                    </small>
                    {item.data?.items?.length > 0 && (
                      <div className="mt-1">
                        {item.data.items.map((product, idx) => (
                          <Badge 
                            key={idx} 
                            bg={theme === 'light' ? 'secondary' : 'dark'} 
                            className="me-1"
                            style={{ fontSize: '0.7em' }}
                          >
                            {product.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <Dropdown className="d-inline me-2">
                      <Dropdown.Toggle variant="outline-primary" size="sm" id={`dropdown-action-${item.id}`}>
                        操作
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={(e) => {
                          e.stopPropagation();
                          handleLoadQuotation(item.id);
                        }}>
                          <i className="bi bi-folder-symlink me-1"></i> 加载
                        </Dropdown.Item>
                        <Dropdown.Item onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuotation(item.id);
                        }}>
                          <i className="bi bi-trash me-1"></i> 删除
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: colors?.card }}>
        {selectedQuotations.length === 2 && (
          <Button
            variant="primary"
            className="me-auto"
            onClick={handleCompareQuotations}
          >
            <i className="bi bi-bar-chart-fill me-1"></i> 比较所选报价单
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={onHide}
        >
          关闭
        </Button>
      </Modal.Footer>
      <style jsx>{`
        .selected-quotation {
          border-left: 4px solid ${colors?.primary || '#007bff'};
        }
      `}</style>
    </Modal>
  );
};

export default QuotationHistoryModal;