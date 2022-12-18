/*
    Path + Filename: src/desktop/components/maincontent/settings/Config.ts
*/

import {Champion, championConstructor} from './Champion'

export enum ConfigPage {
	CHAMPSELECT= 100,
	HISTORY= 200
}

class Config {
	constructor(payload: Partial<Config>) {
		this.currentPage = payload.currentPage ? payload.currentPage : ConfigPage.HISTORY
		this._settingsPage = payload.settingsPage ? payload.settingsPage : false
		this._champions = []
		if (payload.champions) {
			const allChampionsPlainArray = payload.champions
			for (const elem of allChampionsPlainArray) {
				this._champions.push(championConstructor(elem.name, elem.opScore_user, elem.opScore_CSW, elem.role, elem.image, elem.imageUrl))
			}
		}
	}

	public currentPage: ConfigPage

	private _settingsPage: boolean

	public get settingsPage() { return this._settingsPage }

	public set settingsPage(settingsPage) { this._settingsPage = settingsPage }

	private _champions: Champion[]

	public get champions() { return this._champions }

	public set champions(champions) { this._champions = champions }

	public stringify(): string {
		let json = JSON.stringify(this)
		Object.keys(this)
			  .filter(key => key[0] === '_')
			  .forEach(key => {
				  json = json.replace(key, key.substring(1))
			  })
		return json
	}

	public stringifyChampions(): string {
		let json = JSON.stringify(this.champions)
		Object.keys(this)
			  .filter(key => key[0] === '_')
			  .forEach(key => {
				  json = json.replace(key, key.substring(1))
			  })
		return json
	}

	public copyFromAnotherSetting(settings: Config): void {
		this._champions.length = 0
		settings.champions.forEach(elem => {
			this._champions.push(Object.assign(championConstructor(), elem))
		})
	}

	public getChampCurrConfig(champName): Champion | undefined {
		for (const champion of this.champions) {
			if (champion.name === champName) return champion
		}
		return undefined
	}
}

export default Config
