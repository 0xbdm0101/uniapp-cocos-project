<template>
  <view class="game-page">
    <GameModule
      ref="gameRef"
      :query="gameQuery"
      @message="onGameMessage"
      @ready="onGameReady"
      @error="onGameError"
    />
    <!-- 测试控制面板 -->
    <view class="control-panel">
      <view class="btn" @tap="feedPet">🍖 喂食</view>
      <view class="btn" @tap="touchPet">🤚 触摸</view>
      <view class="btn" @tap="getStatus">📊 状态</view>
    </view>
    <!-- 状态显示 -->
    <view class="status-bar" v-if="petStatus">
      <text>HP: {{ petStatus.hp }} | 心情: {{ petStatus.happiness }} | 饥饿: {{ petStatus.hunger }}</text>
    </view>
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

/** 宠物状态 */
const petStatus = ref<{ hp: number; happiness: number; hunger: number } | null>(null)

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
  console.log('[GamePage] message from game:', data.type, data.payload)

  switch (data.type) {
    case 'GAME_READY':
      onGameReady()
      break
    case 'FEED_RESULT':
      uni.showToast({ title: `喂食成功 +${data.payload?.value ?? 10}`, icon: 'success' })
      break
    case 'TOUCH_RESULT':
      uni.showToast({ title: '摸摸~', icon: 'success' })
      break
    case 'STATUS_UPDATE':
      handleStatusUpdate(data.payload)
      break
    default:
      console.log('[GamePage] unhandled:', data.type)
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

/** 喂食按钮 */
function feedPet() {
  console.log('[GamePage] feedPet')
  sendToGame('PET_FEED', { value: 10 })
}

/** 触摸按钮 */
function touchPet() {
  console.log('[GamePage] touchPet')
  sendToGame('PET_TOUCH')
}

/** 状态按钮 */
function getStatus() {
  console.log('[GamePage] getStatus')
  sendToGame('GET_STATUS')
}

/** 处理状态更新 */
function handleStatusUpdate(payload?: Record<string, any>) {
  if (payload) {
    petStatus.value = payload as { hp: number; happiness: number; hunger: number }
    uni.showToast({ title: '状态已更新', icon: 'success' })
  }
}

/** 向游戏发送消息 */
function sendToGame(type: string, payload?: Record<string, any>) {
  console.log('[GamePage] sendToGame:', type, payload)
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
  position: relative;
}

.control-panel {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 999;
}

.btn {
  background: rgba(255, 255, 255, 0.9);
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  user-select: none;
}

.btn:active {
  transform: scale(0.95);
  opacity: 0.8;
}

.status-bar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  padding: 8px 20px;
  border-radius: 20px;
  z-index: 999;
}

.status-bar text {
  color: #fff;
  font-size: 14px;
}
</style>
