/*
    Path + Filename: src/desktop/utils/store/store.ts
*/

import {configureStore} from '@reduxjs/toolkit'
import mainReducer from '../../../background/store/reducer'
import {kWindowNames} from '../../../consts'
import WindowStateEx = overwolf.windows.enums.WindowStateEx

const sendActionToSettingsStore = store => next => action => {
	if (!action.noDuplicate) {
		const settingsStore = overwolf.windows.getMainWindow().settingsStore
		overwolf.windows.getWindowState(kWindowNames.settings, (result) => {
			if (result.window_state_ex !== WindowStateEx.CLOSED && settingsStore) {
				settingsStore.dispatch(Object.assign(action, {noDuplicate: true}))
			}
		})
	}
	return next(action)
}

const store = configureStore({
	reducer: mainReducer,
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(sendActionToSettingsStore)
})

store.subscribe(() => {
	// console.log('new state desktop: ')
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
