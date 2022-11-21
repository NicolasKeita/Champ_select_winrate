/*
    Path + Filename: src/desktop/components/maincontent/settings/Config.ts
*/

import Champion from './Champion'

class Config {
    //TODO: again, check set & get from typescript
    public settingsPage : boolean
    _champions

    public set champions(champions: any) {
        this._champions = champions
    }
    public get champions() {
        return this._champions
    }
    public stringify() : string {
        let json = JSON.stringify(this)
        Object.keys(this).filter(key => key[0] === '_').forEach(key => {
            json = json.replace(key, key.substring(1))
        })
        console.log('here')
        console.log(json)
        return json
    }
    constructor() {
        this.settingsPage = false
        this._champions = []
    }

    public copyFromAnotherSetting(settings): void {
        this._champions = settings.champions
    }

    public async getChampionCSW_json() {
        const res = await fetch('./config/champion_CSW_save.json'
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
        const jsonRes = await res.json() //TODO catch error
        return jsonRes
    }

    public async populateDefaultConfig() {
        const allChamps = await this.getChampionCSW_json()
        Object.entries(allChamps).forEach(([, elem]) => {
            const champ = new Champion()
            champ.name = elem['name']
            champ.opScore_CSW = elem['CSW_score']
            this.champions.push(champ)
        })
        localStorage.setItem('config', this.stringify())
    }
}

export default Config