import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { fonts, fontPaths } from './fonts';

// 加载中文字体
const loadChineseFont = async (pdf) => {
  try {
    // 使用 Noto Sans SC 字体
    const fontUrl = 'https://fonts.gstatic.com/s/notosanssc/v36/k3kXo84MPvpLmixcA63oeALhLOCT-xWNm8Hqd37g1OkDRZe7lR4sg1IzSy-MNbE9VH8V.0.woff2';
    
    // 获取字体文件
    const response = await fetch(fontUrl);
    const fontData = await response.arrayBuffer();
    
    // 将字体添加到PDF
    pdf.addFileToVFS('NotoSansSC-Regular.ttf', fontData);
    pdf.addFont('NotoSansSC-Regular.ttf', 'NotoSansSC', 'normal');
    pdf.setFont('NotoSansSC', 'normal');
    
    return true;
  } catch (error) {
    console.warn('加载中文字体失败:', error);
    return false;
  }
};

// 导出为PDF的函数
export const exportToPDF = (data, filename = '导出文档') => {
  try {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4'
    });

    // 加载中文字体
    loadChineseFont(doc);

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

// 通用的 HTML 转 PDF 函数 (支持多页)
const convertHtmlToPdf = async (element, options = {}) => {
  const {
    orientation = 'portrait',
    format = 'a4',
    scale = 2,
    filename = 'document.pdf',
    fontSize = '16px', // Add fontSize option
    lineHeight = '1.5' // Add lineHeight option
  } = options;

  try {
    if (!element) {
      throw new Error('找不到要导出的元素');
    }

    console.log(`开始转换HTML到PDF: ${filename}`);

    // 克隆元素以避免修改原始元素
    const container = element.cloneNode(true);
    
    // 重置容器样式 - 根据方向设置宽度
    container.style.width = orientation === 'portrait' ? '794px' : '1123px'; 
    container.style.margin = '0';
    container.style.padding = '40px';
    container.style.boxSizing = 'border-box';
    container.style.backgroundColor = 'white';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.fontSize = fontSize; // Use provided font size
    container.style.lineHeight = lineHeight; // Use provided line height
    container.style.fontFamily = "'Noto Sans SC', 'Microsoft YaHei', sans-serif"; // Ensure consistent font
    
    // 将容器添加到文档
    document.body.appendChild(container);

    // 等待样式应用和内容渲染
    await new Promise(resolve => setTimeout(resolve, 500));

    // 获取完整内容的高度和宽度
    const contentHeight = container.scrollHeight;
    const contentWidth = container.scrollWidth;
    console.log(`捕获内容尺寸 (${filename}): ${contentWidth} x ${contentHeight}`);

    // 使用html2canvas捕获整个内容区域
    const canvas = await html2canvas(container, {
      scale: scale,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: contentWidth,
      height: contentHeight,
      windowWidth: contentWidth,
      windowHeight: contentHeight
    });

    // 创建 PDF - 使用像素单位和指定的方向
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'px',
      format: format,
      compress: true
    });

    // 配置基本属性
    await loadChineseFont(pdf); // Basic font setup (helvetica)

    // 获取PDF页面尺寸 (in px)
    const pdfPageWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();

    // 将canvas转换为图像
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // 计算图像在PDF中的缩放比例和实际高度
    const ratio = pdfPageWidth / imgWidth;
    const scaledImgHeight = imgHeight * ratio;

    // 计算需要的页数
    const totalPages = Math.ceil(scaledImgHeight / pdfPageHeight);
    console.log(`PDF (${filename}) 页面尺寸: ${pdfPageWidth} x ${pdfPageHeight}, 缩放后高度: ${scaledImgHeight}, 总页数: ${totalPages}`);

    // 循环添加页面
    for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
            pdf.addPage();
        }
        const imageY = (pdfPageHeight * i) / ratio; 
        pdf.addImage(imgData, 'JPEG', 0, -imageY, pdfPageWidth, scaledImgHeight, '', 'FAST');
    }

    // 保存PDF
    console.log(`保存PDF: ${filename}`);
    pdf.save(filename);

    // 清理临时元素
    document.body.removeChild(container);

    console.log(`PDF生成成功: ${filename}`);
    return true;
  } catch (error) {
    console.error(`PDF生成错误 (${filename}):`, error);
    throw new Error(`PDF生成失败 (${filename}): ` + error.message);
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
      fontSize: '14px',
      lineHeight: '1.5',
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
      orientation: 'portrait',
      format: 'a4',
      scale: 2,
      fontSize: '16px',
      lineHeight: '1.5',
      filename: filename
    });
  } catch (error) {
    console.error('导出合同PDF错误:', error);
    throw error;
  }
}; 