import {BackgroundController} from './src/background/background'

declare global {
	interface Window {
		backgroundControllerInstance: BackgroundController
	}
}