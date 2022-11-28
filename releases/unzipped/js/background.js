/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/index.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./ow-game-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-games-events */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-games */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-hotkeys */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-window */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js"), exports);


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGameListener = void 0;
const ow_listener_1 = __webpack_require__(/*! ./ow-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js");
class OWGameListener extends ow_listener_1.OWListener {
    constructor(delegate) {
        super(delegate);
        this.onGameInfoUpdated = (update) => {
            if (!update || !update.gameInfo) {
                return;
            }
            if (!update.runningChanged && !update.gameChanged) {
                return;
            }
            if (update.gameInfo.isRunning) {
                if (this._delegate.onGameStarted) {
                    this._delegate.onGameStarted(update.gameInfo);
                }
            }
            else {
                if (this._delegate.onGameEnded) {
                    this._delegate.onGameEnded(update.gameInfo);
                }
            }
        };
        this.onRunningGameInfo = (info) => {
            if (!info) {
                return;
            }
            if (info.isRunning) {
                if (this._delegate.onGameStarted) {
                    this._delegate.onGameStarted(info);
                }
            }
        };
    }
    start() {
        super.start();
        overwolf.games.onGameInfoUpdated.addListener(this.onGameInfoUpdated);
        overwolf.games.getRunningGameInfo(this.onRunningGameInfo);
    }
    stop() {
        overwolf.games.onGameInfoUpdated.removeListener(this.onGameInfoUpdated);
    }
}
exports.OWGameListener = OWGameListener;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js":
/*!************************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGamesEvents = void 0;
const timer_1 = __webpack_require__(/*! ./timer */ "./node_modules/@overwolf/overwolf-api-ts/dist/timer.js");
class OWGamesEvents {
    constructor(delegate, requiredFeatures, featureRetries = 10) {
        this.onInfoUpdates = (info) => {
            this._delegate.onInfoUpdates(info.info);
        };
        this.onNewEvents = (e) => {
            this._delegate.onNewEvents(e);
        };
        this._delegate = delegate;
        this._requiredFeatures = requiredFeatures;
        this._featureRetries = featureRetries;
    }
    async getInfo() {
        return new Promise((resolve) => {
            overwolf.games.events.getInfo(resolve);
        });
    }
    async setRequiredFeatures() {
        let tries = 1, result;
        while (tries <= this._featureRetries) {
            result = await new Promise(resolve => {
                overwolf.games.events.setRequiredFeatures(this._requiredFeatures, resolve);
            });
            if (result.status === 'success') {
                console.log('setRequiredFeatures(): success: ' + JSON.stringify(result, null, 2));
                return (result.supportedFeatures.length > 0);
            }
            await timer_1.Timer.wait(3000);
            tries++;
        }
        console.warn('setRequiredFeatures(): failure after ' + tries + ' tries' + JSON.stringify(result, null, 2));
        return false;
    }
    registerEvents() {
        this.unRegisterEvents();
        overwolf.games.events.onInfoUpdates2.addListener(this.onInfoUpdates);
        overwolf.games.events.onNewEvents.addListener(this.onNewEvents);
    }
    unRegisterEvents() {
        overwolf.games.events.onInfoUpdates2.removeListener(this.onInfoUpdates);
        overwolf.games.events.onNewEvents.removeListener(this.onNewEvents);
    }
    async start() {
        console.log(`[ow-game-events] START`);
        this.registerEvents();
        await this.setRequiredFeatures();
        const { res, status } = await this.getInfo();
        if (res && status === 'success') {
            this.onInfoUpdates({ info: res });
        }
    }
    stop() {
        console.log(`[ow-game-events] STOP`);
        this.unRegisterEvents();
    }
}
exports.OWGamesEvents = OWGamesEvents;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGames = void 0;
class OWGames {
    static getRunningGameInfo() {
        return new Promise((resolve) => {
            overwolf.games.getRunningGameInfo(resolve);
        });
    }
    static classIdFromGameId(gameId) {
        let classId = Math.floor(gameId / 10);
        return classId;
    }
    static async getRecentlyPlayedGames(limit = 3) {
        return new Promise((resolve) => {
            if (!overwolf.games.getRecentlyPlayedGames) {
                return resolve(null);
            }
            overwolf.games.getRecentlyPlayedGames(limit, result => {
                resolve(result.games);
            });
        });
    }
    static async getGameDBInfo(gameClassId) {
        return new Promise((resolve) => {
            overwolf.games.getGameDBInfo(gameClassId, resolve);
        });
    }
}
exports.OWGames = OWGames;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWHotkeys = void 0;
class OWHotkeys {
    constructor() { }
    static getHotkeyText(hotkeyId, gameId) {
        return new Promise(resolve => {
            overwolf.settings.hotkeys.get(result => {
                if (result && result.success) {
                    let hotkey;
                    if (gameId === undefined)
                        hotkey = result.globals.find(h => h.name === hotkeyId);
                    else if (result.games && result.games[gameId])
                        hotkey = result.games[gameId].find(h => h.name === hotkeyId);
                    if (hotkey)
                        return resolve(hotkey.binding);
                }
                resolve('UNASSIGNED');
            });
        });
    }
    static onHotkeyDown(hotkeyId, action) {
        overwolf.settings.hotkeys.onPressed.addListener((result) => {
            if (result && result.name === hotkeyId)
                action(result);
        });
    }
}
exports.OWHotkeys = OWHotkeys;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js":
/*!********************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWListener = void 0;
class OWListener {
    constructor(delegate) {
        this._delegate = delegate;
    }
    start() {
        this.stop();
    }
}
exports.OWListener = OWListener;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js":
/*!******************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWWindow = void 0;
class OWWindow {
    constructor(name = null) {
        this._name = name;
        this._id = null;
    }
    async restore() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.restore(id, result => {
                if (!result.success)
                    console.error(`[restore] - an error occurred, windowId=${id}, reason=${result.error}`);
                resolve();
            });
        });
    }
    async minimize() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.minimize(id, () => { });
            return resolve();
        });
    }
    async maximize() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.maximize(id, () => { });
            return resolve();
        });
    }
    async hide() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.hide(id, () => { });
            return resolve();
        });
    }
    async close() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            const result = await this.getWindowState();
            if (result.success &&
                (result.window_state !== 'closed')) {
                await this.internalClose();
            }
            return resolve();
        });
    }
    dragMove(elem) {
        elem.className = elem.className + ' draggable';
        elem.onmousedown = e => {
            e.preventDefault();
            overwolf.windows.dragMove(this._name);
        };
    }
    async getWindowState() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.getWindowState(id, resolve);
        });
    }
    static async getCurrentInfo() {
        return new Promise(async (resolve) => {
            overwolf.windows.getCurrentWindow(result => {
                resolve(result.window);
            });
        });
    }
    obtain() {
        return new Promise((resolve, reject) => {
            const cb = res => {
                if (res && res.status === "success" && res.window && res.window.id) {
                    this._id = res.window.id;
                    if (!this._name) {
                        this._name = res.window.name;
                    }
                    resolve(res.window);
                }
                else {
                    this._id = null;
                    reject();
                }
            };
            if (!this._name) {
                overwolf.windows.getCurrentWindow(cb);
            }
            else {
                overwolf.windows.obtainDeclaredWindow(this._name, cb);
            }
        });
    }
    async assureObtained() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.obtain();
            return resolve();
        });
    }
    async internalClose() {
        let that = this;
        return new Promise(async (resolve, reject) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.close(id, res => {
                if (res && res.success)
                    resolve();
                else
                    reject(res);
            });
        });
    }
}
exports.OWWindow = OWWindow;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/timer.js":
/*!**************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/timer.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Timer = void 0;
class Timer {
    constructor(delegate, id) {
        this._timerId = null;
        this.handleTimerEvent = () => {
            this._timerId = null;
            this._delegate.onTimer(this._id);
        };
        this._delegate = delegate;
        this._id = id;
    }
    static async wait(intervalInMS) {
        return new Promise(resolve => {
            setTimeout(resolve, intervalInMS);
        });
    }
    start(intervalInMS) {
        this.stop();
        this._timerId = setTimeout(this.handleTimerEvent, intervalInMS);
    }
    stop() {
        if (this._timerId == null) {
            return;
        }
        clearTimeout(this._timerId);
        this._timerId = null;
    }
}
exports.Timer = Timer;


/***/ }),

