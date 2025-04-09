// src/components/TechnicalAgreement.js
import React, { useRef, useState, useEffect } from 'react';
import './TechnicalAgreement.css';

const TechnicalAgreement = ({ agreement, onExport }) => {
  const viewportRef = useRef(null);
  const [scale, setScale] = useState(1);
  const contentRef = useRef(null);

  // Calculate scale based on viewport width
  useEffect(() => {
    const calculateScale = () => {
      if (viewportRef.current) {
        const viewportWidth = viewportRef.current.offsetWidth;
        const contentWidth = 794; // A4 width at 96 DPI
        setScale(viewportWidth / contentWidth);
      }
    };

    calculateScale(); // Initial calculation
    window.addEventListener('resize', calculateScale); // Recalculate on resize

    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  // 【修改】增加对 agreement 和 agreement.content 的检查
  if (!agreement || !agreement.success || !agreement.content) {
    return <div>没有有效的技术协议数据或协议内容缺失</div>;
  }

  const { content } = agreement;
  // 【修改】增加对 content 内必要对象的检查和默认值
  const generalInfo = content.generalInfo || {};
  const engineData = content.engineData || {};
  const gearboxData = content.gearboxData || {};
  const couplingData = content.couplingData; // 保持检查，因为可能不存在
  const standbyPumpData = content.standbyPumpData; // 保持检查，因为可能不存在
  const accessories = content.accessories || [];
  const monitoringInstruments = content.monitoringInstruments || [];
  const technicalDocuments = content.technicalDocuments || [];
  const qualityAssurance = content.qualityAssurance || {};


  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      <div className="p-4 border-b flex justify-between items-center flex-wrap">
        <h3 className="text-xl font-semibold mb-2 md:mb-0">{content.title || '船用齿轮箱技术协议'}</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm md:text-base"
            onClick={() => onExport && onExport('copy')}
          >
            复制内容
          </button>
          <button
            className="px-3 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm md:text-base"
            onClick={() => onExport && onExport('word')}
          >
            导出Word
          </button>
          <button
            className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm md:text-base"
            onClick={() => onExport && onExport('pdf')}
          >
            导出PDF
          </button>
        </div>
      </div>
      <div 
        style={{
            width: '100%',
            height: 'auto',
            minHeight: '842px',
            overflow: 'auto',
            backgroundColor: '#eee',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px'
        }}
      >
        <div
          ref={contentRef}
          className="agreement-preview-content"
          style={{
              width: '794px',
              minHeight: '1123px',
              backgroundColor: 'white',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              padding: '40px',
              boxSizing: 'border-box',
              marginBottom: '20px',
              transform: `scale(${scale})`,
              transformOrigin: 'top center'
          }}
        >
          {/* Original Content Starts Here */}
          <p className="text-center mb-4 font-bold text-lg">
              {/* 【修改】使用可选链 ?. 安全访问 model */}
              设备项目： 齿轮箱（{gearboxData?.model || '未知型号'}）
          </p>

          <div className="flex flex-wrap mb-6">
              <div className="w-full md:w-1/2 mb-2">
                  {/* 使用检查过的变量 */}
                  <p className="mb-2"><span className="font-bold mr-2">船东:</span> {generalInfo.buyer || '-'}</p>
                  <p className="mb-2"><span className="font-bold mr-2">项目名称:</span> {generalInfo.projectName || '-'}</p>
              </div>
              <div className="w-full md:w-1/2 mb-2">
                  <p className="mb-2"><span className="font-bold mr-2">制造厂：</span> {generalInfo.seller || '杭州前进齿轮箱集团股份有限公司'}</p>
                  <p className="mb-2"><span className="font-bold mr-2">签署日期:</span> {agreement.agreementDate || '-'}</p>
              </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-bold mb-3 border-b pb-2">一、柴油机主要参数</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse mb-4">
                <tbody>
                  <tr>
                    <td className="p-3 border font-medium" width="30%">1. 型号</td>
                    {/* 使用检查过的变量 */}
                    <td className="p-3 border">{engineData.model || '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium">2. 额定功率</td>
                    <td className="p-3 border">{engineData.power ? `${engineData.power} kW` : '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium">3. 额定转速</td>
                    <td className="p-3 border">{engineData.speed ? `${engineData.speed} r/min` : '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium">4. 转向</td>
                    <td className="p-3 border">{engineData.direction || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 【修改】增加对 couplingData 的检查 */}
          {couplingData && (
            <div className="mb-6">
              <h4 className="text-lg font-bold mb-3 border-b pb-2">二、橡胶高弹联轴器</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse mb-4">
                  <tbody>
                    <tr>
                      <td className="p-3 border font-medium" width="30%">1. 型号</td>
                      {/* 【修改】使用可选链 ?. 安全访问 model */}
                      <td className="p-3 border">{couplingData?.model || '-'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 border font-medium">2. 配齐联接件</td>
                      <td className="p-3 border">配齐高弹与齿轮箱、柴油机连接的全部连接件</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mb-6">
             {/* 调整标题序号 */}
            <h4 className="text-lg font-bold mb-3 border-b pb-2">{couplingData ? '三' : '二'}、齿轮箱技术参数</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse mb-4">
                <tbody>
                  <tr>
                    <td className="p-3 border font-medium" width="30%">1. 型号</td>
                    {/* 【修改】使用可选链 ?. 安全访问 model */}
                    <td className="p-3 border">{gearboxData?.model || '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium">2. 减速比</td>
                    <td className="p-3 border">{gearboxData?.ratio ? `${gearboxData.ratio}：1` : '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium">3. 传递能力</td>
                    <td className="p-3 border">{gearboxData?.transferCapacity ? `${gearboxData.transferCapacity} kW/r/min` : '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium">4. 额定推力</td>
                    <td className="p-3 border">{gearboxData?.thrust || '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium">5. 中心距</td>
                    <td className="p-3 border">{gearboxData?.centerDistance || '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium">6. 重量</td>
                    <td className="p-3 border">{gearboxData?.weight ? `${gearboxData.weight} kg` : '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium">7. 输入转速范围</td>
                    <td className="p-3 border">{gearboxData?.inputSpeedRange || '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium">8. 润滑油牌号</td>
                    <td className="p-3 border">{gearboxData?.oilType || '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium">9. 润滑油压力</td>
                    <td className="p-3 border">{gearboxData?.lubricationOilPressure || '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium">10. 润滑油温度</td>
                    <td className="p-3 border">{gearboxData?.lubricationOilTemperature || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 【修改】增加对 standbyPumpData 的检查 */}
          {standbyPumpData && (
            <div className="mb-6">
              {/* 调整标题序号 */}
              <h4 className="text-lg font-bold mb-3 border-b pb-2">{couplingData ? '四' : '三'}、备用泵</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse mb-4">
                  <tbody>
                    {/* 【修改】安全访问 */}
                    {standbyPumpData.model && (
                      <tr>
                        <td className="p-3 border font-medium" width="30%">型号</td>
                        <td className="p-3 border">{standbyPumpData?.model}</td>
                      </tr>
                    )}
                    {standbyPumpData.flow && (
                      <tr>
                        <td className="p-3 border font-medium">流量</td>
                        <td className="p-3 border">{standbyPumpData.flow}</td>
                      </tr>
                    )}
                    {standbyPumpData.pressure && (
                      <tr>
                        <td className="p-3 border font-medium">压力</td>
                        <td className="p-3 border">{standbyPumpData.pressure}</td>
                      </tr>
                    )}
                    {standbyPumpData.motorPower && (
                      <tr>
                        <td className="p-3 border font-medium">电机功率</td>
                        <td className="p-3 border">{standbyPumpData.motorPower}</td>
                      </tr>
                    )}
                    {standbyPumpData.quantity && (
                      <tr>
                        <td className="p-3 border font-medium">数量</td>
                        <td className="p-3 border">{standbyPumpData.quantity}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 使用检查过的变量 */}
          <div className="mb-6">
            <h4 className="text-lg font-bold mb-3 border-b pb-2">随机供应配件</h4>
            {accessories && accessories.length > 0 ? (
              <ul className="list-disc pl-8 mb-4">
                {accessories.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mb-4">无</p>
            )}
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-bold mb-3 border-b pb-2">监控仪表</h4>
            {monitoringInstruments && monitoringInstruments.length > 0 ? (
              <ul className="list-disc pl-8 mb-4">
                {monitoringInstruments.map((item, index) => (
                  // 【修改】安全访问 item.name 和 item.range
                  <li key={index} className="mb-2">{item?.name || '未知仪表'}，传感器量程 {item?.range || '-'}</li>
                ))}
              </ul>
            ) : (
              <p className="mb-4">无</p>
            )}
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-bold mb-3 border-b pb-2">随机技术文件</h4>
            {technicalDocuments && technicalDocuments.length > 0 ? (
              <ul className="list-disc pl-8 mb-4">
                {technicalDocuments.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mb-4">无</p>
            )}
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-bold mb-3 border-b pb-2">质量保证及服务</h4>
            <ul className="list-decimal pl-8 mb-4">
              <li className="mb-2">{qualityAssurance.testStandard || '产品出厂前按国家标准测试'}</li>
              <li className="mb-2">{qualityAssurance.warranty || '产品自安装调试完成后18个月内质保'}</li>
              <li className="mb-2">未尽事宜友好协商解决。</li>
            </ul>
          </div>

          <div className="flex justify-around items-center mt-10 pt-6 border-t">
            <div className="text-center">
              <p className="mb-10">买方代表（签字）：</p>
              <p>日期：</p>
            </div>
            <div className="text-center">
              <p className="mb-10">卖方代表（签字）：</p>
              <p>日期：</p>
            </div>
          </div>
          {/* Original Content Ends Here */}
        </div>
      </div>
    </div>
  );
};

export default TechnicalAgreement;