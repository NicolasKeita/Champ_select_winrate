/*
    Path + Filename: src/desktop/OW_mocking.ts
*/

import champ_select1 from './action1.json'
import champ_select2 from './action2.json'
import {copy} from 'copy-anything'

export const talonCSWScore = 35

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
		obtainDeclaredWindow: () => {},
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
	setTimeout(callback, 300, copy(infoGameFlow))
	infoGameFlow.info.game_flow.phase = 'ChampSelect'
	setTimeout(callback, 600, copy(infoGameFlow))
	const infoChampSelect = {
		feature: 'champ_select',
		info: {
			champ_select: {
				raw: JSON.stringify(champ_select1)
			}
		}
	}
	setTimeout(callback, 900, copy(infoChampSelect))
	infoChampSelect.info.champ_select.raw = JSON.stringify(champ_select2)
	setTimeout(callback, 1200, copy(infoChampSelect))
}

export function onInfoUpdatesAddListenerSpamChampSelect(callback: (event: any) => void) {
	const infoGameFlow = {
		feature: 'game_flow',
		info: {
			game_flow: {
				phase: 'Lobby'
			}
		}
	}
	const infoChampSelect = {
		feature: 'champ_select',
		info: {
			champ_select: {
				raw: JSON.stringify(champ_select1)
			}
		}
	}
	let i = 0
	let period = 300
	for (let x = 0; x < 10; ++x) {
		infoGameFlow.info.game_flow.phase = 'Lobby'
		setTimeout(callback, period * ++i, copy(infoGameFlow))
		infoGameFlow.info.game_flow.phase = 'ChampSelect'
		setTimeout(callback, period * ++i, copy(infoGameFlow))
		setTimeout(callback, period * ++i, infoChampSelect)
		infoGameFlow.info.game_flow.phase = 'Lobby'
	}
}

export function onTerminatedAddListener(callback) {
	setTimeout(callback, 500)
}
