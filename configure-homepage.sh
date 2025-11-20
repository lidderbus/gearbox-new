#!/bin/bash

###############################################
# 配置 homepage 用于子路径部署
# 用法: ./configure-homepage.sh [子路径]
# 示例: ./configure-homepage.sh /gearbox
###############################################

set -e

SUBPATH="${1:-/gearbox}"

echo "========================================="
echo "配置 homepage 用于子路径部署"
echo "========================================="
echo ""
echo "子路径: $SUBPATH"
echo ""

# 备份 package.json
if [ ! -f "package.json.backup" ]; then
    echo "📦 备份 package.json..."
    cp package.json package.json.backup
    echo "✅ 已创建备份: package.json.backup"
else
    echo "ℹ️  备份文件已存在: package.json.backup"
fi

echo ""
echo "📝 更新 package.json..."

# 检查是否已存在 homepage
if grep -q '"homepage"' package.json; then
    echo "⚠️  homepage 字段已存在，将被更新"
    # 使用 sed 更新现有的 homepage
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|\"homepage\":.*|\"homepage\": \"$SUBPATH\",|" package.json
    else
        # Linux
        sed -i "s|\"homepage\":.*|\"homepage\": \"$SUBPATH\",|" package.json
    fi
else
    echo "➕ 添加 homepage 字段"
    # 在 "private": true 后面添加 homepage
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|\"private\": true,|\"private\": true,\n  \"homepage\": \"$SUBPATH\",|" package.json
    else
        # Linux
        sed -i "s|\"private\": true,|\"private\": true,\n  \"homepage\": \"$SUBPATH\",|" package.json
    fi
fi

echo "✅ package.json 已更新"
echo ""

# 显示修改后的相关部分
echo "📄 当前配置:"
echo "-------------------------------------------"
grep -A 2 '"homepage"' package.json || echo "homepage 字段已添加"
echo "-------------------------------------------"

echo ""
echo "🔄 下一步操作:"
echo "1. 重新构建项目: npm run build"
echo "2. 部署到服务器: ./deploy.sh"
echo ""
echo "📌 恢复原配置:"
echo "   cp package.json.backup package.json"
echo ""
echo "✅ 配置完成！"
