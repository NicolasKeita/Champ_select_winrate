import {AppWindow} from '../AppWindow'
import {kWindowNames} from '../consts'
import React from 'react'
import ReactDOM from 'react-dom/client'
import MyApp from './MyApp'

import '@public/css/desktop.css'
import {store} from '@utils/store/store'
import {Provider} from 'react-redux'

const myWindow = new AppWindow(kWindowNames.desktop)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<Provider store={store}>
		{/*<React.StrictMode>*/}
		<MyApp my_window={myWindow} />
		{/*</React.StrictMode>*/}
	</Provider>
)
