# SmartPet Runtime - Cocos Creator 项目

这是 SmartPet 的游戏运行时项目，基于 **Cocos Creator 3.x** 构建。

## 项目说明

- 独立部署，通过 Webview 与 uni-app UI 层通信
- 通信协议：`{ type, payload }`

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式（默认端口 7456）
npm run dev

# 构建生产版本
npm run build
```

## 通信接口

### 接收来自 UI 的消息

```typescript
// 在 Cocos 脚本中
import { sys } from 'cc';

// H5 环境
window.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  // 处理消息
});

// 原生环境
// 通过 jsb 桥接接收
```

### 发送消息给 UI

```typescript
// H5 环境
window.parent.postMessage({ type, payload }, '*');

// 原生环境
// 通过 jsb 桥接发送
```

## 消息类型

参考 `.ai/commands.json` 中的定义：

| type | 方向 | 说明 |
|------|------|------|
| `PET_FEED` | UI → Game | 喂食宠物 |
| `PET_TOUCH` | UI → Game | 触摸宠物 |
| `GET_STATUS` | UI → Game | 获取状态 |
| `STATUS_UPDATE` | Game → UI | 状态更新推送 |

## 部署

### H5
构建后部署到静态服务器，更新 `app/src/config/runtime.ts` 中的 URL。

### 原生 APP
构建后将产物放入 uni-app 原生工程，或使用远程加载。

### 小程序
需在小程序后台配置业务域名白名单。
