/*
    Path + Filename: src/desktop/components/footerAD/myContextMenu.tsx
*/

import React, {useEffect, useReducer, useRef} from 'react'
import replacementFooterADimg from '@public/img/ReplacementFooterAD.jpg'
import ReplacementFooterAD from './replacement'
import {kWindowNames} from '../../../consts'
import {OwAd} from '@overwolf/types/owads'

let g_errorAD = 0

//TODO there is a TS no check at the top of the file
function FooterAD() {
	console.log('Footer Rendered')
	const adContainerRef = useRef<HTMLElement>(null)
	const adReplacementContainer = useRef(null)
	const [_, forceUpdate] = useReducer(x => x + 1, 0)
	let adEnabled = false,
		updateWindowIsVisibleInterval = null,
		windowIsOpen = false,
		windowIsVisible = false,
		adInstance: OwAd | null = null

	function setTab(tab) {
		document.querySelectorAll(`[data-tab]`).forEach(el => {
			if (el.dataset.tab === tab) {
				el.classList.add('active')
			} else {
				el.classList.remove('active')
			}
		})

		document.querySelectorAll(`.tab-content`).forEach(el => {
			el.hidden = Boolean(el.id !== tab)
		})
	}

	function registerListeners() {
		document.querySelectorAll('[data-tab]').forEach(el => {
			el.addEventListener('click', () => {
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
			adReplacementContainer.hidden = false
			const adCont = document.getElementById('adContainer')
			if (adCont) {
				adCont.hidden = true
			}
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
		const adCont = adContainerRef.current
		if (!adCont) {
			console.log('CSW_error: AdContainer not defined yet')
			return
		}
		adInstance = new OwAd(adCont, {
			size: {
				width: 400,
				height: 300
			}
		})
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
			g_errorAD += 1
			if (adInstance) {
				adInstance.removeAd()
				// forceUpdate()
				if (g_errorAD > 3) {
					// adReplacementContainer.hidden = false
					if (adContainerRef.current) {
						// adContainerRef.current.hidden = true
					}
				}
			}
		})
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
			overwolf.windows.getWindowState(kWindowNames.desktop, resolve)
		})
		if (state && state.success && state.window_state_ex) {
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

	// if (g_errorAD > 3) {
	// 	adReplacementContainer.hidden = false
	// 	const adCont = document.getElementById('adContainer')
	// 	if (adCont) {
	// 		adCont.hidden = true
	// 	}
	// } else {
	// 	adReplacementContainer.hidden = true
	// }
	useEffect(() => {
		init()
	})
	return (
		<footer
			ref={adContainerRef}
			style={{height: 400, width: 300}}
		/>
		// {/*<img*/}
		// {/*	ref={adReplacementContainer}*/}
		// {/*	src={replacementFooterADimg}*/}
		// {/*	alt={'replacementFooterADimg'}*/}
		// {/*	height={308}*/}
		// {/*/>*/}
	)
}

export default FooterAD
