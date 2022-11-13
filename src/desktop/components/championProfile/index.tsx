/*
    Path + Filename: src/desktop/components/championProfile/index.tsx
*/

import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import malhazar from '@public/img/MalzaharSquare.webp'
import questionMark from '@public/img/question_mark.jpg'

const ChampionImg = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background: white;
`

const ChampionProfileContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.isEnemyTeam ? 'row-reverse' : 'row'};
  padding: 0 12px 0 12px;
`

const ProfileTexts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  color: #888063;
`

const ChampionPower = styled.h2`
    color: #beb7a6;
`

function ChampionProfile(props) {
    return (
        <ChampionProfileContainer isEnemyTeam={props.isEnemyTeam}>
            <ChampionImg src={questionMark} alt={'playerChampion'}/>
            <ProfileTexts>
                <h1>Champion Name</h1>
                <ChampionPower>63</ChampionPower>
            </ProfileTexts>
        </ChampionProfileContainer>
    )
}

ChampionProfile.propTypes = {
    isEnemyTeam: PropTypes.bool
}

export default ChampionProfile