/*
    Path + Filename: __tests__/settings.test.tsx
*/


import userEvent from '@testing-library/user-event'
import {
	getRunningLaunchersInfo, onInfoUpdatesAddListener,
	overwolfMocked
} from '../__testsUtils__/OW_mocking'
import {act, render, screen, waitFor} from '@testing-library/react'
import {renderEntireApp} from '../__testsUtils__/renderEntireApp'
import fetch from 'jest-fetch-mock'
import allChamps from '../__testsUtils__/allChamps.json'
import {configTest} from '../__testsUtils__/configTest'
import '@testing-library/jest-dom'
import * as fetchDataDragon
	from '../src/desktop/utils/fetchDataDragon/fetchDataDragon'
import {
	getChampImg,
	getChampName
} from '../src/desktop/utils/fetchDataDragon/fetchDataDragon'


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
	jest.spyOn(fetchDataDragon, 'getChampName').mockResolvedValue('Talon')
	jest.spyOn(fetchDataDragon, 'getChampImg').mockResolvedValue('https://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/Talon.png')
	jest.spyOn(fetchDataDragon, 'getChampSquareAsset').mockResolvedValue('https://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/Talon.png')

	test('should update immediately user score when user changes it', async () => {
		localStorage.clear()
		sessionStorage.clear()
		const user = userEvent.setup()
		global.overwolf = overwolfMocked
		global.overwolf.games.launchers.getRunningLaunchersInfo = getRunningLaunchersInfo
		// ↑ Put a client already running
		global.overwolf.games.launchers.events.onInfoUpdates.addListener = onInfoUpdatesAddListener
		// ↑ Enters in champ select
		await act(() => { render(renderEntireApp())})
		expect(localStorage.getItem('config')).toBe(configTest)
		await waitFor(() => {
			const TalonElem = screen.getAllByText(/Talon/i)
			expect(TalonElem).toBeDefined()
			if (TalonElem.length && TalonElem.length >= 1) {
				const talonTile = TalonElem[0].parentElement
				expect(talonTile).toContainHTML('35')
			}
		}, {timeout: 3000})
		const settingButton = screen.getByTestId('settingsButton')
		await user.click(settingButton)
		// ↑ Goes to settings
		let inputTextBoxAatrox = screen.getByRole('textbox', {name: 'Talon'})
		if (!(inputTextBoxAatrox instanceof HTMLInputElement))
			throw new Error('Expected HTMLInputElement')
		expect(inputTextBoxAatrox).toHaveValue('35')
		await user.clear(inputTextBoxAatrox)
		await user.type(inputTextBoxAatrox, '[Escape]')
		expect(inputTextBoxAatrox).toHaveValue('50')
		await user.clear(inputTextBoxAatrox)
		await user.type(inputTextBoxAatrox, '99')
		// ↑ set Talon user_score to 99
		expect(inputTextBoxAatrox).toHaveValue('99')
		await user.click(settingButton)
		const TalonElem = screen.getAllByText(/Talon/i)
		expect(TalonElem).toBeDefined()
		if (TalonElem.length && TalonElem.length >= 1) {
			const talonTile = TalonElem[0].parentElement
			expect(talonTile).toContainHTML('99')
		}
		await user.click(settingButton)
		inputTextBoxAatrox = screen.getByRole('textbox', {name: 'Talon'})
		expect(inputTextBoxAatrox).toHaveValue('99')
	})
})