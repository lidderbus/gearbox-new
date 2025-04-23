// components/ContractView.js
import React, { useState } from 'react';
import { Card, Button, Table, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { CircularProgress } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

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
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // 处理PDF导出，添加加载状态
  const handleExportPDF = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      // 确保合同数据有效
      if (!contract || !contract.success) {
        throw new Error('合同数据无效，无法导出PDF');
      }

      console.log('开始导出PDF...');
      
      // 调用导出函数
      const result = await onExportPDF();
      
      if (!result) {
        throw new Error('PDF导出失败，请检查控制台错误');
      }
      
      // 显示成功消息
      setSuccess(true);
      console.log('PDF导出完成');
    } catch (error) {
      console.error('导出PDF失败:', error);
      setError(`导出PDF失败: ${error.message || '未知错误，请检查控制台'}`);
    } finally {
      setLoading(false);
      // 5秒后自动清除消息
      setTimeout(() => {
        setError(null);
        setSuccess(false);
      }, 5000);
    }
  };

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
        <Card.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: colors.headerBg, color: colors.headerText, padding: '15px 20px' }}>
          <h5 className="mb-0" style={{ fontSize: '18px', fontWeight: 'bold' }}>船用齿轮箱销售合同</h5>
          <div>
            <Button 
              variant="outline-primary" 
              className="me-2" 
              onClick={onExportWord}
              disabled={isExporting || loading}
              style={{
                borderColor: colors.primary,
                color: colors.primary
              }}
            >
              <i className="bi bi-file-earmark-word me-2"></i> 导出Word
            </Button>
            <Button
              variant={theme === 'light' ? 'danger' : 'outline-danger'}
              className="me-2"
              onClick={handleExportPDF}
              disabled={loading}
              style={{ 
                position: 'relative',
                paddingLeft: loading ? '2.5rem' : '1rem'
              }}
            >
              {loading && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  style={{ 
                    position: 'absolute',
                    left: '0.75rem'
                  }}
                />
              )}
              <i className="bi bi-file-earmark-pdf me-2"></i> 导出PDF
            </Button>
          </div>
        </Card.Header>
        
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible style={{margin: '0'}}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" onClose={() => setSuccess(false)} dismissible style={{margin: '0'}}>
            PDF导出成功！
          </Alert>
        )}
        
        <Card.Body style={{ padding: '0' }}>
          <div className="contract-preview-content" style={{
            margin: '0 auto',
            padding: '40px',
            backgroundColor: 'white',
            fontSize: '14px',
            lineHeight: '1.5',
            boxSizing: 'border-box',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
          }}>
            <div className="text-center mb-4">
              <h3 style={{ color: colors.text, fontSize: '22px', marginBottom: '20px', fontWeight: 'bold', color: '#003366' }}>上海前进齿轮经营有限公司产品销售合同</h3>
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

            <h5 className="border-bottom pb-2 mb-4" style={{ borderColor: colors.border, color: '#003366', fontWeight: 'bold' }}>交易双方</h5>
            <Table bordered style={{ 
              backgroundColor: colors.card, 
              color: colors.text, 
              borderColor: colors.border,
              fontSize: '14px',
              marginBottom: '25px',
              pageBreakInside: 'avoid', // PDF中防止表格内部分页
              breakInside: 'avoid' // 现代浏览器支持的属性
            }}>
              <thead>
                <tr style={{ backgroundColor: theme === 'light' ? '#f0f5ff' : '#2d3748' }}>
                  <th style={{ width: '5%', textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>序号</th>
                  <th colSpan="3" style={{ width: '45%', textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>需方</th>
                  <th colSpan="3" style={{ width: '45%', textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>供方</th>
                  <th style={{ width: '5%', padding: '8px', verticalAlign: 'middle' }}>鉴证意见</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: '10%', padding: '8px', verticalAlign: 'middle' }}>单位名称</td>
                  <td colSpan="2" style={{ padding: '8px', verticalAlign: 'middle' }}>{contract.buyerInfo?.name || ""}</td>
                  <td style={{ width: '10%', padding: '8px', verticalAlign: 'middle' }}>单位名称</td>
                  <td colSpan="2" style={{ padding: '8px', verticalAlign: 'middle' }}>{contract.sellerInfo?.name || ""}</td>
                  <td rowSpan="7" style={{ padding: '8px', verticalAlign: 'middle' }}></td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>法定代表人</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>{contract.buyerInfo?.legalRepresentative || ""}</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>委托代理人</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>法定代表人</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>{contract.sellerInfo?.legalRepresentative || ""}</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>{contract.sellerInfo?.agent || ""}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>通讯地址</td>
                  <td colSpan="2" style={{ padding: '8px', verticalAlign: 'middle' }}>{contract.buyerInfo?.address || ""}</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>通讯地址</td>
                  <td colSpan="2" style={{ padding: '8px', verticalAlign: 'middle' }}>{contract.sellerInfo?.address || ""}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>邮政编码</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>{contract.buyerInfo?.postalCode || ""}</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>电话/传真</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>邮政编码</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>{contract.sellerInfo?.postalCode || ""}</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>电话/传真</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>税号</td>
                  <td colSpan="2" style={{ padding: '8px', verticalAlign: 'middle' }}>{contract.buyerInfo?.taxNumber || ""}</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>税号</td>
                  <td colSpan="2" style={{ padding: '8px', verticalAlign: 'middle' }}>{contract.sellerInfo?.taxNumber || ""}</td>
                </tr>
                <tr>
                  <td colSpan="3" style={{ padding: '8px', verticalAlign: 'middle' }}>
                    <div>银行及账号</div>
                    <div>{contract.buyerInfo?.bank || ""}</div>
                    <div>{contract.buyerInfo?.accountNumber || ""}</div>
                  </td>
                  <td colSpan="3" style={{ padding: '8px', verticalAlign: 'middle' }}>
                    <div>银行及账号</div>
                    <div>{contract.sellerInfo?.bank || ""}</div>
                    <div>{contract.sellerInfo?.accountNumber || ""}</div>
                  </td>
                </tr>
              </tbody>
            </Table>

            <h5 className="border-bottom pb-2 mt-4 mb-4" style={{ borderColor: colors.border, color: '#003366', fontWeight: 'bold' }}>产品信息</h5>
            <Table bordered style={{ 
              backgroundColor: colors.card, 
              color: colors.text, 
              borderColor: colors.border,
              fontSize: '14px',
              marginBottom: '25px',
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <thead>
                <tr style={{ backgroundColor: theme === 'light' ? '#f0f5ff' : '#2d3748' }}>
                  <th style={{ width: '5%', textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>序号</th>
                  <th style={{ width: '15%', textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>产品名称</th>
                  <th style={{ width: '15%', textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>规格型号</th>
                  <th style={{ width: '8%', textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>商标</th>
                  <th style={{ width: '8%', textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>计量单位</th>
                  <th style={{ width: '8%', textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>数量</th>
                  <th style={{ width: '12%', textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>单价（元）</th>
                  <th style={{ width: '12%', textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>金额</th>
                  <th colSpan="4" style={{ width: '17%', textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>
                    交货期（{contract.products?.[0]?.deliveryYear || new Date().getFullYear()}年度）
                  </th>
                </tr>
                <tr style={{ backgroundColor: theme === 'light' ? '#f0f5ff' : '#2d3748' }}>
                  <th colSpan="8"></th>
                  <th style={{ textAlign: 'center', padding: '8px', width: '4.25%', verticalAlign: 'middle' }}>一季度</th>
                  <th style={{ textAlign: 'center', padding: '8px', width: '4.25%', verticalAlign: 'middle' }}>二季度</th>
                  <th style={{ textAlign: 'center', padding: '8px', width: '4.25%', verticalAlign: 'middle' }}>三季度</th>
                  <th style={{ textAlign: 'center', padding: '8px', width: '4.25%', verticalAlign: 'middle' }}>四季度</th>
                </tr>
              </thead>
              <tbody>
                {contract.products && contract.products.map((product, index) => (
                  <tr key={`product-${index}`}>
                    <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>{index + 1}</td>
                    <td style={{ padding: '8px', verticalAlign: 'middle' }}>{product.name}</td>
                    <td style={{ padding: '8px', verticalAlign: 'middle' }}>{product.model}</td>
                    <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>{product.brand}</td>
                    <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>{product.unit}</td>
                    <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>{product.quantity}</td>
                    <td style={{ textAlign: 'right', padding: '8px', verticalAlign: 'middle' }}>{formatPrice(product.unitPrice)}</td>
                    <td style={{ textAlign: 'right', padding: '8px', verticalAlign: 'middle' }}>{formatPrice(product.amount)}</td>
                    <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>{product.deliveryQuarter === 1 ? '√' : ''}</td>
                    <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>{product.deliveryQuarter === 2 ? '√' : ''}</td>
                    <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>{product.deliveryQuarter === 3 ? '√' : ''}</td>
                    <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle' }}>{product.deliveryQuarter === 4 ? '√' : ''}</td>
                  </tr>
                ))}

                {/* 合计行 */}
                <tr>
                  <td colSpan="2" style={{ fontWeight: 'bold', padding: '8px', verticalAlign: 'middle' }}>合计人民币（大写）：</td>
                  <td colSpan="5" style={{ padding: '8px', verticalAlign: 'middle' }}>{contract.totalAmountInChinese}</td>
                  <td colSpan="5" style={{ padding: '8px', verticalAlign: 'middle' }}>{`¥（小写）：${formatPrice(contract.totalAmount)}`}</td>
                </tr>
              </tbody>
            </Table>

            <h5 className="border-bottom pb-2 mt-4 mb-4" style={{ borderColor: colors.border, color: '#003366', fontWeight: 'bold' }}>合同条款</h5>
            <Table bordered style={{ 
              backgroundColor: colors.card, 
              color: colors.text, 
              borderColor: colors.border,
              fontSize: '14px',
              marginBottom: '25px',
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <tbody>
                <tr>
                  <td style={{ width: '5%', textAlign: 'center', padding: '8px', verticalAlign: 'middle', backgroundColor: theme === 'light' ? '#f7f7f7' : '#2d3748' }}>3</td>
                  <td style={{ width: '45%', padding: '8px', verticalAlign: 'middle' }}>{`执行质量标准：${contract.executionStandard}`}</td>
                  <td style={{ width: '5%', textAlign: 'center', padding: '8px', verticalAlign: 'middle', backgroundColor: theme === 'light' ? '#f7f7f7' : '#2d3748' }}>11</td>
                  <td style={{ width: '45%', padding: '8px', verticalAlign: 'middle' }}>违约责任：按《中华人民共和国民法典》相关规定执行。</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle', backgroundColor: theme === 'light' ? '#f7f7f7' : '#2d3748' }}>4</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>{`需方验收及提出质量异议期限：${contract.inspectionPeriod}`}</td>
                  <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle', backgroundColor: theme === 'light' ? '#f7f7f7' : '#2d3748', rowSpan: '2' }}>12</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle', rowSpan: '2' }}>{contract.disputeResolution}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle', backgroundColor: theme === 'light' ? '#f7f7f7' : '#2d3748' }}>5</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>{`交货时间：${contract.deliveryDate}`}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle', backgroundColor: theme === 'light' ? '#f7f7f7' : '#2d3748' }}>6</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>{`交货地点：${contract.deliveryLocation}`}</td>
                  <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle', backgroundColor: theme === 'light' ? '#f7f7f7' : '#2d3748', rowSpan: '3' }}>13</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle', rowSpan: '3' }}>{`其他约定事项或特殊订货要求：${contract.specialRequirements}`}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle', backgroundColor: theme === 'light' ? '#f7f7f7' : '#2d3748' }}>7</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>{`交货方式：${contract.deliveryMethod}`}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle', backgroundColor: theme === 'light' ? '#f7f7f7' : '#2d3748' }}>8</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>{`运输方式及费用承担：${contract.transportMethod}，${contract.transportFeeArrangement}`}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle', backgroundColor: theme === 'light' ? '#f7f7f7' : '#2d3748' }}>9</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>{`包装标准及费用承担：${contract.packagingStandard}，${contract.packagingFeeArrangement}`}</td>
                  <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle', backgroundColor: theme === 'light' ? '#f7f7f7' : '#2d3748' }}>14</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>{`合同有效期限：${contract.expiryDate}`}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle', backgroundColor: theme === 'light' ? '#f7f7f7' : '#2d3748' }}>10</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>{`结算方式及期限：${contract.paymentMethod}`}</td>
                  <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'middle', backgroundColor: theme === 'light' ? '#f7f7f7' : '#2d3748' }}>15</td>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>{contract.contractCopies}</td>
                </tr>
              </tbody>
            </Table>

            <div className="signature-area mt-5" style={{ fontSize: '12px', pageBreakBefore: 'always', breakBefore: 'page' }}>
              <Row>
                <Col md={6}>
                  <div style={{ color: colors.text }}>
                    <p><strong>需方（盖章）：</strong></p>
                    <div style={{ marginTop: '60px' }}>
                      <p>法定代表人或委托代理人（签字）：_______________</p>
                      <p className="mt-3">日期：_______________</p>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div style={{ color: colors.text }}>
                    <p><strong>供方（盖章）：</strong></p>
                    <div style={{ marginTop: '60px' }}>
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
          padding: '12px 20px',
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