/*
    Path + Filename: src/desktop/OW_mocking.ts
*/

export const overwolfMocked : typeof overwolf = {
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
