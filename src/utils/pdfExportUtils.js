// src/utils/pdfExportUtils.js
// 性能优化: 重依赖使用动态导入
// 以下导入被移除，改为在需要时动态加载:
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import html2canvas from 'html2canvas';
import { loadJsPDF, loadHtml2Canvas } from './dynamicImports';
import { logger } from '../config/logging';

// 中文字体Base64压缩数据（仅供示例，实际使用需要完整字体数据）
const notoSansSCBase64 = 'AAEKS...'; // 此处省略实际Base64字体数据，实际使用时需要完整字体

/**
 * 加载中文字体
 * @param {jsPDF} pdf - PDF实例
 * @returns {Promise<boolean>} - 是否加载成功
 */
const loadChineseFont = async (pdf) => {
  try {
    // 如果已经内置字体数据，则直接使用
    if (typeof notoSansSCBase64 === 'string' && notoSansSCBase64.length > 1000) {
      pdf.addFileToVFS('NotoSansSC-Regular.ttf', notoSansSCBase64);
      pdf.addFont('NotoSansSC-Regular.ttf', 'NotoSansSC', 'normal');
      pdf.setFont('NotoSansSC', 'normal');
      logger.debug('使用内置中文字体');
      return true;
    }
    
    // 否则尝试从网络加载字体 - 使用多个CDN源作为备选
    const fontUrls = [
      // 本地服务器字体 - 最可靠
      '/fonts/NotoSansSC-Regular.ttf',
      // Google Fonts 直接链接
      'https://fonts.gstatic.com/s/notosanssc/v39/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnYw.ttf'
    ];

    for (const fontUrl of fontUrls) {
      try {
        const response = await fetch(fontUrl);

        if (response.ok) {
          const fontData = await response.arrayBuffer();
          // 将ArrayBuffer转换为base64字符串
          const base64Font = btoa(
            new Uint8Array(fontData).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          // 根据字体文件扩展名设置VFS文件名
          let fontName = 'NotoSansSC.ttf';
          if (fontUrl.endsWith('.otf')) fontName = 'NotoSansSC.otf';
          else if (fontUrl.endsWith('.woff2')) fontName = 'NotoSansSC.woff2';
          else if (fontUrl.endsWith('.woff')) fontName = 'NotoSansSC.woff';
          pdf.addFileToVFS(fontName, base64Font);
          pdf.addFont(fontName, 'NotoSansSC', 'normal');
          pdf.setFont('NotoSansSC', 'normal');
          logger.debug('从CDN加载中文字体成功:', fontUrl);
          return true;
        }
      } catch (urlError) {
        logger.warn(`字体URL加载失败 ${fontUrl}:`, urlError.message);
        continue; // 尝试下一个URL
      }
    }

    // 所有CDN源均失败，使用回退字体
    logger.warn('所有字体CDN源均不可用, 使用回退字体');
    pdf.setFont('helvetica', 'normal');
    return false;
  } catch (error) {
    logger.warn('加载中文字体失败:', error);
    // 使用默认字体作为回退
    pdf.setFont('helvetica', 'normal');
    return false;
  }
};

/**
 * 基础PDF导出函数
 * 性能优化: 使用动态导入jsPDF库
 * @param {Object} data - 导出数据
 * @param {string} filename - 文件名
 * @returns {jsPDF} - PDF实例
 */
export const exportToPDF = async (data, filename = '导出文档') => {
  try {
    // 动态导入jsPDF库
    const jsPDF = await loadJsPDF();

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4'
    });

    // 加载中文字体
    await loadChineseFont(doc);

    // 设置基本样式
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);

    // 返回文档对象供进一步处理
    return doc;
  } catch (error) {
    logger.error('PDF导出初始化错误:', error);
    throw error;
  }
};

/**
 * 优化的HTML到PDF转换函数，支持大型文档和分页
 * 性能优化: 使用动态导入jsPDF和html2canvas库
 * @param {HTMLElement} element - HTML元素
 * @param {Object} options - 配置选项
 * @returns {Promise<boolean>} - 是否成功
 */
