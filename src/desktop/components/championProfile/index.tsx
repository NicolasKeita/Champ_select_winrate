/*
    Path + Filename: src/desktop/components/championProfile/myContextMenu.tsx
*/

import React from 'react'
import styled from 'styled-components'
import {Champion} from '../maincontent/settings/Champion'
import uniqid from 'uniqid'
import {getChampSquareAsset} from '@utils/fetchDataDragon/fetchDataDragon'
import {useAppSelector} from '@utils/hooks'

const ChampionImg = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background: white;
`

const ChampRecommendationImg = styled.img`
  border-radius: 50%;
  width: 15px;
  height: 15px;
  background: white;
`

const ChampionProfileContainer = styled.div`
  display: flex;
  flex-direction: ${props => (props.isEnemyTeam ? 'row-reverse' : 'row')};
  padding: 0 12px 0 12px;

  background: -webkit-linear-gradient(#ab6630, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const ProfileTexts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  color: #888063;
  padding: 0 5px 0 5px;
`

const ChampionPower = styled.h2`
  color: #beb7a6;
  padding: 0 10px 0 10px;
`

interface PropsType {
	isEnemyTeam: boolean,
	champName: string,
	img: string,
	champScore: number,
	champRecommendation: Champion[],
	isItUser: boolean
}

function ChampionProfile(props: PropsType) {
	const clientStatus = useAppSelector(state => state.slice.leagueClientStatus)

	function renderChampionRecommendation(): JSX.Element[] | null {
		if (clientStatus != 0 || props.isEnemyTeam) return null
		const row: JSX.Element[] = []
		for (let i = 0; i < 5; ++i) {
			const img = props.champRecommendation[i].imageUrl
			row.push(<ChampRecommendationImg key={uniqid()} src={img} />)
		}
		return row
	}

	return (
		<ChampionProfileContainer isEnemyTeam={props.isEnemyTeam}>
			<ChampionImg src={props.img} alt={'playerChampion'} />
			<ProfileTexts>
				<h1>{props.champName}</h1>
				<div style={{display: 'flex', flexDirection: 'row'}}>
					<ChampionPower>{props.champScore}</ChampionPower>
					{renderChampionRecommendation()}
				</div>
			</ProfileTexts>
		</ChampionProfileContainer>
	)
}

export default ChampionProfile
