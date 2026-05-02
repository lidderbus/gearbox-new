import React, { useState, useMemo } from 'react';
import { Badge } from 'react-bootstrap';
import { getModuleStatus } from '../services/moduleStatus';

const NAV_GROUPS = [
  {
    label: '选型中心',
    icon: 'bi-crosshair',
    items: [
      { key: 'home', label: '首页', icon: 'bi-house-door' },
      { key: 'input', label: '输入参数', icon: 'bi-input-cursor-text' },
      { key: 'result', label: '选型结果', icon: 'bi-graph-up' },
      { key: 'batch', label: '批量选型', icon: 'bi-list-task' },
      { key: 'reverse-selection', label: '反向选型', icon: 'bi-arrow-return-left' },
      { key: 'multi-condition', label: '多工况选型', icon: 'bi-layers' },
      { key: 'system-solution', label: '整体方案', icon: 'bi-diagram-3' },
      { key: 'smart-search', label: '智能搜索', icon: 'bi-search-heart' },
    ],
  },
  {
    label: '配套设备',
    icon: 'bi-gear-wide-connected',
    items: [
      { key: 'coupling-system', label: '联轴器配套', icon: 'bi-gear-wide-connected' },
      { key: 'coupling-selection', label: '高弹选型', icon: 'bi-link-45deg' },
      { key: 'pump-selection', label: '备用泵选型', icon: 'bi-droplet' },
      { key: 'cummins', label: '康明斯配套', icon: 'bi-gear-wide-connected' },
      { key: 'engine-matching', label: '多品牌主机', icon: 'bi-cpu' },
      { key: 'compatibility-matrix', label: '兼容性矩阵', icon: 'bi-grid-3x3' },
    ],
  },
  {
    label: '文档中心',
    icon: 'bi-file-earmark-text',
    items: [
      { key: 'doc-field-map', label: '字段映射', icon: 'bi-file-earmark-medical' },
      { key: 'inquiry', label: '技术询单', icon: 'bi-file-earmark-plus' },
      { key: 'quotation', label: '报价单', icon: 'bi-currency-yen' },
      { key: 'agreement', label: '技术协议', icon: 'bi-file-earmark-text' },
      { key: 'contract', label: '销售合同', icon: 'bi-file-earmark-ruled' },
      { key: 'offline-package', label: '资料打包', icon: 'bi-file-zip' },
      { key: 'torsional-report', label: '扭振计算书', icon: 'bi-file-earmark-pdf' },
    ],
  },
  {
    label: '推进系统',
    icon: 'bi-compass',
    items: [
      { key: 'propulsion-hub', label: '系统级匹配 Hub', icon: 'bi-diagram-3', badge: 'NEW' },
      { key: 'cpp', label: '可调桨', icon: 'bi-arrow-repeat' },
      { key: 'azimuth', label: '全回转', icon: 'bi-compass' },
      { key: 'thruster', label: '侧推器', icon: 'bi-arrows-expand' },
      { key: 'shaft', label: '轴系设计', icon: 'bi-gear-wide-connected' },
    ],
  },
  {
    label: '资料库',
    icon: 'bi-archive',
    items: [
      { key: 'library-search', label: '全局检索', icon: 'bi-search' },
      { key: 'drawings', label: '外形图库', icon: 'bi-image' },
      { key: 'manuals', label: '说明书库', icon: 'bi-book' },
      { key: 'templates', label: '协议模板库', icon: 'bi-file-earmark-text' },
      { key: 'engine-cases', label: '配机案例', icon: 'bi-journal-text' },
      { key: 'installation-guide', label: '安装指导', icon: 'bi-tools' },
      { key: 'standards-library', label: '标准法规', icon: 'bi-bookmark-check' },
      { key: 'resource-versions', label: '资料版本', icon: 'bi-clock-history' },
      { key: 'tech-comparison', label: '参数对照', icon: 'bi-table' },
    ],
  },
  {
    label: '工程分析',
    icon: 'bi-cpu',
    items: [
      { key: 'torsional', label: '扭振分析', icon: 'bi-activity' },
      { key: 'energy', label: '能效分析', icon: 'bi-lightning-charge' },
      { key: 'energy-optimization', label: '能效优化', icon: 'bi-lightning' },
    ],
  },
  {
    label: '运营分析',
    icon: 'bi-graph-up-arrow',
    items: [
      { key: 'statistics', label: '数据统计', icon: 'bi-bar-chart' },
      { key: 'trend-analysis', label: '趋势分析', icon: 'bi-graph-up' },
      { key: 'series-overview', label: '系列总览', icon: 'bi-grid-3x3-gap' },
      { key: 'power-ratio-heatmap', label: '覆盖热力图', icon: 'bi-grid-3x2-gap' },
      { key: 'competitor', label: '竞品对比', icon: 'bi-bar-chart-fill' },
      { key: 'usage-analytics', label: '使用统计', icon: 'bi-bar-chart' },
    ],
  },
  {
    label: '项目管理',
    icon: 'bi-kanban',
    items: [
      { key: 'project-tracker', label: '项目追踪', icon: 'bi-kanban' },
      { key: 'customer-portal', label: '客户询价', icon: 'bi-person-badge' },
      { key: 'after-sales', label: '售后服务', icon: 'bi-wrench-adjustable' },
      { key: 'certification', label: '船级社认证', icon: 'bi-patch-check' },
    ],
  },
  {
    label: '数据管理',
    icon: 'bi-database',
    items: [
      { key: 'query', label: '数据查询', icon: 'bi-search' },
      { key: 'product-center', label: '产品中心', icon: 'bi-box-seam' },
      { key: 'history', label: '选型历史', icon: 'bi-clock-history' },
      { key: 'data-quality', label: '数据质量', icon: 'bi-clipboard-data' },
      { key: 'data-import', label: '数据导入', icon: 'bi-cloud-upload' },
    ],
  },
  {
    label: '系统管理',
    icon: 'bi-shield-lock',
    items: [
      { key: 'role-management', label: '角色权限', icon: 'bi-people' },
      { key: 'data-backup', label: '数据备份', icon: 'bi-cloud-upload' },
      { key: 'operation-audit', label: '操作审计日志', icon: 'bi-shield-check' },
      { key: 'api-docs', label: 'API文档', icon: 'bi-code-slash' },
      { key: 'mobile-view', label: '移动端', icon: 'bi-phone' },
    ],
  },
];

