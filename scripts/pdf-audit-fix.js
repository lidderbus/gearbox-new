#!/usr/bin/env node
/**
 * PDF手册自动审计+修复脚本
 * 对比 杭齿厂选型手册2025版5月版.pdf vs completeGearboxData.js
 *
 * 已识别的主要问题:
 * 1. 双速系列(HCS/HCDS/HCTS) + SGW/SGWS系列: 字段偏移3列
 *    - thrust 存的是 传递能力(kW/r/min)
 *    - centerDistance 存的是 额定推力(kN)
 *    - dimensions 存的是 中心距(mm)
 * 2. 其他系列: 个别参数差异
 */

const fs = require('fs');
const path = require('path');

// ========== PDF参考数据 ==========
// 从PDF手册2025版5月版提取的权威数据

const PDF_REFERENCE = {
  // ===== 双速系列 (pages 35-38) =====
  // 格式: { thrust(kN), centerDistance(mm), capacity(kW/r/min), minSpeed, maxSpeed }
  'HCS138':   { thrust: 30,  centerDistance: 225, capacity: 0.110, minSpeed: 1000, maxSpeed: 2500 },
  'HCS201':   { thrust: 40,  centerDistance: 205, capacity: 0.147, minSpeed: 1000, maxSpeed: 2500 },
  'HCS302':   { thrust: 50,  centerDistance: 264, capacity: 0.243, minSpeed: 750,  maxSpeed: 2500 },
  'HCS400':   { thrust: 82,  centerDistance: 264, capacity: 0.331, minSpeed: 1000, maxSpeed: 1800 },
  'HCS600':   { thrust: 90,  centerDistance: 320, capacity: 0.48,  minSpeed: 600,  maxSpeed: 2100 },
  'HCS1000':  { thrust: 110, centerDistance: 335, capacity: 0.735, minSpeed: 600,  maxSpeed: 1900 },
  'HCS1200':  { thrust: null, centerDistance: null, capacity: 0.80, minSpeed: 600, maxSpeed: 1800 },
  'HCS1600':  { thrust: 170, centerDistance: 415, capacity: 1.213, minSpeed: 500,  maxSpeed: 1650 },
  'HCS2000':  { thrust: 190, centerDistance: 450, capacity: 1.48,  minSpeed: 600,  maxSpeed: 1500 },
  'HCS2700':  { thrust: 270, centerDistance: 490, capacity: 2.05,  minSpeed: 500,  maxSpeed: 1400 },

  'HCDS302':  { thrust: 60,  centerDistance: 355, capacity: 0.257, minSpeed: 1000, maxSpeed: 2500 },
  'HCDS400':  { thrust: 82,  centerDistance: 355, capacity: 0.331, minSpeed: 1000, maxSpeed: 1800 },
  'HCDS600':  { thrust: 90,  centerDistance: 415, capacity: 0.46,  minSpeed: 600,  maxSpeed: 2100 },
  'HCDS800':  { thrust: 110, centerDistance: 450, capacity: 0.588, minSpeed: 600,  maxSpeed: 1800 },
  'HCDS1200': { thrust: 120, centerDistance: 380, capacity: 0.93,  minSpeed: 600,  maxSpeed: 1900 },
  'HCDS1400': { thrust: 175, centerDistance: 485, capacity: 1.03,  minSpeed: 600,  maxSpeed: 1800 },
  'HCDS1600': { thrust: 200, centerDistance: 520, capacity: 1.213, minSpeed: 500,  maxSpeed: 1650 },
  'HCDS2000': { thrust: 220, centerDistance: 560, capacity: 1.48,  minSpeed: 600,  maxSpeed: 1500 },
  'HCDS2700': { thrust: 280, centerDistance: 630, capacity: 2.05,  minSpeed: 500,  maxSpeed: 1400 },

  'HCTS800':  { thrust: 140, centerDistance: 645, capacity: 0.625, minSpeed: 600,  maxSpeed: 1800 },
  'HCTS1200': { thrust: 140, centerDistance: 450, capacity: 0.93,  minSpeed: 600,  maxSpeed: 1800 },
  'HCTS1400': { thrust: 220, centerDistance: 775, capacity: 1.03,  minSpeed: 600,  maxSpeed: 1800 },
  'HCTS1600': { thrust: 250, centerDistance: 815, capacity: 1.213, minSpeed: 500,  maxSpeed: 1650 },
  'HCTS2000': { thrust: 270, centerDistance: 870, capacity: 1.48,  minSpeed: 600,  maxSpeed: 1500 },
  'HCTS2700': { thrust: 340, centerDistance: 945, capacity: 2.05,  minSpeed: 500,  maxSpeed: 1400 },

  // ===== SGW双速 (page 39) =====
  'SGW30.32': { thrust: 100, centerDistance: null, capacity: null, minSpeed: 400, maxSpeed: 1300 },
  'SGW32.35': { thrust: 113, centerDistance: null, capacity: null, minSpeed: 400, maxSpeed: 850 },
  'SGW39.41': { thrust: 175, centerDistance: null, capacity: null, minSpeed: 400, maxSpeed: 1700 },
  'SGW42.45': { thrust: 220, centerDistance: null, capacity: null, minSpeed: 400, maxSpeed: 1600 },
  'SGW49.54': { thrust: 284, centerDistance: null, capacity: null, minSpeed: 400, maxSpeed: 880 },

  // ===== SGWS双速 (page 38) =====
  'SGWS49.54': { thrust: 290, centerDistance: 540, capacity: 2.667, minSpeed: 400, maxSpeed: 1200 },
  'SGWS52.59': { thrust: 360, centerDistance: 590, capacity: 3.448, minSpeed: 400, maxSpeed: 1200 },
  'SGWS60.66': { thrust: 540, centerDistance: 668, capacity: 4.625, minSpeed: 400, maxSpeed: 1200 },
  'SGWS66.75': { thrust: 730, centerDistance: 750, capacity: 6.99,  minSpeed: 300, maxSpeed: 950 },
  'SGWS70.76': { thrust: 750, centerDistance: 768, capacity: 8.111, minSpeed: 300, maxSpeed: 950 },

  // ===== SGWL双速 =====
  'SGWL49.54': { thrust: 290, centerDistance: 540, capacity: null, minSpeed: 400, maxSpeed: 1200 },
  'SGWL52.59': { thrust: 360, centerDistance: 590, capacity: null, minSpeed: 400, maxSpeed: 1200 },

  // ===== DT电推系列 (pages 47-48) =====
  'DT180':  { thrust: 14.7, centerDistance: 142, dimensions: '325×380×544',  weight: 130,  minSpeed: 750, maxSpeed: 1500 },
  'DT210':  { thrust: 16,   centerDistance: 146, dimensions: '365×551×656',  weight: 150,  minSpeed: 750, maxSpeed: 1500 },
  'DT240':  { thrust: 25,   centerDistance: 165, dimensions: '641×619×715',  weight: 240,  minSpeed: 750, maxSpeed: 1500 },
  'DT280':  { thrust: 30,   centerDistance: 190, dimensions: '479×792×820',  weight: 350,  minSpeed: 750, maxSpeed: 1500 },
  'DT580':  { thrust: 40,   centerDistance: 203, dimensions: '630×741×780',  weight: 370,  minSpeed: 750, maxSpeed: 1500 },
  'DT770':  { thrust: 50,   centerDistance: 220, dimensions: '532×900×800',  weight: 480,  minSpeed: 750, maxSpeed: 1500 },
  'DT900':  { thrust: 60,   centerDistance: 264, dimensions: '705×856×870',  weight: 700,  minSpeed: 750, maxSpeed: 1500 },
  'DT1400': { thrust: 90,   centerDistance: 290, dimensions: '720×1104×1066', weight: 900,  minSpeed: 750, maxSpeed: 1500 },
  'DT1500': { thrust: 100,  centerDistance: 310, dimensions: '789×1104×985',  weight: 1100, minSpeed: 750, maxSpeed: 1500 },
  'DT2400': { thrust: 110,  centerDistance: 340, dimensions: '920×1210×1210', weight: 1430, minSpeed: 750, maxSpeed: 1500 },
  'DT4300': { thrust: 120,  centerDistance: 370, dimensions: '923×1230×1180', weight: 1550, minSpeed: 750, maxSpeed: 1500 },

  // ===== GC系列 (pages 41-44) =====
  'GCS320':   { thrust: 100,  centerDistance: 320,  minSpeed: 400, maxSpeed: 1800, capacity: 0.57 },
  'GCH320':   { thrust: 100,  centerDistance: 320,  minSpeed: 400, maxSpeed: 1800, capacity: 0.57 },
  'GCS350':   { thrust: 113,  centerDistance: 350,  minSpeed: 400, maxSpeed: 1800, capacity: 0.72 },
  'GCH350':   { thrust: 113,  centerDistance: 350,  minSpeed: 400, maxSpeed: 1800, capacity: 0.72 },
  'GCS390':   { thrust: 140,  centerDistance: 390,  minSpeed: 400, maxSpeed: 1800, capacity: 0.96 },
  'GCH390':   { thrust: 140,  centerDistance: 390,  minSpeed: 400, maxSpeed: 1800, capacity: 0.96 },
  'GCS410':   { thrust: 175,  centerDistance: 410,  minSpeed: 400, maxSpeed: 1600, capacity: 1.292 },
  'GCH410':   { thrust: 175,  centerDistance: 410,  minSpeed: 400, maxSpeed: 1600, capacity: 1.292 },
  'GCS450':   { thrust: 220,  centerDistance: 455,  minSpeed: 400, maxSpeed: 1600, capacity: 1.64 },
  'GCS490':   { thrust: 270,  centerDistance: 490,  minSpeed: 400, maxSpeed: 1400, capacity: 2.12 },
  'GCH490':   { thrust: 270,  centerDistance: 490,  minSpeed: 400, maxSpeed: 1400, capacity: 2.12 },
  'GCS540':   { thrust: 290,  centerDistance: 540,  minSpeed: 400, maxSpeed: 1200, capacity: 2.825 },
  'GCH540':   { thrust: 290,  centerDistance: 540,  minSpeed: 400, maxSpeed: 1200, capacity: 2.825 },
  'GCS590':   { thrust: 360,  centerDistance: 590,  minSpeed: 400, maxSpeed: 1200, capacity: 3.64 },
  'GCH590':   { thrust: 360,  centerDistance: 590,  minSpeed: 400, maxSpeed: 1200, capacity: 3.64 },
  'GCS660':   { thrust: 540,  centerDistance: 668,  minSpeed: 400, maxSpeed: 1200, capacity: 5.05 },
  'GCH660':   { thrust: 540,  centerDistance: 668,  minSpeed: 400, maxSpeed: 1200, capacity: 5.05 },
  'GCS700B':  { thrust: 450,  centerDistance: 700,  minSpeed: 400, maxSpeed: 1200, capacity: 4.744 },
  'GCS750':   { thrust: 730,  centerDistance: 750,  minSpeed: 300, maxSpeed: 950,  capacity: 7.2 },
  'GCH750':   { thrust: 730,  centerDistance: 750,  minSpeed: 300, maxSpeed: 950,  capacity: 7.2 },
  'GCS760':   { thrust: 750,  centerDistance: 768,  minSpeed: 300, maxSpeed: 900,  capacity: 8.111 },
  'GCH760':   { thrust: 750,  centerDistance: 768,  minSpeed: 300, maxSpeed: 900,  capacity: 8.111 },
  'GCS850':   { thrust: 800,  centerDistance: 855,  minSpeed: 300, maxSpeed: 800,  capacity: 9.6 },
  'GCH850':   { thrust: 800,  centerDistance: 855,  minSpeed: 300, maxSpeed: 800,  capacity: 9.6 },
  'GCS880':   { thrust: 1000, centerDistance: 880,  minSpeed: 200, maxSpeed: 650,  capacity: 12.063 },
  'GCH880':   { thrust: 1000, centerDistance: 880,  minSpeed: 200, maxSpeed: 650,  capacity: 12.063 },
  'GCS900':   { thrust: 980,  centerDistance: 900,  minSpeed: 200, maxSpeed: 800,  capacity: 11.282 },
  'GCH900':   { thrust: 980,  centerDistance: 900,  minSpeed: 200, maxSpeed: 800,  capacity: 11.282 },
  'GCS950':   { thrust: 1000, centerDistance: 965,  minSpeed: 200, maxSpeed: 650,  capacity: 14 },
  'GCH950':   { thrust: 1000, centerDistance: 965,  minSpeed: 200, maxSpeed: 650,  capacity: 14 },
  'GCS1000':  { thrust: 1400, centerDistance: 1018, minSpeed: 200, maxSpeed: 800,  capacity: 17.5 },
  'GCH1000':  { thrust: 1400, centerDistance: 1018, minSpeed: 200, maxSpeed: 800,  capacity: 17.5 },
  // GCST系列 (三级减速)
  'GCST5':    { thrust: 120,  centerDistance: 445,  minSpeed: 400, maxSpeed: 1800, capacity: 0.57 },
  'GCHT5':    { thrust: 120,  centerDistance: 445,  minSpeed: 400, maxSpeed: 1800, capacity: 0.57 },
  'GCST6':    { thrust: 170,  centerDistance: 480,  minSpeed: 400, maxSpeed: 1800, capacity: 0.72 },
  'GCHT6':    { thrust: 170,  centerDistance: 480,  minSpeed: 400, maxSpeed: 1800, capacity: 0.72 },
  'GCST9':    { thrust: 220,  centerDistance: 545,  minSpeed: 400, maxSpeed: 1800, capacity: 0.96 },
  'GCHT9':    { thrust: 220,  centerDistance: 545,  minSpeed: 400, maxSpeed: 1800, capacity: 0.96 },
  'GCST11':   { thrust: 220,  centerDistance: 570,  minSpeed: 400, maxSpeed: 1600, capacity: 1.292 },
  'GCHT11':   { thrust: 220,  centerDistance: 570,  minSpeed: 400, maxSpeed: 1600, capacity: 1.292 },
  'GCST15':   { thrust: 270,  centerDistance: 630,  minSpeed: 400, maxSpeed: 1600, capacity: 1.64 },
  'GCHT15':   { thrust: 270,  centerDistance: 630,  minSpeed: 400, maxSpeed: 1600, capacity: 1.64 },
  'GCST20':   { thrust: 350,  centerDistance: 680,  minSpeed: 400, maxSpeed: 1400, capacity: 2.12 },
  'GCHT20':   { thrust: 350,  centerDistance: 680,  minSpeed: 400, maxSpeed: 1400, capacity: 2.12 },
  'GCST26':   { thrust: 360,  centerDistance: 750,  minSpeed: 400, maxSpeed: 1200, capacity: 2.825 },
  'GCHT26':   { thrust: 360,  centerDistance: 750,  minSpeed: 400, maxSpeed: 1200, capacity: 2.825 },
  'GCST33':   { thrust: 540,  centerDistance: 820,  minSpeed: 400, maxSpeed: 1200, capacity: 3.64 },
  'GCHT33':   { thrust: 540,  centerDistance: 820,  minSpeed: 400, maxSpeed: 1200, capacity: 3.64 },
  'GCST44':   { thrust: 600,  centerDistance: 924,  minSpeed: 400, maxSpeed: 1200, capacity: 5.05 },
  'GCHT44':   { thrust: 600,  centerDistance: 924,  minSpeed: 400, maxSpeed: 1200, capacity: 5.05 },
  'GCST66':   { thrust: 1000, centerDistance: 1064, minSpeed: 300, maxSpeed: 900,  capacity: 7.2 },
  'GCHT66':   { thrust: 1000, centerDistance: 1064, minSpeed: 300, maxSpeed: 900,  capacity: 7.2 },
  'GCST77':   { thrust: 750,  centerDistance: 768,  minSpeed: 300, maxSpeed: 900,  capacity: 8.111 },
  'GCHT77':   { thrust: 750,  centerDistance: 768,  minSpeed: 300, maxSpeed: 900,  capacity: 8.111 },
  'GCST91':   { thrust: 1000, centerDistance: 1190, minSpeed: 300, maxSpeed: 800,  capacity: 9.6 },
  'GCHT91':   { thrust: 1000, centerDistance: 1190, minSpeed: 300, maxSpeed: 800,  capacity: 9.6 },
  'GCST108':  { thrust: 1400, centerDistance: 1230, minSpeed: 200, maxSpeed: 800,  capacity: 11.282 },
  'GCHT108':  { thrust: 1400, centerDistance: 1230, minSpeed: 200, maxSpeed: 800,  capacity: 11.282 },
  'GCST115':  { thrust: 1400, centerDistance: 1260, minSpeed: 200, maxSpeed: 650,  capacity: 12.063 },
  'GCHT115':  { thrust: 1400, centerDistance: 1260, minSpeed: 200, maxSpeed: 650,  capacity: 12.063 },
  'GCST135':  { thrust: 1400, centerDistance: 1350, minSpeed: 200, maxSpeed: 650,  capacity: 14 },
  'GCHT135':  { thrust: 1400, centerDistance: 1350, minSpeed: 200, maxSpeed: 650,  capacity: 14 },
  'GCST170':  { thrust: 1400, centerDistance: 1430, minSpeed: 200, maxSpeed: 800,  capacity: 17.5 },
  'GCHT170':  { thrust: 1400, centerDistance: 1430, minSpeed: 200, maxSpeed: 800,  capacity: 17.5 },
  // GCSE/GCHE系列 (名义减速比)
  'GCSE5':    { thrust: 170,  centerDistance: 570,  minSpeed: 400, maxSpeed: 1800, capacity: 0.57 },
  'GCHE5':    { thrust: 170,  centerDistance: 570,  minSpeed: 400, maxSpeed: 1800, capacity: 0.57 },
  'GCSE6':    { thrust: 200,  centerDistance: 615,  minSpeed: 400, maxSpeed: 1800, capacity: 0.72 },
  'GCHE6':    { thrust: 200,  centerDistance: 615,  minSpeed: 400, maxSpeed: 1800, capacity: 0.72 },
  'GCSE9':    { thrust: 270,  centerDistance: 700,  minSpeed: 400, maxSpeed: 1800, capacity: 0.96 },
  'GCHE9':    { thrust: 270,  centerDistance: 700,  minSpeed: 400, maxSpeed: 1800, capacity: 0.96 },
  'GCSE11':   { thrust: 270,  centerDistance: 735,  minSpeed: 400, maxSpeed: 1600, capacity: 1.292 },
  'GCHE11':   { thrust: 270,  centerDistance: 735,  minSpeed: 400, maxSpeed: 1600, capacity: 1.292 },
  'GCSE15':   { thrust: 300,  centerDistance: 810,  minSpeed: 400, maxSpeed: 1600, capacity: 1.64 },
  'GCHE15':   { thrust: 300,  centerDistance: 810,  minSpeed: 400, maxSpeed: 1600, capacity: 1.64 },
  'GCSE20':   { thrust: 350,  centerDistance: 875,  minSpeed: 400, maxSpeed: 1400, capacity: 2.12 },
  'GCHE20':   { thrust: 350,  centerDistance: 875,  minSpeed: 400, maxSpeed: 1400, capacity: 2.12 },
  'GCSE26':   { thrust: 450,  centerDistance: 960,  minSpeed: 400, maxSpeed: 1200, capacity: 2.825 },
  'GCHE26':   { thrust: 450,  centerDistance: 960,  minSpeed: 400, maxSpeed: 1200, capacity: 2.825 },
  'GCSE33':   { thrust: 550,  centerDistance: 1055, minSpeed: 400, maxSpeed: 1200, capacity: 3.64 },
  'GCHE33':   { thrust: 550,  centerDistance: 1055, minSpeed: 400, maxSpeed: 1200, capacity: 3.64 },
  'GCSE44':   { thrust: 700,  centerDistance: 1185, minSpeed: 400, maxSpeed: 1200, capacity: 5.05 },
  'GCHE44':   { thrust: 700,  centerDistance: 1185, minSpeed: 400, maxSpeed: 1200, capacity: 5.05 },

  // ===== 2GWH系列 (pages 45-46) =====
  '2GWH1060': { thrust: 175,  centerDistance: 1460, minSpeed: 400, maxSpeed: 2000 },
  '2GWH1830': { thrust: 270,  centerDistance: 1760, minSpeed: 400, maxSpeed: 1900 },
  '2GWH3140': { thrust: 300,  centerDistance: 2080, minSpeed: 400, maxSpeed: 1600 },
  '2GWH4100': { thrust: 450,  centerDistance: 2300, minSpeed: 400, maxSpeed: 1600 },
  '2GWH5410': { thrust: 550,  centerDistance: 2560, minSpeed: 400, maxSpeed: 1400 },
  '2GWH7050': { thrust: 750,  centerDistance: 2700, minSpeed: 400, maxSpeed: 1200 },
  '2GWH9250': { thrust: 1000, centerDistance: 3080, minSpeed: 400, maxSpeed: 1200 },

  // ===== HCL系列 (page 49) =====
  'HCL30':    { thrust: null, centerDistance: null, weight: 100, dimensions: '345×310×455' },
  'HCL100':   { thrust: null, centerDistance: null, weight: 156, dimensions: '570×420×535' },
  'HCL250A':  { thrust: null, centerDistance: null, weight: 210, dimensions: '554×425×635' },
  'HCL320':   { thrust: null, centerDistance: null, weight: 210, dimensions: '554×425×635' },
  'HCL600':   { thrust: null, centerDistance: null, weight: 450, dimensions: '746×560×688' },
  'HCL800':   { thrust: null, centerDistance: null, weight: 450, dimensions: '746×560×688' },
  'HCL1000':  { thrust: null, centerDistance: null, weight: 800, dimensions: '915×800×1005' },

  // ===== 中小功率系列 (pages 2-18) =====
  '06':          { thrust: 1.8,  centerDistance: 124, dimensions: '350×316×482',    weight: 58,   minSpeed: 1000, maxSpeed: 2100 },
  '16A':         { thrust: 3.5,  centerDistance: 135, dimensions: '422×325×563',    weight: 84,   minSpeed: 1000, maxSpeed: 2000 },
  '26':          { thrust: 5,    centerDistance: 135, dimensions: '473.5×365×830',  weight: 92,   minSpeed: 1000, maxSpeed: 2500 },
  'MA100':       { thrust: 3,    centerDistance: 100, dimensions: '236×390×420',    weight: 75,   minSpeed: 1500, maxSpeed: 3000 },
  'MA125':       { thrust: 5.5,  centerDistance: 125, dimensions: '291×454×485',    weight: 115,  minSpeed: 1500, maxSpeed: 3000 },
  'MA142':       { thrust: 8.5,  centerDistance: 142, dimensions: '308×520×540',    weight: 140,  minSpeed: 1500, maxSpeed: 2500 },
  'MB170':       { thrust: 16,   centerDistance: 170, dimensions: '510×670×656',    weight: 240,  minSpeed: 1500, maxSpeed: 2500 },
  '120B':        { thrust: 25,   centerDistance: 190, dimensions: '605×744×770',    weight: 400,  minSpeed: 750,  maxSpeed: 1800 },
  '120C':        { thrust: 25,   centerDistance: 180, dimensions: '432×440×650',    weight: 225,  minSpeed: 1000, maxSpeed: 2500 },
  'HCN120':      { thrust: 25,   centerDistance: 180, dimensions: '432×440×650',    weight: 225,  minSpeed: 1000, maxSpeed: 2500 },
  '135':         { thrust: 29.4, centerDistance: 225, dimensions: '578×792×830',    weight: 470,  minSpeed: 750,  maxSpeed: 2000 },
  'HC138':       { thrust: 30,   centerDistance: 225, dimensions: '520×792×760',    weight: 360,  minSpeed: 1000, maxSpeed: 2500 },
  'HCD138':      { thrust: 40,   centerDistance: 296, dimensions: '494×800×870',    weight: 415,  minSpeed: 1000, maxSpeed: 2500 },
  'MB242':       { thrust: 30,   centerDistance: 242, dimensions: '442×774×763',    weight: 385,  minSpeed: 1000, maxSpeed: 2500 },
  'MB270A':      { thrust: 39.2, centerDistance: 270, dimensions: '594×810×868',    weight: 675,  minSpeed: 1000, maxSpeed: 2500 },
  '300':         { thrust: 50,   centerDistance: 264, dimensions: '786×930×864',    weight: 740,  minSpeed: 750,  maxSpeed: 2500 },
  'HC300':       { thrust: 50,   centerDistance: 264, dimensions: '680×930×880',    weight: 680,  minSpeed: 700,  maxSpeed: 2500 },
  'J300':        { thrust: 60,   centerDistance: 264, dimensions: '786×930×864',    weight: 740,  minSpeed: 750,  maxSpeed: 2500 },
  'D300A':       { thrust: 60,   centerDistance: 355, dimensions: '786×1010×1041',  weight: 940,  minSpeed: 1000, maxSpeed: 2500 },
  'T300':        { thrust: 70,   centerDistance: 355, dimensions: '772×980×1106',   weight: 1120, minSpeed: 1000, maxSpeed: 2300 },
  'HC350-1':     { thrust: 50,   centerDistance: 264, dimensions: '604×886×880',    weight: 520,  minSpeed: 750,  maxSpeed: 2500 },
  'HCD350':      { thrust: 50,   centerDistance: 315, dimensions: '610×915×987',    weight: 590,  minSpeed: 750,  maxSpeed: 2500 },
  'HC400':       { thrust: 82,   centerDistance: 264, dimensions: '820×950×890',    weight: 820,  minSpeed: 1000, maxSpeed: 1800 },
  'HCD400A':     { thrust: 82,   centerDistance: 355, dimensions: '820×1010×1070',  weight: 1100, minSpeed: 1000, maxSpeed: 1800 },
  'HCT400A':     { thrust: 82,   centerDistance: 375, dimensions: '800×1052×1182',  weight: 1450, minSpeed: 1000, maxSpeed: 2100 },
  'HCT400A/1':   { thrust: 120,  centerDistance: 465, dimensions: '832×1100×1328',  weight: 1500, minSpeed: 1000, maxSpeed: 2100 },
  'HCD450':      { thrust: 82,   centerDistance: 355, dimensions: '761×984×1040',   weight: 800,  minSpeed: 1000, maxSpeed: 2100 },
  'HC500':       { thrust: 82,   centerDistance: 264, dimensions: '900×897×680',    weight: 800,  minSpeed: 800,  maxSpeed: 2100 },
  'HC600A':      { thrust: 90,   centerDistance: 320, dimensions: '745×1214×1126',  weight: 1300, minSpeed: 1000, maxSpeed: 2100 },
  'HCD600A':     { thrust: 90,   centerDistance: 415, dimensions: '745×1214×1271',  weight: 1550, minSpeed: 1000, maxSpeed: 2100 },
  'HCT600A':     { thrust: 90,   centerDistance: 415, dimensions: '821×1214×1271',  weight: 1650, minSpeed: 1000, maxSpeed: 2100 },
  'HCT600A/1':   { thrust: 140,  centerDistance: 500, dimensions: '878×1224×1346',  weight: 1700, minSpeed: 1000, maxSpeed: 2100 },
  'HCT650/2':    { thrust: 160,  centerDistance: 550, dimensions: '966×1224×1515',  weight: 2230, minSpeed: 1000, maxSpeed: 2100 },
  'HCD700':      { thrust: 90,   centerDistance: 430, dimensions: '741×1182×1186',  weight: 1328, minSpeed: 600,  maxSpeed: 1800 },
  'HCD800':      { thrust: 110,  centerDistance: 450, dimensions: '1056×1280×1341', weight: 2250, minSpeed: 600,  maxSpeed: 2100 },
  'HCT800':      { thrust: 140,  centerDistance: 450, dimensions: '1056×1280×1425', weight: 2500, minSpeed: 600,  maxSpeed: 2100 },
  'HCT800/1':    { thrust: 220,  centerDistance: 582, dimensions: '1152×1360×1557', weight: 3300, minSpeed: 600,  maxSpeed: 2100 },
  'HCT800/2':    { thrust: 220,  centerDistance: 666, dimensions: '1190×1490×1707', weight: 3960, minSpeed: 600,  maxSpeed: 2100 },
  'HCT800/2A':   { thrust: 220,  centerDistance: 666, dimensions: '1190×1490×2041', weight: 4000, minSpeed: 600,  maxSpeed: 1900 },
  'HCT800/3':    { thrust: 240,  centerDistance: 736, dimensions: '1235×1570×1789', weight: 4540, minSpeed: 600,  maxSpeed: 2100 },
  'HC1000':      { thrust: 110,  centerDistance: 335, dimensions: '1082×1120×990',  weight: 1500, minSpeed: 600,  maxSpeed: 2100 },
  'HCD1000':     { thrust: 140,  centerDistance: 450, dimensions: '1082×1280×1345', weight: 2200, minSpeed: 600,  maxSpeed: 2100 },
  'HCT1100':     { thrust: 150,  centerDistance: 500, dimensions: '1150×1350×1547', weight: 3200, minSpeed: 600,  maxSpeed: 1900 },
  'HCW1100':     { thrust: 300,  centerDistance: 625, dimensions: '1567×1630×2550', weight: 6900, minSpeed: 1500, maxSpeed: 1800 },
  'HC1200':      { thrust: 120,  centerDistance: 380, dimensions: '1082×1200×1130', weight: 1870, minSpeed: 600,  maxSpeed: 1900 },
  'HCD1200':     { thrust: 140,  centerDistance: 450, dimensions: '962×1300×1290',  weight: 1850, minSpeed: 700,  maxSpeed: 1900 },
  'HCT1200':     { thrust: 150,  centerDistance: 500, dimensions: '1188×1350×1547', weight: 3200, minSpeed: 600,  maxSpeed: 1900 },
  'HCT1200/1':   { thrust: 220,  centerDistance: 580, dimensions: '1056×1430×1670', weight: 3850, minSpeed: 600,  maxSpeed: 1900 },
  'HCT1280/2':   { thrust: 240,  centerDistance: 680, dimensions: '1290×1520×1775', weight: 4300, minSpeed: 700,  maxSpeed: 1900 },
  'HCD1400':     { thrust: 175,  centerDistance: 485, dimensions: '1260×1380×1360', weight: 2800, minSpeed: 600,  maxSpeed: 1900 },
  'HCT1400':     { thrust: 220,  centerDistance: 550, dimensions: '1306×1380×1750', weight: 3800, minSpeed: 600,  maxSpeed: 1900 },
  'HCT1400/2':   { thrust: 220,  centerDistance: 722, dimensions: '1279×1600×2100', weight: 5500, minSpeed: 600,  maxSpeed: 1900 },
  'HCT1400/5':   { thrust: 190,  centerDistance: 680, dimensions: '1220×1400×1650', weight: 3850, minSpeed: 700,  maxSpeed: 1800 },
  'HCD1500':     { thrust: 175,  centerDistance: 485, dimensions: '1260×1380×1360', weight: 2800, minSpeed: 600,  maxSpeed: 1900 },
  'HCD1580':     { thrust: 175,  centerDistance: 485, dimensions: '1260×1380×1360', weight: 2800, minSpeed: 600,  maxSpeed: 1650 },
  'HC1600':      { thrust: 170,  centerDistance: 415, dimensions: '1345×1500×1300', weight: 3000, minSpeed: 500,  maxSpeed: 1650 },
  'HCD1600':     { thrust: 200,  centerDistance: 520, dimensions: '1291×1620×1590', weight: 4000, minSpeed: 500,  maxSpeed: 1650 },
  'HCT1600':     { thrust: 250,  centerDistance: 585, dimensions: '1246×1500×1750', weight: 5000, minSpeed: 500,  maxSpeed: 1650 },
  'HCT1600/1':   { thrust: 270,  centerDistance: 680, dimensions: '1280×1704×2040', weight: 5500, minSpeed: 500,  maxSpeed: 1650 },
  'HC2000':      { thrust: 190,  centerDistance: 450, dimensions: '1600×1500×1400', weight: 3700, minSpeed: 600,  maxSpeed: 1500 },
  'HCD2000':     { thrust: 220,  centerDistance: 560, dimensions: '1600×1620×1645', weight: 4200, minSpeed: 600,  maxSpeed: 1500 },
  'HCT2000':     { thrust: 270,  centerDistance: 625, dimensions: '1284×1600×1835', weight: 5600, minSpeed: 600,  maxSpeed: 1500 },
  'HCT2000/1':   { thrust: 340,  centerDistance: 690, dimensions: '1500×1760×2010', weight: 7000, minSpeed: 600,  maxSpeed: 1500 },
  'HC2400':      { thrust: 240,  centerDistance: 470, dimensions: '1350×1520×1370', weight: 4000 },
  'HCD2400':     { thrust: 250,  centerDistance: 580, dimensions: '1450×1720×1670', weight: 4300 },
  'HC2700':      { thrust: 270,  centerDistance: 490, dimensions: '1613×1670×1650', weight: 4700, minSpeed: 500,  maxSpeed: 1600 },
  'HCD2700':     { thrust: 280,  centerDistance: 630, dimensions: '1400×1780×1530', weight: 4930, minSpeed: 500,  maxSpeed: 1600 },
  'HCT2700':     { thrust: 340,  centerDistance: 680, dimensions: '1900×2000×1970', weight: 7200, minSpeed: 500,  maxSpeed: 1600 },
  'HCT2700/1':   { thrust: 450,  centerDistance: 800, dimensions: '1900×2250×1950', weight: 9000, minSpeed: 500,  maxSpeed: 1600 },
  'HCT3800':     { thrust: 450,  centerDistance: 720, dimensions: '1681×1750×2100', weight: 10500, minSpeed: 500, maxSpeed: 1200 },
  'HCD3800':     { thrust: 340,  centerDistance: 660, dimensions: '1665×1810×1800', minSpeed: 500,  maxSpeed: 1200 },

  // ===== 轻型高速系列 (pages 19-24) =====
  'HC038A':      { thrust: 9,    centerDistance: 115, dimensions: '392×480×480',    weight: 70,   minSpeed: 1500, maxSpeed: 3200 },
  'HC65':        { thrust: 14.7, centerDistance: 142, dimensions: '351×380×544',    weight: 130,  minSpeed: 1000, maxSpeed: 2500 },
  'HCQ100':      { thrust: 16,   centerDistance: 146, dimensions: '546×551×656',    weight: 150,  minSpeed: 1000, maxSpeed: 3500 },
  'MV100A':      { thrust: 20,   centerDistance: 0,   dimensions: '485×508×580',    weight: 220,  minSpeed: 1000, maxSpeed: 3000 },
  'HCV120':      { thrust: 25,   centerDistance: 393, dimensions: '502×600×847',    weight: 300,  minSpeed: 1000, maxSpeed: 2500 },
  'HCQ138':      { thrust: 25,   centerDistance: 165, dimensions: '504×619×616',    weight: 240,  minSpeed: 1000, maxSpeed: 2600 },
  'HCA138':      { thrust: 25,   centerDistance: 185, dimensions: '530×660×616',    weight: 200,  minSpeed: 1000, maxSpeed: 2600 },
  'HC200':       { thrust: 27.5, centerDistance: 190, dimensions: '424×792×754',    weight: 280,  minSpeed: 1000, maxSpeed: 2200 },
  'HC201':       { thrust: 30,   centerDistance: 205, dimensions: '488×691×758',    weight: 350,  minSpeed: 1000, maxSpeed: 2500 },
  'HCV230':      { thrust: 27.5, centerDistance: 480, dimensions: '568×820×1020',   weight: 450,  minSpeed: 1000, maxSpeed: 2000 },
  'HCQ300':      { thrust: 40,   centerDistance: 203, dimensions: '630×521×680',    weight: 370,  minSpeed: 1000, maxSpeed: 2300 },
  'HCA300':      { thrust: 40,   centerDistance: 278, dimensions: '620×585×753',    weight: 370,  minSpeed: 1000, maxSpeed: 2300 },
  'HCQ401':      { thrust: 50,   centerDistance: 220, dimensions: '640×900×800',    weight: 552,  minSpeed: 1000, maxSpeed: 2300 },
  'HCQ402':      { thrust: 50,   centerDistance: 285, dimensions: '611×890×1080',   weight: 650,  minSpeed: 1000, maxSpeed: 2300 },
  'HCQ501':      { thrust: 55,   centerDistance: 235, dimensions: '742×856×950',    weight: 570,  minSpeed: 1000, maxSpeed: 2300 },
  'HCQ502':      { thrust: 60,   centerDistance: 264, dimensions: '742×856×980',    weight: 700,  minSpeed: 1000, maxSpeed: 2300 },
  'HCQ700':      { thrust: 90,   centerDistance: 290, dimensions: '898×1104×1066',  weight: 980,  minSpeed: 1000, maxSpeed: 2500 },
  'HCQH700':     { thrust: 90,   centerDistance: 290, dimensions: '895×1104×1100',  weight: 920,  minSpeed: 1000, maxSpeed: 2500 },
  'HCQ701':      { thrust: 95,   centerDistance: 340, dimensions: '868×1104×1146',  minSpeed: 1000, maxSpeed: 2500 },
  'HCA700':      { thrust: 90,   dimensions: '835×1104×1156',  weight: 1100, minSpeed: 1000, maxSpeed: 2500 },
  'HCQ1000':     { thrust: 100,  centerDistance: 310, dimensions: '994×1104×985',   weight: 1100, minSpeed: 1000, maxSpeed: 2300 },
  'HCA1000':     { thrust: null, centerDistance: null, minSpeed: 1000, maxSpeed: 2300 },
  'HCA1400':     { thrust: 110,  centerDistance: 340, minSpeed: 1000, maxSpeed: 2100 },
  'HCQH1600':    { thrust: 120,  centerDistance: 340, minSpeed: 1000, maxSpeed: 2100 },
  'HCQ1601':     { thrust: 120,  centerDistance: 370, minSpeed: 1000, maxSpeed: 2100 },

  // ===== 铝合金系列 (pages 25-28) =====
  'HCG1068':     { thrust: 14,   centerDistance: 127, weight: 46,   minSpeed: 1500, maxSpeed: 4000 },
  'HCAG1090':    { thrust: 16,   centerDistance: 160, weight: 106,  minSpeed: 1500, maxSpeed: 4500 },
  'HCG1220':     { thrust: 16,   centerDistance: 135, weight: 63,   minSpeed: 1500, maxSpeed: 4500 },
  'HCG1280-1':   { thrust: 16,   centerDistance: 146, weight: 73,   minSpeed: 1500, maxSpeed: 3600 },
  'HCM165':      { thrust: null, centerDistance: 146, weight: 130.5, minSpeed: 1500, maxSpeed: 3600 },
  'HCG1305-3':   { thrust: 25,   centerDistance: 155, weight: 120,  minSpeed: 1500, maxSpeed: 3000 },
  'HCM303':      { thrust: null, centerDistance: 190, weight: 290,  minSpeed: 1000, maxSpeed: 2100 },
  'HCAM303':     { thrust: null, centerDistance: 180.2, weight: 290, minSpeed: 1000, maxSpeed: 2300 },
  'HCM403':      { thrust: null, centerDistance: 200, weight: 390,  minSpeed: 1000, maxSpeed: 2300 },
  'HCAM403':     { thrust: null, centerDistance: 199.3, weight: 390, minSpeed: 1000, maxSpeed: 2300 },
  'HCG1400':     { thrust: 27.5, centerDistance: 175, weight: 160,  minSpeed: 1500, maxSpeed: 3000 },
  'HCG1500':     { thrust: 40,   centerDistance: 180, weight: 185,  minSpeed: 1500, maxSpeed: 3000 },
  'HCG1665':     { thrust: 40,   centerDistance: 200, weight: 248,  minSpeed: 1500, maxSpeed: 3000 },
  'HCG2050':     { thrust: 40,   centerDistance: 220, weight: 342,  minSpeed: 1500, maxSpeed: 2600 },
  'HCG3050':     { thrust: 50,   centerDistance: 255, weight: 570,  minSpeed: 1000, maxSpeed: 2600 },
  'HCAG5050':    { thrust: 110,  centerDistance: 369, weight: 870,  minSpeed: 1500, maxSpeed: 2500 },
  'HCG5050':     { thrust: 110,  centerDistance: 340, weight: 950,  minSpeed: 1500, maxSpeed: 2500 },
  'HCG6400':     { thrust: 110,  centerDistance: 340, weight: 950,  minSpeed: 1600, maxSpeed: 2100 },
  'HCG7650':     { thrust: 135,  centerDistance: 340, weight: 1230, minSpeed: 1000, maxSpeed: 2100 },
  'HCAG7650':    { thrust: 135,  centerDistance: 448, weight: 1300, minSpeed: 1000, maxSpeed: 2100 },
  'HCG9060':     { thrust: 225,  centerDistance: 390, weight: 1575, minSpeed: 1000, maxSpeed: 2100 },
  'HCAG9055':    { thrust: 225,  centerDistance: 469.4, weight: 1570, minSpeed: 1000, maxSpeed: 2100 },

  // ===== GWC系列 (pages 29-32) =====
  'GWC28.30':    { thrust: 80,   minSpeed: 400, maxSpeed: 2000 },
  'GWC30.32':    { thrust: 100,  minSpeed: 400, maxSpeed: 2000 },
  'GWC36.39':    { thrust: 140,  minSpeed: 400, maxSpeed: 1900 },
  'GWC39.41':    { thrust: 175,  minSpeed: 400, maxSpeed: 1700 },
  'GWC42.45':    { thrust: 220,  minSpeed: 400, maxSpeed: 1600 },
  'GWC45.49':    { thrust: 270,  minSpeed: 400, maxSpeed: 1600 },
  'GWC49.54':    { thrust: 290,  minSpeed: 400, maxSpeed: 1400 },
  'GWC49.59':    { thrust: 290,  minSpeed: 400, maxSpeed: 1200 },
  'GWC52.59':    { thrust: 300,  minSpeed: 400, maxSpeed: 1200 },
  'GWC52.62':    { thrust: 300,  minSpeed: 400, maxSpeed: 1200 },
  'GWC60.66':    { thrust: 450,  minSpeed: 400, maxSpeed: 1200 },
  'GWC60.74':    { thrust: 550,  minSpeed: 400, maxSpeed: 1200 },
  'GWC63.71':    { thrust: 710,  minSpeed: 300, maxSpeed: 1200 },
  'GWC66.75':    { thrust: 730,  minSpeed: 300, maxSpeed: 950 },
  'GWC70.76':    { thrust: 750,  minSpeed: 300, maxSpeed: 950 },
  'GWC70.82':    { thrust: 780,  minSpeed: 300, maxSpeed: 1150 },
  'GWC70.85':    { thrust: 800,  minSpeed: 300, maxSpeed: 950 },
  'GWC75.90':    { thrust: 980,  minSpeed: 200, maxSpeed: 950 },
  'GWC78.88':    { thrust: 1000, minSpeed: 300, maxSpeed: 950 },
  'GWC78.96':    { thrust: 1100, minSpeed: 200, maxSpeed: 900 },
  'GWC80.95':    { thrust: 1200, minSpeed: 200, maxSpeed: 800 },
  'GWC85.100':   { thrust: 1400, minSpeed: 150, maxSpeed: 1425 },

  // ===== GWS系列 (pages 33-34) =====
  'GWS28.30':    { thrust: 80,   minSpeed: 400, maxSpeed: 1800 },
  'GWS30.32A':   { thrust: 100,  minSpeed: 400, maxSpeed: 1800 },
  'GWS32.35':    { thrust: 120,  minSpeed: 400, maxSpeed: 1800 },
  'GWS36.39':    { thrust: 140,  minSpeed: 400, maxSpeed: 1800 },
  'GWS39.41':    { thrust: 175,  minSpeed: 400, maxSpeed: 1600 },
  'GWS42.45':    { thrust: 220,  minSpeed: 400, maxSpeed: 1600 },
  'GWS45.49':    { thrust: 270,  minSpeed: 400, maxSpeed: 1400 },
  'GWS45.68':    { thrust: 360,  minSpeed: 400, maxSpeed: 1200 },
  'GWS49.54':    { thrust: 290,  minSpeed: 400, maxSpeed: 1200 },
  'GWS49.61':    { thrust: 290,  minSpeed: 400, maxSpeed: 1200 },
  'GWS49.74':    { thrust: 540,  minSpeed: 400, maxSpeed: 1200 },
  'GWS52.59':    { thrust: 300,  minSpeed: 400, maxSpeed: 1200 },
  'GWS52.71':    { thrust: 540,  minSpeed: 400, maxSpeed: 1200 },
  'GWS52.82':    { thrust: 640,  minSpeed: 400, maxSpeed: 1200 },
  'GWS60.66':    { thrust: 450,  minSpeed: 400, maxSpeed: 1200 },
  'GWS63.71':    { thrust: 710,  minSpeed: 300, maxSpeed: 1000 },
  'GWS63.95':    { thrust: null },
  'GWS66.75':    { thrust: 730,  minSpeed: 300, maxSpeed: 950 },
  'GWS66.106':   { thrust: 980 },
  'GWS70.76':    { thrust: 750,  minSpeed: 300, maxSpeed: 900 },
  'GWS70.82':    { thrust: 780,  minSpeed: 300, maxSpeed: 900 },
  'GWS70.111':   { thrust: 1200, minSpeed: 200, maxSpeed: 900 },
};

