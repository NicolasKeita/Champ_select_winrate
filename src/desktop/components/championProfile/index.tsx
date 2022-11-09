/*
    Path + Filename: src/desktop/components/championProfile/index.tsx
*/

import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import malhazar from '@public/img/MalzaharSquare.webp'

const ChampionImg = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
`

const ChampionProfileContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.isEnemyTeam ? 'row-reverse' : 'row'};
  padding: 0 12px 0 12px;
`

const ProfileTexts = styled.div`
  display: flex;
  flex-direction: column;
//  justify-items: space-around;
  justify-content: space-around;
`

function ChampionProfile(props) {
    return (
        <ChampionProfileContainer isEnemyTeam={props.isEnemyTeam}>
            <ChampionImg src={malhazar} alt={'malhazar_img'}/>
            <ProfileTexts>
                <h1>Champion Name</h1>
                <h2>63</h2>
            </ProfileTexts>
        </ChampionProfileContainer>
    )
}

ChampionProfile.propTypes = {
    isEnemyTeam: PropTypes.bool
}

export default ChampionProfile