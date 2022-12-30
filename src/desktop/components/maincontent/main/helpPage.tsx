/*
    Path + Filename: src/desktop/components/maincontent/main/helpPage.tsx
*/

import React from 'react'
import ImageGallery from 'react-image-gallery'
import help1 from '@public/img/Help1.jpg'
import help2 from '@public/img/Help2.png'
import {Splide, SplideSlide} from '@splidejs/react-splide'

// Default theme
import '@splidejs/react-splide/css'
import '@public/css/splide/arrows.css'

// or other themes
// import '@splidejs/react-splide/css/skyblue'
// import '@splidejs/react-splide/css/sea-green'

// or only core styles
// import '@splidejs/react-splide/css/core'

function HelpPage() {

	return (
		<div style={{display: 'flex', height: 432, width: 400}}>
			<Splide
				options={{
					classes: {
						next: 'splide__arrow--next your-class-next',
						pagination: 'splide__pagination your-class-pagination'
					},
					type: 'loop',
					height: 424,
					width: 400
				}}
				aria-label='React Splide Example'>
				<SplideSlide>
					<img src={help1} alt='Image1' />
				</SplideSlide>
				<SplideSlide>
					<img src={help2} alt='Image 2' />
				</SplideSlide>
			</Splide>

		</div>
	)
}

export default HelpPage