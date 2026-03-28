// src/components/EngineMatchingExpanded.js
// 多品牌主机匹配 - 基于选型算法的科学齿轮箱匹配推荐
import React, { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, InputGroup, Spinner, Button } from 'react-bootstrap';
import { autoSelectGearbox } from '../utils/selectionAlgorithm';
import { selectCouplingStandalone, loadFlexibleCouplings } from '../services/couplingSelectionService';

// 船型 → 典型螺旋桨转速(rpm) 映射表 (基于行业工程数据)
// 减速比 = 主机转速 / 螺旋桨转速
const PROP_RPM_MAP = {
  '游艇': 1400, '快艇': 1400, '游艇/快艇': 1400, '游艇/客船': 1200,
  '巡逻艇': 1000, '高速艇': 1000, '快艇/巡逻艇': 1100, '高速巡逻艇': 1000, '高速客船': 900,
  '渔船': 550, '渔船/拖轮': 450, '渔船/工作船': 500, '渔船/客船': 500,
  '内河渔船': 550, '小型渔船': 600, '大型渔船/货船': 350, '近海渔船': 500,
  '工作船': 450, '工作船/渔船': 500, '大型工作船': 400,
  '拖轮': 280, '拖轮/工作船': 350, '拖轮/渡轮': 330, '拖轮/工程船': 320,
  '拖轮/海工船': 300, '近海拖轮': 300, '大型拖轮': 250, '大型拖轮/渡轮': 280,
  '渡轮/客船': 420, '大型渡轮': 380, '客船/渡轮': 420,
  '散货船': 220, '散货船/集装箱': 200, '散货船/客船': 280, '散货船/拖轮': 260,
  '散货船/渡轮': 280, '散货船/油轮': 200, '大型散货船': 170, '大型散货船/渔船': 200,
  '集装箱船': 150, '集装箱船/海工': 180, '集装箱/油轮': 170,
  '油轮/散货船': 200, '油轮/化学品船': 180,
  '海工船/OSV': 350, '海工船/大型拖轮': 300,
  '内河小艇': 700, '内河客货船': 500, '内河货船': 450,
  '近海作业船': 450, '货船/拖轮': 350,
  '拖轮/疏浚船': 280, '军用巡逻艇': 900,
  '大型散货船/LNG': 160, '大型集装箱/邮轮': 130,
  // 补充缺失映射
  '高速客船/军用': 950, '大型高速客船': 850, '军用舰艇': 850,
  '游艇/渡轮': 1200, '渔船/客渡船': 500, '拖轮/散货船': 260,
  '渔船/快艇': 600, '集装箱船/油轮': 170, '拖轮/客船': 350,
  '大型拖轮/海工': 280, '渔船/游艇': 600, '大型散货船/渡轮': 200,
  '工作船/渡轮': 420, '工作船/拖轮': 400, '巡逻艇/工程船': 800,
  '巡逻艇/快艇': 1000, '巡逻艇/工作船': 800,
  '大型散货船/渔船': 200, '快艇/巡逻艇': 1100,
};
function getPropRpm(app) { return PROP_RPM_MAP[app] || 400; }

// 国际竞品齿轮箱参考 (基于功率段+转速)
function getCompetitorRef(power, speed) {
  const isHighSpeed = speed > 1800;
  if (power < 150) return isHighSpeed ? 'Twin Disc MG5061 / ZF 45' : 'Twin Disc MG502 / ZF 25A';
  if (power < 300) return isHighSpeed ? 'Twin Disc MG514 / ZF 280' : 'Twin Disc MG5091 / ZF 220';
  if (power < 500) return isHighSpeed ? 'Twin Disc MG527 / ZF 325' : 'ZF W320 / Reintjes WAF240';
  if (power < 800) return 'ZF W3300 / Reintjes WAF340 / Renk ASL4';
  if (power < 1200) return 'ZF W5000 / Reintjes WAF540 / Renk RSL6';
  if (power < 2000) return 'ZF W7000 / Reintjes WAF740';
  if (power < 4000) return 'ZF W9500 / Reintjes WAF873 / Renk RSL10';
  return 'Reintjes WAF1175+ / Renk RSL14';
}

const ENGINE_BRANDS = [
  { name: '康明斯 Cummins', country: '美国', models: ['B6.7M', 'QSB6.7', 'QSC8.3', 'QSL9', 'X15M', 'QSM11', 'KTA19', 'QSK19', 'KTA38', 'KTA50', 'QSK60'], founded: 1919, type: '国际', specialty: '高速/中速全系列', tier: 1 },
  { name: '卡特彼勒 CAT', country: '美国', models: ['C4.4', 'C7.1', 'C9.3', 'C12.9', 'C18', 'C32', '3508B', '3512B', '3516B', '3516C'], founded: 1925, type: '国际', specialty: '工程机械/船用全系列', tier: 1 },
  { name: 'MTU', country: '德国', models: ['S60', '6V2000', '8V2000', '10V2000', '12V2000', '16V2000', '8V4000', '12V4000', '16V4000', '20V4000'], founded: 1909, type: '国际', specialty: '高速大功率旗舰', tier: 2 },
  { name: '沃尔沃 Volvo Penta', country: '瑞典', models: ['D1', 'D2', 'D3', 'D4', 'D6', 'D8', 'D11', 'D13', 'D16'], founded: 1907, type: '国际', specialty: '游艇/中小功率', tier: 2 },
  { name: '曼恩 MAN', country: '德国', models: ['D0834', 'D0836', 'D2676', 'D2842', 'D2862', 'D2868', 'V8-1000', 'V8-1200', 'V12-1650', 'V12-1900'], founded: 1758, type: '国际', specialty: '中速/高速全系列', tier: 2 },
  { name: '潍柴 Weichai', country: '中国', models: ['WP2.3', 'WP3.2', 'WP4.1', 'WP6', 'WP7', 'WP10', 'WP12', 'WP13', 'WHM6160', 'CW200', 'CW250'], founded: 1946, type: '国产', specialty: '高速+中速全覆盖', tier: 1 },
  { name: '玉柴 Yuchai', country: '中国', models: ['YC4D', 'YC6B', 'YC6A', 'YC6J', 'YC6T', 'YC6MK', 'YC6K', 'YC6CL'], founded: 1951, type: '国产', specialty: '中小功率船用主力', tier: 1 },
  { name: '洋马 Yanmar', country: '日本', models: ['4JH', '4LV', '6LY', '6HYM', '6AYM', '6EY22', '6EY26W', '6N18', '6KFLN'], founded: 1912, type: '国际', specialty: '小型船用/渔船', tier: 2 },
  { name: '大发 Daihatsu', country: '日本', models: ['6DK-20', '6DK-28', '8DK-20'], founded: 1907, type: '国际', specialty: '中速大功率', tier: 3 },
  { name: '斗山 Doosan', country: '韩国', models: ['L086TI', 'L136', 'L136TI', 'L126TI', 'AD086TI', 'V158TI', 'V180TI', 'V222TI'], founded: 1937, type: '国际', specialty: '中小功率船用', tier: 2 },
  { name: '陕柴重工 SDHI', country: '中国', models: ['6PC2-5', '8PC2-5', '6PC2-6', '8PC2-6', '16PC2-6B', '6240ZC', '8240ZC'], founded: 1968, type: '国产', specialty: '中速大功率/PC2系列', tier: 2 },
  { name: '广柴 GDF', country: '中国', models: ['6230ZCD', '8230ZCD', '6320ZCD', '8320ZCD', 'G26'], founded: 1958, type: '国产', specialty: '中速柴油机', tier: 2 },
  { name: '中船动力 CSPI', country: '中国', models: ['CW6250ZLC', 'MAN32/40', 'WIN5X52'], founded: 2008, type: '国产', specialty: '许可证生产大功率', tier: 3 },
  { name: 'ABC', country: '比利时', models: ['6DZC', '8DZC', '12VDZC'], founded: 1912, type: '国际', specialty: '中速拖轮/海工', tier: 3 },
  { name: '三菱 Mitsubishi', country: '日本', models: ['S6R', 'S12R', 'S16R'], founded: 1917, type: '国际', specialty: '中速大功率', tier: 3 },
  { name: '斯堪尼亚 Scania', country: '瑞典', models: ['DI09', 'DI13', 'DI16'], founded: 1891, type: '国际', specialty: '高速商用船用', tier: 3 },
  { name: '博杜安 Baudouin', country: '法国', models: ['6M26', '12M26'], founded: 1918, type: '国际', specialty: '中速船用', tier: 3 },
  { name: '约翰迪尔 John Deere', country: '美国', models: ['6068', '6090', '6135'], founded: 1837, type: '国际', specialty: '中小功率多用途', tier: 3 },
  { name: '瓦锡兰 Wartsila', country: '芬兰', models: ['W20', 'W31', 'W32'], founded: 1834, type: '国际', specialty: '大型低速/双燃料', tier: 3 },
  { name: '现代 HiMSEN', country: '韩国', models: ['H17/28', 'H21/32', 'H25/33'], founded: 2001, type: '国际', specialty: '中速船用', tier: 3 },
  { name: '新潟 Niigata', country: '日本', models: ['6L28HX', '8L28HX'], founded: 1895, type: '国际', specialty: '中速大功率', tier: 3 },
  { name: '淄柴 Zichai', country: '中国', models: ['Z6170', 'Z8170', 'Z12V170', 'Z16V170'], founded: 1956, type: '国产', specialty: 'Z170系列中速主力', tier: 1 },
  { name: '济柴 Jichai', country: '中国', models: ['G6190', 'G8190', 'G12V190'], founded: 1920, type: '国产', specialty: '190系列中速', tier: 2 },
  { name: '河柴 HND', country: '中国', models: ['CHD314', 'CHD622', 'CHD620', 'TBD234'], founded: 1958, type: '国产', specialty: '高速/中速大功率', tier: 1 },
  { name: '上柴 SDEC', country: '中国', models: ['SC27', 'SC33'], founded: 1947, type: '国产', specialty: '中速船用', tier: 3 },
  { name: '道依茨 Deutz', country: '德国', models: ['BF4M', 'BF6M', 'TCD'], founded: 1864, type: '国际', specialty: '小功率高速', tier: 2 },
  { name: '菲亚特 FPT', country: '意大利', models: ['N40', 'N60', 'N67', 'C9', 'C13', 'C16'], founded: 1975, type: '国际', specialty: 'NEF+Cursor高速系列', tier: 2 },
  { name: '珀金斯 Perkins', country: '英国', models: ['M92B', 'M185C', 'M250C', '2500'], founded: 1932, type: '国际', specialty: '小中功率船用', tier: 3 },
  { name: '劳斯莱斯 Rolls-Royce', country: '英国', models: ['C25:33', 'B32:40', 'B33:45'], founded: 1884, type: '国际', specialty: '中速大功率/卑尔根系列', tier: 3 },
  { name: '镇江中船 CSSC-MES', country: '中国', models: ['MAN6L21/31', 'MAN8L21/31'], founded: 1965, type: '国产', specialty: 'MAN许可证中速机', tier: 3 },
  { name: '安庆帝伯格茨 ACD', country: '中国', models: ['6AMZD', '8AMZD'], founded: 1986, type: '国产', specialty: 'MAN许可证中速', tier: 3 },
];

