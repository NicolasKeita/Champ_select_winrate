/*
    Path + Filename: src/desktop/components/header/index.ts
*/

import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'

import {kWindowNames} from '../../../consts'
import {
	rerenderSettings,
	resetSettings, toggleHelpPage
} from '@background/store/slice/slice'
import {useAppDispatch} from '@utils/hooks'

import {Menu, Item, useContextMenu} from 'react-contexify'
import './ReactContexify.css' assert {type: 'css'}
import headerCss from './header.module.css' assert {type: 'css'}

const HeaderContainer = styled.header`
  background: linear-gradient(to right, rgb(63, 62, 62), #363636, #323232);
  padding: 8px;
  display: flex;
  align-items: center;
`
const Logo = styled.h1`
  font-size: 26px !important;
  font-family: Hero, serif;
  font-weight: bold !important;
  background: -webkit-linear-gradient(#904a0f, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
		<HeaderContainer
			className={headerCss.appHeader}
			ref={headerRef}
		>
			<Logo>CSW</Logo>
			<CSWName>Champ Select Winrate</CSWName>
			<div className={headerCss.windowControlsGroup}>
				<button
					className={[headerCss.windowControl, headerCss.windowControlSupport].join(' ')}
					onMouseDown={e => activateHelp(e)}
					aria-label={'helpButton'}
				/>
				<button
					className={[headerCss.windowControl, headerCss.windowControlSettings].join(' ')}
					onMouseDown={e => activateSettings(e)}
					onContextMenu={handleContextMenu}
					aria-label={'settingsButton'}
				/>
				{/*l'id ci-dessous est en rapport avec le contextmenu*/}
				<Menu id={'settingsButton'}>
					<Item onClick={() => {
						dispatch(resetSettings())
						dispatch(rerenderSettings())
					}}>
						Reset config
					</Item>
				</Menu>

				<button
					className={[headerCss.windowControl, headerCss.windowControlMinimize].join(' ')}
					onMouseDown={minimize} />
				<button
					className={[headerCss.windowControl, headerCss.windowControlClose].join(' ')}
					aria-label={'shutdownAppButton'}
					onMouseDown={close} />
			</div>
		</HeaderContainer>
	)
}

export default Header
