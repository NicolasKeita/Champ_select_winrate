/*
    Path + Filename: src/desktop/utils/fetchLocalConfigJson/fetchChampionsFromConfigJson.ts
*/


import {
	Champion,
	championConstructor
} from '../../components/maincontent/settings/Champion'

export async function fetchChampionsFromConfigJson(): Promise<Champion[]> {
	const fileUrl = './config/champion_CSW_save.json'
	const res = await fetch(fileUrl, {
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
	})
	if (!res.ok) {
		console.error('CSW_error: following call : fetch(' + fileUrl + ' caught error;  ' + res.statusText)
		return []
	}
	try {
		const data = await res.json() as Promise<Champion[]>
		return (Object.values(data).map((elem: Champion) => {
			return championConstructor(elem.name, elem.opScore_CSW, elem.opScore_CSW)
		}))
	} catch (e) {
		console.error('CSW_error: following call : res.json() caught error; previously : fetch(' + fileUrl)
		console.error(e)
		return []
	}
}
