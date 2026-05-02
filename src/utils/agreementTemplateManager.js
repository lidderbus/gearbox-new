// src/utils/agreementTemplateManager.js
/**
 * 技术协议模板管理器
 * 用于管理不同类型齿轮箱的技术协议模板，支持中英文双语
 * 简化版 - 解决编译问题
 */

// 导入模板
import {
  gwcChineseTemplate,
  gwcEnglishTemplate,
  hctChineseTemplate,
  hcChineseTemplate,
  dtChineseTemplate,
  hcqChineseTemplate,
  gwsChineseTemplate
} from './agreementTemplates';

// 协议模板类型枚举
export const TemplateType = {
  GWC: 'GWC',     // GWC系列船用齿轮箱
  GWS: 'GWS',     // GWS系列船用齿轮箱（电控双机备用泵启停）
  HCT: 'HCT',     // HCT系列船用齿轮箱
  HC: 'HC',       // HC系列船用齿轮箱
  DT: 'DT',       // DT系列船用齿轮箱
  HCQ: 'HCQ',     // HCQ系列船用齿轮箱（高扭矩大功率）
  HCD: 'HCD',     // HCD系列船用齿轮箱
};

// 语言类型枚举
export const LanguageType = {
  CHINESE: 'zh',  // 中文
  ENGLISH: 'en'   // 英文
};

/**
 * 中文→英文翻译词典（按匹配优先级排序，长字符串在前）
 */
