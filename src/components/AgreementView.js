// components/AgreementView.js
import React from 'react';
import { Card, Button, Table, Row, Col } from 'react-bootstrap';

/**
 * Component for displaying the technical agreement
 * @param {Object} props - Component props
 * @param {Object} props.agreement - The agreement data
 * @param {Function} props.onExport - Function to export the agreement
 * @param {Function} props.onGenerateContract - Function to generate a contract
 * @param {Object} props.colors - Theme colors object
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @returns {JSX.Element} Agreement view component
 */
const AgreementView = ({
  agreement,
  onExport,
  onGenerateContract,
  colors = {},
  theme = 'light'
}) => {
  if (!agreement || !agreement.success) {
    return (
      <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          技术协议
        </Card.Header>
        <Card.Body>
          <p style={{ color: colors.text }}>未生成技术协议或技术协议生成失败</p>
        </Card.Body>
      </Card>
    );
  }

  const { content } = agreement;
  const generalInfo = content.generalInfo || {};
  const engineData = content.engineData || {};
  const gearboxData = content.gearboxData || {};
  const couplingData = content.couplingData;
  const standbyPumpData = content.standbyPumpData;
  
  return (
    <div>
      <Card className="mb-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          <h5 className="mb-0">船用齿轮箱技术协议</h5>
          <div>
            <Button 
              variant="outline-primary" 
              className="me-2" 
              onClick={() => onExport('word')}
              style={{
                borderColor: colors.primary,
                color: colors.primary
              }}
            >
              <i className="bi bi-file-earmark-word me-2"></i> 导出Word
            </Button>
            <Button 
              variant="outline-danger" 
              className="me-2"
              onClick={() => onExport('pdf')}
              style={{
                borderColor: theme === 'light' ? '#dc3545' : '#e53e3e',
                color: theme === 'light' ? '#dc3545' : '#e53e3e'
              }}
            >
              <i className="bi bi-file-earmark-pdf me-2"></i> 导出PDF
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={() => onExport('copy')}
              style={{
                borderColor: theme === 'light' ? '#6c757d' : '#718096',
                color: theme === 'light' ? '#6c757d' : '#718096'
              }}
            >
              <i className="bi bi-clipboard me-2"></i> 复制内容
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="agreement-preview-content">
            <div className="text-center mb-4">
              <h3 style={{ color: colors.text }}>{content.title || '船用齿轮箱技术协议'}</h3>
              <p style={{ color: colors.muted }}>{agreement.agreementDate}</p>
            </div>

            <h5 className="border-bottom pb-2 mb-3" style={{ borderColor: colors.border, color: colors.text }}>基本信息</h5>
            <Row>
              <Col md={6}>
                <Table bordered size="sm" style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
                  <tbody>
                    <tr>
                      <td width="30%" className="fw-bold">买方</td>
                      <td>{generalInfo.buyer}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">项目名称</td>
                      <td>{generalInfo.projectName}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">签署日期</td>
                      <td>{agreement.agreementDate}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col md={6}>
                <Table bordered size="sm" style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
                  <tbody>
                    <tr>
                      <td width="30%" className="fw-bold">卖方</td>
                      <td>{generalInfo.seller}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">适用范围</td>
                      <td>船用齿轮箱及配套设备</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">协议编号</td>
                      <td>TA{agreement.agreementDate?.replace(/[-\/]/g, '')?.substring(0, 8) || '未生成'}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>

            <h5 className="border-bottom pb-2 mt-4 mb-3" style={{ borderColor: colors.border, color: colors.text }}>一、主机参数</h5>
            <Table bordered style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
              <tbody>
                <tr>
                  <td width="25%" className="fw-bold">1. 型号</td>
                  <td width="25%">{engineData.model || '-'}</td>
                  <td width="25%" className="fw-bold">2. 额定功率</td>
                  <td width="25%">{engineData.power ? `${engineData.power} kW` : '-'}</td>
                </tr>
                <tr>
                  <td className="fw-bold">3. 额定转速</td>
                  <td>{engineData.speed ? `${engineData.speed} r/min` : '-'}</td>
                  <td className="fw-bold">4. 转向</td>
                  <td>{engineData.direction || '-'}</td>
                </tr>
              </tbody>
            </Table>

            {/* 高弹性联轴器部分 - 条件渲染 */}
            {couplingData && (
              <>
                <h5 className="border-bottom pb-2 mt-4 mb-3" style={{ borderColor: colors.border, color: colors.text }}>二、橡胶高弹联轴器</h5>
                <Table bordered style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
                  <tbody>
                    <tr>
                      <td width="25%" className="fw-bold">1. 型号</td>
                      <td colSpan="3">{couplingData.model}</td>
                    </tr>
                    {couplingData.torque && (
                      <tr>
                        <td className="fw-bold">2. 额定扭矩</td>
                        <td colSpan="3">{couplingData.torque}</td>
                      </tr>
                    )}
                    {couplingData.weight && (
                      <tr>
                        <td className="fw-bold">3. 重量</td>
                        <td colSpan="3">{couplingData.weight}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="fw-bold">4. 配齐联接件</td>
                      <td colSpan="3">配齐高弹与齿轮箱、柴油机连接的全部连接件</td>
                    </tr>
                  </tbody>
                </Table>
              </>
            )}

            {/* 齿轮箱参数部分 */}
            <h5 className="border-bottom pb-2 mt-4 mb-3" style={{ borderColor: colors.border, color: colors.text }}>
              {couplingData ? '三、齿轮箱技术参数' : '二、齿轮箱技术参数'}
            </h5>
            <Table bordered style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
              <tbody>
                <tr>
                  <td width="25%" className="fw-bold">1. 型号</td>
                  <td width="25%">{gearboxData.model}</td>
                  <td width="25%" className="fw-bold">2. 减速比</td>
                  <td width="25%">{gearboxData.ratio ? `${gearboxData.ratio}：1` : '-'}</td>
                </tr>
                <tr>
                  <td className="fw-bold">3. 传递能力</td>
                  <td>{gearboxData.transferCapacity ? `${gearboxData.transferCapacity} kW/r/min` : '-'}</td>
                  <td className="fw-bold">4. 额定推力</td>
                  <td>{gearboxData.thrust}</td>
                </tr>
                <tr>
                  <td className="fw-bold">5. 中心距</td>
                  <td>{gearboxData.centerDistance ? `${gearboxData.centerDistance} mm` : '-'}</td>
                  <td className="fw-bold">6. 重量</td>
                  <td>{gearboxData.weight}</td>
                </tr>
                <tr>
                  <td className="fw-bold">7. 输入转速范围</td>
                  <td>{gearboxData.inputSpeedRange}</td>
                  <td className="fw-bold">8. 润滑油牌号</td>
                  <td>{gearboxData.oilType}</td>
                </tr>
                <tr>
                  <td className="fw-bold">9. 润滑油压力</td>
                  <td>{gearboxData.lubricationOilPressure}</td>
                  <td className="fw-bold">10. 润滑油温度</td>
                  <td>{gearboxData.lubricationOilTemperature}</td>
                </tr>
              </tbody>
            </Table>

            {/* 备用泵部分 - 条件渲染 */}
            {standbyPumpData && (
              <>
                <h5 className="border-bottom pb-2 mt-4 mb-3" style={{ borderColor: colors.border, color: colors.text }}>
                  {couplingData ? '四、备用泵' : '三、备用泵'}
                </h5>
                <Table bordered style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
                  <tbody>
                    {standbyPumpData.model && (
                      <tr>
                        <td width="25%" className="fw-bold">型号</td>
                        <td colSpan="3">{standbyPumpData.model}</td>
                      </tr>
                    )}
                    {standbyPumpData.flow && (
                      <tr>
                        <td className="fw-bold">流量</td>
                        <td colSpan="3">{standbyPumpData.flow}</td>
                      </tr>
                    )}
                    {standbyPumpData.pressure && (
                      <tr>
                        <td className="fw-bold">压力</td>
                        <td colSpan="3">{standbyPumpData.pressure}</td>
                      </tr>
                    )}
                    {standbyPumpData.power && (
                      <tr>
                        <td className="fw-bold">电机功率</td>
                        <td colSpan="3">{standbyPumpData.power}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </>
            )}

            {/* 随机供应配件 */}
            <h5 className="border-bottom pb-2 mt-4 mb-3" style={{ borderColor: colors.border, color: colors.text }}>
              {getNextSectionNumber(couplingData, standbyPumpData)}、随机供应配件
            </h5>
            <ul style={{ color: colors.text }}>
              {content.accessories && content.accessories.length > 0 ? (
                content.accessories.map((item, index) => (
                  <li key={`acc-${index}`}>{item}</li>
                ))
              ) : (
                <li>无</li>
              )}
            </ul>

            {/* 监控仪表 */}
            <h5 className="border-bottom pb-2 mt-4 mb-3" style={{ borderColor: colors.border, color: colors.text }}>
              {getNextSectionNumber(couplingData, standbyPumpData, 1)}、监控仪表
            </h5>
            <ul style={{ color: colors.text }}>
              {content.monitoringInstruments && content.monitoringInstruments.length > 0 ? (
                content.monitoringInstruments.map((item, index) => (
                  <li key={`mon-${index}`}>{item.name}，传感器量程 {item.range}</li>
                ))
              ) : (
                <li>无</li>
              )}
            </ul>

            {/* 随机技术文件 */}
            <h5 className="border-bottom pb-2 mt-4 mb-3" style={{ borderColor: colors.border, color: colors.text }}>
              {getNextSectionNumber(couplingData, standbyPumpData, 2)}、随机技术文件
            </h5>
            <ul style={{ color: colors.text }}>
              {content.technicalDocuments && content.technicalDocuments.length > 0 ? (
                content.technicalDocuments.map((item, index) => (
                  <li key={`doc-${index}`}>{item}</li>
                ))
              ) : (
                <li>无</li>
              )}
            </ul>

            {/* 质量保证及服务 */}
            <h5 className="border-bottom pb-2 mt-4 mb-3" style={{ borderColor: colors.border, color: colors.text }}>
              {getNextSectionNumber(couplingData, standbyPumpData, 3)}、质量保证及服务
            </h5>
            <ol style={{ color: colors.text }}>
              <li style={{ marginBottom: '0.5rem' }}>
                {content.qualityAssurance?.testStandard || "产品出厂前按国家标准测试"}
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                {content.qualityAssurance?.warranty || "产品自安装调试完成后18个月内质保"}
              </li>
              <li>未尽事宜友好协商解决。</li>
            </ol>

            {/* 签名区域 */}
            <div className="signature-area mt-5 pt-3" style={{ borderTop: `1px solid ${colors.border}` }}>
              <Row>
                <Col md={4}>
                  <div style={{ color: colors.text }}>
                    <p><strong>船东（甲方）：</strong></p>
                    <div style={{ marginTop: '80px' }}>
                      <p>签字：_________________</p>
                      <p>日期：_________________</p>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div style={{ color: colors.text }}>
                    <p><strong>船厂/需方（甲方）：</strong></p>
                    <div style={{ marginTop: '80px' }}>
                      <p>签字：_________________</p>
                      <p>日期：_________________</p>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div style={{ color: colors.text }}>
                    <p><strong>制造厂（乙方）：</strong></p>
                    <div style={{ marginTop: '80px' }}>
                      <p>签字：_________________</p>
                      <p>日期：_________________</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Card.Body>
        <Card.Footer style={{ 
          backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748',
          borderTop: `1px solid ${colors.border}`,
          textAlign: 'right',
          color: colors.muted,
          fontSize: '0.9rem',
          padding: '0.75rem 1.25rem'
        }}>
          <div className="d-flex justify-content-between">
            <span>文档编号: TA{agreement.agreementDate?.replace(/[-\/]/g, '')?.substring(0, 8) || '未生成'}</span>
            <Button 
              variant="success" 
              onClick={onGenerateContract}
              size="sm"
              style={{
                backgroundColor: theme === 'light' ? '#28a745' : '#38a169',
                borderColor: theme === 'light' ? '#28a745' : '#38a169',
              }}
            >
              <i className="bi bi-file-earmark-text me-2"></i> 
              <span>生成销售合同</span>
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

// Helper function to get next section number based on presence of coupling and pump
const getNextSectionNumber = (couplingData, standbyPumpData, offset = 0) => {
  const sectionTitles = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  let baseIndex = 1; // Start with section 二 (index 1) for gearbox only
  
  if (couplingData) baseIndex++; // If coupling exists, add a section
  if (standbyPumpData) baseIndex++; // If pump exists, add another section
  
  return sectionTitles[baseIndex + offset];
};

export default AgreementView;