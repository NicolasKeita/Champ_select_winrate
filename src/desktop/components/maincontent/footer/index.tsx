/*
    Path + Filename: src/desktop/components/footer/myContextMenu.tsx
*/

import React, {useState} from 'react'
import styled from 'styled-components'
import {useAppDispatch, useAppSelector} from '@utils/hooks'
import {setFooterMessage} from '@background/store/slice/slice'
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
  text-align: center;
`

let countdownDurationLimit = 1000 * 60 * 3

function Footer(): JSX.Element {
	const dispatch = useAppDispatch()
	let footerMessageID = useAppSelector(state => state.slice.footerMessageID)
	const summonerName = sessionStorage.getItem('summonerName')
	let messageDisplayed = ''
	const [date, setDate] = useState(Date.now() + 6000)
	const [key, setKey] = useState(uniqid())
	if (footerMessageID != 201)
		countdownDurationLimit = 1000 * 60 * 3
	if (countdownDurationLimit < 1)
		footerMessageID = -1

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
		case 2:
			messageDisplayed = 'You are not in champ select.'
			break
		case 3:
			messageDisplayed = 'You are not in champ select.'
			break
		case 4:
			messageDisplayed = 'CSW only support draft game mode 5v5.'
			break
		case 5:
			messageDisplayed = 'You are in-game. Feel free to check the champ select forecast above but the app is only helpful in champ select.'
			break
		case 6:
			messageDisplayed = 'Use Custom game only for testing. Features cannot be accurate if the game is not real.'
			break
		case 7:
			messageDisplayed = 'Less than 5 ranked games were found. Play more ranked, use the app to win games!'
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

	if (!navigator.onLine)
		dispatch(setFooterMessage(100))
	window.onoffline = () => dispatch(setFooterMessage(100))
	window.ononline = () => dispatch(setFooterMessage(101))

	const renderer = ({seconds, completed}) => {
		if (completed) {
			const summonerRegion = sessionStorage.getItem('summonerRegion')
			const encryptedSummonerId = sessionStorage.getItem('encryptedSummonerId')
			if (summonerRegion && encryptedSummonerId) {
				isInGame(summonerRegion, encryptedSummonerId)
					.then(isInGameBool => {
						if (isInGameBool) {
							dispatch(setFooterMessage(200))
						} else {
							countdownDurationLimit -= 6000
							setDate(Date.now() + 6000)
							setKey(uniqid())
						}
					})
					.catch(e => {
						console.error(e)
						countdownDurationLimit -= 6000
						setDate(Date.now() + 6000)
						setKey(uniqid())
					})
					.finally(() => {
					})
			} else
				return null
		} else
			return <span>{seconds}</span>
	}

	let msg: JSX.Element
	if (footerMessageID === 201) {
		msg = (
			<FooterTextStyle
				messageDisplayedLength={messageDisplayed.length}
				aria-label={'footerMessage'}
			>
				{messageDisplayed}
				<Countdown date={date} key={key}
						   renderer={renderer} />
				<span> sec</span>
			</FooterTextStyle>)
	} else {
		msg = (
			<FooterTextStyle
				messageDisplayedLength={messageDisplayed.length}
				aria-label={'footerMessage'}
			>
				{messageDisplayed}
			</FooterTextStyle>
		)
	}

	return (
		<FooterContainer>
			{msg}
		</FooterContainer>
	)
}

export default Footer
