import React, { useState } from 'react';

const NAV_GROUPS = [
  {
    label: '选型中心',
    icon: 'bi-crosshair',
    items: [
      { key: 'home', label: '首页', icon: 'bi-house-door' },
      { key: 'input', label: '输入参数', icon: 'bi-input-cursor-text' },
      { key: 'result', label: '选型结果', icon: 'bi-graph-up' },
      { key: 'batch', label: '批量选型', icon: 'bi-list-task' },
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
    ],
  },
  {
    label: '文档中心',
    icon: 'bi-file-earmark-text',
    items: [
      { key: 'inquiry', label: '技术询单', icon: 'bi-file-earmark-plus' },
      { key: 'quotation', label: '报价单', icon: 'bi-currency-yen' },
      { key: 'agreement', label: '技术协议', icon: 'bi-file-earmark-text' },
      { key: 'contract', label: '销售合同', icon: 'bi-file-earmark-ruled' },
    ],
  },
  {
    label: '推进系统',
    icon: 'bi-compass',
    items: [
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
      { key: 'drawings', label: '外形图库', icon: 'bi-image' },
      { key: 'manuals', label: '说明书库', icon: 'bi-book' },
      { key: 'templates', label: '协议模板库', icon: 'bi-file-earmark-text' },
      { key: 'engine-cases', label: '配机案例', icon: 'bi-journal-text' },
    ],
  },
  {
    label: '分析工具',
    icon: 'bi-activity',
    items: [
      { key: 'torsional', label: '扭振分析', icon: 'bi-activity' },
      { key: 'energy', label: '能效分析', icon: 'bi-lightning-charge' },
      { key: 'statistics', label: '数据统计', icon: 'bi-bar-chart' },
      { key: 'analytics', label: '使用分析', icon: 'bi-graph-up-arrow' },
      { key: 'competitor', label: '竞品对比', icon: 'bi-bar-chart-fill' },
    ],
  },
  {
    label: '数据管理',
    icon: 'bi-database',
    items: [
      { key: 'query', label: '数据查询', icon: 'bi-search' },
      { key: 'product-center', label: '产品中心', icon: 'bi-box-seam' },
      { key: 'history', label: '选型历史', icon: 'bi-clock-history' },
      { key: 'hcm-selection', label: 'HCM高速', icon: 'bi-speedometer2' },
      { key: 'inventory', label: '库存管理', icon: 'bi-box-seam' },
      { key: 'receivables', label: '应收账款', icon: 'bi-cash-stack' },
    ],
  },
];

export default function SidebarNav({ activeTab, onNavigate, collapsed, onToggle, onItemClick }) {
  const [expandedGroups, setExpandedGroups] = useState(() => {
    // Auto-expand the group containing the active tab
    const idx = NAV_GROUPS.findIndex((g) => g.items.some((i) => i.key === activeTab));
    return { [idx]: true };
  });

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
                  <span>{item.label}</span>
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
