/*
    Path + Filename: src/desktop/components/footerAD/replacement.tsx
*/

import React from 'react'
import styled from 'styled-components'
import replacementFooterADimg from '@public/img/ReplacementFooterAD.jpg'

const ReplacementFooterADContainer = styled.div`
  height: 300px;
  width: 400px;
`

function ReplacementFooterAD() {
	return (
		<ReplacementFooterADContainer>
			<img src={replacementFooterADimg} alt={'replacementFooterADimg'} />
		</ReplacementFooterADContainer>
	)
}

export default ReplacementFooterAD