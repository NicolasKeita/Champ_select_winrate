/*
    Path + Filename: src/desktop/MyApp.tsx
*/

import React from 'react'
import styled from 'styled-components'
import Header from './header'
import Settings from './settingsComponent'
import FooterAD from '../desktop/components/footerAD'
import {kWindowNames} from '../consts'
import SettingsInfos from '@settings/SettingsInfos'

const MyAppContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 1200px;
  height: 780px;
`

const SettingsMainContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const SettingsInfosContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 411px;
  width: 411px;
  max-width: 411px;
`

// Settings
function MyApp(): JSX.Element {
	return (
		<MyAppContainer aria-label={'myAppContainer'}>
			<Header />
			<SettingsMainContainer aria-label={'settingsMainContainer'}>
				<Settings />
				<SettingsInfosContainer aria-label={'settingsInfosContainer'}>
					<SettingsInfos />
					<FooterAD windowName={kWindowNames.settings} />
				</SettingsInfosContainer>
			</SettingsMainContainer>
		</MyAppContainer>
	)
}

export default MyApp
