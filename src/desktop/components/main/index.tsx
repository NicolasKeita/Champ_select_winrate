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
  height: 15px;
  width: 100%;
//  background: linear-gradient(to left, red, transparent 100%);
  background: brown;
  margin-right: 10px;
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
                    <LineLeftProfile/>
                    <ChampionProfile isEnemyTeam/>
                    <LineLeftProfile/>
                    <ChampionProfile isEnemyTeam/>
                    <LineLeftProfile/>
                    <ChampionProfile isEnemyTeam/>
                    <LineLeftProfile/>
                    <ChampionProfile isEnemyTeam/>
                </EnemiesGrid>
            </PlayersGrid>
        </MainContainer>
    )
}

export default Main