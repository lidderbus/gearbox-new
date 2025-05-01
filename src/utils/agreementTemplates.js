// src/utils/agreementTemplates.js
/**
 * 技术协议模板内容
 * 分离模板字符串以减小单个文件大小，避免编译问题
 * 使用转义字符处理HTML标签，防止被误解为JSX
 */

// GWC系列模板 - 中文
export const gwcChineseTemplate = 
`<div class="agreement-container">
  <h1 class="agreement-title">"GWC/GWL"系列船用齿轮箱订货技术协议</h1>
  
  <section class="agreement-header">
    <div class="parties">
      <div class="party">
        <p>船东: {{shipOwner}}</p>
        <p>签字：_______________ 日期：_______________</p>
      </div>
      <div class="party">
        <p>船厂/需方（甲方）：{{shipyard}}</p>
        <p>签字：_______________ 日期：_______________</p>
      </div>
      <div class="party">
        <p>制造厂（乙方）：杭州前进齿轮箱集团股份有限公司</p>
        <p>签字：_______________ 日期：_______________</p>
      </div>
    </div>
  </section>
  
  <section id="ship-info-section" class="agreement-section">
    <h2>1. 船舶信息</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">船舶类型:</div>
        <div class="info-value">{{shipType}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">船舶制造单位:</div>
        <div class="info-value">{{shipManufacturer}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">船舶工程号:</div>
        <div class="info-value">{{shipProjectNumber}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">船舶设计单位:</div>
        <div class="info-value">{{shipDesigner}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">船检要求:</div>
        <div class="info-value">
          <div class="checkbox-group">
            <label><input type="checkbox" {{ccsEntry}}> CCS 入级</label>
            <label><input type="checkbox" {{ccsNonEntry}}> CCS 非入级</label>
            <label><input type="checkbox" {{ccsFishingVessel}}> CCS 远洋渔船</label>
            <label><input type="checkbox" {{zyFishingVessel}}> ZY 国内渔船</label>
            <label><input type="checkbox" {{foreignShipInspection}}> 国外船检：__________</label>
          </div>
          <div class="sub-info">船级社注册号：{{registrationNumber}}</div>
        </div>
      </div>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>2. 主机信息</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">主机型号:</div>
        <div class="info-value">{{engineModel}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">主机转向（面向飞轮）:</div>
        <div class="info-value">
          <div class="checkbox-group">
            <label><input type="checkbox" {{clockwise}}> 顺时针</label>
            <label><input type="checkbox" {{counterClockwise}}> 逆时针</label>
          </div>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">主机额定功率 (kW):</div>
        <div class="info-value">{{enginePower}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">主机额定转速 (r/min):</div>
        <div class="info-value">{{engineSpeed}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">主机最低稳定转速:</div>
        <div class="info-value">
          <div class="checkbox-group">
            <label><input type="checkbox" {{minSpeedIsPercent}}> {{minSpeed}}%额定转速</label>
            <label><input type="checkbox" {{minSpeedIsOther}}> 其它：{{minSpeedOther}}</label>
          </div>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">使用工况:</div>
        <div class="info-value">
          <div class="checkbox-group">
            <label><input type="checkbox" {{mainPropulsion}}> 主推进</label>
            <label><input type="checkbox" {{otherPropulsion}}> 其它</label>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>3. 齿轮箱信息</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">齿轮箱型号:</div>
        <div class="info-value">{{gearboxModel}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">减速比:</div>
        <div class="info-value">{{reductionRatio}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">排列方式:</div>
        <div class="info-value">{{arrangement}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">输入联轴节:</div>
        <div class="info-value">{{inputCoupling}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">订货数量:</div>
        <div class="info-value">{{quantity}}台/船</div>
      </div>
      <div class="info-row">
        <div class="info-label">交货时间:</div>
        <div class="info-value">{{deliveryTime}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">监控系统:</div>
        <div class="info-value">
          <div class="checkbox-group">
            <label><input type="checkbox" {{standardMonitoring}}> 标配</label>
            <label><input type="checkbox" {{specialMonitoring}}> 特配</label>
          </div>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">操控方式:</div>
        <div class="info-value">
          <div class="checkbox-group">
            <label><input type="checkbox" {{manualControl}}> 手控</label>
            <label><input type="checkbox" {{electricControl}}> 电控（远距离电动遥控操纵，输入额定电压{{controlVoltage}}V）</label>
            <label><input type="checkbox" {{pneumaticControl}}> 气控</label>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>4. 成套配件</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">高弹联轴器型号:</div>
        <div class="info-value">{{couplingModel}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">高弹联轴器成套方:</div>
        <div class="info-value">
          <div class="checkbox-group">
            <label><input type="checkbox" {{couplingBySupplier}}> 供方</label>
            <label><input type="checkbox" {{couplingByDemander}}> 需方</label>
          </div>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">备用泵机组型号:</div>
        <div class="info-value">{{pumpModel}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">备用泵机组成套方:</div>
        <div class="info-value">
          <div class="checkbox-group">
            <label><input type="checkbox" {{pumpBySupplier}}> 供方</label>
            <label><input type="checkbox" {{pumpByDemander}}> 需方</label>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <section id="quality-section" class="agreement-section">
    <h2>5. 质量保证</h2>
    <div class="content-text">
      <ol>
        <li>齿轮箱的出厂试验按船级社认可的齿轮箱出厂试验规范进行。</li>
        <li>乙方台架试验前7天通知甲方，甲方可派人员参加试验，且需由船东代表和验船师在场的情况下进行。</li>
        <li>船厂必须按乙方提供的使用保养说明书安装、使用和维护保养。</li>
        <li>交船后一年内，确因乙方制造不良而造成的质量问题，乙方免费提供零件，并派人进行修理和技术服务。</li>
      </ol>
    </div>
  </section>
  
  <section id="maintenance-section" class="agreement-section">
    <h2>6. 技术服务</h2>
    <div class="content-text">
      <ol>
        <li>乙方应在协议生效后10天内提供齿轮箱外形图、电气接线图等认可资料给甲方，甲方在接到认可图10天内意见反馈。</li>
        <li>乙方提供详细的安装、使用和维护说明书。</li>
        <li>乙方可应甲方要求提供技术培训和现场安装指导服务。</li>
      </ol>
    </div>
  </section>
  
  <section id="attachment-section" class="agreement-section">
    <h2>7. 随机文件</h2>
    <div class="content-text">
      <ol>
        <li>使用说明书 1份</li>
        <li>产品合格证 1份</li>
        <li>装箱清单 1份</li>
        <li>船检证书 1份</li>
        <li>电气接线图 1份</li>
      </ol>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>8. 特殊订货要求</h2>
    <div class="content-text special-requirements">
      {{specialRequirements}}
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>9. 未尽事宜</h2>
    <div class="content-text">
      <p>未尽事宜友好协商解决。</p>
    </div>
  </section>
</div>`;

