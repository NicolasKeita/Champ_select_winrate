/*
    Path + Filename: src/desktop/utils/store/selectors.ts
*/

import {RootState} from '@utils/store/store'

//TODO transform into function instead of arrow function
export const selectConfig = () => {
	return (
		(state: RootState) => {
			return state.slice.config
		}
	)
}
export const selectBooleanSettingsPage = () => {
	return (
		(state: RootState) => {
			return state.slice.config.settingsPage
		}
	)
}
export const selectAllChampions = () => {
	return (
		(state: RootState) => {
			return state.slice.config.champions
		}
	)
}

export const selectCurrentPage = () => {
	return (
		(state: RootState) => {
			return state.slice.config.currentPage
		}
	)
}