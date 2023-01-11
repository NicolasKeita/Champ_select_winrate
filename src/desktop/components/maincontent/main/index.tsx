/*
    Path + Filename: src/desktop/components/main/myContextMenu.tsx
*/

import React from 'react'
import styled from 'styled-components'
import uniqid from 'uniqid'

import ChampionProfile from '../../championProfile'
import {useAppSelector} from '@utils/hooks'
import questionMark from '@public/img/question_mark.jpg'
import computeWinrate from '@utils/maths/computeWinrateBetweenTwoTeams'
import Tooltip from 'rc-tooltip'

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

const MainContainer = styled.div`
  color: white;
  width: 100%;
  background: linear-gradient(to right, #252424, #363636, #252424);
  padding-bottom: 10px;
`

const PlayersGrid = styled.div`
  display: flex;
`

const TeamGrid = styled.div`
  display: flex;
  flex-direction: column;
`

const ProfileLine = styled.div`
  height: 2px;
  width: 100% - 10px;
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

function ChampSelect() {
	const champSelectDisplayed = useAppSelector((state) => state.slice.champSelectDisplayed)

	function renderPlayersGrid(isEnemyTeam: boolean): JSX.Element {
		const profiles: JSX.Element[] = []
		for (let i = 0; i < 5; ++i) {
			const img = isEnemyTeam ? champSelectDisplayed.enemies[i].champ.imageUrl : champSelectDisplayed.allies[i].champ.imageUrl
			const champName = isEnemyTeam ? champSelectDisplayed.enemies[i].champ.name : champSelectDisplayed.allies[i].champ.name
			const champScore = isEnemyTeam ? champSelectDisplayed.enemies[i].scoreDisplayed : champSelectDisplayed.allies[i].scoreDisplayed
			const champRecommendation = isEnemyTeam ? [] : champSelectDisplayed.allies[i].recommendations
			profiles.push(<ChampionProfile isEnemyTeam={isEnemyTeam}
										   key={uniqid()}
										   img={img ? img : questionMark}
										   champName={champName}
										   champDisplayedScore={champScore != undefined ? champScore : 50}
										   champRecommendation={champRecommendation}
										   champSelectDisplayed={champSelectDisplayed}
										   index={i}

			/>)
			if (i < 4) profiles.push(<ProfileLine isEnemyTeam={isEnemyTeam}
												  key={uniqid()} />)
		}
		return <div>{profiles}</div>
	}

	const allies = champSelectDisplayed.allies.map((ally) => ally.scoreDisplayed)
	const enemies = champSelectDisplayed.enemies.map((enemy) => enemy.scoreDisplayed)
	const winrate = computeWinrate(allies, enemies)
	const tooltipNumber = 'Numbers are coming from your own settings. Check your settings (top right icon) to change the default.'
	return (
		<MainContainer aria-label={'ChampSelect'}>
			<PercentageContainer>
				<WinrateLine isLeft />
				<Tooltip
					placement={'top'}
					overlayClassName={'winrateTooltip'}
					overlay={<span>{tooltipNumber}</span>}
				>
							<span
								style={{fontSize: '22px'}}
								className={'CSWColoredTextGradiant'}
							>
								{winrate}%
							</span>
				</Tooltip>
				<WinrateLine />
			</PercentageContainer>
			<PlayersGrid>
				<TeamGrid>{renderPlayersGrid(false)}</TeamGrid>
				<TeamGrid>{renderPlayersGrid(true)}</TeamGrid>
			</PlayersGrid>
		</MainContainer>
	)
}

export default ChampSelect
