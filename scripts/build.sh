#!/bin/bash

# SmartPet 构建脚本

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🐾 SmartPet Build${NC}"
echo "=================="

# 构建 uni-app H5
echo -e "${GREEN}📦 Building uni-app (H5)...${NC}"
cd "$ROOT_DIR" && pnpm build:h5

echo ""
echo -e "${GREEN}✅ Build complete!${NC}"
echo -e "   uni-app H5: apps/uni-app/dist/build/h5"
echo ""
echo -e "${CYAN}📝 Cocos Game:${NC}"
echo "   请在 Cocos Creator 中执行: 项目 → 构建发布 → Web Mobile"
echo "   产物目录: apps/cocos-game/build/web-mobile"
