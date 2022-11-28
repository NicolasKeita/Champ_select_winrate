/*
    Path + Filename: src/utils/playerProfile/getChampionByKey.ts
*/

export async function getChampSquareAsset(champNamePNG, language = 'en_US') {
	const version = (await fetch('http://ddragon.leagueoflegends.com/api/versions.json').then(async r => await r.json()))[0]
	return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champNamePNG}`
}
