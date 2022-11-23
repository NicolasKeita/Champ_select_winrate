/*
    Path + Filename: src/desktop/components/header/myContextMenu/myContextMenu.tsx
*/

import React from 'react'
import { ContextMenu } from 'react-context-menu-hooks'
import { myContextMenuBridge } from './myContextMenuBridge'
import styled from 'styled-components'
import {useSettings} from '@utils/hooks'


const ContextMenuStyled = styled(ContextMenu)`
  background: linear-gradient(to right, rgb(63, 62, 62), #363636, #323232);
  border: 1px solid #e18f4b;
  color: rgba(236, 139, 55, 0.76);
  text-align: center;
`

function MyContextMenu():JSX.Element {
    const { resetSettings_rerenderApp } = useSettings()
    const handleRightClick = async () => {
        await resetSettings_rerenderApp()
    }
    const darkMode: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    return (
        <ContextMenuStyled dark={darkMode} bridge={myContextMenuBridge}>
            <ContextMenu.Option onClick={handleRightClick}>Reset config</ContextMenu.Option>
        </ContextMenuStyled>
    )
}

export default MyContextMenu