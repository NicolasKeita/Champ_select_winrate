/*
    Path + Filename: src/desktop/utils/fetchLocalConfigJson/fetchChampionsFromConfigJson.ts
*/


import {
	Champion, championAttributes,
	championConstructor, ChampionTagsType
} from '../../components/maincontent/settings/Champion'

function addToArrayNoDuplicate(myArray, value) {
	if (!myArray.includes(value))
		myArray.push(value)
}

function adjustTags(tags: ChampionTagsType) {

	if (tags.attributes.includes(championAttributes.HEALER_ISH)) {
		addToArrayNoDuplicate(tags.weakAgainst, championAttributes.POTENTIAL_GREVIOUS_WOUNDS)
	}
	if (tags.attributes.includes(championAttributes.JUNGLE_GANKER) || tags.attributes.includes(championAttributes.LANE_BULLY)) {
		addToArrayNoDuplicate(tags.weakAgainst, championAttributes.UNKILLABLE_LANER)
	}

	if (tags.attributes.includes(championAttributes.POTENTIAL_GREVIOUS_WOUNDS)) {
		addToArrayNoDuplicate(tags.strongAgainst, championAttributes.HEALER_ISH)
	}
	if (tags.attributes.includes(championAttributes.UNKILLABLE_LANER)) {
		addToArrayNoDuplicate(tags.strongAgainst, championAttributes.JUNGLE_GANKER)
		addToArrayNoDuplicate(tags.strongAgainst, championAttributes.LANE_BULLY)
	}
	return tags
}

export async function fetchAllChampionsJson(): Promise<Champion[]> {
	const url = 'https://4nuo1ouibd.execute-api.eu-west-3.amazonaws.com/csw_api_proxy/allchamps'
	let res
	try {
		res = await fetch(url)
	} catch (e) {
		throw new Error(`CSW_error: following call : fetch(${url}) caught error; error: ${e}`)
	}
	try {
		const data = await res.json() as Promise<Champion[]>
		return (Object.values(data).map((elem: Champion) => {
			const modifiedTags = adjustTags(elem.tags)
			return championConstructor(
				elem.name,
				elem.opScore_CSW,
				elem.opScore_CSW,
				elem.role,
				elem.image,
				'',
				elem.id,
				elem.nameFormatted,
				modifiedTags
			)
		}))
	} catch (e) {
		throw new Error(`CSW_error: following call : res.json() caught error; previously: ${url} error: ${e}`)
	}
}

export async function fetchCSWgameVersion(): Promise<string> {
	const url = 'https://4nuo1ouibd.execute-api.eu-west-3.amazonaws.com/csw_api_proxy/cswgameversion'
	let res
	try {
		res = await fetch(url)
	} catch (e) {
		throw new Error(`CSW_error: following call : fetch(${url}) caught error; error: ${e}`)
	}
	try {
		return await res.text()
	} catch (e) {
		throw new Error('CSW_error: following call : res.text() caught error; previously : fetch(' + url)
	}
}