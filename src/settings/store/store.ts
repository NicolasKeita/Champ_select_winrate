/*
    Path + Filename: src/desktop/utils/store/store.ts
*/

import {configureStore} from '@reduxjs/toolkit'
import mainReducer from '../../background/store/reducer'
import {kWindowNames} from '../../consts'

const sendActionToDesktopStore = store => next => action => {
	if (action.noDuplicate)
		return next(action)
	const desktopStore = overwolf.windows.getMainWindow().desktopStore
	// overwolf.windows.getWindowState(kWindowNames.desktop, (result) => {
	// 	console.log('result in setting')
	// 	console.log(result)
	// 	if (desktopStore) {
	// 		desktopStore.dispatch(Object.assign(action, {noDuplicate: true}))
	// 	} else {
	// 		console.error('DesktopStore is not yet in the backgroundWindow')
	// 	}
	// })
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