export const optimizedHtmlToPdf = async (element, options = {}) => {
  const {
    orientation = 'portrait',
    format = 'a4',
    filename = 'document.pdf',
    scale = 2,
    quality = 0.95,
    chunkSize = 1100, // 每页像素高度
    fontSize = '14px',
    lineHeight = '1.5',
    fontFamily = "'Noto Sans SC', 'Microsoft YaHei', 'SimSun', sans-serif",
    debug = false
  } = options;

  if (!element) {
    throw new Error('找不到要导出的元素');
  }

  try {
    debug && logger.debug(`开始转换HTML到PDF: ${filename}`);

    // 动态导入jsPDF和html2canvas库
    const [jsPDF, html2canvas] = await Promise.all([
      loadJsPDF(),
      loadHtml2Canvas()
    ]);

    // 克隆元素以避免修改原始元素
    const container = element.cloneNode(true);
    
    // 设置容器样式
    container.style.width = orientation === 'portrait' ? '794px' : '1123px';
    container.style.margin = '0';
    container.style.padding = '40px';
    container.style.boxSizing = 'border-box';
    container.style.backgroundColor = 'white';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.fontSize = fontSize;
    container.style.lineHeight = lineHeight;
    container.style.fontFamily = fontFamily;

    // 将容器添加到文档
    document.body.appendChild(container);

    // 等待样式应用
    await new Promise(resolve => setTimeout(resolve, 300));

    // 获取内容尺寸
    const contentHeight = container.scrollHeight;
    const contentWidth = container.scrollWidth;
    debug && logger.debug(`内容总高度: ${contentHeight}px, 宽度: ${contentWidth}px`);

    // 创建PDF文档
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'px',
      format: format,
      compress: true
    });

    // 加载中文字体
    await loadChineseFont(pdf);

    // 获取PDF页面尺寸
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    debug && logger.debug(`PDF页面尺寸: ${pdfWidth}px x ${pdfHeight}px`);

    // 计算页数
    const numPages = Math.ceil(contentHeight / chunkSize);
    debug && logger.debug(`预计页数: ${numPages}`);

    // 处理大型文档，分页生成
    for (let page = 0; page < numPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      // 计算本页的起始位置和高度
      const yStart = page * chunkSize;
      const remainingHeight = contentHeight - yStart;
      const currentChunkHeight = Math.min(chunkSize, remainingHeight);

      debug && logger.debug(`处理第${page + 1}页, 起始位置: ${yStart}px, 高度: ${currentChunkHeight}px`);

      // 临时设置容器样式，只显示当前页内容
      container.style.height = `${contentHeight}px`;
      container.style.overflow = 'hidden';
      
      // 使用CSS裁剪属性来实现精确分页
      container.style.clipPath = `inset(${yStart}px 0px ${contentHeight - yStart - currentChunkHeight}px 0px)`;
      container.style.webkitClipPath = `inset(${yStart}px 0px ${contentHeight - yStart - currentChunkHeight}px 0px)`;

      // 使用html2canvas捕获当前页
      const pageCanvas = await html2canvas(container, {
        scale: scale,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: contentWidth,
        height: currentChunkHeight,
        y: yStart
      });

      // 添加到PDF
      const imgData = pageCanvas.toDataURL('image/jpeg', quality);
      
      // 计算缩放比例，保持图像宽高比
      const scaleFactor = pdfWidth / pageCanvas.width;
      const scaledHeight = pageCanvas.height * scaleFactor;
      
      // 如果生成的图像高度超过PDF页面，进行额外缩放
      let finalHeight = scaledHeight;
      let finalWidth = pdfWidth;
      
      if (scaledHeight > pdfHeight) {
        const extraScale = pdfHeight / scaledHeight;
        finalHeight = pdfHeight;
        finalWidth = pdfWidth * extraScale;
      }
      
      const xOffset = (pdfWidth - finalWidth) / 2; // 居中
      
      pdf.addImage(imgData, 'JPEG', xOffset, 0, finalWidth, finalHeight, '', 'FAST');

      debug && logger.debug(`第${page + 1}页已添加到PDF`);
    }

    // 移除临时元素
    document.body.removeChild(container);

    // 保存PDF
    pdf.save(filename);
    debug && logger.debug(`PDF成功保存: ${filename}`);
    return true;
  } catch (error) {
    logger.error('HTML转PDF错误:', error);
    throw new Error(`PDF生成失败: ${error.message}`);
  }
};

/**
 * 导出报价单为PDF
 * @param {Object} quotation - 报价单数据
 * @param {string} filename - 文件名，不包含扩展名
 * @returns {Promise<boolean>} - 是否成功
 */
export const exportQuotationToPDF = async (quotation, filename = '报价单') => {
  if (!quotation || !quotation.success) {
    throw new Error('报价单数据无效或不完整');
  }

  try {
    // 获取预览元素
    const previewElement = document.querySelector('.quotation-preview-content');
    
    if (previewElement) {
      // 如果已有预览元素，则直接使用
      logger.debug('使用现有预览元素导出PDF');
      return await optimizedHtmlToPdf(previewElement, {
        filename: `${filename}.pdf`,
        debug: false
      });
    } else {
      // 从quotationGenerator创建预览
      logger.debug('创建临时预览元素导出PDF');
      // 导入createQuotationPreview函数
      const { createQuotationPreview } = await import('./quotationGenerator');
      
      if (typeof createQuotationPreview !== 'function') {
        throw new Error('无法加载createQuotationPreview函数');
      }
      
      const tempPreview = createQuotationPreview(quotation);
      document.body.appendChild(tempPreview);
      
      try {
        const result = await optimizedHtmlToPdf(tempPreview, {
          filename: `${filename}.pdf`,
          debug: false
        });
        return result;
      } finally {
        // 确保移除临时元素
        document.body.removeChild(tempPreview);
      }
    }
  } catch (error) {
    logger.error('导出报价单PDF错误:', error);
    throw error;
  }
};

