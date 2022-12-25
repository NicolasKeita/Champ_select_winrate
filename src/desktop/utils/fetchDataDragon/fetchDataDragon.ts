/*
    Path + Filename: src/utils/fetchDataDragon/fetchDataDragon.ts
*/

import {Champion} from '../../components/maincontent/settings/Champion'

const championByIdCache = {}
const championJson = {}
let versionCache: string | undefined = undefined
import questionMark from '@public/img/question_mark.jpg'
import ASSETS from '../../../allChampsIcons'

async function getLatestChampionDDragon(language = 'en_US') {
	if (championJson[language]) return championJson[language]

	let response
	let versionIndex = 0
	do {
		const version = (await fetch('https://ddragon.leagueoflegends.com/api/versions.json').then(async r => await r.json()))[versionIndex++]

		response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion.json`)
	} while (!response.ok)

	championJson[language] = await response.json()
	// console.log('champ')
	// console.log(championJson[language])
	return championJson[language]
}

export async function getChampImgByName(name: string) {
	let formattedName: string = name
	if (!name.endsWith('.png'))
		formattedName = name + '.png'
	formattedName = formattedName.replace('.png', '_png')
	formattedName = formattedName.toUpperCase()
	return (ASSETS[`${formattedName}`])
}

export async function getChampionByKey(key, language = 'en_US') {
	// Setup cache
	if (!championByIdCache[language]) {
		let json = await getLatestChampionDDragon(language)

		championByIdCache[language] = {}
		for (var championName in json.data) {
			if (!json.data.hasOwnProperty(championName)) continue

			const champInfo = json.data[championName]
			championByIdCache[language][champInfo.key] = champInfo
		}
	}

	return championByIdCache[language][key]
}

export async function getChampionByID(name, language = 'en_US') {
	return ((await getLatestChampionDDragon(language))[name])
}

export async function getChampImg(champId) {
	const champObject = await getChampionByKey(champId)
	return await getChampSquareAsset(champObject.image.full)
}

export async function getChampName(champId) {
	return (await getChampionByKey(champId)).name
}

export function getChampScoreByName(champName: string, allChampions: Champion[]): number {
	for (const champion of allChampions) {
		if (champion.name == champName)
			return champion.opScore_user != undefined ? champion.opScore_user : 50
	}
	return 50
}

export function getChampScoreByNames(champNames: string[], allChampions: Champion[]): any {
	const result = {}
	for (const champion of allChampions) {
		if (champNames.includes(champion.name)) {
			result[`${champion.name}`] = champion.opScore_user != undefined ? champion.opScore_user : 50
			if (Object.keys(result).length == champNames.length)
				return result
		}
	}
	return result
}

export async function getChampSquareAsset(champNamePNG: string): Promise<string> {
	let formattedName: string = champNamePNG
	if (!champNamePNG.endsWith('.png'))
		formattedName = champNamePNG + '.png'
	formattedName = formattedName.replace('.png', '_png')
	formattedName = formattedName.toUpperCase()
	return (champNamePNG == '' || !champNamePNG == undefined) ? questionMark : ASSETS[`${formattedName}`]
}
