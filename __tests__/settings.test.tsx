/*
    Path + Filename: __tests__/settings.test.tsx
*/


import userEvent from '@testing-library/user-event'
import {
	getRunningLaunchersInfo, onInfoUpdatesAddListener,
	overwolfMocked, talonCSWScore
} from '../__testsUtils__/OW_mocking'
import {act, screen, waitFor} from '@testing-library/react'
import {renderEntireApp} from '../__testsUtils__/renderEntireApp'
import fetch from 'jest-fetch-mock'
import allChamps from '../__testsUtils__/allChamps.json'
import {configTest} from '../__testsUtils__/configTest'
import '@testing-library/jest-dom'
import {UserEvent} from '@testing-library/user-event/setup/setup'

describe('settings', () => {
	let user: UserEvent
	beforeEach(() => {
		sessionStorage.clear()
		global.overwolf = overwolfMocked
		user = userEvent.setup({
			// delay: null,
		})
	})
	//TODO try waitForelementtoBeRemoved for context menu resset settings
	// jest.useFakeTimers()
	jest.useRealTimers()
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

	it('should update immediately user score when user changes it', async () => {
		localStorage.clear()
		global.overwolf.games.launchers.getRunningLaunchersInfo = getRunningLaunchersInfo
		// ↑ Put a client already running
		global.overwolf.games.launchers.events.onInfoUpdates.addListener = onInfoUpdatesAddListener
		// ↑ Enters in champ select
		await act(() => { renderEntireApp()})
		// await act(() => { jest.advanceTimersByTime(10000) })
		expect(localStorage.getItem('config')).toBe(configTest)
		await waitFor(() => {
			const TalonElem = screen.getAllByText(/Talon/i)
			expect(TalonElem).toBeDefined()
			if (TalonElem.length && TalonElem.length >= 1) {
				const talonTile = TalonElem[0].parentElement
				expect(talonTile).toContainHTML(`${talonCSWScore}`)
			}
		}, {timeout: 5000})
		const settingButton = screen.getByLabelText('settingsButton')
		await user.click(settingButton)
		// ↑ Goes to settings
		let inputTextBoxTalon = screen.getByRole('textbox', {name: 'Talon'})
		if (!(inputTextBoxTalon instanceof HTMLInputElement))
			throw new Error('Expected HTMLInputElement')
		expect(inputTextBoxTalon).toHaveValue(`${talonCSWScore}`)
		await user.type(inputTextBoxTalon, '[Backspace][Backspace]99')
		// ↑ Puts 99 to talon score
		expect(inputTextBoxTalon).toHaveValue('99')
		await user.click(settingButton)
		// ↑ goes back to champSelect & see if Talon has 99 as score
		let TalonElem = screen.getAllByText(/Talon/i)
		expect(TalonElem).toBeDefined()
		if (TalonElem.length && TalonElem.length >= 1) {
			const talonTile = TalonElem[0].parentElement
			expect(talonTile).toContainHTML('99')
		}
		await user.click(settingButton)
		// ↑ goes back to settings and check if talon still has 99 as score
		inputTextBoxTalon = screen.getByRole('textbox', {name: 'Talon'})
		expect(inputTextBoxTalon).toHaveValue('99')

		await user.click(settingButton)
		// ↑ goes back to champSelect & see if Talon has 99 as score
		TalonElem = screen.getAllByText(/Talon/i)
		expect(TalonElem).toBeDefined()
		if (TalonElem.length && TalonElem.length >= 1) {
			const talonTile = TalonElem[0].parentElement
			expect(talonTile).toContainHTML('99')
		}
	})
	it('should appear default 50 when removing user score completely', async () => {
		localStorage.clear()
		user = userEvent.setup({delay: null})
		await act(() => {renderEntireApp()})
		// await act(() => { jest.advanceTimersByTime(10000) })
		const settingButton = screen.getByLabelText('settingsButton')
		await user.click(settingButton)
		// ↑ Goes to settings
		let inputTextBoxTalon = screen.getByRole('textbox', {name: 'Talon'})
		if (!(inputTextBoxTalon instanceof HTMLInputElement))
			throw new Error('Expected HTMLInputElement')
		expect(inputTextBoxTalon).toHaveValue(`${talonCSWScore}`)
		await waitFor(async () => {
			inputTextBoxTalon = screen.getByRole('textbox', {name: 'Talon'})
			await user.type(inputTextBoxTalon, '[Backspace][Backspace][Escape]')
			expect(inputTextBoxTalon).toHaveValue('50')
		}, {timeout: 5000})
	})
})


describe('settingsExtra', () => {
	let user: UserEvent
	beforeEach(() => {
		global.overwolf = overwolfMocked
		user = userEvent.setup({
			// delay: null,
		})
		sessionStorage.clear()
	})
	// jest.useFakeTimers()
	jest.useRealTimers()
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

	it('should keep settings in localStorage when closing app', async () => {
		localStorage.clear()
		await act(() => {renderEntireApp()})
		// await act(() => { jest.advanceTimersByTime(10000) })
		const settingButton = screen.getByLabelText('settingsButton')
		await user.click(settingButton)
		// ↑ Goes to settings
		let inputTextBoxTalon = screen.getByRole('textbox', {name: 'Talon'})
		if (!(inputTextBoxTalon instanceof HTMLInputElement))
			throw new Error('Expected HTMLInputElement')
		expect(inputTextBoxTalon).toHaveValue(`${talonCSWScore}`)
		await user.type(inputTextBoxTalon, '[Backspace][Backspace]99')
		expect(inputTextBoxTalon).toHaveValue('99')
		const shutdownAppButton = screen.getByLabelText('shutdownAppButton')
		await user.click(shutdownAppButton)
	})

	it('should keep settings in localStorage when closing app2', async () => {
		//notice localstorage is not cleared
		await act(() => {renderEntireApp()})
		// await act(() => { jest.advanceTimersByTime(10000) })
		expect(screen.getByText('CSW OP Score'))
		// ↑ Goes to settings
		await waitFor(async () => {
			let inputTextBoxTalon = screen.getByRole('textbox', {name: 'Talon'})
			if (!(inputTextBoxTalon instanceof HTMLInputElement))
				throw new Error('Expected HTMLInputElement')
			expect(inputTextBoxTalon).toHaveValue('99')
		}, {timeout: 5000})
	})
})