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
	Champion,
	getDefaultChampion
} from '../../../desktop/components/maincontent/settings/Champion'
import {
	getChampImgByFormattedName,
	getChampScoreByNames
} from '@utils/fetchDataDragon/fetchDataDragon'
import {
	fetchAllChampionsJson
} from '@utils/fetchLocalConfigJson/fetchChampionsFromConfigJson'
import {copy} from 'copy-anything'
import {RootState} from '@utils/store/store'
import {
	Action as ActionChampSelect,
	Team as TeamChampSelect
} from '../../../types/ChampSelect'
import {getTagsBonuses} from '@utils/champTags/champTags'
import {
	fillHistoryDisplayed, HistoryDisplayedType,
	initHistoryDisplayed, updateHistoryValues
} from './fillHistoryDisplayed'

export type ChampDisplayedType = {
	assignedRole: string
	champ: Champion
	scoreDisplayed: number
	recommendations: Champion[]
}

export type ChampSelectDisplayedType = {
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
			assignedRole: '',
			scoreDisplayed: 50,
			champ: getDefaultChampion(),
			recommendations: getDefaultRecommendations()
		})
		champSelectDisplayed.enemies.push({
			assignedRole: '',
			scoreDisplayed: 50,
			champ: getDefaultChampion(),
			recommendations: getDefaultRecommendations()
		})
	}
	return champSelectDisplayed
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

function updateChampSelectDisplayedScores(champSelectDisplayed: ChampSelectDisplayedType, allChamps: Champion[]) {
	const allChampsToQuery: string[] = []
	for (const ally of champSelectDisplayed.allies) {
		allChampsToQuery.push(ally.champ.name)
	}
	for (const enemy of champSelectDisplayed.enemies) {
		allChampsToQuery.push(enemy.champ.name)
	}
	const allChampsToQueryFulfilled = getChampScoreByNames(allChampsToQuery, allChamps)
	if (allChampsToQueryFulfilled.length == 0)
		return
	for (const ally of champSelectDisplayed.allies) {
		ally.champ.opScore_user = allChampsToQueryFulfilled.find(({champName}) => champName == ally.champ.name)?.opScore_user || 50
		// ally.champ.opScore_user = allChampsToQueryFulfilled[`${ally.champ.name}`]
		ally.scoreDisplayed = ally.champ.opScore_user || 50
		ally.scoreDisplayed = (ally.champ.opScore_user || 50) + getTagsBonuses(ally.champ, champSelectDisplayed.enemies.map(enemy => enemy.champ))
	}
	for (const enemy of champSelectDisplayed.enemies) {
		enemy.champ.opScore_user = allChampsToQueryFulfilled.find(({champName}) => champName == enemy.champ.name)?.opScore_user || 50
		// enemy.champ.opScore_user = allChampsToQueryFulfilled[`${enemy.champ.name}`]
		enemy.scoreDisplayed = enemy.champ.opScore_user || 50
	}
}

function updateChampSelectDisplayedRecommendations(champSelectDisplayed: ChampSelectDisplayedType, allChamps: Champion[]) {
	for (const [i, ally] of champSelectDisplayed.allies.entries()) {
		ally.recommendations = getRecommendations(champSelectDisplayed.allies, champSelectDisplayed.enemies, i, allChamps)
	}
}

type FillChampSelectDisplayedParamType = {
	actions: ActionChampSelect[][],
	localPlayerCellId: number,
	myTeam: TeamChampSelect[]
}

function updateDisplayedScoresWithTags(allies: ChampDisplayedType[], enemies: ChampDisplayedType[]) {
	for (const ally of allies) {
		ally.scoreDisplayed = (ally.champ.opScore_user || 50)
			+ getTagsBonuses(ally.champ, enemies.map(enemy => enemy.champ))
	}
}

