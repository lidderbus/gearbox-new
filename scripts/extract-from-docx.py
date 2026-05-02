#!/usr/bin/env python3
"""从《杭齿厂选型手册2025版5月版.docx》解析全表为 audit JSON.
覆盖: Type A (T1-T11, T14-T19, T27-T30, T33-T34) + Type B 多型号包装 (T20-T21).
"""
import zipfile, json, re, os, sys
from xml.etree import ElementTree as ET

NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
DOCX = os.path.expanduser('~/Downloads/02_齿轮箱业务/杭齿厂选型手册2025版5月版.docx')

def cell_paragraphs(c):
    out = []
    for p in c.findall('.//w:p', NS):
        t = ''.join(e.text or '' for e in p.findall('.//w:t', NS)).strip()
        if t: out.append(t)
    return out

def cell_text(c):
    return ' '.join(cell_paragraphs(c))

def model_name(c):
    paras = cell_paragraphs(c)
    if not paras: return ''
    name = paras[0].strip()
    name = re.sub(r'\s*\(.*?\)\s*', '', name)
    return name.strip()

def model_names(c):
    """单元格内所有 model 名 (T14-T19 多型号行: GWC + GWL 配对)"""
    out = []
    for p in cell_paragraphs(c):
        n = re.sub(r'\s*\(.*?\)\s*', '', p.strip()).strip()
        if n: out.append(n)
    return out

def parse_numbers(s):
    if not s: return []
    s = re.sub(r':1\b', '', s)  # 比率符号 "2.07:1" → "2.07"
    s = re.sub(r'\([^)]*\)', ' ', s)  # 去括注 "1.109(顺快)" → "1.109"
    # 修 docx 缺小数点的录入错误: "X Y" → "X.Y" (X 1 位非小数后缀, Y 恰 2 位)
    s = re.sub(r'(?<![\d.])(\d)\s+(\d{2})(?!\d)', r'\1.\2', s)
    out = []
    for token in re.split(r'\s+', s.strip()):
        if not token: continue
        if re.fullmatch(r'-?\d+', token): out.append(int(token)); continue
        if re.fullmatch(r'-?\d+\.\d+', token): out.append(float(token)); continue
    return out

def parse_dim(s):
    if not s: return None
    s = re.sub(r'\s', '', s)
    m = re.search(r'(\d+(?:\.\d+)?)[×xX](\d+(?:\.\d+)?)[×xX](\d+(?:\.\d+)?)', s)
    return f'{m.group(1)}×{m.group(2)}×{m.group(3)}' if m else None

def parse_speed(s):
    s = re.sub(r'\s', '', s or '')
    m = re.search(r'(\d+)\s*[-—~]\s*(\d+)', s)
    return (int(m.group(1)), int(m.group(2))) if m else (None, None)

def parse_int(s):
    if not s: return None
    m = re.search(r'(\d+(?:\.\d+)?)', s)
    return int(float(m.group(1))) if m else None

def parse_float(s):
    if not s: return None
    m = re.search(r'(\d+(?:\.\d+)?)', s)
    return float(m.group(1)) if m else None

def expand_aligned(r_paras, c_paras):
    """段落对齐展开: 每段 cap 复制 N 次 (N=同段 ratio 数). 退化处理."""
    rps = [parse_numbers(p) for p in r_paras]
    cps = [parse_numbers(p) for p in c_paras]
    flat_r = [x for sub in rps for x in sub]
    flat_c = [x for sub in cps for x in sub]
    if len(rps) == len(cps) and len(rps) > 0 and any(rps):
        out = []
        for rseg, cseg in zip(rps, cps):
            if not rseg: continue
            if len(cseg) == 1: out.extend([cseg[0]] * len(rseg))
            elif len(cseg) == len(rseg): out.extend(cseg)
            elif len(cseg) < len(rseg): out.extend(cseg + [cseg[-1]] * (len(rseg) - len(cseg)))
            else: out.extend(cseg[:len(rseg)])
        if len(out) == len(flat_r): return flat_r, out
    if len(flat_c) == 1: return flat_r, [flat_c[0]] * len(flat_r)
    if len(flat_r) == len(flat_c): return flat_r, flat_c
    if not flat_c: return flat_r, []
    if len(flat_c) < len(flat_r): return flat_r, flat_c + [flat_c[-1]] * (len(flat_r) - len(flat_c))
    return flat_r, flat_c[:len(flat_r)]

z = zipfile.ZipFile(DOCX)
xml = z.read('word/document.xml').decode('utf-8')
root = ET.fromstring(xml)
tables = root.findall('.//w:tbl', NS)

results = []

# ==== Type A: 标准单级 8-col ====
TYPE_A = list(range(1, 12)) + [33, 34]

