/*
    Path + Filename: src/desktop/components/maincontent/settings/Config.ts
*/

import Champion from './Champion'

class Config {
    public settingsPage: boolean
    private _champions: Champion[]

    public set champions(champions) {
        this._champions = champions
    }
    public get champions() {
        return this._champions
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
    constructor() {
        this.settingsPage = false
        this._champions = []
    }

    public copyFromAnotherSetting(settings: Config): void {
        this._champions.length = 0
        settings.champions.forEach(elem => {
            this._champions.push(Object.assign(new Champion(), elem))
        })
    }

    public async getChampionCSW_json() {
        const res = await fetch('./config/champion_CSW_save.json', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
        const jsonRes = await res.json() //TODO catch error
        return jsonRes
    }
    public getChampCurrConfig(champName): Champion | undefined {
        for (const champion of this.champions) {
            if (champion.name === champName) return champion
        }
        return undefined
    }

    public async populateDefaultConfig() {
        const allChamps = await this.getChampionCSW_json()
        Object.entries(allChamps).forEach(([, elem]) => {
            const champ = new Champion()
            champ.name = elem['name']
            champ.opScore_CSW = elem['CSW_score']
            champ.opScore_user = elem['CSW_score']
            this.champions.push(champ)
        })
        localStorage.setItem('config', this.stringify())
    }

    //don't forget to await for this function // TODO check why necessary cuz I already have await inside
    public async reset() {
        this.champions.length = 0
        await this.populateDefaultConfig()
    }
}

export default Config
