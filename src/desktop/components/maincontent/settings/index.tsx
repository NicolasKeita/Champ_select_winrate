/*
    Path + Filename: src/desktop/components/maincontent/settings/index.tsx
*/

import React, {useState} from 'react'
import styled from 'styled-components'
import {useSettings} from '@utils/hooks'
import uniqid from 'uniqid'

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

const InputStyled = styled.input`
  width: 50px;
  margin-left: -30px;
  border-radius: 4px;
  background-color: rgba(63, 62, 62, 0.0);
  transition: 0.3s background-color ease-in-out, 0.3s box-shadow ease-in-out;
  text-align: center;
  &:hover {
    background-color: rgba(255, 255, 255, 0.24);
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
  }
`

let x = 0
function Settings() {
    console.log('settings rendered')
    const [value, setValue] = useState(0)
    const settings = useSettings()
    console.log(settings)

    function renderListChampNameWithOPScore() {
        console.log("func call")
        console.log(settings)

        function renderRow(champName, opScore) {
            function handleOnChange(event) {
                if (event.target.value.includes('.'))
                    return
                const valueEntered = event.target.value * 1
                if (Number.isInteger(valueEntered) && valueEntered <= 100) {
                    x = event.target.value
                    setValue(value + 1)
                }
            }
            return(
                <div style={{display: 'flex', flex: '1'}} key={'1'}>
                    <form style={{display: 'flex', flex: '1', justifyContent: 'space-evenly'}}>
                        <label style={{display: 'flex', flex: '1'}}>
                            <ChampName>{champName}</ChampName>
                            <OP_ScoreContainer>
                                <InputStyled
                                    type={'text'}
                                    value={x}
                                    //placeholder={'placeholder'}
                                    onChange={handleOnChange}
                                />
                                <OP_Score>{opScore}</OP_Score>
                            </OP_ScoreContainer>
                        </label>
                    </form>
                </div>
            )
        }
        const rows = []
        settings.settings.champions.forEach((elem) => {
            rows.push(<div style={{display: 'flex'}} key={uniqid()}>{renderRow(elem.name, elem.opScore_CSW)}</div>)
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