import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * 优化的HTML导出为PDF函数，支持中文和表格
 * @param {HTMLElement} element - 要导出的DOM元素
 * @param {Object} options - 导出选项
 * @returns {Promise} - 导出操作的Promise
 */
export const exportHtmlContentToPDF = (element, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      // 默认选项
      const defaultOptions = {
        margin: 10,
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          letterRendering: true,
          foreignObjectRendering: true
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true,
          // 添加以支持中文
          language: 'AcroForm',
          putOnlyUsedFonts: true,
        },
        fontFamily: "'SimSun', 'SimHei', 'Microsoft YaHei', 'sans-serif'",
        // 处理中文
        enableChineseFont: true
      };
      
      // 合并选项
      const mergedOptions = { ...defaultOptions, ...options };
      
      // 创建临时副本以避免修改原始元素
      const clonedElement = element.cloneNode(true);
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);
      
      // 如果需要中文支持，添加字体
      if (mergedOptions.enableChineseFont) {
        // 添加中文样式
        const styleElement = document.createElement('style');
        styleElement.textContent = `
          @font-face {
            font-family: 'SimSun';
            src: local('SimSun');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'SimHei';
            src: local('SimHei');
            font-weight: bold;
            font-style: normal;
          }
          @font-face {
            font-family: 'Microsoft YaHei';
            src: local('Microsoft YaHei');
            font-weight: normal;
            font-style: normal;
          }
          .pdf-content * {
            font-family: ${mergedOptions.fontFamily};
          }
          .pdf-content table {
            width: 100%;
            border-collapse: collapse;
          }
          .pdf-content table td, .pdf-content table th {
            border: 1px solid #000;
            padding: 8px;
          }
          .pdf-content .page-break {
            page-break-after: always;
          }
        `;
        clonedElement.classList.add('pdf-content');
        clonedElement.appendChild(styleElement);
      }
      
      // 强化表格样式
      const tables = clonedElement.querySelectorAll('table');
      tables.forEach(table => {
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';
        table.style.marginBottom = '15px';
        
        // 设置表格内单元格样式
        const cells = table.querySelectorAll('td, th');
        cells.forEach(cell => {
          cell.style.border = '1px solid #000';
          cell.style.padding = '8px';
        });
      });
      
      // 使用html2pdf进行转换
      html2pdf()
        .from(clonedElement)
        .set(mergedOptions)
        .save()
        .then(() => {
          // 清理临时元素
          document.body.removeChild(tempContainer);
          resolve();
        })
        .catch(error => {
          // 错误处理
          console.error('PDF导出失败:', error);
          
          // 尝试备用方案
          try {
            // 使用备用方案
            fallbackExportToPDF(clonedElement, mergedOptions)
              .then(() => {
                document.body.removeChild(tempContainer);
                resolve();
              })
              .catch(fallbackError => {
                document.body.removeChild(tempContainer);
                reject(fallbackError);
              });
          } catch (fallbackError) {
            document.body.removeChild(tempContainer);
            reject(fallbackError);
          }
        });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 备用PDF导出方法(使用分段渲染)
 * @param {HTMLElement} element - 要导出的元素
 * @param {Object} options - 导出选项
 * @returns {Promise} - 导出操作的Promise
 */
