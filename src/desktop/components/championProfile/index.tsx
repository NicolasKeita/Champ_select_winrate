/*
    Path + Filename: src/desktop/components/championProfile/myContextMenu.tsx
*/

import React from 'react'
import styled from 'styled-components'
import {Champion} from '../maincontent/settings/Champion'
import uniqid from 'uniqid'
import questionMark from '@public/img/question_mark.jpg'
import Tippy from '@tippyjs/react'
import {ChampSelectDisplayedType} from '../../../background/store/slice'
import computeWinrate from '@utils/maths/computeWinrateBetweenTwoTeams'

const ChampionImg = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background: white;
`

const ChampRecommendationImg = styled.img`
  border-radius: 50%;
  width: 25px;
  height: 25px;
  background: white;
  margin-right: 4px;
`

const ChampionProfileContainer = styled.div`
  display: flex;
  flex-direction: ${props => (props.isEnemyTeam ? 'row-reverse' : 'row')};

  height: 50px;
  padding: ${props => (props.isEnemyTeam) ? '0 12px 0 0' : '0 0 0 12px'};
  background: -webkit-linear-gradient(#ab6630, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const ProfileItems = styled.div`
  display: flex;
  flex-direction: column;
  color: #888063;
  text-align: ${props => props.isEnemyTeam ? 'right' : 'left'};
`

const ChampionPower = styled.h1`
  color: #beb7a6;
  padding: 0 8px 0 8px;
  flex: 1
`

const ChampPowerAndRecommendations = styled.div`
  display: flex;
  flex-direction: ${props => props.isEnemy ? 'row-reverse' : 'row'};
`

const ChampName = styled.h1`
  padding: 0 10px 5px 10px;
  font-size: ${props => props.isEnemyTeam ? '13px' : '14px'};
`

interface PropsType {
	isEnemyTeam: boolean,
	champName: string,
	img: string,
	champScore: number,
	champRecommendation: Champion[],
	champSelectDisplayed: ChampSelectDisplayedType,
	index: number
}

function ChampionProfile(props: PropsType): JSX.Element {

	function renderChampionRecommendation(): JSX.Element[] | null {
		const isUnsupportedGameMode = !!sessionStorage.getItem('unsupported game_mode')
		if (props.isEnemyTeam) return null
		//if (props.isEnemyTeam || isUnsupportedGameMode) return null
		const row: JSX.Element[] = []
		for (let i = 0; i < 5; ++i) {
			const allies = props.champSelectDisplayed.allies.map((ally) => {
				if (ally.champ.name == props.champName) {
					return props.champRecommendation[i]
				} else
					return ally.champ
			})
			const enemies = props.champSelectDisplayed.enemies.map((enemy) => {return enemy.champ})
			const winrate = computeWinrate(allies, enemies)
			const tooltipNumber = `If this player picks ${props.champRecommendation[i].name}, your winrate changes to ${winrate}`
			row.push(
				<Tippy key={uniqid()} content={<span>{tooltipNumber}</span>}>
					<ChampRecommendationImg
						src={props.champRecommendation[i] ? props.champRecommendation[i].imageUrl : questionMark}
					/>
				</Tippy>
			)
		}
		return row
	}

	return (
		<ChampionProfileContainer isEnemyTeam={props.isEnemyTeam}>
			<ChampionImg src={props.img} alt={'playerChampion'} />
			<ProfileItems isEnemyTeam={props.isEnemyTeam}>
				<ChampName
					isEnemyTeam={props.isEnemyTeam}
					aria-label={'Champion Name'}
				>
					{props.champName}
				</ChampName>
				<ChampPowerAndRecommendations
					aria-label={'Champion Power and Recommendations'}
					isEnemyTeam={props.isEnemyTeam}>
					<ChampionPower>{props.champScore}</ChampionPower>
					{renderChampionRecommendation()}
				</ChampPowerAndRecommendations>
			</ProfileItems>
		</ChampionProfileContainer>
	)
}

export default ChampionProfile
