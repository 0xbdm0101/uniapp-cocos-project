import { _decorator, Component } from 'cc'

const { ccclass } = _decorator

export interface GameMessage {
  type: string
  payload?: any
}

type MessageHandler = (type: string, payload?: any) => void

/**
 * 消息桥接
 * 负责与 uni-app 通信
 */
@ccclass('MessageBridge')
export class MessageBridge extends Component {
  private handler: MessageHandler | null = null

  /** 设置消息处理回调 */
  setHandler(handler: MessageHandler) {
    this.handler = handler
  }

  onLoad() {
    window.addEventListener('message', (event: MessageEvent) => {
      const { type, payload } = event.data || {}
      if (type) {
        console.log('[Bridge] recv:', type)
        this.handler?.(type, payload)
      }
    })
  }

  /** 发送消息给 UI */
  send(type: string, payload?: any) {
    const message = { type, payload }
    console.log('[Bridge] send:', type)
    window.parent?.postMessage(message, '*')
  }

  /** 通知就绪 */
  notifyReady() {
    this.send('GAME_READY', { timestamp: Date.now() })
  }
}
