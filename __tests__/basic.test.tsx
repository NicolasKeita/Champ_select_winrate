/*
    Path + Filename: src/desktop/basic.test.tsx
*/

import React from 'react'
import {act, waitFor, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import fetch from 'jest-fetch-mock'

import allChamps from '../__testsUtils__/allChamps.json'
import {configTest} from '../__testsUtils__/configTest'
import {
	getRunningLaunchersInfo, onInfoUpdatesAddListener, onTerminatedAddListener,
	overwolfMocked
} from '../__testsUtils__/OW_mocking'
import {renderEntireApp} from '../__testsUtils__/renderEntireApp'
import * as fetchDataDragon
	from '../src/desktop/utils/fetchDataDragon/fetchDataDragon'

describe('basic', () => {
	beforeEach(() => {
		localStorage.clear()
		sessionStorage.clear()
		global.overwolf = overwolfMocked
	})
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
	jest.spyOn(fetchDataDragon, 'getChampName').mockResolvedValue('Talon')
	jest.spyOn(fetchDataDragon, 'getChampImg').mockResolvedValue('https://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/Talon.png')
	jest.spyOn(fetchDataDragon, 'getChampSquareAsset').mockResolvedValue('https://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/Talon.png')
	test('should display winrate in header', async () => {
		await act(() => {renderEntireApp()})
		const winrateElem = screen.getByText(/winrate/i)
		const FooterElem = screen.getByText(/League client is not open./i)
		expect(winrateElem).toBeInTheDocument()
		expect(FooterElem).toBeInTheDocument()
	})
	test('should display message when lol client is already open', async () => {
		global.overwolf.games.launchers.getRunningLaunchersInfo = getRunningLaunchersInfo
		await act(() => {renderEntireApp()})
		const FooterElem = screen.getByText(/You are not in champ select./i)
		expect(FooterElem).toBeInTheDocument()
	})
	test('should display message when closing lol client', async () => {
		// open LoL client
		global.overwolf.games.launchers.getRunningLaunchersInfo = getRunningLaunchersInfo
		// closes LoL client
		global.overwolf.games.launchers.onTerminated.addListener = onTerminatedAddListener

		await act(() => {renderEntireApp()})
		await waitFor(() => {
			const FooterElem = screen.getByText(/League client is not open./i)
			expect(FooterElem).toBeInTheDocument()
		}, {timeout: 4000})
	})

	test('should remove footer when entering in champ select matchmaking', async () => {
		// client is already running
		global.overwolf.games.launchers.getRunningLaunchersInfo = getRunningLaunchersInfo
		// Entering in champ select
		global.overwolf.games.launchers.events.onInfoUpdates.addListener = onInfoUpdatesAddListener

		await act(() => {renderEntireApp()})
		await waitFor(() => {
			expect(screen.getByRole('heading', {name: 'footerMessage'})).toBeEmptyDOMElement()
		}, {timeout: 4000})
	})
	test('should see default settings in localStorage after launching app', async () => {
		//lol Client's already running
		global.overwolf.games.launchers.getRunningLaunchersInfo = getRunningLaunchersInfo
		await act(() => {renderEntireApp()})

		await waitFor(() => {
			const config = localStorage.getItem('config')
			expect(config).toBe(configTest)
		}, {timeout: 1000})
	})
})