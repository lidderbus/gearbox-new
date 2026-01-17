// utils/fontLoader.js
/**
 * 中文字体加载器
 * 为PDF文档加载中文字体，解决乱码问题
 */

// 中文字体加载到 jsPDF VFS
// 方案：在线 fetch CDN TTF -> 转 base64 -> addFileToVFS
// 避免本地打包字体导致体积膨胀

const FONT_NAME = 'NotoSansSC';
// 使用多个CDN源作为备选
const FONT_URLS = [
    // 本地服务器字体 - 最可靠
    '/fonts/NotoSansSC-Regular.ttf',
    // Google Fonts 直接链接
    'https://fonts.gstatic.com/s/notosanssc/v39/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnYw.ttf'
];

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

        // 尝试多个CDN源
        for (const fontUrl of FONT_URLS) {
            try {
                const res = await fetch(fontUrl);
                if (!res.ok) {
                    console.warn(`字体下载失败 (${res.status}): ${fontUrl}`);
                    continue;
                }

                const buf = await res.arrayBuffer();
                // 转 base64
                let binary = '';
                const bytes = new Uint8Array(buf);
                const len = bytes.byteLength;
                for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
                const base64 = btoa(binary);

                // 根据文件扩展名设置VFS文件名
                let vfsName = `${FONT_NAME}.ttf`;
                if (fontUrl.endsWith('.otf')) vfsName = `${FONT_NAME}.otf`;
                else if (fontUrl.endsWith('.woff2')) vfsName = `${FONT_NAME}.woff2`;
                else if (fontUrl.endsWith('.woff')) vfsName = `${FONT_NAME}.woff`;

                doc.addFileToVFS(vfsName, base64);
                doc.addFont(vfsName, FONT_NAME, 'normal');
                doc.setFont(FONT_NAME);
                console.log('中文字体加载完成:', fontUrl);
                return true;
            } catch (urlErr) {
                console.warn(`字体URL加载失败 ${fontUrl}:`, urlErr.message);
                continue;
            }
        }

        // 所有CDN源均失败
        throw new Error('所有字体CDN源均不可用');
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