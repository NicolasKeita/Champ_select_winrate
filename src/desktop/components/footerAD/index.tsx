// @ts-nocheck

/*
    Path + Filename: src/desktop/components/footerAD/myContextMenu.tsx
*/

import React, {useEffect} from 'react'
import styled from 'styled-components'

const FooterContainer = styled.footer`
  flex: 1;
`

const ADcontainer = styled.img``

function FooterAD() {
	const kWindowName = 'desktop'
	let adEnabled = false,
		updateWindowIsVisibleInterval = null,
		windowIsOpen = false,
		windowIsVisible = false,
		adInstance = null

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
			if (shouldEnable) createAd()
			else removeAd()
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
			adInstance.refreshAd()
			return
		}
		const adCont = document.getElementById('adContainer')
		adInstance = new window.OwAd(adCont, {
			size: {
				width: 400,
				height: 300
			}
		})
		adInstance.addEventListener('player_loaded', () => {})
		adInstance.addEventListener('display_ad_loaded', () => {})
		adInstance.addEventListener('play', () => {})
		adInstance.addEventListener('impression', () => {})
		adInstance.addEventListener('complete', () => {})
		adInstance.addEventListener('ow_internal_rendered', () => {})
		adInstance.addEventListener('error', e => {
			console.log('OwAd instance error:')
			console.error(e)
		})
	}

	function onWindowStateChanged(state) {
		if (state && state.window_state_ex && state.window_name === kWindowName) {
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
			overwolf.windows.getWindowState(kWindowName, resolve)
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

	useEffect(() => {
		localStorage.owAdsForceAdUnit = 'Ad_test'
		init()
	}, [])
	return <FooterContainer id={'adContainer'}></FooterContainer>
}

export default FooterAD
