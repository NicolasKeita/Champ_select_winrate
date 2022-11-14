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
import LCU, {isClientRunning, registerEvents, setFeatures, unregisterEvents} from '@utils/LCU'

const MyAppContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const playerProfile = new PlayerProfile()
const LCU_interface = new LCU()

function MyApp(props) {
    const my_window = props.my_window
    const forceUpdate = useReducer((x) => x + 1, 0)[1]

    useEffect(() => {
        LCU_interface.onClientAbsence(clientsInfos => {
            if (!LCU_interface.isLeagueClient(clientsInfos)) {
                playerProfile.setClientStatus(playerProfile.clientStatusEnum.CLOSED)
                forceUpdate()
            }
        })
        LCU_interface.onClientAlreadyRunning((clientsInfos) => {
            if (LCU_interface.isLeagueClient(clientsInfos)) {
                LCU_interface.addAllListeners(clientsInfos)
                playerProfile.setClientStatus(playerProfile.clientStatusEnum.OPEN)
                forceUpdate()
            }
        })
        LCU_interface.onClientLaunch((clientInfo) => {
            playerProfile.clientStatus = playerProfile.clientStatusEnum.OPEN
            LCU_interface.addAllListeners(clientInfo)
            forceUpdate()
            //LCU_interface.populateCredentials()
            //todo add credentials and port to playerProfile
        })
        LCU_interface.onClientClosed(() => {
            playerProfile.clientStatus = playerProfile.clientStatusEnum.CLOSED
            LCU_interface.removeAllListeners()
            forceUpdate()
        })
    }, [forceUpdate])
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