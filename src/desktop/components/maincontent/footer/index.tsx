/*
    Path + Filename: src/desktop/components/footer/myContextMenu.tsx
*/

import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {useAppDispatch, useAppSelector} from '@utils/hooks'
import {setFooterMessage} from '@utils/store/store'
import Countdown from 'react-countdown'
import {isInGame} from '@utils/LOL_API'
import uniqid from 'uniqid'

const FooterContainer = styled.footer`
  background: linear-gradient(to right, rgb(63, 62, 62), #363636, #323232);
  flex: 0;
  display: flex;
  justify-content: center;
  padding: 4px 0 4px 0;
  //height: 20px;
`
const FooterTextStyle = styled.h1`
  background: -webkit-linear-gradient(#e8730e, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: ${props => props.messageDisplayedLength < 50 ? '14px' : '11px'};
`

function Footer(): JSX.Element {
	const dispatch = useAppDispatch()
	const footerMessageID = useAppSelector(state => state.slice.footerMessageID)
	console.log(` footer message id is : ${footerMessageID}`)
	const summonerName = sessionStorage.getItem('summonerName')
	let messageDisplayed = ''
	const [date, setDate] = useState(Date.now() + 6000)
	const [key, setKey] = useState(uniqid())

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
		case 200:
			messageDisplayed = `Dodge failure. ${summonerName} is in-game.`
			break
		case 201:
			messageDisplayed = `Dodge successful. ${summonerName} is not in-game. Checking again in `
			break
		default:
			messageDisplayed = 'League client is not open.'
	}

	useEffect(() => {
		if (!navigator.onLine) { dispatch(setFooterMessage(100)) }
		window.onoffline = () => { dispatch(setFooterMessage(100)) }
		window.ononline = () => { dispatch(setFooterMessage(101)) }
	}, [dispatch])

	let msg: JSX.Element
	const renderer = ({seconds, completed}) => {
		if (completed) {
			const summonerRegion = sessionStorage.getItem('summonerRegion')
			const encryptedSummonerId = sessionStorage.getItem('encryptedSummonerId')
			if (summonerRegion && encryptedSummonerId) {
				isInGame(summonerRegion, encryptedSummonerId).then(isInGameBool => {
					if (isInGameBool) {
						dispatch(setFooterMessage(200))
					} else {
						setDate(Date.now() + 6000)
						setKey(uniqid())
					}
				})
			} else
				return null
		} else
			return <span>{seconds}</span>
	}

	if (footerMessageID === 201) {
		msg = (
			<div>
				{messageDisplayed}
				<Countdown date={date} key={key}
						   renderer={renderer} />
				<span> sec</span>
			</div>)
	} else {
		msg = (<div>{messageDisplayed}</div>)
	}

	return (
		<FooterContainer>
			<FooterTextStyle
				messageDisplayedLength={messageDisplayed.length}>{msg}</FooterTextStyle>
		</FooterContainer>
	)
}

export default Footer
