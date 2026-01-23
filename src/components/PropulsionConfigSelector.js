// src/components/PropulsionConfigSelector.js
// 推进配置选择器 - 单机/双机、输入输出旋向选择
// 版本: v1.0 (2025-12-14)

import React, { useCallback, useMemo } from 'react';
import { Card, Form, ButtonGroup, Button, Row, Col, Alert } from 'react-bootstrap';
import TwinEngineDiagramEnhanced from './TwinEngineDiagramEnhanced';
import SingleEngineDiagramEnhanced from './SingleEngineDiagramEnhanced';

/**
 * 推进配置选择器主组件
 */
const PropulsionConfigSelector = ({
  config = {},
  onChange,
  gearboxType = 'HC',
  theme = 'light',
  colors = {}
}) => {
  // 默认配置
  const currentConfig = useMemo(() => ({
    engineConfiguration: config.engineConfiguration || 'single',
    inputRotation: config.inputRotation || 'clockwise',
    outputRotation: config.outputRotation || 'clockwise',
    propellerConfig: config.propellerConfig || 'outward',
    // 双机模式：左右主机分别设置旋向
    portEngineRotation: config.portEngineRotation || null,      // null表示自动，'clockwise'/'counterclockwise'表示手动指定
    starboardEngineRotation: config.starboardEngineRotation || null,
    // 齿轮箱使用倒车档选项
    portUseReverse: config.portUseReverse || false,
    starboardUseReverse: config.starboardUseReverse || false
  }), [config]);

  // 更新配置
  const handleConfigChange = useCallback((key, value) => {
    if (onChange) {
      onChange({ [key]: value });
    }
  }, [onChange]);

  // 根据齿轮箱类型自动计算输出旋向
  // GWC系列: 2级传动，同向
  // HC/DT/HCQ/HCM等: 1级传动，反向
  const calculateExpectedOutput = useCallback((inputCW, gearboxType) => {
    const is2Stage = gearboxType?.toUpperCase()?.startsWith('GWC');
    // 2级传动同向，1级传动反向
    return is2Stage ? inputCW : !inputCW;
  }, []);

  // 计算双机模式的旋向配置
  const twinEngineRotations = useMemo(() => {
    const is2Stage = gearboxType?.toUpperCase()?.startsWith('GWC') || gearboxType?.toUpperCase()?.startsWith('2GWH');
    const isOutward = currentConfig.propellerConfig === 'outward';

    // 外翻: 左舷CCW, 右舷CW | 内翻: 左舷CW, 右舷CCW
    const portOutputCW = isOutward ? false : true;
    const starboardOutputCW = isOutward ? true : false;

    // 根据传动级数和输出旋向计算输入旋向
    // 2级同向, 1级反向
    let portInputCW, starboardInputCW;

    if (currentConfig.portEngineRotation) {
      portInputCW = currentConfig.portEngineRotation === 'clockwise';
    } else {
      // 自动计算: 考虑倒档
      const effectiveOutputCW = currentConfig.portUseReverse ? !portOutputCW : portOutputCW;
      portInputCW = is2Stage ? effectiveOutputCW : !effectiveOutputCW;
    }

    if (currentConfig.starboardEngineRotation) {
      starboardInputCW = currentConfig.starboardEngineRotation === 'clockwise';
    } else {
      const effectiveOutputCW = currentConfig.starboardUseReverse ? !starboardOutputCW : starboardOutputCW;
      starboardInputCW = is2Stage ? effectiveOutputCW : !effectiveOutputCW;
    }

    return {
      portInputRotation: portInputCW ? 'CW' : 'CCW',
      portOutputRotation: portOutputCW ? 'CW' : 'CCW',
      starboardInputRotation: starboardInputCW ? 'CW' : 'CCW',
      starboardOutputRotation: starboardOutputCW ? 'CW' : 'CCW'
    };
  }, [gearboxType, currentConfig.propellerConfig, currentConfig.portEngineRotation, currentConfig.starboardEngineRotation, currentConfig.portUseReverse, currentConfig.starboardUseReverse]);

  // 检查旋向是否符合传动逻辑（仅单机模式）
  const rotationWarning = useMemo(() => {
    // 双机模式不显示这个警告，因为有更复杂的配置选项
    if (currentConfig.engineConfiguration === 'dual') {
      return null;
    }

    const inputCW = currentConfig.inputRotation === 'clockwise';
    const outputCW = currentConfig.outputRotation === 'clockwise';
    const expectedOutputCW = calculateExpectedOutput(inputCW, gearboxType);

    if (outputCW !== expectedOutputCW) {
      const is2Stage = gearboxType?.toUpperCase()?.startsWith('GWC');
      return `旋向配置警告: 根据${is2Stage ? '2' : '1'}级传动(${is2Stage ? '同向' : '反向'})，` +
             `输入${inputCW ? '顺时针 (CW)' : '逆时针 (CCW)'}应输出${expectedOutputCW ? '顺时针 (CW)' : '逆时针 (CCW)'}，` +
             `当前设置为${outputCW ? '顺时针 (CW)' : '逆时针 (CCW)'}`;
    }
    return null;
  }, [currentConfig.inputRotation, currentConfig.outputRotation, currentConfig.engineConfiguration, gearboxType, calculateExpectedOutput]);

  // 样式
  const cardStyle = {
    backgroundColor: colors.cardBg || '#fff',
    borderColor: colors.border || '#dee2e6'
  };

  const headerStyle = {
    backgroundColor: colors.headerBg || '#f8f9fa',
    color: colors.headerText || '#212529',
    borderBottom: `1px solid ${colors.border || '#dee2e6'}`
  };

  const activeButtonStyle = {
    backgroundColor: colors.primary || '#0d6efd',
    borderColor: colors.primary || '#0d6efd',
    color: '#fff'
  };

  const inactiveButtonStyle = {
    backgroundColor: 'transparent',
    borderColor: colors.border || '#dee2e6',
    color: colors.text || '#212529'
  };

  return (
    <Card style={cardStyle} className="mb-3">
      <Card.Header style={headerStyle}>
        <i className="bi bi-gear-wide-connected me-2"></i>
        推进配置
      </Card.Header>
      <Card.Body>
        {/* 单机/双机选择 */}
        <Form.Group className="mb-4">
          <Form.Label style={{ color: colors.text, fontWeight: 'bold' }}>
            发动机配置
          </Form.Label>
          <div>
            <ButtonGroup className="w-100">
              <Button
                style={currentConfig.engineConfiguration === 'single' ? activeButtonStyle : inactiveButtonStyle}
                onClick={() => handleConfigChange('engineConfiguration', 'single')}
                className="py-2"
              >
                <i className="bi bi-1-circle me-2"></i>
                单机推进
              </Button>
              <Button
                style={currentConfig.engineConfiguration === 'dual' ? activeButtonStyle : inactiveButtonStyle}
                onClick={() => handleConfigChange('engineConfiguration', 'dual')}
                className="py-2"
              >
                <i className="bi bi-2-circle me-2"></i>
                双机推进
              </Button>
            </ButtonGroup>
          </div>
        </Form.Group>

        <Row>
          {/* 输入端旋向 */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: colors.text }}>
                <strong>输入端旋向</strong>
                <small className="d-block text-muted">（面向飞轮）</small>
              </Form.Label>
              <ButtonGroup className="w-100">
                <Button
                  size="sm"
                  style={currentConfig.inputRotation === 'clockwise' ? activeButtonStyle : inactiveButtonStyle}
                  onClick={() => handleConfigChange('inputRotation', 'clockwise')}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  顺时针 (CW)
                </Button>
                <Button
                  size="sm"
                  style={currentConfig.inputRotation === 'counterclockwise' ? activeButtonStyle : inactiveButtonStyle}
                  onClick={() => handleConfigChange('inputRotation', 'counterclockwise')}
                >
                  <i className="bi bi-arrow-counterclockwise me-1"></i>
                  逆时针 (CCW)
                </Button>
              </ButtonGroup>
            </Form.Group>
          </Col>

          {/* 输出端旋向 */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: colors.text }}>
                <strong>输出端旋向</strong>
                <small className="d-block text-muted">（与输入相反）</small>
              </Form.Label>
              <ButtonGroup className="w-100">
                <Button
                  size="sm"
                  style={currentConfig.outputRotation === 'clockwise' ? activeButtonStyle : inactiveButtonStyle}
                  onClick={() => handleConfigChange('outputRotation', 'clockwise')}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  顺时针 (CW)
                </Button>
                <Button
                  size="sm"
                  style={currentConfig.outputRotation === 'counterclockwise' ? activeButtonStyle : inactiveButtonStyle}
                  onClick={() => handleConfigChange('outputRotation', 'counterclockwise')}
                >
                  <i className="bi bi-arrow-counterclockwise me-1"></i>
                  逆时针 (CCW)
                </Button>
              </ButtonGroup>
            </Form.Group>
          </Col>
        </Row>

        {/* 旋向警告提示 */}
        {rotationWarning && (
          <Alert variant="warning" className="mb-3 py-2">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <small>{rotationWarning}</small>
          </Alert>
        )}

        {/* 双机螺旋桨配置 */}
        {currentConfig.engineConfiguration === 'dual' && (
          <>
            <Form.Group className="mb-4">
              <Form.Label style={{ color: colors.text, fontWeight: 'bold' }}>
                螺旋桨翻向配置
                <small className="d-block text-muted">（从船尾向船首看）</small>
              </Form.Label>
              <ButtonGroup className="w-100">
                <Button
                  style={currentConfig.propellerConfig === 'outward' ? activeButtonStyle : inactiveButtonStyle}
                  onClick={() => handleConfigChange('propellerConfig', 'outward')}
                  className="py-2"
                >
                  <span style={{ fontSize: '1.5em' }}>↙ ↗</span>
                  <span className="ms-2">外翻 (Outward)</span>
                </Button>
                <Button
                  style={currentConfig.propellerConfig === 'inward' ? activeButtonStyle : inactiveButtonStyle}
                  onClick={() => handleConfigChange('propellerConfig', 'inward')}
                  className="py-2"
                >
                  <span style={{ fontSize: '1.5em' }}>↗ ↙</span>
                  <span className="ms-2">内翻 (Inward)</span>
                </Button>
              </ButtonGroup>
              <Form.Text className="text-muted">
                外翻: 左舷逆时针、右舷顺时针 | 内翻: 左舷顺时针、右舷逆时针
              </Form.Text>
            </Form.Group>

            {/* 左右主机旋向设置 */}
            <Form.Group className="mb-4">
              <Form.Label style={{ color: colors.text, fontWeight: 'bold' }}>
                左右主机（柴油机）旋向
                <small className="d-block text-muted">（面向飞轮）</small>
              </Form.Label>
              <Row>
                <Col md={6}>
                  <Form.Label style={{ color: colors.text, fontSize: '0.9em' }}>
                    <i className="bi bi-arrow-left-circle me-1"></i>左舷主机
                  </Form.Label>
                  <ButtonGroup className="w-100" size="sm">
                    <Button
                      style={currentConfig.portEngineRotation === null ? activeButtonStyle : inactiveButtonStyle}
                      onClick={() => handleConfigChange('portEngineRotation', null)}
                    >
                      自动
                    </Button>
                    <Button
                      style={currentConfig.portEngineRotation === 'clockwise' ? activeButtonStyle : inactiveButtonStyle}
                      onClick={() => handleConfigChange('portEngineRotation', 'clockwise')}
                    >
                      顺时针(CW)
                    </Button>
                    <Button
                      style={currentConfig.portEngineRotation === 'counterclockwise' ? activeButtonStyle : inactiveButtonStyle}
                      onClick={() => handleConfigChange('portEngineRotation', 'counterclockwise')}
                    >
                      逆时针(CCW)
                    </Button>
                  </ButtonGroup>
                </Col>
                <Col md={6}>
                  <Form.Label style={{ color: colors.text, fontSize: '0.9em' }}>
                    <i className="bi bi-arrow-right-circle me-1"></i>右舷主机
                  </Form.Label>
                  <ButtonGroup className="w-100" size="sm">
                    <Button
                      style={currentConfig.starboardEngineRotation === null ? activeButtonStyle : inactiveButtonStyle}
                      onClick={() => handleConfigChange('starboardEngineRotation', null)}
                    >
                      自动
                    </Button>
                    <Button
                      style={currentConfig.starboardEngineRotation === 'clockwise' ? activeButtonStyle : inactiveButtonStyle}
                      onClick={() => handleConfigChange('starboardEngineRotation', 'clockwise')}
                    >
                      顺时针(CW)
                    </Button>
                    <Button
                      style={currentConfig.starboardEngineRotation === 'counterclockwise' ? activeButtonStyle : inactiveButtonStyle}
                      onClick={() => handleConfigChange('starboardEngineRotation', 'counterclockwise')}
                    >
                      逆时针(CCW)
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
              <Form.Text className="text-muted">
                "自动"根据螺旋桨配置和齿轮箱传动级数自动计算。可分别指定左右主机旋向。
              </Form.Text>
            </Form.Group>

            {/* 齿轮箱倒车档选项 */}
            <Form.Group className="mb-4">
              <Form.Label style={{ color: colors.text, fontWeight: 'bold' }}>
                齿轮箱倒档做顺车
                <small className="d-block text-muted">（通过倒档实现旋向转换）</small>
              </Form.Label>
              <Row>
                <Col md={6}>
                  <Form.Check
                    type="switch"
                    id="port-reverse-switch"
                    label="左舷齿轮箱使用倒档"
                    checked={currentConfig.portUseReverse}
                    onChange={(e) => handleConfigChange('portUseReverse', e.target.checked)}
                    style={{ color: colors.text }}
                  />
                </Col>
                <Col md={6}>
                  <Form.Check
                    type="switch"
                    id="starboard-reverse-switch"
                    label="右舷齿轮箱使用倒档"
                    checked={currentConfig.starboardUseReverse}
                    onChange={(e) => handleConfigChange('starboardUseReverse', e.target.checked)}
                    style={{ color: colors.text }}
                  />
                </Col>
              </Row>
              <Form.Text className="text-muted">
                当两台主机旋向相同时，可通过一侧齿轮箱使用倒档来实现外旋或内旋配置。
              </Form.Text>
            </Form.Group>
          </>
        )}

        {/* 旋向示意图 */}
        <div className="rotation-diagram-container text-center mt-3" style={{ overflow: 'auto' }}>
          {currentConfig.engineConfiguration === 'single' ? (
            <SingleEngineDiagramEnhanced
              inputRotation={currentConfig.inputRotation}
              outputRotation={currentConfig.outputRotation}
              gearboxType={gearboxType}
              width={680}
              height={380}
            />
          ) : (
            <TwinEngineDiagramEnhanced
              portInputRotation={twinEngineRotations.portInputRotation}
              portOutputRotation={twinEngineRotations.portOutputRotation}
              starboardInputRotation={twinEngineRotations.starboardInputRotation}
              starboardOutputRotation={twinEngineRotations.starboardOutputRotation}
              gearboxType={gearboxType || 'HC'}
              width={780}
              height={520}
              portReverse={currentConfig.portUseReverse}
              starboardReverse={currentConfig.starboardUseReverse}
              arrangementType={currentConfig.propellerConfig}
            />
          )}
        </div>

        {/* 配置说明 */}
        <Alert variant="info" className="mt-3 mb-0">
          <i className="bi bi-info-circle me-2"></i>
          <small>
            <strong>传动说明：</strong>
            GWC系列为2级传动（输入输出同向），HC/HCT/DT/HCM/HCQ等系列为1级传动（输入输出反向）。
            双机配置时，外翻配置更有利于操纵性。
            <br />
            <strong>旋向标识：</strong>
            <span style={{ color: '#00f5d4', fontWeight: 'bold' }}>青色圆形箭头</span>=顺时针(CW)，
            <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>红色圆形箭头</span>=逆时针(CCW)
            {currentConfig.engineConfiguration === 'dual' && (
              <>
                <br />
                <strong>倒档做顺车：</strong>当两台主机旋向相同（如都是右旋机CW），可让一侧齿轮箱使用倒档来实现所需的外旋/内旋配置。
              </>
            )}
          </small>
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default PropulsionConfigSelector;
