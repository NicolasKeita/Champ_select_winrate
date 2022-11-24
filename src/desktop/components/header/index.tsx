/*
    Path + Filename: src/desktop/components/header/index.ts
*/

import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {AppWindow} from '../../../AppWindow'

import '@public/css/desktop.css'
import '@public/css/general.css'
import '@public/css/modal.css'
import '@public/css/header.css'

import { ContextMenuTriggerArea } from 'react-context-menu-hooks'
import '@public/css/ContextMenu.css'
import MyContextMenu from './myContextMenu/myContextMenu'
import { myContextMenuBridge } from './myContextMenu/myContextMenuBridge'


import {useSettings} from '@utils/hooks'

const HeaderContainer = styled.header`
  background: linear-gradient(to right, rgb(63, 62, 62), #363636, #323232);
  padding: 8px;
  display: flex;
  align-items: center;
  z-index: 9999;
`
const Logo = styled.h1`
  font-size: 26px;
  font-family: Hero,serif;
  font-weight: 900;
  background: -webkit-linear-gradient(#904a0f, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  );
  cursor: inherit;
`
const CSWName = styled.h1`
  background: -webkit-linear-gradient(#a8540c, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-left: 20px;
  cursor: inherit;


`
// const ContextMenuTriggerAreaStyled = styled(ContextMenuTriggerArea)`
//   background: linear-gradient(to right, rgb(63, 62, 62), #363636, #323232);
//   border: 1px solid #A8540CFF;
//   color: #A8540CFF;
//   padding: 3px;
// `

const Shape = () => {
    const [color, setColor] = useState<string>('blue');
    const [shape, setShape] = useState<string>('circle');

    return (
        <ContextMenuTriggerArea
            bridge={myContextMenuBridge}
            className={`shape ${color} ${shape}`}
            data={{
                color,
                changeColor: (newColor) => {
                    setColor(newColor);
                },
                shape,
                changeShape: (newColor) => {
                    setShape(newColor);
                },
            }}
        >
            <p>Right click and change how I look!</p>
        </ContextMenuTriggerArea>
    );
};

const ButtonSettings = () => {
    const [color, setColor] = useState<string>('blue');
    const [shape, setShape] = useState<string>('circle');
    const { toggleSettings_rerenderApp } = useSettings()

    function activateSettings(e) {
        if (e.buttons == 1)
            toggleSettings_rerenderApp()
    }

    return (
        <ContextMenuTriggerArea
            style={{ cursor: 'default'}}
            bridge={myContextMenuBridge}
            className={'window-control window-control-settings'}
            onMouseDown={(e) => activateSettings(e) }
            data={{
                color,
                changeColor: (newColor) => {
                    setColor(newColor);
                },
                shape,
                changeShape: (newColor) => {
                    setShape(newColor);
                },
            }}
        >
        </ContextMenuTriggerArea>
    )
}


let isMenuOpen = false
function Header(props) {
    const my_window = props.my_window
    const headerRef = useRef(null)

    function minimize(e) {if (e.buttons == 1) my_window.currWindow.minimize() }
    function close(e) { if (e.buttons == 1) my_window.currWindow.close() }

    useEffect(() => {
        my_window.setDrag(headerRef.current)
    }, [my_window])

	return (
            <HeaderContainer className={'app-header'} ref={headerRef}>
                <Logo>CSW</Logo>
                <CSWName>Champ Select Winrate</CSWName>
                <div className='window-controls-group'>
                    <MyContextMenu />
                    <ButtonSettings/>
                    <button className={'window-control window-control-minimize'} onMouseDown={minimize}/>
                    <button className={'window-control window-control-close'} onMouseDown={close}/>
                </div>
            </HeaderContainer>
    )
}

Header.propTypes = {
    my_window: PropTypes.instanceOf(AppWindow)
}

export default Header