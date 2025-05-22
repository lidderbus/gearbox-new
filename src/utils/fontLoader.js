// utils/fontLoader.js
/**
 * 中文字体加载器
 * 为PDF文档加载中文字体，解决乱码问题
 */

// 中文字体加载到 jsPDF VFS
// 方案：在线 fetch CDN TTF -> 转 base64 -> addFileToVFS
// 避免本地打包字体导致体积膨胀

/**
 * 检测PDF对象是否支持中文
 * @param {Object} doc - jsPDF文档对象
 * @returns {boolean} 支持中文返回true
 */
export const checkChineseSupport = (doc) => {
    if (!doc) return false;
    
    try {
        // 创建临时canvas测试中文渲染
        const testText = "测试中文";
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 30;
        const ctx = canvas.getContext('2d');
        
        // 设置与PDF相同的字体
        const fontFamily = doc.getFont().fontName || 'Helvetica';
        ctx.font = `12px ${fontFamily}`;
        
        // 尝试绘制中文
        ctx.fillText(testText, 10, 15);
        
        // 检查像素数据是否有变化（渲染成功）
        const imageData = ctx.getImageData(0, 0, 100, 30).data;
        let nonEmptyPixels = 0;
        
        for (let i = 0; i < imageData.length; i += 4) {
            if (imageData[i] !== 0 || imageData[i+1] !== 0 || imageData[i+2] !== 0 || imageData[i+3] !== 0) {
                nonEmptyPixels++;
            }
        }
        
        // 如果有渲染像素，说明支持中文
        return nonEmptyPixels > 10;
    } catch (e) {
        console.error("中文支持检测失败:", e);
        return false;
    }
};