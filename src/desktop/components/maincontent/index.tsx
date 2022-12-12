/*
    Path + Filename: src/desktop/components/maincontent/myContextMenu.tsx
*/

import {useAppSelector} from '@utils/hooks'

import React from 'react'
import styled from 'styled-components'

import Footer from './../../components/maincontent/footer'
import Main from './../../components/maincontent/main'
import Settings from './../../components/maincontent/settings'
import {selectBooleanSettingsPage} from '@utils/store/selectors'

const MainContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 424px;
  background: linear-gradient(to right, rgb(63, 62, 62), #363636, #323232);
`

function MainContent() {
	const settingsPage = useAppSelector(selectBooleanSettingsPage())

	let currentPage: JSX.Element
	if (!settingsPage) {
		currentPage =
			<div id='main+footer'
				 style={{display: 'flex', flexDirection: 'column', flex: 1}}>
				<Main />
				<Footer />
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
