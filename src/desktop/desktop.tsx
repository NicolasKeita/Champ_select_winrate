import {AppWindow} from '../AppWindow'
import {kWindowNames} from '../consts'
import React from 'react'
import ReactDOM from 'react-dom/client'
import MyApp from './MyApp'
import FooterAD from './components/footerAD'

import '@public/css/desktop.css'
import {SettingsProvider} from '@utils/context'

const myWindow = new AppWindow(kWindowNames.desktop)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<SettingsProvider>
			<div id={'myApp+FooterAD'} style={{display: 'flex', flexDirection: 'column'}}>
				<MyApp my_window={myWindow} />
				<FooterAD />
			</div>
		</SettingsProvider>
	</React.StrictMode>
)
