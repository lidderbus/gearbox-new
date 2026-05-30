const fs=require('fs');
const man=JSON.parse(fs.readFileSync('scripts/audit-data/manual-gw-from-pdf-20260530.json','utf8'));
const db=require('../src/data/completeGearboxData.js');
const arr=Array.isArray(db)?db:(db.default||Object.values(db).find(v=>Array.isArray(v))||[]);
const dbBy=Object.fromEntries(arr.map(g=>[g.model,g]));
const inc=a=>a.every((v,i)=>i===0||a[i-1]<v);
const noninc=a=>a.every((v,i)=>i===0||a[i-1]>=v);
const qaOK=m=>m.ratios.length===m.capacities.length&&m.ratios.length>0&&inc(m.ratios)&&noninc(m.capacities);
let trunc=[],capdiff=[],ok=[],qabad=[],nodb=[];
const rows=[['model','status','dbRatios','manualRatios','dbN','manualN','manualRatiosList','manualCapsList']];
for(const m of man){
  const d=dbBy[m.model];
  if(!qaOK(m)){qabad.push(m.model);continue;}
  if(!d){nodb.push(m.model);continue;}
  const dr=(d.ratios||[]); const dc=(d.transmissionCapacityPerRatio||d.transferCapacity||[]);
  const rEq=dr.length===m.ratios.length&&dr.every((v,i)=>Math.abs(v-m.ratios[i])<0.06);
  const cEq=dc.length===m.capacities.length&&dc.every((v,i)=>Math.abs(v-m.capacities[i])<0.02);
  let st;
  if(dr.length<m.ratios.length) {st='TRUNCATED'; trunc.push(m.model);}
  else if(!rEq){st='RATIO_DIFF'; capdiff.push(m.model);}
  else if(!cEq){st='CAPS_DIFF'; capdiff.push(m.model);}
  else {st='OK'; ok.push(m.model);}
  rows.push([m.model,st,dr.length,m.ratios.length,dr.length,m.ratios.length,m.ratios.join(' '),m.capacities.join(' ')]);
}
fs.writeFileSync('audit-reports/gw-reconcile-20260530.csv',rows.map(r=>r.join('\t')).join('\n'));
console.log('=== GW 族系 对账 (手册 PDF vs 数据库) ===');
console.log('手册提取型号:',man.length,' QA未过(排除待核):',qabad.length);
console.log('✅ OK(完全一致):',ok.length);
console.log('🔴 TRUNCATED(DB档数<手册, 需补):',trunc.length);
console.log('   →',trunc.join(', '));
console.log('🟡 RATIO/CAPS_DIFF(档数同但值不同):',capdiff.length, capdiff.slice(0,20).join(', '));
console.log('DB中无此型号:',nodb.length,nodb.slice(0,10).join(', '));
// 截断型号的丢失明细
console.log('\n--- 截断型号丢失档数明细 ---');
for(const mm of trunc){const d=dbBy[mm],m=man.find(x=>x.model===mm);
  console.log(`${mm}: DB ${(d.ratios||[]).length}档(max ${Math.max(...(d.ratios||[0]))}) → 手册 ${m.ratios.length}档(max ${Math.max(...m.ratios)})  丢失速比 ${m.ratios.filter(r=>!(d.ratios||[]).some(x=>Math.abs(x-r)<0.06)).join('/')}`);}
