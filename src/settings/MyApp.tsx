/*
    Path + Filename: src/desktop/MyApp.tsx
*/

import React from 'react'
import styled from 'styled-components'
import Header from './header'
import {AppWindow} from '../AppWindow'
import ReplacementFooterAD from '../desktop/components/footerAD/replacement'
import Settings from './settingsComponent'

const MyAppContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

type PropType = {
	myWindow: AppWindow
}

function MyApp(props: PropType): JSX.Element {

	let Footer: JSX.Element
	// if (false)
	// Footer = <FooterAD />
	// else
	Footer = <ReplacementFooterAD />
	return (
		<MyAppContainer>
			<Header myWindow={props.myWindow} />
			<Settings />
			{Footer}
		</MyAppContainer>
	)
}

export default MyApp
