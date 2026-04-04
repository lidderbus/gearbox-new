/**
 * competitorDrawings.js
 * 竞品外形图/产品手册数据目录
 *
 * 数据来源：各厂商官网公开PDF + 经销商公开资料
 * 更新日期：2026-03-28 (第四轮全网搜索补充)
 * 总计：79份PDF，171MB，覆盖10个品牌
 */

import { competitors, manufacturerColors } from './competitorData';

// 图纸服务器基础URL（与DWG系统共用同一服务器）
export const COMPETITOR_DRAWINGS_BASE_URL = 'https://qj-gearbox.duckdns.org';

// ============================================================
// 竞品外形图目录
// ============================================================
export const competitorDrawingsCatalog = {
  // ================================================================
  // Twin Disc — 最丰富，官方公开下载目录 twindisc.com/downloads/
  // ================================================================
  TwinDisc: {
    status: 'available',
    catalogs: [
      {
        id: 'twindisc-marine-guide',
        title: 'Marine Product Guide (完整版)',
        fileName: 'Marine_Product_Guide.pdf',
        filePath: '/drawings/competitor/twindisc/Marine_Product_Guide.pdf',
        sourceUrl: 'https://twindisc.com/downloads/Marine_Product_Guide.pdf',
        fileSize: '~3MB',
        year: 2024,
        language: 'en',
        description: 'Twin Disc完整船用传动产品手册，含全系列外形图和尺寸标注',
        coversModels: ['MG-5005', 'MG-5050', 'MG-5061', 'MG-5065', 'MG-5075', 'MG-5082', 'MG-5091', 'MG-5114', 'MG-5170', 'MG-516', 'MG-540', 'MGX全系列', 'EC300'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'twindisc-mg5005a',
        title: 'MG-5005A Datasheet',
        fileName: 'MG-5005A.pdf',
        filePath: '/drawings/competitor/twindisc/MG-5005A.pdf',
        sourceUrl: 'https://twindisc.com/downloads/MG-5005A.pdf',
        fileSize: '~500KB',
        year: 2024,
        language: 'en',
        description: 'MG-5005A 小型齿轮箱数据表（含外形图）',
        coversModels: ['MG-5005A'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'twindisc-mg5050',
        title: 'MG-5050 Series Datasheet',
        fileName: 'MG-5050_Series.pdf',
        filePath: '/drawings/competitor/twindisc/MG-5050_Series.pdf',
        sourceUrl: 'https://twindisc.com/downloads/MG-5050SC_A_RV.pdf',
        fileSize: '~800KB',
        year: 2024,
        language: 'en',
        description: 'MG-5050SC/A/RV 系列数据表（含外形图）',
        coversModels: ['MG-5050SC', 'MG-5050A', 'MG-5050RV'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'twindisc-mg5061',
        title: 'MG-5061 Series Datasheet',
        fileName: 'MG-5061_Series.pdf',
        filePath: '/drawings/competitor/twindisc/MG-5061_Series.pdf',
        sourceUrl: 'https://twindisc.com/downloads/MG-5061SC_A_RV.pdf',
        fileSize: '~800KB',
        year: 2024,
        language: 'en',
        description: 'MG-5061SC/A/RV 系列数据表（含外形图）',
        coversModels: ['MG-5061SC', 'MG-5061A', 'MG-5061RV'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'twindisc-mg5065',
        title: 'MG-5065 Series Datasheet',
        fileName: 'MG-5065_Series.pdf',
        filePath: '/drawings/competitor/twindisc/MG-5065_Series.pdf',
        sourceUrl: 'https://twindisc.com/downloads/MG-5065SC_A.pdf',
        fileSize: '~800KB',
        year: 2024,
        language: 'en',
        description: 'MG-5065SC/A 系列数据表（含外形图）',
        coversModels: ['MG-5065SC', 'MG-5065A'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'twindisc-mg5075',
        title: 'MG-5075 Series Datasheet',
        fileName: 'MG-5075_Series.pdf',
        filePath: '/drawings/competitor/twindisc/MG-5075_Series.pdf',
        sourceUrl: 'https://twindisc.com/downloads/MG-5075SC_A_IV.pdf',
        fileSize: '~800KB',
        year: 2024,
        language: 'en',
        description: 'MG-5075SC/A/IV 系列数据表（含外形图）',
        coversModels: ['MG-5075SC', 'MG-5075A', 'MG-5075IV'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'twindisc-mg5082',
        title: 'MG-5082 Series Datasheet',
        fileName: 'MG-5082_Series.pdf',
        filePath: '/drawings/competitor/twindisc/MG-5082_Series.pdf',
        sourceUrl: 'https://twindisc.com/downloads/MG-5082SC_A.pdf',
        fileSize: '~800KB',
        year: 2024,
        language: 'en',
        description: 'MG-5082SC/A 系列数据表（含外形图）',
        coversModels: ['MG-5082SC', 'MG-5082A'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'twindisc-mg5091',
        title: 'MG-5091 Series Datasheet',
        fileName: 'MG-5091_Series.pdf',
        filePath: '/drawings/competitor/twindisc/MG-5091_Series.pdf',
        sourceUrl: 'https://twindisc.com/downloads/MG-5091SC_DC.pdf',
        fileSize: '~800KB',
        year: 2024,
        language: 'en',
        description: 'MG-5091SC/DC 系列数据表（含外形图）',
        coversModels: ['MG-5091SC', 'MG-5091DC'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'twindisc-mgx5075',
        title: 'MGX-5075 QuickShift Datasheet',
        fileName: 'MGX-5075_Series.pdf',
        filePath: '/drawings/competitor/twindisc/MGX-5075_Series.pdf',
        sourceUrl: 'https://twindisc.com/downloads/MGX-5075SC_A_IV.pdf',
        fileSize: '~800KB',
        year: 2024,
        language: 'en',
        description: 'MGX-5075 QuickShift电控系列（含外形图）',
        coversModels: ['MGX-5075SC', 'MGX-5075A', 'MGX-5075IV'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'twindisc-mgx5095',
        title: 'MGX-5095 QuickShift Datasheet',
        fileName: 'MGX-5095_Series.pdf',
        filePath: '/drawings/competitor/twindisc/MGX-5095_Series.pdf',
        sourceUrl: 'https://twindisc.com/downloads/MGX-5095SC-6-18.pdf',
        fileSize: '~800KB',
        year: 2024,
        language: 'en',
        description: 'MGX-5095SC QuickShift电控（含外形图）',
        coversModels: ['MGX-5095SC'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'twindisc-mgx5114',
        title: 'MGX-5114 QuickShift Series',
        fileName: 'MGX-5114_Series.pdf',
        filePath: '/drawings/competitor/twindisc/MGX-5114_Series.pdf',
        sourceUrl: 'https://twindisc.com/downloads/2102_Bulletin_MGX-5114_Series.pdf',
        fileSize: '~1MB',
        year: 2024,
        language: 'en',
        description: 'MGX-5114 QuickShift全系列（SC/IV/RV/HD/DC，含外形图）',
        coversModels: ['MGX-5114SC', 'MGX-5114IV', 'MGX-5114RV', 'MGX-5114SC-HD', 'MGX-5114DC'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'twindisc-mgx5170',
        title: 'MGX-5170DC Datasheet',
        fileName: 'MGX-5170_DC.pdf',
        filePath: '/drawings/competitor/twindisc/MGX-5170_DC.pdf',
        sourceUrl: 'https://twindisc.com/downloads/MGX-5170_DC_Bulletin.pdf',
        fileSize: '~800KB',
        year: 2024,
        language: 'en',
        description: 'MGX-5170DC 大功率QuickShift（含外形图）',
        coversModels: ['MGX-5170DC'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'twindisc-mgx6599',
        title: 'MGX-6599 Series Datasheet',
        fileName: 'MGX-6599_Series.pdf',
        filePath: '/drawings/competitor/twindisc/MGX-6599_Series.pdf',
        sourceUrl: 'https://twindisc.com/downloads/MGX-6599SC_A_RV-6-18.pdf',
        fileSize: '~800KB',
        year: 2024,
        language: 'en',
        description: 'MGX-6599 QuickShift旗舰（SC/A/RV，含外形图）',
        coversModels: ['MGX-6599SC', 'MGX-6599A', 'MGX-6599RV'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'twindisc-mgx6620',
        title: 'MGX-6620 Series Datasheet',
        fileName: 'MGX-6620_Series.pdf',
        filePath: '/drawings/competitor/twindisc/MGX-6620_Series.pdf',
        sourceUrl: 'https://twindisc.com/downloads/MGX-6620SC_A_RV.pdf',
        fileSize: '~800KB',
        year: 2024,
        language: 'en',
        description: 'MGX-6620 大功率（SC/A/RV，含外形图）',
        coversModels: ['MGX-6620SC', 'MGX-6620A', 'MGX-6620RV'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'twindisc-mgx6690',
        title: 'MGX-6690SC Datasheet',
        fileName: 'MGX-6690_Series.pdf',
        filePath: '/drawings/competitor/twindisc/MGX-6690_Series.pdf',
        sourceUrl: 'https://twindisc.com/downloads/MGX-6690SC-6-18.pdf',
        fileSize: '~800KB',
        year: 2024,
        language: 'en',
        description: 'MGX-6690SC 大功率（含外形图）',
        coversModels: ['MGX-6690SC'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'twindisc-mgx6848',
        title: 'MGX-6848SC Datasheet',
        fileName: 'MGX-6848_Series.pdf',
        filePath: '/drawings/competitor/twindisc/MGX-6848_Series.pdf',
        sourceUrl: 'https://twindisc.com/downloads/MGX-6848SC-6-18.pdf',
        fileSize: '~800KB',
        year: 2024,
        language: 'en',
        description: 'MGX-6848SC 超大功率（含外形图）',
        coversModels: ['MGX-6848SC'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'twindisc-mge-hybrid',
        title: 'MGE Series Hybrid Brochure',
        fileName: 'MGE_Hybrid_Series.pdf',
        filePath: '/drawings/competitor/twindisc/MGE_Hybrid_Series.pdf',
        sourceUrl: 'https://twindisc.com/downloads/Brochure_MGE_Series.pdf',
        fileSize: '~2MB',
        year: 2024,
        language: 'en',
        description: 'MGE混合动力系列手册（Go Electric并联混合系统）',
        coversModels: ['MGE-5065SC', 'MGE-5204SC', 'MGH-5321DC'],
        hasOutlineDrawings: false,
        hasSpecTables: true
      },
      {
        id: 'twindisc-ec300',
        title: 'EC300 Power Commander',
        fileName: 'EC300_Control.pdf',
        filePath: '/drawings/competitor/twindisc/EC300_Control.pdf',
        sourceUrl: 'https://twindisc.com/downloads/EC300.pdf',
        fileSize: '~500KB',
        year: 2024,
        language: 'en',
        description: 'EC300单杆电控系统数据表',
        coversModels: ['EC300'],
        hasOutlineDrawings: false,
        hasSpecTables: true
      },
      // Round 4 补充
      { id: 'twindisc-mg5114a', title: 'MG-5114A Datasheet (P-S)', fileName: 'MG-5114A_PS.pdf',
        filePath: '/drawings/competitor/twindisc/MG-5114A_PS.pdf', fileSize: '~738KB', year: 2024, language: 'en',
        description: 'MG-5114A标准型(P-S丹麦经销商)', coversModels: ['MG-5114A'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'twindisc-mg540', title: 'MG-540 Bulletin', fileName: 'MG-540_Series.pdf',
        filePath: '/drawings/competitor/twindisc/MG-540_Series.pdf', fileSize: '~177KB', year: 2024, language: 'en',
        description: 'MG-540系列数据表', coversModels: ['MG-540'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'twindisc-mg5506', title: 'MG-5506 Datasheet', fileName: 'MG-5506_Series.pdf',
        filePath: '/drawings/competitor/twindisc/MG-5506_Series.pdf', fileSize: '~773KB', year: 2024, language: 'en',
        description: 'MG-5506大功率系列', coversModels: ['MG-5506'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'twindisc-mg6557', title: 'MG-6557SC Datasheet (P-S)', fileName: 'MG-6557SC_PS.pdf',
        filePath: '/drawings/competitor/twindisc/MG-6557SC_PS.pdf', fileSize: '~718KB', year: 2024, language: 'en',
        description: 'MG-6557SC大功率(P-S丹麦经销商)', coversModels: ['MG-6557SC'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'twindisc-mgx5135a', title: 'MGX-5135A QuickShift (P-S)', fileName: 'MGX-5135A_PS.pdf',
        filePath: '/drawings/competitor/twindisc/MGX-5135A_PS.pdf', fileSize: '~701KB', year: 2024, language: 'en',
        description: 'MGX-5135A QuickShift(P-S丹麦经销商)', coversModels: ['MGX-5135A'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'twindisc-mgx5222', title: 'MGX-5222DC Datasheet', fileName: 'MGX-5222_DC.pdf',
        filePath: '/drawings/competitor/twindisc/MGX-5222_DC.pdf', fileSize: '~567KB', year: 2024, language: 'en',
        description: 'MGX-5222DC QuickShift', coversModels: ['MGX-5222DC'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'twindisc-mgx5321', title: 'MGX-5321DC Datasheet', fileName: 'MGX-5321_DC.pdf',
        filePath: '/drawings/competitor/twindisc/MGX-5321_DC.pdf', fileSize: '~575KB', year: 2024, language: 'en',
        description: 'MGX-5321DC QuickShift/混合动力可选', coversModels: ['MGX-5321DC'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'twindisc-mgx61500', title: 'MGX-61500SC Datasheet', fileName: 'MGX-61500_SC.pdf',
        filePath: '/drawings/competitor/twindisc/MGX-61500_SC.pdf', fileSize: '~204KB', year: 2024, language: 'en',
        description: 'MGX-61500SC 超大功率旗舰', coversModels: ['MGX-61500SC'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'twindisc-mgx5114-hd', title: 'MGX-5114SC-HD/DC', fileName: 'MGX-5114SC-HD_DC.pdf',
        filePath: '/drawings/competitor/twindisc/MGX-5114SC-HD_DC.pdf', fileSize: '~213KB', year: 2024, language: 'en',
        description: 'MGX-5114SC重载/下中心变体', coversModels: ['MGX-5114SC-HD', 'MGX-5114DC'], hasOutlineDrawings: true, hasSpecTables: true }
    ]
  },

  // ================================================================
  // ZF Marine — 综合选型指南 + 14个单型号数据表
  // ================================================================
  ZF: {
    status: 'available',
    catalogs: [
      {
        id: 'zf-selection-guide',
        title: 'ZF Marine Product Selection Guide (完整版)',
        fileName: 'ZF_Marine_Selection_Guide.pdf',
        filePath: '/drawings/competitor/zf/ZF_Marine_Selection_Guide.pdf',
        sourceUrl: 'https://www.zf.com/products/media/industrial/marine/brochures_1/Product_Selection_Guide.pdf',
        fileSize: '~17MB',
        year: 2024,
        language: 'en',
        description: 'ZF海事部门完整选型指南，含全系列Drawings & Dimensions章节',
        coversModels: ['ZF 12M', 'ZF 25', 'ZF 45A', 'ZF 63A', 'ZF 80A', 'ZF 85A', 'ZF 220', 'ZF 280', 'ZF 301C', 'ZF 305', 'ZF 325', 'ZF 500', 'ZF 665', 'W320', 'W340', 'W350', 'W650', 'ZF 2000-9000'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'zf-12m', title: 'ZF 12M Datasheet', fileName: 'ZF_12M.pdf',
        filePath: '/drawings/competitor/zf/ZF_12M.pdf', fileSize: '~300KB', year: 2023, language: 'en',
        description: 'ZF 12M 机械式小型齿轮箱', coversModels: ['ZF 12M'], hasOutlineDrawings: true, hasSpecTables: true
      },
      {
        id: 'zf-25m', title: 'ZF 25M Datasheet', fileName: 'ZF_25M.pdf',
        filePath: '/drawings/competitor/zf/ZF_25M.pdf', fileSize: '~300KB', year: 2023, language: 'en',
        description: 'ZF 25M 机械式小型齿轮箱', coversModels: ['ZF 25M'], hasOutlineDrawings: true, hasSpecTables: true
      },
      {
        id: 'zf-45a', title: 'ZF 45A Datasheet', fileName: 'ZF_45A.pdf',
        filePath: '/drawings/competitor/zf/ZF_45A.pdf', fileSize: '~400KB', year: 2023, language: 'en',
        description: 'ZF 45A 液压式小型齿轮箱', coversModels: ['ZF 45A'], hasOutlineDrawings: true, hasSpecTables: true
      },
      {
        id: 'zf-63a', title: 'ZF 63A Datasheet', fileName: 'ZF_63A.pdf',
        filePath: '/drawings/competitor/zf/ZF_63A.pdf', fileSize: '~400KB', year: 2023, language: 'en',
        description: 'ZF 63A 中型齿轮箱', coversModels: ['ZF 63A'], hasOutlineDrawings: true, hasSpecTables: true
      },
      {
        id: 'zf-80a', title: 'ZF 80A Datasheet', fileName: 'ZF_80A.pdf',
        filePath: '/drawings/competitor/zf/ZF_80A.pdf', fileSize: '~400KB', year: 2023, language: 'en',
        description: 'ZF 80A 中型齿轮箱（仅64kg）', coversModels: ['ZF 80A'], hasOutlineDrawings: true, hasSpecTables: true
      },
      {
        id: 'zf-85a', title: 'ZF 85A Datasheet', fileName: 'ZF_85A.pdf',
        filePath: '/drawings/competitor/zf/ZF_85A.pdf', fileSize: '~400KB', year: 2023, language: 'en',
        description: 'ZF 85A 中型齿轮箱', coversModels: ['ZF 85A'], hasOutlineDrawings: true, hasSpecTables: true
      },
      {
        id: 'zf-220a', title: 'ZF 220A Datasheet', fileName: 'ZF_220A.pdf',
        filePath: '/drawings/competitor/zf/ZF_220A.pdf', fileSize: '~400KB', year: 2023, language: 'en',
        description: 'ZF 220A 含1:1直传比', coversModels: ['ZF 220A'], hasOutlineDrawings: true, hasSpecTables: true
      },
      {
        id: 'zf-280', title: 'ZF 280-1 Datasheet', fileName: 'ZF_280.pdf',
        filePath: '/drawings/competitor/zf/ZF_280.pdf', fileSize: '~400KB', year: 2023, language: 'en',
        description: 'ZF 280-1 中大型齿轮箱', coversModels: ['ZF 280-1'], hasOutlineDrawings: true, hasSpecTables: true
      },
      {
        id: 'zf-286a', title: 'ZF 286A Datasheet', fileName: 'ZF_286A.pdf',
        filePath: '/drawings/competitor/zf/ZF_286A.pdf', fileSize: '~400KB', year: 2023, language: 'en',
        description: 'ZF 286A V驱动', coversModels: ['ZF 286A'], hasOutlineDrawings: true, hasSpecTables: true
      },
      {
        id: 'zf-400', title: 'ZF 400 Datasheet', fileName: 'ZF_400.pdf',
        filePath: '/drawings/competitor/zf/ZF_400.pdf', fileSize: '~400KB', year: 2023, language: 'en',
        description: 'ZF 400 高性能系列', coversModels: ['ZF 400'], hasOutlineDrawings: true, hasSpecTables: true
      },
      {
        id: 'zf-500', title: 'ZF 500 Datasheet', fileName: 'ZF_500.pdf',
        filePath: '/drawings/competitor/zf/ZF_500.pdf', fileSize: '~400KB', year: 2023, language: 'en',
        description: 'ZF 500 高性能系列', coversModels: ['ZF 500'], hasOutlineDrawings: true, hasSpecTables: true
      },
      {
        id: 'zf-665', title: 'ZF 665 Datasheet', fileName: 'ZF_665.pdf',
        filePath: '/drawings/competitor/zf/ZF_665.pdf', fileSize: '~400KB', year: 2023, language: 'en',
        description: 'ZF 665 豪华游艇专用', coversModels: ['ZF 665'], hasOutlineDrawings: true, hasSpecTables: true
      },
      {
        id: 'zf-w340', title: 'ZF W340 Datasheet', fileName: 'ZF_W340.pdf',
        filePath: '/drawings/competitor/zf/ZF_W340.pdf', fileSize: '~400KB', year: 2023, language: 'en',
        description: 'ZF W340 商船级', coversModels: ['ZF W340'], hasOutlineDrawings: true, hasSpecTables: true
      },
      {
        id: 'zf-w350', title: 'ZF W350-1 Datasheet', fileName: 'ZF_W350.pdf',
        filePath: '/drawings/competitor/zf/ZF_W350.pdf', fileSize: '~265KB', year: 2023, language: 'en',
        description: 'ZF W350-1 大功率商船', coversModels: ['ZF W350-1'], hasOutlineDrawings: true, hasSpecTables: true
      },
      // Round 4 补充
      { id: 'zf-220', title: 'ZF 220 Datasheet', fileName: 'ZF_220.pdf',
        filePath: '/drawings/competitor/zf/ZF_220.pdf', fileSize: '~136KB', year: 2023, language: 'en',
        description: 'ZF 220标准型', coversModels: ['ZF 220'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'zf-301a', title: 'ZF 301A Datasheet', fileName: 'ZF_301A.pdf',
        filePath: '/drawings/competitor/zf/ZF_301A.pdf', fileSize: '~411KB', year: 2023, language: 'en',
        description: 'ZF 301A 同轴型', coversModels: ['ZF 301A'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'zf-311a', title: 'ZF 311A Datasheet', fileName: 'ZF_311A.pdf',
        filePath: '/drawings/competitor/zf/ZF_311A.pdf', fileSize: '~310KB', year: 2023, language: 'en',
        description: 'ZF 311A', coversModels: ['ZF 311A'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'zf-360', title: 'ZF 360 Datasheet', fileName: 'ZF_360.pdf',
        filePath: '/drawings/competitor/zf/ZF_360.pdf', fileSize: '~184KB', year: 2023, language: 'en',
        description: 'ZF 360', coversModels: ['ZF 360'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'zf-550a', title: 'ZF 550A Datasheet', fileName: 'ZF_550A.pdf',
        filePath: '/drawings/competitor/zf/ZF_550A.pdf', fileSize: '~375KB', year: 2023, language: 'en',
        description: 'ZF 550A 高性能', coversModels: ['ZF 550A'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'zf-665a', title: 'ZF 665A Datasheet', fileName: 'ZF_665A.pdf',
        filePath: '/drawings/competitor/zf/ZF_665A.pdf', fileSize: '~375KB', year: 2023, language: 'en',
        description: 'ZF 665A 豪华游艇', coversModels: ['ZF 665A'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'zf-3050a', title: 'ZF 3050A Datasheet', fileName: 'ZF_3050A.pdf',
        filePath: '/drawings/competitor/zf/ZF_3050A.pdf', fileSize: '~867KB', year: 2023, language: 'en',
        description: 'ZF 3050A 大功率', coversModels: ['ZF 3050A'], hasOutlineDrawings: true, hasSpecTables: true }
    ]
  },

  // ================================================================
  // Reintjes — 产品指南 + WAF/LAF单系列
  // ================================================================
  Reintjes: {
    status: 'available',
    catalogs: [
      {
        id: 'reintjes-product-guide-2024',
        title: 'REINTJES Product Guide 2024 (完整版)',
        fileName: 'REINTJES_Product_Guide_2024.pdf',
        filePath: '/drawings/competitor/reintjes/REINTJES_Product_Guide_2024.pdf',
        sourceUrl: 'https://karlsenner.com/wp-content/uploads/2024/07/REINTJES-Product-Guide-2024_web-2.pdf',
        fileSize: '~5MB',
        year: 2024,
        language: 'en',
        description: 'Reintjes完整产品指南，含WAF/WVS/WLS/WGF/WF全系列外形图和尺寸表',
        coversModels: ['WAF 164-760', 'WVS 234-2240', 'WLS全系列', 'WGF全系列', 'WF 350-580', 'VLJ', 'DLG'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'reintjes-waf-laf-164-573',
        title: 'WAF/LAF 164-573 Workboats (250-1200kW)',
        fileName: 'WAF_LAF_164-573.pdf',
        filePath: '/drawings/competitor/reintjes/WAF_LAF_164-573.pdf',
        sourceUrl: 'https://reintjes-gears.de/wp-content/uploads/2025/02/WAF_LAF-164-573_GB_web.pdf',
        fileSize: '~3MB',
        year: 2025,
        language: 'en',
        description: 'WAF/LAF 164-573工作船系列专册（含详细外形图）',
        coversModels: ['WAF 164', 'WAF 244', 'WAF 274', 'WAF 340', 'WAF 344L', 'WAF 364L', 'WAF 374L', 'WAF 444L', 'WAF 474', 'WAF 540', 'WAF 573', 'LAF同系列'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      { id: 'reintjes-general-guide', title: 'Reintjes General Gearbox Guide (XMH)', fileName: 'Reintjes_General_Guide.pdf',
        filePath: '/drawings/competitor/reintjes/Reintjes_General_Guide.pdf',
        sourceUrl: 'http://www.xmh.com.sg/XMHH/wp-content/uploads/Catalogue/Reintjes/Reintjes%20Gearbox.pdf',
        fileSize: '~2.4MB', year: 2022, language: 'en',
        description: 'Reintjes通用齿轮箱指南（XMH新加坡经销商）', coversModels: ['WAF/LAF全系列', 'WVS全系列'], hasOutlineDrawings: true, hasSpecTables: true }
    ]
  },

  // ================================================================
  // FADA 发达 — Aurora Marine经销商数据表
  // ================================================================
  FADA: {
    status: 'available',
    catalogs: [
      { id: 'fada-fd170', title: 'FADA FD170 Datasheet', fileName: 'FADA_FD170_Datasheet.pdf',
        filePath: '/drawings/competitor/fada/FADA_FD170_Datasheet.pdf', fileSize: '~276KB', year: 2024, language: 'en',
        description: 'FD170 小功率齿轮箱(max 97.5kW)', coversModels: ['FD170'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'fada-fd242', title: 'FADA FD242 Datasheet', fileName: 'FADA_FD242_Datasheet.pdf',
        filePath: '/drawings/competitor/fada/FADA_FD242_Datasheet.pdf', fileSize: '~273KB', year: 2024, language: 'en',
        description: 'FD242 中功率齿轮箱(max 257.5kW)', coversModels: ['FD242'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'fada-fd300', title: 'FADA FD300 Datasheet', fileName: 'FADA_FD300_Datasheet.pdf',
        filePath: '/drawings/competitor/fada/FADA_FD300_Datasheet.pdf', fileSize: '~290KB', year: 2025, language: 'en',
        description: 'FD300 中功率齿轮箱(max 642.5kW)', coversModels: ['FD300'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'fada-j300', title: 'FADA J300 Datasheet', fileName: 'FADA_J300_Datasheet.pdf',
        filePath: '/drawings/competitor/fada/FADA_J300_Datasheet.pdf', fileSize: '~260KB', year: 2024, language: 'en',
        description: 'J300 减速齿轮箱(max 705kW)', coversModels: ['J300'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'fada-j400a', title: 'FADA J400A Datasheet', fileName: 'FADA_J400A_Datasheet.pdf',
        filePath: '/drawings/competitor/fada/FADA_J400A_Datasheet.pdf', fileSize: '~262KB', year: 2024, language: 'en',
        description: 'J400A 大功率齿轮箱', coversModels: ['J400A'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'fada-jd400a', title: 'FADA JD400A Datasheet', fileName: 'FADA_JD400A_Datasheet.pdf',
        filePath: '/drawings/competitor/fada/FADA_JD400A_Datasheet.pdf', fileSize: '~279KB', year: 2024, language: 'en',
        description: 'JD400A 双速齿轮箱(max 595.8kW)', coversModels: ['JD400A'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'fada-j600a', title: 'FADA J600A Datasheet', fileName: 'FADA_J600A_Datasheet.pdf',
        filePath: '/drawings/competitor/fada/FADA_J600A_Datasheet.pdf', fileSize: '~277KB', year: 2024, language: 'en',
        description: 'J600A 大功率齿轮箱(max 860kW)', coversModels: ['J600A'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'fada-j900a', title: 'FADA J900A Datasheet', fileName: 'FADA_J900A_Datasheet.pdf',
        filePath: '/drawings/competitor/fada/FADA_J900A_Datasheet.pdf', fileSize: '~261KB', year: 2024, language: 'en',
        description: 'J900A 大功率齿轮箱(max 1120kW)', coversModels: ['J900A'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'fada-j1200a', title: 'FADA J1200A Datasheet', fileName: 'FADA_J1200A_Datasheet.pdf',
        filePath: '/drawings/competitor/fada/FADA_J1200A_Datasheet.pdf', fileSize: '~262KB', year: 2024, language: 'en',
        description: 'J1200A 大功率齿轮箱(max 1395kW)', coversModels: ['J1200A'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'fada-jt650-1', title: 'FADA JT650/1 Datasheet', fileName: 'FADA_JT650-1_Datasheet.pdf',
        filePath: '/drawings/competitor/fada/FADA_JT650-1_Datasheet.pdf', fileSize: '~289KB', year: 2024, language: 'en',
        description: 'JT650/1 高减速比齿轮箱', coversModels: ['JT650/1'], hasOutlineDrawings: true, hasSpecTables: true }
    ]
  },

  // ================================================================
  // D-I Industrial (DongI 韩国) — 官网手册 + 经销商目录
  // ================================================================
  DongI: {
    status: 'available',
    catalogs: [
      {
        id: 'di-full-catalog',
        title: 'D-I Marine Transmissions Full Catalog',
        fileName: 'DMT_Full_Catalog.pdf',
        filePath: '/drawings/competitor/di-industrial/DMT_Full_Catalog.pdf',
        sourceUrl: 'http://www.xmh.com.sg/XMHH/wp-content/uploads/Catalogue/Marine%20Gearboxes/D-I%20Marine%20Transmissions.pdf',
        fileSize: '~2.6MB',
        year: 2023,
        language: 'en',
        description: 'D-I Industrial DMT全系列产品目录（XMH经销商，含外形图和尺寸数据）',
        coversModels: ['DMT18A', 'DMT25AL', 'DMT50A', 'DMT70T', 'DMT90A', 'DMT100HL', 'DMT110A', 'DMT140H', 'DMT150H', 'DMT200H', 'DMT240H', 'DMT260H', 'DMT280H', 'DMT400H', 'DMT600BL'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'di-dmt50a',
        title: 'DMT50A Official Brochure',
        fileName: 'DMT50A_Brochure.pdf',
        filePath: '/drawings/competitor/di-industrial/DMT50A_Brochure.pdf',
        sourceUrl: 'http://d-i.co.kr/eng/wp-content/uploads/sites/2/2021/05/Marine-Transmission_DMT50A_Brochure.pdf',
        fileSize: '~500KB',
        year: 2021,
        language: 'en',
        description: 'DMT50A官方产品手册（含详细外形图）',
        coversModels: ['DMT50A'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'di-dmt400h',
        title: 'DMT400H Official Brochure',
        fileName: 'DMT400H_Brochure.pdf',
        filePath: '/drawings/competitor/di-industrial/DMT400H_Brochure.pdf',
        sourceUrl: 'http://d-i.co.kr/eng/wp-content/uploads/sites/2/2021/05/Marine-Transmission_DMT400H_Brochure.pdf',
        fileSize: '~883KB',
        year: 2021,
        language: 'en',
        description: 'DMT400H官方产品手册（max 836kW，含详细外形图）',
        coversModels: ['DMT400H'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      // Round 4 补充
      { id: 'di-dmt110a', title: 'DMT110A Official Brochure', fileName: 'DMT110A_Brochure.pdf',
        filePath: '/drawings/competitor/di-industrial/DMT110A_Brochure.pdf', fileSize: '~318KB', year: 2021, language: 'en',
        description: 'DMT110A官方产品手册(206-275kW)', coversModels: ['DMT110A'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'di-dmt140h', title: 'DMT140H Official Brochure', fileName: 'DMT140H_Brochure.pdf',
        filePath: '/drawings/competitor/di-industrial/DMT140H_Brochure.pdf', fileSize: '~562KB', year: 2021, language: 'en',
        description: 'DMT140H官方产品手册', coversModels: ['DMT140H'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'di-dmt260h', title: 'DMT260H Official Brochure', fileName: 'DMT260H_Brochure.pdf',
        filePath: '/drawings/competitor/di-industrial/DMT260H_Brochure.pdf', fileSize: '~760KB', year: 2021, language: 'en',
        description: 'DMT260H官方产品手册', coversModels: ['DMT260H'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'di-series-guide', title: 'DMT Series Guide', fileName: 'DMT_Series_Guide.pdf',
        filePath: '/drawings/competitor/di-industrial/DMT_Series_Guide.pdf', fileSize: '~399KB', year: 2021, language: 'en',
        description: 'DMT全系列概览指南', coversModels: ['DMT全系列'], hasOutlineDrawings: true, hasSpecTables: true }
    ]
  },

  // ================================================================
  // Masson Marine — 选型指南 + 工作船指南
  // ================================================================
  MassonMarine: {
    status: 'available',
    catalogs: [
      {
        id: 'masson-selection-guide',
        title: 'Masson Marine Selection Guide V3',
        fileName: 'Masson_Marine_Selection_Guide.pdf',
        filePath: '/drawings/competitor/masson-marine/Masson_Marine_Selection_Guide.pdf',
        sourceUrl: 'https://www.vitellisrl.it/pdf/masson-marine-guide-v3_1478508425.pdf',
        fileSize: '~2.3MB',
        year: 2023,
        language: 'en',
        description: 'Masson Marine W系列完整选型指南（含外形图和尺寸表A/B1/B2/C/H/L）',
        coversModels: ['W1900', 'W3100', 'W3300', 'W3350', 'W3450', 'W3700', 'W4400', 'W6000', 'W8000', 'W12000'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'masson-workboat-guide',
        title: 'Masson Marine Workboat Guide',
        fileName: 'Masson_Marine_Workboat_Guide.pdf',
        filePath: '/drawings/competitor/masson-marine/Masson_Marine_Workboat_Guide.pdf',
        sourceUrl: 'http://www.gm-turbo.hr/brosure/masson/catalog_002.pdf',
        fileSize: '~5MB',
        year: 2023,
        language: 'en',
        description: 'Masson Marine工作船完整选型手册（GM-Turbo经销商）',
        coversModels: ['W全系列', 'N系列', 'CPP系统'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      }
    ]
  },

  // ================================================================
  // NGC 南高齿 — 综合产品样本
  // ================================================================
  NGC: {
    status: 'available',
    catalogs: [
      {
        id: 'ngc-composite-sample',
        title: 'NGC Marine Composite Sample (英文版)',
        fileName: 'NGC_Marine_Composite_Sample.pdf',
        filePath: '/drawings/competitor/ngc/NGC_Marine_Composite_Sample.pdf',
        sourceUrl: 'http://www.ngc-marine.com/en/images/Composite_Sample.pdf',
        fileSize: '~3MB',
        year: 2023,
        language: 'en',
        description: 'NGC Marine综合产品样本（含CG/CK/FP系列概述）',
        coversModels: ['CG系列', 'CK系列', 'FP系列', 'NRP系列'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'ngc-cg-gearbox',
        title: 'NGC CG Series Gearbox (FPP)',
        fileName: 'NGC_CG_Gearbox.pdf',
        filePath: '/drawings/competitor/ngc/NGC_CG_Gearbox.pdf',
        sourceUrl: 'http://www.ngc-marine.com/images/CG_Gearbox.pdf',
        fileSize: '~6.5MB',
        year: 2023,
        language: 'en',
        description: 'NGC CG系列定距桨齿轮箱产品样本（含外形图和尺寸表）',
        coversModels: ['CG系列（CGV/CGH/CGTS等）'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      // Round 4 补充
      { id: 'ngc-ck-gearbox', title: 'NGC CK Series Gearbox (CPP)', fileName: 'NGC_CK_Gearbox.pdf',
        filePath: '/drawings/competitor/ngc/NGC_CK_Gearbox.pdf',
        sourceUrl: 'http://www.ngc-marine.com/images/CK_Gearbox.pdf', fileSize: '~6.2MB', year: 2023, language: 'en',
        description: 'NGC CK系列可调桨齿轮箱产品样本（含PTO/PTI，max 17000kW）',
        coversModels: ['CKV系列', 'CKH系列', 'CKTS系列'], hasOutlineDrawings: true, hasSpecTables: true },
      { id: 'ngc-products-cn', title: 'NGC Marine 产品样本 (中文版)', fileName: 'NGC_Marine_Products_CN.pdf',
        filePath: '/drawings/competitor/ngc/NGC_Marine_Products_CN.pdf',
        sourceUrl: 'http://www.ngc-marine.com/images/NGC_Marine_Products_ch.pdf', fileSize: '~16MB', year: 2023, language: 'zh',
        description: 'NGC Marine中文完整产品样本（含CG/CK/FP/NRP/NCP全系列）',
        coversModels: ['CG系列', 'CK系列', 'FP系列', 'NRP系列', 'NCP系列'], hasOutlineDrawings: true, hasSpecTables: true }
    ]
  },

  // ================================================================
  // PRM Newage — 产品手册 + 规格表
  // ================================================================
  PRM: {
    status: 'available',
    catalogs: [
      {
        id: 'prm-owners-handbook',
        title: 'PRM Owners Handbook (全型号)',
        fileName: 'PRM_Owners_Handbook.pdf',
        filePath: '/drawings/competitor/prm/PRM_Owners_Handbook.pdf',
        sourceUrl: 'https://www.prm-newage.com/media/PRM%20Owners%20Handbook.pdf',
        fileSize: '~3MB',
        year: 2023,
        language: 'en',
        description: 'PRM全系列产品手册（PRM80-1750，含外形图和安装尺寸）',
        coversModels: ['PRM80', 'PRM120', 'PRM150', 'PRM260', 'PRM280', 'PRM500', 'PRM750', 'PRM1000', 'PRM1500', 'PRM1750'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'prm-750-spec',
        title: 'PRM 750 Specification Sheet',
        fileName: 'PRM750_Spec.pdf',
        filePath: '/drawings/competitor/prm/PRM750_Spec.pdf',
        sourceUrl: 'https://www.peachment.co.uk/wp-content/uploads/PRM750.pdf',
        fileSize: '~200KB',
        year: 2023,
        language: 'en',
        description: 'PRM 750规格表（含外形图）',
        coversModels: ['PRM750'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      },
      {
        id: 'prm-500-spec',
        title: 'PRM 500 Specification Sheet',
        fileName: 'PRM500_Spec.pdf',
        filePath: '/drawings/competitor/prm/PRM500_Spec.pdf',
        sourceUrl: 'https://www.peachment.co.uk/wp-content/uploads/PRM500.pdf',
        fileSize: '~200KB',
        year: 2023,
        language: 'en',
        description: 'PRM 500规格表（含外形图）',
        coversModels: ['PRM500'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      }
    ]
  },

  // ================================================================
  // Kanzaki/Yanmar — 操作手册
  // ================================================================
  Kanzaki: {
    status: 'available',
    catalogs: [
      {
        id: 'kanzaki-kmh40-50',
        title: 'KMH40A/KMH50A Operation Manual',
        fileName: 'KMH40_50_Manual.pdf',
        filePath: '/drawings/competitor/kanzaki/KMH40_50_Manual.pdf',
        sourceUrl: 'https://www.navela.hr/site_media/media/uploads/engines/documents/KMH40_50_OM_EN.pdf',
        fileSize: '~2MB',
        year: 2019,
        language: 'en',
        description: 'Kanzaki KMH40A/KMH50A操作手册（含外形图和安装尺寸）',
        coversModels: ['KMH40A', 'KMH50A'],
        hasOutlineDrawings: true,
        hasSpecTables: true
      }
    ]
  },

  // ================================================================
  // 无公开图纸的品牌
  // ================================================================
  CZCG: {
    status: 'unavailable',
    reason: '国有军工企业（中国船舶集团），技术资料保密，无公开外形图。可访问 chongchi.com 查看产品概述页面。',
    catalogs: []
  },
  Wartsila: {
    status: 'unavailable',
    reason: '定制工程方案（600-25000kW），无标准产品数据手册公开下载。需联系Wartsila获取项目特定资料。',
    catalogs: []
  },
  Kumera: {
    status: 'unavailable',
    reason: '定制CPP齿轮箱为主。Power-Plaza在线配置器(power-plaza.com)需注册账户。',
    catalogs: []
  },
  Hundested: {
    status: 'unavailable',
    reason: '全部丹麦定制生产，无标准化产品图册。',
    catalogs: []
  },
  DCSG: {
    status: 'unavailable',
    reason: '无公开产品图册资料。',
    catalogs: []
  },
  Fenjin: {
    status: 'unavailable',
    reason: '官网(fenjin-gearbox.com)有产品页但PDF链接需逐型号获取，暂未批量收录。',
    catalogs: []
  },
  HANGCHI: {
    status: 'unavailable',
    reason: '杭齿产品请使用"资料库 → 外形图库"模块查看。',
    catalogs: []
  }
};

// ============================================================
// 工具函数
// ============================================================

/** 获取PDF完整URL */
export const getCompetitorPdfUrl = (filePath) =>
  `${COMPETITOR_DRAWINGS_BASE_URL}${filePath}`;

/** 获取所有品牌的图纸可用状态 */
export const getDrawingAvailability = () => {
  return Object.entries(competitorDrawingsCatalog).map(([mfgId, data]) => ({
    manufacturer: mfgId,
    name: competitors[mfgId]?.shortName || mfgId,
    status: data.status,
    reason: data.reason || null,
    catalogCount: data.catalogs.length,
    color: manufacturerColors[mfgId] || '#999'
  }));
};

/** 获取指定品牌的目录列表 */
export const getCatalogsForManufacturer = (mfgId) => {
  const entry = competitorDrawingsCatalog[mfgId];
  if (!entry) return { status: 'unavailable', reason: '品牌未收录', catalogs: [] };
  return entry;
};

/** 搜索竞品图纸（按品牌名/目录标题/覆盖型号） */
export const searchCompetitorDrawings = (keyword) => {
  if (!keyword || keyword.trim().length === 0) return [];
  const kw = keyword.toLowerCase().trim();
  const results = [];

  Object.entries(competitorDrawingsCatalog).forEach(([mfgId, data]) => {
    if (data.status !== 'available') return;
    const mfgName = (competitors[mfgId]?.shortName || mfgId).toLowerCase();

    data.catalogs.forEach(catalog => {
      const titleMatch = catalog.title.toLowerCase().includes(kw);
      const mfgMatch = mfgName.includes(kw) || mfgId.toLowerCase().includes(kw);
      const modelMatch = catalog.coversModels?.some(m => m.toLowerCase().includes(kw));

      if (titleMatch || mfgMatch || modelMatch) {
        results.push({
          ...catalog,
          manufacturer: mfgId,
          manufacturerName: competitors[mfgId]?.shortName || mfgId,
          matchType: titleMatch ? 'title' : mfgMatch ? 'manufacturer' : 'model'
        });
      }
    });
  });

  return results;
};

/** 统计信息 */
export const getCompetitorDrawingStats = () => {
  const entries = Object.values(competitorDrawingsCatalog);
  const available = entries.filter(e => e.status === 'available');
  const totalCatalogs = available.reduce((sum, e) => sum + e.catalogs.length, 0);
  return {
    totalManufacturers: entries.length,
    availableManufacturers: available.length,
    unavailableManufacturers: entries.length - available.length,
    totalCatalogs
  };
};

export default {
  COMPETITOR_DRAWINGS_BASE_URL,
  competitorDrawingsCatalog,
  getCompetitorPdfUrl,
  getDrawingAvailability,
  getCatalogsForManufacturer,
  searchCompetitorDrawings,
  getCompetitorDrawingStats
};
