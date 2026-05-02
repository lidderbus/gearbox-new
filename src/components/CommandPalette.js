// 全局命令面板 — Cmd+K / Ctrl+K 触发,统一搜索入口
//
// 索引来源:
// 1. NAV_GROUPS 全部菜单项(~50 项)→ 模块跳转
// 2. globalSearchService(资料库 5 类聚合)→ 资料检索
// 3. ProjectTracker localStorage(gearbox_projects)→ 项目跳转
//
// 交互:
// - Cmd+K (Mac) / Ctrl+K (Win) 打开
// - ↑↓ 切换选中,Enter 执行,Esc 关闭
// - 点击行执行
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Modal, Form, InputGroup, Badge, ListGroup } from 'react-bootstrap';
import { NAV_GROUPS } from './SidebarNav';
import { search as globalSearch, SOURCE_TYPES } from '../services/globalSearchService';

const CommandPalette = ({ show, onHide, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // 重置状态
  useEffect(() => {
    if (show) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [show]);

  // 索引:模块入口
  const moduleEntries = useMemo(() => {
    const out = [];
    NAV_GROUPS.forEach(group => {
      group.items.forEach(item => {
        out.push({
          id: `mod-${item.key}`,
          kind: 'module',
          title: item.label,
          subtitle: group.label,
          icon: item.icon,
          color: 'primary',
          action: { type: 'tab', key: item.key },
          searchText: `${item.label} ${group.label} ${item.key}`.toLowerCase(),
        });
      });
    });
    return out;
  }, []);

  // 索引:项目(localStorage gearbox_projects)
  const projectEntries = useMemo(() => {
    try {
      const raw = localStorage.getItem('gearbox_projects');
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.slice(0, 100).map(p => ({
        id: `prj-${p.id}`,
        kind: 'project',
        title: p.name || p.id,
        subtitle: `项目 · ${p.id} · ${p.customer || ''} · ${p.gearbox || ''}`,
        icon: 'bi-kanban',
        color: 'warning',
        action: { type: 'project', projectId: p.id, projectName: p.name },
        searchText: `${p.id} ${p.name} ${p.customer} ${p.gearbox} ${p.salesman || ''}`.toLowerCase(),
      }));
    } catch (e) { return []; }
  }, [show]); // 每次打开都重新读取(惰性)

  // 索引:资料库(仅在有 query 时调用,避免一次性渲染 1700+ 条)
  const libraryEntries = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return [];
    try {
      const results = globalSearch(q, { limit: 30 });
      return results.map(r => {
        const info = SOURCE_TYPES[r.type] || { icon: 'bi-file', color: 'secondary', label: '资料' };
        return {
          id: `lib-${r.id}`,
          kind: 'library',
          title: r.title,
          subtitle: `${info.label} · ${r.subtitle || ''}`,
          icon: info.icon,
          color: info.color,
          action: { type: 'tab', key: 'library-search', query: q },
          searchText: `${r.title} ${r.subtitle || ''} ${(r.tags||[]).join(' ')}`.toLowerCase(),
          link: r.link,
        };
      });
    } catch (e) { return []; }
  }, [query]);

  // 综合搜索
  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = [...moduleEntries, ...projectEntries, ...libraryEntries];
    if (!q) {
      // 无查询:展示前若干模块入口(常用快捷)
      return moduleEntries.slice(0, 12).map(e => ({ ...e, score: 0 }));
    }
    const tokens = q.split(/\s+/).filter(Boolean);
    const scored = [];
    for (const entry of all) {
      let score = 0;
      let allHit = true;
      for (const t of tokens) {
        if (entry.searchText.includes(t)) {
          score += 1;
          if (entry.title.toLowerCase().includes(t)) score += 3;
          if (entry.title.toLowerCase().startsWith(t)) score += 5;
        } else {
          allHit = false;
          break;
        }
      }
      // 模块入口加权(更可能是用户想跳转的)
      if (entry.kind === 'module') score += 2;
      if (allHit && score > 0) scored.push({ ...entry, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 50);
  }, [query, moduleEntries, projectEntries, libraryEntries]);

  // 选中索引边界保护
  useEffect(() => {
    if (selectedIdx >= filteredEntries.length) {
      setSelectedIdx(Math.max(0, filteredEntries.length - 1));
    }
  }, [filteredEntries.length, selectedIdx]);

  const executeEntry = useCallback((entry) => {
    if (!entry) return;
    const { action } = entry;
    if (action.type === 'tab') {
      // 资料库结果:写 query 到 sessionStorage 让 LibrarySearchView 自动填入
      if (entry.kind === 'library' && action.query) {
        try { sessionStorage.setItem('library_search_preset', action.query); } catch (e) { /* ignore */ }
      }
      onNavigate(action.key);
    } else if (action.type === 'project') {
      // 项目跳转:设 sessionStorage current_project_id 然后跳到 project-tracker
      try {
        sessionStorage.setItem('current_project_id', action.projectId);
        if (action.projectName) sessionStorage.setItem('current_project_name', action.projectName);
      } catch (e) { /* ignore */ }
      onNavigate('project-tracker');
    }
    // 资料库直链:外部打开
    if (entry.link && entry.kind === 'library') {
      try { window.open(entry.link, '_blank', 'noopener,noreferrer'); } catch (e) { /* ignore */ }
    }
    onHide();
  }, [onNavigate, onHide]);

  // 键盘导航
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(prev => Math.min(filteredEntries.length - 1, prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(prev => Math.max(0, prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeEntry(filteredEntries[selectedIdx]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onHide();
    }
  };

  // 选中项滚动到视野
  useEffect(() => {
    if (!listRef.current) return;
    const item = listRef.current.querySelector(`[data-idx="${selectedIdx}"]`);
    if (item) item.scrollIntoView({ block: 'nearest' });
  }, [selectedIdx]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable backdrop="static" aria-labelledby="cmd-palette-title">
      <Modal.Header className="py-2 px-3">
        {/* C5: 视觉隐藏的标题供屏幕阅读器朗读 */}
        <Modal.Title id="cmd-palette-title" className="visually-hidden">命令面板</Modal.Title>
        <InputGroup>
          <InputGroup.Text style={{ background: 'transparent', border: 'none' }}>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            ref={inputRef}
            placeholder="跳转到模块 / 搜索资料 / 查找项目…(↑↓ 移动,Enter 跳转,Esc 关闭)"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0); }}
            onKeyDown={handleKeyDown}
            style={{ border: 'none', boxShadow: 'none', fontSize: '1rem' }}
            autoFocus
          />
          <InputGroup.Text style={{ background: 'transparent', border: 'none', fontSize: '0.78rem' }}>
            <Badge bg="light" text="dark" className="me-1">⌘K</Badge>
            <span className="text-muted">{filteredEntries.length} 项</span>
          </InputGroup.Text>
        </InputGroup>
      </Modal.Header>

      <Modal.Body className="p-0" style={{ maxHeight: '60vh' }}>
        <ListGroup variant="flush" ref={listRef}>
          {filteredEntries.length === 0 ? (
            <ListGroup.Item className="text-center text-muted py-4">
              <i className="bi bi-inbox d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
              {query.trim() ? '未找到匹配项' : '请输入关键词'}
            </ListGroup.Item>
          ) : filteredEntries.map((entry, idx) => {
            const active = idx === selectedIdx;
            return (
              <ListGroup.Item
                key={entry.id}
                data-idx={idx}
                action
                active={active}
                onClick={() => executeEntry(entry)}
                onMouseEnter={() => setSelectedIdx(idx)}
                style={{ cursor: 'pointer', borderLeft: active ? `3px solid var(--bs-${entry.color})` : '3px solid transparent' }}
              >
                <div className="d-flex align-items-center gap-2">
                  <i className={`bi ${entry.icon} text-${entry.color}`} style={{ fontSize: '1.05rem', width: 20 }}></i>
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div className="text-truncate" style={{ fontWeight: 500, fontSize: '0.92rem' }}>
                      {entry.title}
                    </div>
                    <small className="text-muted text-truncate d-block" style={{ fontSize: '0.78rem' }}>
                      {entry.subtitle}
                    </small>
                  </div>
                  <Badge bg={entry.color} style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                    {entry.kind === 'module' ? '模块' : entry.kind === 'project' ? '项目' : '资料'}
                  </Badge>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Modal.Body>

      <Modal.Footer className="py-1 px-3" style={{ fontSize: '0.78rem' }}>
        <small className="text-muted">
          <i className="bi bi-arrow-up-short"></i><i className="bi bi-arrow-down-short"></i> 选择 ·
          <kbd style={{ fontSize: '0.7rem' }}>Enter</kbd> 跳转 ·
          <kbd style={{ fontSize: '0.7rem' }}>Esc</kbd> 关闭
        </small>
      </Modal.Footer>
    </Modal>
  );
};

export default CommandPalette;
