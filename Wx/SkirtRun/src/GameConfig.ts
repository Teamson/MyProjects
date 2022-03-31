/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import FinishUI from "./View/FinishUI"
import GameUI from "./View/GameUI"
import FixNodeY from "./Libs/FixNodeY"
import LoadingUI from "./View/LoadingUI"
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
    static startScene:any="MyScenes/SkinUI.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("View/FinishUI.ts",FinishUI);
        reg("View/GameUI.ts",GameUI);
        reg("Libs/FixNodeY.ts",FixNodeY);
        reg("View/LoadingUI.ts",LoadingUI);
        reg("View/StartUI.ts",StartUI);
        reg("Mod/UpDownLoop.ts",UpDownLoop);
    }
}
GameConfig.init();