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
  const accessories = content.accessories || [];
  const monitoringInstruments = content.monitoringInstruments || [];
  const technicalDocuments = content.technicalDocuments || [];
  const qualityAssurance = content.qualityAssurance || {};

  // 修改后的格式化内容函数，提升了排版与美观性
  const formatContent = () => {
    let html = '';

    // 样式类定义
    const tableStyle = 'width: 100%; border-collapse: collapse; margin-bottom: 20px;';
    const thStyle = 'background-color: #f0f5ff; color: #333; padding: 10px; text-align: left; border: 1px solid #ccc; font-weight: bold;';
    const tdStyle = 'padding: 10px; border: 1px solid #ccc;';
    const tdLabelStyle = 'padding: 10px; border: 1px solid #ccc; background-color: #f7f7f7; width: 30%; font-weight: 500;';
    const sectionTitleStyle = 'font-size: 16px; font-weight: bold; margin: 20px 0 10px 0; padding-bottom: 8px; border-bottom: 2px solid #5b9bd5; color: #003366;';
    
    // 基本信息
    html += `<h3 style="${sectionTitleStyle}">基本信息</h3>`;
    html += `<table style="${tableStyle}"><tbody>`;
    html += `<tr><td style="${tdLabelStyle}">买方</td><td style="${tdStyle}">${generalInfo.buyer || '-'}</td></tr>`;
    html += `<tr><td style="${tdLabelStyle}">卖方</td><td style="${tdStyle}">${generalInfo.seller || '-'}</td></tr>`;
    html += `<tr><td style="${tdLabelStyle}">项目名称</td><td style="${tdStyle}">${generalInfo.projectName || '-'}</td></tr>`;
    html += '</tbody></table>';

    // 主机参数
    html += `<h3 style="${sectionTitleStyle}">一、主机参数</h3>`;
    html += `<table style="${tableStyle}"><tbody>`;
    html += `<tr><td style="${tdLabelStyle}">型号</td><td style="${tdStyle}">${engineData.model || '-'}</td></tr>`;
    html += `<tr><td style="${tdLabelStyle}">额定功率</td><td style="${tdStyle}">${engineData.power ? `${engineData.power} kW` : '-'}</td></tr>`;
    html += `<tr><td style="${tdLabelStyle}">额定转速</td><td style="${tdStyle}">${engineData.speed ? `${engineData.speed} r/min` : '-'}</td></tr>`;
    html += `<tr><td style="${tdLabelStyle}">转向</td><td style="${tdStyle}">${engineData.direction || '-'}</td></tr>`;
    html += '</tbody></table>';

    // 联轴器数据（如果存在）
    if (couplingData) {
      html += `<h3 style="${sectionTitleStyle}">二、橡胶高弹联轴器</h3>`;
      html += `<table style="${tableStyle}"><tbody>`;
      html += `<tr><td style="${tdLabelStyle}">型号</td><td style="${tdStyle}">${couplingData.model || '-'}</td></tr>`;
      if (couplingData.torque) html += `<tr><td style="${tdLabelStyle}">额定扭矩</td><td style="${tdStyle}">${couplingData.torque}</td></tr>`;
      if (couplingData.weight) html += `<tr><td style="${tdLabelStyle}">重量</td><td style="${tdStyle}">${couplingData.weight}</td></tr>`;
      html += '</tbody></table>';
    }

    // 齿轮箱参数
    html += `<h3 style="${sectionTitleStyle}">${couplingData ? '三、齿轮箱技术参数' : '二、齿轮箱技术参数'}</h3>`;
    html += `<table style="${tableStyle}"><tbody>`;
    html += `<tr><td style="${tdLabelStyle}">型号</td><td style="${tdStyle}">${gearboxData.model || '-'}</td></tr>`;
    html += `<tr><td style="${tdLabelStyle}">减速比</td><td style="${tdStyle}">${gearboxData.ratio ? `${gearboxData.ratio}：1` : '-'}</td></tr>`;
    html += `<tr><td style="${tdLabelStyle}">传递能力</td><td style="${tdStyle}">${gearboxData.transferCapacity ? `${gearboxData.transferCapacity} kW/r/min` : '-'}</td></tr>`;
    html += `<tr><td style="${tdLabelStyle}">额定推力</td><td style="${tdStyle}">${gearboxData.thrust || '-'}</td></tr>`;
    html += `<tr><td style="${tdLabelStyle}">中心距</td><td style="${tdStyle}">${gearboxData.centerDistance ? `${gearboxData.centerDistance} mm` : '-'}</td></tr>`;
    html += `<tr><td style="${tdLabelStyle}">重量</td><td style="${tdStyle}">${gearboxData.weight ? `${gearboxData.weight} kg` : '-'}</td></tr>`;
    html += `<tr><td style="${tdLabelStyle}">输入转速范围</td><td style="${tdStyle}">${gearboxData.inputSpeedRange || '-'}</td></tr>`;
    html += `<tr><td style="${tdLabelStyle}">润滑油牌号</td><td style="${tdStyle}">${gearboxData.oilType || '-'}</td></tr>`;
    html += `<tr><td style="${tdLabelStyle}">润滑油压力</td><td style="${tdStyle}">${gearboxData.lubricationOilPressure || '-'}</td></tr>`;
    html += `<tr><td style="${tdLabelStyle}">润滑油温度</td><td style="${tdStyle}">${gearboxData.lubricationOilTemperature || '-'}</td></tr>`;
    html += '</tbody></table>';

    // 备用泵（如果存在）
    if (standbyPumpData) {
      html += `<h3 style="${sectionTitleStyle}">${couplingData ? '四、备用泵' : '三、备用泵'}</h3>`;
      html += `<table style="${tableStyle}"><tbody>`;
      html += `<tr><td style="${tdLabelStyle}">型号</td><td style="${tdStyle}">${standbyPumpData.model || '-'}</td></tr>`;
      if (standbyPumpData.flow) html += `<tr><td style="${tdLabelStyle}">流量</td><td style="${tdStyle}">${standbyPumpData.flow}</td></tr>`;
      if (standbyPumpData.pressure) html += `<tr><td style="${tdLabelStyle}">压力</td><td style="${tdStyle}">${standbyPumpData.pressure}</td></tr>`;
      if (standbyPumpData.power) html += `<tr><td style="${tdLabelStyle}">电机功率</td><td style="${tdStyle}">${standbyPumpData.power}</td></tr>`;
      html += '</tbody></table>';
    }

    // 随机供应配件
    let sectionCounter = 3 + (couplingData ? 1 : 0) + (standbyPumpData ? 1 : 0);
    const sectionTitles = ['一','二','三','四','五','六','七','八','九','十'];

    html += `<h3 style="${sectionTitleStyle}">${sectionTitles[sectionCounter-1]}、随机供应配件</h3>`;
    if (accessories.length > 0) {
      html += '<ul style="padding-left: 20px; list-style-type: disc;">';
      accessories.forEach(item => html += `<li style="margin: 5px 0;">${item}</li>`);
      html += '</ul>';
    } else {
      html += '<p style="margin: 10px 0;">- 无</p>';
    }
    sectionCounter++;

    // 监控仪表
    html += `<h3 style="${sectionTitleStyle}">${sectionTitles[sectionCounter-1]}、监控仪表</h3>`;
    if (monitoringInstruments.length > 0) {
      html += '<ul style="padding-left: 20px; list-style-type: disc;">';
      monitoringInstruments.forEach(item => html += `<li style="margin: 5px 0;">${item.name}，传感器量程 ${item.range}</li>`);
      html += '</ul>';
    } else {
      html += '<p style="margin: 10px 0;">- 无</p>';
    }
    sectionCounter++;

    // 技术文件
    html += `<h3 style="${sectionTitleStyle}">${sectionTitles[sectionCounter-1]}、技术文件</h3>`;
    if (technicalDocuments.length > 0) {
      html += '<ul style="padding-left: 20px; list-style-type: disc;">';
      technicalDocuments.forEach(item => html += `<li style="margin: 5px 0;">${item}</li>`);
      html += '</ul>';
    } else {
      html += '<p style="margin: 10px 0;">- 无</p>';
    }
    sectionCounter++;

    // 质量保证
    html += `<h3 style="${sectionTitleStyle}">${sectionTitles[sectionCounter-1]}、质量保证</h3>`;
    html += `<table style="${tableStyle}"><tbody>`;
    html += `<tr><td style="${tdLabelStyle}">测试标准</td><td style="${tdStyle}">${qualityAssurance.testStandard || '-'}</td></tr>`;
    html += `<tr><td style="${tdLabelStyle}">质保期</td><td style="${tdStyle}">${qualityAssurance.warranty || '-'}</td></tr>`;
    html += '</tbody></table>';

    // 签名区域
    html += `<div style="margin-top: 30px; display: flex; justify-content: space-between;">
              <div style="width: 30%;">
                <p style="margin-bottom: 50px;">船东（甲方）：</p>
                <p style="margin-bottom: 10px;">签字：___________________</p>
                <p>日期：___________________</p>
              </div>
              <div style="width: 30%;">
                <p style="margin-bottom: 50px;">船厂/需方（甲方）：</p>
                <p style="margin-bottom: 10px;">签字：___________________</p>
                <p>日期：___________________</p>
              </div>
              <div style="width: 30%;">
                <p style="margin-bottom: 50px;">制造厂（乙方）：</p>
                <p style="margin-bottom: 10px;">签字：___________________</p>
                <p>日期：___________________</p>
              </div>
            </div>`;

    return html;
  };
  
  return (
    <div>
      <Card className="mb-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: colors.headerBg, color: colors.headerText, padding: '15px 20px' }}>
          <h5 className="mb-0" style={{ fontSize: '18px', fontWeight: 'bold' }}>船用齿轮箱技术协议</h5>
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
        <Card.Body style={{ padding: '0' }}>
          <div className="agreement-preview-content" style={{
            fontSize: '14px',
            lineHeight: 1.6,
            padding: '30px',
            margin: '0 auto',
            maxWidth: '100%',
            backgroundColor: 'white',
            color: '#333',
            fontFamily: '"Noto Sans SC", "Microsoft YaHei", sans-serif',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ 
              fontSize: '22px', 
              textAlign: 'center', 
              margin: '20px 0 30px 0',
              fontWeight: 'bold',
              color: '#003366'
            }}>船用齿轮箱技术协议</h2>
            <div dangerouslySetInnerHTML={{ __html: formatContent() }} />
          </div>
        </Card.Body>
        <Card.Footer style={{ 
          backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748',
          borderTop: `1px solid ${colors.border}`,
          textAlign: 'right',
          color: colors.muted,
          fontSize: '0.9rem',
          padding: '12px 20px'
        }}>
          <div className="d-flex justify-content-between align-items-center">
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

export default AgreementView;