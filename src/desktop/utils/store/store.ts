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
import Config, {ConfigPage} from '../../components/maincontent/settings/Config'
import {
	Champion,
	getDefaultChampion
} from '../../components/maincontent/settings/Champion'
import {
	getChampImg,
	getChampImgByName,
	getChampName,
	getChampScoreByName,
	getChampScoreByNames,
	getChampSquareAsset
} from '@utils/fetchDataDragon/fetchDataDragon'
import {
	fetchAllChampionsJson
} from '@utils/fetchLocalConfigJson/fetchChampionsFromConfigJson'
import {fetchMatchHistory, fetchMatchHistoryId} from '@utils/LOL_API'
import {doWithRetry} from 'do-with-retry'
import {copy} from 'copy-anything'

export type ChampDisplayedType = {
	assignedRole: string
	champ: Champion
	recommendations: Champion[]
}

type ChampSelectDisplayedType = {
	allies: ChampDisplayedType[]
	enemies: ChampDisplayedType[]
}

export type HistoryDisplayedType = {
	allies: Champion[]
	enemies: Champion[]
	matchId: string,
	isLoading: boolean
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
			matchId: '0'
		})
	}
	return historyDisplayed
}

type StoreStateType = {
	configSerialized: string,
	internalSettings: string,
	footerMessageID: number,
	leagueClientStatus: number,
	champSelectDisplayed: ChampSelectDisplayedType,
	historyDisplayed: HistoryDisplayedType[],
	summonerName: string,
	summonerRegion: string,
	encryptedSummonerId: string
}

const initialState = {
	configSerialized: JSON.stringify({
		settingsPage: false,
		currentPage: ConfigPage.HISTORY,
		champions: []
	}),
	internalSettings: '',
	footerMessageID: -1,
	leagueClientStatus: -1,
	champSelectDisplayed: initChampSelectDisplayed(),
	historyDisplayed: initHistoryDisplayed(),
	summonerName: '',
	summonerRegion: '',
	encryptedSummonerId: ''
} as StoreStateType

let g_x = 0

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

	// for (const match of historyDisplayed) {
	// 	for (const ally of match.allies) {
	// 		ally.opScore_user = getChampScoreByName(ally.name, allChamps)
	// 	}
	// 	for (const enemy of match.enemies) {
	// 		enemy.opScore_user = getChampScoreByName(enemy.name, allChamps)
	// 	}
	// }

}

type FillChampSelectDisplayedParamType = {
	actions: never[][],
	localPlayerCellId: number,
	myTeam: never[]
}

function getRecommendations(allies: ChampDisplayedType[], playerId: number, allChamps: Champion[]): Champion[] {
	let assignedRole = allies[playerId].assignedRole
	if (assignedRole == '')
		assignedRole = 'utility'
	const allChampsFilteredWithRole = allChamps.filter(champ => champ.role == assignedRole)
	if (allChampsFilteredWithRole.length == 0)
		console.error('CSW_error: couldnt get recommendations')
	allChampsFilteredWithRole.sort((a, b) => (
		(b.opScore_user && a.opScore_user) ? b.opScore_user - a.opScore_user : 0
	))
	return allChampsFilteredWithRole.slice(0, 5)
}