// GWC系列模板 - 英文
export const gwcEnglishTemplate = 
`<div class="agreement-container">
  <h1 class="agreement-title">Technical Agreement for "GWC/GWL" Series Marine Gearbox</h1>
  
  <section class="agreement-header">
    <div class="parties">
      <div class="party">
        <p>Ship Owner: {{shipOwner}}</p>
        <p>Signature: _______________ Date: _______________</p>
      </div>
      <div class="party">
        <p>Shipyard/Buyer (Party A): {{shipyard}}</p>
        <p>Signature: _______________ Date: _______________</p>
      </div>
      <div class="party">
        <p>Manufacturer (Party B): Hangzhou Advance Gearbox Group Co., Ltd.</p>
        <p>Signature: _______________ Date: _______________</p>
      </div>
    </div>
  </section>
  
  <section id="ship-info-section" class="agreement-section">
    <h2>1. Vessel Information</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">Vessel Type:</div>
        <div class="info-value">{{shipType}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Shipbuilder:</div>
        <div class="info-value">{{shipManufacturer}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Hull Number:</div>
        <div class="info-value">{{shipProjectNumber}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Vessel Designer:</div>
        <div class="info-value">{{shipDesigner}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Classification Requirements:</div>
        <div class="info-value">
          <div class="checkbox-group">
            <label><input type="checkbox" {{ccsEntry}}> CCS Entry</label>
            <label><input type="checkbox" {{ccsNonEntry}}> CCS Non-Entry</label>
            <label><input type="checkbox" {{ccsFishingVessel}}> CCS Ocean Fishing Vessel</label>
            <label><input type="checkbox" {{zyFishingVessel}}> ZY Domestic Fishing Vessel</label>
            <label><input type="checkbox" {{foreignShipInspection}}> Foreign Classification: __________</label>
          </div>
          <div class="sub-info">Classification Society Registration No.: {{registrationNumber}}</div>
        </div>
      </div>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>2. Engine Information</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">Engine Model:</div>
        <div class="info-value">{{engineModel}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Engine Rotation (Facing Flywheel):</div>
        <div class="info-value">
          <div class="checkbox-group">
            <label><input type="checkbox" {{clockwise}}> Clockwise</label>
            <label><input type="checkbox" {{counterClockwise}}> Counter-Clockwise</label>
          </div>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">Rated Power (kW):</div>
        <div class="info-value">{{enginePower}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Rated Speed (r/min):</div>
        <div class="info-value">{{engineSpeed}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Minimum Stable Speed:</div>
        <div class="info-value">
          <div class="checkbox-group">
            <label><input type="checkbox" {{minSpeedIsPercent}}> {{minSpeed}}% of Rated Speed</label>
            <label><input type="checkbox" {{minSpeedIsOther}}> Other: {{minSpeedOther}}</label>
          </div>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">Operating Condition:</div>
        <div class="info-value">
          <div class="checkbox-group">
            <label><input type="checkbox" {{mainPropulsion}}> Main Propulsion</label>
            <label><input type="checkbox" {{otherPropulsion}}> Others</label>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>3. Gearbox Information</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">Gearbox Model:</div>
        <div class="info-value">{{gearboxModel}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Reduction Ratio:</div>
        <div class="info-value">{{reductionRatio}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Arrangement:</div>
        <div class="info-value">{{arrangement}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Input Coupling:</div>
        <div class="info-value">{{inputCoupling}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Order Quantity:</div>
        <div class="info-value">{{quantity}} unit(s)/vessel</div>
      </div>
      <div class="info-row">
        <div class="info-label">Delivery Time:</div>
        <div class="info-value">{{deliveryTime}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Monitoring System:</div>
        <div class="info-value">
          <div class="checkbox-group">
            <label><input type="checkbox" {{standardMonitoring}}> Standard</label>
            <label><input type="checkbox" {{specialMonitoring}}> Special</label>
          </div>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">Control Method:</div>
        <div class="info-value">
          <div class="checkbox-group">
            <label><input type="checkbox" {{manualControl}}> Manual Control</label>
            <label><input type="checkbox" {{electricControl}}> Electric Control (Remote electric control, rated input voltage {{controlVoltage}}V)</label>
            <label><input type="checkbox" {{pneumaticControl}}> Pneumatic Control</label>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>4. Accessories</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">Flexible Coupling Model:</div>
        <div class="info-value">{{couplingModel}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Supplied By:</div>
        <div class="info-value">
          <div class="checkbox-group">
            <label><input type="checkbox" {{couplingBySupplier}}> Supplier</label>
            <label><input type="checkbox" {{couplingByDemander}}> Buyer</label>
          </div>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">Standby Pump Model:</div>
        <div class="info-value">{{pumpModel}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Supplied By:</div>
        <div class="info-value">
          <div class="checkbox-group">
            <label><input type="checkbox" {{pumpBySupplier}}> Supplier</label>
            <label><input type="checkbox" {{pumpByDemander}}> Buyer</label>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <section id="quality-section" class="agreement-section">
    <h2>5. Quality Assurance</h2>
    <div class="content-text">
      <ol>
        <li>The factory test of the gearbox shall be carried out according to the factory test specifications approved by the classification society.</li>
        <li>Party B shall notify Party A 7 days before the bench test. Party A may send personnel to participate in the test, which shall be conducted in the presence of the shipowner's representative and the surveyor.</li>
        <li>The shipyard must install, use and maintain the gearbox according to the operation and maintenance manual provided by Party B.</li>
        <li>Within one year after delivery of the vessel, for quality problems caused by poor manufacturing of Party B, Party B shall provide parts free of charge and send personnel for repair and technical service.</li>
      </ol>
    </div>
  </section>
  
  <section id="maintenance-section" class="agreement-section">
    <h2>6. Technical Service</h2>
    <div class="content-text">
      <ol>
        <li>Party B shall provide the approval materials such as the outline drawing of the gearbox and the electrical wiring diagram to Party A within 10 days after the agreement takes effect. Party A shall provide feedback within 10 days after receiving the approval drawings.</li>
        <li>Party B shall provide detailed installation, operation and maintenance instructions.</li>
        <li>Party B may provide technical training and on-site installation guidance services at the request of Party A.</li>
      </ol>
    </div>
  </section>
  
  <section id="attachment-section" class="agreement-section">
    <h2>7. Accompanying Documents</h2>
    <div class="content-text">
      <ol>
        <li>Operation Manual (1 copy)</li>
        <li>Product Certificate (1 copy)</li>
        <li>Packing List (1 copy)</li>
        <li>Classification Certificate (1 copy)</li>
        <li>Electrical Wiring Diagram (1 copy)</li>
      </ol>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>8. Special Order Requirements</h2>
    <div class="content-text special-requirements">
      {{specialRequirements}}
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>9. Other Matters</h2>
    <div class="content-text">
      <p>Other matters not covered in this agreement shall be settled through friendly consultation.</p>
    </div>
  </section>
</div>`;

