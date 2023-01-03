/*
    Path + Filename: src/settings/header.tsx
*/

import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'

import '@public/css/desktop.css'
import '@public/css/general.css'
import '@public/css/modal.css'
import '@public/css/header.css'

import {AppWindow} from '../AppWindow'
import {kWindowNames} from '../consts'

const HeaderContainer = styled.header`
  background: linear-gradient(to right, rgb(63, 62, 62), #363636, #323232);
  padding: 8px;
  display: flex;
  align-items: center;
  z-index: 9999;
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

	function minimize(e) {
		if (e.buttons == 1) {
			overwolf.windows.minimize(kWindowNames.settings)
		}
	}

	function close(e) {
		if (e.buttons == 1) {
			// overwolf.windows.getMainWindow()
			overwolf.windows.close(kWindowNames.settings)
		}
	}

	useEffect(() => {
		overwolf.windows.getMainWindow().backgroundControllerInstance().setDragToWindow(kWindowNames.settings, headerRef.current)
	}, [])

	return (
		<HeaderContainer className={'app-header'} ref={headerRef}>
			<Logo>CSW</Logo>
			<CSWName>Champ Select Winrate Settings</CSWName>
			<div className='window-controls-group'>
				<button className={'window-control window-control-minimize'}
						aria-label={'minimizeAppButton'}
						onMouseDown={minimize} />
				<button className={'window-control window-control-close'}
						aria-label={'shutdownAppButton'}
						onMouseDown={close} />
			</div>
		</HeaderContainer>
	)
}

export default Header
