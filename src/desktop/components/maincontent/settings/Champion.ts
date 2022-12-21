/*
    Path + Filename: src/desktop/components/maincontent/settings/Champion.ts
*/

import questionMark from '@public/img/question_mark.jpg'

export type Champion = {
	id: number
	image: string
	imageUrl?: string
	name: string
	nameFormatted: string
	opScore_CSW: number
	opScore_user?: number
	role: string
}

export function championConstructor(name = '', opScore_user = 50, opScore_CSW = 50, role = '', image = '', imageUrl = '', id=-1, nameFormatted=''): Champion {
	return {
		name: name,
		nameFormatted: nameFormatted,
		opScore_user: opScore_user,
		opScore_CSW: opScore_CSW,
		role: role,
		image: image,
		imageUrl: imageUrl,
		id: id
	}
}

export function getDefaultChampion(): Champion {
	const defaultImageUrl: string = questionMark
	const defaultName = 'Champion Name'
	const defaultScore = 50
	const defaultRole = ''
	const defaultImage = ''
	const defaultId = -1
	const defaultNameFormatted = ''
	return championConstructor(defaultName, defaultScore, defaultScore, defaultRole, defaultImage, defaultImageUrl, defaultId, defaultNameFormatted)
}
