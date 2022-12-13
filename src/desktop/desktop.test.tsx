/*
    Path + Filename: src/desktop/desktop.test.tsx
*/


import React from 'react'
import {Provider} from 'react-redux'
import MyApp from './MyApp'
import {AppWindow} from '../AppWindow'
import {kWindowNames} from '../consts'
import '@testing-library/jest-dom'
import {act, render, waitFor} from '@testing-library/react'
import {ChakraProvider} from '@chakra-ui/react'
import {store} from '@utils/store/store'
import * as fetchChampionsFromConfigJson from "@utils/fetchLocalConfigJson/fetchChampionsFromConfigJson"
import fetchMock from "jest-fetch-mock";

const myWindow = new AppWindow(kWindowNames.desktop)

test('renders learn react link', async () => {
	const mock = jest.spyOn(fetchChampionsFromConfigJson, "fetchCSWgameVersion").mockResolvedValue("12.23.0")
	const mock2 = jest.spyOn(fetchChampionsFromConfigJson, "fetchAllChampionsJson").mockResolvedValue([])
	fetchMock.enableMocks()
	// @ts-ignore
	fetch.mockResponseOnce(JSON.stringify({rates: {CAD: 1.42}}));
	// global.overwolf = jest.fn(() => // TODO do that
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

	await act(() => {
		render(
			<ChakraProvider>
				<Provider store={store}>
					<MyApp my_window={myWindow} />
				</Provider>
			</ChakraProvider>
		)
	})
	await waitFor(() => {

	})
	mock.mockRestore()
	mock2.mockRestore()
	// const linkElement = screen.getByText(/hello world/i);
	// expect(linkElement).toBeInTheDocument();
})