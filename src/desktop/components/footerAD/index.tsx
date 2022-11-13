/*
    Path + Filename: src/desktop/components/footerAD/index.tsx
*/

import React from 'react'
import styled from 'styled-components'

import AD_img from '@public/img/ad_fake_pic.png'

const FooterContainer = styled.footer`
  background: white;
  //background: black;
  flex: 1;
`

const ADcontainer = styled.img`
    
`

function FooterAD() {
    return (
        <FooterContainer>
            <ADcontainer src={AD_img} alt={'ads'}/>
        </FooterContainer>
    )
}

export default FooterAD