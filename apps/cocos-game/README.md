# SmartPet Cocos Project

## 构建流程

Cocos Creator 项目**需要编译**，不是直接用源码。

```
cocos-project/          ← Cocos Creator 源码项目
    ├── assets/         ← 游戏脚本、场景、资源
    ├── settings/       ← 项目配置
    └── ...

        ↓  Cocos Creator 编译 (Build → Web Mobile)

    dist/               ← 编译产物，部署到 CDN/服务器
        ├── index.html  ← 入口页面
        ├── cocos.js    ← 引擎代码
        └── assets/     ← 游戏资源
```

## 与 uni-app 集成

```
┌─────────────────────────────────────────────────────┐
│  uni-app (app/)                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  <web-view src="https://game.smartpet.com"> │────┼──→  CDN/服务器
│  └─────────────────────────────────────────────┘    │      │
└─────────────────────────────────────────────────────┘      │
                                                             ↓
┌─────────────────────────────────────────────────────────────────┐
│  https://game.smartpet.com                                      │
│  ┌──────────┐  ┌──────────┐  ┌─────────────────────────────┐   │
│  │index.html│  │ cocos.js │  │ assets/ (图片、音频、场景等) │   │
│  └──────────┘  └──────────┘  └─────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**关键点：**
- Cocos 编译产物是**纯静态文件** (HTML + JS + 资源)
- 部署到任意静态服务器/CDN 即可
- uni-app 的 `<web-view>` 加载该 URL
- **所有端通用**：H5、APP、小程序都通过 webview 访问同一个 URL

## 开发流程

```bash
# 1. 用 Cocos Creator 打开项目开发
#    文件 → 打开项目 → 选择 cocos-project 目录

# 2. 构建 Web 版本
#    项目 → 构建发布 → 平台选 Web Mobile → 构建

# 3. 本地预览
#    构建完成后点击"运行"，默认端口 7456
#    http://localhost:7456

# 4. 部署
#    将 dist/ 目录部署到 CDN
#    更新 uni-app 配置：app/src/config/runtime.ts
```

## 多端兼容说明

| 平台 | webview 加载方式 | 注意事项 |
|------|-----------------|---------|
| H5 | 直接 iframe | 同域/跨域需配置 |
| APP-PLUS | 原生 webview | 性能最佳 |
| 微信小程序 | `<web-view>` | 需配置业务域名白名单 |
| 支付宝小程序 | `<web-view>` | 需配置白名单 |

## 通信协议

游戏通过 `postMessage` 与 uni-app 通信：

```typescript
// 游戏 → UI
window.parent.postMessage({ type: 'STATUS_UPDATE', payload: { hp: 100 } }, '*')

// UI → 游戏
// 在 uni-app 中通过 webview 组件的 API 发送
```
