/*
    Path + Filename: src/desktop/components/maincontent/settings/Config.ts
*/

import Champion from './Champion'

class Config {
	public settingsPage: boolean

	constructor() {
		this.settingsPage = false
		this._champions = []
	}

	private _champions: Champion[]

	public get champions() {
		return this._champions
	}

	public set champions(champions) {
		this._champions = champions
	}

	public stringify(): string {
		let json = JSON.stringify(this)
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
			this._champions.push(Object.assign(new Champion(), elem))
		})
	}

	public getChampCurrConfig(champName): Champion | undefined {
		for (const champion of this.champions) {
			if (champion.name === champName) return champion
		}
		return undefined
	}

	public populateDefaultConfig() {
		this._fetchChampionsFromConfigJson().then(champs => {
			this.champions = champs
			localStorage.setItem('config', this.stringify())
		})
	}

	public async reset() {
		this.champions.length = 0
		this.populateDefaultConfig()
	}

	private async _fetchChampionsFromConfigJson(): Promise<Champion[]> {
		const fileUrl = './config/champion_CSW_save.json'
		const res = await fetch(fileUrl, {
			headers: {
				'Content-Type': 'application/json',
				'Accept':       'application/json'
			}
		})
		if (!res.ok) {
			console.error('CSW_error: following call : fetch(' + fileUrl + ' caught error;  ' + res.statusText)
			return []
		}
		try {
			const data = await res.json() as Promise<Champion[]>
			return (Object.values(data).map((elem: Champion) => {
				return new Champion(elem.name, elem.opScore_CSW, elem.opScore_CSW)
			}))
		} catch (e) {
			console.error('CSW_error: following call : res.json() caught error; previously : fetch(' + fileUrl)
			console.error(e)
			return []
		}
	}
}

export default Config
