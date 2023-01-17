/*
    Path + Filename: src/desktop/utils/recommendations/champRecommendation.ts
*/

import {
	Champion,
	getDefaultChampion
} from '../../components/maincontent/settings/Champion'
import {getTagsBonuses} from '@utils/champTags/champTags'
import {
	ChampDisplayedType
} from '../../../background/store/slice/fillChampSelectDIsplayed'

//TODO change to types to make it more accessible for history or others?
export function getRecommendations(allies: ChampDisplayedType[], enemies: ChampDisplayedType[], playerId: number, allChamps: Champion[]): Champion[] {
	let assignedRole = allies[playerId].assignedRole
	if (assignedRole == '') {
		if (playerId == 0 || playerId == 5) {
			assignedRole = 'top'
		}
		if (playerId == 1 || playerId == 6) {
			assignedRole = 'jungle'
		}
		if (playerId == 2 || playerId == 7) {
			assignedRole = 'middle'
		}
		if (playerId == 3 || playerId == 8) {
			assignedRole = 'bottom'
		}
		if (playerId == 4 || playerId == 9) {
			assignedRole = 'utility'
		}
	}

	//TODO why is this function there?
	function updateDisplayedScoresWithTags(allies: ChampDisplayedType[], enemies: ChampDisplayedType[]) {
		for (const ally of allies) {
			ally.scoreDisplayed = (ally.champ.opScore_user || 50)
				+ getTagsBonuses(ally.champ, enemies.map(enemy => enemy.champ))
		}
	}

	//TODO why is this function there?
	updateDisplayedScoresWithTags(allies, enemies)

	const allChampsFilteredWithRole = allChamps.filter(({role}) => role == assignedRole)
	if (allChampsFilteredWithRole.length == 0)
		console.error('CSW_error: couldnt get recommendations')
	const allChampsWithDisplayedScore: [number, Champion][] = allChampsFilteredWithRole.map(champ => {
		const displayedScore = getTagsBonuses(champ, enemies.map(enemy => enemy.champ))
		return [displayedScore, champ]
	})
	allChampsWithDisplayedScore.sort((a, b) => b[0] - a[0])
	const firstFive = allChampsWithDisplayedScore.slice(0, 5)
	return (firstFive.map(elem => elem[1]))
}

export function getDefaultRecommendations(): Champion[] {
	const recommendations: Champion[] = []
	for (let i = 0; i < 5; ++i) {
		recommendations.push(getDefaultChampion())
	}
	return recommendations
}
