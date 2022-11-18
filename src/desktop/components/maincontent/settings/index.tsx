/*
    Path + Filename: src/desktop/components/maincontent/settings/index.tsx
*/

import React from 'react'
import styled from 'styled-components'

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

const InputStyled = styled.input`
  width: 50px;
  border-radius: 4px;
  background-color: rgba(63, 62, 62, 0.0);
  transition: 0.3s background-color ease-in-out, 0.3s box-shadow ease-in-out;
  text-align: center;
  &:hover {
    background-color: rgba(255, 255, 255, 0.24);
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
  }
`

function Settings() {
    function renderListChampNameWithOPScore() {
        const rows = []
        const row = []
        row.push(
            <div style={{ display: 'flex', flex: '1'}}>
                <form style={{display: 'flex', flex: '1',justifyContent: 'space-evenly'}}>
                    <label style={{display: 'flex', flex: '1'}}>
                        <ChampName>Cassio</ChampName>
                        <OP_ScoreContainer>
                            <InputStyled
                                type={'text'}
                                value={'64'}
                                placeholder={'placeholder'}
                            />
                            <OP_Score>64</OP_Score>
                        </OP_ScoreContainer>
                    </label>
                </form>
            </div>
        )
        for (let i = 0; i < 50; ++i) {
            rows.push(<div style={{ display: 'flex'}} key={i}>{row}</div>)
        }
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