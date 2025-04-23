// components/QuotationView.js
import React from 'react';
import { Card, Button, Table, Row, Col, Badge } from 'react-bootstrap';

/**
 * Component for displaying the generated quotation
 * @param {Object} props - Component props
 * @param {Object} props.quotation - The quotation data
 * @param {Function} props.onExport - Function(format) to export the quotation
 * @param {Function} props.onGenerateAgreement - Function to generate a technical agreement
 * @param {Object} props.colors - Theme colors object
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @returns {JSX.Element} Quotation view component
 */
const QuotationView = ({
  quotation,
  onExport,
  onGenerateAgreement,
  colors = {},
  theme = 'light'
}) => {
  if (!quotation || !quotation.success) {
    return (
      <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          报价单
        </Card.Header>
        <Card.Body>
          <p style={{ color: colors.text }}>未生成报价单或报价单生成失败</p>
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
          <h5 className="mb-0">船用齿轮箱报价单</h5>
          <div>
            <Button 
              variant="outline-primary" 
              className="me-2" 
              onClick={() => onExport && onExport('excel')}
              style={{
                borderColor: colors.primary,
                color: colors.primary
              }}
            >
              <i className="bi bi-file-earmark-excel me-2"></i> 导出Excel
            </Button>
            <Button 
              variant="outline-danger" 
              onClick={() => onExport && onExport('pdf')}
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
          <Row>
            <Col md={6}>
              <h6 className="border-bottom pb-2 mb-3" style={{ borderColor: colors.border }}>报价基本信息</h6>
              <Table bordered size="sm" style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
                <tbody>
                  <tr>
                    <td width="30%" className="fw-bold">报价单号</td>
                    <td>{quotation.quotationNumber}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">报价日期</td>
                    <td>{quotation.date}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">有效期至</td>
                    <td>{quotation.expiryDate}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">客户名称</td>
                    <td>{quotation.customerInfo.name}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">联系人</td>
                    <td>{quotation.customerInfo.contactPerson || '未提供'}</td>
                  </tr>
                  {quotation.customerInfo.phone && (
                    <tr>
                      <td className="fw-bold">联系电话</td>
                      <td>{quotation.customerInfo.phone}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <h6 className="border-bottom pb-2 mb-3" style={{ borderColor: colors.border }}>供方信息</h6>
              <Table bordered size="sm" style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
                <tbody>
                  <tr>
                    <td width="30%" className="fw-bold">公司名称</td>
                    <td>{quotation.sellerInfo.name}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">公司地址</td>
                    <td>{quotation.sellerInfo.address}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">联系电话</td>
                    <td>{quotation.sellerInfo.phone}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">开户银行</td>
                    <td>{quotation.sellerInfo.bank}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">银行账号</td>
                    <td>{quotation.sellerInfo.account}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          <h6 className="border-bottom pb-2 mt-4 mb-3" style={{ borderColor: colors.border }}>报价明细</h6>
          <Table bordered responsive style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
            <thead>
              <tr style={{ backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748' }}>
                <th style={{ width: '60px', textAlign: 'center' }}>序号</th>
                <th>产品名称</th>
                <th>型号</th>
                <th style={{ width: '80px', textAlign: 'center' }}>数量</th>
                <th style={{ width: '80px', textAlign: 'center' }}>单位</th>
                <th style={{ width: '140px', textAlign: 'right' }}>单价 (元)</th>
                <th style={{ width: '140px', textAlign: 'right' }}>金额 (元)</th>
                <th style={{ width: '120px' }}>备注</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items && quotation.items.map((item, index) => (
                <tr key={`item-${index}`}>
                  <td style={{ textAlign: 'center' }}>{item.id || index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.model}</td>
                  <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'center' }}>{item.unit}</td>
                  <td style={{ textAlign: 'right' }}>
                    {typeof item.unitPrice === 'string' ? 
                      item.unitPrice : 
                      formatPrice(item.unitPrice)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {typeof item.amount === 'string' ? 
                      item.amount : 
                      formatPrice(item.amount)}
                  </td>
                  <td>{item.remarks || ''}</td>
                </tr>
              ))}
              
              {/* Total row */}
              <tr style={{ 
                backgroundColor: theme === 'light' ? '#f0f7f0' : '#1a365d',
                fontWeight: 'bold'
              }}>
                <td colSpan="6" style={{ textAlign: 'right' }}>总计：</td>
                <td style={{ textAlign: 'right' }}>{formatPrice(quotation.totalAmount)}</td>
                <td></td>
              </tr>
            </tbody>
          </Table>

          <Row className="mt-4">
            <Col md={6}>
              <h6 className="border-bottom pb-2 mb-3" style={{ borderColor: colors.border }}>供货说明</h6>
              <Table bordered size="sm" style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
                <tbody>
                  <tr>
                    <td width="30%" className="fw-bold">支付条件</td>
                    <td>{quotation.paymentTerms}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">交货期</td>
                    <td>{quotation.deliveryTime}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">质保期</td>
                    <td>产品安装调试完成后12个月内</td>
                  </tr>
                </tbody>
              </Table>
              <div className="notes mt-3 p-3" style={{ 
                backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748',
                borderRadius: '0.25rem',
                fontSize: '0.9rem',
                color: colors.text
              }}>
                <p className="mb-2"><strong>报价说明：</strong></p>
                <p className="mb-1">1. 本报价单有效期30天。</p>
                <p className="mb-1">2. 价格包含标准包装，不含运输保险费用。</p>
                <p className="mb-1">3. 技术协议和最终合同以双方确认为准。</p>
                <p className="mb-0">4. 最终解释权归供方所有。</p>
              </div>
            </Col>
            <Col md={6}>
              <h6 className="border-bottom pb-2 mb-3" style={{ borderColor: colors.border }}>技术参数摘要</h6>
              <Table bordered size="sm" style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
                <tbody>
                  {quotation.items && quotation.items[0] && (
                    <>
                      <tr>
                        <td width="30%" className="fw-bold">产品型号</td>
                        <td>{quotation.items[0].model}</td>
                      </tr>
                      {quotation.items[0].ratio && (
                        <tr>
                          <td className="fw-bold">减速比</td>
                          <td>{quotation.items[0].ratio}</td>
                        </tr>
                      )}
                      {typeof quotation.items[0].transferCapacity !== 'undefined' && (
                        <tr>
                          <td className="fw-bold">传递能力</td>
                          <td>
                            {typeof quotation.items[0].transferCapacity === 'number' ? 
                              `${quotation.items[0].transferCapacity.toFixed(4)} kW/r·min` : 
                              quotation.items[0].transferCapacity}
                          </td>
                        </tr>
                      )}
                      {typeof quotation.items[0].thrust !== 'undefined' && (
                        <tr>
                          <td className="fw-bold">推力</td>
                          <td>{quotation.items[0].thrust} kN</td>
                        </tr>
                      )}
                    </>
                  )}
                  <tr>
                    <td className="fw-bold">供货范围</td>
                    <td>
                      {quotation.items && quotation.items.map((item, index) => (
                        <Badge 
                          key={`badge-${index}`}
                          bg={theme === 'light' ? 'primary' : 'info'} 
                          className="me-2 mb-1"
                          style={{
                            backgroundColor: theme === 'light' ? colors.primary : colors.primary,
                            fontWeight: 'normal'
                          }}
                        >
                          {item.name}
                        </Badge>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">参数详情</td>
                    <td>详见技术协议</td>
                  </tr>
                </tbody>
              </Table>

              <div className="d-grid gap-2 mt-4">
                <Button 
                  variant="success" 
                  onClick={onGenerateAgreement}
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: theme === 'light' ? '#28a745' : '#38a169',
                    borderColor: theme === 'light' ? '#28a745' : '#38a169',
                  }}
                >
                  <i className="bi bi-file-earmark-text me-2"></i> 
                  <span>生成技术协议</span>
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer style={{ 
          backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748',
          borderTop: `1px solid ${colors.border}`,
          textAlign: 'right',
          color: colors.muted,
          fontSize: '0.9rem',
          padding: '0.75rem 1.25rem'
        }}>
          {quotation.date} 生成 | 报价单号: {quotation.quotationNumber}
        </Card.Footer>
      </Card>
    </div>
  );
};

export default QuotationView;