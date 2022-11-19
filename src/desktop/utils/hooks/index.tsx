/*
    Path + Filename: src/desktop/utils/hooks/index.tsx
*/

import {useContext} from 'react'
import {SettingsContext} from '../context'

export function useSettings() {
    return useContext(SettingsContext)
}