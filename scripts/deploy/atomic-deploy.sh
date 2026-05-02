#!/bin/bash

###############################################
# 齿轮箱选型系统 - 原子(零停机)部署脚本 v1
# A5 投产硬阻断: ln -sfn swap + 保留最近 3 版回滚
#
# 与现有 deploy.sh 的区别:
#  - 现有 deploy.sh: rsync --delete 直接覆盖 /var/www/html/gearbox-app
#                    解锁→rsync→锁定 三段非原子, 中间失败可能让用户看到半截
#  - 本脚本:        rsync 到 /var/www/html/gearbox-app-<TS>/
#                   ln -sfn 切到新目录 (内核级原子 rename)
#                   保留最近 3 版本可一键回滚
#
# ⚠️ 服务器侧依赖 (用户首次切换前需先在 root@47.99.181.195 上配置):
#   1) /var/www/html/gearbox-app 改造为 symlink:
#      mv /var/www/html/gearbox-app /var/www/html/gearbox-app-bootstrap
#      ln -sfn /var/www/html/gearbox-app-bootstrap /var/www/html/gearbox-app
#      chown -h www-data:www-data /var/www/html/gearbox-app
#   2) nginx 配置中 root /var/www/html/gearbox-app 不变 (会跟随 symlink)
#   3) /opt/gearbox-deploy.sh 增加子命令 (示意):
#      atomic-prepare <token> <ts>  -> 创建 /var/www/html/gearbox-app-<ts>/ 并 chattr -i
#      atomic-commit  <token> <ts>  -> ln -sfn 切换 + chattr +i 新目录 + chown
#      atomic-cleanup <token>       -> 保留最近 3 个 gearbox-app-* 删旧
#   4) chattr 锁定: 仅锁定**当前 active** 的版本目录, 旧版本保留可读
#
# 在服务器侧 /opt/gearbox-deploy.sh 未升级前, 本脚本会因找不到子命令而拒绝执行
# 投产前请先与运维确认服务器侧 atomic-* 子命令已就绪
###############################################

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# 配置变量
SERVER_IP="${SERVER_IP:-47.99.181.195}"
SERVER_USER="${SERVER_USER:-root}"
SERVER="$SERVER_USER@$SERVER_IP"
REMOTE_BASE="/var/www/html"
SYMLINK="$REMOTE_BASE/gearbox-app"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/wxx.pem}"
SSH_CMD="ssh -i $SSH_KEY $SERVER"
LOCAL_BUILD_DIR="${LOCAL_BUILD_DIR:-./build}"
TOKEN_FILE="${TOKEN_FILE:-$HOME/.gearbox-deploy-token}"
DEPLOY_SCRIPT="/opt/gearbox-deploy.sh"
HEALTH_URL="${HEALTH_URL:-https://qj-gearbox.duckdns.org/gearbox-app/index.html}"
HEALTH_GREP="${HEALTH_GREP:-齿轮箱选型}"
KEEP_VERSIONS="${KEEP_VERSIONS:-3}"

TS=$(date +%Y%m%d-%H%M%S)
NEW_DIR_REL="gearbox-app-$TS"
NEW_DIR_ABS="$REMOTE_BASE/$NEW_DIR_REL"

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}齿轮箱选型系统 - 原子部署 v1${NC}"
echo -e "${GREEN}时间戳: $TS${NC}"
echo -e "${GREEN}=========================================${NC}"

show_help() {
    cat <<EOF
使用方法:
  $0 [选项]

选项:
  -h, --help        显示帮助
  -b, --build       仅构建
  -d, --deploy      仅部署 (跳过构建, 假设 build/ 已存在)
  -f, --full        完整流程 (构建+测试+部署+健康检查) [默认]
  --rollback <TS>   回滚到指定时间戳版本 (查看 --list)
  --list            列出服务器上保留的所有版本

环境变量覆盖:
  SERVER_IP, SERVER_USER, SSH_KEY, TOKEN_FILE,
  HEALTH_URL, HEALTH_GREP, KEEP_VERSIONS
EOF
}

load_token() {
    if [ ! -f "$TOKEN_FILE" ]; then
        echo -e "${RED}错误: Deploy token 不存在: $TOKEN_FILE${NC}" >&2
        exit 1
    fi
    TOKEN=$(cat "$TOKEN_FILE")
    if [ -z "$TOKEN" ]; then
        echo -e "${RED}错误: Deploy token 为空${NC}" >&2
        exit 1
    fi
}

build_project() {
    echo -e "${YELLOW}[1/5] 开始构建...${NC}"
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}安装依赖...${NC}"
        npm install
    fi

    CI=false npm run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ 构建失败${NC}" >&2
        exit 1
    fi
    echo -e "${GREEN}✓ 构建成功${NC}"

    echo -e "${YELLOW}[2/5] 运行单元测试...${NC}"
    if ! CI=true npm test -- --watchAll=false --silent; then
        echo -e "${RED}✗ 单元测试失败 — 中止部署${NC}" >&2
        exit 1
    fi
    echo -e "${GREEN}✓ 单元测试通过${NC}"
}

verify_build_artifacts() {
    if [ ! -d "$LOCAL_BUILD_DIR" ]; then
        echo -e "${RED}错误: 构建目录不存在 $LOCAL_BUILD_DIR${NC}" >&2
        exit 1
    fi
    if [ ! -f "$LOCAL_BUILD_DIR/index.html" ]; then
        echo -e "${RED}错误: $LOCAL_BUILD_DIR/index.html 缺失${NC}" >&2
        exit 1
    fi
    if ! grep -q "$HEALTH_GREP" "$LOCAL_BUILD_DIR/index.html"; then
        echo -e "${RED}错误: build/index.html 不含 '$HEALTH_GREP', 构建可能损坏${NC}" >&2
        exit 1
    fi
}

