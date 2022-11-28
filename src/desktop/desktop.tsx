import {AppWindow} from '../AppWindow'
import {kWindowNames} from '../consts'
import React from 'react'
import ReactDOM from 'react-dom/client'
import MyApp from './MyApp'
import FooterAD from './components/footerAD'

import '@public/css/desktop.css'
import {SettingsProvider} from '@utils/context'

// The desktop window is the window displayed while game is not running.
// In our case, our desktop window has no logic - it only displays static data.
// Therefore, only the generic AppWindow class is called.
const my_window = new AppWindow(kWindowNames.desktop)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <SettingsProvider>
            <div id={'myApp+FooterAD'} style={{display: 'flex', flex: '1', flexDirection: 'column'}}>
                <MyApp my_window={my_window} />
                <FooterAD />
            </div>
        </SettingsProvider>
    </React.StrictMode>
)