def header_has_model(rows):
    if not rows: return False
    header = [re.sub(r'\s', '', cell_text(c)) for c in rows[0].findall('.//w:tc', NS)]
    return any('型号' in h for h in header)

for ti in TYPE_A:
    if ti >= len(tables): continue
    rows = tables[ti].findall('.//w:tr', NS)
    if len(rows) < 2: continue
    if not header_has_model(rows): continue
    pending_group = []  # 多型号同行共享, 列表
    for r in rows[1:]:
        cells = r.findall('.//w:tc', NS)
        if len(cells) < 8: continue
        cps = [cell_paragraphs(c) for c in cells]
        models = model_names(cells[0])
        if models:
            for p in pending_group: results.append(p)
            sm, sx = parse_speed(cell_text(cells[1]))
            pending_group = []
            for mt in models:
                pending_group.append({
                    'model': mt, 'table': ti, 'kind': 'A',
                    'minSpeed': sm, 'maxSpeed': sx,
                    '_r_paras': list(cps[2]), '_c_paras': list(cps[3]),
                    'thrust': parse_float(cell_text(cells[4])),
                    'centerDistance': parse_int(cell_text(cells[5])),
                    'dimensions': parse_dim(cell_text(cells[6])),
                    'weight': parse_int(cell_text(cells[7])),
                })
        elif pending_group:
            for p in pending_group:
                p['_r_paras'].extend(cps[2])
                p['_c_paras'].extend(cps[3])
    for p in pending_group: results.append(p)

# ==== Type B: 多型号包装 (T20, T21) ====
# 第一格如 'GWS60.66\nGWK60.66\nGWH60.66\nGWD60.66' = 4 个共享参数模型
# 重量列 '15\n14\n14\n14' 对应每个模型的吨数
for ti in list(range(14, 20)) + [20, 21] + list(range(27, 31)):
    if ti >= len(tables): continue
    rows = tables[ti].findall('.//w:tr', NS)
    if len(rows) < 2: continue
    if not header_has_model(rows): continue
    # 表头: 型号, 输入转速, 减速比, 传递能力, 额定推力, 重量(t)
    for r in rows[1:]:
        cells = r.findall('.//w:tc', NS)
        if len(cells) < 6: continue
        cps = [cell_paragraphs(c) for c in cells]
        models = cps[0]  # 多个型号
        if not models: continue
        sm, sx = parse_speed(cell_text(cells[1]))
        ratios = parse_numbers(cell_text(cells[2]))
        caps = parse_numbers(cell_text(cells[3]))
        thrust = parse_float(cell_text(cells[4]))
        # 重量: 段落数对应模型数, 每段一个吨数
        weights_paras = cps[5]
        weights_t = []
        for wp in weights_paras:
            v = parse_float(wp)
            if v is not None: weights_t.append(v)
        # 每个模型: 共享 ratios/caps, 单独 weight
        # 按 ratios 数复制 caps (单值 → 全部填充)
        flat_r, flat_c = expand_aligned([cell_text(cells[2])], [cell_text(cells[3])])
        for idx, m in enumerate(models):
            wkg = None
            if weights_t:
                wt_idx = idx if idx < len(weights_t) else 0
                wkg = int(weights_t[wt_idx] * 1000)  # 吨 → kg
            results.append({
                'model': m.strip(), 'table': ti, 'kind': 'B',
                'minSpeed': sm, 'maxSpeed': sx,
                '_r_paras': [cell_text(cells[2])], '_c_paras': [cell_text(cells[3])],
                'thrust': thrust, 'centerDistance': None, 'dimensions': None,
                'weight': wkg,
            })

# ==== Type C: 双级齿轮箱 T22-T26 (HCS/HCTS/HCDS/SGW/SGWS) ====
# 列: model | speed | i1慢档 | i2快档 | capacity | thrust | cd
# DB 仅存慢档 i1, 取 i1 对应 capacity
for ti in [22, 23, 24, 25, 26]:
    if ti >= len(tables): continue
    rows = tables[ti].findall('.//w:tr', NS)
    if len(rows) < 2 or not header_has_model(rows): continue
    pending = None
    for r in rows[1:]:
        cells = r.findall('.//w:tc', NS)
        if len(cells) < 6: continue
        cps = [cell_paragraphs(c) for c in cells]
        m_text = model_name(cells[0])
        if m_text:
            if pending: results.append(pending)
            sm, sx = parse_speed(cell_text(cells[1]))
            pending = {
                'model': m_text, 'table': ti, 'kind': 'C',
                'minSpeed': sm, 'maxSpeed': sx,
                '_r_paras': list(cps[2]), '_c_paras': list(cps[4]),
                'thrust': parse_float(cell_text(cells[5])),
                'centerDistance': parse_int(cell_text(cells[6])) if len(cells) > 6 else None,
                'dimensions': None, 'weight': None,
            }
        elif pending is not None:
            pending['_r_paras'].extend(cps[2])
            pending['_c_paras'].extend(cps[4])
    if pending: results.append(pending)

