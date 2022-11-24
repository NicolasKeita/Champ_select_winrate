/*
    Path + Filename: src/desktop/components/maincontent/settings/myContextMenu.tsx
*/

import React from 'react'
import styled from 'styled-components'
import {useSettings} from '@utils/hooks'
import uniqid from 'uniqid'
import ConfigRow from './configRow'

const SettingsContainer = styled.div`
  background: linear-gradient(to right, #252424, #363636, #252424);
  flex: 1;
  padding: 12px 0 0 12px;
  overflow-y: scroll;
  height: 424px;
`
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 10px;
`
const ChampName = styled.h1`
  background: -webkit-linear-gradient(#ab6630, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  width: 110px;
`
const OP_ScoreContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-evenly;
  background: -webkit-linear-gradient(#a95a21, #8d782a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
const OP_Score = styled.div`
`

function Settings() {
    const {settings} = useSettings()

    function renderListChampNameWithOPScore() {
        const rows = []
        settings.champions.forEach(elem => {
            rows.push(<ConfigRow key={uniqid()} champName={elem.name} opScoreCSW={+elem.opScore_CSW} opScoreUser={+elem.opScore_user} setUserScore={elem.setUserScore}/>)
        })
        return (<div>{rows}</div>)
    }
    function renderTitleRow() {
        return (
            <RowContainer style={{ paddingBottom: '12px'}}>
                <ChampName>ChampName</ChampName>
                <OP_ScoreContainer>
                    <OP_Score>Your OP Score</OP_Score>
                    <OP_Score>CSW OP Score</OP_Score>
                </OP_ScoreContainer>
            </RowContainer>
        )
    }

    return (
        <SettingsContainer id={'SettingsContainer'}>
            {renderTitleRow()}
            {renderListChampNameWithOPScore()}
        </SettingsContainer>
    )
}

export default Settings