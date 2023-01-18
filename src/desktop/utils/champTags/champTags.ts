/*
    Path + Filename: src/desktop/utils/champTags/champTags.ts
*/

import {Champion} from '../../components/maincontent/settings/Champion'
// import {AssignedRole} from '../../../types/AssignedRole'


export const championAttributes = {
	visibleTags: {
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
	},
	hiddenTags: {}
}

export type ChampionTagsType = {
	attributes: string[],
	strongAgainst: string[],
	weakAgainst: string[]
}

//TODO mettre en attribute LANER et peut être mettre certain tags en visible et non-visible
function getTagBonus(allyTags: ChampionTagsType,
					 enemyTags: ChampionTagsType,
					 tag: string,
					 bonusAmount: number,
					 assignedRole?: string): number {
	// if (tag == championAttributes.visibleTags.UNKILLABLE_LANER && allyTags.
	if (enemyTags.attributes.includes(tag))
		if (allyTags.strongAgainst.includes(tag))
			return +bonusAmount
		else if (allyTags.weakAgainst.includes(tag))
			return -bonusAmount
	return 0
}

function getTagsBonusesSoloEnemy(allyTags: ChampionTagsType, enemyTags: ChampionTagsType): number {
	return (
		getTagBonus(allyTags, enemyTags, championAttributes.visibleTags.LANE_BULLY, 5)
		+ getTagBonus(allyTags, enemyTags, championAttributes.visibleTags.HEALER_ISH, 5)
		+ getTagBonus(allyTags, enemyTags, championAttributes.visibleTags.UNKILLABLE_LANER, 5)
		+ getTagBonus(allyTags, enemyTags, championAttributes.visibleTags.POTENTIAL_ZHONYA_OWNER, 5)
		+ getTagBonus(allyTags, enemyTags, championAttributes.visibleTags.JUNGLE_GANKER, 5)
		+ getTagBonus(allyTags, enemyTags, championAttributes.visibleTags.POTENTIAL_GREVIOUS_WOUNDS, 5)
	)
}

export function getTagsBonuses(ally: Champion, enemies: Champion[]): number {
	return enemies.reduce((accumulator, enemy) =>
		accumulator + getTagsBonusesSoloEnemy(ally.tags, enemy.tags), 0)
}
