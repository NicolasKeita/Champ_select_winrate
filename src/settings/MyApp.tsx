/*
    Path + Filename: src/desktop/MyApp.tsx
*/

import React from 'react'
import styled from 'styled-components'
import Header from './header'
import Settings from './settingsComponent'
import FooterAD from '../desktop/components/footerAD'
import {kWindowNames} from '../consts'

const MyAppContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 400px;
  height: 780px;
`

// Settings
function MyApp(): JSX.Element {
	return (
		<MyAppContainer>
			<Header />
			<Settings />
			<FooterAD windowName={kWindowNames.settings} />
		</MyAppContainer>
	)
}

export default MyApp
