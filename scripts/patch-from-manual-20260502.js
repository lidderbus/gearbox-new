#!/usr/bin/env node
/**
 * patch-from-manual-20260502.js
 * 按《杭齿厂选型手册2025年5月版》校准 completeGearboxData.js + embeddedData.js
 *
 * 数据来源: PDF 全 32 页视觉读取 (来自 conversation 2026-05-02)
 * 字段: centerDistance(mm), weight(kg), thrust(kN), [minSpeed,maxSpeed]
 *
 * 策略:
 *   1. 备份: completeGearboxData.js / embeddedData.js  (deploy 前已做)
 *   2. 按 manualPatch 逐型号修正 complete (权威源)
 *   3. 按 embeddedPatch 修复 embedded 字段错位 + 补缺
 *   4. 输出修复明细
 *
 * 注意:
 *   - 单位: GW 族系手册重量单位 t, 已 ×1000 转 kg
 *   - HCS/HCDS/HCTS/SGWS embedded 中 cd 字段实存 thrust, thr 字段实存 capacity → 整体重写
 *   - 手册"中心距"列空 (HCA700/HCA1000 等斜置型号) 不强制覆盖, 保留系统值
 */

const fs = require('fs');
const path = require('path');

// ===== 手册基准 (来自 /tmp/manual_baseline.py 同步) =====
const M = {
  // 中小功率系列
  '06':       {cd:124, wt:58,  thr:1.8,  speed:[1000,2100]},
  '16A':      {cd:135, wt:84,  thr:3.5,  speed:[1000,2000]},
  '26':       {cd:135, wt:92,  thr:5,    speed:[1000,2500]},
  'MA100':    {cd:100, wt:75,  thr:3,    speed:[1500,3000]},
  'MA125':    {cd:125, wt:115, thr:5.5,  speed:[1500,3000]},
  'MA142':    {cd:142, wt:140, thr:8.5,  speed:[1500,2500]},
  '40A':      {cd:142, wt:225, thr:8.8,  speed:[750,2000]},
  'MB170':    {cd:170, wt:240, thr:16,   speed:[1500,2500]},
  '120B':     {cd:190, wt:400, thr:25,   speed:[750,1800]},
  '120C':     {cd:180, wt:225, thr:25,   speed:[1000,2500]},
  'HCN120':   {cd:180, wt:225, thr:25,   speed:[1000,2500]},
  '135':      {cd:225, wt:470, thr:29.4, speed:[750,2000]},
  'HC138':    {cd:225, wt:360, thr:30,   speed:[1000,2500]},
  'HCD138':   {cd:296, wt:415, thr:40,   speed:[1000,2500]},
  'MB242':    {cd:242, wt:385, thr:30,   speed:[1000,2500]},
  'MB270A':   {cd:270, wt:675, thr:39.2, speed:[1000,2500]},
  '300':      {cd:264, wt:740, thr:50,   speed:[750,2500]},
  'HC300':    {cd:264, wt:680, thr:50,   speed:[700,2500]},
  'J300':     {cd:264, wt:740, thr:50,   speed:[750,2500]},
  'D300A':    {cd:355, wt:940, thr:60,   speed:[1000,2500]},
  'T300':     {cd:355, wt:1120, thr:70,  speed:[1000,2300]},
  'T300/1':   {cd:355, wt:1120, thr:70,  speed:[1000,2300]},
  'HC350-1':  {cd:264, wt:520, thr:50,   speed:[750,2500]},
  'HCD350':   {cd:315, wt:590, thr:50,   speed:[750,2500]},
  'HC400':    {cd:264, wt:820, thr:82,   speed:[1000,1800]},
  'HCD400A':  {cd:355, wt:1100, thr:82,  speed:[1000,1800]},
  'HCT400A':  {cd:375, wt:1450, thr:82,  speed:[1000,2100]},
  'HCT400A/1':{cd:465, wt:1500, thr:120, speed:[1000,2100]},
  'HCD450':   {cd:355, wt:800, thr:82,   speed:[1000,2100]},
  'HC500':    {cd:264, wt:800, thr:82,   speed:[800,2100]},
  'HC600A':   {cd:320, wt:1300, thr:90,  speed:[1000,2100]},
  'HCD600A':  {cd:415, wt:1550, thr:90,  speed:[1000,2100]},
  'HCT600A':  {cd:415, wt:1650, thr:90,  speed:[1000,2100]},
  'HCT600A/1':{cd:500, wt:1700, thr:140, speed:[1000,2100]},
  'HCT650/2': {cd:550, wt:2230, thr:160, speed:[1000,2100]},
  'HCD700':   {cd:430, wt:1328, thr:90,  speed:[600,1800]},
  'HCD800':   {cd:450, wt:2250, thr:110, speed:[600,2100]},
  'HCT800':   {cd:450, wt:2500, thr:140, speed:[600,2100]},
  'HCT800/1': {cd:582, wt:3300, thr:220, speed:[600,2100]},
  'HCT800/2': {cd:666, wt:3960, thr:220, speed:[600,2100]},
  'HCT800/2A':{cd:666, wt:4000, thr:220, speed:[600,1900]},
  'HCT800/3': {cd:736, wt:4540, thr:240, speed:[600,2100]},
  'HC1000':   {cd:335, wt:1500, thr:110, speed:[600,2100]},
  'HCD1000':  {cd:450, wt:2200, thr:140, speed:[600,2100]},
  'HCT1100':  {cd:500, wt:3200, thr:150, speed:[600,1900]},
  'HCW1100':  {cd:625, wt:6900, thr:300, speed:[1500,1800]},
  'HC1200':   {cd:380, wt:1870, thr:120, speed:[600,1900]},
  'HCD1200':  {cd:450, wt:1850, thr:140, speed:[700,1900]},
  'HC1200/1': {cd:450, wt:2500, thr:140, speed:[600,1900]},
  'HCT1200':  {cd:500, wt:3200, thr:150, speed:[600,1900]},
  'HCT1200/1':{cd:580, wt:3850, thr:220, speed:[600,1900]},
  'HCT1280/2':{cd:680, wt:4300, thr:240, speed:[700,1900]},
  'HCD1400':  {cd:485, wt:2800, thr:175, speed:[600,1900]},
  'HCT1400':  {cd:550, wt:3800, thr:220, speed:[600,1900]},
  'HCT1400/2':{cd:722, wt:5500, thr:220, speed:[600,1900]},
  'HCT1400/5':{cd:680, wt:3850, thr:190, speed:[700,1800]},
  'HCD1500':  {cd:485, wt:2800, thr:175, speed:[600,1900]},
  'HCD1580':  {cd:485, wt:2800, thr:175, speed:[600,1650]},
  'HC1600':   {cd:415, wt:3000, thr:170, speed:[500,1650]},
  'HCD1600':  {cd:520, wt:4000, thr:200, speed:[500,1650]},
  'HCT1600':  {cd:585, wt:5000, thr:250, speed:[500,1650]},
  'HCT1600/1':{cd:680, wt:5500, thr:270, speed:[500,1650]},
  'HC2000':   {cd:450, wt:3700, thr:190, speed:[600,1500]},
  'HCD2000':  {cd:560, wt:4200, thr:220, speed:[600,1500]},
  'HCT2000':  {cd:625, wt:5600, thr:270, speed:[600,1500]},
  'HCT2000/1':{cd:690, wt:7000, thr:340, speed:[600,1500]},
  'HC2400':   {cd:470, wt:4000, thr:240, speed:[600,1500]},
  'HCD2400':  {cd:580, wt:4300, thr:250, speed:[600,1600]},
  'HC2700':   {cd:490, wt:4700, thr:270, speed:[500,1600]},
  'HCD2700':  {cd:630, wt:4930, thr:280, speed:[500,1600]},
  'HCT2700':  {cd:680, wt:7200, thr:340, speed:[500,1600]},
  'HCT2700/1':{cd:800, wt:9000, thr:450, speed:[500,1600]},
  'HCD3800':  {cd:660, thr:340, speed:[500,1200]},  // 手册无 wt
  'HCT3800':  {cd:720, wt:10500, thr:450, speed:[500,1200]},
  // 轻型高速
  'HC038A':   {cd:115, wt:70, thr:9, speed:[1500,3200]},
  'HC65':     {cd:142, wt:130, thr:14.7, speed:[1000,2500]},
  'HCQ100':   {cd:146, wt:150, thr:16, speed:[1000,3500]},
  'MV100A':   {cd:0, wt:220, thr:20, speed:[1000,3000]},  // 倾角型 cd=0
  'HCV120':   {cd:393, wt:300, thr:25, speed:[1000,2500]},
  'HCQ138':   {cd:165, wt:240, thr:25, speed:[1000,2600]},
  'HCA138':   {cd:185, wt:260, thr:25, speed:[1000,2600]},
  'HC200':    {cd:190, wt:280, thr:27.5, speed:[1000,2200]},
  'HC201':    {cd:205, wt:350, thr:30, speed:[1000,2500]},
  'HCV230':   {cd:480, wt:450, thr:27.5, speed:[1000,2200]},
  'HCQ300':   {cd:203, wt:370, thr:40, speed:[1000,2300]},
  'HCA300':   {cd:278, wt:370, thr:40, speed:[1000,2300]},
  'HCA301':   {cd:265, wt:370, thr:40, speed:[1000,2300]},
  'HCA302':   {cd:267.5, thr:40, speed:[1000,2300]},
  'HCQ401':   {cd:220, wt:552, thr:50, speed:[1000,2300]},
  'HCQ402':   {cd:285, wt:650, thr:50, speed:[1000,2300]},
  'HCQ501':   {cd:235, wt:570, thr:55, speed:[1000,2300]},
  'HCQ502':   {cd:264, wt:700, thr:60, speed:[1000,2300]},
  'HCQ700':   {cd:290, wt:980, thr:90, speed:[1000,2500]},
  'HCQH700':  {cd:290, wt:920, thr:90, speed:[1000,2500]},
  'HCQ701':   {cd:340, wt:1100, thr:95, speed:[1000,2500]},
  'HCA700':   {wt:1100, speed:[1000,2500]},  // cd 列空, 不覆盖
  'HCA701':   {wt:1035, thr:27.5, speed:[1000,2500]},
  'HCQ1000':  {cd:310, wt:1100, thr:100, speed:[1000,2300]},
  'HCA1000':  {wt:1050, speed:[1000,2300]},
  'HCQ1001':  {cd:335, wt:1100, thr:110, speed:[1000,2300]},
  'HCQ1400':  {cd:340, wt:1430, thr:110, speed:[1000,2100]},
  'HCA1400':  {wt:1600, thr:110, speed:[1600,2100]},
  'HCA1401':  {wt:1600, thr:110, speed:[1000,2100]},
  'HCQH1600': {cd:340, wt:1500, thr:120, speed:[1000,2100]},
  'HCQ1600':  {cd:340, wt:1500, thr:120, speed:[1000,2100]},
  'HCQ1601':  {cd:370, wt:1550, thr:120, speed:[1000,2100]},
  // 铝合金箱体
  'HCG1068':  {cd:127, wt:46, thr:14, speed:[1500,4000]},
  'HCAG1090': {cd:160, wt:106, thr:16, speed:[1500,4500]},
  'HCG1220':  {cd:135, wt:63, thr:16, speed:[1500,4500]},
  'HCG1280-1':{cd:146, wt:73, thr:16, speed:[1500,3600]},
  'HCM165':   {cd:146, wt:130.5, speed:[1500,3600]},
  'HCG1305-3':{cd:135, wt:120, thr:25, speed:[1500,3000]},
  'HCNM280T': {cd:180, wt:260, speed:[1000,2100]},
  'HCM303':   {cd:190, wt:290, speed:[1000,2100]},
  'HCAM303':  {cd:180.2, wt:290, speed:[1000,2300]},
  'HCM403':   {cd:200, wt:390, speed:[1000,2300]},
  'HCAM403':  {cd:199.3, wt:390, speed:[1000,2300]},
  'HCG1400':  {cd:175, wt:160, thr:27.5, speed:[1500,3000]},
  'HCG1500':  {cd:180, wt:185, thr:40, speed:[1500,3000]},
  'HCG1665':  {cd:200, wt:248, thr:40, speed:[1500,3000]},
  'HCG2050':  {cd:220, wt:342, thr:50, speed:[1500,2600]},
  'HCG3050':  {cd:255, wt:570, thr:50, speed:[1500,2600]},
  'HCAG3050': {cd:326, wt:570, thr:50, speed:[1000,2600]},
  'HCVG3710': {cd:331.34, wt:600, thr:90, speed:[1000,2500]},
  'HCAG5050': {cd:369, wt:870, thr:110, speed:[1500,2500]},
  'HCG5050':  {cd:340, wt:950, thr:110, speed:[1500,2500]},
  'HCG6400':  {cd:340, wt:950, thr:110, speed:[1600,2100]},
  'HCAG6400': {cd:340, wt:1200, thr:110, speed:[1600,2100]},
  'HCG7650':  {cd:340, wt:1230, thr:135, speed:[1000,2100]},
  'HCAG7650': {cd:448, wt:1300, thr:135, speed:[1000,2100]},
  'HCG9060':  {cd:390, wt:1575, thr:225, speed:[1000,2100]},
  'HCAG9055': {cd:469.4, wt:1570, thr:225, speed:[1000,2100]},
  // GW 族系 — 仅 thr/wt/speed (cd 手册未给, 跳过)
  'GWC28.30':{wt:1230, thr:80, speed:[400,2000]},
  'GWL28.30':{wt:1070, thr:80, speed:[400,2000]},
  'GWC30.32':{wt:1460, thr:100, speed:[400,2000]},
  'GWL30.32':{wt:1240, thr:100, speed:[400,2000]},
  'GWC32.35':{wt:2490, thr:120, speed:[400,2000]},
  'GWL32.35':{wt:2240, thr:120, speed:[400,2000]},
  'GWC36.39':{wt:3200, thr:140, speed:[400,1900]},
  'GWL36.39':{wt:2700, thr:140, speed:[400,1900]},
  'GWC39.41':{wt:3980, thr:175, speed:[400,1700]},
  'GWL39.41':{wt:3550, thr:175, speed:[400,1700]},
  'GWC42.45':{wt:4700, thr:220, speed:[400,1600]},
  'GWL42.45':{wt:4190, thr:220, speed:[400,1600]},
  'GWC45.49':{wt:6030, thr:270, speed:[400,1600]},
  'GWL45.49':{wt:5350, thr:270, speed:[400,1600]},
  'GWC45.52':{wt:6500, thr:270, speed:[400,1400]},
  'GWL45.52':{wt:6500, thr:270, speed:[400,1400]},
  'GWC49.54':{wt:7900, thr:290, speed:[400,1400]},
  'GWL49.54':{wt:7000, thr:290, speed:[400,1400]},
  'GWC49.59':{wt:8500, thr:290, speed:[400,1200]},
  'GWL49.59':{wt:8500, thr:290, speed:[400,1200]},
  'GWC52.59':{wt:10700, thr:300, speed:[400,1200]},
  'GWL52.59':{wt:8955, thr:300, speed:[400,1200]},
  'GWC52.62':{wt:11000, thr:300, speed:[400,1200]},
  'GWL52.62':{wt:9300, thr:300, speed:[400,1200]},
  'GWC60.66':{wt:14690, thr:450, speed:[400,1200]},
  'GWL60.66':{wt:13290, thr:450, speed:[400,1200]},
  'GWC60.74':{wt:16600, thr:550, speed:[400,1200]},
  'GWL60.74':{wt:15100, thr:550, speed:[400,1200]},
  'GWC63.71':{wt:17500, thr:710, speed:[300,1000]},
  'GWC66.75':{wt:20500, thr:730, speed:[300,950]},
  'GWL66.75':{wt:17500, thr:730, speed:[300,950]},
  'GWC70.76':{wt:22500, thr:750, speed:[300,950]},
  'GWL70.76':{wt:20000, thr:750, speed:[300,950]},
  'GWC70.82':{wt:23000, thr:780, speed:[300,1150]},
  'GWL70.82':{wt:20500, thr:780, speed:[300,1150]},
  'GWC70.85':{wt:27000, thr:800, speed:[300,950]},
  'GWL70.85':{wt:24200, thr:800, speed:[300,950]},
  'GWC75.90':{wt:34000, thr:980, speed:[200,925]},
  'GWL75.90':{wt:31500, thr:980, speed:[200,925]},
  'GWC78.88':{wt:35000, thr:1000, speed:[300,900]},
  'GWL78.88':{wt:32000, thr:1000, speed:[300,900]},
  'GWC78.96':{wt:38000, thr:1100, speed:[200,900]},
  'GWC80.95':{wt:40000, thr:1200, speed:[200,700]},
  'GWL80.95':{wt:37000, thr:1200, speed:[200,700]},
  'GWC85.100':{wt:56500, thr:1400, speed:[150,1425]},
  'GWL85.100':{wt:56500, thr:1400, speed:[150,1425]},
  // GWS/GWK/GWH/GWD 3级版
  'GWS28.30':{wt:1230, thr:80, speed:[400,1800]},
  'GWK28.30':{wt:1130, thr:80, speed:[400,1800]},
  'GWH28.30':{wt:1230, thr:80, speed:[400,1800]},
  'GWD28.30':{wt:1230, thr:80, speed:[400,1800]},
  'GWS30.32A':{wt:1460, thr:100, speed:[400,1800]},
  'GWK30.32A':{wt:1300, thr:100, speed:[400,1800]},
  'GWH30.32A':{wt:1350, thr:100, speed:[400,1800]},
  'GWD30.32A':{wt:1350, thr:100, speed:[400,1800]},
  'GWS32.35':{wt:2250, thr:120, speed:[400,1800]},
  'GWK32.35':{wt:2080, thr:120, speed:[400,1800]},
  'GWH32.35':{wt:2080, thr:120, speed:[400,1800]},
  'GWD32.35':{wt:2080, thr:120, speed:[400,1800]},
  'GWS36.39':{wt:2450, thr:140, speed:[400,1800]},
  'GWK36.39':{wt:2250, thr:140, speed:[400,1800]},
  'GWH36.39':{wt:2250, thr:140, speed:[400,1800]},
  'GWD36.39':{wt:2450, thr:140, speed:[400,1800]},
  // GWS36.54 复读: 实测 15t, 与 GWS39.57=5040 似乎反常 — 保守不覆盖, 跳过
  'GWS39.41':{wt:3230, thr:175, speed:[400,1600]},
  'GWK39.41':{wt:2960, thr:175, speed:[400,1600]},
  'GWH39.41':{wt:2960, thr:175, speed:[400,1600]},
  'GWD39.41':{wt:2960, thr:175, speed:[400,1600]},
  'GWS39.57':{wt:5040, thr:270, speed:[400,1600]},
  'GWH39.57':{wt:5520, thr:270, speed:[400,1600]},
  'GWD39.57':{wt:5040, thr:270, speed:[400,1600]},
  'GWS42.45':{wt:3960, thr:220, speed:[400,1600]},
  'GWK42.45':{wt:3630, thr:220, speed:[400,1600]},
  'GWH42.45':{wt:3960, thr:220, speed:[400,1600]},
  'GWD42.45':{wt:3960, thr:220, speed:[400,1600]},
  'GWS45.49':{wt:6030, thr:270, speed:[400,1600]},
  'GWK45.49':{wt:5560, thr:270, speed:[400,1600]},
  'GWH45.49':{wt:5560, thr:270, speed:[400,1600]},
  'GWD45.49':{wt:5560, thr:270, speed:[400,1600]},
  'GWS49.54':{wt:7900, thr:290, speed:[400,1200]},
  'GWK49.54':{wt:7300, thr:290, speed:[400,1200]},
  'GWH49.54':{wt:7300, thr:290, speed:[400,1200]},
  'GWD49.54':{wt:7300, thr:290, speed:[400,1200]},
  'GWS52.59':{wt:8900, thr:300, speed:[400,1200]},
  'GWK52.59':{wt:7220, thr:300, speed:[400,1200]},
  'GWH52.59':{wt:8900, thr:300, speed:[400,1200]},
  'GWD52.59':{wt:8900, thr:300, speed:[400,1200]},
  'GWS52.82':{thr:710, speed:[400,1200]},
  'GWS60.66':{wt:15000, thr:450, speed:[400,1200]},
  'GWK60.66':{wt:14000, thr:450, speed:[400,1200]},
  'GWH60.66':{wt:14000, thr:450, speed:[400,1200]},
  'GWD60.66':{wt:14000, thr:450, speed:[400,1200]},
  'GWS63.71':{wt:17000, thr:710, speed:[300,1000]},
  'GWK63.71':{wt:17000, thr:710, speed:[300,1000]},
  'GWH63.71':{wt:17000, thr:710, speed:[300,1000]},
  'GWD63.71':{wt:17000, thr:710, speed:[300,1000]},
  'GWS66.75':{wt:20000, thr:730, speed:[300,950]},
  'GWK66.75':{wt:19000, thr:730, speed:[300,950]},
  'GWH66.75':{wt:19000, thr:730, speed:[300,950]},
  'GWD66.75':{wt:19000, thr:730, speed:[300,950]},
  'GWS70.76':{wt:22500, thr:750, speed:[300,900]},
  'GWK70.76':{wt:21500, thr:750, speed:[300,900]},
  'GWH70.76':{wt:21500, thr:750, speed:[300,900]},
  'GWD70.76':{wt:21500, thr:750, speed:[300,900]},
  'GWS70.111':{thr:1200, speed:[400,900]},
  // GC 系列
  'GCS320':{cd:320, thr:100, speed:[400,1800]},
  'GCH320':{cd:320, thr:100, speed:[400,1800]},
  'GCST5':{cd:445, thr:120, speed:[400,1800]},
  'GCHT5':{cd:445, thr:120, speed:[400,1800]},
  'GCSE5':{cd:570, thr:170, speed:[400,1800]},
  'GCHE5':{cd:570, thr:170, speed:[400,1800]},
  'GCS350':{cd:350, thr:113, speed:[400,1800]},
  'GCH350':{cd:350, thr:113, speed:[400,1800]},
  'GCST6':{cd:480, thr:170, speed:[400,1800]},
  'GCHT6':{cd:480, thr:170, speed:[400,1800]},
  'GCSE6':{cd:615, thr:170, speed:[400,1800]},
  'GCHE6':{cd:615, thr:170, speed:[400,1800]},
  'GCS390':{cd:390, thr:140, speed:[400,1800]},
  'GCH390':{cd:390, thr:140, speed:[400,1800]},
  'GCST9':{cd:545, thr:220, speed:[400,1800]},
  'GCHT9':{cd:545, thr:220, speed:[400,1800]},
  'GCSE9':{cd:700, thr:270, speed:[400,1800]},
  'GCHE9':{cd:700, thr:270, speed:[400,1800]},
  'GCS410':{cd:410, thr:175, speed:[400,1600]},
  'GCH410':{cd:410, thr:175, speed:[400,1600]},
  'GCST11':{cd:570, thr:220, speed:[400,1600]},
  'GCHT11':{cd:570, thr:220, speed:[400,1600]},
  'GCSE11':{cd:735, thr:270, speed:[400,1600]},
  'GCHE11':{cd:735, thr:270, speed:[400,1600]},
  'GCS450':{cd:455, thr:220, speed:[400,1600]},
  'GCST15':{cd:630, thr:270, speed:[400,1600]},
  'GCHT15':{cd:630, thr:270, speed:[400,1600]},
  'GCSE15':{cd:810, thr:300, speed:[400,1600]},
  'GCHE15':{cd:810, thr:300, speed:[400,1600]},
  'GCS490':{cd:490, thr:270, speed:[400,1400]},
  'GCH490':{cd:490, thr:270, speed:[400,1400]},
  'GCST20':{cd:680, thr:300, speed:[400,1400]},
  'GCHT20':{cd:680, thr:300, speed:[400,1400]},
  'GCSE20':{cd:875, thr:350, speed:[400,1400]},
  'GCHE20':{cd:875, thr:350, speed:[400,1400]},
  'GCS540':{cd:540, thr:290, speed:[400,1200]},
  'GCH540':{cd:540, thr:290, speed:[400,1200]},
  'GCST26':{cd:750, thr:360, speed:[400,1200]},
  'GCHT26':{cd:750, thr:360, speed:[400,1200]},
  'GCSE26':{cd:960, thr:450, speed:[400,1200]},
  'GCHE26':{cd:960, thr:450, speed:[400,1200]},
  'GCS590':{cd:590, thr:360, speed:[400,1200]},
  'GCH590':{cd:590, thr:360, speed:[400,1200]},
  'GCST33':{cd:820, thr:540, speed:[400,1200]},
  'GCHT33':{cd:820, thr:540, speed:[400,1200]},
  'GCSE33':{cd:1055, thr:550, speed:[400,1200]},
  'GCHE33':{cd:1055, thr:550, speed:[400,1200]},
  'GCS660':{cd:668, thr:540, speed:[400,1200]},
  'GCH660':{cd:668, thr:540, speed:[400,1200]},
  'GCST44':{cd:924, thr:600, speed:[400,1200]},
  'GCHT44':{cd:924, thr:600, speed:[400,1200]},
  'GCSE44':{cd:1185, thr:700, speed:[400,1200]},
  'GCHE44':{cd:1185, thr:700, speed:[400,1200]},
  'GCS700B':{cd:700, thr:450, speed:[400,1200]},
  'GCS750':{cd:750, thr:730, speed:[300,950]},
  'GCH750':{cd:750, thr:730, speed:[300,950]},
  'GCST66':{cd:1064, thr:1000, speed:[300,950]},
  'GCHT66':{cd:1064, thr:1000, speed:[300,950]},
  'GCS760':{cd:768, thr:750, speed:[300,900]},
  'GCH760':{cd:768, thr:750, speed:[300,900]},
  'GCST77':{cd:1100, thr:1000, speed:[300,900]},
  'GCHT77':{cd:1100, thr:1000, speed:[300,900]},
  'GCS850':{cd:855, thr:750, speed:[300,800]},
  'GCH850':{cd:855, thr:750, speed:[300,800]},
  'GCS900':{cd:900, thr:980, speed:[200,900]},
  'GCH900':{cd:900, thr:980, speed:[200,900]},
  'GCST108':{cd:1230, thr:1400, speed:[200,900]},
  'GCHT108':{cd:1230, thr:1400, speed:[200,900]},
  'GCS880':{cd:880, thr:1000, speed:[200,650]},
  'GCH880':{cd:880, thr:1000, speed:[200,650]},
  'GCST115':{cd:1260, thr:1400, speed:[200,650]},
  'GCHT115':{cd:1260, thr:1400, speed:[200,650]},
  'GCS950':{cd:965, thr:1000, speed:[200,650]},
  'GCH950':{cd:965, thr:1000, speed:[200,650]},
  'GCST135':{cd:1350, thr:1400, speed:[200,650]},
  'GCHT135':{cd:1350, thr:1400, speed:[200,650]},
  'GCS1000':{cd:1018, thr:1400, speed:[200,800]},
  'GCH1000':{cd:1018, thr:1400, speed:[200,800]},
  'GCST170':{cd:1430, thr:1400, speed:[200,800]},
  'GCHT170':{cd:1430, thr:1400, speed:[200,800]},
  // 2GWH 双机并车
  '2GWH1060':{cd:1460, thr:175, speed:[400,2000]},
  '2GWH1830':{cd:1760, thr:270, speed:[400,1900]},
  '2GWH3140':{cd:2080, thr:300, speed:[400,1600]},
  '2GWH4100':{cd:2300, thr:450, speed:[400,1600]},
  '2GWH5410':{cd:2560, thr:550, speed:[400,1400]},
  '2GWH7050':{cd:2700, thr:750, speed:[400,1200]},
  '2GWH9250':{cd:3080, thr:1000, speed:[400,1200]},
  // DT 电推
  'DT180':{cd:142, wt:130, thr:14.7, speed:[750,1500]},
  'DT210':{cd:146, wt:150, thr:16, speed:[750,1500]},
  'DT240':{cd:165, wt:240, thr:25, speed:[750,1500]},
  'DT280':{cd:190, wt:350, thr:30, speed:[750,1500]},
  'DT580':{cd:203, wt:370, thr:40, speed:[750,1500]},
  'DT770':{cd:220, wt:480, thr:50, speed:[750,1500]},
  'DT900':{cd:264, wt:700, thr:60, speed:[750,1500]},
  'DT1400':{cd:290, wt:900, thr:90, speed:[750,1500]},
  'DT1500':{cd:310, wt:1100, thr:100, speed:[750,1500]},
  'DT2400':{cd:340, wt:1430, thr:110, speed:[750,1500]},
  'DT4300':{cd:370, wt:1550, thr:120, speed:[750,1500]},
  // HCS/HCDS/HCTS 双速 — 修复字段错位
  'HCS138':{cd:225, thr:30, speed:[1000,2500]},
  'HCS201':{cd:205, thr:40, speed:[1000,2500]},
  'HCS302':{cd:264, thr:50, speed:[750,2500]},
  'HCDS302':{cd:355, thr:60, speed:[1000,2500]},
  'HCS400':{cd:264, thr:82, speed:[1000,1800]},
  'HCDS400':{cd:355, thr:82, speed:[1000,1800]},
  'HCS600':{cd:320, thr:90, speed:[1000,2100]},
  'HCDS600':{cd:415, thr:90, speed:[1000,2100]},
  'HCDS800':{cd:450, thr:110, speed:[600,1800]},
  'HCTS800':{cd:645, thr:140, speed:[600,1800]},
  'HCS1000':{cd:335, thr:110, speed:[600,1900]},
  'HCS1200':{cd:380, thr:120, speed:[600,1900]},
  'HCDS1200':{cd:450, thr:140, speed:[600,1900]},
  'HCTS1200':{thr:150, speed:[700,1800]},
  'HCDS1400':{cd:485, thr:175, speed:[600,1800]},
  'HCTS1400':{cd:775, thr:220, speed:[600,1800]},
  'HCS1600':{cd:415, thr:170, speed:[500,1650]},
  'HCDS1600':{cd:520, thr:200, speed:[500,1650]},
  'HCTS1600':{cd:815, thr:250, speed:[500,1650]},
  'HCS2000':{cd:450, thr:190, speed:[500,1500]},
  'HCDS2000':{cd:560, thr:220, speed:[600,1500]},
  'HCTS2000':{cd:870, thr:270, speed:[600,1500]},
  'HCS2700':{cd:490, thr:270, speed:[500,1400]},
  'HCDS2700':{cd:630, thr:280, speed:[500,1400]},
  'HCTS2700':{cd:945, thr:340, speed:[500,1400]},
  'SGWS49.54':{cd:540, thr:290, speed:[400,1200]},
  'SGWS52.59':{cd:590, thr:360, speed:[400,1200]},
  'SGWS60.66':{cd:600, thr:540, speed:[400,1200]},
  'SGWS66.75':{cd:750, thr:730, speed:[300,950]},
  'SGWS70.76':{cd:750, thr:750, speed:[300,950]},
  'SGW32.35':{thr:113, speed:[400,1300]},
  // HCL 离合
  'HCL30':{wt:100, speed:[750,2500]},
  'HCL100':{wt:156, speed:[750,2500]},
  'HCL250A':{wt:210, speed:[750,2500]},
  'HCL320':{wt:210, speed:[500,2500]},
  'HCL600':{wt:450, speed:[750,1600]},
  'HCL800':{wt:450, speed:[750,1800]},
  'HCL1000':{wt:800, speed:[750,1800]},
};

