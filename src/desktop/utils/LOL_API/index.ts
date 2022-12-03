/*
    Path + Filename: src/desktop/utils/LOL_API/index.ts
*/

//import API_key from './API_KEY.json' assert {type: 'json'}

const API_key = 'RGAPI-7698957e-20a3-4cb4-b746-0e6808a78d04'

const my_headers = {
	// 'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
	// 'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
	'X-Riot-Token': API_key
	// 'Accept-Language': 'fr,fr-FR;q=0.9,en;q=0.8',
	// 'Origin': 'https://developer.riotgames.com'
}

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

export async function isInGame(summonerRegion, encryptedSummonerId): Promise<boolean | null> {
	// const url = `https://${summonerRegion}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${encryptedSummonerId}`
	// const res = await fetch(url, {
	// 	headers: my_headers
	// })
	const url = `https://${summonerRegion}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${encryptedSummonerId}?api_key=${API_key}`
	const res = await fetch(url, {headers: {'Origin': 'https://developer.riotgames.com'}})
	console.log('isInGame')
	console.log(res)
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