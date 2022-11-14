/*
    Path + Filename: src/desktop/components/footer/index.tsx
*/

import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import PlayerProfile from '@utils/playerProfile'

const FooterContainer = styled.footer`
  background: #8d8d8d;
  flex: 0;
  padding-left: 7px;
`

function Footer(props) {
    const [message, setMessage] = useState('You\'re not in champion select.')
    const playerProfile = props.playerProfile

    useEffect(() => {
        if (playerProfile.isClientClosed()) {
            setMessage('League client is not open.')
        }
        else if (!playerProfile.isClientInChampSelect()) {
            setMessage('You are not in champ select.')
        } else {
            setMessage('')
        }
    },[playerProfile, playerProfile.clientStatus])
    return (
        <FooterContainer>
            <h1>{message}</h1>
        </FooterContainer>
    )
}

Footer.propTypes = {
    playerProfile: PropTypes.instanceOf(PlayerProfile),
}

export default Footer
