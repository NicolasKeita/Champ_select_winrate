/*
    Path + Filename: src/desktop/utils/hooks/myContextMenu.tsx
*/

import {useContext} from 'react'
import {SettingsContext} from '../context'
import Config from '../../components/maincontent/settings/Config'

export const useSettings = (): {
    settings: Config
    toggleSettings_rerenderApp: () => void
    resetSettings_rerenderApp: () => void
} => useContext(SettingsContext)
// TODO : provide another function to resetSettings and rerender ?
