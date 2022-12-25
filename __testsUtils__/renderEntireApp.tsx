import {Provider} from 'react-redux'
import React, {PropsWithChildren} from 'react'
import {slice} from '../src/desktop/utils/store/store'
import MyApp from '../src/desktop/MyApp'
import {AppWindow} from '../src/AppWindow'
import {kWindowNames} from '../src/consts'
import {render} from '@testing-library/react'
import type {RenderOptions} from '@testing-library/react'
import {configureStore} from '@reduxjs/toolkit'

import {store as AppStore} from '../src/desktop/utils/store/store'
import {copy} from 'copy-anything'

const myWindow = new AppWindow(kWindowNames.desktop)

export function renderEntireApp() {
	renderWithProviders(<MyApp my_window={copy(myWindow)} />)
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
	store?: typeof AppStore
}

export function renderWithProviders(
	ui: React.ReactElement,
	{
		store = configureStore({reducer: {slice: slice.reducer}}),
		...renderOptions
	}: ExtendedRenderOptions = {}
) {
	function Wrapper({children}: PropsWithChildren<{}>): JSX.Element {
		return <Provider store={store}>{children}</Provider>
	}

	return {store, ...render(ui, {wrapper: Wrapper, ...renderOptions})}
}
