#!/usr/bin/env node
// updateGearboxData.js
/**
 * 齿轮箱数据更新命令行工具
 * 使用方法: node updateGearboxData.js [目标文件路径] [源文件路径] [输出文件路径]
 * 
 * 示例: node updateGearboxData.js ./src/data/embeddedData.js ./embeddednew.js ./src/data/embeddedData.js
 */

const fs = require('fs');
const path = require('path');
const { mergeGearboxDataCode } = require('./mergeGearboxData');

// 默认配置
const DEFAULT_TARGET = './src/data/embeddedData.js';
const DEFAULT_SOURCE = './embeddednew.js';
const DEFAULT_OUTPUT = './src/data/embeddedData.js';

// 获取命令行参数
const args = process.argv.slice(2);
const targetFile = args[0] || DEFAULT_TARGET;
const sourceFile = args[1] || DEFAULT_SOURCE;
const outputFile = args[2] || DEFAULT_OUTPUT;

// 主函数
async function main() {
  console.log('===================================');
  console.log('    船用齿轮箱数据更新工具');
  console.log('===================================');
  console.log(`目标文件: ${targetFile}`);
  console.log(`源文件: ${sourceFile}`);
  console.log(`输出文件: ${outputFile}`);
  console.log('');
  
  try {
    // 1. 读取文件
    if (!fs.existsSync(targetFile)) {
      throw new Error(`目标文件 ${targetFile} 不存在`);
    }
    
    if (!fs.existsSync(sourceFile)) {
      throw new Error(`源文件 ${sourceFile} 不存在`);
    }
    
    // 创建备份
    const backupFile = `${outputFile}.backup.${Date.now()}.js`;
    if (fs.existsSync(outputFile)) {
      fs.copyFileSync(outputFile, backupFile);
      console.log(`已创建备份文件: ${backupFile}`);
    }
    
    const targetCode = fs.readFileSync(targetFile, 'utf8');
    const sourceCode = fs.readFileSync(sourceFile, 'utf8');
    
    console.log(`成功读取文件:`);
    console.log(`- 目标文件: ${targetCode.length} 字节`);
    console.log(`- 源文件: ${sourceCode.length} 字节`);
    
    // 2. 合并数据
    console.log('正在合并数据...');
    const mergedCode = mergeGearboxDataCode(targetCode, sourceCode);
    
    // 3. 写入输出文件
    fs.writeFileSync(outputFile, mergedCode);
    console.log(`成功写入合并后的数据到 ${outputFile}`);
    
    console.log('');
    console.log('===================================');
    console.log('    数据更新成功完成!');
    console.log('===================================');
    
  } catch (error) {
    console.error('错误:', error.message);
    console.error('更新过程中断');
    process.exit(1);
  }
}

// 执行主函数
main().catch(error => {
  console.error('未处理的错误:', error);
  process.exit(1);
});
