/*
    Path + Filename: __tests__/champselect.test.tsx
*/


import userEvent from '@testing-library/user-event'
import {
	getRunningLaunchersInfo,
	onInfoUpdatesAddListenerSpamChampSelect,
	overwolfMocked
} from '../__testsUtils__/OW_mocking'
import {act, screen, waitFor} from '@testing-library/react'
import {renderEntireApp} from '../__testsUtils__/renderEntireApp'
import fetch from 'jest-fetch-mock'
import allChamps from '../__testsUtils__/allChamps.json'
import '@testing-library/jest-dom'
import * as fetchDataDragon
	from '../src/desktop/utils/fetchDataDragon/fetchDataDragon'
import {UserEvent} from '@testing-library/user-event/setup/setup'


describe('settings', () => {
	let user: UserEvent
	beforeEach(() => {
		localStorage.clear()
		sessionStorage.clear()
		global.overwolf = overwolfMocked
		user = userEvent.setup()
	})
	jest.useRealTimers()
	//jest.useFakeTimers()
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

	it('should enter in champ select correctly', async () => {
		global.overwolf.games.launchers.getRunningLaunchersInfo = getRunningLaunchersInfo
		// ↑ Put a client already running
		global.overwolf.games.launchers.events.onInfoUpdates.addListener = onInfoUpdatesAddListenerSpamChampSelect
		// ↑ Enters in champ select
		await act(() => { renderEntireApp() })
		// await act(() => { jest.advanceTimersByTime(10000) })
		let HistoryTitle
		let TalonElem
		for (let x = 0; x < 10; ++x) {
			await waitFor(async () => {
				HistoryTitle = screen.getByText(/Your ranked history/i)
				expect(HistoryTitle).toBeInTheDocument()
			}, {timeout: 300})
			await waitFor(async () => {
				TalonElem = screen.getAllByText(/Talon/i)
				expect(TalonElem).toBeDefined()
				if (TalonElem.length && TalonElem.length >= 1) {
					const talonTile = TalonElem[0].parentElement
					expect(talonTile).toContainHTML('35')
				}
			}, {timeout: 300 * 3})
		}
	})
})
