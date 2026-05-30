import pdfplumber, json, re
from collections import Counter
PDF="/Users/lidder/Documents/技术手册/杭齿厂选型手册2025版5月版.pdf"
GW_PAGES=[16,17,18,19,21]
def cells(c): return [x for x in re.split(r'[\/\n]',(c or '').strip()) if x!='']
def f(s):
    try: return float(s)
    except: return None
models={}
pdf=pdfplumber.open(PDF)
for pi in GW_PAGES:
    for t in pdf.pages[pi].extract_tables({"vertical_strategy":"lines","horizontal_strategy":"lines"}):
        if not t or not t[0]: continue
        if '减速比' not in ' '.join(c or '' for c in t[0]): continue
        cur=None
        for row in t[1:]:
            row=[(c or '').strip() for c in row]
            if len(row)<4: continue
            mcell,scell,rcell,ccell = row[0],row[1],row[2],row[3]
            thr=row[4] if len(row)>4 else ''; wt=row[5] if len(row)>5 else ''
            rl=[f(x) for x in cells(rcell) if f(x) is not None]
            cl=[f(x) for x in cells(ccell) if f(x) is not None]
            names=re.findall(r'GW[CDHKLS]\d+\.\d+',mcell)
            bands=re.findall(r'(\d+)\s*-\s*(\d+)',scell)
            if names:
                lo=min((int(a) for a,b in bands),default=None); hi=max((int(b) for a,b in bands),default=None)
                wts=cells(wt); thrv=re.findall(r'\d+',thr)
                for i,nm in enumerate(names):
                    models[nm]={"model":nm,"page":pi+1,"ratios":list(rl),"capacities":list(cl),
                        "minSpeed":lo,"maxSpeed":hi,"thrust":f(thrv[0]) if thrv else None,
                        "weight": f(wts[i]) if i<len(wts) else (f(wts[0]) if wts else None),
                        "shared":names}
                cur=names
            elif cur:
                for nm in cur:
                    models[nm]["ratios"]+=rl; models[nm]["capacities"]+=cl
                    if bands:
                        lo=min(int(a) for a,_ in bands); hi=max(int(b) for _,b in bands)
                        m=models[nm]
                        if m["minSpeed"] is None or lo<m["minSpeed"]: m["minSpeed"]=lo
                        if m["maxSpeed"] is None or hi>m["maxSpeed"]: m["maxSpeed"]=hi
# 单级(GWS/K/H/D)常为单一传递能力 → 按比例档数复制平铺
for m in models.values():
    r,c=m["ratios"],m["capacities"]
    if len(c)==1 and len(r)>1: m["capacities"]=c*len(r)
out=list(models.values())
json.dump(out,open("scripts/audit-data/manual-gw-from-pdf-20260530.json","w"),ensure_ascii=False,indent=1)
# QA: ratios↑严格, caps非增, 等长
def inc(a): return all(a[i]<a[i+1] for i in range(len(a)-1))
def noninc(a): return all(a[i]>=a[i+1] for i in range(len(a)-1))
bad=[m["model"] for m in out if not(len(m["ratios"])==len(m["capacities"]) and len(m["ratios"])>0 and inc(m["ratios"]) and noninc(m["capacities"]))]
print("提取型号:",len(out),"子系列:",dict(Counter(re.match(r'GW[CDHKLS]',m["model"]).group() for m in out)))
print("QA未过:",len(bad), bad[:30])