const norm = (s) => String(s||'').replace(/\s+/g,'').toUpperCase();

// ===== 修补 completeGearboxData.js =====
const cplPath = path.resolve(__dirname,'../src/data/completeGearboxData.js');
const cplSrc = fs.readFileSync(cplPath,'utf-8');
delete require.cache[require.resolve(cplPath)];
const { completeGearboxData } = require(cplPath);

const stats = { cpl: {touched:0, fields:0, byField:{}}, emb: {touched:0, fields:0, byField:{}} };
const log = [];

const lookup = {};
for (const m of Object.keys(M)) lookup[norm(m)] = M[m];

for (const g of completeGearboxData) {
  if (!g || !g.model) continue;
  const ref = lookup[norm(g.model)];
  if (!ref) continue;
  let touched = false;
  // cd
  if (ref.cd !== undefined && g.centerDistance !== ref.cd) {
    log.push(`[cpl] ${g.model}: cd ${g.centerDistance} → ${ref.cd}`);
    g.centerDistance = ref.cd; touched=true;
    stats.cpl.byField.cd = (stats.cpl.byField.cd||0)+1;
    stats.cpl.fields++;
  }
  // wt
  if (ref.wt !== undefined && g.weight !== ref.wt) {
    log.push(`[cpl] ${g.model}: wt ${g.weight} → ${ref.wt}`);
    g.weight = ref.wt; touched=true;
    stats.cpl.byField.wt = (stats.cpl.byField.wt||0)+1;
    stats.cpl.fields++;
  }
  // thr
  if (ref.thr !== undefined && g.thrust !== ref.thr) {
    log.push(`[cpl] ${g.model}: thr ${g.thrust} → ${ref.thr}`);
    g.thrust = ref.thr; touched=true;
    stats.cpl.byField.thr = (stats.cpl.byField.thr||0)+1;
    stats.cpl.fields++;
  }
  // speed
  if (ref.speed !== undefined &&
      (g.minSpeed !== ref.speed[0] || g.maxSpeed !== ref.speed[1])) {
    log.push(`[cpl] ${g.model}: speed [${g.minSpeed},${g.maxSpeed}] → [${ref.speed[0]},${ref.speed[1]}]`);
    g.minSpeed = ref.speed[0];
    g.maxSpeed = ref.speed[1];
    touched=true;
    stats.cpl.byField.speed = (stats.cpl.byField.speed||0)+1;
    stats.cpl.fields++;
  }
  if (touched) stats.cpl.touched++;
}

