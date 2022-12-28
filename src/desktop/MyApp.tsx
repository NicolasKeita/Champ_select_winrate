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
	AppDispatch,
	copyFromAnotherSetting,
	fetchAllChampions
} from '@utils/store/store'

import {useAppDispatch} from '@utils/hooks'
import {
	fetchCSWgameVersion
} from '@utils/fetchLocalConfigJson/fetchChampionsFromConfigJson'
import ReplacementFooterAD from './components/footerAD/replacement'
import {doWithRetry} from 'do-with-retry'
import {addLCU_listeners} from '@utils/LCU_API_connector/addLCU_listeners'

const MyAppContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

type My_PropType = {
	my_window: AppWindow
}

function MyApp(props: My_PropType): JSX.Element {
	const my_window = props.my_window
	const dispatch = useAppDispatch()

	tryPopulateStoreWithSettingsFromLocalStorage(dispatch)

	function tryPopulateStoreWithSettingsFromLocalStorage(dispatch: AppDispatch) {
		const config: Config = JSON.parse(localStorage.getItem('config') ?? '{}')
		if (Object.keys(config).length != 0 && config.champions && config.champions.length != 0) {
			dispatch(copyFromAnotherSetting(config))
		}
	}

	useEffect(() => {
		populateStoreWithAllLeagueChampions(dispatch).catch(e => {console.error(e)})
		addLCU_listeners(dispatch).catch(e => {console.error(e)})

		async function populateStoreWithAllLeagueChampions(dispatch: AppDispatch) {
			const gameVersion = await doWithRetry(async retry => {
				try {
					return await fetchCSWgameVersion()
				} catch (e) {
					retry(e)
				}
			}, {maxAttempts: 20, initTimeout: 1100})
				.catch(e => {
					throw e.cause
				}) as string
			const userGameVersion: string | null = localStorage.getItem('CSW_gameVersion')
			if (userGameVersion != gameVersion) {
				localStorage.setItem('CSW_gameVersion', gameVersion)
				dispatch(fetchAllChampions())
			}
		}
	}, [dispatch])

	let Footer: JSX.Element
	if (false)
		Footer = <FooterAD />
	else
		Footer = <ReplacementFooterAD />
	return (
		<MyAppContainer id='myApp'>
			<Header my_window={my_window} />
			<MainContent />
			{Footer}
		</MyAppContainer>
	)
}

export default MyApp
