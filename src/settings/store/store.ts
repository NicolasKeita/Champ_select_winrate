/*
    Path + Filename: src/desktop/utils/store/store.ts
*/

import {configureStore} from '@reduxjs/toolkit'
import mainReducer from '../../background/store/reducer'

const sendActionToDesktopStore = store => next => action => {
	if (action.noDuplicate)
		return next(action)
	const desktopStore = overwolf.windows.getMainWindow().desktopStore
	if (desktopStore) {
		desktopStore.dispatch(Object.assign(action, {noDuplicate: true}))
	} else {
		console.error('DesktopStore is not yet in the backgroundWindow')
	}
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