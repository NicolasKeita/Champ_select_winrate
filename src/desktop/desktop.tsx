import { AppWindow } from '../AppWindow'
import { kWindowNames } from '../consts'
import React from 'react'
import ReactDOM from 'react-dom/client'
import MyApp from './MyApp'

import '@public/css/desktop.css'
import {IsSettingsProvider} from './utils/context'

// The desktop window is the window displayed while game is not running.
// In our case, our desktop window has no logic - it only displays static data.
// Therefore, only the generic AppWindow class is called.
const my_window = new AppWindow(kWindowNames.desktop)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
//   <React.StrictMode>
    <IsSettingsProvider>
        <MyApp my_window={my_window}/>
    </IsSettingsProvider>
//   </React.StrictMode>
)