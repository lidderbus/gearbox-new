#!/bin/bash

###############################################
# 齿轮箱选型系统 - 云端服务器部署脚本
# 服务器: 47.111.132.236
###############################################

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量
SERVER_IP="47.111.132.236"
SERVER_USER="root"
REMOTE_PATH="/var/www/html/gearbox"
LOCAL_BUILD_DIR="./build"
BACKUP_DIR="/var/www/html/backups"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}齿轮箱选型系统 - 云端部署脚本${NC}"
echo -e "${GREEN}========================================${NC}"

# 函数：显示帮助信息
show_help() {
    echo "使用方法:"
    echo "  ./deploy.sh [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help          显示帮助信息"
    echo "  -b, --build         仅构建，不部署"
    echo "  -d, --deploy        仅部署，不构建"
    echo "  -f, --full          完整部署（构建+部署）[默认]"
    echo "  -s, --subpath PATH  指定子路径（默认: /gearbox）"
    echo ""
    echo "示例:"
    echo "  ./deploy.sh                 # 完整部署"
    echo "  ./deploy.sh -b              # 仅构建"
    echo "  ./deploy.sh -s /my-app      # 部署到 /my-app 路径"
}

# 函数：检查依赖
check_dependencies() {
    echo -e "${YELLOW}检查依赖...${NC}"

    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}错误: 未找到 Node.js${NC}"
        exit 1
    fi

    # 检查 npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}错误: 未找到 npm${NC}"
        exit 1
    fi

    # 检查 ssh
    if ! command -v ssh &> /dev/null; then
        echo -e "${RED}错误: 未找到 ssh${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ 所有依赖检查通过${NC}"
}

# 函数：构建项目
build_project() {
    echo -e "${YELLOW}开始构建项目...${NC}"

    # 检查是否需要安装依赖
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}安装依赖...${NC}"
        npm install
    fi

    # 构建
    echo -e "${YELLOW}执行构建...${NC}"
    npm run build

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ 构建成功${NC}"
    else
        echo -e "${RED}✗ 构建失败${NC}"
        exit 1
    fi
}

# 函数：备份服务器上的旧版本
backup_remote() {
    echo -e "${YELLOW}备份服务器上的旧版本...${NC}"

    BACKUP_NAME="gearbox_backup_$(date +%Y%m%d_%H%M%S)"

    ssh ${SERVER_USER}@${SERVER_IP} << EOF
        if [ -d "${REMOTE_PATH}" ]; then
            mkdir -p ${BACKUP_DIR}
            cp -r ${REMOTE_PATH} ${BACKUP_DIR}/${BACKUP_NAME}
            echo "备份已保存到: ${BACKUP_DIR}/${BACKUP_NAME}"
        else
            echo "无需备份，目标目录不存在"
        fi
EOF

    echo -e "${GREEN}✓ 备份完成${NC}"
}

# 函数：部署到服务器
deploy_to_server() {
    echo -e "${YELLOW}部署到服务器 ${SERVER_IP}...${NC}"

    # 检查构建目录
    if [ ! -d "${LOCAL_BUILD_DIR}" ]; then
        echo -e "${RED}错误: 构建目录不存在，请先执行构建${NC}"
        exit 1
    fi

    # 创建远程目录
    echo -e "${YELLOW}创建远程目录...${NC}"
    ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${REMOTE_PATH}"

    # 上传文件
    echo -e "${YELLOW}上传文件...${NC}"
    rsync -avz --progress ${LOCAL_BUILD_DIR}/ ${SERVER_USER}@${SERVER_IP}:${REMOTE_PATH}/

    # 设置权限
    echo -e "${YELLOW}设置文件权限...${NC}"
    ssh ${SERVER_USER}@${SERVER_IP} << EOF
        chown -R www-data:www-data ${REMOTE_PATH}
        chmod -R 755 ${REMOTE_PATH}
EOF

    echo -e "${GREEN}✓ 部署完成${NC}"
}

# 函数：配置 Nginx（可选）
configure_nginx() {
    echo -e "${YELLOW}是否需要配置 Nginx? (y/n)${NC}"
    read -r response

    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo -e "${YELLOW}生成 Nginx 配置...${NC}"

        cat > nginx_gearbox.conf << 'EOF'
# 齿轮箱选型系统 Nginx 配置
location /gearbox {
    alias /var/www/html/gearbox;
    try_files $uri $uri/ /gearbox/index.html;
    index index.html;

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

        echo -e "${GREEN}Nginx 配置已生成：nginx_gearbox.conf${NC}"
        echo -e "${YELLOW}请将配置添加到服务器的 Nginx 配置文件中${NC}"
        echo -e "${YELLOW}然后执行: sudo nginx -t && sudo systemctl reload nginx${NC}"
    fi
}

# 函数：测试部署
test_deployment() {
    echo -e "${YELLOW}测试部署...${NC}"

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://${SERVER_IP}/gearbox/)

    if [ "$HTTP_CODE" == "200" ]; then
        echo -e "${GREEN}✓ 部署测试成功！${NC}"
        echo -e "${GREEN}访问地址: http://${SERVER_IP}/gearbox/${NC}"
    else
        echo -e "${RED}✗ 部署测试失败 (HTTP ${HTTP_CODE})${NC}"
        echo -e "${YELLOW}请检查 Nginx 配置和文件权限${NC}"
    fi
}

# 主流程
main() {
    local MODE="full"
    local SUBPATH="/gearbox"

    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -b|--build)
                MODE="build"
                shift
                ;;
            -d|--deploy)
                MODE="deploy"
                shift
                ;;
            -f|--full)
                MODE="full"
                shift
                ;;
            -s|--subpath)
                SUBPATH="$2"
                shift 2
                ;;
            *)
                echo -e "${RED}未知选项: $1${NC}"
                show_help
                exit 1
                ;;
        esac
    done

    # 检查依赖
    check_dependencies

    # 根据模式执行
    case $MODE in
        build)
            build_project
            ;;
        deploy)
            backup_remote
            deploy_to_server
            configure_nginx
            test_deployment
            ;;
        full)
            build_project
            backup_remote
            deploy_to_server
            configure_nginx
            test_deployment
            ;;
    esac

    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}部署流程完成！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "访问地址: ${GREEN}http://${SERVER_IP}${SUBPATH}/${NC}"
    echo ""
    echo -e "${YELLOW}提示：${NC}"
    echo "1. 如果无法访问，请检查 Nginx 配置"
    echo "2. 确保服务器防火墙允许 80 端口访问"
    echo "3. 查看部署日志排查问题"
}

# 执行主流程
main "$@"
