// @ts-nocheck
/*
    Path + Filename: src/desktop/utils/store/store.ts
*/

import {configureStore} from '@reduxjs/toolkit'
import Config from '../../components/maincontent/settings/Config'
import produce from 'immer'
import Champion from '../../components/maincontent/settings/Champion'

const initialState = {
	configSerialized: JSON.stringify({settingsPage: false, champions: []}),
	internalSettings: ''
}

let g_x = 0

// Reducers
function rootReducer(state, action) {
	if (action.type === 'resetSettings') {
		return produce(state, (draft) => {
			sessionStorage.removeItem('internalConfig')
			localStorage.setItem('config', action.payload.cpy)
			g_x += 1
			draft.configSerialized = action.payload.cpy + ' '.repeat(g_x)
		})
	}
	if (action.type == 'toggleSettingsPage') {
		return produce(state, (draft) => {
			const configPlainObject = JSON.parse(draft.configSerialized)
			configPlainObject.settingsPage = !configPlainObject.settingsPage
			draft.configSerialized = JSON.stringify(configPlainObject)
		})
	}
	if (action.type == 'setChampions') {
		return produce(state, (draft) => {
			const configDeserialized = new Config(JSON.parse(draft.configSerialized))
			for (const elem of Object.values(action.payload.champions)) {
				const newChamp = new Champion(elem.name, elem.opScore_user, elem.opScore_CSW)
				const duplicate = configDeserialized.champions.find(elemConfig => elemConfig.name === elem.name)
				if (duplicate) {
					duplicate.name = elem.name
					duplicate.opScore_user = elem.opScore_user
					duplicate.opScore_CSW = elem.opScore_CSW
				} else
					configDeserialized.champions.push(newChamp)
			}
			draft.configSerialized = configDeserialized.stringify()
		})
	}
	if (action.type == 'copyFromAnotherSetting') {
		return produce(state, (draft) => {
			const configDeserialized = new Config(JSON.parse(draft.configSerialized))
			configDeserialized.copyFromAnotherSetting(action.payload.config)
			draft.configSerialized = configDeserialized.stringify()
		})
	}
	if (action.type == 'setUserOPScore') {
		return produce(state, (draft) => {
			const configDeserialized = new Config(JSON.parse(draft.configSerialized))
			configDeserialized.getChampCurrConfig(action.payload.champName).setUserScore(action.payload.score)
			draft.configSerialized = configDeserialized.stringify()
		})
	}
	if (action.type == 'setInternalSettings') {
		return produce(state, (draft) => {
			const configDeserialized = new Config(JSON.parse(draft.configSerialized))
			configDeserialized.getChampCurrConfig(action.payload.champName).setUserScore(action.payload.score)
			draft.internalSettings = JSON.stringify(configDeserialized.champions)
		})
	}
	if (action.type == 'updateAllUserScores') {
		return produce(state, (draft) => {
			const configDeserialized = new Config(JSON.parse(draft.configSerialized))
			for (const elem of Object.values(action.payload.champions)) {
				const champion = configDeserialized.getChampCurrConfig(elem.name)
				if (champion)
					champion.opScore_user = elem.opScore_user
			}
			draft.configSerialized = configDeserialized.stringify()
		})
	}
	return state
}

export const store = configureStore({
	reducer:        rootReducer,
	preloadedState: initialState
})

store.subscribe(() => {
	// console.log('new state : ')
	// console.log(store.getState().configSerialized)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch