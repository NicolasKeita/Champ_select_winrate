/*
    Path + Filename: src/desktop/components/championProfile/historyProfile.tsx
*/

import React, {useReducer, useState} from 'react'
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
  padding: 0 12px 0 12px;
  background: ${props => {
    if (props.isLoading) return 'none'
    if (!props.isEnemyTeam) {
      if (props.userWon)
        return `linear-gradient(135deg, transparent 0%, #785a28 2%, #B79E4DFF 10%, transparent 15%)`
      else
        return `linear-gradient(135deg, transparent 0%, #9e1818 2%, red 10%, transparent 15%)`
    } else {
      if (props.userWon) {
        return `linear-gradient(225deg, transparent 0%, #785a28 2%, #B79E4DFF 10%, transparent 15%)`
      } else {
        return `linear-gradient(225deg, transparent 0%, #9e1818 2%, red 10%, transparent 15%)`
      }
    }
  }};
`

interface PropsType {
	teamHistory: Champion[]
	isLoading: boolean,
	userWon: boolean,
	isEnemyTeam: boolean
}

function HistoryProfile(props: PropsType): JSX.Element {
	const [isLoading, setIsLoading] = useState(props.isLoading)

	if (isLoading) {
		setTimeout(() => {
			setIsLoading(false)
		}, 15000)
	}

	function renderChampionTeam(): JSX.Element[] | JSX.Element | null {
		//if (props.isEnemyTeam || isUnsupportedGameMode) return null
		const row: JSX.Element[] = []
		if (!isLoading) {
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
		<HistoryProfileContainer
			userWon={props.userWon}
			isLoading={isLoading}
			isEnemyTeam={props.isEnemyTeam}
		>
			{renderChampionTeam()}
		</HistoryProfileContainer>
	)
}

export default HistoryProfile