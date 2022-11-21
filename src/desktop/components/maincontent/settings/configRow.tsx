/*
    Path + Filename: src/desktop/components/maincontent/settings/configRow.tsx
*/

import React, {useState} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

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
const OP_Score = styled.div`
`

function ConfigRow(props) {
    const [opScoreUser, setOpScoreUser] = useState(props.opScoreCSW)

    function handleOnChange(event) {
        if (event.target.value.includes('.'))
            return
        const valueEntered = event.target.value * 1
        if (Number.isInteger(valueEntered) && valueEntered <= 100) {
            setOpScoreUser(event.target.value)
        }
    }
    return(
        <div style={{display: 'flex', flex: '1'}} key={'1'}>
            <form style={{display: 'flex', flex: '1', justifyContent: 'space-evenly'}}>
                <label style={{display: 'flex', flex: '1'}}>
                    <ChampName>{props.champName}</ChampName>
                    <OP_ScoreContainer>
                        <InputStyled
                            type={'text'}
                            value={opScoreUser}
                            //placeholder={'placeholder'}
                            onChange={handleOnChange}
                        />
                        <OP_Score>{props.opScoreCSW}</OP_Score>
                    </OP_ScoreContainer>
                </label>
            </form>
        </div>
    )
}


ConfigRow.propTypes = {
    champName : PropTypes.string,
    opScoreCSW : PropTypes.number
}

export default ConfigRow
