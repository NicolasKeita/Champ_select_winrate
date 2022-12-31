import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom/client'

import MyApp from './MyApp'
import {AppWindow} from '../AppWindow'
import {kWindowNames} from '../consts'
import '@public/css/desktop.css'
import {store} from '@utils/store/store'

const myWindow = new AppWindow(kWindowNames.settings)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		{/*<Provider store={store}>*/}
		<MyApp myWindow={myWindow} />
		{/*</Provider>*/}
	</React.StrictMode>
)