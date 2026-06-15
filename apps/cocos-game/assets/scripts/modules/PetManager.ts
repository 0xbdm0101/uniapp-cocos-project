import { _decorator, Component, Node, Vec3, tween, Animation } from 'cc'
import { PetAnimations } from './PetAnimations'

const { ccclass, property } = _decorator

/** 宠物状态 */
export interface PetStatus {
  hp: number
  happiness: number
  hunger: number
}

/**
 * 宠物管理器
 * 负责宠物状态和动画
 */
@ccclass('PetManager')
export class PetManager extends Component {
  @property(PetAnimations)
  animations: PetAnimations | null = null

  /** 宠物状态 */
  private status: PetStatus = {
    hp: 100,
    happiness: 80,
    hunger: 50,
  }

  /** 无互动计时器 */
  private idleTimer: number = 0
  private readonly IDLE_TIMEOUT = 3 // 3秒无互动开始哈气

  /** 动画组件 */
  private animComp: Animation | null = null

  onLoad() {
    this.animComp = this.getComponent(Animation)
  }

  /** 获取状态 */
  getStatus(): PetStatus {
    return { ...this.status }
  }

  /** 喂食 */
  feed(value: number): PetStatus {
    this.status.hunger = Math.max(0, this.status.hunger - value)
    this.status.happiness = Math.min(100, this.status.happiness + 5)
    this.status.hp = Math.min(100, this.status.hp + 2)

    // 停止哈气动画
    this.animations?.stopPanting()

    // 播放坐叫动画
    this.playSitBark()

    // 显示饱腹程度气泡
    this.animations?.showFeedBubble(this.status.hunger)

    // 重置空闲计时器
    this.resetIdleTimer()

    return this.getStatus()
  }

  /** 播放坐叫动画，播完回到待机 */
  private playSitBark() {
    if (!this.animComp) return
    this.animComp.play('dog_sit_bark')
    // 动画播完后切回待机
    this.animComp.once(Animation.EventType.FINISHED, () => {
      this.animComp?.play('dog_sit_look')
    })
  }

  /** 触摸 */
  touch(): PetStatus {
    this.status.happiness = Math.min(100, this.status.happiness + 10)

    // 停止哈气动画
    this.animations?.stopPanting()

    // 播放触摸反应动画（眨眼 + 摇摆）
    this.animations?.playTouchReaction()

    // 重置空闲计时器
    this.resetIdleTimer()

    return this.getStatus()
  }


  /** 呼吸动画 */
  startBreathing() {
    const scale = this.node.scale.clone()
    const breath = new Vec3(scale.x * 1.05, scale.y * 1.05, scale.z)

    tween(this.node)
      .to(1.5, { scale: breath }, { easing: 'sineInOut' })
      .to(1.5, { scale: scale }, { easing: 'sineInOut' })
      .union()
      .repeatForever()
      .start()
  }

  /** 重置空闲计时器 */
  private resetIdleTimer() {
    this.idleTimer = 0
  }

  /** 更新空闲状态 */
  update(deltaTime: number) {
    this.idleTimer += deltaTime

    // 超过空闲时间，开始哈气动画
    if (this.idleTimer >= this.IDLE_TIMEOUT) {
      this.animations?.startPanting()
    }
  }
}
