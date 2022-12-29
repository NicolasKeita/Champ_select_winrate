/*
    Path + Filename: __tests__/fetchTests.test.tsx
*/


import React from 'react'
import {
	act,
	waitFor,
	screen
} from '@testing-library/react'
import '@testing-library/jest-dom'
import fetch from 'jest-fetch-mock'

import allChamps from '../__testsUtils__/allChamps.json'
import {overwolfMocked} from '../__testsUtils__/OW_mocking'
import {renderEntireApp} from '../__testsUtils__/renderEntireApp'


describe('fetchTests', () => {
	beforeEach(() => {
		localStorage.clear()
		sessionStorage.clear()
		global.overwolf = overwolfMocked
	})
	afterEach(() => {
		jest.restoreAllMocks()
	})
	fetch.enableMocks()
	jest.useFakeTimers()

	test('fetchVersionFail', async () => {
		fetch.mockResponse(req => {
			if (req.url === 'https://4nuo1ouibd.execute-api.eu-west-3.amazonaws.com/csw_api_proxy/allchamps')
				return Promise.resolve(JSON.stringify(allChamps))
			else if (req.url === 'https://4nuo1ouibd.execute-api.eu-west-3.amazonaws.com/csw_api_proxy/cswgameversion')
				return Promise.reject(new Error('CSW_tests: fetch version failed'))
			else
				return Promise.reject(new Error('URL is not handled by Jest tests'))
		})

		const logErrSpy = jest.spyOn(console, 'error')
		await act(() => {renderEntireApp()})
		jest.runAllTimers()
		await waitFor(() =>
				expect(logErrSpy).toHaveBeenCalled()
			, {timeout: 1000 * 60})
	})
})