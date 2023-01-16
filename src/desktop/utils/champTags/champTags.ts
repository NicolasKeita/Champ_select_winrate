/*
    Path + Filename: src/desktop/utils/champTags/champTags.ts
*/

import {
	Champion,
	championAttributes, ChampionTagsType
} from '../../components/maincontent/settings/Champion'


function getTagBonus(allyTags: ChampionTagsType,
					 enemyTags: ChampionTagsType,
					 tag: string,
					 bonusAmount: number): number {
	if (enemyTags.attributes.includes(tag))
		if (allyTags.strongAgainst.includes(tag))
			return +bonusAmount
		else if (allyTags.weakAgainst.includes(tag))
			return -bonusAmount
	return 0
}

function getTagsBonusesSoloEnemy(allyTags: ChampionTagsType, enemyTags: ChampionTagsType): number {
	return (
		getTagBonus(allyTags, enemyTags, championAttributes.LANE_BULLY, 5)
		+ getTagBonus(allyTags, enemyTags, championAttributes.HEALER_ISH, 5)
		+ getTagBonus(allyTags, enemyTags, championAttributes.UNKILLABLE_LANER, 5)
		+ getTagBonus(allyTags, enemyTags, championAttributes.POTENTIAL_ZHONYA_OWNER, 5)
		+ getTagBonus(allyTags, enemyTags, championAttributes.JUNGLE_GANKER, 5)
		+ getTagBonus(allyTags, enemyTags, championAttributes.POTENTIAL_GREVIOUS_WOUNDS, 5)
	)
}

export function getTagsBonuses(ally: Champion, enemies: Champion[]): number {
	return enemies.reduce((accumulator, enemy) =>
		accumulator + getTagsBonusesSoloEnemy(ally.tags, enemy.tags), 0)
}
