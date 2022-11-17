/*
    Path + Filename: src/desktop/components/main/index.tsx
*/

import React, {useEffect} from 'react'
import styled from 'styled-components'
import uniqid from 'uniqid'

import LCU from '@utils/LCU'
import ChampionProfile from '../championProfile'
import PropTypes from 'prop-types'
import PlayerProfile from '@utils/playerProfile'
import playerProfile from '@utils/playerProfile'

const PercentageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  padding: 10px;
  color: #f0ead9;
`

const WinrateLine = styled.div`
  height: 2px;
  width: 50px;
  background: ${props => props.isLeft ?
          'linear-gradient(to left, red, transparent 100%);' :
          'linear-gradient(to right, red, transparent 100%);'
  }
  ${props => props.isLeft ? 'margin-right: 10px;' : 'margin-left: 10px;'}
`

const MainContainer = styled.div`
  color: white;
  width: 100%;
  text-align: center;
  background: #121a21;
  padding-bottom: 10px;
`

const PlayersGrid = styled.div`
  display: flex;
  justify-content: space-between;
`

const TeamGrid = styled.div`
  display: flex;
  flex-direction: column;
`

const ProfileLine = styled.div`
  height: 2px;
  width: 100% - 10px;
  background: ${props => props.isEnemyTeam ?
          'linear-gradient(to left, #785a28, transparent 100%)' :
          'linear-gradient(to right, #785a28, transparent 100%)'};
  transform: scale(var(--ggs,1));
  margin: 10px
  ${props => props.isEnemyTeam ? '10px' : '0px'}
  10px
  ${props => props.isEnemyTeam ? '0px' : '10px'};

  &:after,
  &:before {
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 6px;
    height: 6px;
    border: 2px solid;
    bottom: -2px;
    transform: rotate(45deg);
    background: transparent;
    color: #785a28;
  }

  //Right side
  &:before {
    content: ${props => props.isEnemyTeam ? `''` : 'none'};
    right: -4px;
  };

  //Left side
  &:after {
    content: ${props => props.isEnemyTeam ? 'none' : `''`};
    left: -4px;
  };
`

function Main(props) {
    let winrate = 51

    function renderPlayersGrid(isEnemyTeam) {
        let profiles = []
        for (let i = 0; i < 5; ++i) {
            const img = isEnemyTeam ? props.playerProfile.enemies[i].img : props.playerProfile.allies[i].img
            const champName = isEnemyTeam ? props.playerProfile.enemies[i].name : props.playerProfile.allies[i].name
            profiles.push(<ChampionProfile isEnemyTeam={isEnemyTeam} key={uniqid()} img={img} champName={champName}/>)
            if (i < 4)
                profiles.push(<ProfileLine isEnemyTeam={isEnemyTeam} key={uniqid()}/>)
        }
        return (
            <div>
                {profiles}
            </div>
        )
    }
    //TODO: le background de main doit être linear gradient avec une nouvelle couleure
    return (
        <MainContainer>
            <PercentageContainer>
                <WinrateLine isLeft/>
                <h1>{winrate}%</h1>
                <WinrateLine/>
            </PercentageContainer>
            <PlayersGrid>
                <TeamGrid>
                    {renderPlayersGrid(false)}
                </TeamGrid>
                <TeamGrid>
                    {renderPlayersGrid(true)}
                </TeamGrid>
            </PlayersGrid>
        </MainContainer>
    )
}

Main.propTypes = {
    playerProfile: PropTypes.instanceOf(PlayerProfile),
}

export default Main