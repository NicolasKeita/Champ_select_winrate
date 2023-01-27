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
import styles from './ReactContexify.css'
import './modif_globals.css'
import css from './modif2.module.css'

const HeaderContainer = styled.header`
  //background: linear-gradient(to right, rgb(63, 62, 62), #363636, #323232);
  background: #00defa;
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

	console.log(css)
	console.log('1')
	console.log(css.my_class4)
	console.log('1.4')
	console.log(css[0])
	console.log('2')
	console.log(css[1])
	console.log('3')
	console.log(css.toString())

	return (
		<HeaderContainer
			className={css.my_class4}
			// className={'my_class1'}
			//className={'app-header ' + css.my_class1}
			//className={'app-header ' + css.my_class1}
			ref={headerRef}
		>
			<h1>hellou</h1>
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
