import PlayerDataMgr from "../Mod/PlayerDataMgr"

export default class GameData {
    static isMusic: boolean = true
    static isSound: boolean = true
    static isVibrate: boolean = true

    static VectorTrackDataArr: any[] = []

    //武器数据
    //type:0刀  1枪  2剑  3棍  4双刀
    static weaponData: any[] = [
        { id: 1, type: 0, atk: 100 }, { id: 2, type: 0, atk: 100 }, { id: 3, type: 0, atk: 100 }, { id: 4, type: 0, atk: 100 }, { id: 5, type: 0, atk: 100 },
        { id: 6, type: 0, atk: 100 }, { id: 7, type: 0, atk: 100 }, { id: 8, type: 0, atk: 100 }, { id: 9, type: 0, atk: 100 }, { id: 10, type: 0, atk: 100 },
        { id: 11, type: 2, atk: 100 }, { id: 12, type: 2, atk: 100 }, { id: 13, type: 2, atk: 100 }, { id: 14, type: 2, atk: 100 }, { id: 15, type: 2, atk: 100 },
        { id: 16, type: 3, atk: 100 }, { id: 17, type: 3, atk: 100 }, { id: 18, type: 3, atk: 100 }, { id: 19, type: 3, atk: 100 }, { id: 20, type: 3, atk: 100 },
        { id: 21, type: 4, atk: 100 }, { id: 22, type: 4, atk: 100 }, { id: 23, type: 4, atk: 100 }, { id: 24, type: 4, atk: 100 }, { id: 25, type: 4, atk: 100 },
        { id: 26, type: 1, atk: 100 }, { id: 27, type: 1, atk: 100 }, { id: 28, type: 1, atk: 100 }, { id: 29, type: 1, atk: 100 }, { id: 30, type: 1, atk: 100 },
        { id: 31, type: 1, atk: 100 }, { id: 32, type: 1, atk: 100 }, { id: 33, type: 1, atk: 100 }, { id: 34, type: 1, atk: 100 }, { id: 35, type: 1, atk: 100 },
        { id: 36, type: 1, atk: 100 }, { id: 37, type: 1, atk: 100 }, { id: 38, type: 1, atk: 100 }, { id: 39, type: 1, atk: 100 }, { id: 40, type: 1, atk: 100 }
    ]

    //武器价格
    static weaponCost: number[] = [
        5888, 5888, 5888, 5888, 5888, 5888, 5888, 5888, 5888, 5888,
        5888, 5888, 5888, 5888, 5888, 5888, 5888, 5888, 5888, 5888,
        5888, 5888, 5888, 5888, 5888, 5888, 5888, 5888, 5888, 5888,
        5888, 5888, 5888, 5888, 5888, 5888, 5888, 5888, 5888, 5888
    ]

    //技能冷却
    static skillCoolTime: any[] = [
        [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3],
        [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3],
        [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3],
        [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3]
    ]

    //获取武器攻击力
    //攻击力 = （人物基础攻击力 + 武器基础攻击力+ 武器强化等级*5）* （1+附魔次数%）
    static getWeaponAtk(weaponId: number): number {
        let atk: number = 0
        atk =
            (PlayerDataMgr.getPlayerData().attack + this.weaponData[weaponId].atk + PlayerDataMgr.getPlayerData().weaponUpArr[weaponId] * 5)
            * (1 + PlayerDataMgr.getPlayerData().weaponEnchantArr[weaponId] * 0.01)
        return atk
    }

    static getWeaponDir(id: number, type: number = 0): string {
        let dir = ''
        if (id < 10) {
            dir = 'Texture/Weapon/knife' + (id + 1) + '_' + (type + 1)
        } else if (id < 16) {
            id -= 10
            dir = 'Texture/Weapon/spear' + (id + 1) + '_' + (type + 1)
        } else if (id < 25) {
            id -= 16
            dir = 'Texture/Weapon/sword' + (id + 1) + '_' + (type + 1)
        } else if (id < 31) {
            id -= 25
            dir = 'Texture/Weapon/stick' + (id + 1) + '_' + (type + 1)
        } else {
            id -= 31
            dir = 'Texture/Weapon/cutter' + (id + 1) + '_' + (type + 1)
        }
        return dir
    }
}