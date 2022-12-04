/*
    Path + Filename: src/desktop/utils/store/store.ts
*/

import {configureStore, createReducer} from '@reduxjs/toolkit'
import Config from '../../components/maincontent/settings/Config'
import {Champion, ChampionConstructor, getDefaultChampion} from '../../components/maincontent/settings/Champion'
import {
	copyFromAnotherSetting, doChampionSuggestions, fillChampSelectDisplayedInternal, resetChampSelectDisplayed,
	resetSettingsInternal,
	setChampions,
	setClientStatus,
	setFooterMessage,
	setInternalSettings, setSummonerInternal, setSummonerName, setSummonerRegion, setUserOPScore,
	toggleSettingsPage,
	updateAllUserScores
} from '@utils/store/action'
import {getChampScore} from '@utils/fetchDataDragon/fetchDataDragon'

type ChampSelectDisplayedType = {
	allies: Champion[]
	enemies: Champion[]
	champRecommendations: Champion[]
}

function initChampSelectDisplayed() {
	const champSelectDisplayed: ChampSelectDisplayedType = {allies: [], enemies: [], champRecommendations: []}
	for (let i = 0; i < 5; ++i) {
		champSelectDisplayed.allies.push(getDefaultChampion())
		champSelectDisplayed.enemies.push(getDefaultChampion())
		champSelectDisplayed.champRecommendations.push(getDefaultChampion())
	}
	return champSelectDisplayed
}

const initialState = {
	configSerialized:     JSON.stringify({settingsPage: false, champions: []}),
	internalSettings:     '',
	footerMessageID:      -1,
	leagueClientStatus:   -1,
	champSelectDisplayed: initChampSelectDisplayed(),
	summonerName:         '',
	summonerRegion:       '',
	encryptedSummonerId:  '',
}

let g_x = 0

function updateChampSelectDisplayedScores(champSelectDisplayed: ChampSelectDisplayedType, allChamps: Champion[]) {
	for (const elem of champSelectDisplayed.allies) {
		elem.opScore_user = getChampScore(elem.name, allChamps)
	}
	for (const elem of champSelectDisplayed.enemies) {
		elem.opScore_user = getChampScore(elem.name, allChamps)
	}
}

const rootReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(toggleSettingsPage, (state) => {
			const configPlainObject = JSON.parse(state.configSerialized)
			configPlainObject.settingsPage = !configPlainObject.settingsPage
			state.configSerialized = JSON.stringify(configPlainObject)
		})
		.addCase(resetSettingsInternal, (state) => {
			const configPlainObject: Config = JSON.parse(state.configSerialized)
			if (!configPlainObject.champions) return
			configPlainObject.champions.length = 0
			sessionStorage.removeItem('internalConfig')
			g_x += 1
			state.configSerialized = JSON.stringify(configPlainObject) + ' '.repeat(g_x)
			updateChampSelectDisplayedScores(state.champSelectDisplayed, configPlainObject.champions)
		})
		.addCase(setChampions, (state, action) => {
			const configDeserialized = new Config(JSON.parse(state.configSerialized))
			for (const elem of Object.values(action.payload)) {
				const newChamp = new ChampionConstructor(elem.name, elem.opScore_user, elem.opScore_CSW)
				const duplicate = configDeserialized.champions.find(elemConfig => elemConfig.name === elem.name)
				if (duplicate) {
					duplicate.name = elem.name
					duplicate.opScore_user = elem.opScore_user
					duplicate.opScore_CSW = elem.opScore_CSW
				} else
					configDeserialized.champions.push(newChamp.toPlainObj())
			}
			localStorage.setItem('config', configDeserialized.stringify())
			state.configSerialized = configDeserialized.stringify()
			updateChampSelectDisplayedScores(state.champSelectDisplayed, configDeserialized.champions)
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
				currentChamp.opScore_user = action.payload.score
				state.configSerialized = configDeserialized.stringify()
			}
		})
		.addCase(setInternalSettings, (state, action) => {
			const configDeserialized = new Config(JSON.parse(state.configSerialized))
			const currentChamp = configDeserialized.getChampCurrConfig(action.payload.champName)
			if (currentChamp) {
				currentChamp.opScore_user = action.payload.score
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
			localStorage.setItem('config', configDeserialized.stringify())
			updateChampSelectDisplayedScores(state.champSelectDisplayed, configDeserialized.champions)
		})
		.addCase(setClientStatus, (state, action) => {
			state.leagueClientStatus = action.payload
			sessionStorage.setItem('clientStatus', action.payload.toString())
			if (((state.footerMessageID == 200 || state.footerMessageID == 201) && action.payload != -1) || action.payload != 2) {} else
				state.footerMessageID = action.payload
		})
		.addCase(setFooterMessage, (state, action) => {
			state.footerMessageID = action.payload
		})
		.addCase(resetChampSelectDisplayed, (state) => {
			state.champSelectDisplayed = initChampSelectDisplayed()
		})
		.addCase(fillChampSelectDisplayedInternal, (state, action) => {
			state.champSelectDisplayed.allies = action.payload.allies
			for (const elem of state.champSelectDisplayed.allies) {
				elem.opScore_user = getChampScore(elem.name, JSON.parse(state.configSerialized).champions)
			}
			state.champSelectDisplayed.enemies = action.payload.enemies
			for (const elem of state.champSelectDisplayed.enemies) {
				elem.opScore_user = getChampScore(elem.name, JSON.parse(state.configSerialized).champions)
			}
		})
		.addCase(setSummonerInternal, (state, action) => {
			state.summonerName = action.payload.summonerName
			state.summonerRegion = action.payload.summonerRegion
			state.encryptedSummonerId = action.payload.encryptedSummonerId
		})
		.addCase(setSummonerName, (state, action) => {
			state.summonerName = action.payload
		})
		.addCase(setSummonerRegion, (state, action) => {
			state.summonerRegion = action.payload
		})
		.addCase(doChampionSuggestions, (state, action) => {
			state.champSelectDisplayed.champRecommendations = []
			const configPlainObject : Config = JSON.parse(state.configSerialized)
			configPlainObject.champions.sort((a, b) => a.opScore_user - b.opScore_user)
			for (let i = 0; i < 5; ++i) {
				state.champSelectDisplayed.champRecommendations.push(configPlainObject.champions[i])
				console.log(state.champSelectDisplayed.champRecommendations)
			}
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