upload_to_versioned_dir() {
    echo -e "${YELLOW}[3/5] 上传到服务器版本目录: $NEW_DIR_ABS${NC}"
    # 服务器侧准备版本目录 (期望 /opt/gearbox-deploy.sh 实现 atomic-prepare)
    PREPARE_RESULT=$($SSH_CMD "$DEPLOY_SCRIPT '$TOKEN' atomic-prepare '$TS'" 2>&1) || {
        echo -e "${RED}atomic-prepare 失败 (服务器侧脚本未升级?): $PREPARE_RESULT${NC}" >&2
        echo -e "${YELLOW}提示: 投产前请先升级 /opt/gearbox-deploy.sh, 见本脚本顶部注释${NC}" >&2
        exit 1
    }
    echo -e "${CYAN}$PREPARE_RESULT${NC}"

    # 上传 build/ 到版本目录, 不带 --delete (新目录本就是空的)
    rsync -az --exclude='manuals' \
        -e "ssh -i ${SSH_KEY}" \
        "${LOCAL_BUILD_DIR}/" "${SERVER}:${NEW_DIR_ABS}/"

    echo -e "${GREEN}✓ 上传完成${NC}"
}

commit_symlink_swap() {
    echo -e "${YELLOW}[4/5] 原子切换 symlink → $NEW_DIR_REL${NC}"
    COMMIT_RESULT=$($SSH_CMD "$DEPLOY_SCRIPT '$TOKEN' atomic-commit '$TS'" 2>&1) || {
        echo -e "${RED}atomic-commit 失败: $COMMIT_RESULT${NC}" >&2
        exit 1
    }
    echo -e "${CYAN}$COMMIT_RESULT${NC}"

    # 清理旧版本 (保留最近 KEEP_VERSIONS 个)
    CLEANUP_RESULT=$($SSH_CMD "$DEPLOY_SCRIPT '$TOKEN' atomic-cleanup '$KEEP_VERSIONS'" 2>&1) || true
    echo -e "${CYAN}$CLEANUP_RESULT${NC}"
}

health_check() {
    echo -e "${YELLOW}[5/5] 健康检查 ($HEALTH_URL)${NC}"
    # 优先用 python3 走 OpenSSL (规避 macOS LibreSSL EC/ECDSA-SHA384 兼容 bug)
    HEALTH=$(python3 -c "
import sys, urllib.request
try:
    body = urllib.request.urlopen('$HEALTH_URL', timeout=10).read().decode('utf-8', 'ignore')
except Exception as e:
    print('FETCH_ERROR:', e); sys.exit(1)
if '$HEALTH_GREP' not in body:
    print('GREP_MISS'); sys.exit(2)
print('OK')
" 2>&1) || {
        echo -e "${RED}✗ 健康检查失败: $HEALTH${NC}" >&2
        echo -e "${YELLOW}建议立即回滚: $0 --list 查看版本, $0 --rollback <旧 TS>${NC}" >&2
        exit 1
    }
    echo -e "${GREEN}✓ 健康检查通过 ($HEALTH)${NC}"
}

list_versions() {
    load_token
    $SSH_CMD "$DEPLOY_SCRIPT '$TOKEN' atomic-list" 2>&1
}

rollback_to() {
    local target_ts="$1"
    if [ -z "$target_ts" ]; then
        echo -e "${RED}错误: 必须指定回滚版本时间戳${NC}" >&2
        exit 1
    fi
    load_token
    echo -e "${YELLOW}回滚 → gearbox-app-$target_ts${NC}"
    RB_RESULT=$($SSH_CMD "$DEPLOY_SCRIPT '$TOKEN' atomic-rollback '$target_ts'" 2>&1) || {
        echo -e "${RED}回滚失败: $RB_RESULT${NC}" >&2
        exit 1
    }
    echo -e "${GREEN}✓ $RB_RESULT${NC}"
    health_check
}

main() {
    local MODE="full"

    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)    show_help; exit 0 ;;
            -b|--build)   MODE="build"; shift ;;
            -d|--deploy)  MODE="deploy"; shift ;;
            -f|--full)    MODE="full"; shift ;;
            --list)       list_versions; exit 0 ;;
            --rollback)   shift; rollback_to "$1"; exit 0 ;;
            *)
                echo -e "${RED}未知选项: $1${NC}" >&2
                show_help; exit 1 ;;
        esac
    done

    if [ "$MODE" != "build" ]; then
        load_token
    fi

    case $MODE in
        build)
            build_project
            verify_build_artifacts
            ;;
        deploy)
            verify_build_artifacts
            upload_to_versioned_dir
            commit_symlink_swap
            health_check
            ;;
        full)
            build_project
            verify_build_artifacts
            upload_to_versioned_dir
            commit_symlink_swap
            health_check
            ;;
    esac

    echo ""
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}部署完成! 版本: $NEW_DIR_REL${NC}"
    echo -e "${GREEN}访问: ${CYAN}https://qj-gearbox.duckdns.org/gearbox-app/${NC}"
    echo -e "${GREEN}回滚: $0 --rollback <旧 TS> (查看 --list)${NC}"
    echo -e "${GREEN}=========================================${NC}"
}

main "$@"
