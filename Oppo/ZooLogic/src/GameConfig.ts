/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import BannerNativeUI from "./FanDong/BannerNativeUI"
import Box from "./FanDong/Box"
import FDHomeUI from "./FanDong/FDHomeUI"
import GiftBoxUI from "./FanDong/GiftBoxUI"
import GridNativeUI from "./FanDong/GridNativeUI"
import MiddleNativeUI from "./FanDong/MiddleNativeUI"
import PrivacyUI from "./FanDong/PrivacyUI"
import FinishUI from "./View/FinishUI"
import GameUI from "./View/GameUI"
import FixNodeY from "./Libs/FixNodeY"
import LoadingUI from "./View/LoadingUI"
import SelectUI from "./View/SelectUI"
import ScaleLoop from "./Libs/ScaleLoop"
import StartUI from "./View/StartUI"
import UpDownLoop from "./Mod/UpDownLoop"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=750;
    static height:number=1334;
    static scaleMode:string="fixedwidth";
    static screenMode:string="vertical";
    static alignV:string="top";
    static alignH:string="left";
    static startScene:any="MyScenes/StartUI.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("FanDong/BannerNativeUI.ts",BannerNativeUI);
        reg("FanDong/Box.ts",Box);
        reg("FanDong/FDHomeUI.ts",FDHomeUI);
        reg("FanDong/GiftBoxUI.ts",GiftBoxUI);
        reg("FanDong/GridNativeUI.ts",GridNativeUI);
        reg("FanDong/MiddleNativeUI.ts",MiddleNativeUI);
        reg("FanDong/PrivacyUI.ts",PrivacyUI);
        reg("View/FinishUI.ts",FinishUI);
        reg("View/GameUI.ts",GameUI);
        reg("Libs/FixNodeY.ts",FixNodeY);
        reg("View/LoadingUI.ts",LoadingUI);
        reg("View/SelectUI.ts",SelectUI);
        reg("Libs/ScaleLoop.ts",ScaleLoop);
        reg("View/StartUI.ts",StartUI);
        reg("Mod/UpDownLoop.ts",UpDownLoop);
    }
}
GameConfig.init();