/***/ "./src/consts.ts":
/*!***********************!*\
  !*** ./src/consts.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "kGameClassIds": () => (/* binding */ kGameClassIds),
/* harmony export */   "kGamesFeatures": () => (/* binding */ kGamesFeatures),
/* harmony export */   "kHotkeys": () => (/* binding */ kHotkeys),
/* harmony export */   "kWindowNames": () => (/* binding */ kWindowNames)
/* harmony export */ });
const kGamesFeatures = new Map([
    [
        21216,
        [
            'kill',
            'killed',
            'killer',
            'revived',
            'death',
            'match',
            'match_info',
            'rank',
            'me',
            'phase',
            'location',
            'team',
            'items',
            'counters'
        ]
    ],
    [
        7764,
        [
            'match_info',
            'kill',
            'death',
            'assist',
            'headshot',
            'round_start',
            'match_start',
            'match_info',
            'match_end',
            'team_round_win',
            'bomb_planted',
            'bomb_change',
            'reloading',
            'fired',
            'weapon_change',
            'weapon_acquired',
            'info',
            'roster',
            'player_activity_change',
            'team_set',
            'replay',
            'counters',
            'mvp',
            'scoreboard',
            'kill_feed'
        ]
    ],
    [
        5426,
        [
            'live_client_data',
            'matchState',
            'match_info',
            'death',
            'respawn',
            'abilities',
            'kill',
            'assist',
            'gold',
            'minions',
            'summoner_info',
            'gameMode',
            'teams',
            'level',
            'announcer',
            'counters',
            'damage',
            'heal'
        ]
    ],
    [
        21634,
        [
            'match_info',
            'game_info'
        ]
    ],
    [
        8032,
        [
            'game_info',
            'match_info'
        ]
    ],
    [
        10844,
        [
            'game_info',
            'match_info',
            'kill',
            'death'
        ]
    ],
    [
        10906,
        [
            'kill',
            'revived',
            'death',
            'killer',
            'match',
            'match_info',
            'rank',
            'counters',
            'location',
            'me',
            'team',
            'phase',
            'map',
            'roster'
        ]
    ],
    [
        10826,
        [
            'game_info',
            'match',
            'match_info',
            'roster',
            'kill',
            'death',
            'me',
            'defuser'
        ]
    ],
    [
        21404,
        [
            'game_info',
            'match_info',
            'player',
            'location',
            'match',
            'feed',
            'connection',
            'kill',
            'death',
            'portal',
            'assist'
        ]
    ],
    [
        7212,
        [
            'kill',
            'death',
            'me',
            'match_info'
        ]
    ],
    [
        21640,
        [
            'me',
            'game_info',
            'match_info',
            'kill',
            'death'
        ]
    ],
    [
        7314,
        [
            'game_state_changed',
            'match_state_changed',
            'match_detected',
            'daytime_changed',
            'clock_time_changed',
            'ward_purchase_cooldown_changed',
            'match_ended',
            'kill',
            'assist',
            'death',
            'cs',
            'xpm',
            'gpm',
            'gold',
            'hero_leveled_up',
            'hero_respawned',
            'hero_buyback_info_changed',
            'hero_boughtback',
            'hero_health_mana_info',
            'hero_status_effect_changed',
            'hero_attributes_skilled',
            'hero_ability_skilled',
            'hero_ability_used',
            'hero_ability_cooldown_changed',
            'hero_ability_changed',
            'hero_item_cooldown_changed',
            'hero_item_changed',
            'hero_item_used',
            'hero_item_consumed',
            'hero_item_charged',
            'match_info',
            'roster',
            'party',
            'error',
            'hero_pool',
            'me',
            'game'
        ]
    ],
    [
        21626,
        [
            'match_info',
            'game_info',
            'kill',
            'death'
        ]
    ],
    [
        8954,
        [
            'game_info',
            'match_info'
        ]
    ],
]);
const kGameClassIds = Array.from(kGamesFeatures.keys());
const kWindowNames = {
    inGame: 'in_game',
    desktop: 'desktop'
};
const kHotkeys = {
    toggle: 'sample_app_ts_showhide'
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************************!*\
  !*** ./src/background/background.tsx ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _overwolf_overwolf_api_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @overwolf/overwolf-api-ts */ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js");
/* harmony import */ var _overwolf_overwolf_api_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_overwolf_overwolf_api_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../consts */ "./src/consts.ts");


