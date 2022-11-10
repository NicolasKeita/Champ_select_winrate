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
    height: 400px;
    text-align: center;
    background: #121a21;
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
   width: 100%;
   background: ${props => props.isEnemyTeam ?
       'linear-gradient(to left, #785a28, transparent 100%)' :
       'linear-gradient(to right, #785a28, transparent 100%)'};
   transform: scale(var(--ggs,1));
   margin: 10px;

   &:before {
      content: ${props => props.isEnemyTeam ? 'none' : `''`};
      display: block;
      box-sizing: border-box;
      position: absolute;

      width: 6px;
      height: 6px;
      border: 2px solid;
      left: -4px;
      bottom: -2px;
      transform: rotate(45deg);
      background: transparent;
      color: #785a28;
   };
`

function Main() {
    let winrate = 51

    return (
        <MainContainer>
            <PercentageContainer>
                <LineLeft/>
                {winrate}%
                <LineRight/>
            </PercentageContainer>
            <PlayersGrid>
                <TeammateGrid>
                    <ChampionProfile/>
                    <LineLeftProfile/>
                    <ChampionProfile/>
                    <LineLeftProfile/>
                    <ChampionProfile/>
                    <LineLeftProfile/>
                    <ChampionProfile/>
                    <LineLeftProfile/>
                    <ChampionProfile/>
                </TeammateGrid>
                <EnemiesGrid>
                    <ChampionProfile isEnemyTeam/>
                    <LineLeftProfile isEnemyTeam/>
                    <ChampionProfile isEnemyTeam/>
                    <LineLeftProfile isEnemyTeam/>
                    <ChampionProfile isEnemyTeam/>
                    <LineLeftProfile isEnemyTeam/>
                    <ChampionProfile isEnemyTeam/>
                    <LineLeftProfile isEnemyTeam/>
                    <ChampionProfile isEnemyTeam/>
                </EnemiesGrid>
            </PlayersGrid>
        </MainContainer>
    )
}

export default Main