/*
    Path + Filename: src/desktop/utils/LCU_API_connector/addLCU_listeners.ts
*/

import {
	cleanHistoryMatch,
	resetChampSelectDisplayed,
	setClientStatus,
	setFooterMessage,
	setHistoryIsLoading
} from '../../../background/store/slice/slice'
import {fetchEncryptedSummonerId} from '@utils/LOL_API'
import LCU_API_connector from '@utils/LCU_API_connector'
import {AppDispatch} from '../store/store'
import {GameFlow} from '../../../types/GameFlow'
import {ChampSelect} from '../../../types/ChampSelect'
import {
	fillHistoryDisplayed
} from '../../../background/store/slice/fillHistoryDisplayed'
import {
	fillChampSelectDisplayed
} from '../../../background/store/slice/fillChampSelectDIsplayed'

const LCU_interface = new LCU_API_connector()

export async function addLCU_listeners(dispatch: AppDispatch) {
	function handleGameFlow(game_flow: GameFlow) {
		if (game_flow && game_flow.phase) {
			if (game_flow.phase === 'ChampSelect') {
				dispatch(resetChampSelectDisplayed())
			} else if (game_flow.phase === 'Lobby') {
				dispatch(setClientStatus(2))
				dispatch(setFooterMessage(2))
			} else if (game_flow.phase == 'Matchmaking') {
				dispatch(setClientStatus(3))
				dispatch(setFooterMessage(3))
			} else if (game_flow.phase == 'GameStart' || game_flow.phase == 'InProgress') {
				//TODO careful put footermessage above, change logic so I cannot do mistakes
				dispatch(setFooterMessage(5))
				dispatch(setClientStatus(1))
			} else if (game_flow.phase == 'WaitingForStats') {
				dispatch(setClientStatus(1))
				dispatch(setFooterMessage(1))
				setTimeout(dispatch, 12000, fillHistoryDisplayed(
					{
						region: sessionStorage.getItem('summonerRegion') || '',
						puuid: sessionStorage.getItem('puuid') || ''
					}
				))
			} else if (game_flow.phase === 'None') {
				const previousClientStatus = sessionStorage.getItem('clientStatus')
				const previousFooterMessageId = sessionStorage.getItem('footerMessageId')
				const isSupportedGameMode = !sessionStorage.getItem('unsupported game_mode')
				if (previousClientStatus && parseInt(previousClientStatus) === 0) {
					//if (previousClientStatus && parseInt(previousClientStatus) === 0 && isSupportedGameMode) {
					// ↑ if user close his client manually (dodge)
					dispatch(setClientStatus(-1))
					dispatch(setFooterMessage(201))
				} else if (previousFooterMessageId && (parseInt(previousFooterMessageId) === 201 || parseInt(previousFooterMessageId) === 200)
					&& previousClientStatus && (parseInt(previousClientStatus) === -1)) {
					//&& previousClientStatus && (parseInt(previousClientStatus) === -1) && isSupportedGameMode) {
					// ↑ if user close his client manually (dodge), might receive x2 game_flow None
					dispatch(setClientStatus(-1))
				} else {
					dispatch(setClientStatus(1))
					dispatch(setFooterMessage(1))
				}
			} else {
				dispatch(setClientStatus(1))
				dispatch(setFooterMessage(1))
			}
		}
	}

	function handleChampSelect(champ_select: {raw: string}) {
		const raw: ChampSelect = JSON.parse(champ_select.raw)
		if (raw.localPlayerCellId == -1)
			return
		dispatch(setClientStatus(0))
		dispatch(setFooterMessage(0))
		if (raw.actions.length == 8) {
			sessionStorage.removeItem('unsupported game_mode')
		} else {
			if (raw.actions.length == 0) { // Aram
				dispatch(setFooterMessage(4))
			} else
				dispatch(setFooterMessage(6))
			sessionStorage.setItem('unsupported game_mode', 'true')
		}
		dispatch(fillChampSelectDisplayed({
			actions: raw.actions,
			localPlayerCellId: raw.localPlayerCellId,
			myTeam: raw.myTeam
		}))
	}

	type InfoEventOW = {
		feature: 'game_flow' | 'champ_select'
		info: {
			game_flow?: GameFlow,
			champ_select?: {
				raw: string
			}
		}
	}

	function handleFeaturesCallbacks(info: InfoEventOW) {
		if (info.feature === 'game_flow' && info.info.game_flow)
			handleGameFlow(info.info.game_flow)
		if (info.feature === 'champ_select' && info.info.champ_select)
			handleChampSelect(info.info.champ_select)
	}

	LCU_interface.onClientAlreadyRunningOrNot(clientsInfos => {
		if (LCU_interface.isLeagueClient(clientsInfos)) {
			fetchingSummonerNameAndRegionEvery5sec(dispatch)
			// ↑ if client's already running
			LCU_interface.addAllListeners(clientsInfos, handleFeaturesCallbacks)
			dispatch(setClientStatus(1))
			dispatch(setFooterMessage(1))
		} else {
			dispatch(setClientStatus(-1))
			dispatch(setFooterMessage(-1))
		}
	})
	LCU_interface.onClientLaunch(clientInfo => {
		LCU_interface.addAllListeners(clientInfo, handleFeaturesCallbacks)
		dispatch(setClientStatus(1))
		dispatch(setFooterMessage(1))
		fetchingSummonerNameAndRegionEvery5sec(dispatch)
	})
	LCU_interface.onClientClosed(async () => {
		dispatch(setClientStatus(-1))
		dispatch(setFooterMessage(-1))
		LCU_interface.removeAllListeners()
	})
}

function fetchingSummonerNameAndRegionEvery5sec(dispatch: AppDispatch) {
	dispatch(cleanHistoryMatch())
	dispatch(setHistoryIsLoading({
		historyDisplayedIndex: null,
		isLoading: true
	}))
	const intervalId = setInterval(() => {
		overwolf.games.launchers.events.getInfo(10902, (result) => {
			if (result.success && result.res && result.res.summoner_info) {
				const name = result.res.summoner_info.internal_name
				const region = result.res.summoner_info.platform_id
				if (name == undefined || region == undefined)
					return
				sessionStorage.setItem('summonerName', name)
				sessionStorage.setItem('summonerRegion', region)
				fetchEncryptedSummonerId(name, region)
					.then(({encryptedSummonerId, puuid}) => {
						sessionStorage.setItem('encryptedSummonerId', encryptedSummonerId)
						sessionStorage.setItem('puuid', puuid)
						dispatch(fillHistoryDisplayed({
							region: region,
							puuid: puuid
						}))
					})
					.catch((e) => {
						console.error(e + ' - retrying in 5sec')
						sessionStorage.setItem('encryptedSummonerId', '')
						sessionStorage.setItem('puuid', '')
					})
					.finally(() => {
						const encryptedSummonerId = sessionStorage.getItem('encryptedSummonerId')
						if (encryptedSummonerId && encryptedSummonerId != '') {
							clearInterval(intervalId)
						}
					})
			}
		})
	}, 5000)
}
