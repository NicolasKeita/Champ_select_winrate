/*
    Path + Filename: src/desktop/components/maincontent/settings/Config.ts
*/

import Champion from './Champion'

class Config {
	constructor(payload: Partial<Config>) {
		this._settingsPage = false
		if (payload.settingsPage)
			this._settingsPage = payload.settingsPage
		this._champions = []
		if (payload.champions) {
			const allChampionsPlainArray = payload.champions
			for (const elem of allChampionsPlainArray) {
				this._champions.push(new Champion(elem.name, elem.opScore_user, elem.opScore_CSW))
			}
		}
	}

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
			this._champions.push(Object.assign(new Champion(), elem))
		})
	}

	public getChampCurrConfig(champName): Champion | undefined {
		for (const champion of this.champions) {
			if (champion.name === champName) return champion
		}
		return undefined
	}

	public async populateDefaultConfig() {
		this.champions = await this._fetchChampionsFromConfigJson()
		localStorage.setItem('config', this.stringify())
	}

	public async reset() {
		this.champions.length = 0
		await this.populateDefaultConfig()
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
