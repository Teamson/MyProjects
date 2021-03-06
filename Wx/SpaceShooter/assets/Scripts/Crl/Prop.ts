import { _decorator, Component, Node, resources, Sprite, v3, Intersection2D, UITransform, Vec3 } from 'cc';
import { PropType } from '../Mod/Entity';
import { SoundMgr } from '../Mod/SoundMgr';
import Utility from '../Mod/Utility';
import { GameLogic } from './GameLogic';
import { Plane } from './Plane';
const { ccclass, property } = _decorator;

@ccclass('Prop')
export class Prop extends Component {
    type: PropType = PropType.Prop_Up
    planeType: number = 0

    start() {
    }

    initData(type: PropType) {
        this.type = type
        if (type == PropType.Prop_Up) {
            this.node.children[0].active = true
        } else if (type == PropType.Prop_Plane) {
            this.node.children[1].active = true
            let id = Utility.getRandomItemInArrWithoutSelf(Plane.Share._type, [1, 2, 3, 4, 5, 6])
            this.planeType = id
            let id1 = Math.floor((Plane.Share._lv - 1) % 3) + 1
            this.node.children[1].getComponent(Sprite).spriteFrame = GameLogic.Share.getPropPlaneSPByName('plane_' + id + '_' + id1)
        } else if (type == PropType.Prop_Pow) {
            this.node.children[2].active = true
        }
    }

    update(deltaTime: number) {
        if (GameLogic.Share.isPause || GameLogic.Share.isGameOver) return
        this.node.translate(v3(0, -2, 0))

        if (Vec3.distance(this.node.position, Plane.Share.node.position) <= 100) {
            SoundMgr.Share.PlaySound('prop')
            if (this.type == PropType.Prop_Up) {
                Plane.Share.upgradeLv()
            } else if (this.type == PropType.Prop_Plane) {
                Plane.Share.changeType(this.planeType)
            } else if (this.type == PropType.Prop_Pow) {
                SoundMgr.Share.PlaySound('getPow')
                Plane.Share.getPow()
            }
            this.node.destroy()
        }
    }
}

