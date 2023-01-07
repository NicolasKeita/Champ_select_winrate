/*
    Path + Filename: src/desktop/components/maincontent/settings/myContextMenu.tsx
*/

import React from 'react'
import styled from 'styled-components'
import uniqid from 'uniqid'
import {useAppSelector} from '@utils/hooks'
import ConfigRow from './configRow'
import {VariableSizeList as List} from 'react-window'
import {Virtuoso} from 'react-virtuoso'


const SettingsContainer = styled.div`
  background: linear-gradient(to right, #252424, #363636, #252424);
  padding: 12px 0 0 12px;
  overflow-y: scroll;
  height: 424px;
`
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 10px;
`
const ChampName = styled.h1`
  background: -webkit-linear-gradient(#ab6630, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  width: 110px;
`
const OP_ScoreContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-evenly;
  background: -webkit-linear-gradient(#a95a21, #8d782a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

function Settings() {
	const allChamps = useAppSelector(state => state.slice.config.champions, () => {return true})
	useAppSelector(state => state.slice.rerenderSettings)

	const Row = ({index, style}) => {
		const elem = allChamps[index]
		return (
			<div style={style}>
				<ConfigRow
					key={uniqid()}
					allChamps={allChamps}
					champName={elem.name}
					opScoreCSW={+elem.opScore_CSW}
					opScoreUser={elem.opScore_user != undefined ? +elem.opScore_user : 50}
				/>
			</div>
		)
	}

	const rowHeights = new Array(allChamps.length)
		.fill(true)
		.map(() => { return 24})
	const getItemSize = index => rowHeights[index]

	function renderListChampNameWithOPScore(allChamps) {
		return (

			// <Virtuoso
			// 	style={{height: '400px'}}
			// 	totalCount={allChamps.length}
			// 	itemContent={index => {
			// 		const elem = allChamps[index]
			// 		return (
			// 			<ConfigRow
			// 				key={uniqid()}
			// 				allChamps={allChamps}
			// 				champName={elem.name}
			// 				opScoreCSW={+elem.opScore_CSW}
			// 				opScoreUser={elem.opScore_user != undefined ? +elem.opScore_user : 50}
			// 			/>
			// 		)
			// 	}}
			// />)

			<>
				{
					allChamps.map(elem => {
						return (
							<ConfigRow
								key={uniqid()}
								allChamps={allChamps}
								champName={elem.name}
								opScoreCSW={+elem.opScore_CSW}
								opScoreUser={elem.opScore_user != undefined ? +elem.opScore_user : 50}
							/>
						)
					})
				}
			</>
		)
	}

	function renderTitleRow() {
		return (
			<RowContainer style={{paddingBottom: '12px'}}>
				<ChampName>ChampName</ChampName>
				<OP_ScoreContainer>
					<h1>Your OP Score</h1>
					<h1>CSW OP Score</h1>
				</OP_ScoreContainer>
			</RowContainer>
		)
	}

	return (
		<SettingsContainer aria-label={'settingsContainer'}>
			{renderTitleRow()}
			{renderListChampNameWithOPScore(allChamps)}
		</SettingsContainer>
	)
}

export default Settings
