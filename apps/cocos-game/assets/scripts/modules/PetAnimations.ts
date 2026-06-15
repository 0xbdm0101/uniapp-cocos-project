import { _decorator, Component, Node, Vec3, tween, Label, Sprite, SpriteFrame } from 'cc'

const { ccclass, property } = _decorator

/**
 * 宠物动画控制器
 * 帧动画用代码切换 SpriteFrame，其他动画用 tween 模拟
 */
@ccclass('PetAnimations')
export class PetAnimations extends Component {
  /** 宠物精灵节点（挂了 Sprite 组件） */
  @property(Node)
  petSprite: Node = null!

  /** 气泡节点 */
  @property(Node)
  bubbleNode: Node = null!

  /**
   * 眨眼帧序列（在编辑器里按顺序拖入 5 帧）
   * 顺序：睁眼 → 半闭 → 闭眼 → 半闭 → 睁眼
   */
  @property([SpriteFrame])
  blinkFrames: SpriteFrame[] = []

  /**
   * 哈气帧序列（可选，有素材就拖进来）
   * 如果为空，哈气用代码模拟
   */
  @property([SpriteFrame])
  pantFrames: SpriteFrame[] = []

  // ---- 内部状态 ----
  private sprite: Sprite | null = null
  private isPanting = false
  private pantTimer: any = null
  private isBlinking = false
  private blinkTimer: any = null
  private bubbleTween: any = null

  onLoad() {
    this.sprite = this.petSprite.getComponent(Sprite)
  }

  // ==================== 帧动画播放器 ====================

  /**
   * 通用帧动画播放
   * @param frames 帧序列
   * @param interval 每帧间隔（秒）
   * @param loop 是否循环
   * @param onComplete 非循环播放结束回调
   */
  private playFrameAnimation(
    frames: SpriteFrame[],
    interval: number,
    loop: boolean,
    onComplete?: () => void
  ): any {
    if (!this.sprite || frames.length === 0) return null

    let index = 0
    this.sprite.spriteFrame = frames[0]

    const timer = setInterval(() => {
      index++
      if (index >= frames.length) {
        if (loop) {
          index = 0
        } else {
          clearInterval(timer)
          onComplete?.()
          return
        }
      }
      this.sprite!.spriteFrame = frames[index]
    }, interval * 1000)

    return timer
  }

  // ==================== 哈气动画 ====================

  /** 开始哈气动画（无互动时） */
  startPanting() {
    if (this.isPanting) return
    this.isPanting = true

    // 有帧素材就播帧动画，没有就用代码模拟
    if (this.pantFrames.length > 0) {
      this.pantTimer = this.playFrameAnimation(this.pantFrames, 0.2, true)
    } else {
      this.startCodePanting()
    }
  }

  /** 停止哈气动画 */
  stopPanting() {
    if (!this.isPanting) return
    this.isPanting = false

    if (this.pantTimer) {
      clearInterval(this.pantTimer)
      this.pantTimer = null
    }

    // 停止代码模拟的 tween
    if (this._codePantTween) {
      this._codePantTween.stop()
      this._codePantTween = null
    }

    // 恢复第一帧
    if (this.sprite && this.blinkFrames.length > 0) {
      this.sprite.spriteFrame = this.blinkFrames[0]
    }
  }

  /** 代码模拟哈气（没有帧素材时） */
  private _codePantTween: any = null

  private startCodePanting() {
    const originalPos = this.petSprite.position.clone()
    const originalScale = this.petSprite.scale.clone()

    const pantingSequence = () => {
      tween(this.petSprite)
        .to(0.3, { position: new Vec3(originalPos.x, originalPos.y + 5, originalPos.z) }, { easing: 'sineOut' })
        .to(0.3, { position: originalPos }, { easing: 'sineIn' })
        .start()

      tween(this.petSprite)
        .to(0.4, { scale: new Vec3(originalScale.x * 1.02, originalScale.y * 0.98, originalScale.z) }, { easing: 'sineInOut' })
        .to(0.4, { scale: originalScale }, { easing: 'sineInOut' })
        .start()
    }

    this._codePantTween = tween(this.node)
      .delay(1.5)
      .call(pantingSequence)
      .union()
      .repeatForever()
      .start()

    pantingSequence()
  }

  // ==================== 眨眼动画 ====================

  /** 眨眼（触摸时，播一遍不循环） */
  playBlink() {
    if (this.isBlinking) return
    this.isBlinking = true

    if (this.blinkFrames.length > 0) {
      this.blinkTimer = this.playFrameAnimation(
        this.blinkFrames, 0.1, false,
        () => { this.isBlinking = false }
      )
    } else {
      // 没有帧素材就跳过眨眼
      this.isBlinking = false
    }
  }

  // ==================== 气泡对话 ====================

  /** 显示气泡 */
  showBubble(message: string, duration: number = 2) {
    if (this.bubbleTween) {
      this.bubbleTween.stop()
    }

    const label = this.bubbleNode.getComponentInChildren(Label)
    if (label) {
      label.string = message
    }

    this.bubbleNode.setScale(0, 0, 1)
    this.bubbleNode.active = true

    this.bubbleTween = tween(this.bubbleNode)
      .to(0.2, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
      .delay(duration)
      .to(0.2, { scale: new Vec3(0, 0, 1) }, { easing: 'backIn' })
      .call(() => { this.bubbleNode.active = false })
      .start()
  }

  /** 根据饱腹程度显示不同对话 */
  showFeedBubble(hunger: number) {
    let message = ''
    if (hunger >= 80) message = '好饱好饱~🤤'
    else if (hunger >= 60) message = '味道不错！😋'
    else if (hunger >= 40) message = '还要还要！🍖'
    else if (hunger >= 20) message = '饿饿...🥺'
    else message = '快饿扁了！😫'

    this.showBubble(message, 2.5)
  }

  // ==================== 触摸反应 ====================

  /** 触摸时的反应 */
  playTouchReaction() {
    this.playBlink()

    const originalAngle = this.node.angle
    tween(this.node)
      .to(0.1, { angle: 15 })
      .to(0.1, { angle: -15 })
      .to(0.1, { angle: 10 })
      .to(0.1, { angle: -10 })
      .to(0.1, { angle: 0 })
      .start()
  }
}
