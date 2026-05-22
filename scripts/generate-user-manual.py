#!/usr/bin/env python3
"""生成齿轮箱选型系统使用目录(Word)"""
from docx import Document
from docx.shared import Pt, RGBColor, Cm, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import os

OUT = os.path.expanduser('~/Desktop/齿轮箱选型系统-使用目录-v65.docx')

doc = Document()

# 中文字体
def set_cn_font(run, size=11, bold=False, color=None):
    run.font.name = 'Microsoft YaHei'
    r = run._element
    r.rPr.rFonts.set(qn('w:eastAsia'), 'Microsoft YaHei')
    run.font.size = Pt(size)
    run.bold = bold
    if color:
        run.font.color.rgb = color

# 页面边距
section = doc.sections[0]
section.top_margin = Cm(2)
section.bottom_margin = Cm(2)
section.left_margin = Cm(2.2)
section.right_margin = Cm(2.2)

# 封面
title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = title.add_run('齿轮箱选型系统')
set_cn_font(r, 28, True, RGBColor(0x1f, 0x4e, 0x79))

sub = doc.add_paragraph()
sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
set_cn_font(sub.add_run('使用目录与功能手册'), 18, True, RGBColor(0x2e, 0x75, 0xb6))

doc.add_paragraph()

meta = doc.add_paragraph()
meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
set_cn_font(meta.add_run('版本: v65 · 投产版'), 12)
meta = doc.add_paragraph()
meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
set_cn_font(meta.add_run('生效日期: 2026-05-02'), 12)
meta = doc.add_paragraph()
meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
set_cn_font(meta.add_run('在线地址: https://qj-gearbox.duckdns.org/gearbox-app/'), 11, color=RGBColor(0x05, 0x63, 0xc1))

doc.add_paragraph()
doc.add_paragraph()

# 系统概述 boxed
overview = doc.add_paragraph()
set_cn_font(overview.add_run('系统简介'), 14, True, RGBColor(0x1f, 0x4e, 0x79))
p = doc.add_paragraph()
set_cn_font(p.add_run(
    '本系统是杭州前进齿轮箱集团及关联企业内部使用的船舶推进系统集成选型平台,'
    '覆盖船用齿轮箱、高弹联轴器、可调螺距桨(CPP)、舵桨/侧推、轴系、扭振分析等全链路工程选型与商务文档生成,'
    '并集成多品牌柴油机库、海外齿轮箱参数级对位和 IMO 合规评估,'
    '使系统具备国产+海外参考的双向比对能力。'
), 11)

p = doc.add_paragraph()
set_cn_font(p.add_run('数据规模: '), 11, True)
set_cn_font(p.add_run('590+ 齿轮箱型号 · 15 真实柴油机 · 16 海外齿轮箱参数级对位 · 17 标准船型 · 197 合同案例库'), 11)

doc.add_page_break()

# ============= 一级标题样式
def h1(text):
    p = doc.add_paragraph()
    set_cn_font(p.add_run(text), 16, True, RGBColor(0x1f, 0x4e, 0x79))
    # 下划线
    pPr = p._p.get_or_add_pPr()
    pBdr = OxmlElement('w:pBdr')
    bottom = OxmlElement('w:bottom')
    bottom.set(qn('w:val'), 'single')
    bottom.set(qn('w:sz'), '8')
    bottom.set(qn('w:color'), '1f4e79')
    pBdr.append(bottom)
    pPr.append(pBdr)

def h2(text):
    p = doc.add_paragraph()
    set_cn_font(p.add_run(text), 13, True, RGBColor(0x2e, 0x75, 0xb6))

def body(text, bold_keys=None):
    p = doc.add_paragraph()
    set_cn_font(p.add_run(text), 11)
    return p

def bullet(text, indent=0):
    p = doc.add_paragraph(style='List Bullet')
    if indent:
        p.paragraph_format.left_indent = Cm(0.6 + indent * 0.6)
    set_cn_font(p.add_run(text), 11)

