
import { _decorator, Component, Node, EventTouch, view, v3, Vec3, instantiate, input, SystemEvent, Input, KeyCode, EventKeyboard } from 'cc';
import { GameLogic } from '../Crl/GameLogic';
import { UINode } from '../Crl/UINode';
import { UIType } from '../Mod/Entity';
import PlayerDataMgr from '../Mod/PlayerDataMgr';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {

    static Share: GameUI

    @property(Node)
    settingNode: Node = null
    @property(Node)
    tipsNode: Node = null

    canJump: boolean = true

    onLoad() {
        GameUI.Share = this
    }

    start() {
        // [3]
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this)

    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                this.touchMove(true)
                break
            case KeyCode.KEY_D:
                this.touchMove(false)
                break
            case KeyCode.KEY_W:
                if (!this.canJump) return
                GameLogic.Share.playerCrl.jump()
                break
        }
    }
    onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                this.resetMove()
                break
            case KeyCode.KEY_D:
                this.resetMove()
                break
        }
    }

    touchMove(isLeft: boolean) {
        GameLogic.Share.playerCrl.dirX = isLeft ? -1 : 1
    }

    resetMove() {
        GameLogic.Share.playerCrl.dirX = 0
    }

    settingBtnCB() {
        this.settingNode.active = true
    }
    closeSetting() {
        this.settingNode.active = false
    }

    restartBtnCB() {
        if (PlayerDataMgr.getPlayerData().power > 0) {
            GameLogic.Share.restart(false)
        } else {
            UINode.Share.showUI(UIType.UI_POWER, () => {
                UINode.Share.showUI(UIType.UI_GAME)
            })
        }
    }

    tipsBtnCB() {
        let cb = () => {
            this.tipsNode.active = true
        }
        cb()
    }
    closeTips() {
        this.tipsNode.active = false
    }

    backToHome() {
        GameLogic.Share.restart()
    }

    update(deltaTime: number) {
    }
}