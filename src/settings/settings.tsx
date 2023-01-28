import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom/client'

import MyApp from './MyApp'
import store from './store/store'
import {copyFromAnotherSetting} from '@background/store/slice/slice'
import Config from '../desktop/components/maincontent/settings/Config'
import {StyleProvider} from '@ant-design/cssinjs'

// TODO remove unnecessary below and merge into one?
import '@public/css/setting.css' assert {type: 'css'}
import '@public/css/general.css' assert {type: 'css'}
import '@public/css/modal.css' assert {type: 'css'}

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
		<StyleProvider hashPriority={'high'}>
			<Provider store={settingsStore}>
				<MyApp />
			</Provider>
		</StyleProvider>
	</React.StrictMode>
)