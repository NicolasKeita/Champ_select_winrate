/*
    Path + Filename: src/desktop/MyApp.tsx
*/

import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Header from './components/header'
import MainContent from './components/maincontent'
import Main from './components/maincontent/main'
import Footer from './components/maincontent/footer'
import Settings from './components/maincontent/settings'
import FooterAD from './components/footerAD'
import Config from './components/maincontent/settings/Config'
import {AppWindow} from '../AppWindow'
import PlayerProfile from '@utils/playerProfile'
import LCU from '@utils/LCU'
import {useSettings} from '@utils/hooks'

const MyAppContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`
const LCU_interface = new LCU()
const playerProfile = new PlayerProfile()

let x = 0
let g_rendered = false

function MyApp(props) {
    const my_window = props.my_window
    const [setClientStatusToOPEN, setClientStatusToCLOSE, setClientStatusToINSIDE_CHAMP_SELECT] = useChangeClientStatus()
    const [setChampionHover] = useChangeImgProfile()
    const {settings} = useSettings()


    if (!g_rendered) {
        g_rendered = true
        //let config = localStorage.getItem('config')
        const config: Config = JSON.parse(localStorage.getItem('config'))
        if (config) {
            settings.copyFromAnotherSetting(config)
        } else {
            settings.populateDefaultConfig().then(r => {}) // TODO handle errors. then. catch
        }
    }


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

        return ([
                setClientStatusToOPEN,
                setClientStatusToCLOSE,
                setClientStatusToINSIDE_CHAMP_SELECT] as const
        )
    }

    function useChangeImgProfile() {
        const [, setImgProfile] = useState(-1)

        async function setChampionHover(actions, localCellId) {
            await playerProfile.fillChampSelect(actions, localCellId, settings.champions)
            x += 1
            setImgProfile(x)
        }

        return [setChampionHover]
    }

    function handleGameFlow(game_flow) {
        if (game_flow && game_flow.phase) {
            if (game_flow.phase === 'ChampSelect') {
                playerProfile.resetChampSelect()
                setClientStatusToINSIDE_CHAMP_SELECT()
                // TODO check si le mec est deja en champ select quand l'app est lancé feature : 'champ select"' received
            } else {
                setClientStatusToOPEN()
            }
        }
    }

    function handleChampSelect(champ_select) {
        const raw = JSON.parse(champ_select.raw)
        setChampionHover(raw.actions, parseInt(raw.localPlayerCellId))
    }

    function handleFeaturesCallbacks(info) {
        if (info.feature === 'game_flow')
            handleGameFlow(info.info.game_flow)
        if (info.feature === 'champ_select')
            handleChampSelect(info.info.champ_select)
    }

    useEffect(() => {
        LCU_interface.onClientAlreadyRunningOrNot((clientsInfos) => {
            // if client's already running
            if (LCU_interface.isLeagueClient(clientsInfos)) {
                setClientStatusToOPEN()
                LCU_interface.addAllListeners(clientsInfos, handleFeaturesCallbacks)
            } else {
                setClientStatusToCLOSE()
            }
        })
        LCU_interface.onClientLaunch((clientInfo) => {
            LCU_interface.addAllListeners(clientInfo, handleFeaturesCallbacks)
            setClientStatusToOPEN()
            //LCU_interface.populateCredentials()
            //todo save credentials and port to playerProfile
        })
        LCU_interface.onClientClosed(() => {
            setClientStatusToCLOSE()
            LCU_interface.removeAllListeners()
        })
    }, []) // TODO exhausive-deps-problem Figure out Why adding SetClientStatusToOPEN there will trigger useEffect every render (I just want to let this empty array)

    function renderContent() {
        if (settings == undefined || !settings.settingsPage) {
            return (
                <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                    <Main playerProfile={playerProfile}/>
                    <Footer playerProfile={playerProfile}/>
                </div>
            )
        } else
            return (<Settings/>)
    }

    return (
        <MyAppContainer id={'myApp'}>
            <Header my_window={my_window}/>
            <MainContent id="MainContent">
                {renderContent()}
            </MainContent>
        </MyAppContainer>
    )
}

MyApp.propTypes = {
    my_window: PropTypes.instanceOf(AppWindow)
}

export default MyApp