#!/usr/bin/env node
/**
 * 批量补全PDF文字描述字段到completeGearboxData.js
 * - controlType (操纵方式)
 * - outputInterfaces (输出连接/罩壳)
 * - rotationDirection (输出轴旋转方向)
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../src/data/completeGearboxData.js');
const PDF_TEXT = '/tmp/pdf_text_fields.json';

// 加载数据
const pdfText = JSON.parse(fs.readFileSync(PDF_TEXT, 'utf8'));
const { completeGearboxData: codeData } = require(DATA_FILE);
let src = fs.readFileSync(DATA_FILE, 'utf8');

// 解析输出连接为结构化数据
function parseOutputConn(raw) {
    if (!raw) return null;
    const result = {};
    const parts = raw.split('/').map(s => s.trim());

    const saeList = [];
    const domesticList = [];
    let hasNoCover = false;

    for (const part of parts) {
        if (part.includes('SAE') || part.match(/^\d+$/)) {
            // SAE接口
            const nums = part.replace('SAE', '').trim().split(/\s+/);
            nums.forEach(n => {
                n = n.trim();
                if (n && !isNaN(n)) saeList.push(n + '"');
                else if (n) saeList.push(n);
            });
        } else if (part.includes('φ')) {
            domesticList.push(part.trim());
        } else if (part.includes('无罩壳')) {
            hasNoCover = true;
        } else if (part.trim()) {
            // 其他描述
            if (!result.notes) result.notes = [];
            result.notes.push(part.trim());
        }
    }

    if (saeList.length > 0) result.sae = saeList;
    if (domesticList.length > 0) result.domestic = domesticList;
    if (hasNoCover) result.noCover = true;

    return Object.keys(result).length > 0 ? result : null;
}

let patchCount = { controlType: 0, outputInterfaces: 0, rotationDirection: 0 };
let totalPatched = 0;

for (const [model, pdf] of Object.entries(pdfText)) {
    const codeItem = codeData.find(d => d.model === model);
    if (!codeItem) continue;

    // 找到model在源文件中的位置
    const modelStr = '"model": "' + model + '"';
    const modelIdx = src.indexOf(modelStr);
    if (modelIdx === -1) continue;

    // 找到该对象的结束位置 (下一个 }, 或 }])
    let objEnd = src.indexOf('\n    },', modelIdx);
    if (objEnd === -1) objEnd = src.indexOf('\n    }]', modelIdx);
    if (objEnd === -1) continue;

    let insertions = [];

    // 1. controlType
    if (pdf.controlType && !pdf.controlType.includes('相') && !codeItem.controlType) {
        const ct = pdf.controlType.replace(/\s+/g, '').replace(/\//g, '/');
        insertions.push('        "controlType": "' + ct + '"');
        patchCount.controlType++;
    }

    // 2. outputInterfaces (输出连接字符串直接存储)
    if (pdf.outputConn && !codeItem.outputInterfaces) {
        const oc = pdf.outputConn.replace(/"/g, '\\"');
        insertions.push('        "outputInterfaces": "' + oc + '"');
        patchCount.outputInterfaces++;
    }

    // 3. rotationDirection
    if (pdf.rotation && !codeItem.rotationDirection) {
        const rd = pdf.rotation.trim();
        if (rd === '相同' || rd === '相反') {
            insertions.push('        "rotationDirection": "' + rd + '"');
            patchCount.rotationDirection++;
        }
    }

    if (insertions.length > 0) {
        // 在对象结束前插入
        const insertText = ',\n' + insertions.join(',\n');
        src = src.substring(0, objEnd) + insertText + src.substring(objEnd);
        totalPatched++;
    }
}

fs.writeFileSync(DATA_FILE, src);

console.log('补全完成:');
console.log('  controlType: +' + patchCount.controlType);
console.log('  outputInterfaces: +' + patchCount.outputInterfaces);
console.log('  rotationDirection: +' + patchCount.rotationDirection);
console.log('  涉及型号: ' + totalPatched);

// 验证
const { completeGearboxData: newData } = require(DATA_FILE);
let ctCount = 0, oiCount = 0, rdCount = 0;
newData.forEach(d => {
    if (d.controlType) ctCount++;
    if (d.outputInterfaces) oiCount++;
    if (d.rotationDirection) rdCount++;
});
console.log('\n验证 (修改后):');
console.log('  controlType: ' + ctCount + '/' + newData.length);
console.log('  outputInterfaces: ' + oiCount + '/' + newData.length);
console.log('  rotationDirection: ' + rdCount + '/' + newData.length);
