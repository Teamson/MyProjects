
import { _decorator, Component, Node, ProgressBar, director, find } from 'cc';
import { PREVIEW, WECHAT } from 'cc/env';
import FdMgr from '../../FDRes/Src/FdMgr';
import PlayerDataMgr from '../Mod/PlayerDataMgr';
const { ccclass, property } = _decorator;

@ccclass('LoadingUI')
export class LoadingUI extends Component {

    @property(ProgressBar)
    pBar: ProgressBar = null

    start() {
        // [3]
        if (PREVIEW) localStorage.clear()
        if (PlayerDataMgr.getPlayerData().skinId == undefined) localStorage.clear()
        PlayerDataMgr.getPlayerData()
        if (WECHAT) {
            //开启右上角的分享
            window['wx'].showShareMenu({
                withShareTicket: true,
                menus: ['shareAppMessage', 'shareTimeline']
            });
            window['wx'].onShareAppMessage(function (res) {
                return {
                    title: '救援小超人',
                    imageUrl: '',
                }
            })
        }
        if (WECHAT && !localStorage.getItem('older')) {
            localStorage.setItem('older', "1")
            FdMgr.showYsUI(() => {
                FdMgr.init(() => {
                    this.init()
                })
            })
        } else {
            FdMgr.init(() => {
                this.init()
            })
        }
        //this.init()
    }

    init() {
        director.loadScene('Game')
    }

    update(deltaTime: number) {
        // [4]
        this.pBar.progress += 0.01
    }
}