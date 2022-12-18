/*
    Path + Filename: src/desktop/components/maincontent/main/history.tsx
*/

import React from 'react'
import styled from 'styled-components'
import {Tooltip} from '@chakra-ui/react'
import ChampionProfile from '../../championProfile'
import questionMark from '@public/img/question_mark.jpg'
import HistoryProfile from '../../championProfile/historyProfile'
import uniqid from 'uniqid'
import {championConstructor} from '../settings/Champion'

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
  //align-items: ;
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

const LineDisplay = styled.div`
	//display: flex;
  //flex-direction: ;
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
	function renderHistoryGrid(isEnemyTeam: boolean): JSX.Element {

		const fiveQuestionMark = [
			championConstructor('', 50, 50, 'top', '', questionMark),
			championConstructor('', 50, 50, 'top', '', questionMark),
			championConstructor('', 50, 50, 'top', '', questionMark),
			championConstructor('', 50, 50, 'top', '', questionMark),
			championConstructor('', 50, 50, 'top', '', questionMark)
		]
		const profiles: JSX.Element[] = []
		for (let i = 0; i < 2; ++i) {
		// 	const img = isEnemyTeam ? champSelectDisplayed.enemies[i].champ.imageUrl : champSelectDisplayed.allies[i].champ.imageUrl
		// 	const champName = isEnemyTeam ? champSelectDisplayed.enemies[i].champ.name : champSelectDisplayed.allies[i].champ.name
		// 	const champScore = isEnemyTeam ? champSelectDisplayed.enemies[i].champ.opScore_user : champSelectDisplayed.allies[i].champ.opScore_user
			const fiveQuestionMark = [
				championConstructor('', 50, 50, 'top', '', questionMark),
				championConstructor('', 50, 50, 'top', '', questionMark),
				championConstructor('', 50, 50, 'top', '', questionMark),
				championConstructor('', 50, 50, 'top', '', questionMark),
				championConstructor('', 50, 50, 'top', '', questionMark)
			]
			const champRecommendation = fiveQuestionMark
		// 	profiles.push(<ChampionProfile isEnemyTeam={isEnemyTeam}
		// 								   key={uniqid()}
		// 								   img={img ? img : questionMark}
		// 								   champName={champName}
		// 								   champScore={champScore ? champScore : 50}
		// 								   champRecommendation={champRecommendation}
			profiles.push(<HistoryProfile isEnemyTeam={isEnemyTeam}
												   key={uniqid()}
												   champRecommendation={champRecommendation}
			/>)
		// 	/>)
		// 	if (i < 4) profiles.push(<ProfileLine isEnemyTeam={isEnemyTeam}
		// 										  key={uniqid()} />)
		// 	if (i < 4) profiles.push(<ProfileLine isEnemyTeam={isEnemyTeam}
		// 										  key={uniqid()} />)
		}
		const winrate = 50
		const tooltipNumber = 'Numbers are coming from your own settings. Check your settings (top right icon) to change the default.'
		return (
			<TeamGrid>
				<HistoryProfile isEnemyTeam={isEnemyTeam}
								key={uniqid()}
								champRecommendation={fiveQuestionMark} />
				<Tooltip label={tooltipNumber}>
					<h1>{winrate}%</h1>
				</Tooltip>
				<HistoryProfile isEnemyTeam={isEnemyTeam}
								key={uniqid()}
								champRecommendation={fiveQuestionMark} />
			</TeamGrid>
		)
	}
	return (
		<HistoryContainer>
			<PercentageContainer>
				<WinrateLine isLeft />
					<h1>Your ranked history</h1>
				<WinrateLine />
			</PercentageContainer>
			<HistoryGrid>
				{renderHistoryGrid(false)}
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
					<ProfileLine isEnemyTeam={false}/>
					<ProfileLine isEnemyTeam={true}/>
				</div>
				{renderHistoryGrid(false)}

				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
					<ProfileLine isEnemyTeam={false}/>
					<ProfileLine isEnemyTeam={true}/>
				</div>
				{renderHistoryGrid(false)}

				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
					<ProfileLine isEnemyTeam={false}/>
					<ProfileLine isEnemyTeam={true}/>
				</div>
				{renderHistoryGrid(false)}

				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
					<ProfileLine isEnemyTeam={false}/>
					<ProfileLine isEnemyTeam={true}/>
				</div>
				{renderHistoryGrid(false)}
			</HistoryGrid>
		</HistoryContainer>
	)
}


export default History