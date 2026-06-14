# SmartPet Monorepo

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8
- Cocos Creator 3.8.x

### 安装依赖

```bash
pnpm install
```

---

## 开发环境

### 一键启动

```bash
pnpm dev
```

同时启动 uni-app H5 开发服务器。

### 单独启动

```bash
# uni-app H5 开发
pnpm dev:uni          # → http://localhost:5173

# Cocos 游戏开发
pnpm dev:cocos        # 提示用 Cocos Creator 打开 apps/cocos-game
```

### 本地联调

| 服务 | 地址 | 说明 |
|------|------|------|
| uni-app | http://localhost:5173 | UI 层 |
| Cocos | http://localhost:7456 | 游戏层 (Cocos Editor 运行) |

**联调步骤：**

1. 用 Cocos Creator 打开 `apps/cocos-game`，点击 ▶ 运行
2. 运行 `pnpm dev:uni`，访问 `http://localhost:5173/#/pages/game/game`
3. uni-app webview 自动加载 Cocos 游戏

---

## 构建发布

### H5 构建

```bash
pnpm build:h5
# 产物: apps/uni-app/dist/build/h5
```

### 微信小程序构建

```bash
pnpm build:mp-weixin
# 产物: apps/uni-app/dist/build/mp-weixin
```

### Cocos 游戏构建

在 Cocos Creator 中操作：

```
项目 → 构建发布 → 平台: Web Mobile → 构建
# 产物: apps/cocos-game/build/web-mobile
```

---

## 项目结构

```
smart-pet/
├── apps/
│   ├── uni-app/              # uni-app 项目 (Vue 3 + TypeScript)
│   │   ├── src/
│   │   │   ├── pages/        # 页面
│   │   │   ├── modules/      # 模块组件
│   │   │   └── config/       # 配置
│   │   └── package.json
│   └── cocos-game/           # Cocos Creator 工程
│       ├── assets/
│       │   ├── scripts/      # 游戏脚本
│       │   └── resources/    # 游戏资源
│       └── settings/
├── scripts/                  # 构建脚本
│   ├── dev.sh
│   └── build.sh
├── .ai/                      # AI 上下文配置
├── pnpm-workspace.yaml
└── package.json
```

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 一键启动开发环境 |
| `pnpm dev:uni` | 启动 uni-app H5 |
| `pnpm build:h5` | 构建 H5 |
| `pnpm build:mp-weixin` | 构建微信小程序 |
| `pnpm type-check` | TypeScript 类型检查 |
| `pnpm clean` | 清理所有 node_modules 和构建产物 |

---

## 通信协议

uni-app 与 Cocos 游戏通过 `postMessage` 通信：

```
UI → Game: { type: 'PET_FEED', payload: { value: 10 } }
Game → UI: { type: 'FEED_RESULT', payload: { success: true } }
```

详见 `.ai/commands.json`
