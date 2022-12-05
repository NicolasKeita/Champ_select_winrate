/*
    Path + Filename: src/desktop/components/maincontent/settings/Champion.ts
*/

import questionMark from '@public/img/question_mark.jpg'

export type Champion = {
	name: string
	opScore_CSW: number
	opScore_user: number
	role: string
	image: string
	imageUrl: string
}

export function championConstructor(name = '', opScore_user = 50, opScore_CSW = 50): Champion {
	return {
		name: name,
		opScore_user: opScore_user,
		opScore_CSW: opScore_CSW,
		role: '',
		image: '',
		imageUrl: ''
	}
}

export function getDefaultChampion(): Champion {
	const defaultImg: string = questionMark
	const defaultName = 'Champion Name'
	const defaultScore = 50
	return <Champion>{
		name: defaultName,
		imageUrl: defaultImg,
		opScore_user: defaultScore
	}
}
