/*
    Path + Filename: src/desktop/MyApp.tsx
*/

import React from 'react'
import styled from 'styled-components'

import {AppWindow} from '../AppWindow'
import Header from './components/header'
import MainContent from './components/maincontent'
import FooterAD from './components/footerAD'

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

	return (
		<MyAppContainer id='myApp'>
			<Header my_window={my_window} />
			<MainContent />
			<FooterAD />
		</MyAppContainer>
	)
}

export default MyApp
