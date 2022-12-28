/*
    Path + Filename: src/desktop/utils/fetchSummonerInfo/fetchSummonerInfo.ts
*/


import {doWithRetry} from 'do-with-retry'
import {fetchMatchHistoryId} from '@utils/LOL_API'

export async function fetchSummonerInfo() {


	// const matchHistoryIds = await doWithRetry(async retry => {
	// 	try {
	// 		return await fetchMatchHistoryId(thunkParam.region, thunkParam.puuid)
	// 	} catch (e) {
	// 		retry(e)
	// 	}
	// }, {maxAttempts: 20, initTimeout: 1100})
	// 	.catch(e => {
	// 		throw e.cause
	// 	}) as string[]
}