// HCT系列模板 - 中文
export const hctChineseTemplate = 
`<div class="agreement-container">
  <h1 class="agreement-title">HCT系列船用齿轮箱技术协议</h1>
  
  <section class="agreement-header">
    <div class="parties">
      <div class="party">
        <p>项目编号/船型: {{projectNumber}}</p>
      </div>
      <div class="party">
        <p>船东: {{shipOwner}}</p>
        <p>签字：_______________ 日期：_______________</p>
      </div>
      <div class="party">
        <p>船厂: {{shipyard}}</p>
        <p>签字：_______________ 日期：_______________</p>
      </div>
      <div class="party">
        <p>设计方: {{designer}}</p>
        <p>签字：_______________ 日期：_______________</p>
      </div>
      <div class="party">
        <p>制造商: 杭州前进齿轮箱集团股份有限公司</p>
        <p>签字：_______________ 日期：_______________</p>
      </div>
    </div>
  </section>

  <section class="agreement-intro">
    <h2>技术协议总则</h2>
    <p>为订购杭州前进齿轮箱集团股份有限公司生产的前进牌船用齿轮箱，甲乙双方就有关技术问题达成如下协议。</p>
  </section>
  
  <section class="agreement-section">
    <h2>1. 齿轮箱使用工况</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">动力机组布置方式:</div>
        <div class="info-value">{{powerArrangement}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">机组排列及旋转示意图（顺车）:</div>
        <div class="info-value">{{arrangementDiagram}}</div>
      </div>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>2. 柴油机主要参数</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">型号:</div>
        <div class="info-value">{{engineModel}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">额定功率:</div>
        <div class="info-value">{{enginePower}} kW</div>
      </div>
      <div class="info-row">
        <div class="info-label">额定转速:</div>
        <div class="info-value">{{engineSpeed}} r/min</div>
      </div>
      <div class="info-row">
        <div class="info-label">转向（面对飞轮端向自由端看）:</div>
        <div class="info-value">{{engineRotation}}</div>
      </div>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>3. 齿轮箱主要参数</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">功能:</div>
        <div class="info-value">{{gearboxFunctions}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">配套主机额定转速:</div>
        <div class="info-value">{{gearboxRatedSpeed}} r/min</div>
      </div>
      <div class="info-row">
        <div class="info-label">输入联轴节型式:</div>
        <div class="info-value">{{inputCoupling}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">减速比及相应传递能力:</div>
        <div class="info-value">i={{reductionRatio}}; p/n={{transmissionCapacity}} kW/r.min</div>
      </div>
      <div class="info-row">
        <div class="info-label">输入轴转向（面对输出端向前看）:</div>
        <div class="info-value">{{inputRotation}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">顺车输出轴转向（与输入轴比较）:</div>
        <div class="info-value">{{outputRotation}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">额定螺旋桨推力:</div>
        <div class="info-value">{{propellerThrust}} kN</div>
      </div>
      <div class="info-row">
        <div class="info-label">机械效率:</div>
        <div class="info-value">≥{{mechanicalEfficiency}}%</div>
      </div>
      <div class="info-row">
        <div class="info-label">换向时间:</div>
        <div class="info-value">≤{{reversalTime}}s</div>
      </div>
      <div class="info-row">
        <div class="info-label">工作油压:</div>
        <div class="info-value">{{workingOilPressure}} MPa</div>
      </div>
      <div class="info-row">
        <div class="info-label">机油牌号:</div>
        <div class="info-value">{{oilGrade}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">最高油温:</div>
        <div class="info-value">≤{{maxOilTemperature}}℃</div>
      </div>
      <div class="info-row">
        <div class="info-label">可工作倾斜度:</div>
        <div class="info-value">纵倾{{longitudinalInclination}}°，横倾{{transverseInclination}}°</div>
      </div>
      <div class="info-row">
        <div class="info-label">大修期:</div>
        <div class="info-value">≥{{overhaul}}h</div>
      </div>
      <div class="info-row">
        <div class="info-label">操纵系统:</div>
        <div class="info-value">{{controlSystem}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">机油容量:</div>
        <div class="info-value">{{oilCapacity}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">冷却水:</div>
        <div class="info-value">冷却水耗量≥{{coolingWaterFlow}} t/h; 冷却水进口温度≤{{coolingWaterTemperature}}℃; 压力≤{{coolingWaterPressure}}MPa</div>
      </div>
      <div class="info-row">
        <div class="info-label">船级社:</div>
        <div class="info-value">{{classificationSociety}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">净重:</div>
        <div class="info-value">{{netWeight}}kg</div>
      </div>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>4. 齿轮箱监控配置</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">机旁仪表:</div>
        <div class="info-value">
          <ul>
            <li>工作油压表1只</li>
            <li>滑油压力表1只</li>
            <li>滑油温度表1只</li>
          </ul>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">报警指示:</div>
        <div class="info-value">
          <ul>
            <li>滑油压力低控制器1只（滑油压力低报警，下降至{{lowOilPressureAlarm}}MPa时动作），输入到主机机旁仪表箱进行滑油油压低报警（标记相应铭牌）。</li>
            <li>工作油压力低控制器1只（工作油压力低报警，降至{{lowWorkingOilPressureAlarm}}MPa时动作），输入到主机机旁仪表箱进行工作油压低报警（标记相应铭牌）。</li>
            <li>滑油温度高控制器1只（滑油温度高报警，油温高于{{highOilTemperatureAlarm}}℃时动作），输入到主机机旁仪表箱进行滑油温度高报警（标记相应铭牌）。</li>
          </ul>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">显示信号输出:</div>
        <div class="info-value">
          <ul>
            <li>滑油温度传感器1只，输出4-20mA模拟量信号。</li>
            <li>滑油压力传感器1只，输出4-20mA模拟量信号。</li>
            <li>工作油压力传感器1只，输出4-20mA模拟量信号。</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>5. 齿轮箱的随机技术资料</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">使用说明书</div>
        <div class="info-value">1份</div>
      </div>
      <div class="info-row">
        <div class="info-label">提供CCS认可的产品合格证书</div>
        <div class="info-value">1份</div>
      </div>
      <div class="info-row">
        <div class="info-label">装箱清单</div>
        <div class="info-value">1份</div>
      </div>
      <div class="info-row">
        <div class="info-label">CCS证书入级</div>
        <div class="info-value">1份</div>
      </div>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>6. 质量保证和技术服务</h2>
    <div class="content-text">
      <ol>
        <li>齿轮箱的出厂试验按工厂试验大纲进行。</li>
        <li>甲方必须按本厂提供的使用说明书安装、使用和保养。</li>
        <li>齿轮箱"三包"按制造厂有关规定执行。</li>
        <li>售后服务联系电话{{servicePhone}}。</li>
        <li>质保期交货后18个月或交船后12个月先到为准。</li>
      </ol>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>7. 供货范围（每船）</h2>
    <div class="content-text">
      <table>
        <tr>
          <th>序号</th>
          <th>名称</th>
          <th>规格</th>
          <th>数量</th>
          <th>备注</th>
        </tr>
        <tr>
          <td>1</td>
          <td>齿轮箱</td>
          <td>{{gearboxModel}}</td>
          <td>{{quantity}}台</td>
          <td>电控</td>
        </tr>
        <tr>
          <td>2</td>
          <td>高弹联轴器</td>
          <td></td>
          <td>{{quantity}}台</td>
          <td>提供轴系扭振计算书</td>
        </tr>
        <tr>
          <td>3</td>
          <td>接线盒</td>
          <td></td>
          <td>{{quantity}}个</td>
          <td>机带</td>
        </tr>
        <tr>
          <td>4</td>
          <td>监控</td>
          <td>AUTO-1</td>
          <td>{{quantity}}套</td>
          <td>三表四报警二指示三显示</td>
        </tr>
        <tr>
          <td>5</td>
          <td>备件</td>
          <td></td>
          <td>1套</td>
          <td>易损密封件</td>
        </tr>
      </table>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>8. 未尽事宜</h2>
    <div class="content-text">
      <p>本协议作为齿轮箱的设计制造、质量检验、交货验收的技术依据，作为订货合同的附件。未尽事宜双方友好协商解决。</p>
    </div>
  </section>
</div>`;

