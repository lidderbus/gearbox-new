// src/components/AgreementGuideMenu.js
// 技术协议生成向导菜单组件
import React, { useState, useCallback, memo, useMemo } from 'react';
import { Card, ListGroup, Badge, ProgressBar, Button, Collapse } from 'react-bootstrap';

/**
 * 协议生成步骤定义
 */
const AGREEMENT_STEPS = [
  {
    id: 'step1',
    title: '选择协议类型',
    description: '根据齿轮箱系列选择对应的协议模板',
    icon: 'bi-file-earmark-text',
    items: [
      { id: 'gwc', label: 'GWC/GWL系列', description: '双机并车齿轮箱' },
      { id: 'hct', label: 'HCT系列', description: '推力型船用齿轮箱' },
      { id: 'hc', label: 'HC/HCM系列', description: '标准/中型船用齿轮箱' },
      { id: 'dt', label: 'DT系列', description: '电力推进齿轮箱' }
    ]
  },
  {
    id: 'step2',
    title: '填写基本信息',
    description: '录入船东、船厂和主机参数',
    icon: 'bi-info-circle',
    items: [
      { id: 'shipOwner', label: '船东信息', description: '船东名称和联系方式' },
      { id: 'shipyard', label: '船厂信息', description: '船厂名称和项目编号' },
      { id: 'engine', label: '主机参数', description: '功率、转速、飞轮规格' }
    ]
  },
  {
    id: 'step3',
    title: '配置特殊要求',
    description: '设置性能参数、安装要求和监控配置',
    icon: 'bi-gear',
    items: [
      { id: 'performance', label: '性能参数', description: '传动能力、效率、噪音等' },
      { id: 'installation', label: '安装要求', description: '倾斜度、冷却水、润滑要求' },
      { id: 'monitoring', label: '监控配置', description: '报警设置、仪表配置' }
    ]
  },
  {
    id: 'step4',
    title: '查看外形图',
    description: '匹配并查看齿轮箱和联轴器外形图',
    icon: 'bi-image',
    items: [
      { id: 'gearboxDrawing', label: '齿轮箱外形图', description: '查看/下载齿轮箱DWG图纸' },
      { id: 'couplingDrawing', label: '联轴器外形图', description: '查看/下载联轴器DWG图纸' }
    ]
  },
  {
    id: 'step5',
    title: '预览并导出',
    description: '预览协议内容，导出为PDF或Word',
    icon: 'bi-check-circle',
    items: [
      { id: 'preview', label: '预览协议', description: '查看生成的协议内容' },
      { id: 'exportPdf', label: '导出PDF', description: '生成PDF格式协议文档' },
      { id: 'exportWord', label: '导出Word', description: '生成Word格式协议文档' }
    ]
  }
];

/**
 * 技术协议生成向导菜单
 * 使用 React.memo 优化，避免不必要的重渲染
 */
