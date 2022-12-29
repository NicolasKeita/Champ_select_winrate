/*
    Path + Filename: src/desktop/utils/store/store.ts
*/

import {
	combineReducers,
	configureStore,
	createAsyncThunk,
	createSlice,
	PayloadAction
} from '@reduxjs/toolkit'
import Config, {
	configAssign,
	ConfigPage,
	getDefaultConfig
} from '../../components/maincontent/settings/Config'
import {
	Champion,
	getDefaultChampion
} from '../../components/maincontent/settings/Champion'
import {
	getChampImgByFormattedName,
	getChampScoreByName,
	getChampScoreByNames,
	getChampImgByNamePNG
} from '@utils/fetchDataDragon/fetchDataDragon'
import {
	fetchAllChampionsJson
} from '@utils/fetchLocalConfigJson/fetchChampionsFromConfigJson'
import {fetchMatchHistory, fetchMatchHistoryId} from '@utils/LOL_API'
import {doWithRetry} from 'do-with-retry'
import {copy} from 'copy-anything'
import {DeepReadonly} from 'ts-essentials'
import {
	FetchMatchHistoryType,
	Team
} from '@utils/LOL_API/fetchMatchHistory_type'

export type ChampDisplayedType = {
	assignedRole: string
	champ: Champion
	recommendations: Champion[]
}

export type ChampSelectDisplayedType = {
	allies: ChampDisplayedType[]
	enemies: ChampDisplayedType[]
}

export type HistoryDisplayedType = {
	allies: Champion[]
	enemies: Champion[]
	matchId: string,
	isLoading: boolean,
	userWon: boolean
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
			assignedRole: '',
			champ: getDefaultChampion(),
			recommendations: getDefaultRecommendations()
		})
		champSelectDisplayed.enemies.push({
			assignedRole: '',
			champ: getDefaultChampion(),
			recommendations: getDefaultRecommendations()
		})
	}
	return champSelectDisplayed
}

function initHistoryDisplayed() {
	const historyDisplayed: HistoryDisplayedType[] = []
	for (let i = 0; i < 5; ++i) {
		historyDisplayed.push({
			allies: getDefaultRecommendations(),
			enemies: getDefaultRecommendations(),
			isLoading: false,
			matchId: '0',
			userWon: true
		})
	}
	return historyDisplayed
}

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
	rerenderSettings: boolean
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
	rerenderSettings: false
} as StoreStateType

function updateChampSelectDisplayedScores(champSelectDisplayed: ChampSelectDisplayedType, allChamps: Champion[]) {
	const allChampsToQuery: string[] = []
	for (const ally of champSelectDisplayed.allies) {
		allChampsToQuery.push(ally.champ.name)
	}
	for (const enemy of champSelectDisplayed.enemies) {
		allChampsToQuery.push(enemy.champ.name)
	}
	const allChampsToQueryFulfilled = getChampScoreByNames(allChampsToQuery, allChamps)
	if (Object.keys(allChampsToQueryFulfilled).length == 0)
		return
	for (const ally of champSelectDisplayed.allies) {
		ally.champ.opScore_user = allChampsToQueryFulfilled[`${ally.champ.name}`]
	}
	for (const enemy of champSelectDisplayed.allies) {
		enemy.champ.opScore_user = allChampsToQueryFulfilled[`${enemy.champ.name}`]
	}
}

function updateHistoryDisplayedScores(historyDisplayed: HistoryDisplayedType[], allChamps: Champion[]) {
	const allChampsToQuery: string[] = []
	for (const match of historyDisplayed) {
		for (const ally of match.allies) {
			allChampsToQuery.push(ally.name)
		}
		for (const enemy of match.enemies) {
			allChampsToQuery.push(enemy.name)
		}
	}
	const allChampsToQueryFulfilled = getChampScoreByNames(allChampsToQuery, allChamps)
	if (Object.keys(allChampsToQueryFulfilled).length == 0)
		return
	for (const match of historyDisplayed) {
		for (const ally of match.allies) {
			ally.opScore_user = allChampsToQueryFulfilled[`${ally.name}`]
		}
		for (const enemy of match.enemies) {
			enemy.opScore_user = allChampsToQueryFulfilled[`${enemy.name}`]
		}
	}
}

type FillChampSelectDisplayedParamType = {
	actions: never[][],
	localPlayerCellId: number,
	myTeam: never[]
}

