// src/components/SelectionInterface.js
import React, { useState, useEffect } from 'react';
import { autoSelectGearbox } from '../utils/selectionAlgorithm';
import { formatPrice } from '../utils/dataHelpers';
import { saveSelectionToHistory } from '../utils/selectionHistory';
import { initialData } from '../data/initialData';

const SelectionInterface = () => {
  // 用户输入状态
  const [requirements, setRequirements] = useState({
    motorPower: "", // 主机功率 (kW)
    motorSpeed: "", // 主机转速 (rpm)
    targetRatio: "", // 目标减速比
    thrust: "", // 推力要求 (kN)
    application: "propulsion", // 应用场景: propulsion(推进) 或 auxiliary(辅助)
    budget: "", // 预算 (可选)
    weightLimit: "", // 重量限制 (可选)
    workCondition: "III类:扭矩变化中等", // 工作条件
    temperature: "30", // 工作温度
    safetyFactor: "1.2" // 安全系数
  });

  // 选型结果状态
  const [selectionResult, setSelectionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGearboxType, setSelectedGearboxType] = useState("auto"); // auto, HC, GW, HCM, DT

  // 工作条件选项
  const workConditionOptions = [
    'I类:扭矩变化很小',
    'II类:扭矩变化小',
    'III类:扭矩变化中等',
    'IV类:扭矩变化大',
    'V类:扭矩变化很大'
  ];

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequirements({
      ...requirements,
      [name]: value
    });
  };

  // 执行选型算法
  const handleSelection = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // 验证必填字段
      const requiredFields = ['motorPower', 'motorSpeed', 'targetRatio'];
      const missingFields = requiredFields.filter(field => !requirements[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`请填写必填字段: ${missingFields.join(', ')}`);
      }
      
      // 转换输入为数字
      const numericRequirements = {
        ...requirements,
        motorPower: parseFloat(requirements.motorPower),
        motorSpeed: parseFloat(requirements.motorSpeed),
        targetRatio: parseFloat(requirements.targetRatio),
        thrust: requirements.thrust ? parseFloat(requirements.thrust) : 0,
        budget: requirements.budget ? parseFloat(requirements.budget) : 0,
        weightLimit: requirements.weightLimit ? parseFloat(requirements.weightLimit) : 0,
        temperature: parseFloat(requirements.temperature || 30),
        safetyFactor: parseFloat(requirements.safetyFactor || 1.2)
      };
      
      // 根据选择的齿轮箱类型执行选型
      let result;
      if (selectedGearboxType === "auto") {
        // 自动选择最佳齿轮箱类型
        result = await autoSelectGearbox(numericRequirements, initialData);
      } else {
        // 使用指定的齿轮箱类型
        const gearboxTypeData = initialData[`${selectedGearboxType.toLowerCase()}Gearboxes`];
        if (!gearboxTypeData) {
          throw new Error(`找不到${selectedGearboxType}系列齿轮箱数据`);
        }
        
        // 创建一个模拟的完整数据对象
        const filteredData = {
          [`${selectedGearboxType.toLowerCase()}Gearboxes`]: gearboxTypeData,
          flexibleCouplings: initialData.flexibleCouplings,
          standbyPumps: initialData.standbyPumps
        };
        
        result = await autoSelectGearbox(numericRequirements, filteredData);
      }
      
      setSelectionResult(result);
      
      // 如果选型成功，保存到历史记录
      if (result.success && result.result) {
        const savedResult = saveSelectionToHistory(
          result.result,
          { 
            name: `选型 ${new Date().toLocaleString()}`,
            date: new Date().toISOString(),
            type: selectedGearboxType 
          },
          { gearbox: result.result.gearbox, coupling: result.result.coupling, pump: result.result.pump },
          { power: numericRequirements.motorPower, speed: numericRequirements.motorSpeed },
          numericRequirements
        );
        
        console.log("选型结果已保存到历史:", savedResult);
      }
      
    } catch (err) {
      console.error('选型过程出错:', err);
      setError(err.message || '选型过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    setRequirements({
      motorPower: "",
      motorSpeed: "",
      targetRatio: "",
      thrust: "",
      application: "propulsion",
      budget: "",
      weightLimit: "",
      workCondition: "III类:扭矩变化中等",
      temperature: "30",
      safetyFactor: "1.2"
    });
    setSelectionResult(null);
    setError(null);
  };

  return (
    <div className="selection-interface">
      <h2>船用齿轮箱选型系统</h2>
      
      <div className="selection-container">
        <div className="input-section">
          <h3>输入参数</h3>
          
          <form onSubmit={handleSelection}>
            <div className="form-group">
              <label>齿轮箱系列:</label>
              <select 
                value={selectedGearboxType} 
                onChange={(e) => setSelectedGearboxType(e.target.value)}
              >
                <option value="auto">自动选择最佳系列</option>
                <option value="HC">HC系列 (中小功率)</option>
                <option value="GW">GW系列 (大功率)</option>
                <option value="HCM">HCM系列 (轻型高速)</option>
                <option value="DT">DT系列 (电推)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>主机功率 (kW):<span className="required">*</span></label>
              <input
                type="number"
                name="motorPower"
                value={requirements.motorPower}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label>主机转速 (rpm):<span className="required">*</span></label>
              <input
                type="number"
                name="motorSpeed"
                value={requirements.motorSpeed}
                onChange={handleInputChange}
                required
                min="0"
                step="0.1"
              />
            </div>
            
            <div className="form-group">
              <label>目标减速比:<span className="required">*</span></label>
              <input
                type="number"
                name="targetRatio"
                value={requirements.targetRatio}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label>推力要求 (kN):</label>
              <input
                type="number"
                name="thrust"
                value={requirements.thrust}
                onChange={handleInputChange}
                min="0"
                step="0.1"
              />
            </div>
            
            <div className="form-group">
              <label>应用场景:</label>
              <select
                name="application"
                value={requirements.application}
                onChange={handleInputChange}
              >
                <option value="propulsion">主推进</option>
                <option value="auxiliary">辅助推进</option>
                <option value="other">其他应用</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>工作条件:</label>
              <select
                name="workCondition"
                value={requirements.workCondition}
                onChange={handleInputChange}
              >
                {workConditionOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>工作温度 (°C):</label>
              <input
                type="number"
                name="temperature"
                value={requirements.temperature}
                onChange={handleInputChange}
                min="0"
                step="1"
              />
            </div>
            
            <div className="form-group">
              <label>安全系数:</label>
              <input
                type="number"
                name="safetyFactor"
                value={requirements.safetyFactor}
                onChange={handleInputChange}
                min="1"
                max="3"
                step="0.1"
              />
            </div>
            
            <div className="form-group">
              <label>预算限制 (元):</label>
              <input
                type="number"
                name="budget"
                value={requirements.budget}
                onChange={handleInputChange}
                min="0"
                step="1000"
              />
            </div>
            
            <div className="form-group">
              <label>重量限制 (kg):</label>
              <input
                type="number"
                name="weightLimit"
                value={requirements.weightLimit}
                onChange={handleInputChange}
                min="0"
                step="1"
              />
            </div>
            
            <div className="button-group">
              <button type="submit" disabled={loading} className="primary-button">
                {loading ? '选型中...' : '开始选型'}
              </button>
              <button type="button" onClick={handleReset} className="secondary-button">
                重置
              </button>
            </div>
          </form>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
        </div>
        
        <div className="result-section">
          <h3>选型结果</h3>
          
          {loading && <div className="loading">正在计算最佳齿轮箱匹配...</div>}
          
          {selectionResult && !loading && (
            <div className="selection-result">
              {selectionResult.success ? (
                <>
                  <div className="result-header">
                    <h4>推荐齿轮箱: {selectionResult.result.gearbox.model}</h4>
                    <div className="score">
                      综合评分: <span className="score-value">{selectionResult.result.score.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="result-detail">
                    <h5>齿轮箱参数</h5>
                    <table className="detail-table">
                      <tbody>
                        <tr>
                          <td>减速比:</td>
                          <td>{selectionResult.result.gearbox.ratio.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>传递能力:</td>
                          <td>{selectionResult.result.gearbox.transferCapacity.toFixed(4)} kW/rpm</td>
                        </tr>
                        <tr>
                          <td>传递能力余量:</td>
                          <td>{selectionResult.result.gearbox.capacityMargin.toFixed(1)}%</td>
                        </tr>
                        <tr>
                          <td>输入转速:</td>
                          <td>{selectionResult.result.gearbox.inputSpeed.toFixed(1)} rpm</td>
                        </tr>
                        <tr>
                          <td>输出转速:</td>
                          <td>{selectionResult.result.gearbox.outputSpeed.toFixed(1)} rpm</td>
                        </tr>
                        <tr>
                          <td>推力:</td>
                          <td>{selectionResult.result.gearbox.thrust || 'N/A'} kN</td>
                        </tr>
                        <tr>
                          <td>重量:</td>
                          <td>{selectionResult.result.gearbox.weight || 'N/A'} kg</td>
                        </tr>
                        <tr>
                          <td>控制方式:</td>
                          <td>{selectionResult.result.gearbox.controlType || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td>出厂价格:</td>
                          <td>{formatPrice(selectionResult.result.gearbox.price)}</td>
                        </tr>
                        <tr>
                          <td>市场价格:</td>
                          <td>{formatPrice(selectionResult.result.gearbox.marketPrice)}</td>
                        </tr>
                      </tbody>
                    </table>
                    
                    {selectionResult.result.coupling && (
                      <>
                        <h5>推荐联轴器</h5>
                        <table className="detail-table">
                          <tbody>
                            <tr>
                              <td>型号:</td>
                              <td>{selectionResult.result.coupling.model}</td>
                            </tr>
                            <tr>
                              <td>额定扭矩:</td>
                              <td>{selectionResult.result.coupling.torque.toFixed(1)} kN·m</td>
                            </tr>
                            <tr>
                              <td>需求扭矩:</td>
                              <td>{selectionResult.result.coupling.requiredTorque.toFixed(2)} kN·m</td>
                            </tr>
                            <tr>
                              <td>扭矩余量:</td>
                              <td>{selectionResult.result.coupling.torqueMargin.toFixed(1)}%</td>
                            </tr>
                            <tr>
                              <td>最高转速:</td>
                              <td>{selectionResult.result.coupling.maxSpeed} rpm</td>
                            </tr>
                            <tr>
                              <td>重量:</td>
                              <td>{selectionResult.result.coupling.weight} kg</td>
                            </tr>
                            <tr>
                              <td>价格:</td>
                              <td>{formatPrice(selectionResult.result.coupling.price)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                    )}
                    
                    {selectionResult.result.pump && (
                      <>
                        <h5>推荐备用泵</h5>
                        <table className="detail-table">
                          <tbody>
                            <tr>
                              <td>型号:</td>
                              <td>{selectionResult.result.pump.model}</td>
                            </tr>
                            <tr>
                              <td>流量:</td>
                              <td>{selectionResult.result.pump.flow} L/min</td>
                            </tr>
                            <tr>
                              <td>压力:</td>
                              <td>{selectionResult.result.pump.pressure} MPa</td>
                            </tr>
                            <tr>
                              <td>电机功率:</td>
                              <td>{selectionResult.result.pump.motorPower} kW</td>
                            </tr>
                            <tr>
                              <td>重量:</td>
                              <td>{selectionResult.result.pump.weight} kg</td>
                            </tr>
                            <tr>
                              <td>价格:</td>
                              <td>{formatPrice(selectionResult.result.pump.price)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                    )}
                    
                    <div className="total-section">
                      <h5>总计</h5>
                      <div className="total-row">
                        <span>总价格:</span>
                        <span className="total-value">{formatPrice(selectionResult.result.totalPrice)}</span>
                      </div>
                      <div className="total-row">
                        <span>总市场价格:</span>
                        <span className="total-value">{formatPrice(selectionResult.result.totalMarketPrice)}</span>
                      </div>
                      <div className="total-row">
                        <span>总重量:</span>
                        <span className="total-value">{selectionResult.result.totalWeight.toFixed(1)} kg</span>
                      </div>
                    </div>
                    
                    {selectionResult.result.warnings && selectionResult.result.warnings.length > 0 && (
                      <div className="warnings-section">
                        <h5>注意事项</h5>
                        <ul className="warnings-list">
                          {selectionResult.result.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {selectionResult.recommendations && selectionResult.recommendations.length > 1 && (
                    <div className="other-recommendations">
                      <h5>其他推荐选项</h5>
                      <table className="recommendations-table">
                        <thead>
                          <tr>
                            <th>型号</th>
                            <th>减速比</th>
                            <th>传递能力余量</th>
                            <th>评分</th>
                            <th>价格</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectionResult.recommendations.slice(1).map((rec, index) => (
                            <tr key={index}>
                              <td>{rec.model}</td>
                              <td>{rec.ratio.toFixed(2)}</td>
                              <td>{rec.capacityMargin.toFixed(1)}%</td>
                              <td>{rec.score.toFixed(2)}</td>
                              <td>{formatPrice(rec.price)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-result">
                  <p>{selectionResult.message}</p>
                  
                  {selectionResult.recommendations && selectionResult.recommendations.length > 0 && (
                    <div className="alternative-recommendations">
                      <h5>接近条件的齿轮箱</h5>
                      <table className="recommendations-table">
                        <thead>
                          <tr>
                            <th>型号</th>
                            <th>减速比</th>
                            <th>传递能力余量</th>
                            <th>评分</th>
                            <th>价格</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectionResult.recommendations.map((rec, index) => (
                            <tr key={index}>
                              <td>{rec.model}</td>
                              <td>{rec.ratio.toFixed(2)}</td>
                              <td>{rec.capacityMargin.toFixed(1)}%</td>
                              <td>{rec.score.toFixed(2)}</td>
                              <td>{formatPrice(rec.price)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {!selectionResult && !loading && (
            <div className="no-result">
              <p>请输入参数并点击"开始选型"按钮</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectionInterface;