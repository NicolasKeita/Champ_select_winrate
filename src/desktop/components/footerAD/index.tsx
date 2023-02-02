/*
    Path + Filename: src/desktop/components/footerAD/myContextMenu.tsx
*/

import React, {useEffect, useRef} from 'react'
import replacementFooterADimg from '@public/img/ReplacementFooterAD.jpg'
import OwAdMocking from '../../../types/owads'
import WindowStateEx = overwolf.windows.enums.WindowStateEx

type PropsType = {
	windowName: string
}

function FooterAD(props: PropsType) {
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
			const el: HTMLScriptElement = document.createElement('script')
			el.src = 'https://content.overwolf.com/libs/ads/latest/owads.min.js'
			el.async = true
			el.onload = resolve
			el.onerror = reject
			document.body.appendChild(el)
		}).catch(() => {
			console.error('CSW_error : couldn\'t connect to ' + 'https://content.overwolf.com/libs/ads/latest/owads.min.js' + '. Check your internet connection?')
			hideAdContainer(adContainerRef.current, adReplacementContainer.current)
		})
	}

	async function createAd() {
		if (!window.OwAd) {
			await loadAdLib()
			if (!window.OwAd) {
				console.error('CSW_Error: Couldn\'t load OwAd')
				return
			}
		}
		const adCont: HTMLElement | null = adContainerRef.current
		if (!adCont) {
			console.log('CSW_error: AdContainer not defined yet')
			return
		}
		if (adInstance !== null) {
			adInstance.refreshAd(null)
			return
		}
		try {
			// @ts-ignore
			hideAdReplacementContainer(adCont, adReplacementContainer.current)
			adInstance = new window.OwAd(adCont, {
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
			// hideAdReplacementContainer(adCont, adReplacementContainer.current)
			// window.OwAd = adInstance
			adInstance.addEventListener('player_loaded', () => {
			})
			adInstance.addEventListener('display_ad_loaded', () => {
			})
			adInstance.addEventListener('play', () => {
			})
			adInstance.addEventListener('impression', () => {
			})
			adInstance.addEventListener('complete', () => {})
			adInstance.addEventListener('ow_internal_rendered', () => {
			})
			adInstance.addEventListener('error', e => {
				console.log('CSW_error: OwAd instance error:')
				console.error(e)
				hideAdContainer(adCont, adReplacementContainer.current)
				if (adInstance) {
					adInstance.removeAd()
				}
			})
		}
	}

	function hideAdContainer(adContainer, adReplacementContainer) {
		if (adContainer)
			adContainer.hidden = true
		if (adReplacementContainer)
			adReplacementContainer.hidden = false
	}

	function hideAdReplacementContainer(adContainer, adReplacementContainer) {
		if (adContainer)
			adContainer.hidden = false
		if (adReplacementContainer)
			adReplacementContainer.hidden = true
	}

	function onWindowStateChanged(state: overwolf.windows.WindowStateChangedEvent) {
		if (state && state.window_state_ex && state.window_name === props.windowName) {
			const isOpen = state.window_state_ex === WindowStateEx.NORMAL
			if (windowIsOpen !== isOpen) {
				windowIsOpen = isOpen
				updateAd()
			}
		}
	}

	async function getWindowIsVisible() {
		const state: overwolf.windows.IsWindowVisibleToUserResult = await new Promise(resolve => {
			overwolf.windows.isWindowVisibleToUser(resolve)
		})
		return state && state.success && state.visible !== WindowStateEx.HIDDEN
	}

	async function updateWindowIsVisible() {
		const isVisible = await getWindowIsVisible()

		if (windowIsVisible !== isVisible) {
			windowIsVisible = isVisible
			updateAd()
		}
	}

	async function getWindowIsOpen() {
		const state: overwolf.windows.GetWindowStateResult = await new Promise(resolve => {
			overwolf.windows.getWindowState(props.windowName, resolve)
		})
		if (state && state.success && state.window_state_ex) {
			return state.window_state_ex === WindowStateEx.NORMAL
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
				hidden={true}
			/>
			<img
				ref={adReplacementContainer}
				hidden={false}
				src={replacementFooterADimg}
				alt={'replacementFooterADimg'}
				height={308}
			/>
		</>
	)
}

export default FooterAD
