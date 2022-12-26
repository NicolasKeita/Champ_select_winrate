/*
    Path + Filename: src/utils/fetchDataDragon/fetchDataDragon.ts
*/

import {Champion} from '../../components/maincontent/settings/Champion'
import questionMark from '@public/img/question_mark.jpg'
import ASSETS from '../../../allChampsIcons'

export function getChampImgByFormattedName(name: string): string {
	let formattedName: string = name
	if (!name.endsWith('.png'))
		formattedName = name + '.png'
	formattedName = formattedName.replace('.png', '_png')
	formattedName = formattedName.toUpperCase()
	return (ASSETS[`${formattedName}`])
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

export function getChampImgByNamePNG(champNamePNG: string): string {
	let formattedName: string = champNamePNG
	if (!champNamePNG.endsWith('.png'))
		formattedName = champNamePNG + '.png'
	formattedName = formattedName.replace('.png', '_png')
	formattedName = formattedName.toUpperCase()
	return (champNamePNG == '' || !champNamePNG == undefined) ? questionMark : ASSETS[`${formattedName}`]
}
