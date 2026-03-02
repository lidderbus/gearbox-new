// src/components/FeedbackWidget.js
// 用户反馈组件 - 非侵入式设计，不影响主功能

import React, { useState, useCallback } from 'react';
import { Modal, Button, Form, Badge } from 'react-bootstrap';
import { Analytics, EVENTS } from '../utils/analytics';
import { toast } from '../utils/toast';

/**
 * 反馈类型配置
 */
const FEEDBACK_TYPES = [
  { value: 'bug', label: '问题报告', icon: '🐛', description: '功能异常或错误' },
  { value: 'feature', label: '功能建议', icon: '💡', description: '希望增加的新功能' },
  { value: 'data', label: '数据错误', icon: '📊', description: '型号/价格/参数错误' },
  { value: 'other', label: '其他反馈', icon: '📝', description: '任何其他建议' }
];

/**
 * 优先级配置
 */
const PRIORITY_OPTIONS = [
  { value: 'low', label: '一般', color: '#6c757d' },
  { value: 'medium', label: '重要', color: '#ffc107' },
  { value: 'high', label: '紧急', color: '#dc3545' }
];

/**
 * 反馈数据存储键
 */
const FEEDBACK_STORAGE_KEY = '_gearbox_feedback';
const MAX_FEEDBACK_ITEMS = 50;

/**
 * 获取保存的反馈列表
 */
const getSavedFeedback = () => {
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
};

/**
 * 保存反馈到本地
 */
const saveFeedback = (feedback) => {
  try {
    const list = getSavedFeedback();
    list.push(feedback);

    // 保留最近的记录
    if (list.length > MAX_FEEDBACK_ITEMS) {
      list.splice(0, list.length - MAX_FEEDBACK_ITEMS);
    }

    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    console.warn('FeedbackWidget: 保存反馈失败', e);
    return false;
  }
};

/**
 * 浮动反馈按钮组件
 */
