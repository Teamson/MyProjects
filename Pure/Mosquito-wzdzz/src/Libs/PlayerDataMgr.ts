
export class ModelPos {
    constructor(x: any, y: any, z: any) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getV3() {
        return new Laya.Vector3(Number(this.x), Number(this.y), Number(this.z));
    }

    x: Number;
    y: Number;
    z: Number;
}

export class PlayerData {
    grade: number = 1
    coin: number = 0
    exitTime: number = 0
}

export default class PlayerDataMgr {
    private static _playerData: PlayerData = null
    public static powerMax: number = 10
    public static tempSkinId: number = -1
    public static levelDataArr: any[] = []

    //获取用户数据
    public static getPlayerData(): PlayerData {
        if (!localStorage.getItem('playerData')) {
            this._playerData = new PlayerData()
            localStorage.setItem('playerData', JSON.stringify(this._playerData))
        } else {
            if (this._playerData == null) {
                this._playerData = JSON.parse(localStorage.getItem('playerData')) as PlayerData
            }
        }
        return this._playerData
    }

    //设置用户数据
    public static setPlayerData() {
        localStorage.setItem('playerData', JSON.stringify(this._playerData))
    }

    public static changeCoin(dt: number) {
        this._playerData.coin += dt
        this.setPlayerData()
    }

    public static setExitTime() {
        this._playerData.exitTime = new Date().getTime()
        this.setPlayerData()
    }
}