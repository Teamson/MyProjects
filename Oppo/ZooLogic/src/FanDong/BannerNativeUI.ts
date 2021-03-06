import FdAd from "./FdAd"
import FdMgr from "./FdMgr"

export default class BannerNativeUI extends Laya.Scene {
    constructor() {
        super()
    }
    root: Laya.Image
    pic: Laya.Image
    desc: Laya.Label
    closeBtn: Laya.Image

    adData: any = null

    ccb: Function = null
    hadClick: boolean = false

    onShowCB: Function = null

    onOpened(param: any): void {
        this.size(Laya.stage.displayWidth, Laya.stage.displayHeight)
        let s = FdMgr.jsonConfig.account_nativeScale
        this.root.scale(s, s)
        if (param && param.ccb) this.ccb = param.ccb
        this.closeBtn.on(Laya.Event.CLICK, this, this.closeBtnCB)

        this.initNative()
        Laya.timer.loop(FdMgr.jsonConfig.account_refBotNativeAd * 1000, this, () => {
            this.initNative()
        })

        this.onShowCB = () => {
            if (this.hadClick)
                this.close()
        }
        if (FdAd.oppoPlatform) Laya.Browser.window['qg'].onShow(this.onShowCB)
    }

    onClosed(type?: string): void {
        if (FdAd.oppoPlatform && this.onShowCB) Laya.Browser.window['qg'].offShow(this.onShowCB)
        Laya.timer.clearAll(this)
        FdAd.shareNativeAd.hideAd(this.adData.adId)
        this.ccb && this.ccb()
    }

    async initNative() {
        this.hadClick = false
        this.adData = (await FdAd.shareNativeAd.showAd()).adInfo
        if (!this.adData) { this.close(); return }
        this.pic.skin = this.adData.imgUrlList[0] ? this.adData.imgUrlList[0] : this.adData.iconUrlList[0]
        this.pic.off(Laya.Event.CLICK, this, this.adBtnCB)
        this.pic.on(Laya.Event.CLICK, this, this.adBtnCB)
        if (FdMgr.jsonConfig.is_touchMoveNativeAd && FdMgr.isAccountLateTime && !FdMgr.nativeMissTouched) {
            this.pic.off(Laya.Event.MOUSE_MOVE, this, this.adBtnCB)
            this.pic.on(Laya.Event.MOUSE_MOVE, this, this.adBtnCB, [true])
        }
    }

    adBtnCB(isMissTouch: boolean = false) {
        if (this.hadClick) return
        this.hadClick = true
        FdAd.shareNativeAd.clickAd(this.adData.adId)
        if (isMissTouch) FdMgr.setNativeMissTouched()
    }

    closeBtnCB() {
        if (FdMgr.jsonConfig.is_topNativeAdCloseBtnLate && FdMgr.isAccountLateTime && !FdMgr.nativeMissTouched) {
            this.adBtnCB(true)
        } else {
            this.close()
        }
    }
}