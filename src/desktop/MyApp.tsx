/*
    Path + Filename: src/desktop/MyApp.tsx
*/

import React from 'react'
import PropTypes from 'prop-types'

import Header from './components/header'
import Main from './components/main'
import {AppWindow} from '../AppWindow'

function MyApp(props) {
    let my_window = props.my_window
    return (
        <div>
            <Header my_window={my_window}/>
            <Main/>
        </div>
    )
}

MyApp.propTypes = {
    my_window: PropTypes.instanceOf(AppWindow)
}

export default MyApp