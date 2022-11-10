/*
    Path + Filename: src/desktop/MyApp.tsx
*/

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Header from './components/header'
import Main from './components/main'
import Footer from './components/footer'
import {AppWindow} from '../AppWindow'

const MyAppContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

function MyApp(props) {
    let my_window = props.my_window
    return (
        <MyAppContainer>
            <Header my_window={my_window}/>
            <Main/>
            <Footer/>
        </MyAppContainer>
    )
}

MyApp.propTypes = {
    my_window: PropTypes.instanceOf(AppWindow)
}

export default MyApp