/*
    Path + Filename: src/desktop/components/maincontent/settings/Champion.ts
*/

import questionMark from '@public/img/question_mark.jpg'

export type Champion = {
	name: string
	opScore_CSW : number
	opScore_user: number
	role: string
	image: string
}

export function ChampionConstructor(this: Champion, name = '', opScore_user = 50, opScore_CSW = 50) {
	this.name = name
	this.opScore_user = opScore_user
	this.opScore_CSW = opScore_CSW
	this.role = ''
	this.image = ''
}

export function getDefaultChampion() : Champion {
	const defaultImg: string = questionMark
	const defaultName = 'Champion Name'
	const defaultScore = 50
	return <Champion>{name: defaultName, image: defaultImg, opScore_user: defaultScore}
}
