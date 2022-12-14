/*
    Path + Filename: src/desktop/desktop.test.tsx
*/

import React from 'react'
import {Provider} from 'react-redux'
import MyApp from './MyApp'
import {AppWindow} from '../AppWindow'
import {kWindowNames} from '../consts'
import {act, render, waitFor, screen} from '@testing-library/react'
import {ChakraProvider} from '@chakra-ui/react'
import {store} from '@utils/store/store'
import * as fetchChampionsFromConfigJson
	from '@utils/fetchLocalConfigJson/fetchChampionsFromConfigJson'
import fetchMock from 'jest-fetch-mock'
import allChamps from './../../__tests__/allChamps.json'
import '@testing-library/jest-dom'

const myWindow = new AppWindow(kWindowNames.desktop)

describe('basic', () => {
	const mock = jest.spyOn(fetchChampionsFromConfigJson, 'fetchCSWgameVersion').mockResolvedValue('12.23.0')
	const mock2 = jest.spyOn(fetchChampionsFromConfigJson, 'fetchAllChampionsJson').mockResolvedValue(Object.values(allChamps))
	global.overwolf = {
		games: {
			launchers: {
				//@ts-ignore
				events: {
					//@ts-ignore
					onInfoUpdates: {
						addListener: (onInfoUpdates2Listener) => {}
					},
					setRequiredFeatures: () => {},
					getInfo: () => {}
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
			},
			//@ts-ignore
			events: {
				onError: {
					addListener: (onErrorListener) => {},
					removeListener: (onErrorListener) => {}
				},
				onInfoUpdates2: {
					addListener: (onInfoUpdates2Listener) => {},
					removeListener: (onInfoUpdates2Listener) => {}
				},
				onNewEvents: {
					addListener: (onNewEventsListener) => {},
					removeListener: (onNewEventsListener) => {}
				}
			}
		},
		//@ts-ignore
		windows: {
			onStateChanged: {
				addListener: (callback) => {},
				removeListener: (callback) => {}
			}
		}
	}
	test('should display winrate in header', async () => {
		fetchMock.enableMocks()
		// @ts-ignore
		fetch.mockResponseOnce(JSON.stringify(allChamps))

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
		const winrateElem = screen.getByText(/winrate/i)
		const FooterElem = screen.getByText(/League client is not open./i)
		expect(winrateElem).toBeInTheDocument()
		expect(FooterElem).toBeInTheDocument()
	})
	test('should display message when opening lol client', async () => {
		fetchMock.enableMocks()
		// @ts-ignore
		fetch.mockResponseOnce(JSON.stringify(allChamps))

		function getRunningLaunchersInfo(callback) {
			const clientsInfos = {
				launchers: [] as unknown as {id: number}[]
			}
			clientsInfos.launchers.push({id: 109021})
			callback(clientsInfos)
		}

		global.overwolf.games.launchers.getRunningLaunchersInfo = getRunningLaunchersInfo

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
		const FooterElem = screen.getByText(/You are not in champ select./i)
		expect(FooterElem).toBeInTheDocument()
	})
	test('should display message when closing lol client', async () => {
		fetchMock.enableMocks()
		// @ts-ignore
		fetch.mockResponseOnce(JSON.stringify(allChamps))

		function getRunningLaunchersInfo(callback) {
			const clientsInfos = {
				launchers: [] as unknown as {id: number}[]
			}
			clientsInfos.launchers.push({id: 109021})
			callback(clientsInfos)
		}

		function onTerminatedAddListener(callback) {
			setTimeout(callback, 1000)
		}

		// open LoL client
		global.overwolf.games.launchers.getRunningLaunchersInfo = getRunningLaunchersInfo
		// closes LoL client
		global.overwolf.games.launchers.onTerminated.addListener = onTerminatedAddListener

		await act(() => {
			render(
				<ChakraProvider>
					<Provider store={store}>
						<MyApp my_window={myWindow} />
					</Provider>
				</ChakraProvider>
			)
		})
		mock.mockRestore()
		mock2.mockRestore()
		await waitFor(() => {
			const FooterElem = screen.getByText(/League client is not open./i)
			expect(FooterElem).toBeInTheDocument()
		}, {timeout: 4000})
	})

})