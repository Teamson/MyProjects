import Utility from "../Mod/Utility";
import FdMgr from "./fdMgr";

export default class FdAd {
    static bannerIdArr: string[] = ["adunit-64eae0369857218b", "adunit-09c06c2b0c94fe06", "adunit-1dfd3fda79c0019d"];
    static videoId = "adunit-0333bcd027bfb093";
    static gridId = "adunit-60af7fa10d8a8e6d";

    static inidAd() {
        if (!Laya.Browser.onWeiXin) return;
        this.initBanner();
        this.createVideoAd();
        this.createOutsideBanner()
    }

    static sysInfo: any;
    static getSystemInfoSync() {
        if (!Laya.Browser.onWeiXin) return;
        if (!this.sysInfo) {
            this.sysInfo = wx.getSystemInfoSync();
        }
        return this.sysInfo;
    }

    //#region Banner广告
    static bannerAds: any[] = [];
    static bannerIndex: number = 0;
    static bannerTimesArr: number[] = []
    static bannerShowCount: number[] = []
    static bannerErrorArr: boolean[] = []
    static initBanner() {
        if (!Laya.Browser.onWeiXin) return;
        this.bannerIdArr = Utility.shuffleArr(this.bannerIdArr)
        console.log('bannerId 数组排列：', this.bannerIdArr)
        if (!FdMgr.canTrapAll && this.bannerAds.length > 1) {
            this.bannerAds.splice(0, this.bannerAds.length - 1)
        }
        for (let i = 0; i < this.bannerIdArr.length; i++) {
            this.bannerTimesArr.push(0)
            this.bannerShowCount.push(0)
            this.bannerErrorArr.push(false)
        }
        for (let i = 0; i < this.bannerIdArr.length; i++) {
            let bannerAd: any = this.createBannerAd(i)
            this.bannerAds.push(bannerAd)
        }
    }

    static get isAllBannerError(): boolean {
        let isAllError: boolean = true
        for (let i = 0; i < this.bannerErrorArr.length; i++) {
            if (!this.bannerErrorArr[i]) {
                isAllError = false
                break
            }
        }
        return isAllError
    }

    static showBannerAd() {
        if (!Laya.Browser.onWeiXin) return;

        if (this.isAllBannerError) {
            this.stopCountBannerTime()
            return
        }
        if (this.bannerErrorArr[this.bannerIndex]) {
            this.bannerIndex++
            if (this.bannerIndex >= this.bannerIdArr.length) this.bannerIndex = 0
            this.showBannerAd()
            return
        }

        this.bannerAds[this.bannerIndex] && this.bannerAds[this.bannerIndex].show()
        this.stopCountBannerTime()
        if (!FdMgr.canTrapAll) return
        Laya.timer.loop(100, this, this.countBannerTime)
    }

    static hideBannerAd() {
        if (!Laya.Browser.onWeiXin || this.isAllBannerError) {
            this.stopCountBannerTime()
            return;
        }
        this.bannerAds[this.bannerIndex] && this.bannerAds[this.bannerIndex].hide()
        this.stopCountBannerTime()
    }

    static countBannerTime() {
        this.bannerTimesArr[this.bannerIndex] += 0.1
        if (this.bannerTimesArr[this.bannerIndex] >= FdMgr.jsonConfig.refresh_banner_time) {
            this.bannerAds[this.bannerIndex] && this.bannerAds[this.bannerIndex].hide()
            this.bannerTimesArr[this.bannerIndex] = 0
            this.bannerShowCount[this.bannerIndex]++
            if (this.bannerShowCount[this.bannerIndex] >= 3) {
                this.bannerAds[this.bannerIndex] && this.bannerAds[this.bannerIndex].destroy()
                this.bannerAds[this.bannerIndex] = null
                this.bannerAds[this.bannerIndex] = this.createBannerAd(this.bannerIndex)
            }
            this.bannerIndex++
            if (this.bannerIndex >= this.bannerIdArr.length) this.bannerIndex = 0
            this.showBannerAd()
        }
    }

    static stopCountBannerTime() {
        Laya.timer.clear(this, this.countBannerTime)
    }

    static createBannerAd(index: number, isShow: boolean = false) {
        if (!Laya.Browser.onWeiXin) return;

        let sysInfo = this.getSystemInfoSync();
        let bannerAd = Laya.Browser.window.wx.createBannerAd({
            adUnitId: this.bannerIdArr[index],
            style: {
                top: sysInfo.screenHeight * 0.8,
                width: 300,
                left: sysInfo.screenWidth / 2 - 150
            },
            adIntervals: 30
        });
        bannerAd.onLoad(() => {
            if (isShow) {
                bannerAd.show()
            }
            this.bannerErrorArr[index] = false
            console.log("Banner广告加载成功");
        });
        bannerAd.onError(err => {
            this.bannerErrorArr[index] = true
            console.error("Banner广告加载失败", JSON.stringify(err));
        });
        bannerAd.onResize(res => {
            let realHeight = bannerAd.style.realHeight + 0.1;
            bannerAd.style.top = sysInfo.screenHeight - realHeight;
        });
        return bannerAd;
    }

    //#endregion

