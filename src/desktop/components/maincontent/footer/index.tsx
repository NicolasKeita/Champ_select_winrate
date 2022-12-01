/*
    Path + Filename: src/desktop/components/footer/myContextMenu.tsx
*/

import React, {useEffect} from 'react'
import styled from 'styled-components'
import FooterText from '@utils/FooterText'
import {useAppDispatch, useAppSelector} from '@utils/hooks'
import {setFooterMessage} from '@utils/store/action'

const FooterContainer = styled.footer`
  background: linear-gradient(to right, rgb(63, 62, 62), #363636, #323232);
  flex: 0;
  display: flex;
  justify-content: center;
  padding: 4px 0 4px 0;
`
const FooterTextStyle = styled.h1`
  background: -webkit-linear-gradient(#e8730e, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

function Footer(): JSX.Element {
	const dispatch = useAppDispatch()
	const footerMessageID = useAppSelector((state) => state.footerMessageID)
	let messageDisplayed = ''

	switch (footerMessageID) {
		case -1:
			messageDisplayed = 'League client is not open.'
			break
		case 0:
			messageDisplayed = ''
			break
		case 1:
			messageDisplayed = 'You are not in champ select.'
			break
		case 100:
			messageDisplayed = 'Check your internet connection.'
			break
		case 101:
			messageDisplayed = 'You are back online.'
			break
		default:
			messageDisplayed = 'League client is not open.'
	}

	useEffect(() => {
		if (!navigator.onLine) { dispatch(setFooterMessage(100)) }
		window.onoffline = () => { dispatch(setFooterMessage(100)) }
		window.ononline = () => { dispatch(setFooterMessage(101)) }
	}, [])
	return (
		<FooterContainer>
			<FooterTextStyle>{messageDisplayed}</FooterTextStyle>
		</FooterContainer>
	)
}

export default Footer
