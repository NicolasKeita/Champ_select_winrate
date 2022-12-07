/*
    Path + Filename: src/desktop/MyApp.tsx
*/

import React, {useEffect} from 'react'
import styled from 'styled-components'

import {AppWindow} from '../AppWindow'
import Header from './components/header'
import MainContent from './components/maincontent'
import FooterAD from './components/footerAD'
import Config from './components/maincontent/settings/Config'
import {
	copyFromAnotherSetting,
	fillChampSelectDisplayed,
	resetChampSelectDisplayed,
	setClientStatus,
	setFooterMessage
} from '@utils/store/store'

import {useAppDispatch} from '@utils/hooks'
import LCU_API_connector from '@utils/LCU_API_connector'
import {fetchEncryptedSummonerId} from '@utils/LOL_API'
import { populateDefaultConfig } from '@utils/store/action'
import {parse} from '@typescript-eslint/parser'

const MyAppContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

type My_PropType = {
	my_window: AppWindow
}

const LCU_interface = new LCU_API_connector()

function MyApp(props: My_PropType): JSX.Element {
	const my_window = props.my_window
	const dispatch = useAppDispatch()

	useEffect(() => {
		function initializeDefaultConfig() {
			const config: Config = JSON.parse(localStorage.getItem('config') ?? '{}')
			if (Object.keys(config).length == 0 || config.champions.length == 0)
				dispatch(populateDefaultConfig())
			else
				dispatch(copyFromAnotherSetting(config))
		}

		function addLCU_listeners() {
			function handleGameFlow(game_flow) {
				if (game_flow && game_flow.phase) {
					if (game_flow.phase === 'ChampSelect') {
						dispatch(resetChampSelectDisplayed())
						dispatch(setClientStatus(0))
					} else if (game_flow.phase === 'Lobby') {
						dispatch(setClientStatus(2))
					} else if (game_flow.phase == 'Matchmaking') {
						dispatch(setClientStatus(3))
					}
					else {
						const previousClientStatus = sessionStorage.getItem('clientStatus')
						if (previousClientStatus && parseInt(previousClientStatus) === 0 && game_flow.phase === 'None') {
							// ↑ if user close his client manually (dodge)
							dispatch(setClientStatus(-1))
							dispatch(setFooterMessage(201))
						} else {
							dispatch(setClientStatus(1))
						}
					}
				}
			}

			function handleChampSelect(champ_select) {
				const raw = JSON.parse(champ_select.raw)
				dispatch(fillChampSelectDisplayed({
					actions: raw.actions,
					localPlayerCellId: parseInt(raw.localPlayerCellId),
					myTeam: raw.myTeam
				}))
				dispatch(setClientStatus(0))
			}

			function handleFeaturesCallbacks(info) {
				if (info.feature === 'game_flow') handleGameFlow(info.info.game_flow)
				if (info.feature === 'champ_select') handleChampSelect(info.info.champ_select)
			}

			LCU_interface.onClientAlreadyRunningOrNot(clientsInfos => {
				if (LCU_interface.isLeagueClient(clientsInfos)) {
					fetchingSummonerNameAndRegionEvery5sec()
					// ↑ if client's already running
					LCU_interface.addAllListeners(clientsInfos, handleFeaturesCallbacks)
					dispatch(setClientStatus(1))
				} else {
					dispatch(setClientStatus(-1))
				}
			})
			LCU_interface.onClientLaunch(clientInfo => {
				LCU_interface.addAllListeners(clientInfo, handleFeaturesCallbacks)
				dispatch(setClientStatus(1))
				fetchingSummonerNameAndRegionEvery5sec()
			})
			LCU_interface.onClientClosed(async () => {
				dispatch(setClientStatus(-1))
				LCU_interface.removeAllListeners()
			})
		}

		function fetchingSummonerNameAndRegionEvery5sec() {
			const intervalId = setInterval(() => {
				overwolf.games.launchers.events.getInfo(10902, (result) => {
					if (result.success && result.res && result.res.summoner_info) {
						const name = result.res.summoner_info.internal_name
						const region = result.res.summoner_info.platform_id
						if (name == undefined || region == undefined)
							return
						sessionStorage.setItem('summonerName', name)
						sessionStorage.setItem('summonerRegion', region)
						fetchEncryptedSummonerId(name, region).then(encryptedSummonerId => {
							sessionStorage.setItem('encryptedSummonerId', encryptedSummonerId)
						})
						clearInterval(intervalId)
					}
				})
			}, 5000)
		}

		initializeDefaultConfig()
		addLCU_listeners()
	}, [dispatch])

	return (
		<MyAppContainer id='myApp'>
			<Header my_window={my_window} />
			<MainContent />
			{/*<FooterAD />*/}
		</MyAppContainer>
	)
}

export default MyApp