// HC系列模板 - 中文
export const hcChineseTemplate = 
`<div class="agreement-container">
  <h1 class="agreement-title">HC系列船用齿轮箱技术协议</h1>
  
  <section class="agreement-header">
    <div class="parties">
      <div class="party">
        <p>船东: {{shipOwner}}</p>
        <p>签字：_______________ 日期：_______________</p>
      </div>
      <div class="party">
        <p>船厂/设计院: {{shipyardOrDesigner}}</p>
        <p>签字：_______________ 日期：_______________</p>
      </div>
      <div class="party">
        <p>制造厂: 杭州前进齿轮箱集团股份有限公司</p>
        <p>签字：_______________ 日期：_______________</p>
      </div>
    </div>
  </section>

  <section class="agreement-intro">
    <p>各方就选用杭州前进齿轮箱集团股份有限公司生产的{{gearboxModel}}型船用齿轮箱和高弹性联轴器事宜，经双方友好协商，就有关技术问题达成协议如下：</p>
  </section>
  
  <section class="agreement-section">
    <h2>一、主机技术参数</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">1. 额定功率：</div>
        <div class="info-value">{{enginePower}} kW</div>
      </div>
      <div class="info-row">
        <div class="info-label">2. 额定转速：</div>
        <div class="info-value">{{engineSpeed}} r/min</div>
      </div>
      <div class="info-row">
        <div class="info-label">3. 转向：</div>
        <div class="info-value">{{engineRotation}}（双向旋转）</div>
      </div>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>二、齿轮箱技术参数</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">1. 型号：</div>
        <div class="info-value">{{gearboxModel}}（具有减速和承受螺旋桨推力的功能）</div>
      </div>
      <div class="info-row">
        <div class="info-label">2. 减速比：</div>
        <div class="info-value">{{reductionRatio}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">3. 额定传递能力：</div>
        <div class="info-value">{{transmissionCapacity}} kW/rpm</div>
      </div>
      <div class="info-row">
        <div class="info-label">4. 输入转速：</div>
        <div class="info-value">0～{{maxInputSpeed}}rpm</div>
      </div>
      <div class="info-row">
        <div class="info-label">5. 输出转向：</div>
        <div class="info-value">与输入相反</div>
      </div>
      <div class="info-row">
        <div class="info-label">6. 润滑油压：</div>
        <div class="info-value">{{lubricationOilPressure}} MPa</div>
      </div>
      <div class="info-row">
        <div class="info-label">7. 螺旋桨最大推力：</div>
        <div class="info-value">{{maxPropellerThrust}} kN</div>
      </div>
      <div class="info-row">
        <div class="info-label">8. 中心距：</div>
        <div class="info-value">{{centerDistance}} mm</div>
      </div>
      <div class="info-row">
        <div class="info-label">9. 油温：</div>
        <div class="info-value">≤{{maxOilTemperature}}℃</div>
      </div>
      <div class="info-row">
        <div class="info-label">10. 机油容积：</div>
        <div class="info-value">约 {{oilCapacity}}L</div>
      </div>
      <div class="info-row">
        <div class="info-label">11. 机油牌号：</div>
        <div class="info-value">{{oilGrade}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">12. 冷却水进水温度：</div>
        <div class="info-value">≤{{coolingWaterInletTemperature}}℃</div>
      </div>
      <div class="info-row">
        <div class="info-label">13. 冷却水量：</div>
        <div class="info-value">≥{{coolingWaterVolume}}t/h,冷却水进口压力≤{{coolingWaterPressure}} MPa</div>
      </div>
      <div class="info-row">
        <div class="info-label">14. 机械效率：</div>
        <div class="info-value">≥{{mechanicalEfficiency}}%</div>
      </div>
      <div class="info-row">
        <div class="info-label">15.（正车）转向：</div>
        <div class="info-value">{{forwardDirection}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">16. 倾斜度：</div>
        <div class="info-value">纵倾 {{longitudinalInclination}}°，横倾 {{transverseInclination}}°；纵摇 {{longitudinalShaking}}°，横倾 {{transverseShaking}}°</div>
      </div>
      <div class="info-row">
        <div class="info-label">17. 安装方式：</div>
        <div class="info-value">{{installationMethod}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">18. 电动滑油泵：</div>
        <div class="info-value">{{lubricationOilPump}}，技术参数以认可资料为准。</div>
      </div>
      <div class="info-row">
        <div class="info-label">19. 大修时间：</div>
        <div class="info-value">{{overhaulTime}} 小时</div>
      </div>
      <div class="info-row">
        <div class="info-label">20. 齿轮箱铭牌材质：</div>
        <div class="info-value">{{nameplateSpecification}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">21. 仪表与报警：</div>
        <div class="info-value">{{instrumentsAndAlarms}}</div>
      </div>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>三、高弹性联轴器</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">1. 制造厂家：</div>
        <div class="info-value">{{couplingManufacturer}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">2. 高弹型号：</div>
        <div class="info-value">{{couplingModel}}（以认可资料为准）</div>
      </div>
      <div class="info-row">
        <div class="info-label">3. 附带与电机和齿轮箱的联接件：</div>
        <div class="info-value">{{couplingConnections}}</div>
      </div>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>四、供货范围</h2>
    <div class="content-text">
      <ol>
        <li>{{gearboxModel}} 船用齿轮箱（含滑油泵机组）（{{quantity}}台/船）
          <p>随机附带使用说明书1份/台、外形安装图1份/台、电气接线图1份/台、产品合格证书1份/台，提供CCS船检产品证书（非入级）1份/台。</p>
        </li>
        <li>高弹（{{quantity}}台/船）
          <p>随机附带使用说明书1份/台、外形安装图1份/台、产品合格证书1份/台，提供CCS船检书1份/台。</p>
          <p>配齐与电机、齿轮箱的联接件。</p>
        </li>
      </ol>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>五、质量保证及服务</h2>
    <div class="content-text">
      <ol>
        <li>在协议生效后 {{approvalPeriod}} 天内，制造厂向设计院、船厂提供认可资料（外形及安装图、电气接线图），均采用 CAD 电子版。设计院、船厂在接到认可资料 {{feedbackPeriod}} 天内意见反馈。</li>
        <li>交货试验在制造厂的试验台位上进行，按 CCS 有关规范和认可的试验大纲进行检验和验收，并出具合格证明书。试验前一周通知各方。</li>
        <li>油封有效期为自发货之日起一年。</li>
        <li>使用方必须按本厂提供的使用说明书安装、使用和保养，在交船（船厂与船东签订协议之日）后 {{warrantyPeriod}} 内确因设计及制造不良而造成的质量问题，制造厂保证免费提供零件，并派人进行修理和技术服务。</li>
        <li>本协议作为齿轮箱的设计制造、质量检验、交货验收的技术依据，作为订货合同的附件。任何技术协议中未提及的细节由认可图决定，将被认为是技术协议的一部分。除买卖双方书面同意修改外，任何与技术协议不符的应以技术协议为准。协议中未提及，但是属于设备正常安装、使用或适用的法规规范所要求的附件及备件，将由卖方无偿提供。</li>
        <li>未尽事宜各方协商解决。</li>
      </ol>
    </div>
  </section>
</div>`;

