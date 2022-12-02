/*
    Path + Filename: src/utils/LCU_API_connector/index.ts
*/

/* Overwolf is currently providing the connection to the LCU_API_connector */

import {setSummoner} from '@utils/store/action'

let onErrorListener, onInfoUpdates2Listener, onNewEventsListener
const g_interestedInFeatures = ['game_flow', 'summoner_info', 'champ_select']

export function registerEvents(handleFeaturesCallbacks) {
	onErrorListener = function(info) {
		console.log('CSW_Error onErrorFromOWApi: ' + JSON.stringify(info))
	}
	onInfoUpdates2Listener = info => {
		handleFeaturesCallbacks(info)
	}
	onNewEventsListener = function(info) {
	}
	overwolf.games.events.onError.addListener(onErrorListener)
	overwolf.games.launchers.events.onInfoUpdates.addListener(onInfoUpdates2Listener)
	overwolf.games.events.onNewEvents.addListener(onNewEventsListener)
}

export function unregisterEvents() {
	overwolf.games.events.onError.removeListener(onErrorListener)
	overwolf.games.events.onInfoUpdates2.removeListener(onInfoUpdates2Listener)
	overwolf.games.events.onNewEvents.removeListener(onNewEventsListener)
}

export function setFeatures() {
	overwolf.games.launchers.events.setRequiredFeatures(10902, g_interestedInFeatures, function(info) {
		if (info.error) {
			console.log(info.error)
			console.log('Trying in 2 seconds')
			window.setTimeout(setFeatures, 2000)
			return
		}
	})
}

class LCU_API_connector {
	private port: number
	private credentials: string

	constructor() {
		this.port = 0
		this.credentials = ''
	}

	public isLeagueClient(launcherInfo) {
		if (launcherInfo && launcherInfo.launchers && launcherInfo.launchers.length < 1) return false
		if (launcherInfo.id && Math.floor(launcherInfo.id / 10) == 10902) return true
		return Math.floor(launcherInfo.launchers[0].id / 10) == 10902
	}

	public onClientAlreadyRunningOrNot(callbackFunction) {
		overwolf.games.launchers.getRunningLaunchersInfo(callbackFunction)
	}

	public onClientLaunch(callbackFunction) {
		overwolf.games.launchers.onLaunched.addListener(callbackFunction)
	}

	public onClientClosed(callbackFunction) {
		overwolf.games.launchers.onTerminated.addListener(callbackFunction)
	}

	public addAllListeners(clientsInfos, callbackTMP) {
		if (this.isLeagueClient(clientsInfos)) unregisterEvents()
		registerEvents(callbackTMP)
		setTimeout(this.setFeatures, 1000)
	}

	public removeAllListeners() {
		unregisterEvents()
	}

	public getLoLClient(allClients) {
		let lolClient = null
		if (allClients && allClients.launchers)
			lolClient = allClients.launchers.find(elem => elem.id && Math.floor(elem.id / 10) == 10902)
		return (lolClient)
	}

	public storeSummonerName(lolClient, dispatch) {
		overwolf.games.launchers.events.getInfo(lolClient.classId, res => {
			if (res.success) {
				if (res.res && res.res.summoner_info) {
					dispatch(setSummoner(res.res.summoner_info.internal_name, res.res.summoner_info.platform_id))
				}
			}
		})
	}

	private setFeatures() {
		overwolf.games.launchers.events.setRequiredFeatures(10902, g_interestedInFeatures, function(info) {
			if (info.error) {
				console.log(info.error)
				console.log('Trying in 2 seconds')
				window.setTimeout(setFeatures, 2000)
				return
			}
		})
	}
}

export default LCU_API_connector
