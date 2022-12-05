/*
    Path + Filename: src/desktop/utils/store/store.ts
*/

import {
	combineReducers,
	configureStore, createAsyncThunk,
	createSlice,
	PayloadAction
} from '@reduxjs/toolkit'
import Config from '../../components/maincontent/settings/Config'
import {
	Champion,
	championConstructor,
	getDefaultChampion
} from '../../components/maincontent/settings/Champion'
import {
	getChampImgByName,
	getChampScore
} from '@utils/fetchDataDragon/fetchDataDragon'

export type ChampDisplayedType = {
	role: string | undefined | null
	champ: Champion
	recommendations: Champion[]
}

type ChampSelectDisplayedType = {
	allies: ChampDisplayedType[]
	enemies: ChampDisplayedType[]
}

export function getDefaultRecommendations(): Champion[] {
	const recommendations: Champion[] = []
	for (let i = 0; i < 5; ++i) {
		recommendations.push(getDefaultChampion())
	}
	return recommendations
}

function initChampSelectDisplayed() {
	const champSelectDisplayed: ChampSelectDisplayedType = {
		allies: [],
		enemies: []
	}
	for (let i = 0; i < 5; ++i) {
		champSelectDisplayed.allies.push({
			role: undefined,
			champ: getDefaultChampion(),
			recommendations: getDefaultRecommendations()
		})
		champSelectDisplayed.enemies.push({
			role: undefined,
			champ: getDefaultChampion(),
			recommendations: getDefaultRecommendations()
		})
	}
	return champSelectDisplayed
}

type StoreStateType = {
	configSerialized: string,
	internalSettings: string,
	footerMessageID: number,
	leagueClientStatus: number,
	champSelectDisplayed: ChampSelectDisplayedType,
	summonerName: string,
	summonerRegion: string,
	encryptedSummonerId: string
}

const initialState = {
	configSerialized: JSON.stringify({settingsPage: false, champions: []}),
	internalSettings: '',
	footerMessageID: -1,
	leagueClientStatus: -1,
	champSelectDisplayed: initChampSelectDisplayed(),
	summonerName: '',
	summonerRegion: '',
	encryptedSummonerId: ''
} as StoreStateType

let g_x = 0

function updateChampSelectDisplayedScores(champSelectDisplayed: ChampSelectDisplayedType, allChamps: Champion[]) {
	for (const elem of champSelectDisplayed.allies) {
		elem.champ.opScore_user = getChampScore(elem.champ.name, allChamps)
	}
	for (const elem of champSelectDisplayed.enemies) {
		elem.champ.opScore_user = getChampScore(elem.champ.name, allChamps)
	}
}

export const doChampionSuggestions = createAsyncThunk(
	'doChampionSuggestions',
	async (thunkParam, thunkAPI) => {
		const state: any = thunkAPI.getState()
		const configPlainObject: Config = JSON.parse(state.slice.configSerialized)
		configPlainObject.champions.sort((a, b) => b.opScore_user - a.opScore_user)
		const champSuggestions: Champion[] = []
		for (let i = 0; i < 5; ++i) {
			const champSuggested = configPlainObject.champions[i]
			champSuggested.imageUrl = await getChampImgByName(champSuggested.name)
			champSuggestions.push(champSuggested)
		}
		return champSuggestions
	}
)
// export const doChampionSuggestions = (allies, enemies, localCellId) => (async dispatch => {
// 	dispatch(doChampionSuggestionsInternal(allies, enemies, localCellId))
// })

