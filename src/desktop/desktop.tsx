import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom/client'

import MyApp from './MyApp'
import {AppWindow} from '../AppWindow'
import {kWindowNames} from '../consts'
import '@public/css/desktop.css'
import {store} from '@utils/store/store'

let backgroundStore = overwolf.windows.getMainWindow().store
if (!backgroundStore) {
	console.error('Receive a Window Object without any store inside')
	backgroundStore = store
}

const myWindow = new AppWindow(kWindowNames.desktop)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<Provider store={backgroundStore}>
			<MyApp myWindow={myWindow} />
		</Provider>
	</React.StrictMode>
)