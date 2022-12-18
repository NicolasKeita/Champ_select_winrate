/*
    Path + Filename: src/desktop/utils/store/selectors.ts
*/

import Config, {ConfigPage} from '../../components/maincontent/settings/Config'

//TODO put types there, on the state
export const selectInstancedConfig = () => {
	return (
		(state) => {
			return new Config(JSON.parse(state.slice.configSerialized))
		}
	)
}
export const selectBooleanSettingsPage = () => {
	return (
		state => {
			const configPlainObject: Config | undefined = JSON.parse(state.slice.configSerialized)
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
			const configPlainObject: Config | undefined = JSON.parse(state.slice.configSerialized)
			if (configPlainObject && configPlainObject.champions)
				return configPlainObject.champions
			else
				return []
		}
	)
}

export const selectCurrentPage = () => {
	return (
		state => {
			const configPlainObject: Config | undefined = JSON.parse(state.slice.configSerialized)
			if (configPlainObject)
				return configPlainObject.currentPage
			else
				return ConfigPage.HISTORY
		}
	)
}
