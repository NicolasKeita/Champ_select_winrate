import {ChakraProvider} from '@chakra-ui/react'
import {Provider} from 'react-redux'
import React from 'react'
import {store} from '../src/desktop/utils/store/store'
import MyApp from '../src/desktop/MyApp'
import {AppWindow} from '../src/AppWindow'
import {kWindowNames} from '../src/consts'

const myWindow = new AppWindow(kWindowNames.desktop)


export function renderEntireApp() : JSX.Element {
	return (
		<ChakraProvider>
			<Provider store={store}>
				<MyApp my_window={myWindow} />
			</Provider>
		</ChakraProvider>
	)
}