function getRecommendations(allies: ChampDisplayedType[], enemies: ChampDisplayedType[], playerId: number, allChamps: Champion[]): Champion[] {
	let assignedRole = allies[playerId].assignedRole
	if (assignedRole == '') {
		if (playerId == 0 || playerId == 5) {
			assignedRole = 'top'
		}
		if (playerId == 1 || playerId == 6) {
			assignedRole = 'jungle'
		}
		if (playerId == 2 || playerId == 7) {
			assignedRole = 'middle'
		}
		if (playerId == 3 || playerId == 8) {
			assignedRole = 'bottom'
		}
		if (playerId == 4 || playerId == 9) {
			assignedRole = 'utility'
		}
	}
	updateDisplayedScoresWithTags(allies, enemies)

	const allChampsFilteredWithRole = allChamps.filter(({role}) => role == assignedRole)
	if (allChampsFilteredWithRole.length == 0)
		console.error('CSW_error: couldnt get recommendations')
	const allChampsWithDisplayedScore: [number, Champion][] = allChampsFilteredWithRole.map(champ => {
		const displayedScore = getTagsBonuses(champ, enemies.map(enemy => enemy.champ))
		return [displayedScore, champ]
	})
	allChampsWithDisplayedScore.sort((a, b) => b[0] - a[0])
	const firstFive = allChampsWithDisplayedScore.slice(0, 5)
	return (firstFive.map(elem => elem[1]))
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
//
// export const fillHistoryDisplayed = createAsyncThunk<void, {region: string, puuid: string}, {state: RootState}>(
// 	'fillHistoryDisplayed',
// 	async (thunkParam, thunkAPI) => {
// 		const historyDisplayedTmp: HistoryDisplayedType[] = initHistoryDisplayed()
// 		if (thunkParam.region == '' || thunkParam.puuid == '') {
// 			console.error('could not fill History')
// 			return
// 		}
//
// 		const matchHistoryIds = await doWithRetry(async retry => {
// 			try {
// 				return await fetchMatchHistoryId(thunkParam.region, thunkParam.puuid)
// 			} catch (e) {
// 				retry(e)
// 			}
// 		})
// 			.catch(e => {
// 				throw e.cause
// 			}) as string[]
//
// 		if (matchHistoryIds.length < 5) {
// 			for (let i = matchHistoryIds.length; i < 5; ++i) {
// 				thunkAPI.dispatch(setHistoryIsLoading({
// 					historyDisplayedIndex: i,
// 					isLoading: false
// 				}))
// 			}
// 			thunkAPI.dispatch(setFooterMessage(7))
// 		}
// 		const allChamps = thunkAPI.getState().slice.config.champions
//
// 		function getWinningTeam(teams: Team[]) {
// 			if (!teams.length || teams.length != 2) {
// 				console.error('CSW_history : Cannot find a winner for the game')
// 				return null
// 			}
// 			if (teams[0].win)
// 				return teams[0].teamId
// 			else if (!teams[0].win)
// 				return teams[1].teamId
// 			else {
// 				console.error('CSW_history : Cannot find a winner for the game')
// 				return null
// 			}
// 		}
//
// 		for (const [i, matchHistoryId] of matchHistoryIds.entries()) {
// 			historyDisplayedTmp[i].matchId = matchHistoryId
// 			//TODO maybe matchId is already in the sessionStorage; if then don't fetch and just use the result you got previously inside sessionStorage
// 			const matchInfo = await doWithRetry(async retry => {
// 				try {
// 					return await fetchMatchHistory(matchHistoryId, thunkParam.region)
// 				} catch (e) {
// 					retry(e)
// 				}
// 			})
// 				.catch(e => {
// 					throw e.cause
// 				}) as FetchMatchHistoryType
//
// 			historyDisplayedTmp[i].userWon = false
// 			const winningTeam = getWinningTeam(matchInfo.info.teams)
// 			let imInAllyTeam
// 			let userTeam = 100
// 			for (let x = 0; x < 10; ++x) {
// 				const participantChampName = matchInfo.info.participants[x].championName
// 				const encryptedSummonerId = (matchInfo.info.participants[x].summonerId)
// 				const myEncryptedSummonerId = sessionStorage.getItem('encryptedSummonerId')
// 				if (encryptedSummonerId == myEncryptedSummonerId) {
// 					if (x < 5) {
// 						imInAllyTeam = true
// 					}
// 					userTeam = matchInfo.info.participants[x].teamId
// 				}
// 				const champInAllChamps = allChamps.find(champ => champ.nameFormatted == participantChampName)
// 				if (x < 5) {
// 					historyDisplayedTmp[i].allies[x].champ = champInAllChamps || getDefaultChampion()
// 				} else {
// 					historyDisplayedTmp[i].enemies[x - 5].champ = champInAllChamps || getDefaultChampion()
// 					historyDisplayedTmp[i].enemies[x - 5].enhancedScore = historyDisplayedTmp[i].enemies[x - 5].champ.opScore_user || 50
// 				}
// 			}
//
// 			if (!imInAllyTeam)
// 				[historyDisplayedTmp[i].allies, historyDisplayedTmp[i].enemies] = [historyDisplayedTmp[i].enemies, historyDisplayedTmp[i].allies]
// 			for (const ally of historyDisplayedTmp[i].allies) {
// 				ally.enhancedScore =
// 					(ally.champ.opScore_user || 50)
// 					+ getTagsBonuses(ally.champ, historyDisplayedTmp[i].enemies.map(enemy => enemy.champ))
// 			}
// 			historyDisplayedTmp[i].userWon = userTeam == winningTeam || winningTeam == null
//
// 			thunkAPI.dispatch(setHistoryMatch({
// 				historyDisplayedIndex: i,
// 				matchDisplayed: historyDisplayedTmp[i]
// 			}))
// 		}
// 	}
// )

export const fillChampSelectDisplayed = createAsyncThunk<ChampSelectDisplayedType | void, FillChampSelectDisplayedParamType, {state: RootState}>(
	'fillChampSelectDisplayed',
	async (thunkParam, thunkAPI) => {
		if (thunkParam.actions.length == 0)
			return
		const champSelectDisplayed = initChampSelectDisplayed()
		const allies = champSelectDisplayed.allies
		const enemies = champSelectDisplayed.enemies
		const allChamps = thunkAPI.getState().slice.config.champions

		// function fillChampNameAndImgUrlFromId(champion: Champion, championId: number) {
		// 	if (championId == 0) return
		// 	const championSearched = thunkAPI.getState().slice.config.champions.find((champ) => champ.id == championId)
		// 	if (!championSearched) {
		// 		console.error(`CSW_error: Store all champions is probably empty. Debug: champion Id : ${championId}`)
		// 		return
		// 	}
		// 	return championSearched
		//TODO return ?

		// champion.name = championSearched.name
		// champion.imageUrl = getChampImgByFormattedName(championSearched.nameFormatted)
		// champion.opScore_user = -1
		// }

		function fillAssignedRoleAndRecommendations(allies: ChampDisplayedType[], enemies: ChampDisplayedType[], myTeam: TeamChampSelect[], actorCellId: number, allChamps: Champion[], isActorCellRightSide = false) {
			let actorCellIdTeam = actorCellId
			if (isActorCellRightSide) actorCellIdTeam += 5
			for (const {assignedPosition, cellId} of myTeam) {
				if (cellId === actorCellIdTeam) {
					allies[actorCellId].assignedRole = assignedPosition
					const recommendations = getRecommendations(allies, enemies, actorCellId, allChamps)
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
							if (championId != 0) {
								allies[actorCellId].champ = allChamps.find(({id}) => id == championId) || getDefaultChampion()
								allies[actorCellId].scoreDisplayed = allies[actorCellId].champ.opScore_user || 50
							}
							fillAssignedRoleAndRecommendations(allies, enemies, thunkParam.myTeam, actorCellId, allChamps)
						} else {
							if (championId != 0) {
								enemies[actorCellIdEnemy].champ = allChamps.find((champ) => champ.id == championId) || getDefaultChampion()
								enemies[actorCellIdEnemy].scoreDisplayed = enemies[actorCellIdEnemy].champ.opScore_user || 50
								actorCellIdEnemy++
							}
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
						if (championId != 0) {
							allies[actorCellId].champ = allChamps.find((champ) => champ.id == championId) || getDefaultChampion()
							allies[actorCellId].scoreDisplayed = allies[actorCellId].champ.opScore_user || 50
						}
						fillAssignedRoleAndRecommendations(allies, enemies, thunkParam.myTeam, actorCellId, allChamps, isActorCellRightSide)
					} else {
						if (actorCellId >= 5)
							actorCellId -= 5
						if (championId != 0) {
							enemies[actorCellId].champ = allChamps.find((champ) => champ.id == championId) || getDefaultChampion()
							enemies[actorCellId].scoreDisplayed = enemies[actorCellId].champ.opScore_user || 50
						}
					}
				}
			}
		}
		return champSelectDisplayed
	})


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
