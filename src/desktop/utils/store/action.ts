/*
    Path + Filename: src/desktop/utils/store/action.ts
*/

import {createAction} from '@reduxjs/toolkit'
import Champion from '../../components/maincontent/settings/Champion'
import Config from '../../components/maincontent/settings/Config'

export const toggleSettingsPage = createAction('toggleSettingsPage')
export const resetSettingsInternal = createAction<string>('resetSettingsInternal')
export const setChampions = createAction<Champion[]>('setChampions')
export const copyFromAnotherSetting = createAction<Config>('copyFromAnotherSetting')
export const updateAllUserScores = createAction<Champion[]>('updateAllUserScores')
export const setUserOPScore = createAction('setUserOPScore', function prepare(score: number, champName: string) { return {payload: {score, champName}} })
export const setInternalSettings = createAction('setInternalSettings', function prepare(score: number, champName: string) { return {payload: {score, champName}}})

export const populateDefaultConfig = (cpy) => (async dispatch => { // TODO search createAsyncThunk() on redux toolkit, (it is a cleaner way to write this I think)
	await cpy.populateDefaultConfig()
	dispatch(setChampions(JSON.parse(cpy.stringifyChampions())))
})
export const resetSettings = (cpy) => (async dispatch => {
	await cpy.reset()
	dispatch(resetSettingsInternal(cpy.stringify()))
})

// .then(response => dispatch(loadGallerySuccess(response.data)))
// .catch(() => dispatch(loadGalleryError()));
