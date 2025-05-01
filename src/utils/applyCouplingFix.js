// applyCouplingFix.js
// 应用联轴器扭矩单位修复脚本

import { fixAllCouplingUnits } from './fixCouplingTorqueUnit';
import { fixAccessories } from './fixAccessories';

/**
 * 应用所有修复并更新数据
 * 此函数可以在数据验证页面添加"修复联轴器单位"按钮时调用
 * 
 * @param {Object} appData 应用数据对象
 * @param {Function} updateAppData 更新应用数据的函数
 * @returns {Object} 修复结果摘要
 */
export const applyAllFixes = (appData, updateAppData) => {
  if (!appData) {
    console.error("数据无效，无法应用修复");
    return { success: false, message: "数据无效" };
  }

  console.log("开始应用数据修复...");
  
  try {
    // 1. 修复联轴器扭矩单位
    console.log("1. 修复联轴器扭矩单位...");
    const couplingUnitResult = fixAllCouplingUnits(appData);
    let fixedData = couplingUnitResult.data;
    
    // 如果有警告，输出到控制台
    if (couplingUnitResult.warnings && couplingUnitResult.warnings.length > 0) {
      console.warn("联轴器单位修复警告:", couplingUnitResult.warnings);
    }
    
    // 2. 应用全面的配件修复（包括联轴器和备用泵的其他字段）
    console.log("2. 应用全面的配件修复...");
    const accessoriesResult = fixAccessories(fixedData);
    fixedData = accessoriesResult.data;
    
    // 如果有警告或错误，输出到控制台
    if (accessoriesResult.warnings && accessoriesResult.warnings.length > 0) {
      console.warn("配件修复警告:", accessoriesResult.warnings);
    }
    
    if (accessoriesResult.errors && accessoriesResult.errors.length > 0) {
      console.error("配件修复错误:", accessoriesResult.errors);
    }
    
    // 3. 更新应用数据
    console.log("3. 更新应用数据...");
    if (typeof updateAppData === 'function') {
      updateAppData(fixedData);
      console.log("数据已更新");
    } else {
      console.warn("未提供updateAppData函数，数据未更新");
    }
    
    // 4. 返回修复结果摘要
    const summary = {
      success: true,
      couplingUnitFixed: couplingUnitResult.patched,
      accessoriesFixed: accessoriesResult.summary?.totalPatched || 0,
      warnings: [...(couplingUnitResult.warnings || []), ...(accessoriesResult.warnings || [])],
      errors: [...(accessoriesResult.errors || [])]
    };
    
    console.log("修复完成，摘要:", summary);
    return summary;
  } catch (error) {
    console.error("应用修复时发生错误:", error);
    return {
      success: false,
      message: `修复过程中发生错误: ${error.message}`,
      error
    };
  }
};

/**
 * 创建自动修复按钮组件
 * 可以集成到数据库管理页面
 * 
 * @param {Object} props 组件属性
 * @returns {React.Component} 修复按钮组件
 */
export const CouplingFixButton = ({ appData, updateAppData, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const handleClick = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const fixResult = applyAllFixes(appData, updateAppData);
      setResult(fixResult);
      if (typeof onComplete === 'function') {
        onComplete(fixResult);
      }
    } catch (error) {
      setResult({
        success: false,
        message: `执行修复时出错: ${error.message}`,
        error
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="coupling-fix-button">
      <Button 
        variant="warning"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "修复中..." : "修复联轴器单位"}
      </Button>
      
      {result && (
        <Alert variant={result.success ? "success" : "danger"} className="mt-2">
          {result.success ? (
            <>
              <strong>修复成功!</strong>
              <p>已修复 {result.couplingUnitFixed} 个联轴器单位和 {result.accessoriesFixed} 个配件字段。</p>
              {result.warnings.length > 0 && (
                <p>有 {result.warnings.length} 个警告，请查看控制台获取详情。</p>
              )}
            </>
          ) : (
            <>
              <strong>修复失败!</strong>
              <p>{result.message}</p>
            </>
          )}
        </Alert>
      )}
    </div>
  );
};

/**
 * 在DiagnosticPanel组件中集成修复功能
 * 使用示例：
 * 
 * // 在DiagnosticPanel.js中
 * import { integrateFixInDiagnostic } from './applyCouplingFix';
 * 
 * // 然后在render函数中添加
 * {integrateFixInDiagnostic(appData, updateAppData)}
 */
export const integrateFixInDiagnostic = (appData, updateAppData) => {
  return (
    <div className="diagnostic-fix-section">
      <Card className="mb-3">
        <Card.Header>
          <h5>联轴器数据修复</h5>
        </Card.Header>
        <Card.Body>
          <p>
            检测到联轴器数据缺少扭矩单位(torqueUnit)字段，这可能导致单位不一致问题。
            点击下方按钮执行自动修复。
          </p>
          <CouplingFixButton 
            appData={appData} 
            updateAppData={updateAppData}
            onComplete={(result) => {
              if (result.success) {
                // 可以在这里添加成功后的其他操作
                console.log("修复成功，可能需要重新验证数据。");
              }
            }} 
          />
        </Card.Body>
      </Card>
    </div>
  );
};

// 导出默认函数
export default applyAllFixes;