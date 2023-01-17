/*
    Path + Filename: src/background/store/slice/fillHistoryDisplayed.ts
*/

import {createAsyncThunk} from '@reduxjs/toolkit'
import {RootState} from '@utils/store/store'
import {doWithRetry} from 'do-with-retry'
import {fetchMatchHistory, fetchMatchHistoryId} from '@utils/LOL_API'
import {
	FetchMatchHistoryType,
	Team
} from '@utils/LOL_API/fetchMatchHistory_type'
import {
	Champion,
	getDefaultChampion
} from '../../../desktop/components/maincontent/settings/Champion'
import {
	setFooterMessage,
	setHistoryIsLoading, setHistoryMatch
} from './slice'
import {getTagsBonuses} from '@utils/champTags/champTags'
import {getChampScoreByNames} from '@utils/fetchDataDragon/fetchDataDragon'
import {
	getDefaultRecommendations
} from '@utils/recommendations/champRecommendation'


export type HistoryChampScore = {
	champ: Champion
	enhancedScore: number
}

export type HistoryDisplayedType = {
	allies: HistoryChampScore[]
	enemies: HistoryChampScore[]
	matchId: string
	isLoading: boolean
	userWon: boolean
}

export function initHistoryDisplayed() {
	const historyDisplayed: HistoryDisplayedType[] = []
	for (let i = 0; i < 5; ++i) {
		historyDisplayed.push({
			allies: getDefaultRecommendations().map(champ => ({
				champ: champ,
				enhancedScore: 50
			})),
			enemies: getDefaultRecommendations().map(champ => ({
				champ: champ,
				enhancedScore: 50
			})),
			isLoading: false,
			matchId: '0',
			userWon: true
		})
	}
	return historyDisplayed
}

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
				const champInAllChamps = allChamps.find(({nameFormatted}) => nameFormatted == participantChampName)
				if (x < 5) {
					historyDisplayedTmp[i].allies[x].champ = champInAllChamps || getDefaultChampion()
				} else {
					historyDisplayedTmp[i].enemies[x - 5].champ = champInAllChamps || getDefaultChampion()
					historyDisplayedTmp[i].enemies[x - 5].enhancedScore = historyDisplayedTmp[i].enemies[x - 5].champ.opScore_user || 50
				}
			}

			if (!imInAllyTeam)
				[historyDisplayedTmp[i].allies, historyDisplayedTmp[i].enemies] = [historyDisplayedTmp[i].enemies, historyDisplayedTmp[i].allies]
			for (const ally of historyDisplayedTmp[i].allies) {
				ally.enhancedScore =
					(ally.champ.opScore_user || 50)
					+ getTagsBonuses(ally.champ, historyDisplayedTmp[i].enemies.map(({champ}) => champ))
			}
			historyDisplayedTmp[i].userWon = userTeam == winningTeam || winningTeam == null

			thunkAPI.dispatch(setHistoryMatch({
				historyDisplayedIndex: i,
				matchDisplayed: historyDisplayedTmp[i]
			}))
		}
	}
)

//TODO and put theses kind of function inside the fillHistoryDisplayed? to prevent duplicate? (because it is currently not)
export function updateHistoryValues(historyDisplayed: HistoryDisplayedType[], allChamps: Champion[]) {
	const allChampsToQuery: string[] = []
	for (const match of historyDisplayed) {
		for (const ally of match.allies) {
			allChampsToQuery.push(ally.champ.name)
		}
		for (const enemy of match.enemies) {
			allChampsToQuery.push(enemy.champ.name)
		}
	}
	const allChampsToQueryFulfilled = getChampScoreByNames(allChampsToQuery, allChamps)
	if (allChampsToQueryFulfilled.length == 0)
		return
	for (const match of historyDisplayed) {
		for (const ally of match.allies) {
			ally.champ.opScore_user = allChampsToQueryFulfilled.find(({champName}) => champName == ally.champ.name)?.opScore_user || 50
			ally.enhancedScore = (ally.champ.opScore_user || 50) + getTagsBonuses(ally.champ, match.enemies.map(enemy => enemy.champ))
		}
		for (const enemy of match.enemies) {
			enemy.champ.opScore_user = allChampsToQueryFulfilled.find(({champName}) => champName == enemy.champ.name)?.opScore_user || 50
			enemy.enhancedScore = enemy.champ.opScore_user != undefined ? enemy.champ.opScore_user : 50
		}
	}
}
