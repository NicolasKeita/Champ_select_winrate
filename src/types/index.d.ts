import {BackgroundController} from './src/background/background'
import {store} from '../background/store/store'

declare global {
	interface Window {
		backgroundControllerInstance?: BackgroundController
		settingsStore?: typeof store
		desktopStore?: typeof store
		OwAd?: OwAd
	}
}