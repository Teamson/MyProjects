import GameLogic from "../Crl/GameLogic"
import PlayerDataMgr from "../Libs/PlayerDataMgr"
import Utility from "../Mod/Utility"
import FdMgr from "../FanDong/FdMgr"

export default class GameUI extends Laya.Scene {
    constructor() {
        super()
    }
    static Share: GameUI

    gradeNum: Laya.FontClip
    coinNum: Laya.FontClip
    touchBtn: Laya.Image
    playerHp: Laya.ProgressBar
    bossHp: Laya.ProgressBar
    guideAni: Laya.Animation
    tipsNode: Laya.Image

    touchStartPosX: number = 0

    onOpened() {
        GameUI.Share = this
        this.size(Laya.stage.displayWidth, Laya.stage.displayHeight)
        Laya.timer.frameLoop(1, this, this.myUpdate)
        this.gradeNum.value = PlayerDataMgr.getPlayerData().grade.toString()
        this.touchBtn.on(Laya.Event.MOUSE_DOWN, this, this.touchStart)
        this.touchBtn.on(Laya.Event.MOUSE_MOVE, this, this.touchMove)
        this.touchBtn.on(Laya.Event.MOUSE_UP, this, this.touchEnd)
        FdMgr.inGame()
    }
    onClosed() {
        Laya.timer.clearAll(this)
    }

    touchStart(evt: Laya.Event) {
        if (GameLogic.Share.isGameOver) return
        if (GameLogic.Share._playerCrl.readyBoxing) {
            GameLogic.Share._playerCrl.attackBoss()
            return
        }
        if (GameLogic.Share.isFinish) {
            return
        }
        if (!GameLogic.Share.isStartGame) {
            this.guideAni.visible = false
            GameLogic.Share.gameStart()
        }
        let x = evt.stageX
        GameLogic.Share._playerCrl.touchX = x
    }
    touchMove(evt: Laya.Event) {
        if (GameLogic.Share.isGameOver) return
        if (GameLogic.Share.isFinish) {
            return
        }
        let x = evt.stageX
        GameLogic.Share._playerCrl.touchX = x
    }
    touchEnd(evt: Laya.Event) {
        if (GameLogic.Share.isGameOver) return
        if (GameLogic.Share.isFinish) {
            return
        }
    }

    fixPlayerHp() {
        if (!GameLogic.Share._player || GameLogic.Share.isFinish) return
        let op: Laya.Vector4 = new Laya.Vector4(0, 0, 0)
        let hPos = GameLogic.Share._player.transform.position.clone()
        hPos.y += 3
        GameLogic.Share._camera.viewport.project(hPos, GameLogic.Share._camera.projectionViewMatrix, op)
        this.playerHp.pos(op.x / Laya.stage.clientScaleX, op.y / Laya.stage.clientScaleY)
        this.playerHp.value = GameLogic.Share._playerCrl.hp / GameLogic.Share._playerCrl.hpMax
    }

    bossReady() {
        this.createTips()
    }

    fixBossHp() {
        let op: Laya.Vector4 = new Laya.Vector4(0, 0, 0)
        let hPos = GameLogic.Share._player.transform.position.clone()
        hPos.y += 9
        GameLogic.Share._camera.viewport.project(hPos, GameLogic.Share._camera.projectionViewMatrix, op)
        this.playerHp.pos(op.x / Laya.stage.clientScaleX, op.y / Laya.stage.clientScaleY)
        this.playerHp.value = GameLogic.Share._playerCrl.hp / GameLogic.Share._playerCrl.hpMax

        let op1: Laya.Vector4 = new Laya.Vector4(0, 0, 0)
        let hPos1 = GameLogic.Share._boss.transform.position.clone()
        hPos1.y += 9
        GameLogic.Share._camera.viewport.project(hPos1, GameLogic.Share._camera.projectionViewMatrix, op1)
        this.bossHp.pos(op1.x / Laya.stage.clientScaleX, op1.y / Laya.stage.clientScaleY)
        this.bossHp.value = GameLogic.Share._bossCrl.hp / GameLogic.Share._bossCrl.hpMax
    }

    createTips() {
        Laya.timer.loop(300, this, () => {
            if (GameLogic.Share.isGameOver) {
                this.tipsNode.visible = false
                Laya.timer.clearAll(this)
                return
            }
            let img: Laya.Image = new Laya.Image('gameUI/yxz_wz_2.png')
            img.anchorX = 0.5
            img.anchorY = 0.5
            img.pos(Math.random() * 200 - 100, Math.random() * 200 - 100)
            this.tipsNode.addChild(img)
            Laya.Tween.to(img, { scaleX: 1.2, scaleY: 1.2 }, 80, null, new Laya.Handler(this, () => {
            }))
            Laya.timer.once(300, this, () => { img.destroy() })
        })
    }

    myUpdate() {
        this.fixPlayerHp()
        if (GameLogic.Share.isFinish && PlayerDataMgr.getIsBossGrade()) {
            this.fixBossHp()
        }
        if (GameLogic.Share.isGameOver) {
            this.playerHp.visible = false
            this.bossHp.visible = false
        }
        this.coinNum.value = PlayerDataMgr.getPlayerData().coin.toString()
    }
}