const zhToEnDict = [
  // === 标题 ===
  ['系列船用齿轮箱订货技术协议', ' Series Marine Gearbox Technical Agreement'],
  ['系列船用齿轮箱技术协议', ' Series Marine Gearbox Technical Agreement'],
  ['型船用齿轮箱技术协议', ' Marine Gearbox Technical Agreement'],
  ['（电控 双机 备用泵启停及控制箱）', '(Electric Control, Twin Engine, Standby Pump Start/Stop & Control Box)'],
  // === 签署方 ===
  ['杭州前进齿轮箱集团股份有限公司', 'Hangzhou Advance Gearbox Group Co., Ltd.'],
  ['前进牌船用齿轮箱', 'ADVANCE brand marine gearbox'],
  ['船厂/需方（甲方）', 'Shipyard/Buyer (Party A)'],
  ['船厂/设计院', 'Shipyard/Design Institute'],
  ['船东（甲方）', 'Ship Owner (Party A)'],
  ['船厂（乙方）', 'Shipyard (Party B)'],
  ['设计院（丙方）', 'Design Institute (Party C)'],
  ['制造厂（丁方）', 'Manufacturer (Party D)'],
  ['制造厂（乙方）', 'Manufacturer (Party B)'],
  ['项目编号/船型', 'Project No./Ship Type'],
  ['协议编号', 'Agreement No.'],
  ['签字', 'Signature'],
  ['日期', 'Date'],
  ['船东', 'Ship Owner'],
  ['船厂', 'Shipyard'],
  ['船检', 'Classification'],
  ['船号', 'Hull No.'],
  ['船名', 'Ship Name'],
  ['设计方', 'Designer'],
  ['设计院', 'Design Institute'],
  ['制造商', 'Manufacturer'],
  ['制造厂', 'Manufacturer'],
  // === 总则/前言 ===
  ['技术协议总则', 'General Provisions'],
  ['总则', 'General Provisions'],
  ['法规与规范', 'Regulations and Standards'],
  ['各方就选用杭州前进齿轮箱集团股份有限公司生产的', 'The parties have reached this agreement on technical matters regarding the selection of '],
  ['型船用齿轮箱事宜，经双方友好协商，就有关技术问题达成协议如下：', ' marine gearbox manufactured by Hangzhou Advance Gearbox Group Co., Ltd., through friendly consultation as follows:'],
  ['为订购杭州前进齿轮箱集团股份有限公司生产的前进牌船用齿轮箱，甲乙双方就有关技术问题达成如下协议。', 'For the purchase of ADVANCE brand marine gearbox manufactured by Hangzhou Advance Gearbox Group Co., Ltd., the parties have reached the following technical agreement.'],
  // === 章节标题 ===
  ['齿轮箱使用工况', 'Gearbox Operating Conditions'],
  ['柴油机主要参数', 'Main Engine Parameters'],
  ['齿轮箱主要参数', 'Main Gearbox Parameters'],
  ['物理特性与环境条件', 'Physical Characteristics & Environmental Conditions'],
  ['齿轮箱监控配置', 'Gearbox Monitoring Configuration'],
  ['齿轮箱的随机技术资料', 'Gearbox Technical Documents'],
  ['随机技术资料', 'Technical Documents'],
  ['质量保证和技术服务', 'Quality Assurance and Technical Service'],
  ['质量保证及服务', 'Quality Assurance and Service'],
  ['供货范围（每船）', 'Delivery Scope (Per Vessel)'],
  ['未尽事宜', 'Other Matters'],
  ['特殊订货要求', 'Special Order Requirements'],
  ['船舶信息', 'Vessel Information'],
  ['主机信息', 'Engine Information'],
  ['齿轮箱信息', 'Gearbox Information'],
  ['齿轮箱技术规格', 'Gearbox Technical Specifications'],
  ['仪表与报警', 'Instruments and Alarms'],
  ['成套配件', 'Accessories'],
  // === 标签（info-label） ===
  ['动力机组布置方式', 'Power Unit Arrangement'],
  ['机组排列及旋转示意图（顺车）', 'Unit Arrangement & Rotation Diagram (Forward)'],
  ['机组排列示意图', 'Arrangement Diagram'],
  ['船舶制造单位', 'Shipbuilder'],
  ['船舶工程号', 'Hull Number'],
  ['船舶设计单位', 'Vessel Designer'],
  ['船舶类型', 'Vessel Type'],
  ['船检要求', 'Classification Requirements'],
  ['主机转向（面向飞轮）', 'Engine Rotation (Facing Flywheel)'],
  ['转向（面对飞轮端向自由端看）', 'Rotation (Facing Flywheel End to Free End)'],
  ['主机额定功率', 'Rated Power'],
  ['主机额定转速', 'Rated Speed'],
  ['主机最低稳定转速', 'Minimum Stable Speed'],
  ['主机型号', 'Engine Model'],
  ['使用工况', 'Operating Condition'],
  ['齿轮箱型号', 'Gearbox Model'],
  ['型号', 'Model'],
  ['排列方式', 'Arrangement'],
  ['输入联轴节型式', 'Input Coupling Type'],
  ['输入联轴节', 'Input Coupling'],
  ['输入联轴器', 'Input Coupling'],
  ['订货数量', 'Order Quantity'],
  ['交货时间', 'Delivery Time'],
  ['监控系统', 'Monitoring System'],
  ['操控方式', 'Control Method'],
  ['操纵系统', 'Control System'],
  ['配套主机额定转速', 'Matching Engine Rated Speed'],
  ['减速比及相应传递能力', 'Reduction Ratio & Transmission Capacity'],
  ['倒车传递能力', 'Reverse Transmission Capacity'],
  ['传递能力', 'Transmission Capacity'],
  ['减速比', 'Reduction Ratio'],
  ['传动型式', 'Transmission Type'],
  ['离合器型式', 'Clutch Type'],
  ['额定输入转速', 'Rated Input Speed'],
  ['额定功率', 'Rated Power'],
  ['额定转速', 'Rated Speed'],
  ['输入输出中心距', 'I/O Center Distance'],
  ['额定螺旋桨推力', 'Rated Propeller Thrust'],
  ['机械效率', 'Mechanical Efficiency'],
  ['换向时间', 'Direction Change Time'],
  ['工作油压', 'Working Oil Pressure'],
  ['机油牌号', 'Oil Grade'],
  ['机油容量', 'Oil Capacity'],
  ['最高油温', 'Max Oil Temperature'],
  ['冷却水耗量', 'Cooling Water Flow'],
  ['冷却水', 'Cooling Water'],
  ['大修期', 'Overhaul Period'],
  ['重量 (约)', 'Weight (Approx.)'],
  ['净重', 'Net Weight'],
  ['重量', 'Weight'],
  ['外形尺寸（长×宽×高）', 'Dimensions (L×W×H)'],
  ['外形尺寸 (长×宽×高)', 'Dimensions (L×W×H)'],
  ['外观', 'Appearance'],
  ['贮存温度', 'Storage Temperature'],
  ['使用温度', 'Operating Temperature'],
  ['海水温度', 'Seawater Temperature'],
  ['相对湿度', 'Relative Humidity'],
  ['可工作倾斜度', 'Working Inclination'],
  ['工作倾斜度', 'Working Inclination'],
  ['输入轴转向（面对输出端向前看）', 'Input Shaft Rotation (Facing Output End)'],
  ['顺车输出轴转向（与输入轴比较）', 'Forward Output Shaft Rotation (vs. Input Shaft)'],
  ['船级社', 'Classification Society'],
  ['功能', 'Function'],
  // === 复选框/选项 ===
  ['CCS 入级', 'CCS Entry'],
  ['CCS 非入级', 'CCS Non-Entry'],
  ['CCS 远洋渔船', 'CCS Ocean Fishing Vessel'],
  ['ZY 国内渔船', 'ZY Domestic Fishing Vessel'],
  ['国外船检', 'Foreign Classification'],
  ['船级社注册号', 'Classification Society Registration No.'],
  ['CCS证书入级', 'CCS Certificate (Entry)'],
  ['CCS认可的产品合格证书', 'CCS Approved Product Certificate'],
  ['顺时针', 'Clockwise'],
  ['逆时针', 'Counter-Clockwise'],
  ['%额定转速', '% of Rated Speed'],
  ['其它', 'Other'],
  ['主推进', 'Main Propulsion'],
  ['标配', 'Standard'],
  ['特配', 'Special'],
  ['手控', 'Manual Control'],
  ['电控（远距离电动遥控操纵，输入额定电压', 'Electric Control (Remote electric control, rated input voltage '],
  ['电控', 'Electric Control'],
  ['气控', 'Pneumatic Control'],
  ['供方', 'Supplier'],
  ['需方', 'Buyer'],
  // === 仪表/报警 ===
  ['机旁仪表', 'Local Instruments'],
  ['报警配置', 'Alarm Configuration'],
  ['报警指示', 'Alarm Indication'],
  ['显示信号输出', 'Display Signal Output'],
  ['信号输出', 'Signal Output'],
  ['润滑油压表 1只', 'Lubricating oil pressure gauge (1 pc)'],
  ['润滑油温表 1只', 'Lubricating oil temperature gauge (1 pc)'],
  ['工作油压力表 1只', 'Working oil pressure gauge (1 pc)'],
  ['工作油压表1只', 'Working oil pressure gauge (1 pc)'],
  ['滑油压力表1只', 'Lubricating oil pressure gauge (1 pc)'],
  ['滑油温度表1只', 'Lubricating oil temperature gauge (1 pc)'],
  // === HCT报警详情 ===
  ['滑油压力低控制器1只（滑油压力低报警，下降至', 'Low oil pressure controller (1 pc), alarm when oil pressure drops to '],
  ['MPa时动作），输入到主机机旁仪表箱进行滑油油压低报警（标记相应铭牌）。', 'MPa), input to engine instrument box for low oil pressure alarm (with nameplate).'],
  ['工作油压力低控制器1只（工作油压力低报警，降至', 'Low working oil pressure controller (1 pc), alarm when working oil pressure drops to '],
  ['MPa时动作），输入到主机机旁仪表箱进行工作油压低报警（标记相应铭牌）。', 'MPa), input to engine instrument box for low working oil pressure alarm (with nameplate).'],
  ['滑油温度高控制器1只（滑油温度高报警，油温高于', 'High oil temperature controller (1 pc), alarm when oil temperature exceeds '],
  ['℃时动作），输入到主机机旁仪表箱进行滑油温度高报警（标记相应铭牌）。', '°C), input to engine instrument box for high oil temperature alarm (with nameplate).'],
  ['滑油温度传感器1只，输出4-20mA模拟量信号。', 'Oil temperature sensor (1 pc), 4-20mA analog signal output.'],
  ['滑油压力传感器1只，输出4-20mA模拟量信号。', 'Oil pressure sensor (1 pc), 4-20mA analog signal output.'],
  ['工作油压力传感器1只，输出4-20mA模拟量信号。', 'Working oil pressure sensor (1 pc), 4-20mA analog signal output.'],
  // === GWC报警详情 ===
  ['正车及倒车工作油压力控制器各1个，当工作油压降至', 'Forward and reverse working oil pressure controllers (1 each), alarm when working oil pressure drops to '],
  ['MPa时报警', 'MPa'],
  ['润滑油压力控制器1只，当润滑油压力降至', 'Lubricating oil pressure controller (1 pc), alarm when lubricating oil pressure drops to '],
  ['滑油低压报警、油温高报警控制器各1只，均为直流无源开关量信号', 'Low oil pressure alarm and high oil temperature alarm controllers (1 each), DC passive switch signals'],
  // === 配件 ===
  ['高弹联轴器型号', 'Flexible Coupling Model'],
  ['高弹联轴器成套方', 'Coupling Supplied By'],
  ['高弹性联轴器成套方', 'Coupling Supplied By'],
  ['备用泵机组型号', 'Standby Pump Model'],
  ['备用泵机组成套方', 'Pump Supplied By'],
  // === 供货表 ===
  ['序号', 'No.'],
  ['名称', 'Description'],
  ['规格型号', 'Model/Spec'],
  ['规格', 'Spec'],
  ['数量', 'Quantity'],
  ['备注', 'Remarks'],
  ['齿轮箱', 'Gearbox'],
  ['高弹性联轴器', 'Flexible Coupling'],
  ['高弹联轴器', 'Flexible Coupling'],
  ['备用泵机组', 'Standby Pump Unit'],
  ['接线盒', 'Junction Box'],
  ['监控', 'Monitoring'],
  ['备件', 'Spare Parts'],
  ['台/船', ' unit(s)/vessel'],
  ['台', ' unit(s)'],
  ['个', ' pc(s)'],
  ['套', ' set(s)'],
  ['含滑油泵机组', 'Including oil pump unit'],
  ['配齐与主机、齿轮箱的联接件', 'Complete with connecting parts for engine and gearbox'],
  ['电动滑油泵', 'Electric oil pump'],
  ['提供轴系扭振计算书', 'Torsional vibration calculation report provided'],
  ['机带', 'Engine-mounted'],
  ['三表四报警二指示三显示', '3 gauges, 4 alarms, 2 indicators, 3 displays'],
  ['易损密封件', 'Consumable seals'],
  // === 技术资料表 ===
  ['使用说明书', 'Operation Manual'],
  ['外形安装图', 'Outline Installation Drawing'],
  ['电气接线图', 'Electrical Wiring Diagram'],
  ['产品合格证书', 'Product Certificate'],
  ['装箱清单', 'Packing List'],
  ['1份/台', '1 copy/unit'],
  ['1份', '1 copy'],
  // === 质量保证条款 ===
  ['在协议生效后', 'Within '],
  ['天内，制造厂向设计院、船厂提供认可资料（外形及安装图、电气接线图），均采用CAD电子版。设计院、船厂在接到认可资料', ' days after the agreement takes effect, the manufacturer shall provide approval documents (outline and installation drawings, electrical wiring diagrams) to the design institute and shipyard in CAD electronic format. The design institute and shipyard shall provide feedback within '],
  ['天内意见反馈。', ' days after receiving the approval drawings.'],
  ['齿轮箱出厂前在制造厂试验台进行台架试验，按CCS认可的试验大纲进行检验和验收。', 'The gearbox shall undergo bench test at the manufacturer\'s test stand before delivery, and shall be inspected and accepted according to CCS approved test procedure.'],
  ['台架试验前一周通知各方，试验需由船东代表和验船师在场的情况下进行。', 'All parties shall be notified one week before the bench test, and the test shall be conducted in the presence of the ship owner\'s representative and surveyor.'],
  ['油封有效期为自发货之日起一年。', 'Oil seal validity period is one year from the date of shipment.'],
  ['使用方必须按本厂提供的使用说明书安装、使用和保养。安装找正请按使用维护说明书有关规定进行。', 'The user must install, use and maintain the equipment according to the operation manual provided by the manufacturer. Installation alignment shall be performed according to the operation and maintenance manual.'],
  ['在交船后', 'Within '],
  ['个月内确因设计及制造不良而造成的质量问题，制造厂保证免费提供零件，并派人进行修理和技术服务。', ' months after vessel delivery, for quality problems caused by design or manufacturing defects, the manufacturer guarantees to provide parts free of charge and send personnel for repair and technical service.'],
  ['本协议作为齿轮箱的设计制造、质量检验、交货验收的技术依据，作为订货合同的附件。', 'This agreement serves as the technical basis for gearbox design, manufacturing, quality inspection, and delivery acceptance, and as an attachment to the purchase contract.'],
  ['任何技术协议中未提及的细节由认可图决定，将被认为是技术协议的一部分。除买卖双方书面同意修改外，任何与技术协议不符的应以技术协议为准。', 'Any details not mentioned in this technical agreement shall be determined by the approval drawings, which shall be considered as part of this technical agreement. Any discrepancy shall be governed by this agreement unless otherwise agreed in writing by both parties.'],
  // === HCT质量条款 ===
  ['齿轮箱的出厂试验按工厂试验大纲进行。', 'Factory tests of the gearbox shall be conducted according to the factory test procedure.'],
  ['甲方必须按本厂提供的使用说明书安装、使用和保养。', 'Party A must install, use and maintain the equipment according to the operation manual provided by the manufacturer.'],
  ['齿轮箱"三包"按制造厂有关规定执行。', 'Gearbox warranty ("Three Guarantees") shall be implemented according to the manufacturer\'s regulations.'],
  ['售后服务联系电话', 'After-sales service hotline: '],
  ['质保期交货后18个月或交船后12个月先到为准。', 'Warranty: 18 months after delivery or 12 months after vessel commissioning, whichever comes first.'],
  // === 注释/其他 ===
  ['注：提供4份纸版完工资料/每船及CD盘完工文件。电子版图纸与实物1:1比例绘制。', 'Note: 4 copies of paper completion documents per vessel plus CD completion files will be provided. Electronic drawings shall be drawn at 1:1 scale with actual equipment.'],
  ['未尽事宜友好协商解决。协议中未提及，但是属于设备正常安装、使用或适用的法规规范所要求的附件及备件，将由卖方无偿提供。', 'Other matters not covered in this agreement shall be settled through friendly consultation. Accessories and spare parts not mentioned in the agreement but required for normal installation, use or applicable regulations and specifications shall be provided free of charge by the seller.'],
  ['本协议作为齿轮箱的设计制造、质量检验、交货验收的技术依据，作为订货合同的附件。未尽事宜双方友好协商解决。', 'This agreement serves as the technical basis for gearbox design, manufacturing, quality inspection, and delivery acceptance, and as an attachment to the purchase contract. Other matters shall be settled through friendly consultation.'],
  // === DT系列特有 ===
  ['各方就选用杭州前进齿轮箱集团股份有限公司生产的', 'The parties have reached this agreement on technical matters regarding the selection of '],
  ['型电动船用齿轮箱和高弹性联轴器事宜，经多方友好协商，就有关技术问题达成协议如下：', ' electric marine gearbox and flexible coupling manufactured by Hangzhou Advance Gearbox Group Co., Ltd., through friendly consultation as follows:'],
  ['总则：', 'General Provisions:'],
  ['一、主机技术参数', 'I. Main Engine Parameters'],
  ['二、齿轮箱技术参数', 'II. Main Gearbox Parameters'],
  ['三、物理特性与环境条件', 'III. Physical Characteristics & Environmental Conditions'],
  ['四、高弹性联轴器', 'IV. Flexible Coupling'],
  ['五、供货范围', 'V. Delivery Scope'],
  ['六、质量保证及服务', 'VI. Quality Assurance and Service'],
  ['七、特殊订货要求', 'VII. Special Order Requirements'],
  ['制造厂（丙方）', 'Manufacturer (Party C)'],
  ['额定传递能力', 'Rated Transmission Capacity'],
  ['输入转速', 'Input Speed'],
  ['输出转向', 'Output Rotation'],
  ['与输入', 'Same as input'],
  ['润滑油压', 'Lubricating Oil Pressure'],
  ['螺旋桨最大推力', 'Max Propeller Thrust'],
  ['中心距', 'Center Distance'],
  ['油温', 'Oil Temperature'],
  ['机油容积', 'Oil Capacity'],
  ['冷却水进水温度', 'Cooling Water Inlet Temperature'],
  ['冷却水量', 'Cooling Water Volume'],
  ['冷却水进口压力', 'Cooling water inlet pressure'],
  ['（正车）转向', '(Forward) Rotation'],
  ['倾斜度', 'Inclination'],
  ['纵摇', ', Longitudinal swing '],
  ['横摇', ', Transverse swing '],
  ['安装方式', 'Installation Method'],
  ['电动滑油泵', 'Electric Oil Pump'],
  ['额定流量', 'Rated Flow'],
  ['电机功率', 'Motor Power'],
  ['防护等级', 'Protection Rating'],
  ['绝缘等级', 'Insulation Class'],
  ['大修时间', 'Overhaul Period'],
  ['小时', ' hours'],
  ['齿轮箱铭牌材质', 'Gearbox Nameplate Material'],
  ['仪表与报警', 'Instruments and Alarms'],
  ['制造厂家', 'Manufacturer'],
  ['高弹型号', 'Coupling Model'],
  ['（以认可资料为准）。', '(Subject to approval documents).'],
  ['附带与电机和齿轮箱的联接件。', 'Complete with connecting parts for engine and gearbox.'],
  ['船用齿轮箱（含润滑油泵机组）', 'Marine Gearbox (including oil pump unit)'],
  ['（含润滑油泵机组）', '(including oil pump unit)'],
  ['台/船', ' unit(s)/vessel'],
  ['套/船', ' set(s)/vessel'],
  ['1份/套', '1 copy/set'],
  ['随机附带使用说明书', 'Including operation manual'],
  ['外形安装图', 'Outline installation drawing'],
  ['产品合格证书', 'Product certificate'],
  ['提供CCS船检产品证书', 'CCS classification product certificate provided'],
  ['提供CCS船检书', 'CCS certificate provided'],
  ['配齐与电机、齿轮箱的联接件。', 'Complete with connecting parts for engine and gearbox.'],
  ['交货试验在制造厂的试验台位上进行，按CCS有关规范和认可的试验大纲进行检验和验收，并出具合格证明书。试验前一周通知各方。', 'Delivery tests shall be conducted at the manufacturer\'s test stand, inspected and accepted according to CCS regulations and approved test procedures, with certificates issued. All parties shall be notified one week before the test.'],
  ['使用方必须按本厂提供的使用说明书安装、使用和保养，在交船（船厂与船东签订协议之日）后', 'The user must install, use and maintain according to the manufacturer\'s operation manual. Within '],
  ['内确因设计及制造不良而造成的质量问题，制造厂保证免费提供零件，并派人进行修理和技术服务。', ' after vessel delivery, for quality problems caused by design or manufacturing defects, the manufacturer guarantees to provide parts free of charge and send personnel for repair and technical service.'],
  ['本协议作为齿轮箱的设计制造、质量检验、交货验收的技术依据，作为订货合同的附件。任何技术协议中未提及的细节由认可图决定，将被认为是技术协议的一部分。除买卖双方书面同意修改外，任何与技术协议不符的应以技术协议为准。协议中未提及，但是属于设备正常安装、使用或适用的法规规范所要求的附件及备件，将由卖方无偿提供。', 'This agreement serves as the technical basis for gearbox design, manufacturing, quality inspection, and delivery acceptance, and as an attachment to the purchase contract. Any details not mentioned shall be determined by the approval drawings and considered part of this agreement. Accessories and spare parts required for normal installation, use or applicable regulations shall be provided free of charge by the seller.'],
  ['未尽事宜各方协商解决。', 'Other matters shall be settled through consultation among all parties.'],
  ['具有减速和承受螺旋桨推力的功能。', 'With the function of speed reduction and propeller thrust bearing.'],
  // === HCQ系列特有 ===
  ['一、船舶信息', 'I. Vessel Information'],
  ['二、柴油机参数', 'II. Diesel Engine Parameters'],
  ['三、齿轮箱技术规格', 'III. Gearbox Technical Specifications'],
  ['四、物理特性与环境条件', 'IV. Physical Characteristics & Environmental Conditions'],
  ['五、供货清单', 'V. Supply List'],
  ['六、质量保证', 'VI. Quality Assurance'],
  ['七、持证要求', 'VII. Certification Requirements'],
  ['八、设计依据', 'VIII. Design Standards'],
  ['九、特殊订货要求', 'IX. Special Order Requirements'],
  ['船舶总长', 'Overall Length'],
  ['船宽', 'Breadth'],
  ['型深', 'Depth'],
  ['飞轮规格', 'Flywheel Specification'],
  ['s（可调节）', 's (adjustable)'],
  ['尺寸（长×宽×高）', 'Dimensions (L×W×H)'],
  ['项目', 'Item'],
  ['主机', 'Main Unit'],
  ['仪表', 'Instruments'],
  ['控制器', 'Controller'],
  ['报警', 'Alarm'],
  ['冷却', 'Cooling'],
  ['文件', 'Documents'],
  ['工作压力表', 'Working Pressure Gauge'],
  ['提供开关量信号', 'Provides switch signal'],
  ['正车/倒车/空车指示控制器', 'Forward/Reverse/Neutral Indicator Controller'],
  ['滑油低压报警/油温高报警', 'Low Oil Pressure Alarm / High Oil Temperature Alarm'],
  ['滑油冷却器', 'Oil Cooler'],
  ['CCS证书、合格证、说明书、装箱清单', 'CCS Certificate, Product Certificate, Manual, Packing List'],
  ['三包期', 'Warranty Period'],
  ['船艇完工交付之日起12个月', '12 months from vessel delivery date'],
  ['服务承诺', 'Service Commitment'],
  ['超过三包期后仍提供及时、优质、优惠的服务', 'Timely, quality, and preferential service is still provided after warranty period'],
  ['齿轮箱需持有CCS非入级船用产品证书', 'The gearbox shall hold CCS non-entry marine product certificate'],
  ['设计依据', 'Design Standards'],
  ['中国船级社《国内航行小型海船技术规则》(2024)', 'CCS "Technical Rules for Small Sea-Going Vessels on Domestic Voyages" (2024)'],
  ['中华人民共和国海事局《国内航行海船法定检验技术规则》(2020)', 'PRC Maritime Safety Administration "Technical Rules for Statutory Inspection of Domestic Vessels" (2020)'],
  // === GWS系列特有 ===
  ['一、柴油机参数', 'I. Diesel Engine Parameters'],
  ['二、齿轮箱参数', 'II. Gearbox Parameters'],
  ['三、工作原理', 'III. Operating Principle'],
  ['四、操纵方式', 'IV. Control Method'],
  ['五、润滑、冷却', 'V. Lubrication & Cooling'],
  ['六、随机附件', 'VI. Accessories'],
  ['七、报警装置', 'VII. Alarm System'],
  ['八、高弹联轴器', 'VIII. Flexible Coupling'],
  ['九、电动备用泵', 'IX. Electric Standby Pump'],
  ['十、认可图纸', 'X. Approval Drawings'],
  ['十一、随机文件', 'XI. Technical Documents'],
  ['十二、质量保证', 'XII. Quality Assurance'],
  ['十三、特殊订货要求', 'XIII. Special Order Requirements'],
  ['十四、未尽事宜', 'XIV. Other Matters'],
  ['输出轴旋转方向（面向飞轮）', 'Output Shaft Rotation (Facing Flywheel)'],
  ['额定推力', 'Rated Thrust'],
  ['（垂直异心）', '(Vertical offset)'],
  ['操纵方式', 'Control Method'],
  ['控制电压', 'Control Voltage'],
  ['电控换向阀随齿轮箱成套供货', 'Electro-hydraulic directional valve supplied complete with gearbox'],
  ['润滑、冷却', 'Lubrication & Cooling'],
  ['冷却水用量', 'Cooling Water Consumption'],
  ['冷却水进口温度', 'Cooling Water Inlet Temperature'],
  ['冷却水压力', 'Cooling Water Pressure'],
  ['润滑油压力', 'Lubricating Oil Pressure'],
  ['随机附件', 'Accessories'],
  ['滑油泵（内置）', 'Oil Pump (Built-in)'],
  ['滑油滤油器', 'Oil Filter'],
  ['电控换向阀', 'Electro-hydraulic Directional Valve'],
  ['1台/齿轮箱', '1 unit/gearbox'],
  ['1只/齿轮箱', '1 pc/gearbox'],
  ['各1只/齿轮箱', '1 pc each/gearbox'],
  ['报警装置', 'Alarm System'],
  ['报警整定值', 'Alarm Setpoint'],
  ['润滑油压表', 'Lubricating Oil Pressure Gauge'],
  ['润滑油温表', 'Lubricating Oil Temperature Gauge'],
  ['工作油压力表', 'Working Oil Pressure Gauge'],
  ['滑油低压报警控制器', 'Low Oil Pressure Alarm Controller'],
  ['油温高报警控制器', 'High Oil Temperature Alarm Controller'],
  ['工作油压力低报警控制器', 'Low Working Oil Pressure Alarm Controller'],
  ['备用泵启停控制器', 'Standby Pump Start/Stop Controller'],
  ['启动', 'Start'],
  ['停止', 'Stop'],
  ['以上报警控制器均提供直流无源开关量信号', 'All above alarm controllers provide DC passive switch signals'],
  ['额定扭矩', 'Rated Torque'],
  ['成套方', 'Supplied By'],
  ['联接件', 'Connecting Parts'],
  ['配齐与主机、齿轮箱的联接紧固件', 'Complete with fasteners for engine and gearbox connection'],
  ['电动备用泵', 'Electric Standby Pump'],
  ['流量', 'Flow Rate'],
  ['电机电压', 'Motor Voltage'],
  ['台（1台/齿轮箱）', ' unit(s) (1 unit/gearbox)'],
  ['只（1只/电动泵）', ' pc(s) (1 pc/pump)'],
  ['备用泵控制箱', 'Standby Pump Control Box'],
  ['启动条件', 'Start Condition'],
  ['停止条件', 'Stop Condition'],
  ['当润滑油压力降至', 'When lubricating oil pressure drops to '],
  ['MPa 时，控制箱自动启动备用泵', ' MPa, the control box automatically starts the standby pump'],
  ['当润滑油压力恢复至', 'When lubricating oil pressure recovers to '],
  ['MPa 时，控制箱自动停止备用泵', ' MPa, the control box automatically stops the standby pump'],
  ['认可图纸', 'Approval Drawings'],
  ['协议生效后', 'Within '],
  ['日内，制造厂向甲方提供以下认可资料：', ' days after the agreement takes effect, the manufacturer shall provide the following approval documents:'],
  ['甲方在接到认可资料', 'Party A shall provide feedback within '],
  ['日内给予意见反馈。', ' days after receiving the approval documents.'],
  ['外形及安装图', 'Outline and Installation Drawing'],
  ['管系图', 'Piping Diagram'],
  ['随机文件', 'Technical Documents'],
  ['使用维护说明书', 'Operation and Maintenance Manual'],
  ['船检产品证书', 'Classification Product Certificate'],
  ['三包条款', 'Warranty Terms'],
  ['在三包期内，确因设计及制造不良而造成的质量问题，制造厂保证免费提供零件，并派人进行修理和技术服务。', 'Within the warranty period, for quality problems caused by design or manufacturing defects, the manufacturer guarantees to provide parts free of charge and send personnel for repair and technical service.'],
  ['服务电话', 'Service Hotline'],
  ['未尽事宜友好协商解决。本协议作为齿轮箱设计制造、质量检验、交货验收的技术依据，作为订货合同的附件。', 'Other matters shall be settled through friendly consultation. This agreement serves as the technical basis for gearbox design, manufacturing, quality inspection, and delivery acceptance, and as an attachment to the purchase contract.'],
  // === HCT系列章节号 ===
  ['持证要求', 'Certification Requirements'],
  ['供货清单', 'Supply List'],
  ['各', 'each '],
  // === 通用短语（放最后） ===
  ['纵倾', 'Longitudinal trim '],
  ['横倾', ', Transverse trim '],
  ['冷却水进口温度', 'Cooling water inlet temperature'],
  ['压力', 'Pressure'],
  ['约', 'Approx. '],
  ['转向', 'Rotation'],
  ['功能', 'Function'],
];

