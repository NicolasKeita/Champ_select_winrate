/*
    Path + Filename: src/desktop/utils/store/action.ts
*/

export const resetSettingsInternal = (cpy) => ({type: 'resetSettings', payload: { cpy: cpy }})
export const toggleSettingsPage = () => ({type: 'toggleSettingsPage'})
export const setChampions = (champions) => ({type: 'setChampions', payload: {champions: champions}})
export const copyFromAnotherSetting = (config) => ({type: 'copyFromAnotherSetting', payload: {config: config}})
export const setUserOPScore = (score, champName) => ({type: 'setUserOPScore', payload: {score: score, champName: champName}})
export const updateAllUserScores = (champions) => ({type: 'updateAllUserScores', payload: {champions: champions}})
export const setInternalSettings = (score, champName) => ({type: 'setInternalSettings', payload: {score: score, champName: champName}})
export const populateDefaultConfig = (cpy) => (async dispatch => {
	await cpy.populateDefaultConfig()
	dispatch(setChampions(JSON.parse(cpy.stringifyChampions())))
})
export const resetSettings = (cpy) => (async dispatch => {
	await cpy.reset()
	dispatch(resetSettingsInternal(cpy.stringify()))
})

		// .then(response => dispatch(loadGallerySuccess(response.data)))
		// .catch(() => dispatch(loadGalleryError()));