// 写回 (序列化)
const outCpl = 'export const completeGearboxData = ' +
  JSON.stringify(completeGearboxData, null, 2) + ';\n';
fs.writeFileSync(cplPath, outCpl, 'utf-8');
console.log(`✓ completeGearboxData.js 已更新: ${stats.cpl.touched} 个型号, ${stats.cpl.fields} 个字段`);
console.log('  按字段:', stats.cpl.byField);

// ===== 修补 embeddedData.js =====
const embPath = path.resolve(__dirname,'../src/data/embeddedData.js');
delete require.cache[require.resolve(embPath)];
const embModule = require(embPath);
const { embeddedGearboxData } = embModule;

for (const k of Object.keys(embeddedGearboxData)) {
  const arr = embeddedGearboxData[k];
  if (!Array.isArray(arr)) continue;
  for (const g of arr) {
    if (!g || !g.model) continue;
    const ref = lookup[norm(g.model)];
    if (!ref) continue;
    let touched = false;
    if (ref.cd !== undefined && g.centerDistance !== ref.cd) {
      log.push(`[emb] ${g.model}: cd ${g.centerDistance} → ${ref.cd}`);
      g.centerDistance = ref.cd; touched=true;
      stats.emb.byField.cd = (stats.emb.byField.cd||0)+1;
      stats.emb.fields++;
    }
    if (ref.wt !== undefined && g.weight !== ref.wt) {
      log.push(`[emb] ${g.model}: wt ${g.weight} → ${ref.wt}`);
      g.weight = ref.wt; touched=true;
      stats.emb.byField.wt = (stats.emb.byField.wt||0)+1;
      stats.emb.fields++;
    }
    if (ref.thr !== undefined && g.thrust !== ref.thr) {
      log.push(`[emb] ${g.model}: thr ${g.thrust} → ${ref.thr}`);
      g.thrust = ref.thr; touched=true;
      stats.emb.byField.thr = (stats.emb.byField.thr||0)+1;
      stats.emb.fields++;
    }
    if (ref.speed !== undefined && Array.isArray(g.inputSpeedRange)) {
      if (g.inputSpeedRange[0] !== ref.speed[0] || g.inputSpeedRange[1] !== ref.speed[1]) {
        log.push(`[emb] ${g.model}: speed [${g.inputSpeedRange.join(',')}] → [${ref.speed.join(',')}]`);
        g.inputSpeedRange = [ref.speed[0], ref.speed[1]];
        touched=true;
        stats.emb.byField.speed = (stats.emb.byField.speed||0)+1;
        stats.emb.fields++;
      }
    } else if (ref.speed !== undefined && !g.inputSpeedRange) {
      g.inputSpeedRange = [ref.speed[0], ref.speed[1]];
      touched=true;
      stats.emb.byField.speed = (stats.emb.byField.speed||0)+1;
      stats.emb.fields++;
      log.push(`[emb] ${g.model}: speed (空) → [${ref.speed.join(',')}]`);
    }
    if (touched) stats.emb.touched++;
  }
}

