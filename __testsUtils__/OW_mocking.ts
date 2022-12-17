/*
    Path + Filename: src/desktop/OW_mocking.ts
*/

import champ_select1 from './action1.json'
import champ_select2 from './action2.json'


export const overwolfMocked: typeof overwolf = {
	games: {
		launchers: {
			events: {
				//@ts-ignore
				onInfoUpdates: {
					addListener: (onInfoUpdates2Listener) => {}
				},
				setRequiredFeatures: () => {},
				getInfo: () => {}
			},
			getRunningLaunchersInfo: () => {},
			//@ts-ignore
			onLaunched: {
				addListener: () => {}
			},
			//@ts-ignore
			onTerminated: {
				addListener: () => {}
			}
		},
		//@ts-ignore
		events: {
			onError: {
				addListener: (onErrorListener) => {},
				removeListener: (onErrorListener) => {}
			},
			onInfoUpdates2: {
				addListener: (onInfoUpdates2Listener) => {},
				removeListener: (onInfoUpdates2Listener) => {}
			},
			onNewEvents: {
				addListener: (onNewEventsListener) => {},
				removeListener: (onNewEventsListener) => {}
			}
		}
	},
	//@ts-ignore
	windows: {
		dragMove: () => {},
		onStateChanged: {
			addListener: (callback) => {},
			removeListener: (callback) => {}
		}
	}
}

export function getRunningLaunchersInfo(callback) {
	const clientsInfos = {
		launchers: [{id: 109021}]
	}
	callback(clientsInfos)
}

export function onInfoUpdatesAddListener(callback: (event: any) => void) {
	const infoGameFlow = {
		feature: 'game_flow',
		info: {
			game_flow: {
				phase: 'Lobby'
			}
		}
	}
	setTimeout(callback, 500, infoGameFlow)
	infoGameFlow.info.game_flow.phase = 'ChampSelect'
	setTimeout(callback, 1000, infoGameFlow)
	const infoChampSelect = {
		feature: 'champ_select',
		info: {
			champ_select: {
				raw: JSON.stringify(champ_select1)
			}
		}
	}
	// setTimeout(callback, 1500, infoChampSelect)
	infoChampSelect.info.champ_select.raw = JSON.stringify(champ_select2)
	setTimeout(callback, 2000, infoChampSelect)
}

export function onTerminatedAddListener(callback) {
	setTimeout(callback, 500)
}
