/*
    Path + Filename: src/desktop/components/maincontent/settings/Champion.ts
*/

import questionMark from '@public/img/question_mark.jpg'
import Config from './Config'

export const championAttributes = {
	HEALER_ISH: 'Healer-ish',
	POTENTIAL_GREVIOUS_WOUNDS: 'Potential Grievous Wounds',
	UNKILLABLE_LANER: 'Unkillable laner',
	POTENTIAL_ZHONYA_OWNER: 'Potential Zhonya owner',
	LANE_BULLY: 'Lane Bully',
	CC: 'CC',
	AP: 'AP',
	AD: 'AD',
	TANK: 'Tank',
	RANGED: 'Ranged',
	MELEE: 'Melee',
	JUNGLE_FARMER: 'Jungle Farmer',
	JUNGLE_GANKER: 'Ganker'
}

export type ChampionTagsType = {
	attributes: string[],
	strongAgainst: string[],
	weakAgainst: string[]
}

export type Champion = {
	id: number
	image: string
	imageUrl?: string
	name: string
	nameFormatted: string
	opScore_CSW: number
	opScore_user?: number
	role: string,
	tags: ChampionTagsType
}

export function championConstructor(name = '',
									opScore_user = 50,
									opScore_CSW = 50,
									role = '',
									image = '',
									imageUrl = '',
									id = -1,
									nameFormatted = '',
									tags = {
										attributes: [] as string[],
										strongAgainst: [] as string[],
										weakAgainst: [] as string[]
									}
): Champion {
	return {
		name: name,
		nameFormatted: nameFormatted,
		opScore_user: opScore_user,
		opScore_CSW: opScore_CSW,
		role: role,
		image: image,
		imageUrl: imageUrl,
		id: id,
		tags: tags
	}
}

export function getDefaultChampion(): Champion {
	const defaultImageUrl: string = questionMark
	const defaultName = 'Champion Name'
	const defaultCSWScore = 50
	const defaultUserScore = 50
	const defaultRole = ''
	const defaultImage = ''
	const defaultId = -1
	const defaultNameFormatted = ''
	const defaultTags = {
		attributes: [],
		strongAgainst: [],
		weakAgainst: []
	}
	return championConstructor(defaultName,
		defaultUserScore,
		defaultCSWScore,
		defaultRole,
		defaultImage,
		defaultImageUrl,
		defaultId,
		defaultNameFormatted,
		defaultTags)
}


export function championAssign(championTarget: Champion, championSource: Champion) {
	championTarget.name = championSource.name
	championTarget.id = championSource.id
	championTarget.imageUrl = championSource.imageUrl
	championTarget.role = championSource.role
	championTarget.opScore_user = championSource.opScore_user
	championTarget.opScore_CSW = championSource.opScore_CSW
	championTarget.nameFormatted = championSource.nameFormatted
	championTarget.image = championSource.image
	championTarget.tags = championSource.tags
}
