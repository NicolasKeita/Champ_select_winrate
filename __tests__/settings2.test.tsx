/*
    Path + Filename: __tests__/settings2.test.tsx
*/

import {overwolfMocked, talonCSWScore} from '../__testsUtils__/OW_mocking'
import userEvent from '@testing-library/user-event'
import fetch from 'jest-fetch-mock'
import {act, screen, waitFor} from '@testing-library/react'
import {renderEntireApp} from '../__testsUtils__/renderEntireApp'
import allChamps from '../__testsUtils__/allChamps.json'
import '@testing-library/jest-dom'

describe('settingsExtra', () => {
	beforeEach(() => {
		global.overwolf = overwolfMocked
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

		let user = userEvent.setup()
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
		let user = userEvent.setup()
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
