/*
    Path + Filename: src/desktop/components/main/index.tsx
*/

import React from 'react'
import styled from 'styled-components'

import malhazar from '@public/img/MalzaharSquare.webp'

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

const ChampionImg = styled.img`
    border-radius: 50%;
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
            <ChampionImg src={malhazar} alt={'malhazar_img'}/>
            <ChampionImg src={malhazar} alt={'malhazar_img'}/>
            <ChampionImg src={malhazar} alt={'malhazar_img'}/>
        </MainContainer>
    )
}

export default Main