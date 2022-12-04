/*
    Path + Filename: src/desktop/utils/store/action.ts
*/

import {createAction} from '@reduxjs/toolkit'
import {Champion, getDefaultChampion} from '../../components/maincontent/settings/Champion'
import Config from '../../components/maincontent/settings/Config'
import {getChampImg, getChampName} from '@utils/fetchDataDragon/fetchDataDragon'
import {fetchChampionsFromConfigJson} from '@utils/fetchLocalConfigJson/fetchChampionsFromConfigJson'
import {fetchEncryptedSummonerId} from '@utils/LOL_API'

export const toggleSettingsPage = createAction('toggleSettingsPage')
export const resetSettingsInternal = createAction('resetSettingsInternal')
export const setChampions = createAction<Champion[]>('setChampions')
export const copyFromAnotherSetting = createAction<Config>('copyFromAnotherSetting')
export const updateAllUserScores = createAction<Champion[]>('updateAllUserScores')
export const setUserOPScore = createAction('setUserOPScore', function prepare(score: number, champName: string) { return {payload: {score, champName}} })
export const setInternalSettings = createAction('setInternalSettings', function prepare(score: number, champName: string) { return {payload: {score, champName}}})
export const setClientStatus = createAction<number>('setClientStatus')
export const setFooterMessage = createAction<number>('setFooterMessage')
export const resetChampSelectDisplayed = createAction('resetChampSelectDisplayed')
export const setSummonerName = createAction<string>('setSummonerName')
export const setSummonerRegion = createAction<string>('setSummonerRegion')
export const setSummonerInternal = createAction('setSummonerInternal', function prepare(summonerName: string, summonerRegion: string, encryptedSummonerId: string) {
	return {
		payload: {
			summonerName,
			summonerRegion,
			encryptedSummonerId
		}
	}
})
export const doChampionSuggestions = createAction('doChampionSuggestion', function prepare(allies: Champion[], enemies: Champion[], localCellId: number) {
	return {
		payload: {
			allies,
			enemies,
			localCellId
		}
	}
})

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

export const fillChampSelectDisplayedInternal = createAction('fillChampSelectDisplayedInternal', function prepare(allies: Champion[], enemies: Champion[]) { return {payload: {allies, enemies}}})
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
		allies[cellID].image = await getChampImg(champID)
		allies[cellID].name = await getChampName(champID)
		allies[cellID].opScore_user = -1
	}
	//Custom solo with bans
	if (actions.length == 4) {
		const cellID = actions[3][0].actorCellId
		const champID = actions[3][0].championId
		if (champID === 0) return
		allies[cellID].image = await getChampImg(champID)
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
						allies[cellID].image = await getChampImg(champID)
						allies[cellID].name = await getChampName(champID)
						allies[cellID].opScore_user = -1
					} else {
						enemies[cellID].image = await getChampImg(champID)
						enemies[cellID].name = await getChampName(champID)
						enemies[cellID].opScore_user = -1
					}
				} else {
					cellID = cellID - 5
					if (localCellId < 5) {
						enemies[cellID].image = await getChampImg(champID)
						enemies[cellID].name = await getChampName(champID)
						enemies[cellID].opScore_user = -1
					} else {
						allies[cellID].image = await getChampImg(champID)
						allies[cellID].name = await getChampName(champID)
						allies[cellID].opScore_user = -1
					}
				}
			}
		}
	}
	dispatch(doChampionSuggestions(allies, enemies, localCellId))
	dispatch(fillChampSelectDisplayedInternal(allies, enemies))
})