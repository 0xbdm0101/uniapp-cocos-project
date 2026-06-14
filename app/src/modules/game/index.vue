<template>
  <web-view
    :src="gameUrl"
    @message="onMessage"
    @onPostMessage="onPostMessage"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getGameRuntimeUrl } from '@/config/runtime'

/**
 * Game Webview 组件
 * 负责加载 Cocos Runtime 游戏入口，兼容多端
 */

interface GameMessage {
  type: string
  payload?: Record<string, any>
}

const props = withDefaults(
  defineProps<{
    /** 自定义游戏地址，为空时使用默认配置 */
    customUrl?: string
    /** 页面路径 */
    path?: string
    /** 查询参数 */
    query?: Record<string, string>
  }>(),
  {
    customUrl: '',
    path: '',
    query: () => ({}),
  }
)

const emit = defineEmits<{
  (e: 'message', data: GameMessage): void
  (e: 'ready'): void
  (e: 'error', err: any): void
}>()

/** 计算最终的游戏 URL */
const gameUrl = computed(() => {
  if (props.customUrl) return props.customUrl

  const baseUrl = getGameRuntimeUrl()
  const url = new URL(baseUrl)

  if (props.path) {
    url.pathname = props.path
  }

  Object.entries(props.query).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  return url.toString()
})

/** 接收来自 webview 的消息 */
function onMessage(e: any) {
  const data = e?.detail?.data?.[0] as GameMessage | undefined
  if (data?.type) {
    emit('message', data)
  }
}

/** 接收 postMessage（兼容不同平台） */
function onPostMessage(e: any) {
  const data = e?.detail?.data?.[0] as GameMessage | undefined
  if (data?.type) {
    emit('message', data)
  }
}

/** 向 webview 发送消息 */
function sendMessage(data: GameMessage) {
  // #ifdef H5
  const iframe = document.querySelector('uni-webview iframe') as HTMLIFrameElement
  iframe?.contentWindow?.postMessage(data, '*')
  // #endif

  // #ifdef APP-PLUS
  const currentWebview = plus.webview.currentWebview()
  const children = currentWebview.children()
  if (children?.[0]) {
    children[0].evalJS(`window.postMessage(${JSON.stringify(data)})`)
  }
  // #endif
}

defineExpose({
  sendMessage,
})
</script>
