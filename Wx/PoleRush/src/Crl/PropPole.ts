import Utility from "../Mod/Utility"
import GameLogic from "./GameLogic"
import GameUI from "../View/GameUI"
import SoundMgr from "../Mod/SoundMgr"

export default class PropPole extends Laya.Script {
    constructor() {
        super()
    }

    myOwner: Laya.Sprite3D = null
    onEnable() {
        this.myOwner = this.owner as Laya.Sprite3D
        this.myOwner.transform.localScale = new Laya.Vector3(1, 1.5, 1.5);
        (this.myOwner as Laya.MeshSprite3D).meshRenderer.castShadow = true;
    }

    onDisable() {

    }

    onUpdate() {
        if (!GameLogic.Share.isStartGame || GameLogic.Share.isGameOver) return

        let mbb = Utility.getBoundBox(this.myOwner.getChildAt(0) as Laya.Sprite3D)
        let obb = GameLogic.Share._poleCrl.getMyBound()
        if (Laya.CollisionUtils.intersectsBoxAndBox(mbb, obb)) {
            GameLogic.Share._poleCrl.scalePole(1)
            GameUI.Share.fixAddScore()
            this.myOwner.destroy()
        }
    }
}