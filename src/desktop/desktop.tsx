import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom/client'

import MyApp from './MyApp'
import css6 from '@public/css/global/desktop_globals.css'
import store from '@utils/store/store'

const desktopStore = store
overwolf.windows.getMainWindow().desktopStore = desktopStore

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<Provider store={desktopStore}>
			<MyApp />
		</Provider>
	</React.StrictMode>
)