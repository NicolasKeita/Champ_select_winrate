/*
    Path + Filename: src/settings/SettingsInfos.tsx
*/

import React from 'react'
import styled from 'styled-components'
import {Button} from 'antd'
import cssCSW from '@public/css/CSWStyles.module.css' assert {type: 'css'}

const SettingsInfosContainer = styled.div`
  background: linear-gradient(to right, #252424, #363636, #252424);
  height: 424px;
  max-height: 424px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-justify: auto;
  font-size: 16px;

  p {
    margin: 10px;
  }

  h1:first-child {
    margin-top: 25px;
    margin-bottom: 25px;
    font-size: larger;
  }
`

function SettingsInfos() {
	return (
		<SettingsInfosContainer aria-label={'settingsInfosContainer'}>
			<h1>
				Welcome to your settings.
			</h1>
			<p>
				CSW is the only forecast app allowing users<br />
				to define a champion&apos;s strengh themselves.
			</p>
			<p>
				If you are not satisfied with the default, <br />
				Feel free to change it in the left panel.
			</p>
			<hr />
			<div
				className={cssCSW.flexDirectionColumn}
				style={{
					justifyContent: 'space-around',
					flex: 1
				}}>
				<Button type={'primary'} danger={true}>
					Reset settings
				</Button>
				<Button>
					Discord
				</Button>
			</div>
		</SettingsInfosContainer>
	)
}


export default SettingsInfos