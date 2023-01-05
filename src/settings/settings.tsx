import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom/client'

import MyApp from './MyApp'
import '@public/css/desktop.css'
import store from './store/store'
import {copyFromAnotherSetting} from '../background/store/slice'
import Config from '../desktop/components/maincontent/settings/Config'

import '@public/css/desktop.css'
import '@public/css/general.css'
import '@public/css/modal.css'
import '@public/css/header.css'

const settingsStore = store
const config: Config = JSON.parse(localStorage.getItem('config') ?? '{}')
if (
	Object.keys(config).length != 0 &&
	config.champions &&
	config.champions.length != 0
) {
	settingsStore.dispatch(copyFromAnotherSetting(config))
}
overwolf.windows.getMainWindow().settingsStore = settingsStore

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<Provider store={settingsStore}>
			<MyApp />
		</Provider>
	</React.StrictMode>
)