// 纯主机参数数据 - 齿轮箱推荐由 autoSelectGearbox 算法实时生成
const ENGINE_DATA = [
  // 康明斯 Cummins (15条)
  { engine: '康明斯 B6.7M', power: 149, speed: 2600, application: '游艇/快艇' },
  { engine: '康明斯 QSB6.7', power: 186, speed: 2600, application: '游艇/快艇' },
  { engine: '康明斯 QSB6.7', power: 261, speed: 2300, application: '渔船/拖轮' },
  { engine: '康明斯 QSB6.7', power: 336, speed: 2300, application: '工作船' },
  { engine: '康明斯 QSC8.3', power: 336, speed: 2200, application: '工作船' },
  { engine: '康明斯 QSL9', power: 373, speed: 2100, application: '拖轮/工程船' },
  { engine: '康明斯 X15M', power: 410, speed: 1800, application: '渡轮/客船' },
  { engine: '康明斯 QSM11', power: 455, speed: 2100, application: '货船/拖轮' },
  { engine: '康明斯 KTA19-M', power: 448, speed: 1800, application: '散货船' },
  { engine: '康明斯 QSK19-M', power: 492, speed: 1800, application: '拖轮/渡轮' },
  { engine: '康明斯 QSK19-M', power: 597, speed: 2100, application: '巡逻艇/工程船' },
  { engine: '康明斯 KTA38-M1', power: 746, speed: 1800, application: '油轮/散货船' },
  { engine: '康明斯 KTA38', power: 895, speed: 1800, application: '散货船/集装箱' },
  { engine: '康明斯 KTA38-M2', power: 1044, speed: 1800, application: '大型拖轮' },
  { engine: '康明斯 KTA50-M2', power: 1342, speed: 1800, application: '大型散货船' },
  { engine: '康明斯 QSK60-M', power: 1640, speed: 1800, application: '集装箱船/海工' },
  // 卡特彼勒 CAT (14条)
  { engine: 'CAT C4.4', power: 105, speed: 2400, application: '内河小艇' },
  { engine: 'CAT C7.1', power: 205, speed: 2500, application: '快艇/巡逻艇' },
  { engine: 'CAT C7.1', power: 280, speed: 2300, application: '渔船' },
  { engine: 'CAT C9.3', power: 280, speed: 1800, application: '工作船' },
  { engine: 'CAT C9.3', power: 355, speed: 2300, application: '工作船/渔船' },
  { engine: 'CAT C12.9', power: 366, speed: 1800, application: '拖轮/工程船' },
  { engine: 'CAT C12.9', power: 460, speed: 2100, application: '巡逻艇/工程船' },
  { engine: 'CAT C18', power: 454, speed: 1800, application: '散货船/拖轮' },
  { engine: 'CAT C18', power: 597, speed: 2100, application: '拖轮/工作船' },
  { engine: 'CAT C32', power: 1081, speed: 1800, application: '拖轮/海工船' },
  { engine: 'CAT C32', power: 1417, speed: 2100, application: '高速艇' },
  { engine: 'CAT 3508B', power: 746, speed: 1200, application: '散货船' },
  { engine: 'CAT 3512B', power: 1119, speed: 1200, application: '海工船/OSV' },
  { engine: 'CAT 3516B', power: 1492, speed: 1200, application: '大型拖轮' },
  { engine: 'CAT 3516C', power: 1864, speed: 1600, application: '大型散货船' },
  // MTU (10条)
  { engine: 'MTU S60', power: 261, speed: 1800, application: '工作船' },
  { engine: 'MTU S60', power: 373, speed: 1800, application: '渡轮/客船' },
  { engine: 'MTU 6V2000 M72', power: 480, speed: 2100, application: '巡逻艇/快艇' },
  { engine: 'MTU 8V2000 M72', power: 720, speed: 2100, application: '快艇' },
  { engine: 'MTU 8V4000 M53', power: 720, speed: 1600, application: '巡逻艇/快艇' },
  { engine: 'MTU 10V2000 M72', power: 1050, speed: 2100, application: '高速艇' },
  { engine: 'MTU 12V2000 M72', power: 1340, speed: 2100, application: '快艇/巡逻艇' },
  { engine: 'MTU 12V4000 M53', power: 1120, speed: 1800, application: '高速艇' },
  { engine: 'MTU 16V2000 M86', power: 1700, speed: 2100, application: '高速艇' },
  { engine: 'MTU 16V4000 M63', power: 2240, speed: 1800, application: '高速客船/军用' },
  { engine: 'MTU 20V4000 M63', power: 3200, speed: 1800, application: '大型高速客船' },
  { engine: 'MTU 20V4000 M73L', power: 4300, speed: 2000, application: '军用舰艇' },
  // 沃尔沃 Volvo Penta (10条)
  { engine: '沃尔沃 D1-30', power: 21, speed: 3000, application: '内河小艇' },
  { engine: '沃尔沃 D2-75', power: 55, speed: 3000, application: '游艇/快艇' },
  { engine: '沃尔沃 D3-150', power: 110, speed: 3000, application: '游艇/快艇' },
  { engine: '沃尔沃 D4-320', power: 235, speed: 2400, application: '游艇/快艇' },
  { engine: '沃尔沃 D6-480', power: 353, speed: 2200, application: '游艇/客船' },
  { engine: '沃尔沃 D8-MH', power: 272, speed: 2400, application: '游艇/渡轮' },
  { engine: '沃尔沃 D8-MH', power: 450, speed: 2400, application: '工作船' },
  { engine: '沃尔沃 D11-MH', power: 345, speed: 2200, application: '工作船' },
  { engine: '沃尔沃 D11-MH', power: 500, speed: 2200, application: '拖轮/渡轮' },
  { engine: '沃尔沃 D13-MH', power: 405, speed: 1800, application: '渡轮/客船' },
  { engine: '沃尔沃 D13-MH', power: 625, speed: 2100, application: '大型渡轮' },
  { engine: '沃尔沃 D13-1000', power: 735, speed: 2300, application: '高速客船' },
  { engine: '沃尔沃 D16-MH', power: 490, speed: 1800, application: '散货船/拖轮' },
  { engine: '沃尔沃 D16-MH', power: 625, speed: 1900, application: '大型渡轮' },
  // 曼恩 MAN (10条)
  { engine: 'MAN D0834', power: 132, speed: 2300, application: '内河渔船' },
  { engine: 'MAN D0836', power: 195, speed: 2300, application: '渔船/工作船' },
  { engine: 'MAN D2676 LE433', power: 324, speed: 1800, application: '渡轮/客船' },
  { engine: 'MAN D2676 LE423', power: 368, speed: 2100, application: '近海作业船' },
  { engine: 'MAN D2676 LE443', power: 412, speed: 2100, application: '巡逻艇/工作船' },
  { engine: 'MAN D2842 LE412', power: 588, speed: 1800, application: '散货船/拖轮' },
  { engine: 'MAN D2842 LE405', power: 662, speed: 1800, application: '客船/渡轮' },
  { engine: 'MAN D2862 LE441', power: 735, speed: 1800, application: '散货船/客船' },
  { engine: 'MAN D2868 LE435', power: 809, speed: 2100, application: '拖轮/海工船' },
  { engine: 'MAN V8-1000', power: 735, speed: 2300, application: '高速艇' },
  { engine: 'MAN V8-1200', power: 882, speed: 2300, application: '高速客船' },
  { engine: 'MAN V12-1650', power: 1213, speed: 2100, application: '高速客船' },
  { engine: 'MAN V12-1900', power: 1397, speed: 2300, application: '军用巡逻艇' },
  // 潍柴 Weichai (14条)
  { engine: '潍柴 WP2.3', power: 25, speed: 2600, application: '内河小艇' },
  { engine: '潍柴 WP3.2', power: 37, speed: 2600, application: '内河小艇' },
  { engine: '潍柴 WP4.1', power: 60, speed: 2400, application: '内河渔船' },
  { engine: '潍柴 WP4.1', power: 95, speed: 2400, application: '内河小艇' },
  { engine: '潍柴 WP6', power: 125, speed: 2300, application: '渔船' },
  { engine: '潍柴 WP6', power: 168, speed: 2300, application: '渔船/客渡船' },
  { engine: '潍柴 WP7', power: 170, speed: 2200, application: '内河客货船' },
  { engine: '潍柴 WP7', power: 220, speed: 2200, application: '工作船' },
  { engine: '潍柴 WP10', power: 257, speed: 2100, application: '近海渔船' },
  { engine: '潍柴 WP10', power: 290, speed: 2100, application: '工作船' },
  { engine: '潍柴 WP12', power: 350, speed: 1500, application: '内河货船' },
  { engine: '潍柴 WP12', power: 405, speed: 1800, application: '拖轮/工程船' },
  { engine: '潍柴 WP13', power: 330, speed: 1500, application: '散货船' },
  { engine: '潍柴 WP13', power: 405, speed: 1900, application: '拖轮/工程船' },
  { engine: '潍柴 WHM6160', power: 220, speed: 1000, application: '散货船' },
  { engine: '潍柴 WHM6160', power: 450, speed: 1200, application: '拖轮/工程船' },
  { engine: '潍柴 WHM6160', power: 614, speed: 1200, application: '散货船/集装箱' },
  { engine: '潍柴 CW200', power: 735, speed: 1000, application: '散货船' },
  { engine: '潍柴 CW200', power: 1100, speed: 1000, application: '大型散货船' },
  { engine: '潍柴 CW200', power: 1760, speed: 1000, application: '集装箱船/海工' },
  { engine: '潍柴 CW250', power: 900, speed: 1000, application: '散货船/油轮' },
  { engine: '潍柴 CW250', power: 1960, speed: 1000, application: '大型散货船' },
  // 玉柴 Yuchai (12条)
  { engine: '玉柴 YC4D', power: 56, speed: 2600, application: '内河小艇' },
  { engine: '玉柴 YC4D', power: 81, speed: 2600, application: '内河渔船' },
  { engine: '玉柴 YC6B', power: 90, speed: 2300, application: '渔船' },
  { engine: '玉柴 YC6A', power: 132, speed: 2300, application: '内河渔船' },
  { engine: '玉柴 YC6A', power: 209, speed: 2300, application: '渔船/工作船' },
  { engine: '玉柴 YC6J', power: 165, speed: 2100, application: '渔船' },
  { engine: '玉柴 YC6J', power: 220, speed: 2100, application: '近海作业船' },
  { engine: '玉柴 YC6T', power: 300, speed: 1800, application: '渡轮/客船' },
  { engine: '玉柴 YC6T', power: 400, speed: 1800, application: '拖轮/工程船' },
  { engine: '玉柴 YC6MK', power: 368, speed: 1500, application: '近海作业船' },
  { engine: '玉柴 YC6K', power: 405, speed: 1500, application: '散货船' },
  { engine: '玉柴 YC6K', power: 500, speed: 1500, application: '拖轮/散货船' },
  { engine: '玉柴 YC6CL', power: 520, speed: 1500, application: '大型渔船/货船' },
  { engine: '玉柴 YC6CL', power: 660, speed: 1500, application: '散货船/集装箱' },
  { engine: '玉柴 YC6CL', power: 890, speed: 1000, application: '大型散货船' },
  // 洋马 Yanmar (10条)
  { engine: '洋马 4JH80', power: 59, speed: 3200, application: '游艇/快艇' },
  { engine: '洋马 4LV150', power: 110, speed: 3800, application: '游艇/快艇' },
  { engine: '洋马 4LV250', power: 184, speed: 3800, application: '游艇/快艇' },
  { engine: '洋马 6LY400', power: 294, speed: 3300, application: '渔船/快艇' },
  { engine: '洋马 6LY440', power: 324, speed: 3300, application: '渔船/工作船' },
  { engine: '洋马 6HYM-WET', power: 448, speed: 1900, application: '拖轮/工作船' },
  { engine: '洋马 6AYM-GTE', power: 485, speed: 1900, application: '渔船/客船' },
  { engine: '洋马 6AYM-GTE', power: 670, speed: 1938, application: '拖轮/渡轮' },
  { engine: '洋马 6EY22', power: 552, speed: 900, application: '散货船' },
  { engine: '洋马 6EY26W', power: 920, speed: 750, application: '油轮/化学品船' },
  { engine: '洋马 6EY26W', power: 1180, speed: 900, application: '大型散货船' },
  { engine: '洋马 6N18', power: 1380, speed: 750, application: '散货船/集装箱' },
  { engine: '洋马 6KFLN', power: 1100, speed: 750, application: '大型散货船' },
  // 大发 Daihatsu
  { engine: '大发 6DK-20', power: 1100, speed: 720, application: '散货船/油轮' },
  { engine: '大发 8DK-20', power: 1400, speed: 720, application: '集装箱船' },
  { engine: '大发 6DK-28', power: 2210, speed: 600, application: '大型散货船' },
  // 斗山 Doosan (10条)
  { engine: '斗山 L086TI', power: 210, speed: 2200, application: '渔船' },
  { engine: '斗山 L086TI', power: 265, speed: 2300, application: '渔船/工作船' },
  { engine: '斗山 L136', power: 118, speed: 2200, application: '内河渔船' },
  { engine: '斗山 L136TI', power: 169, speed: 2200, application: '小型渔船' },
  { engine: '斗山 L126TI', power: 210, speed: 2100, application: '渔船/客船' },
  { engine: '斗山 AD086TI', power: 287, speed: 2100, application: '工作船' },
  { engine: '斗山 V158TI', power: 353, speed: 1800, application: '散货船' },
  { engine: '斗山 V158TI', power: 500, speed: 2300, application: '巡逻艇/工作船' },
  { engine: '斗山 V180TI', power: 441, speed: 1800, application: '散货船' },
  { engine: '斗山 V180TI', power: 603, speed: 2300, application: '拖轮/工作船' },
  { engine: '斗山 V222TI', power: 610, speed: 1800, application: '拖轮' },
  { engine: '斗山 V222TI', power: 883, speed: 2300, application: '大型拖轮' },
  // 陕柴重工 SDHI (中国·陕西，PC2系列中速+240系列)
  { engine: '陕柴 6240ZC', power: 735, speed: 500, application: '散货船' },
  { engine: '陕柴 6240ZC', power: 1100, speed: 600, application: '散货船/集装箱' },
  { engine: '陕柴 8240ZC', power: 1470, speed: 600, application: '大型散货船' },
  { engine: '陕柴 8240ZC', power: 1840, speed: 600, application: '集装箱船/海工' },
  { engine: '陕柴 6PC2-5', power: 2200, speed: 520, application: '大型散货船' },
  { engine: '陕柴 6PC2-5', power: 2870, speed: 520, application: '集装箱船' },
  { engine: '陕柴 8PC2-5', power: 3680, speed: 520, application: '大型散货船' },
  { engine: '陕柴 6PC2-6', power: 3310, speed: 520, application: '大型散货船' },
  { engine: '陕柴 8PC2-6', power: 4415, speed: 520, application: '集装箱船/油轮' },
  { engine: '陕柴 16PC2-6B', power: 8830, speed: 520, application: '大型集装箱/邮轮' },
  { engine: '陕柴 16PC2-6B', power: 12000, speed: 600, application: '大型集装箱/邮轮' },
  // 广柴 GDF (中国·广州，230/320/G26系列中速柴油机)
  { engine: '广柴 6230ZCD', power: 660, speed: 750, application: '散货船/渡轮' },
  { engine: '广柴 6230ZCD', power: 810, speed: 900, application: '散货船/拖轮' },
  { engine: '广柴 8230ZCD', power: 880, speed: 750, application: '散货船/油轮' },
  { engine: '广柴 8230ZCD', power: 1080, speed: 900, application: '大型散货船' },
  { engine: '广柴 6320ZCD', power: 1470, speed: 600, application: '散货船/集装箱' },
  { engine: '广柴 6320ZCD', power: 1545, speed: 750, application: '大型散货船' },
  { engine: '广柴 8320ZCD', power: 2060, speed: 600, application: '大型散货船' },
  { engine: '广柴 8320ZCD', power: 2206, speed: 750, application: '集装箱船' },
  { engine: '广柴 G26', power: 3000, speed: 750, application: '大型散货船/LNG' },
  { engine: '广柴 G26', power: 4000, speed: 900, application: '大型集装箱/邮轮' },
  // 中船动力 CSPI (中国，许可证生产MAN/WinGD低速机)
  { engine: '中船 CW6250ZLC', power: 1470, speed: 520, application: '散货船/集装箱' },
  { engine: '中船 MAN6L32/40', power: 3000, speed: 750, application: '大型散货船' },
  { engine: '中船 MAN8L32/40', power: 4000, speed: 750, application: '集装箱船/油轮' },
  // ABC
  { engine: 'ABC 6DZC', power: 1200, speed: 1000, application: '拖轮/海工船' },
  { engine: 'ABC 8DZC', power: 1600, speed: 1000, application: '拖轮/疏浚船' },
  { engine: 'ABC 12VDZC', power: 2400, speed: 1000, application: '海工船/大型拖轮' },
  // 三菱 Mitsubishi
  { engine: '三菱 S6R-MPTK', power: 441, speed: 1400, application: '散货船/渡轮' },
  { engine: '三菱 S6R-MPTK', power: 691, speed: 1800, application: '拖轮/客船' },
  { engine: '三菱 S12R-MPTK', power: 940, speed: 1500, application: '散货船/集装箱' },
  { engine: '三菱 S12R-MPTK', power: 1270, speed: 1800, application: '大型拖轮/海工' },
  { engine: '三菱 S16R-MPTK', power: 1885, speed: 1650, application: '大型散货船' },
  // 斯堪尼亚 Scania
  { engine: '斯堪尼亚 DI09 072M', power: 257, speed: 2300, application: '渔船/工作船' },
  { engine: '斯堪尼亚 DI13 072M', power: 405, speed: 1800, application: '拖轮/渡轮' },
  { engine: '斯堪尼亚 DI13 082M', power: 478, speed: 2100, application: '巡逻艇/工程船' },
  { engine: '斯堪尼亚 DI16 082M', power: 588, speed: 1800, application: '大型拖轮/渡轮' },
  // 博杜安 Baudouin
  { engine: '博杜安 6M26.3', power: 442, speed: 1500, application: '散货船/渡轮' },
  { engine: '博杜安 6M26.3', power: 520, speed: 1800, application: '拖轮/工作船' },
  { engine: '博杜安 12M26.3', power: 840, speed: 1500, application: '散货船/客船' },
  { engine: '博杜安 12M26.3', power: 956, speed: 1800, application: '拖轮/海工船' },
  // 约翰迪尔 John Deere
  { engine: '约翰迪尔 6068SFM', power: 224, speed: 2400, application: '渔船/游艇' },
  { engine: '约翰迪尔 6068SFM', power: 298, speed: 2200, application: '工作船' },
  { engine: '约翰迪尔 6090SFM', power: 410, speed: 2100, application: '拖轮/渡轮' },
  { engine: '约翰迪尔 6135SFM', power: 429, speed: 1800, application: '大型工作船' },
  // 瓦锡兰 Wartsila
  { engine: '瓦锡兰 W20', power: 1000, speed: 1000, application: '散货船/油轮' },
  { engine: '瓦锡兰 W20', power: 1480, speed: 1000, application: '集装箱船' },
  { engine: '瓦锡兰 W32', power: 3600, speed: 750, application: '大型散货船/LNG' },
  { engine: '瓦锡兰 W31', power: 5700, speed: 750, application: '大型集装箱/邮轮' },
  // 现代 HiMSEN
  { engine: 'HiMSEN H17/28', power: 660, speed: 1000, application: '散货船/客船' },
  { engine: 'HiMSEN H17/28', power: 805, speed: 1000, application: '拖轮/海工船' },
  { engine: 'HiMSEN H21/32', power: 1200, speed: 900, application: '散货船/油轮' },
  { engine: 'HiMSEN H25/33', power: 1740, speed: 900, application: '大型散货船' },
  // 新潟 Niigata
  { engine: '新潟 6L28HX', power: 1838, speed: 750, application: '大型散货船/渔船' },
  { engine: '新潟 8L28HX', power: 2450, speed: 750, application: '集装箱/油轮' },
  // 淄柴 Zichai (中国·山东淄博，Z170系列中速柴油机，与杭齿配套量大)
  { engine: '淄柴 Z6170ZLC', power: 220, speed: 720, application: '散货船' },
  { engine: '淄柴 Z6170ZLC', power: 258, speed: 750, application: '散货船/渡轮' },
  { engine: '淄柴 Z6170ZLC', power: 294, speed: 900, application: '散货船/拖轮' },
  { engine: '淄柴 Z6170ZLC', power: 330, speed: 1000, application: '散货船/拖轮' },
  { engine: '淄柴 Z6170ZLC', power: 382, speed: 1200, application: '渡轮/客船' },
  { engine: '淄柴 Z6170ZLC', power: 456, speed: 1500, application: '拖轮/工程船' },
  { engine: '淄柴 Z8170ZLC', power: 294, speed: 720, application: '散货船' },
  { engine: '淄柴 Z8170ZLC', power: 344, speed: 750, application: '散货船/渡轮' },
  { engine: '淄柴 Z8170ZLC', power: 441, speed: 1000, application: '散货船/拖轮' },
  { engine: '淄柴 Z8170ZLC', power: 500, speed: 1200, application: '拖轮/工程船' },
  { engine: '淄柴 Z8170ZLC', power: 570, speed: 1000, application: '散货船/油轮' },
  { engine: '淄柴 Z8170ZLC', power: 610, speed: 1200, application: '拖轮/渡轮' },
  { engine: '淄柴 Z8170ZLC', power: 735, speed: 1350, application: '散货船/集装箱' },
  { engine: '淄柴 Z12V170ZLC', power: 440, speed: 720, application: '散货船' },
  { engine: '淄柴 Z12V170ZLC', power: 588, speed: 900, application: '散货船/油轮' },
  { engine: '淄柴 Z12V170ZLC', power: 661, speed: 1000, application: '拖轮/渡轮' },
  { engine: '淄柴 Z12V170ZLC', power: 750, speed: 1200, application: '散货船/集装箱' },
  { engine: '淄柴 Z12V170ZLC', power: 912, speed: 1500, application: '大型拖轮/渡轮' },
  { engine: '淄柴 Z16V170ZLC', power: 588, speed: 720, application: '散货船/油轮' },
  { engine: '淄柴 Z16V170ZLC', power: 882, speed: 1000, application: '大型散货船' },
  { engine: '淄柴 Z16V170ZLC', power: 1000, speed: 1200, application: '大型散货船/渡轮' },
  { engine: '淄柴 Z16V170ZLC', power: 1215, speed: 1500, application: '集装箱船/海工' },
  // 济柴 Jichai (中国·济南，190系列中速柴油机)
  { engine: '济柴 G6190ZLC', power: 330, speed: 1000, application: '散货船' },
  { engine: '济柴 G6190ZLC', power: 440, speed: 1200, application: '拖轮/工程船' },
  { engine: '济柴 G6190ZLC', power: 540, speed: 1200, application: '散货船/集装箱' },
  { engine: '济柴 G8190ZLC', power: 500, speed: 1000, application: '散货船/油轮' },
  { engine: '济柴 G8190ZLC', power: 720, speed: 1200, application: '大型散货船' },
  { engine: '济柴 G12V190ZLC', power: 550, speed: 1000, application: '散货船/油轮' },
  { engine: '济柴 G12V190ZLC', power: 800, speed: 1200, application: '大型散货船' },
  // 河柴 HND (中国·河南洛阳，高速/中速大功率柴油机)
  // TBD234系列 (MAN技术引进，高速)
  { engine: '河柴 TBD234V6', power: 258, speed: 1500, application: '渔船/工作船' },
  { engine: '河柴 TBD234V8', power: 368, speed: 1500, application: '拖轮/渡轮' },
  { engine: '河柴 TBD234V12', power: 530, speed: 1500, application: '拖轮/工程船' },
  { engine: '河柴 TBD234V16', power: 700, speed: 1500, application: '散货船/拖轮' },
  // CHD314系列 (高速)
  { engine: '河柴 CHD314V6', power: 350, speed: 1800, application: '巡逻艇/工作船' },
  { engine: '河柴 CHD314V8', power: 480, speed: 1800, application: '拖轮/渡轮' },
  { engine: '河柴 CHD314V12', power: 700, speed: 1800, application: '高速客船' },
  { engine: '河柴 CHD314V12', power: 750, speed: 2100, application: '巡逻艇' },
  { engine: '河柴 CHD314V16', power: 940, speed: 1800, application: '高速客船' },
  { engine: '河柴 CHD314V16', power: 1100, speed: 2100, application: '高速艇' },
  // CHD620系列 (中速大功率)
  { engine: '河柴 CHD620V8', power: 970, speed: 1000, application: '散货船/拖轮' },
  { engine: '河柴 CHD620V12', power: 1450, speed: 1000, application: '大型散货船' },
  { engine: '河柴 CHD620V16', power: 1940, speed: 1000, application: '集装箱船/海工' },
  // CHD622系列 (高速大功率)
  { engine: '河柴 CHD622V12', power: 1320, speed: 1500, application: '拖轮/海工船' },
  { engine: '河柴 CHD622V16', power: 1760, speed: 1500, application: '大型拖轮' },
  { engine: '河柴 CHD622V20', power: 2200, speed: 1500, application: '大型拖轮/渡轮' },
  { engine: '河柴 CHD622V20', power: 3600, speed: 2100, application: '军用舰艇' },
  // 上柴 SDEC (中国·上海，中速/高速柴油机)
  { engine: '上柴 SC27', power: 530, speed: 1200, application: '散货船/渡轮' },
  { engine: '上柴 SC27', power: 720, speed: 1500, application: '拖轮/工程船' },
  { engine: '上柴 SC33', power: 880, speed: 1000, application: '散货船/油轮' },
  { engine: '上柴 SC33', power: 1100, speed: 1200, application: '大型散货船' },
  // 道依茨 Deutz (德国，小功率船用柴油机)
  { engine: '道依茨 BF4M1013', power: 107, speed: 2300, application: '内河渔船' },
  { engine: '道依茨 BF6M1013', power: 157, speed: 2300, application: '渔船' },
  { engine: '道依茨 BF6M1015', power: 240, speed: 2100, application: '工作船' },
  { engine: '道依茨 TCD6.1', power: 180, speed: 2300, application: '渔船/工作船' },
  { engine: '道依茨 TCD7.8', power: 250, speed: 2100, application: '工作船/渡轮' },
  { engine: '道依茨 TCD12.0', power: 390, speed: 1800, application: '拖轮/工程船' },
  { engine: '道依茨 TCD16.0', power: 520, speed: 1800, application: '散货船/拖轮' },
  // 菲亚特 FPT/Iveco (意大利，NEF+Cursor系列)
  { engine: 'FPT N40', power: 74, speed: 2600, application: '内河小艇' },
  { engine: 'FPT N60', power: 110, speed: 2400, application: '内河渔船' },
  { engine: 'FPT N60', power: 151, speed: 2400, application: '渔船' },
  { engine: 'FPT N67', power: 187, speed: 2200, application: '渔船/工作船' },
  { engine: 'FPT N67', power: 280, speed: 2400, application: '巡逻艇/快艇' },
  { engine: 'FPT C9 Cursor', power: 305, speed: 2100, application: '工作船/拖轮' },
  { engine: 'FPT C13 Cursor', power: 407, speed: 2100, application: '拖轮/渡轮' },
  { engine: 'FPT C16 Cursor', power: 480, speed: 2100, application: '拖轮/工程船' },
  { engine: 'FPT C16 Cursor', power: 735, speed: 2100, application: '高速客船' },
  // 珀金斯 Perkins (英国，小中功率船用柴油机)
  { engine: '珀金斯 M92B', power: 62, speed: 2600, application: '内河小艇' },
  { engine: '珀金斯 M130C', power: 86, speed: 2400, application: '内河渔船' },
  { engine: '珀金斯 M185C', power: 138, speed: 2400, application: '渔船' },
  { engine: '珀金斯 M250C', power: 186, speed: 2400, application: '渔船/工作船' },
  { engine: '珀金斯 M300C', power: 224, speed: 2200, application: '工作船' },
  { engine: '珀金斯 2500', power: 373, speed: 2100, application: '拖轮/工程船' },
  { engine: '珀金斯 2500', power: 560, speed: 1800, application: '散货船/拖轮' },
  // 劳斯莱斯 Rolls-Royce Bergen (挪威/英国，卑尔根系列中速大功率)
  { engine: '劳斯莱斯 C25:33L6', power: 1665, speed: 1000, application: '散货船/油轮' },
  { engine: '劳斯莱斯 C25:33L9', power: 2500, speed: 1000, application: '大型散货船' },
  { engine: '劳斯莱斯 B32:40L6', power: 3000, speed: 750, application: '大型散货船' },
  { engine: '劳斯莱斯 B32:40L8', power: 4000, speed: 750, application: '集装箱船/油轮' },
  { engine: '劳斯莱斯 B33:45L6', power: 4200, speed: 750, application: '大型散货船/LNG' },
  { engine: '劳斯莱斯 B33:45L9', power: 6300, speed: 750, application: '大型集装箱/邮轮' },
  // 镇江中船 CSSC-MES (中国·镇江，MAN许可证中速柴油机)
  { engine: '镇江中船 MAN6L21/31', power: 1980, speed: 1000, application: '散货船/集装箱' },
  { engine: '镇江中船 MAN8L21/31', power: 2640, speed: 1000, application: '大型散货船' },
  // 安庆帝伯格茨 ACD (中国·安庆，MAN许可证中速柴油机)
  { engine: 'ACD 6AMZD', power: 735, speed: 750, application: '散货船' },
  { engine: 'ACD 8AMZD', power: 980, speed: 750, application: '散货船/油轮' },
];

