/*
    Path + Filename: src/desktop/MyApp.tsx
*/

import React, { useState, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Header from './components/header'
import Main from './components/main'
import Footer from './components/footer'
import FooterAD from './components/footerAD'
import {AppWindow} from '../AppWindow'
import PlayerProfile from '@utils/playerProfile'
import LCU from '@utils/LCU'

const MyAppContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const playerProfile = new PlayerProfile()
const LCU_interface = new LCU()

function MyApp(props) {
    const my_window = props.my_window
    const forceUpdate = useState()[1]

    LCU_interface.listenerOnClientLaunch(() => {
        playerProfile.setClientStatus(playerProfile.clientStatusEnum.OPEN)
        forceUpdate(null)
    })
    return (
        <MyAppContainer>
            <Header my_window={my_window}/>
            <Main/>
            <Footer playerProfile={playerProfile}/>
            <FooterAD/>
        </MyAppContainer>
    )
}

MyApp.propTypes = {
    my_window: PropTypes.instanceOf(AppWindow)
}

export default MyApp