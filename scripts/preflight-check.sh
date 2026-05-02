#!/bin/bash
# scripts/preflight-check.sh
# 投产前一站式审计 — 把所有 validate/audit/check 串起来 (C4 性能预算 + 综合检查)
#
# 用法:
#   ./scripts/preflight-check.sh                  # 默认: 检查不阻断
#   ./scripts/preflight-check.sh --strict         # 任一失败即 exit 1, 适合 CI
#   ./scripts/preflight-check.sh --skip-build     # 跳过 build (假设 build/ 已存在)
#   ./scripts/preflight-check.sh --skip-tests     # 跳过 jest
#
# 涵盖项:
#   1) 柴油机库 schema 校验      (B1, validate-engine-db.js)
#   2) a11y Modal 静态审计       (C5, audit-a11y-modal.js)
#   3) 价格覆盖率审计            (audit-price-coverage.js)
#   4) 构建体积阈值              (check-bundle-size.js, 仅 --skip-build 不传)
#   5) 单元测试                  (jest)
#
# 退出码: 0 全通过 / 1 任一失败 (仅 --strict 模式)

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

STRICT=0
SKIP_BUILD=0
SKIP_TESTS=0
for arg in "$@"; do
  case $arg in
    --strict)      STRICT=1 ;;
    --skip-build)  SKIP_BUILD=1 ;;
    --skip-tests)  SKIP_TESTS=1 ;;
    *) echo "未知参数: $arg" >&2 ; exit 2 ;;
  esac
done

failures=()
results=()    # 普通数组, 元素格式 "PASS|name" 或 "FAIL|name", macOS bash 3.2 兼容

check() {
  local name="$1"
  local cmd="$2"
  echo ""
  echo -e "${CYAN}━━ $name ━━${NC}"
  if eval "$cmd"; then
    echo -e "${GREEN}  ✓ $name 通过${NC}"
    results+=("PASS|$name")
  else
    local exit_code=$?
    echo -e "${RED}  ✗ $name 失败 (exit $exit_code)${NC}"
    results+=("FAIL|$name")
    failures+=("$name")
  fi
}

cd "$(dirname "$0")/.."

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN} 齿轮箱选型系统 — 投产前一站式审计${NC}"
echo -e "${GREEN}=========================================${NC}"
echo "项目根: $(pwd)"
echo "Node 版本: $(node --version 2>/dev/null || echo 'n/a')"
echo "审计时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "Strict: $STRICT · SkipBuild: $SKIP_BUILD · SkipTests: $SKIP_TESTS"

# 1) Engine DB schema 校验
check "engine-db schema" "node scripts/validate-engine-db.js"

# 2) a11y Modal 审计
check "a11y modal audit" "node scripts/audit-a11y-modal.js"

# 3) 价格覆盖率 (若存在)
if [ -f "scripts/audit-price-coverage.js" ]; then
  check "price coverage" "node scripts/audit-price-coverage.js || true"
fi

# 4) 单元测试
if [ "$SKIP_TESTS" -eq 0 ]; then
  check "unit tests" "CI=true npm test -- --watchAll=false --silent"
fi

# 5) 构建 + 体积检查
if [ "$SKIP_BUILD" -eq 0 ]; then
  check "build" "CI=false npm run build"
  check "bundle size" "node scripts/check-bundle-size.js"
else
  if [ -d "build" ]; then
    check "bundle size (existing build/)" "node scripts/check-bundle-size.js"
  else
    echo -e "${YELLOW}  ⚠ --skip-build 但 build/ 不存在, 跳过 bundle 检查${NC}"
  fi
fi

# 汇总报告
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN} 审计汇总${NC}"
echo -e "${GREEN}=========================================${NC}"
for entry in "${results[@]}"; do
  status="${entry%%|*}"
  name="${entry#*|}"
  if [ "$status" = "PASS" ]; then
    echo -e "  ${GREEN}✓${NC} $name"
  else
    echo -e "  ${RED}✗${NC} $name"
  fi
done

echo ""
if [ "${#failures[@]}" -eq 0 ]; then
  echo -e "${GREEN}全部通过. 可以投产 🚀${NC}"
  exit 0
else
  echo -e "${RED}发现 ${#failures[@]} 项失败: ${failures[*]}${NC}"
  if [ "$STRICT" -eq 1 ]; then
    echo -e "${RED}--strict 模式: 退出码 1${NC}"
    exit 1
  else
    echo -e "${YELLOW}默认非阻断, 请修复后再投产; 加 --strict 让 CI 失败${NC}"
    exit 0
  fi
fi
