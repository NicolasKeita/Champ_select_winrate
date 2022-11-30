/*
    Path + Filename: src/desktop/utils/store/store.ts
*/

import {configureStore, createReducer} from '@reduxjs/toolkit'
import Config from '../../components/maincontent/settings/Config'
import Champion from '../../components/maincontent/settings/Champion'
import {
	copyFromAnotherSetting,
	resetSettingsInternal,
	setChampions,
	setInternalSettings,
	setUserOPScore,
	toggleSettingsPage,
	updateAllUserScores
} from '@utils/store/action'

const initialState = {
	configSerialized: JSON.stringify({settingsPage: false, champions: []}),
	internalSettings: ''
}

let g_x = 0

const rootReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(resetSettingsInternal, (state, action) => {
			sessionStorage.removeItem('internalConfig')
			localStorage.setItem('config', action.payload)
			g_x += 1
			state.configSerialized = action.payload + ' '.repeat(g_x)
		})
		.addCase(toggleSettingsPage, (state) => {
			const configPlainObject = JSON.parse(state.configSerialized)
			configPlainObject.settingsPage = !configPlainObject.settingsPage
			state.configSerialized = JSON.stringify(configPlainObject)
		})
		.addCase(setChampions, (state, action) => {
			const configDeserialized = new Config(JSON.parse(state.configSerialized))
			for (const elem of Object.values(action.payload)) {
				const newChamp = new Champion(elem.name, elem.opScore_user, elem.opScore_CSW)
				const duplicate = configDeserialized.champions.find(elemConfig => elemConfig.name === elem.name)
				if (duplicate) {
					duplicate.name = elem.name
					duplicate.opScore_user = elem.opScore_user
					duplicate.opScore_CSW = elem.opScore_CSW
				} else
					configDeserialized.champions.push(newChamp)
			}
			state.configSerialized = configDeserialized.stringify()
		})
		.addCase(copyFromAnotherSetting, (state, action) => {
			const configDeserialized = new Config(JSON.parse(state.configSerialized))
			configDeserialized.copyFromAnotherSetting(action.payload)
			state.configSerialized = configDeserialized.stringify()
		})
		.addCase(setUserOPScore, (state, action) => {
			const configDeserialized = new Config(JSON.parse(state.configSerialized))
			const currentChamp = configDeserialized.getChampCurrConfig(action.payload.champName)
			if (currentChamp) {
				currentChamp.setUserScore(action.payload.score)
				state.configSerialized = configDeserialized.stringify()
			}
		})
		.addCase(setInternalSettings, (state, action) => {
			const configDeserialized = new Config(JSON.parse(state.configSerialized))
			const currentChamp = configDeserialized.getChampCurrConfig(action.payload.champName)
			if (currentChamp) {
				currentChamp.setUserScore(action.payload.score)
				state.internalSettings = JSON.stringify(configDeserialized.champions)
			}
		})
		.addCase(updateAllUserScores, (state, action) => {
			const configDeserialized = new Config(JSON.parse(state.configSerialized))
			for (const elem of Object.values(action.payload)) {
				const champion = configDeserialized.getChampCurrConfig(elem.name)
				if (champion)
					champion.opScore_user = elem.opScore_user
			}
			state.configSerialized = configDeserialized.stringify()
		})
})

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