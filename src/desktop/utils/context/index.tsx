/*
    Path + Filename: src/desktop/utils/context/index.tsx
*/

import React, { createContext, useState } from 'react'

export const IsSettingsContext = createContext(undefined)
// eslint-disable-next-line react/prop-types
export const IsSettingsProvider = ( { children } ) => {
    const [isSettings, setIsSettings] = useState(true)
    const toggleIsSettings = () => {
        setIsSettings(isSettings == false)
    }
    return (
        <IsSettingsContext.Provider value={ { isSettings, toggleIsSettings } }>
            { children }
        </IsSettingsContext.Provider>
    )
}