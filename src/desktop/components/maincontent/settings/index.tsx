/*
    Path + Filename: src/desktop/components/maincontent/settings/myContextMenu.tsx
*/

import React from 'react'
import styled from 'styled-components'
import {useAppSelector} from '@utils/hooks'
import uniqid from 'uniqid'
import ConfigRow from './configRow'
import {selectInstancedConfig} from '@utils/store/selectors'

const SettingsContainer = styled.div`
  background: linear-gradient(to right, #252424, #363636, #252424);
  flex: 1;
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
	console.log('Settings rendered')
	const settings = useAppSelector(selectInstancedConfig())

	function renderListChampNameWithOPScore() {
		if (settings.champions.length == 0) {
			return <div></div> //TODO do the map() first then see if there is a need for this if
		}
		const rows: JSX.Element[] = [] // TODO change to map() ?
		settings.champions.forEach(elem => {
			rows.push(<ConfigRow key={uniqid()} champName={elem.name} opScoreCSW={+elem.opScore_CSW} opScoreUser={+elem.opScore_user} />)
		})
		return <div>{rows}</div>
	}

	function renderTitleRow() {
		return (
			<RowContainer style={{paddingBottom: '12px'}}>
				<ChampName>ChampName</ChampName>
				<OP_ScoreContainer>
					<div>Your OP Score</div>
					<div>CSW OP Score</div>
				</OP_ScoreContainer>
			</RowContainer>
		)
	}

	return (
		<SettingsContainer id={'SettingsContainer'}>
			{renderTitleRow()}
			{renderListChampNameWithOPScore()}
		</SettingsContainer>
	)
}

export default Settings
