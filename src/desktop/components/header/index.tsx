/*
    Path + Filename: src/desktop/components/header/index.ts
*/

import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {AppWindow} from '../../../AppWindow'

import '@public/css/desktop.css'
import '@public/css/general.css'
import '@public/css/modal.css'
import '@public/css/header.css'
import app_logo from '@public/icons/logo_1.png'
//import app_logo from '@public/icons/trophee.png'


// const AppLogo = styled.img`
//   width: calc(75px / 2);
//   //width: 31px;
//   height: calc(98px / 2);
//   //height: 30px
// `

const Logo = styled.h1`
  font-size: 26px;
  font-family: Hero,serif;
  font-weight: 900;
  background: -webkit-linear-gradient(#904a0f, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  );
  cursor: inherit;
//  color: linear-gradient(0.25turn, #904a0f, #b79e4d);
`

const HeaderContainer = styled.header`
  background: linear-gradient(0.25turn, #323232, #363636, #323232);
  padding: 8px;
  display: flex;
  align-items: center;
  z-index: 9999;
`

const CSWName = styled.h1`
  background: -webkit-linear-gradient(#a8540c, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-left: 20px;
  cursor: inherit;
`

function Header(props) {
    const my_window = props.my_window
    const headerRef = useRef(null)

    function minimize() {
        my_window.currWindow.minimize()
    }
    function close() {
        my_window.currWindow.close()
    }

    useEffect(() => {
        my_window.setDrag(headerRef.current)
    }, [])

	return (
            <HeaderContainer className='app-header' ref={headerRef}>
                <Logo>CSW</Logo>
                <CSWName>Champ Select Winrate</CSWName>
                <div className="window-controls-group">
                    <button id='minimizeButton' className="window-control window-control-minimize" onClick={minimize}></button>
                    <button id="closeButton" className="window-control window-control-close" onClick={close}></button>
                </div>
            </HeaderContainer>
    )
}

Header.propTypes = {
    my_window: PropTypes.instanceOf(AppWindow)
}

export default Header