    /**创建屏外banner */
    static outsideBanner: any;
    static outSideErrorCount: number = 0;
    static outsideBannerId: string = 'adunit-1dfd3fda79c0019d'
    public static createOutsideBanner() {
        return
        if (!Laya.Browser.onWeiXin) return;
        if (this.outsideBanner) {
            this.outsideBanner.offLoad()
            this.outsideBanner.offError()
            this.outsideBanner.destroy();
        }

        if (Laya.Browser.window.wx.createBannerAd)
            this.outsideBanner = Laya.Browser.window.wx.createBannerAd({
                adUnitId: this.outsideBannerId,
                style: {
                    left: -10000,
                    top: -10000,
                    width: 320
                }
            });

        this.outsideBanner.onLoad(() => {
            console.log("屏外banner加载成功");
            this.outsideBanner.show()
            Laya.timer.once(20000, this, function () {
                FdAd.createOutsideBanner();
            });
        });

        this.outsideBanner.onError(err => {
            FdAd.outSideErrorCount++;
            if (FdAd.outSideErrorCount < 4) {
                Laya.timer.once(2000, this, function () {
                    FdAd.createOutsideBanner();
                });
            }
        });
    }

    //#region 激励视频广告
    static videoAd: any;
    static videoFinishCallback: Function;
    static videoCancelCallback: Function;

    static isExistVideoAd: boolean = false;
    static createVideoAd() {
        if (Laya.Browser.onWeiXin) {
            var self = this;
            var videoAd = this.videoAd;
            if (videoAd != null) {
                videoAd.offLoad(onLoadVideo);
                videoAd.offError(onErrorVideo);
                videoAd.offClose(onCloseVideo);
            }

            var videoAd = Laya.Browser.window.wx.createRewardedVideoAd({ adUnitId: self.videoId });
            videoAd.onLoad(onLoadVideo);
            videoAd.onError(onErrorVideo);
            videoAd.onClose(onCloseVideo);
            this.videoAd = videoAd;
        }

        function onLoadVideo() {
            console.log('video 加载成功');
            self.isExistVideoAd = true;
        }

        function onErrorVideo(err) {
            console.error('video 加载错误', err);
            self.isExistVideoAd = false;
        }

        function onCloseVideo(res) {
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            let isEnded = (res && res.isEnded || res === undefined) ? true : false;
            if (isEnded) {
                //观看视频成功次数埋点
                self.videoFinishCallback && self.videoFinishCallback()
                self.videoFinishCallback = null
            }
            self.videoCancelCallback && self.videoCancelCallback()
            self.videoCancelCallback = null
        }
    }

    static showVideoAd(finishCB?: Function, cancelCB?: Function) {
        if (!Laya.Browser.onWeiXin) {
            finishCB && finishCB();
            cancelCB && cancelCB();
            return;
        }

        if (!Laya.Browser.onWeiXin) return;
        let self = this
        this.videoFinishCallback = finishCB;
        this.videoCancelCallback = cancelCB;
        if (!this.isExistVideoAd) {
            this.createVideoAd()
        }
        if (Laya.Browser.onWeiXin) {
            var videoAd = this.videoAd;
            videoAd.show().then(() => { }).catch(err => {
                videoAd.load().then(() => videoAd.show()).catch(err => {
                    self.videoCancelCallback && self.videoCancelCallback()
                    self.videoCancelCallback = null
                });
            });
        }
    }

    static destroyVideoAd() {
        if (!this.videoAd) return;
        this.videoAd.destroy();
        this.videoAd = null;
    }
    //#endregion



    //#region 格子广告
    static gridAd;
    static initGridCB: Function;

    static initGridAD(cb?: Function, left = 0, top = 0) {
        if (!Laya.Browser.onWeiXin) {
            cb && cb(false);
            return;
        }

        this.CreateGridAD(this.gridId, left, top);
        if (cb) { this.initGridCB = cb; }
    }

    /**创建并展示格子 */
    private static CreateGridAD(id, posx, posy) {
        try {
            if (Laya.Browser.window.wx.createCustomAd) {
                var grid = Laya.Browser.window.wx.createCustomAd({
                    adUnitId: id,
                    adIntervals: 31,
                    style: {
                        left: posx,
                        top: posy,
                        width: Laya.Browser.clientWidth / 2.2
                    }
                });

                grid.onLoad(load => {
                    FdAd.gridAd = grid;
                    grid.show();

                    if (FdAd.initGridCB) {
                        FdAd.initGridCB(true);
                        FdAd.initGridCB = null;
                    }
                });

                grid.onError(err => {
                    console.error(err);

                    if (FdAd.initGridCB) {
                        FdAd.initGridCB(false);
                        FdAd.initGridCB = null;
                    }
                })
            }
        }
        catch (err) {
            console.log("原生格子报错" + err);

            if (FdAd.initGridCB) {
                FdAd.initGridCB(false);
                FdAd.initGridCB = null;
            }
        }
    }

    static showGridAD() {
        if (this.gridAd) {
            this.gridAd.show();
            return true;
        }
        return false;
    }

    static hideGridAD() {
        if (this.gridAd) {
            this.gridAd.hide();
        }

        //防止没关掉
        Laya.timer.once(500, this, () => {
            if (this.gridAd) {
                this.gridAd.hide();
            }
        });
    }
    //#endregion
}