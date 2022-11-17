/*
    Path + Filename: src/desktop/utils/hooks/index.tsx
*/

import {useContext} from 'react'
import {IsSettingsContext} from '../context'

export function useIsSettings() {
    return useContext(IsSettingsContext)
}