// ===== 已知字段偏移的系列前缀 =====
const SHIFTED_SERIES = ['HCS', 'HCDS', 'HCTS', 'SGWS', 'SGWL'];
// SGW (非S/L后缀) 也有偏移但结构略不同

function isShiftedModel(model) {
  // 匹配 HCS/HCDS/HCTS/SGWS/SGWL 开头
  for (const prefix of SHIFTED_SERIES) {
    if (model.startsWith(prefix)) return true;
  }
  // SGW非S/L后缀 (如 SGW30.32, SGW39.41)
  if (model.startsWith('SGW') && !model.startsWith('SGWS') && !model.startsWith('SGWL') && !model.startsWith('SGWC')) {
    return true;
  }
  return false;
}

function loadCompleteData() {
  const filePath = path.join(__dirname, '..', 'src', 'data', 'completeGearboxData.js');
  let content = fs.readFileSync(filePath, 'utf-8');

  // 提取JSON数组
  const match = content.match(/export\s+const\s+completeGearboxData\s*=\s*(\[[\s\S]*\]);?\s*$/);
  if (!match) throw new Error('Cannot parse completeGearboxData.js');

  return JSON.parse(match[1]);
}

function audit(data) {
  const issues = [];
  let shiftedCount = 0;
  let otherIssues = 0;

  for (const gearbox of data) {
    const model = gearbox.model;
    const ref = PDF_REFERENCE[model];

    // 检查1: 字段偏移检测 (不需要PDF参考数据)
    if (isShiftedModel(model)) {
      const currentThrust = gearbox.thrust;
      const currentCenter = gearbox.centerDistance;
      const currentDim = gearbox.dimensions;

      // 偏移检测: thrust值很小(像capacity) 且 centerDistance像推力
      if (currentThrust !== undefined && currentThrust < 20 && currentCenter > 20) {
        shiftedCount++;

        // 确定正确值
        let correctThrust = currentCenter; // centerDistance字段存的是真正的推力
        let correctCenter = null;

        // 如果dimensions是纯数字,那就是真正的中心距
        if (currentDim && /^\d+$/.test(String(currentDim).trim())) {
          correctCenter = parseInt(currentDim);
        }

        // 用PDF数据覆盖(如果有)
        if (ref) {
          if (ref.thrust !== null) correctThrust = ref.thrust;
          if (ref.centerDistance !== null) correctCenter = ref.centerDistance;
        }

        // SGW非S模型(如SGW30.32)的dimensions是真实尺寸,不能清空
        const isSgwNonS = model.startsWith('SGW') && !model.startsWith('SGWS') && !model.startsWith('SGWL');
        const dimHasRealValue = currentDim && currentDim.includes('×');
        const newDim = dimHasRealValue ? currentDim : '';

        issues.push({
          model,
          type: 'FIELD_SHIFT',
          severity: 'P0',
          details: `thrust: ${currentThrust}→${correctThrust}, centerDistance: ${currentCenter}→${correctCenter || 'N/A'}, dimensions: "${currentDim}"→"${newDim}"`,
          fix: {
            thrust: correctThrust,
            centerDistance: correctCenter,
            dimensions: newDim
          }
        });
      }
    }

    // 检查2: 与PDF参考数据对比 (非偏移型号)
    if (ref && !isShiftedModel(model)) {
      // 推力
      if (ref.thrust !== null && gearbox.thrust !== undefined) {
        if (Math.abs(gearbox.thrust - ref.thrust) > 0.5) {
          issues.push({
            model, type: 'THRUST_MISMATCH', severity: 'P1',
            details: `thrust: ${gearbox.thrust} → ${ref.thrust}`,
            fix: { thrust: ref.thrust }
          });
          otherIssues++;
        }
      }

      // 中心距
      if (ref.centerDistance !== null && gearbox.centerDistance !== undefined) {
        if (Math.abs(gearbox.centerDistance - ref.centerDistance) > 1) {
          issues.push({
            model, type: 'CENTER_MISMATCH', severity: 'P1',
            details: `centerDistance: ${gearbox.centerDistance} → ${ref.centerDistance}`,
            fix: { centerDistance: ref.centerDistance }
          });
          otherIssues++;
        }
      }

      // 重量
      if (ref.weight !== undefined && gearbox.weight !== undefined) {
        if (Math.abs(gearbox.weight - ref.weight) > 5) {
          issues.push({
            model, type: 'WEIGHT_MISMATCH', severity: 'P2',
            details: `weight: ${gearbox.weight} → ${ref.weight}`,
            fix: { weight: ref.weight }
          });
          otherIssues++;
        }
      }

      // 尺寸
      if (ref.dimensions !== undefined && gearbox.dimensions !== undefined) {
        if (String(gearbox.dimensions).trim() !== String(ref.dimensions).trim() && ref.dimensions !== '') {
          issues.push({
            model, type: 'DIMENSIONS_MISMATCH', severity: 'P2',
            details: `dimensions: "${gearbox.dimensions}" → "${ref.dimensions}"`,
            fix: { dimensions: ref.dimensions }
          });
          otherIssues++;
        }
      }

      // 转速范围
      if (ref.minSpeed !== undefined) {
        if (gearbox.minSpeed !== ref.minSpeed) {
          issues.push({
            model, type: 'SPEED_MISMATCH', severity: 'P1',
            details: `minSpeed: ${gearbox.minSpeed} → ${ref.minSpeed}`,
            fix: { minSpeed: ref.minSpeed }
          });
          otherIssues++;
        }
        if (gearbox.maxSpeed !== ref.maxSpeed) {
          issues.push({
            model, type: 'SPEED_MISMATCH', severity: 'P1',
            details: `maxSpeed: ${gearbox.maxSpeed} → ${ref.maxSpeed}`,
            fix: { maxSpeed: ref.maxSpeed }
          });
          otherIssues++;
        }
      }
    }
  }

  return { issues, shiftedCount, otherIssues };
}

