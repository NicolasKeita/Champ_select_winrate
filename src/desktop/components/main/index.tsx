/*
    Path + Filename: src/desktop/components/main/index.tsx
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
  background: linear-gradient(to left, red, transparent 100%);
  margin-right: 10px;
`

const LineRight = styled.div`
  height: 2px;
  width: 50px;
  background: linear-gradient(to right, red, transparent 100%);
  margin-left: 10px;
`

function Main() {
    let winrate = 50;

    return (
        <div className={"desktopTop"}>
            <PercentageContainer>
                <LineLeft/>
                {winrate}%
                <LineRight/>
            </PercentageContainer>

        </div>
    )
}

export default Main