/*
    Path + Filename: src/desktop/components/maincontent/settings/Config.ts
*/

import Champion from './Champion'

class Config {
    public settingsPage : boolean
    public champions = []
    constructor() {
        this.settingsPage = false
    }
    async getAllChampsName() {
        //TODO : FETCH FROM LOCAL file
        const language = 'en_US'
        let response
        let versionIndex = 0
        do {
            const version = (await fetch('http://ddragon.leagueoflegends.com/api/versions.json').then(async(r) => await r.json()))[versionIndex++]
            response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion.json`)
        }
        while (!response.ok)
        const responseJson = await response.json()
        const allChampsName = []
        Object.entries(responseJson.data).forEach(([, value]) => {
            allChampsName.push(value['name'])
        })
        return allChampsName
    }

    public async getChampionCSW_json() {
        const res = await fetch('./config/champion_CSW_save.json'
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
        const jsonRes = await res.json()
        return jsonRes
    }

    public populateDefaultConfig = async () => {
//        let allChamps = await this.getAllChampsName()
        // allChamps.forEach((elem) => {
        //     const champ = new Champion()
        //     champ.name = elem
        //     this.champions.push(champ)
        // })
        const allChamps = await this.getChampionCSW_json()
        console.log(Object.entries(allChamps))
        Object.entries(allChamps).forEach(([key, elem], index) => {
        // allChamps.forEach((elem) => {
            const champ = new Champion()
            champ.name = elem['name']
            champ.opScore_CSW = elem['CSW_score']
            this.champions.push(champ)
        })
    }
}

export default Config