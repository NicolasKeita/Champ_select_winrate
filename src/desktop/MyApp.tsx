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
	copyFromAnotherSetting, fillChampSelectDisplayed, populateDefaultConfig,
	resetChampSelectDisplayed, setClientStatus, setFooterMessage, setSummonerName
} from '@utils/store/action'
import {useAppDispatch, useAppSelector} from '@utils/hooks'
import LCU_API_connector from '@utils/LCU_API_connector'
import {isInGame} from '@utils/LOL_API'

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
	console.log('MyApp Rerender')

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
				console.log(game_flow)
				if (game_flow && game_flow.phase) {
					if (game_flow.phase === 'ChampSelect') {
						// ↑ Entering in champ select
						dispatch(resetChampSelectDisplayed())
						dispatch(setClientStatus(0))
					} else {
						const previousClientStatus = sessionStorage.getItem('clientStatus')
						if (!(previousClientStatus && parseInt(previousClientStatus) === 0 && game_flow.phase === 'None'))
							dispatch(setClientStatus(1))
					}
				}
			}

			function handleChampSelect(champ_select) {
				const raw = JSON.parse(champ_select.raw)
				dispatch(fillChampSelectDisplayed(raw.actions, parseInt(raw.localPlayerCellId)))
				dispatch(setClientStatus(0))
			}

			function handleSummonerInfo(summoner_info) {
				if (summoner_info.internal_name)
					dispatch(setSummonerName(summoner_info.internal_name))
			}

			function handleFeaturesCallbacks(info) {
				if (info.feature === 'game_flow') handleGameFlow(info.info.game_flow)
				if (info.feature === 'champ_select') handleChampSelect(info.info.champ_select)
				if (info.feature === 'summoner_info') handleSummonerInfo(info.info.summoner_info)
			}

			LCU_interface.onClientAlreadyRunningOrNot(clientsInfos => {
				if (LCU_interface.isLeagueClient(clientsInfos)) {
					// ↑ if client's already running
					const lolClient = LCU_interface.getLoLClient(clientsInfos)
					LCU_interface.storeSummonerName(lolClient, dispatch)
					dispatch(setClientStatus(1))
					LCU_interface.addAllListeners(clientsInfos, handleFeaturesCallbacks)
				} else {
					dispatch(setClientStatus(-1))
				}
			})
			LCU_interface.onClientLaunch(clientInfo => {
				LCU_interface.storeSummonerName(clientInfo, dispatch)
				LCU_interface.addAllListeners(clientInfo, handleFeaturesCallbacks)
				dispatch(setClientStatus(1))
			})
			LCU_interface.onClientClosed(() => {
				dispatch(setClientStatus(-1))
				LCU_interface.removeAllListeners()
			})
		}

		initializeDefaultConfig()
		addLCU_listeners()
	}, [dispatch])

	return (
		<MyAppContainer id='myApp'>
			<Header my_window={my_window} />
			<MainContent />
			<FooterAD />
		</MyAppContainer>
	)
}

export default MyApp
