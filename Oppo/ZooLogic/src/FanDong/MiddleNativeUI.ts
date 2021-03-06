import FdAd from "./FdAd"
import FdMgr from "./FdMgr"
import FDUtils from "./FDUtils"

export default class MiddleNativeUI extends Laya.Scene {
    constructor() {
        super()
    }
    myPanel: Laya.Panel
    pic: Laya.Image
    desc: Laya.Label
    closeBtn: Laya.Image
    adBtn: Laya.Image

    adData: any = null

    ccb: Function = null
    hadClick: boolean = false

    onShowCB: Function = null

    onOpened(param: any): void {
        this.size(Laya.stage.displayWidth, Laya.stage.displayHeight)
        if (param && param.ccb) this.ccb = param.ccb
        if (param && param.hidePanel) this.myPanel.visible = false
        this.closeBtn.on(Laya.Event.CLICK, this, this.closeBtnCB)
        this.adBtn.on(Laya.Event.CLICK, this, this.adBtnCB)

        this.onShowCB = () => {
            if (this.hadClick)
                this.close()
        }
        if (FdAd.oppoPlatform) Laya.Browser.window['qg'].onShow(this.onShowCB)

        FdAd.hideBanner()
        FdMgr.closeBannerNativeUI()

        this.init()
    }

    onClosed(type?: string): void {
        if (FdAd.oppoPlatform && this.onShowCB) Laya.Browser.window['qg'].offShow(this.onShowCB)
        Laya.timer.clearAll(this)
        FdAd.shareNativeAd.hideAd(this.adData.adId)

        this.ccb && this.ccb()
    }

    async init() {
        this.adData = (await FdAd.shareNativeAd.showAd()).adInfo
        if (!this.adData) { this.close(); return }
        this.pic.skin = this.adData.imgUrlList[0] ? this.adData.imgUrlList[0] : this.adData.iconUrlList[0]
        this.desc.text = this.adData.desc
        this.pic.off(Laya.Event.CLICK, this, this.adBtnCB)
        this.pic.on(Laya.Event.CLICK, this, this.adBtnCB)
        if (FdMgr.jsonConfig.is_touchMoveNativeAd && FdMgr.isAccountLateTime) {
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