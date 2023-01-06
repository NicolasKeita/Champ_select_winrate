/*
    Path + Filename: src/desktop/MyApp.tsx
*/

import React from 'react'
import styled from 'styled-components'
import Header from './header'
import ReplacementFooterAD from '../desktop/components/footerAD/replacement'
import Settings from './settingsComponent'

const MyAppContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

function MyApp(): JSX.Element {

	let Footer: JSX.Element
	// if (false)
	// Footer = <FooterAD />
	// else
	Footer = <ReplacementFooterAD />
	return (
		<MyAppContainer>
			<Header />
			<Settings />
			{Footer}
		</MyAppContainer>
	)
}

export default MyApp