function getRecommendations(allies: ChampDisplayedType[], playerId: number, allChamps: readonly Champion[]): Champion[] {
	let assignedRole = allies[playerId].assignedRole
	if (assignedRole == '')
		assignedRole = 'utility'
	const allChampsFilteredWithRole = copy(allChamps.filter(champ => champ.role == assignedRole)) // TODO Laisser en readonly et ne pas copier, update les allchamps avec l'url
	if (allChampsFilteredWithRole.length == 0)
		console.error('CSW_error: couldnt get recommendations')
	allChampsFilteredWithRole.sort((a, b) => (
		(b.opScore_user && a.opScore_user) ? b.opScore_user - a.opScore_user : 0
	))
	return allChampsFilteredWithRole.slice(0, 5)
}

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

export const fillHistoryDisplayed = createAsyncThunk<void, {region: string, puuid: string}, {state: RootState}>(
	'fillHistoryDisplayed',
	async (thunkParam, thunkAPI) => {
		const historyDisplayedTmp: HistoryDisplayedType[] = initHistoryDisplayed()
		if (thunkParam.region == '' || thunkParam.puuid == '') {
			console.error('could not fill History')
			return
		}

		const matchHistoryIds = await doWithRetry(async retry => {
			try {
				return await fetchMatchHistoryId(thunkParam.region, thunkParam.puuid)
			} catch (e) {
				retry(e)
			}
		})
			.catch(e => {
				throw e.cause
			}) as string[]

		if (matchHistoryIds.length < 5) {
			for (let i = matchHistoryIds.length; i < 5; ++i) {
				thunkAPI.dispatch(setHistoryIsLoading({
					historyDisplayedIndex: i,
					isLoading: false
				}))
			}
			thunkAPI.dispatch(setFooterMessage(7))
		}
		const allChamps = thunkAPI.getState().slice.config.champions

		function getWinningTeam(teams: Team[]) {
			if (!teams.length || teams.length != 2) {
				console.error('CSW_history : Cannot find a winner for the game')
				return null
			}
			if (teams[0].win)
				return teams[0].teamId
			else if (!teams[0].win)
				return teams[1].teamId
			else {
				console.error('CSW_history : Cannot find a winner for the game')
				return null
			}
		}

		for (const [i, matchHistoryId] of matchHistoryIds.entries()) {
			historyDisplayedTmp[i].matchId = matchHistoryId
			//TODO maybe matchId is already in the sessionStorage; if then don't fetch and just use the result you got previously inside sessionStorage
			const matchInfo = await doWithRetry(async retry => {
				try {
					return await fetchMatchHistory(matchHistoryId, thunkParam.region)
				} catch (e) {
					retry(e)
				}
			})
				.catch(e => {
					throw e.cause
				}) as FetchMatchHistoryType

			historyDisplayedTmp[i].userWon = false
			const winningTeam = getWinningTeam(matchInfo.info.teams)
			let imInAllyTeam
			let userTeam = 100
			for (let x = 0; x < 10; ++x) {
				const participantChampName = matchInfo.info.participants[x].championName
				const encryptedSummonerId = (matchInfo.info.participants[x].summonerId)
				const myEncryptedSummonerId = sessionStorage.getItem('encryptedSummonerId')
				if (encryptedSummonerId == myEncryptedSummonerId) {
					if (x < 5) {
						imInAllyTeam = true
					}
					userTeam = matchInfo.info.participants[x].teamId
				}
				if (x < 5) {
					historyDisplayedTmp[i].allies[x].name = participantChampName
					historyDisplayedTmp[i].allies[x].imageUrl = getChampImgByFormattedName(participantChampName)
					historyDisplayedTmp[i].allies[x].opScore_user = allChamps.find((champ) => champ.name == participantChampName)?.opScore_user
				} else {
					historyDisplayedTmp[i].enemies[x - 5].name = participantChampName
					historyDisplayedTmp[i].enemies[x - 5].imageUrl = getChampImgByFormattedName(participantChampName)
					historyDisplayedTmp[i].enemies[x - 5].opScore_user = allChamps.find((champ) => champ.name == participantChampName)?.opScore_user
				}
			}
			if (!imInAllyTeam) {
				//TODO is it the cleanest way to swap?
				const tmpAlies = JSON.stringify(
					historyDisplayedTmp[i].allies
				)
				historyDisplayedTmp[i].allies = JSON.parse(
					JSON.stringify(historyDisplayedTmp[i].enemies)
				)
				historyDisplayedTmp[i].enemies = JSON.parse(tmpAlies)
			}
			historyDisplayedTmp[i].userWon = userTeam == winningTeam || winningTeam == null

			thunkAPI.dispatch(setHistoryMatch({
				historyDisplayedIndex: i,
				matchDisplayed: historyDisplayedTmp[i]
			}))
		}
	}
)

