/*
    Path + Filename: src/desktop/components/header/myContextMenu/myContextMenu.tsx
*/

import React from 'react'
import {ContextMenu} from 'react-context-menu-hooks'
import {myContextMenuBridge} from './myContextMenuBridge'
import styled from 'styled-components'

import {useAppDispatch} from '@utils/hooks'
import {resetSettings} from '@utils/store/store'

const ContextMenuStyled = styled(ContextMenu)`
  background: linear-gradient(to right, rgb(63, 62, 62), #363636, #323232);
  border: 1px solid #e18f4b;
  color: rgba(236, 139, 55, 0.76);
  text-align: center;
`

function MyContextMenu(): JSX.Element {
	const dispatch = useAppDispatch()

	const handleRightClick = () => {
		dispatch(resetSettings())
	}
	const darkMode: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

	return (
		<ContextMenuStyled dark={darkMode} bridge={myContextMenuBridge}>
			<ContextMenu.Option onClick={handleRightClick}>Reset
				config</ContextMenu.Option>
		</ContextMenuStyled>
	)
}

export default MyContextMenu
