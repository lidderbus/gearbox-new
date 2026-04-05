// src/components/NotificationCenter.js
// 全局通知中心 — 超期提醒+待办事项+桌面通知
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Badge, Dropdown, ListGroup, Button } from 'react-bootstrap';

const STORAGE_KEYS = {
  projects: 'gearbox_projects',
  inquiries: 'customer_inquiries',
  tickets: 'aftersales_tickets',
  dismissed: 'notification_dismissed',
};

function safeRead(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

function daysSince(dateStr) {
  if (!dateStr) return 0;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

export default function NotificationCenter() {
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.dismissed) || '[]'); } catch { return []; }
  });

  const notifications = useMemo(() => {
    const items = [];

    // Check overdue projects (inquiry/quoting > 14 days)
    safeRead(STORAGE_KEYS.projects).forEach(p => {
      if (['inquiry', 'quoting'].includes(p.status)) {
        const days = daysSince(p.date || p.createdAt);
        if (days > 14) {
          items.push({ id: `proj-${p.id}`, type: 'warning', icon: 'bi-kanban',
            text: `项目 ${p.id} "${p.name}" ${p.status === 'inquiry' ? '询价' : '报价'}已${days}天`,
            module: '项目追踪', date: p.date });
        }
      }
    });

    // Check overdue customer inquiries (new > 7 days, processing > 14 days)
    safeRead(STORAGE_KEYS.inquiries).forEach(inq => {
      const days = daysSince(inq.date || inq.createdAt);
      if (inq.status === 'new' && days > 7) {
        items.push({ id: `inq-${inq.id}`, type: 'danger', icon: 'bi-person-badge',
          text: `询价 ${inq.id} (${inq.customer}) 新建${days}天未处理`,
          module: '客户询价', date: inq.date });
      } else if (inq.status === 'processing' && days > 14) {
        items.push({ id: `inq-p-${inq.id}`, type: 'warning', icon: 'bi-person-badge',
          text: `询价 ${inq.id} (${inq.customer}) 处理中${days}天`,
          module: '客户询价', date: inq.date });
      }
    });

    // Check overdue tickets (pending/processing > 7 days)
    safeRead(STORAGE_KEYS.tickets).forEach(t => {
      const days = daysSince(t.date || t.createdAt);
      if (['pending', 'processing'].includes(t.status) && days > 7) {
        items.push({ id: `tk-${t.id}`, type: t.priority === 'critical' ? 'danger' : 'warning',
          icon: 'bi-wrench', text: `工单 ${t.id} (${t.customer}) ${t.status === 'pending' ? '待分配' : '处理中'}${days}天`,
          module: '售后服务', date: t.date });
      }
    });

    // Filter out dismissed
    return items.filter(n => !dismissed.includes(n.id)).sort((a, b) =>
      a.type === 'danger' ? -1 : b.type === 'danger' ? 1 : 0
    );
  }, [dismissed]);

  const dismiss = useCallback((id) => {
    const updated = [...dismissed, id];
    setDismissed(updated);
    localStorage.setItem(STORAGE_KEYS.dismissed, JSON.stringify(updated));
  }, [dismissed]);

  const dismissAll = useCallback(() => {
    const ids = notifications.map(n => n.id);
    const updated = [...dismissed, ...ids];
    setDismissed(updated);
    localStorage.setItem(STORAGE_KEYS.dismissed, JSON.stringify(updated));
  }, [notifications, dismissed]);

  // Desktop notification on first overdue detection
  useEffect(() => {
    if (notifications.length > 0 && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    const dangerCount = notifications.filter(n => n.type === 'danger').length;
    if (dangerCount > 0 && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('船用齿轮箱选型系统', {
          body: `有 ${dangerCount} 条紧急待办需要处理`,
          icon: '/gearbox-app/logo192.png'
        });
      } catch {}
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (notifications.length === 0) {
    return (
      <span className="position-relative me-2" title="暂无通知">
        <i className="bi bi-bell" style={{ fontSize: '1.1rem', opacity: 0.5 }}></i>
      </span>
    );
  }

  return (
    <Dropdown align="end" className="me-2">
      <Dropdown.Toggle variant="link" className="p-0 text-decoration-none position-relative" style={{ lineHeight: 1 }}>
        <i className="bi bi-bell-fill text-warning" style={{ fontSize: '1.1rem' }}></i>
        <Badge bg="danger" pill className="position-absolute" style={{ top: -4, right: -8, fontSize: '0.65rem' }}>
          {notifications.length}
        </Badge>
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ width: 360, maxHeight: 400, overflowY: 'auto' }}>
        <div className="d-flex justify-content-between align-items-center px-3 py-1 border-bottom">
          <strong className="small">待办提醒</strong>
          <Button variant="link" size="sm" className="p-0 small" onClick={dismissAll}>全部已读</Button>
        </div>
        <ListGroup variant="flush">
          {notifications.map(n => (
            <ListGroup.Item key={n.id} className="d-flex align-items-start py-2 px-3">
              <i className={`bi ${n.icon} text-${n.type} me-2 mt-1`}></i>
              <div className="flex-grow-1">
                <div className="small">{n.text}</div>
                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{n.module}</div>
              </div>
              <Button variant="link" size="sm" className="p-0 text-muted" onClick={() => dismiss(n.id)} title="已读">
                <i className="bi bi-x"></i>
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Dropdown.Menu>
    </Dropdown>
  );
}