const FeedbackWidget = ({ position = 'bottom-right' }) => {
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: 'bug',
    priority: 'medium',
    title: '',
    description: '',
    contact: '',
    page: ''
  });

  // 位置样式
  const positionStyles = {
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-right': { top: '80px', right: '20px' },
    'top-left': { top: '80px', left: '20px' }
  };

  const handleOpen = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      page: window.location.pathname + window.location.hash
    }));
    setShowModal(true);
    setShowSuccess(false);

    // 记录打开反馈面板
    Analytics.track(EVENTS.FEATURE_USE, { feature: 'feedback_open' });
  }, []);

  const handleClose = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.warning('请输入反馈标题');
      return;
    }

    // 创建反馈记录
    const feedback = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...formData,
      timestamp: Date.now(),
      datetime: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      status: 'pending' // pending, read, resolved
    };

    // 保存到本地
    const saved = saveFeedback(feedback);

    if (saved) {
      // 记录反馈提交
      Analytics.track(EVENTS.FEATURE_USE, {
        feature: 'feedback_submit',
        type: formData.type,
        priority: formData.priority
      });

      setShowSuccess(true);

      // 重置表单
      setFormData({
        type: 'bug',
        priority: 'medium',
        title: '',
        description: '',
        contact: '',
        page: ''
      });

      // 3秒后关闭
      setTimeout(() => {
        setShowModal(false);
        setShowSuccess(false);
      }, 2000);
    } else {
      toast.error('保存反馈失败，请稍后重试');
    }
  }, [formData]);

  return (
    <>
      {/* 浮动按钮 */}
      <Button
        variant="primary"
        onClick={handleOpen}
        style={{
          position: 'fixed',
          ...positionStyles[position],
          zIndex: 1000,
          borderRadius: '50px',
          padding: '10px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
        title="提交反馈"
      >
        <span style={{ fontSize: '16px' }}>💬</span>
        <span style={{ fontSize: '14px' }}>反馈</span>
      </Button>

      {/* 反馈弹窗 */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa' }}>
          <Modal.Title style={{ fontSize: '1.1rem' }}>
            💬 提交反馈
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {showSuccess ? (
            <div className="text-center py-4">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <h5 className="text-success">反馈已提交</h5>
              <p className="text-muted">感谢您的反馈，我们会尽快处理</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {/* 反馈类型 */}
              <Form.Group className="mb-3">
                <Form.Label>反馈类型</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {FEEDBACK_TYPES.map(type => (
                    <Badge
                      key={type.value}
                      bg={formData.type === type.value ? 'primary' : 'light'}
                      text={formData.type === type.value ? 'white' : 'dark'}
                      style={{
                        cursor: 'pointer',
                        padding: '8px 12px',
                        fontSize: '0.9rem',
                        border: formData.type === type.value ? 'none' : '1px solid #dee2e6'
                      }}
                      onClick={() => handleChange('type', type.value)}
                    >
                      {type.icon} {type.label}
                    </Badge>
                  ))}
                </div>
              </Form.Group>

              {/* 优先级 */}
              <Form.Group className="mb-3">
                <Form.Label>优先级</Form.Label>
                <div className="d-flex gap-2">
                  {PRIORITY_OPTIONS.map(opt => (
                    <Badge
                      key={opt.value}
                      style={{
                        cursor: 'pointer',
                        padding: '6px 12px',
                        fontSize: '0.85rem',
                        backgroundColor: formData.priority === opt.value ? opt.color : '#e9ecef',
                        color: formData.priority === opt.value ? 'white' : '#495057',
                        border: 'none'
                      }}
                      onClick={() => handleChange('priority', opt.value)}
                    >
                      {opt.label}
                    </Badge>
                  ))}
                </div>
              </Form.Group>

              {/* 标题 */}
              <Form.Group className="mb-3">
                <Form.Label>
                  标题 <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="简要描述问题或建议"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  maxLength={100}
                  required
                />
              </Form.Group>

              {/* 详细描述 */}
              <Form.Group className="mb-3">
                <Form.Label>详细描述</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="请详细描述问题或建议..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  maxLength={1000}
                />
              </Form.Group>

              {/* 联系方式 */}
              <Form.Group className="mb-3">
                <Form.Label>联系方式（可选）</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="手机号或邮箱，方便我们联系您"
                  value={formData.contact}
                  onChange={(e) => handleChange('contact', e.target.value)}
                  maxLength={50}
                />
              </Form.Group>

              {/* 当前页面 */}
              <Form.Group className="mb-3">
                <Form.Label className="text-muted" style={{ fontSize: '0.85rem' }}>
                  当前页面: {formData.page || '首页'}
                </Form.Label>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>

        {!showSuccess && (
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              取消
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              提交反馈
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
};

/**
 * 管理员反馈列表组件（可选，用于管理员查看反馈）
 */
export const FeedbackList = ({ onClose }) => {
  const feedbackList = getSavedFeedback();

  const getTypeInfo = (type) => {
    return FEEDBACK_TYPES.find(t => t.value === type) || FEEDBACK_TYPES[3];
  };

  const getPriorityInfo = (priority) => {
    return PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[0];
  };

  const exportFeedback = () => {
    const data = JSON.stringify(feedbackList, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFeedback = () => {
    if (window.confirm('确定要清除所有反馈记录吗？')) {
      localStorage.removeItem(FEEDBACK_STORAGE_KEY);
      if (onClose) onClose();
    }
  };

  return (
    <div className="feedback-list">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">📋 反馈记录 ({feedbackList.length})</h5>
        <div>
          <Button size="sm" variant="outline-primary" onClick={exportFeedback} className="me-2">
            导出
          </Button>
          <Button size="sm" variant="outline-danger" onClick={clearFeedback}>
            清除
          </Button>
        </div>
      </div>

      {feedbackList.length === 0 ? (
        <div className="text-center text-muted py-4">
          暂无反馈记录
        </div>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {[...feedbackList].reverse().map((fb, idx) => (
            <div
              key={fb.id || idx}
              style={{
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                borderLeft: `4px solid ${getPriorityInfo(fb.priority).color}`
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <span style={{ marginRight: '8px' }}>{getTypeInfo(fb.type).icon}</span>
                  <strong>{fb.title}</strong>
                </div>
                <small className="text-muted">
                  {new Date(fb.timestamp).toLocaleDateString('zh-CN')}
                </small>
              </div>
              {fb.description && (
                <p className="mb-1 mt-2 text-muted" style={{ fontSize: '0.9rem' }}>
                  {fb.description}
                </p>
              )}
              {fb.contact && (
                <small className="text-primary">联系: {fb.contact}</small>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * 反馈统计工具
 */
export const FeedbackStats = {
  getStats: () => {
    const list = getSavedFeedback();
    const byType = {};
    const byPriority = {};

    list.forEach(fb => {
      byType[fb.type] = (byType[fb.type] || 0) + 1;
      byPriority[fb.priority] = (byPriority[fb.priority] || 0) + 1;
    });

    return {
      total: list.length,
      byType,
      byPriority,
      latest: list.length > 0 ? list[list.length - 1] : null
    };
  },

  export: () => {
    return JSON.stringify(getSavedFeedback(), null, 2);
  },

  clear: () => {
    localStorage.removeItem(FEEDBACK_STORAGE_KEY);
  }
};

export default FeedbackWidget;
