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