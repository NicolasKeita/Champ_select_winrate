/*
    Path + Filename: src/desktop/utils/store/action.ts
*/

import {createAction} from '@reduxjs/toolkit'
import Champion from '../../components/maincontent/settings/Champion'
import Config from '../../components/maincontent/settings/Config'

export const toggleSettingsPage = createAction('toggleSettingsPage')
export const resetSettingsInternal = createAction<string>('resetSettingsInternal')
export const setChampions = createAction<Champion[]>('setChampions')
export const copyFromAnotherSetting = createAction<Config>('copyFromAnotherSetting')
export const updateAllUserScores = createAction<Champion[]>('updateAllUserScores')
export const setUserOPScore = createAction('setUserOPScore', function prepare(score: number, champName: string) { return {payload: {score, champName}} })
export const setInternalSettings = createAction('setInternalSettings', function prepare(score: number, champName: string) { return {payload: {score, champName}}})
export const setClientStatus = createAction<number>('setClientStatus')
export const setFooterMessage = createAction<number>('setFooterMessage')
export const resetChampSelectDisplayed = createAction('resetChampSelectDisplayed')

export const populateDefaultConfig = (cpy) => (async dispatch => { // TODO search createAsyncThunk() on redux toolkit, (it is a cleaner way to write this I think)
	await cpy.populateDefaultConfig()
	dispatch(setChampions(JSON.parse(cpy.stringifyChampions())))
})
export const resetSettings = (cpy) => (async dispatch => {
	await cpy.reset()
	dispatch(resetSettingsInternal(cpy.stringify()))
})

import {getChampImg, getChampName} from '@utils/playerProfile/getChampionByKey'
import questionMark from '@public/img/question_mark.jpg'


interface champDisplayedType {
	img: string,
	name: string,
	score: number
}

export const fillChampSelectDisplayedInternal = createAction('fillChampSelectDisplayedInternal', function prepare(allies: any, enemies: any) { return {payload: {allies, enemies}}})
export const fillChampSelectDisplayed = (actions, localCellId) => (async dispatch => {
	if (actions.length == 0)
		return
	console.log('Action fill')
	console.log(actions)

	const allies: champDisplayedType[] = []
	const enemies: champDisplayedType[] = []

	const defaultImg: string = questionMark
	const defaultName = 'Champion Name'
	const defaultScore = 50
	for (let i = 0; i < 5; ++i) {
		allies.push({
			img:   defaultImg,
			name:  defaultName,
			score: defaultScore
		})
		enemies.push({
			img:   defaultImg,
			name:  defaultName,
			score: defaultScore
		})
	}

	//Custom solo without bans
	if (actions.length == 1) {
		const cellID = actions[0][0].actorCellId
		const champID = actions[0][0].championId
		if (champID === 0) return
		allies[cellID].img = await getChampImg(champID)
		allies[cellID].name = await getChampName(champID)
		allies[cellID].score = -1
	}
	//Custom solo with bans
	if (actions.length == 4) {
		const cellID = actions[3][0].actorCellId
		const champID = actions[3][0].championId
		if (champID === 0) return
		allies[cellID].img = await getChampImg(champID)
		allies[cellID].name = await getChampName(champID)
		allies[cellID].score = -1
	}
	// Rift Mode with bans (doesn't handle clash or tournament yet)
	else if (actions.length == 8) {
		for (let i = 2; i < actions.length; i++) {
			// TODO replace by 'for of ?'
			for (let y = 0; y < actions[i].length; ++y) {
				const champID = actions[i][y].championId
				if (champID === 0) continue
				let cellID = actions[i][y].actorCellId
				if (cellID < 5) {
					if (localCellId < 5) {
						allies[cellID].img = await getChampImg(champID)
						allies[cellID].name = await getChampName(champID)
						allies[cellID].score = -1
					} else {
						enemies[cellID].img = await getChampImg(champID)
						enemies[cellID].name = await getChampName(champID)
						enemies[cellID].score = -1
					}
				} else {
					cellID = cellID - 5
					if (localCellId < 5) {
						enemies[cellID].img = await getChampImg(champID)
						enemies[cellID].name = await getChampName(champID)
						enemies[cellID].score = -1
					} else {
						allies[cellID].img = await getChampImg(champID)
						allies[cellID].name = await getChampName(champID)
						allies[cellID].score = -1
					}
				}
			}
		}
	}
	dispatch(fillChampSelectDisplayedInternal(allies, enemies))
})

// .then(response => dispatch(loadGallerySuccess(response.data)))
// .catch(() => dispatch(loadGalleryError()));
