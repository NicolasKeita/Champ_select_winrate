/*
    Path + Filename: src/desktop/components/maincontent/myContextMenu.tsx
*/

import {useAppSelector} from '@utils/hooks'

import React from 'react'
import styled from 'styled-components'

import Footer from './../../components/maincontent/footer'
import ChampSelect from './../../components/maincontent/main'
import Settings from './../../components/maincontent/settings'
import {
	selectBooleanSettingsPage,
	selectCurrentPage
} from '@utils/store/selectors'
import {ConfigPage} from './settings/Config'
import History from './main/history'
import HelpPage from './main/helpPage'

const MainContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 424px;
  background: linear-gradient(to right, rgb(63, 62, 62), #363636, #323232);
`

function MainContent() {
	const settingsPage = useAppSelector(selectBooleanSettingsPage())
	const currentPage = useAppSelector(selectCurrentPage())
	const helpPageVisible = useAppSelector(state => state.slice.helpPageVisible)

	let currentPageSet: JSX.Element
	if (!settingsPage && !helpPageVisible) {
		currentPageSet =
			<div id='main+footer'
				 style={{display: 'flex', flexDirection: 'column', flex: 1}}>
				{currentPage === ConfigPage.CHAMPSELECT ? <ChampSelect /> :
					<History />}
				<Footer />
			</div>
	} else if (settingsPage) {
		currentPageSet = <Settings />
	} else
		currentPageSet = <HelpPage />

	return (
		<MainContentContainer id='mainContentContainer'>
			{currentPageSet}
		</MainContentContainer>
	)
}

export default MainContent