// 系列颜色映射
const SERIES_COLORS = { HC: 'primary', HCD: 'primary', HCM: 'success', GW: 'danger', GWC: 'danger', GWS: 'danger', SGW: 'warning', HCA: 'info', GC: 'secondary', DT: 'dark', MV: 'dark', HCQ: 'info' };
function seriesBg(model) {
  if (!model) return 'secondary';
  for (const [prefix, color] of Object.entries(SERIES_COLORS)) {
    if (model.startsWith(prefix)) return color;
  }
  return 'secondary';
}
// 品牌匹配：提取引擎名品牌前缀，与品牌名各部分精确匹配
// 修复: CAT/MAN/FPT/HiMSEN英文前缀 + 陕柴重工/中船动力简称 + MAN跨品牌污染
function matchBrand(engineName, brandName) {
  const engineBrand = engineName.split(' ')[0]; // '陕柴', 'CAT', 'MAN', '中船' 等
  const brandParts = brandName.split(' ');       // ['陕柴重工', 'SDHI'] 或 ['CAT'] 等
  return brandParts.some(p => p === engineBrand || p.startsWith(engineBrand));
}
function getBrandRecords(brandName) {
  return ENGINE_DATA.filter(m => matchBrand(m.engine, brandName));
}

// 标准船型 (简化为12种)
const VESSEL_TYPES = [
  { label: '游艇/快艇', propRpm: 1400 },
  { label: '巡逻艇/高速艇', propRpm: 1000 },
  { label: '渔船', propRpm: 550 },
  { label: '工作船', propRpm: 450 },
  { label: '拖轮', propRpm: 280 },
  { label: '渡轮/客船', propRpm: 420 },
  { label: '散货船', propRpm: 220 },
  { label: '集装箱船', propRpm: 150 },
  { label: '油轮', propRpm: 200 },
  { label: '海工船/OSV', propRpm: 350 },
  { label: '内河船', propRpm: 500 },
  { label: '军用舰艇', propRpm: 900 },
];

