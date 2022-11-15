/*
    Path + Filename: src/desktop/components/footer/index.tsx
*/

import React, {useCallback, useEffect, useState} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import PlayerProfile from '@utils/playerProfile'
import FooterText from '@utils/FooterText'

const FooterContainer = styled.footer`
  background: #8d8d8d;
  flex: 0;
  padding-left: 7px;
`

const footerText = new FooterText()

function Footer(props) {
//    const footerText = new FooterText()
    console.log('Footer rendered')
    //const [message, setMessage] = useState(footerText.message)
    //let message2 = ''
    const playerProfile = props.playerProfile

    // useEffect(() => {
    //  let playerProfile = new Proxy(playerProfile2, {
    //     set: function (target, key, value) {
    //         console.log(` tttttttttttttttttttt (${String(key)}) set to ${value}`)
    //         setMessage(value)
    //         target[key] = value
    //         return true
    //     }
    // })
    // }, [])

    const [setMessage] = useChangeMessage()

    //TODO: Maybe change position of this code ?
    function useChangeMessage() {
        const [, setMessage1] = useState(footerText.message)
        function setMessage(msg) {
            footerText.message = msg
            setMessage1(msg)
        }
        return (
            [
                setMessage
            ] as const
        )
    }

     // setInterval(() =>{
     //     console.log(" x = " + x)
     //     setX(x + 1)
     // }, 5000)


    console.log("text isi " + footerText.message)
    useEffect (() => {
        console.log('Entering in UseEffect:')
        if (playerProfile.clientStatus === 0)
            setMessage('League client is not open.')
        if (playerProfile.clientStatus === 1)
            setMessage('You are not in champ select.')
        if (playerProfile.clientStatus === 2)
            setMessage('')
        console.log('playerProfile ClientStatus is : ' + playerProfile.clientStatus)
        console.log('msg : ' + footerText.message)
        //
        // if (playerProfile.isClientClosed()) {
        //     setMessage('League client is not open.')
        //     setX(x + 1)
        // }
        // else if (!playerProfile.isClientInChampSelect()) {
        //     setMessage('You are not in champ select.')
        //     setX(x + 1)
        // } else {
        //     setMessage('')
        //     setX(x + 1)
        // }
    }, [playerProfile, playerProfile.clientStatus])
    return (
        <FooterContainer>
            <h1>{footerText.message}</h1>
        </FooterContainer>
    )
}

Footer.propTypes = {
    playerProfile: PropTypes.instanceOf(PlayerProfile),
}

export default Footer
