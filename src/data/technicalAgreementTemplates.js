// src/data/technicalAgreementTemplates.js
// 技术协议模板映射表
// 数据来源: 历史技术协议文档 (82个文件)
// 更新时间: 2026-01-22

const BASE_PATH = '/templates';

/**
 * 技术协议模板列表
 * 按齿轮箱系列分类
 */
export const technicalAgreementTemplates = [
  // =====================
  // GWC系列
  // =====================
  {
    id: 'gwc3941-1',
    model: 'GWC39.41',
    title: 'GWC39.41技术协议',
    filename: 'GWC39.41技术协议2013.5.16.doc',
    path: `${BASE_PATH}/GWC39.41技术协议2013.5.16.doc`,
    category: 'GWC',
    type: 'doc',
    year: 2013
  },
  {
    id: 'gwc3941-2',
    model: 'GWC39.41',
    title: 'GWC3941技术协议(大连校对版)',
    filename: 'GWC3941技术协议大连校对版.doc',
    path: `${BASE_PATH}/GWC3941技术协议大连校对版.doc`,
    category: 'GWC',
    type: 'doc',
    year: 2013
  },
  {
    id: 'gwc4549-1',
    model: 'GWC45.49',
    title: 'GWC4549齿轮箱及联轴节技术协议',
    filename: '舟渔，GWC4549 齿轮箱及联轴节技术协议.doc',
    path: `${BASE_PATH}/舟渔，GWC4549 齿轮箱及联轴节技术协议.doc`,
    category: 'GWC',
    type: 'doc',
    year: 2013
  },
  {
    id: 'gwc4954-1',
    model: 'GWC49.54',
    title: 'GWC49.54齿轮箱技术协议',
    filename: 'GWC49.54齿轮箱技术协议.doc',
    path: `${BASE_PATH}/GWC49.54齿轮箱技术协议.doc`,
    category: 'GWC',
    type: 'doc',
    year: 2013
  },
  {
    id: 'gwc5259-1',
    model: 'GWC52.59',
    title: 'GWC5259船用齿轮箱技术协议',
    filename: 'GWC5259船用齿轮箱技术协议.doc',
    path: `${BASE_PATH}/GWC5259船用齿轮箱技术协议.doc`,
    category: 'GWC',
    type: 'doc',
    year: 2012
  },
  {
    id: 'gwc5259-2',
    model: 'GWC52.59',
    title: 'GWC5259船用齿轮箱GL技术协议',
    filename: 'GWC5259船用齿轮箱GL技术协议.doc',
    path: `${BASE_PATH}/GWC5259船用齿轮箱GL技术协议.doc`,
    category: 'GWC',
    type: 'doc',
    year: 2012
  },
  {
    id: 'gwc6066-1',
    model: 'GWC60.66',
    title: 'GWC6066技术协议',
    filename: 'GWC6066技术协议.doc',
    path: `${BASE_PATH}/GWC6066技术协议.doc`,
    category: 'GWC',
    type: 'doc',
    year: 2012
  },
  {
    id: 'gwc6066-2',
    model: 'GWC60.66',
    title: 'GWC60.66B技术协议-500t滚装船',
    filename: 'GWC60.66B技术协议-500t滚装船.doc',
    path: `${BASE_PATH}/GWC60.66B技术协议-500t滚装船.doc`,
    category: 'GWC',
    type: 'doc',
    year: 2012
  },
  {
    id: 'gwc6066-3',
    model: 'GWC60.66',
    title: 'GWC60.66D技术协议-500t滚装船',
    filename: 'GWC60.66D技术协议-500t滚装船.doc',
    path: `${BASE_PATH}/GWC60.66D技术协议-500t滚装船.doc`,
    category: 'GWC',
    type: 'doc',
    year: 2012
  },
  {
    id: 'gwc6675-1',
    model: 'GWC66.75',
    title: 'GWC66.75技术协议(中英)',
    filename: 'GWC66.75技术协议(中英).doc',
    path: `${BASE_PATH}/GWC66.75技术协议(中英).doc`,
    category: 'GWC',
    type: 'doc',
    year: 2012
  },
  {
    id: 'gwc6675-2',
    model: 'GWC66.75',
    title: 'GWC66.75技术协议-8500DWT(中英)',
    filename: 'GWC66.75技术协议-8500DWT（中英）.doc',
    path: `${BASE_PATH}/GWC66.75技术协议-8500DWT（中英）.doc`,
    category: 'GWC',
    type: 'doc',
    year: 2012
  },

  // =====================
  // GWS系列
  // =====================
  {
    id: 'gws4954-1',
    model: 'GWS49.54',
    title: 'GWS4954齿轮箱技术协议(气控双机)',
    filename: 'GWS4954齿轮箱技术协议（气控 双机）20140409 大连.doc',
    path: `${BASE_PATH}/GWS4954齿轮箱技术协议（气控 双机）20140409 大连.doc`,
    category: 'GWS',
    type: 'doc',
    year: 2014
  },

  // =====================
  // HC系列
  // =====================
  {
    id: 'hc1000-1',
    model: 'HC1000',
    title: 'HC1000技术协议',
    filename: 'HC1000技术协议.doc',
    path: `${BASE_PATH}/HC1000技术协议.doc`,
    category: 'HC',
    type: 'doc',
    year: 2014
  },
  {
    id: 'hc1000-2',
    model: 'HC1000',
    title: 'HC1000技术协议(国合)',
    filename: '大连渔轮公司HC1000技术协议（国合）.pdf',
    path: `${BASE_PATH}/大连渔轮公司HC1000技术协议（国合）.pdf`,
    category: 'HC',
    type: 'pdf',
    year: 2014
  },
  {
    id: 'hc1200-1',
    model: 'HC1200',
    title: 'HC1200齿轮箱技术协议-37.86米冷冻拖网渔船',
    filename: '37.86米冷冻拖网渔船-HC1200齿轮箱技术协议（杭齿） 20140226.doc',
    path: `${BASE_PATH}/37.86米冷冻拖网渔船-HC1200齿轮箱技术协议（杭齿） 20140226.doc`,
    category: 'HC',
    type: 'doc',
    year: 2014
  },

  // =====================
  // HCD系列
  // =====================
  {
    id: 'hcd400a-1',
    model: 'HCD400A',
    title: 'HCD400A技术协议',
    filename: 'HCD400A技术协议（发大连前进）20131217.doc',
    path: `${BASE_PATH}/HCD400A技术协议（发大连前进）20131217.doc`,
    category: 'HCD',
    type: 'doc',
    year: 2013
  },
  {
    id: 'hcd600a-1',
    model: 'HCD600A',
    title: 'HCD600A技术协议',
    filename: 'HCD600A技术协议（发大连前进）20121205.doc',
    path: `${BASE_PATH}/HCD600A技术协议（发大连前进）20121205.doc`,
    category: 'HCD',
    type: 'doc',
    year: 2012
  },
  {
    id: 'hcd1400-1',
    model: 'HCD1400',
    title: 'HCD1400技术协议',
    filename: 'HCD1400技术协议（发大连前进）20121119.doc',
    path: `${BASE_PATH}/HCD1400技术协议（发大连前进）20121119.doc`,
    category: 'HCD',
    type: 'doc',
    year: 2012
  },

  // =====================
  // HCT系列
  // =====================
  {
    id: 'hct1600-1',
    model: 'HCT1600',
    title: 'HCT1600技术协议',
    filename: 'HCT1600技术协议.doc',
    path: `${BASE_PATH}/HCT1600技术协议.doc`,
    category: 'HCT',
    type: 'doc',
    year: 2014
  },
  {
    id: 'hct1600-2',
    model: 'HCT1600',
    title: 'HCT1600补充技术协议',
    filename: 'HCT1600补充技术协议.docx',
    path: `${BASE_PATH}/HCT1600补充技术协议.docx`,
    category: 'HCT',
    type: 'docx',
    year: 2014
  },

  // =====================
  // HCQ系列
  // =====================
  {
    id: 'hcq501-1',
    model: 'HCQ501',
    title: 'HCQ501齿轮箱技术协议',
    filename: 'HCQ501齿轮箱技术协议(大连 20140528).doc',
    path: `${BASE_PATH}/HCQ501齿轮箱技术协议(大连 20140528).doc`,
    category: 'HCQ',
    type: 'doc',
    year: 2014
  },
  {
    id: 'hcq700-1',
    model: 'HCQ700',
    title: 'HCQ700订货技术协议',
    filename: 'HCQ700订货技术协议-20130313（大前）.doc',
    path: `${BASE_PATH}/HCQ700订货技术协议-20130313（大前）.doc`,
    category: 'HCQ',
    type: 'doc',
    year: 2013
  },

  // =====================
  // 其他系列
  // =====================
  {
    id: 'hcl-1',
    model: 'HCL',
    title: 'HCL技术协议',
    filename: 'HCL技术协议.doc',
    path: `${BASE_PATH}/HCL技术协议.doc`,
    category: '其他',
    type: 'doc',
    year: 2012
  },
  {
    id: 'hcu120-1',
    model: 'HCU120',
    title: 'HCU120技术协议',
    filename: 'HCU120技术协议(1).doc',
    path: `${BASE_PATH}/HCU120技术协议(1).doc`,
    category: '其他',
    type: 'doc',
    year: 2012
  },
  {
    id: 'hcv230-1',
    model: 'HCV230',
    title: 'HCV230技术协议',
    filename: 'HCV230技术协议.doc',
    path: `${BASE_PATH}/HCV230技术协议.doc`,
    category: '其他',
    type: 'doc',
    year: 2012
  },
  {
    id: 't300-1',
    model: 'T300',
    title: 'T300技术协议',
    filename: 'T300技术协议(发大连公司20140217).doc',
    path: `${BASE_PATH}/T300技术协议(发大连公司20140217).doc`,
    category: '其他',
    type: 'doc',
    year: 2014
  },
  {
    id: 't300-2',
    model: 'T300',
    title: 'T300技术协议(PDF)',
    filename: 'T300技术协议.PDF',
    path: `${BASE_PATH}/T300技术协议.PDF`,
    category: '其他',
    type: 'pdf',
    year: 2014
  },
  {
    id: '300-1',
    model: '300',
    title: '300技术协议',
    filename: '300技术协议.doc',
    path: `${BASE_PATH}/300技术协议.doc`,
    category: '其他',
    type: 'doc',
    year: 2012
  },
  {
    id: '300-2',
    model: '300',
    title: '丹东旭成300双机双桨技术协议',
    filename: '丹东旭成300双机双桨技术协议.doc',
    path: `${BASE_PATH}/丹东旭成300双机双桨技术协议.doc`,
    category: '其他',
    type: 'doc',
    year: 2012
  },
  {
    id: 'csy2900-1',
    model: 'CSY2900',
    title: 'CSY2900齿轮箱技术协议',
    filename: 'CSY2900齿轮箱技术协议.pdf',
    path: `${BASE_PATH}/CSY2900齿轮箱技术协议.pdf`,
    category: '其他',
    type: 'pdf',
    year: 2013
  },
  {
    id: 'gcst34b-1',
    model: 'GCST34B',
    title: 'GCST34B船用齿轮箱技术协议',
    filename: 'GCST34B船用齿轮箱技术协议.doc',
    path: `${BASE_PATH}/GCST34B船用齿轮箱技术协议.doc`,
    category: '其他',
    type: 'doc',
    year: 2012
  },

  // =====================
  // 高弹联轴器
  // =====================
  {
    id: 'hgtl35-1',
    model: 'HGTL3.5',
    title: 'HGTL3.5DFDP高弹技术协议',
    filename: '技术协议-专业捕虾船前端传动装置HGTL3.5DFDP高弹(121203).doc',
    path: `${BASE_PATH}/技术协议-专业捕虾船前端传动装置HGTL3.5DFDP高弹(121203).doc`,
    category: '高弹联轴器',
    type: 'doc',
    year: 2012
  },
  {
    id: 'hgtl45-1',
    model: 'HGTL4.5',
    title: 'HGTL4.5DFDP高弹技术协议',
    filename: '技术协议-专业捕虾船前端传动装置HGTL4.5DFDP高弹(121203).doc',
    path: `${BASE_PATH}/技术协议-专业捕虾船前端传动装置HGTL4.5DFDP高弹(121203).doc`,
    category: '高弹联轴器',
    type: 'doc',
    year: 2012
  },
  {
    id: 'coupling-1',
    model: '高弹联轴器',
    title: '高弹性联轴器技术协议(2012)',
    filename: '高弹性联轴器技术协议20121208.doc',
    path: `${BASE_PATH}/高弹性联轴器技术协议20121208.doc`,
    category: '高弹联轴器',
    type: 'doc',
    year: 2012
  },

  // =====================
  // 通用模板
  // =====================
  {
    id: 'template-1',
    model: '通用模板',
    title: '单页订货技术协议模板',
    filename: '单页订货技术协议模板2012改.doc',
    path: `${BASE_PATH}/单页订货技术协议模板2012改.doc`,
    category: '通用模板',
    type: 'doc',
    year: 2012,
    isTemplate: true
  },
  {
    id: 'template-2',
    model: '通用模板',
    title: '多页技术协议模板',
    filename: '多页技术协议模板2012.doc',
    path: `${BASE_PATH}/多页技术协议模板2012.doc`,
    category: '通用模板',
    type: 'doc',
    year: 2012,
    isTemplate: true
  },
  {
    id: 'template-3',
    model: '通用模板',
    title: '齿轮箱及附件供货技术协议',
    filename: '齿轮箱及附件供货技术协议.doc',
    path: `${BASE_PATH}/齿轮箱及附件供货技术协议.doc`,
    category: '通用模板',
    type: 'doc',
    year: 2012,
    isTemplate: true
  },
  {
    id: 'template-4',
    model: '通用模板',
    title: '齿轮箱技术协议(2012)',
    filename: '齿轮箱技术协议20121208.doc',
    path: `${BASE_PATH}/齿轮箱技术协议20121208.doc`,
    category: '通用模板',
    type: 'doc',
    year: 2012,
    isTemplate: true
  },

  // =====================
  // 项目案例
  // =====================
  {
    id: 'project-1',
    model: '渔政船',
    title: '旅顺100T渔政船齿轮箱技术协议',
    filename: '旅顺100T渔政船-齿轮箱技术协议.pdf',
    path: `${BASE_PATH}/旅顺100T渔政船-齿轮箱技术协议.pdf`,
    category: '项目案例',
    type: 'pdf',
    year: 2013
  },
  {
    id: 'project-2',
    model: '渔政船',
    title: '曹妃甸100T渔政船齿轮箱技术协议',
    filename: '曹妃甸100T渔政船-齿轮箱技术协议.pdf',
    path: `${BASE_PATH}/曹妃甸100T渔政船-齿轮箱技术协议.pdf`,
    category: '项目案例',
    type: 'pdf',
    year: 2013
  },
  {
    id: 'project-3',
    model: '1000吨',
    title: '7#1000吨杭齿技术协议',
    filename: '7#1000吨杭齿技术协议.doc',
    path: `${BASE_PATH}/7#1000吨杭齿技术协议.doc`,
    category: '项目案例',
    type: 'doc',
    year: 2012
  },
  {
    id: 'project-4',
    model: '1000吨',
    title: '7#1000吨杭齿技术协议(整定值)',
    filename: '7#1000吨杭齿技术协议（增加整定值及量程）.doc',
    path: `${BASE_PATH}/7#1000吨杭齿技术协议（增加整定值及量程）.doc`,
    category: '项目案例',
    type: 'doc',
    year: 2012
  },
  {
    id: 'project-5',
    model: 'HCT1600',
    title: 'DY846大连渔轮技术协议(HCT1600)',
    filename: 'DY846大连渔轮技术协议（HCT1600）.doc',
    path: `${BASE_PATH}/DY846大连渔轮技术协议（HCT1600）.doc`,
    category: '项目案例',
    type: 'doc',
    year: 2014
  },
  {
    id: 'project-6',
    model: 'G128ZLCa3',
    title: 'G128ZLCa3技术协议',
    filename: 'G128ZLCa3技术协议.doc',
    path: `${BASE_PATH}/G128ZLCa3技术协议.doc`,
    category: '项目案例',
    type: 'doc',
    year: 2012
  },
  {
    id: 'project-7',
    model: 'LJ360-1A',
    title: '石泵厂LJ360-1A泥泵齿轮箱技术协议',
    filename: '石泵厂LJ360-1A泥泵齿轮箱技术协议书10-12-10.doc',
    path: `${BASE_PATH}/石泵厂LJ360-1A泥泵齿轮箱技术协议书10-12-10.doc`,
    category: '项目案例',
    type: 'doc',
    year: 2010
  },

  // =====================
  // 补充GWC系列
  // =====================
  {
    id: 'gwc3941-3',
    model: 'GWC39.41',
    title: 'GWC39.41技术协议(大连公司)',
    filename: 'GWC39.41技术协议（20130428发大连公司）.doc',
    path: `${BASE_PATH}/GWC39.41技术协议（20130428发大连公司）.doc`,
    category: 'GWC',
    type: 'doc',
    year: 2013
  },
  {
    id: 'gwc4954-2',
    model: 'GWC49.54',
    title: 'GWC49.54技术协议2',
    filename: 'GWC49.54技术协议2.doc',
    path: `${BASE_PATH}/GWC49.54技术协议2.doc`,
    category: 'GWC',
    type: 'doc',
    year: 2013
  },
  {
    id: 'gwc5259-3',
    model: 'GWC52.59',
    title: 'GWC5259技术协议',
    filename: 'GWC5259技术协议.doc',
    path: `${BASE_PATH}/GWC5259技术协议.doc`,
    category: 'GWC',
    type: 'doc',
    year: 2012
  },
  {
    id: 'gwc5259-4',
    model: 'GWC52.59',
    title: 'GWC5259技术协议-中策8300',
    filename: 'GWC5259技术协议中策8300.doc',
    path: `${BASE_PATH}/GWC5259技术协议中策8300.doc`,
    category: 'GWC',
    type: 'doc',
    year: 2012
  },
  {
    id: 'gwc4549-2',
    model: 'GWC45.49',
    title: 'GWC4549齿轮箱及联轴节技术协议(20130321)',
    filename: '舟渔，GWC4549 齿轮箱及联轴节技术协议20130321.doc',
    path: `${BASE_PATH}/舟渔，GWC4549 齿轮箱及联轴节技术协议20130321.doc`,
    category: 'GWC',
    type: 'doc',
    year: 2013
  },
  {
    id: 'gwc6066-4',
    model: 'GWC60.66',
    title: 'GWC60.66D技术协议(2012.07.24)',
    filename: 'GWC60[1].66D技术协议2012.07.24.doc',
    path: `${BASE_PATH}/GWC60[1].66D技术协议2012.07.24.doc`,
    category: 'GWC',
    type: 'doc',
    year: 2012
  },

  // =====================
  // 补充HC系列
  // =====================
  {
    id: 'hc1000-3',
    model: 'HC1000',
    title: 'HC1000技术协议(附件)',
    filename: '（附件）HC1000技术协议20140430.doc',
    path: `${BASE_PATH}/（附件）HC1000技术协议20140430.doc`,
    category: 'HC',
    type: 'doc',
    year: 2014
  },
  {
    id: 'hc1000-4',
    model: 'HC1000',
    title: 'HC1000技术协议(编号140395)',
    filename: 'HC1000(技术协议编号140395）.pdf',
    path: `${BASE_PATH}/HC1000(技术协议编号140395）.pdf`,
    category: 'HC',
    type: 'pdf',
    year: 2014
  },

  // =====================
  // 补充HCD系列
  // =====================
  {
    id: 'hcd400a-2',
    model: 'HCD400A',
    title: 'HCD400A技术协议(20121204)',
    filename: 'HCD400A技术协议（发大连前进）20121204.doc',
    path: `${BASE_PATH}/HCD400A技术协议（发大连前进）20121204.doc`,
    category: 'HCD',
    type: 'doc',
    year: 2012
  },
  {
    id: 'hcd600a-2',
    model: 'HCD600A',
    title: 'HCD600A技术协议(20121204)',
    filename: 'HCD600A技术协议（发大连前进）20121204.doc',
    path: `${BASE_PATH}/HCD600A技术协议（发大连前进）20121204.doc`,
    category: 'HCD',
    type: 'doc',
    year: 2012
  },

  // =====================
  // 补充通用模板
  // =====================
  {
    id: 'template-5',
    model: '通用模板',
    title: '齿轮箱技术协议(20121025)',
    filename: '齿轮箱技术协议20121025.doc',
    path: `${BASE_PATH}/齿轮箱技术协议20121025.doc`,
    category: '通用模板',
    type: 'doc',
    year: 2012,
    isTemplate: true
  },
  {
    id: 'template-6',
    model: '通用模板',
    title: '齿轮箱及附件供货技术协议(已改)',
    filename: '齿轮箱及附件供货技术协议已改.doc',
    path: `${BASE_PATH}/齿轮箱及附件供货技术协议已改.doc`,
    category: '通用模板',
    type: 'doc',
    year: 2012,
    isTemplate: true
  },
  {
    id: 'template-7',
    model: '通用模板',
    title: '技术协议(通用)',
    filename: '技术协议.doc',
    path: `${BASE_PATH}/技术协议.doc`,
    category: '通用模板',
    type: 'doc',
    year: 2012,
    isTemplate: true
  },

  // =====================
  // 补充高弹联轴器
  // =====================
  {
    id: 'coupling-2',
    model: '高弹联轴器',
    title: '高弹性联轴器技术协议(20121025)',
    filename: '高弹性联轴器技术协议20121025.doc',
    path: `${BASE_PATH}/高弹性联轴器技术协议20121025.doc`,
    category: '高弹联轴器',
    type: 'doc',
    year: 2012
  },

  // =====================
  // 补充其他系列
  // =====================
  {
    id: 'csy2900-2',
    model: 'CSY2900',
    title: 'CSY2900齿轮箱技术协议(扫描件)',
    filename: '2013-8-12 齿轮箱 CSY2900 技术协议 扫描件.doc',
    path: `${BASE_PATH}/2013-8-12 齿轮箱 CSY2900 技术协议 扫描件.doc`,
    category: '其他',
    type: 'doc',
    year: 2013
  },
  {
    id: 'c4954-1',
    model: 'C4954',
    title: 'C4954船技术协议',
    filename: '技术协议-c4954船(06-02-17).doc',
    path: `${BASE_PATH}/技术协议-c4954船(06-02-17).doc`,
    category: '其他',
    type: 'doc',
    year: 2006
  },
  {
    id: 'fg-1',
    model: '中间桨',
    title: '技术协议-齿轮箱中间桨推进',
    filename: '（fg）技术协议-齿轮箱中间桨推进12.20.doc',
    path: `${BASE_PATH}/（fg）技术协议-齿轮箱中间桨推进12.20.doc`,
    category: '其他',
    type: 'doc',
    year: 2012
  },
  {
    id: 't300-3',
    model: 'T300',
    title: 'T300技术协议.PDF',
    filename: 'T300技术协议.PDF',
    path: `${BASE_PATH}/T300技术协议.PDF`,
    category: '其他',
    type: 'pdf',
    year: 2014
  }
];

/**
 * 获取所有分类
 */
export function getCategories() {
  const categories = new Set(technicalAgreementTemplates.map(t => t.category));
  return Array.from(categories);
}

/**
 * 按分类获取模板
 */
export function getTemplatesByCategory(category) {
  if (!category || category === 'all') {
    return technicalAgreementTemplates;
  }
  return technicalAgreementTemplates.filter(t => t.category === category);
}

/**
 * 按型号搜索模板
 */
export function searchTemplates(query) {
  if (!query) return technicalAgreementTemplates;
  const lowerQuery = query.toLowerCase();
  return technicalAgreementTemplates.filter(t =>
    t.model.toLowerCase().includes(lowerQuery) ||
    t.title.toLowerCase().includes(lowerQuery) ||
    t.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * 获取指定型号的模板
 */
export function getTemplatesForModel(model) {
  if (!model) return [];
  const normalizedModel = model.toUpperCase().replace(/[.\-]/g, '');
  return technicalAgreementTemplates.filter(t => {
    const normalizedTemplateModel = t.model.toUpperCase().replace(/[.\-]/g, '');
    return normalizedTemplateModel.includes(normalizedModel) ||
           normalizedModel.includes(normalizedTemplateModel);
  });
}

export default technicalAgreementTemplates;
