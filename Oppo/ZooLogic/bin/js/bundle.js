(function () {
    'use strict';

    class PlayerData {
        constructor() {
            this.grade = 1;
            this.bodyArr = [1, 0, 0, 0, 0, 0];
            this.headArr = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
            this.legArr = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
            this.tailArr = [1, 1, 0, 0];
            this.wingsArr = [0, 0];
        }
    }
    class ItemData {
        constructor() {
            this.head = [
                [2, 1, 25], [4, 2, 30], [6, 3, 35], [8, 4, 40], [10, 5, 45],
                [12, 6, 50], [14, 7, 55], [16, 8, 60], [18, 9, 65], [20, 10, 70]
            ];
            this.leg = [
                [2, 1, 25], [4, 2, 30], [6, 3, 35], [8, 4, 40], [10, 5, 45],
                [12, 6, 50], [14, 7, 55], [16, 8, 60], [18, 9, 65], [20, 10, 70]
            ];
            this.tail = [[5, 2, 20], [10, 4, 30], [15, 6, 40], [20, 8, 50]];
            this.wings = [[10, 5, 50], [10, 5, 50]];
        }
    }
    class PlayerDataMgr {
        static getPlayerData() {
            if (!localStorage.getItem('playerData')) {
                this._playerData = new PlayerData();
                localStorage.setItem('playerData', JSON.stringify(this._playerData));
            }
            else {
                if (this._playerData == null) {
                    this._playerData = JSON.parse(localStorage.getItem('playerData'));
                }
            }
            return this._playerData;
        }
        static setPlayerData() {
            localStorage.setItem('playerData', JSON.stringify(this._playerData));
        }
        static getBodyName(index) {
            let arr = ['美洲狮 身体', '大象 身体', '青蛙 身体', '长颈鹿 身体', '马 身体', '霸王龙 身体'];
            return arr[index];
        }
        static getHeadName(index) {
            let arr = ['美洲狮 头', '鹿 头', '鸭子 头', '大象 头', '青蛙 头', '长颈鹿 头', '马 头', '人类 头', '独角兽 头', '霸王龙 头'];
            return arr[index];
        }
        static getLegName(index) {
            let arr = ['美洲狮 腿', '大象 腿', '青蛙 腿', '青蛙 腿', '长颈鹿 腿', '马 腿', '人类 手', '人类 腿', '霸王龙 腿', '霸王龙 腿'];
            return arr[index];
        }
        static getTailName(index) {
            let arr = ['美洲狮 尾巴', '大象 尾巴', '长颈鹿 尾巴', '马 尾巴'];
            return arr[index];
        }
        static getWingsName(index) {
            let arr = ['蝙蝠 翅膀', '独角兽 翅膀'];
            return arr[index];
        }
        static getDataByType(type) {
            let data = [];
            if (type == 0) {
                data = this._playerData.headArr;
            }
            else if (type == 1) {
                data = this._playerData.legArr;
            }
            else if (type == 2) {
                data = this._playerData.tailArr;
            }
            else if (type == 3) {
                data = this._playerData.wingsArr;
            }
            return data;
        }
        static getItemData() {
            if (!this._itemData) {
                this._itemData = new ItemData();
            }
            return this._itemData;
        }
        static getInvalidSkins() {
            let arr = [];
            for (let i = 0; i < 4; i++) {
                let dataArr = this.getDataByType(i);
                for (let j = 0; j < dataArr.length; j++) {
                    if (dataArr[j] == 0) {
                        arr.push([i, j]);
                    }
                }
            }
            return arr;
        }
        static unlockBody() {
            for (let i = 0; i < this._playerData.bodyArr.length; i++) {
                if (this._playerData.bodyArr[i] == 0) {
                    this._playerData.bodyArr[i] = 1;
                    this.setPlayerData();
                    return;
                }
            }
        }
    }
    PlayerDataMgr._playerData = null;
    PlayerDataMgr._itemData = null;

    class WxApi {
        static LoginWx(cb) {
            if (!Laya.Browser.onQGMiniGame)
                return;
            let launchData = Laya.Browser.window.qg.getLaunchOptionsSync();
            Laya.Browser.window.qg.login({
                success(res) {
                    if (res.code) {
                        console.log('res.code:', res.code);
                        if (cb) {
                            cb(res.code, launchData.query);
                        }
                    }
                }
            });
        }
        static GetLaunchParam(fun) {
            if (Laya.Browser.onQGMiniGame) {
                this.OnShowFun = fun;
                fun(this.GetLaunchPassVar());
                Laya.Browser.window.qg.onShow((para) => {
                    if (this.OnShowFun != null) {
                        this.OnShowFun(para);
                    }
                    console.log("wx on show");
                });
            }
        }
        static GetLaunchPassVar() {
            if (Laya.Browser.onQGMiniGame) {
                return Laya.Browser.window.qg.getLaunchOptionsSync();
            }
            else {
                return null;
            }
        }
        static WxOnHide(fun) {
            if (Laya.Browser.onQGMiniGame) {
                Laya.Browser.window.qg.onHide(fun);
            }
        }
        static WxOffHide(fun) {
            if (fun && Laya.Browser.onQGMiniGame) {
                Laya.Browser.window.qg.offHide(fun);
            }
        }
        static WxOnShow(fun) {
            if (Laya.Browser.onQGMiniGame) {
                Laya.Browser.window.qg.onShow(fun);
            }
        }
        static WxOffShow(fun) {
            if (fun && Laya.Browser.onQGMiniGame) {
                Laya.Browser.window.qg.offShow(fun);
            }
        }
        static httpRequest(url, params, type = 'get', completeHandler) {
            var xhr = new Laya.HttpRequest();
            xhr.http.timeout = 5000;
            xhr.once(Laya.Event.COMPLETE, this, completeHandler);
            xhr.once(Laya.Event.ERROR, this, this.httpRequest, [url, params, type, completeHandler]);
            if (type == "get") {
                xhr.send(url + '?' + params, "", type, "text");
            }
            else if (type == "post") {
                xhr.send(url, JSON.stringify(params), type, "text");
            }
        }
        static DoVibrate(isShort = true) {
            if (Laya.Browser.onQGMiniGame && this.isVibrate) {
                if (isShort) {
                    Laya.Browser.window.qg.vibrateShort();
                }
                else {
                    Laya.Browser.window.qg.vibrateLong();
                }
            }
        }
        static OpenAlert(msg, dur = 2000, icon = false) {
            if (Laya.Browser.onQGMiniGame) {
                Laya.Browser.window.qg.showToast({
                    title: msg,
                    duration: dur,
                    mask: false,
                    icon: icon ? 'success' : 'none',
                });
            }
        }
        static preViewImage(url) {
            if (Laya.Browser.onQGMiniGame) {
                Laya.Browser.window.qg.previewImage({
                    current: url,
                    urls: [url]
                });
            }
        }
    }
    WxApi.UnityPath = 'LayaScene_SampleScene/Conventional/';
    WxApi.version = '';
    WxApi.isVibrate = true;
    WxApi.isMusic = true;
    WxApi.OnShowFun = null;

    class SoundMgr {
        constructor() {
            this.effectArr = [];
        }
        static get instance() {
            if (!this._instance) {
                this._instance = new SoundMgr();
            }
            return this._instance;
        }
        initLoading(fun) {
            var resUrl = [
                { url: 'res/Sounds/Click.mp3', type: Laya.Loader.SOUND },
                { url: 'res/Sounds/Get.mp3', type: Laya.Loader.SOUND },
                { url: 'res/Sounds/Hurt.mp3', type: Laya.Loader.SOUND },
                { url: 'res/Sounds/Win.mp3', type: Laya.Loader.SOUND },
                { url: 'res/Sounds/Lose.mp3', type: Laya.Loader.SOUND }
            ];
            Laya.loader.load(resUrl, Laya.Handler.create(this, fun));
            Laya.SoundManager.setMusicVolume(1);
            Laya.SoundManager.setSoundVolume(1);
        }
        playMusic(str, loops = 0, cb) {
            Laya.SoundManager.playMusic('res/Sounds/' + str, loops, new Laya.Handler(this, cb));
        }
        stopMusic() {
            Laya.SoundManager.stopMusic();
        }
        playSoundEffect(str, loops = 1, cb, soundClass, startTime) {
            return Laya.SoundManager.playSound('res/Sounds/' + str, loops, new Laya.Handler(this, cb), soundClass, startTime);
        }
        stopSound(str) {
            Laya.SoundManager.stopSound('res/Sounds/' + str);
        }
    }

    class Utility {
        static calcDistance(a, b) {
            return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        }
        static getWorldDis(a, b) {
            let pA = a.transform.position.clone();
            let pB = b.transform.position.clone();
            return Laya.Vector3.distance(pA, pB);
        }
        static getDirectionAToB(A, B, normalize = true) {
            let pA = A.transform.position.clone();
            let pB = B.transform.position.clone();
            let dir = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.subtract(pB, pA, dir);
            if (normalize)
                Laya.Vector3.normalize(dir, dir);
            return dir;
        }
        static fixPosY(y, designHeight = 1334) {
            return y * Laya.stage.displayHeight / designHeight;
        }
        static findNodeByName(rootNode, name) {
            let targetNode = null;
            let funC = (node) => {
                for (let i = 0; i < node.numChildren; i++) {
                    if (node.getChildAt(i).name == name) {
                        targetNode = node.getChildAt(i);
                        return;
                    }
                    else {
                        funC(node.getChildAt(i));
                    }
                }
            };
            funC(rootNode);
            return targetNode;
        }
        static TmoveTo(node, duration, des, cb, ease) {
            if (!node.transform)
                return;
            let t = new Laya.Tween();
            var posOld = node.transform.position;
            t.to(node.transform.position, {
                x: des.x,
                y: des.y,
                z: des.z,
                update: new Laya.Handler(this, () => {
                    if (!node.transform)
                        return;
                    node.transform.position = posOld;
                })
            }, duration, ease, Laya.Handler.create(this, () => {
                cb && cb();
            }));
        }
        static TmoveToYZ(node, duration, des, cb, ease) {
            if (!node.transform)
                return;
            let t = new Laya.Tween();
            var posOld = node.transform.position;
            t.to(node.transform.position, {
                y: des.y,
                z: des.z,
                update: new Laya.Handler(this, () => {
                    if (node.transform)
                        node.transform.position = posOld;
                })
            }, duration, null, Laya.Handler.create(this, () => {
                cb && cb();
            }));
            return t;
        }
        static TmoveToX(node, duration, des, cb, ease) {
            if (!node.transform)
                return;
            let t = new Laya.Tween();
            var posOld = node.transform.localPosition;
            t.to(node.transform.localPosition, {
                x: des.x,
                update: new Laya.Handler(this, () => {
                    if (node.transform)
                        node.transform.localPosition = posOld;
                })
            }, duration, null, Laya.Handler.create(this, () => {
                cb && cb();
            }));
        }
        static TmoveToY(node, duration, des, cb, ease) {
            if (!node.transform)
                return;
            let t = new Laya.Tween();
            var posOld = node.transform.localPosition;
            t.to(node.transform.localPosition, {
                y: des.y,
                update: new Laya.Handler(this, () => {
                    if (node.transform)
                        node.transform.localPosition = posOld;
                })
            }, duration, ease, Laya.Handler.create(this, () => {
                cb && cb();
            }));
        }
        static TmoveToWorld(node, duration, des, cb, ease) {
            if (!node.transform)
                return;
            let t = new Laya.Tween();
            var posOld = node.transform.position;
            t.to(node.transform.position, {
                y: des.y,
                update: new Laya.Handler(this, () => {
                    if (node.transform)
                        node.transform.position = posOld;
                })
            }, duration, null, Laya.Handler.create(this, () => {
                cb && cb();
            }));
        }
        static RotateWithPoint(node, dir, angle) {
            let desPos = new Laya.Vector3();
            let p = node.transform.localPosition.clone();
            angle = angle * Math.PI / 180;
            desPos.x = p.x * Math.cos(angle) + (dir.y * p.z - dir.z * p.y) * Math.sin(angle) +
                dir.x * (dir.x * p.x + dir.y * p.y + dir.z * p.z) * (1 - Math.cos(angle));
            desPos.y = p.y * Math.cos(angle) + (dir.x * p.z - dir.z * p.x) * Math.sin(angle) +
                dir.y * (dir.x * p.x + dir.y * p.y + dir.z * p.z) * (1 - Math.cos(angle));
            desPos.z = p.z * Math.cos(angle) + (dir.x * p.y - dir.y * p.x) * Math.sin(angle) +
                dir.z * (dir.x * p.x + dir.y * p.y + dir.z * p.z) * (1 - Math.cos(angle));
            return desPos;
        }
        static RotateTo(node, duration, des, cb) {
            var rotationOld = node.transform.rotationEuler;
            Laya.Tween.to(node.transform.rotationEuler, {
                x: des.x,
                y: des.y,
                z: des.z,
                update: new Laya.Handler(this, function () {
                    if (node)
                        node.transform.rotationEuler = rotationOld;
                })
            }, duration, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                cb && cb();
            }));
        }
        static tMove2D(node, x, y, t, cb) {
            Laya.Tween.to(node, { x: x, y: y }, t, null, new Laya.Handler(this, () => {
                if (cb)
                    cb();
            }));
        }
        static scaleTo2D(node, s, t, cb) {
            Laya.Tween.to(node, { scaleX: s, scaleY: s }, t, null, new Laya.Handler(this, () => {
                if (cb)
                    cb();
            }));
        }
        static alphaTo2D(node, s, t, cb) {
            Laya.Tween.to(node, { alpha: s }, t, null, new Laya.Handler(this, () => {
                if (cb)
                    cb();
            }));
        }
        static updateNumber(baseNum, times, label, labelOrFont = true, inclease, cb) {
            let timesNum = baseNum * times;
            let dt = Math.floor((timesNum - baseNum) / 60);
            dt = dt <= 0 ? 1 : dt;
            let func = () => {
                if (inclease) {
                    baseNum += dt;
                    if (baseNum >= timesNum) {
                        baseNum = timesNum;
                        cb && cb();
                        Laya.timer.clear(this, func);
                    }
                    if (labelOrFont)
                        label.text = baseNum.toString();
                    else
                        label.value = baseNum.toString();
                }
                else {
                    timesNum -= dt;
                    if (timesNum <= baseNum) {
                        timesNum = baseNum;
                        cb && cb();
                        Laya.timer.clear(this, func);
                    }
                    if (labelOrFont)
                        label.text = timesNum.toString();
                    else
                        label.value = timesNum.toString();
                }
            };
            Laya.timer.frameLoop(1, this, func);
        }
        static loadJson(str, complete) {
            Laya.loader.load(str, Laya.Handler.create(this, complete), null, Laya.Loader.JSON);
        }
        static objectShake(target, shakeTime = 1, shakeAmount = 0.7) {
            var shake = shakeTime;
            var decreaseFactor = 1;
            var originalPos = target.transform.localPosition.clone();
            Laya.timer.frameLoop(1, this, updateShake);
            function randomPos() {
                var x = Math.random() > 0.5 ? Math.random() : -(Math.random());
                var y = Math.random() > 0.5 ? Math.random() : -(Math.random());
                return new Laya.Vector3(x, y, 0);
            }
            function updateShake() {
                if (shake > 0) {
                    var pos = new Laya.Vector3();
                    Laya.Vector3.scale(randomPos(), shakeAmount, pos);
                    Laya.Vector3.add(originalPos, pos, pos);
                    target.transform.localPosition = pos;
                    shake -= 0.02 * decreaseFactor;
                }
                else {
                    shake = 0;
                    target.transform.localPosition = originalPos;
                    Laya.timer.clear(this, updateShake);
                }
            }
        }
        static getRandomItemInArr(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }
        static shuffleArr(arr) {
            let i = arr.length;
            while (i) {
                let j = Math.floor(Math.random() * i--);
                [arr[j], arr[i]] = [arr[i], arr[j]];
            }
            return arr;
        }
        static GetRandom(mix, max, isInt = true) {
            let w = max - mix;
            let r1 = Math.random() * (w + 1);
            r1 += mix;
            return isInt ? Math.floor(r1) : r1;
        }
        static coinCollectAnim(startPos, endPos, parent, amount = 10, callBack) {
            let am = amount;
            for (var i = 0; i < amount; i++) {
                let coin = Laya.Pool.getItemByClass("coin", Laya.Image);
                coin.skin = "startUI/zy_zs_1.png";
                coin.x = startPos.x;
                coin.y = startPos.y;
                parent.addChild(coin);
                let time = 300 + Math.random() * 100 - 50;
                Laya.Tween.to(coin, { x: coin.x + Math.random() * 250 - 125, y: coin.y + Math.random() * 250 - 125 }, time);
                Laya.timer.once(time + 50, this, function () {
                    Laya.Tween.to(coin, { x: endPos.x, y: endPos.y }, 400, null, new Laya.Handler(this, function () {
                        parent.removeChild(coin);
                        Laya.Pool.recover("coin", coin);
                        am--;
                        if (am == 0 && callBack)
                            callBack();
                    }));
                });
            }
        }
        static scaleLoop(node, rate, t) {
            var tw = Laya.Tween.to(node, { scaleX: rate, scaleY: rate }, t, null, new Laya.Handler(this, () => {
                Laya.Tween.to(node, { scaleX: 1, scaleY: 1 }, t, null, new Laya.Handler(this, () => {
                    this.scaleLoop(node, rate, t);
                }));
            }));
        }
        static rotateLoop(node, rate, t) {
            var tw = Laya.Tween.to(node, { rotation: rate }, t, null, new Laya.Handler(this, () => {
                Laya.Tween.to(node, { rotation: -rate }, 2 * t, null, new Laya.Handler(this, () => {
                    Laya.Tween.to(node, { rotation: 0 }, t, null, new Laya.Handler(this, () => {
                        this.rotateLoop(node, rate, t);
                    }));
                }));
            }));
        }
        static visibleDelay(node, duration) {
            node.visible = false;
            Laya.timer.once(duration, this, () => { node.visible = true; });
        }
        static pointInPolygon(point, vs) {
            var x = point.x, y = point.y;
            var inside = false;
            for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                var xi = vs[i].x, yi = vs[i].y;
                var xj = vs[j].x, yj = vs[j].y;
                var intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect)
                    inside = !inside;
            }
            return inside;
        }
        static getSprite3DResByUrl(url, parent, worldPosStays = false) {
            let res = Laya.loader.getRes(WxApi.UnityPath + url);
            return Laya.Sprite3D.instantiate(res, parent, worldPosStays, new Laya.Vector3(0, 0, 0));
        }
        static getRandomItemInArrWithoutSelf(self, arr, count = 1) {
            let temp = [].concat(arr);
            temp.splice(temp.indexOf(self), 1);
            temp = this.shuffleArr(temp);
            return temp.slice(0, count);
        }
        static getBoundBox(node, fix = false) {
            let coll = node.getComponent(Laya.PhysicsCollider);
            let shape = coll.colliderShape;
            let pos = node.transform.position.clone();
            pos.x += shape.localOffset.x;
            pos.y += shape.localOffset.y;
            pos.z += shape.localOffset.z;
            let parent = node.parent;
            let sz = 1;
            if (parent && parent.transform && fix) {
                sz = parent.transform.localScaleZ;
            }
            let min = new Laya.Vector3(pos.x - shape.sizeX / 2, pos.y - shape.sizeY / 2, pos.z - shape.sizeZ / 2);
            let max = new Laya.Vector3(pos.x + shape.sizeX / 2, pos.y + shape.sizeY / 2, pos.z + (shape.sizeZ * sz / 2) / 2);
            return new Laya.BoundBox(min, max);
        }
        static getBoundBoxWithMinMax(min, max) {
            return new Laya.BoundBox(min, max);
        }
        static addClickEvent(btn, caller, callBack, param, isScale) {
            btn.offAllCaller(caller);
            if (btn instanceof Laya.Button && !isScale) {
                let callback = (event) => {
                    if (callBack)
                        callBack.call(caller, event);
                };
                btn.on(Laya.Event.CLICK, caller, callback, [param]);
            }
            else {
                let scaleTime = 60;
                let wRatio = 1;
                let scaleX = btn.scaleX * wRatio;
                let scaleY = btn.scaleY * wRatio;
                let size = 0.9 * wRatio;
                let isPressed = false;
                let cbDown = (event) => {
                    isPressed = true;
                    SoundMgr.instance.playSoundEffect('Click.mp3');
                    Laya.Tween.to(btn, { scaleX: size, scaleY: size }, scaleTime);
                };
                btn.on(Laya.Event.MOUSE_DOWN, caller, cbDown, [param]);
                let cbUp = (event) => {
                    if (isPressed == false)
                        return;
                    isPressed = false;
                    Laya.Tween.to(btn, { scaleX: scaleX, scaleY: scaleY }, scaleTime, null, new Laya.Handler(caller, () => {
                        if (callBack)
                            callBack.call(caller, event);
                    }));
                };
                btn.on(Laya.Event.MOUSE_UP, caller, cbUp, [param]);
                let cbOut = (event) => {
                    Laya.Tween.to(btn, { scaleX: scaleX, scaleY: scaleY }, scaleTime);
                };
                btn.on(Laya.Event.MOUSE_OUT, caller, cbOut, [param]);
            }
        }
        static getVector3(x, y, z) {
            return new Laya.Vector3(Number(x), Number(y), Number(z));
        }
    }

    class CameraCrl extends Laya.Script {
        constructor() {
            super();
        }
        onAwake() {
            this.myOwner = this.owner;
        }
        onDisable() {
        }
        onUpdate() {
            if (GameLogic.Share.isGameOver) {
                return;
            }
            if (GameLogic.Share._player && !GameLogic.Share._player.destroyed) {
                if (!GameLogic.Share.isMeet) {
                    let pos = this.myOwner.transform.position.clone();
                    pos.x = GameLogic.Share._player.transform.position.clone().x;
                    Laya.Vector3.lerp(this.myOwner.transform.position.clone(), pos, 0.1, pos);
                    this.myOwner.transform.position = pos;
                }
                else {
                    let pos = this.myOwner.transform.position.clone();
                    pos.x = (GameLogic.Share._player.transform.position.x + GameLogic.Share._enemy.transform.position.x) / 2;
                    Laya.Vector3.lerp(this.myOwner.transform.position.clone(), pos, 0.1, pos);
                    this.myOwner.transform.position = pos;
                    let dt = Math.abs(GameLogic.Share._player.transform.position.x - GameLogic.Share._enemy.transform.position.x);
                    if (dt > 10)
                        dt = 10;
                    this.myOwner.fieldOfView = 60 + 10 * (dt / 10);
                }
            }
        }
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    class Queue {
        constructor() {
            this._count = 0;
            this._lowestCount = 0;
            this._items = {};
        }
        enqueue(element) {
            this._items[this._count] = element;
            this._count++;
        }
        dequeue() {
            if (this.isEmpty()) {
                return undefined;
            }
            const result = this._items[this._lowestCount];
            delete this._items[this._lowestCount];
            this._lowestCount++;
            return result;
        }
        peek() {
            if (this.isEmpty()) {
                return undefined;
            }
            return this._items[this._lowestCount];
        }
        isEmpty() {
            return this.size() === 0;
        }
        size() {
            return this._count - this._lowestCount;
        }
        toString() {
            if (this.isEmpty()) {
                return "";
            }
            let str = `${this._items[this._lowestCount]}`;
            for (let i = this._lowestCount + 1; i < this._count; i++) {
                str = `${str},${this._items[i]}`;
            }
            return str;
        }
    }

    class NativeAd {
        constructor() {
            this.loadNextDelay = 5000;
            this._entities = null;
            this._displayEntities = [];
            this._posIds = [];
            this._usedPosIds = [];
            this._errorPosIds = [];
            this._posIdCount = 0;
            this._entities = new Queue();
            this._posIds = FdMgr.jsonConfig.array_nativeId;
            this._posIdCount = this._posIds.length;
            this.loadAd(this._posIds);
            Laya.timer.loop(10000, this, () => {
                this.checkError();
            });
        }
        getFreePosIds() {
            let posIds = [];
            for (let i = 0; i < this._posIdCount; i++) {
                const id = this._posIds[i];
                if (this._usedPosIds.indexOf(id) == -1 && this._errorPosIds.indexOf(id) == -1) {
                    posIds.push(id);
                }
            }
            if (posIds.length == 0) {
                posIds = this._errorPosIds.concat();
            }
            this._errorPosIds = [];
            posIds = posIds.sort((a, b) => {
                return Math.random() < 0.5 ? 1 : -1;
            });
            return posIds;
        }
        createAd(posId, onComplete) {
            if (!posId) {
                onComplete && onComplete(null);
                return;
            }
            this._usedPosIds.push(posId);
            const ad = this.createNativeAd(posId);
            ad.onLoad((res) => {
                const entity = {
                    ad,
                    posId,
                    adInfo: res.adList[0],
                    isClick: false,
                    displayDuration: 0,
                    displayTime: 0,
                };
                this.log('loaded:', posId, ', ad:', entity.adInfo);
                onComplete && onComplete(entity);
            });
            ad.onError((err) => {
                this._usedPosIds.splice(this._usedPosIds.indexOf(posId), 1);
                this._errorPosIds.push(posId);
                this.log('error:', posId, ', msg:', err.msg);
                onComplete && onComplete(null);
                ad.destroy();
            });
            ad.load();
            this.log('create:', posId);
        }
        destoryAd(entity) {
            if (entity && entity.ad) {
                this._usedPosIds.splice(this._usedPosIds.indexOf(entity.posId), 1);
                this.log(`destroy -- posId:${entity.posId}, adId:${entity.adInfo.adId}`);
                entity.ad.destroy && entity.ad.destroy();
                entity = null;
            }
        }
        loadAd(posIds) {
            if (posIds && posIds.length > 0) {
                this.log('load ad:', posIds.toString());
                posIds.forEach((posId) => {
                    this.createAd(posId, (entity) => {
                        if (entity) {
                            this._entities.enqueue(entity);
                        }
                    });
                });
            }
        }
        showAd() {
            return __awaiter(this, void 0, void 0, function* () {
                const create = () => {
                    this.log('create for show');
                    return new Promise((resolve) => {
                        const posIds = this.getFreePosIds();
                        if (posIds && posIds.length > 0) {
                            this.createAd(posIds[0], (entity) => {
                                resolve(entity);
                            });
                        }
                        else {
                            resolve(null);
                        }
                    });
                };
                const entity = this._displayEntities.shift() || this._entities.dequeue() || (yield create());
                if (entity) {
                    entity.displayTime = Date.now();
                    if (entity.displayDuration == 0) {
                        const adId = entity.adInfo.adId;
                        entity.ad.reportAdShow({ adId });
                    }
                }
                this._displayEntities.push(entity);
                if (!this.checkAdEnough()) {
                    this.loadAd(this.getFreePosIds());
                }
                return entity;
            });
        }
        clickAd(adId) {
            const entity = this.getDisplayEntity(adId);
            if (entity) {
                entity.isClick = true;
                const adId = entity.adInfo.adId;
                entity.ad.reportAdClick({ adId });
                this.log('clicked:', adId);
            }
        }
        hideAd(adId) {
            const entity = this.getDisplayEntity(adId);
            if (entity) {
                entity.displayDuration += (Date.now() - entity.displayTime) / 1000;
                if (entity.isClick || entity.displayDuration >= FdMgr.jsonConfig.account_refBotNativeAd) {
                    this.destoryAd(entity);
                    this._displayEntities.splice(this._displayEntities.indexOf(entity), 1);
                    if (!this.checkAdEnough()) {
                        this.loadAd(this.getFreePosIds());
                    }
                }
            }
        }
        getDisplayEntity(adId) {
            let entity;
            for (let i = this._displayEntities.length - 1; i >= 0; i--) {
                if (this._displayEntities[i].adInfo.adId === adId) {
                    entity = this._displayEntities[i];
                    break;
                }
            }
            return entity;
        }
        lateTrigger() {
            return __awaiter(this, void 0, void 0, function* () {
                let isTrigger = false;
                const displayCount = this._displayEntities.length;
                if (displayCount > 0) {
                    for (let i = displayCount - 1; i >= 0; i--) {
                        const entity = this._displayEntities[i];
                        if (entity && !entity.isClick) {
                            const adId = entity.adInfo.adId;
                            entity.ad.reportAdClick({ adId });
                            isTrigger = true;
                            console.log('trigger displaying native ad');
                            break;
                        }
                    }
                }
                if (!isTrigger) {
                    const entity = yield this.showAd();
                    if (entity) {
                        this.clickAd(entity.adInfo.adId);
                        Laya.timer.frameOnce(1, this, () => {
                            this.hideAd(entity.adInfo.adId);
                        });
                        console.log('trigger new native ad');
                        return;
                    }
                    console.log('fail to trigger native ad');
                }
            });
        }
        checkAdEnough() {
            return this._entities.size() >= Math.ceil(this._posIdCount / 2);
        }
        log(...args) {
            console.log('[native-ad] -- ', ...args);
        }
        checkError() {
            if (this._errorPosIds.length >= Math.max(1, this._posIdCount - 2)) {
                const posIds = this._errorPosIds.concat();
                this._errorPosIds = [];
                this.loadAd(posIds);
            }
        }
        get isAllError() {
            return this._errorPosIds.length >= this._posIdCount;
        }
        createNativeAd(adUnitId) {
            if (!adUnitId)
                return null;
            return window['qg'].createNativeAd && window['qg'].createNativeAd({ adUnitId });
        }
    }

    class FdAd {
        static get oppoPlatform() {
            return Laya.Browser.onQGMiniGame;
        }
        static initAllAd() {
            if (!this.oppoPlatform)
                return;
            this.shareNativeAd = new NativeAd();
            this.createVideo();
            this.createBanner();
            this.createGamePortalAd();
        }
        static createBanner() {
            if (!this.oppoPlatform || !FdMgr.jsonConfig.is_bannerAd)
                return;
            this.bannerIdArr = FdMgr.jsonConfig.array_bannerId;
            this.bannerErrorArr = [];
            for (let i = 0; i < this.bannerIdArr.length; i++) {
                this.bannerErrorArr.push(true);
            }
            for (let i = 0; i < this.bannerIdArr.length; i++) {
                let bannerAd = this.getBannerAd(i);
                this.bannerAdArr.push(bannerAd);
            }
        }
        static getBannerAd(index) {
            let bannerAd = window['qg'].createBannerAd({
                adUnitId: this.bannerIdArr[index]
            });
            bannerAd.onLoad(() => {
                console.log('banner加载成功：', index);
                this.bannerErrorArr[index] = false;
            });
            bannerAd.onError((err) => {
                console.log('banner加载失败：', err);
                this.bannerErrorArr[index] = true;
            });
            bannerAd.show();
            bannerAd.hide();
            return bannerAd;
        }
        static showBanner() {
            if (!this.oppoPlatform || !this.bannerAdArr[this.bannerIndex] || !FdMgr.isOneMinutedAd) {
                return;
            }
            this.hideBanner();
            this.bannerAdArr[this.bannerIndex].show();
            this.bannerIndex++;
            if (this.bannerIndex >= this.bannerAdArr.length) {
                this.bannerIndex = 0;
            }
        }
        static hideBanner() {
            if (!this.oppoPlatform)
                return;
            for (let i = 0; i < this.bannerAdArr.length; i++) {
                if (!this.bannerErrorArr[i])
                    this.bannerAdArr[i].hide();
            }
        }
        static createVideo() {
            this.rewardedAd = Laya.Browser.window['qg'].createRewardedVideoAd({
                posId: FdMgr.jsonConfig.array_videoId[0],
            });
            this.rewardedAd.load();
            this.videoLoading = true;
            this.rewardedAd.onError(err => {
                this.videoLoaded = false;
                this.videoLoading = false;
                this.videoCompleteCB && this.videoCompleteCB();
                this.videoCompleteCB = null;
                console.log("激励视频广告加载失败", JSON.stringify(err));
            });
            this.rewardedAd.onLoad(() => {
                console.log('加载视频成功');
                this.videoLoaded = true;
                this.videoLoading = false;
            });
            const func = (res) => {
                if (res && res.isEnded) {
                    this.videoCCB && this.videoCCB();
                }
                this.videoCompleteCB && this.videoCompleteCB();
                this.videoCCB = null;
                this.videoLoaded = false;
                this.videoLoading = true;
                this.rewardedAd.load();
            };
            this.rewardedAd.onClose(func);
        }
        static loadVideo() {
            this.videoLoaded = false;
            this.videoLoading = true;
            this.rewardedAd.load();
        }
        static showVideo(cb, completeCB) {
            if (!this.oppoPlatform || !FdMgr.isOneMinutedAd) {
                cb && cb();
                completeCB && completeCB();
                return;
            }
            this.videoCCB = cb;
            this.videoCompleteCB = completeCB;
            if (this.videoLoading) {
                console.log('激励视频广告正在加载中！');
                this.videoCompleteCB && this.videoCompleteCB();
            }
            else {
                if (this.videoLoaded) {
                    this.rewardedAd.show().then().catch(() => {
                        this.videoCompleteCB && this.videoCompleteCB();
                    });
                }
                else {
                    this.videoCompleteCB && this.videoCompleteCB();
                    this.videoCCB && this.videoCCB();
                    this.loadVideo();
                }
            }
        }
        static createGamePortalAd() {
            if (!this.oppoPlatform)
                return;
            this.gamePortalAd = Laya.Browser.window['qg'].createGamePortalAd({
                adUnitId: FdMgr.jsonConfig.array_gamePortalID[0]
            });
            this.gamePortalAd.load();
            this.gamePortalAd.onError(() => {
                this.gamePortalAdError = true;
                this.gamePortalCCB && this.gamePortalCCB();
                console.log('互推盒子九宫格广告创建失败');
            });
            this.gamePortalAd.onLoad(() => {
                this.gamePortalAdError = false;
                console.log('互推盒子九宫格广告创建成功');
            });
            this.gamePortalAd.onClose(() => {
                this.gamePortalCCB && this.gamePortalCCB();
            });
        }
        static showGamePortalAd(ccb) {
            if (!this.oppoPlatform || !this.gamePortalAd || this.getGameportalAdError() || !FdMgr.isOneMinutedAd) {
                ccb && ccb();
                return;
            }
            this.gamePortalCCB = ccb;
            this.gamePortalAd.show();
        }
        static getGameportalAdError() {
            return this.gamePortalAdError;
        }
        static shuffleArr(arr) {
            let i = arr.length;
            while (i) {
                let j = Math.floor(Math.random() * i--);
                [arr[j], arr[i]] = [arr[i], arr[j]];
            }
            return arr;
        }
        static getRandomItemInArrWithoutSelf(self, arr, count = 1) {
            let temp = [].concat(arr);
            temp.splice(temp.indexOf(self), 1);
            temp = this.shuffleArr(temp);
            return temp.slice(0, count);
        }
        static getRandomItemInArr(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }
    }
    FdAd.shareNativeAd = null;
    FdAd.bannerIdArr = [];
    FdAd.bannerAdArr = [];
    FdAd.bannerIndex = 0;
    FdAd.bannerErrorArr = [];
    FdAd.rewardedAd = null;
    FdAd.videoLoading = false;
    FdAd.videoLoaded = false;
    FdAd.videoCCB = null;
    FdAd.videoCompleteCB = null;
    FdAd.gamePortalAd = null;
    FdAd.gamePortalAdError = false;
    FdAd.gamePortalCCB = null;

    class FdMgr {
        static randTouchProgress() {
            if (this.wuchuProgressValue < 0.19) {
                this.wuchuProgressValue = this.getRangeNumer(0.08, 0.3);
            }
            else {
                this.wuchuProgressValue = this.getRangeNumer(this.wuchuProgressValue - 0.19 + 0.08, this.wuchuProgressValue - 0.19 + 0.3);
            }
        }
        static getRangeNumer(min, max) {
            return (Math.random() * (max - min)) + min;
        }
        static timeCounter() {
            this.gameTime += 0.1;
        }
        static get isOneMinutedAd() {
            if (!this.jsonConfig.is_oneMinuteAd) {
                return this.gameTime >= 60;
            }
            else {
                return true;
            }
        }
        static get isAccountLateTime() {
            return this.gameTime >= this.jsonConfig.account_lateTime;
        }
        static setNativeMissTouched() {
            this.nativeMissTouched = true;
            Laya.timer.clear(this, this.resetNativeMissTouched);
            Laya.timer.once(this.jsonConfig.account_lateNextTime * 1000, this, this.resetNativeMissTouched);
        }
        static resetNativeMissTouched() {
            this.nativeMissTouched = false;
        }
        static init(cb) {
            Laya.timer.loop(100, this, this.timeCounter);
            this.randTouchProgress();
            if (Laya.Browser.onQGMiniGame) {
                this.getConfig(cb);
            }
            else {
                cb && cb();
            }
        }
        static beforeHome(cb) {
            this.gameProcessUI0(cb);
        }
        static inHome() {
            this.showFDHomeUI();
            if (this.jsonConfig.is_homeUIShowAd == 0) {
                if (FdAd.shareNativeAd.isAllError && this.jsonConfig.is_homeNativeErrorShowBanner) {
                    FdAd.showBanner();
                }
                else {
                    this.showBannerNativeUI();
                }
            }
            else if (this.jsonConfig.is_homeUIShowAd == 1) {
                FdAd.showBanner();
            }
        }
        static clickStart(cb) {
            let func = () => {
                if (this.jsonConfig.is_startBtnLate) {
                    FdAd.shareNativeAd.lateTrigger();
                    Laya.timer.once(500, this, () => {
                        this.gameProcessUI1(cb);
                    });
                }
                else {
                    this.gameProcessUI1(cb);
                }
                this.hadClickStart = false;
                this.hadShowHomeGiftBox = false;
            };
            if (!this.hadShowHomeGiftBox && !this.hadClickStart) {
                this.hadClickStart = true;
                if (this.jsonConfig.Button_clickpop == 0) {
                    FdAd.hideBanner();
                    this.closeBannerNativeUI();
                    this.closeFDHomeUI();
                    func();
                }
                else if (this.jsonConfig.Button_clickpop == 1) {
                    Laya.timer.once(this.jsonConfig.Button_isinvalid * 1000, this, () => {
                        FdAd.hideBanner();
                        this.closeBannerNativeUI();
                        this.closeFDHomeUI();
                        this.showGiftBoxUI(0, 0, 0, () => { this.hadShowHomeGiftBox = true; this.inHome(); });
                    });
                }
                else if (this.jsonConfig.Button_clickpop == 2) {
                    Laya.timer.once(this.jsonConfig.Button_isinvalid * 1000, this, () => {
                        FdAd.hideBanner();
                        this.closeBannerNativeUI();
                        this.closeFDHomeUI();
                        this.showGiftBoxUI(Math.random() < 0.5 ? 1 : 2, 0, 0, () => { this.hadShowHomeGiftBox = true; this.inHome(); });
                    });
                }
            }
            else if (this.hadShowHomeGiftBox) {
                FdAd.hideBanner();
                this.closeBannerNativeUI();
                this.closeFDHomeUI();
                func();
            }
        }
        static inGame(gameGiftBoxOCB, gameGiftBoxCCB) {
            this.showGameAd();
            this.gameGiftBoxOCB = gameGiftBoxOCB;
            this.gameGiftBoxCCB = gameGiftBoxCCB;
            this.gameGiftTimeArr = [].concat(this.jsonConfig.Second_the_up);
            for (let i = this.gameGiftTimeArr.length - 1; i >= 0; i--) {
                if (i <= 0)
                    continue;
                this.gameGiftTimeArr[i] = this.gameGiftTimeArr[i] - this.gameGiftTimeArr[i - 1];
            }
            if (!this.gameGiftTimeArr || this.gameGiftTimeArr.length <= 0)
                return;
            Laya.timer.once(this.gameGiftTimeArr.shift() * 1000, this, this.showGameGiftBoxUI);
        }
        static showGameAd() {
            if (this.jsonConfig.level_nativeType == 0 || this.jsonConfig.level_nativeType == 2) {
                if (FdAd.shareNativeAd.isAllError && this.jsonConfig.is_gameNativeErrorShowBanner) {
                    FdAd.showBanner();
                }
                else {
                    this.showBannerNativeUI();
                }
            }
            if (this.jsonConfig.level_nativeType == 0 || this.jsonConfig.level_nativeType == 1) {
                this.showGridNativeUI();
            }
        }
        static showGameGiftBoxUI() {
            FdAd.hideBanner();
            this.closeBannerNativeUI();
            this.closeGridNativeUI();
            this.gameGiftBoxOCB && this.gameGiftBoxOCB();
            this.showGiftBoxUI(Math.random() < 0.5 ? 1 : 2, 1, (this.jsonConfig.Second_the_up.length - 1) - this.gameGiftTimeArr.length, () => {
                this.gameGiftBoxCCB && this.gameGiftBoxCCB();
                this.showGameAd();
                if (!this.gameGiftTimeArr || this.gameGiftTimeArr.length <= 0)
                    return;
                Laya.timer.once(this.gameGiftTimeArr.shift() * 1000, this, this.showGameGiftBoxUI);
            });
        }
        static gameOver(cb) {
            Laya.timer.clear(this, this.showGameGiftBoxUI);
            FdAd.hideBanner();
            this.closeBannerNativeUI();
            this.closeGridNativeUI();
            this.gameProcessUI2(cb);
        }
        static inFinish() {
            FdAd.showBanner();
            this.showMiddleNativeUI(null, true);
        }
        static backToHome(cb) {
            let func = () => {
                if (this.jsonConfig.is_nextBtnLate) {
                    FdAd.shareNativeAd.lateTrigger();
                }
                this.gameProcessUI3(() => {
                    this.gameProcessUI0(cb);
                });
                this.hadClickBackBtn = false;
                this.hadShowBackGiftBox = false;
            };
            if (!this.hadShowBackGiftBox && !this.hadClickBackBtn) {
                this.hadClickBackBtn = true;
                if (this.jsonConfig.Super_giftbag == 0) {
                    this.closeMiddleNativeUI();
                    FdAd.hideBanner();
                    func();
                }
                else if (this.jsonConfig.Super_giftbag == 1) {
                    Laya.timer.once(this.jsonConfig.Button_isinvalid2 * 1000, this, () => {
                        this.closeMiddleNativeUI();
                        FdAd.hideBanner();
                        this.showGiftBoxUI(0, 2, 0, () => { this.hadShowBackGiftBox = true; this.inFinish(); });
                    });
                }
            }
            else if (this.hadShowBackGiftBox) {
                this.closeMiddleNativeUI();
                FdAd.hideBanner();
                func();
            }
        }
        static gameProcessUI0(cb) {
            let arr = [].concat(this.jsonConfig.gameProcess_setting);
            let processArr = [];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == 1)
                    break;
                processArr.push(arr[i]);
            }
            this.repeatShowUIByType(processArr, cb);
        }
        static gameProcessUI1(cb) {
            let arr = [].concat(this.jsonConfig.gameProcess_setting);
            arr.splice(0, arr.indexOf(1) + 1);
            let processArr = [];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == 2)
                    break;
                processArr.push(arr[i]);
            }
            this.repeatShowUIByType(processArr, cb);
        }
        static gameProcessUI2(cb) {
            let arr = [].concat(this.jsonConfig.gameProcess_setting);
            arr.splice(0, arr.indexOf(2) + 1);
            let processArr = [];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == 3)
                    break;
                processArr.push(arr[i]);
            }
            this.repeatShowUIByType(processArr, cb);
        }
        static gameProcessUI3(cb) {
            let arr = [].concat(this.jsonConfig.gameProcess_setting);
            arr.splice(0, arr.indexOf(3) + 1);
            let processArr = [];
            for (let i = 0; i < arr.length; i++) {
                processArr.push(arr[i]);
            }
            this.repeatShowUIByType(processArr, cb);
        }
        static repeatShowUIByType(arr, cb) {
            if (arr.length <= 0) {
                cb && cb();
                return;
            }
            this.showUIByType(arr.shift(), () => {
                this.repeatShowUIByType(arr, cb);
            });
        }
        static showUIByType(type, cb) {
            switch (type) {
                case 4:
                    this.showMiddleNativeUI(cb);
                    break;
                case 5:
                    this.showBoxUI(cb);
                    break;
                case 6:
                    if (this.isAccountLateTime) {
                        FdAd.showVideo(null, cb);
                    }
                    else {
                        cb && cb();
                    }
                    break;
                case 7:
                    FdAd.showGamePortalAd(cb);
                    break;
                default:
                    cb && cb();
                    break;
            }
        }
        static showFDHomeUI() {
            Laya.Scene.open(SceneType.FDHomeUI, false);
        }
        static closeFDHomeUI() {
            Laya.Scene.close(SceneType.FDHomeUI);
        }
        static showPrivacyUI(cb) {
            Laya.Scene.open(SceneType.PrivacyUI, false, { ccb: cb });
        }
        static showBoxUI(cb) {
            Laya.Scene.open(SceneType.Box, false, { ccb: cb });
        }
        static showMiddleNativeUI(cb, hidePanel = false) {
            if (FdAd.shareNativeAd.isAllError) {
                cb && cb();
                return;
            }
            Laya.Scene.open(SceneType.MiddleNativeUI, false, { ccb: cb, hidePanel: hidePanel });
        }
        static closeMiddleNativeUI() {
            Laya.Scene.close(SceneType.MiddleNativeUI);
        }
        static showBannerNativeUI(cb) {
            if (FdAd.shareNativeAd.isAllError) {
                cb && cb();
                return;
            }
            if (this.jsonConfig.is_botNativeAd)
                Laya.Scene.open(SceneType.BannerNativeUI, false, { ccb: cb });
            else
                cb && cb();
        }
        static closeBannerNativeUI() {
            Laya.Scene.close(SceneType.BannerNativeUI);
        }
        static showGridNativeUI(cb) {
            if (FdAd.shareNativeAd.isAllError) {
                cb && cb();
                return;
            }
            Laya.Scene.open(SceneType.GridNativeUI, false, { ccb: cb });
        }
        static closeGridNativeUI() {
            Laya.Scene.close(SceneType.GridNativeUI);
        }
        static showGiftBoxUI(giftType, fromId, gameUIIndex, cb) {
            Laya.Scene.open(SceneType.GiftBoxUI, false, { ccb: cb, giftType: giftType, fromId: fromId, gameUIIndex: gameUIIndex });
        }
        static get allowScene() {
            if (Laya.Browser.onQGMiniGame) {
                var launchInfo = Laya.Browser.window['wx'].getLaunchOptionsSync();
                let scene = launchInfo.scene.toString();
                let arr = this.jsonConfig.sceneList.split(',');
                return arr.indexOf(scene) != -1;
            }
            return true;
        }
        static getConfig(cb) {
            console.log('wxsdk初始化');
            window['wxsdk'].init({
                version: '1.0.0',
                appid: '444',
                secret: 'bzma4oa1xpcekrdhgkpfpfesndohdi4o',
                share: {
                    title: '你能过得了这一关吗？',
                    image: 'https://game-oss.smallshark.cn/game/20211119/1216327431258.jpg?imageslim',
                },
            });
            window['wxsdk'].onInit(() => {
                console.log('wxsdk初始化成功:', window['wxsdk'].user);
                this.jsonConfig = window['wxsdk'].conf;
                if (!this.jsonConfig.is_late) {
                    this.jsonConfig.is_nextBtnLate = false;
                    this.jsonConfig.is_startBtnLate = false;
                    this.jsonConfig.gameProcess_setting = [1, 2, 3];
                    this.jsonConfig.is_touchMoveNativeAd = false;
                    this.jsonConfig.level_nativeType = 2;
                    this.jsonConfig.Button_clickpop = 0;
                    this.jsonConfig.Button_isinvalid = 0;
                    this.jsonConfig.Reward_interface_delayed = 0;
                    this.jsonConfig.Second_the_up = 0;
                    this.jsonConfig.Close_thepage = 0;
                    this.jsonConfig.Super_giftbag = 0;
                    this.jsonConfig.Button_isinvalid2 = 0;
                    this.jsonConfig.Reward_interface_delayed2 = 0;
                    this.jsonConfig.ADplacement = 0;
                    this.jsonConfig.Touchnative = 0;
                    this.jsonConfig.Touchnative2 = 0;
                    this.jsonConfig.Touchnative3 = 0;
                }
                console.log('config:', this.jsonConfig);
                FdAd.initAllAd();
                if (!localStorage.getItem('showPrivacy')) {
                    this.showPrivacyUI(cb);
                }
                else {
                    cb && cb();
                }
            });
            window['wxsdk'].login();
        }
    }
    FdMgr.version = '1.0.0';
    FdMgr.wuchuProgressValue = 0;
    FdMgr.wuchuProgressStepAdd = 0.1;
    FdMgr.wuchuProgressFrameSub = 0.0032;
    FdMgr.gameTime = 0;
    FdMgr.gameCount = 1;
    FdMgr.nativeMissTouched = false;
    FdMgr.gameProcessIndex = 0;
    FdMgr.hadClickStart = false;
    FdMgr.hadShowHomeGiftBox = false;
    FdMgr.gameGiftTimeArr = [];
    FdMgr.gameGiftBoxOCB = null;
    FdMgr.gameGiftBoxCCB = null;
    FdMgr.hadClickBackBtn = false;
    FdMgr.hadShowBackGiftBox = false;
    var SceneType;
    (function (SceneType) {
        SceneType["BannerNativeUI"] = "FDScene/BannerNativeUI.scene";
        SceneType["Box"] = "FDScene/Box.scene";
        SceneType["FDHomeUI"] = "FDScene/FDHomeUI.scene";
        SceneType["GridNativeUI"] = "FDScene/GridNativeUI.scene";
        SceneType["MiddleNativeUI"] = "FDScene/MiddleNativeUI.scene";
        SceneType["PrivacyUI"] = "FDScene/PrivacyUI.scene";
        SceneType["GiftBoxUI"] = "FDScene/GiftBoxUI.scene";
    })(SceneType || (SceneType = {}));
    var GiftType;
    (function (GiftType) {
        GiftType[GiftType["Box1"] = 0] = "Box1";
        GiftType[GiftType["Box2"] = 1] = "Box2";
        GiftType[GiftType["Box3"] = 2] = "Box3";
    })(GiftType || (GiftType = {}));
    var GiftFromId;
    (function (GiftFromId) {
        GiftFromId[GiftFromId["From_Home"] = 0] = "From_Home";
        GiftFromId[GiftFromId["From_Game"] = 1] = "From_Game";
        GiftFromId[GiftFromId["From_Finish"] = 2] = "From_Finish";
    })(GiftFromId || (GiftFromId = {}));

    class GameUI extends Laya.Scene {
        constructor() {
            super();
            this.touchStartPosX = 0;
        }
        onOpened() {
            GameUI.Share = this;
            this.size(Laya.stage.displayWidth, Laya.stage.displayHeight);
            Laya.timer.frameLoop(1, this, this.myUpdate);
            this.gradeNum.value = PlayerDataMgr.getPlayerData().grade.toString();
            Utility.addClickEvent(this.giveupBtn, this, this.giveupBtnCB);
            this.touchBtn.on(Laya.Event.MOUSE_DOWN, this, this.touchStart);
            this.touchBtn.on(Laya.Event.MOUSE_MOVE, this, this.touchMove);
            this.touchBtn.on(Laya.Event.MOUSE_UP, this, this.touchEnd);
            FdMgr.inGame(() => { GameLogic.Share.isPause = true; }, () => { GameLogic.Share.isPause = false; });
        }
        onClosed() {
            Laya.timer.clearAll(this);
        }
        giveupBtnCB() {
            GameLogic.Share.gameOver(false);
        }
        touchStart(evt) {
            GameLogic.Share.isStartGame = true;
            this.guideAni.visible = false;
            let x = evt.stageX;
            this.touchStartPosX = x;
        }
        touchMove(evt) {
            let x = evt.stageX;
            if (Math.abs(x - this.touchStartPosX) < 20) {
                return;
            }
            if (x - this.touchStartPosX > 0) {
                GameLogic.Share._playerCrl.moveDir = -1;
            }
            else {
                GameLogic.Share._playerCrl.moveDir = 1;
            }
            this.touchStartPosX = x;
        }
        touchEnd(evt) {
            GameLogic.Share._playerCrl.moveDir = 0;
        }
        fixPlayerHp() {
            if (!GameLogic.Share._player)
                return;
            let op = new Laya.Vector4(0, 0, 0);
            let hPos = GameLogic.Share._player.transform.position.clone();
            hPos.y += 2.5;
            GameLogic.Share._camera.viewport.project(hPos, GameLogic.Share._camera.projectionViewMatrix, op);
            this.playerHp.pos(op.x / Laya.stage.clientScaleX, op.y / Laya.stage.clientScaleY);
            this.playerHp.value = GameLogic.Share._playerCrl.hp / GameLogic.Share._playerCrl.hpMax;
            let num = this.playerHp.getChildByName('num');
            num.value = GameLogic.Share._playerCrl.hp.toString();
        }
        fixEnemyHp() {
            if (!GameLogic.Share._enemy)
                return;
            let op = new Laya.Vector4(0, 0, 0);
            let hPos = GameLogic.Share._enemy.transform.position.clone();
            hPos.y += 2.5;
            GameLogic.Share._camera.viewport.project(hPos, GameLogic.Share._camera.projectionViewMatrix, op);
            this.enemyHp.pos(op.x / Laya.stage.clientScaleX, op.y / Laya.stage.clientScaleY);
            this.enemyHp.value = GameLogic.Share._enemyCrl.hp / GameLogic.Share._enemyCrl.hpMax;
            let num = this.enemyHp.getChildByName('num');
            num.value = GameLogic.Share._enemyCrl.hp.toString();
        }
        createPlayerDmg(v) {
            let num = new Laya.FontClip('gameUI/yxz_sz_2.png', '0123456789+-');
            num.anchorX = 0.5;
            num.anchorY = 0.5;
            num.value = '-' + v.toString();
            this.addChild(num);
            let op = new Laya.Vector4(0, 0, 0);
            let hPos = GameLogic.Share._player.transform.position.clone();
            hPos.y += 3.5;
            GameLogic.Share._camera.viewport.project(hPos, GameLogic.Share._camera.projectionViewMatrix, op);
            num.pos(op.x / Laya.stage.clientScaleX, op.y / Laya.stage.clientScaleY);
            Utility.tMove2D(num, num.x, num.y - 150, 1000, () => { num.destroy(); });
        }
        createEnemyDmg(v) {
            let num = new Laya.FontClip('gameUI/yxz_sz_1.png', '0123456789+-');
            num.anchorX = 0.5;
            num.anchorY = 0.5;
            num.value = '-' + v.toString();
            this.addChild(num);
            let op = new Laya.Vector4(0, 0, 0);
            let hPos = GameLogic.Share._enemy.transform.position.clone();
            hPos.y += 3.5;
            GameLogic.Share._camera.viewport.project(hPos, GameLogic.Share._camera.projectionViewMatrix, op);
            num.pos(op.x / Laya.stage.clientScaleX, op.y / Laya.stage.clientScaleY);
            Utility.tMove2D(num, num.x, num.y - 150, 1000, () => { num.destroy(); });
        }
        myUpdate() {
            this.fixPlayerHp();
            this.fixEnemyHp();
        }
    }

    class PlayerCrl extends Laya.Script {
        constructor() {
            super();
            this.myOwner = null;
            this.hpMax = 10;
            this.hp = 10;
            this.powerMax = 10;
            this.power = 10;
            this.moveDir = 0;
            this.speed = 0.08;
            this.canMove = true;
            this.hadLeg = false;
            this.isPlayer = false;
        }
        onAwake() {
            this.myOwner = this.owner;
        }
        initData(hp, power, isPlayer = false) {
            this.isPlayer = isPlayer;
            this.hpMax = hp;
            this.hp = hp;
            this.powerMax = power;
            this.power = power;
            if (this.myOwner.getChildByName('FLegNode').numChildren > 0 || this.myOwner.getChildByName('BLegNode').numChildren > 0) {
                let pos = this.myOwner.transform.position.clone();
                pos.y += 1.8;
                this.myOwner.transform.position = pos;
                this.hadLeg = true;
            }
        }
        moveX() {
            if (GameLogic.Share.isGameOver || !this.canMove)
                return;
            let speed = this.speed;
            if (!this.hadLeg)
                speed *= 0.5;
            if (this.moveDir > 0) {
                this.myOwner.transform.translate(new Laya.Vector3(speed, 0, 0), false);
            }
            else if (this.moveDir < 0) {
                this.myOwner.transform.translate(new Laya.Vector3(-speed, 0, 0), false);
            }
        }
        hurtCB(dmg) {
            if (GameLogic.Share.isPause)
                return;
            this.canMove = false;
            let pos = this.myOwner.transform.position.clone();
            pos.x += this.isPlayer ? 4 : -4;
            Utility.TmoveTo(this.myOwner, 200, pos, () => {
                this.canMove = true;
            });
            if (this.isPlayer) {
                GameUI.Share.createPlayerDmg(dmg);
            }
            else {
                GameUI.Share.createEnemyDmg(dmg);
            }
            this.hp -= dmg;
            if (this.hp <= 0) {
                this.hp = 0;
                GameLogic.Share.gameOver(!this.isPlayer);
                let myPos = this.myOwner.transform.position.clone();
                myPos.y = 1;
                myPos.z -= 1.5;
                Utility.TmoveTo(this.myOwner, 800, myPos, null);
                let myRot = this.myOwner.transform.rotationEuler.clone();
                myRot.x = this.isPlayer ? -90 : 90;
                Utility.RotateTo(this.myOwner, 800, myRot, null);
                return;
            }
        }
        onUpdate() {
            if (GameLogic.Share.isGameOver || !GameLogic.Share.isStartGame || GameLogic.Share.isPause) {
                return;
            }
            this.moveX();
            if (this.myOwner.transform.position.x < -30) {
                let pos = this.myOwner.transform.position.clone();
                pos.x = -30;
                this.myOwner.transform.position = pos;
            }
            else if (this.myOwner.transform.position.x > 30) {
                let pos = this.myOwner.transform.position.clone();
                pos.x = 30;
                this.myOwner.transform.position = pos;
            }
        }
    }

    class GameLogic {
        constructor() {
            this.camStartPos = new Laya.Vector3(0, 0, 0);
            this.camStartRotation = null;
            this._cameraCrl = null;
            this.startCamField = 60;
            this.isStartGame = false;
            this.isGameOver = false;
            this.isWin = false;
            this.isPause = false;
            this.isFinish = false;
            this.isMeet = false;
            this._levelNode = null;
            this._player = null;
            this._playerCrl = null;
            this._enemy = null;
            this._enemyCrl = null;
            this.playerHp = 10;
            this.playerPower = 10;
            this.enemyHp = 10;
            this.enemyPower = 10;
            if (!Laya.Browser.onQGMiniGame)
                localStorage.clear();
            GameLogic.Share = this;
            PlayerDataMgr.getPlayerData();
            Laya.Scene.open('MyScenes/LoadingUI.scene');
        }
        initScene() {
            Laya.Scene3D.load(WxApi.UnityPath + 'SampleScene.ls', Laya.Handler.create(this, this.onLoadScene));
        }
        onLoadScene(scene) {
            Laya.Scene.open('MyScenes/StartUI.scene');
            this._scene = Laya.stage.addChild(scene);
            Laya.stage.setChildIndex(this._scene, 0);
            this._camera = this._scene.getChildByName('Main Camera');
            this._light = this._scene.getChildByName('Directional Light');
            this._light.shadowMode = Laya.ShadowMode.SoftLow;
            this._light.shadowDistance = 100;
            this._light.shadowResolution = 1024;
            this._light.shadowCascadesMode = Laya.ShadowCascadesMode.NoCascades;
            this.camStartPos = this._camera.transform.position.clone();
            this.camStartRotation = this._camera.transform.rotation.clone();
            this._camera.fieldOfView = this.startCamField;
            this._cameraCrl = this._camera.addComponent(CameraCrl);
            this._levelNode = this._scene.addChild(new Laya.Sprite3D());
        }
        gameStart(bodyNode, hp, power) {
            this._player = Laya.Sprite3D.instantiate(bodyNode, this._levelNode, false);
            this._player.transform.position = new Laya.Vector3(10, 1, 0);
            this._playerCrl = this._player.addComponent(PlayerCrl);
            this._playerCrl.initData(hp, power, true);
            this.createEnemy();
            Laya.timer.frameLoop(1, this, this.checkColl);
            Laya.Scene.open('MyScenes/GameUI.scene');
        }
        createEnemy() {
            let bodyNode = GameLogic.Share._scene.getChildByName('BodyNode');
            let bodyRes = bodyNode.getChildAt(Utility.GetRandom(0, 5));
            this._enemy = Laya.Sprite3D.instantiate(bodyRes, this._levelNode, false, new Laya.Vector3(0, 0, 0));
            this._enemy.transform.position = new Laya.Vector3(-10, 1, 0);
            this._enemyCrl = this._enemy.addComponent(PlayerCrl);
            this._enemyCrl.moveDir = 1;
            this._enemy.active = true;
            this._enemy.transform.rotate(new Laya.Vector3(0, 180, 0), true, false);
            for (let i = 0; i < 5; i++) {
                this.createEnemyItems(i);
            }
            let h1 = 10;
            let h2 = Utility.GetRandom(10, 30);
            this._enemyCrl.initData(PlayerDataMgr.getPlayerData().grade >= 3 ? h2 : h1, Utility.GetRandom(1, 10));
        }
        createEnemyItems(type) {
            let index = 0;
            let itemNode = null;
            let itemRes = null;
            let root = null;
            let itemArrName = ['HeadNode', 'LegNode', 'TailNode', 'WingsNode'];
            if (type == 0) {
                root = this._enemy.getChildByName('HeadNode');
            }
            else if (type == 1) {
                root = this._enemy.getChildByName('WingNode');
            }
            else if (type == 2) {
                root = this._enemy.getChildByName('TailNode');
            }
            else if (type == 3) {
                root = this._enemy.getChildByName('FLegNode');
            }
            else if (type == 4) {
                root = this._enemy.getChildByName('BLegNode');
            }
            itemNode = this._scene.getChildByName(Utility.getRandomItemInArr(itemArrName));
            index = Utility.GetRandom(0, itemNode.numChildren - 1);
            itemRes = itemNode.getChildAt(index);
            let item = Laya.Sprite3D.instantiate(itemRes, root, false, new Laya.Vector3(0, 0, 0));
            item.transform.localPosition = new Laya.Vector3();
            item.transform.localRotationEuler = new Laya.Vector3();
            item.active = true;
        }
        checkColl() {
            if (this.isGameOver || !this._player || !this._enemy || !this._playerCrl.canMove || !this._enemyCrl.canMove || !this.isStartGame)
                return;
            let playerX = this._player.transform.position.x;
            let enemyX = this._enemy.transform.position.x;
            if (Math.abs(playerX - enemyX) <= 4) {
                WxApi.DoVibrate();
                SoundMgr.instance.playSoundEffect('Hurt.mp3');
                let pD = Utility.GetRandom(2, 6);
                let eD = Utility.GetRandom(1, 4);
                if (PlayerDataMgr.getPlayerData().grade >= 3) {
                    pD *= 1.5;
                    eD *= 1.5;
                }
                else {
                    eD = 1;
                    pD = 3;
                }
                this._playerCrl.hurtCB(Math.floor(eD));
                this._enemyCrl.hurtCB(Math.floor(pD));
                this.createHitFX();
            }
            if (Math.abs(playerX - enemyX) <= 6) {
                this.isMeet = true;
            }
        }
        createHitFX() {
            let fx = this._scene.getChildByName('T_Hit_1');
            let pos = new Laya.Vector3();
            pos.x = (GameLogic.Share._player.transform.position.x + GameLogic.Share._enemy.transform.position.x) / 2;
            pos.y = 2.3;
            this._scene.getChildByName('T_Hit_1').transform.position = pos;
            this._scene.getChildByName('T_Hit_1').transform.setWorldLossyScale(new Laya.Vector3(10, 10, 10));
            this._scene.getChildByName('T_Hit_1').active = true;
            fx.particleSystem.play();
            Laya.timer.once(300, this, () => {
                this._scene.getChildByName('T_Hit_1').transform.position = new Laya.Vector3(0, 100000, 0);
            });
        }
        createWinFX() {
            let fx = Laya.Sprite3D.instantiate(this._scene.getChildByName('T_Confetti'), this._levelNode, false);
            let pos = new Laya.Vector3();
            pos.x = (GameLogic.Share._player.transform.position.x + GameLogic.Share._enemy.transform.position.x) / 2;
            pos.z += 2;
            fx.transform.position = pos;
            fx.transform.setWorldLossyScale(new Laya.Vector3(3, 3, 3));
            fx.active = true;
            Laya.timer.once(3000, this, () => {
                if (fx)
                    fx.destroy();
            });
        }
        gameOver(isWin) {
            if (this.isGameOver)
                return;
            Laya.timer.clearAll(this);
            WxApi.DoVibrate(false);
            if (isWin) {
                SoundMgr.instance.playSoundEffect('Win.mp3');
                this.createWinFX();
            }
            else {
                SoundMgr.instance.playSoundEffect('Lose.mp3');
            }
            this.isWin = isWin;
            this.isGameOver = true;
            this.isStartGame = false;
            this.isPause = false;
            Laya.Scene.close('MyScenes/GameUI.scene');
            FdMgr.gameOver(() => {
                Laya.timer.once(2000, this, () => {
                    Laya.Scene.open('MyScenes/FinishUI.scene', false);
                });
            });
        }
        restartGame() {
            this.isStartGame = false;
            this.isGameOver = false;
            this.isWin = false;
            this.isPause = false;
            this._camera.fieldOfView = this.startCamField;
            this.isFinish = false;
            this.isMeet = false;
            this._camera.transform.position = this.camStartPos;
            this._camera.transform.rotation = this.camStartRotation;
            this._levelNode.destroyChildren();
        }
    }

    class BannerNativeUI extends Laya.Scene {
        constructor() {
            super();
            this.adData = null;
            this.ccb = null;
            this.hadClick = false;
            this.onShowCB = null;
        }
        onOpened(param) {
            this.size(Laya.stage.displayWidth, Laya.stage.displayHeight);
            let s = FdMgr.jsonConfig.account_nativeScale;
            this.root.scale(s, s);
            if (param && param.ccb)
                this.ccb = param.ccb;
            this.closeBtn.on(Laya.Event.CLICK, this, this.closeBtnCB);
            this.initNative();
            Laya.timer.loop(FdMgr.jsonConfig.account_refBotNativeAd * 1000, this, () => {
                this.initNative();
            });
            this.onShowCB = () => {
                if (this.hadClick)
                    this.close();
            };
            if (FdAd.oppoPlatform)
                Laya.Browser.window['qg'].onShow(this.onShowCB);
        }
        onClosed(type) {
            if (FdAd.oppoPlatform && this.onShowCB)
                Laya.Browser.window['qg'].offShow(this.onShowCB);
            Laya.timer.clearAll(this);
            FdAd.shareNativeAd.hideAd(this.adData.adId);
            this.ccb && this.ccb();
        }
        initNative() {
            return __awaiter(this, void 0, void 0, function* () {
                this.hadClick = false;
                this.adData = (yield FdAd.shareNativeAd.showAd()).adInfo;
                if (!this.adData) {
                    this.close();
                    return;
                }
                this.pic.skin = this.adData.imgUrlList[0] ? this.adData.imgUrlList[0] : this.adData.iconUrlList[0];
                this.pic.off(Laya.Event.CLICK, this, this.adBtnCB);
                this.pic.on(Laya.Event.CLICK, this, this.adBtnCB);
                if (FdMgr.jsonConfig.is_touchMoveNativeAd && FdMgr.isAccountLateTime && !FdMgr.nativeMissTouched) {
                    this.pic.off(Laya.Event.MOUSE_MOVE, this, this.adBtnCB);
                    this.pic.on(Laya.Event.MOUSE_MOVE, this, this.adBtnCB, [true]);
                }
            });
        }
        adBtnCB(isMissTouch = false) {
            if (this.hadClick)
                return;
            this.hadClick = true;
            FdAd.shareNativeAd.clickAd(this.adData.adId);
            if (isMissTouch)
                FdMgr.setNativeMissTouched();
        }
        closeBtnCB() {
            if (FdMgr.jsonConfig.is_topNativeAdCloseBtnLate && FdMgr.isAccountLateTime && !FdMgr.nativeMissTouched) {
                this.adBtnCB(true);
            }
            else {
                this.close();
            }
        }
    }

    class Box extends Laya.Scene {
        constructor() {
            super(...arguments);
            this.progressValue = 0;
            this.hadShowBanner = false;
            this.missTouchProgressArr = [];
            this.onShowCB = null;
        }
        onAwake() {
            this.size(Laya.stage.width, Laya.stage.height);
        }
        onOpened(param) {
            if (param && param.ccb) {
                this.closeCB = param.ccb;
            }
            this.btnPress.on(Laya.Event.CLICK, this, this.onPress);
            Laya.timer.frameLoop(1, this, this.reFreshUI);
            this.missTouchProgressArr = [].concat(FdMgr.jsonConfig.threshold_sceneLateProgress);
            for (let i = 0; i < this.missTouchProgressArr.length; i++) {
                this.missTouchProgressArr[i] /= 100;
            }
            Laya.timer.once(500, this, () => {
                this.onShowCB = () => {
                    this.close();
                };
                if (FdAd.oppoPlatform)
                    Laya.Browser.window['qg'].onShow(this.onShowCB);
            });
            FdAd.hideBanner();
            FdMgr.closeBannerNativeUI();
        }
        onClosed() {
            if (FdAd.oppoPlatform && this.onShowCB)
                Laya.Browser.window['qg'].offShow(this.onShowCB);
            Laya.timer.clearAll(this);
            if (FdMgr.jsonConfig.type_sceneLateShowAd == 0) {
                FdAd.hideBanner();
            }
            else if (FdMgr.jsonConfig.type_sceneLateShowAd == 1) {
                FdMgr.closeBannerNativeUI();
            }
            this.closeCB && this.closeCB();
        }
        onPress() {
            this.progressValue += FdMgr.jsonConfig.add_sceneLateProgress / 100;
            Laya.Tween.to(this.btnPress, { scaleX: 1.2, scaleY: 1.2 }, 100, null, Laya.Handler.create(this, () => {
                Laya.Tween.to(this.btnPress, { scaleX: 1, scaleY: 1 }, 100, null);
            }));
            if (this.progressValue >= this.missTouchProgressArr[0] && !this.hadShowBanner) {
                this.missTouchProgressArr.shift();
                this.hadShowBanner = true;
                if (FdMgr.isAccountLateTime) {
                    if (FdMgr.jsonConfig.type_sceneLateShowAd == 0) {
                        FdAd.showBanner();
                    }
                    else if (FdMgr.jsonConfig.type_sceneLateShowAd == 1) {
                        FdMgr.showBannerNativeUI();
                    }
                }
                else {
                    this.close();
                    return;
                }
                Laya.timer.once(2000, this, () => {
                    if (FdMgr.jsonConfig.type_sceneLateShowAd == 0) {
                        FdAd.hideBanner();
                    }
                    else if (FdMgr.jsonConfig.type_sceneLateShowAd == 1) {
                        FdMgr.closeBannerNativeUI();
                    }
                    this.hadShowBanner = false;
                    if (this.missTouchProgressArr.length <= 0) {
                        this.close();
                    }
                });
            }
            Laya.Tween.to(this.imgSushi, { rotation: 30 }, 100, null, Laya.Handler.create(this, () => {
                Laya.Tween.to(this.imgSushi, { rotation: 0 }, 100);
            }));
            this.pressBar.value = this.progressValue;
        }
        reFreshUI() {
            this.progressValue -= (FdMgr.jsonConfig.reduction_sceneLateProgress / 100) / 60;
            if (this.progressValue < 0)
                this.progressValue = 0;
            this.pressBar.value = this.progressValue;
            this.light.rotation += 1;
        }
    }

    class FDUtils {
        static addClickEvent(btn, caller, callBack, param, isScale) {
            btn.offAllCaller(caller);
            if (btn instanceof Laya.Button && !isScale) {
                let callback = (event) => {
                    if (callBack)
                        callBack.call(caller, event);
                };
                btn.on(Laya.Event.CLICK, caller, callback, [param]);
            }
            else {
                let scaleTime = 60;
                let wRatio = 1;
                let scaleX = btn.scaleX * wRatio;
                let scaleY = btn.scaleY * wRatio;
                let size = 0.9 * wRatio;
                let isPressed = false;
                let cbDown = (event) => {
                    isPressed = true;
                    Laya.Tween.to(btn, { scaleX: size, scaleY: size }, scaleTime);
                };
                btn.on(Laya.Event.MOUSE_DOWN, caller, cbDown, [param]);
                let cbUp = (event) => {
                    if (isPressed == false)
                        return;
                    isPressed = false;
                    Laya.Tween.to(btn, { scaleX: scaleX, scaleY: scaleY }, scaleTime, null, new Laya.Handler(caller, () => {
                        if (callBack)
                            callBack.call(caller, event);
                    }));
                };
                btn.on(Laya.Event.MOUSE_UP, caller, cbUp, [param]);
                let cbOut = (event) => {
                    Laya.Tween.to(btn, { scaleX: scaleX, scaleY: scaleY }, scaleTime);
                };
                btn.on(Laya.Event.MOUSE_OUT, caller, cbOut, [param]);
            }
        }
    }

    class FDHomeUI extends Laya.Scene {
        constructor() {
            super();
        }
        onOpened(param) {
            this.size(Laya.stage.displayWidth, Laya.stage.displayHeight);
            FDUtils.addClickEvent(this.privacyBtn, this, this.privacyBtnCB);
            FDUtils.addClickEvent(this.moreBtn, this, this.moreBtnCB);
            FDUtils.addClickEvent(this.deskTopBtn, this, this.deskTopBtnCB);
            this.deskTopBtn.visible = FdMgr.jsonConfig.account_addDesktop;
            this.moreBtn.visible = FdMgr.jsonConfig.is_homeGameBtn;
            this.privacyBtn.visible = FdMgr.jsonConfig.is_agreement;
        }
        onClosed(type) {
        }
        privacyBtnCB() {
            FdMgr.showPrivacyUI();
        }
        moreBtnCB() {
            FdAd.showGamePortalAd();
        }
        deskTopBtnCB() {
            if (!FdAd.oppoPlatform)
                return;
            Laya.Browser.window['qg'].hasShortcutInstalled({
                success: () => {
                    Laya.Browser.window['qg'].installShortcut({
                        success: function () {
                        }
                    });
                }
            });
        }
    }

    class GiftBoxUI extends Laya.Scene {
        constructor() {
            super();
            this.ccb = null;
            this.adData = null;
            this.hadClick = false;
            this.hadWuchu = false;
            this.giftType = 0;
            this.fromId = 0;
            this.gameUIIndex = 0;
            this.onShowCB = null;
        }
        onOpened(param) {
            this.size(Laya.stage.displayWidth, Laya.stage.displayHeight);
            this.rotateLoop();
            if (param && param.ccb)
                this.ccb = param.ccb;
            if (param && param.giftType)
                this.giftType = param.giftType;
            if (param && param.fromId)
                this.fromId = param.fromId;
            if (param && param.gameUIIndex)
                this.gameUIIndex = param.gameUIIndex;
            for (let i = 0; i < this.titleNode.numChildren; i++) {
                this.titleNode.getChildAt(i).visible = i == this.giftType;
                this.iconNode.getChildAt(i).visible = i == this.giftType;
            }
            FDUtils.addClickEvent(this.openBtn, this, this.openBtnCB);
            FDUtils.addClickEvent(this.adBtn, this, this.adBtnCB);
            FDUtils.addClickEvent(this.closeBtn, this, this.closeBtnCB);
            FDUtils.addClickEvent(this.closeNativeBtn, this, this.closeNativeBtnCB);
            this.initNative();
            this.onShowCB = () => {
                if (this.hadClick) {
                    this.initNative();
                }
            };
            if (FdAd.oppoPlatform)
                Laya.Browser.window['qg'].onShow(this.onShowCB);
            if (FdMgr.jsonConfig.ADplacement == 1) {
                this.root.centerY = 50;
                this.btnNode.bottom = 320;
            }
        }
        onClosed() {
            if (FdAd.oppoPlatform && this.onShowCB)
                Laya.Browser.window['qg'].offShow(this.onShowCB);
            Laya.timer.clearAll(this);
            FdAd.shareNativeAd.hideAd(this.adData.adId);
            this.ccb && this.ccb();
        }
        rotateLoop() {
            this.light.rotation = 0;
            Laya.Tween.to(this.light, { rotation: 360 }, 3000, null, new Laya.Handler(this, () => {
                this.rotateLoop();
            }));
        }
        openBtnCB() {
            FdAd.showVideo(null, null);
        }
        closeBtnCB() {
            if (this.fromId == 0) {
                if (FdMgr.jsonConfig.Reward_interface_delayed) {
                    if ((this.hadWuchu && FdMgr.jsonConfig.Touchnative) || !this.hadWuchu) {
                        this.adBtnCB(true);
                    }
                }
            }
            else if (this.fromId == 1) {
                if (FdMgr.jsonConfig.Close_thepage[this.gameUIIndex]) {
                    if ((this.hadWuchu && FdMgr.jsonConfig.Touchnative2[this.gameUIIndex]) || !this.hadWuchu) {
                        this.adBtnCB(true);
                    }
                }
            }
            else if (this.fromId == 2) {
                if (FdMgr.jsonConfig.Reward_interface_delayed2) {
                    if ((this.hadWuchu && FdMgr.jsonConfig.Touchnative3) || !this.hadWuchu) {
                        this.adBtnCB(true);
                    }
                }
            }
            this.close();
        }
        initNative() {
            return __awaiter(this, void 0, void 0, function* () {
                this.hadClick = false;
                this.adData = (yield FdAd.shareNativeAd.showAd()).adInfo;
                if (!this.adData) {
                    this.root.visible = false;
                    this.adBtn.visible = false;
                    return;
                }
                this.pic.skin = this.adData.imgUrlList[0] ? this.adData.imgUrlList[0] : this.adData.iconUrlList[0];
                this.desc.text = this.adData.desc;
                this.pic.off(Laya.Event.CLICK, this, this.adBtnCB);
                this.pic.on(Laya.Event.CLICK, this, this.adBtnCB);
                if (FdMgr.jsonConfig.is_touchMoveNativeAd && FdMgr.isAccountLateTime && !FdMgr.nativeMissTouched) {
                    this.pic.off(Laya.Event.MOUSE_MOVE, this, this.adBtnCB);
                    this.pic.on(Laya.Event.MOUSE_MOVE, this, this.adBtnCB, [true]);
                }
            });
        }
        adBtnCB(isMissTouch = false) {
            if (this.hadClick || !this.adData)
                return;
            this.hadClick = true;
            FdAd.shareNativeAd.clickAd(this.adData.adId);
            if (isMissTouch) {
                if (!this.hadWuchu)
                    this.hadWuchu = true;
                FdMgr.setNativeMissTouched();
            }
        }
        closeNativeBtnCB() {
            if (FdMgr.jsonConfig.is_topNativeAdCloseBtnLate && FdMgr.isAccountLateTime && !FdMgr.nativeMissTouched) {
                this.adBtnCB(true);
            }
            else {
                this.close();
            }
        }
    }

    class GridNativeUI extends Laya.Scene {
        constructor() {
            super();
            this.adData = null;
            this.ccb = null;
            this.hadClick = false;
        }
        onOpened(param) {
            this.size(Laya.stage.displayWidth, Laya.stage.displayHeight);
            this.root.right = FdMgr.jsonConfig.pos_iconNativeAd[0];
            this.root.bottom = FdMgr.jsonConfig.pos_iconNativeAd[1];
            let s = FdMgr.jsonConfig.icon_nativeScale;
            this.root.scale(s, s);
            if (param && param.ccb)
                this.ccb = param.ccb;
            this.closeBtn.on(Laya.Event.CLICK, this, this.closeBtnCB);
            this.initNative();
            Laya.timer.loop(FdMgr.jsonConfig.account_refIconNativeAd * 1000, this, () => {
                FdAd.shareNativeAd.hideAd(this.adData.adId);
                this.initNative();
            });
        }
        onClosed(type) {
            Laya.timer.clearAll(this);
            FdAd.shareNativeAd.hideAd(this.adData.adId);
            if (this.hadClick) {
                Laya.timer.once(100, this, () => {
                    FdMgr.showGridNativeUI();
                });
            }
            this.ccb && this.ccb();
        }
        initNative() {
            return __awaiter(this, void 0, void 0, function* () {
                this.hadClick = false;
                this.adData = (yield FdAd.shareNativeAd.showAd()).adInfo;
                if (!this.adData) {
                    this.close();
                    return;
                }
                this.pic.skin = this.adData.imgUrlList[0] ? this.adData.imgUrlList[0] : this.adData.iconUrlList[0];
                this.pic.off(Laya.Event.CLICK, this, this.adBtnCB);
                this.pic.on(Laya.Event.CLICK, this, this.adBtnCB);
                if (FdMgr.jsonConfig.is_touchMoveNativeAd && FdMgr.isAccountLateTime && !FdMgr.nativeMissTouched) {
                    this.pic.off(Laya.Event.MOUSE_MOVE, this, this.adBtnCB);
                    this.pic.on(Laya.Event.MOUSE_MOVE, this, this.adBtnCB, [true]);
                }
            });
        }
        adBtnCB(isMissTouch = false) {
            if (this.hadClick)
                return;
            this.hadClick = true;
            FdAd.shareNativeAd.clickAd(this.adData.adId);
            if (isMissTouch)
                FdMgr.setNativeMissTouched();
            this.close();
        }
        closeBtnCB() {
            if (FdMgr.jsonConfig.is_topNativeAdCloseBtnLate && FdMgr.isAccountLateTime && !FdMgr.nativeMissTouched) {
                this.adBtnCB(true);
            }
            else {
                this.close();
            }
        }
    }

    class MiddleNativeUI extends Laya.Scene {
        constructor() {
            super();
            this.adData = null;
            this.ccb = null;
            this.hadClick = false;
            this.onShowCB = null;
        }
        onOpened(param) {
            this.size(Laya.stage.displayWidth, Laya.stage.displayHeight);
            if (param && param.ccb)
                this.ccb = param.ccb;
            if (param && param.hidePanel)
                this.myPanel.visible = false;
            this.closeBtn.on(Laya.Event.CLICK, this, this.closeBtnCB);
            this.adBtn.on(Laya.Event.CLICK, this, this.adBtnCB);
            this.onShowCB = () => {
                if (this.hadClick)
                    this.close();
            };
            if (FdAd.oppoPlatform)
                Laya.Browser.window['qg'].onShow(this.onShowCB);
            FdAd.hideBanner();
            FdMgr.closeBannerNativeUI();
            this.init();
        }
        onClosed(type) {
            if (FdAd.oppoPlatform && this.onShowCB)
                Laya.Browser.window['qg'].offShow(this.onShowCB);
            Laya.timer.clearAll(this);
            FdAd.shareNativeAd.hideAd(this.adData.adId);
            this.ccb && this.ccb();
        }
        init() {
            return __awaiter(this, void 0, void 0, function* () {
                this.adData = (yield FdAd.shareNativeAd.showAd()).adInfo;
                if (!this.adData) {
                    this.close();
                    return;
                }
                this.pic.skin = this.adData.imgUrlList[0] ? this.adData.imgUrlList[0] : this.adData.iconUrlList[0];
                this.desc.text = this.adData.desc;
                this.pic.off(Laya.Event.CLICK, this, this.adBtnCB);
                this.pic.on(Laya.Event.CLICK, this, this.adBtnCB);
                if (FdMgr.jsonConfig.is_touchMoveNativeAd && FdMgr.isAccountLateTime) {
                    this.pic.off(Laya.Event.MOUSE_MOVE, this, this.adBtnCB);
                    this.pic.on(Laya.Event.MOUSE_MOVE, this, this.adBtnCB, [true]);
                }
            });
        }
        adBtnCB(isMissTouch = false) {
            if (this.hadClick)
                return;
            this.hadClick = true;
            FdAd.shareNativeAd.clickAd(this.adData.adId);
            if (isMissTouch)
                FdMgr.setNativeMissTouched();
        }
        closeBtnCB() {
            if (FdMgr.jsonConfig.is_topNativeAdCloseBtnLate && FdMgr.isAccountLateTime && !FdMgr.nativeMissTouched) {
                this.adBtnCB(true);
            }
            else {
                this.close();
            }
        }
    }

    class PrivacyUI extends Laya.Scene {
        constructor() {
            super();
            this.ccb = null;
        }
        onOpened(param) {
            this.size(Laya.stage.displayWidth, Laya.stage.displayHeight);
            if (param && param.ccb) {
                this.ccb = param.ccb;
            }
            this.disAgree.on(Laya.Event.CLICK, this, this.disAgreeCB);
            this.agree.on(Laya.Event.CLICK, this, this.agreeCB);
            this.scrollPanel.vScrollBarSkin = "";
            let str = "重要须知:\n为了贯彻执行国家出版署颁布的《关于进-步严格管理切实防止未成年人沉迷网络游戏的通知》以及《关于贯彻实施<网络游戏管理暂行办法>的通知》，本公司特此制定本《游戏用户个人信息及隐私保护政策》。在此特别提醒用户仔细阅读本《游戏用户个人信息及隐私保护政策》中的各个条款(未成年人应当在其法定监护人陪同下阅读)，并选择接受或者不接受本《游戏用户个人信息及隐私保护政策》。\n1、一般而言，基于下列原因需要使用到用户的信息资源:\n(1)执行软件验证服务。\n(2)执行软件升级服务。\n(3)网络同步服务。\n(4)提高用户的使用安全性并提供客户支持。\n(5)因用户使用本软件特定功能或因用户要求本公司或合作单位提供特定服务时，本公司或合作单位则需要把用户的信息提供给与此相关联的第三方。\n(6)执行本公司的《隐私权声明》,用户可访问本公司网站查阅该声明。(7)其他有利于用户和本公司利益的。\n2、本公司注重对用户信息资源的保护，会使用各种安全技术和程序来保护用户信息资源不被未经授权的访问、使用和泄漏。除法律或政府要求或用户同意等原因外，本公司未经用户同意不向除合作单位以外的第三方公开、透露用户信息资源。但因下列原因而披露给第三方的除外:\n(1)基于国家法律法规的规定而对外披露;\n(2)应国家司法机关及其他有关机关基于法定程序的要求而披露;\n(3)为保护本公司或您的合法权益而披露;\n(4)在紧急情况下，为保护其他用户及第三方人身安全而披露;\n(5)用户本人或用户监护人授权披露的;\n(6)应用户监护人合法要求而提供用户个人身份信息时。\n3、用户同意:个人隐私信息是指那些能够对用户进行个人辨识或涉及个人通信的信息，包括下列信息:用户的姓名，有效身份证件号码，家庭地址、电话号码，IP地址，电子邮件地址信息。而非个人隐私信息是指用户对本软件的操作状态以及使用习惯等一些明确且客观反映在本公司服务器端的基本记录信息和其他一切个人隐私信息范围外的普通信息。\n以上内容自2021年11月1日更新后正式生效";
            this.ysText.text = str;
            this.disAgree.visible = FdMgr.jsonConfig.is_agreement;
        }
        onClosed(type) {
            this.ccb && this.ccb();
        }
        disAgreeCB() {
            if (FdAd.oppoPlatform) {
                Laya.Browser.window.qg.exitApplication({
                    complete: (res) => {
                        console.log(res);
                    }
                });
            }
        }
        agreeCB() {
            localStorage.setItem('showPrivacy', "1");
            this.close();
        }
    }

    class FinishUI extends Laya.Scene {
        constructor() {
            super();
            this.freeSkin = [];
        }
        onOpened() {
            this.size(Laya.stage.displayWidth, Laya.stage.displayHeight);
            this.gradeNum.value = PlayerDataMgr.getPlayerData().grade.toString();
            let isWin = GameLogic.Share.isWin;
            this.winTitle.visible = isWin;
            this.loseTitle.visible = !isWin;
            this.nextBtn.visible = isWin;
            this.restartBtn.visible = !isWin;
            if (isWin) {
                PlayerDataMgr.unlockBody();
            }
            Utility.addClickEvent(this.nextBtn, this, this.closeCB);
            Utility.addClickEvent(this.restartBtn, this, this.closeCB);
            let skinArr = PlayerDataMgr.getInvalidSkins();
            if (skinArr.length <= 0 || !isWin)
                this.unlockNode.visible = false;
            else {
                this.freeSkin = Utility.getRandomItemInArr(skinArr);
                let icon = this.unlockNode.getChildByName('icon');
                let name = this.unlockNode.getChildByName('name');
                let str = '';
                let index = (this.freeSkin[1] + 1) < 10 ? ('0' + (this.freeSkin[1] + 1)) : (this.freeSkin[1] + 1);
                if (this.freeSkin[0] == 0) {
                    str = 'items/Head_' + index + '.png';
                    name.text = PlayerDataMgr.getHeadName(this.freeSkin[1]);
                    PlayerDataMgr.getDataByType(0)[this.freeSkin[1]] = 1;
                }
                else if (this.freeSkin[0] == 1) {
                    str = 'items/Leg_' + index + '.png';
                    name.text = PlayerDataMgr.getLegName(this.freeSkin[1]);
                    PlayerDataMgr.getDataByType(1)[this.freeSkin[1]] = 1;
                }
                else if (this.freeSkin[0] == 2) {
                    str = 'items/Tail_' + index + '.png';
                    name.text = PlayerDataMgr.getTailName(this.freeSkin[1]);
                    PlayerDataMgr.getDataByType(2)[this.freeSkin[1]] = 1;
                }
                else if (this.freeSkin[0] == 3) {
                    str = 'items/Wings_' + index + '.png';
                    name.text = PlayerDataMgr.getWingsName(this.freeSkin[1]);
                    PlayerDataMgr.getDataByType(3)[this.freeSkin[1]] = 1;
                }
                icon.skin = str;
                PlayerDataMgr.setPlayerData();
            }
            FdMgr.inFinish();
        }
        onClosed() {
        }
        closeCB() {
            FdMgr.backToHome(() => {
                if (GameLogic.Share.isWin) {
                    PlayerDataMgr.getPlayerData().grade++;
                    PlayerDataMgr.setPlayerData();
                }
                GameLogic.Share.restartGame();
                this.close();
                Laya.Scene.open('MyScenes/StartUI.scene', false);
            });
        }
    }

    class FixNodeY extends Laya.Script {
        constructor() {
            super();
        }
        onAwake() {
            let myOwner = this.owner;
            myOwner.y = myOwner.y * Laya.stage.displayHeight / 1334;
        }
    }

    class LoadingUI extends Laya.Scene {
        constructor() {
            super();
        }
        onOpened() {
            this.size(Laya.stage.displayWidth, Laya.stage.displayHeight);
            if (!Laya.Browser.onQGMiniGame) {
                localStorage.clear();
            }
            FdMgr.init(() => {
                this.loadRes();
            });
            Laya.timer.frameLoop(1, this, () => {
                this.bar.value += 0.01;
            });
        }
        onClosed() {
        }
        loadSubpackage() {
            const loadTask = Laya.Browser.window.wx.loadSubpackage({
                name: 'unity',
                success: (res) => {
                    this.loadRes();
                },
                fail: (res) => {
                    this.loadSubpackage();
                }
            });
            loadTask.onProgressUpdate(res => {
                console.log('下载进度', res.progress);
                console.log('已经下载的数据长度', res.totalBytesWritten);
                console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite);
            });
        }
        loadRes() {
            var resUrl = [
                WxApi.UnityPath + 'SampleScene.ls'
            ];
            Laya.loader.create(resUrl, Laya.Handler.create(this, this.onComplete), Laya.Handler.create(this, this.onProgress));
        }
        onComplete() {
            FdMgr.beforeHome(() => {
                GameLogic.Share.initScene();
            });
        }
        onProgress(value) {
        }
    }

    class SelectUI extends Laya.Scene {
        constructor() {
            super();
            this.totalDna = 175;
            this.curHp = 0;
            this.curPower = 0;
            this.selectType = 0;
            this.selectIndex = 0;
            this.itemCount = 0;
            this.hadShowAd = false;
            this.canStart = false;
            this.scene3D = null;
            this.light = null;
            this.camera = null;
            this.body = null;
            this.itemSp = null;
            this.choosBodyId = 0;
            this.choosItemId = 0;
            this.itemNode = null;
        }
        onOpened() {
            this.size(Laya.stage.displayWidth, Laya.stage.displayHeight);
            this.gradeNum.value = PlayerDataMgr.getPlayerData().grade.toString();
            Laya.timer.frameLoop(1, this, this.myUpdate);
            Utility.addClickEvent(this.nextBtn, this, this.nextBtnCB);
            Utility.addClickEvent(this.adBtn, this, this.adBtnCB);
            this.init3DScene();
            this.initBodyList();
            this.initItemList();
            let img = this.nextBtn.getChildAt(0);
            img.visible = PlayerDataMgr.getPlayerData().grade <= 1;
        }
        onClosed() {
            Laya.timer.clearAll(this);
            this.scene3D.destroy();
        }
        updateCurData(hp, power, dna) {
            this.totalDna -= dna;
            this.curHp += hp;
            this.curPower += power;
            this.dnaNum.text = this.totalDna.toString();
            this.hpNum.text = this.curHp.toString();
            this.powerNum.text = this.curPower.toString();
            this.nextBtn.gray = false;
            this.canStart = true;
            if (this.itemCount >= 3) {
                let img = this.nextBtn.getChildAt(0);
                img.visible = PlayerDataMgr.getPlayerData().grade <= 1;
            }
            if (this.itemCount == 1 && PlayerDataMgr.getPlayerData().grade <= 1) {
                this.itemList.scrollTo(9);
                Laya.Tween.clearAll(this.finger);
                this.guide2();
            }
            else if (this.itemCount == 2 && PlayerDataMgr.getPlayerData().grade <= 1) {
                Laya.Tween.clearAll(this.finger);
                this.guide3();
            }
        }
        init3DScene() {
            this.scene3D = Laya.stage.addChild(new Laya.Scene3D());
            Laya.stage.setChildIndex(this.scene3D, 2);
            this.light = this.scene3D.addChild(new Laya.DirectionLight());
            this.light.color = new Laya.Vector3(1, 1, 1);
            this.light.transform.rotationEuler = new Laya.Vector3(0, 180, 0);
            this.camera = this.scene3D.addChild(new Laya.Camera(0, 0.1, 1000));
            this.camera.transform.translate(new Laya.Vector3(0, 0, -15));
            this.camera.transform.rotate(new Laya.Vector3(0, 180, 0), true, false);
            this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
            this.camera.orthographicVerticalSize = 20;
            this.camera.orthographic = true;
            this.createBody(0);
        }
        createBody(index) {
            if (this.body)
                this.body.destroy();
            let bodyNode = GameLogic.Share._scene.getChildByName('BodyNode');
            let bodyRes = bodyNode.getChildAt(index);
            this.body = Laya.Sprite3D.instantiate(bodyRes, this.scene3D, false, new Laya.Vector3(0, 0, 0));
            this.body.transform.position = new Laya.Vector3(0, 4, 0);
            this.body.active = true;
        }
        createItemSp(type, index) {
            if (this.itemSp)
                this.itemSp.destroy();
            let itemNode = null;
            let itemRes = null;
            if (type == 0) {
                itemNode = GameLogic.Share._scene.getChildByName('HeadNode');
            }
            else if (type == 1) {
                itemNode = GameLogic.Share._scene.getChildByName('LegNode');
            }
            else if (type == 2) {
                itemNode = GameLogic.Share._scene.getChildByName('TailNode');
            }
            else if (type == 3) {
                itemNode = GameLogic.Share._scene.getChildByName('WingsNode');
            }
            itemRes = itemNode.getChildAt(index);
            this.itemSp = Laya.Sprite3D.instantiate(itemRes, this.scene3D, false, new Laya.Vector3(0, 0, 0));
            this.itemSp.transform.position = new Laya.Vector3(1, 0, 0);
            this.itemSp.getComponent(Laya.Animator).speed = 0;
        }
        initBodyList() {
            let arr = [].concat(PlayerDataMgr.getPlayerData().bodyArr);
            for (let i = arr.length - 1; i >= 0; i--) {
                if (arr[i] == 0)
                    arr.splice(i, 1);
            }
            this.bodyList.vScrollBarSkin = '';
            this.bodyList.array = arr;
            this.bodyList.repeatX = 2;
            this.bodyList.repeatY = Math.floor(arr.length / 2);
            this.bodyList.renderHandler = Laya.Handler.create(this, this.onBodyListRender, null, false);
        }
        onBodyListRender(cell, index) {
            if (index >= this.bodyList.array.length) {
                return;
            }
            var item = cell.getChildByName('item');
            let selectIcon = item.getChildByName('selectIcon');
            let icon = item.getChildByName('icon');
            let name = item.getChildByName('name');
            selectIcon.skin = index == this.choosBodyId ? 'selectUI/xz_dk_xzst3.png' : 'selectUI/xz_dk_xzst2.png';
            let indexStr = index + 1 < 10 ? '0' + (index + 1).toString() : (index + 1).toString();
            icon.skin = 'items/Body_' + indexStr + '.png';
            name.text = PlayerDataMgr.getBodyName(index);
            item.off(Laya.Event.CLICK, this, this.selectBody);
            item.on(Laya.Event.CLICK, this, this.selectBody, [index]);
        }
        selectBody(index) {
            SoundMgr.instance.playSoundEffect('Click.mp3');
            if (index == this.choosBodyId) {
                return;
            }
            this.choosBodyId = index;
            this.createBody(index);
            this.initBodyList();
        }
        nextBtnCB() {
            if (this.bodyList.visible) {
                this.bodyList.visible = false;
                this.itemList.visible = true;
                this.nextBtn.skin = 'selectUI/xz_btn_kszd.png';
                this.nextBtn.gray = true;
                let img = this.nextBtn.getChildAt(0);
                img.visible = false;
                if (PlayerDataMgr.getPlayerData().grade <= 1) {
                    this.guide1();
                }
            }
            if (this.canStart) {
                GameLogic.Share.gameStart(this.body, this.curHp, this.curPower);
            }
        }
        createItem(index) {
            if (this.itemNode)
                this.itemNode.destroy();
            let item = GameLogic.Share._scene.getChildByName('BodyNode');
            let itemRes = item.getChildAt(index);
            this.itemNode = Laya.Sprite3D.instantiate(itemRes, this.scene3D, false, new Laya.Vector3(0, 0, 0));
            this.itemNode.transform.position = new Laya.Vector3(0, 4, 0);
            this.itemNode.active = true;
        }
        updateItemList() {
            let arr = [].concat(PlayerDataMgr.getPlayerData().headArr);
            arr = arr.concat(PlayerDataMgr.getPlayerData().legArr);
            arr = arr.concat(PlayerDataMgr.getPlayerData().tailArr);
            arr = arr.concat(PlayerDataMgr.getPlayerData().wingsArr);
            this.itemList.array = arr;
        }
        initItemList() {
            let arr = [].concat(PlayerDataMgr.getPlayerData().headArr);
            arr = arr.concat(PlayerDataMgr.getPlayerData().legArr);
            arr = arr.concat(PlayerDataMgr.getPlayerData().tailArr);
            arr = arr.concat(PlayerDataMgr.getPlayerData().wingsArr);
            this.itemList.vScrollBarSkin = '';
            this.itemList.array = arr;
            this.itemList.repeatX = 3;
            this.itemList.repeatY = Math.floor(arr.length / 3);
            this.itemList.renderHandler = Laya.Handler.create(this, this.onItemListRender, null, false);
        }
        onItemListRender(cell, index) {
            if (index >= this.itemList.array.length) {
                return;
            }
            let type = 0;
            var item = cell.getChildByName('item');
            let icon = item.getChildByName('icon');
            let name = item.getChildByName('name');
            let hpBar = item.getChildByName('hpBar');
            let hpNum = item.getChildByName('hpNum');
            let powerBar = item.getChildByName('powerBar');
            let powerNum = item.getChildByName('powerNum');
            let bottomBg = item.getChildByName('bottomBg');
            let dnaNum = bottomBg.getChildByName('dnaNum');
            let adBg = item.getChildByName('adBg');
            let str = '';
            let tempIndex = 0;
            if (index < 10) {
                type = 0;
                tempIndex = index;
                let indexStr = tempIndex + 1 < 10 ? '0' + (tempIndex + 1).toString() : (tempIndex + 1).toString();
                str = 'items/Head_' + indexStr + '.png';
                name.text = PlayerDataMgr.getHeadName(tempIndex);
                hpBar.value = PlayerDataMgr.getItemData().head[tempIndex][0] / 20;
                hpNum.value = PlayerDataMgr.getItemData().head[tempIndex][0];
                powerBar.value = PlayerDataMgr.getItemData().head[tempIndex][1] / 10;
                powerNum.value = PlayerDataMgr.getItemData().head[tempIndex][1];
                dnaNum.value = PlayerDataMgr.getItemData().head[tempIndex][2];
                adBg.visible = PlayerDataMgr.getPlayerData().headArr[tempIndex] == 0;
                bottomBg.skin = this.totalDna >= PlayerDataMgr.getItemData().head[tempIndex][2] ? 'selectUI/xz_dk_xzbj3.png' : 'selectUI/xz_dk_xzbj2.png';
            }
            else if (index < 20) {
                type = 1;
                tempIndex = index - 10;
                let indexStr = tempIndex + 1 < 10 ? '0' + (tempIndex + 1).toString() : (tempIndex + 1).toString();
                str = 'items/Leg_' + indexStr + '.png';
                name.text = PlayerDataMgr.getLegName(tempIndex);
                hpBar.value = PlayerDataMgr.getItemData().leg[tempIndex][0] / 20;
                hpNum.value = PlayerDataMgr.getItemData().leg[tempIndex][0];
                powerBar.value = PlayerDataMgr.getItemData().leg[tempIndex][1] / 10;
                powerNum.value = PlayerDataMgr.getItemData().leg[tempIndex][1];
                dnaNum.value = PlayerDataMgr.getItemData().leg[tempIndex][2];
                adBg.visible = PlayerDataMgr.getPlayerData().legArr[tempIndex] == 0;
                bottomBg.skin = this.totalDna >= PlayerDataMgr.getItemData().leg[tempIndex][2] ? 'selectUI/xz_dk_xzbj3.png' : 'selectUI/xz_dk_xzbj2.png';
            }
            else if (index < 24) {
                type = 2;
                tempIndex = index - 20;
                let indexStr = tempIndex + 1 < 10 ? '0' + (tempIndex + 1).toString() : (tempIndex + 1).toString();
                str = 'items/Tail_' + indexStr + '.png';
                name.text = PlayerDataMgr.getTailName(tempIndex);
                hpBar.value = PlayerDataMgr.getItemData().tail[tempIndex][0] / 20;
                hpNum.value = PlayerDataMgr.getItemData().tail[tempIndex][0];
                powerBar.value = PlayerDataMgr.getItemData().tail[tempIndex][1] / 10;
                powerNum.value = PlayerDataMgr.getItemData().tail[tempIndex][1];
                dnaNum.value = PlayerDataMgr.getItemData().tail[tempIndex][2];
                adBg.visible = PlayerDataMgr.getPlayerData().tailArr[tempIndex] == 0;
                bottomBg.skin = this.totalDna >= PlayerDataMgr.getItemData().tail[tempIndex][2] ? 'selectUI/xz_dk_xzbj3.png' : 'selectUI/xz_dk_xzbj2.png';
            }
            else if (index < 26) {
                type = 3;
                tempIndex = index - 24;
                let indexStr = tempIndex + 1 < 10 ? '0' + (tempIndex + 1).toString() : (tempIndex + 1).toString();
                str = 'items/Wings_' + indexStr + '.png';
                name.text = PlayerDataMgr.getWingsName(tempIndex);
                hpBar.value = PlayerDataMgr.getItemData().wings[tempIndex][0] / 20;
                hpNum.value = PlayerDataMgr.getItemData().wings[tempIndex][0];
                powerBar.value = PlayerDataMgr.getItemData().wings[tempIndex][1] / 10;
                powerNum.value = PlayerDataMgr.getItemData().wings[tempIndex][1];
                dnaNum.value = PlayerDataMgr.getItemData().wings[tempIndex][2];
                adBg.visible = PlayerDataMgr.getPlayerData().wingsArr[tempIndex] == 0;
                bottomBg.skin = this.totalDna >= PlayerDataMgr.getItemData().wings[tempIndex][2] ? 'selectUI/xz_dk_xzbj3.png' : 'selectUI/xz_dk_xzbj2.png';
            }
            icon.skin = str;
            icon.off(Laya.Event.MOUSE_DOWN, this, this.selecItemDown);
            icon.off(Laya.Event.CLICK, this, this.selectItemUp);
            icon.on(Laya.Event.MOUSE_DOWN, this, this.selecItemDown, [type, tempIndex]);
            icon.on(Laya.Event.CLICK, this, this.selectItemUp, [type, tempIndex]);
        }
        selecItemDown(type, index) {
            SoundMgr.instance.playSoundEffect('Click.mp3');
            this.selectType = type;
            this.selectIndex = index;
            if (this.totalDna < this.getItemDataFromTypeIndex()[2]) {
                return;
            }
            if (PlayerDataMgr.getDataByType(type)[index] == 0) {
                return;
            }
            this.itemList.scrollBar.touchScrollEnable = false;
            this.createItemSp(type, index);
            this.on(Laya.Event.MOUSE_MOVE, this, this.fullBtnMove);
            this.on(Laya.Event.MOUSE_UP, this, this.fullBtnEnd);
            Laya.Tween.clearAll(this.finger);
            this.finger.visible = false;
        }
        selectItemUp(type, index) {
            console.log('click');
            if (PlayerDataMgr.getDataByType(type)[index] == 0) {
                let cb = () => {
                    PlayerDataMgr.getDataByType(type)[index] = 1;
                    PlayerDataMgr.setPlayerData();
                    this.updateItemList();
                };
                FdAd.showVideo(cb);
                return;
            }
        }
        fullBtnMove() {
            if (this.itemList.scrollBar.touchScrollEnable || !this.itemSp) {
                return;
            }
            this.itemSp.active = true;
            let pos = new Laya.Vector3(Laya.stage.mouseX, Laya.stage.mouseY - 150, 0);
            this.camera.convertScreenCoordToOrthographicCoord(pos, pos);
            pos.z = 0;
            this.itemSp.transform.position = pos;
            let itemNode = this.checkFixItemNode();
            if (itemNode) {
                this.itemSp.transform.rotationEuler = itemNode.transform.rotationEuler.clone();
            }
        }
        fullBtnEnd() {
            this.itemList.scrollBar.touchScrollEnable = true;
            this.off(Laya.Event.MOUSE_MOVE, this, this.fullBtnMove);
            this.off(Laya.Event.MOUSE_UP, this, this.fullBtnEnd);
            let itemNode = this.checkFixItemNode();
            if (itemNode) {
                this.addItemToBody(itemNode);
            }
            else {
                this.itemSp.destroy();
            }
        }
        checkFixItemNode() {
            for (let i = 0; i < this.body.numChildren; i++) {
                let itemNode = this.body.getChildAt(i);
                let itemNodePos = itemNode.transform.position.clone();
                let itemPos = this.itemSp.transform.position.clone();
                if (Laya.Vector3.distance(itemNodePos, itemPos) <= 1) {
                    return itemNode;
                }
            }
            return null;
        }
        addItemToBody(itemNode) {
            this.itemCount++;
            SoundMgr.instance.playSoundEffect('Get.mp3');
            WxApi.DoVibrate();
            let item = Laya.Sprite3D.instantiate(this.itemSp, itemNode, false);
            item.transform.localPosition = new Laya.Vector3();
            item.transform.localRotationEuler = new Laya.Vector3();
            item.getComponent(Laya.Animator).speed = 1;
            this.itemSp.destroy();
            this.updateCurData(this.getItemDataFromTypeIndex()[0], this.getItemDataFromTypeIndex()[1], this.getItemDataFromTypeIndex()[2]);
            this.updateItemList();
        }
        getItemDataFromTypeIndex() {
            let data = [];
            if (this.selectType == 0) {
                data = PlayerDataMgr.getItemData().head[this.selectIndex];
            }
            else if (this.selectType == 1) {
                data = PlayerDataMgr.getItemData().leg[this.selectIndex];
            }
            else if (this.selectType == 2) {
                data = PlayerDataMgr.getItemData().tail[this.selectIndex];
            }
            else if (this.selectType == 3) {
                data = PlayerDataMgr.getItemData().wings[this.selectIndex];
            }
            return data;
        }
        adBtnCB() {
            let cb = () => {
                this.totalDna += 150;
                this.dnaNum.text = this.totalDna.toString();
                this.adBtn.visible = false;
                this.updateItemList();
            };
            FdAd.showVideo(cb);
        }
        guide1() {
            this.finger.visible = true;
            this.finger.pos(183, this.height - 472);
            this.finger.scale(2, 2);
            Laya.Tween.to(this.finger, { scaleX: 1, scaleY: 1 }, 300, null, new Laya.Handler(this, () => {
                Laya.Tween.to(this.finger, { x: 530, y: 300 }, 1000, null, new Laya.Handler(this, () => {
                    this.guide1();
                }));
            }));
        }
        guide2() {
            this.finger.visible = true;
            this.finger.pos(this.width / 2, this.height - 472);
            this.finger.scale(2, 2);
            Laya.Tween.to(this.finger, { scaleX: 1, scaleY: 1 }, 300, null, new Laya.Handler(this, () => {
                Laya.Tween.to(this.finger, { x: 255, y: 500 }, 1000, null, new Laya.Handler(this, () => {
                    this.guide2();
                }));
            }));
        }
        guide3() {
            this.finger.visible = true;
            this.finger.pos(this.width / 2, this.height - 472);
            this.finger.scale(2, 2);
            Laya.Tween.to(this.finger, { scaleX: 1, scaleY: 1 }, 300, null, new Laya.Handler(this, () => {
                Laya.Tween.to(this.finger, { x: 475, y: 500 }, 1000, null, new Laya.Handler(this, () => {
                    this.guide3();
                }));
            }));
        }
        myUpdate() {
        }
    }

    class ScaleLoop extends Laya.Script {
        constructor() {
            super();
        }
        onAwake() {
            this.myOwnwer = this.owner;
            this.scaleLoop(this.myOwnwer, 1.1, 400);
        }
        scaleLoop(node, rate, t) {
            var tw = Laya.Tween.to(node, { scaleX: rate, scaleY: rate }, t, null, new Laya.Handler(this, () => {
                Laya.Tween.to(node, { scaleX: 1, scaleY: 1 }, t, null, new Laya.Handler(this, () => {
                    this.scaleLoop(node, rate, t);
                }));
            }));
        }
    }

    class StartUI extends Laya.Scene {
        constructor() {
            super();
        }
        onOpened() {
            this.size(Laya.stage.displayWidth, Laya.stage.displayHeight);
            Utility.addClickEvent(this.startBtn, this, this.startBtnCB);
            Utility.addClickEvent(this.vibrateBtn, this, this.vibrateBtnCB);
            FdMgr.inHome();
        }
        onClosed() {
        }
        startBtnCB() {
            FdMgr.clickStart(() => {
                this.close();
                Laya.Scene.open('MyScenes/SelectUI.scene', false);
            });
        }
        vibrateBtnCB() {
            WxApi.isVibrate = !WxApi.isVibrate;
            this.vibrateBtn.skin = WxApi.isVibrate ? 'gameUI/zd_btn_1.png' : 'gameUI/zd_btn_2.png';
            let str = this.vibrateBtn.getChildAt(0);
            str.text = WxApi.isVibrate ? '震动：开' : '震动：关';
        }
    }

    class UpDownLoop extends Laya.Script {
        constructor() {
            super();
            this.startY = 0;
        }
        onAwake() {
            this.myOwner = this.owner;
            this.startY = this.myOwner.y;
            this.startTween();
        }
        startTween() {
            Laya.Tween.to(this.myOwner, { y: this.startY + 50 }, 1000, Laya.Ease.sineInOut, new Laya.Handler(this, () => {
                Laya.Tween.to(this.myOwner, { y: this.startY }, 1000, Laya.Ease.sineInOut, new Laya.Handler(this, () => {
                    this.startTween();
                }));
            }));
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("FanDong/BannerNativeUI.ts", BannerNativeUI);
            reg("FanDong/Box.ts", Box);
            reg("FanDong/FDHomeUI.ts", FDHomeUI);
            reg("FanDong/GiftBoxUI.ts", GiftBoxUI);
            reg("FanDong/GridNativeUI.ts", GridNativeUI);
            reg("FanDong/MiddleNativeUI.ts", MiddleNativeUI);
            reg("FanDong/PrivacyUI.ts", PrivacyUI);
            reg("View/FinishUI.ts", FinishUI);
            reg("View/GameUI.ts", GameUI);
            reg("Libs/FixNodeY.ts", FixNodeY);
            reg("View/LoadingUI.ts", LoadingUI);
            reg("View/SelectUI.ts", SelectUI);
            reg("Libs/ScaleLoop.ts", ScaleLoop);
            reg("View/StartUI.ts", StartUI);
            reg("Mod/UpDownLoop.ts", UpDownLoop);
        }
    }
    GameConfig.width = 750;
    GameConfig.height = 1334;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "vertical";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "MyScenes/StartUI.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            Laya.stage.useRetinalCanvas = true;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            new GameLogic();
        }
    }
    new Main();

}());
