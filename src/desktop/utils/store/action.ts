/*
    Path + Filename: src/desktop/utils/store/action.ts
*/

import {
	Champion,
	getDefaultChampion
} from '../../components/maincontent/settings/Champion'
import {getChampImg, getChampName} from '@utils/fetchDataDragon/fetchDataDragon'
import {
	fetchChampionsFromConfigJson
} from '@utils/fetchLocalConfigJson/fetchChampionsFromConfigJson'
import {fetchEncryptedSummonerId} from '@utils/LOL_API'
import {
	doChampionSuggestionsInternal, fillChampSelectDisplayedInternal,
	resetSettingsInternal,
	setChampions,
	setSummonerInternal
} from '@utils/store/store'

export const populateDefaultConfig = () => (async dispatch => { // TODO migration to createSlice and createAsyncThunk?
	const allChamps = await fetchChampionsFromConfigJson()
	dispatch(setChampions(allChamps))
})

export const resetSettings = () => (async dispatch => {
	const allChamps = await fetchChampionsFromConfigJson()
	dispatch(resetSettingsInternal())
	dispatch(setChampions(allChamps))
})

export const setSummoner = (summonerName, summonerRegion) => (async dispatch => {
	const encryptedSummonerId = await fetchEncryptedSummonerId(summonerName, summonerRegion)
	sessionStorage.setItem('encryptedSummonerId', encryptedSummonerId)
	dispatch(setSummonerInternal(summonerName, summonerRegion, encryptedSummonerId))
})

export const fillChampSelectDisplayed = (actions, localCellId) => (async dispatch => {
	if (actions.length == 0)
		return
	const allies: Champion[] = []
	const enemies: Champion[] = []

	for (let i = 0; i < 5; ++i) {
		allies.push(getDefaultChampion())
		enemies.push(getDefaultChampion())
	}

	//Custom solo without bans
	if (actions.length == 1) {
		const cellID = actions[0][0].actorCellId
		const champID = actions[0][0].championId
		if (champID === 0) return
		allies[cellID].imageUrl = await getChampImg(champID)
		allies[cellID].name = await getChampName(champID)
		allies[cellID].opScore_user = -1
	}
	//Custom solo with bans
	if (actions.length == 4) {
		const cellID = actions[3][0].actorCellId
		const champID = actions[3][0].championId
		if (champID === 0) return
		allies[cellID].imageUrl = await getChampImg(champID)
		allies[cellID].name = await getChampName(champID)
		allies[cellID].opScore_user = -1
	}
	// Rift Mode with bans (doesn't handle clash or tournament yet)
	else if (actions.length == 8) {
		for (let i = 2; i < actions.length; i++) {
			for (const pairActionSplitted of actions[i]) {
				const champID = pairActionSplitted.championId
				if (champID === 0) continue
				let cellID = pairActionSplitted.actorCellId
				if (cellID < 5) {
					if (localCellId < 5) {
						allies[cellID].imageUrl = await getChampImg(champID)
						allies[cellID].name = await getChampName(champID)
						allies[cellID].opScore_user = -1
					} else {
						enemies[cellID].imageUrl = await getChampImg(champID)
						enemies[cellID].name = await getChampName(champID)
						enemies[cellID].opScore_user = -1
					}
				} else {
					cellID = cellID - 5
					if (localCellId < 5) {
						enemies[cellID].imageUrl = await getChampImg(champID)
						enemies[cellID].name = await getChampName(champID)
						enemies[cellID].opScore_user = -1
					} else {
						allies[cellID].imageUrl = await getChampImg(champID)
						allies[cellID].name = await getChampName(champID)
						allies[cellID].opScore_user = -1
					}
				}
			}
		}
	}
	dispatch(fillChampSelectDisplayedInternal(allies, enemies))
	//dispatch(doChampionSuggestions(allies, enemies, localCellId))
})
export const doChampionSuggestions = (allies, enemies, localCellId) => (async dispatch => {
	dispatch(doChampionSuggestionsInternal(allies, enemies, localCellId))
})