function applyFixes(data, issues) {
  const fixMap = {};
  for (const issue of issues) {
    if (!fixMap[issue.model]) fixMap[issue.model] = {};
    Object.assign(fixMap[issue.model], issue.fix);
  }

  let fixedCount = 0;
  for (const gearbox of data) {
    const fixes = fixMap[gearbox.model];
    if (fixes) {
      for (const [key, value] of Object.entries(fixes)) {
        if (value !== undefined) {
          // null表示未知,对于centerDistance设为0,对于dimensions设为''
          if (value === null) {
            if (key === 'centerDistance') gearbox[key] = 0;
            else if (key === 'dimensions') gearbox[key] = '';
            // thrust为null时不修改
          } else {
            gearbox[key] = value;
          }
        }
      }
      fixedCount++;
    }
  }

  return fixedCount;
}

function saveData(data) {
  const filePath = path.join(__dirname, '..', 'src', 'data', 'completeGearboxData.js');
  const content = `export const completeGearboxData = ${JSON.stringify(data, null, 8)};\n`;
  fs.writeFileSync(filePath, content, 'utf-8');
}

// ===== 主流程 =====
const args = process.argv.slice(2);
const doFix = args.includes('--fix');

console.log('=== PDF手册自动审计 ===');
console.log(`数据源: 杭齿厂选型手册2025版5月版.pdf (58页)`);
console.log(`参考型号数: ${Object.keys(PDF_REFERENCE).length}`);
console.log(`模式: ${doFix ? '审计+修复' : '仅审计'}\n`);