/**
 * 导出技术协议为PDF
 * @param {Object} agreement - 技术协议数据
 * @param {string} filename - 文件名，不包含扩展名
 * @returns {Promise<boolean>} - 是否成功
 */
export const exportAgreementToPDF = async (agreement, filename = '技术协议') => {
  if (!agreement || !agreement.success || !agreement.content) {
    throw new Error('技术协议数据无效或不完整');
  }

  try {
    // 获取预览元素
    const previewElement = document.querySelector('.agreement-preview-content');
    
    if (!previewElement) {
      throw new Error('找不到技术协议预览元素');
    }
    
    return await optimizedHtmlToPdf(previewElement, {
      filename: `${filename}.pdf`,
      debug: false,
      fontSize: '14px',
      lineHeight: '1.5'
    });
  } catch (error) {
    logger.error('导出技术协议PDF错误:', error);
    throw error;
  }
};

/**
 * 导出合同为PDF
 * @param {Object} contract - 合同数据
 * @param {string} filename - 文件名，不包含扩展名
 * @returns {Promise<boolean>} - 是否成功
 */
export const exportContractToPDF = async (contract, filename = '销售合同') => {
  try {
    // 获取预览元素
    const previewElement = document.querySelector('.contract-preview-content');
    
    if (!previewElement) {
      throw new Error('找不到合同预览元素');
    }
    
    return await optimizedHtmlToPdf(previewElement, {
      orientation: 'portrait',
      format: 'a4',
      filename: `${filename}.pdf`,
      scale: 2,
      fontSize: '16px',
      lineHeight: '1.5',
      debug: false
    });
  } catch (error) {
    logger.error('导出合同PDF错误:', error);
    throw error;
  }
};

/**
 * 通用HTML内容导出为PDF
 * @param {string} htmlContent - HTML内容字符串
 * @param {string} filename - 文件名，不包含扩展名
 * @param {Object} options - 配置选项
 * @returns {Promise<boolean>} - 是否成功
 */
export const exportHtmlContentToPDF = async (htmlContent, filename = 'document', options = {}) => {
  try {
    // 创建临时容器
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = htmlContent;
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    document.body.appendChild(tempContainer);
    
    try {
      // 导出为PDF
      return await optimizedHtmlToPdf(tempContainer, {
        filename: `${filename}.pdf`,
        ...options
      });
    } finally {
      // 确保移除临时元素
      document.body.removeChild(tempContainer);
    }
  } catch (error) {
    logger.error('导出HTML内容PDF错误:', error);
    throw error;
  }
};

/**
 * 打印HTML内容
 * @param {HTMLElement} element - 要打印的DOM元素
 * @param {Object} options - 打印选项
 * @param {string} options.title - 打印窗口的标题
 * @param {function} options.beforePrint - 打印前的回调
 * @param {function} options.afterPrint - 打印后的回调
 */
export const printHtmlContent = (element, options = {}) => {
  if (!element) {
    logger.error('打印失败: 未提供有效的DOM元素');
    return;
  }
  
  const { title = '打印内容', beforePrint, afterPrint } = options;
  
  // 打印前回调
  if (typeof beforePrint === 'function') {
    beforePrint();
  }
  
  // 克隆要打印的内容
  const clonedElement = element.cloneNode(true);
  
  // 创建打印样式
  const style = document.createElement('style');
  style.textContent = `
    @media print {
      body { margin: 0; padding: 0; }
      @page { size: A4; margin: 10mm; }
      /* 避免在元素之间分页 */
      .party, .agreement-section, table, tr, .info-row {
        page-break-inside: avoid;
      }
      /* 设置分页前的最小行数 */
      p, li {
        orphans: 3;
        widows: 3;
      }
    }
  `;
  
  // 创建打印框架
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = 'none';
  
  document.body.appendChild(printFrame);
  
  const frameWindow = printFrame.contentWindow;
  const frameDoc = frameWindow.document;
  
  // 写入打印内容
  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        ${document.head.innerHTML}
      </head>
      <body>
        ${clonedElement.outerHTML || ''}
      </body>
    </html>
  `);
  frameDoc.head.appendChild(style);
  frameDoc.close();
  
  // 等待图片加载
  const waitForImages = () => {
    const images = frameDoc.querySelectorAll('img');
    const allImagesLoaded = Array.from(images).every(img => img.complete);
    
    if (allImagesLoaded) {
      // 执行打印
      frameWindow.focus();
      setTimeout(() => {
        frameWindow.print();
        
        // 打印对话框关闭后移除框架
        setTimeout(() => {
          document.body.removeChild(printFrame);
          // 打印后回调
          if (typeof afterPrint === 'function') {
            afterPrint();
          }
        }, 1000);
      }, 500);
    } else {
      // 继续等待图片加载
      setTimeout(waitForImages, 50);
    }
  };
  
  waitForImages();
};