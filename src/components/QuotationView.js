// src/components/QuotationView.js - 修复版本
import React, { useState } from 'react';
import { Card, Table, Button, Alert, Row, Col, Badge, Form, Dropdown } from 'react-bootstrap';
import { printHtmlContent } from '../utils/pdfExportUtils';

/**
 * 报价单查看组件
 * 显示报价单内容，提供导出和其他操作功能
 */
const QuotationView = ({ 
  quotation, 
  onExport, 
  onGenerateAgreement, 
  onAddCustomItem,
  onRemoveItem,
  onUpdatePrices,
  onSave,
  colors, 
  theme 
}) => {
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [saveNameInput, setSaveNameInput] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 如果没有报价单数据，显示提示
  if (!quotation || !quotation.success) {
    return (
      <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors?.card || 'white', borderColor: colors?.border || '#ddd' }}>
        <Card.Header style={{ backgroundColor: colors?.headerBg || '#f5f5f5', color: colors?.headerText || '#333' }}>
          <i className="bi bi-currency-yen me-2"></i>报价单
        </Card.Header>
        <Card.Body>
          <Alert variant="info">
            <i className="bi bi-info-circle me-2"></i>
            请先完成选型并生成报价单
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  // 格式化金额
  const formatCurrency = (amount) => {
    if (typeof amount === 'string') return amount;
    if (typeof amount !== 'number') return '-';
    
    return amount.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // 保存报价单
  const handleSave = () => {
    if (showSaveForm) {
      onSave && onSave(saveNameInput || undefined);
      setShowSaveForm(false);
      setSaveNameInput('');
    } else {
      setShowSaveForm(true);
    }
  };
  
  // 打印功能 - 新增
  const handlePrint = () => {
    if (!quotation || !quotation.success) {
      setError('请先生成报价单');
      return;
    }

    const previewElement = document.querySelector('.quotation-preview-content');
    
    if (!previewElement) {
      setError('无法找到预览内容');
      return;
    }
    
    setLoading(true);
    
    try {
      printHtmlContent(previewElement, {
        title: `报价单 - ${quotation.quotationNumber || '未命名'}`,
        beforePrint: () => setSuccess('正在准备打印...'),
        afterPrint: () => {
          setLoading(false);
          setSuccess('打印准备完成');
        }
      });
    } catch (error) {
      console.error('打印失败:', error);
      setError(`打印失败: ${error.message}`);
      setLoading(false);
    }
  };

  // 渲染报价单
  return (
    <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors?.card || 'white', borderColor: colors?.border || '#ddd' }}>
      <Card.Header style={{ backgroundColor: colors?.headerBg || '#f5f5f5', color: colors?.headerText || '#333' }}>
        <div className="d-flex justify-content-between align-items-center">
          <span><i className="bi bi-currency-yen me-2"></i>报价单</span>
          <div>
            <Button 
              variant="outline-info" 
              size="sm" 
              className="me-2"
              onClick={() => setShowPriceDetails(!showPriceDetails)}
            >
              <i className={`bi bi-info-circle${showPriceDetails ? '-fill' : ''} me-1`}></i>
              {showPriceDetails ? '隐藏价格详情' : '显示价格详情'}
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              className="me-2"
              onClick={handlePrint}
            >
              <i className="bi bi-printer me-1"></i> 打印
            </Button>
            <Dropdown className="d-inline-block me-2">
              <Dropdown.Toggle variant="outline-primary" size="sm" id="dropdown-export">
                <i className="bi bi-download me-1"></i> 导出
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => onExport && onExport('excel')}>
                  <i className="bi bi-file-earmark-excel me-2"></i> 导出Excel
                </Dropdown.Item>
                <Dropdown.Item onClick={() => onExport && onExport('pdf')}>
                  <i className="bi bi-file-earmark-pdf me-2"></i> 导出PDF
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button 
              variant="outline-success" 
              size="sm"
              onClick={onGenerateAgreement}
              title="基于当前报价单生成技术协议"
            >
              <i className="bi bi-file-earmark-text me-1"></i> 生成技术协议
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        {error && (
          <Alert variant="danger" className="m-3" onClose={() => setError('')} dismissible>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="m-3" onClose={() => setSuccess('')} dismissible>
            <i className="bi bi-check-circle-fill me-2"></i>
            {success}
          </Alert>
        )}
        
        <div className="quotation-preview-content">
          {/* 报价单标题 */}
          <div className="text-center p-4" style={{ borderBottom: `1px solid ${colors?.border}` }}>
            <h3 style={{ color: colors?.headerText }}>报 价 单</h3>
            <div className="small text-muted mt-1">报价单号：{quotation.quotationNumber} | 日期：{quotation.date} | 有效期至：{quotation.expiryDate}</div>
          </div>
          
          {/* 基本信息 */}
          <Row className="mx-0 p-3" style={{ borderBottom: `1px solid ${colors?.border}` }}>
            <Col md={6}>
              <h6 style={{ color: colors?.headerText }}>客户信息</h6>
              <Table size="sm" borderless style={{ color: colors?.text }}>
                <tbody>
                  <tr>
                    <td width="30%">客户名称：</td>
                    <td>{quotation.customerInfo.name}</td>
                  </tr>
                  {quotation.customerInfo.contactPerson && (
                    <tr>
                      <td>联系人：</td>
                      <td>{quotation.customerInfo.contactPerson}</td>
                    </tr>
                  )}
                  {quotation.customerInfo.phone && (
                    <tr>
                      <td>联系电话：</td>
                      <td>{quotation.customerInfo.phone}</td>
                    </tr>
                  )}
                  {quotation.customerInfo.address && (
                    <tr>
                      <td>地址：</td>
                      <td>{quotation.customerInfo.address}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <h6 style={{ color: colors?.headerText }}>供方信息</h6>
              <Table size="sm" borderless style={{ color: colors?.text }}>
                <tbody>
                  <tr>
                    <td width="30%">公司名称：</td>
                    <td>{quotation.sellerInfo.name}</td>
                  </tr>
                  <tr>
                    <td>地址：</td>
                    <td>{quotation.sellerInfo.address}</td>
                  </tr>
                  <tr>
                    <td>电话：</td>
                    <td>{quotation.sellerInfo.phone}</td>
                  </tr>
                  <tr>
                    <td>开户行：</td>
                    <td>{quotation.sellerInfo.bank}</td>
                  </tr>
                  <tr>
                    <td>账号：</td>
                    <td>{quotation.sellerInfo.account}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          
          {/* 配件包含提示（如果有） */}
          {!quotation.usingSpecialPackagePrice && (
            (quotation.options?.includeCouplingInGearbox || 
            (quotation.options?.includePumpInGearbox && quotation.options?.needsPump)) && (
              <div className="mx-3 mt-3">
                <Alert variant="info">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  <strong>配件说明：</strong>
                  {quotation.options?.includeCouplingInGearbox && <span>联轴器价格已包含在齿轮箱价格中。</span>}
                  {quotation.options?.includeCouplingInGearbox && quotation.options?.includePumpInGearbox && quotation.options?.needsPump && <span> </span>}
                  {quotation.options?.includePumpInGearbox && quotation.options?.needsPump && <span>备用泵价格已包含在齿轮箱价格中。</span>}
                </Alert>
              </div>
            )
          )}
  
          {/* 特殊打包价格提示（如果有） */}
          {quotation.usingSpecialPackagePrice && (
            <div className="mx-3 mt-3">
              <Alert variant="info">
                <i className="bi bi-info-circle-fill me-2"></i>
                <strong>特别说明：</strong> 本报价采用GW系列市场常规打包价格。
              </Alert>
            </div>
          )}
          
          {/* 报价明细 */}
          <div className="p-3">
            <h6 style={{ color: colors?.headerText }}>报价明细</h6>
            <div className="table-responsive">
              <Table bordered hover style={{ color: colors?.text, borderColor: colors?.border }}>
                <thead style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
                  <tr>
                    <th className="text-center">序号</th>
                    <th>名称</th>
                    <th>型号</th>
                    <th className="text-center">数量</th>
                    <th className="text-center">单位</th>
                    <th className="text-end">单价(元)</th>
                    <th className="text-end">金额(元)</th>
                    <th>备注</th>
                    <th className="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.items.map((item, index) => (
                    <tr key={index} className={quotation.usingSpecialPackagePrice && item.name === "船用齿轮箱" ? "table-info" : ""}>
                      <td className="text-center">{index + 1}</td>
                      <td>
                        {item.name}
                        {quotation.options?.includeCouplingInGearbox && item.name === "船用齿轮箱" && 
                          <Badge bg="info" className="ms-1">含联轴器</Badge>
                        }
                        {quotation.options?.includePumpInGearbox && quotation.options?.needsPump && item.name === "船用齿轮箱" && 
                          <Badge bg="info" className="ms-1">含备用泵</Badge>
                        }
                      </td>
                      <td>{item.model}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-center">{item.unit}</td>
                      <td className="text-end">{formatCurrency(item.unitPrice)}</td>
                      <td className="text-end">{formatCurrency(item.amount)}</td>
                      <td>{item.remarks}</td>
                      <td className="text-center">
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => onRemoveItem && onRemoveItem(item.id)}
                          title="从报价单中移除此项目"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  {/* 小计行 */}
                  {(quotation.discountAmount > 0 || quotation.taxAmount > 0) && (
                    <tr>
                      <td colSpan="6" className="text-end"><strong>小计：</strong></td>
                      <td className="text-end">{formatCurrency(quotation.originalAmount)}</td>
                      <td colSpan="2"></td>
                    </tr>
                  )}
                  
                  {/* 折扣行 */}
                  {quotation.discountAmount > 0 && (
                    <tr>
                      <td colSpan="6" className="text-end">折扣 ({quotation.discountPercentage}%)：</td>
                      <td className="text-end">-{formatCurrency(quotation.discountAmount)}</td>
                      <td colSpan="2"></td>
                    </tr>
                  )}
                  
                  {/* 修改: 将"不含税总计"改为"总计" */}
                  <tr>
                    <td colSpan="6" className="text-end"><strong>总计：</strong></td>
                    <td className="text-end"><strong>{formatCurrency(quotation.totalAmount)}</strong></td>
                    <td colSpan="2"></td>
                  </tr>
                  
                  {/* 税额行 */}
                  {quotation.taxAmount > 0 && (
                    <>
                      <tr>
                        <td colSpan="6" className="text-end">增值税 ({quotation.taxRate}%)：</td>
                        <td className="text-end">{formatCurrency(quotation.taxAmount)}</td>
                        <td colSpan="2"></td>
                      </tr>
                      <tr>
                        <td colSpan="6" className="text-end"><strong>含税总计：</strong></td>
                        <td className="text-end"><strong>{formatCurrency(quotation.taxIncludedAmount)}</strong></td>
                        <td colSpan="2"></td>
                      </tr>
                    </>
                  )}
                </tfoot>
              </Table>
            </div>
            
            {/* 大写金额 */}
            <div className="mt-3 mb-4">
              <strong>合计人民币(大写)：</strong> {quotation.totalAmountInChinese}
            </div>
            
            {/* 价格详情 */}
            {showPriceDetails && (
              <div className="mt-4 mb-3">
                <h6 style={{ color: colors?.headerText }}>价格详情</h6>
                <Table bordered size="sm" style={{ color: colors?.text, borderColor: colors?.border }}>
                  <thead style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
                    <tr>
                      <th>项目</th>
                      <th className="text-end">工厂价(元)</th>
                      <th className="text-end">包装价(元)</th>
                      <th className="text-end">市场价(元)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotation.items.map((item, index) => (
                      <tr key={`detail-${index}`}>
                        <td>{item.name} {item.model}</td>
                        <td className="text-end">{formatCurrency(item.prices.factory)}</td>
                        <td className="text-end">{formatCurrency(item.prices.package)}</td>
                        <td className="text-end">{formatCurrency(item.prices.market)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            
            {/* 报价说明 */}
            <div className="mt-4">
              <h6 style={{ color: colors?.headerText }}>报价说明</h6>
              <Table bordered size="sm" style={{ color: colors?.text, borderColor: colors?.border }}>
                <tbody>
                  <tr>
                    <td width="20%">付款条件：</td>
                    <td>{quotation.paymentTerms}</td>
                  </tr>
                  <tr>
                    <td>交货时间：</td>
                    <td>{quotation.deliveryTime}</td>
                  </tr>
                  <tr>
                    <td>其他说明：</td>
                    <td>{quotation.notes}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
            
            {/* 显示选项说明 */}
            {quotation.options && (
              <div className="mt-3 small text-muted">
                <p>
                  报价单配置：
                  {quotation.options.showCouplingPrice ? '联轴器单独显示' : '联轴器包含在齿轮箱中'} | 
                  {quotation.options.showPumpPrice ? '备用泵单独显示' : '备用泵包含在齿轮箱中'} | 
                  税率: {quotation.options.taxRate}% | 
                  折扣: {quotation.options.discountPercentage}% | 
                  有效期: {quotation.options.validityDays}天
                </p>
              </div>
            )}
            
            {/* 保存表单 */}
            {showSaveForm && (
              <div className="mt-3 p-3 border rounded" style={{ borderColor: colors?.border }}>
                <Form.Group className="mb-3">
                  <Form.Label>保存名称</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="输入报价单名称"
                    value={saveNameInput}
                    onChange={(e) => setSaveNameInput(e.target.value)}
                    style={{
                      backgroundColor: colors?.inputBg,
                      color: colors?.text,
                      borderColor: colors?.inputBorder
                    }}
                  />
                  <Form.Text style={{ color: colors?.muted }}>
                    如不输入，将使用默认名称
                  </Form.Text>
                </Form.Group>
                <div className="d-flex">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    className="me-2"
                  >
                    <i className="bi bi-save me-1"></i> 确认保存
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowSaveForm(false);
                      setSaveNameInput('');
                    }}
                  >
                    取消
                  </Button>
                </div>
              </div>
            )}
            
            {/* 操作按钮 */}
            <div className="d-flex justify-content-between mt-4">
              <div>
                <Button 
                  variant="outline-primary" 
                  className="me-2"
                  onClick={onAddCustomItem}
                >
                  <i className="bi bi-plus-circle me-1"></i> 添加自定义项目
                </Button>
                <Button 
                  variant="outline-info" 
                  className="me-2"
                  onClick={onUpdatePrices}
                  title="更新所有项目的价格"
                >
                  <i className="bi bi-arrow-clockwise me-1"></i> 更新价格
                </Button>
                <Button 
                  variant="outline-success"
                  onClick={handleSave}
                >
                  <i className="bi bi-save me-1"></i> {showSaveForm ? '取消' : '保存报价单'}
                </Button>
              </div>
              <div>
                <Button 
                  variant="outline-secondary" 
                  className="me-2" 
                  onClick={handlePrint}
                >
                  <i className="bi bi-printer me-1"></i> 打印
                </Button>
                <Dropdown className="d-inline-block me-2">
                  <Dropdown.Toggle variant="outline-primary" id="dropdown-export">
                    <i className="bi bi-download me-1"></i> 导出
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => onExport && onExport('excel')}>
                      <i className="bi bi-file-earmark-excel me-2"></i> 导出Excel
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onExport && onExport('pdf')}>
                      <i className="bi bi-file-earmark-pdf me-2"></i> 导出PDF
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button 
                  variant="primary"
                  onClick={onGenerateAgreement}
                >
                  <i className="bi bi-file-earmark-text me-1"></i> 生成技术协议
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default QuotationView;