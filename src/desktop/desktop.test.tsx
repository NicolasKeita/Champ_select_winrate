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
import * as fetchChampionsFromConfigJson from "@utils/fetchLocalConfigJson/fetchChampionsFromConfigJson"
import fetchMock from "jest-fetch-mock";
import allChamps from './../../__tests__/allChamps.json'
import '@testing-library/jest-dom'

const myWindow = new AppWindow(kWindowNames.desktop)

describe('basic', () => {
	test('should display winrate in title', async () => {
		const mock = jest.spyOn(fetchChampionsFromConfigJson, "fetchCSWgameVersion").mockResolvedValue("12.23.0")
		const mock2 = jest.spyOn(fetchChampionsFromConfigJson, "fetchAllChampionsJson").mockResolvedValue([])
		fetchMock.enableMocks()
		// @ts-ignore
		fetch.mockResponseOnce(JSON.stringify(allChamps));
		global.overwolf = {
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
			},
			//@ts-ignore
			windows: {
				onStateChanged: {
					addListener: (callback) => {},
					removeListener: (callback) => {},
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
		const winrateElem = screen.getByText(/winrate/i);
		expect(winrateElem).toBeInTheDocument();
	})
})