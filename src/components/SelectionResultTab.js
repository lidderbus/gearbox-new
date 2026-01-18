// src/components/SelectionResultTab.js
// 选型结果Tab组件

import React, { Suspense, lazy } from 'react';
import { Row, Col, Alert, Spinner } from 'react-bootstrap';
import EnhancedGearboxSelectionResult from './EnhancedGearboxSelectionResult';
import CouplingSelectionResultComponent from './CouplingSelectionResultComponent';

// 懒加载组件
const GearboxComparisonView = lazy(() => import('./GearboxComparisonView'));

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
        <EnhancedGearboxSelectionResult
          result={selectionResult}
          selectedIndex={selectedGearboxIndex}
          onSelectGearbox={onGearboxSelection}
          onGenerateQuotation={onGenerateQuotation}
          onGenerateAgreement={onGenerateAgreement}
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

        {/* 齿轮箱对比工具 */}
        <Suspense fallback={<LazyLoadFallback />}>
          <GearboxComparisonView
            recommendations={selectionResult?.recommendations || []}
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