export default function SidebarNav({ activeTab, onNavigate, collapsed, onToggle, onItemClick }) {
  const [expandedGroups, setExpandedGroups] = useState(() => {
    // Auto-expand the group containing the active tab
    const idx = NAV_GROUPS.findIndex((g) => g.items.some((i) => i.key === activeTab));
    return { [idx]: true };
  });

  // 状态徽标:每次 activeTab 变化时重算(因 markVisited 可能更新)
  const statusMap = useMemo(() => {
    const map = {};
    NAV_GROUPS.forEach(g => g.items.forEach(item => {
      const s = getModuleStatus(item.key);
      if (s) map[item.key] = s;
    }));
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const toggleGroup = (idx) => {
    setExpandedGroups((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Find which group the active tab belongs to and auto-expand it
  React.useEffect(() => {
    const idx = NAV_GROUPS.findIndex((g) => g.items.some((i) => i.key === activeTab));
    if (idx >= 0) {
      setExpandedGroups((prev) => ({ ...prev, [idx]: true }));
    }
  }, [activeTab]);

  return (
    <div
      className={`sidebar-nav ${collapsed ? 'sidebar-collapsed' : ''}`}
      style={{
        width: collapsed ? 48 : 220,
        minHeight: 'calc(100vh - 60px)',
        borderRight: '1px solid var(--bs-border-color, #dee2e6)',
        background: 'var(--bs-body-bg, #fff)',
        transition: 'width 0.2s ease',
        overflowY: 'auto',
        overflowX: 'hidden',
        flexShrink: 0,
        fontSize: '0.875rem',
      }}
    >
      {/* Collapse toggle */}
      <div
        style={{
          padding: '8px',
          textAlign: collapsed ? 'center' : 'right',
          borderBottom: '1px solid var(--bs-border-color, #dee2e6)',
        }}
      >
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={onToggle}
          title={collapsed ? '展开侧边栏' : '折叠侧边栏'}
          style={{ padding: '2px 6px', lineHeight: 1 }}
        >
          <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
        </button>
      </div>

      {NAV_GROUPS.map((group, gIdx) => (
        <div key={gIdx}>
          {/* Group header */}
          <div
            onClick={() => collapsed ? onToggle() : toggleGroup(gIdx)}
            style={{
              padding: collapsed ? '10px 0' : '8px 12px',
              cursor: 'pointer',
              fontWeight: 600,
              color: 'var(--bs-secondary-color, #6c757d)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'space-between',
              borderBottom: '1px solid var(--bs-border-color-translucent, rgba(0,0,0,.05))',
              userSelect: 'none',
            }}
            title={collapsed ? group.label : undefined}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className={`bi ${group.icon}`}></i>
              {!collapsed && <span>{group.label}</span>}
            </span>
            {!collapsed && (
              <i
                className={`bi bi-chevron-${expandedGroups[gIdx] ? 'down' : 'right'}`}
                style={{ fontSize: '0.7rem' }}
              ></i>
            )}
          </div>

          {/* Group items */}
          {!collapsed && expandedGroups[gIdx] && (
            <div>
              {group.items.map((item) => (
                <div
                  key={item.key}
                  onClick={() => { onNavigate(item.key); onItemClick?.(); }}
                  style={{
                    padding: '6px 12px 6px 28px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background:
                      activeTab === item.key
                        ? 'var(--bs-primary-bg-subtle, rgba(46,125,50,.1))'
                        : 'transparent',
                    color:
                      activeTab === item.key
                        ? 'var(--bs-primary, #2e7d32)'
                        : 'var(--bs-body-color, #333)',
                    fontWeight: activeTab === item.key ? 600 : 400,
                    borderLeft:
                      activeTab === item.key
                        ? '3px solid var(--bs-primary, #2e7d32)'
                        : '3px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== item.key) {
                      e.currentTarget.style.background = 'var(--bs-tertiary-bg, #f8f9fa)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== item.key) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <i className={`bi ${item.icon}`} style={{ width: 16, textAlign: 'center' }}></i>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {statusMap[item.key] && (
                    <Badge
                      bg={statusMap[item.key].color}
                      title={statusMap[item.key].tooltip}
                      style={{
                        fontSize: '0.65rem',
                        padding: statusMap[item.key].kind === 'ready' ? '0.15em 0.45em' : '0.2em 0.4em',
                        marginLeft: 'auto',
                        lineHeight: 1,
                      }}
                    >
                      {statusMap[item.key].label}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export { NAV_GROUPS };
