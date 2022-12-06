/*
    Path + Filename: src/desktop/utils/store/action.ts
*/

import {
	fetchChampionsFromConfigJson
} from '@utils/fetchLocalConfigJson/fetchChampionsFromConfigJson'
import {
	resetSettingsInternal,
	setChampions
} from '@utils/store/store'

export const populateDefaultConfig = () => (async dispatch => { // TODO migration to createSlice and createAsyncThunk?
	const allChamps = await fetchChampionsFromConfigJson()
	dispatch(setChampions(allChamps))
})

export const resetSettings = () => (async dispatch => {
	const allChamps = await fetchChampionsFromConfigJson()
	dispatch(resetSettingsInternal())
	dispatch(setChampions(allChamps))
})