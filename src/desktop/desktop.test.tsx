/*
    Path + Filename: src/desktop/desktop.test.tsx
*/


import React from 'react'
import {Provider} from 'react-redux'
import MyApp from './MyApp'
import {AppWindow} from '../AppWindow'
import {kWindowNames} from '../consts'
import '@testing-library/jest-dom'

const myWindow = new AppWindow(kWindowNames.desktop)

import {render} from '@testing-library/react'


// jest.mock('./ReplacementFooterAD', jest.fn())
import ReplacementFooterAD from './components/footerAD/replacement'
import {ChakraProvider} from '@chakra-ui/react'
import {store} from '@utils/store/store'


// import spyOn = jest.spyOn
// import * as data from './OW_mocking'

// export const overwolf = {
// 	windows: {onStateChanged: {addListener: (callback) => {}}}
// 	// games: {launchers: {events: {getInfo: (numberr: any, callback: any) => {}}}}
// }

// export interface overwolf {
// 	windows: {onStateChanged: {addListener: callback => {}}},
// games: {launchers: {events: getInfo(10902, callback => {})}}
// }

// overwolf.windows.onStateChanged.addListener = callback => {}
// overwolf.games.launchers.events.getInfo(numberr, callback) {}

test('renders learn react link', () => {
	global.overwolf = {
		windows: {
			//@ts-ignore
			onStateChanged: {
				addListener: (callback) => {}
			}
		},
		games: {
			launchers: {
				//@ts-ignore
				events: {
					getInfo: (numberr: any, callback: any) => {}
				},
				getRunningLaunchersInfo: () => {},
				//@ts-ignore
				onLaunched: {
					addListener: () => {}
				},
				//@ts-ignore
				onTerminated: {
					addListener: () => {}
				}
			}
		}
	}

	// const mock = jest.spyOn(overwolf.windows.onStateChanged, 'addListener')
	// const mock2 = jest.spyOn(overwolf.games.launchers, 'getRunningLaunchersInfo')
	// const mock3 = jest.spyOn(overwolf.games.launchers.events, 'getInfo')
	//
	// const nico = jest.fn()
	render(
		<ChakraProvider>
			<Provider store={store}>
				<MyApp my_window={myWindow} />
			</Provider>
		</ChakraProvider>
	)
	// const linkElement = screen.getByText(/hello world/i);
	// expect(linkElement).toBeInTheDocument();
})