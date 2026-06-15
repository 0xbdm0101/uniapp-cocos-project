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

### 2026-06-15
- [x] 项目启动成功，uni-app 运行在 http://localhost:5174/
- [x] 读取 Cocos Creator 场景结构，确认 Canvas 下 2 个精灵 + 3 个自定义脚本
- [x] **宠物动画素材整理**
  - 从 `dog/` 目录的 x4 GIF 拆帧，生成 7 个动画目录（dog_sit, dog_sit_bark, dog_sit_look, dog_stand_bark, dog_stand_look, dog_walk, dog_sprite_sheet）
  - 删除 x1/x2 低分辨率 GIF，只保留 x4
  - 清理已废弃的 dog-idle 系列资源及场景引用
- [x] **初始状态改为 dog_sit_look**
  - 场景 Animation 组件添加 dog_sit_look 和 dog_walk 两个剪辑
  - 默认剪辑设为 dog_sit_look
- [x] **喂食触发动画**
  - PetManager.feed() 播放 dog_sit_bark 动画
  - 1.5 秒后自动切回 dog_sit_look
  - Animation 组件从 Pet 子节点获取

### 待做
- [ ] 宠物交互动画（设计待定）
  - 当前可用动画目录（`resources/pets/`）：
    - `dog_sit/` — 坐下
    - `dog_sit_bark/` — 坐着叫
    - `dog_sit_look/` — 坐着看（当前初始状态）
    - `dog_stand_bark/` — 站立叫
    - `dog_stand_look/` — 站立看
    - `dog_walk/` — 走路
    - `dog_sprite_sheet/` — 精灵图集
