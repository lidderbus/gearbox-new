// src/components/responsive/ResponsiveSelectionForm.js
import React, { useState } from 'react';
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

  return (
    <div className="responsive-form">
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
            <label>功率 (kW)</label>
            <input
              type="number"
              inputMode="decimal"
              value={engineData.power}
              onChange={(e) => handleEngineChange('power', e.target.value)}
              placeholder="功率"
            />
          </div>
          <div className="input-group-responsive">
            <label>转速 (rpm)</label>
            <input
              type="number"
              inputMode="decimal"
              value={engineData.speed}
              onChange={(e) => handleEngineChange('speed', e.target.value)}
              placeholder="转速"
            />
          </div>
          <div className="input-group-responsive">
            <label>速比</label>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={requirementData.targetRatio}
              onChange={(e) => handleRequirementChange('targetRatio', e.target.value)}
              placeholder="速比"
            />
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
            <>
              <span className="spinner-border spinner-border-sm" />
              选型中...
            </>
          ) : (
            <>🔍 开始选型</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResponsiveSelectionForm;
