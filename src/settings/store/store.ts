/*
    Path + Filename: src/desktop/utils/store/store.ts
*/

import {configureStore} from '@reduxjs/toolkit'
import mainReducer from '../../background/store/reducer'
import {kWindowNames} from '../../consts'
import WindowStateEx = overwolf.windows.enums.WindowStateEx

const sendActionToDesktopStore = store => next => action => {
	if (action.noDuplicate)
		return next(action)
	const desktopStore = overwolf.windows.getMainWindow().desktopStore
	// overwolf.windows.getWindowState(kWindowNames.desktop, (result) => {
	// 	if (result.window_state_ex != WindowStateEx.CLOSED &&
	if (desktopStore) {
		desktopStore.dispatch(Object.assign(action, {noDuplicate: true}))
	} else {
		console.error('CSW_error:' +
			'trying to send actions to the desktop windows but it is closed.' +
			'When the desktop window is closed the settings window should also be closed.')
	}
	// })
	return next(action)
}

const store = configureStore({
	reducer: mainReducer,
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(sendActionToDesktopStore)
})

store.subscribe(() => {
	// console.log('Setting subscribe: ')
	// console.log(JSON.stringify(store))
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store