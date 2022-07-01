import { _decorator, Component, Node, BoxCollider2D, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { GameLogic } from '../GameLogic';
const { ccclass, property } = _decorator;

@ccclass('ActiveGrid')
export class ActiveGrid extends Component {
    boxCollider: BoxCollider2D = null

    isGot: boolean = false

    onLoad() {
        this.boxCollider = this.getComponents(BoxCollider2D)[1]
        this.boxCollider.on(Contact2DType.BEGIN_CONTACT, this.onGroundCollider, this)
    }

    onGroundCollider(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (!this.isGot && otherCollider.node.name == 'player' && selfCollider.tag == 1) {
            this.isGot = true
            this.scheduleOnce(()=>{
                this.node.destroy()
            })
        }
    }

    update(deltaTime: number) {

    }
}

