const fs=require('fs');
const FILE='src/data/completeGearboxData.js';
const man=JSON.parse(fs.readFileSync('scripts/audit-data/manual-gw-from-pdf-20260530.json','utf8'));
const manBy=Object.fromEntries(man.map(m=>[m.model,m]));
const TARGETS=['GWC60.66','GWL60.66','GWC63.71','GWC66.75','GWL66.75','GWC70.82','GWL70.82','GWC70.85','GWL70.85','GWC75.90','GWL75.90','GWC80.95','GWL80.95'];
let text=fs.readFileSync(FILE,'utf8');
const arrStr=(name,vals)=>`"${name}": [\n      ${vals.join(',\n      ')}\n    ]`;
let done=[],warn=[];
for(const mdl of TARGETS){
  const m=manBy[mdl];
  if(!m){warn.push(mdl+': 手册无');continue;}
  const anchor=`"model": "${mdl}",`;
  const ai=text.indexOf(anchor);
  if(ai<0){warn.push(mdl+': DB无锚点');continue;}
  const next=text.indexOf('"model":',ai+anchor.length);
  const end=next<0?text.length:next;
  let region=text.slice(ai,end);
  if(!/"transmissionCapacityPerRatio":\s*\[/.test(region)){warn.push(mdl+': 无transmissionCapacityPerRatio字段(跳过)');continue;}
  const before={r:(region.match(/"ratios":\s*\[([^\]]*)\]/)||[])[1],c:(region.match(/"transmissionCapacityPerRatio":\s*\[([^\]]*)\]/)||[])[1]};
  region=region
    .replace(/"ratios":\s*\[[^\]]*\]/, arrStr('ratios',m.ratios))
    .replace(/"transmissionCapacityPerRatio":\s*\[[^\]]*\]/, arrStr('transmissionCapacityPerRatio',m.capacities))
    .replace(/"minSpeed":\s*\d+/, `"minSpeed": ${m.minSpeed}`)
    .replace(/"maxSpeed":\s*\d+/, `"maxSpeed": ${m.maxSpeed}`);
  text=text.slice(0,ai)+region+text.slice(end);
  done.push(`${mdl}: ${(before.r||'').trim().split(',').filter(Boolean).length}→${m.ratios.length}档`);
}
fs.writeFileSync(FILE,text);
console.log('✅ 已修复:',done.length); done.forEach(d=>console.log('  '+d));
if(warn.length){console.log('⚠ 警告:'); warn.forEach(w=>console.log('  '+w));}
