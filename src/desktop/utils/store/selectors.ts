/*
    Path + Filename: src/desktop/utils/store/selectors.ts
*/

import Config from '../../components/maincontent/settings/Config'

export const selectInstancedConfig = () => {
	return (
		(state) => {
			return new Config(JSON.parse(state.configSerialized))
		}
	)
}
export const selectBooleanSettingsPage = () => {
	return (
		state => {
			const configPlainObject: Config | undefined = JSON.parse(state.configSerialized)
			if (configPlainObject)
				return configPlainObject.settingsPage
			else
				return false
		}
	)
}
export const selectAllChampions = () => {
	return (
		state => {
			const configPlainObject: Config | undefined = JSON.parse(state.configSerialized)
			if (configPlainObject && configPlainObject.champions)
				return configPlainObject.champions
			else
				return []
		}
	)
}
