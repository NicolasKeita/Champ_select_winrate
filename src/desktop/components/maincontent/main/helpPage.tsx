/*
    Path + Filename: src/desktop/components/maincontent/main/helpPage.tsx
*/

import React from 'react'
import help1 from '@public/img/Help1.jpg'
import help2 from '@public/img/Help2.jpg'
import help3 from '@public/img/Help3.jpg'
import help4 from '@public/img/Help4.jpg'
import {Splide, SplideSlide} from '@splidejs/react-splide'

import css from '@public/css/splide/splide.min.css'
import css2 from '@public/css/splide/customCss.css'

function HelpPage() {
	return (
		<div
			style={{display: 'flex', height: 432, width: 400}}>
			<Splide
				options={{
					classes: {
						next: 'splide__arrow--next your-class-next'
					},
					height: 424,
					width: 400,
					lazyLoad: true,
					preloadPages: 1
				}}

				aria-label='React Splide Example'>
				<SplideSlide>
					<img src={help1} alt='Image1' />
				</SplideSlide>
				<SplideSlide>
					<img src={help2} alt='Image2' />
				</SplideSlide>
				<SplideSlide>
					<img src={help3} alt='Image3' />
				</SplideSlide>
				<SplideSlide>
					<img src={help4} alt='Image4' />
				</SplideSlide>
			</Splide>

		</div>
	)
}

export default HelpPage