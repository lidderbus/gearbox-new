#!/bin/bash

echo "========== 配置文件验证 =========="
echo ""

# 验证 Nginx 配置
echo "1. Nginx 配置验证:"
echo "----------------------------"
if grep -q "location /gearbox" nginx_gearbox.conf; then
    echo "✅ 包含 /gearbox 路径配置"
else
    echo "❌ 缺少 /gearbox 路径配置"
fi

if grep -q "try_files" nginx_gearbox.conf; then
    echo "✅ 包含 try_files 配置"
else
    echo "❌ 缺少 try_files 配置"
fi

if grep -q "gzip" nginx_gearbox.conf; then
    echo "✅ 包含 gzip 压缩配置"
else
    echo "⚠️  未配置 gzip 压缩"
fi

echo ""
echo "2. Docker 配置验证:"
echo "----------------------------"

# 验证 Dockerfile
if grep -q "FROM nginx:alpine" Dockerfile; then
    echo "✅ Dockerfile 使用 nginx:alpine 基础镜像"
else
    echo "❌ Dockerfile 基础镜像配置问题"
fi

if grep -q "COPY build" Dockerfile; then
    echo "✅ Dockerfile 包含构建文件复制"
else
    echo "❌ Dockerfile 缺少构建文件复制"
fi

# 验证 docker-compose.yml
if grep -q "gearbox-system" docker-compose.yml; then
    echo "✅ docker-compose.yml 服务名称正确"
else
    echo "❌ docker-compose.yml 服务名称问题"
fi

if grep -q "8080:80" docker-compose.yml; then
    echo "✅ docker-compose.yml 端口映射正确"
else
    echo "⚠️  docker-compose.yml 端口映射可能需要调整"
fi

echo ""
echo "3. 部署脚本验证:"
echo "----------------------------"

if grep -q "SERVER_IP=" deploy.sh; then
    server_ip=$(grep "SERVER_IP=" deploy.sh | head -1 | cut -d'"' -f2)
    echo "✅ 服务器IP: $server_ip"
else
    echo "❌ 缺少服务器IP配置"
fi

if grep -q "REMOTE_PATH=" deploy.sh; then
    remote_path=$(grep "REMOTE_PATH=" deploy.sh | head -1 | cut -d'"' -f2)
    echo "✅ 远程路径: $remote_path"
else
    echo "❌ 缺少远程路径配置"
fi

if grep -q "rsync" deploy.sh; then
    echo "✅ 使用 rsync 进行文件传输"
else
    echo "⚠️  未使用 rsync"
fi

echo ""
echo "4. package.json 验证:"
echo "----------------------------"

if [ -f "package.json" ]; then
    if grep -q '"homepage"' package.json; then
        homepage=$(grep '"homepage"' package.json | cut -d'"' -f4)
        if [ -z "$homepage" ] || [ "$homepage" = "/" ]; then
            echo "⚠️  homepage 未设置或为根路径"
            echo "   建议设置为: /gearbox"
        else
            echo "✅ homepage 已设置: $homepage"
        fi
    else
        echo "⚠️  package.json 中未设置 homepage"
        echo "   建议添加: \"homepage\": \"/gearbox\""
    fi
else
    echo "❌ package.json 文件不存在"
fi

echo ""
echo "=================================="