const slice = createSlice({
	name: 'slice',
	initialState: initialState,
	reducers: {
		toggleSettingsPage: (state) => {
			const configPlainObject = JSON.parse(state.configSerialized)
			configPlainObject.settingsPage = !configPlainObject.settingsPage
			state.configSerialized = JSON.stringify(configPlainObject)
		},
		resetSettingsInternal: (state) => {
			const configPlainObject: Config = JSON.parse(state.configSerialized)
			if (!configPlainObject.champions) return
			configPlainObject.champions.length = 0
			sessionStorage.removeItem('internalConfig')
			g_x += 1
			state.configSerialized = JSON.stringify(configPlainObject) + ' '.repeat(g_x)
			updateChampSelectDisplayedScores(state.champSelectDisplayed, configPlainObject.champions)
		},
		setChampions: (state, action: PayloadAction<Champion[]>) => {
			const configDeserialized = new Config(JSON.parse(state.configSerialized))
			for (const elem of Object.values(action.payload)) {
				const newChamp = championConstructor(elem.name, elem.opScore_user, elem.opScore_CSW)
				const duplicate = configDeserialized.champions.find(elemConfig => elemConfig.name === elem.name)
				if (duplicate) {
					duplicate.name = elem.name
					duplicate.opScore_user = elem.opScore_user
					duplicate.opScore_CSW = elem.opScore_CSW
				} else
					configDeserialized.champions.push(newChamp)
			}
			localStorage.setItem('config', configDeserialized.stringify())
			state.configSerialized = configDeserialized.stringify()
			updateChampSelectDisplayedScores(state.champSelectDisplayed, configDeserialized.champions)
		},
		copyFromAnotherSetting: (state, action: PayloadAction<Config>) => {
			const configDeserialized = new Config(JSON.parse(state.configSerialized))
			configDeserialized.copyFromAnotherSetting(action.payload)
			state.configSerialized = configDeserialized.stringify()
		},
		setUserOPScore: {
			prepare: (score: number, champName: string) => ({
				payload: {score, champName}
			}),
			reducer: (state, action: PayloadAction<{score: number, champName: string}>) => {
				const configDeserialized = new Config(JSON.parse(state.configSerialized))
				const currentChamp = configDeserialized.getChampCurrConfig(action.payload.champName)
				if (currentChamp) {
					currentChamp.opScore_user = action.payload.score
					state.configSerialized = configDeserialized.stringify()
				}
			}
		},
		setInternalSettings: {
			prepare: (score: number, champName: string) => ({
				payload: {score, champName}
			}),
			reducer: (state, action: PayloadAction<{score: number, champName: string}>) => {
				const configDeserialized = new Config(JSON.parse(state.configSerialized))
				const currentChamp = configDeserialized.getChampCurrConfig(action.payload.champName)
				if (currentChamp) {
					currentChamp.opScore_user = action.payload.score
					state.internalSettings = JSON.stringify(configDeserialized.champions)
				}
			}
		},
		updateAllUserScores: (state, action: PayloadAction<Champion[]>) => {
			const configDeserialized = new Config(JSON.parse(state.configSerialized))
			for (const elem of Object.values(action.payload)) {
				const champion = configDeserialized.getChampCurrConfig(elem.name)
				if (champion)
					champion.opScore_user = elem.opScore_user
			}
			state.configSerialized = configDeserialized.stringify()
			localStorage.setItem('config', configDeserialized.stringify())
			updateChampSelectDisplayedScores(state.champSelectDisplayed, configDeserialized.champions)
		},
		setClientStatus: (state, action: PayloadAction<number>) => {
			state.leagueClientStatus = action.payload
			sessionStorage.setItem('clientStatus', action.payload.toString())
			if (((state.footerMessageID == 200 || state.footerMessageID == 201) && action.payload != -1) || action.payload != 2) {} else
				state.footerMessageID = action.payload
		},
		setFooterMessage: (state, action: PayloadAction<number>) => {
			state.footerMessageID = action.payload
		},
		resetChampSelectDisplayed: (state) => {
			state.champSelectDisplayed = initChampSelectDisplayed()
		},
		fillChampSelectDisplayedInternal: {
			prepare: (allies: ChampDisplayedType[], enemies: ChampDisplayedType[]) => ({
				payload: {allies, enemies}
			}),
			reducer: (state, action: PayloadAction<{allies: ChampDisplayedType[], enemies: ChampDisplayedType[]}>) => {
				state.champSelectDisplayed.allies = action.payload.allies
				for (const elem of state.champSelectDisplayed.allies) {
					elem.champ.opScore_user = getChampScore(elem.champ.name, JSON.parse(state.configSerialized).champions)
				}
				state.champSelectDisplayed.enemies = action.payload.enemies
				for (const elem of state.champSelectDisplayed.enemies) {
					elem.champ.opScore_user = getChampScore(elem.champ.name, JSON.parse(state.configSerialized).champions)
				}
			}
		},
		setSummonerInternal: {
			prepare: (summonerName: string, summonerRegion: string, encryptedSummonerId: string) => ({
				payload: {summonerName, summonerRegion, encryptedSummonerId}
			}),
			reducer: (state, action: PayloadAction<{summonerName: string, summonerRegion: string, encryptedSummonerId: string}>) => {
				state.summonerName = action.payload.summonerName
				state.summonerRegion = action.payload.summonerRegion
				state.encryptedSummonerId = action.payload.encryptedSummonerId
			}
		},
		setSummonerName: (state, action: PayloadAction<string>) => {
			state.summonerName = action.payload
		},
		setSummonerRegion: (state, action: PayloadAction<string>) => {
			state.summonerRegion = action.payload
		}
	},
	extraReducers: (builder) => {
		builder.addCase(doChampionSuggestions.fulfilled, (state, action) => {
			for (const elem of state.champSelectDisplayed.allies) {
				elem.recommendations = action.payload
			}
		})
		// [fetchToDoList.fulfilled]: (state, {meta, payload}) => {
		// 	if (meta.requestId === state.currentRequestId.requestId) {
		// 		state.todoList = payload
		// 		state.loading = 'fin'
		// 		state.currentRequestId = ''
		// 	}
		// },
		// [fetchToDoList.pending]: (state, {meta}) => {
		// 	state.currentRequestId = meta
		// 	state.loading = 'pending'
		// },
		// [fetchToDoList.rejected]: (state, {meta, payload, error}) => {
		// 	if (meta.requestId === state.currentRequestId.requestId) {
		// 		state.currentRequestId = meta
		// 		state.loading = 'fin'
		// 		state.todoList = payload
		// 		state.error = error
		// 	}
		// }
	}
})

export const {
	toggleSettingsPage,
	setChampions,
	updateAllUserScores,
	resetChampSelectDisplayed,
	fillChampSelectDisplayedInternal,
	resetSettingsInternal,
	copyFromAnotherSetting,
	setFooterMessage,
	setClientStatus
} = slice.actions

const mainReducer = combineReducers({
	slice: slice.reducer
})

export const store = configureStore({
	reducer: mainReducer
})

store.subscribe(() => {
	// console.log('new state : ')
	// console.log(store.getState().configSerialized)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch