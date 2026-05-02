// src/components/responsive/ResponsiveSelectionForm.js
// P1#5 (2026-04-24): 行内校验 + 离线指示 + touched 状态跟踪
import React, { useState, useEffect } from 'react';
import { Collapse } from 'react-bootstrap';
import './ResponsiveSelectionForm.css';

const QUICK_RATIOS = [2, 2.5, 3, 3.5, 4];

const GEARBOX_TYPES = [
  { value: 'HC', label: 'HC系列' },
  { value: 'GW', label: 'GW系列' },
  { value: 'HCM', label: 'HCM系列' },
  { value: 'DT', label: 'DT系列' },
  { value: 'HCQ', label: 'HCQ系列' },
  { value: 'GC', label: 'GC系列' },
  { value: 'HCA', label: 'HCA系列' },
  { value: 'HCV', label: 'HCV系列' },
  { value: 'HCX', label: 'HCX系列' },
  { value: 'MV', label: 'MV系列' },
  { value: 'OTHER', label: '其他系列' },
];

/**
 * Mobile-optimized selection form with collapsible sections
 */
const ResponsiveSelectionForm = ({
  engineData,
  setEngineData,
  requirementData,
  setRequirementData,
  projectInfo,
  setProjectInfo,
  gearboxType,
  setGearboxType,
  onSelect,
  loading,
}) => {
  const [projectInfoOpen, setProjectInfoOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [touched, setTouched] = useState({});
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // 行内校验 — 返回错误信息 or null
  const getFieldError = (field, value) => {
    const v = parseFloat(value);
    if (field === 'power') {
      if (value === '' || value == null) return '必填 (推荐 50-3500 kW)';
      if (isNaN(v) || v <= 0) return '必须大于 0';
      if (v > 8000) return '超出常见范围,请确认';
    }
    if (field === 'speed') {
      if (value === '' || value == null) return '必填 (柴油机常见 750-2200 rpm)';
      if (isNaN(v) || v <= 0) return '必须大于 0';
      if (v > 5000) return '转速过高,请确认';
    }
    if (field === 'targetRatio') {
      if (value === '' || value == null) return '必填 (常见 1.5-10)';
      if (isNaN(v) || v <= 0) return '必须大于 0';
      if (v > 20) return '减速比过大,请确认';
    }
    return null;
  };

  const markTouched = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const handleEngineChange = (field, value) => {
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      setEngineData({ ...engineData, [field]: value });
    }
  };

  const handleRequirementChange = (field, value) => {
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      setRequirementData({ ...requirementData, [field]: value });
    }
  };

  const handleProjectChange = (field, value) => {
    setProjectInfo({ ...projectInfo, [field]: value });
  };

  const handleQuickRatio = (ratio) => {
    setRequirementData({ ...requirementData, targetRatio: ratio.toString() });
  };

  const isFormValid = () => {
    return engineData.power && engineData.speed && requirementData.targetRatio;
  };

  const powerError = touched.power ? getFieldError('power', engineData.power) : null;
  const speedError = touched.speed ? getFieldError('speed', engineData.speed) : null;
  const ratioError = touched.targetRatio ? getFieldError('targetRatio', requirementData.targetRatio) : null;

  return (
    <div className="responsive-form">
      {/* 离线指示 — 红色顶部横幅 */}
      {!isOnline && (
        <div
          style={{
            background: '#dc3545', color: '#fff', padding: '6px 12px',
            textAlign: 'center', fontSize: '0.85rem', fontWeight: 500,
            borderRadius: 4, marginBottom: 8
          }}
          role="alert"
        >
          <i className="bi bi-wifi-off me-1"></i> 离线模式 — 选型仍可用,但报价/同步功能不可用
        </div>
      )}

      {/* Core Parameters */}
      <div className="core-params">
        <div className="core-params-title">核心参数</div>

        {/* Gearbox Type */}
        <div className="gearbox-type-selector">
          <select
            value={gearboxType}
            onChange={(e) => setGearboxType(e.target.value)}
          >
            {GEARBOX_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Power, Speed, Ratio in one row */}
        <div className="input-row">
          <div className="input-group-responsive">
            <label>功率 (kW) <span style={{ color: '#dc3545' }}>*</span></label>
            <input
              type="number"
              inputMode="decimal"
              value={engineData.power}
              onChange={(e) => handleEngineChange('power', e.target.value)}
              onBlur={() => markTouched('power')}
              placeholder="50-3500"
              style={powerError ? { borderColor: '#dc3545', borderWidth: 2 } : undefined}
            />
            {powerError && <small style={{ color: '#dc3545', fontSize: '0.72rem' }}>{powerError}</small>}
          </div>
          <div className="input-group-responsive">
            <label>转速 (rpm) <span style={{ color: '#dc3545' }}>*</span></label>
            <input
              type="number"
              inputMode="decimal"
              value={engineData.speed}
              onChange={(e) => handleEngineChange('speed', e.target.value)}
              onBlur={() => markTouched('speed')}
              placeholder="750-2200"
              style={speedError ? { borderColor: '#dc3545', borderWidth: 2 } : undefined}
            />
            {speedError && <small style={{ color: '#dc3545', fontSize: '0.72rem' }}>{speedError}</small>}
          </div>
          <div className="input-group-responsive">
            <label>速比 <span style={{ color: '#dc3545' }}>*</span></label>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={requirementData.targetRatio}
              onChange={(e) => handleRequirementChange('targetRatio', e.target.value)}
              onBlur={() => markTouched('targetRatio')}
              placeholder="1.5-10"
              style={ratioError ? { borderColor: '#dc3545', borderWidth: 2 } : undefined}
            />
            {ratioError && <small style={{ color: '#dc3545', fontSize: '0.72rem' }}>{ratioError}</small>}
          </div>
        </div>

        {/* Quick ratio buttons */}
        <div className="quick-ratios">
          {QUICK_RATIOS.map((ratio) => (
            <button
              key={ratio}
              type="button"
              className={`quick-ratio-btn ${
                requirementData.targetRatio === ratio.toString() ? 'selected' : ''
              }`}
              onClick={() => handleQuickRatio(ratio)}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      {/* Project Info - Collapsible */}
      <div className="collapsible-section">
        <div
          className="collapsible-header"
          onClick={() => setProjectInfoOpen(!projectInfoOpen)}
        >
          <span>
            <span className="collapsible-title">项目信息</span>
            <span className="collapsible-badge">(选填)</span>
          </span>
          <span className={`collapsible-icon ${projectInfoOpen ? 'open' : ''}`}>
            ▼
          </span>
        </div>
        <Collapse in={projectInfoOpen}>
          <div>
            <div className="collapsible-content">
              <div className="form-field">
                <label>项目名称</label>
                <input
                  type="text"
                  value={projectInfo.projectName || ''}
                  onChange={(e) => handleProjectChange('projectName', e.target.value)}
                  placeholder="请输入项目名称"
                />
              </div>
              <div className="form-field">
                <label>客户名称</label>
                <input
                  type="text"
                  value={projectInfo.customerName || ''}
                  onChange={(e) => handleProjectChange('customerName', e.target.value)}
                  placeholder="请输入客户名称"
                />
              </div>
              <div className="form-field">
                <label>联系人</label>
                <input
                  type="text"
                  value={projectInfo.contactPerson || ''}
                  onChange={(e) => handleProjectChange('contactPerson', e.target.value)}
                  placeholder="请输入联系人"
                />
              </div>
              <div className="form-field">
                <label>联系电话</label>
                <input
                  type="tel"
                  value={projectInfo.contactPhone || ''}
                  onChange={(e) => handleProjectChange('contactPhone', e.target.value)}
                  placeholder="请输入联系电话"
                />
              </div>
            </div>
          </div>
        </Collapse>
      </div>

      {/* Advanced Config - Collapsible */}
      <div className="collapsible-section">
        <div
          className="collapsible-header"
          onClick={() => setAdvancedOpen(!advancedOpen)}
        >
          <span>
            <span className="collapsible-title">高级配置</span>
            <span className="collapsible-badge">(选填)</span>
          </span>
          <span className={`collapsible-icon ${advancedOpen ? 'open' : ''}`}>
            ▼
          </span>
        </div>
        <Collapse in={advancedOpen}>
          <div>
            <div className="collapsible-content">
              <div className="form-field">
                <label>推力要求 (kN)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={requirementData.thrustRequirement || ''}
                  onChange={(e) => handleRequirementChange('thrustRequirement', e.target.value)}
                  placeholder="请输入推力要求"
                />
              </div>
            </div>
          </div>
        </Collapse>
      </div>

      {/* Sticky Submit Button */}
      <div className="sticky-submit">
        <button
          className="submit-btn"
          onClick={onSelect}
          disabled={!isFormValid() || loading}
        >
          {loading ? (
            <span role="status" aria-live="polite">
              <span className="spinner-border spinner-border-sm" aria-hidden="true" />
              选型中...
            </span>
          ) : (
            <>🔍 开始选型</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResponsiveSelectionForm;
