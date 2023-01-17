/*
    Path + Filename: src/background/store/slice/fillChampSelectDIsplayed.ts
*/

import {createAsyncThunk} from '@reduxjs/toolkit'
import {RootState} from '@utils/store/store'
import {
	Action as ActionChampSelect,
	Team as TeamChampSelect
} from '../../../types/ChampSelect'
import {
	Champion,
	getDefaultChampion
} from '../../../desktop/components/maincontent/settings/Champion'
import {
	getDefaultRecommendations,
	getRecommendations
} from '@utils/recommendations/champRecommendation'
import {getChampScoreByNames} from '@utils/fetchDataDragon/fetchDataDragon'
import {getTagsBonuses} from '@utils/champTags/champTags'


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

type FillChampSelectDisplayedParamType = {
	actions: ActionChampSelect[][],
	localPlayerCellId: number,
	myTeam: TeamChampSelect[]
}

export const fillChampSelectDisplayed = createAsyncThunk<ChampSelectDisplayedType | void, FillChampSelectDisplayedParamType, {state: RootState}>(
	'fillChampSelectDisplayed',
	async (thunkParam, thunkAPI) => {
		if (thunkParam.actions.length == 0)
			return
		const champSelectDisplayed = initChampSelectDisplayed()
		const allies = champSelectDisplayed.allies
		const enemies = champSelectDisplayed.enemies
		const allChamps = thunkAPI.getState().slice.config.champions

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

export function initChampSelectDisplayed() {
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

//TODO same as history, put these functions inside?
export function updateChampSelectDisplayedScores(champSelectDisplayed: ChampSelectDisplayedType, allChamps: Champion[]) {
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
		ally.scoreDisplayed = ally.champ.opScore_user || 50
		ally.scoreDisplayed = (ally.champ.opScore_user || 50) + getTagsBonuses(ally.champ, champSelectDisplayed.enemies.map(enemy => enemy.champ))
	}
	for (const enemy of champSelectDisplayed.enemies) {
		enemy.champ.opScore_user = allChampsToQueryFulfilled.find(({champName}) => champName == enemy.champ.name)?.opScore_user || 50
		enemy.scoreDisplayed = enemy.champ.opScore_user || 50
	}
}

export function updateChampSelectDisplayedRecommendations(champSelectDisplayed: ChampSelectDisplayedType, allChamps: Champion[]) {
	for (const [i, ally] of champSelectDisplayed.allies.entries()) {
		ally.recommendations = getRecommendations(champSelectDisplayed.allies, champSelectDisplayed.enemies, i, allChamps)
	}
}