type BothTeam = {
	allies: ChampDisplayedType[],
	enemies: ChampDisplayedType[]
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
		const options = {
			maxAttempts: 20,
			initTimeout: 1100
		}

		let matchHistoryIds: string[] | undefined
		// @ts-ignore
		matchHistoryIds = await doWithRetry(async retry => {
			try {
				return await fetchMatchHistoryId(thunkParam.region, thunkParam.puuid)
			} catch (e) {
				retry(e)
			}
		}, options)
			.catch(e => {
				console.error('All attempts to fetchMatchHistoryId failed')
				console.error(e.cause)
			})

		if (!matchHistoryIds || matchHistoryIds.length < 5)
			return
		const configDeserialized = new Config(JSON.parse(thunkAPI.getState().slice.configSerialized))
		if (matchHistoryIds.length) {
			for (const [i, matchHistoryId] of matchHistoryIds.entries()) {
				historyDisplayedTmp[i].matchId = matchHistoryId
				//TODO maybe matchId is already in the sessionStorage; if then don't fetch and just use the result you got previously inside sessionStorage
				let matchInfo: never
				// @ts-ignore
				matchInfo = await doWithRetry(async retry => {
					try {
						return await fetchMatchHistory(matchHistoryId, thunkParam.region)
					} catch (e) {
						retry(e)
					}
				}, options)
					.catch(e => {
						console.error('All attempts to fetchMatchHistory failed')
						console.error(e.cause)
					})

				let imInAllyTeam
				for (let x = 0; x < 10; ++x) {
					const participantChampName = matchInfo['info']['participants'][x]['championName']
					const encryptedSummonerId = (matchInfo['info']['participants'][x]['summonerId'])
					const myEncryptedSummonerId = sessionStorage.getItem('encryptedSummonerId')
					if (encryptedSummonerId == myEncryptedSummonerId && x < 5) {
						imInAllyTeam = true
					}
					if (x < 5) {
						historyDisplayedTmp[i].allies[x].name = participantChampName
						historyDisplayedTmp[i].allies[x].imageUrl = await getChampImgByName(participantChampName)
						historyDisplayedTmp[i].allies[x].opScore_user = configDeserialized.getChampCurrConfig(participantChampName)?.opScore_user // TODO replace by this one line the two above
					} else {
						historyDisplayedTmp[i].enemies[x - 5].name = participantChampName
						historyDisplayedTmp[i].enemies[x - 5].imageUrl = await getChampImgByName(participantChampName)
						historyDisplayedTmp[i].enemies[x - 5].opScore_user = configDeserialized.getChampCurrConfig(participantChampName)?.opScore_user
					}
				}
				if (!imInAllyTeam) {
					//TODO is it the cleanest way to swap?
					const tmpAlies = JSON.stringify(historyDisplayedTmp[i].allies)
					historyDisplayedTmp[i].allies = JSON.parse(JSON.stringify(historyDisplayedTmp[i].enemies))
					historyDisplayedTmp[i].enemies = JSON.parse(tmpAlies)
				}
				thunkAPI.dispatch(setHistoryMatch({
					historyDisplayedIndex: i,
					matchDisplayed: historyDisplayedTmp[i]
				}))
			}
		} else {
			// TODO tell user to do some games
		}
		// return historyDisplayedTmp
	})

export const fillChampSelectDisplayed = createAsyncThunk<BothTeam | void, FillChampSelectDisplayedParamType, {state: RootState}>(
	'fillChampSelectDisplayed',
	async (thunkParam, thunkAPI) => {
		if (thunkParam.actions.length == 0)
			return
		const allies: ChampDisplayedType[] = []
		const enemies: ChampDisplayedType[] = []
		const configPlainObject: Config = JSON.parse(thunkAPI.getState().slice.configSerialized)
		const allChamps = configPlainObject.champions

		for (let i = 0; i < 5; ++i) {
			allies.push({
				assignedRole: '',
				champ: getDefaultChampion(),
				recommendations: getDefaultRecommendations()
			})
			enemies.push({
				assignedRole: '',
				champ: getDefaultChampion(),
				recommendations: getDefaultRecommendations()
			})
		}

		async function fillChampNameAndImgUrlFromId(champion: Champion, championId: number) {
			if (championId == 0) return
			champion.imageUrl = await getChampImg(championId)
			champion.name = await getChampName(championId)
			champion.opScore_user = -1
		}

		function fillAssignedRoleAndRecommendations(allies: ChampDisplayedType[], myTeam: never[], actorCellId: number, allChamps: Champion[], isActorCellRightSide = false) {
			let actorCellIdTeam = actorCellId
			if (isActorCellRightSide) actorCellIdTeam += 5
			for (const {assignedPosition, cellId} of myTeam) {
				if (cellId === actorCellIdTeam) {
					allies[actorCellId].assignedRole = assignedPosition
					allies[actorCellId].recommendations = getRecommendations(allies, actorCellId, allChamps)
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
							await fillChampNameAndImgUrlFromId(allies[actorCellId].champ, championId)
							fillAssignedRoleAndRecommendations(allies, thunkParam.myTeam, actorCellId, allChamps)
						} else {
							await fillChampNameAndImgUrlFromId(enemies[actorCellIdEnemy].champ, championId)
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
						await fillChampNameAndImgUrlFromId(allies[actorCellId].champ, championId)
						fillAssignedRoleAndRecommendations(allies, thunkParam.myTeam, actorCellId, allChamps, isActorCellRightSide)
					} else {
						if (actorCellId >= 5)
							actorCellId -= 5
						await fillChampNameAndImgUrlFromId(enemies[actorCellId].champ, championId)
					}
				}
			}
		}

		for (const ally of allies) {
			for (const recommendation of ally.recommendations) {
				recommendation.imageUrl = await getChampSquareAsset(recommendation.image)
			}
		}
		return {allies: allies, enemies: enemies}
	})


