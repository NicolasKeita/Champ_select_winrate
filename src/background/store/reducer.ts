/*
    Path + Filename: src/desktop/utils/store/reducer.ts
*/

import {combineReducers} from '@reduxjs/toolkit'
import {slice} from './slice/slice'

const mainReducer = combineReducers({
	slice: slice.reducer
})

export default mainReducer
