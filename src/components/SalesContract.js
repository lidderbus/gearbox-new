// src/components/SalesContract.js
import React, { useRef, useState, useEffect } from 'react';
import { Row, Col, Table, Button } from 'react-bootstrap';

/**
 * 销售合同组件
 * 用于显示生成的销售合同内容
 * 
 * @param {Object} contract - 合同数据
 * @param {Function} onExport - 导出函数
 * @param {string} theme - 主题（light/dark）
 */
const SalesContract = ({ contract, onExport, theme }) => {
  const viewportRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Calculate scale based on viewport width
  useEffect(() => {
    const calculateScale = () => {
      if (viewportRef.current) {
        const viewportWidth = viewportRef.current.offsetWidth;
        const contentWidth = 794; // A4 width approximation
        setScale(viewportWidth / contentWidth);
      }
    };

    calculateScale(); // Initial calculation
    window.addEventListener('resize', calculateScale); // Recalculate on resize

    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  // 检查合同数据是否有效
  if (!contract || !contract.success) {
    return <div>没有有效的合同数据</div>;
  }
  
  // 根据主题设置颜色
  const colors = theme === 'light' 
    ? { text: '#263238', headerBg: '#e0f0e0', headerText: '#1b5e20' }
    : { text: '#e2e8f0', headerBg: '#2d3748', headerText: '#a0aec0' };
  
  return (
    <div className="contract-container bg-white rounded-lg shadow-md mb-4">
      <div className="p-4 border-b d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <h3 className="font-weight-bold mb-1" style={{ color: colors.headerText }}>上海前进齿轮经营有限公司产品销售合同</h3>
        </div>
        <div>
          <Button
            variant="outline-primary"
            className="me-2"
            size="sm"
            onClick={() => onExport && onExport('word')}
          >
            <i className="bi bi-file-earmark-word me-1"></i>Word
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onExport && onExport('pdf')}
          >
            <i className="bi bi-file-earmark-pdf me-1"></i>PDF
          </Button>
        </div>
      </div>
      
      <div 
        style={{
            width: '100%',
            height: 'auto',
            overflow: 'auto',
            backgroundColor: '#eee',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '20px'
        }}
      >
        <div
          className="contract-preview-content"
          style={{
              width: '1123px', // A4 height at 96 DPI (landscape)
              minHeight: '794px', // A4 width at 96 DPI (landscape)
              backgroundColor: 'white',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              padding: '40px',
              boxSizing: 'border-box',
              transform: `scale(${Math.min(1, (window.innerWidth - 100) / 1123)})`,
              transformOrigin: 'top center'
          }}
        >
          {/* Original Content Starts Here */}
          {/* 合同信息 */}
          <div className="mb-4">
            <div className="d-flex justify-content-between">
              <div>
                <span className="font-weight-bold">签订地点：</span> 上海
              </div>
              <div>
                <span className="font-weight-bold">合同编号：</span> {contract.contractNumber}
              </div>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <div>
                <span className="font-weight-bold">签订日期：</span> {contract.contractDate}
              </div>
              <div>
                <span className="font-weight-bold">统计编号：</span> 
              </div>
            </div>
          </div>
          
          {/* 买方卖方信息表格 */}
          <Table bordered className="mb-4" style={{ fontSize: '0.9rem' }}>
            <thead>
              <tr>
                <th width="5%" className="text-center">序号</th>
                <th width="45%" colSpan={3} className="text-center">需方</th>
                <th width="45%" colSpan={3} className="text-center">供方</th>
                <th width="5%" className="text-center">鉴（公）证意见：</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={6} className="text-center align-middle">1</td> {/* Adjusted rowspan */} 
                <td width="10%">单位名称</td>
                <td colSpan={2}>{contract.buyerInfo.name}</td>
                <td width="10%">单位名称</td>
                <td colSpan={2}>{contract.sellerInfo.name}</td>
                <td rowSpan={7} className="align-top"></td> {/* Adjusted rowspan */} 
              </tr>
              <tr>
                <td>法定代表人</td>
                <td>{contract.buyerInfo.legalRepresentative}</td>
                <td>委托代理人</td>
                <td>法定代表人</td>
                <td>{contract.sellerInfo.legalRepresentative}</td>
                <td>委托代理人</td>
              </tr>
              <tr>
                <td>通讯地址</td>
                <td colSpan={2}>{contract.buyerInfo.address}</td>
                <td>通讯地址</td>
                <td colSpan={2}>{contract.sellerInfo.address}</td>
              </tr>
              <tr>
                <td>邮政编码</td>
                <td>{contract.buyerInfo.postalCode}</td>
                <td>电话或传真</td>
                <td>邮政编码</td>
                <td>{contract.sellerInfo.postalCode}</td>
                <td>传真</td>
              </tr>
              <tr>
                <td>税号</td>
                <td colSpan={2}>{contract.buyerInfo.taxNumber}</td>
                <td>电话</td>
                <td colSpan={2}>{contract.sellerInfo.phone}</td>
              </tr>
               <tr>
                 <td>银行及账号</td>
                 <td colSpan={2}>{`${contract.buyerInfo.bank || ''}\n${contract.buyerInfo.accountNumber || ''}`}</td>
                 <td>银行及账号</td>
                 <td colSpan={2}>{`${contract.sellerInfo.bank}\n${contract.sellerInfo.accountNumber}`}</td>
              </tr>
            </tbody>
          </Table>
          
          {/* 产品信息表格 */}
          <Table bordered className="mb-4" style={{ fontSize: '0.9rem' }}>
            <thead>
              <tr>
                <th width="5%" className="text-center align-middle" rowSpan={2}>序号</th>
                <th width="12%" className="align-middle" rowSpan={2}>产品名称</th>
                <th width="12%" className="align-middle" rowSpan={2}>规格型号</th>
                <th width="8%" className="align-middle" rowSpan={2}>商标</th>
                <th width="6%" className="align-middle" rowSpan={2}>计量单位</th>
                <th width="5%" className="align-middle" rowSpan={2}>数量</th>
                <th width="10%" className="align-middle" rowSpan={2}>单价（元）</th>
                <th width="10%" className="align-middle" rowSpan={2}>金额</th>
                <th colSpan={4} width="24%" className="text-center">交货期（{contract.products[0]?.deliveryYear || new Date().getFullYear()}年度）</th>
                <th width="8%" className="align-middle" rowSpan={2}>备注</th>
              </tr>
              <tr>
                <th className="text-center">一季度</th>
                <th className="text-center">二季度</th>
                <th className="text-center">三季度</th>
                <th className="text-center">四季度</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={contract.coupling ? 2 : 1} className="text-center align-middle">2</td>
                <td>{contract.products[0].name}</td>
                <td>{contract.products[0].model}</td>
                <td>{contract.products[0].brand}</td>
                <td className="text-center">{contract.products[0].unit}</td>
                <td className="text-center">{contract.products[0].quantity}</td>
                <td className="text-right">¥{contract.products[0].unitPrice?.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className="text-right">¥{contract.products[0].amount?.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className="text-center">{contract.products[0].deliveryQuarter === 1 ? "√" : ""}</td>
                <td className="text-center">{contract.products[0].deliveryQuarter === 2 ? "√" : ""}</td>
                <td className="text-center">{contract.products[0].deliveryQuarter === 3 ? "√" : ""}</td>
                <td className="text-center">{contract.products[0].deliveryQuarter === 4 ? "√" : ""}</td>
                <td rowSpan={contract.coupling ? 2 : 1}></td>
              </tr>
              {contract.coupling && (
                <tr>
                  <td>{contract.coupling.name}</td>
                  <td>{contract.coupling.model}</td>
                  <td>{contract.coupling.brand}</td>
                  <td className="text-center">{contract.coupling.unit}</td>
                  <td className="text-center">{contract.coupling.quantity}</td>
                  <td className="text-right">¥{contract.coupling.unitPrice?.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="text-right">¥{contract.coupling.amount?.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              )}
              <tr>
                <td colSpan={2} style={{ fontWeight: 'bold' }}>合计人民币（大写）：</td>
                <td colSpan={5}>{contract.totalAmountInChinese}</td>
                <td colSpan={6}>¥（小写）：{contract.totalAmount?.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              </tr>
            </tbody>
          </Table>
          
          {/* 合同条款表格 */}
          <Table bordered className="mb-4" style={{ fontSize: '0.9rem' }}>
            <tbody>
              <tr>
                <td width="5%" className="text-center">3</td>
                <td width="45%">执行质量标准：{contract.executionStandard}</td>
                <td width="5%" className="text-center">11</td>
                <td width="45%">违约责任：按"民法典"规定条款执行。</td>
              </tr>
              <tr>
                <td className="text-center">4</td>
                <td>需方验收及提出质量异议期限：{contract.inspectionPeriod}</td>
                <td className="text-center align-middle" rowSpan={2}>12</td>
                <td rowSpan={2} className="align-middle">{contract.disputeResolution}</td>
              </tr>
              <tr>
                <td className="text-center">5</td>
                <td>交货时间：{contract.deliveryDate}</td>
              </tr>
              <tr>
                <td className="text-center">6</td>
                <td>交货地点：{contract.deliveryLocation}</td>
                <td className="text-center align-middle" rowSpan={3}>13</td>
                <td rowSpan={3} className="align-middle">其他约定事项或特殊订货要求：{contract.specialRequirements}</td>
              </tr>
              <tr>
                <td className="text-center">7</td>
                <td>交货方式：{contract.deliveryMethod}</td>
              </tr>
              <tr>
                <td className="text-center">8</td>
                <td>运输方式：{contract.transportMethod} &nbsp; 运费结算：{contract.transportFeeArrangement}</td>
              </tr>
              <tr>
                <td className="text-center">9</td>
                <td>包装标准：{contract.packagingStandard} &nbsp; 包装费：{contract.packagingFeeArrangement}</td>
                <td className="text-center">14</td>
                <td>合同有效期限：自签订日起至{contract.expiryDate}止</td>
              </tr>
              <tr>
                <td className="text-center">10</td>
                <td>结算方式及期限：{contract.paymentMethod}</td>
                <td className="text-center">15</td>
                <td>{contract.contractCopies}</td>
              </tr>
            </tbody>
          </Table>
          
          {/* 签名区域 */}
          <div className="d-flex justify-content-between mt-5 mb-3">
            <div>
              <p className="mb-1">需方（盖章）：</p>
              <p className="mb-3" style={{height: '2em'}}></p> {/* Spacer */} 
              <p className="mb-1">法定代表人或委托代理人（签字）：_________________</p>
              <p className="mt-3">日期：_________________</p>
            </div>
            <div className="text-right">
              <p className="mb-1">供方（盖章）：</p>
               <p className="mb-3" style={{height: '2em'}}></p> {/* Spacer */} 
              <p className="mb-1">法定代表人或委托代理人（签字）：_________________</p>
              <p className="mt-3">日期：_________________</p>
            </div>
          </div>
          {/* Original Content Ends Here */}
        </div>
      </div>
    </div>
  );
};

export default SalesContract;