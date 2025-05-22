// src/utils/importHistory.js
export const saveImportHistory = (files, successCount, failedFiles) => {
  try {
    // 获取现有历史记录
    let history = JSON.parse(localStorage.getItem('importHistory') || '[]');
    
    // 创建新记录
    const newRecord = {
      id: Date.now(),
      date: new Date().toISOString(),
      totalFiles: files.length,
      successCount,
      failedCount: failedFiles.length,
      failedFiles: failedFiles.map(f => ({ name: f.name, error: f.error })),
      fileNames: Array.from(files).map(f => f.name)
    };
    
    // 添加到历史记录
    history.unshift(newRecord);
    
    // 保留最近20条记录
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    
    // 保存更新后的历史记录
    localStorage.setItem('importHistory', JSON.stringify(history));
    
    return true;
  } catch (error) {
    console.error('保存导入历史记录失败:', error);
    return false;
  }
};

export const getImportHistory = () => {
  try {
    const history = JSON.parse(localStorage.getItem('importHistory') || '[]');
    return history;
  } catch (error) {
    console.error('获取导入历史记录失败:', error);
    return [];
  }
};

export const clearImportHistory = () => {
  try {
    localStorage.removeItem('importHistory');
    return true;
  } catch (error) {
    console.error('清除导入历史记录失败:', error);
    return false;
  }
};
