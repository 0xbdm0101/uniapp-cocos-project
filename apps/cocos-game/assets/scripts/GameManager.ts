/// <reference types="@cocos/creator-types/engine" />
import { _decorator, Component, Node } from 'cc'

const { ccclass, property } = _decorator

/**
 * 游戏管理器
 * 负责与 uni-app UI 层通信
 */
@ccclass('GameManager')
export class GameManager extends Component {
  @property(Node)
  petNode: Node | null = null

  onLoad() {
    this.setupMessageListener()
    this.notifyReady()
  }

  /** 监听来自 uni-app 的消息 */
  private setupMessageListener() {
    // H5 环境通过 postMessage 通信
    window.addEventListener('message', (event: MessageEvent) => {
      const { type, payload } = event.data
      console.log('[Cocos] received message:', type, payload)
      this.handleMessage(type, payload)
    })
  }

  /** 处理消息 */
  private handleMessage(type: string, payload?: any) {
    switch (type) {
      case 'PET_FEED':
        this.onPetFeed(payload?.value ?? 10)
        break
      case 'PET_TOUCH':
        this.onPetTouch()
        break
      case 'GET_STATUS':
        this.sendStatus()
        break
    }
  }

  /** 喂食 */
  private onPetFeed(value: number) {
    console.log(`[Cocos] feed pet: +${value}`)
    // TODO: 更新宠物状态
    this.sendToUI('FEED_RESULT', { success: true, value })
  }

  /** 触摸 */
  private onPetTouch() {
    console.log('[Cocos] touch pet')
    // TODO: 播放触摸动画
    this.sendToUI('TOUCH_RESULT', { success: true })
  }

  /** 发送状态给 UI */
  private sendStatus() {
    this.sendToUI('STATUS_UPDATE', {
      hp: 100,
      happiness: 80,
      hunger: 50,
    })
  }

  /** 向 uni-app 发送消息 */
  private sendToUI(type: string, payload?: any) {
    const message = { type, payload }
    console.log('[Cocos] send to UI:', message)

    // H5 环境
    if (window.parent) {
      window.parent.postMessage(message, '*')
    }
  }

  /** 通知 UI 游戏已就绪 */
  private notifyReady() {
    this.sendToUI('GAME_READY', { timestamp: Date.now() })
  }
}
