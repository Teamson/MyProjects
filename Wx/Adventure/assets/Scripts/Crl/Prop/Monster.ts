import { _decorator, Component, Node, BoxCollider2D, Contact2DType, dragonBones, RigidBody2D, Collider2D, IPhysics2DContact, v2 } from 'cc';
import { GameLogic } from '../GameLogic';
const { ccclass, property } = _decorator;

@ccclass('Monster')
export class Monster extends Component {

    body: RigidBody2D = null
    boxCollider: BoxCollider2D = null
    ani: dragonBones.ArmatureDisplay = null
    db: Node = null

    curAni: string = 'idle'
    isGot: boolean = false

    @property
    speed: number = 2
    @property
    isLoopMove: boolean = false
    @property
    leftMax: number = 0
    @property
    rightMax: number = 0
    @property
    isLeft: boolean = true

    onLoad() {
        this.body = this.getComponent(RigidBody2D)
        this.boxCollider = this.getComponent(BoxCollider2D)
        this.db = this.node.getChildByName("db")
        this.ani = this.db.getComponent(dragonBones.ArmatureDisplay)
    }

    start() {
        this.boxCollider.on(Contact2DType.BEGIN_CONTACT, this.onGroundCollider, this)
    }

    onGroundCollider(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (!this.isGot && otherCollider.node.name == 'player') {
            this.isGot = true
            GameLogic.Share.gameOver(false)
        }
    }

    playAni(name: string, times: number = -1) {
        if (name == this.curAni) return
        this.curAni = name
        this.ani.playAnimation(name, times)
    }

    update(deltaTime: number) {
        if (this.isLoopMove) {
            if (this.node.position.x < this.leftMax) {
                this.isLeft = true
            }
            if (this.node.position.x > this.rightMax) {
                this.isLeft = false
            }
        }

        if (this.isLeft) {
            this.body.linearVelocity = v2(-this.speed, this.body.linearVelocity.y)
        } else {
            this.body.linearVelocity = v2(this.speed, this.body.linearVelocity.y)
        }
    }
}

