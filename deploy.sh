#!/bin/bash

###############################################
# 齿轮箱选型系统 - 安全部署脚本 (带 chattr 锁定)
# 服务器: 47.99.181.195
# 只有持有 deploy token 的机器才能部署
###############################################

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# 配置变量
SERVER_IP="47.99.181.195"
SERVER_USER="root"
SERVER="$SERVER_USER@$SERVER_IP"
REMOTE_PATH="/var/www/html/gearbox-app"
SSH_KEY="$HOME/.ssh/wxx.pem"
SSH_CMD="ssh -i $SSH_KEY $SERVER"
LOCAL_BUILD_DIR="./build"
TOKEN_FILE="$HOME/.gearbox-deploy-token"
DEPLOY_SCRIPT="/opt/gearbox-deploy.sh"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}齿轮箱选型系统 - 安全部署${NC}"
echo -e "${GREEN}========================================${NC}"

# 函数：显示帮助
show_help() {
    echo "使用方法:"
    echo "  ./deploy.sh [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help      显示帮助信息"
    echo "  -b, --build     仅构建，不部署"
    echo "  -d, --deploy    仅部署（跳过构建）"
    echo "  -f, --full      完整部署（构建+部署）[默认]"
    echo "  --status        查看锁定状态"
    echo "  --unlock        手动解锁（紧急用）"
    echo "  --lock          手动锁定"
}

# 函数：读取 deploy token
load_token() {
    if [ ! -f "$TOKEN_FILE" ]; then
        echo -e "${RED}错误: Deploy token 不存在: $TOKEN_FILE${NC}"
        echo -e "${YELLOW}请联系管理员获取 deploy token${NC}"
        exit 1
    fi
    TOKEN=$(cat "$TOKEN_FILE")
    if [ -z "$TOKEN" ]; then
        echo -e "${RED}错误: Deploy token 为空${NC}"
        exit 1
    fi
}

# 函数：解锁服务器目录
server_unlock() {
    echo -e "${YELLOW}解锁服务器目录...${NC}"
    RESULT=$($SSH_CMD "$DEPLOY_SCRIPT '$TOKEN' unlock" 2>&1)
    if echo "$RESULT" | grep -q "ERROR"; then
        echo -e "${RED}解锁失败: $RESULT${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ $RESULT${NC}"
}

# 函数：锁定服务器目录
server_lock() {
    echo -e "${YELLOW}锁定服务器目录...${NC}"
    RESULT=$($SSH_CMD "$DEPLOY_SCRIPT '$TOKEN' lock" 2>&1)
    if echo "$RESULT" | grep -q "ERROR"; then
        echo -e "${RED}锁定失败: $RESULT${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ $RESULT${NC}"
}

# 函数：查看锁定状态
server_status() {
    load_token
    RESULT=$($SSH_CMD "$DEPLOY_SCRIPT '$TOKEN' status" 2>&1)
    echo -e "${CYAN}服务器状态: $RESULT${NC}"
}

# 函数：构建项目
build_project() {
    echo -e "${YELLOW}开始构建项目...${NC}"

    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}安装依赖...${NC}"
        npm install
    fi

    CI=false npm run build

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ 构建成功${NC}"
    else
        echo -e "${RED}✗ 构建失败${NC}"
        exit 1
    fi
}

# 函数：部署到服务器（带锁定保护）
deploy_to_server() {
    if [ ! -d "${LOCAL_BUILD_DIR}" ]; then
        echo -e "${RED}错误: 构建目录不存在，请先执行构建${NC}"
        exit 1
    fi

    # 解锁
    server_unlock

    # 部署（使用 trap 确保异常时也能重新锁定）
    trap 'echo -e "${RED}部署中断，正在重新锁定...${NC}"; server_lock; exit 1' INT TERM ERR

    echo -e "${YELLOW}上传文件到 ${SERVER_IP}...${NC}"
    rsync -avz --delete -e "ssh -i ${SSH_KEY}" ${LOCAL_BUILD_DIR}/ ${SERVER}:${REMOTE_PATH}/

    # 锁定（lock 内含 chown + chmod）
    server_lock

    trap - INT TERM ERR

    echo -e "${GREEN}✓ 部署完成${NC}"
}

# 函数：测试部署
test_deployment() {
    echo -e "${YELLOW}测试部署...${NC}"

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://${SERVER_IP}/gearbox-app/)

    if [ "$HTTP_CODE" == "200" ]; then
        echo -e "${GREEN}✓ 部署验证成功 (HTTP 200)${NC}"
    else
        echo -e "${RED}✗ 部署验证失败 (HTTP ${HTTP_CODE})${NC}"
    fi
}

# 主流程
main() {
    local MODE="full"

    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)    show_help; exit 0 ;;
            -b|--build)   MODE="build"; shift ;;
            -d|--deploy)  MODE="deploy"; shift ;;
            -f|--full)    MODE="full"; shift ;;
            --status)     server_status; exit 0 ;;
            --unlock)     load_token; server_unlock; exit 0 ;;
            --lock)       load_token; server_lock; exit 0 ;;
            *)
                echo -e "${RED}未知选项: $1${NC}"
                show_help; exit 1 ;;
        esac
    done

    # 加载 token（构建模式不需要）
    if [ "$MODE" != "build" ]; then
        load_token
    fi

    case $MODE in
        build)
            build_project
            ;;
        deploy)
            deploy_to_server
            test_deployment
            ;;
        full)
            build_project
            deploy_to_server
            test_deployment
            ;;
    esac

    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}部署流程完成！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "访问地址: ${CYAN}http://${SERVER_IP}/gearbox-app/${NC}"
}

main "$@"
