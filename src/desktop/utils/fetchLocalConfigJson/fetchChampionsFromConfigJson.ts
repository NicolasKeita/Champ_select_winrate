/*
    Path + Filename: src/desktop/utils/fetchLocalConfigJson/fetchChampionsFromConfigJson.ts
*/


import {Champion} from '../../components/maincontent/settings/Champion'

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
			return {
				name: elem.name,
				opScore_user: elem.opScore_CSW,
				opScore_CSW: elem.opScore_CSW,
				image: elem.image,
				imageUrl: '',
				role: elem.role
			}
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