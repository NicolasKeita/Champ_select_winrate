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
import {
	ChampDisplayedType,
	fillChampSelectDisplayedInternal, getDefaultRecommendations,
	resetSettingsInternal,
	setChampions
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

export const fillChampSelectDisplayed = (actions, localCellId, myTeam, theirTeam) => (async dispatch => {
	if (actions.length == 0)
		return
	const allies: ChampDisplayedType[] = []
	const enemies: ChampDisplayedType[] = []

	for (let i = 0; i < 5; ++i) {
		allies.push({
			role: undefined,
			champ: getDefaultChampion(),
			recommendations: getDefaultRecommendations()
		})
		enemies.push({
			role: undefined,
			champ: getDefaultChampion(),
			recommendations: getDefaultRecommendations()
		})
	}

	//Custom solo without bans
	if (actions.length == 1) {
		const cellID = actions[0][0].actorCellId
		const champID = actions[0][0].championId
		if (champID === 0) return
		console.log(champID)
		allies[cellID].champ.imageUrl = await getChampImg(champID)
		allies[cellID].champ.name = await getChampName(champID)
		allies[cellID].champ.opScore_user = -1
	}
	//Custom solo with bans
	if (actions.length == 4) {
		const cellID = actions[3][0].actorCellId
		const champID = actions[3][0].championId
		if (champID === 0) return
		allies[cellID].champ.imageUrl = await getChampImg(champID)
		allies[cellID].champ.name = await getChampName(champID)
		allies[cellID].champ.opScore_user = -1
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
						allies[cellID].champ.imageUrl = await getChampImg(champID)
						allies[cellID].champ.name = await getChampName(champID)
						allies[cellID].champ.opScore_user = -1
					} else {
						enemies[cellID].champ.imageUrl = await getChampImg(champID)
						enemies[cellID].champ.name = await getChampName(champID)
						enemies[cellID].champ.opScore_user = -1
					}
				} else {
					cellID = cellID - 5
					if (localCellId < 5) {
						enemies[cellID].champ.imageUrl = await getChampImg(champID)
						enemies[cellID].champ.name = await getChampName(champID)
						enemies[cellID].champ.opScore_user = -1
					} else {
						allies[cellID].champ.imageUrl = await getChampImg(champID)
						allies[cellID].champ.name = await getChampName(champID)
						allies[cellID].champ.opScore_user = -1
					}
				}
			}
		}
	}
	dispatch(fillChampSelectDisplayedInternal(allies, enemies))
})