const fallbackExportToPDF = async (element, options) => {
  const { jsPDF: jsPDFOptions, filename } = options;
  
  // 获取元素尺寸
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  
  // 计算需要的页数(一页大约能容纳800px高度)
  const pageHeight = 800;
  const pageCount = Math.ceil(height / pageHeight);
  
  // 创建PDF文档
  const pdf = new jsPDF({
    orientation: jsPDFOptions.orientation,
    unit: 'pt',
    format: jsPDFOptions.format
  });
  
  // 逐页渲染
  for (let i = 0; i < pageCount; i++) {
    // 计算当前页的位置和高度
    const yPosition = -i * pageHeight;
    const canvasHeight = Math.min(pageHeight, height - i * pageHeight);
    
    // 创建临时容器
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '0';
    tempDiv.style.top = yPosition + 'px';
    tempDiv.style.width = width + 'px';
    tempDiv.style.height = canvasHeight + 'px';
    tempDiv.style.overflow = 'hidden';
    
    // 克隆元素
    const clonedElement = element.cloneNode(true);
    clonedElement.style.position = 'absolute';
    clonedElement.style.top = yPosition + 'px';
    clonedElement.style.width = width + 'px';
    clonedElement.style.height = height + 'px';
    
    tempDiv.appendChild(clonedElement);
    document.body.appendChild(tempDiv);
    
    // 转为Canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      letterRendering: true
    });
    
    // 将Canvas添加到PDF
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // 从第二页开始添加新页
    if (i > 0) {
      pdf.addPage();
    }
    
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    
    // 清理临时元素
    document.body.removeChild(tempDiv);
  }
  
  // 保存PDF
  pdf.save(filename);
  
  return Promise.resolve();
};

/**
 * 打印HTML内容
 * @param {HTMLElement} element - 要打印的元素
 * @param {Object} options - 打印选项
 */
export const printHtmlContent = (element, options = {}) => {
  const { title = 'Print', beforePrint, afterPrint } = options;
  
  // 创建打印框架
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'fixed';
  printFrame.style.left = '-9999px';
  printFrame.style.top = '0';
  printFrame.name = 'print-frame-' + new Date().getTime();
  document.body.appendChild(printFrame);
  
  // 获取框架文档
  const frameDoc = printFrame.contentWindow.document;
  
  // 添加原始样式
  const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
  const stylesHTML = Array.from(styles).map(style => style.outerHTML).join('');
  
  // 设置框架内容
  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      ${stylesHTML}
      <style>
        @media print {
          body {
            font-family: 'SimSun', 'Microsoft YaHei', Arial, sans-serif;
          }
          
          table {
            border-collapse: collapse;
            width: 100%;
          }
          
          table td, table th {
            border: 1px solid #000;
            padding: 8px;
          }
          
          .page-break {
            page-break-after: always;
          }
          
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      </style>
    </head>
    <body>
      ${element.outerHTML}
    </body>
    </html>
  `);
  frameDoc.close();
  
  // 调用打印前回调
  if (typeof beforePrint === 'function') {
    beforePrint();
  }
  
  // 等待样式加载
  setTimeout(() => {
    // 打印内容
    printFrame.contentWindow.focus();
    printFrame.contentWindow.print();
    
    // 打印后处理
    if (typeof afterPrint === 'function') {
      afterPrint();
    }
    
    // 清理打印框架
    setTimeout(() => {
      document.body.removeChild(printFrame);
    }, 1000);
  }, 500);
};

/**
 * 优化HTML导出为PDF (一体化函数)
 * @param {string|HTMLElement} htmlContent - HTML内容字符串或DOM元素
 * @param {Object} options - 导出选项
 * @returns {Promise} - 导出操作的Promise
 */
export const optimizedHtmlToPdf = async (htmlContent, options = {}) => {
  // 创建临时容器
  const tempContainer = document.createElement('div');
  tempContainer.className = 'pdf-content';
  
  // 如果传入的是HTML字符串，则设置innerHTML
  if (typeof htmlContent === 'string') {
    tempContainer.innerHTML = htmlContent;
  } 
  // 如果传入的是DOM元素，则复制
  else if (htmlContent instanceof Element) {
    tempContainer.appendChild(htmlContent.cloneNode(true));
  } else {
    return Promise.reject(new Error('无效的HTML内容'));
  }
  
  // 添加到文档
  document.body.appendChild(tempContainer);
  
  try {
    // 使用导出函数
    await exportHtmlContentToPDF(tempContainer, options);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  } finally {
    // 移除临时容器
    document.body.removeChild(tempContainer);
  }
};