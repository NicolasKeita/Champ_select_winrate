import {OWGames, OWGameListener, OWWindow} from '@overwolf/overwolf-api-ts'

import {kWindowNames, kGameClassIds} from '../consts'

import RunningGameInfo = overwolf.games.RunningGameInfo
import AppLaunchTriggeredEvent = overwolf.extensions.AppLaunchTriggeredEvent

import {store} from '@utils/store/store'
//@ts-ignore
window.store = store

// The background controller holds all of the app's background logic - hence its name. it has
// many possible use cases, for example sharing data between windows, or, in our case,
// managing which window is currently presented to the user. To that end, it holds a dictionary
// of the windows available in the app.
// Our background controller implements the Singleton design pattern, since only one
// instance of it should exist.
export class BackgroundController {
	private static _instance: BackgroundController
	private _windows: Record<string, OWWindow> = {}
	private _gameListener: OWGameListener

	private constructor() {
		// Populating the background controller's window dictionary
		this._windows[kWindowNames.desktop] = new OWWindow(kWindowNames.desktop)
		this._windows[kWindowNames.settings] = new OWWindow(
			kWindowNames.settings
		)

		this._gameListener = new OWGameListener({
			onGameStarted: this.toggleWindows.bind(this),
			onGameEnded: this.toggleWindows.bind(this)
		})

		overwolf.extensions.onAppLaunchTriggered.addListener(e =>
			this.onAppLaunchTriggered(e)
		)
	}

	// Implementing the Singleton design pattern
	public static instance(): BackgroundController {
		if (!BackgroundController._instance) {
			BackgroundController._instance = new BackgroundController()
		}

		return BackgroundController._instance
	}

	public async toggleSettingsWindow() {
		let settingsWindowState: string | undefined = undefined
		try {
			settingsWindowState = (
				await this._windows[kWindowNames.settings].getWindowState()
			).window_state
		} catch (e) {
			console.error('CSW_error: overwolf.window.getWindowState() failed')
			console.error(e)
		}
		if (settingsWindowState == 'minimized') {
			this._windows[kWindowNames.settings].restore()
		} else {
			this._windows[kWindowNames.settings].close()
		}
	}

	// When running the app, start listening to games' status and decide which window should
	// be launched first, based on whether a supported game is currently running
	public async run() {
		console.log('Run')
		this._gameListener.start()
		this._windows[kWindowNames.desktop].restore()
	}

	private async onAppLaunchTriggered(e: AppLaunchTriggeredEvent) {
		console.log('onAppLaunchTriggered():', e)

		if (!e || e.origin.includes('gamelaunchevent')) {
			return
		}
		this._windows[kWindowNames.desktop].restore()
		return

		// if (await this.isSupportedGameRunning()) {
		// 	this._windows[kWindowNames.desktop].close()
		// } else {
		// 	this._windows[kWindowNames.desktop].restore()
		// }
	}

	private toggleWindows(info: RunningGameInfo) {
		return
		// if (!info || !this.isSupportedGame(info)) {
		// 	return
		// }
		//
		// if (info.isRunning) {
		// 	this._windows[kWindowNames.desktop].close()
		// } else {
		// 	this._windows[kWindowNames.desktop].restore()
		// }
	}

	private async isSupportedGameRunning(): Promise<boolean> {
		const info = await OWGames.getRunningGameInfo()

		return info && info.isRunning && this.isSupportedGame(info)
	}

	// Identify whether the RunningGameInfo object we have references a supported game
	private isSupportedGame(info: RunningGameInfo) {
		return kGameClassIds.includes(info.classId)
	}
}

const BCInstance = BackgroundController.instance()
window.backgroundControllerInstance = BCInstance
BCInstance.run()