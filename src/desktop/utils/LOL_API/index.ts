/*
    Path + Filename: src/desktop/utils/LOL_API/index.ts
*/

import {FetchMatchHistoryType} from './fetchMatchHistory_type'

export async function fetchEncryptedSummonerId(summonerName: string, summonerRegion: string): Promise<{encryptedSummonerId: string, puuid: string}> {
	const url = `https://4nuo1ouibd.execute-api.eu-west-3.amazonaws.com/csw_api_proxy/summoner/${summonerName}/${summonerRegion.toLowerCase()}`
	let res
	try {
		res = await fetch(url)
	} catch (e) {
		throw new Error('CSW_error: following call : fetch(' + url + ' caught' +
			' error;  ')
	}
	try {
		const data = await res.json()
		return {encryptedSummonerId: data.id, puuid: data.puuid}
	} catch (err: unknown) {
		const e = err as Error
		throw new Error(e.message)
	}
}

export async function fetchMatchHistoryId(summonerRegion: string, puuid: string): Promise<string[]> {
	const url = `https://4nuo1ouibd.execute-api.eu-west-3.amazonaws.com/csw_api_proxy/history/${summonerRegion.toLowerCase()}/${puuid}`
	let res
	try {
		res = await fetch(url)
		if (res.status == 429) {
			throw new Error('429 code ')
		}
	} catch (e) {
		throw new Error(
			'CSW_error: following call : fetch(' + url + ' caught' + ' error;  '
		)
	}
	try {
		return await res.json()
	} catch (err: unknown) {
		const e = err as Error
		throw new Error(e.message)
	}
}

export async function fetchMatchHistory(matchId: string, summonerRegion: string): Promise<FetchMatchHistoryType> {
	const url = `https://4nuo1ouibd.execute-api.eu-west-3.amazonaws.com/csw_api_proxy/match/${summonerRegion.toLowerCase()}/${matchId}`
	let res: Response
	try {
		res = await fetch(url, {
			headers: {
				'X-Api-Key': 'gRpS5xTEMG9V5EQP4a0DB3SBk8XLGydq9HlTU5HZ'
			}
		})
		if (res.status == 429) {
			throw new Error('429 code ')
		}
	} catch (e) {
		throw new Error(
			'CSW_error: following call : fetch(' + url + ' caught' + ' error;  ' + e)
	}
	try {
		return await res.json()
	} catch (err: unknown) {
		const e = err as Error
		throw new Error(e.message)
	}
}

export async function isInGame(summonerRegion: string, encryptedSummonerId: string): Promise<boolean> {
	const url = `https://4nuo1ouibd.execute-api.eu-west-3.amazonaws.com/csw_api_proxy/spectator/${encryptedSummonerId}/${summonerRegion.toLowerCase()}`
	let res: Response
	try {
		res = await fetch(url)
	} catch (e) {
		throw new Error('CSW_error: following call : fetch(' + url + ' caught' +
			' error;  ')
	}
	if (!res.ok && res.status != 404)
		throw new Error('CSW_error: following call : fetch(' + url + ' caught error;  ')
	try {
		if (res.status == 204)
			return false
		else {
			const data = await res.json()
			if (data && data.gameId)
				return true
			else
				throw new Error(`CSW_error: fetch(${url}) returned an error unknown (without error code?)`)
		}
	} catch (e) {
		throw new Error('CSW_error: following call : res.json() caught error; previously : fetch(' + url)
	}
}