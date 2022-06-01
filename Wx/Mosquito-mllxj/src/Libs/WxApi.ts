
export default class WxApi {
    public static UnityPath: string = 'LayaScene_SampleScene/Conventional/'

    public static openId: string = ''
    public static version: string = '1.0.0'
    public static isVibrate: boolean = true
    public static isMusic: boolean = true
    public static OnShowFun: Function = null
    public static scopeBtn: any = null
    public static shareCallback: Function = null
    public static front_share_number: number = 0
    public static sceneId: number = 0

    public static gotOfflineBounes: boolean = false
    public static configData: any = null

    public static shareTime: number = 0
    public static firstShare: boolean = true
    public static hadShowFriendUI: boolean = false

    public static launchGameUI: boolean = false

    public static firstStartGame: boolean = false

    public static isKillBossUI: boolean = false
    public static fromKillBossUI: boolean = false

    public static killbossCallback: Function = null
    public static gameNavCallback: Function = null
    public static gameNavOnHide: boolean = false
    public static isStartUI: boolean = false
    public static isAuditor: boolean = false
    public static shieldAppid: boolean = false

    public static tempGrade: number = 1

    //微信登录
    public static LoginWx(cb: Function) {
        if (!Laya.Browser.onWeiXin) return
        let launchData = Laya.Browser.window.wx.getLaunchOptionsSync();
        Laya.Browser.window.wx.login({
            success(res) {
                if (res.code) {
                    console.log('res.code:', res.code);
                    if (cb) {
                        cb(res.code, launchData.query)
                    }
                }
            }
        })
    }

    //检查授权
    public static checkScope(btnNode: any) {
        if (Laya.Browser.onWeiXin) {
            //检查是否授权
            Laya.Browser.window.wx.getSetting({
                success: (response) => {
                    if (!response.authSetting['scope.userInfo']) {
                        //没有授权
                        console.log('没有授权');
                        this.createScope(btnNode);
                    } else {
                        //已经授权
                        console.log('已经授权');
                    }
                }
            })
        }
    }
    //创建授权按钮
    public static createScope(btnNode: any) {
        this.scopeBtn = Laya.Browser.window.wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: btnNode.x,
                top: btnNode.y,
                width: btnNode.width,
                height: btnNode.height,
                lineHeight: 40,
                backgroundColor: '#ffffff',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 0
            }
        })
        this.scopeBtn.onTap((res) => {
            if (res.errMsg == "getUserInfo:ok") {
                this.scopeBtn.destroy();
                this.scopeBtn = null
            } else if (res.errMsg == 'getUserInfo:fail auth deny') {
                this.scopeBtn.destroy();
                this.scopeBtn = null
            }
        })
    }

    //监听启动
    //Usually get fun(obj) obj.query
    public static GetLaunchParam(fun: Function) {
        if (Laya.Browser.onWeiXin) {
            this.OnShowFun = fun
            fun(this.GetLaunchPassVar())
            Laya.Browser.window.wx.onShow((para) => {
                //check onshow Fun
                if (this.OnShowFun != null) {
                    this.OnShowFun(para)
                }
                console.log("wx on show")
            })
        }
    }
    public static GetLaunchPassVar(): any {
        if (Laya.Browser.onWeiXin) {
            return Laya.Browser.window.wx.getLaunchOptionsSync()
        } else {
            return null
        }
    }

    public static WxOnHide(fun: Function) {
        if (Laya.Browser.onWeiXin) {
            Laya.Browser.window.wx.onHide(fun)
        }
    }
    public static WxOffHide(fun: Function) {
        if (fun && Laya.Browser.onWeiXin) {
            Laya.Browser.window.wx.offHide(fun)
        }
    }
    public static WxOnShow(fun: Function) {
        if (Laya.Browser.onWeiXin) {
            Laya.Browser.window.wx.onShow(fun)
        }
    }
    public static WxOffShow(fun: Function) {
        if (fun && Laya.Browser.onWeiXin) {
            Laya.Browser.window.wx.offShow(fun)
        }
    }

    //网络请求
    public static httpRequest(url: string, params: any, type: string = 'get', completeHandler?: Function) {
        var xhr: Laya.HttpRequest = new Laya.HttpRequest();
        xhr.http.timeout = 5000;//设置超时时间；
        xhr.once(Laya.Event.COMPLETE, this, completeHandler);
        xhr.once(Laya.Event.ERROR, this, this.httpRequest, [url, params, type, completeHandler]);
        if (type == "get") {
            xhr.send(url + '?' + params, "", type, "text");
        } else if (type == "post") {
            xhr.send(url, JSON.stringify(params), type, "text");
        }

    }

    //震动
    public static DoVibrate(isShort: boolean = true) {
        if (Laya.Browser.onWeiXin && this.isVibrate) {
            if (isShort) {
                Laya.Browser.window.wx.vibrateShort()
            } else {
                Laya.Browser.window.wx.vibrateLong()
            }
        }
    }

    //系统提示
    public static OpenAlert(msg: string, dur: number = 2000, icon: boolean = false) {
        if (Laya.Browser.onWeiXin) {
            Laya.Browser.window.wx.showToast({
                title: msg,//提示文字
                duration: dur,//显示时长
                mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false  
                icon: icon ? 'success' : 'none', //图标，支持"success"、"loading"  
            })
        }
    }

    //跳转
    public static NavigateApp(appid: string, path: string, title: string, cancelCB: Function, successCB: Function) {
        if (Laya.Browser.onWeiXin) {
            let self = this
            Laya.Browser.window.wx.navigateToMiniProgram({
                appId: appid,
                path: path,
                success(res) {
                    // 打开成功
                    console.log('打开成功')
                    successCB()
                },
                fail(res) {
                    // 打开失败
                    console.log('打开失败')
                    cancelCB()
                }
            })
        }
    }

    //预览图片
    public static preViewImage(url) {
        if (Laya.Browser.onWeiXin) {
            Laya.Browser.window.wx.previewImage({
                current: url, // 当前显示图片的http链接
                urls: [url] // 需要预览的图片http链接列表
            })
        }
    }

    
}