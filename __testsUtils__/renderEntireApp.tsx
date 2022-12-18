import {ChakraProvider} from '@chakra-ui/react'
import {Provider} from 'react-redux'
import React, {PropsWithChildren} from 'react'
import {slice, store} from '../src/desktop/utils/store/store'
import MyApp from '../src/desktop/MyApp'
import {AppWindow} from '../src/AppWindow'
import {kWindowNames} from '../src/consts'

const myWindow = new AppWindow(kWindowNames.desktop)

export function renderEntireApp(): JSX.Element {
	return (
		<ChakraProvider>
			<Provider store={store}>
				<MyApp my_window={myWindow} />
			</Provider>
		</ChakraProvider>
	)
}

export function renderEntireApp2() {
	renderWithProviders(
		<ChakraProvider>
			<MyApp my_window={myWindow} />
		</ChakraProvider>
	)
}

import {render} from '@testing-library/react'
import type {RenderOptions} from '@testing-library/react'
import {configureStore} from '@reduxjs/toolkit'
import type {PreloadedState} from '@reduxjs/toolkit'

// import type {AppStore, RootState} from '../app/store'
import {store as AppStore, RootState} from '../src/desktop/utils/store/store'
// As a basic setup, import your same slice reducers

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
	store?: typeof AppStore
}

export function renderWithProviders(
	ui: React.ReactElement,
	{
		// Automatically create a store instance if no store was passed in
		store = configureStore({reducer: {slice: slice.reducer}}),
		...renderOptions
	}: ExtendedRenderOptions = {}
) {
	function Wrapper({children}: PropsWithChildren<{}>): JSX.Element {
		return <Provider store={store}>{children}</Provider>
	}

	// Return an object with the store and all of RTL's query functions
	return {store, ...render(ui, {wrapper: Wrapper, ...renderOptions})}
}
