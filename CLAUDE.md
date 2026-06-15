# SmartPet 项目上下文

## 项目概述
智能宠物养成游戏，Monorepo 结构 (pnpm workspace)

## 技术栈
- `apps/uni-app/` — uni-app UI 层 (Vue 3 + TypeScript)，端口 5174
- `apps/cocos-game/` — Cocos Creator 游戏工程 (独立编译部署)，端口 7456

## 通信协议
UI → GAME: `{ type, payload }`  
GAME → UI: `{ type, payload }`

## Cocos Creator 场景结构
```
MainScene
└── Canvas (1280×720)
    ├── Camera
    ├── Background (Sprite, 1280×720)
    └── Pet (Sprite, 137×136, 位置 x:-150 y:10, 缩放 0.5)
```

**Canvas 根节点组件：**
1. UITransform
2. Canvas
3. Widget
4. GameManager — 消息桥接，协调各模块
5. MessageBridge — uni-app ↔ Cocos 消息通道
6. PetManager — 宠物状态和动画

## Cocos 脚本文件
- `assets/scripts/GameManager.ts`
- `assets/scripts/modules/MessageBridge.ts`
- `assets/scripts/modules/PetManager.ts`

## 代码规范
- 逻辑用 TypeScript
- 不混 UI 逻辑到游戏层
- 不绕过消息协议
- 优先用预制体 (prefab)

---

## 工作日志

### 2025-06-15
- [x] 项目启动成功，uni-app 运行在 http://localhost:5174/
- [x] 读取 Cocos Creator 场景结构，确认 Canvas 下 2 个精灵 + 3 个自定义脚本
- [ ] **待做：宠物动画增强**
  - 无互动时：狗狗重复哈气动画帧循环
  - 喂食时：根据饱腹程度显示气泡对话
  - 触摸时：眨眼动画
