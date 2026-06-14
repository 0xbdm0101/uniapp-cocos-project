#!/bin/bash

# SmartPet 开发环境一键启动脚本

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🐾 SmartPet Development Environment${NC}"
echo "=================================="

# 检查依赖
if [ ! -d "$ROOT_DIR/apps/uni-app/node_modules" ]; then
  echo -e "${YELLOW}📦 Installing uni-app dependencies...${NC}"
  cd "$ROOT_DIR" && pnpm --filter uni-app install
fi

# 清理旧进程
cleanup() {
  echo -e "\n${YELLOW}🛑 Stopping all dev servers...${NC}"
  kill 0 2>/dev/null
  exit 0
}
trap cleanup SIGINT SIGTERM

# 启动 uni-app
echo -e "${GREEN}🚀 Starting uni-app (H5)...${NC}"
cd "$ROOT_DIR" && pnpm dev:uni &
UNI_PID=$!

# 提示 Cocos
echo ""
echo -e "${YELLOW}📝 Cocos Creator:${NC}"
echo "   请手动用 Cocos Creator 打开: apps/cocos-game"
echo "   编辑器内点击 ▶ 运行，端口 7456"
echo ""
echo -e "${GREEN}✅ uni-app dev server starting...${NC}"
echo -e "${CYAN}   H5: http://localhost:5173${NC}"
echo ""
echo -e "按 Ctrl+C 停止所有服务"
echo "=================================="

wait
