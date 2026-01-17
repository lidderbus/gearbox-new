// src/utils/dynamicImports.js
// 性能优化: 重依赖的动态导入，减少首屏加载时间

/**
 * 动态导入XLSX库
 * @returns {Promise<Object>} XLSX模块
 */
export async function loadXLSX() {
  console.log('DynamicImports: 加载XLSX库...');
  const startTime = performance.now();

  try {
    const XLSX = await import('xlsx');
    const loadTime = performance.now() - startTime;
    console.log(`DynamicImports: XLSX加载完成, 耗时${loadTime.toFixed(0)}ms`);
    return XLSX.default || XLSX;
  } catch (error) {
    console.error('DynamicImports: XLSX加载失败', error);
    throw error;
  }
}

/**
 * 动态导入jsPDF库
 * @returns {Promise<Object>} jsPDF类
 */
export async function loadJsPDF() {
  console.log('DynamicImports: 加载jsPDF库...');
  const startTime = performance.now();

  try {
    const jspdfModule = await import('jspdf');
    // 动态加载autotable插件
    await import('jspdf-autotable');

    const loadTime = performance.now() - startTime;
    console.log(`DynamicImports: jsPDF加载完成, 耗时${loadTime.toFixed(0)}ms`);
    return jspdfModule.jsPDF;
  } catch (error) {
    console.error('DynamicImports: jsPDF加载失败', error);
    throw error;
  }
}

/**
 * 动态导入html2canvas库
 * @returns {Promise<Function>} html2canvas函数
 */
export async function loadHtml2Canvas() {
  console.log('DynamicImports: 加载html2canvas库...');
  const startTime = performance.now();

  try {
    const module = await import('html2canvas');
    const loadTime = performance.now() - startTime;
    console.log(`DynamicImports: html2canvas加载完成, 耗时${loadTime.toFixed(0)}ms`);
    return module.default || module;
  } catch (error) {
    console.error('DynamicImports: html2canvas加载失败', error);
    throw error;
  }
}

/**
 * 动态导入file-saver库
 * @returns {Promise<Object>} file-saver模块
 */
export async function loadFileSaver() {
  console.log('DynamicImports: 加载file-saver库...');
  const startTime = performance.now();

  try {
    const module = await import('file-saver');
    const loadTime = performance.now() - startTime;
    console.log(`DynamicImports: file-saver加载完成, 耗时${loadTime.toFixed(0)}ms`);
    return module;
  } catch (error) {
    console.error('DynamicImports: file-saver加载失败', error);
    throw error;
  }
}

// 缓存已加载的模块，避免重复加载
const moduleCache = new Map();

/**
 * 带缓存的动态导入
 * @param {string} moduleName - 模块名称
 * @param {Function} loader - 加载函数
 * @returns {Promise<any>} 模块
 */
async function cachedImport(moduleName, loader) {
  if (moduleCache.has(moduleName)) {
    return moduleCache.get(moduleName);
  }

  const module = await loader();
  moduleCache.set(moduleName, module);
  return module;
}

/**
 * 批量预加载导出相关的所有库
 * 在用户可能需要导出之前调用
 */
export async function preloadExportLibraries() {
  console.log('DynamicImports: 预加载导出相关库...');
  const startTime = performance.now();

  try {
    await Promise.all([
      cachedImport('xlsx', loadXLSX),
      cachedImport('jspdf', loadJsPDF),
      cachedImport('html2canvas', loadHtml2Canvas),
      cachedImport('file-saver', loadFileSaver)
    ]);

    const loadTime = performance.now() - startTime;
    console.log(`DynamicImports: 所有导出库预加载完成, 耗时${loadTime.toFixed(0)}ms`);
  } catch (error) {
    console.error('DynamicImports: 预加载失败', error);
  }
}

/**
 * 获取缓存的模块（如果已加载）
 * @param {string} moduleName - 模块名称
 * @returns {any|null} 已缓存的模块或null
 */
export function getCachedModule(moduleName) {
  return moduleCache.get(moduleName) || null;
}

/**
 * 检查模块是否已加载
 * @param {string} moduleName - 模块名称
 * @returns {boolean} 是否已加载
 */
export function isModuleLoaded(moduleName) {
  return moduleCache.has(moduleName);
}

export default {
  loadXLSX,
  loadJsPDF,
  loadHtml2Canvas,
  loadFileSaver,
  preloadExportLibraries,
  getCachedModule,
  isModuleLoaded
};
