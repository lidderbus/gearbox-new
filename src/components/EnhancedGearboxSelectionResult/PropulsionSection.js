// src/components/EnhancedGearboxSelectionResult/PropulsionSection.js
// 推进系统配置展示组件
import React, { lazy, Suspense } from 'react';
import { Row, Col, Table, Badge, Alert } from 'react-bootstrap';

// 懒加载旋向图组件
const TwinEngineArrangementDiagram = lazy(() => import('../TwinEngineArrangementDiagram'));

/**
 * 推进系统配置展示组件
 * 显示单机/双机配置、旋向和示意图
 */
const PropulsionSection = ({
  propulsionConfig,
  selectedGearbox,
  colors = {}
}) => {
  if (!propulsionConfig) {
    return (
      <Alert variant="info">
        <i className="bi bi-info-circle me-2"></i>
        未配置推进系统参数，请在选型参数中设置单机/双机配置和旋向。
      </Alert>
    );
  }

  const {
    engineConfiguration = 'single',
    inputRotation = 'clockwise',
    outputRotation = 'clockwise',
    propellerConfig = 'outward',
    // 双机旋向配置
    portEngineRotation = null,
    starboardEngineRotation = null,
    portUseReverse = false,
    starboardUseReverse = false
  } = propulsionConfig;

  const isDualEngine = engineConfiguration === 'dual';
  const gearboxSeries = selectedGearbox?.model?.match(/^[A-Z]+/)?.[0] || 'HC';
  const is2Stage = gearboxSeries.toUpperCase().startsWith('GWC');
  const stageText = is2Stage ? '2级传动(同向)' : '1级传动(反向)';

  // 旋向文本
  const rotationText = (rotation) => rotation === 'clockwise' ? '顺时针 (CW)' : '逆时针 (CCW)';
  const configText = propellerConfig === 'outward' ? '外翻' : '内翻';

  return (
    <div className="propulsion-section">
      <Row>
        <Col md={isDualEngine ? 6 : 12}>
          <h6 style={{ color: colors?.headerText }}>推进系统配置</h6>
          <Table bordered size="sm" style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
            <tbody>
              <tr>
                <td width="40%">发动机配置</td>
                <td>
                  <Badge bg={isDualEngine ? 'primary' : 'secondary'}>
                    {isDualEngine ? '双机推进' : '单机推进'}
                  </Badge>
                </td>
              </tr>
              <tr>
                <td>输入端旋向</td>
                <td>
                  <Badge bg={inputRotation === 'clockwise' ? 'success' : 'info'}>
                    {rotationText(inputRotation)}
                  </Badge>
                  <small className="d-block text-muted mt-1">站在船尾向发动机方向看</small>
                </td>
              </tr>
              <tr>
                <td>输出端旋向</td>
                <td>
                  <Badge bg={outputRotation === 'clockwise' ? 'success' : 'info'}>
                    {rotationText(outputRotation)}
                  </Badge>
                  <small className="d-block text-muted mt-1">站在船尾向发动机方向看</small>
                </td>
              </tr>
              <tr>
                <td>齿轮箱传动</td>
                <td>
                  <Badge bg="secondary">{stageText}</Badge>
                  <small className="d-block text-muted mt-1">{gearboxSeries}系列</small>
                </td>
              </tr>
              {isDualEngine && (
                <tr>
                  <td>螺旋桨配置</td>
                  <td>
                    <Badge bg={propellerConfig === 'outward' ? 'warning' : 'info'}>
                      {configText}
                    </Badge>
                    <small className="d-block text-muted mt-1">
                      {propellerConfig === 'outward' ? '水流向外推开' : '水流向内聚拢'}
                    </small>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* 旋向匹配验证 */}
          {(() => {
            const expectedOutput = is2Stage ? inputRotation : (inputRotation === 'clockwise' ? 'counterclockwise' : 'clockwise');
            const isMatch = outputRotation === expectedOutput;
            return (
              <Alert variant={isMatch ? 'success' : 'warning'} className="mt-2">
                <i className={`bi bi-${isMatch ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
                {isMatch ? (
                  <span>旋向配置正确：{gearboxSeries}系列{stageText}，输入{rotationText(inputRotation)}对应输出{rotationText(outputRotation)}</span>
                ) : (
                  <span>旋向配置警告：根据{stageText}，输入{rotationText(inputRotation)}应输出{rotationText(expectedOutput)}，当前设置为{rotationText(outputRotation)}</span>
                )}
              </Alert>
            );
          })()}
        </Col>

        {/* 双机时显示旋向示意图 */}
        {isDualEngine && (
          <Col md={6}>
            <h6 style={{ color: colors?.headerText }}>双机旋向示意图</h6>
            <div style={{ border: `1px solid ${colors?.border || '#ddd'}`, borderRadius: '8px', padding: '10px', backgroundColor: colors?.card || '#fff' }}>
              <Suspense fallback={<div className="text-center py-4">加载旋向图...</div>}>
                <TwinEngineArrangementDiagram
                  gearboxType={gearboxSeries}
                  propellerConfig={propellerConfig}
                  portEngineRotation={portEngineRotation}
                  starboardEngineRotation={starboardEngineRotation}
                  portUseReverse={portUseReverse}
                  starboardUseReverse={starboardUseReverse}
                  width={350}
                  height={300}
                />
              </Suspense>
            </div>
          </Col>
        )}
      </Row>

      {/* 单机时显示简化旋向图 - 使用上下直线箭头 */}
      {!isDualEngine && (
        <Row className="mt-3">
          <Col md={10} className="mx-auto">
            <h6 style={{ color: colors?.headerText }} className="text-center">单机旋向示意图</h6>
            <div style={{ border: `1px solid ${colors?.border || '#ddd'}`, borderRadius: '8px', padding: '15px', backgroundColor: colors?.card || '#fff' }}>
              <svg width="100%" height="220" viewBox="0 0 550 220">
                {/* 背景 */}
                <rect width="550" height="220" fill={colors?.card || '#fff'} />

                {/* 发动机 */}
                <rect x="50" y="60" width="100" height="55" fill="#4A90D9" stroke="#2E5A8C" strokeWidth="2" rx="5" />
                <text x="100" y="92" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">发动机</text>

                {/* 齿轮箱 */}
                <rect x="200" y="55" width="110" height="65" fill="#7ED321" stroke="#5FB318" strokeWidth="2" rx="5" />
                <text x="255" y="85" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{selectedGearbox?.model || 'HC'}</text>
                <text x="255" y="102" textAnchor="middle" fill="white" fontSize="10">{stageText}</text>

                {/* 螺旋桨 */}
                <rect x="360" y="60" width="100" height="55" fill="#F5A623" stroke="#D68B0F" strokeWidth="2" rx="5" />
                <text x="410" y="92" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">螺旋桨</text>

                {/* 连接线 */}
                <line x1="150" y1="88" x2="200" y2="88" stroke="#333" strokeWidth="4" />
                <polygon points="195,82 205,88 195,94" fill="#333" />
                <line x1="310" y1="88" x2="360" y2="88" stroke="#333" strokeWidth="4" />
                <polygon points="355,82 365,88 355,94" fill="#333" />

                {/* 输入旋向箭头 - 上下直线箭头 */}
                <g transform="translate(100, 155)">
                  {inputRotation === 'clockwise' ? (
                    <>
                      <line x1="0" y1="30" x2="0" y2="-10" stroke="#CC0000" strokeWidth="8" strokeLinecap="round" />
                      <polygon points="0,-25 -15,0 15,0" fill="#CC0000" stroke="#880000" strokeWidth="1" />
                    </>
                  ) : (
                    <>
                      <line x1="0" y1="-15" x2="0" y2="25" stroke="#CC0000" strokeWidth="8" strokeLinecap="round" />
                      <polygon points="0,40 -15,15 15,15" fill="#CC0000" stroke="#880000" strokeWidth="1" />
                    </>
                  )}
                  <text x="0" y="58" textAnchor="middle" fill="#333" fontSize="11" fontWeight="bold">
                    输入: {inputRotation === 'clockwise' ? 'CW ↑' : 'CCW ↓'}
                  </text>
                </g>

                {/* 输出旋向箭头 - 上下直线箭头 */}
                <g transform="translate(410, 155)">
                  {outputRotation === 'clockwise' ? (
                    <>
                      <line x1="0" y1="30" x2="0" y2="-10" stroke="#CC0000" strokeWidth="8" strokeLinecap="round" />
                      <polygon points="0,-25 -15,0 15,0" fill="#CC0000" stroke="#880000" strokeWidth="1" />
                    </>
                  ) : (
                    <>
                      <line x1="0" y1="-15" x2="0" y2="25" stroke="#CC0000" strokeWidth="8" strokeLinecap="round" />
                      <polygon points="0,40 -15,15 15,15" fill="#CC0000" stroke="#880000" strokeWidth="1" />
                    </>
                  )}
                  <text x="0" y="58" textAnchor="middle" fill="#333" fontSize="11" fontWeight="bold">
                    输出: {outputRotation === 'clockwise' ? 'CW ↑' : 'CCW ↓'}
                  </text>
                </g>

                {/* 图例 */}
                <g transform="translate(480, 150)">
                  <text x="0" y="0" fill="#666" fontSize="9">↑=CW</text>
                  <text x="0" y="14" fill="#666" fontSize="9">↓=CCW</text>
                </g>
              </svg>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default PropulsionSection;
