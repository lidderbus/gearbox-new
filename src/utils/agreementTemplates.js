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

  <section class="agreement-intro">
    <h2>总则</h2>
    <p>各方就选用杭州前进齿轮箱集团股份有限公司生产的{{gearboxModel}}型船用齿轮箱事宜，经双方友好协商，就有关技术问题达成协议如下：</p>
    <h3>法规与规范</h3>
    <div class="regulations-list">
      {{regulationsList}}
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
        <div class="info-label">机组排列示意图:</div>
        <div class="info-value arrangement-diagram-container">{{arrangementDiagram}}</div>
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
    <h2>4. 齿轮箱技术规格</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">功能:</div>
        <div class="info-value">{{gearboxFunction}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">传动型式:</div>
        <div class="info-value">{{transmissionType}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">离合器型式:</div>
        <div class="info-value">{{clutchType}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">输入联轴器:</div>
        <div class="info-value">{{inputCouplingType}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">额定输入转速:</div>
        <div class="info-value">{{minInputSpeed}}~{{maxInputSpeed}} rpm</div>
      </div>
      <div class="info-row">
        <div class="info-label">输入输出中心距:</div>
        <div class="info-value">{{centerDistance}} mm</div>
      </div>
      <div class="info-row">
        <div class="info-label">传递能力:</div>
        <div class="info-value">{{transmissionCapacity}} kW/(r·min⁻¹)</div>
      </div>
      <div class="info-row">
        <div class="info-label">倒车传递能力:</div>
        <div class="info-value">{{reverseTransmissionCapacity}} kW/(r·min⁻¹)</div>
      </div>
      <div class="info-row">
        <div class="info-label">额定螺旋桨推力:</div>
        <div class="info-value">{{maxPropellerThrust}} kN</div>
      </div>
      <div class="info-row">
        <div class="info-label">机械效率:</div>
        <div class="info-value">≥{{mechanicalEfficiency}}%</div>
      </div>
      <div class="info-row">
        <div class="info-label">换向时间:</div>
        <div class="info-value">≤{{directionChangeTime}}s（可调节）</div>
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
        <div class="info-label">机油容量:</div>
        <div class="info-value">约{{oilCapacity}} L</div>
      </div>
      <div class="info-row">
        <div class="info-label">最高油温:</div>
        <div class="info-value">≤{{maxOilTemperature}}°C</div>
      </div>
      <div class="info-row">
        <div class="info-label">冷却水耗量:</div>
        <div class="info-value">≥{{minCoolingWaterFlow}} t/h</div>
      </div>
      <div class="info-row">
        <div class="info-label">大修期:</div>
        <div class="info-value">{{overhaulTime}} h</div>
      </div>
      <div class="info-row">
        <div class="info-label">操纵系统:</div>
        <div class="info-value">{{controlTypeOptions}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">减速比:</div>
        <div class="info-value">{{reductionRatio}}：1</div>
      </div>
      <div class="info-row">
        <div class="info-label">重量 (约):</div>
        <div class="info-value">≤{{weight}} kg</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>5. 物理特性与环境条件</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">外形尺寸 (长×宽×高):</div>
        <div class="info-value">≤{{dimensions}} mm</div>
      </div>
      <div class="info-row">
        <div class="info-label">重量:</div>
        <div class="info-value">≤{{weight}} kg</div>
      </div>
      <div class="info-row">
        <div class="info-label">外观:</div>
        <div class="info-value">{{appearance}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">贮存温度:</div>
        <div class="info-value">{{storageTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">使用温度:</div>
        <div class="info-value">{{operatingTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">海水温度:</div>
        <div class="info-value">{{seawaterTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">相对湿度:</div>
        <div class="info-value">{{relativeHumidity}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">工作倾斜度:</div>
        <div class="info-value">{{workingInclination}}</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>6. 仪表与报警</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">机旁仪表:</div>
        <div class="info-value">
          <ul>
            <li>润滑油压表 1只</li>
            <li>润滑油温表 1只</li>
            <li>工作油压力表 1只</li>
          </ul>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">报警配置:</div>
        <div class="info-value">
          <ul>
            <li>正车及倒车工作油压力控制器各1个，当工作油压降至{{workingOilPressureAlarm}}MPa时报警</li>
            <li>润滑油压力控制器1只，当润滑油压力降至{{lubOilPressureAlarm}}MPa时报警</li>
            <li>滑油低压报警、油温高报警控制器各1只，均为直流无源开关量信号</li>
          </ul>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">信号输出:</div>
        <div class="info-value">{{signalOutput}}</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>7. 成套配件</h2>
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
    <h2>8. 质量保证及服务</h2>
    <div class="content-text">
      <ol>
        <li>在协议生效后{{approvalPeriod}}天内，制造厂向设计院、船厂提供认可资料（外形及安装图、电气接线图），均采用CAD电子版。设计院、船厂在接到认可资料{{feedbackPeriod}}天内意见反馈。</li>
        <li>齿轮箱出厂前在制造厂试验台进行台架试验，按CCS认可的试验大纲进行检验和验收。</li>
        <li>台架试验前一周通知各方，试验需由船东代表和验船师在场的情况下进行。</li>
        <li>油封有效期为自发货之日起一年。</li>
        <li>使用方必须按本厂提供的使用说明书安装、使用和保养。安装找正请按使用维护说明书有关规定进行。</li>
        <li>在交船后{{warrantyPeriod}}个月内确因设计及制造不良而造成的质量问题，制造厂保证免费提供零件，并派人进行修理和技术服务。</li>
        <li>本协议作为齿轮箱的设计制造、质量检验、交货验收的技术依据，作为订货合同的附件。</li>
        <li>任何技术协议中未提及的细节由认可图决定，将被认为是技术协议的一部分。除买卖双方书面同意修改外，任何与技术协议不符的应以技术协议为准。</li>
      </ol>
    </div>
  </section>

  <section class="agreement-section">
    <h2>9. 供货范围（每船）</h2>
    <div class="content-text">
      <table class="delivery-table">
        <tr>
          <th>序号</th>
          <th>名称</th>
          <th>规格型号</th>
          <th>数量</th>
          <th>备注</th>
        </tr>
        <tr>
          <td>1</td>
          <td>齿轮箱</td>
          <td>{{gearboxModel}}</td>
          <td>{{quantity}}台</td>
          <td>含滑油泵机组</td>
        </tr>
        <tr>
          <td>2</td>
          <td>高弹性联轴器</td>
          <td>{{couplingModel}}</td>
          <td>{{quantity}}台</td>
          <td>配齐与主机、齿轮箱的联接件</td>
        </tr>
        <tr>
          <td>3</td>
          <td>备用泵机组</td>
          <td>{{pumpModel}}</td>
          <td>{{quantity}}台</td>
          <td>电动滑油泵</td>
        </tr>
        {{additionalDeliveryItems}}
      </table>
    </div>
  </section>

  <section id="attachment-section" class="agreement-section">
    <h2>10. 随机技术资料</h2>
    <div class="content-text">
      <table class="docs-table">
        <tr>
          <th>序号</th>
          <th>名称</th>
          <th>数量</th>
        </tr>
        <tr><td>1</td><td>使用说明书</td><td>1份/台</td></tr>
        <tr><td>2</td><td>外形安装图</td><td>1份/台</td></tr>
        <tr><td>3</td><td>电气接线图</td><td>1份/台</td></tr>
        <tr><td>4</td><td>产品合格证书</td><td>1份/台</td></tr>
        <tr><td>5</td><td>{{classificationCertificateName}}</td><td>1份/台</td></tr>
        <tr><td>6</td><td>装箱清单</td><td>1份/台</td></tr>
      </table>
      <p class="note">注：提供4份纸版完工资料/每船及CD盘完工文件。电子版图纸与实物1:1比例绘制。</p>
    </div>
  </section>

  <section class="agreement-section">
    <h2>11. 特殊订货要求</h2>
    <div class="content-text special-requirements">
      {{specialRequirements}}
    </div>
  </section>

  <section class="agreement-section">
    <h2>12. 未尽事宜</h2>
    <div class="content-text">
      <p>未尽事宜友好协商解决。协议中未提及，但是属于设备正常安装、使用或适用的法规规范所要求的附件及备件，将由卖方无偿提供。</p>
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

  <section class="agreement-intro">
    <h2>General Provisions</h2>
    <p>The parties have reached this agreement on technical matters regarding the selection of {{gearboxModel}} marine gearbox manufactured by Hangzhou Advance Gearbox Group Co., Ltd., through friendly consultation as follows:</p>
    <h3>Regulations and Standards</h3>
    <div class="regulations-list">
      {{regulationsList}}
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
        <div class="info-label">Arrangement Diagram:</div>
        <div class="info-value arrangement-diagram-container">{{arrangementDiagram}}</div>
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
    <h2>4. Gearbox Technical Specifications</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">Function:</div>
        <div class="info-value">{{gearboxFunction}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Transmission Type:</div>
        <div class="info-value">{{transmissionType}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Clutch Type:</div>
        <div class="info-value">{{clutchType}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Input Coupling:</div>
        <div class="info-value">{{inputCouplingType}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Rated Input Speed:</div>
        <div class="info-value">{{minInputSpeed}}~{{maxInputSpeed}} rpm</div>
      </div>
      <div class="info-row">
        <div class="info-label">I/O Center Distance:</div>
        <div class="info-value">{{centerDistance}} mm</div>
      </div>
      <div class="info-row">
        <div class="info-label">Transmission Capacity:</div>
        <div class="info-value">{{transmissionCapacity}} kW/(r·min⁻¹)</div>
      </div>
      <div class="info-row">
        <div class="info-label">Reverse Transmission Capacity:</div>
        <div class="info-value">{{reverseTransmissionCapacity}} kW/(r·min⁻¹)</div>
      </div>
      <div class="info-row">
        <div class="info-label">Rated Propeller Thrust:</div>
        <div class="info-value">{{maxPropellerThrust}} kN</div>
      </div>
      <div class="info-row">
        <div class="info-label">Mechanical Efficiency:</div>
        <div class="info-value">≥{{mechanicalEfficiency}}%</div>
      </div>
      <div class="info-row">
        <div class="info-label">Direction Change Time:</div>
        <div class="info-value">≤{{directionChangeTime}}s (adjustable)</div>
      </div>
      <div class="info-row">
        <div class="info-label">Working Oil Pressure:</div>
        <div class="info-value">{{workingOilPressure}} MPa</div>
      </div>
      <div class="info-row">
        <div class="info-label">Oil Grade:</div>
        <div class="info-value">{{oilGrade}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Oil Capacity:</div>
        <div class="info-value">Approx. {{oilCapacity}} L</div>
      </div>
      <div class="info-row">
        <div class="info-label">Max Oil Temperature:</div>
        <div class="info-value">≤{{maxOilTemperature}}°C</div>
      </div>
      <div class="info-row">
        <div class="info-label">Cooling Water Flow:</div>
        <div class="info-value">≥{{minCoolingWaterFlow}} t/h</div>
      </div>
      <div class="info-row">
        <div class="info-label">Overhaul Period:</div>
        <div class="info-value">{{overhaulTime}} h</div>
      </div>
      <div class="info-row">
        <div class="info-label">Control System:</div>
        <div class="info-value">{{controlTypeOptions}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Reduction Ratio:</div>
        <div class="info-value">{{reductionRatio}}:1</div>
      </div>
      <div class="info-row">
        <div class="info-label">Weight (approx.):</div>
        <div class="info-value">≤{{weight}} kg</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>5. Physical Characteristics & Environmental Conditions</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">Dimensions (L×W×H):</div>
        <div class="info-value">≤{{dimensions}} mm</div>
      </div>
      <div class="info-row">
        <div class="info-label">Weight:</div>
        <div class="info-value">≤{{weight}} kg</div>
      </div>
      <div class="info-row">
        <div class="info-label">Appearance:</div>
        <div class="info-value">{{appearance}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Storage Temperature:</div>
        <div class="info-value">{{storageTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Operating Temperature:</div>
        <div class="info-value">{{operatingTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Seawater Temperature:</div>
        <div class="info-value">{{seawaterTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Relative Humidity:</div>
        <div class="info-value">{{relativeHumidity}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Working Inclination:</div>
        <div class="info-value">{{workingInclination}}</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>6. Instruments and Alarms</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">Local Instruments:</div>
        <div class="info-value">
          <ul>
            <li>Lubricating oil pressure gauge (1 pc)</li>
            <li>Lubricating oil temperature gauge (1 pc)</li>
            <li>Working oil pressure gauge (1 pc)</li>
          </ul>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">Alarm Configuration:</div>
        <div class="info-value">
          <ul>
            <li>Forward and reverse working oil pressure controllers (1 each), alarm when working oil pressure drops to {{workingOilPressureAlarm}} MPa</li>
            <li>Lubricating oil pressure controller (1 pc), alarm when lubricating oil pressure drops to {{lubOilPressureAlarm}} MPa</li>
            <li>Low oil pressure alarm and high oil temperature alarm controllers (1 each), DC passive switch signals</li>
          </ul>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">Signal Output:</div>
        <div class="info-value">{{signalOutput}}</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>7. Accessories</h2>
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
    <h2>8. Quality Assurance and Service</h2>
    <div class="content-text">
      <ol>
        <li>Within {{approvalPeriod}} days after the agreement takes effect, the manufacturer shall provide approval documents (outline and installation drawings, electrical wiring diagrams) to the design institute and shipyard in CAD electronic format. The design institute and shipyard shall provide feedback within {{feedbackPeriod}} days after receiving the approval drawings.</li>
        <li>The gearbox shall undergo bench test at the manufacturer's test stand before delivery, and shall be inspected and accepted according to CCS approved test procedure.</li>
        <li>All parties shall be notified one week before the bench test, and the test shall be conducted in the presence of the shipowner's representative and surveyor.</li>
        <li>Oil seal validity period is one year from the date of shipment.</li>
        <li>The user must install, use and maintain the equipment according to the operation manual provided by the manufacturer. Installation alignment shall be performed according to the operation and maintenance manual.</li>
        <li>Within {{warrantyPeriod}} months after vessel delivery, for quality problems caused by design or manufacturing defects, the manufacturer guarantees to provide parts free of charge and send personnel for repair and technical service.</li>
        <li>This agreement serves as the technical basis for gearbox design, manufacturing, quality inspection, and delivery acceptance, and as an attachment to the purchase contract.</li>
        <li>Any details not mentioned in this technical agreement shall be determined by the approval drawings, which shall be considered as part of this technical agreement. Any discrepancy with this technical agreement shall be governed by this agreement unless otherwise agreed in writing by both parties.</li>
      </ol>
    </div>
  </section>

  <section class="agreement-section">
    <h2>9. Delivery Scope (Per Vessel)</h2>
    <div class="content-text">
      <table class="delivery-table">
        <tr>
          <th>No.</th>
          <th>Description</th>
          <th>Model/Spec</th>
          <th>Quantity</th>
          <th>Remarks</th>
        </tr>
        <tr>
          <td>1</td>
          <td>Gearbox</td>
          <td>{{gearboxModel}}</td>
          <td>{{quantity}} unit(s)</td>
          <td>Including oil pump unit</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Flexible Coupling</td>
          <td>{{couplingModel}}</td>
          <td>{{quantity}} unit(s)</td>
          <td>Complete with connecting parts for engine and gearbox</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Standby Pump Unit</td>
          <td>{{pumpModel}}</td>
          <td>{{quantity}} unit(s)</td>
          <td>Electric oil pump</td>
        </tr>
        {{additionalDeliveryItems}}
      </table>
    </div>
  </section>

  <section id="attachment-section" class="agreement-section">
    <h2>10. Technical Documents</h2>
    <div class="content-text">
      <table class="docs-table">
        <tr>
          <th>No.</th>
          <th>Description</th>
          <th>Quantity</th>
        </tr>
        <tr><td>1</td><td>Operation Manual</td><td>1 copy/unit</td></tr>
        <tr><td>2</td><td>Outline Installation Drawing</td><td>1 copy/unit</td></tr>
        <tr><td>3</td><td>Electrical Wiring Diagram</td><td>1 copy/unit</td></tr>
        <tr><td>4</td><td>Product Certificate</td><td>1 copy/unit</td></tr>
        <tr><td>5</td><td>{{classificationCertificateNameEn}}</td><td>1 copy/unit</td></tr>
        <tr><td>6</td><td>Packing List</td><td>1 copy/unit</td></tr>
      </table>
      <p class="note">Note: 4 copies of paper completion documents per vessel plus CD completion files will be provided. Electronic drawings shall be drawn at 1:1 scale with actual equipment.</p>
    </div>
  </section>

  <section class="agreement-section">
    <h2>11. Special Order Requirements</h2>
    <div class="content-text special-requirements">
      {{specialRequirements}}
    </div>
  </section>

  <section class="agreement-section">
    <h2>12. Other Matters</h2>
    <div class="content-text">
      <p>Other matters not covered in this agreement shall be settled through friendly consultation. Accessories and spare parts not mentioned in the agreement but required for normal installation, use or applicable regulations and specifications shall be provided free of charge by the seller.</p>
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
        <div class="info-label">传动型式:</div>
        <div class="info-value">{{transmissionType}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">离合器型式:</div>
        <div class="info-value">{{clutchType}}</div>
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
        <div class="info-label">倒车传递能力:</div>
        <div class="info-value">{{reverseTransmissionCapacity}} kW/r.min</div>
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
    <h2>4. 物理特性与环境条件</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">外形尺寸（长×宽×高）:</div>
        <div class="info-value">≤{{dimensions}} mm</div>
      </div>
      <div class="info-row">
        <div class="info-label">重量:</div>
        <div class="info-value">≤{{weight}} kg</div>
      </div>
      <div class="info-row">
        <div class="info-label">外观:</div>
        <div class="info-value">{{appearance}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">贮存温度:</div>
        <div class="info-value">{{storageTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">使用温度:</div>
        <div class="info-value">{{operatingTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">海水温度:</div>
        <div class="info-value">{{seawaterTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">相对湿度:</div>
        <div class="info-value">{{relativeHumidity}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">工作倾斜度:</div>
        <div class="info-value">{{workingInclination}}</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>5. 齿轮箱监控配置</h2>
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
    <h2>6. 齿轮箱的随机技术资料</h2>
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
    <h2>7. 质量保证和技术服务</h2>
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
    <h2>8. 供货范围（每船）</h2>
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
    <h2>9. 未尽事宜</h2>
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
        <div class="info-value">{{gearboxModel}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">2. 功能：</div>
        <div class="info-value">{{gearboxFunction}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">3. 传动型式：</div>
        <div class="info-value">{{transmissionType}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">4. 离合器型式：</div>
        <div class="info-value">{{clutchType}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">机组排列示意图:</div>
        <div class="info-value arrangement-diagram-container">{{arrangementDiagram}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">5. 减速比：</div>
        <div class="info-value">{{reductionRatio}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">6. 额定传递能力：</div>
        <div class="info-value">{{transmissionCapacity}} kW/rpm</div>
      </div>
      <div class="info-row">
        <div class="info-label">7. 倒车传递能力：</div>
        <div class="info-value">{{reverseTransmissionCapacity}} kW/rpm</div>
      </div>
      <div class="info-row">
        <div class="info-label">8. 输入转速：</div>
        <div class="info-value">0～{{maxInputSpeed}}rpm</div>
      </div>
      <div class="info-row">
        <div class="info-label">9. 输出转向：</div>
        <div class="info-value">与输入相反</div>
      </div>
      <div class="info-row">
        <div class="info-label">10. 润滑油压：</div>
        <div class="info-value">{{lubricationOilPressure}} MPa</div>
      </div>
      <div class="info-row">
        <div class="info-label">11. 螺旋桨最大推力：</div>
        <div class="info-value">{{maxPropellerThrust}} kN</div>
      </div>
      <div class="info-row">
        <div class="info-label">12. 中心距：</div>
        <div class="info-value">{{centerDistance}} mm</div>
      </div>
      <div class="info-row">
        <div class="info-label">13. 油温：</div>
        <div class="info-value">≤{{maxOilTemperature}}℃</div>
      </div>
      <div class="info-row">
        <div class="info-label">14. 机油容积：</div>
        <div class="info-value">约 {{oilCapacity}}L</div>
      </div>
      <div class="info-row">
        <div class="info-label">15. 机油牌号：</div>
        <div class="info-value">{{oilGrade}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">16. 冷却水进水温度：</div>
        <div class="info-value">≤{{coolingWaterInletTemperature}}℃</div>
      </div>
      <div class="info-row">
        <div class="info-label">17. 冷却水量：</div>
        <div class="info-value">≥{{coolingWaterVolume}}t/h,冷却水进口压力≤{{coolingWaterPressure}} MPa</div>
      </div>
      <div class="info-row">
        <div class="info-label">18. 机械效率：</div>
        <div class="info-value">≥{{mechanicalEfficiency}}%</div>
      </div>
      <div class="info-row">
        <div class="info-label">19.（正车）转向：</div>
        <div class="info-value">{{forwardDirection}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">20. 倾斜度：</div>
        <div class="info-value">纵倾 {{longitudinalInclination}}°，横倾 {{transverseInclination}}°；纵摇 {{longitudinalShaking}}°，横倾 {{transverseShaking}}°</div>
      </div>
      <div class="info-row">
        <div class="info-label">21. 安装方式：</div>
        <div class="info-value">{{installationMethod}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">22. 电动滑油泵：</div>
        <div class="info-value">{{lubricationOilPump}}，技术参数以认可资料为准。</div>
      </div>
      <div class="info-row">
        <div class="info-label">23. 大修时间：</div>
        <div class="info-value">{{overhaulTime}} 小时</div>
      </div>
      <div class="info-row">
        <div class="info-label">24. 齿轮箱铭牌材质：</div>
        <div class="info-value">{{nameplateSpecification}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">25. 仪表与报警：</div>
        <div class="info-value">{{instrumentsAndAlarms}}</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>三、物理特性与环境条件</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">1. 外形尺寸（长×宽×高）:</div>
        <div class="info-value">≤{{dimensions}} mm</div>
      </div>
      <div class="info-row">
        <div class="info-label">2. 重量:</div>
        <div class="info-value">≤{{weight}} kg</div>
      </div>
      <div class="info-row">
        <div class="info-label">3. 外观:</div>
        <div class="info-value">{{appearance}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">4. 贮存温度:</div>
        <div class="info-value">{{storageTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">5. 使用温度:</div>
        <div class="info-value">{{operatingTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">6. 海水温度:</div>
        <div class="info-value">{{seawaterTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">7. 相对湿度:</div>
        <div class="info-value">{{relativeHumidity}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">8. 工作倾斜度:</div>
        <div class="info-value">{{workingInclination}}</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>四、高弹性联轴器</h2>
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
    <h2>五、供货范围</h2>
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
    <h2>六、质量保证及服务</h2>
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

// DT系列模板 - 中文（电推齿轮箱，4方签约格式）
// 参考文档：DT770电推齿轮箱技术协议-20251211.doc
export const dtChineseTemplate =
`<div class="agreement-container">
  <div class="agreement-number">协议编号：{{agreementNumber}}</div>
  <h2 class="ship-name" style="text-align:center;margin:10px 0;">{{shipName}}</h2>
  <h1 class="agreement-title">{{gearboxModel}}型船用齿轮箱技术协议</h1>

  <section class="agreement-header">
    <div class="parties four-parties">
      <div class="party">
        <p>船东（甲方）：{{shipOwner}}</p>
        <p>签字：_______________ &nbsp;&nbsp;&nbsp;&nbsp; 年 &nbsp;&nbsp; 月 &nbsp;&nbsp; 日</p>
      </div>
      <div class="party">
        <p>船厂（乙方）：{{shipyard}}</p>
        <p>签字：_______________ &nbsp;&nbsp;&nbsp;&nbsp; 年 &nbsp;&nbsp; 月 &nbsp;&nbsp; 日</p>
      </div>
      <div class="party">
        <p>设计院（丙方）：{{designInstitute}}</p>
        <p>签字：_______________ &nbsp;&nbsp;&nbsp;&nbsp; 年 &nbsp;&nbsp; 月 &nbsp;&nbsp; 日</p>
      </div>
      <div class="party">
        <p>制造厂（丁方）：杭州前进齿轮箱集团股份有限公司</p>
        <p>签字：_______________ &nbsp;&nbsp;&nbsp;&nbsp; 年 &nbsp;&nbsp; 月 &nbsp;&nbsp; 日</p>
      </div>
    </div>
  </section>

  <section class="agreement-intro">
    <p>各方就选用杭州前进齿轮箱集团股份有限公司生产的{{gearboxModel}}型电动船用齿轮箱和高弹性联轴器事宜，经多方友好协商，就有关技术问题达成协议如下：</p>
    <h3>总则：</h3>
    <h4>法规与规范</h4>
    <ul class="regulations-list">
      {{regulationsList}}
    </ul>
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
        <div class="info-value">{{engineRotation}}</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>二、齿轮箱技术参数</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">1. 型号：</div>
        <div class="info-value">{{gearboxModel}}（具有减速和承受螺旋桨推力的功能。）</div>
      </div>
      <div class="info-row">
        <div class="info-label">2. 减速比：</div>
        <div class="info-value">{{reductionRatio}}:1</div>
      </div>
      <div class="info-row">
        <div class="info-label">3. 额定传递能力：</div>
        <div class="info-value">{{transmissionCapacity}} kW/r·min⁻¹</div>
      </div>
      <div class="info-row">
        <div class="info-label">4. 输入转速：</div>
        <div class="info-value">0～{{maxInputSpeed}}rpm</div>
      </div>
      <div class="info-row">
        <div class="info-label">5. 输出转向：</div>
        <div class="info-value">与输入{{outputDirection}}</div>
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
        <div class="info-value">{{centerDistance}}mm</div>
      </div>
      <div class="info-row">
        <div class="info-label">9. 油温：</div>
        <div class="info-value">≤{{maxOilTemperature}}℃</div>
      </div>
      <div class="info-row">
        <div class="info-label">10. 机油容积：</div>
        <div class="info-value">约{{oilCapacity}}L</div>
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
        <div class="info-value">≥{{coolingWaterVolume}}t/h，冷却水进口压力≤{{coolingWaterPressure}}MPa</div>
      </div>
      <div class="info-row">
        <div class="info-label">14. 机械效率：</div>
        <div class="info-value">≥{{mechanicalEfficiency}}%</div>
      </div>
      <div class="info-row">
        <div class="info-label">15.（正车）转向：</div>
        <div class="info-value arrangement-diagram-container">{{arrangementDiagram}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">16. 倾斜度：</div>
        <div class="info-value">纵倾{{longitudinalInclination}}°，横倾{{transverseInclination}}°；纵摇{{longitudinalShaking}}°，横摇{{transverseShaking}}°</div>
      </div>
      <div class="info-row">
        <div class="info-label">17. 安装方式：</div>
        <div class="info-value">{{installationMethod}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">18. 电动滑油泵：</div>
        <div class="info-value">
          <p>{{lubricationOilPump}}</p>
          <ol class="oil-pump-specs">
            <li>型号：{{oilPumpModel}}</li>
            <li>额定流量：{{oilPumpFlowRate}}m³/h</li>
            <li>电机功率：{{oilPumpPower}}kW，{{oilPumpVoltage}}</li>
            <li>防护等级：{{oilPumpProtection}}，绝缘等级{{oilPumpInsulation}}</li>
          </ol>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">19. 大修时间：</div>
        <div class="info-value">{{overhaulTime}}小时</div>
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
    <h2>三、物理特性与环境条件</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">1. 外形尺寸（长×宽×高）:</div>
        <div class="info-value">≤{{dimensions}} mm</div>
      </div>
      <div class="info-row">
        <div class="info-label">2. 重量:</div>
        <div class="info-value">≤{{weight}} kg</div>
      </div>
      <div class="info-row">
        <div class="info-label">3. 外观:</div>
        <div class="info-value">{{appearance}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">4. 贮存温度:</div>
        <div class="info-value">{{storageTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">5. 使用温度:</div>
        <div class="info-value">{{operatingTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">6. 海水温度:</div>
        <div class="info-value">{{seawaterTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">7. 相对湿度:</div>
        <div class="info-value">{{relativeHumidity}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">8. 工作倾斜度:</div>
        <div class="info-value">{{workingInclination}}</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>四、高弹性联轴器</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">1. 制造厂家：</div>
        <div class="info-value">{{couplingManufacturer}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">2. 高弹型号：</div>
        <div class="info-value">{{couplingModel}}（以认可资料为准）。</div>
      </div>
      <div class="info-row">
        <div class="info-label">3. 附带与电机和齿轮箱的联接件。</div>
        <div class="info-value"></div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>五、供货范围</h2>
    <div class="content-text">
      <ol>
        <li>{{gearboxModel}}船用齿轮箱（含润滑油泵机组）（{{quantity}}台/船）
          <p>随机附带使用说明书1份/台、外形安装图1份/台、电气接线图1份/台、产品合格证书1份/台，提供CCS船检产品证书1份/台。</p>
        </li>
        <li>高弹性联轴器（{{quantity}}套/船）
          <p>随机附带使用说明书1份/套、外形安装图1份/套、产品合格证书1份/套，提供CCS船检书1份/套。</p>
          <p>配齐与电机、齿轮箱的联接件。</p>
        </li>
      </ol>
    </div>
  </section>

  <section class="agreement-section">
    <h2>六、质量保证及服务</h2>
    <div class="content-text">
      <ol>
        <li>在协议生效后{{approvalPeriod}}天内，制造厂向设计院、船厂提供认可资料（外形及安装图、电气接线图），均采用CAD电子版。设计院、船厂在接到认可资料{{feedbackPeriod}}天内意见反馈。</li>
        <li>交货试验在制造厂的试验台位上进行，按CCS有关规范和认可的试验大纲进行检验和验收，并出具合格证明书。试验前一周通知各方。</li>
        <li>油封有效期为自发货之日起一年。</li>
        <li>使用方必须按本厂提供的使用说明书安装、使用和保养，在交船（船厂与船东签订协议之日）后{{warrantyPeriod}}内确因设计及制造不良而造成的质量问题，制造厂保证免费提供零件，并派人进行修理和技术服务。</li>
        <li>本协议作为齿轮箱的设计制造、质量检验、交货验收的技术依据，作为订货合同的附件。任何技术协议中未提及的细节由认可图决定，将被认为是技术协议的一部分。除买卖双方书面同意修改外，任何与技术协议不符的应以技术协议为准。协议中未提及，但是属于设备正常安装、使用或适用的法规规范所要求的附件及备件，将由卖方无偿提供。</li>
        <li>未尽事宜各方协商解决。</li>
      </ol>
    </div>
  </section>

  <section class="agreement-section">
    <h2>七、特殊订货要求</h2>
    <div class="content-text special-requirements">
      {{specialRequirements}}
    </div>
  </section>
</div>`;

// HCQ系列模板 - 中文
// 参考数据：HCQ700型船用齿轮箱，高扭矩大功率系列
export const hcqChineseTemplate =
`<div class="agreement-container">
  <h1 class="agreement-title">HCQ系列船用齿轮箱技术协议</h1>

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
    <h2>总则</h2>
    <p>各方就选用杭州前进齿轮箱集团股份有限公司生产的{{gearboxModel}}型船用齿轮箱事宜，经双方友好协商，就有关技术问题达成协议如下：</p>
    <h3>法规与规范</h3>
    <div class="regulations-list">
      {{regulationsList}}
    </div>
  </section>

  <section id="ship-info-section" class="agreement-section">
    <h2>一、船舶信息</h2>
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
        <div class="info-label">船舶总长:</div>
        <div class="info-value">{{shipLength}} m</div>
      </div>
      <div class="info-row">
        <div class="info-label">船宽:</div>
        <div class="info-value">{{shipWidth}} m</div>
      </div>
      <div class="info-row">
        <div class="info-label">型深:</div>
        <div class="info-value">{{shipDepth}} m</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>二、柴油机参数</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">制造厂:</div>
        <div class="info-value">{{engineManufacturer}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">额定功率:</div>
        <div class="info-value">{{enginePower}} kW</div>
      </div>
      <div class="info-row">
        <div class="info-label">额定转速:</div>
        <div class="info-value">{{engineSpeed}} rpm</div>
      </div>
      <div class="info-row">
        <div class="info-label">飞轮规格:</div>
        <div class="info-value">{{flywheelSpec}}</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>三、齿轮箱技术规格（{{gearboxModel}}）</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">功能:</div>
        <div class="info-value">{{gearboxFunction}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">传动型式:</div>
        <div class="info-value">{{transmissionType}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">离合器型式:</div>
        <div class="info-value">{{clutchType}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">输入联轴器:</div>
        <div class="info-value">{{inputCouplingType}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">额定输入转速:</div>
        <div class="info-value">{{minInputSpeed}}~{{maxInputSpeed}} rpm</div>
      </div>
      <div class="info-row">
        <div class="info-label">输入输出中心距:</div>
        <div class="info-value">{{centerDistance}} mm</div>
      </div>
      <div class="info-row">
        <div class="info-label">减速比:</div>
        <div class="info-value">{{reductionRatio}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">传递能力:</div>
        <div class="info-value">{{transmissionCapacity}} kW/(r·min⁻¹)</div>
      </div>
      <div class="info-row">
        <div class="info-label">倒车传递能力:</div>
        <div class="info-value">{{reverseTransmissionCapacity}} kW/(r·min⁻¹)</div>
      </div>
      <div class="info-row">
        <div class="info-label">额定螺旋桨推力:</div>
        <div class="info-value">{{maxPropellerThrust}} kN</div>
      </div>
      <div class="info-row">
        <div class="info-label">机械效率:</div>
        <div class="info-value">≥{{mechanicalEfficiency}}%</div>
      </div>
      <div class="info-row">
        <div class="info-label">换向时间:</div>
        <div class="info-value">≤{{directionChangeTime}} s（可调节）</div>
      </div>
      <div class="info-row">
        <div class="info-label">工作油压:</div>
        <div class="info-value">{{workingOilPressure}} MPa</div>
      </div>
      <div class="info-row">
        <div class="info-label">润滑油压:</div>
        <div class="info-value">{{lubricationOilPressure}} MPa</div>
      </div>
      <div class="info-row">
        <div class="info-label">机油牌号:</div>
        <div class="info-value">{{oilGrade}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">机油容量:</div>
        <div class="info-value">约{{oilCapacity}} L</div>
      </div>
      <div class="info-row">
        <div class="info-label">最高油温:</div>
        <div class="info-value">≤{{maxOilTemperature}}℃</div>
      </div>
      <div class="info-row">
        <div class="info-label">冷却水耗量:</div>
        <div class="info-value">≥{{coolingWaterVolume}} t/h</div>
      </div>
      <div class="info-row">
        <div class="info-label">大修期:</div>
        <div class="info-value">{{overhaulPeriod}} h</div>
      </div>
      <div class="info-row">
        <div class="info-label">操纵系统:</div>
        <div class="info-value">{{controlType}}</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>四、物理特性与环境条件</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">尺寸（长×宽×高）:</div>
        <div class="info-value">≤{{dimensions}} mm</div>
      </div>
      <div class="info-row">
        <div class="info-label">重量:</div>
        <div class="info-value">≤{{weight}} kg</div>
      </div>
      <div class="info-row">
        <div class="info-label">外观:</div>
        <div class="info-value">{{appearance}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">贮存温度:</div>
        <div class="info-value">{{storageTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">使用温度:</div>
        <div class="info-value">{{operatingTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">海水温度:</div>
        <div class="info-value">{{seawaterTemperature}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">相对湿度:</div>
        <div class="info-value">{{relativeHumidity}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">工作倾斜度:</div>
        <div class="info-value">纵倾{{longitudinalInclination}}°、横倾{{transverseInclination}}°</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>五、供货清单</h2>
    <div class="content-text">
      <table class="supply-list-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>项目</th>
            <th>名称</th>
            <th>规格型号</th>
            <th>数量</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>主机</td>
            <td>齿轮箱</td>
            <td>{{gearboxModel}}</td>
            <td>{{quantity}}</td>
          </tr>
          <tr>
            <td>2</td>
            <td>仪表</td>
            <td>工作压力表</td>
            <td>提供开关量信号</td>
            <td>{{quantity}}</td>
          </tr>
          <tr>
            <td>3</td>
            <td>控制器</td>
            <td>正车/倒车/空车指示控制器</td>
            <td>提供开关量信号</td>
            <td>各{{quantity}}</td>
          </tr>
          <tr>
            <td>4</td>
            <td>报警</td>
            <td>滑油低压报警/油温高报警</td>
            <td>提供开关量信号</td>
            <td>各{{quantity}}</td>
          </tr>
          <tr>
            <td>5</td>
            <td>冷却</td>
            <td>滑油冷却器</td>
            <td>-</td>
            <td>{{quantity}}</td>
          </tr>
          <tr>
            <td>6</td>
            <td>文件</td>
            <td>CCS证书、合格证、说明书、装箱清单</td>
            <td>-</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="agreement-section">
    <h2>六、质量保证</h2>
    <div class="content-text">
      <p><strong>三包期</strong>：船艇完工交付之日起12个月</p>
      <p><strong>服务承诺</strong>：超过三包期后仍提供及时、优质、优惠的服务</p>
    </div>
  </section>

  <section class="agreement-section">
    <h2>七、持证要求</h2>
    <div class="content-text">
      <p>齿轮箱需持有CCS非入级船用产品证书</p>
    </div>
  </section>

  <section class="agreement-section">
    <h2>八、设计依据</h2>
    <div class="content-text">
      <ul>
        <li>中国船级社《国内航行小型海船技术规则》(2024)</li>
        <li>中华人民共和国海事局《国内航行海船法定检验技术规则》(2020)</li>
      </ul>
    </div>
  </section>

  <section class="agreement-section">
    <h2>九、特殊订货要求</h2>
    <div class="content-text special-requirements">
      {{specialRequirements}}
    </div>
  </section>
</div>`;

// GWS系列模板 - 中文（电控双机备用泵启停及控制箱）
// 数据来源：GWS49.61齿轮箱技术协议（电控 双机 备用泵启停及控制箱）上前2026.1.29.doc
export const gwsChineseTemplate =
`<div class="agreement-container">
  <h1 class="agreement-title">"GWS"系列船用齿轮箱订货技术协议</h1>
  <p class="agreement-subtitle">（电控 双机 备用泵启停及控制箱）</p>

  <section class="agreement-header">
    <div class="parties">
      <div class="party">
        <p>船检：{{classificationName}}</p>
        <p>船号：{{projectNumber}}</p>
        <p>船名：{{shipName}}</p>
      </div>
      <div class="party">
        <p>船东（甲方）：{{shipOwner}}</p>
        <p>签字：_______________ 日期：_______________</p>
      </div>
      <div class="party">
        <p>船厂（乙方）：{{shipyard}}</p>
        <p>签字：_______________ 日期：_______________</p>
      </div>
      <div class="party">
        <p>制造厂（丙方）：杭州前进齿轮箱集团股份有限公司</p>
        <p>签字：_______________ 日期：_______________</p>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>一、柴油机参数</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">型号：</div>
        <div class="info-value">{{engineModel}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">额定功率：</div>
        <div class="info-value">{{enginePower}} kW</div>
      </div>
      <div class="info-row">
        <div class="info-label">额定转速：</div>
        <div class="info-value">{{engineSpeed}} r/min</div>
      </div>
      <div class="info-row">
        <div class="info-label">输出轴旋转方向（面向飞轮）：</div>
        <div class="info-value">{{engineRotation}}</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>二、齿轮箱参数</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">型号：</div>
        <div class="info-value">{{gearboxModel}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">功能：</div>
        <div class="info-value">{{gearboxFunction}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">额定推力：</div>
        <div class="info-value">{{maxPropellerThrust}} kN</div>
      </div>
      <div class="info-row">
        <div class="info-label">减速比：</div>
        <div class="info-value">{{reductionRatio}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">传递能力：</div>
        <div class="info-value">{{transmissionCapacity}} kW/(r·min⁻¹)</div>
      </div>
      <div class="info-row">
        <div class="info-label">输入输出中心距：</div>
        <div class="info-value">{{centerDistance}} mm（垂直异心）</div>
      </div>
      <div class="info-row">
        <div class="info-label">订货数量：</div>
        <div class="info-value">{{quantity}} 台</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>三、工作原理</h2>
    <div class="content-text">
      <p>{{powerArrangement}}</p>
      <div class="arrangement-diagram-container">{{arrangementDiagram}}</div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>四、操纵方式</h2>
    <div class="content-text">
      <p><strong>操纵方式：</strong>{{controlTypeOptions}}</p>
      <p><strong>控制电压：</strong>DC{{controlVoltage}}V</p>
      <p class="note">电控换向阀随齿轮箱成套供货</p>
    </div>
  </section>

  <section class="agreement-section">
    <h2>五、润滑、冷却</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">最高油温：</div>
        <div class="info-value">{{maxOilTemperature}}°C</div>
      </div>
      <div class="info-row">
        <div class="info-label">机油牌号：</div>
        <div class="info-value">{{oilGrade}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">冷却水用量：</div>
        <div class="info-value">≥{{minCoolingWaterFlow}} t/h</div>
      </div>
      <div class="info-row">
        <div class="info-label">冷却水进口温度：</div>
        <div class="info-value">{{coolingWaterInletTemperature}}°C</div>
      </div>
      <div class="info-row">
        <div class="info-label">冷却水压力：</div>
        <div class="info-value">{{coolingWaterPressure}} MPa</div>
      </div>
      <div class="info-row">
        <div class="info-label">润滑油压力：</div>
        <div class="info-value">{{lubricationOilPressure}} MPa</div>
      </div>
    </div>
  </section>

  <section class="agreement-section">
    <h2>六、随机附件</h2>
    <div class="content-text">
      <table class="delivery-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>名称</th>
            <th>数量</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>滑油泵（内置）</td>
            <td>1台/齿轮箱</td>
            <td>-</td>
          </tr>
          <tr>
            <td>2</td>
            <td>滑油滤油器</td>
            <td>1只/齿轮箱</td>
            <td>-</td>
          </tr>
          <tr>
            <td>3</td>
            <td>滑油冷却器</td>
            <td>1只/齿轮箱</td>
            <td>-</td>
          </tr>
          <tr>
            <td>4</td>
            <td>电控换向阀</td>
            <td>1只/齿轮箱</td>
            <td>DC{{controlVoltage}}V</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="agreement-section">
    <h2>七、报警装置</h2>
    <div class="content-text">
      <table class="delivery-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>名称</th>
            <th>数量</th>
            <th>报警整定值</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>润滑油压表</td>
            <td>1只/齿轮箱</td>
            <td>-</td>
          </tr>
          <tr>
            <td>2</td>
            <td>润滑油温表</td>
            <td>1只/齿轮箱</td>
            <td>-</td>
          </tr>
          <tr>
            <td>3</td>
            <td>工作油压力表</td>
            <td>1只/齿轮箱</td>
            <td>-</td>
          </tr>
          <tr>
            <td>4</td>
            <td>滑油低压报警控制器</td>
            <td>1只/齿轮箱</td>
            <td>≤{{lubOilPressureAlarm}} MPa</td>
          </tr>
          <tr>
            <td>5</td>
            <td>油温高报警控制器</td>
            <td>1只/齿轮箱</td>
            <td>≥{{highOilTemperatureAlarm}}°C</td>
          </tr>
          <tr>
            <td>6</td>
            <td>工作油压力低报警控制器</td>
            <td>1只/齿轮箱</td>
            <td>≤{{workingOilPressureAlarm}} MPa</td>
          </tr>
          <tr>
            <td>7</td>
            <td>正车/倒车/空车指示控制器</td>
            <td>各1只/齿轮箱</td>
            <td>-</td>
          </tr>
          <tr class="highlight-row">
            <td>8</td>
            <td><strong>备用泵启停控制器</strong></td>
            <td>1只/齿轮箱</td>
            <td><strong>启动 ≤{{backupPumpStartPressure}} MPa / 停止 ≥{{backupPumpStopPressure}} MPa</strong></td>
          </tr>
        </tbody>
      </table>
      <p class="note">以上报警控制器均提供直流无源开关量信号</p>
    </div>
  </section>

  <section class="agreement-section gws-special-section">
    <h2>八、高弹联轴器</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">型号：</div>
        <div class="info-value">{{couplingModel}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">额定扭矩：</div>
        <div class="info-value">{{couplingTorque}} kNm</div>
      </div>
      <div class="info-row">
        <div class="info-label">成套方：</div>
        <div class="info-value">
          <div class="checkbox-group">
            <label><input type="checkbox" {{couplingBySupplier}}> 供方</label>
            <label><input type="checkbox" {{couplingByDemander}}> 需方</label>
          </div>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">联接件：</div>
        <div class="info-value">配齐与主机、齿轮箱的联接紧固件</div>
      </div>
    </div>
  </section>

  <section class="agreement-section gws-backup-pump-section">
    <h2>九、电动备用泵</h2>
    <div class="info-table">
      <div class="info-row">
        <div class="info-label">型号：</div>
        <div class="info-value">{{backupPumpModel}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">流量：</div>
        <div class="info-value">{{backupPumpFlowRate}} m³/h</div>
      </div>
      <div class="info-row">
        <div class="info-label">压力：</div>
        <div class="info-value">{{backupPumpPressure}} MPa</div>
      </div>
      <div class="info-row">
        <div class="info-label">电机功率：</div>
        <div class="info-value">{{backupPumpMotorPower}} kW</div>
      </div>
      <div class="info-row">
        <div class="info-label">电机电压：</div>
        <div class="info-value">{{backupPumpMotorVoltage}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">防护等级：</div>
        <div class="info-value">{{backupPumpMotorProtection}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">绝缘等级：</div>
        <div class="info-value">{{backupPumpMotorInsulation}}</div>
      </div>
      <div class="info-row">
        <div class="info-label">数量：</div>
        <div class="info-value">{{quantity}} 台（1台/齿轮箱）</div>
      </div>
    </div>

    <h3 class="subsection-title">备用泵控制箱</h3>
    <div class="content-text">
      <table class="delivery-table">
        <tr>
          <td><strong>数量</strong></td>
          <td>{{quantity}} 只（1只/电动泵）</td>
        </tr>
        <tr>
          <td><strong>功能</strong></td>
          <td>{{backupPumpControlBoxFeatures}}</td>
        </tr>
        <tr>
          <td><strong>启动条件</strong></td>
          <td>当润滑油压力降至 {{backupPumpStartPressure}} MPa 时，控制箱自动启动备用泵</td>
        </tr>
        <tr>
          <td><strong>停止条件</strong></td>
          <td>当润滑油压力恢复至 {{backupPumpStopPressure}} MPa 时，控制箱自动停止备用泵</td>
        </tr>
      </table>
    </div>
  </section>

  <section class="agreement-section">
    <h2>十、认可图纸</h2>
    <div class="content-text">
      <p>协议生效后{{approvalPeriod}}日内，制造厂向甲方提供以下认可资料：</p>
      <ul>
        <li>外形及安装图</li>
        <li>电气接线图</li>
        <li>管系图</li>
      </ul>
      <p>甲方在接到认可资料{{feedbackPeriod}}日内给予意见反馈。</p>
    </div>
  </section>

  <section class="agreement-section">
    <h2>十一、随机文件</h2>
    <div class="content-text">
      <ul>
        <li>产品合格证书</li>
        <li>使用维护说明书</li>
        <li>装箱清单</li>
        <li>{{classificationName}}船检产品证书</li>
      </ul>
    </div>
  </section>

  <section id="quality-section" class="agreement-section">
    <h2>十二、质量保证</h2>
    <div class="content-text">
      <p><strong>三包期</strong>：{{warrantyText}}</p>
      <p><strong>三包条款</strong>：在三包期内，确因设计及制造不良而造成的质量问题，制造厂保证免费提供零件，并派人进行修理和技术服务。</p>
      <p><strong>服务承诺</strong>：超过三包期后仍提供及时、优质、优惠的服务</p>
      <p><strong>服务电话</strong>：{{servicePhone}}</p>
    </div>
  </section>

  <section class="agreement-section">
    <h2>十三、特殊订货要求</h2>
    <div class="content-text special-requirements">
      {{specialRequirements}}
    </div>
  </section>

  <section class="agreement-section">
    <h2>十四、未尽事宜</h2>
    <div class="content-text">
      <p>未尽事宜友好协商解决。本协议作为齿轮箱设计制造、质量检验、交货验收的技术依据，作为订货合同的附件。</p>
    </div>
  </section>
</div>`;