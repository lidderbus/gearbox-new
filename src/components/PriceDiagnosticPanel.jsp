// src/components/PriceDiagnosticPanel.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Form, InputGroup, Alert, Spinner, Card, Tabs, Tab } from 'react-bootstrap';
import { parseOfficialPriceTable, validatePricesAgainstOfficial } from '../utils/officialPriceImporter';
import { updatePricesFromOfficialTable } from '../utils/priceManager';

/**
 * 价格诊断面板组件
 * 用于检查和修复价格数据问题
 */
const PriceDiagnosticPanel = ({ 
  show, 
  onHide, 
  appData, 
  onUpdateData,
  colors,
  theme = 'light'
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [priceFile, setPriceFile] = useState(null);
  const [discountFile, setDiscountFile] = useState(null);
  const [inconsistencies, setInconsistencies] = useState([]);
  const [activeTab, setActiveTab] = useState('checkPrices');
  const [officialPriceText, setOfficialPriceText] = useState('');
  const [selectedModelType, setSelectedModelType] = useState('all');
  
  // 检测价格不一致
  const checkPriceInconsistencies = () => {
    setLoading(true);
    setMessage('正在检查价格数据...');
    
    try {
      if (!officialPriceText) {
        setMessage('请先加载或粘贴官方价格表数据');
        setLoading(false);
        return;
      }
      
      const prices = parseOfficialPriceTable(officialPriceText);
      if (prices.length === 0) {
        setMessage('解析价格表失败，未找到有效的价格数据');
        setLoading(false);
        return;
      }
      
      const result = validatePricesAgainstOfficial(appData, prices);
      setInconsistencies(result.inconsistencies || []);
      setMessage(result.message || '价格检查完成');
    } catch (error) {
      console.error('检查价格不一致时出错:', error);
      setMessage(`检查失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 应用官方价格表
  const applyOfficialPrices = async () => {
    setLoading(true);
    setMessage('正在应用官方价格表...');
    
    try {
      if (!officialPriceText) {
        setMessage('请先加载或粘贴官方价格表数据');
        setLoading(false);
        return;
      }
      
      // 获取折扣表内容（如果有）
      let discountText = '';
      if (discountFile) {
        const reader = new FileReader();
        const discountContent = await new Promise((resolve, reject) => {
          reader.onload = e => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsText(discountFile);
        });
        discountText = discountContent;
      }
      
      // 应用价格更新
      const result = await updatePricesFromOfficialTable(officialPriceText, discountText);
      
      if (result.success && result.updatedData) {
        setMessage(`价格表应用成功: ${result.message}`);
        if (typeof onUpdateData === 'function') {
          onUpdateData(result.updatedData);
        }
      } else {
        setMessage(`价格表应用失败: ${result.message}`);
      }
    } catch (error) {
      console.error('应用价格表时出错:', error);
      setMessage(`应用价格表失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 处理文件上传
  const handleFileUpload = async (event, fileType) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      const reader = new FileReader();
      const fileContent = await new Promise((resolve, reject) => {
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });
      
      if (fileType === 'price') {
        setPriceFile(file);
        setOfficialPriceText(fileContent);
        setMessage(`已加载价格表: ${file.name}`);
      } else if (fileType === 'discount') {
        setDiscountFile(file);
        setMessage(`已加载折扣表: ${file.name}`);
      }
    } catch (error) {
      console.error('加载文件时出错:', error);
      setMessage(`加载文件失败: ${error.message}`);
    }
  };
  
  // 筛选显示的不一致项
  const filteredInconsistencies = inconsistencies.filter(item => {
    if (selectedModelType === 'all') return true;
    
    // 根据型号前缀筛选
    if (selectedModelType === 'HC' && item.model.startsWith('HC')) return true;
    if (selectedModelType === 'GW' && item.model.startsWith('GW')) return true;
    if (selectedModelType === 'DT' && item.model.startsWith('DT')) return true;
    if (selectedModelType === 'GC' && item.model.startsWith('GC')) return true;
    if (selectedModelType === 'other') {
      return !item.model.startsWith('HC') && 
             !item.model.startsWith('GW') && 
             !item.model.startsWith('DT') && 
             !item.model.startsWith('GC');
    }
    
    return false;
  });
  
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      backdrop="static" 
      keyboard={false}
      style={{ 
        color: colors.text,
      }}
    >
      <Modal.Header closeButton style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <Modal.Title>价格数据诊断</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: colors.bg, color: colors.text }}>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
          style={{ borderBottomColor: colors.border }}
        >
          {/* 价格检查标签 */}
          <Tab eventKey="checkPrices" title="价格检查">
            <Card className="mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>上传官方价格表</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="file"
                        accept=".txt,.csv"
                        onChange={(e) => handleFileUpload(e, 'price')}
                        disabled={loading}
                      />
                      <Button 
                        variant="outline-secondary" 
                        onClick={checkPriceInconsistencies}
                        disabled={loading || !officialPriceText}
                      >
                        {loading ? <Spinner size="sm" animation="border" /> : '检查价格'}
                      </Button>
                    </InputGroup>
                    <Form.Text style={{ color: colors.muted }}>
                      支持文本格式的官方价格表
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>价格表内容</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={officialPriceText}
                      onChange={(e) => setOfficialPriceText(e.target.value)}
                      placeholder="在此粘贴官方价格表内容..."
                      style={{ 
                        backgroundColor: colors.inputBg, 
                        color: colors.text,
                        borderColor: colors.inputBorder
                      }}
                    />
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
            
            {message && (
              <Alert 
                variant={message.includes('成功') ? 'success' : message.includes('失败') ? 'danger' : 'info'}
                className="mb-3"
              >
                {message}
              </Alert>
            )}
            
            {inconsistencies.length > 0 && (
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 style={{ color: colors.headerText }}>发现价格不一致 ({filteredInconsistencies.length}/{inconsistencies.length})</h5>
                  <Form.Select 
                    style={{ width: 'auto' }}
                    value={selectedModelType}
                    onChange={e => setSelectedModelType(e.target.value)}
                  >
                    <option value="all">全部型号</option>
                    <option value="HC">HC系列</option>
                    <option value="GW">GW系列</option>
                    <option value="DT">DT系列</option>
                    <option value="GC">GC系列</option>
                    <option value="other">其他</option>
                  </Form.Select>
                </div>
                
                <Table 
                  striped 
                  bordered 
                  hover 
                  size="sm"
                  style={{ 
                    backgroundColor: colors.card, 
                    color: colors.text,
                    borderColor: colors.border
                  }}
                >
                  <thead>
                    <tr>
                      <th>型号</th>
                      <th>集合</th>
                      <th>当前价格</th>
                      <th>官方价格</th>
                      <th>差异</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInconsistencies.map((item, index) => (
                      <tr key={index}>
                        <td>{item.model}</td>
                        <td>{item.collection}</td>
                        <td>{item.currentPrice}</td>
                        <td>{item.officialPrice}</td>
                        <td className={parseFloat(item.difference) > 0 ? 'text-danger' : 'text-success'}>
                          {item.difference}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Tab>
          
          {/* 价格修复标签 */}
          <Tab eventKey="fixPrices" title="价格修复">
            <Card className="mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>上传折扣率表 (可选)</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".txt,.csv"
                      onChange={(e) => handleFileUpload(e, 'discount')}
                      disabled={loading}
                    />
                    <Form.Text style={{ color: colors.muted }}>
                      如果有官方折扣表，可一并上传
                    </Form.Text>
                  </Form.Group>
                  
                  <Alert variant="warning">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    应用官方价格将更新数据库中的所有价格数据，请确保已备份重要数据。
                  </Alert>
                  
                  <div className="d-grid">
                    <Button
                      variant="primary"
                      onClick={applyOfficialPrices}
                      disabled={loading || !officialPriceText}
                    >
                      {loading ? <Spinner size="sm" animation="border" className="me-1" /> : ''}
                      应用官方价格表
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            
            {message && (
              <Alert 
                variant={message.includes('成功') ? 'success' : message.includes('失败') ? 'danger' : 'info'}
                className="mb-3"
              >
                {message}
              </Alert>
            )}
          </Tab>
          
          {/* 参考资料标签 */}
          <Tab eventKey="reference" title="参考资料">
            <Card className="mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
              <Card.Body>
                <h5>官方价格表格式说明</h5>
                <p>
                  为了正确解析官方价格表，请确保文件符合以下格式：
                </p>
                <pre style={{ 
                  backgroundColor: colors.inputBg, 
                  color: colors.text,
                  padding: '10px',
                  borderRadius: '4px'
                }}>
                  产品型号 速比 出厂价格 备注
                  40A      8560   手控、带罩、齿形块、A1型监控
                  120C     13420  手控、带罩、齿形块、A1型监控
                  ...
                </pre>
                <p>
                  每行一个产品，字段之间用空格分隔。对于带有速比的型号，格式应为：
                </p>
                <pre style={{ 
                  backgroundColor: colors.inputBg, 
                  color: colors.text,
                  padding: '10px',
                  borderRadius: '4px'
                }}>
                  MB270A  3-5.5:1  28600  手控、带罩、齿形块、A1型监控
                </pre>
              </Card.Body>
            </Card>
            
            <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
              <Card.Body>
                <h5>折扣率表格式说明</h5>
                <p>
                  折扣率表应包含出厂价、优惠后价格和折扣率，例如：
                </p>
                <pre style={{ 
                  backgroundColor: colors.inputBg, 
                  color: colors.text,
                  padding: '10px',
                  borderRadius: '4px'
                }}>
                  产品型号 出厂价格 优惠后价格 备注
                  40A     8560    7190.4    下浮16%
                  120C    13420   11809.6   下浮12%
                  ...
                </pre>
                <p>
                  系统会自动计算折扣率并应用到数据库中。
                </p>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: colors.bg, borderTopColor: colors.border }}>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          关闭
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PriceDiagnosticPanel;
