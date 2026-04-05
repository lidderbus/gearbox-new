// src/components/OnboardingGuide.js
// 首次使用引导 — 分步介绍系统核心功能
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Badge, ProgressBar } from 'react-bootstrap';

const STORAGE_KEY = 'onboarding_completed';

const STEPS = [
  {
    title: '欢迎使用船用齿轮箱智能选型系统',
    icon: 'bi-speedometer2',
    content: '本系统涵盖选型计算、文档生成、工程分析等全流程功能，覆盖696个齿轮箱型号。',
    tip: '左侧导航栏可切换9大功能模块',
  },
  {
    title: '智能选型',
    icon: 'bi-cpu',
    content: '输入主机功率、转速、速比，系统自动匹配最佳齿轮箱并推荐联轴器和备用泵。',
    tip: '支持批量选型、反向选型、多工况选型等高级模式',
  },
  {
    title: '文档中心',
    icon: 'bi-file-earmark-text',
    content: '一键生成技术询单、报价单、技术协议、销售合同，支持PDF/Word/Excel多格式导出。',
    tip: '文档之间自动建立追溯关联：询单→报价→协议→合同',
  },
  {
    title: '工程计算',
    icon: 'bi-calculator',
    content: '扭振分析(COMPASS标准)、能效分析(EEDI/CII)、临界转速检查、轴系设计等专业工具。',
    tip: '扭振分析已校准至COMPASS固有频率<0.06%误差',
  },
  {
    title: '竞品分析',
    icon: 'bi-trophy',
    content: '16品牌243产品数据库，支持技术对比、TCO分析、市场定位和销售话术生成。',
    tip: '包含79份竞品外形图PDF',
  },
  {
    title: '项目管理',
    icon: 'bi-kanban',
    content: '全流程跟踪：询价→报价→谈判→签约→生产→交付，支持客户询价和售后工单管理。',
    tip: '系统会自动提醒超期未处理的询价和工单',
  },
  {
    title: '数据导出',
    icon: 'bi-download',
    content: '所有数据页面统一支持CSV/Excel/打印三种导出方式，打印自带公司页眉和标准格式。',
    tip: '快捷键: Ctrl+P打印, Ctrl+E导出, Ctrl+/查看帮助',
  },
];

export default function OnboardingGuide() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) setVisible(true);
  }, []);

  const next = useCallback(() => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      setVisible(false);
    }
  }, [step]);

  const skip = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setVisible(false);
  }, []);

  const prev = useCallback(() => {
    if (step > 0) setStep(s => s - 1);
  }, [step]);

  if (!visible) return null;

  const s = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Card style={{ maxWidth: 480, width: '90%' }} className="shadow-lg">
        <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
          <span><i className={`bi ${s.icon} me-2`}></i>{s.title}</span>
          <Badge bg="light" text="dark">{step + 1} / {STEPS.length}</Badge>
        </Card.Header>
        <Card.Body>
          <p>{s.content}</p>
          {s.tip && (
            <div className="bg-light rounded p-2 small">
              <i className="bi bi-lightbulb text-warning me-1"></i>
              <strong>提示:</strong> {s.tip}
            </div>
          )}
          <ProgressBar now={progress} variant="primary" className="mt-3" style={{ height: 4 }} />
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between">
          <Button variant="link" size="sm" onClick={skip} className="text-muted">跳过引导</Button>
          <div>
            {step > 0 && <Button variant="outline-secondary" size="sm" className="me-2" onClick={prev}>上一步</Button>}
            <Button variant="primary" size="sm" onClick={next}>
              {step < STEPS.length - 1 ? '下一步' : '开始使用'}
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}

/**
 * Reset onboarding so the guide shows again on next visit.
 * Can be called from a settings page or dev console:
 *   import { resetOnboarding } from './components/OnboardingGuide';
 *   resetOnboarding();
 */
export function resetOnboarding() {
  localStorage.removeItem(STORAGE_KEY);
}
