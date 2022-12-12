/*
    Path + Filename: src/desktop/desktop.test.tsx
*/

import React from 'react'
// import {Provider} from 'react-redux'
// import MyApp from './MyApp'
import {AppWindow} from '../AppWindow'
import {kWindowNames} from '../consts'
import '@testing-library/jest-dom'

const myWindow = new AppWindow(kWindowNames.desktop)

import {render} from '@testing-library/react'
import {Provider} from 'react-redux'
import {store} from '@utils/store/store'
import MyApp from './MyApp'


test('renders learn react link', () => {
	render(
		// <div>hello world</div>
		<Provider store={store}>
			<MyApp my_window={myWindow} />
		</Provider>
	)
	// const linkElement = screen.getByText(/hello world/i);
	// expect(linkElement).toBeInTheDocument();
})