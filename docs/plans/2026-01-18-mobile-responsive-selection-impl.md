# Mobile Responsive Selection Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement responsive selection UI for mobile/tablet devices (screen width < 1024px) with collapsible sections and swipeable result cards.

**Architecture:** Add conditional rendering in InputForm.js and EnhancedGearboxSelectionResult.js that switches to mobile-optimized components when useIsMobile() detects smaller screens. Use Bootstrap Collapse for sections and react-swipeable for card gestures.

**Tech Stack:** React 18, Bootstrap 5, react-swipeable, existing useIsMobile hook

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install react-swipeable**

Run:
```bash
cd /Users/lidder/gearbox-new && npm install react-swipeable
```

Expected: Package added to dependencies

**Step 2: Verify installation**

Run:
```bash
grep "react-swipeable" /Users/lidder/gearbox-new/package.json
```

Expected: `"react-swipeable": "^7.x.x"` in dependencies

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add react-swipeable for mobile gestures"
```

---

## Task 2: Create ResponsiveSelectionForm Component

**Files:**
- Create: `src/components/responsive/ResponsiveSelectionForm.js`
- Create: `src/components/responsive/ResponsiveSelectionForm.css`

**Step 1: Create directory**

Run:
```bash
mkdir -p /Users/lidder/gearbox-new/src/components/responsive
```

**Step 2: Create CSS file**

Create `src/components/responsive/ResponsiveSelectionForm.css`:

```css
/* ResponsiveSelectionForm.css - Mobile optimized selection form */

.responsive-form {
  padding: 16px;
  padding-bottom: 80px; /* Space for sticky button */
}

