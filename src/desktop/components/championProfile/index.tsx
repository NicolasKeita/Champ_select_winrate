/*
    Path + Filename: src/desktop/components/championProfile/index.tsx
*/

import React from 'react'
import styled from 'styled-components'

import malhazar from '@public/img/MalzaharSquare.webp'

const ChampionImg = styled.img`
    border-radius: 50%;
`

const ChampionProfileContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`


function ChampionProfile() {
    return (
        <ChampionProfileContainer>
            <ChampionImg src={malhazar} alt={'malhazar_img'}/>
            Champion Name
        </ChampionProfileContainer>
    )
}

export default ChampionProfile