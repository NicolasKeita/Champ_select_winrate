/*
    Path + Filename: src/desktop/components/footer/myContextMenu.tsx
*/

import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import PlayerProfile from '@utils/playerProfile'
import FooterText from '@utils/FooterText'

const FooterContainer = styled.footer`
  background: linear-gradient(to right, rgb(63, 62, 62), #363636, #323232);
  flex: 0;
  display: flex;
  justify-content: center;
  padding: 4px 0 4px 0;
`
const FooterTextStyle = styled.h1`
  background: -webkit-linear-gradient(#e8730e, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const footerText = new FooterText()

function Footer(props) {
    const playerProfile = props.playerProfile

    const [setMessage] = useChangeMessage()

    //TODO: Maybe change position of this code ?
    function useChangeMessage() {
        const [, setMessage_internal] = useState(footerText.message)
        function setMessage(msg) {
            footerText.message = msg
            setMessage_internal(msg)
        }
        return [setMessage]
    }

    useEffect (() => {
        if (playerProfile.clientStatus === 0)
            setMessage('League client is not open.')
        if (playerProfile.clientStatus === 1)
            setMessage('You are not in champ select.')
        if (playerProfile.clientStatus === 2)
            setMessage('')
    }, [playerProfile, playerProfile.clientStatus]) // TODO add setMessage to deps array
    return (
        <FooterContainer>
            <FooterTextStyle>{footerText.message}</FooterTextStyle>
        </FooterContainer>
    )
}

Footer.propTypes = {
    playerProfile: PropTypes.instanceOf(PlayerProfile),
}

export default Footer
