// utils/fontLoader.js
/**
 * 中文字体加载器
 * 为PDF文档加载中文字体，解决乱码问题
 */

// 中文字体加载到 jsPDF VFS
// 方案：在线 fetch CDN TTF -> 转 base64 -> addFileToVFS
// 避免本地打包字体导致体积膨胀

const FONT_NAME = 'NotoSansSC';
const FONT_URL = 'https://cdn.jsdelivr.net/gh/googlefonts/noto-cjk@main/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Regular.otf';

/**
 * 加载中文字体到PDF文档
 * @param {Object} doc - jsPDF文档对象
 * @returns {Promise<boolean>} 加载成功返回true
 */
export const loadChineseFont = async (doc) => {
    if (!doc) {
        console.error("字体加载错误: 无效的PDF文档对象");
        return false;
    }

    try {
        // 若已注册则直接使用
        if (doc.getFontList && doc.getFontList()[FONT_NAME]) {
            doc.setFont(FONT_NAME);
            return true;
        }

        console.log('在线获取中文字体...');
        const res = await fetch(FONT_URL);
        if (!res.ok) throw new Error('下载字体失败');
        const buf = await res.arrayBuffer();
        // 转 base64
        let binary = '';
        const bytes = new Uint8Array(buf);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
        const base64 = btoa(binary);

        doc.addFileToVFS(`${FONT_NAME}.otf`, base64);
        doc.addFont(`${FONT_NAME}.otf`, FONT_NAME, 'normal');
        doc.setFont(FONT_NAME);
        console.log('中文字体加载完成');
                return true;
    } catch (err) {
        console.warn('中文字体加载失败，退回默认字体:', err);
        doc.setFont('Helvetica', 'normal');
        return false;
    }
};

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

export default loadChineseFont;