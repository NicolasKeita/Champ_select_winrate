/*
    Path + Filename: src/background/store/slice.ts
*/

import {
	createAsyncThunk,
	createSlice,
	PayloadAction
} from '@reduxjs/toolkit'
import Config, {
	configAssign,
	ConfigPage,
	getDefaultConfig
} from '../../../desktop/components/maincontent/settings/Config'
import {
	Champion
} from '../../../desktop/components/maincontent/settings/Champion'
import {
	getChampImgByFormattedName
} from '@utils/fetchDataDragon/fetchDataDragon'
import {
	fetchAllChampionsJson
} from '@utils/fetchLocalConfigJson/fetchChampionsFromConfigJson'
import {copy} from 'copy-anything'
import {
	fillHistoryDisplayed, HistoryDisplayedType,
	initHistoryDisplayed, updateHistoryValues
} from './fillHistoryDisplayed'
import {
	ChampSelectDisplayedType,
	fillChampSelectDisplayed,
	initChampSelectDisplayed,
	updateChampSelectDisplayedRecommendations,
	updateChampSelectDisplayedScores
} from './fillChampSelectDIsplayed'

type StoreStateType = {
	config: Config,
	internalSettings: string,
	footerMessageID: number,
	leagueClientStatus: number,
	champSelectDisplayed: ChampSelectDisplayedType,
	historyDisplayed: HistoryDisplayedType[],
	summonerName: string,
	summonerRegion: string,
	encryptedSummonerId: string,
	rerenderSettings: boolean,
	helpPageVisible: boolean
}

const initialState = {
	config: getDefaultConfig(),
	internalSettings: '',
	footerMessageID: -1,
	leagueClientStatus: -1,
	champSelectDisplayed: initChampSelectDisplayed(),
	historyDisplayed: initHistoryDisplayed(),
	summonerName: '',
	summonerRegion: '',
	encryptedSummonerId: '',
	rerenderSettings: false,
	helpPageVisible: false
} as StoreStateType

export const fetchAllChampions = createAsyncThunk<Champion[]>(
	'fetchAllChampions',
	async (thunkParam, {rejectWithValue}) => {
		try {
			return await fetchAllChampionsJson()
		} catch (e) {
			return rejectWithValue(e)
		}
	}
)