# ============= 目录结构表
h1('一、模块总览')

modules = [
    ('1. 选型核心', [
        ('智能选型表单', '主入口,工况输入(功率/转速/速比/船型) → 系统打分推荐齿轮箱', '主页'),
        ('反向选型', '已知型号反查工况边界', '反向选型'),
        ('多条件批量选型', '一次输入多组工况批量计算', '批量选型'),
        ('CPP 可调桨选型', '螺旋桨参数 + 油分配器 + 液压站匹配', '推进选型 / CPP'),
        ('舵桨选型', 'Schottel/Steerprop 类舵桨匹配', '推进选型 / 舵桨'),
        ('侧推/喷水推选型', '隧道侧推或喷水推进配置', '推进选型 / 侧推'),
        ('轴系选型', '轴径/轴长/中间轴承计算', '推进选型 / 轴系'),
        ('推进集成 Hub', '柴油机+齿轮箱+螺旋桨一体化匹配', '推进集成'),
        ('扭振分析', 'CCS/ABS/DNV/LR/BV 五船级社合规计算', '扭振分析'),
    ]),
    ('2. 配套设备', [
        ('高弹联轴器选型', 'HC/HCT/HCD 系列联轴器扭矩匹配', '联轴器选型'),
        ('备用泵选型', '齿轮箱滑油备用泵流量/压力计算', '泵选型'),
        ('HCM 选型(康明斯专用)', 'Cummins KTA/QSK 系列定制', 'HCM 选型'),
        ('Cummins 配机案例库', '历史项目工况复用', '康明斯配机'),
        ('配机案例搜索', '杭齿全品牌历史案例', '配机案例'),
    ]),
    ('3. 国际数据融合 ★新', [
        ('多品牌柴油机库', 'MAN/Wartsila/CAT/MTU/Yanmar/Mitsubishi/Volvo/Weichai/Yuchai/SDEC 真实型号', '主表单 → 选发动机'),
        ('海外齿轮箱参数级对比', 'ZF/Reintjes/Twin Disc/Masson/Kanzaki ↔ 杭齿三方对位', '竞品对比 / 参数级三方对比'),
        ('17 标准船型一键带入', 'Capesize/VLCC/ULCV/Aframax 等船型自动填功率/转速/速比', '主表单 → 标准船型快选'),
        ('IMO 合规评估', 'EEXI / EEDI / CII A-E 评级 + 减排建议', '选型结果 → IMO 合规 Tab'),
    ]),
    ('4. 文档与报表', [
        ('报价单管理', '生成/编辑/打印/导出 Excel/PDF', '报价单'),
        ('合同生成', '中英文双语+四步向导', '合同'),
        ('技术协议生成', '六系列默认参数+条款知识库 58 条', '技术协议'),
        ('外形图查询', 'DWG/PDF 多视图查阅与对比', '外形图'),
        ('使用说明书库', '590 型号 PDF/Word 说明书', '说明书库'),
        ('协议模板库', '历史协议模板复用', '协议模板'),
        ('标准法规库', 'CCS/IACS/IMO 行业标准全文', '标准法规'),
        ('文档大盘', '所有文档版本与下载统计', '文档大盘'),
    ]),
    ('5. 数据与工程', [
        ('数据查询', '齿轮箱/联轴器/泵参数检索', '数据查询'),
        ('兼容性矩阵', '齿轮箱 × 联轴器 × 泵全交叉', '兼容性矩阵'),
        ('趋势分析', '历史选型分布与热销榜', '趋势分析'),
        ('能效仪表盘', 'EEDI/CII 历史曲线', '能效仪表盘'),
        ('统计大盘', '型号销量、客户分布', '统计大盘'),
        ('数据备份', '本地导出 JSON 备份', '数据备份'),
        ('批量改价', '管理员批量调整价格(权限受限)', '批量改价'),
        ('API 文档', '后端接口说明', 'API 文档'),
        ('审计日志', '所有写操作记录', '审计日志'),
    ]),
    ('6. 项目与售后', [
        ('项目跟踪', '从选型到交付全周期跟踪', '项目跟踪'),
        ('售后服务', '工单/维保/巡检', '售后'),
        ('安装指南', '现场对中/二次灌浆/试车', '安装指南'),
        ('客户门户', '客户登录查看自有项目', '客户门户'),
    ]),
    ('7. 系统管理', [
        ('角色管理', '管理员/工程师/销售/客户四角色', '角色管理'),
        ('登录认证', 'PBKDF2-SHA256 10万轮 + AES-GCM 会话', '登录页'),
        ('诊断面板', '系统健康检查与异常排查', '诊断面板'),
        ('快捷键帮助', 'Ctrl+K 全局命令面板', '? 键'),
        ('移动端优化', '手机/平板自适应', '设置 → 移动'),
        ('离线包', '导出离线版供无网络场景', '离线包'),
    ]),
]

for cat_name, items in modules:
    h2(cat_name)
    table = doc.add_table(rows=1, cols=3)
    table.style = 'Light Grid Accent 1'
    table.autofit = False
    hdr = table.rows[0].cells
    for i, (w, t) in enumerate([(Cm(4.5), '功能名称'), (Cm(8.5), '说明'), (Cm(4), '入口位置')]):
        hdr[i].width = w
        hdr[i].text = ''
        run = hdr[i].paragraphs[0].add_run(t)
        set_cn_font(run, 11, True, RGBColor(0xff, 0xff, 0xff))
        # bg color
        tcPr = hdr[i]._tc.get_or_add_tcPr()
        shd = OxmlElement('w:shd')
        shd.set(qn('w:val'), 'clear')
        shd.set(qn('w:color'), 'auto')
        shd.set(qn('w:fill'), '2e75b6')
        tcPr.append(shd)
    for name, desc, entry in items:
        row = table.add_row().cells
        row[0].width = Cm(4.5)
        row[1].width = Cm(8.5)
        row[2].width = Cm(4)
        for i, txt in enumerate([name, desc, entry]):
            row[i].text = ''
            run = row[i].paragraphs[0].add_run(txt)
            set_cn_font(run, 10, bold=(i == 0))
    doc.add_paragraph()

doc.add_page_break()

# ============= v65 升级亮点
h1('二、v65 投产版升级亮点')

upgrades = [
    ('安全加固', [
        '认证升级为 PBKDF2-SHA256 10 万轮迭代 + 用户名复合 salt',
        '会话密钥用 SubtleCrypto AES-GCM, 密钥不可导出',
        '数据导入安全解析(json5 容错+黑名单), 替换 new Function() 注入',
        '所有外链补 noopener,noreferrer 防 tab-jacking',
        '启动数据校验硬阻断: 型号<500 或必填缺失>5% 显示 FatalScreen',
    ]),
    ('外部数据融合', [
        '多品牌柴油机库 15 型号 (MAN L21/31, L27/38; Wartsila W20/W31; CAT 3512C/3516C; MTU 12V/16V4000; Yanmar 6EY26W; Mitsubishi S12R; Volvo D13MH; 潍柴 6170ZC/12V190; 玉柴 YC6T540C; 上柴 SC15G), 含真实 SFC 燃油曲线',
        '海外齿轮箱 16 型号参数级对位: ZF W325-W3000, Reintjes WAF/LAF, Twin Disc MG-5114SC/5202SC/5301, Masson, Kanzaki — 与杭齿型号三参数(功率/转速/速比)交叉打分',
        '17 标准船型库: Handysize-VLCC 散货油轮、Feeder-ULCV 集装箱、LNG/化学/客滚/拖轮/AHTS/PSV/渔船 — 选 Capesize 自动填 18500kW/447rpm/4.7',
        'IMO 合规评估: EEXI(MEPC.328 Phase 3) + EEDI + CII A-E 评级, 不达标自动建议 EPL/双燃料/降速/SEEMP',
    ]),
    ('工程加固', [
        '虚拟滚动: >20 卡片或 696 型号矩阵自动切 react-window, Slow 4G FCP <3s',
        'Sentry 集成: ErrorBoundary 自动上报错误堆栈',
        'Bundle 优化: main.js 2.82MB→2.47MB(-12.4%), 6 个独立 chunk 按需加载',
        'Playwright E2E: 选型→报价→合同 PDF 全链路自动测试',
        'a11y: Modal 全量 aria-modal, 命令面板/扭振报告键盘可达',
    ]),
    ('部署', [
        '原子部署 atomic-deploy.sh: rsync→ln -sfn 切换, 保留最近 3 版本可秒级回滚',
        'chattr 锁定保护, 仅持 deploy token 机器可推',
        'preflight-check.sh 一站式审计: 数据库/可达性/价格/单测/构建/bundle 全绿才放行',
    ]),
]

