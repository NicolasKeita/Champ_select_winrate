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
import {Champion} from '@desktop/components/maincontent/settings/Champion'
import cssCSW from '@public/css/CSWStyles.module.css' assert {type: 'css'}


const SettingsContainer = styled.div`
  background: linear-gradient(to right, #252424, #363636, #252424);
  padding: 12px 0 0 30px;
  overflow-y: scroll;
  height: calc(780px - 46px);
  flex: 1;
`
const TitlesContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;

  h1 {
    font-weight: bold;
  }
`

function Settings() {
	const allChamps = useAppSelector(({slice: {config: {champions}}}) => champions, () => true)
	useAppSelector(({slice: {rerenderSettings}}) => rerenderSettings)

	function renderListChampNameWithOPScore(allChamps: Champion[]) {
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
								champTags={elem.tags}
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
			<TitlesContainer
				aria-label={'titlesContainer'}
				className={cssCSW.CSWColoredTextGradiant}
			>
				<h1 style={{width: '110px'}}>ChampName</h1>
				<div
					style={{flex: 1, justifyContent: 'space-evenly'}}
					className={cssCSW.flexDirectionRow}
				>
					<h1>Your OP Score</h1>
					<h1>CSW OP Score</h1>
				</div>
			</TitlesContainer>
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
