/*
    Path + Filename: src/desktop/utils/context/index.tsx
*/

import React, { createContext, useState } from 'react'
import Config from '../../components/maincontent/settings/Config'
const configDefault = new Config()

export const SettingsContext = createContext(undefined)
//TODO
// eslint-disable-next-line react/prop-types
export const SettingsProvider = ({ children } ) => {
    const [settings, setSettings] = useState(configDefault)
    const toggleSettings = () => {
        const cpy = Object.assign({}, configDefault)
        cpy.settingsPage = !settings.settingsPage
        setSettings(cpy)
    }
    return (
        <SettingsContext.Provider value={ { settings, toggleSettings } }>
            { children }
        </SettingsContext.Provider>
    )
}