/*
    Path + Filename: src/desktop/utils/LOL_API/index.ts
*/

import api_json from './API_KEY.json'

const API_key = api_json.API_KEY

export async function fetchEncryptedSummonerId(summonerName, summonerRegion): Promise<string> {
	const url = `https://${summonerRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_key}`
	const res = await fetch(url)
	//const url = `https://${summonerRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`
	//const res = await fetch(url, {headers: {'X-Riot-Token': API_key}})
	if (!res.ok) {
		console.error('CSW_error: following call : fetch(' + url + ' caught error;  ' + res.statusText)
		return ''
	}
	try {
		const data = await res.json()
		return data.id
	} catch (e) {
		console.error('CSW_error: following call : res.json() caught error; previously : fetch(' + url)
		console.error(e)
		return ''
	}
}

export async function isInGame(summonerRegion : string, encryptedSummonerId : string): Promise<boolean | null> {
	//const url = `https://${summonerRegion}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${encryptedSummonerId}?api_key=${API_key}`
	//const url = 'https://4nuo1ouibd.execute-api.eu-west-3.amazonaws.com/rgapi/'
	const url = `https://4nuo1ouibd.execute-api.eu-west-3.amazonaws.com/rgapi/spectator/${encryptedSummonerId}/${summonerRegion.toLowerCase()}`
	let res
	try {
		res = await fetch(url)
	} catch (e) {
			console.error('CSW_error: following call : fetch(' + url + ' caught' +
				' error;  ' + e)
				return null
	}
	if (!res.ok && res.status != 404) {
		console.error('CSW_error: following call : fetch(' + url + ' caught error;  ' + res.statusText)
		return null
	}
	try {
		const data = await res.json()
		if (data && data.status) {
			if (data.status.status_code === 404)
				return false
			else {
				console.error(`CSW_error: fetch(${url}) returned an error code : ${data.status.status_code}`)
				return null
			}
		} else if (data && data.gameId)
			return true
		else {
			console.error(`CSW_error: fetch(${url}) returned an error unknown (without error code?)`)
			return null
		}
	} catch (e) {
		console.error('CSW_error: following call : res.json() caught error; previously : fetch(' + url)
		console.error(e)
		return null
	}
}