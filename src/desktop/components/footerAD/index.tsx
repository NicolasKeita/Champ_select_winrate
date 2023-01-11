/*
    Path + Filename: src/desktop/components/footerAD/myContextMenu.tsx
*/

import React, {useEffect, useRef} from 'react'
import replacementFooterADimg from '@public/img/ReplacementFooterAD.jpg'
import {kWindowNames} from '../../../consts'
import OwAdMocking from '../../../types/owads'

type PropsType = {
	windowName: string
}

function FooterAD(props: PropsType) {
	console.log('Footer Rendered')
	const adContainerRef = useRef<HTMLElement>(null)
	const adReplacementContainer = useRef<HTMLImageElement>(null)
	let adEnabled = false,
		updateWindowIsVisibleInterval: NodeJS.Timer | null = null,
		windowIsOpen = false,
		windowIsVisible = false,
		adInstance: OwAdMocking | null = null

	function setTab(tab) {
		document.querySelectorAll(`[data-tab]`).forEach(el => {
			// @ts-ignore
			if (el.dataset.tab === tab) {
				el.classList.add('active')
			} else {
				el.classList.remove('active')
			}
		})

		document.querySelectorAll(`.tab-content`).forEach(el => {
			// @ts-ignore
			el.hidden = Boolean(el.id !== tab)
		})
	}

	function registerListeners() {
		document.querySelectorAll('[data-tab]').forEach(el => {
			el.addEventListener('click', () => {
				// @ts-ignore
				setTab(el.dataset.tab)
			})
		})
	}

	function removeAd() {
		if (adInstance !== null)
			adInstance.removeAd()
	}

	function updateAd() {
		const shouldEnable = windowIsOpen && windowIsVisible
		if (adEnabled !== shouldEnable) {
			adEnabled = shouldEnable
			if (shouldEnable)
				createAd()
			else
				removeAd()
		}
	}

	function loadAdLib() {
		return new Promise((resolve, reject) => {
			const el = document.createElement('script')
			el.src = 'https://content.overwolf.com/libs/ads/latest/owads.min.js'
			el.async = true
			el.onload = resolve
			el.onerror = reject
			document.body.appendChild(el)
		}).catch(() => {
			console.error('CSW_error : couldn\'t connect to ' + 'https://content.overwolf.com/libs/ads/latest/owads.min.js' + '. Check your internet connection?')
			// adReplacementContainer.hidden = false
			// const adCont = document.getElementById('adContainer')
			// if (adCont) {
			// adCont.hidden = true
			// }
		})
	}

	async function createAd() {
		if (!window.OwAd) {
			await loadAdLib()
			if (!window.OwAd) {
				console.error('Couldn\'t load OwAd')
				return
			}
		}
		if (adInstance !== null) {
			adInstance.refreshAd(null)
			return
		}
		const adCont: HTMLElement | null = adContainerRef.current
		if (!adCont) {
			console.log('CSW_error: AdContainer not defined yet')
			return
		}
		try {
			// @ts-ignore
			adInstance = new OwAd(adCont, {
				size: {
					width: 400,
					height: 300
				}
			})
		} catch (e) {
			console.log('CSW_error: OwAd constructor exception caught')
			console.error(e)
			adInstance = null
		}
		if (adInstance) {
			window.OwAd = adInstance
			adInstance.addEventListener('player_loaded', () => {})
			adInstance.addEventListener('display_ad_loaded', () => {})
			adInstance.addEventListener('play', () => {})
			adInstance.addEventListener('impression', () => {})
			adInstance.addEventListener('complete', () => {})
			adInstance.addEventListener('ow_internal_rendered', () => {})
			adInstance.addEventListener('error', e => {
				console.log('CSW_error: OwAd instance error:')
				console.error(e)
				adCont.hidden = true
				if (adReplacementContainer.current)
					adReplacementContainer.current.hidden = false
				if (adInstance) {
					adInstance.removeAd()
				}
			})
		}
	}

	function onWindowStateChanged(state) {
		if (state && state.window_state_ex && state.window_name === kWindowNames.desktop) {
			const isOpen = state.window_state_ex === 'normal'
			if (windowIsOpen !== isOpen) {
				windowIsOpen = isOpen
				updateAd()
			}
		}
	}

	async function getWindowIsVisible() {
		const state = await new Promise(resolve => {
			overwolf.windows.isWindowVisibleToUser(resolve)
		})
		// @ts-ignore
		return state && state.success && state.visible !== 'hidden'
	}

	async function updateWindowIsVisible() {
		const isVisible = await getWindowIsVisible()

		if (windowIsVisible !== isVisible) {
			windowIsVisible = isVisible
			updateAd()
		}
	}

	async function getWindowIsOpen() {
		const state = await new Promise(resolve => {
			overwolf.windows.getWindowState(props.windowName, resolve)
		})
		// @ts-ignore
		if (state && state.success && state.window_state_ex) {
			// @ts-ignore
			return state.window_state_ex === 'normal'
		}
		return false
	}

	async function init() {
		registerListeners()
		overwolf.windows.onStateChanged.addListener(onWindowStateChanged)
		updateWindowIsVisibleInterval = setInterval(updateWindowIsVisible, 2000)
		windowIsOpen = await getWindowIsOpen()
		windowIsVisible = await getWindowIsVisible()
		updateAd()
	}

	useEffect(() => {
		init()
	})
	return (
		<>
			<footer
				ref={adContainerRef}
				style={{height: 400, width: 300}}
			/>
			<img
				ref={adReplacementContainer}
				hidden={true}
				src={replacementFooterADimg}
				alt={'replacementFooterADimg'}
				height={308}
			/>
		</>
	)
}

export default FooterAD
