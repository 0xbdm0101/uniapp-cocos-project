<template>
  <view class="game-page">
    <GameModule
      ref="gameRef"
      :query="gameQuery"
      @message="onGameMessage"
      @ready="onGameReady"
      @error="onGameError"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import GameModule from '@/modules/game/index.vue'

/**
 * 游戏页面
 * 通过 Webview 加载 Cocos Runtime 游戏
 */

interface GameMessage {
  type: string
  payload?: Record<string, any>
}

const gameRef = ref<InstanceType<typeof GameModule>>()

/** 页面传入的参数 */
const pageQuery = ref<Record<string, string>>({})

/** 传递给游戏的查询参数 */
const gameQuery = computed(() => ({
  ...pageQuery.value,
  from: 'uniapp',
  timestamp: String(Date.now()),
}))

/** 页面加载 */
onLoad((query) => {
  pageQuery.value = query || {}
  console.log('[GamePage] loaded with query:', query)
})

/** 接收游戏消息 */
function onGameMessage(data: GameMessage) {
  console.log('[GamePage] message from game:', data)

  switch (data.type) {
    case 'PET_FEED':
      handlePetFeed(data.payload)
      break
    case 'PET_TOUCH':
      handlePetTouch(data.payload)
      break
    case 'GET_STATUS':
      handleGetStatus()
      break
    default:
      console.warn('[GamePage] unknown message type:', data.type)
  }
}

/** 游戏加载完成 */
function onGameReady() {
  console.log('[GamePage] game ready')
  uni.showToast({ title: '游戏加载完成', icon: 'success' })
}

/** 游戏加载失败 */
function onGameError(err: any) {
  console.error('[GamePage] game error:', err)
  uni.showModal({
    title: '加载失败',
    content: '游戏加载失败，是否重试？',
    success(res) {
      if (res.confirm) {
        uni.reLaunch({ url: '/pages/game/game' })
      }
    },
  })
}

/** 处理喂食 */
function handlePetFeed(payload?: Record<string, any>) {
  console.log('[GamePage] pet feed:', payload)
  // TODO: 对接后端 API
}

/** 处理触摸 */
function handlePetTouch(payload?: Record<string, any>) {
  console.log('[GamePage] pet touch:', payload)
  // TODO: 对接后端 API
}

/** 处理状态查询 */
function handleGetStatus() {
  console.log('[GamePage] get status')
  // TODO: 从后端获取状态，发送给游戏
}

/** 向游戏发送消息 */
function sendToGame(type: string, payload?: Record<string, any>) {
  gameRef.value?.sendMessage({ type, payload })
}

defineExpose({
  sendToGame,
})
</script>

<style scoped>
.game-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
}
</style>
