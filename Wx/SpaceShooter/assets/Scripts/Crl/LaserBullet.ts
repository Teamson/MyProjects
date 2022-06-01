import { _decorator, Component, Node, UITransform, v3 } from 'cc';
import { Boss1 } from './Boss1';
import { Boss2 } from './Boss2';
import { Boss3 } from './Boss3';
import { GameLogic } from './GameLogic';
import { Plane } from './Plane';
import { Worm } from './Worm';
const { ccclass, property } = _decorator;

@ccclass('LaserBullet')
export class LaserBullet extends Component {
    start() {
        this.schedule(this.checkCollWorm, 0.2)
        this.schedule(this.checkCollBoss1, 0.2)
        this.schedule(this.checkCollBoss2, 0.2)
        this.schedule(this.checkCollBoss3, 0.2)
    }

    checkCollWorm() {
        for (let i = 0; i < GameLogic.Share.wormArr.length; i++) {
            let wormPos = GameLogic.Share.wormArr[i].getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0))
            let myPos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0))
            if (Math.abs(wormPos.x - myPos.x) <= 50) {
                GameLogic.Share.wormArr[i].getComponent(Worm).decHp(1 * Plane.Share._lv)
            }
        }
    }

    checkCollBoss1() {
        let bossPos = GameLogic.Share.boss1.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0))
        let myPos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0))
        if (GameLogic.Share.boss1.active && !GameLogic.Share.boss1.getComponent(Boss1).isDied && Math.abs(bossPos.x - myPos.x) <= 150) {
            GameLogic.Share.boss1.getComponent(Boss1).decHp(1 * Plane.Share._lv)
        }
    }

    checkCollBoss2() {
        let bossPos = GameLogic.Share.boss2.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0))
        let myPos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0))
        if (GameLogic.Share.boss2.active && !GameLogic.Share.boss2.getComponent(Boss2).isDied && Math.abs(bossPos.x - myPos.x) <= 150) {
            GameLogic.Share.boss2.getComponent(Boss2).decHp(1 * Plane.Share._lv)
        }
    }

    checkCollBoss3() {
        let bossPos = GameLogic.Share.boss3.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0))
        let myPos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0))
        if (GameLogic.Share.boss3.active && !GameLogic.Share.boss3.getComponent(Boss3).isDied && Math.abs(bossPos.x - myPos.x) <= 150) {
            GameLogic.Share.boss3.getComponent(Boss3).decHp(1 * Plane.Share._lv)
        }
    }

    update(deltaTime: number) {
        let s = 1
        if (Plane.Share._lv == 4) s = 1
        if (Plane.Share._lv == 5) s = 1.57
        if (Plane.Share._lv == 6) s = 2.14
        if (Plane.Share._lv == 7) s = 2.8
        if (Plane.Share._lv == 8) s = 3.4
        if (Plane.Share._lv == 9) s = 4
        this.node.setScale(v3(s, s))
    }
}

