/*
    Path + Filename: src/utils/fetchDataDragon/fetchDataDragon.ts
*/

import {Champion} from '../../components/maincontent/settings/Champion'

const championByIdCache = {}
const championJson = {}

async function getLatestChampionDDragon(language = 'en_US') {
	if (championJson[language]) return championJson[language]

	let response
	let versionIndex = 0
	do {
		const version = (await fetch('https://ddragon.leagueoflegends.com/api/versions.json').then(async r => await r.json()))[versionIndex++]

		response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion.json`)
	} while (!response.ok)

	championJson[language] = await response.json()
	return championJson[language]
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

export function getChampScore(champName: string, settingsChampions: Champion[]): number {
	for (const elem of settingsChampions) {
		if (elem.name == champName) return elem.opScore_user
	}
	return 50
}

export async function getChampSquareAsset(champNamePNG) {
	const version = (await fetch('https://ddragon.leagueoflegends.com/api/versions.json').then(async r => await r.json()))[0]
	return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champNamePNG}`
}