export const slice = createSlice({
	name: 'slice',
	initialState: initialState,
	reducers: {
		toggleSettingsPage: (state) => {
			state.config.settingsPage = !state.config.settingsPage
			state.helpPageVisible = false
		},
		toggleHelpPage: (state) => {
			state.helpPageVisible = !state.helpPageVisible
			state.config.settingsPage = false
		},
		setHistoryIsLoading: (state, action: PayloadAction<{historyDisplayedIndex: number | null, isLoading: boolean}>) => {
			if (action.payload.historyDisplayedIndex == null) {
				for (const historyMatchDisplayed of state.historyDisplayed)
					historyMatchDisplayed.isLoading = action.payload.isLoading
			} else
				state.historyDisplayed[action.payload.historyDisplayedIndex].isLoading = action.payload.isLoading
		},
		setHistoryMatch: (state, action: PayloadAction<{historyDisplayedIndex: number, matchDisplayed: HistoryDisplayedType}>) => {
			state.historyDisplayed[action.payload.historyDisplayedIndex] = action.payload.matchDisplayed
		},
		cleanHistoryMatch: (state) => {
			state.historyDisplayed = initHistoryDisplayed()
		},
		rerenderSettings: (state) => {
			state.rerenderSettings = !state.rerenderSettings
		},
		copyFromAnotherSetting: (state, action: PayloadAction<Config>) => {
			configAssign(state.config, action.payload)
		},
		updateChamp: (state, action: PayloadAction<{champName: string, champUserScore?: number, champImageUrl?: string}>) => {
			const championToChange = state.config.champions.find((champ) => champ.name == action.payload.champName)
			if (!championToChange) {
				console.error(`CSW_error: could not updateUserScore. Champ Name : ${action.payload.champName}, score : ${action.payload.champUserScore}`)
				return
			}
			if (action.payload.champUserScore != undefined)
				championToChange.opScore_user = action.payload.champUserScore
			if (action.payload.champImageUrl)
				championToChange.imageUrl = action.payload.champImageUrl
			//TODO there is a bunch of duplicate for the lines below
			localStorage.setItem('config', JSON.stringify(state.config))
			if (state.config.currentPage == ConfigPage.CHAMPSELECT) {
				updateChampSelectDisplayedScores(state.champSelectDisplayed, state.config.champions)
				updateChampSelectDisplayedRecommendations(state.champSelectDisplayed, state.config.champions)
			} else if (state.config.currentPage == ConfigPage.HISTORY)
				updateHistoryValues(state.historyDisplayed, state.config.champions)
		},
		updateAllUserScores: (state, action: PayloadAction<Champion[]>) => {
			for (const elem of Object.values(action.payload)) {
				const champion = state.config.champions.find((champ) => champ.name == elem.name)
				if (champion) champion.opScore_user = elem.opScore_user
				else console.log('CSW_error: couldnt update Score')
			}
			localStorage.setItem('config', JSON.stringify(state.config))
			if (state.config.currentPage == ConfigPage.CHAMPSELECT) {
				updateChampSelectDisplayedScores(state.champSelectDisplayed, state.config.champions)
				updateChampSelectDisplayedRecommendations(state.champSelectDisplayed, state.config.champions)
			} else if (state.config.currentPage == ConfigPage.HISTORY)
				updateHistoryValues(state.historyDisplayed, state.config.champions)
		},
		setClientStatus: (state, action: PayloadAction<number>) => {
			if (action.payload == 0 || (action.payload !== 0 && state.footerMessageID == 5))
				state.config.currentPage = ConfigPage.CHAMPSELECT
			else {
				state.config.currentPage = ConfigPage.HISTORY
			}
			localStorage.setItem('config', JSON.stringify(state.config))

			state.leagueClientStatus = action.payload
			sessionStorage.setItem('clientStatus', action.payload.toString())
		},
		setFooterMessage: (state, action: PayloadAction<number>) => {
			if ((state.footerMessageID == 200 || state.footerMessageID == 201) && !(action.payload >= 0 && action.payload <= 3))
				return
			state.footerMessageID = action.payload
			sessionStorage.setItem('footerMessageId', action.payload.toString())
		},
		resetChampSelectDisplayed: (state) => {
			state.champSelectDisplayed = initChampSelectDisplayed()
		},
		setSummonerName: (state, action: PayloadAction<string>) => {
			state.summonerName = action.payload
		},
		setSummonerRegion: (state, action: PayloadAction<string>) => {
			state.summonerRegion = action.payload
		},
		resetSettings: (state) => {
			for (const champ of state.config.champions) {
				champ.opScore_user = champ.opScore_CSW
			}
			sessionStorage.removeItem('internalConfig')
			localStorage.setItem('config', JSON.stringify(state.config))
			if (state.config.currentPage == ConfigPage.CHAMPSELECT) {
				updateChampSelectDisplayedScores(state.champSelectDisplayed, state.config.champions)
				updateChampSelectDisplayedRecommendations(state.champSelectDisplayed, state.config.champions)
			} else if (state.config.currentPage == ConfigPage.HISTORY)
				updateHistoryValues(state.historyDisplayed, state.config.champions)
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fillChampSelectDisplayed.fulfilled, (state, action) => {
			if (action.payload) {
				state.champSelectDisplayed.allies.splice(0, action.payload.allies.length, ...action.payload.allies)
				state.champSelectDisplayed.enemies.splice(0, action.payload.enemies.length, ...action.payload.enemies)
			}
		})
		builder.addCase(fillHistoryDisplayed.rejected, (state, action) => {
			slice.caseReducers.setHistoryIsLoading(state, {
				type: action.type,
				payload: {
					historyDisplayedIndex: null,
					isLoading: false
				}
			})
		})
		builder.addCase(fetchAllChampions.fulfilled, (state, action) => {
			for (const championPayload of Object.values(action.payload)) {
				championPayload.imageUrl = getChampImgByFormattedName(championPayload.nameFormatted)
				const duplicate = state.config.champions.find(elemConfig => elemConfig.name === championPayload.name)
				if (duplicate) {
					const userScore = duplicate.opScore_user
					const userTag = duplicate.tags
					Object.assign(duplicate, copy(championPayload))
					duplicate.opScore_user = userScore
					duplicate.tags = userTag
				} else
					state.config.champions.push(championPayload)
			}
			localStorage.setItem('config', JSON.stringify(state.config))
			if (state.config.currentPage == ConfigPage.CHAMPSELECT) {
				updateChampSelectDisplayedScores(state.champSelectDisplayed, state.config.champions)
				updateChampSelectDisplayedRecommendations(state.champSelectDisplayed, state.config.champions)
			} else if (state.config.currentPage == ConfigPage.HISTORY)
				updateHistoryValues(state.historyDisplayed, state.config.champions)
		})
		builder.addCase(fetchAllChampions.rejected, (_state, action) => {
			console.error(action.payload)
			console.error('CSW_error: fetchAllChampions failed, retrying in 5sec')
			setTimeout(fetchAllChampions, 5000)
			//TODO try this, should i add Dispatch?
		})
	}
})

export const {
	toggleSettingsPage,
	updateChamp,
	updateAllUserScores,
	resetChampSelectDisplayed,
	copyFromAnotherSetting,
	setFooterMessage,
	setClientStatus,
	resetSettings,
	setHistoryIsLoading,
	setHistoryMatch,
	cleanHistoryMatch,
	rerenderSettings,
	toggleHelpPage
} = slice.actions