# ==== Type D: HCG/HCAG 4 容量分级 T12-T13 ====
# 行 R0: 标题; R1: 子标题 (休闲P/轻载L/中等M/持续C); R2+: 数据
# 列: model | speed | ratio | P | L | M | C | thrust | cd | weight
# 取 C (持续) 作为权威 capacity (最保守)
for ti in [12, 13]:
    if ti >= len(tables): continue
    rows = tables[ti].findall('.//w:tr', NS)
    if len(rows) < 3 or not header_has_model(rows): continue
    pending = None
    for r in rows[2:]:  # 跳过 2 行表头
        cells = r.findall('.//w:tc', NS)
        if len(cells) < 8: continue
        cps = [cell_paragraphs(c) for c in cells]
        m_text = model_name(cells[0])
        if m_text:
            if pending: results.append(pending)
            sm, sx = parse_speed(cell_text(cells[1]))
            pending = {
                'model': m_text, 'table': ti, 'kind': 'D',
                'minSpeed': sm, 'maxSpeed': sx,
                '_r_paras': list(cps[2]), '_c_paras': list(cps[6]),  # C 列
                'thrust': parse_float(cell_text(cells[7])) if len(cells) > 7 else None,
                'centerDistance': parse_int(cell_text(cells[8])) if len(cells) > 8 else None,
                'dimensions': None,
                'weight': parse_int(cell_text(cells[9])) if len(cells) > 9 else None,
            }
        elif pending is not None:
            pending['_r_paras'].extend(cps[2])
            pending['_c_paras'].extend(cps[6])
    if pending: results.append(pending)

# ==== Type E: 2GWH 双输出 T31-T32 ====
# 列: model | speed | ratio | capacity | thrust | cd
for ti in [31, 32]:
    if ti >= len(tables): continue
    rows = tables[ti].findall('.//w:tr', NS)
    if len(rows) < 2 or not header_has_model(rows): continue
    for r in rows[1:]:
        cells = r.findall('.//w:tc', NS)
        if len(cells) < 6: continue
        cps = [cell_paragraphs(c) for c in cells]
        m_text = model_name(cells[0])
        if not m_text: continue
        sm, sx = parse_speed(cell_text(cells[1]))
        results.append({
            'model': m_text, 'table': ti, 'kind': 'E',
            'minSpeed': sm, 'maxSpeed': sx,
            '_r_paras': list(cps[2]), '_c_paras': list(cps[3]),
            'thrust': parse_float(cell_text(cells[4])),
            'centerDistance': parse_int(cell_text(cells[5])),
            'dimensions': None, 'weight': None,
        })

# ==== Type F: PTI 混合动力 T36-T44 ====
# 列: model | 主减速比 | 主输入传递能力 | PTI减速比 | PTI传递能力 | PTI转速 | PTI转向
# DB 存主减速比 + 主输入传递能力
for ti in range(36, 45):
    if ti >= len(tables): continue
    rows = tables[ti].findall('.//w:tr', NS)
    if len(rows) < 2 or not header_has_model(rows): continue
    pending = None
    for r in rows[1:]:
        cells = r.findall('.//w:tc', NS)
        if len(cells) < 3: continue
        cps = [cell_paragraphs(c) for c in cells]
        m_text = model_name(cells[0])
        if m_text:
            if pending: results.append(pending)
            pending = {
                'model': m_text, 'table': ti, 'kind': 'F',
                'minSpeed': None, 'maxSpeed': None,
                '_r_paras': list(cps[1]), '_c_paras': list(cps[2]),
                'thrust': None, 'centerDistance': None,
                'dimensions': None, 'weight': None,
            }
        elif pending is not None:
            pending['_r_paras'].extend(cps[1])
            pending['_c_paras'].extend(cps[2])
    if pending: results.append(pending)

# ==== 后处理: 段对齐展开 ratios/caps ====
for rec in results:
    flat_r, flat_c = expand_aligned(rec.pop('_r_paras'), rec.pop('_c_paras'))
    rec['ratios'] = flat_r
    rec['capacities'] = flat_c

# 排重 (model 同名取第一条)
seen = {}
for rec in results:
    if rec['model'] not in seen:
        seen[rec['model']] = rec
deduped = list(seen.values())

# 输出
out_path = os.path.join(os.path.dirname(__file__), 'audit-data', 'manual-from-docx.json')
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, 'w') as f:
    json.dump(deduped, f, ensure_ascii=False, indent=2)

for k in ['A','B','C','D','E','F']:
    print(f'Type {k}: {sum(1 for r in deduped if r.get("kind")==k)}')
print(f'总计: {len(deduped)} 条')
print(f'输出: {out_path}')
