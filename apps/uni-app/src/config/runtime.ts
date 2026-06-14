/**
 * Cocos Runtime 游戏入口配置
 * 统一管理不同环境下的游戏地址
 */

/** 运行时环境 */
export type RuntimeEnv = 'development' | 'staging' | 'production'

/** 平台类型 */
export type Platform = 'h5' | 'app' | 'mp-weixin' | 'mp-alipay' | 'mp-baidu' | 'mp-toutiao'

interface RuntimeConfig {
  /** H5 开发环境地址 */
  devUrl: string
  /** H5 生产环境地址 */
  prodUrl: string
  /** 原生 APP 地址（本地或远程） */
  appUrl: string
  /** 小程序业务域名 */
  mpUrl: string
}

const runtimeConfig: Record<RuntimeEnv, RuntimeConfig> = {
  development: {
    devUrl: 'http://localhost:7456',
    prodUrl: 'http://localhost:7456',
    appUrl: 'http://localhost:7456',
    mpUrl: 'http://localhost:7456',
  },
  staging: {
    devUrl: 'https://staging-game.smartpet.com',
    prodUrl: 'https://staging-game.smartpet.com',
    appUrl: 'https://staging-game.smartpet.com',
    mpUrl: 'https://staging-game.smartpet.com',
  },
  production: {
    devUrl: 'https://game.smartpet.com',
    prodUrl: 'https://game.smartpet.com',
    appUrl: 'https://game.smartpet.com',
    mpUrl: 'https://game.smartpet.com',
  },
}

/** 获取当前环境 */
export function getCurrentEnv(): RuntimeEnv {
  // #ifdef H5
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1') return 'development'
    if (host.includes('staging')) return 'staging'
  }
  // #endif

  // 可通过条件编译或环境变量扩展其他平台判断
  return (import.meta.env.VITE_RUNTIME_ENV as RuntimeEnv) || 'production'
}

/**
 * 获取游戏 Runtime 地址
 * 自动适配当前平台和环境
 */
export function getGameRuntimeUrl(): string {
  const env = getCurrentEnv()
  const config = runtimeConfig[env]

  // #ifdef H5
  return import.meta.env.DEV ? config.devUrl : config.prodUrl
  // #endif

  // #ifdef APP-PLUS
  return config.appUrl
  // #endif

  // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO
  return config.mpUrl
  // #endif

  // 兜底
  return config.prodUrl
}
