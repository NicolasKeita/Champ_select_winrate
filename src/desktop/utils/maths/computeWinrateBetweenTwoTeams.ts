/*
    Path + Filename: src/desktop/utils/computeWinrateBetweenTwoTeams/computeWinrateBetweenTwoTeams.ts
*/


import {Champion} from '../../components/maincontent/settings/Champion'

export default function computeWinrate(alliesScores: number[], enemiesScores: number[]): number {
	let sumAllies = 0
	let sumEnemies = 0
	for (const allyScore of alliesScores)
		sumAllies += allyScore
	for (const enemyScore of enemiesScores)
		sumEnemies += enemyScore
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
