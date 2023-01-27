import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom/client'

import MyApp from './MyApp'
import store from './store/store'
import {copyFromAnotherSetting} from '@background/store/slice/slice'
import Config from '../desktop/components/maincontent/settings/Config'
import {StyleProvider} from '@ant-design/cssinjs'

import cs1 from '@public/css/setting.css'
import cs2 from '@public/css/general.css'
import cs3 from '@public/css/modal.css'
import cs4 from '@public/css/header.css'

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