for cat, items in upgrades:
    h2('▸ ' + cat)
    for it in items:
        bullet(it)
    doc.add_paragraph()

doc.add_page_break()

# ============= 典型流程
h1('三、典型操作流程')

flows = [
    ('A. 散货船选型 → 报价 → 合同', [
        '主页选 "标准船型快选" → Capesize 散货船 → "带入主表单"',
        '系统自动填 18500kW / 447rpm / 4.7 速比, 工程师可微调',
        '选 "MAN 9L27/38" 发动机 → motorPower/motorSpeed/torque 自动填',
        '点 "开始选型" → 系统返回 5-10 候选齿轮箱 (按打分排序)',
        '右上角 Tab 切到 "IMO 合规" → 输入 DWT/Vref → 显示 EEXI/EEDI/CII 评级',
        '点 "生成报价" → 编辑利润率/折扣 → 导出 PDF/Excel',
        '点 "生成合同" → 四步向导(产品/客户/条款/审核) → 中英双语 Word',
    ]),
    ('B. 国产 vs 海外参数级对比', [
        '左侧菜单 → "竞品对比" → Tab "参数级三方对比"',
        '输入工况: 1850 kW / 1800 rpm / 3.5 速比',
        '系统返回: 杭齿 HCT2700 + ZF W2050 + Reintjes WAF 1665L 三方对位',
        '查看价差(USD 区间)、重量、船级社认证、推荐度',
        '注意: 海外参考价仅作对位估算, 实际报价以厂商正式询价为准',
    ]),
    ('C. 扭振分析', [
        '左侧菜单 → "扭振分析"',
        '输入轴系几何参数 + 发动机激励',
        '点 "计算" → 系统按 CCS/ABS/DNV/LR/BV 五船级社规则同时校核',
        '查看共振点与禁转区, 不合格时调整轴径或加扭振减振器',
        '点 "导出报告" → 生成多船级社合规 PDF',
    ]),
]

for fname, steps in flows:
    h2(fname)
    for i, s in enumerate(steps, 1):
        p = doc.add_paragraph(style='List Number')
        set_cn_font(p.add_run(s), 11)
    doc.add_paragraph()

doc.add_page_break()

# ============= 角色权限
h1('四、角色权限矩阵')

roles_table = doc.add_table(rows=1, cols=5)
roles_table.style = 'Light Grid Accent 1'
hdr = roles_table.rows[0].cells
for i, t in enumerate(['功能', '管理员', '工程师', '销售', '客户']):
    hdr[i].text = ''
    run = hdr[i].paragraphs[0].add_run(t)
    set_cn_font(run, 11, True, RGBColor(0xff, 0xff, 0xff))
    tcPr = hdr[i]._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd'); shd.set(qn('w:val'),'clear'); shd.set(qn('w:color'),'auto'); shd.set(qn('w:fill'),'2e75b6')
    tcPr.append(shd)

