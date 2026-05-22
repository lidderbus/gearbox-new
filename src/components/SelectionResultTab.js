// src/components/SelectionResultTab.js
// 选型结果Tab组件

import React, { Suspense, lazy } from 'react';
import { Row, Col, Alert, Spinner } from 'react-bootstrap';

// 必经路径 lazy chunks: 提取 import 工厂函数, 便于上层调用 prefetch
const importEnhancedResult = () => import(/* webpackChunkName: "selection-result-main" */ './EnhancedGearboxSelectionResult');
const importCouplingResult = () => import(/* webpackChunkName: "coupling-result" */ './CouplingSelectionResultComponent');
const EnhancedGearboxSelectionResult = lazy(importEnhancedResult);
const CouplingSelectionResultComponent = lazy(importCouplingResult);
const GearboxComparisonView = lazy(() => import('./GearboxComparisonView'));

// 暴露 prefetch 接口: App mount 后 idle 时调用, 浏览器后台拉取, 用户点击时立即可用
export const prefetchSelectionResultChunks = () => {
  importEnhancedResult();
  importCouplingResult();
};

// 加载指示器
const LazyLoadFallback = () => (
  <div className="d-flex justify-content-center align-items-center py-5">
    <Spinner animation="border" variant="primary" />
    <span className="ms-2">加载中...</span>
  </div>
);

/**
 * 选型结果Tab组件
 * 包含齿轮箱选型结果、联轴器选型结果和对比工具
 */
const SelectionResultTab = ({
  selectionResult,
  selectedGearboxIndex,
  requirementData,
  allGearboxes,
  onGearboxSelection,
  onCouplingSelection,
  onGenerateQuotation,
  onGenerateAgreement,
  onGenerateFullPackage,
  onSelectGearbox,
  colors,
  theme
}) => {
  if (!selectionResult) {
    return (
      <Alert variant="info" className="text-center">
        <i className="bi bi-info-circle me-2"></i>请先输入参数并执行选型
      </Alert>
    );
  }

  return (
    <Row>
      <Col>
        <Suspense fallback={<LazyLoadFallback />}>
          <EnhancedGearboxSelectionResult
            result={selectionResult}
            selectedIndex={selectedGearboxIndex}
            onSelectGearbox={onGearboxSelection}
            onGenerateQuotation={onGenerateQuotation}
            onGenerateAgreement={onGenerateAgreement}
            onGenerateFullPackage={onGenerateFullPackage}
            colors={colors}
            theme={theme}
            propulsionConfig={{
              engineConfiguration: requirementData.engineConfiguration,
              inputRotation: requirementData.inputRotation,
              outputRotation: requirementData.outputRotation,
              propellerConfig: requirementData.propellerConfig,
              // 双机旋向配置
              portEngineRotation: requirementData.portEngineRotation,
              starboardEngineRotation: requirementData.starboardEngineRotation,
              portUseReverse: requirementData.portUseReverse,
              starboardUseReverse: requirementData.starboardUseReverse
            }}
          />

          {/* 联轴器选型结果 */}
          <CouplingSelectionResultComponent
            couplingResult={selectionResult?.flexibleCoupling}
            engineTorque={selectionResult?.engineTorque}
            workCondition={requirementData.workCondition}
            temperature={requirementData.temperature}
            hasCover={requirementData.hasCover}
            onReset={onSelectGearbox}
            onSelectCoupling={onCouplingSelection}
            colors={colors}
            theme={theme}
          />
        </Suspense>

        {/* 齿轮箱对比工具 */}
        <Suspense fallback={<LazyLoadFallback />}>
          <GearboxComparisonView
            recommendations={(() => {
              const main = selectionResult?.recommendations || [];
              // 把容量缺口 ≤15% 且 减速比差 ≤10% 的 nearMatches 取 top 5 拼到表底, 标 _isNearMatch
              const nearMatchOverflow = (selectionResult?.nearMatches || [])
                .filter(nm => {
                  const capOk = nm.capacityMargin == null || nm.capacityMargin >= -15;
                  const ratioOk = nm.ratioDiffPercent == null || nm.ratioDiffPercent <= 10;
                  return capOk && ratioOk;
                })
                .slice(0, 5)
                .map(nm => ({ ...nm, _isNearMatch: true, score: nm.score ?? 50 }));
              return [...main, ...nearMatchOverflow];
            })()}
            selectedIndex={selectedGearboxIndex}
            onSelect={onGearboxSelection}
            theme={theme}
            colors={colors}
            gearboxDatabase={allGearboxes}
          />
        </Suspense>
      </Col>
    </Row>
  );
};

export default SelectionResultTab;
