import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom/client'

import MyApp from './MyApp'
import {AppWindow} from '../AppWindow'
import {kWindowNames} from '../consts'
import '@public/css/desktop.css'
import {store} from '@utils/store/store'
import {ChakraProvider} from '@chakra-ui/react'

const myWindow = new AppWindow(kWindowNames.desktop)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<ChakraProvider>
			<Provider store={store}>
				<MyApp my_window={myWindow} />
			</Provider>
		</ChakraProvider>
	</React.StrictMode>
)