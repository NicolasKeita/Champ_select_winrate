/*
    Path + Filename: src/desktop/components/main/myContextMenu.tsx
*/

import React from 'react'
import styled from 'styled-components'
import uniqid from 'uniqid'

import ChampionProfile from '../../championProfile'
import {useAppSelector} from '@utils/hooks'
import {Champion} from '../settings/Champion'
import {ChampDisplayedType} from '@utils/store/store'

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
  text-align: center;
  background: linear-gradient(to right, #252424, #363636, #252424);
  padding-bottom: 10px;
`

const PlayersGrid = styled.div`
  display: flex;
  justify-content: space-between;
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

function Main() {
	const champSelectDisplayed = useAppSelector((state) => state.slice.champSelectDisplayed)

	function renderPlayersGrid(isEnemyTeam: boolean): JSX.Element {
		const profiles: JSX.Element[] = []
		for (let i = 0; i < 5; ++i) {
			const img = isEnemyTeam ? champSelectDisplayed.enemies[i].champ.imageUrl : champSelectDisplayed.allies[i].champ.imageUrl
			const champName = isEnemyTeam ? champSelectDisplayed.enemies[i].champ.name : champSelectDisplayed.allies[i].champ.name
			const champScore = isEnemyTeam ? champSelectDisplayed.enemies[i].champ.opScore_user : champSelectDisplayed.allies[i].champ.opScore_user
			const champRecommendation = isEnemyTeam ? [] : champSelectDisplayed.allies[i].recommendations
			profiles.push(<ChampionProfile isEnemyTeam={isEnemyTeam}
										   key={uniqid()} img={img}
										   champName={champName}
										   champScore={champScore}
										   champRecommendation={champRecommendation}
			/>)
			if (i < 4) profiles.push(<ProfileLine isEnemyTeam={isEnemyTeam}
												  key={uniqid()} />)
		}
		return <div>{profiles}</div>
	}

	function computeWinrate(allies: ChampDisplayedType[], enemies: ChampDisplayedType[]): number {
		let sumAllies = 0
		let sumEnemies = 0
		for (const elem of allies) sumAllies += elem.champ.opScore_user
		for (const elem of enemies) sumEnemies += elem.champ.opScore_user
		let winRate = (sumAllies / 5 - sumEnemies / 5) / 2 + 50
		let isInferiorTo50 = false
		if (winRate < 50) {
			isInferiorTo50 = true
			winRate = 50 - winRate + 50
		}
		winRate = 100.487 - 4965.35 * Math.exp(-0.0917014 * winRate)
		if (isInferiorTo50) {
			winRate = 100 - winRate
			return Math.floor(winRate)
		} else {
			return Math.ceil(winRate)
		}
	}

	const winrate = computeWinrate(champSelectDisplayed.allies, champSelectDisplayed.enemies)
	return (
		<MainContainer>
			<PercentageContainer>
				<WinrateLine isLeft />
				<h1>{winrate}%</h1>
				<WinrateLine />
			</PercentageContainer>
			<PlayersGrid>
				<TeamGrid>{renderPlayersGrid(false)}</TeamGrid>
				<TeamGrid>{renderPlayersGrid(true)}</TeamGrid>
			</PlayersGrid>
		</MainContainer>
	)
}

export default Main
