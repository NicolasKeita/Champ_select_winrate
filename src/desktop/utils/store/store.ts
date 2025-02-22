/*
    Path + Filename: src/desktop/utils/store/store.ts
*/

import {configureStore} from '@reduxjs/toolkit'
import mainReducer from '../../../background/store/reducer'

const sendActionToSettingsStore = store => next => action => {
	if (!action.noDuplicate) {
		const settingsStore = overwolf.windows.getMainWindow().settingsStore
		if (settingsStore) {
			settingsStore.dispatch(Object.assign(action, {noDuplicate: true}))
		}
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