export const slice = createSlice({
	name: 'slice',
	initialState: initialState,
	reducers: {
		toggleSettingsPage: (state) => {
			const configPlainObject: Config = JSON.parse(state.configSerialized)
			configPlainObject.settingsPage = !configPlainObject.settingsPage
			state.configSerialized = JSON.stringify(configPlainObject)
		},
		setHistoryIsLoading: (state, action: PayloadAction<{historyDisplayedIndex: number, isLoading: boolean}>) => {
			if (action.payload.historyDisplayedIndex == -1) {
				for (const historyMatchDisplayed of state.historyDisplayed)
					historyMatchDisplayed.isLoading = action.payload.isLoading
			} else
				state.historyDisplayed[action.payload.historyDisplayedIndex].isLoading = action.payload.isLoading
		},
		setHistoryMatch: (state, action: PayloadAction<{historyDisplayedIndex: number, matchDisplayed: HistoryDisplayedType}>) => {
			state.historyDisplayed[action.payload.historyDisplayedIndex] = action.payload.matchDisplayed
		},
		copyFromAnotherSetting: (state, action: PayloadAction<Config>) => {
			const configDeserialized = new Config(JSON.parse(state.configSerialized))
			configDeserialized.copyFromAnotherSetting(action.payload)
			state.configSerialized = configDeserialized.stringify()
		},
		updateAllUserScores: (state, action: PayloadAction<Champion[]>) => {
			const configDeserialized = new Config(JSON.parse(state.configSerialized))
			for (const elem of Object.values(action.payload)) {
				const champion = configDeserialized.getChampCurrConfig(elem.name)
				if (champion) champion.opScore_user = elem.opScore_user
				else console.log('CSW_error: couldnt update Score')
			}
			state.configSerialized = configDeserialized.stringify()
			localStorage.setItem('config', configDeserialized.stringify())
			if (configDeserialized.currentPage == ConfigPage.HISTORY)
				updateHistoryDisplayedScores(state.historyDisplayed, configDeserialized.champions)
			else if (configDeserialized.currentPage == ConfigPage.CHAMPSELECT)
				updateChampSelectDisplayedScores(state.champSelectDisplayed, configDeserialized.champions)
		},
		setClientStatus: (state, action: PayloadAction<number>) => {
			const configPlainObject: Config = JSON.parse(state.configSerialized)
			if (action.payload == 0)
				configPlainObject.currentPage = ConfigPage.CHAMPSELECT
			else
				configPlainObject.currentPage = ConfigPage.HISTORY
			state.configSerialized = JSON.stringify(configPlainObject)
			localStorage.setItem('config', state.configSerialized)

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
			const configPlainObject: Config = JSON.parse(state.configSerialized)
			if (!configPlainObject.champions) return
			configPlainObject.champions.length = 0
			sessionStorage.removeItem('internalConfig')
			const userConfigString = localStorage.getItem('config')
			if (!userConfigString)
				console.error('CSW_error: config in localstorage not found')
			else {
				const userConfig: Config = JSON.parse(userConfigString)
				for (const champion of userConfig.champions) {
					champion.opScore_user = champion.opScore_CSW
					configPlainObject.champions.push(champion)
				}
				localStorage.setItem('config', JSON.stringify(configPlainObject))
			}
			g_x += 1
			state.configSerialized = JSON.stringify(configPlainObject) + ' '.repeat(g_x)
			if (configPlainObject.currentPage == ConfigPage.CHAMPSELECT)
				updateChampSelectDisplayedScores(state.champSelectDisplayed, configPlainObject.champions)
			else if (configPlainObject.currentPage == ConfigPage.HISTORY)
				updateHistoryDisplayedScores(state.historyDisplayed, configPlainObject.champions)
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fillChampSelectDisplayed.fulfilled, (state, action) => {
			if (action.payload !== undefined) {
				state.champSelectDisplayed.allies = JSON.parse(JSON.stringify(action.payload.allies))
				for (const elem of state.champSelectDisplayed.allies) {
					elem.champ.opScore_user = getChampScoreByName(elem.champ.name, JSON.parse(state.configSerialized).champions)
				}
				state.champSelectDisplayed.enemies = JSON.parse(JSON.stringify(action.payload.enemies))
				for (const elem of state.champSelectDisplayed.enemies) {
					elem.champ.opScore_user = getChampScoreByName(elem.champ.name, JSON.parse(state.configSerialized).champions)
				}
			}
		})
		builder.addCase(fetchAllChampions.fulfilled, (state, action) => {
			const configDeserialized = new Config(JSON.parse(state.configSerialized))
			for (const elem of Object.values(action.payload)) {
				const duplicate = configDeserialized.champions.find(elemConfig => elemConfig.name === elem.name)
				if (duplicate) {
					const userScore = duplicate.opScore_user
					Object.assign(duplicate, copy(elem))
					duplicate.opScore_user = userScore
				} else
					configDeserialized.champions.push(copy(elem))
			}
			localStorage.setItem('config', configDeserialized.stringify())
			state.configSerialized = configDeserialized.stringify()
			updateChampSelectDisplayedScores(state.champSelectDisplayed, configDeserialized.champions)
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
	setHistoryMatch
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