// components/ContractView.js
import React from 'react';
import { Card, Button, Table, Row, Col } from 'react-bootstrap';

/**
 * Component for displaying the sales contract
 * @param {Object} props - Component props
 * @param {Object} props.contract - The contract data
 * @param {Function} props.onExportWord - Function to export contract to Word
 * @param {Function} props.onExportPDF - Function to export contract to PDF
 * @param {Object} props.colors - Theme colors object
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @returns {JSX.Element} Contract view component
 */
const ContractView = ({
  contract,
  onExportWord,
  onExportPDF,
  colors = {},
  theme = 'light'
}) => {
  if (!contract || !contract.success) {
    return (
      <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          销售合同
        </Card.Header>
        <Card.Body>
          <p style={{ color: colors.text }}>未生成销售合同或合同生成失败</p>
        </Card.Body>
      </Card>
    );
  }

  // Format price with thousand separators
  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return '0.00';
    return price.toLocaleString('zh-CN', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div>
      <Card className="mb-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          <h5 className="mb-0">船用齿轮箱销售合同</h5>
          <div>
            <Button 
              variant="outline-primary" 
              className="me-2" 
              onClick={onExportWord}
              style={{
                borderColor: colors.primary,
                color: colors.primary
              }}
            >
              <i className="bi bi-file-earmark-word me-2"></i> 导出Word
            </Button>
            <Button 
              variant="outline-danger" 
              onClick={onExportPDF}
              style={{
                borderColor: theme === 'light' ? '#dc3545' : '#e53e3e',
                color: theme === 'light' ? '#dc3545' : '#e53e3e'
              }}
            >
              <i className="bi bi-file-earmark-pdf me-2"></i> 导出PDF
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="contract-preview-content">
            <div className="text-center mb-4">
              <h3 style={{ color: colors.text }}>上海前进齿轮经营有限公司产品销售合同</h3>
            </div>

            <Row className="mb-3">
              <Col>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.text }}>
                  <span>签订地点：上海</span>
                  <span>合同编号：{contract.contractNumber}</span>
                </div>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.text }}>
                  <span>签订日期：{contract.contractDate}</span>
                  <span>统计编号：</span>
                </div>
              </Col>
            </Row>

            <h5 className="border-bottom pb-2 mb-4" style={{ borderColor: colors.border, color: colors.text }}>交易双方</h5>
            <Table bordered style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
              <thead>
                <tr style={{ backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748' }}>
                  <th style={{ width: '5%', textAlign: 'center' }}>序号</th>
                  <th colSpan="3" style={{ width: '45%', textAlign: 'center' }}>需方</th>
                  <th colSpan="3" style={{ width: '45%', textAlign: 'center' }}>供方</th>
                  <th style={{ width: '5%' }}>鉴证意见</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: '10%' }}>单位名称</td>
                  <td colSpan="2">{contract.buyerInfo?.name || ""}</td>
                  <td style={{ width: '10%' }}>单位名称</td>
                  <td colSpan="2">{contract.sellerInfo?.name || ""}</td>
                  <td rowSpan="7"></td>
                </tr>
                <tr>
                  <td>法定代表人</td>
                  <td>{contract.buyerInfo?.legalRepresentative || ""}</td>
                  <td>委托代理人</td>
                  <td>法定代表人</td>
                  <td>{contract.sellerInfo?.legalRepresentative || ""}</td>
                  <td>{contract.sellerInfo?.agent || ""}</td>
                </tr>
                <tr>
                  <td>通讯地址</td>
                  <td colSpan="2">{contract.buyerInfo?.address || ""}</td>
                  <td>通讯地址</td>
                  <td colSpan="2">{contract.sellerInfo?.address || ""}</td>
                </tr>
                <tr>
                  <td>邮政编码</td>
                  <td>{contract.buyerInfo?.postalCode || ""}</td>
                  <td>电话/传真</td>
                  <td>邮政编码</td>
                  <td>{contract.sellerInfo?.postalCode || ""}</td>
                  <td>电话/传真</td>
                </tr>
                <tr>
                  <td>税号</td>
                  <td colSpan="2">{contract.buyerInfo?.taxNumber || ""}</td>
                  <td>税号</td>
                  <td colSpan="2">{contract.sellerInfo?.taxNumber || ""}</td>
                </tr>
                <tr>
                  <td colSpan="3">
                    <div>银行及账号</div>
                    <div>{contract.buyerInfo?.bank || ""}</div>
                    <div>{contract.buyerInfo?.accountNumber || ""}</div>
                  </td>
                  <td colSpan="3">
                    <div>银行及账号</div>
                    <div>{contract.sellerInfo?.bank || ""}</div>
                    <div>{contract.sellerInfo?.accountNumber || ""}</div>
                  </td>
                </tr>
              </tbody>
            </Table>

            <h5 className="border-bottom pb-2 mt-4 mb-4" style={{ borderColor: colors.border, color: colors.text }}>产品信息</h5>
            <Table bordered style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
              <thead>
                <tr style={{ backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748' }}>
                  <th style={{ width: '5%', textAlign: 'center' }}>序号</th>
                  <th style={{ width: '12%', textAlign: 'center' }}>产品名称</th>
                  <th style={{ width: '12%', textAlign: 'center' }}>规格型号</th>
                  <th style={{ width: '8%', textAlign: 'center' }}>商标</th>
                  <th style={{ width: '8%', textAlign: 'center' }}>计量单位</th>
                  <th style={{ width: '5%', textAlign: 'center' }}>数量</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>单价（元）</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>金额</th>
                  <th colSpan="4" style={{ width: '24%', textAlign: 'center' }}>
                    交货期（{contract.products?.[0]?.deliveryYear || new Date().getFullYear()}年度）
                  </th>
                  <th style={{ width: '6%', textAlign: 'center' }}>备注</th>
                </tr>
                <tr style={{ backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748' }}>
                  <th colSpan="8"></th>
                  <th style={{ textAlign: 'center' }}>一季度</th>
                  <th style={{ textAlign: 'center' }}>二季度</th>
                  <th style={{ textAlign: 'center' }}>三季度</th>
                  <th style={{ textAlign: 'center' }}>四季度</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {/* Gearbox Row */}
                {contract.products && contract.products.map((product, index) => (
                  <tr key={`product-${index}`}>
                    <td style={{ textAlign: 'center' }}>2</td>
                    <td>{product.name}</td>
                    <td>{product.model}</td>
                    <td>{product.brand}</td>
                    <td style={{ textAlign: 'center' }}>{product.unit}</td>
                    <td style={{ textAlign: 'center' }}>{product.quantity}</td>
                    <td style={{ textAlign: 'right' }}>{formatPrice(product.unitPrice)}</td>
                    <td style={{ textAlign: 'right' }}>{formatPrice(product.amount)}</td>
                    <td style={{ textAlign: 'center' }}>{product.deliveryQuarter === 1 ? '√' : ''}</td>
                    <td style={{ textAlign: 'center' }}>{product.deliveryQuarter === 2 ? '√' : ''}</td>
                    <td style={{ textAlign: 'center' }}>{product.deliveryQuarter === 3 ? '√' : ''}</td>
                    <td style={{ textAlign: 'center' }}>{product.deliveryQuarter === 4 ? '√' : ''}</td>
                    <td></td>
                  </tr>
                ))}

                {/* Coupling Row (if exists) */}
                {contract.coupling && (
                  <tr>
                    <td style={{ textAlign: 'center' }}></td>
                    <td>{contract.coupling.name}</td>
                    <td>{contract.coupling.model}</td>
                    <td>{contract.coupling.brand}</td>
                    <td style={{ textAlign: 'center' }}>{contract.coupling.unit}</td>
                    <td style={{ textAlign: 'center' }}>{contract.coupling.quantity}</td>
                    <td style={{ textAlign: 'right' }}>{formatPrice(contract.coupling.unitPrice)}</td>
                    <td style={{ textAlign: 'right' }}>{formatPrice(contract.coupling.amount)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                )}

                {/* Total Row */}
                <tr>
                  <td colSpan="2" style={{ fontWeight: 'bold' }}>合计人民币（大写）：</td>
                  <td colSpan="5">{contract.totalAmountInChinese}</td>
                  <td colSpan="6">{`¥（小写）：${formatPrice(contract.totalAmount)}`}</td>
                </tr>
              </tbody>
            </Table>

            <h5 className="border-bottom pb-2 mt-4 mb-4" style={{ borderColor: colors.border, color: colors.text }}>合同条款</h5>
            <Table bordered style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
              <tbody>
                <tr>
                  <td style={{ width: '5%', textAlign: 'center' }}>3</td>
                  <td style={{ width: '45%' }}>{`执行质量标准：${contract.executionStandard}`}</td>
                  <td style={{ width: '5%', textAlign: 'center' }}>11</td>
                  <td style={{ width: '45%' }}>违约责任：按《中华人民共和国民法典》相关规定执行。</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>4</td>
                  <td>{`需方验收及提出质量异议期限：${contract.inspectionPeriod}`}</td>
                  <td style={{ textAlign: 'center' }} rowSpan="2">12</td>
                  <td rowSpan="2">{contract.disputeResolution}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>5</td>
                  <td>{`交货时间：${contract.deliveryDate}`}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>6</td>
                  <td>{`交货地点：${contract.deliveryLocation}`}</td>
                  <td style={{ textAlign: 'center' }} rowSpan="3">13</td>
                  <td rowSpan="3">{`其他约定事项或特殊订货要求：${contract.specialRequirements}`}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>7</td>
                  <td>{`交货方式：${contract.deliveryMethod}`}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>8</td>
                  <td>{`运输方式及费用承担：${contract.transportMethod}，${contract.transportFeeArrangement}`}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>9</td>
                  <td>{`包装标准及费用承担：${contract.packagingStandard}，${contract.packagingFeeArrangement}`}</td>
                  <td style={{ textAlign: 'center' }}>14</td>
                  <td>{`合同有效期限：${contract.expiryDate}`}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>10</td>
                  <td>{`结算方式及期限：${contract.paymentMethod}`}</td>
                  <td style={{ textAlign: 'center' }}>15</td>
                  <td>{contract.contractCopies}</td>
                </tr>
              </tbody>
            </Table>

            <div className="signature-area mt-5">
              <Row>
                <Col md={6}>
                  <div style={{ color: colors.text }}>
                    <p><strong>需方（盖章）：</strong></p>
                    <div style={{ marginTop: '80px' }}>
                      <p>法定代表人或委托代理人（签字）：_______________</p>
                      <p className="mt-3">日期：_______________</p>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div style={{ color: colors.text }}>
                    <p><strong>供方（盖章）：</strong></p>
                    <div style={{ marginTop: '80px' }}>
                      <p>法定代表人或委托代理人（签字）：_______________</p>
                      <p className="mt-3">日期：_______________</p>
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
          padding: '0.75rem 1.25rem',
          color: colors.muted,
          fontSize: '0.9rem'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <span>合同编号: {contract.contractNumber}</span>
            <span>签订日期: {contract.contractDate}</span>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ContractView;