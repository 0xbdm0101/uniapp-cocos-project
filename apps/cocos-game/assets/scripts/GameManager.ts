/// <reference types="@cocos/creator-types/engine" />
import { _decorator, Component, Node } from 'cc'
import { MessageBridge } from './modules/MessageBridge'
import { PetManager } from './modules/PetManager'

const { ccclass, property } = _decorator

/**
 * 游戏管理器 - 主控制器
 * 协调各模块工作
 */
@ccclass('GameManager')
export class GameManager extends Component {
  @property(MessageBridge)
  bridge: MessageBridge | null = null

  @property(PetManager)
  pet: PetManager | null = null

  onLoad() {
    // 注册消息处理
    this.bridge?.setHandler(this.handleMessage.bind(this))

    // 启动宠物动画
    this.pet?.startBreathing()

    // 通知 UI 就绪
    this.bridge?.notifyReady()
  }

  /** 处理消息 */
  private handleMessage(type: string, payload?: any) {
    switch (type) {
      case 'PET_FEED':
        this.bridge?.send('FEED_RESULT', this.pet?.feed(payload?.value ?? 10))
        break
      case 'PET_TOUCH':
        this.bridge?.send('TOUCH_RESULT', this.pet?.touch())
        break
      case 'GET_STATUS':
        this.bridge?.send('STATUS_UPDATE', this.pet?.getStatus())
        break
    }
  }
}
