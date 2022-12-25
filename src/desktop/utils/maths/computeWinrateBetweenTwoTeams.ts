/*
    Path + Filename: src/desktop/utils/computeWinrateBetweenTwoTeams/computeWinrateBetweenTwoTeams.ts
*/


import {Champion} from '../../components/maincontent/settings/Champion'

export default function computeWinrate(allies: Champion[], enemies: Champion[]): number {
	let sumAllies = 0
	let sumEnemies = 0
	for (const ally of allies)
		sumAllies += ally.opScore_user != undefined ? ally.opScore_user : 50
	for (const enemy of enemies)
		sumEnemies += enemy.opScore_user != undefined ? enemy.opScore_user : 50
	let winRate = (sumAllies / 5 - sumEnemies / 5) / 2 + 50
	let isInferiorTo50 = false
	if (winRate < 50) {
		isInferiorTo50 = true
		winRate = 50 - winRate + 50
	}
	winRate = 100.487 - 4965.35 * Math.exp(-0.0917014 * winRate)
	if (isInferiorTo50) {
		winRate = 100 - winRate
		return Math.floor(winRate)
	} else {
		return Math.ceil(winRate)
	}
}
