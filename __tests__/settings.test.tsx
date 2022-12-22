/*
    Path + Filename: __tests__/settings.test.tsx
*/


import userEvent from '@testing-library/user-event'
import {
	getRunningLaunchersInfo, onInfoUpdatesAddListener,
	overwolfMocked
} from '../__testsUtils__/OW_mocking'
import {act, screen, waitFor} from '@testing-library/react'
import {renderEntireApp} from '../__testsUtils__/renderEntireApp'
import fetch from 'jest-fetch-mock'
import allChamps from '../__testsUtils__/allChamps.json'
import {configTest} from '../__testsUtils__/configTest'
import '@testing-library/jest-dom'
import * as fetchDataDragon
	from '../src/desktop/utils/fetchDataDragon/fetchDataDragon'
import {UserEvent} from '@testing-library/user-event/setup/setup'

describe('settings', () => {
	let user : UserEvent
	beforeEach(() => {
		localStorage.clear()
		sessionStorage.clear()
		global.overwolf = overwolfMocked
		user = userEvent.setup()
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

	it('should update immediately user score when user changes it', async () => {
		global.overwolf.games.launchers.getRunningLaunchersInfo = getRunningLaunchersInfo
		// ↑ Put a client already running
		global.overwolf.games.launchers.events.onInfoUpdates.addListener = onInfoUpdatesAddListener
		// ↑ Enters in champ select
		await act(() => { renderEntireApp()})
		expect(localStorage.getItem('config')).toBe(configTest)
		await waitFor(() => {
			const TalonElem = screen.getAllByText(/Talon/i)
			expect(TalonElem).toBeDefined()
			if (TalonElem.length && TalonElem.length >= 1) {
				const talonTile = TalonElem[0].parentElement
				expect(talonTile).toContainHTML('35')
			}
		}, {timeout: 5000})
		const settingButton = screen.getByLabelText('settingsButton')
		await user.click(settingButton)
		// ↑ Goes to settings
		let inputTextBoxTalon = screen.getByRole('textbox', {name: 'Talon'})
		if (!(inputTextBoxTalon instanceof HTMLInputElement))
			throw new Error('Expected HTMLInputElement')
		expect(inputTextBoxTalon).toHaveValue('35')
		await user.type(inputTextBoxTalon, '[Backspace][Backspace]99')
		// ↑ Puts 99 to talon score
		expect(inputTextBoxTalon).toHaveValue('99')
		await user.click(settingButton)
		// ↑ goes back to homepage & see if Talon has 99 as score
		const TalonElem = screen.getAllByText(/Talon/i)
		expect(TalonElem).toBeDefined()
		if (TalonElem.length && TalonElem.length >= 1) {
			const talonTile = TalonElem[0].parentElement
			expect(talonTile).toContainHTML('99')
		}
		await user.click(settingButton)
		// ↑ goes back to settings and check if talon still has 99 as score
		inputTextBoxTalon = screen.getByRole('textbox', {name: 'Talon'})
		expect(inputTextBoxTalon).toHaveValue('99')
	})
	it('should appear default 50 when removing user score completely', async () => {
		await act(() => {renderEntireApp()})
		const settingButton = screen.getByLabelText('settingsButton')
		await user.click(settingButton)
		// ↑ Goes to settings
		let inputTextBoxTalon = screen.getByRole('textbox', {name: 'Talon'})
		if (!(inputTextBoxTalon instanceof HTMLInputElement))
			throw new Error('Expected HTMLInputElement')
		expect(inputTextBoxTalon).toHaveValue('35')
		await waitFor(async () => {
			inputTextBoxTalon = screen.getByRole('textbox', {name: 'Talon'})
			await user.type(inputTextBoxTalon, '[Backspace][Backspace][Escape]')
			expect(inputTextBoxTalon).toHaveValue('50')
		}, {timeout: 5000})
	})

	// it('should keep settings in localStorage when closing app', async () => {
	// global.overwolf.games.launchers.getRunningLaunchersInfo = getRunningLaunchersInfo
	// // ↑ Put a client already running
	// global.overwolf.games.launchers.events.onInfoUpdates.addListener = onInfoUpdatesAddListener
	// // ↑ Enters in champ select
	// await act(() => {renderEntireApp2()})
	// const settingButton = screen.getByLabelText('settingsButton')
	// await user.click(settingButton)
	// ↑ Goes to settings
	// await waitFor(async () => {
	// }, {timeout: 5000})
	// })
	//TODO do a test about the reset button
	//TODO test about closing app and still have user setting
	//TODO test about update version but have CSWscore updated but not userScore
})