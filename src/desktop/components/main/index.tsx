/*
    Path + Filename: src/desktop/components/main/index.tsx
*/

import React from 'react'
import styled from 'styled-components'

import ChampionProfile from '../championProfile'

const PercentageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  padding: 10px;
  color: #f0ead9;
`

const LineLeft = styled.div`
  height: 2px;
  width: 50px;
  background: linear-gradient(to left, red, transparent 100%);
  margin-right: 10px;
`

const LineRight = styled.div`
  height: 2px;
  width: 50px;
  background: linear-gradient(to right, red, transparent 100%);
  margin-left: 10px;
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

const TeammateGrid = styled.div`
  display: flex;
  flex-direction: column;
`

const EnemiesGrid = styled.div`
  display: flex;
  flex-direction: column;
`

const LineLeftProfile = styled.div`
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

function Main() {
    let winrate = 51

    function renderPlayersGrid(isEnemyTeam) {
        let profiles = []
        for (let i = 0; i < 5; ++i) {
            profiles.push(<ChampionProfile isEnemyTeam={isEnemyTeam}/>)
            if (i < 4)
                profiles.push(<LineLeftProfile isEnemyTeam={isEnemyTeam}/>)
        }
        return (
            <div>
                {profiles}
            </div>
        )
    }
    return (
        <MainContainer>
            <PercentageContainer>
                <LineLeft/>
                <h1>{winrate}%</h1>
                <LineRight/>
            </PercentageContainer>
            <PlayersGrid>
                <TeammateGrid>
                    {renderPlayersGrid(false)}
                </TeammateGrid>
                <EnemiesGrid>
                    {renderPlayersGrid(true)}
                </EnemiesGrid>
            </PlayersGrid>
        </MainContainer>
    )
}

export default Main