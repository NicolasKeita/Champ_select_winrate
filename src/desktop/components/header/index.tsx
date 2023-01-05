/*
    Path + Filename: src/desktop/components/header/index.ts
*/

import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'


import '@public/css/desktop.css'
import '@public/css/general.css'
import '@public/css/modal.css'
import '@public/css/header.css'
import {kWindowNames} from '../../../consts'

import {
	rerenderSettings,
	resetSettings, toggleHelpPage
} from '../../../background/store/slice'
import {useAppDispatch} from '@utils/hooks'

import {Menu, Item, useContextMenu} from 'react-contexify'
import './ReactContexify.css'

const HeaderContainer = styled.header`
  background: linear-gradient(to right, rgb(63, 62, 62), #363636, #323232);
  padding: 8px;
  display: flex;
  align-items: center;
`
const Logo = styled.h1`
  font-size: 26px;
  font-family: Hero, serif;
  font-weight: 900;
  background: -webkit-linear-gradient(#904a0f, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;);
  cursor: inherit;
`
const CSWName = styled.h1`
  background: -webkit-linear-gradient(#a8540c, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-left: 20px;
  cursor: inherit;
`

function Header() {
	const headerRef = useRef(null)
	const dispatch = useAppDispatch()
	// const footerMessage = useAppSelector(state => state.slice.footerMessageID)

	// if (footerMessage == 5)
	// 	my_window.currWindow.minimize()

	function minimize(e) {
		if (e.buttons == 1) {
			overwolf.windows.minimize(kWindowNames.desktop)
		}
	}

	function close(e) {
		if (e.buttons == 1) {
			overwolf.windows.close(kWindowNames.desktop)
		}
	}

	useEffect(() => {
		overwolf.windows.getMainWindow().backgroundControllerInstance().setDragToWindow(kWindowNames.desktop, headerRef.current)
	}, [])

	function handleContextMenu(event) {
		show({
			event,
			props: {
				key: 'value'
			}
		})
	}

	function activateSettings(e) {
		if (e.buttons == 1) {
			const backgroundWindow = overwolf.windows.getMainWindow()
			backgroundWindow.backgroundControllerInstance().toggleSettingsWindow()
		}
	}

	function activateHelp(e) {
		if (e.buttons == 1) {
			dispatch(toggleHelpPage())
		}
	}

	const {show} = useContextMenu({
		id: 'settingsButton'
	})

	return (
		<HeaderContainer className={'app-header'} ref={headerRef}>
			<Logo>CSW</Logo>
			<CSWName>Champ Select Winrate</CSWName>
			<div className='window-controls-group'>
				<button className={'window-control window-control-support'}
						onMouseDown={e => activateHelp(e)}
						aria-label={'helpButton'}
				/>
				<button className={'window-control window-control-settings'}
						onMouseDown={e => activateSettings(e)}
						onContextMenu={handleContextMenu}
						aria-label={'settingsButton'}
				/>
				<Menu id={'settingsButton'}>
					<Item onClick={() => {
						dispatch(resetSettings())
						dispatch(rerenderSettings())
					}}>
						Reset config
					</Item>
				</Menu>

				<button className={'window-control window-control-minimize'}
						onMouseDown={minimize} />
				<button className={'window-control window-control-close'}
						aria-label={'shutdownAppButton'}
						onMouseDown={close} />
			</div>
		</HeaderContainer>
	)
}

export default Header