/* Core params section */
.core-params {
  background: var(--card-bg, #fff);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.core-params-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-color, #333);
}

/* Input row - horizontal layout */
.input-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.input-group-responsive {
  display: flex;
  flex-direction: column;
}

.input-group-responsive label {
  font-size: 12px;
  color: var(--muted-color, #666);
  margin-bottom: 4px;
}

.input-group-responsive input,
.input-group-responsive select {
  height: 48px;
  font-size: 16px; /* Prevents iOS zoom */
  border: 1px solid var(--border-color, #ddd);
  border-radius: 8px;
  padding: 0 12px;
  background: var(--input-bg, #fff);
  color: var(--text-color, #333);
}

.input-group-responsive input:focus,
.input-group-responsive select:focus {
  outline: none;
  border-color: var(--primary-color, #0d6efd);
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
}

/* Gearbox type selector - full width */
.gearbox-type-selector {
  margin-bottom: 16px;
}

.gearbox-type-selector select {
  width: 100%;
  height: 48px;
  font-size: 16px;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 8px;
  padding: 0 12px;
  background: var(--input-bg, #fff);
  color: var(--text-color, #333);
}

/* Quick ratio buttons */
.quick-ratios {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.quick-ratio-btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 18px;
  border: 1px solid var(--border-color, #ddd);
  background: var(--card-bg, #fff);
  color: var(--text-color, #333);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-ratio-btn:active {
  background: var(--primary-color, #0d6efd);
  color: #fff;
  border-color: var(--primary-color, #0d6efd);
}

.quick-ratio-btn.selected {
  background: var(--primary-color, #0d6efd);
  color: #fff;
  border-color: var(--primary-color, #0d6efd);
}

/* Collapsible sections */
.collapsible-section {
  background: var(--card-bg, #fff);
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.collapsible-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.collapsible-header:active {
  background: var(--hover-bg, #f5f5f5);
}

.collapsible-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color, #333);
}

.collapsible-badge {
  font-size: 12px;
  color: var(--muted-color, #999);
  margin-left: 8px;
}

.collapsible-icon {
  font-size: 12px;
  color: var(--muted-color, #999);
  transition: transform 0.3s;
}

.collapsible-icon.open {
  transform: rotate(180deg);
}

.collapsible-content {
  padding: 0 16px 16px;
}

/* Form fields in collapsible */
.form-field {
  margin-bottom: 12px;
}

.form-field:last-child {
  margin-bottom: 0;
}

.form-field label {
  display: block;
  font-size: 12px;
  color: var(--muted-color, #666);
  margin-bottom: 4px;
}

.form-field input {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 8px;
  padding: 0 12px;
  background: var(--input-bg, #fff);
  color: var(--text-color, #333);
}

/* Sticky submit button */
.sticky-submit {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0));
  background: var(--card-bg, #fff);
  border-top: 1px solid var(--border-color, #eee);
  z-index: 100;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background: var(--primary-color, #0d6efd);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:disabled {
  background: var(--muted-color, #ccc);
  cursor: not-allowed;
}

.submit-btn:not(:disabled):active {
  opacity: 0.9;
}

/* Dark theme support */
[data-theme="dark"] .core-params,
[data-theme="dark"] .collapsible-section {
  background: var(--card-bg-dark, #1e1e1e);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .input-group-responsive input,
[data-theme="dark"] .input-group-responsive select,
[data-theme="dark"] .gearbox-type-selector select,
[data-theme="dark"] .form-field input {
  background: var(--input-bg-dark, #2d2d2d);
  border-color: var(--border-color-dark, #444);
  color: var(--text-color-dark, #eee);
}

[data-theme="dark"] .quick-ratio-btn {
  background: var(--card-bg-dark, #2d2d2d);
  border-color: var(--border-color-dark, #444);
  color: var(--text-color-dark, #eee);
}

[data-theme="dark"] .sticky-submit {
  background: var(--card-bg-dark, #1e1e1e);
  border-color: var(--border-color-dark, #333);
}
```

**Step 3: Create component file**

Create `src/components/responsive/ResponsiveSelectionForm.js`:

```jsx
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
```

**Step 4: Commit**

```bash
git add src/components/responsive/
git commit -m "feat: add ResponsiveSelectionForm component for mobile"
```

---

## Task 3: Create SwipeableResultCards Component

**Files:**
- Create: `src/components/responsive/SwipeableResultCards.js`
- Create: `src/components/responsive/SwipeableResultCards.css`

**Step 1: Create CSS file**

Create `src/components/responsive/SwipeableResultCards.css`:

```css
/* SwipeableResultCards.css - Swipeable result cards for mobile */

.swipeable-results {
  padding: 16px;
  padding-bottom: 100px; /* Space for action buttons */
}

.swipe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.swipe-hint {
  font-size: 14px;
  color: var(--muted-color, #666);
}

.swipe-counter {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color, #333);
}

/* Cards container */
.cards-viewport {
  overflow: hidden;
  border-radius: 12px;
}

.cards-track {
  display: flex;
  transition: transform 0.3s ease-out;
}

.cards-track.swiping {
  transition: none;
}

/* Individual card */
.result-card {
  flex: 0 0 100%;
  min-width: 100%;
  background: var(--card-bg, #fff);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 16px;
  background: var(--primary-color, #0d6efd);
  color: #fff;
}

.card-rank {
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.card-model {
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-body {
  padding: 16px;
}

/* Specs grid */
.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.spec-item {
  display: flex;
  flex-direction: column;
}

.spec-label {
  font-size: 12px;
  color: var(--muted-color, #666);
  margin-bottom: 2px;
}

.spec-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color, #333);
}

.spec-value.highlight {
  color: var(--success-color, #28a745);
}

/* Margin indicator */
.margin-bar {
  margin-bottom: 16px;
}

.margin-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 4px;
}

.margin-label span:first-child {
  color: var(--muted-color, #666);
}

.margin-label span:last-child {
  font-weight: 600;
  color: var(--success-color, #28a745);
}

.margin-track {
  height: 8px;
  background: var(--border-color, #eee);
  border-radius: 4px;
  overflow: hidden;
}

.margin-fill {
  height: 100%;
  background: var(--success-color, #28a745);
  border-radius: 4px;
  transition: width 0.3s;
}

/* Card actions */
.card-actions {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color, #eee);
}

.card-action-btn {
  flex: 1;
  height: 40px;
  font-size: 14px;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 8px;
  background: var(--card-bg, #fff);
  color: var(--text-color, #333);
  cursor: pointer;
}

.card-action-btn:active {
  background: var(--hover-bg, #f5f5f5);
}

.card-action-btn.primary {
  background: var(--primary-color, #0d6efd);
  border-color: var(--primary-color, #0d6efd);
  color: #fff;
}

/* Detail sections - collapsible */
.detail-sections {
  margin-top: 16px;
}

.detail-section {
  border: 1px solid var(--border-color, #eee);
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  background: var(--hover-bg, #f9f9f9);
}

.detail-header:active {
  background: var(--border-color, #eee);
}

.detail-title {
  font-size: 14px;
  font-weight: 500;
}

.detail-icon {
  font-size: 12px;
  color: var(--muted-color, #999);
  transition: transform 0.3s;
}

.detail-icon.open {
  transform: rotate(180deg);
}

.detail-content {
  padding: 12px;
  font-size: 14px;
  line-height: 1.6;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.detail-row-label {
  color: var(--muted-color, #666);
}

.detail-row-value {
  font-weight: 500;
}

/* Pagination dots */
.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 16px 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-color, #ddd);
  cursor: pointer;
  transition: all 0.2s;
}

.dot.active {
  width: 24px;
  border-radius: 4px;
  background: var(--primary-color, #0d6efd);
}

/* Bottom action bar */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0));
  background: var(--card-bg, #fff);
  border-top: 1px solid var(--border-color, #eee);
  display: flex;
  gap: 12px;
  z-index: 100;
}

.bottom-action-btn {
  flex: 1;
  height: 48px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.bottom-action-btn.secondary {
  background: var(--hover-bg, #f5f5f5);
  color: var(--text-color, #333);
}

.bottom-action-btn.primary {
  background: var(--primary-color, #0d6efd);
  color: #fff;
}

/* Back button */
.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--primary-color, #0d6efd);
  background: none;
  border: none;
  cursor: pointer;
}

/* Dark theme */
[data-theme="dark"] .result-card {
  background: var(--card-bg-dark, #1e1e1e);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .detail-section {
  border-color: var(--border-color-dark, #333);
}

[data-theme="dark"] .detail-header {
  background: var(--hover-bg-dark, #2d2d2d);
}

[data-theme="dark"] .bottom-actions {
  background: var(--card-bg-dark, #1e1e1e);
  border-color: var(--border-color-dark, #333);
}

[data-theme="dark"] .bottom-action-btn.secondary {
  background: var(--hover-bg-dark, #2d2d2d);
  color: var(--text-color-dark, #eee);
}
```

**Step 2: Create component file**

Create `src/components/responsive/SwipeableResultCards.js`:

```jsx
// src/components/responsive/SwipeableResultCards.js
import React, { useState, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Collapse } from 'react-bootstrap';
import './SwipeableResultCards.css';

/**
 * Swipeable result cards for mobile view
 */
const SwipeableResultCards = ({
  result,
  selectedIndex,
  onSelectGearbox,
  onGenerateQuotation,
  onGenerateAgreement,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex || 0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});

  const recommendations = result?.recommendations || [];
  const totalCount = recommendations.length;
  const couplingResult = result?.flexibleCoupling;
  const pumpResult = result?.standbyPump;

  const goToIndex = useCallback((index) => {
    const newIndex = Math.max(0, Math.min(index, totalCount - 1));
    setCurrentIndex(newIndex);
    if (onSelectGearbox) {
      onSelectGearbox(newIndex);
    }
  }, [totalCount, onSelectGearbox]);

  const handlers = useSwipeable({
    onSwiping: (e) => {
      setIsSwiping(true);
      setSwipeOffset(e.deltaX);
    },
    onSwipedLeft: () => {
      setIsSwiping(false);
      setSwipeOffset(0);
      if (currentIndex < totalCount - 1) {
        goToIndex(currentIndex + 1);
      }
    },
    onSwipedRight: () => {
      setIsSwiping(false);
      setSwipeOffset(0);
      if (currentIndex > 0) {
        goToIndex(currentIndex - 1);
      }
    },
    onSwiped: () => {
      setIsSwiping(false);
      setSwipeOffset(0);
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50,
    preventScrollOnSwipe: true,
  });

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const translateX = -currentIndex * 100 + (swipeOffset / window.innerWidth) * 100;

  if (!recommendations.length) {
    return (
      <div className="swipeable-results">
        <button className="back-btn" onClick={onBack}>
          ← 返回修改参数
        </button>
        <div className="result-card">
          <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
            <p>未找到匹配的齿轮箱</p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              请调���参数后重新选型
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentGearbox = recommendations[currentIndex];
  const margin = currentGearbox?.margin || currentGearbox?.marginPercent || 0;

  return (
    <div className="swipeable-results">
      {/* Back button */}
      <button className="back-btn" onClick={onBack}>
        ← 返回修改参数
      </button>

      {/* Header */}
      <div className="swipe-header">
        <span className="swipe-hint">← 滑动切换 →</span>
        <span className="swipe-counter">{currentIndex + 1}/{totalCount}</span>
      </div>

      {/* Cards */}
      <div className="cards-viewport" {...handlers}>
        <div
          className={`cards-track ${isSwiping ? 'swiping' : ''}`}
          style={{ transform: `translateX(${translateX}%)` }}
        >
          {recommendations.map((gearbox, index) => (
            <div key={gearbox.model || index} className="result-card">
              {/* Card Header */}
              <div className="card-header">
                <div className="card-rank">
                  {index === 0 ? '🏆 最佳推荐' : `#${index + 1} 推荐`}
                </div>
                <div className="card-model">
                  {gearbox.model}
                </div>
              </div>

              {/* Card Body */}
              <div className="card-body">
                {/* Specs Grid */}
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">功率范围</span>
                    <span className="spec-value">
                      {gearbox.minPower || gearbox.powerRange?.min || '-'} - {gearbox.maxPower || gearbox.powerRange?.max || '-'} kW
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">转速范围</span>
                    <span className="spec-value">
                      {gearbox.minSpeed || gearbox.speedRange?.min || '-'} - {gearbox.maxSpeed || gearbox.speedRange?.max || '-'} rpm
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">可选速比</span>
                    <span className="spec-value">
                      {Array.isArray(gearbox.ratios)
                        ? gearbox.ratios.slice(0, 4).join(', ') + (gearbox.ratios.length > 4 ? '...' : '')
                        : gearbox.ratio || '-'}
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">匹配速比</span>
                    <span className="spec-value highlight">
                      {gearbox.matchedRatio || gearbox.selectedRatio || '-'}
                    </span>
                  </div>
                </div>

                {/* Margin Bar */}
                <div className="margin-bar">
                  <div className="margin-label">
                    <span>传递能力余量</span>
                    <span>{typeof margin === 'number' ? margin.toFixed(1) : margin}%</span>
                  </div>
                  <div className="margin-track">
                    <div
                      className="margin-fill"
                      style={{ width: `${Math.min(margin, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Detail Sections */}
                <div className="detail-sections">
                  {/* Coupling Info */}
                  {couplingResult && couplingResult.success && (
                    <div className="detail-section">
                      <div
                        className="detail-header"
                        onClick={() => toggleSection(`coupling-${index}`)}
                      >
                        <span className="detail-title">联轴器匹配</span>
                        <span className={`detail-icon ${expandedSections[`coupling-${index}`] ? 'open' : ''}`}>
                          ▼
                        </span>
                      </div>
                      <Collapse in={expandedSections[`coupling-${index}`]}>
                        <div>
                          <div className="detail-content">
                            <div className="detail-row">
                              <span className="detail-row-label">型号</span>
                              <span className="detail-row-value">{couplingResult.model}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-row-label">额定扭矩</span>
                              <span className="detail-row-value">{couplingResult.ratedTorque} kN·m</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-row-label">扭矩余量</span>
                              <span className="detail-row-value">{couplingResult.marginPercent?.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      </Collapse>
                    </div>
                  )}

                  {/* Pump Info */}
                  {pumpResult && pumpResult.requiresPump && pumpResult.pump && (
                    <div className="detail-section">
                      <div
                        className="detail-header"
                        onClick={() => toggleSection(`pump-${index}`)}
                      >
                        <span className="detail-title">备用泵信息</span>
                        <span className={`detail-icon ${expandedSections[`pump-${index}`] ? 'open' : ''}`}>
                          ▼
                        </span>
                      </div>
                      <Collapse in={expandedSections[`pump-${index}`]}>
                        <div>
                          <div className="detail-content">
                            <div className="detail-row">
                              <span className="detail-row-label">型号</span>
                              <span className="detail-row-value">{pumpResult.pump.model}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-row-label">流量</span>
                              <span className="detail-row-value">{pumpResult.pump.flowRate} L/min</span>
                            </div>
                          </div>
                        </div>
                      </Collapse>
                    </div>
                  )}

                  {/* Technical Specs */}
                  <div className="detail-section">
                    <div
                      className="detail-header"
                      onClick={() => toggleSection(`tech-${index}`)}
                    >
                      <span className="detail-title">技术参数</span>
                      <span className={`detail-icon ${expandedSections[`tech-${index}`] ? 'open' : ''}`}>
                        ▼
                      </span>
                    </div>
                    <Collapse in={expandedSections[`tech-${index}`]}>
                      <div>
                        <div className="detail-content">
                          <div className="detail-row">
                            <span className="detail-row-label">系列</span>
                            <span className="detail-row-value">{gearbox.series || '-'}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-row-label">重量</span>
                            <span className="detail-row-value">{gearbox.weight || '-'} kg</span>
                          </div>
                          {gearbox.price && (
                            <div className="detail-row">
                              <span className="detail-row-label">参考价格</span>
                              <span className="detail-row-value">¥{gearbox.price.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Collapse>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="pagination-dots">
        {recommendations.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToIndex(index)}
          />
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="bottom-actions">
        <button
          className="bottom-action-btn secondary"
          onClick={() => onGenerateQuotation && onGenerateQuotation(currentGearbox)}
        >
          📄 生成报价
        </button>
        <button
          className="bottom-action-btn primary"
          onClick={() => onGenerateAgreement && onGenerateAgreement(currentGearbox)}
        >
          📋 技术协议
        </button>
      </div>
    </div>
  );
};

export default SwipeableResultCards;
```

**Step 3: Commit**

```bash
git add src/components/responsive/SwipeableResultCards.js src/components/responsive/SwipeableResultCards.css
git commit -m "feat: add SwipeableResultCards component for mobile"
```

---

## Task 4: Create Index Export File

**Files:**
- Create: `src/components/responsive/index.js`

**Step 1: Create index file**

Create `src/components/responsive/index.js`:

```jsx
// src/components/responsive/index.js
export { default as ResponsiveSelectionForm } from './ResponsiveSelectionForm';
export { default as SwipeableResultCards } from './SwipeableResultCards';
```

**Step 2: Commit**

```bash
git add src/components/responsive/index.js
git commit -m "feat: add responsive components index"
```

---

## Task 5: Integrate ResponsiveSelectionForm into InputForm

**Files:**
- Modify: `src/components/InputForm.js`

**Step 1: Add import and conditional rendering**

At top of `src/components/InputForm.js`, add import:

```javascript
import { useIsMobile } from '../hooks/useIsMobile';
import ResponsiveSelectionForm from './responsive/ResponsiveSelectionForm';
```

**Step 2: Add condition at start of component**

Inside `InputForm` function, after destructuring props, add:

```javascript
const { isMobile, isTablet } = useIsMobile();
const useResponsiveLayout = isMobile || isTablet;

if (useResponsiveLayout) {
  return (
    <ResponsiveSelectionForm
      engineData={engineData}
      setEngineData={setEngineData}
      requirementData={requirementData}
      setRequirementData={setRequirementData}
      projectInfo={projectInfo}
      setProjectInfo={setProjectInfo}
      gearboxType={gearboxType}
      setGearboxType={setGearboxType}
      onSelect={onSelect}
      loading={loading}
    />
  );
}
```

**Step 3: Commit**

```bash
git add src/components/InputForm.js
git commit -m "feat: integrate ResponsiveSelectionForm for mobile/tablet"
```

---

## Task 6: Integrate SwipeableResultCards into Result View

**Files:**
- Modify: `src/components/EnhancedGearboxSelectionResult.js`

**Step 1: Add imports**

At top of file, add:

```javascript
import { useIsMobile } from '../hooks/useIsMobile';
import SwipeableResultCards from './responsive/SwipeableResultCards';
```

**Step 2: Add conditional rendering**

Inside `EnhancedGearboxSelectionResult` function, after all hooks, add check:

```javascript
const { isMobile, isTablet } = useIsMobile();
const useResponsiveLayout = isMobile || isTablet;
```

Then wrap the return statement with condition. Before the existing return, add:

```javascript
if (useResponsiveLayout) {
  return (
    <SwipeableResultCards
      result={result}
      selectedIndex={selectedIndex}
      onSelectGearbox={onSelectGearbox}
      onGenerateQuotation={onGenerateQuotation}
      onGenerateAgreement={onGenerateAgreement}
      onBack={() => window.history.back()}
    />
  );
}
```

**Step 3: Commit**

```bash
git add src/components/EnhancedGearboxSelectionResult.js
git commit -m "feat: integrate SwipeableResultCards for mobile/tablet"
```

---

## Task 7: Build and Test

**Step 1: Run build**

```bash
cd /Users/lidder/gearbox-new && CI=false npm run build
```

Expected: Build succeeds without errors

**Step 2: Deploy to server**

```bash
rsync -avz --delete -e "ssh -i /Users/lidder/wxx.pem" \
  /Users/lidder/gearbox-new/build/ \
  root@47.99.181.195:/var/www/html/gearbox-app/
```

**Step 3: Test on mobile**

1. Open http://47.99.181.195/gearbox-app/ on phone
2. Verify collapsible sections work
3. Test swipe gestures on result cards
4. Verify sticky buttons work

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete mobile responsive selection UI

- Add ResponsiveSelectionForm with collapsible sections
- Add SwipeableResultCards with gesture support
- Integrate responsive components for width < 1024px
- Maintain desktop layout unchanged"
```

---

## Summary

| Task | Description | Est. Lines |
|------|-------------|------------|
| 1 | Install react-swipeable | 1 |
| 2 | Create ResponsiveSelectionForm | ~250 |
| 3 | Create SwipeableResultCards | ~350 |
| 4 | Create index export | 3 |
| 5 | Integrate into InputForm | ~15 |
| 6 | Integrate into Result view | ~15 |
| 7 | Build and test | - |

**Total new code:** ~650 lines
