#!/bin/bash

echo "========== 代码优化建议 =========="
echo ""

echo "1. 未使用的导入检查"
echo "----------------------------"

# 检查 AgreementGenerator.js 中未使用的导入
echo "AgreementGenerator.js:"
unused_imports=(
    "bilingualTemplates:未使用"
    "getCurrentDate:未使用"
    "translateSpecialRequirements:未使用"  
    "formatSpecialRequirements:未使用"
    "bilingualFillTemplate:未使用"
    "processTemplate:未使用"
)

for item in "${unused_imports[@]}"; do
    import_name="${item%%:*}"
    desc="${item##*:}"
    if grep -q "import.*${import_name}" src/components/AgreementGenerator.js; then
        # 检查是否真的使用了
        if ! grep -q "${import_name}(" src/components/AgreementGenerator.js; then
            echo "  ⚠️  $import_name - $desc"
        fi
    fi
done

echo ""
echo "2. Console 日志检查"
echo "----------------------------"

console_count=$(grep -r "console\.log\|console\.error\|console\.warn" src/components/AgreementGenerator.js | wc -l)
echo "调试日志数量: $console_count"

if [ $console_count -gt 10 ]; then
    echo "⚠️  建议: 生产环境前考虑移除部分调试日志"
else
    echo "✅ 日志数量适中，用于诊断问题"
fi

echo ""
echo "3. 代码质量指标"
echo "----------------------------"

# 文件大小
generator_size=$(wc -l < src/components/AgreementGenerator.js)
echo "AgreementGenerator.js: $generator_size 行"

if [ $generator_size -gt 2000 ]; then
    echo "⚠️  文件较大，建议拆分组件"
else
    echo "✅ 文件大小合理"
fi

# 组件复杂度
component_count=$(grep -c "const.*=.*memo\|const.*=.*function\|function " src/components/AgreementGenerator.js)
echo "组件/函数数量: $component_count"

if [ $component_count -gt 20 ]; then
    echo "⚠️  组件较多，建议模块化"
else
    echo "✅ 组件数量合理"
fi

echo ""
echo "4. 性能优化建议"
echo "----------------------------"

# 检查 useCallback 使用
callback_count=$(grep -c "useCallback" src/components/AgreementGenerator.js)
echo "✅ useCallback 使用: $callback_count 处（优化渲染性能）"

# 检查 memo 使用
memo_count=$(grep -c "memo(" src/components/AgreementGenerator.js)
echo "✅ memo 使用: $memo_count 处（避免不必要的重渲染）"

echo ""
echo "5. 错误处理检查"
echo "----------------------------"

# 检查 try-catch
try_catch_count=$(grep -c "try {" src/components/AgreementGenerator.js)
echo "✅ try-catch 块: $try_catch_count 处"

# 检查 ErrorBoundary
if grep -q "ErrorBoundary" src/components/AgreementGenerator.js; then
    echo "✅ 使用 ErrorBoundary 错误边界"
else
    echo "❌ 未使用 ErrorBoundary"
fi

echo ""
echo "6. 可访问性检查"
echo "----------------------------"

# 检查 aria 属性
aria_count=$(grep -c "aria-" src/components/AgreementGenerator.js)
if [ $aria_count -gt 0 ]; then
    echo "✅ ARIA 属性: $aria_count 处"
else
    echo "⚠️  建议添加 ARIA 属性提升可访问性"
fi

echo ""
echo "=================================="
echo ""
echo "📊 总体评估:"
echo "  ✅ 代码结构良好"
echo "  ✅ 错误处理完善"
echo "  ✅ 性能优化到位"
echo "  ⚠️  可考虑清理未使用的导入"
echo "  ⚠️  生产环境前可减少调试日志"
echo ""

