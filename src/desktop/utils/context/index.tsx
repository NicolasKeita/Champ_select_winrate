/*
    Path + Filename: src/desktop/utils/context/myContextMenu.tsx
*/

import React, {createContext, useState} from 'react'
import Config from '../../components/maincontent/settings/Config'
const configDefault = new Config()
localStorage.setItem('configDefault', configDefault.stringify())

export const SettingsContext = createContext(undefined)
//TODO
// eslint-disable-next-line react/prop-types
export const SettingsProvider = ({children}) => {
	const [settings, setSettings] = useState<Config>(configDefault)
	const toggleSettings_rerenderApp = () => {
		const cpy = Object.assign(new Config(), configDefault) // TODO waste of memory ?
		cpy.settingsPage = !settings.settingsPage
		setSettings(cpy)
	}
	const resetSettings_rerenderApp = async () => {
		const cpy = Object.assign(new Config(), settings)
		await cpy.reset()
		setSettings(cpy)
	}
	return (
		<SettingsContext.Provider
			value={
				{
					settings,
					toggleSettings_rerenderApp: toggleSettings_rerenderApp,
					resetSettings_rerenderApp: resetSettings_rerenderApp
				} as const
			}
		>
			{children}
		</SettingsContext.Provider>
	)
}
