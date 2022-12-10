/*
    Path + Filename: src/desktop/desktop.test.tsx
*/

import React from 'react'
// import {Provider} from 'react-redux'
// import MyApp from './MyApp'
import {AppWindow} from '../AppWindow'
import {kWindowNames} from '../consts'
// import {store} from '@utils/store/store'
import '@testing-library/jest-dom'

const myWindow = new AppWindow(kWindowNames.desktop)

import { render, screen } from '@testing-library/react';

test('renders learn react link', () => {
  render(
    <div>hello world</div>
  );
  const linkElement = screen.getByText(/hello world/i);
  expect(linkElement).toBeInTheDocument();
});