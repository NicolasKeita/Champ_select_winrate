/*
    Path + Filename: src/desktop/components/maincontent/main/history.tsx
*/

import React from 'react'
import styled from 'styled-components'
import HistoryProfile from '../../championProfile/historyProfile'
import uniqid from 'uniqid'
import {useAppSelector} from '@utils/hooks'
import {HistoryDisplayedType} from '../../../../background/store/slice'
import Tippy from '@tippyjs/react'
import './tippy.css'
import computeWinrate from '@utils/maths/computeWinrateBetweenTwoTeams'

const HistoryContainer = styled.div`
  color: white;
  width: 100%;
  height: 410px;
  flex: 1;
  text-align: center;
  background: linear-gradient(to right, #252424, #363636, #252424);
  padding-bottom: 10px;
`

const PercentageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  padding: 10px;
  background: -webkit-linear-gradient(#a8540c, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const WinrateLine = styled.div`
  height: 2px;
  width: 50px;
  background: ${props => (props.isLeft ? 'linear-gradient(to left, red, transparent 100%);' : 'linear-gradient(to right, red, transparent 100%);')} ${props => (props.isLeft ? 'margin-right: 10px;' : 'margin-left: 10px;')};
`

const HistoryGrid = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`

const TeamGrid = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 22px;
  background: -webkit-linear-gradient(#a8540c, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const ProfileLine = styled.div`
  height: 2px;
  width: 45vw;
  background: ${props => (props.isEnemyTeam ? 'linear-gradient(to left, #785a28, transparent 100%)' : 'linear-gradient(to right, #785a28, transparent 100%)')};
  transform: scale(var(--ggs, 1));
  margin: 10px ${props => (props.isEnemyTeam ? '10px' : '0px')} 10px ${props => (props.isEnemyTeam ? '0px' : '10px')};

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
    content: ${props => (props.isEnemyTeam ? `''` : 'none')};
    right: -4px;
  }

  //Left side
  &:after {
    content: ${props => (props.isEnemyTeam ? 'none' : `''`)};
    left: -4px;
  }
`

function History() {
	const historyDisplayed = useAppSelector(state => state.slice.historyDisplayed)

	function renderHistoryGrid(historyDisplayed: HistoryDisplayedType[]): JSX.Element[] {
		const linesHistory: JSX.Element[] = []
		const tooltipNumber = 'Numbers are coming from your own settings. Check your settings (top right icon) to change the default.'
		for (let i = 0; i < 5; ++i) {
			const winrate = computeWinrate(historyDisplayed[i].allies, historyDisplayed[i].enemies)
			linesHistory.push(
				<React.Fragment key={uniqid()}>
					<TeamGrid>
						<HistoryProfile
							teamHistory={historyDisplayed[i].allies}
							isLoading={historyDisplayed[i].isLoading}
							userWon={historyDisplayed[i].userWon}
							isEnemyTeam={false}
						/>
						<Tippy content={<span>{tooltipNumber}</span>}>
							<h1>
								{winrate}%
							</h1>
						</Tippy>
						<HistoryProfile
							teamHistory={historyDisplayed[i].enemies}
							isLoading={historyDisplayed[i].isLoading}
							userWon={!historyDisplayed[i].userWon}
							isEnemyTeam={true}
						/>
					</TeamGrid>
					{i < 4 &&
						<div style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between'
						}}>
							<ProfileLine isEnemyTeam={false} />
							<ProfileLine isEnemyTeam={true} />
						</div>
					}
				</React.Fragment>
			)
		}
		return linesHistory
	}

	return (
		<HistoryContainer>
			<PercentageContainer>
				<WinrateLine isLeft />
				<h1>Your ranked history</h1>
				<WinrateLine />
			</PercentageContainer>
			<HistoryGrid>
				{renderHistoryGrid(historyDisplayed)}
			</HistoryGrid>
		</HistoryContainer>
	)
}


export default History