const data = loadCompleteData();
console.log(`加载型号总数: ${data.length}`);

const { issues, shiftedCount, otherIssues } = audit(data);

// 输出报告
console.log(`\n===== 审计结果 =====`);
console.log(`字段偏移(P0): ${shiftedCount} 个型号`);
console.log(`其他差异: ${otherIssues} 处`);
console.log(`总问题数: ${issues.length}\n`);

// 按类型分组输出
const byType = {};
for (const issue of issues) {
  if (!byType[issue.type]) byType[issue.type] = [];
  byType[issue.type].push(issue);
}

for (const [type, typeIssues] of Object.entries(byType)) {
  console.log(`\n--- ${type} (${typeIssues.length}处) ---`);
  for (const issue of typeIssues) {
    console.log(`  [${issue.severity}] ${issue.model}: ${issue.details}`);
  }
}

if (doFix && issues.length > 0) {
  console.log(`\n===== 执行修复 =====`);
  const fixedCount = applyFixes(data, issues);
  saveData(data);
  console.log(`已修复 ${fixedCount} 个型号, 共 ${issues.length} 处问题`);
  console.log(`文件已保存: src/data/completeGearboxData.js`);
} else if (issues.length > 0) {
  console.log(`\n使用 --fix 参数执行修复: node scripts/pdf-audit-fix.js --fix`);
}