// DT系列模板 - 中文
export const dtChineseTemplate = 
`<div class="agreement-container">
  <h1 class="agreement-title">DT系列船用齿轮箱技术协议</h1>
  
  <section class="agreement-header">
    <div class="parties">
      <div class="party">
        <p>船东: {{shipOwner}}</p>
        <p>签字：_______________ 日期：_______________</p>
      </div>
      <div class="party">
        <p>船厂/需方（甲方）：{{shipyard}}</p>
        <p>签字：_______________ 日期：_______________</p>
      </div>
      <div class="party">
        <p>制造厂（乙方）：杭州前进齿轮箱集团股份有限公司</p>
        <p>签字：_______________ 日期：_______________</p>
      </div>
    </div>
  </section>

  <section class="agreement-intro">
    <p>总则：</p>
    <p>法规与规范</p>
    <p>{{regulations}}</p>
  </section>
  
  <section class="agreement-section">
    <h2>一、主机技术参数：</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">1. 额定功率：</div>
        <div class="info-value">{{enginePower}} kW</div>
      </div>
      <div class="info-row">
        <div class="info-label">2. 额定转速：</div>
        <div class="info-value">{{engineSpeed}} r/min</div>
      </div>
      <div class="info-row">
        <div class="info-label">3. 转向：</div>
        <div class="info-value">{{engineRotation}}</div>
      </div>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>二、齿轮箱技术参数：</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">1. 型号：</div>
        <div class="info-value">{{gearboxModel}}（具有减速和承受螺旋桨推力的功能）</div>
      </div>
      <div class="info-row">
        <div class="info-label">2. 减速比：</div>
        <div class="info-value">{{reductionRatio}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">3. 额定传递能力：</div>
        <div class="info-value">{{transmissionCapacity}} kW/rpm</div>
      </div>
      <div class="info-row">
        <div class="info-label">4. 输入转速：</div>
        <div class="info-value">0～{{maxInputSpeed}}rpm</div>
      </div>
      <div class="info-row">
        <div class="info-label">5. 输出转向：</div>
        <div class="info-value">与输入相反</div>
      </div>
      <div class="info-row">
        <div class="info-label">6. 润滑油压：</div>
        <div class="info-value">{{lubricationOilPressure}} MPa</div>
      </div>
      <div class="info-row">
        <div class="info-label">7. 螺旋桨最大推力：</div>
        <div class="info-value">{{maxPropellerThrust}} kN</div>
      </div>
      <div class="info-row">
        <div class="info-label">8. 中心距：</div>
        <div class="info-value">{{centerDistance}} mm</div>
      </div>
      <div class="info-row">
        <div class="info-label">9. 油温：</div>
        <div class="info-value">≤{{maxOilTemperature}}℃</div>
      </div>
      <div class="info-row">
        <div class="info-label">10. 机油容积：</div>
        <div class="info-value">约 {{oilCapacity}}L</div>
      </div>
      <div class="info-row">
        <div class="info-label">11. 机油牌号：</div>
        <div class="info-value">{{oilGrade}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">12. 冷却水进水温度：</div>
        <div class="info-value">≤{{coolingWaterInletTemperature}}℃</div>
      </div>
      <div class="info-row">
        <div class="info-label">13. 冷却水量：</div>
        <div class="info-value">≥{{coolingWaterVolume}}t/h,冷却水进口压力≤{{coolingWaterPressure}} MPa</div>
      </div>
      <div class="info-row">
        <div class="info-label">14. 机械效率：</div>
        <div class="info-value">≥{{mechanicalEfficiency}}%</div>
      </div>
      <div class="info-row">
        <div class="info-label">15.（正车）转向：</div>
        <div class="info-value">{{forwardDirection}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">16. 倾斜度：</div>
        <div class="info-value">纵倾 {{longitudinalInclination}}°，横倾 {{transverseInclination}}°；纵摇 {{longitudinalShaking}}°，横倾 {{transverseShaking}}°</div>
      </div>
      <div class="info-row">
        <div class="info-label">17. 安装方式：</div>
        <div class="info-value">{{installationMethod}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">18. 电动滑油泵：</div>
        <div class="info-value">{{lubricationOilPump}}，技术参数以认可资料为准。</div>
      </div>
      <div class="info-row">
        <div class="info-label">19. 大修时间：</div>
        <div class="info-value">{{overhaulTime}} 小时</div>
      </div>
      <div class="info-row">
        <div class="info-label">20. 齿轮箱铭牌材质：</div>
        <div class="info-value">{{nameplateSpecification}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">21. 仪表与报警：</div>
        <div class="info-value">{{instrumentsAndAlarms}}</div>
      </div>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>三、高弹性联轴器</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">1. 制造厂家：</div>
        <div class="info-value">{{couplingManufacturer}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">2. 高弹型号：</div>
        <div class="info-value">{{couplingModel}}（以认可资料为准）</div>
      </div>
      <div class="info-row">
        <div class="info-label">3. 附带与电机和齿轮箱的联接件：</div>
        <div class="info-value">{{couplingConnections}}</div>
      </div>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>四、供货范围</h2>
    <div class="content-text">
      <ol>
        <li>{{gearboxModel}} 船用齿轮箱（含滑油泵机组）（{{quantity}}台/船）
          <p>随机附带使用说明书1份/台、外形安装图1份/台、电气接线图1份/台、产品合格证书1份/台，提供CCS船检产品证书（非入级）1份/台。</p>
        </li>
        <li>高弹（{{quantity}}台/船）
          <p>随机附带使用说明书1份/台、外形安装图1份/台、产品合格证书1份/台，提供CCS船检书1份/台。</p>
          <p>配齐与电机、齿轮箱的联接件。</p>
        </li>
      </ol>
    </div>
  </section>
  
  <section class="agreement-section">
    <h2>五、质量保证及服务</h2>
    <div class="content-text">
      <ol>
        <li>在协议生效后 {{approvalPeriod}} 天内，制造厂向设计院、船厂提供认可资料（外形及安装图、电气接线图），均采用 CAD 电子版。设计院、船厂在接到认可资料 {{feedbackPeriod}} 天内意见反馈。</li>
        <li>交货试验在制造厂的试验台位上进行，按 CCS 有关规范和认可的试验大纲进行检验和验收，并出具合格证明书。试验前一周通知各方。</li>
        <li>油封有效期为自发货之日起一年。</li>
        <li>使用方必须按本厂提供的使用说明书安装、使用和保养，在交船（船厂与船东签订协议之日）后{{warrantyPeriod}}内确因设计及制造不良而造成的质量问题，制造厂保证免费提供零件，并派人进行修理和技术服务。</li>
        <li>本协议作为齿轮箱的设计制造、质量检验、交货验收的技术依据，作为订货合同的附件。任何技术协议中未提及的细节由认可图决定，将被认为是技术协议的一部分。除买卖双方书面同意修改外，任何与技术协议不符的应以技术协议为准。协议中未提及，但是属于设备正常安装、使用或适用的法规规范所要求的附件及备件，将由卖方无偿提供。</li>
        <li>未尽事宜各方协商解决。</li>
      </ol>
    </div>
  </section>
</div>`;
