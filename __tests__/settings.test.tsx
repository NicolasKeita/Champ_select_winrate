/*
    Path + Filename: __tests__/settings.test.tsx
*/


import userEvent from '@testing-library/user-event'
import {
	getRunningLaunchersInfo, onInfoUpdatesAddListener,
	overwolfMocked
} from '../__testsUtils__/OW_mocking'
import {act, render, screen} from '@testing-library/react'
import {renderEntireApp} from '../__testsUtils__/renderEntireApp'
import fetch from 'jest-fetch-mock'
import allChamps from '../__testsUtils__/allChamps.json'
import {configTest} from '../__testsUtils__/configTest'
import '@testing-library/jest-dom'

describe('settings', () => {
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

	test('should settings', async () => {
		localStorage.clear()
		sessionStorage.clear()
		const user = userEvent.setup()
		global.overwolf = overwolfMocked
		global.overwolf.games.launchers.getRunningLaunchersInfo = getRunningLaunchersInfo
		// ↑ Put a client already running
		await act(() => { render(renderEntireApp())})

		const config = localStorage.getItem('config')
		expect(config).toBe(configTest)

		global.overwolf.games.launchers.events.onInfoUpdates.addListener = onInfoUpdatesAddListener

		// ↑ Enters in champ select

		const settingButton = screen.getByTestId('settingsButton')
		await user.click(settingButton)
		// ↑ Goes to settings
		let inputTextBoxAatrox = screen.getByRole('textbox', {name: 'Aatrox'})
		if (!(inputTextBoxAatrox instanceof HTMLInputElement))
			throw new Error('Expected HTMLInputElement')
		expect(inputTextBoxAatrox).toHaveValue('69')
		await user.clear(inputTextBoxAatrox)
		await user.type(inputTextBoxAatrox, '[Escape]')
		expect(inputTextBoxAatrox).toHaveValue('50')
		await user.clear(inputTextBoxAatrox)
		await user.type(inputTextBoxAatrox, '99')
		// ↑ set Aatrox user_score to 99
		expect(inputTextBoxAatrox).toHaveValue('99')
		await user.dblClick(settingButton)
		inputTextBoxAatrox = screen.getByRole('textbox', {name: 'Aatrox'})
		expect(inputTextBoxAatrox).toHaveValue('99')
	})
})