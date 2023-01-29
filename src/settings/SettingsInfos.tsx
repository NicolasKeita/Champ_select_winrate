/*
    Path + Filename: src/settings/SettingsInfos.tsx
*/

import React from 'react'
import styled from 'styled-components'

import cssCSW from '@public/css/CSWStyles.module.css' assert {type: 'css'}

const SettingsInfosContainer = styled.div`
  background: linear-gradient(to right, #252424, #363636, #252424);
  height: 424px;
  max-height: 424px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-justify: auto;

  h1 {
    margin: 10px;
    font-size: 16px;
  }

  h1:first-child {
    margin-top: 25px;
  }
`

function SettingsInfos() {
	return (
		<SettingsInfosContainer>
			<h1>
				Welcome to your settings.
			</h1>
			<h1>
				CSW is the only forecast app allowing users to define champions
				strengh themselves.
			</h1>
			<h1>
				If you are not satisfied with the default.
			</h1>
			<h1>
				Feel free to change it in here.
			</h1>
		</SettingsInfosContainer>
	)
}


export default SettingsInfos