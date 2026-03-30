#!/usr/bin/env node
/**
 * 从PDF手册提取的数据，批量更新 completeGearboxData.js 中缺失的
 * dimensions / weight / controlType / rotationDirection 字段
 */
import fs from 'fs';
import { completeGearboxData } from '../src/data/completeGearboxData.js';

// ============================================================
// 1. 个别型号的精确数据 (从PDF表格逐行提取)
// ============================================================
const modelData = {
  // ---- 中小功率系列 (P1-P18) ----
  '06':           { dimensions: '350×316×482',    weight: 58,    controlType: '手控',              rotationDirection: '相反' },
  '16A':          { dimensions: '422×325×563',    weight: 84,    controlType: '手控',              rotationDirection: '相反' },
  '26':           { dimensions: '473.5×365×830',  weight: 92,    controlType: '手控',              rotationDirection: '相反' },
  'MA100':        { dimensions: '236×390×420',    weight: 75,    controlType: '推拉软轴',          rotationDirection: '相反' },
  'MA125':        { dimensions: '291×454×485',    weight: 115,   controlType: '推拉软轴',          rotationDirection: '相反' },
  'MA142':        { dimensions: '308×520×540',    weight: 140,   controlType: '推拉软轴',          rotationDirection: '相反' },
  '04A':          { dimensions: '490×670×620',    weight: 225,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  '40A':          { dimensions: '490×670×620',    weight: 225,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'MB170':        { dimensions: '510×670×656',    weight: 240,   controlType: '推拉软轴',          rotationDirection: '相反' },
  '120B':         { dimensions: '605×744×770',    weight: 400,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  '120C':         { dimensions: '432×440×650',    weight: 225,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCN120':       { dimensions: '432×440×650',    weight: 225,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  '135':          { dimensions: '578×792×830',    weight: 470,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HC138':        { dimensions: '520×792×760',    weight: 360,   controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCD138':       { dimensions: '494×800×870',    weight: 415,   controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'MB242':        { dimensions: '442×774×763',    weight: 385,   controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'MB270A':       { dimensions: '594×810×868',    weight: 675,   controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  '300':          { dimensions: '786×930×864',    weight: 740,   controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HC300':        { dimensions: '680×930×880',    weight: 680,   controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'J300':         { dimensions: '786×930×864',    weight: 740,   controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'D300A':        { dimensions: '786×1010×1041',  weight: 940,   controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'T300':         { dimensions: '772×980×1106',   weight: 1120,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'T300/1':       { dimensions: '772×980×1106',   weight: 1120,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HC350-1':      { dimensions: '604×886×880',    weight: 520,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCD350':       { dimensions: '610×915×987',    weight: 590,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HC400':        { dimensions: '820×950×890',    weight: 820,   controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCD400A':      { dimensions: '820×1010×1070',  weight: 1100,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCT400A':      { dimensions: '800×1052×1182',  weight: 1450,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCT400A/1':    { dimensions: '832×1100×1328',  weight: 1500,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCD450':       { dimensions: '761×984×1040',   weight: 800,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HC500':        { dimensions: '900×897×680',    weight: 800,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HC600A':       { dimensions: '745×1214×1126',  weight: 1300,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCD600A':      { dimensions: '745×1214×1271',  weight: 1550,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCT600A':      { dimensions: '821×1214×1271',  weight: 1650,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCT600A/1':    { dimensions: '878×1224×1346',  weight: 1700,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCT650/2':     { dimensions: '966×1224×1515',  weight: 2230,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCD700':       { dimensions: '741×1182×1186',  weight: 1328,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCD800':       { dimensions: '1056×1280×1341', weight: 2250,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCT800':       { dimensions: '1056×1280×1425', weight: 2500,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCT800/1':     { dimensions: '1152×1360×1557', weight: 3300,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCT800/2':     { dimensions: '1190×1480×1707', weight: 3960,  controlType: '推拉软轴/电控',     rotationDirection: '相同' },
  'HCT800/2A':    { dimensions: '1190×1490×2041', weight: 4000,  controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCT800/3':     { dimensions: '1235×1570×1789', weight: 4540,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HC1000':       { dimensions: '1082×1120×990',  weight: 1500,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCD1000':      { dimensions: '1082×1280×1345', weight: 2200,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCT1100':      { dimensions: '1150×1350×1547', weight: 3200,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCW1100':      { dimensions: '1567×1630×2550', weight: 6900,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HC1200':       { dimensions: '1082×1200×1130', weight: 1870,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCD1200':      { dimensions: '962×1300×1290',  weight: 1850,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCD1200/1':    { dimensions: '1096×1260×1270', weight: 2500,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCT1200':      { dimensions: '1188×1350×1547', weight: 3200,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCT1200/1':    { dimensions: '1056×1430×1670', weight: 3850,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCT1280/2':    { dimensions: '1290×1520×1775', weight: 4300,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCD1400':      { dimensions: '1260×1380×1360', weight: 2800,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCT1400':      { dimensions: '1306×1380×1750', weight: 3800,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCT1400/2':    { dimensions: '1279×1600×2100', weight: 5500,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCT1400/5':    { dimensions: '1220×1400×1650', weight: 3850,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCD1500':      { dimensions: '1260×1380×1360', weight: 2800,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCD1580':      { dimensions: '1260×1380×1360', weight: 2800,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HC1600':       { dimensions: '1345×1500×1300', weight: 3000,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCD1600':      { dimensions: '1291×1620×1590', weight: 4000,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCT1600':      { dimensions: '1246×1500×1750', weight: 5000,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCT1600/1':    { dimensions: '1280×1704×2040', weight: 5500,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HC2000':       { dimensions: '1600×1500×1400', weight: 3700,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCD2000':      { dimensions: '1600×1620×1645', weight: 4200,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCT2000':      { dimensions: '1284×1600×1835', weight: 5600,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCT2000/1':    { dimensions: '1500×1760×2010', weight: 7000,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HC2400':       { dimensions: '1350×1520×1370', weight: 4000,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCD2400':      { dimensions: '1450×1720×1670', weight: 4300,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HC2700':       { dimensions: '1613×1670×1650', weight: 4700,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCD2700':      { dimensions: '1400×1780×1530', weight: 4930,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCT2700':      { dimensions: '1900×2000×1970', weight: 7200,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCT2700/1':    { dimensions: '1900×2250×1950', weight: 9000,  controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },
  'HCD3800':      { dimensions: '1665×1810×1800',                controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCT3800':      { dimensions: '1681×1750×2100', weight: 10500, controlType: '推拉软轴/电控/气控', rotationDirection: '相同' },

  // ---- 轻型高速系列 (P19-P22) ----
  'HC038A':       { dimensions: '392×480×480',    weight: 70,    controlType: '推拉软轴',          rotationDirection: '相反' },
  'HC65':         { dimensions: '351×380×544',    weight: 130,   controlType: '推拉软轴',          rotationDirection: '相反' },
  'HCQ100':       { dimensions: '546×551×656',    weight: 150,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'MV100A':       { dimensions: '485×508×580',    weight: 220,   controlType: '推拉软轴',          rotationDirection: '相反' },
  'HCV120':       { dimensions: '502×600×847',    weight: 300,   controlType: '推拉软轴',          rotationDirection: '相反' },
  'HCQ138':       { dimensions: '504×619×616',    weight: 240,   controlType: '推拉软轴',          rotationDirection: '相同' },
  'HCA138':       { dimensions: '530×660×616',    weight: 200,   controlType: '推拉软轴',          rotationDirection: '相反' },
  'HCA138(倾角5°)': { dimensions: '530×660×616',  weight: 200,   controlType: '推拉软轴',          rotationDirection: '相反' },
  'HC200':        { dimensions: '424×792×754',    weight: 280,   controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HC201':        { dimensions: '488×691×758',    weight: 350,   controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCV230':       { dimensions: '568×820×1020',   weight: 450,   controlType: '推拉软轴/电控',     rotationDirection: '相同' },
  'HCQ300':       { dimensions: '630×521×680',    weight: 370,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCA300':       { dimensions: '620×585×753',    weight: 370,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCA301':       { dimensions: '618×585×824',    weight: 370,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCA302':       { dimensions: '560×585×764',    weight: 370,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCQ401':       { dimensions: '640×900×800',    weight: 552,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCQ402':       { dimensions: '611×890×1080',   weight: 650,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCQ501':       { dimensions: '742×856×950',    weight: 570,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCQ502':       { dimensions: '742×856×980',    weight: 700,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCQ700':       { dimensions: '898×1104×1066',  weight: 980,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCQH700':      { dimensions: '895×1014×1100',  weight: 920,   controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCQ701':       { dimensions: '868×1104×1146',                 controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCA700':       { dimensions: '835×1104×1156',  weight: 1100,  controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCA701':       { dimensions: '939×1130×1035',                 controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCA701(倾角5°)': { dimensions: '939×1130×1035',               controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCQ1000':      { dimensions: '994×1104×985',   weight: 1100,  controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCA1000':      { dimensions: '1030×1104×1050',                controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCQH1000':     { dimensions: '1035×1110×1038', weight: 1500,  controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCQ1001':      { dimensions: '809×1120×1003',                 controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCQ1400':      { dimensions: '938×1210×1027',  weight: 1430,  controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCA1400':      { dimensions: '826×1300×1250',  weight: 1600,  controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCA1401':      { dimensions: '756×1300×1285',  weight: 1600,  controlType: '推拉软轴/电控/气控', rotationDirection: '相反' },
  'HCQH1600':     { dimensions: '1035×1110×1038', weight: 1500,  controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCQ1600':      { dimensions: '1106×1360×1056', weight: 1500,  controlType: '推拉软轴/电控',     rotationDirection: '相反' },
  'HCQ1601':      { dimensions: '1106×1230×1180', weight: 1550,  controlType: '推拉软轴/电控',     rotationDirection: '相反' },

  // ---- 轻型高速(铝合金箱体) (P23-P26) — 仅weight，无dimensions ----
  'HCG1068':      { weight: 46 },
  'HCAG1090':     { weight: 106 },
  'HCG1220':      { weight: 63 },
  'HCG1280-1':    { weight: 73 },
  'HCM165':       { weight: 130.5 },
  'HCG1305-3':    { weight: 120 },
  'HCNM280T':     { weight: 260 },
  'HCM303':       { weight: 290 },
  'HCAM303':      { weight: 290 },
  'HCAM403':      { weight: 390 },
  'HCG1400':      { weight: 160 },
  'HCG1500':      { weight: 185 },
  'HCG1665':      { weight: 248 },
  'HCG2050':      { weight: 342 },
  'HCG3050':      { weight: 570 },
  'HCAG3050':     { weight: 570 },
  'HCVG3710':     { weight: 600 },
  'HCAG5050':     { weight: 870 },
  'HCG5050':      { weight: 950 },
  'HCG6400':      { weight: 950 },
  'HCAG6400':     { weight: 1200 },
  'HCG7650':      { weight: 1230 },
  'HCAG7650':     { weight: 1300 },
  'HCAG7650(倾角8°)': { weight: 1300 },
  'HCG9060':      { weight: 1575 },
  'HCAG9055':     { weight: 1570 },
  'HCAG9055(倾角8°)': { weight: 1570 },

  // ---- GW族系 weight (P27-P34, 单位=吨→kg) ----
  'GWC28.30':     { weight: 1230 },
  'GWC30.32':     { weight: 1460 },
  'GWC32.35':     { weight: null }, // 从表中提取
  'GWC36.39':     { weight: null },
  'GWC39.41':     { weight: 3980 },
  'GWC42.45':     { weight: 4700 },
  'GWC45.49':     { weight: null },
  'GWC49.54':     { weight: 7900 },
  'GWC49.59':     { weight: 8500 },
  'GWC52.59':     { weight: 10700 },
  'GWC52.62':     { weight: 11000 },
  'GWC60.66':     { weight: 14690 },
  'GWC60.74':     { weight: 16600 },
  'GWC63.71':     { weight: 17000 },
  'GWC66.75':     { weight: 20500 },
  'GWC70.76':     { weight: 22500 },
  'GWC70.82':     { weight: 23000 },
  'GWC70.85':     { weight: 27000 },
  'GWC75.90':     { weight: 34000 },
  'GWC78.88':     { weight: 35000 },
  'GWC78.96':     { weight: 38000 },
  'GWC80.95':     { weight: 40000 },
  'GWC85.100':    { weight: 56500 },

  // GWL weights (from PDF GWC/GWL paired column)
  'GWL28.30':     { weight: 1070 },
  'GWL30.32':     { weight: 1240 },
  'GWL36.39':     { weight: null },
  'GWL39.41':     { weight: 3550 },
  'GWL42.45':     { weight: 4190 },
  'GWL49.54':     { weight: 7000 },
  'GWL52.59':     { weight: 8955 },
  'GWL52.62':     { weight: 9300 },
  'GWL60.66':     { weight: 13290 },
  'GWL60.74':     { weight: 15100 },
  'GWL66.75':     { weight: 17500 },
  'GWL70.76':     { weight: 20000 },
  'GWL70.82':     { weight: 20500 },
  'GWL70.85':     { weight: 24200 },
  'GWL75.90':     { weight: 31500 },
  'GWL78.88':     { weight: 32000 },
  'GWL80.95':     { weight: 37000 },

  // GWS/GWK/GWH/GWD weights (from PDF page 32-34 paired listings)
  'GWS28.30':     { weight: null },
  'GWS30.32A':    { weight: null },
  'GWS32.35':     { weight: null },
  'GWS36.39':     { weight: null },
  'GWS39.41':     { weight: null },
  'GWS42.45':     { weight: null },
  'GWS45.49':     { weight: null },
  'GWS49.54':     { weight: null },
  'GWS49.61':     { weight: null },
  'GWS52.59':     { weight: null },
  'GWS52.71':     { weight: null },
  'GWS60.66':     { weight: null },
  'GWS60.75':     { weight: null },
  'GWS63.71':     { weight: null },
  'GWS66.75':     { weight: null },
  'GWS70.76':     { weight: null },
  'GWS70.82':     { weight: null },

  // GWS/GWK/GWH/GWD weight from page 32-33 (grouped models, weight per group)
  'GWS36.54':  { weight: 3230 }, 'GWK36.54':  { weight: 3230 }, 'GWH36.54': { weight: 3230 }, 'GWD36.54': { weight: 3230 },
  'GWS39.41':  { weight: 2960 }, 'GWK39.41':  { weight: 2960 }, 'GWH39.41': { weight: 2960 }, 'GWD39.41': { weight: 2960 },
  'GWS42.45':  { weight: 3960 }, 'GWK42.45':  { weight: 3960 }, 'GWH42.45': { weight: 3960 }, 'GWD42.45': { weight: 3960 },
  'GWS42.63':  { weight: 3960 }, 'GWK42.63':  { weight: 3960 }, 'GWH42.63': { weight: 3960 }, 'GWD42.63': { weight: 3960 },
  'GWS45.49':  { weight: 6030 }, 'GWK45.49':  { weight: 6030 }, 'GWH45.49': { weight: 6030 }, 'GWD45.49': { weight: 6030 },
  'GWS45.68':  { weight: 6030 }, 'GWK45.68':  { weight: 6030 },
  'GWD45.68':  { weight: 6030 },
  'GWH45.68B': { weight: 6030 },
  'GWS49.54':  { weight: 7900 }, 'GWK49.54':  { weight: 7900 }, 'GWH49.54': { weight: 7900 }, 'GWD49.54': { weight: 7900 },
  'GWS49.74':  { weight: 8500 }, 'GWK49.74':  { weight: 8500 }, 'GWH49.74': { weight: 8500 }, 'GWD49.74': { weight: 8500 },
  'GWS52.59':  { weight: 8900 }, 'GWK52.59':  { weight: 8900 }, 'GWH52.59': { weight: 8900 }, 'GWD52.59': { weight: 8900 },
  'GWS52.82':  { weight: 12300 }, 'GWK52.82': { weight: 12300 }, 'GWH52.82': { weight: 12300 }, 'GWD52.82': { weight: 12300 },
  'GWS60.66':  { weight: 15000 }, 'GWK60.66': { weight: 15000 }, 'GWH60.66': { weight: 15000 }, 'GWD60.66': { weight: 15000 },
  'GWS60.92':  { weight: 18300 }, 'GWK60.92': { weight: 18300 }, 'GWH60.92': { weight: 18300 }, 'GWD60.92': { weight: 18300 },
  'GWS63.71':  { weight: 17000 }, 'GWK63.71': { weight: 17000 }, 'GWH63.71': { weight: 17000 }, 'GWD63.71': { weight: 17000 },
  'GWS63.95':  { weight: null }, 'GWK63.95':  { weight: null }, 'GWH63.95': { weight: null }, 'GWD63.95': { weight: null },
  'GWS66.75':  { weight: 20000 }, 'GWK66.75': { weight: 20000 }, 'GWH66.75': { weight: 20000 }, 'GWD66.75': { weight: 20000 },
  'GWS66.106': { weight: null }, 'GWK66.106': { weight: null }, 'GWH66.106': { weight: null }, 'GWD66.106': { weight: null },
  'GWS70.76':  { weight: 22500 }, 'GWK70.76': { weight: 22500 }, 'GWH70.76': { weight: 22500 }, 'GWD70.76': { weight: 22500 },
  'GWS70.82':  { weight: null }, 'GWK70.82':  { weight: null }, 'GWH70.82': { weight: null }, 'GWD70.82': { weight: null },
  'GWS70.111': { weight: null }, 'GWK70.111': { weight: null }, 'GWH70.111': { weight: null }, 'GWD70.111': { weight: null },

  // ---- 电推系列 (P47-P48) ----
  'DT180':        { dimensions: '325×380×544',    weight: 130,   rotationDirection: '相反' },
  'DT210':        { dimensions: '365×551×656',    weight: 150,   rotationDirection: '相反' },
  'DT240':        { dimensions: '641×619×715',    weight: 240,   rotationDirection: '相反' },
  'DT280':        { dimensions: '479×792×820',    weight: 350,   rotationDirection: '相反' },
  'DT580':        { dimensions: '630×741×780',    weight: 370,   rotationDirection: '相反' },
  'DT770':        { dimensions: '532×900×800',    weight: 480,   rotationDirection: '相反' },
  'DT900':        { dimensions: '705×856×870',    weight: 700,   rotationDirection: '相反' },
  'DT1400':       { dimensions: '720×1104×1066',  weight: 900,   rotationDirection: '相反' },
  'DT1500':       { dimensions: '789×1104×985',   weight: 1100,  rotationDirection: '相反' },
  'DT2400':       { dimensions: '920×1210×1210',  weight: 1430,  rotationDirection: '相反' },
  'DT4300':       { dimensions: '923×1230×1180',  weight: 1550,  rotationDirection: '相反' },

  // ---- HCL系列液压离合器 (P49) ----
  'HCL30':        { dimensions: '345×310×455',    weight: 100 },
  'HCL30S':       { dimensions: '345×310×455',    weight: 100 },
  'HCL30F':       { dimensions: '345×310×455',    weight: 100 },
  'HCL100':       { dimensions: '570×420×535',    weight: 156 },
  'HCL100S':      { dimensions: '570×420×535',    weight: 156 },
  'HCL100F':      { dimensions: '570×420×535',    weight: 156 },
  'HCL250':       { dimensions: '554×425×635',    weight: 210 },
  'HCL250A':      { dimensions: '554×425×635',    weight: 210 },
  'HCL250S':      { dimensions: '554×425×635',    weight: 210 },
  'HCL250F':      { dimensions: '554×425×635',    weight: 210 },
  'HCL320':       { dimensions: '554×425×635',    weight: 210 },
  'HCL320S':      { dimensions: '554×425×635',    weight: 210 },
  'HCL320F':      { dimensions: '554×425×635',    weight: 210 },
  'HCL600':       { dimensions: '746×560×688',    weight: 450 },
  'HCL600S':      { dimensions: '746×560×688',    weight: 450 },
  'HCL600F':      { dimensions: '746×560×688',    weight: 450 },
  'HCL800':       { dimensions: '746×560×688',    weight: 450 },
  'HCL800S':      { dimensions: '746×560×688',    weight: 450 },
  'HCL800F':      { dimensions: '746×560×688',    weight: 450 },
  'HCL1000':      { dimensions: '915×800×1005',   weight: 800 },
  'HCL1000S':     { dimensions: '915×800×1005',   weight: 800 },
  'HCL1000F':     { dimensions: '915×800×1005',   weight: 800 },

  // ---- 船用双速系列 (P35-P40) — 仅中心距，无dimensions/weight ----
  // SGW系列 (P39)
  'SGW30.32':     { weight: null },
  'SGW32.35':     { weight: null },
  'SGW39.41':     { weight: null },
  'SGW42.45':     { weight: null },
  'SGW49.54':     { weight: null },

  // SGWS系列 (P38) — weight from table
  'SGWS49.54':    { weight: null },
  'SGWS52.59':    { weight: null },
  'SGWS60.66':    { weight: null },
  'SGWS66.75':    { weight: null },
  'SGWS70.76':    { weight: null },

  // HCS系列 (P35-P38) — 中心距 from table
  'HCS138':       { weight: null },
  'HCS200':       { weight: null },
  'HCS201':       { weight: null },
  'HCS302':       { weight: null },
  'HCS400':       { weight: null },
  'HCS600':       { weight: null },
  'HCS1000':      { weight: null },
  'HCS1200':      { weight: null },
  'HCS1600':      { weight: null },
  'HCS2000':      { weight: null },
  'HCS2700':      { weight: null },

  // 2GWH系列 (P45-P46)
  '2GWH1060':     { weight: null },
  '2GWH1830':     { weight: null },
  '2GWH3140':     { weight: null },
  '2GWH4100':     { weight: null },
  '2GWH5410':     { weight: null },
  '2GWH7050':     { weight: null },
  '2GWH9250':     { weight: null },

  // GC配变距桨 (P41-P44) — 仅中心距数据
  'GCS320':       { weight: null },
  'GCS350':       { weight: null },
  'GCS390':       { weight: null },
  'GCS410':       { weight: null },
  'GCS450':       { weight: null },
  'GCS700B':      { weight: null },
  'GCS750':       { weight: null },
  'GCS760':       { weight: null },
  'GCS850':       { weight: null },
  'GCS880':       { weight: null },
  'GCS900':       { weight: null },
};

// Remove null weights (placeholder entries that had no PDF weight data)
for (const [k, v] of Object.entries(modelData)) {
  if (v.weight === null) delete v.weight;
}

// ============================================================
// 2. 系列级别规则 — controlType 和 rotationDirection
//    (当个别型号没有在 modelData 中定义时，用系列规则填充)
// ============================================================

// 根据型号前缀推断 controlType
function inferControlType(model, series) {
  // GW族系: 气控/电控 (PDF P34)
  if (/^GW[CDLSHK]/.test(model)) return '气控/电控';
  if (/^GWCD/.test(model)) return '气控/电控';

  // GC配变距桨: 气控/电控 (PDF P44)
  if (/^GC[SHE]|^GCST|^GCHT|^GCHE/.test(model) || (series === 'GC配变距桨')) return '气控/电控';

  // 船用双速: 推拉软轴/电控/气控 (PDF P40)
  if (/^SGW|^HCS\d|^HCDS|^HCTS\d/.test(model) || series === '船用双速') return '推拉软轴/电控/气控';

  // 2GWH: 气控/电控 (PDF P46)
  if (/^2GWH/.test(model)) return '气控/电控';

  // HCL: 机械控制/电控 (PDF P49)
  if (/^HCL/.test(model)) return '机械控制/电控';

  // HCT系列 (三级减速): 推拉软轴/电控/气控
  if (/^HCT/.test(model) || /^HCTH/.test(model)) return '推拉软轴/电控/气控';

  // HCD系列 (带倒车): 推拉软轴/电控/气控
  if (/^HCD/.test(model) || /^HCDX/.test(model) || /^HCDF/.test(model)) return '推拉软轴/电控/气控';

  // HCAG/HCA 倾角系列: 推拉软轴/电控
  if (/^HCAG/.test(model) || /^HCA\d/.test(model) || /^HCA[0-9]/.test(model)) return '推拉软轴/电控';

  // HCAM 角安装: 推拉软轴/电控
  if (/^HCAM/.test(model)) return '推拉软轴/电控';

  // HCG 铝合金: 推拉软轴/电控
  if (/^HCG\d/.test(model)) return '推拉软轴/电控';

  // HCM 特殊: 推拉软轴/电控
  if (/^HCM\d/.test(model) || /^HCNM/.test(model)) return '推拉软轴/电控';

  // HCQ/HCQH 倾角系列: 推拉软轴/电控
  if (/^HCQ/.test(model)) return '推拉软轴/电控';

  // HCV/HCVG 立式: 推拉软轴/电控
  if (/^HCV/.test(model) || /^HCVG/.test(model)) return '推拉软轴/电控';

  // DT电推系列: 电控
  if (/^DT/.test(model)) return '电控';

  // MV/MA/MB: 推拉软轴
  if (/^MV/.test(model) || /^MA\d/.test(model) || /^MB\d/.test(model)) return '推拉软轴';

  // X6: 推拉软轴/电控
  if (/^X6/.test(model)) return '推拉软轴/电控';

  // HC 标准系列 (中大功率): 推拉软轴/电控/气控
  if (/^HC\d/.test(model)) return '推拉软轴/电控/气控';

  // 混合动力P后缀: 参考常规产品 (PDF P58)
  if (model.endsWith('P')) {
    const base = model.slice(0, -1);
    if (modelData[base]?.controlType) return modelData[base].controlType;
    // 按前缀再推断
    return inferControlType(base, series);
  }

  return null;
}

// 根据型号前缀推断 rotationDirection
function inferRotationDirection(model, series) {
  // GWC/GWL: 相同
  if (/^GWC\d/.test(model) || /^GWL\d/.test(model)) return '相同';
  // GWS/GWD/GWH/GWK: 相反
  if (/^GWS\d/.test(model) || /^GWD\d/.test(model) || /^GWH\d/.test(model) || /^GWK\d/.test(model)) return '相反';
  // GWCD: 相反
  if (/^GWCD/.test(model)) return '相反';

  // GC配变距桨: 全部相反 (PDF P44)
  if (/^GCS\d|^GCST|^GCSE|^GCHE|^GCH\d|^GCHT/.test(model)) return '相反';
  if (/^GC\d/.test(model) && series === 'GC配变距桨') return '相反';

  // 2GWH: 相同 (PDF P46)
  if (/^2GWH/.test(model)) return '相同';

  // 船用双速系列 (PDF P40)
  if (/^HCS\d/.test(model)) return '相同';
  if (/^HCDS\d/.test(model)) return '相同';
  if (/^HCTS\d/.test(model)) return '相反';
  if (/^SGWC/.test(model)) return '相同';
  if (/^SGWS/.test(model)) return '相同';
  if (/^SGWH/.test(model)) return '相同';
  if (/^SGWD/.test(model)) return '相同';
  if (/^SGWL/.test(model)) return '相同';
  if (/^SGW\d/.test(model)) return '相同';

  // HCL: 不适用
  if (/^HCL/.test(model)) return '不适用';

  // DT电推: 相反
  if (/^DT/.test(model)) return '相反';

  // MV倾角: 相反
  if (/^MV/.test(model)) return '相反';

  // HCT系列 (三级减速): 相同 (PDF所有HCT型号均为相同)
  if (/^HCT\d/.test(model) || /^HCTH/.test(model)) return '相同';

  // HCD系列 (带倒车): 相反
  if (/^HCD/.test(model) || /^HCDX/.test(model) || /^HCDF/.test(model)) return '相反';

  // HC标准系列: 相反 (PDF所有HC型号均为相反)
  if (/^HC\d/.test(model)) return '相反';

  // HCA/HCAG 倾角: 相反
  if (/^HCA\d/.test(model) || /^HCAG/.test(model)) return '相反';

  // HCAM 角安装: 相反
  if (/^HCAM/.test(model)) return '相反';

  // HCG 铝合金高速: 相反
  if (/^HCG\d/.test(model)) return '相反';

  // HCVG: 相反
  if (/^HCVG/.test(model)) return '相反';

  // HCM: 相反
  if (/^HCM\d/.test(model)) return '相反';
  if (/^HCNM/.test(model)) return '相反';

  // HCQ/HCQH: 相反 (PDF P19-22, 绝大多数HCQ相反)
  if (/^HCQ/.test(model)) return '相反';

  // HCV: 相反 (HCV120=相反, HCV230=相同, 但默认相反)
  if (/^HCV\d/.test(model)) return '相反';

  // MV倾角: 相反
  if (/^MV/.test(model)) return '相反';

  // X6: 相反
  if (/^X6/.test(model)) return '相反';

  // 混合动力P后缀: 与常规产品一致 (PDF P58)
  if (model.endsWith('P')) {
    const base = model.slice(0, -1);
    if (modelData[base]?.rotationDirection) return modelData[base].rotationDirection;
    if (/^GWC/.test(model)) return '相同';
    if (/^GWS/.test(model)) return '相反';
    return inferRotationDirection(base, series);
  }

  // 复合命名的GW模型
  if (model.includes('/') && /^GW[SDKH]/.test(model)) return '相反';

  return null;
}

// ============================================================
// 3. 执行更新
// ============================================================
let updatedDim = 0, updatedWeight = 0, updatedCtrl = 0, updatedRot = 0;
let totalUpdated = 0;

for (const entry of completeGearboxData) {
  const m = entry.model;
  const s = entry.series;
  let changed = false;

  // 尝试从 modelData 直接匹配
  const direct = modelData[m];

  // dimensions
  if (!entry.dimensions && direct?.dimensions) {
    entry.dimensions = direct.dimensions;
    updatedDim++;
    changed = true;
  }

  // weight
  if (!entry.weight && direct?.weight) {
    entry.weight = direct.weight;
    updatedWeight++;
    changed = true;
  }

  // controlType
  if (!entry.controlType) {
    const ct = direct?.controlType || inferControlType(m, s);
    if (ct) {
      entry.controlType = ct;
      updatedCtrl++;
      changed = true;
    }
  }

  // rotationDirection
  if (!entry.rotationDirection) {
    const rd = direct?.rotationDirection || inferRotationDirection(m, s);
    if (rd) {
      entry.rotationDirection = rd;
      updatedRot++;
      changed = true;
    }
  }

  if (changed) totalUpdated++;
}

console.log(`\n=== 更新统计 ===`);
console.log(`总更新型号: ${totalUpdated}`);
console.log(`  dimensions:        +${updatedDim}`);
console.log(`  weight:            +${updatedWeight}`);
console.log(`  controlType:       +${updatedCtrl}`);
console.log(`  rotationDirection: +${updatedRot}`);

// ============================================================
// 4. 验证剩余缺失
// ============================================================
let remainDim = 0, remainWeight = 0, remainCtrl = 0, remainRot = 0;
let remainModels = [];
for (const entry of completeGearboxData) {
  const missing = [];
  if (!entry.dimensions) { remainDim++; missing.push('dim'); }
  if (!entry.weight) { remainWeight++; missing.push('wt'); }
  if (!entry.controlType) { remainCtrl++; missing.push('ctrl'); }
  if (!entry.rotationDirection) { remainRot++; missing.push('rot'); }
  if (missing.length > 0) remainModels.push(`${entry.model}[${missing.join(',')}]`);
}

console.log(`\n=== 剩余缺失 ===`);
console.log(`  dimensions:        ${remainDim} (was 340)`);
console.log(`  weight:            ${remainWeight} (was 166)`);
console.log(`  controlType:       ${remainCtrl} (was 432)`);
console.log(`  rotationDirection: ${remainRot} (was 487)`);

if (remainModels.length > 0) {
  console.log(`\n剩余缺失型号(${remainModels.length}): `);
  console.log(remainModels.join(', '));
}

// ============================================================
// 5. 写回文件
// ============================================================
const output = `export const completeGearboxData = ${JSON.stringify(completeGearboxData, null, 4)};\n`;
fs.writeFileSync('./src/data/completeGearboxData.js', output, 'utf8');
console.log(`\n✓ completeGearboxData.js 已更新`);