perms = [
    ('选型计算', '✓', '✓', '✓', '只读'),
    ('生成报价', '✓', '✓', '✓', '✗'),
    ('生成合同', '✓', '✓', '✓', '✗'),
    ('扭振分析', '✓', '✓', '✗', '只读'),
    ('数据导入', '✓', '✗', '✗', '✗'),
    ('批量改价', '✓', '✗', '✗', '✗'),
    ('用户管理', '✓', '✗', '✗', '✗'),
    ('审计日志', '✓', '只读', '✗', '✗'),
    ('客户自有项目', '✓', '✓', '✓', '✓'),
]
for row_data in perms:
    row = roles_table.add_row().cells
    for i, txt in enumerate(row_data):
        row[i].text = ''
        run = row[i].paragraphs[0].add_run(txt)
        set_cn_font(run, 10, bold=(i == 0))

doc.add_paragraph()

# ============= 快捷键
h1('五、键盘快捷键')

shortcuts = [
    ('Ctrl + K (Cmd + K)', '打开全局命令面板, 一键搜索任意模块/资料/型号'),
    ('Esc', '关闭弹窗 / 退出当前模式'),
    ('Tab', '表单字段切换'),
    ('?', '弹出快捷键帮助'),
    ('Ctrl + S', '保存当前选型方案'),
    ('Ctrl + P', '打印当前页面'),
]

for k, v in shortcuts:
    p = doc.add_paragraph()
    r = p.add_run(k)
    set_cn_font(r, 11, True, RGBColor(0xc7, 0x25, 0x4e))
    set_cn_font(p.add_run('   ' + v), 11)

doc.add_paragraph()

# ============= 注意事项
h1('六、使用注意事项')

notes = [
    '海外齿轮箱参考价仅作对位估算, 实际以厂商正式报价为准, 系统已加醒目免责横幅',
    '柴油机数据均来自厂商公开 Project Guide 与船级社 EIAPP 证书, 标注 dataSource + confidence(A/B/C)',
    'IMO 合规算法依据 MEPC.328(76) Phase 3 / 333(76) / 339(76), 系统月度复核更新',
    'PDF/Word 文档导出后请妥善保管, 涉及商业敏感信息',
    '生产环境登录失败 5 次后账户临时锁定 15 分钟',
    '推荐使用 Chrome / Edge 最新版, IE 不支持',
    '移动端建议 iOS Safari / Android Chrome, iPad 横屏体验最佳',
]
for n in notes:
    bullet(n)

doc.add_paragraph()

# ============= 联系
h1('七、技术支持')

p = doc.add_paragraph()
set_cn_font(p.add_run('在线地址: '), 11, True)
set_cn_font(p.add_run('https://qj-gearbox.duckdns.org/gearbox-app/'), 11, color=RGBColor(0x05, 0x63, 0xc1))

p = doc.add_paragraph()
set_cn_font(p.add_run('系统版本: '), 11, True)
set_cn_font(p.add_run('v65 (投产版, 2026-05-02)'), 11)

p = doc.add_paragraph()
set_cn_font(p.add_run('数据库版本: '), 11, True)
set_cn_font(p.add_run('590 齿轮箱 + 15 柴油机 + 16 海外齿轮箱 + 17 船型'), 11)

p = doc.add_paragraph()
set_cn_font(p.add_run('错误监控: '), 11, True)
set_cn_font(p.add_run('Sentry 已接入, 异常自动上报'), 11)

p = doc.add_paragraph()
set_cn_font(p.add_run('反馈渠道: '), 11, True)
set_cn_font(p.add_run('系统右上角 → 反馈 / 联系系统管理员'), 11)

doc.add_paragraph()

# 末页
foot = doc.add_paragraph()
foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
set_cn_font(foot.add_run('— 杭州前进齿轮箱集团 · 选型系统团队 —'), 10, color=RGBColor(0x80, 0x80, 0x80))

doc.save(OUT)
print(f'生成: {OUT}')
print(f'大小: {os.path.getsize(OUT)/1024:.1f} KB')