// 从应用场景推断最佳船型
function guessVesselType(app) {
  if (!app) return '工作船';
  for (const vt of VESSEL_TYPES) {
    const keywords = vt.label.split('/');
    if (keywords.some(k => app.includes(k))) return vt.label;
  }
  if (app.includes('内河')) return '内河船';
  if (app.includes('拖')) return '拖轮';
  if (app.includes('渔')) return '渔船';
  if (app.includes('货')) return '散货船';
  return '工作船';
}

export default function EngineMatchingExpanded({ colors, theme }) {
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  // 选型输入
  const [engineSearch, setEngineSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [customPower, setCustomPower] = useState('');
  const [customSpeed, setCustomSpeed] = useState('');
  const [vesselType, setVesselType] = useState('工作船');
  // 浏览筛选
  const [brandFilter, setBrandFilter] = useState('全部');
  const [showTable, setShowTable] = useState(false);
  const [tierFilter, setTierFilter] = useState(0); // 0=全部, 1/2/3
  const [typeFilter, setTypeFilter] = useState('全部'); // '全部'/'国际'/'国产'
  const [sortField, setSortField] = useState(''); // 表格排序
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    Promise.all([
      import('../data/embeddedData').then(({ embeddedGearboxData }) => embeddedGearboxData),
      loadFlexibleCouplings().catch(() => []),
    ]).then(([gearboxData]) => {
      setAppData(gearboxData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // 主机搜索自动补全
  const engineOptions = useMemo(() => {
    if (!engineSearch || engineSearch.length < 1) return [];
    const s = engineSearch.toUpperCase();
    return ENGINE_DATA.filter(m => m.engine.toUpperCase().includes(s)).slice(0, 8);
  }, [engineSearch]);

  // 选中主机 → 填充参数
  const selectEngine = (m) => {
    setEngineSearch(m.engine);
    setCustomPower(String(m.power));
    setCustomSpeed(String(m.speed));
    setVesselType(guessVesselType(m.application));
    setShowDropdown(false);
  };

  // 实时选型计算
  const selectionResult = useMemo(() => {
    const power = parseFloat(customPower);
    const speed = parseFloat(customSpeed);
    if (!power || !speed || !appData) return null;
    const vt = VESSEL_TYPES.find(v => v.label === vesselType);
    const propRpm = vt ? vt.propRpm : 400;
    const targetRatio = parseFloat((speed / propRpm).toFixed(2));
    const competitor = getCompetitorRef(power, speed);
    try {
      const result = autoSelectGearbox(
        { motorPower: power, motorSpeed: speed, targetRatio, thrust: 0 },
        appData
      );
      const recs = (result.recommendations || []).slice(0, 5).map(r => ({
        model: r.model,
        ratio: r.selectedRatio,
        margin: r.capacityMargin != null ? Math.round(r.capacityMargin) : null,
        thrust: r.thrust,
        price: r.packagePrice || r.factoryPrice || r.basePrice || null,
      }));
      // 联轴器选型
      let couplingRec = null;
      if (recs.length > 0) {
        try {
          const cResult = selectCouplingStandalone({
            power, speed, gearboxModel: recs[0].model,
            workCondition: 'II类:扭矩变化较小'
          });
          if (cResult.success && cResult.recommendations?.length > 0) {
            const c = cResult.recommendations[0];
            couplingRec = { model: c.model, torque: c.torque, price: c.price || c.packagePrice || c.factoryPrice };
          }
        } catch { /* 联轴器数据未加载时忽略 */ }
      }
      // 接口尺寸查找 (从hcmMatchingCases真实配套案例)
      let interfaceInfo = null;
      const cases = appData.hcmMatchingCases || [];
      if (recs.length > 0) {
        const iMatch = cases.find(c => c.gearbox === recs[0].model && c.cover && c.flywheel)
          || cases.find(c => c.cover && c.flywheel && Math.abs(c.power - power) < power * 0.2 && Math.abs(c.speed - speed) < speed * 0.15);
        if (iMatch) interfaceInfo = { cover: iMatch.cover, flywheel: iMatch.flywheel, refEngine: iMatch.engine };
      }
      return { recs, targetRatio, propRpm, competitor, power, speed, couplingRec, interfaceInfo };
    } catch {
      return { recs: [], targetRatio, propRpm, competitor, power, speed, couplingRec: null, interfaceInfo: null };
    }
  }, [customPower, customSpeed, vesselType, appData]);

  // 下方表格：品牌筛选的批量匹配
  const tableData = useMemo(() => {
    if (!appData || !showTable) return [];
    return ENGINE_DATA
      .filter(m => brandFilter === '全部' || matchBrand(m.engine, brandFilter))
      .map(m => {
        const propRpm = getPropRpm(m.application);
        const targetRatio = parseFloat((m.speed / propRpm).toFixed(2));
        try {
          const result = autoSelectGearbox(
            { motorPower: m.power, motorSpeed: m.speed, targetRatio, thrust: 0 },
            appData
          );
          const top = (result.recommendations || [])[0];
          return { ...m, targetRatio, gearbox: top?.model || '-', ratio: top?.selectedRatio || '-', margin: top?.capacityMargin != null ? Math.round(top.capacityMargin) : null, price: top?.packagePrice || top?.factoryPrice || top?.basePrice || null, thrust: top?.thrust || null };
        } catch {
          return { ...m, targetRatio, gearbox: '-', ratio: '-', margin: null, price: null, thrust: null };
        }
      });
  }, [appData, showTable, brandFilter]);

  // 表格排序
  const sortedTableData = useMemo(() => {
    if (!sortField || !tableData.length) return tableData;
    return [...tableData].sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === 'asc' ? va - vb : vb - va;
    });
  }, [tableData, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };
  const sortIcon = (field) => sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '';

  // 导出CSV
  const exportCSV = () => {
    const data = sortedTableData.length ? sortedTableData : tableData;
    if (!data.length) return;
    const header = '序号,主机型号,功率(kW),转速(rpm),目标减速比,推荐齿轮箱,实际比,富裕量(%),价格(元),船型';
    const rows = data.map((m, i) => [
      i + 1, m.engine, m.power, m.speed, m.targetRatio, m.gearbox, m.ratio,
      m.margin != null ? `+${m.margin}` : '', m.price || '', m.application
    ].join(','));
    const csv = '\uFEFF' + header + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `主机匹配_${brandFilter === '全部' ? '全品牌' : brandFilter}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // 品牌统计数据 (功率/转速范围, 转速分类)
  const brandStats = useMemo(() => {
    const stats = {};
    ENGINE_BRANDS.forEach(b => {
      const records = getBrandRecords(b.name);
      const powers = records.map(r => r.power);
      const speeds = records.map(r => r.speed);
      const apps = [...new Set(records.flatMap(r => r.application.split('/')))];
      const avgSpeed = speeds.length ? speeds.reduce((a, c) => a + c, 0) / speeds.length : 0;
      const speedCat = avgSpeed > 1500 ? '高速' : avgSpeed >= 600 ? '中速' : '低速';
      stats[b.name] = {
        count: records.length,
        powerRange: powers.length ? [Math.min(...powers), Math.max(...powers)] : [0, 0],
        speedRange: speeds.length ? [Math.min(...speeds), Math.max(...speeds)] : [0, 0],
        speedCategory: speedCat,
        applications: apps.slice(0, 5),
      };
    });
    return stats;
  }, []);

  // 每个品牌最常匹配的齿轮箱系列
  const brandGearboxMap = useMemo(() => {
    if (!appData) return {};
    const map = {};
    ENGINE_BRANDS.forEach(b => {
      const records = getBrandRecords(b.name);
      const seriesCounts = {};
      records.forEach(m => {
        const propRpm = getPropRpm(m.application);
        const targetRatio = parseFloat((m.speed / propRpm).toFixed(2));
        try {
          const result = autoSelectGearbox(
            { motorPower: m.power, motorSpeed: m.speed, targetRatio, thrust: 0 },
            appData
          );
          const top = (result.recommendations || [])[0];
          if (top?.model) {
            const series = top.model.replace(/[0-9/].*/,'');
            seriesCounts[series] = (seriesCounts[series] || 0) + 1;
          }
        } catch { /* ignore */ }
      });
      const sorted = Object.entries(seriesCounts).sort((a, b) => b[1] - a[1]);
      map[b.name] = sorted.slice(0, 3);
    });
    return map;
  }, [appData]);

  // 品牌筛选后的列表
  const filteredBrands = useMemo(() => {
    return ENGINE_BRANDS.filter(b => {
      if (tierFilter && b.tier !== tierFilter) return false;
      if (typeFilter !== '全部' && b.type !== typeFilter) return false;
      return true;
    });
  }, [tierFilter, typeFilter]);

  const sr = selectionResult;

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-cpu me-2"></i>多品牌主机智能匹配</h5>
          <small className="text-muted">输入主机型号或参数 → 选择船型 → 从齿轮箱数据库(HC/HCM/GW/HCA/GC全系列)中科学匹配</small>
        </Col>
      </Row>

      {/* ===== 选型输入卡片 ===== */}
      <Card className="mb-3 border-primary" style={{ borderWidth: '2px' }}>
        <Card.Header className="bg-primary text-white py-2">
          <i className="bi bi-sliders me-2"></i>选型参数输入
        </Card.Header>
        <Card.Body>
          <Row className="g-2 align-items-end">
            <Col md={3}>
              <Form.Label className="mb-1 small fw-bold">主机型号</Form.Label>
              <div style={{ position: 'relative' }}>
                <InputGroup size="sm">
                  <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                  <Form.Control
                    placeholder="输入型号，如 KTA38..."
                    value={engineSearch}
                    onChange={e => { setEngineSearch(e.target.value); setShowDropdown(true); }}
                    onFocus={() => engineSearch && setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  />
                </InputGroup>
                {showDropdown && engineOptions.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, background: 'white', border: '1px solid #dee2e6', borderRadius: '0 0 6px 6px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', maxHeight: 240, overflowY: 'auto' }}>
                    {engineOptions.map((m, i) => (
                      <div key={i} className="px-3 py-2 border-bottom" style={{ cursor: 'pointer', fontSize: '13px' }}
                        onMouseDown={() => selectEngine(m)}>
                        <strong>{m.engine}</strong>
                        <span className="text-muted ms-2">{m.power}kW / {m.speed}rpm</span>
                        <Badge bg="light" text="dark" className="ms-1" style={{fontSize: '10px'}}>{m.application}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>
            <Col md={2}>
              <Form.Label className="mb-1 small fw-bold">功率 (kW)</Form.Label>
              <Form.Control size="sm" type="number" placeholder="如 895" value={customPower} onChange={e => setCustomPower(e.target.value)} />
            </Col>
            <Col md={2}>
              <Form.Label className="mb-1 small fw-bold">转速 (rpm)</Form.Label>
              <Form.Control size="sm" type="number" placeholder="如 1800" value={customSpeed} onChange={e => setCustomSpeed(e.target.value)} />
            </Col>
            <Col md={2}>
              <Form.Label className="mb-1 small fw-bold">船型</Form.Label>
              <Form.Select size="sm" value={vesselType} onChange={e => setVesselType(e.target.value)}>
                {VESSEL_TYPES.map(v => <option key={v.label} value={v.label}>{v.label} ({v.propRpm}rpm)</option>)}
              </Form.Select>
            </Col>
            <Col md={3}>
              {sr && (
                <div className="bg-light rounded px-3 py-1" style={{fontSize: '12px'}}>
                  <span className="text-muted">目标减速比</span> <strong className="text-primary ms-1" style={{fontSize: '16px'}}>{sr.targetRatio}</strong>
                  <span className="text-muted ms-2">桨速</span> <strong>{sr.propRpm}rpm</strong>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ===== 匹配结果 + 品牌侧栏 ===== */}
      <Row>
        <Col md={8}>
          {sr && sr.recs.length > 0 ? (
            <Card className="mb-3">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span><i className="bi bi-check-circle me-1"></i>推荐齿轮箱 (Top {sr.recs.length})</span>
                <small className="text-muted">
                  {sr.power}kW / {sr.speed}rpm → i={sr.targetRatio}
                  <span className="ms-2">竞品: <strong>{sr.competitor}</strong></span>
                </small>
              </Card.Header>
              <Card.Body className="p-2">
                <Row className="g-2">
                  {sr.recs.map((r, j) => (
                    <Col key={j} md={j === 0 ? 12 : 6}>
                      <div className={`border rounded p-3 ${j === 0 ? 'border-primary bg-light' : ''}`}>
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="d-flex align-items-center">
                            <span className={`d-inline-flex align-items-center justify-content-center rounded-circle me-2 ${j === 0 ? 'bg-primary text-white' : 'bg-light text-muted border'}`}
                              style={{ width: 24, height: 24, fontSize: 12, fontWeight: 'bold', flexShrink: 0 }}>
                              {j + 1}
                            </span>
                            <Badge bg={seriesBg(r.model)} style={{fontSize: j === 0 ? '16px' : '13px'}}>{r.model}</Badge>
                            {j === 0 && <Badge bg="warning" text="dark" className="ms-1">最佳</Badge>}
                          </div>
                          {r.price && <small className="text-muted">{(r.price / 10000).toFixed(1)}万</small>}
                        </div>
                        <div className="mt-2" style={{fontSize: '13px'}}>
                          <span className="me-3">减速比: <strong>{r.ratio}</strong></span>
                          {r.margin != null && <span className="me-3">富裕量: <strong className={r.margin > 30 ? 'text-warning' : 'text-success'}>+{r.margin}%</strong></span>}
                          {r.thrust && <span>推力: <strong>{r.thrust}kN</strong></span>}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
                {/* 配套推荐: 高弹联轴器 + 接口尺寸 */}
                {(sr.couplingRec || sr.interfaceInfo) && (
                  <div className="mt-2 p-2 border rounded bg-light" style={{fontSize: '13px'}}>
                    <i className="bi bi-link-45deg me-1"></i><strong>配套推荐</strong>
                    {sr.couplingRec && (
                      <span className="ms-3">
                        高弹联轴器: <Badge bg="info">{sr.couplingRec.model}</Badge>
                        <span className="text-muted ms-1">额定{sr.couplingRec.torque}kN·m</span>
                        {sr.couplingRec.price ? <span className="text-muted ms-1">({(sr.couplingRec.price / 10000).toFixed(1)}万)</span> : null}
                      </span>
                    )}
                    {sr.interfaceInfo && (
                      <span className="ms-3">
                        <span className="text-muted">|</span>
                        <span className="ms-2">壳号: <strong>SAE {sr.interfaceInfo.cover}</strong></span>
                        <span className="ms-2">飞轮: <strong>{sr.interfaceInfo.flywheel}"</strong></span>
                        {sr.interfaceInfo.refEngine && <span className="text-muted ms-1">(参考: {sr.interfaceInfo.refEngine})</span>}
                      </span>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          ) : (
            <Card className="mb-3">
              <Card.Body className="text-center py-5 text-muted">
                {loading ? <><Spinner size="sm" className="me-2" />加载齿轮箱数据库...</> :
                  customPower && customSpeed ? '未找到匹配的齿轮箱，请调整参数' :
                  <><i className="bi bi-arrow-up-circle me-2"></i>输入主机型号或功率/转速参数开始匹配</>}
              </Card.Body>
            </Card>
          )}

          {/* 可折叠全量表格 */}
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span style={{cursor: 'pointer'}} onClick={() => setShowTable(!showTable)}>
                <i className={`bi bi-chevron-${showTable ? 'down' : 'right'} me-1`}></i>全部匹配记录 ({brandFilter === '全部' ? ENGINE_DATA.length : getBrandRecords(brandFilter).length}条)
              </span>
              <div>
                {showTable && tableData.length > 0 && (
                  <Button variant="outline-secondary" size="sm" className="me-2 py-0" onClick={exportCSV}>
                    <i className="bi bi-download me-1"></i>导出CSV
                  </Button>
                )}
                <Badge bg="primary" className="me-1">HC</Badge>
                <Badge bg="success" className="me-1">HCM</Badge>
                <Badge bg="danger" className="me-1">GW</Badge>
                <Badge bg="secondary">其他</Badge>
              </div>
            </Card.Header>
            {showTable && (
              <Card.Body className="p-0">
                <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                  <Table hover size="sm" className="mb-0">
                    <thead className="sticky-top bg-light">
                      <tr>
                        <th style={{width: 36}}>#</th>
                        <th style={{cursor:'pointer'}} onClick={() => toggleSort('engine')}>主机型号 {sortIcon('engine')}</th>
                        <th style={{cursor:'pointer'}} onClick={() => toggleSort('power')}>功率 {sortIcon('power')}</th>
                        <th style={{cursor:'pointer'}} onClick={() => toggleSort('speed')}>转速 {sortIcon('speed')}</th>
                        <th>目标比</th>
                        <th>推荐齿轮箱</th>
                        <th style={{cursor:'pointer'}} onClick={() => toggleSort('margin')}>富裕量 {sortIcon('margin')}</th>
                        <th style={{cursor:'pointer'}} onClick={() => toggleSort('price')}>价格 {sortIcon('price')}</th>
                        <th>船型</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTableData.map((m, i) => (
                        <tr key={i} style={{cursor: 'pointer'}} onClick={() => selectEngine(m)}>
                          <td><small className="text-muted">{i + 1}</small></td>
                          <td><strong>{m.engine}</strong></td>
                          <td>{m.power}</td>
                          <td>{m.speed}</td>
                          <td>{m.targetRatio}</td>
                          <td><Badge bg={seriesBg(m.gearbox)}>{m.gearbox}</Badge> <small className="text-muted">i={m.ratio}</small></td>
                          <td>{m.margin != null ? <span className={m.margin < 10 ? 'text-danger fw-bold' : m.margin > 30 ? 'text-warning' : 'text-success'}>+{m.margin}%</span> : '-'}</td>
                          <td>{m.price ? <small>{(m.price / 10000).toFixed(1)}万</small> : <small className="text-muted">询价</small>}</td>
                          <td><small>{m.application}</small></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            )}
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header className="py-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span><i className="bi bi-grid-3x3-gap me-1"></i>品牌快选 <small className="text-muted">({filteredBrands.length}/{ENGINE_BRANDS.length})</small></span>
              </div>
              <div className="d-flex gap-1 flex-wrap" style={{fontSize: '11px'}}>
                {[{v:0,l:'全部'},{v:1,l:'★核心'},{v:2,l:'☆常规'},{v:3,l:'○特殊'}].map(t => (
                  <span key={t.v} className={`px-2 py-0 rounded-pill border ${tierFilter === t.v ? 'bg-primary text-white border-primary' : 'text-muted'}`}
                    style={{cursor: 'pointer'}} onClick={() => setTierFilter(tierFilter === t.v ? 0 : t.v)}>{t.l}</span>
                ))}
                <span className="text-muted mx-1">|</span>
                {['全部','国际','国产'].map(t => (
                  <span key={t} className={`px-2 py-0 rounded-pill border ${typeFilter === t ? 'bg-success text-white border-success' : 'text-muted'}`}
                    style={{cursor: 'pointer'}} onClick={() => setTypeFilter(typeFilter === t ? '全部' : t)}>{t}</span>
                ))}
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {filteredBrands.map(b => {
                  const stats = brandStats[b.name] || { count: 0, powerRange: [0,0], speedRange: [0,0], speedCategory: '-' };
                  const gearboxes = brandGearboxMap[b.name] || [];
                  const isActive = brandFilter === b.name;
                  const tierIcon = b.tier === 1 ? '★' : b.tier === 2 ? '☆' : '○';
                  const tierColor = b.tier === 1 ? '#f0ad4e' : b.tier === 2 ? '#999' : '#ccc';
                  const speedBg = stats.speedCategory === '高速' ? 'danger' : stats.speedCategory === '中速' ? 'warning' : 'info';
                  return (
                    <div key={b.name}
                      className={`px-3 py-2 border-bottom ${isActive ? 'bg-primary bg-opacity-10' : ''}`}
                      style={{ cursor: 'pointer', borderLeft: b.tier === 1 ? '3px solid #f0ad4e' : b.tier === 2 ? '3px solid #dee2e6' : 'none' }}
                      onClick={() => { setBrandFilter(isActive ? '全部' : b.name); if (!showTable) setShowTable(true); }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div style={{minWidth: 0, flex: 1}}>
                          <div className="d-flex align-items-center">
                            <span style={{color: tierColor, fontSize: '14px', marginRight: 4}}>{tierIcon}</span>
                            <strong className={isActive ? 'text-primary' : ''} style={{fontSize: '13px'}}>{b.name}</strong>
                          </div>
                          <div style={{fontSize: '11px', lineHeight: 1.6}} className="text-muted">
                            <Badge bg={b.type === '国际' ? 'primary' : 'success'} style={{fontSize: '9px', padding: '1px 4px'}}>{b.type}</Badge>
                            {' '}<Badge bg={speedBg} text={speedBg === 'warning' ? 'dark' : 'white'} style={{fontSize: '9px', padding: '1px 4px'}}>{stats.speedCategory}</Badge>
                            {' '}{stats.count > 0 && <span>{stats.powerRange[0]}~{stats.powerRange[1]}kW</span>}
                            {b.founded && <span className="ms-1">· {b.founded}年</span>}
                          </div>
                          <div style={{fontSize: '11px', color: '#888'}}>{b.specialty}</div>
                          {gearboxes.length > 0 && (
                            <div style={{fontSize: '10px'}} className="mt-1">
                              {gearboxes.map(([series, cnt]) => (
                                <Badge key={series} bg={seriesBg(series + '100')} className="me-1" style={{fontSize: '9px', padding: '1px 4px'}}>
                                  {series}{cnt > 1 ? `×${cnt}` : ''}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <Badge bg={isActive ? 'primary' : 'light'} text={isActive ? 'white' : 'dark'} style={{flexShrink: 0}}>{stats.count}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
