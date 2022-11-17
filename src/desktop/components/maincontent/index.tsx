/*
    Path + Filename: src/desktop/components/maincontent/index.tsx
*/


import React from 'react'
import styled from 'styled-components'

const MainContentContainer = styled.div`
  display: flex;
  flex: 1;
`

type BoxProps = {
    children: React.ReactNode,
    id: string
};

function MainContent(props: BoxProps) {
    return (
        <MainContentContainer id={'MainContentContainer'}>
            {props.children}
        </MainContentContainer>
    )
}

export default MainContent