import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { fonts, fontPaths } from './fonts';

// 导出为PDF的函数
export const exportToPDF = (data, filename = '导出文档') => {
  try {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4'
    });

    // 添加中文字体支持
    Object.entries(fonts['NotoSansSC-Regular']).forEach(([style, fontFile]) => {
      doc.addFileToVFS(fontFile, fontPaths[fontFile]);
      doc.addFont(fontFile, 'NotoSansSC', style);
    });
    doc.setFont('NotoSansSC', 'normal');

    // 设置基本样式
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);

    // 返回文档对象供进一步处理
    return doc;
  } catch (error) {
    console.error('PDF导出错误:', error);
    throw error;
  }
};

// 导出报价单为PDF
export const exportQuotationToPDF = (quotation, filename = '报价单') => {
  try {
    const doc = exportToPDF(quotation, filename);
    
    // 在这里添加报价单特定的PDF生成逻辑
    
    // 保存文件
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('报价单导出错误:', error);
    throw error;
  }
};

// 通用的 HTML 转 PDF 函数
const convertHtmlToPdf = async (element, options = {}) => {
  const {
    orientation = 'portrait',
    format = 'a4',
    scale = 2,
    filename = 'document.pdf'
  } = options;

  try {
    // 克隆元素以避免修改原始元素
    const container = element.cloneNode(true);
    
    // 重置容器样式
    container.style.width = orientation === 'portrait' ? '794px' : '1123px';
    container.style.margin = '0';
    container.style.padding = '40px';
    container.style.boxSizing = 'border-box';
    container.style.backgroundColor = 'white';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.transform = 'none';
    
    // 将容器添加到文档
    document.body.appendChild(container);

    // 获取实际内容高度
    const contentHeight = container.scrollHeight;
    const pageHeight = orientation === 'portrait' ? 1123 : 794;
    const pageCount = Math.ceil(contentHeight / pageHeight);

    // 创建 PDF
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'pt',
      format: format,
      compress: true
    });

    // 逐页处理
    for (let i = 0; i < pageCount; i++) {
      // 设置容器样式以显示当前页
      container.style.top = `${-i * pageHeight}px`;

      // 转换当前页为 canvas
      const canvas = await html2canvas(container, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        height: pageHeight,
        y: i * pageHeight,
        scrollY: -i * pageHeight,
        windowHeight: pageHeight
      });

      // 将 canvas 转换为图片
      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      // 如果不是第一页，添加新页
      if (i > 0) {
        pdf.addPage();
      }

      // 添加图片到 PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }

    // 移除临时容器
    document.body.removeChild(container);

    // 保存 PDF
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF导出错误:', error);
    throw error;
  }
};

// 导出技术协议为PDF
export const exportAgreementToPDF = async (agreement, filename = '技术协议.pdf') => {
  if (!agreement || !agreement.success || !agreement.content) {
    throw new Error('技术协议数据无效或不完整');
  }

  try {
    // 获取预览元素
    const previewElement = document.querySelector('.agreement-preview-content');
    if (!previewElement) {
      throw new Error('找不到技术协议预览元素');
    }

    // 导出为PDF
    return await convertHtmlToPdf(previewElement, {
      orientation: 'portrait',
      format: 'a4',
      scale: 2,
      filename: filename
    });
  } catch (error) {
    console.error('导出技术协议PDF错误:', error);
    throw error;
  }
};

// 导出合同为PDF
export const exportContractToPDF = async (contract, filename = '销售合同.pdf') => {
  try {
    // 获取预览元素
    const previewElement = document.querySelector('.contract-preview-content');
    if (!previewElement) {
      throw new Error('找不到合同预览元素');
    }

    // 导出为PDF
    return await convertHtmlToPdf(previewElement, {
      orientation: 'landscape',
      format: 'a4',
      scale: 2,
      filename: filename
    });
  } catch (error) {
    console.error('导出合同PDF错误:', error);
    throw error;
  }
}; 