class BackgroundController {
    static _instance;
    _windows = {};
    _gameListener;
    constructor() {
        this._windows[_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.desktop] = new _overwolf_overwolf_api_ts__WEBPACK_IMPORTED_MODULE_0__.OWWindow(_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.desktop);
        this._gameListener = new _overwolf_overwolf_api_ts__WEBPACK_IMPORTED_MODULE_0__.OWGameListener({
            onGameStarted: this.toggleWindows.bind(this),
            onGameEnded: this.toggleWindows.bind(this)
        });
        overwolf.extensions.onAppLaunchTriggered.addListener(e => this.onAppLaunchTriggered(e));
    }
    ;
    static instance() {
        if (!BackgroundController._instance) {
            BackgroundController._instance = new BackgroundController();
        }
        return BackgroundController._instance;
    }
    async run() {
        this._gameListener.start();
        const currWindowName = _consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.desktop;
        this._windows[currWindowName].restore();
    }
    async onAppLaunchTriggered(e) {
        console.log('onAppLaunchTriggered():', e);
        if (!e || e.origin.includes('gamelaunchevent')) {
            return;
        }
        if (await this.isSupportedGameRunning()) {
            this._windows[_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.desktop].close();
        }
        else {
            this._windows[_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.desktop].restore();
        }
    }
    toggleWindows(info) {
        if (!info || !this.isSupportedGame(info)) {
            return;
        }
        if (info.isRunning) {
            this._windows[_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.desktop].close();
        }
        else {
            this._windows[_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.desktop].restore();
        }
    }
    async isSupportedGameRunning() {
        const info = await _overwolf_overwolf_api_ts__WEBPACK_IMPORTED_MODULE_0__.OWGames.getRunningGameInfo();
        return info && info.isRunning && this.isSupportedGame(info);
    }
    isSupportedGame(info) {
        return _consts__WEBPACK_IMPORTED_MODULE_1__.kGameClassIds.includes(info.classId);
    }
}
BackgroundController.instance().run();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QztJQUNILENBQUM7SUFFTyxhQUFhLENBQUMsSUFBcUI7UUFDekMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDeEMsT0FBTztTQUNSO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMseURBQW9CLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUM3QzthQUFNO1lBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyx5REFBb0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQy9DO0lBQ0gsQ0FBQztJQUVPLEtBQUssQ0FBQyxzQkFBc0I7UUFDbEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxpRkFBMEIsRUFBRSxDQUFDO1FBRWhELE9BQU8sSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBR08sZUFBZSxDQUFDLElBQXFCO1FBQzNDLE9BQU8sMkRBQXNCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FDRjtBQUVELG9CQUFvQixDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hhbXBfc2VsZWN0X3dpbnJhdGUvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L2luZGV4LmpzIiwid2VicGFjazovL2NoYW1wX3NlbGVjdF93aW5yYXRlLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1nYW1lLWxpc3RlbmVyLmpzIiwid2VicGFjazovL2NoYW1wX3NlbGVjdF93aW5yYXRlLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1nYW1lcy1ldmVudHMuanMiLCJ3ZWJwYWNrOi8vY2hhbXBfc2VsZWN0X3dpbnJhdGUvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWdhbWVzLmpzIiwid2VicGFjazovL2NoYW1wX3NlbGVjdF93aW5yYXRlLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1ob3RrZXlzLmpzIiwid2VicGFjazovL2NoYW1wX3NlbGVjdF93aW5yYXRlLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1saXN0ZW5lci5qcyIsIndlYnBhY2s6Ly9jaGFtcF9zZWxlY3Rfd2lucmF0ZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3Qvb3ctd2luZG93LmpzIiwid2VicGFjazovL2NoYW1wX3NlbGVjdF93aW5yYXRlLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC90aW1lci5qcyIsIndlYnBhY2s6Ly9jaGFtcF9zZWxlY3Rfd2lucmF0ZS8uL3NyYy9jb25zdHMudHMiLCJ3ZWJwYWNrOi8vY2hhbXBfc2VsZWN0X3dpbnJhdGUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2hhbXBfc2VsZWN0X3dpbnJhdGUvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vY2hhbXBfc2VsZWN0X3dpbnJhdGUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NoYW1wX3NlbGVjdF93aW5yYXRlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2hhbXBfc2VsZWN0X3dpbnJhdGUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jaGFtcF9zZWxlY3Rfd2lucmF0ZS8uL3NyYy9iYWNrZ3JvdW5kL2JhY2tncm91bmQudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSkpO1xyXG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZXhwb3J0cywgcCkpIF9fY3JlYXRlQmluZGluZyhleHBvcnRzLCBtLCBwKTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctZ2FtZS1saXN0ZW5lclwiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1nYW1lcy1ldmVudHNcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctZ2FtZXNcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctaG90a2V5c1wiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1saXN0ZW5lclwiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy13aW5kb3dcIiksIGV4cG9ydHMpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XR2FtZUxpc3RlbmVyID0gdm9pZCAwO1xyXG5jb25zdCBvd19saXN0ZW5lcl8xID0gcmVxdWlyZShcIi4vb3ctbGlzdGVuZXJcIik7XHJcbmNsYXNzIE9XR2FtZUxpc3RlbmVyIGV4dGVuZHMgb3dfbGlzdGVuZXJfMS5PV0xpc3RlbmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlbGVnYXRlKSB7XHJcbiAgICAgICAgc3VwZXIoZGVsZWdhdGUpO1xyXG4gICAgICAgIHRoaXMub25HYW1lSW5mb1VwZGF0ZWQgPSAodXBkYXRlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdXBkYXRlIHx8ICF1cGRhdGUuZ2FtZUluZm8pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXVwZGF0ZS5ydW5uaW5nQ2hhbmdlZCAmJiAhdXBkYXRlLmdhbWVDaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHVwZGF0ZS5nYW1lSW5mby5pc1J1bm5pbmcpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVTdGFydGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25HYW1lU3RhcnRlZCh1cGRhdGUuZ2FtZUluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2RlbGVnYXRlLm9uR2FtZUVuZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25HYW1lRW5kZWQodXBkYXRlLmdhbWVJbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5vblJ1bm5pbmdHYW1lSW5mbyA9IChpbmZvKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghaW5mbykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpbmZvLmlzUnVubmluZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2RlbGVnYXRlLm9uR2FtZVN0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVTdGFydGVkKGluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHN1cGVyLnN0YXJ0KCk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMub25HYW1lSW5mb1VwZGF0ZWQuYWRkTGlzdGVuZXIodGhpcy5vbkdhbWVJbmZvVXBkYXRlZCk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZ2V0UnVubmluZ0dhbWVJbmZvKHRoaXMub25SdW5uaW5nR2FtZUluZm8pO1xyXG4gICAgfVxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5vbkdhbWVJbmZvVXBkYXRlZC5yZW1vdmVMaXN0ZW5lcih0aGlzLm9uR2FtZUluZm9VcGRhdGVkKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XR2FtZUxpc3RlbmVyID0gT1dHYW1lTGlzdGVuZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dHYW1lc0V2ZW50cyA9IHZvaWQgMDtcclxuY29uc3QgdGltZXJfMSA9IHJlcXVpcmUoXCIuL3RpbWVyXCIpO1xyXG5jbGFzcyBPV0dhbWVzRXZlbnRzIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlbGVnYXRlLCByZXF1aXJlZEZlYXR1cmVzLCBmZWF0dXJlUmV0cmllcyA9IDEwKSB7XHJcbiAgICAgICAgdGhpcy5vbkluZm9VcGRhdGVzID0gKGluZm8pID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25JbmZvVXBkYXRlcyhpbmZvLmluZm8pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5vbk5ld0V2ZW50cyA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uTmV3RXZlbnRzKGUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUgPSBkZWxlZ2F0ZTtcclxuICAgICAgICB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzID0gcmVxdWlyZWRGZWF0dXJlcztcclxuICAgICAgICB0aGlzLl9mZWF0dXJlUmV0cmllcyA9IGZlYXR1cmVSZXRyaWVzO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgZ2V0SW5mbygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLmdldEluZm8ocmVzb2x2ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBzZXRSZXF1aXJlZEZlYXR1cmVzKCkge1xyXG4gICAgICAgIGxldCB0cmllcyA9IDEsIHJlc3VsdDtcclxuICAgICAgICB3aGlsZSAodHJpZXMgPD0gdGhpcy5fZmVhdHVyZVJldHJpZXMpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMuc2V0UmVxdWlyZWRGZWF0dXJlcyh0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLCByZXNvbHZlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdHVzID09PSAnc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZXRSZXF1aXJlZEZlYXR1cmVzKCk6IHN1Y2Nlc3M6ICcgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQsIG51bGwsIDIpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAocmVzdWx0LnN1cHBvcnRlZEZlYXR1cmVzLmxlbmd0aCA+IDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGF3YWl0IHRpbWVyXzEuVGltZXIud2FpdCgzMDAwKTtcclxuICAgICAgICAgICAgdHJpZXMrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdzZXRSZXF1aXJlZEZlYXR1cmVzKCk6IGZhaWx1cmUgYWZ0ZXIgJyArIHRyaWVzICsgJyB0cmllcycgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQsIG51bGwsIDIpKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZWdpc3RlckV2ZW50cygpIHtcclxuICAgICAgICB0aGlzLnVuUmVnaXN0ZXJFdmVudHMoKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMub25JbmZvVXBkYXRlczIuYWRkTGlzdGVuZXIodGhpcy5vbkluZm9VcGRhdGVzKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMub25OZXdFdmVudHMuYWRkTGlzdGVuZXIodGhpcy5vbk5ld0V2ZW50cyk7XHJcbiAgICB9XHJcbiAgICB1blJlZ2lzdGVyRXZlbnRzKCkge1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5vbkluZm9VcGRhdGVzMi5yZW1vdmVMaXN0ZW5lcih0aGlzLm9uSW5mb1VwZGF0ZXMpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5vbk5ld0V2ZW50cy5yZW1vdmVMaXN0ZW5lcih0aGlzLm9uTmV3RXZlbnRzKTtcclxuICAgIH1cclxuICAgIGFzeW5jIHN0YXJ0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbb3ctZ2FtZS1ldmVudHNdIFNUQVJUYCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuc2V0UmVxdWlyZWRGZWF0dXJlcygpO1xyXG4gICAgICAgIGNvbnN0IHsgcmVzLCBzdGF0dXMgfSA9IGF3YWl0IHRoaXMuZ2V0SW5mbygpO1xyXG4gICAgICAgIGlmIChyZXMgJiYgc3RhdHVzID09PSAnc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkluZm9VcGRhdGVzKHsgaW5mbzogcmVzIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFtvdy1nYW1lLWV2ZW50c10gU1RPUGApO1xyXG4gICAgICAgIHRoaXMudW5SZWdpc3RlckV2ZW50cygpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dHYW1lc0V2ZW50cyA9IE9XR2FtZXNFdmVudHM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dHYW1lcyA9IHZvaWQgMDtcclxuY2xhc3MgT1dHYW1lcyB7XHJcbiAgICBzdGF0aWMgZ2V0UnVubmluZ0dhbWVJbmZvKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5nZXRSdW5uaW5nR2FtZUluZm8ocmVzb2x2ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgY2xhc3NJZEZyb21HYW1lSWQoZ2FtZUlkKSB7XHJcbiAgICAgICAgbGV0IGNsYXNzSWQgPSBNYXRoLmZsb29yKGdhbWVJZCAvIDEwKTtcclxuICAgICAgICByZXR1cm4gY2xhc3NJZDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBnZXRSZWNlbnRseVBsYXllZEdhbWVzKGxpbWl0ID0gMykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIW92ZXJ3b2xmLmdhbWVzLmdldFJlY2VudGx5UGxheWVkR2FtZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmdldFJlY2VudGx5UGxheWVkR2FtZXMobGltaXQsIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdC5nYW1lcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGdldEdhbWVEQkluZm8oZ2FtZUNsYXNzSWQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZ2V0R2FtZURCSW5mbyhnYW1lQ2xhc3NJZCwgcmVzb2x2ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0dhbWVzID0gT1dHYW1lcztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0hvdGtleXMgPSB2b2lkIDA7XHJcbmNsYXNzIE9XSG90a2V5cyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgc3RhdGljIGdldEhvdGtleVRleHQoaG90a2V5SWQsIGdhbWVJZCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYuc2V0dGluZ3MuaG90a2V5cy5nZXQocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaG90a2V5O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChnYW1lSWQgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG90a2V5ID0gcmVzdWx0Lmdsb2JhbHMuZmluZChoID0+IGgubmFtZSA9PT0gaG90a2V5SWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJlc3VsdC5nYW1lcyAmJiByZXN1bHQuZ2FtZXNbZ2FtZUlkXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG90a2V5ID0gcmVzdWx0LmdhbWVzW2dhbWVJZF0uZmluZChoID0+IGgubmFtZSA9PT0gaG90a2V5SWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChob3RrZXkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGhvdGtleS5iaW5kaW5nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc29sdmUoJ1VOQVNTSUdORUQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgb25Ib3RrZXlEb3duKGhvdGtleUlkLCBhY3Rpb24pIHtcclxuICAgICAgICBvdmVyd29sZi5zZXR0aW5ncy5ob3RrZXlzLm9uUHJlc3NlZC5hZGRMaXN0ZW5lcigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0Lm5hbWUgPT09IGhvdGtleUlkKVxyXG4gICAgICAgICAgICAgICAgYWN0aW9uKHJlc3VsdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0hvdGtleXMgPSBPV0hvdGtleXM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dMaXN0ZW5lciA9IHZvaWQgMDtcclxuY2xhc3MgT1dMaXN0ZW5lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZSkge1xyXG4gICAgICAgIHRoaXMuX2RlbGVnYXRlID0gZGVsZWdhdGU7XHJcbiAgICB9XHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XTGlzdGVuZXIgPSBPV0xpc3RlbmVyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XV2luZG93ID0gdm9pZCAwO1xyXG5jbGFzcyBPV1dpbmRvdyB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lID0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuX2lkID0gbnVsbDtcclxuICAgIH1cclxuICAgIGFzeW5jIHJlc3RvcmUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLnJlc3RvcmUoaWQsIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdC5zdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtyZXN0b3JlXSAtIGFuIGVycm9yIG9jY3VycmVkLCB3aW5kb3dJZD0ke2lkfSwgcmVhc29uPSR7cmVzdWx0LmVycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIG1pbmltaXplKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5taW5pbWl6ZShpZCwgKCkgPT4geyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIG1heGltaXplKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5tYXhpbWl6ZShpZCwgKCkgPT4geyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIGhpZGUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmhpZGUoaWQsICgpID0+IHsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBjbG9zZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuZ2V0V2luZG93U3RhdGUoKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzICYmXHJcbiAgICAgICAgICAgICAgICAocmVzdWx0LndpbmRvd19zdGF0ZSAhPT0gJ2Nsb3NlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmludGVybmFsQ2xvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZHJhZ01vdmUoZWxlbSkge1xyXG4gICAgICAgIGVsZW0uY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWUgKyAnIGRyYWdnYWJsZSc7XHJcbiAgICAgICAgZWxlbS5vbm1vdXNlZG93biA9IGUgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuZHJhZ01vdmUodGhpcy5fbmFtZSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGFzeW5jIGdldFdpbmRvd1N0YXRlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5nZXRXaW5kb3dTdGF0ZShpZCwgcmVzb2x2ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0Q3VycmVudEluZm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuZ2V0Q3VycmVudFdpbmRvdyhyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQud2luZG93KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBvYnRhaW4oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY2IgPSByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcyAmJiByZXMuc3RhdHVzID09PSBcInN1Y2Nlc3NcIiAmJiByZXMud2luZG93ICYmIHJlcy53aW5kb3cuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pZCA9IHJlcy53aW5kb3cuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWUgPSByZXMud2luZG93Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzLndpbmRvdyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5nZXRDdXJyZW50V2luZG93KGNiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3Mub2J0YWluRGVjbGFyZWRXaW5kb3codGhpcy5fbmFtZSwgY2IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBhc3N1cmVPYnRhaW5lZCgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQub2J0YWluKCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBpbnRlcm5hbENsb3NlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmNsb3NlKGlkLCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcyAmJiByZXMuc3VjY2VzcylcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dXaW5kb3cgPSBPV1dpbmRvdztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5UaW1lciA9IHZvaWQgMDtcclxuY2xhc3MgVGltZXIge1xyXG4gICAgY29uc3RydWN0b3IoZGVsZWdhdGUsIGlkKSB7XHJcbiAgICAgICAgdGhpcy5fdGltZXJJZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVUaW1lckV2ZW50ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl90aW1lcklkID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25UaW1lcih0aGlzLl9pZCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xyXG4gICAgICAgIHRoaXMuX2lkID0gaWQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgd2FpdChpbnRlcnZhbEluTVMpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgaW50ZXJ2YWxJbk1TKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXJ0KGludGVydmFsSW5NUykge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMuX3RpbWVySWQgPSBzZXRUaW1lb3V0KHRoaXMuaGFuZGxlVGltZXJFdmVudCwgaW50ZXJ2YWxJbk1TKTtcclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3RpbWVySWQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcklkKTtcclxuICAgICAgICB0aGlzLl90aW1lcklkID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlRpbWVyID0gVGltZXI7XHJcbiIsImV4cG9ydCBjb25zdCBrR2FtZXNGZWF0dXJlcyA9IG5ldyBNYXA8bnVtYmVyLCBzdHJpbmdbXT4oW1xyXG4gIC8vIEZvcnRuaXRlXHJcbiAgW1xyXG4gICAgMjEyMTYsXHJcbiAgICBbXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ2tpbGxlZCcsXHJcbiAgICAgICdraWxsZXInLFxyXG4gICAgICAncmV2aXZlZCcsXHJcbiAgICAgICdkZWF0aCcsXHJcbiAgICAgICdtYXRjaCcsXHJcbiAgICAgICdtYXRjaF9pbmZvJyxcclxuICAgICAgJ3JhbmsnLFxyXG4gICAgICAnbWUnLFxyXG4gICAgICAncGhhc2UnLFxyXG4gICAgICAnbG9jYXRpb24nLFxyXG4gICAgICAndGVhbScsXHJcbiAgICAgICdpdGVtcycsXHJcbiAgICAgICdjb3VudGVycydcclxuICAgIF1cclxuICBdLFxyXG4gIC8vIENTR09cclxuICBbXHJcbiAgICA3NzY0LFxyXG4gICAgW1xyXG4gICAgICAnbWF0Y2hfaW5mbycsXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ2RlYXRoJyxcclxuICAgICAgJ2Fzc2lzdCcsXHJcbiAgICAgICdoZWFkc2hvdCcsXHJcbiAgICAgICdyb3VuZF9zdGFydCcsXHJcbiAgICAgICdtYXRjaF9zdGFydCcsXHJcbiAgICAgICdtYXRjaF9pbmZvJyxcclxuICAgICAgJ21hdGNoX2VuZCcsXHJcbiAgICAgICd0ZWFtX3JvdW5kX3dpbicsXHJcbiAgICAgICdib21iX3BsYW50ZWQnLFxyXG4gICAgICAnYm9tYl9jaGFuZ2UnLFxyXG4gICAgICAncmVsb2FkaW5nJyxcclxuICAgICAgJ2ZpcmVkJyxcclxuICAgICAgJ3dlYXBvbl9jaGFuZ2UnLFxyXG4gICAgICAnd2VhcG9uX2FjcXVpcmVkJyxcclxuICAgICAgJ2luZm8nLFxyXG4gICAgICAncm9zdGVyJyxcclxuICAgICAgJ3BsYXllcl9hY3Rpdml0eV9jaGFuZ2UnLFxyXG4gICAgICAndGVhbV9zZXQnLFxyXG4gICAgICAncmVwbGF5JyxcclxuICAgICAgJ2NvdW50ZXJzJyxcclxuICAgICAgJ212cCcsXHJcbiAgICAgICdzY29yZWJvYXJkJyxcclxuICAgICAgJ2tpbGxfZmVlZCdcclxuICAgIF1cclxuICBdLFxyXG4gIC8vIExlYWd1ZSBvZiBMZWdlbmRzXHJcbiAgW1xyXG4gICAgNTQyNixcclxuICAgIFtcclxuICAgICAgJ2xpdmVfY2xpZW50X2RhdGEnLFxyXG4gICAgICAnbWF0Y2hTdGF0ZScsXHJcbiAgICAgICdtYXRjaF9pbmZvJyxcclxuICAgICAgJ2RlYXRoJyxcclxuICAgICAgJ3Jlc3Bhd24nLFxyXG4gICAgICAnYWJpbGl0aWVzJyxcclxuICAgICAgJ2tpbGwnLFxyXG4gICAgICAnYXNzaXN0JyxcclxuICAgICAgJ2dvbGQnLFxyXG4gICAgICAnbWluaW9ucycsXHJcbiAgICAgICdzdW1tb25lcl9pbmZvJyxcclxuICAgICAgJ2dhbWVNb2RlJyxcclxuICAgICAgJ3RlYW1zJyxcclxuICAgICAgJ2xldmVsJyxcclxuICAgICAgJ2Fubm91bmNlcicsXHJcbiAgICAgICdjb3VudGVycycsXHJcbiAgICAgICdkYW1hZ2UnLFxyXG4gICAgICAnaGVhbCdcclxuICAgIF1cclxuICBdLFxyXG4gIC8vIEVzY2FwZSBGcm9tIFRhcmtvdlxyXG4gIFtcclxuICAgIDIxNjM0LFxyXG4gICAgW1xyXG4gICAgICAnbWF0Y2hfaW5mbycsXHJcbiAgICAgICdnYW1lX2luZm8nXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBNaW5lY3JhZnRcclxuICBbXHJcbiAgICA4MDMyLFxyXG4gICAgW1xyXG4gICAgICAnZ2FtZV9pbmZvJyxcclxuICAgICAgJ21hdGNoX2luZm8nXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBPdmVyd2F0Y2hcclxuICBbXHJcbiAgICAxMDg0NCxcclxuICAgIFtcclxuICAgICAgJ2dhbWVfaW5mbycsXHJcbiAgICAgICdtYXRjaF9pbmZvJyxcclxuICAgICAgJ2tpbGwnLFxyXG4gICAgICAnZGVhdGgnXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBQVUJHXHJcbiAgW1xyXG4gICAgMTA5MDYsXHJcbiAgICBbXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ3Jldml2ZWQnLFxyXG4gICAgICAnZGVhdGgnLFxyXG4gICAgICAna2lsbGVyJyxcclxuICAgICAgJ21hdGNoJyxcclxuICAgICAgJ21hdGNoX2luZm8nLFxyXG4gICAgICAncmFuaycsXHJcbiAgICAgICdjb3VudGVycycsXHJcbiAgICAgICdsb2NhdGlvbicsXHJcbiAgICAgICdtZScsXHJcbiAgICAgICd0ZWFtJyxcclxuICAgICAgJ3BoYXNlJyxcclxuICAgICAgJ21hcCcsXHJcbiAgICAgICdyb3N0ZXInXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBSYWluYm93IFNpeCBTaWVnZVxyXG4gIFtcclxuICAgIDEwODI2LFxyXG4gICAgW1xyXG4gICAgICAnZ2FtZV9pbmZvJyxcclxuICAgICAgJ21hdGNoJyxcclxuICAgICAgJ21hdGNoX2luZm8nLFxyXG4gICAgICAncm9zdGVyJyxcclxuICAgICAgJ2tpbGwnLFxyXG4gICAgICAnZGVhdGgnLFxyXG4gICAgICAnbWUnLFxyXG4gICAgICAnZGVmdXNlcidcclxuICAgIF1cclxuICBdLFxyXG4gIC8vIFNwbGl0Z2F0ZTogQXJlbmEgV2FyZmFyZVxyXG4gIFtcclxuICAgIDIxNDA0LFxyXG4gICAgW1xyXG4gICAgICAnZ2FtZV9pbmZvJyxcclxuICAgICAgJ21hdGNoX2luZm8nLFxyXG4gICAgICAncGxheWVyJyxcclxuICAgICAgJ2xvY2F0aW9uJyxcclxuICAgICAgJ21hdGNoJyxcclxuICAgICAgJ2ZlZWQnLFxyXG4gICAgICAnY29ubmVjdGlvbicsXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ2RlYXRoJyxcclxuICAgICAgJ3BvcnRhbCcsXHJcbiAgICAgICdhc3Npc3QnXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBQYXRoIG9mIEV4aWxlXHJcbiAgW1xyXG4gICAgNzIxMixcclxuICAgIFtcclxuICAgICAgJ2tpbGwnLFxyXG4gICAgICAnZGVhdGgnLFxyXG4gICAgICAnbWUnLFxyXG4gICAgICAnbWF0Y2hfaW5mbydcclxuICAgIF1cclxuICBdLFxyXG4gIC8vIFZhbG9yYW50XHJcbiAgW1xyXG4gICAgMjE2NDAsXHJcbiAgICBbXHJcbiAgICAgICdtZScsXHJcbiAgICAgICdnYW1lX2luZm8nLFxyXG4gICAgICAnbWF0Y2hfaW5mbycsXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ2RlYXRoJ1xyXG4gICAgXVxyXG4gIF0sXHJcbiAgLy8gRG90YSAyXHJcbiAgW1xyXG4gICAgNzMxNCxcclxuICAgIFtcclxuICAgICAgJ2dhbWVfc3RhdGVfY2hhbmdlZCcsXHJcbiAgICAgICdtYXRjaF9zdGF0ZV9jaGFuZ2VkJyxcclxuICAgICAgJ21hdGNoX2RldGVjdGVkJyxcclxuICAgICAgJ2RheXRpbWVfY2hhbmdlZCcsXHJcbiAgICAgICdjbG9ja190aW1lX2NoYW5nZWQnLFxyXG4gICAgICAnd2FyZF9wdXJjaGFzZV9jb29sZG93bl9jaGFuZ2VkJyxcclxuICAgICAgJ21hdGNoX2VuZGVkJyxcclxuICAgICAgJ2tpbGwnLFxyXG4gICAgICAnYXNzaXN0JyxcclxuICAgICAgJ2RlYXRoJyxcclxuICAgICAgJ2NzJyxcclxuICAgICAgJ3hwbScsXHJcbiAgICAgICdncG0nLFxyXG4gICAgICAnZ29sZCcsXHJcbiAgICAgICdoZXJvX2xldmVsZWRfdXAnLFxyXG4gICAgICAnaGVyb19yZXNwYXduZWQnLFxyXG4gICAgICAnaGVyb19idXliYWNrX2luZm9fY2hhbmdlZCcsXHJcbiAgICAgICdoZXJvX2JvdWdodGJhY2snLFxyXG4gICAgICAnaGVyb19oZWFsdGhfbWFuYV9pbmZvJyxcclxuICAgICAgJ2hlcm9fc3RhdHVzX2VmZmVjdF9jaGFuZ2VkJyxcclxuICAgICAgJ2hlcm9fYXR0cmlidXRlc19za2lsbGVkJyxcclxuICAgICAgJ2hlcm9fYWJpbGl0eV9za2lsbGVkJyxcclxuICAgICAgJ2hlcm9fYWJpbGl0eV91c2VkJyxcclxuICAgICAgJ2hlcm9fYWJpbGl0eV9jb29sZG93bl9jaGFuZ2VkJyxcclxuICAgICAgJ2hlcm9fYWJpbGl0eV9jaGFuZ2VkJyxcclxuICAgICAgJ2hlcm9faXRlbV9jb29sZG93bl9jaGFuZ2VkJyxcclxuICAgICAgJ2hlcm9faXRlbV9jaGFuZ2VkJyxcclxuICAgICAgJ2hlcm9faXRlbV91c2VkJyxcclxuICAgICAgJ2hlcm9faXRlbV9jb25zdW1lZCcsXHJcbiAgICAgICdoZXJvX2l0ZW1fY2hhcmdlZCcsXHJcbiAgICAgICdtYXRjaF9pbmZvJyxcclxuICAgICAgJ3Jvc3RlcicsXHJcbiAgICAgICdwYXJ0eScsXHJcbiAgICAgICdlcnJvcicsXHJcbiAgICAgICdoZXJvX3Bvb2wnLFxyXG4gICAgICAnbWUnLFxyXG4gICAgICAnZ2FtZSdcclxuICAgIF1cclxuICBdLFxyXG4gIC8vIENhbGwgb2YgRHV0eTogV2Fyem9uZVxyXG4gIFtcclxuICAgIDIxNjI2LFxyXG4gICAgW1xyXG4gICAgICAnbWF0Y2hfaW5mbycsXHJcbiAgICAgICdnYW1lX2luZm8nLFxyXG4gICAgICAna2lsbCcsXHJcbiAgICAgICdkZWF0aCdcclxuICAgIF1cclxuICBdLFxyXG4gIC8vIFdhcmZyYW1lXHJcbiAgW1xyXG4gICAgODk1NCxcclxuICAgIFtcclxuICAgICAgJ2dhbWVfaW5mbycsXHJcbiAgICAgICdtYXRjaF9pbmZvJ1xyXG4gICAgXVxyXG4gIF0sXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGtHYW1lQ2xhc3NJZHMgPSBBcnJheS5mcm9tKGtHYW1lc0ZlYXR1cmVzLmtleXMoKSk7XHJcblxyXG5leHBvcnQgY29uc3Qga1dpbmRvd05hbWVzID0ge1xyXG4gIGluR2FtZTogJ2luX2dhbWUnLFxyXG4gIGRlc2t0b3A6ICdkZXNrdG9wJ1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGtIb3RrZXlzID0ge1xyXG4gIHRvZ2dsZTogJ3NhbXBsZV9hcHBfdHNfc2hvd2hpZGUnXHJcbn07XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQge1xyXG4gIE9XR2FtZXMsXHJcbiAgT1dHYW1lTGlzdGVuZXIsXHJcbiAgT1dXaW5kb3dcclxufSBmcm9tICdAb3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzJ1xyXG5cclxuaW1wb3J0IHsga1dpbmRvd05hbWVzLCBrR2FtZUNsYXNzSWRzIH0gZnJvbSAnLi4vY29uc3RzJ1xyXG5cclxuaW1wb3J0IFJ1bm5pbmdHYW1lSW5mbyA9IG92ZXJ3b2xmLmdhbWVzLlJ1bm5pbmdHYW1lSW5mbztcclxuaW1wb3J0IEFwcExhdW5jaFRyaWdnZXJlZEV2ZW50ID0gb3ZlcndvbGYuZXh0ZW5zaW9ucy5BcHBMYXVuY2hUcmlnZ2VyZWRFdmVudDtcclxuXHJcbi8vIFRoZSBiYWNrZ3JvdW5kIGNvbnRyb2xsZXIgaG9sZHMgYWxsIG9mIHRoZSBhcHAncyBiYWNrZ3JvdW5kIGxvZ2ljIC0gaGVuY2UgaXRzIG5hbWUuIGl0IGhhc1xyXG4vLyBtYW55IHBvc3NpYmxlIHVzZSBjYXNlcywgZm9yIGV4YW1wbGUgc2hhcmluZyBkYXRhIGJldHdlZW4gd2luZG93cywgb3IsIGluIG91ciBjYXNlLFxyXG4vLyBtYW5hZ2luZyB3aGljaCB3aW5kb3cgaXMgY3VycmVudGx5IHByZXNlbnRlZCB0byB0aGUgdXNlci4gVG8gdGhhdCBlbmQsIGl0IGhvbGRzIGEgZGljdGlvbmFyeVxyXG4vLyBvZiB0aGUgd2luZG93cyBhdmFpbGFibGUgaW4gdGhlIGFwcC5cclxuLy8gT3VyIGJhY2tncm91bmQgY29udHJvbGxlciBpbXBsZW1lbnRzIHRoZSBTaW5nbGV0b24gZGVzaWduIHBhdHRlcm4sIHNpbmNlIG9ubHkgb25lXHJcbi8vIGluc3RhbmNlIG9mIGl0IHNob3VsZCBleGlzdC5cclxuY2xhc3MgQmFja2dyb3VuZENvbnRyb2xsZXIge1xyXG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogQmFja2dyb3VuZENvbnRyb2xsZXJcclxuICBwcml2YXRlIF93aW5kb3dzOiBSZWNvcmQ8c3RyaW5nLCBPV1dpbmRvdz4gPSB7fTtcclxuICBwcml2YXRlIF9nYW1lTGlzdGVuZXI6IE9XR2FtZUxpc3RlbmVyO1xyXG5cclxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgLy8gUG9wdWxhdGluZyB0aGUgYmFja2dyb3VuZCBjb250cm9sbGVyJ3Mgd2luZG93IGRpY3Rpb25hcnlcclxuICAgIHRoaXMuX3dpbmRvd3Nba1dpbmRvd05hbWVzLmRlc2t0b3BdID0gbmV3IE9XV2luZG93KGtXaW5kb3dOYW1lcy5kZXNrdG9wKVxyXG5cclxuICAgIC8vIFdoZW4gYSBhIHN1cHBvcnRlZCBnYW1lIGdhbWUgaXMgc3RhcnRlZCBvciBpcyBlbmRlZCwgdG9nZ2xlIHRoZSBhcHAncyB3aW5kb3dzXHJcbiAgICB0aGlzLl9nYW1lTGlzdGVuZXIgPSBuZXcgT1dHYW1lTGlzdGVuZXIoe1xyXG4gICAgICBvbkdhbWVTdGFydGVkOiB0aGlzLnRvZ2dsZVdpbmRvd3MuYmluZCh0aGlzKSxcclxuICAgICAgb25HYW1lRW5kZWQ6IHRoaXMudG9nZ2xlV2luZG93cy5iaW5kKHRoaXMpXHJcbiAgICB9KTtcclxuXHJcbiAgICBvdmVyd29sZi5leHRlbnNpb25zLm9uQXBwTGF1bmNoVHJpZ2dlcmVkLmFkZExpc3RlbmVyKFxyXG4gICAgICBlID0+IHRoaXMub25BcHBMYXVuY2hUcmlnZ2VyZWQoZSlcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgLy8gSW1wbGVtZW50aW5nIHRoZSBTaW5nbGV0b24gZGVzaWduIHBhdHRlcm5cclxuICBwdWJsaWMgc3RhdGljIGluc3RhbmNlKCk6IEJhY2tncm91bmRDb250cm9sbGVyIHtcclxuICAgIGlmICghQmFja2dyb3VuZENvbnRyb2xsZXIuX2luc3RhbmNlKSB7XHJcbiAgICAgIEJhY2tncm91bmRDb250cm9sbGVyLl9pbnN0YW5jZSA9IG5ldyBCYWNrZ3JvdW5kQ29udHJvbGxlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBCYWNrZ3JvdW5kQ29udHJvbGxlci5faW5zdGFuY2U7XHJcbiAgfVxyXG5cclxuICAvLyBXaGVuIHJ1bm5pbmcgdGhlIGFwcCwgc3RhcnQgbGlzdGVuaW5nIHRvIGdhbWVzJyBzdGF0dXMgYW5kIGRlY2lkZSB3aGljaCB3aW5kb3cgc2hvdWxkXHJcbiAgLy8gYmUgbGF1bmNoZWQgZmlyc3QsIGJhc2VkIG9uIHdoZXRoZXIgYSBzdXBwb3J0ZWQgZ2FtZSBpcyBjdXJyZW50bHkgcnVubmluZ1xyXG4gIHB1YmxpYyBhc3luYyBydW4oKSB7XHJcbiAgICB0aGlzLl9nYW1lTGlzdGVuZXIuc3RhcnQoKVxyXG5cclxuICAgIGNvbnN0IGN1cnJXaW5kb3dOYW1lID0ga1dpbmRvd05hbWVzLmRlc2t0b3BcclxuXHJcbiAgICB0aGlzLl93aW5kb3dzW2N1cnJXaW5kb3dOYW1lXS5yZXN0b3JlKClcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgb25BcHBMYXVuY2hUcmlnZ2VyZWQoZTogQXBwTGF1bmNoVHJpZ2dlcmVkRXZlbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKCdvbkFwcExhdW5jaFRyaWdnZXJlZCgpOicsIGUpXHJcblxyXG4gICAgaWYgKCFlIHx8IGUub3JpZ2luLmluY2x1ZGVzKCdnYW1lbGF1bmNoZXZlbnQnKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGF3YWl0IHRoaXMuaXNTdXBwb3J0ZWRHYW1lUnVubmluZygpKSB7XHJcbiAgICAgIHRoaXMuX3dpbmRvd3Nba1dpbmRvd05hbWVzLmRlc2t0b3BdLmNsb3NlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl93aW5kb3dzW2tXaW5kb3dOYW1lcy5kZXNrdG9wXS5yZXN0b3JlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRvZ2dsZVdpbmRvd3MoaW5mbzogUnVubmluZ0dhbWVJbmZvKSB7XHJcbiAgICBpZiAoIWluZm8gfHwgIXRoaXMuaXNTdXBwb3J0ZWRHYW1lKGluZm8pKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaW5mby5pc1J1bm5pbmcpIHtcclxuICAgICAgdGhpcy5fd2luZG93c1trV2luZG93TmFtZXMuZGVza3RvcF0uY2xvc2UoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX3dpbmRvd3Nba1dpbmRvd05hbWVzLmRlc2t0b3BdLnJlc3RvcmUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgaXNTdXBwb3J0ZWRHYW1lUnVubmluZygpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgIGNvbnN0IGluZm8gPSBhd2FpdCBPV0dhbWVzLmdldFJ1bm5pbmdHYW1lSW5mbygpO1xyXG5cclxuICAgIHJldHVybiBpbmZvICYmIGluZm8uaXNSdW5uaW5nICYmIHRoaXMuaXNTdXBwb3J0ZWRHYW1lKGluZm8pO1xyXG4gIH1cclxuXHJcbiAgLy8gSWRlbnRpZnkgd2hldGhlciB0aGUgUnVubmluZ0dhbWVJbmZvIG9iamVjdCB3ZSBoYXZlIHJlZmVyZW5jZXMgYSBzdXBwb3J0ZWQgZ2FtZVxyXG4gIHByaXZhdGUgaXNTdXBwb3J0ZWRHYW1lKGluZm86IFJ1bm5pbmdHYW1lSW5mbykge1xyXG4gICAgcmV0dXJuIGtHYW1lQ2xhc3NJZHMuaW5jbHVkZXMoaW5mby5jbGFzc0lkKTtcclxuICB9XHJcbn1cclxuXHJcbkJhY2tncm91bmRDb250cm9sbGVyLmluc3RhbmNlKCkucnVuKCk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==