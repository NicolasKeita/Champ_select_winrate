/*
    Path + Filename: src/desktop/MyApp.tsx
*/

import React from 'react'
import styled from 'styled-components'
import Header from './header'
import ReplacementFooterAD from '../desktop/components/footerAD/replacement'
import Settings from './settingsComponent'
import FooterAD from '../desktop/components/footerAD'

const MyAppContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 400px;
  height: 780px;
`

function MyApp(): JSX.Element {

	let Footer: JSX.Element
	// const testADBoolean = localStorage.getItem('owAdsForceAdUnit')
	// if (testADBoolean == 'Ad_test') {
	Footer = <FooterAD />
	// } else
	// 	Footer = <ReplacementFooterAD />
	return (
		<MyAppContainer>
			<Header />
			<Settings />
			{Footer}
		</MyAppContainer>
	)
}

export default MyApp
