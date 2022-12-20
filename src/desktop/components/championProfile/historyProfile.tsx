/*
    Path + Filename: src/desktop/components/championProfile/historyProfile.tsx
*/

import React from 'react'
import {Champion} from '../maincontent/settings/Champion'
import styled from 'styled-components'
import questionMark from '@public/img/question_mark.jpg'
import uniqid from 'uniqid'
import {Seek} from 'react-loading-indicators'

const TeamHistoryImg = styled.img`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  background: white;
  margin-top: 10px;
`

const HistoryProfileContainer = styled.div`
  height: 50px;
  display: flex;
  flex-direction: ${props => (props.isEnemyTeam ? 'row-reverse' : 'row')};
  padding: 0 12px 0 12px;

  background: -webkit-linear-gradient(#ab6630, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

interface PropsType {
	teamHistory: Champion[]
	isLoading: boolean
}

function HistoryProfile(props: PropsType): JSX.Element {

	function renderChampionRecommendation(): JSX.Element[] | JSX.Element | null {
		//if (props.isEnemyTeam || isUnsupportedGameMode) return null
		const row: JSX.Element[] = []
		if (!props.isLoading) {
			for (let i = 0; i < 5; ++i) {
				row.push(<TeamHistoryImg key={uniqid()}
										 src={props.teamHistory[i] ? props.teamHistory[i].imageUrl : questionMark} />)
			}
		} else {
			return < Seek color='#e5ba5e' />
		}
		return row
	}

	return (
		<HistoryProfileContainer>
			<div style={{display: 'flex', flexDirection: 'row'}}>
				{renderChampionRecommendation()}
			</div>
		</HistoryProfileContainer>
	)
}

export default HistoryProfile