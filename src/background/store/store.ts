/*
    Path + Filename: src/desktop/utils/store/store.ts
*/

import {configureStore} from '@reduxjs/toolkit'
import mainReducer from './reducer'
import {createStateSyncMiddleware, initMessageListener} from 'redux-state-sync'
import {rememberReducer} from 'redux-remember'

const store = configureStore({
	reducer: rememberReducer(mainReducer),
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(createStateSyncMiddleware({}))
})
initMessageListener(store)

store.subscribe(() => {
	console.log('new state Background: ')
	console.log(store.getState().slice)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