const AgreementGuideMenu = memo(({
  currentStep = 0,
  completedSteps = [],
  onStepClick = () => {},
  onItemClick = () => {},
  colors = {},
  theme = 'light',
  collapsed = false,
  onToggleCollapse = () => {}
}) => {
  const [expandedSteps, setExpandedSteps] = useState([AGREEMENT_STEPS[0].id]);

  // 计算进度 - 使用 useMemo 缓存
  const progress = useMemo(() =>
    Math.round((completedSteps.length / AGREEMENT_STEPS.length) * 100),
    [completedSteps.length]
  );

  // 切换步骤展开状态
  const toggleStep = useCallback((stepId) => {
    setExpandedSteps(prev => {
      if (prev.includes(stepId)) {
        return prev.filter(id => id !== stepId);
      }
      return [...prev, stepId];
    });
  }, []);

  // 获取步骤状态
  const getStepStatus = (stepIndex) => {
    if (completedSteps.includes(stepIndex)) {
      return 'completed';
    }
    if (stepIndex === currentStep) {
      return 'active';
    }
    return 'pending';
  };

  // 获取状态徽章
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge bg="success"><i className="bi bi-check"></i></Badge>;
      case 'active':
        return <Badge bg="primary">进行中</Badge>;
      default:
        return <Badge bg="secondary">待完成</Badge>;
    }
  };

  // 渲染步骤项
  const renderStepItem = (step, index) => {
    const status = getStepStatus(index);
    const isExpanded = expandedSteps.includes(step.id);
    const isActive = index === currentStep;

    return (
      <div key={step.id} className="mb-2">
        <ListGroup.Item
          action
          active={isActive}
          onClick={() => {
            toggleStep(step.id);
            onStepClick(index);
          }}
          className="d-flex justify-content-between align-items-center"
          style={{
            backgroundColor: isActive ? (colors.primaryBg || '#0d6efd') : (colors.card || '#fff'),
            borderColor: colors.border || '#dee2e6',
            color: isActive ? '#fff' : (colors.text || '#333'),
            cursor: 'pointer'
          }}
        >
          <div className="d-flex align-items-center">
            <div
              className="me-3 d-flex align-items-center justify-content-center"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : (colors.primaryBg || '#e9ecef'),
                color: isActive ? '#fff' : (colors.primary || '#0d6efd')
              }}
            >
              <i className={`${step.icon}`}></i>
            </div>
            <div>
              <div className="fw-bold">
                第{index + 1}步：{step.title}
              </div>
              <small className={isActive ? 'text-light' : 'text-muted'}>
                {step.description}
              </small>
            </div>
          </div>
          <div className="d-flex align-items-center">
            {getStatusBadge(status)}
            <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'} ms-2`}></i>
          </div>
        </ListGroup.Item>

        <Collapse in={isExpanded}>
          <div>
            <ListGroup variant="flush" className="ms-4 border-start ps-2">
              {step.items.map(item => (
                <ListGroup.Item
                  key={item.id}
                  action
                  onClick={() => onItemClick(index, item.id)}
                  className="py-2"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: colors.border || '#dee2e6',
                    color: colors.text || '#333',
                    fontSize: '0.9rem'
                  }}
                >
                  <div className="d-flex align-items-center">
                    <i className="bi bi-dot me-2"></i>
                    <div>
                      <div>{item.label}</div>
                      <small className="text-muted">{item.description}</small>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Collapse>
      </div>
    );
  };

  if (collapsed) {
    return (
      <Button
        variant="outline-primary"
        size="sm"
        onClick={onToggleCollapse}
        className="mb-3"
      >
        <i className="bi bi-list me-1"></i>
        显示向导菜单
      </Button>
    );
  }

  return (
    <Card
      className="mb-4"
      style={{
        backgroundColor: colors.card || '#fff',
        borderColor: colors.border || '#dee2e6'
      }}
    >
      <Card.Header
        className="d-flex justify-content-between align-items-center"
        style={{
          backgroundColor: colors.headerBg || '#f8f9fa',
          color: colors.headerText || '#333'
        }}
      >
        <span>
          <i className="bi bi-signpost-2 me-2"></i>
          协议生成向导
        </span>
        <Button
          variant="link"
          size="sm"
          onClick={onToggleCollapse}
          className="p-0"
        >
          <i className="bi bi-arrows-collapse"></i>
        </Button>
      </Card.Header>

      <Card.Body>
        {/* 进度条 */}
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <small style={{ color: colors.text || '#6c757d' }}>完成进度</small>
            <small style={{ color: colors.text || '#6c757d' }}>{progress}%</small>
          </div>
          <ProgressBar
            now={progress}
            variant={progress === 100 ? 'success' : 'primary'}
            style={{ height: '8px' }}
          />
        </div>

        {/* 步骤列表 */}
        <ListGroup variant="flush">
          {AGREEMENT_STEPS.map((step, index) => renderStepItem(step, index))}
        </ListGroup>

        {/* 快捷操作 */}
        <div className="mt-3 pt-3 border-top">
          <div className="d-grid gap-2">
            <Button
              variant={completedSteps.length === AGREEMENT_STEPS.length - 1 ? 'primary' : 'outline-primary'}
              disabled={completedSteps.length < AGREEMENT_STEPS.length - 1}
              onClick={() => onStepClick(AGREEMENT_STEPS.length - 1)}
            >
              <i className="bi bi-file-earmark-pdf me-2"></i>
              生成并导出协议
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
});

// 为 React DevTools 设置显示名称
AgreementGuideMenu.displayName = 'AgreementGuideMenu';

// 导出步骤定义供外部使用
export { AGREEMENT_STEPS };
export default AgreementGuideMenu;
