/*
    Path + Filename: src/desktop/utils/LOL_API/index.ts
*/

export async function fetchEncryptedSummonerId(summonerName : string, summonerRegion : string): Promise<string> {
	const url = `https://4nuo1ouibd.execute-api.eu-west-3.amazonaws.com/csw_api_proxy/summoner/${summonerName}/${summonerRegion.toLowerCase()}`
	let res
	try {
		res = await fetch(url)
	} catch (e) {
		console.error('CSW_error: following call : fetch(' + url + ' caught' +
			' error;  ')
		return ''
	}
	try {
		const data = await res.json()
		return data.id
	} catch (e) {
		console.error('CSW_error: following call : res.json() caught error; previously : fetch(' + url)
		return ''
	}
}

export async function isInGame(summonerRegion : string, encryptedSummonerId : string): Promise<boolean | null> {
	const url = `https://4nuo1ouibd.execute-api.eu-west-3.amazonaws.com/csw_api_proxy/spectator/${encryptedSummonerId}/${summonerRegion.toLowerCase()}`
	let res
	try {
		res = await fetch(url)
	} catch (e) {
			console.error('CSW_error: following call : fetch(' + url + ' caught' +
				' error;  ' + e)
				return null
	}
	if (!res.ok && res.status != 404) {
		console.error('CSW_error: following call : fetch(' + url + ' caught error;  ')
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
		return null
	}
}