export const fillChampSelectDisplayed = createAsyncThunk<ChampSelectDisplayedType | void, FillChampSelectDisplayedParamType, {state: RootState}>(
	'fillChampSelectDisplayed',
	async (thunkParam, thunkAPI) => {
		if (thunkParam.actions.length == 0)
			return
		const champSelectDisplayed = initChampSelectDisplayed()
		const allies = champSelectDisplayed.allies
		const enemies = champSelectDisplayed.enemies
		// const configPlainObject: Config = JSON.parse(thunkAPI.getState().slice.configSerialized)
		const allChamps = Object.freeze(thunkAPI.getState().slice.config.champions)
		// const allChamps = configPlainObject.champions

		// //TODO merge this below, the return type and return ChampSELECTdisplayedType
		// for (let i = 0; i < 5; ++i) {
		// 	allies.push({
		// 		assignedRole: '',
		// 		champ: getDefaultChampion(),
		// 		recommendations: getDefaultRecommendations()
		// 	})
		// 	enemies.push({
		// 		assignedRole: '',
		// 		champ: getDefaultChampion(),
		// 		recommendations: getDefaultRecommendations()
		// 	})
		// }

		function fillChampNameAndImgUrlFromId(champion: Champion, championId: number) {
			if (championId == 0) return
			// const configPlainObject: Config = JSON.parse(thunkAPI.getState().slice.configSerialized)
			const championSearched = thunkAPI.getState().slice.config.champions.find((champ) => champ.id == championId)
			if (!championSearched) {
				console.error(`CSW_error: Store all champions is probably empty. Debug: champion Id : ${championId}`)
				return
			}
			champion.name = championSearched.name
			champion.imageUrl = getChampImgByFormattedName(championSearched.nameFormatted)
			champion.opScore_user = -1
		}

		function fillAssignedRoleAndRecommendations(allies: ChampDisplayedType[], myTeam: never[], actorCellId: number, allChamps: DeepReadonly<Champion[]>, isActorCellRightSide = false) {
			let actorCellIdTeam = actorCellId
			if (isActorCellRightSide) actorCellIdTeam += 5
			for (const {assignedPosition, cellId} of myTeam) {
				if (cellId === actorCellIdTeam) {
					allies[actorCellId].assignedRole = assignedPosition
					const recommendations = getRecommendations(allies, actorCellId, allChamps)
					allies[actorCellId].recommendations.splice(0, recommendations.length, ...recommendations)
				}
			}
		}

		//Custom solo without or with bans
		if (thunkParam.actions.length != 8) {
			let actorCellId: number, championId: number, isAllyAction: boolean,
				type: string, actorCellIdEnemy = 0
			for (const action of thunkParam.actions) {
				for ({
					actorCellId,
					championId,
					isAllyAction,
					type
				} of action) {
					if (type == 'pick') {
						if (isAllyAction) {
							fillChampNameAndImgUrlFromId(allies[actorCellId].champ, championId)
							fillAssignedRoleAndRecommendations(allies, thunkParam.myTeam, actorCellId, allChamps)
						} else {
							fillChampNameAndImgUrlFromId(enemies[actorCellIdEnemy].champ, championId)
							actorCellIdEnemy += 1
						}
					}
				}
			}
		}
		// Rift Mode with bans (doesn't support clash or tournament yet)
		else if (thunkParam.actions.length == 8) {
			for (let i = 2; i < thunkParam.actions.length; i++) {
				let actorCellId: number, championId: number
				for ({actorCellId, championId} of thunkParam.actions[i]) {
					const isActorCellRightSide = actorCellId >= 5
					if ((actorCellId < 5 && thunkParam.localPlayerCellId < 5) || (actorCellId >= 5 && thunkParam.localPlayerCellId >= 5)) {
						if (actorCellId >= 5)
							actorCellId -= 5
						fillChampNameAndImgUrlFromId(allies[actorCellId].champ, championId)
						fillAssignedRoleAndRecommendations(allies, thunkParam.myTeam, actorCellId, allChamps, isActorCellRightSide)
					} else {
						if (actorCellId >= 5)
							actorCellId -= 5
						fillChampNameAndImgUrlFromId(enemies[actorCellId].champ, championId)
					}
				}
			}
		}

		for (const ally of allies) {
			for (const recommendation of ally.recommendations) {
				// TODO Laisser en readonly et ne pas copier, update les allchamps avec l'url (dispatch)
				recommendation.imageUrl = getChampImgByNamePNG(recommendation.image)
			}
		}
		return champSelectDisplayed
	})


