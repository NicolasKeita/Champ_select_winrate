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
    background-color: #464650;
`

const PlayersGrid = styled.div`
  display: flex;
  //todo: order of images wrong?
  background: #00defa;
  justify-content: space-between;
`

const TeammateGrid = styled.div`
  display: flex;
  flex-direction: column;
  background: green;
`

const EnnemiesGrid = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: flex-end;
  background: red;
`

function Main() {
    let winrate = 50

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
                    <ChampionProfile/>
                    <ChampionProfile/>
                    <ChampionProfile/>
                    <ChampionProfile/>
                </TeammateGrid>
                <EnnemiesGrid>
                    <ChampionProfile/>
                    <ChampionProfile/>
                    <ChampionProfile/>
                    <ChampionProfile/>
                    <ChampionProfile/>
                </EnnemiesGrid>
            </PlayersGrid>
        </MainContainer>
    )
}

export default Main