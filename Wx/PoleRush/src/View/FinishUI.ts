import GameLogic from "../Crl/GameLogic"
import FdAd from "../FanDong/FdAd"
import FdMgr from "../FanDong/fdMgr"
import PlayerDataMgr from "../Libs/PlayerDataMgr"
import SoundMgr from "../Mod/SoundMgr"

export default class FinishUI extends Laya.Scene {
    constructor() {
        super()
    }

    winTitle: Laya.Image
    loseTitle: Laya.Image
    trippleBtn: Laya.Image
    skipBtn: Laya.Image
    normalBtn: Laya.Image
    restartBtn: Laya.Image
    bounesNum: Laya.FontClip
    coinNum: Laya.FontClip

    onOpened(param) {
        this.coinNum.value = PlayerDataMgr.getPlayerData().coin.toString()
        this.bounesNum.value = GameLogic.Share.isWin ? (GameLogic.Share._coinCount + GameLogic.Share._score).toString() : GameLogic.Share._coinCount.toString()
        this.winTitle.visible = GameLogic.Share.isWin
        this.loseTitle.visible = !GameLogic.Share.isWin
        // this.trippleBtn.visible = GameLogic.Share.isWin
        // this.skipBtn.visible = !GameLogic.Share.isWin
        // this.normalBtn.visible = GameLogic.Share.isWin
        // this.restartBtn.visible = !GameLogic.Share.isWin

        this.trippleBtn.on(Laya.Event.CLICK, this, this.trippleBtnCB)
        this.skipBtn.on(Laya.Event.CLICK, this, this.skipBtnCB)
        this.normalBtn.on(Laya.Event.CLICK, this, this.normalBtnCB)
        this.restartBtn.on(Laya.Event.CLICK, this, this.restartBtnCB)

        this.back()
    }

    onClosed() {

    }

    trippleBtnCB() {
        SoundMgr.instance.playSoundEffect('Click.mp3')
        let cb = () => {
            PlayerDataMgr.getPlayerData().coin += parseInt(this.bounesNum.value) * 3
            PlayerDataMgr.getPlayerData().grade++
            this.back()
        }
        FdAd.showVideoAd(cb)
    }

    skipBtnCB() {
        SoundMgr.instance.playSoundEffect('Click.mp3')
        let cb = () => {
            PlayerDataMgr.getPlayerData().grade++
            this.back()
        }
        FdAd.showVideoAd(cb)
    }

    normalBtnCB() {
        SoundMgr.instance.playSoundEffect('Click.mp3')
        //PlayerDataMgr.getPlayerData().coin += GameLogic.Share.isWin ? GameLogic.Share._score : 0
        PlayerDataMgr.getPlayerData().grade++
        this.back()
    }

    restartBtnCB() {
        SoundMgr.instance.playSoundEffect('Click.mp3')
        this.back()
    }

    back() {
        FdMgr.loadGame(() => {
            Laya.Scene.closeAll()
            if (GameLogic.Share.isWin) {
                PlayerDataMgr.getPlayerData().grade++
            }
            PlayerDataMgr.setPlayerData()
            GameLogic.Share.restartGame()
            Laya.Scene.open('MyScenes/StartUI.scene', true)
        })
    }
}