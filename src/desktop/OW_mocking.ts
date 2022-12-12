/*
    Path + Filename: src/desktop/OW_mocking.ts
*/


export const overwolf = {
	windows: {onStateChanged: {addListener: (callback) => {}}}
	// games: {launchers: {events: {getInfo: (numberr: any, callback: any) => {}}}}
}

// export interface overwolf {
// 	windows: {onStateChanged: {addListener: callback => {}}},
// games: {launchers: {events: getInfo(10902, callback => {})}}
// }

overwolf.windows.onStateChanged.addListener = callback => {}
// overwolf.games.launchers.events.getInfo(numberr, callback) {}