/**
 * 将中文模板翻译为英文
 * @param {string} chineseTemplate - 中文模板HTML
 * @returns {string} 英文模板HTML
 */
const translateTemplateToEnglish = (chineseTemplate) => {
  let result = chineseTemplate;
  for (const [zh, en] of zhToEnDict) {
    // 使用全局替换
    result = result.split(zh).join(en);
  }
  return result;
};

/**
 * 获取技术协议模板
 * @param {string} templateType - 模板类型，见TemplateType枚举
 * @param {string} language - 语言类型，见LanguageType枚举
 * @param {object} options - 可选配置参数
 * @returns {string} 协议模板HTML内容
 */
export const getAgreementTemplate = (templateType, language, options = {}) => {
  // 先获取中文模板
  let chineseTemplate;

  switch (templateType) {
    case TemplateType.GWC:
      if (language === LanguageType.ENGLISH) {
        // GWC有专门的英文模板
        chineseTemplate = gwcEnglishTemplate;
        break;
      }
      chineseTemplate = gwcChineseTemplate;
      break;
    case TemplateType.GWS:
      chineseTemplate = gwsChineseTemplate;
      break;
    case TemplateType.HCT:
      chineseTemplate = hctChineseTemplate;
      break;
    case TemplateType.HC:
      chineseTemplate = hcChineseTemplate;
      break;
    case TemplateType.DT:
      chineseTemplate = dtChineseTemplate;
      break;
    case TemplateType.HCQ:
      chineseTemplate = hcqChineseTemplate;
      break;
    case TemplateType.HCD:
      chineseTemplate = hcChineseTemplate;
      break;
    default:
      console.warn(`找不到类型 ${templateType} 的模板，使用默认GWC模板`);
      chineseTemplate = language === LanguageType.ENGLISH ? gwcEnglishTemplate : gwcChineseTemplate;
  }

  // 如果需要英文且不是已有英文模板的GWC，自动翻译
  let template = chineseTemplate;
  if (language === LanguageType.ENGLISH && templateType !== TemplateType.GWC) {
    template = translateTemplateToEnglish(chineseTemplate);
  }

  if (!template) {
    console.warn(`找不到类型 ${templateType} 的模板，使用默认GWC模板`);
    template = gwcChineseTemplate;
  }
  
  // 应用自定义配置
  const { 
    includeQualitySection = true, 
    includeMaintenanceSection = true,
    includeAttachmentSection = true,
    includeShipInfo = true
  } = options;
  
  // 根据选项删除不需要的部分
  let processedTemplate = template;
  
  if (!includeQualitySection) {
    processedTemplate = removeSection(processedTemplate, 'quality-section');
  }
  
  if (!includeMaintenanceSection) {
    processedTemplate = removeSection(processedTemplate, 'maintenance-section');
  }
  
  if (!includeAttachmentSection) {
    processedTemplate = removeSection(processedTemplate, 'attachment-section');
  }
  
  if (!includeShipInfo) {
    processedTemplate = removeSection(processedTemplate, 'ship-info-section');
  }
  
  return processedTemplate;
};

/**
 * 从模板中移除指定部分
 * @param {string} template - 原始模板
 * @param {string} sectionId - 要移除的部分ID
 * @returns {string} 处理后的模板
 */
const removeSection = (template, sectionId) => {
  const regex = new RegExp(`<section[^>]*id="${sectionId}"[^>]*>.*?</section>`, 's');
  return template.replace(regex, '');
};

/**
 * 替换模板中的变量
 * @param {string} template - 原始模板
 * @param {object} data - 要替换的数据对象
 * @returns {string} 替换后的内容
 */
export const fillTemplate = (template, data) => {
  let result = template;
  
  // 替换所有 {{变量名}} 格式的变量
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, value != null ? String(value) : '');
  });
  
  // 清除未替换的变量（清除前记录日志以便排查）
  const unmatched = result.match(/\{\{([^}]+)\}\}/g);
  if (unmatched && unmatched.length > 0) {
    console.warn('[协议模板] 未替换的变量:', unmatched.map(m => m.replace(/[{}]/g, '')));
  }
  result = result.replace(/{{.*?}}/g, '');
  
  return result;
};

export default {
  getAgreementTemplate,
  fillTemplate,
  TemplateType,
  LanguageType
};