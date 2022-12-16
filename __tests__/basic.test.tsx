/*
    Path + Filename: src/desktop/basic.test.tsx
*/

import React from 'react'
import {Provider} from 'react-redux'
import {act, render, waitFor, screen} from '@testing-library/react'
import {ChakraProvider} from '@chakra-ui/react'
import '@testing-library/jest-dom'
import fetch from 'jest-fetch-mock'

import MyApp from '../src/desktop/MyApp'
import {AppWindow} from '../src/AppWindow'
import {kWindowNames} from '../src/consts'
import {store} from '../src/desktop/utils/store/store'
import allChamps from '../__testsUtils__/allChamps.json'
import {configTest} from '../__testsUtils__/configTest'
import {
	getRunningLaunchersInfo,
	overwolfMocked
} from '../__testsUtils__/OW_mocking'

const myWindow = new AppWindow(kWindowNames.desktop)

describe('basic', () => {
	jest.setTimeout(30000)
	fetch.enableMocks()
	fetch.mockResponse(req => {
			if (req.url === 'https://4nuo1ouibd.execute-api.eu-west-3.amazonaws.com/csw_api_proxy/allchamps')
				return Promise.resolve(JSON.stringify(allChamps))
			else if (req.url === 'https://4nuo1ouibd.execute-api.eu-west-3.amazonaws.com/csw_api_proxy/cswgameversion')
				return Promise.resolve('12.23.0')
			else
				return Promise.reject(new Error('URL is not handled by Jest tests'))
		}
	)
	test('should display winrate in header', async () => {
		global.overwolf = overwolfMocked
		await act(() => {
			render(
				<ChakraProvider>
					<Provider store={store}>
						<MyApp my_window={myWindow} />
					</Provider>
				</ChakraProvider>
			)
		})
		const winrateElem = screen.getByText(/winrate/i)
		const FooterElem = screen.getByText(/League client is not open./i)
		expect(winrateElem).toBeInTheDocument()
		expect(FooterElem).toBeInTheDocument()
	})
	test('should display message when lol client is already open', async () => {
		global.overwolf = overwolfMocked
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
		const FooterElem = screen.getByText(/You are not in champ select./i)
		expect(FooterElem).toBeInTheDocument()
	})
	test('should display message when closing lol client', async () => {
		global.overwolf = overwolfMocked
		function getRunningLaunchersInfo(callback) {
			const clientsInfos = {
				launchers: [{id: 109021}]
			}
			callback(clientsInfos)
		}

		function onTerminatedAddListener(callback) {
			setTimeout(callback, 500)
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
		await waitFor(() => {
			const FooterElem = screen.getByText(/League client is not open./i)
			expect(FooterElem).toBeInTheDocument()
		}, {timeout: 4000})
	})

	test('should remove footer when entering in champ select matchmaking', async () => {
		global.overwolf = overwolfMocked

		function onInfoUpdatesAddListener(callback) {
			const infoGameFlow = {
				feature: 'game_flow',
				info: {
					game_flow: {
						phase: 'Lobby'
					}
				}
			}
			setTimeout(callback, 1000, infoGameFlow)
			infoGameFlow.info.game_flow.phase = 'ChampSelect'
			setTimeout(callback, 2000, infoGameFlow)
			const infoChampSelect = {
				feature: 'champ_select',
				info: {
					champ_select: {
						raw: JSON.stringify({
							localPlayerCellId: 0,
							actions: [
								[{
									actorCellId: 0,
									ChampionId: 77,
									isAllyAction: false,
									type: 'ban'
								}],
								[],
								[],
								[],
								[],
								[],
								[],
								[]
							]
						})
					}
				}
			}
			setTimeout(callback, 3000, infoChampSelect)
		}

		// client is already running
		global.overwolf.games.launchers.getRunningLaunchersInfo = getRunningLaunchersInfo
		global.overwolf.games.launchers.events.onInfoUpdates.addListener = onInfoUpdatesAddListener

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
			const FooterElem = screen.getByTestId('footerMessage').innerHTML
			expect(FooterElem).toBe('<div></div>')
		}, {timeout: 4000})
	})
	test('should see default settings in localStorage after launching app', async () => {
		localStorage.clear()
		sessionStorage.clear()
		global.overwolf = overwolfMocked
		//lol Client's already running
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

		const config = localStorage.getItem('config')
		expect(config).toBe(configTest)
	})
})