/*
    Path + Filename: src/desktop/components/maincontent/myContextMenu.tsx
*/

import {useAppDispatch, useAppSelector} from '@utils/hooks'

import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

import LCU from '@utils/LCU'
import PlayerProfile from '@utils/playerProfile'
import Footer from './../../components/maincontent/footer'
import Main from './../../components/maincontent/main'
import Settings from './../../components/maincontent/settings'
import Config from './../../components/maincontent/settings/Config'
import {copyFromAnotherSetting, populateDefaultConfig} from '@utils/store/action'
import {selectInstancedConfig} from '@utils/store/selectors'

const LCU_interface = new LCU()
const playerProfile = new PlayerProfile()

let x = 0
let g_rendered = false


const MainContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 424px;
`

function MainContent() {
	console.log('mainCOntent renderer')
	const [setClientStatusToOPEN, setClientStatusToCLOSE, setClientStatusToINSIDE_CHAMP_SELECT] = useChangeClientStatus()
	const [setChampionHover] = useChangeImgProfile()
	const settings = useAppSelector(selectInstancedConfig())
	const dispatch = useAppDispatch()

	if (!g_rendered) {
		const settingsCpy = new Config(settings)
		g_rendered = true
		const config: Config = JSON.parse(localStorage.getItem('config') ?? '{}')
		if (Object.keys(config).length == 0 || config.champions.length == 0) {
			dispatch(populateDefaultConfig(settingsCpy))
		} else {
			dispatch(copyFromAnotherSetting(config))
		}
	}

	// TODO: Maybe change position of this code ?
	function useChangeClientStatus() {
		const [, setClientStatus] = useState(playerProfile.clientStatus)

		function setClientStatusToOPEN() {
			playerProfile.setClientStatusToOPEN()
			setClientStatus(playerProfile.clientStatus)
		}

		function setClientStatusToCLOSE() {
			playerProfile.setClientStatusToCLOSED()
			setClientStatus(playerProfile.clientStatus)
		}

		function setClientStatusToINSIDE_CHAMP_SELECT() {
			playerProfile.setClientStatusToINSIDE_CHAMP_SELECT()
			setClientStatus(playerProfile.clientStatus)
		}

		return [setClientStatusToOPEN, setClientStatusToCLOSE, setClientStatusToINSIDE_CHAMP_SELECT] as const
	}

	function useChangeImgProfile() {
		const [, setImgProfile] = useState(-1)

		async function setChampionHover(actions, localCellId) {
			await playerProfile.fillChampSelect(actions, localCellId, settings.champions)
			x += 1
			setImgProfile(x)
		}

		return [setChampionHover]
	}

	function handleGameFlow(game_flow) {
		if (game_flow && game_flow.phase) {
			if (game_flow.phase === 'ChampSelect') {
				playerProfile.resetChampSelect()
				setClientStatusToINSIDE_CHAMP_SELECT()
				// TODO check si le mec est deja en champ select quand l'app est lancé feature : 'champ select"' received
			} else {
				setClientStatusToOPEN()
			}
		}
	}

	function handleChampSelect(champ_select) {
		const raw = JSON.parse(champ_select.raw)
		setChampionHover(raw.actions, parseInt(raw.localPlayerCellId))
	}

	function handleFeaturesCallbacks(info) {
		if (info.feature === 'game_flow') handleGameFlow(info.info.game_flow)
		if (info.feature === 'champ_select') handleChampSelect(info.info.champ_select)
	}

	useEffect(() => {
		LCU_interface.onClientAlreadyRunningOrNot(clientsInfos => {
			// if client's already running
			if (LCU_interface.isLeagueClient(clientsInfos)) {
				setClientStatusToOPEN()
				LCU_interface.addAllListeners(clientsInfos, handleFeaturesCallbacks)
			} else {
				setClientStatusToCLOSE()
			}
		})
		LCU_interface.onClientLaunch(clientInfo => {
			LCU_interface.addAllListeners(clientInfo, handleFeaturesCallbacks)
			setClientStatusToOPEN()
			// LCU_interface.populateCredentials()
			// todo save credentials and port to playerProfile
		})
		LCU_interface.onClientClosed(() => {
			setClientStatusToCLOSE()
			LCU_interface.removeAllListeners()
		})
	}, []) // TODO exhausive-deps-problem Figure out Why adding SetClientStatusToOPEN there will trigger useEffect every render (I just want to let this empty array)

	let currentPage: JSX.Element
	if (!settings.settingsPage) {
		currentPage =
			<div id='main+footer' style={{display: 'flex', flexDirection: 'column', flex: 1}}>
				<Main playerProfile={playerProfile} />
				<Footer playerProfile={playerProfile} />
			</div>
	} else
		currentPage = <Settings />

	return (
		<MainContentContainer id='mainContentContainer'>
			{currentPage}
		</MainContentContainer>
	)
}

export default MainContent
