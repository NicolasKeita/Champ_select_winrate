/*
    Path + Filename: src/desktop/utils/LOL_API/index.ts
*/

export async function fetchEncryptedSummonerId(summonerName : string, summonerRegion : string): Promise<string> {
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
		return data.id
	} catch (err : unknown) {
		const e = err as Error
		throw new Error(e.message)
	}
}

export async function isInGame(summonerRegion : string, encryptedSummonerId : string): Promise<boolean> {
	const url = `https://4nuo1ouibd.execute-api.eu-west-3.amazonaws.com/csw_api_proxy/spectator/${encryptedSummonerId}/${summonerRegion.toLowerCase()}`
	let res
	try {
		res = await fetch(url)
	} catch (e) {
		throw new Error('CSW_error: following call : fetch(' + url + ' caught' +
			' error;  ')
	}
	if (!res.ok && res.status != 404)
		throw new Error('CSW_error: following call : fetch(' + url + ' caught error;  ')
	try {
		const data = await res.json()
		if (data && data.status) {
			if (data.status.status_code === 404)
				return false
			else
				throw new Error(`CSW_error: fetch(${url}) returned an error code : ${data.status.status_code}`)
		} else if (data && data.gameId)
			return true
		else
			throw new Error(`CSW_error: fetch(${url}) returned an error unknown (without error code?)`)
	} catch (e) {
		throw new Error('CSW_error: following call : res.json() caught error; previously : fetch(' + url)
	}
}