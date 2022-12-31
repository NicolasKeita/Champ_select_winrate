import {BackgroundController} from './src/background/background'
import {StoreType} from '@utils/store/store'

declare global {
	interface Window {
		backgroundControllerInstance?: BackgroundController
		store?: StoreType
	}
}