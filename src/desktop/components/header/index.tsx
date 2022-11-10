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
import app_logo from '@public/icons/trophee.png'

const AppLogo = styled.img`
  width: 31px;
  height: 26px;
`

function Header(props) {
    const my_window = props.my_window
    const headerRef = useRef(null)

    function minimize() {
        my_window.currWindow.minimize()
    }
    function maximize() {
        if (!my_window.maximized) {
            my_window.currWindow.maximize()
        } else {
            my_window.currWindow.restore()
        }
        my_window.maximized = !my_window.maximized
    }
    function close() {
        my_window.currWindow.close()
    }

    useEffect(() => {
        my_window.setDrag(headerRef.current)
    }, [])

	return (
            <header className='app-header' ref={headerRef}>
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
    my_window: PropTypes.instanceOf(AppWindow)
}

export default Header