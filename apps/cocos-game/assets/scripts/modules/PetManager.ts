/// <reference types="@cocos/creator-types/engine" />
import { _decorator, Component, Node, Vec3, tween } from 'cc'

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
  /** 宠物状态 */
  private status: PetStatus = {
    hp: 100,
    happiness: 80,
    hunger: 50,
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
    this.playJump()
    return this.getStatus()
  }

  /** 触摸 */
  touch(): PetStatus {
    this.status.happiness = Math.min(100, this.status.happiness + 10)
    this.playWag()
    return this.getStatus()
  }

  /** 跳跃动画 */
  private playJump() {
    const pos = this.node.position.clone()
    const jumpPos = new Vec3(pos.x, pos.y + 30, pos.z)

    tween(this.node)
      .to(0.15, { position: jumpPos }, { easing: 'quadOut' })
      .to(0.15, { position: pos }, { easing: 'quadIn' })
      .to(0.15, { position: jumpPos }, { easing: 'quadOut' })
      .to(0.15, { position: pos }, { easing: 'quadIn' })
      .start()
  }

  /** 摇摆动画 */
  private playWag() {
    const original = this.node.angle
    const angles = [10, -10, 10, -10, 0]

    let chain = tween(this.node)
    angles.forEach((a) => {
      chain = chain.to(0.1, { angle: original + a })
    })
    chain.start()
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
}
