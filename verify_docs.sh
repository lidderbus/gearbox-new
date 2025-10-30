#!/bin/bash

echo "========== 文档验证报告 =========="
echo ""

# 检查必需文档
docs=(
    "QUICK_START.md:快速开始指南"
    "DEPLOYMENT_GUIDE.md:详细部署文档"
    "DEPLOYMENT_README.md:部署资源说明"
    "DEPLOYMENT_SUMMARY.txt:部署总结"
)

echo "1. 必需文档检查:"
echo "----------------------------"
for doc in "${docs[@]}"; do
    file="${doc%%:*}"
    desc="${doc##*:}"
    if [ -f "$file" ]; then
        size=$(wc -l < "$file")
        echo "✅ $desc ($file) - $size 行"
    else
        echo "❌ $desc ($file) - 缺失"
    fi
done

echo ""
echo "2. 配置文件检查:"
echo "----------------------------"
configs=(
    "deploy.sh:部署脚本"
    "nginx_gearbox.conf:Nginx配置"
    "Dockerfile:Docker镜像"
    "docker-compose.yml:Docker Compose"
)

for config in "${configs[@]}"; do
    file="${config%%:*}"
    desc="${config##*:}"
    if [ -f "$file" ]; then
        if [ "$file" = "deploy.sh" ]; then
            if [ -x "$file" ]; then
                echo "✅ $desc ($file) - 可执行"
            else
                echo "⚠️  $desc ($file) - 存在但不可执行"
            fi
        else
            echo "✅ $desc ($file) - 存在"
        fi
    else
        echo "❌ $desc ($file) - 缺失"
    fi
done

echo ""
echo "3. 集成文件检查:"
echo "----------------------------"
if [ -f "dashboard-integration.html" ]; then
    lines=$(wc -l < dashboard-integration.html)
    echo "✅ Dashboard集成代码 - $lines 行"
else
    echo "❌ Dashboard集成代码 - 缺失"
fi

echo ""
echo "4. 部署包检查:"
echo "----------------------------"
if [ -f "deployment-package.tar.gz" ]; then
    size=$(du -h deployment-package.tar.gz | cut -f1)
    echo "✅ 部署包 - $size"
else
    echo "❌ 部署包 - 缺失"
fi

echo ""
echo "5. 构建产物检查:"
echo "----------------------------"
if [ -d "build" ]; then
    files=$(find build -type f | wc -l)
    size=$(du -sh build | cut -f1)
    echo "✅ 构建目录 - $files 个文件, $size"
    
    # 检查关键文件
    if [ -f "build/index.html" ]; then
        echo "  ✅ index.html"
    else
        echo "  ❌ index.html 缺失"
    fi
    
    if [ -f "build/gearbox-data.json" ]; then
        echo "  ✅ gearbox-data.json"
    else
        echo "  ❌ gearbox-data.json 缺失"
    fi
    
    if [ -d "build/static" ]; then
        js_count=$(find build/static/js -name "*.js" 2>/dev/null | wc -l)
        css_count=$(find build/static/css -name "*.css" 2>/dev/null | wc -l)
        echo "  ✅ 静态资源 - $js_count JS, $css_count CSS"
    else
        echo "  ❌ static 目录缺失"
    fi
else
    echo "❌ 构建目录 - 缺失"
fi

echo ""
echo "=================================="
