/*
    Path + Filename: src/desktop/components/header/index.ts
*/

import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import '@public/css/desktop.css'
import '@public/css/general.css'
import '@public/css/modal.css'
import '@public/css/header.css'
import app_logo from '@public/icons/trophee.png'

const AppLogo = styled.img`
  width: 31px;
  height: 26px;
`

function Header(props) {
    let my_window = props.my_window

    //TODO : directly add the function to the onClick, remove these functions
    function minimize() {
        my_window.currWindow.minimize()
    }
    function maximize() {
        my_window.currWindow.maximize()
    }
    function close() {
        my_window.currWindow.maximize()
    }
    // TODO: Fully convert to JSX (this is sort of HTML rightnow)
	return (
            <header id="header" className='app-header'>
                <AppLogo src={app_logo} alt="headerIcon"/>
                <h1>Champ Select Winrate</h1>
                <div className="window-controls-group">
                    <button id='minimizeButton' className="window-control window-control-minimize" onClick={minimize}></button>
                    <button id="maximizeButton" className="window-control window-control-maximize" onClick={maximize}></button>
                    <button id="closeButton" className="window-control window-control-close" onClick={close}></button>
                </div>
            </header>
    )
}

Header.propTypes = {
    //TODO: change any to the actual object
    my_window: PropTypes.any
}

export default Header