/*
    Path + Filename: src/desktop/MyApp.tsx
*/

import React, {useEffect, useReducer, useState} from 'react'
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

const LCU_interface = new LCU()
const playerProfile = new PlayerProfile()

function MyApp(props) {
    const my_window = props.my_window
    const [setClientStatusToOPEN, setClientStatusToCLOSE] = useChangeClientStatus()

    //TODO: Maybe change position of this code ?
    function useChangeClientStatus() {
        const [, setClientStatus] = useState(playerProfile.clientStatus)
        function setClientStatusToOPEN() {
            playerProfile.setClientStatusToOPEN()
            setClientStatus(playerProfile.clientStatus)
        }
        function setClientStatusToCLOSE() {
            playerProfile.setClientStatusToCLOSED()
            setClientStatus(playerProfile.clientStatus)
        }
        function setClientStatusToINSIDE_CHAMP_SELECT() {
            playerProfile.setClientStatusToINSIDE_CHAMP_SELECT()
            setClientStatus(playerProfile.clientStatus)
        }
        return (
            [
                setClientStatusToOPEN,
                setClientStatusToCLOSE,
                setClientStatusToINSIDE_CHAMP_SELECT
            ] as const
        )
    }

    useEffect(() => {
        LCU_interface.onClientAlreadyRunningOrNot((clientsInfos) => {
            // if client's already running
            if (LCU_interface.isLeagueClient(clientsInfos)) {
                LCU_interface.addAllListeners(clientsInfos, playerProfile.handleFeaturesCallbacks)
                setClientStatusToOPEN()
            } else {
                setClientStatusToCLOSE()
            }
        })
        LCU_interface.onClientLaunch((clientInfo) => {
            setClientStatusToOPEN()
            LCU_interface.addAllListeners(clientInfo, playerProfile.handleFeaturesCallbacks)
            //LCU_interface.populateCredentials()
            //todo add credentials and port to playerProfile
        })
        LCU_interface.onClientClosed(() => {
            setClientStatusToCLOSE()
            LCU_interface.removeAllListeners()
        })
    }, [setClientStatusToCLOSE, setClientStatusToOPEN])

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