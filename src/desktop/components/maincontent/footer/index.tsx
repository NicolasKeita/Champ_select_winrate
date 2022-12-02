/*
    Path + Filename: src/desktop/components/footer/myContextMenu.tsx
*/

import React, {useEffect} from 'react'
import styled from 'styled-components'
import {useAppDispatch, useAppSelector} from '@utils/hooks'
import {setClientStatus, setFooterMessage} from '@utils/store/action'
import {isInGame} from '@utils/LOL_API'
import LCU_API_connector from '@utils/LCU_API_connector'

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

const LCU_interface = new LCU_API_connector()

function Footer(): JSX.Element {
	console.log('Footer rendered')
	const dispatch = useAppDispatch()
	const footerMessageID = useAppSelector(state => state.footerMessageID)
	const summonerName = useAppSelector(state => state.summonerName)
	const clientStatus = useAppSelector(state => state.leagueClientStatus)
	let messageDisplayed = ''
	console.log(`CLient status ${clientStatus}`)

	useEffect(() => {
		LCU_interface.onClientClosed(() => {
			const previousClientStatus = clientStatus
			console.log('onClose')
			console.log(clientStatus)
			console.log(previousClientStatus)
			dispatch(setClientStatus(-1))
			if (previousClientStatus == 0) {
				if (isInGame(summonerName))
					dispatch(setFooterMessage(200))
				else
					dispatch(setFooterMessage(201))
			}
			console.log('Client CLOSED !')
			LCU_interface.removeAllListeners()
		})
	}, [clientStatus, dispatch, summonerName])

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
			messageDisplayed = `You failed dodging. ${summonerName} is in-game.`
			break
		case 201:
			messageDisplayed = `You dodged successfully. ${summonerName} is not in-game.`
			break
		default:
			messageDisplayed = 'League client is not open.'
	}

	useEffect(() => {
		if (!navigator.onLine) { dispatch(setFooterMessage(100)) }
		window.onoffline = () => { dispatch(setFooterMessage(100)) }
		window.ononline = () => { dispatch(setFooterMessage(101)) }
	}, [dispatch])
	return (
		<FooterContainer>
			<FooterTextStyle>{messageDisplayed}</FooterTextStyle>
		</FooterContainer>
	)
}

export default Footer
