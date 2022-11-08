/*
    Path + Filename: src/desktop/components/Main/index.tsx
*/

import styled from 'styled-components';

const PercentageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
`

const LineLeft = styled.div`
  height: 2px;
  width: 50px;
  background: linear-gradient(to left, black, transparent 100%);
  margin-right: 10px;
`

const LineRight = styled.div`
  height: 2px;
  width: 50px;
  background: linear-gradient(to right, black, transparent 100%);
  margin-left: 10px;
`

function Main() {
    let winrate = 50;
    return (
        <div className={"desktopTop"}>
            <PercentageContainer>
                <LineLeft></LineLeft>
                {winrate}%
                <LineRight></LineRight>
            </PercentageContainer>
        </div>
    )
}

export default Main