// 写回 embeddedData (保留原始格式头)
const embOrig = fs.readFileSync(embPath,'utf-8');
const headerMatch = embOrig.match(/^([\s\S]*?)export\s+const\s+embeddedGearboxData\s*=/);
const header = headerMatch ? headerMatch[1] : '// src/data/embeddedData.js\n// auto-patched by patch-from-manual-20260502.js\n';
const safeParseFloatMatch = embOrig.match(/export\s+(function|const)\s+safeParseFloat[\s\S]*?(?=export|\Z)/);
const tail = safeParseFloatMatch ? '\n' + safeParseFloatMatch[0] : '';
const outEmb = `${header}export const embeddedGearboxData = ${JSON.stringify(embeddedGearboxData, null, 2)};\n${tail}`;
fs.writeFileSync(embPath, outEmb, 'utf-8');

console.log(`✓ embeddedData.js 已更新: ${stats.emb.touched} 个型号, ${stats.emb.fields} 个字段`);
console.log('  按字段:', stats.emb.byField);

// 写日志
fs.writeFileSync('/tmp/patch.log', log.join('\n'), 'utf-8');
console.log(`\n→ /tmp/patch.log (${log.length} 行)`);
console.log(`  备份: completeGearboxData.js.bak.20260502 / embeddedData.js.bak.20260502`);
