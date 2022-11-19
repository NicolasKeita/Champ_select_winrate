/*
    Path + Filename: src/desktop/components/maincontent/settings/Config.ts
*/


import Champion from './Champion'

class Config {
    public settingsPage : boolean
    constructor() {
        this.settingsPage = true
    }
    async getAllChampsName() {
        const language = 'en_US'
        let response
        let versionIndex = 0
        do {
            const version = (await fetch('http://ddragon.leagueoflegends.com/api/versions.json').then(async(r) => await r.json()))[versionIndex++]
            response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion.json`)
        }
        while (!response.ok)
        let responseJson = await response.json()
        let allChampsName = []
        Object.entries(responseJson.data).forEach(([, value]) => {
            allChampsName.push(value['name'])
        })
        return allChampsName
    }
    public async populateDefaultConfig() {
        const allChamps = await this.getAllChampsName()
    }
    public champions = Array<Champion>
}

export default Config