export const slice = createSlice({
	name: 'slice',
	initialState: initialState,
	reducers: {
		toggleSettingsPage: (state) => {
			// const configPlainObject: Config = JSON.parse(state.configSerialized)
			state.config.settingsPage = !state.config.settingsPage
			// configPlainObject.settingsPage = !configPlainObject.settingsPage
			// state.configSerialized = JSON.stringify(configPlainObject)
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
			// const configDeserialized = new Config(JSON.parse(state.configSerialized))
			// configDeserialized.copyFromAnotherSetting(action.payload)
			// state.configSerialized = configDeserialized.stringify()
			configAssign(state.config, action.payload)
		},
		updateAllUserScores: (state, action: PayloadAction<Champion[]>) => {
			// const configDeserialized = new Config(JSON.parse(state.configSerialized))
			for (const elem of Object.values(action.payload)) {
				const champion = state.config.champions.find((champ) => champ.name == elem.name)
				// const champion = configDeserialized.getChampCurrConfig(elem.name)
				if (champion) champion.opScore_user = elem.opScore_user
				else console.log('CSW_error: couldnt update Score')
			}
			// state.configSerialized = configDeserialized.stringify()
			localStorage.setItem('config', JSON.stringify(state.config))
			if (state.config.currentPage == ConfigPage.CHAMPSELECT)
				updateChampSelectDisplayedScores(state.champSelectDisplayed, state.config.champions)
			else if (state.config.currentPage == ConfigPage.HISTORY)
				updateHistoryDisplayedScores(state.historyDisplayed, state.config.champions)
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
			if (state.config.currentPage == ConfigPage.CHAMPSELECT)
				updateChampSelectDisplayedScores(state.champSelectDisplayed, state.config.champions)
			else if (state.config.currentPage == ConfigPage.HISTORY)
				updateHistoryDisplayedScores(state.historyDisplayed, state.config.champions)
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fillChampSelectDisplayed.fulfilled, (state, action) => {
			if (action.payload) {
				state.champSelectDisplayed.allies.splice(0, action.payload.allies.length, ...action.payload.allies)
				for (const ally of state.champSelectDisplayed.allies) {
					ally.champ.opScore_user = getChampScoreByName(ally.champ.name, state.config.champions)
				}
				state.champSelectDisplayed.enemies.splice(0, action.payload.enemies.length, ...action.payload.enemies)
				for (const enemy of state.champSelectDisplayed.enemies) {
					enemy.champ.opScore_user = getChampScoreByName(enemy.champ.name, state.config.champions)
				}
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
				const duplicate = state.config.champions.find(elemConfig => elemConfig.name === championPayload.name)
				if (duplicate) {
					const userScore = duplicate.opScore_user
					Object.assign(duplicate, copy(championPayload))
					duplicate.opScore_user = userScore
				} else
					state.config.champions.push(championPayload)
			}
			localStorage.setItem('config', JSON.stringify(state.config))
			if (state.config.currentPage == ConfigPage.CHAMPSELECT)
				updateChampSelectDisplayedScores(state.champSelectDisplayed, state.config.champions)
			else if (state.config.currentPage == ConfigPage.HISTORY)
				updateHistoryDisplayedScores(state.historyDisplayed, state.config.champions)
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
	updateAllUserScores,
	resetChampSelectDisplayed,
	copyFromAnotherSetting,
	setFooterMessage,
	setClientStatus,
	resetSettings,
	setHistoryIsLoading,
	setHistoryMatch,
	cleanHistoryMatch,
	rerenderSettings
} = slice.actions

const mainReducer = combineReducers({
	slice: slice.reducer
})

export const store = configureStore({
	reducer: mainReducer
})

store.subscribe(() => {
	// console.log('new state : ')
	// console.log(JSON.parse(store.getState().slice.configSerialized))
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch