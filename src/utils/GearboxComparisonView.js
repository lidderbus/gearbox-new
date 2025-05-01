// GearboxDataImporter.js - 简化的齿轮箱数据导入组件
import React, { useState, useRef } from 'react';

// 简化版齿轮箱数据导入组件
function GearboxDataImporter({ onDataUpdate }) {
  // 状态
  const [activeTab, setActiveTab] = useState('paste');
  const [pasteContent, setPasteContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [importedData, setImportedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  // 集合映射
  // 集合映射配置 - 决定导入数据如何映射到系统中的集合
  const collectionMapping = {
    // 标准集合直接映射
    "hcGearboxes": "hcGearboxes",         // HC系列齿轮箱
    "gwGearboxes": "gwGearboxes",         // GW系列齿轮箱
    "hcmGearboxes": "hcmGearboxes",       // HCM系列齿轮箱
    "dtGearboxes": "dtGearboxes",         // DT系列齿轮箱
    "hcqGearboxes": "hcqGearboxes",       // HCQ系列齿轮箱
    "gcGearboxes": "gcGearboxes",         // GC系列齿轮箱
    
    // 特殊类型映射到标准集合
    "hcmAluminumGearboxes": "hcmGearboxes", // 铝合金HCM映射到标准HCM
    "twoSpeedGearboxes": "hcqGearboxes",    // 双速齿轮箱映射到HCQ特种
    "hybridGearboxes": "hcqGearboxes",      // 混合动力映射到HCQ特种
    "twinInputGearboxes": "gwGearboxes",    // 双输入映射到GW系列
    
    // 附件类映射
    "flexibleCouplings": "flexibleCouplings", // 高弹性联轴器
    "standbyPumps": "standbyPumps",           // 备用泵
    "hclClutches": "flexibleCouplings"        // 液压离合器映射到联轴器
  };

  // 处理文件选择
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const fileContent = e.target.result;
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (fileExtension === 'json') {
          // 处理JSON文件
          const jsonData = JSON.parse(fileContent);
          setImportedData(jsonData);
          setShowPreview(true);
          setSuccess('JSON文件解析成功，请检查预览并确认导入');
        } else if (fileExtension === 'py' || fileExtension === 'js') {
          // 处理Python或JavaScript格式文件
          const exportMatch = fileContent.match(/export\s+const\s+(\w+)\s*=\s*/);
          if (exportMatch) {
            const varName = exportMatch[1]; // 例如 advanceGearboxData
            try {
              // 安全地执行代码提取数据
              const funcBody = `
                ${fileContent}
                return typeof ${varName} !== 'undefined' ? ${varName} : null;
              `;
              const dataFunc = new Function(funcBody);
              const result = dataFunc();
              
              if (result && typeof result === 'object') {
                setImportedData(result);
                setShowPreview(true);
                setSuccess(`${file.name} 文件解析成功，请检查预览并确认导入`);
              } else {
                throw new Error(`无法从${file.name}提取有效数据`);
              }
            } catch (execError) {
              setError(`执行文件代码失败: ${execError.message}`);
            }
          } else {
            setError(`未找到导出常量定义，请确保文件格式正确，应包含如 "export const xxxx = {...}" 的格式`);
          }
        } else {
          setError(`不支持的文件类型: ${fileExtension}，请使用JSON、JS或PY文件`);
        }
      } catch (err) {
        setError(`解析文件失败: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('读取文件失败');
      setLoading(false);
    };
    
    reader.readAsText(file);
  };

  // 处理文本粘贴
  const handlePaste = () => {
    if (!pasteContent.trim()) {
      setError('请先输入数据');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 检查是否为JS导出格式
      const jsMatch = pasteContent.match(/export\s+const\s+(\w+)\s*=\s*/);
      
      if (jsMatch) {
        // 处理JS格式
        try {
          const funcBody = `
            ${pasteContent}
            return typeof ${jsMatch[1]} !== 'undefined' ? ${jsMatch[1]} : null;
          `;
          const dataFunc = new Function(funcBody);
          const result = dataFunc();
          
          if (result && typeof result === 'object') {
            setImportedData(result);
            setShowPreview(true);
            setSuccess('数据解析成功，请检查预览并确认导入');
          } else {
            throw new Error('从JS代码提取数据失败');
          }
        } catch (err) {
          setError(`解析JS数据失败: ${err.message}`);
        }
      } else {
        // 尝试解析JSON
        const jsonData = JSON.parse(pasteContent);
        setImportedData(jsonData);
        setShowPreview(true);
        setSuccess('数据解析成功，请检查预览并确认导入');
      }
    } catch (err) {
      setError(`解析数据失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 执行导入
  const handleImport = () => {
    if (!importedData) {
      setError('没有可导入的数据');
      return;
    }

    setLoading(true);
    
    try {
      // 预处理特殊格式的数据
      const processedData = preprocessSpecialData(importedData);
      
      // 创建最终导入数据结构
      const finalData = {};
      
      // 处理数据映射
      Object.keys(processedData).forEach(sourceKey => {
        if (Array.isArray(processedData[sourceKey]) && collectionMapping[sourceKey]) {
          const targetKey = collectionMapping[sourceKey];
          
          if (!finalData[targetKey]) {
            finalData[targetKey] = [];
          }
          
          // 合并数据
          finalData[targetKey] = [
            ...finalData[targetKey],
            ...processedData[sourceKey]
          ];
        }
      });
      
      // 如果有onDataUpdate回调，调用它
      if (onDataUpdate && typeof onDataUpdate === 'function') {
        onDataUpdate(prevData => {
          // 合并到现有数据
          const result = { ...prevData };
          
          // 遍历最终数据的每个集合
          Object.keys(finalData).forEach(key => {
            if (!Array.isArray(result[key])) {
              result[key] = [];
            }
            
            // 合并数组，保留唯一model
            const existingModels = new Set(result[key].map(item => item.model));
            const newItems = finalData[key].filter(item => !existingModels.has(item.model));
            
            result[key] = [...result[key], ...newItems];
          });
          
          return result;
        });
        
        const totalItemCount = Object.values(finalData).reduce((total, items) => 
          total + (Array.isArray(items) ? items.length : 0), 0);
        
        setSuccess(`导入完成！已导入${Object.keys(finalData).length}个分类的数据，共计${totalItemCount}个项目`);
        
        // 重置状态
        setTimeout(() => {
          setPasteContent('');
          setImportedData(null);
          setShowPreview(false);
        }, 2000);
      } else {
        setError('未提供数据更新函数');
      }
    } catch (err) {
      setError(`导入失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 预处理特殊格式的数据
  const preprocessSpecialData = (data) => {
    const result = { ...data };
    
    // 处理铝合金箱体齿轮箱
    if (result.hcmAluminumGearboxes && Array.isArray(result.hcmAluminumGearboxes)) {
      result.hcmAluminumGearboxes = result.hcmAluminumGearboxes.map(item => {
        const newItem = { ...item };
        // 标记来源
        newItem._sourceType = 'hcmAluminumGearboxes';
        
        // 处理复杂的 transferCapacity
        if (newItem.transferCapacity && typeof newItem.transferCapacity === 'object') {
          // 保存原始结构
          newItem._originalCapacity = { ...newItem.transferCapacity };
          
          // 使用 P 工况(休闲工况)作为默认值
          if (Array.isArray(newItem.transferCapacity.P)) {
            newItem.transferCapacity = newItem.transferCapacity.P;
          } else {
            // 创建一个简化的传递能力数组或值
            newItem.transferCapacity = 
              Array.isArray(newItem.transferCapacity.M) ? newItem.transferCapacity.M : 
              Array.isArray(newItem.transferCapacity.P) ? newItem.transferCapacity.P : 
              typeof newItem.transferCapacity.M === 'number' ? newItem.transferCapacity.M :
              typeof newItem.transferCapacity.P === 'number' ? newItem.transferCapacity.P : 0.1;
          }
        }
        return newItem;
      });
    }
    
    // 处理双速齿轮箱
    if (result.twoSpeedGearboxes && Array.isArray(result.twoSpeedGearboxes)) {
      result.twoSpeedGearboxes = result.twoSpeedGearboxes.map(item => {
        const newItem = { ...item };
        // 标记来源
        newItem._sourceType = 'twoSpeedGearboxes';
        newItem._isTwoSpeed = true;
        
        // 处理 slowRatios 和 fastRatios
        if (item.slowRatios) {
          // 使用慢速比作为主要减速比
          newItem.ratios = item.slowRatios;
          newItem._fastRatios = item.fastRatios; // 保存快速比数据
          delete newItem.slowRatios;
          delete newItem.fastRatios;
        }
        
        // 如果 transferCapacity 是字符串，尝试转换为数值
        if (typeof newItem.transferCapacity === 'string') {
          const match = newItem.transferCapacity.match(/\d+(\.\d+)?/);
          if (match) {
            newItem._originalCapacityString = newItem.transferCapacity;
            newItem.transferCapacity = parseFloat(match[0]);
          }
        }
        
        return newItem;
      });
    }
    
    // 处理混合动力齿轮箱
    if (result.hybridGearboxes && Array.isArray(result.hybridGearboxes)) {
      result.hybridGearboxes = result.hybridGearboxes.map(item => {
        const newItem = { ...item };
        // 标记来源
        newItem._sourceType = 'hybridGearboxes';
        newItem._isHybrid = true;
        
        // 使用主输入减速比作为标准减速比
        if (newItem.mainRatios) {
          newItem.ratios = newItem.mainRatios;
          newItem._mainRatios = newItem.mainRatios; // 保留原字段
          
          // 保留PTI相关信息
          newItem._ptiRatios = newItem.ptiRatios;
          newItem._ptiTransferCapacity = newItem.ptiTransferCapacity;
          newItem._ptiInputSpeedRange = newItem.ptiInputSpeedRange;
          newItem._ptiRotationDirection = newItem.ptiRotationDirection;
          
          delete newItem.mainRatios;
          delete newItem.ptiRatios;
          delete newItem.ptiTransferCapacity;
          delete newItem.ptiInputSpeedRange;
          delete newItem.ptiRotationDirection;
        }
        
        // 使用主输入传递能力作为标准传递能力
        if (newItem.mainTransferCapacity) {
          newItem.transferCapacity = newItem.mainTransferCapacity;
          newItem._mainTransferCapacity = newItem.mainTransferCapacity; // 保留原字段
          delete newItem.mainTransferCapacity;
        }
        
        return newItem;
      });
    }
    
    return result;
  };

  // 关闭预览
  const handleClosePreview = () => {
    setShowPreview(false);
  };

  // 触发文件选择
  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 渲染数据预览
  const renderDataPreview = () => {
    if (!importedData) return null;
    
    // 数据集合类型名称映射
    const collectionTypes = {
      hcGearboxes: 'HC系列齿轮箱',
      gwGearboxes: 'GW系列齿轮箱',
      hcmGearboxes: 'HCM系列齿轮箱',
      dtGearboxes: 'DT系列齿轮箱',
      hcqGearboxes: 'HCQ系列齿轮箱',
      gcGearboxes: 'GC系列齿轮箱',
      twoSpeedGearboxes: '双速齿轮箱',
      hybridGearboxes: '混合动力齿轮箱',
      flexibleCouplings: '高弹性联轴器',
      standbyPumps: '备用泵',
      hclClutches: '液压离合器',
      hcmAluminumGearboxes: 'HCM铝合金齿轮箱',
      twinInputGearboxes: '双输入齿轮箱'
    };
    
    // 检查数据中是否有特殊类型需要特别处理
    const hasSpecialTypes = Object.keys(importedData).some(key => 
      ['hcmAluminumGearboxes', 'twoSpeedGearboxes', 'hybridGearboxes', 'hclClutches', 'twinInputGearboxes'].includes(key)
    );
    
    // 生成预览部分
    const sections = Object.keys(importedData)
      .filter(key => Array.isArray(importedData[key]) && importedData[key].length > 0)
      .map(key => {
        const items = importedData[key];
        const typeName = collectionTypes[key] || key;
        const targetCollection = collectionMapping[key] || '未映射';
        const targetTypeName = collectionTypes[targetCollection] || targetCollection;
        
        // 检查是否为特殊类型
        const isSpecialType = ['hcmAluminumGearboxes', 'twoSpeedGearboxes', 'hybridGearboxes'].includes(key);
        
        return (
          <div key={key} style={previewStyles.section}>
            <h4 style={previewStyles.sectionTitle}>
              {typeName} ({items.length}项)
              <span style={previewStyles.mappingInfo}>
                映射到: {targetTypeName}
                {isSpecialType && <span style={{color: '#f59e0b', marginLeft: '5px'}}>(需特殊处理)</span>}
              </span>
            </h4>
            <div style={previewStyles.itemsGrid}>
              {items.slice(0, 3).map((item, idx) => (
                <div key={idx} style={previewStyles.item}>
                  <div style={previewStyles.itemTitle}>{item.model || `项目 #${idx+1}`}</div>
                  <div style={previewStyles.itemDetails}>
                    {/* 特殊处理双速齿轮箱的显示方式 */}
                    {key === 'twoSpeedGearboxes' && item.slowRatios && (
                      <div>
                        <div>慢档减速比: {Array.isArray(item.slowRatios) ? 
                          item.slowRatios.join(', ') : item.slowRatios}</div>
                        <div>快档减速比: {Array.isArray(item.fastRatios) && item.fastRatios.length > 0 ? 
                          '多组比值' : '无快档比'}</div>
                      </div>
                    )}
                    
                    {/* 特殊处理混合动力齿轮箱的显示方式 */}
                    {key === 'hybridGearboxes' && item.mainRatios && (
                      <div>
                        <div>主减速比: {Array.isArray(item.mainRatios) ? 
                          item.mainRatios.join(', ') : item.mainRatios}</div>
                        <div>PTI减速比: {Array.isArray(item.ptiRatios) ? 
                          '多组比值' : '无PTI比'}</div>
                      </div>
                    )}
                    
                    {/* 标准齿轮箱字段显示 */}
                    {key !== 'twoSpeedGearboxes' && key !== 'hybridGearboxes' && (
                      <>
                        {item.ratios && <div>减速比: {Array.isArray(item.ratios) ? 
                          (item.ratios.length > 5 ? `${item.ratios.slice(0, 5).join(', ')}...` : item.ratios.join(', ')) : 
                          item.ratios}</div>}
                        
                        {item.transferCapacity && 
                          <div>传递能力: {
                            typeof item.transferCapacity === 'object' ? 
                              '复杂数据结构' : 
                              Array.isArray(item.transferCapacity) ? 
                                (item.transferCapacity.length > 3 ? 
                                  `${item.transferCapacity.slice(0, 3).join(', ')}...` : 
                                  item.transferCapacity.join(', ')) : 
                                item.transferCapacity
                          }</div>
                        }
                      </>
                    )}
                    
                    {item.thrust && <div>推力: {item.thrust} kN</div>}
                    {item.weight && <div>重量: {
                      // 处理吨和千克的单位转换
                      typeof item.weight === 'number' && item.weight < 100 ? 
                        `${item.weight} t` : `${item.weight} ${typeof item.weight === 'number' && item.weight < 100 ? 't' : 'kg'}`
                    }</div>}
                    
                    {/* 特殊字段提示 */}
                    {item.dimensions && <div>尺寸: {item.dimensions}</div>}
                    {item.controlType && <div>控制方式: {item.controlType}</div>}
                  </div>
                </div>
              ))}
              {items.length > 3 && (
                <div style={previewStyles.moreItems}>
                  还有 {items.length - 3} 项...
                </div>
              )}
            </div>
          </div>
        );
      });
      
    // 如果有特殊类型数据，添加提示信息
    const specialTypeNotice = hasSpecialTypes ? (
      <div style={{
        marginBottom: '20px',
        padding: '10px 15px',
        backgroundColor: '#fff8e6',
        border: '1px solid #ffd580',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>注意:</strong> 检测到特殊类型的齿轮箱数据（如混合动力、双速齿轮箱等）。导入器将自动处理这些特殊数据结构，使其适配现有系统。
      </div>
    ) : null

    // 如果有特殊类型数据，添加提示信息
    const specialTypeNotice = hasSpecialTypes ? (
      <div style={{
        marginBottom: '20px',
        padding: '10px 15px',
        backgroundColor: '#fff8e6',
        border: '1px solid #ffd580',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>注意:</strong> 检测到特殊类型的齿轮箱数据（如混合动力、双速齿轮箱等）。导入器将自动处理这些特殊数据结构，使其适配现有系统。
      </div>
    ) : null;

    return (
      <div style={previewStyles.container}>
        <h3 style={previewStyles.title}>数据预览</h3>
        <div style={previewStyles.summary}>
          检测到 {Object.keys(importedData).filter(key => 
            Array.isArray(importedData[key]) && importedData[key].length > 0
          ).length} 个数据集合，共 {
            Object.values(importedData).reduce((total, items) => 
              total + (Array.isArray(items) ? items.length : 0), 0)
          } 项数据
        </div>
        
        {specialTypeNotice}
        {sections}
      </div>
    );
  };

  // 样式定义
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '24px',
      marginBottom: '20px',
      color: '#333'
    },
    tabContainer: {
      display: 'flex',
      borderBottom: '1px solid #ddd',
      marginBottom: '20px'
    },
    tab: {
      padding: '10px 20px',
      cursor: 'pointer',
      backgroundColor: '#f1f1f1',
      border: '1px solid #ddd',
      borderBottom: 'none',
      borderRadius: '4px 4px 0 0',
      marginRight: '5px'
    },
    activeTab: {
      backgroundColor: '#fff',
      borderBottom: '1px solid #fff',
      marginBottom: '-1px'
    },
    tabContent: {
      marginBottom: '20px'
    },
    textarea: {
      width: '100%',
      minHeight: '200px',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontFamily: 'monospace',
      fontSize: '14px',
      marginBottom: '10px'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#4285F4',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonSecondary: {
      backgroundColor: '#f1f1f1',
      color: '#333',
      border: '1px solid #ddd'
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px'
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px'
    },
    fileInput: {
      display: 'none'
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: 'bold'
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer'
    }
  };

  const previewStyles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      padding: '10px'
    },
    title: {
      fontSize: '20px',
      marginBottom: '15px'
    },
    summary: {
      marginBottom: '20px',
      padding: '10px',
      backgroundColor: '#f0f7ff',
      borderRadius: '4px'
    },
    section: {
      marginBottom: '20px',
      padding: '10px',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px'
    },
    sectionTitle: {
      fontSize: '16px',
      marginBottom: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    mappingInfo: {
      fontSize: '14px',
      color: '#666',
      fontWeight: 'normal'
    },
    itemsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '10px'
    },
    item: {
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '10px',
      backgroundColor: 'white'
    },
    itemTitle: {
      fontWeight: 'bold',
      marginBottom: '5px'
    },
    itemDetails: {
      fontSize: '14px',
      color: '#666'
    },
    moreItems: {
      gridColumn: '1 / -1',
      textAlign: 'center',
      padding: '10px',
      backgroundColor: '#f1f1f1',
      borderRadius: '4px'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>齿轮箱数据导入</h2>
      
      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}
      
      <div style={styles.tabContainer}>
        <div 
          style={{
            ...styles.tab,
            ...(activeTab === 'paste' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('paste')}
        >
          粘贴导入
        </div>
        <div 
          style={{
            ...styles.tab,
            ...(activeTab === 'file' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('file')}
        >
          文件导入
        </div>
      </div>
      
      <div style={styles.tabContent}>
        {activeTab === 'paste' && (
          <>
            <textarea 
              style={styles.textarea}
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              placeholder="粘贴齿轮箱数据（JSON格式或JavaScript格式，例如从paste.txt复制的内容）"
            />
            <button 
              style={{
                ...styles.button,
                ...(loading || !pasteContent.trim() ? styles.buttonDisabled : {})
              }}
              onClick={handlePaste}
              disabled={loading || !pasteContent.trim()}
            >
              {loading ? '解析中...' : '解析数据'}
            </button>
          </>
        )}
        
        {activeTab === 'file' && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              style={styles.fileInput}
              onChange={handleFileSelect}
              accept=".json,.js,.py"
            />
            <button 
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {})
              }}
              onClick={triggerFileSelect}
              disabled={loading}
            >
              {loading ? '处理中...' : '选择数据文件 (.json, .js, .py)'}
            </button>
          </>
        )}
      </div>
      
      {showPreview && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>数据预览</div>
              <button style={styles.closeButton} onClick={handleClosePreview}>×</button>
            </div>
            
            {renderDataPreview()}
            
            <div style={styles.buttonGroup}>
              <button 
                style={styles.button}
                onClick={handleImport}
                disabled={loading}
              >
                {loading ? '导入中...' : '确认导入'}
              </button>
              <button 
                style={{...styles.button, ...styles.buttonSecondary}}
                onClick={handleClosePreview}
                disabled={loading}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GearboxDataImporter;