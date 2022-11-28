/******/ ;(() => {
	// webpackBootstrap
	/******/ 'use strict'
	/******/ var __webpack_modules__ = {
		/***/ './node_modules/@overwolf/overwolf-api-ts/dist/index.js':
			/*!**************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/index.js ***!
  \**************************************************************/
			/***/ function (__unused_webpack_module, exports, __webpack_require__) {
				var __createBinding =
					(this && this.__createBinding) ||
					(Object.create
						? function (o, m, k, k2) {
								if (k2 === undefined) k2 = k
								Object.defineProperty(o, k2, {
									enumerable: true,
									get: function () {
										return m[k]
									}
								})
						  }
						: function (o, m, k, k2) {
								if (k2 === undefined) k2 = k
								o[k2] = m[k]
						  })
				var __exportStar =
					(this && this.__exportStar) ||
					function (m, exports) {
						for (var p in m) if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p)
					}
				Object.defineProperty(exports, '__esModule', {value: true})
				__exportStar(__webpack_require__(/*! ./ow-game-listener */ './node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js'), exports)
				__exportStar(__webpack_require__(/*! ./ow-games-events */ './node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js'), exports)
				__exportStar(__webpack_require__(/*! ./ow-games */ './node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js'), exports)
				__exportStar(__webpack_require__(/*! ./ow-hotkeys */ './node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js'), exports)
				__exportStar(__webpack_require__(/*! ./ow-listener */ './node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js'), exports)
				__exportStar(__webpack_require__(/*! ./ow-window */ './node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js'), exports)

				/***/
			},

		/***/ './node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js':
			/*!*************************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js ***!
  \*************************************************************************/
			/***/ (__unused_webpack_module, exports, __webpack_require__) => {
				Object.defineProperty(exports, '__esModule', {value: true})
				exports.OWGameListener = void 0
				const ow_listener_1 = __webpack_require__(/*! ./ow-listener */ './node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js')
				class OWGameListener extends ow_listener_1.OWListener {
					constructor(delegate) {
						super(delegate)
						this.onGameInfoUpdated = update => {
							if (!update || !update.gameInfo) {
								return
							}
							if (!update.runningChanged && !update.gameChanged) {
								return
							}
							if (update.gameInfo.isRunning) {
								if (this._delegate.onGameStarted) {
									this._delegate.onGameStarted(update.gameInfo)
								}
							} else {
								if (this._delegate.onGameEnded) {
									this._delegate.onGameEnded(update.gameInfo)
								}
							}
						}
						this.onRunningGameInfo = info => {
							if (!info) {
								return
							}
							if (info.isRunning) {
								if (this._delegate.onGameStarted) {
									this._delegate.onGameStarted(info)
								}
							}
						}
					}
					start() {
						super.start()
						overwolf.games.onGameInfoUpdated.addListener(this.onGameInfoUpdated)
						overwolf.games.getRunningGameInfo(this.onRunningGameInfo)
					}
					stop() {
						overwolf.games.onGameInfoUpdated.removeListener(this.onGameInfoUpdated)
					}
				}
				exports.OWGameListener = OWGameListener

				/***/
			},

		/***/ './node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js':
			/*!************************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js ***!
  \************************************************************************/
			/***/ (__unused_webpack_module, exports, __webpack_require__) => {
				Object.defineProperty(exports, '__esModule', {value: true})
				exports.OWGamesEvents = void 0
				const timer_1 = __webpack_require__(/*! ./timer */ './node_modules/@overwolf/overwolf-api-ts/dist/timer.js')
				class OWGamesEvents {
					constructor(delegate, requiredFeatures, featureRetries = 10) {
						this.onInfoUpdates = info => {
							this._delegate.onInfoUpdates(info.info)
						}
						this.onNewEvents = e => {
							this._delegate.onNewEvents(e)
						}
						this._delegate = delegate
						this._requiredFeatures = requiredFeatures
						this._featureRetries = featureRetries
					}
					async getInfo() {
						return new Promise(resolve => {
							overwolf.games.events.getInfo(resolve)
						})
					}
					async setRequiredFeatures() {
						let tries = 1,
							result
						while (tries <= this._featureRetries) {
							result = await new Promise(resolve => {
								overwolf.games.events.setRequiredFeatures(this._requiredFeatures, resolve)
							})
							if (result.status === 'success') {
								console.log('setRequiredFeatures(): success: ' + JSON.stringify(result, null, 2))
								return result.supportedFeatures.length > 0
							}
							await timer_1.Timer.wait(3000)
							tries++
						}
						console.warn('setRequiredFeatures(): failure after ' + tries + ' tries' + JSON.stringify(result, null, 2))
						return false
					}
					registerEvents() {
						this.unRegisterEvents()
						overwolf.games.events.onInfoUpdates2.addListener(this.onInfoUpdates)
						overwolf.games.events.onNewEvents.addListener(this.onNewEvents)
					}
					unRegisterEvents() {
						overwolf.games.events.onInfoUpdates2.removeListener(this.onInfoUpdates)
						overwolf.games.events.onNewEvents.removeListener(this.onNewEvents)
					}
					async start() {
						console.log(`[ow-game-events] START`)
						this.registerEvents()
						await this.setRequiredFeatures()
						const {res, status} = await this.getInfo()
						if (res && status === 'success') {
							this.onInfoUpdates({info: res})
						}
					}
					stop() {
						console.log(`[ow-game-events] STOP`)
						this.unRegisterEvents()
					}
				}
				exports.OWGamesEvents = OWGamesEvents

				/***/
			},

		/***/ './node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js':
			/*!*****************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js ***!
  \*****************************************************************/
			/***/ (__unused_webpack_module, exports) => {
				Object.defineProperty(exports, '__esModule', {value: true})
				exports.OWGames = void 0
				class OWGames {
					static getRunningGameInfo() {
						return new Promise(resolve => {
							overwolf.games.getRunningGameInfo(resolve)
						})
					}
					static classIdFromGameId(gameId) {
						let classId = Math.floor(gameId / 10)
						return classId
					}
					static async getRecentlyPlayedGames(limit = 3) {
						return new Promise(resolve => {
							if (!overwolf.games.getRecentlyPlayedGames) {
								return resolve(null)
							}
							overwolf.games.getRecentlyPlayedGames(limit, result => {
								resolve(result.games)
							})
						})
					}
					static async getGameDBInfo(gameClassId) {
						return new Promise(resolve => {
							overwolf.games.getGameDBInfo(gameClassId, resolve)
						})
					}
				}
				exports.OWGames = OWGames

				/***/
			},

		/***/ './node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js':
			/*!*******************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js ***!
  \*******************************************************************/
			/***/ (__unused_webpack_module, exports) => {
				Object.defineProperty(exports, '__esModule', {value: true})
				exports.OWHotkeys = void 0
				class OWHotkeys {
					constructor() {}
					static getHotkeyText(hotkeyId, gameId) {
						return new Promise(resolve => {
							overwolf.settings.hotkeys.get(result => {
								if (result && result.success) {
									let hotkey
									if (gameId === undefined) hotkey = result.globals.find(h => h.name === hotkeyId)
									else if (result.games && result.games[gameId]) hotkey = result.games[gameId].find(h => h.name === hotkeyId)
									if (hotkey) return resolve(hotkey.binding)
								}
								resolve('UNASSIGNED')
							})
						})
					}
					static onHotkeyDown(hotkeyId, action) {
						overwolf.settings.hotkeys.onPressed.addListener(result => {
							if (result && result.name === hotkeyId) action(result)
						})
					}
				}
				exports.OWHotkeys = OWHotkeys

				/***/
			},

		/***/ './node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js':
			/*!********************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js ***!
  \********************************************************************/
			/***/ (__unused_webpack_module, exports) => {
				Object.defineProperty(exports, '__esModule', {value: true})
				exports.OWListener = void 0
				class OWListener {
					constructor(delegate) {
						this._delegate = delegate
					}
					start() {
						this.stop()
					}
				}
				exports.OWListener = OWListener

				/***/
			},

		/***/ './node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js':
			/*!******************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js ***!
  \******************************************************************/
			/***/ (__unused_webpack_module, exports) => {
				Object.defineProperty(exports, '__esModule', {value: true})
				exports.OWWindow = void 0
				class OWWindow {
					constructor(name = null) {
						this._name = name
						this._id = null
					}
					async restore() {
						let that = this
						return new Promise(async resolve => {
							await that.assureObtained()
							let id = that._id
							overwolf.windows.restore(id, result => {
								if (!result.success) console.error(`[restore] - an error occurred, windowId=${id}, reason=${result.error}`)
								resolve()
							})
						})
					}
					async minimize() {
						let that = this
						return new Promise(async resolve => {
							await that.assureObtained()
							let id = that._id
							overwolf.windows.minimize(id, () => {})
							return resolve()
						})
					}
					async maximize() {
						let that = this
						return new Promise(async resolve => {
							await that.assureObtained()
							let id = that._id
							overwolf.windows.maximize(id, () => {})
							return resolve()
						})
					}
					async hide() {
						let that = this
						return new Promise(async resolve => {
							await that.assureObtained()
							let id = that._id
							overwolf.windows.hide(id, () => {})
							return resolve()
						})
					}
					async close() {
						let that = this
						return new Promise(async resolve => {
							await that.assureObtained()
							let id = that._id
							const result = await this.getWindowState()
							if (result.success && result.window_state !== 'closed') {
								await this.internalClose()
							}
							return resolve()
						})
					}
					dragMove(elem) {
						elem.className = elem.className + ' draggable'
						elem.onmousedown = e => {
							e.preventDefault()
							overwolf.windows.dragMove(this._name)
						}
					}
					async getWindowState() {
						let that = this
						return new Promise(async resolve => {
							await that.assureObtained()
							let id = that._id
							overwolf.windows.getWindowState(id, resolve)
						})
					}
					static async getCurrentInfo() {
						return new Promise(async resolve => {
							overwolf.windows.getCurrentWindow(result => {
								resolve(result.window)
							})
						})
					}
					obtain() {
						return new Promise((resolve, reject) => {
							const cb = res => {
								if (res && res.status === 'success' && res.window && res.window.id) {
									this._id = res.window.id
									if (!this._name) {
										this._name = res.window.name
									}
									resolve(res.window)
								} else {
									this._id = null
									reject()
								}
							}
							if (!this._name) {
								overwolf.windows.getCurrentWindow(cb)
							} else {
								overwolf.windows.obtainDeclaredWindow(this._name, cb)
							}
						})
					}
					async assureObtained() {
						let that = this
						return new Promise(async resolve => {
							await that.obtain()
							return resolve()
						})
					}
					async internalClose() {
						let that = this
						return new Promise(async (resolve, reject) => {
							await that.assureObtained()
							let id = that._id
							overwolf.windows.close(id, res => {
								if (res && res.success) resolve()
								else reject(res)
							})
						})
					}
				}
				exports.OWWindow = OWWindow

				/***/
			},

		/***/ './node_modules/@overwolf/overwolf-api-ts/dist/timer.js':
			/*!**************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/timer.js ***!
  \**************************************************************/
			/***/ (__unused_webpack_module, exports) => {
				Object.defineProperty(exports, '__esModule', {value: true})
				exports.Timer = void 0
				class Timer {
					constructor(delegate, id) {
						this._timerId = null
						this.handleTimerEvent = () => {
							this._timerId = null
							this._delegate.onTimer(this._id)
						}
						this._delegate = delegate
						this._id = id
					}
					static async wait(intervalInMS) {
						return new Promise(resolve => {
							setTimeout(resolve, intervalInMS)
						})
					}
					start(intervalInMS) {
						this.stop()
						this._timerId = setTimeout(this.handleTimerEvent, intervalInMS)
					}
					stop() {
						if (this._timerId == null) {
							return
						}
						clearTimeout(this._timerId)
						this._timerId = null
					}
				}
				exports.Timer = Timer

				/***/
			},

		/***/ './src/consts.ts':
			/*!***********************!*\
  !*** ./src/consts.ts ***!
  \***********************/
			/***/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
				__webpack_require__.r(__webpack_exports__)
				/* harmony export */ __webpack_require__.d(__webpack_exports__, {
					/* harmony export */ kGameClassIds: () => /* binding */ kGameClassIds,
					/* harmony export */ kGamesFeatures: () => /* binding */ kGamesFeatures,
					/* harmony export */ kHotkeys: () => /* binding */ kHotkeys,
					/* harmony export */ kWindowNames: () => /* binding */ kWindowNames
					/* harmony export */
				})
				const kGamesFeatures = new Map([
					[21216, ['kill', 'killed', 'killer', 'revived', 'death', 'match', 'match_info', 'rank', 'me', 'phase', 'location', 'team', 'items', 'counters']],
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
					[5426, ['live_client_data', 'matchState', 'match_info', 'death', 'respawn', 'abilities', 'kill', 'assist', 'gold', 'minions', 'summoner_info', 'gameMode', 'teams', 'level', 'announcer', 'counters', 'damage', 'heal']],
					[21634, ['match_info', 'game_info']],
					[8032, ['game_info', 'match_info']],
					[10844, ['game_info', 'match_info', 'kill', 'death']],
					[10906, ['kill', 'revived', 'death', 'killer', 'match', 'match_info', 'rank', 'counters', 'location', 'me', 'team', 'phase', 'map', 'roster']],
					[10826, ['game_info', 'match', 'match_info', 'roster', 'kill', 'death', 'me', 'defuser']],
					[21404, ['game_info', 'match_info', 'player', 'location', 'match', 'feed', 'connection', 'kill', 'death', 'portal', 'assist']],
					[7212, ['kill', 'death', 'me', 'match_info']],
					[21640, ['me', 'game_info', 'match_info', 'kill', 'death']],
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
					[21626, ['match_info', 'game_info', 'kill', 'death']],
					[8954, ['game_info', 'match_info']]
				])
				const kGameClassIds = Array.from(kGamesFeatures.keys())
				const kWindowNames = {
					inGame: 'in_game',
					desktop: 'desktop'
				}
				const kHotkeys = {
					toggle: 'sample_app_ts_showhide'
				}

				/***/
			}

		/******/
	}
	/************************************************************************/
	/******/ // The module cache
	/******/ var __webpack_module_cache__ = {}
	/******/
	/******/ // The require function
	/******/ function __webpack_require__(moduleId) {
		/******/ // Check if module is in cache
		/******/ var cachedModule = __webpack_module_cache__[moduleId]
		/******/ if (cachedModule !== undefined) {
			/******/ return cachedModule.exports
			/******/
		}
		/******/ // Create a new module (and put it into the cache)
		/******/ var module = (__webpack_module_cache__[moduleId] = {
			/******/ // no module.id needed
			/******/ // no module.loaded needed
			/******/ exports: {}
			/******/
		})
		/******/
		/******/ // Execute the module function
		/******/ __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__)
		/******/
		/******/ // Return the exports of the module
		/******/ return module.exports
		/******/
	}
	/******/
	/************************************************************************/
	/******/ /* webpack/runtime/compat get default export */
	/******/ ;(() => {
		/******/ // getDefaultExport function for compatibility with non-harmony modules
		/******/ __webpack_require__.n = module => {
			/******/ var getter = module && module.__esModule ? /******/ () => module['default'] : /******/ () => module
			/******/ __webpack_require__.d(getter, {a: getter})
			/******/ return getter
			/******/
		}
		/******/
	})()
	/******/
	/******/ /* webpack/runtime/define property getters */
	/******/ ;(() => {
		/******/ // define getter functions for harmony exports
		/******/ __webpack_require__.d = (exports, definition) => {
			/******/ for (var key in definition) {
				/******/ if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
					/******/ Object.defineProperty(exports, key, {enumerable: true, get: definition[key]})
					/******/
				}
				/******/
			}
			/******/
		}
		/******/
	})()
	/******/
	/******/ /* webpack/runtime/hasOwnProperty shorthand */
	/******/ ;(() => {
		/******/ __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
		/******/
	})()
	/******/
	/******/ /* webpack/runtime/make namespace object */
	/******/ ;(() => {
		/******/ // define __esModule on exports
		/******/ __webpack_require__.r = exports => {
			/******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
				/******/ Object.defineProperty(exports, Symbol.toStringTag, {value: 'Module'})
				/******/
			}
			/******/ Object.defineProperty(exports, '__esModule', {value: true})
			/******/
		}
		/******/
	})()
	/******/
	/************************************************************************/
	var __webpack_exports__ = {}
	// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
	;(() => {
		/*!***************************************!*\
  !*** ./src/background/background.tsx ***!
  \***************************************/
		__webpack_require__.r(__webpack_exports__)
		/* harmony import */ var _overwolf_overwolf_api_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @overwolf/overwolf-api-ts */ './node_modules/@overwolf/overwolf-api-ts/dist/index.js')
		/* harmony import */ var _overwolf_overwolf_api_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_overwolf_overwolf_api_ts__WEBPACK_IMPORTED_MODULE_0__)
		/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../consts */ './src/consts.ts')

		class BackgroundController {
			static _instance
			_windows = {}
			_gameListener
			constructor() {
				this._windows[_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.desktop] = new _overwolf_overwolf_api_ts__WEBPACK_IMPORTED_MODULE_0__.OWWindow(_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.desktop)
				this._windows[_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.inGame] = new _overwolf_overwolf_api_ts__WEBPACK_IMPORTED_MODULE_0__.OWWindow(_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.inGame)
				this._gameListener = new _overwolf_overwolf_api_ts__WEBPACK_IMPORTED_MODULE_0__.OWGameListener({
					onGameStarted: this.toggleWindows.bind(this),
					onGameEnded: this.toggleWindows.bind(this)
				})
				overwolf.extensions.onAppLaunchTriggered.addListener(e => this.onAppLaunchTriggered(e))
			}
			static instance() {
				if (!BackgroundController._instance) {
					BackgroundController._instance = new BackgroundController()
				}
				return BackgroundController._instance
			}
			async run() {
				const currWindowName = _consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.desktop
				this._windows[currWindowName].restore()
			}
			async onAppLaunchTriggered(e) {
				console.log('onAppLaunchTriggered():', e)
				if (!e || e.origin.includes('gamelaunchevent')) {
					return
				}
				if (await this.isSupportedGameRunning()) {
					this._windows[_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.desktop].close()
					this._windows[_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.inGame].restore()
				} else {
					this._windows[_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.desktop].restore()
					this._windows[_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.inGame].close()
				}
			}
			toggleWindows(info) {
				if (!info || !this.isSupportedGame(info)) {
					return
				}
				if (info.isRunning) {
					this._windows[_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.desktop].close()
					this._windows[_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.inGame].restore()
				} else {
					this._windows[_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.desktop].restore()
					this._windows[_consts__WEBPACK_IMPORTED_MODULE_1__.kWindowNames.inGame].close()
				}
			}
			async isSupportedGameRunning() {
				const info = await _overwolf_overwolf_api_ts__WEBPACK_IMPORTED_MODULE_0__.OWGames.getRunningGameInfo()
				return info && info.isRunning && this.isSupportedGame(info)
			}
			isSupportedGame(info) {
				return _consts__WEBPACK_IMPORTED_MODULE_1__.kGameClassIds.includes(info.classId)
			}
		}
		BackgroundController.instance().run()
	})()

	/******/
})()
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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b2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9jaGFtcF9zZWxlY3Rfd2lucmF0ZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3Qvb3ctZ2FtZS1saXN0ZW5lci5qcyIsIndlYnBhY2s6Ly9jaGFtcF9zZWxlY3Rfd2lucmF0ZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3Qvb3ctZ2FtZXMtZXZlbnRzLmpzIiwid2VicGFjazovL2NoYW1wX3NlbGVjdF93aW5yYXRlLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1nYW1lcy5qcyIsIndlYnBhY2s6Ly9jaGFtcF9zZWxlY3Rfd2lucmF0ZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3Qvb3ctaG90a2V5cy5qcyIsIndlYnBhY2s6Ly9jaGFtcF9zZWxlY3Rfd2lucmF0ZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3Qvb3ctbGlzdGVuZXIuanMiLCJ3ZWJwYWNrOi8vY2hhbXBfc2VsZWN0X3dpbnJhdGUvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LXdpbmRvdy5qcyIsIndlYnBhY2s6Ly9jaGFtcF9zZWxlY3Rfd2lucmF0ZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3QvdGltZXIuanMiLCJ3ZWJwYWNrOi8vY2hhbXBfc2VsZWN0X3dpbnJhdGUvLi9zcmMvY29uc3RzLnRzIiwid2VicGFjazovL2NoYW1wX3NlbGVjdF93aW5yYXRlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NoYW1wX3NlbGVjdF93aW5yYXRlL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2NoYW1wX3NlbGVjdF93aW5yYXRlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jaGFtcF9zZWxlY3Rfd2lucmF0ZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NoYW1wX3NlbGVjdF93aW5yYXRlL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2hhbXBfc2VsZWN0X3dpbnJhdGUvLi9zcmMvYmFja2dyb3VuZC9iYWNrZ3JvdW5kLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pKTtcclxudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWdhbWUtbGlzdGVuZXJcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctZ2FtZXMtZXZlbnRzXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWdhbWVzXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWhvdGtleXNcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctbGlzdGVuZXJcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctd2luZG93XCIpLCBleHBvcnRzKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0dhbWVMaXN0ZW5lciA9IHZvaWQgMDtcclxuY29uc3Qgb3dfbGlzdGVuZXJfMSA9IHJlcXVpcmUoXCIuL293LWxpc3RlbmVyXCIpO1xyXG5jbGFzcyBPV0dhbWVMaXN0ZW5lciBleHRlbmRzIG93X2xpc3RlbmVyXzEuT1dMaXN0ZW5lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZSkge1xyXG4gICAgICAgIHN1cGVyKGRlbGVnYXRlKTtcclxuICAgICAgICB0aGlzLm9uR2FtZUluZm9VcGRhdGVkID0gKHVwZGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXVwZGF0ZSB8fCAhdXBkYXRlLmdhbWVJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF1cGRhdGUucnVubmluZ0NoYW5nZWQgJiYgIXVwZGF0ZS5nYW1lQ2hhbmdlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh1cGRhdGUuZ2FtZUluZm8uaXNSdW5uaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGVsZWdhdGUub25HYW1lU3RhcnRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uR2FtZVN0YXJ0ZWQodXBkYXRlLmdhbWVJbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVFbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uR2FtZUVuZGVkKHVwZGF0ZS5nYW1lSW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25SdW5uaW5nR2FtZUluZm8gPSAoaW5mbykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWluZm8pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW5mby5pc1J1bm5pbmcpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVTdGFydGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25HYW1lU3RhcnRlZChpbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICBzdXBlci5zdGFydCgpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLm9uR2FtZUluZm9VcGRhdGVkLmFkZExpc3RlbmVyKHRoaXMub25HYW1lSW5mb1VwZGF0ZWQpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmdldFJ1bm5pbmdHYW1lSW5mbyh0aGlzLm9uUnVubmluZ0dhbWVJbmZvKTtcclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMub25HYW1lSW5mb1VwZGF0ZWQucmVtb3ZlTGlzdGVuZXIodGhpcy5vbkdhbWVJbmZvVXBkYXRlZCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0dhbWVMaXN0ZW5lciA9IE9XR2FtZUxpc3RlbmVyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XR2FtZXNFdmVudHMgPSB2b2lkIDA7XHJcbmNvbnN0IHRpbWVyXzEgPSByZXF1aXJlKFwiLi90aW1lclwiKTtcclxuY2xhc3MgT1dHYW1lc0V2ZW50cyB7XHJcbiAgICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZSwgcmVxdWlyZWRGZWF0dXJlcywgZmVhdHVyZVJldHJpZXMgPSAxMCkge1xyXG4gICAgICAgIHRoaXMub25JbmZvVXBkYXRlcyA9IChpbmZvKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uSW5mb1VwZGF0ZXMoaW5mby5pbmZvKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25OZXdFdmVudHMgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbk5ld0V2ZW50cyhlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX2RlbGVnYXRlID0gZGVsZWdhdGU7XHJcbiAgICAgICAgdGhpcy5fcmVxdWlyZWRGZWF0dXJlcyA9IHJlcXVpcmVkRmVhdHVyZXM7XHJcbiAgICAgICAgdGhpcy5fZmVhdHVyZVJldHJpZXMgPSBmZWF0dXJlUmV0cmllcztcclxuICAgIH1cclxuICAgIGFzeW5jIGdldEluZm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5nZXRJbmZvKHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgc2V0UmVxdWlyZWRGZWF0dXJlcygpIHtcclxuICAgICAgICBsZXQgdHJpZXMgPSAxLCByZXN1bHQ7XHJcbiAgICAgICAgd2hpbGUgKHRyaWVzIDw9IHRoaXMuX2ZlYXR1cmVSZXRyaWVzKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLnNldFJlcXVpcmVkRmVhdHVyZXModGhpcy5fcmVxdWlyZWRGZWF0dXJlcywgcmVzb2x2ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2V0UmVxdWlyZWRGZWF0dXJlcygpOiBzdWNjZXNzOiAnICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0LCBudWxsLCAyKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKHJlc3VsdC5zdXBwb3J0ZWRGZWF0dXJlcy5sZW5ndGggPiAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhd2FpdCB0aW1lcl8xLlRpbWVyLndhaXQoMzAwMCk7XHJcbiAgICAgICAgICAgIHRyaWVzKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUud2Fybignc2V0UmVxdWlyZWRGZWF0dXJlcygpOiBmYWlsdXJlIGFmdGVyICcgKyB0cmllcyArICcgdHJpZXMnICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0LCBudWxsLCAyKSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmVnaXN0ZXJFdmVudHMoKSB7XHJcbiAgICAgICAgdGhpcy51blJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uSW5mb1VwZGF0ZXMyLmFkZExpc3RlbmVyKHRoaXMub25JbmZvVXBkYXRlcyk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uTmV3RXZlbnRzLmFkZExpc3RlbmVyKHRoaXMub25OZXdFdmVudHMpO1xyXG4gICAgfVxyXG4gICAgdW5SZWdpc3RlckV2ZW50cygpIHtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMub25JbmZvVXBkYXRlczIucmVtb3ZlTGlzdGVuZXIodGhpcy5vbkluZm9VcGRhdGVzKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMub25OZXdFdmVudHMucmVtb3ZlTGlzdGVuZXIodGhpcy5vbk5ld0V2ZW50cyk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBzdGFydCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW293LWdhbWUtZXZlbnRzXSBTVEFSVGApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcclxuICAgICAgICBhd2FpdCB0aGlzLnNldFJlcXVpcmVkRmVhdHVyZXMoKTtcclxuICAgICAgICBjb25zdCB7IHJlcywgc3RhdHVzIH0gPSBhd2FpdCB0aGlzLmdldEluZm8oKTtcclxuICAgICAgICBpZiAocmVzICYmIHN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25JbmZvVXBkYXRlcyh7IGluZm86IHJlcyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbb3ctZ2FtZS1ldmVudHNdIFNUT1BgKTtcclxuICAgICAgICB0aGlzLnVuUmVnaXN0ZXJFdmVudHMoKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XR2FtZXNFdmVudHMgPSBPV0dhbWVzRXZlbnRzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XR2FtZXMgPSB2b2lkIDA7XHJcbmNsYXNzIE9XR2FtZXMge1xyXG4gICAgc3RhdGljIGdldFJ1bm5pbmdHYW1lSW5mbygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZ2V0UnVubmluZ0dhbWVJbmZvKHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGNsYXNzSWRGcm9tR2FtZUlkKGdhbWVJZCkge1xyXG4gICAgICAgIGxldCBjbGFzc0lkID0gTWF0aC5mbG9vcihnYW1lSWQgLyAxMCk7XHJcbiAgICAgICAgcmV0dXJuIGNsYXNzSWQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0UmVjZW50bHlQbGF5ZWRHYW1lcyhsaW1pdCA9IDMpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFvdmVyd29sZi5nYW1lcy5nZXRSZWNlbnRseVBsYXllZEdhbWVzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5nZXRSZWNlbnRseVBsYXllZEdhbWVzKGxpbWl0LCByZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQuZ2FtZXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBnZXRHYW1lREJJbmZvKGdhbWVDbGFzc0lkKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmdldEdhbWVEQkluZm8oZ2FtZUNsYXNzSWQsIHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dHYW1lcyA9IE9XR2FtZXM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dIb3RrZXlzID0gdm9pZCAwO1xyXG5jbGFzcyBPV0hvdGtleXMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIHN0YXRpYyBnZXRIb3RrZXlUZXh0KGhvdGtleUlkLCBnYW1lSWQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLnNldHRpbmdzLmhvdGtleXMuZ2V0KHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhvdGtleTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZ2FtZUlkID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdGtleSA9IHJlc3VsdC5nbG9iYWxzLmZpbmQoaCA9PiBoLm5hbWUgPT09IGhvdGtleUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXN1bHQuZ2FtZXMgJiYgcmVzdWx0LmdhbWVzW2dhbWVJZF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdGtleSA9IHJlc3VsdC5nYW1lc1tnYW1lSWRdLmZpbmQoaCA9PiBoLm5hbWUgPT09IGhvdGtleUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaG90a2V5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShob3RrZXkuYmluZGluZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCdVTkFTU0lHTkVEJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIG9uSG90a2V5RG93bihob3RrZXlJZCwgYWN0aW9uKSB7XHJcbiAgICAgICAgb3ZlcndvbGYuc2V0dGluZ3MuaG90a2V5cy5vblByZXNzZWQuYWRkTGlzdGVuZXIoKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5uYW1lID09PSBob3RrZXlJZClcclxuICAgICAgICAgICAgICAgIGFjdGlvbihyZXN1bHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dIb3RrZXlzID0gT1dIb3RrZXlzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XTGlzdGVuZXIgPSB2b2lkIDA7XHJcbmNsYXNzIE9XTGlzdGVuZXIge1xyXG4gICAgY29uc3RydWN0b3IoZGVsZWdhdGUpIHtcclxuICAgICAgICB0aGlzLl9kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xyXG4gICAgfVxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0xpc3RlbmVyID0gT1dMaXN0ZW5lcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV1dpbmRvdyA9IHZvaWQgMDtcclxuY2xhc3MgT1dXaW5kb3cge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSA9IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLl9pZCA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBhc3luYyByZXN0b3JlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5yZXN0b3JlKGlkLCByZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQuc3VjY2VzcylcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbcmVzdG9yZV0gLSBhbiBlcnJvciBvY2N1cnJlZCwgd2luZG93SWQ9JHtpZH0sIHJlYXNvbj0ke3Jlc3VsdC5lcnJvcn1gKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBtaW5pbWl6ZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MubWluaW1pemUoaWQsICgpID0+IHsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBtYXhpbWl6ZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MubWF4aW1pemUoaWQsICgpID0+IHsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBoaWRlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5oaWRlKGlkLCAoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgY2xvc2UoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmdldFdpbmRvd1N0YXRlKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyAmJlxyXG4gICAgICAgICAgICAgICAgKHJlc3VsdC53aW5kb3dfc3RhdGUgIT09ICdjbG9zZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5pbnRlcm5hbENsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGRyYWdNb3ZlKGVsZW0pIHtcclxuICAgICAgICBlbGVtLmNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lICsgJyBkcmFnZ2FibGUnO1xyXG4gICAgICAgIGVsZW0ub25tb3VzZWRvd24gPSBlID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmRyYWdNb3ZlKHRoaXMuX25hbWUpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBhc3luYyBnZXRXaW5kb3dTdGF0ZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuZ2V0V2luZG93U3RhdGUoaWQsIHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGdldEN1cnJlbnRJbmZvKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmdldEN1cnJlbnRXaW5kb3cocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0LndpbmRvdyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgb2J0YWluKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNiID0gcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMgJiYgcmVzLnN0YXR1cyA9PT0gXCJzdWNjZXNzXCIgJiYgcmVzLndpbmRvdyAmJiByZXMud2luZG93LmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faWQgPSByZXMud2luZG93LmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9uYW1lID0gcmVzLndpbmRvdy5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlcy53aW5kb3cpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faWQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX25hbWUpIHtcclxuICAgICAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuZ2V0Q3VycmVudFdpbmRvdyhjYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLm9idGFpbkRlY2xhcmVkV2luZG93KHRoaXMuX25hbWUsIGNiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgYXNzdXJlT2J0YWluZWQoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0Lm9idGFpbigpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgaW50ZXJuYWxDbG9zZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5jbG9zZShpZCwgcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMgJiYgcmVzLnN1Y2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XV2luZG93ID0gT1dXaW5kb3c7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuVGltZXIgPSB2b2lkIDA7XHJcbmNsYXNzIFRpbWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlbGVnYXRlLCBpZCkge1xyXG4gICAgICAgIHRoaXMuX3RpbWVySWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlVGltZXJFdmVudCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fdGltZXJJZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uVGltZXIodGhpcy5faWQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUgPSBkZWxlZ2F0ZTtcclxuICAgICAgICB0aGlzLl9pZCA9IGlkO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIHdhaXQoaW50ZXJ2YWxJbk1TKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIGludGVydmFsSW5NUyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGFydChpbnRlcnZhbEluTVMpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLl90aW1lcklkID0gc2V0VGltZW91dCh0aGlzLmhhbmRsZVRpbWVyRXZlbnQsIGludGVydmFsSW5NUyk7XHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl90aW1lcklkID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXJJZCk7XHJcbiAgICAgICAgdGhpcy5fdGltZXJJZCA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5UaW1lciA9IFRpbWVyO1xyXG4iLCJleHBvcnQgY29uc3Qga0dhbWVzRmVhdHVyZXMgPSBuZXcgTWFwPG51bWJlciwgc3RyaW5nW10+KFtcclxuICAvLyBGb3J0bml0ZVxyXG4gIFtcclxuICAgIDIxMjE2LFxyXG4gICAgW1xyXG4gICAgICAna2lsbCcsXHJcbiAgICAgICdraWxsZWQnLFxyXG4gICAgICAna2lsbGVyJyxcclxuICAgICAgJ3Jldml2ZWQnLFxyXG4gICAgICAnZGVhdGgnLFxyXG4gICAgICAnbWF0Y2gnLFxyXG4gICAgICAnbWF0Y2hfaW5mbycsXHJcbiAgICAgICdyYW5rJyxcclxuICAgICAgJ21lJyxcclxuICAgICAgJ3BoYXNlJyxcclxuICAgICAgJ2xvY2F0aW9uJyxcclxuICAgICAgJ3RlYW0nLFxyXG4gICAgICAnaXRlbXMnLFxyXG4gICAgICAnY291bnRlcnMnXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBDU0dPXHJcbiAgW1xyXG4gICAgNzc2NCxcclxuICAgIFtcclxuICAgICAgJ21hdGNoX2luZm8nLFxyXG4gICAgICAna2lsbCcsXHJcbiAgICAgICdkZWF0aCcsXHJcbiAgICAgICdhc3Npc3QnLFxyXG4gICAgICAnaGVhZHNob3QnLFxyXG4gICAgICAncm91bmRfc3RhcnQnLFxyXG4gICAgICAnbWF0Y2hfc3RhcnQnLFxyXG4gICAgICAnbWF0Y2hfaW5mbycsXHJcbiAgICAgICdtYXRjaF9lbmQnLFxyXG4gICAgICAndGVhbV9yb3VuZF93aW4nLFxyXG4gICAgICAnYm9tYl9wbGFudGVkJyxcclxuICAgICAgJ2JvbWJfY2hhbmdlJyxcclxuICAgICAgJ3JlbG9hZGluZycsXHJcbiAgICAgICdmaXJlZCcsXHJcbiAgICAgICd3ZWFwb25fY2hhbmdlJyxcclxuICAgICAgJ3dlYXBvbl9hY3F1aXJlZCcsXHJcbiAgICAgICdpbmZvJyxcclxuICAgICAgJ3Jvc3RlcicsXHJcbiAgICAgICdwbGF5ZXJfYWN0aXZpdHlfY2hhbmdlJyxcclxuICAgICAgJ3RlYW1fc2V0JyxcclxuICAgICAgJ3JlcGxheScsXHJcbiAgICAgICdjb3VudGVycycsXHJcbiAgICAgICdtdnAnLFxyXG4gICAgICAnc2NvcmVib2FyZCcsXHJcbiAgICAgICdraWxsX2ZlZWQnXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBMZWFndWUgb2YgTGVnZW5kc1xyXG4gIFtcclxuICAgIDU0MjYsXHJcbiAgICBbXHJcbiAgICAgICdsaXZlX2NsaWVudF9kYXRhJyxcclxuICAgICAgJ21hdGNoU3RhdGUnLFxyXG4gICAgICAnbWF0Y2hfaW5mbycsXHJcbiAgICAgICdkZWF0aCcsXHJcbiAgICAgICdyZXNwYXduJyxcclxuICAgICAgJ2FiaWxpdGllcycsXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ2Fzc2lzdCcsXHJcbiAgICAgICdnb2xkJyxcclxuICAgICAgJ21pbmlvbnMnLFxyXG4gICAgICAnc3VtbW9uZXJfaW5mbycsXHJcbiAgICAgICdnYW1lTW9kZScsXHJcbiAgICAgICd0ZWFtcycsXHJcbiAgICAgICdsZXZlbCcsXHJcbiAgICAgICdhbm5vdW5jZXInLFxyXG4gICAgICAnY291bnRlcnMnLFxyXG4gICAgICAnZGFtYWdlJyxcclxuICAgICAgJ2hlYWwnXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBFc2NhcGUgRnJvbSBUYXJrb3ZcclxuICBbXHJcbiAgICAyMTYzNCxcclxuICAgIFtcclxuICAgICAgJ21hdGNoX2luZm8nLFxyXG4gICAgICAnZ2FtZV9pbmZvJ1xyXG4gICAgXVxyXG4gIF0sXHJcbiAgLy8gTWluZWNyYWZ0XHJcbiAgW1xyXG4gICAgODAzMixcclxuICAgIFtcclxuICAgICAgJ2dhbWVfaW5mbycsXHJcbiAgICAgICdtYXRjaF9pbmZvJ1xyXG4gICAgXVxyXG4gIF0sXHJcbiAgLy8gT3ZlcndhdGNoXHJcbiAgW1xyXG4gICAgMTA4NDQsXHJcbiAgICBbXHJcbiAgICAgICdnYW1lX2luZm8nLFxyXG4gICAgICAnbWF0Y2hfaW5mbycsXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ2RlYXRoJ1xyXG4gICAgXVxyXG4gIF0sXHJcbiAgLy8gUFVCR1xyXG4gIFtcclxuICAgIDEwOTA2LFxyXG4gICAgW1xyXG4gICAgICAna2lsbCcsXHJcbiAgICAgICdyZXZpdmVkJyxcclxuICAgICAgJ2RlYXRoJyxcclxuICAgICAgJ2tpbGxlcicsXHJcbiAgICAgICdtYXRjaCcsXHJcbiAgICAgICdtYXRjaF9pbmZvJyxcclxuICAgICAgJ3JhbmsnLFxyXG4gICAgICAnY291bnRlcnMnLFxyXG4gICAgICAnbG9jYXRpb24nLFxyXG4gICAgICAnbWUnLFxyXG4gICAgICAndGVhbScsXHJcbiAgICAgICdwaGFzZScsXHJcbiAgICAgICdtYXAnLFxyXG4gICAgICAncm9zdGVyJ1xyXG4gICAgXVxyXG4gIF0sXHJcbiAgLy8gUmFpbmJvdyBTaXggU2llZ2VcclxuICBbXHJcbiAgICAxMDgyNixcclxuICAgIFtcclxuICAgICAgJ2dhbWVfaW5mbycsXHJcbiAgICAgICdtYXRjaCcsXHJcbiAgICAgICdtYXRjaF9pbmZvJyxcclxuICAgICAgJ3Jvc3RlcicsXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ2RlYXRoJyxcclxuICAgICAgJ21lJyxcclxuICAgICAgJ2RlZnVzZXInXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBTcGxpdGdhdGU6IEFyZW5hIFdhcmZhcmVcclxuICBbXHJcbiAgICAyMTQwNCxcclxuICAgIFtcclxuICAgICAgJ2dhbWVfaW5mbycsXHJcbiAgICAgICdtYXRjaF9pbmZvJyxcclxuICAgICAgJ3BsYXllcicsXHJcbiAgICAgICdsb2NhdGlvbicsXHJcbiAgICAgICdtYXRjaCcsXHJcbiAgICAgICdmZWVkJyxcclxuICAgICAgJ2Nvbm5lY3Rpb24nLFxyXG4gICAgICAna2lsbCcsXHJcbiAgICAgICdkZWF0aCcsXHJcbiAgICAgICdwb3J0YWwnLFxyXG4gICAgICAnYXNzaXN0J1xyXG4gICAgXVxyXG4gIF0sXHJcbiAgLy8gUGF0aCBvZiBFeGlsZVxyXG4gIFtcclxuICAgIDcyMTIsXHJcbiAgICBbXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ2RlYXRoJyxcclxuICAgICAgJ21lJyxcclxuICAgICAgJ21hdGNoX2luZm8nXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBWYWxvcmFudFxyXG4gIFtcclxuICAgIDIxNjQwLFxyXG4gICAgW1xyXG4gICAgICAnbWUnLFxyXG4gICAgICAnZ2FtZV9pbmZvJyxcclxuICAgICAgJ21hdGNoX2luZm8nLFxyXG4gICAgICAna2lsbCcsXHJcbiAgICAgICdkZWF0aCdcclxuICAgIF1cclxuICBdLFxyXG4gIC8vIERvdGEgMlxyXG4gIFtcclxuICAgIDczMTQsXHJcbiAgICBbXHJcbiAgICAgICdnYW1lX3N0YXRlX2NoYW5nZWQnLFxyXG4gICAgICAnbWF0Y2hfc3RhdGVfY2hhbmdlZCcsXHJcbiAgICAgICdtYXRjaF9kZXRlY3RlZCcsXHJcbiAgICAgICdkYXl0aW1lX2NoYW5nZWQnLFxyXG4gICAgICAnY2xvY2tfdGltZV9jaGFuZ2VkJyxcclxuICAgICAgJ3dhcmRfcHVyY2hhc2VfY29vbGRvd25fY2hhbmdlZCcsXHJcbiAgICAgICdtYXRjaF9lbmRlZCcsXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ2Fzc2lzdCcsXHJcbiAgICAgICdkZWF0aCcsXHJcbiAgICAgICdjcycsXHJcbiAgICAgICd4cG0nLFxyXG4gICAgICAnZ3BtJyxcclxuICAgICAgJ2dvbGQnLFxyXG4gICAgICAnaGVyb19sZXZlbGVkX3VwJyxcclxuICAgICAgJ2hlcm9fcmVzcGF3bmVkJyxcclxuICAgICAgJ2hlcm9fYnV5YmFja19pbmZvX2NoYW5nZWQnLFxyXG4gICAgICAnaGVyb19ib3VnaHRiYWNrJyxcclxuICAgICAgJ2hlcm9faGVhbHRoX21hbmFfaW5mbycsXHJcbiAgICAgICdoZXJvX3N0YXR1c19lZmZlY3RfY2hhbmdlZCcsXHJcbiAgICAgICdoZXJvX2F0dHJpYnV0ZXNfc2tpbGxlZCcsXHJcbiAgICAgICdoZXJvX2FiaWxpdHlfc2tpbGxlZCcsXHJcbiAgICAgICdoZXJvX2FiaWxpdHlfdXNlZCcsXHJcbiAgICAgICdoZXJvX2FiaWxpdHlfY29vbGRvd25fY2hhbmdlZCcsXHJcbiAgICAgICdoZXJvX2FiaWxpdHlfY2hhbmdlZCcsXHJcbiAgICAgICdoZXJvX2l0ZW1fY29vbGRvd25fY2hhbmdlZCcsXHJcbiAgICAgICdoZXJvX2l0ZW1fY2hhbmdlZCcsXHJcbiAgICAgICdoZXJvX2l0ZW1fdXNlZCcsXHJcbiAgICAgICdoZXJvX2l0ZW1fY29uc3VtZWQnLFxyXG4gICAgICAnaGVyb19pdGVtX2NoYXJnZWQnLFxyXG4gICAgICAnbWF0Y2hfaW5mbycsXHJcbiAgICAgICdyb3N0ZXInLFxyXG4gICAgICAncGFydHknLFxyXG4gICAgICAnZXJyb3InLFxyXG4gICAgICAnaGVyb19wb29sJyxcclxuICAgICAgJ21lJyxcclxuICAgICAgJ2dhbWUnXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBDYWxsIG9mIER1dHk6IFdhcnpvbmVcclxuICBbXHJcbiAgICAyMTYyNixcclxuICAgIFtcclxuICAgICAgJ21hdGNoX2luZm8nLFxyXG4gICAgICAnZ2FtZV9pbmZvJyxcclxuICAgICAgJ2tpbGwnLFxyXG4gICAgICAnZGVhdGgnXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBXYXJmcmFtZVxyXG4gIFtcclxuICAgIDg5NTQsXHJcbiAgICBbXHJcbiAgICAgICdnYW1lX2luZm8nLFxyXG4gICAgICAnbWF0Y2hfaW5mbydcclxuICAgIF1cclxuICBdLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCBrR2FtZUNsYXNzSWRzID0gQXJyYXkuZnJvbShrR2FtZXNGZWF0dXJlcy5rZXlzKCkpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGtXaW5kb3dOYW1lcyA9IHtcclxuICBpbkdhbWU6ICdpbl9nYW1lJyxcclxuICBkZXNrdG9wOiAnZGVza3RvcCdcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBrSG90a2V5cyA9IHtcclxuICB0b2dnbGU6ICdzYW1wbGVfYXBwX3RzX3Nob3doaWRlJ1xyXG59O1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHtcclxuICBPV0dhbWVzLFxyXG4gIE9XR2FtZUxpc3RlbmVyLFxyXG4gIE9XV2luZG93XHJcbn0gZnJvbSAnQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cydcclxuXHJcbmltcG9ydCB7IGtXaW5kb3dOYW1lcywga0dhbWVDbGFzc0lkcyB9IGZyb20gJy4uL2NvbnN0cydcclxuXHJcbmltcG9ydCBSdW5uaW5nR2FtZUluZm8gPSBvdmVyd29sZi5nYW1lcy5SdW5uaW5nR2FtZUluZm87XHJcbmltcG9ydCBBcHBMYXVuY2hUcmlnZ2VyZWRFdmVudCA9IG92ZXJ3b2xmLmV4dGVuc2lvbnMuQXBwTGF1bmNoVHJpZ2dlcmVkRXZlbnQ7XHJcblxyXG4vLyBUaGUgYmFja2dyb3VuZCBjb250cm9sbGVyIGhvbGRzIGFsbCBvZiB0aGUgYXBwJ3MgYmFja2dyb3VuZCBsb2dpYyAtIGhlbmNlIGl0cyBuYW1lLiBpdCBoYXNcclxuLy8gbWFueSBwb3NzaWJsZSB1c2UgY2FzZXMsIGZvciBleGFtcGxlIHNoYXJpbmcgZGF0YSBiZXR3ZWVuIHdpbmRvd3MsIG9yLCBpbiBvdXIgY2FzZSxcclxuLy8gbWFuYWdpbmcgd2hpY2ggd2luZG93IGlzIGN1cnJlbnRseSBwcmVzZW50ZWQgdG8gdGhlIHVzZXIuIFRvIHRoYXQgZW5kLCBpdCBob2xkcyBhIGRpY3Rpb25hcnlcclxuLy8gb2YgdGhlIHdpbmRvd3MgYXZhaWxhYmxlIGluIHRoZSBhcHAuXHJcbi8vIE91ciBiYWNrZ3JvdW5kIGNvbnRyb2xsZXIgaW1wbGVtZW50cyB0aGUgU2luZ2xldG9uIGRlc2lnbiBwYXR0ZXJuLCBzaW5jZSBvbmx5IG9uZVxyXG4vLyBpbnN0YW5jZSBvZiBpdCBzaG91bGQgZXhpc3QuXHJcbmNsYXNzIEJhY2tncm91bmRDb250cm9sbGVyIHtcclxuICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IEJhY2tncm91bmRDb250cm9sbGVyXHJcbiAgcHJpdmF0ZSBfd2luZG93czogUmVjb3JkPHN0cmluZywgT1dXaW5kb3c+ID0ge307XHJcbiAgcHJpdmF0ZSBfZ2FtZUxpc3RlbmVyOiBPV0dhbWVMaXN0ZW5lcjtcclxuXHJcbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcclxuICAgIC8vIFBvcHVsYXRpbmcgdGhlIGJhY2tncm91bmQgY29udHJvbGxlcidzIHdpbmRvdyBkaWN0aW9uYXJ5XHJcbiAgICB0aGlzLl93aW5kb3dzW2tXaW5kb3dOYW1lcy5kZXNrdG9wXSA9IG5ldyBPV1dpbmRvdyhrV2luZG93TmFtZXMuZGVza3RvcCk7XHJcbiAgICB0aGlzLl93aW5kb3dzW2tXaW5kb3dOYW1lcy5pbkdhbWVdID0gbmV3IE9XV2luZG93KGtXaW5kb3dOYW1lcy5pbkdhbWUpO1xyXG5cclxuICAgIC8vIFdoZW4gYSBhIHN1cHBvcnRlZCBnYW1lIGdhbWUgaXMgc3RhcnRlZCBvciBpcyBlbmRlZCwgdG9nZ2xlIHRoZSBhcHAncyB3aW5kb3dzXHJcbiAgICB0aGlzLl9nYW1lTGlzdGVuZXIgPSBuZXcgT1dHYW1lTGlzdGVuZXIoe1xyXG4gICAgICBvbkdhbWVTdGFydGVkOiB0aGlzLnRvZ2dsZVdpbmRvd3MuYmluZCh0aGlzKSxcclxuICAgICAgb25HYW1lRW5kZWQ6IHRoaXMudG9nZ2xlV2luZG93cy5iaW5kKHRoaXMpXHJcbiAgICB9KTtcclxuXHJcbiAgICBvdmVyd29sZi5leHRlbnNpb25zLm9uQXBwTGF1bmNoVHJpZ2dlcmVkLmFkZExpc3RlbmVyKFxyXG4gICAgICBlID0+IHRoaXMub25BcHBMYXVuY2hUcmlnZ2VyZWQoZSlcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgLy8gSW1wbGVtZW50aW5nIHRoZSBTaW5nbGV0b24gZGVzaWduIHBhdHRlcm5cclxuICBwdWJsaWMgc3RhdGljIGluc3RhbmNlKCk6IEJhY2tncm91bmRDb250cm9sbGVyIHtcclxuICAgIGlmICghQmFja2dyb3VuZENvbnRyb2xsZXIuX2luc3RhbmNlKSB7XHJcbiAgICAgIEJhY2tncm91bmRDb250cm9sbGVyLl9pbnN0YW5jZSA9IG5ldyBCYWNrZ3JvdW5kQ29udHJvbGxlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBCYWNrZ3JvdW5kQ29udHJvbGxlci5faW5zdGFuY2U7XHJcbiAgfVxyXG5cclxuICAvLyBXaGVuIHJ1bm5pbmcgdGhlIGFwcCwgc3RhcnQgbGlzdGVuaW5nIHRvIGdhbWVzJyBzdGF0dXMgYW5kIGRlY2lkZSB3aGljaCB3aW5kb3cgc2hvdWxkXHJcbiAgLy8gYmUgbGF1bmNoZWQgZmlyc3QsIGJhc2VkIG9uIHdoZXRoZXIgYSBzdXBwb3J0ZWQgZ2FtZSBpcyBjdXJyZW50bHkgcnVubmluZ1xyXG4gIHB1YmxpYyBhc3luYyBydW4oKSB7XHJcbiAgICAvL3RoaXMuX2dhbWVMaXN0ZW5lci5zdGFydCgpXHJcblxyXG4gICAgLy8gY29uc3QgY3VycldpbmRvd05hbWUgPSAoYXdhaXQgdGhpcy5pc1N1cHBvcnRlZEdhbWVSdW5uaW5nKCkpXHJcbiAgICAvLyAgID8ga1dpbmRvd05hbWVzLmluR2FtZVxyXG4gICAgLy8gICA6IGtXaW5kb3dOYW1lcy5kZXNrdG9wO1xyXG4gICAgY29uc3QgY3VycldpbmRvd05hbWUgPSBrV2luZG93TmFtZXMuZGVza3RvcFxyXG5cclxuICAgIHRoaXMuX3dpbmRvd3NbY3VycldpbmRvd05hbWVdLnJlc3RvcmUoKVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBvbkFwcExhdW5jaFRyaWdnZXJlZChlOiBBcHBMYXVuY2hUcmlnZ2VyZWRFdmVudCkge1xyXG4gICAgY29uc29sZS5sb2coJ29uQXBwTGF1bmNoVHJpZ2dlcmVkKCk6JywgZSlcclxuXHJcbiAgICBpZiAoIWUgfHwgZS5vcmlnaW4uaW5jbHVkZXMoJ2dhbWVsYXVuY2hldmVudCcpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYXdhaXQgdGhpcy5pc1N1cHBvcnRlZEdhbWVSdW5uaW5nKCkpIHtcclxuICAgICAgdGhpcy5fd2luZG93c1trV2luZG93TmFtZXMuZGVza3RvcF0uY2xvc2UoKTtcclxuICAgICAgdGhpcy5fd2luZG93c1trV2luZG93TmFtZXMuaW5HYW1lXS5yZXN0b3JlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl93aW5kb3dzW2tXaW5kb3dOYW1lcy5kZXNrdG9wXS5yZXN0b3JlKCk7XHJcbiAgICAgIHRoaXMuX3dpbmRvd3Nba1dpbmRvd05hbWVzLmluR2FtZV0uY2xvc2UoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdG9nZ2xlV2luZG93cyhpbmZvOiBSdW5uaW5nR2FtZUluZm8pIHtcclxuICAgIGlmICghaW5mbyB8fCAhdGhpcy5pc1N1cHBvcnRlZEdhbWUoaW5mbykpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpbmZvLmlzUnVubmluZykge1xyXG4gICAgICB0aGlzLl93aW5kb3dzW2tXaW5kb3dOYW1lcy5kZXNrdG9wXS5jbG9zZSgpO1xyXG4gICAgICB0aGlzLl93aW5kb3dzW2tXaW5kb3dOYW1lcy5pbkdhbWVdLnJlc3RvcmUoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX3dpbmRvd3Nba1dpbmRvd05hbWVzLmRlc2t0b3BdLnJlc3RvcmUoKTtcclxuICAgICAgdGhpcy5fd2luZG93c1trV2luZG93TmFtZXMuaW5HYW1lXS5jbG9zZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBpc1N1cHBvcnRlZEdhbWVSdW5uaW5nKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgY29uc3QgaW5mbyA9IGF3YWl0IE9XR2FtZXMuZ2V0UnVubmluZ0dhbWVJbmZvKCk7XHJcblxyXG4gICAgcmV0dXJuIGluZm8gJiYgaW5mby5pc1J1bm5pbmcgJiYgdGhpcy5pc1N1cHBvcnRlZEdhbWUoaW5mbyk7XHJcbiAgfVxyXG5cclxuICAvLyBJZGVudGlmeSB3aGV0aGVyIHRoZSBSdW5uaW5nR2FtZUluZm8gb2JqZWN0IHdlIGhhdmUgcmVmZXJlbmNlcyBhIHN1cHBvcnRlZCBnYW1lXHJcbiAgcHJpdmF0ZSBpc1N1cHBvcnRlZEdhbWUoaW5mbzogUnVubmluZ0dhbWVJbmZvKSB7XHJcbiAgICByZXR1cm4ga0dhbWVDbGFzc0lkcy5pbmNsdWRlcyhpbmZvLmNsYXNzSWQpO1xyXG4gIH1cclxufVxyXG5cclxuQmFja2dyb3VuZENvbnRyb2xsZXIuaW5zdGFuY2UoKS5ydW4oKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
