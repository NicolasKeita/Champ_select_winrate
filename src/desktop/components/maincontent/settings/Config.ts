/*
    Path + Filename: src/desktop/components/maincontent/settings/Config.ts
*/

import {Champion} from './Champion'

export enum ConfigPage {
	CHAMPSELECT = 100,
	HISTORY = 200
}

export type Config = {
	currentPage: ConfigPage,
	settingsPage: boolean,
	champions: Champion[]
}
export default Config

export function configConstructor(currentPage = ConfigPage.HISTORY, settingsPage = false, champions: Champion[] = []): Config {
	return {
		currentPage: currentPage,
		settingsPage: settingsPage,
		champions: champions
	}
}

export function getDefaultConfig(): Config {
	const defaultCurrentPage = ConfigPage.HISTORY
	const defaultSettingsPage = false
	const defaultChampions = []
	return configConstructor(defaultCurrentPage, defaultSettingsPage, defaultChampions)
}

export function configAssign(configTarget: Config, configSource: Config) {
	configTarget.currentPage = configSource.currentPage
	configTarget.settingsPage = configSource.settingsPage
	configTarget.champions.splice(0, configSource.champions.length, ...configSource.champions)
}