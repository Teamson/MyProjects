
import { _decorator, Component, Node, UI } from 'cc';
import FdAd from '../../FDRes/Src/FdAd';
import FdMgr from '../../FDRes/Src/FdMgr';
import { UIType } from '../Mod/Entity';
import PlayerDataMgr from '../Mod/PlayerDataMgr';
import { SoundMgr } from '../Mod/SoundMgr';
import Utility from '../Mod/Utility';
import { UINode } from './UINode';
const { ccclass, property } = _decorator;

@ccclass('GameLogic')
export class GameLogic extends Component {

    public static Share: GameLogic

    levelNode: Node = null

    lvIndex: number = 0
    enemyDiedCount: number = 0

    isTouching: boolean = false
    isGameOver: boolean = false
    isWin: boolean = false

    start() {
        GameLogic.Share = this
        this.levelNode = this.node.getChildByName('LevelNode')
    }

    gameStart() {
        this.lvIndex = Math.floor((PlayerDataMgr.getPlayerData().grade - 1) % PlayerDataMgr.maxGrade)
        this.levelNode.children[this.lvIndex].active = true
    }

    addDieCount() {
        SoundMgr.Share.PlaySound('Hurt')
        Utility.DoVibrate()
        this.enemyDiedCount++
    }

    checkGameOver() {
        if (this.isGameOver || this.isTouching) return
        if (this.enemyDiedCount >= PlayerDataMgr.getEnemyDieCountArr()[this.lvIndex]) {
            this.gameOver(true)
        }
    }

    gameOver(isWin: boolean) {
        this.isGameOver = true
        this.isWin = isWin

        this.scheduleOnce(() => {
            FdMgr.showGameOver(() => {
                UINode.Share.showUI(UIType.UI_FINISH)
            })
        }, 2)
    }

    update(deltaTime: number) {
        // [4]
        this.checkGameOver()
    }
}