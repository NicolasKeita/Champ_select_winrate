/*
    Path + Filename: src/desktop/utils/LOL_API/index.ts
*/


import Champion from '../../components/maincontent/settings/Champion'

const API_key = 'RGAPI-7698957e-20a3-4cb4-b746-0e6808a78d04'

export async function fetchEncryptedSummonerId(summonerName, summonerRegion): Promise<string> {
	const url = `https://${summonerRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`
	const res = await fetch(url, {
		headers: {
			'X-Riot-Token': API_key
		}
	})
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

export async function isInGame(summonerName) {
	// const encryptedSummonerID = await fetchEncryptedSummonerID(summonerName)
	return true
}