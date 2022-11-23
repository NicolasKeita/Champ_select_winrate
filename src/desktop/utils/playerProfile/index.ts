/*
    Path + Filename: src/utils/playerProfile/index.ts
*/

import questionMark from '@public/img/question_mark.jpg'
import {getChampionByKey} from './getChampionByKey'
import {getChampSquareAsset} from './getChampionSquareAsset'
import Champion from '../../components/maincontent/settings/Champion'

class PlayerProfile {
    //TODO  Typescript supports set & get for accessor. Take a look !
    public readonly clientStatusEnum = {
        CLOSED: 0,
        OPEN: 1,
        INSIDE_CHAMP_SELECT: 2
    }
    public clientStatus: number
    public allies = Array(5)
    public enemies = Array(5)

    constructor() {
        this.clientStatus = this.clientStatusEnum.CLOSED
        this.resetChampSelect()
    }

    public resetChampSelect() {
        const defaultImg = questionMark
        const defaultName = 'Champion Name'
        const defaultScore = 50
        for (let i = 0; i < 5; ++i) {
            this.allies[i] = { img : defaultImg, name : defaultName, score : defaultScore}
            this.enemies[i] = { img : defaultImg, name : defaultName, score : defaultScore}
        }
    }
    public setClientStatusToCLOSED() { this.clientStatus = this.clientStatusEnum.CLOSED }
    public setClientStatusToOPEN() { this.clientStatus = this.clientStatusEnum.OPEN }
    public setClientStatusToINSIDE_CHAMP_SELECT() { this.clientStatus = this.clientStatusEnum.INSIDE_CHAMP_SELECT }
    public isClientClosed() { return this.clientStatus === this.clientStatusEnum.CLOSED }
    public isClientOpen() { return this.clientStatus >= this.clientStatusEnum.OPEN }
    public isClientInChampSelect() { return this.clientStatus === this.clientStatusEnum.INSIDE_CHAMP_SELECT }

    public async getChampImg(champId) {
        const champObject = await getChampionByKey(champId)
        return await getChampSquareAsset(champObject.image.full)
    }

    public async getChampName(champId) {
        return (await getChampionByKey(champId)).name
    }
    public getChampScore(champName : string, settingsChampions : Champion[]) : number {
        for (const elem of settingsChampions) {
            if (elem.name == champName)
                return elem.opScore_user
        }
        return 50
    }

    public async fillChampSelect(actions, settingsChampions : Champion[]) {
        //TODO if i put a comment just under the function, typescript display it as official function description, do it for all functions ?
        //Custom solo without bans
        if (actions.length == 1) {
            const cellID = actions[0][0].actorCellId
            const champID = actions[0][0].championId
            if (champID === 0)
                return
            this.allies[cellID].img = await this.getChampImg(champID)
            this.allies[cellID].name = await this.getChampName(champID)
            this.allies[cellID].score = this.getChampScore(this.allies[cellID].name, settingsChampions)
        }
        //Custom solo with bans
        if (actions.length == 4) {
            const cellID = actions[3][0].actorCellId
            const champID = actions[3][0].championId
            if (champID === 0)
                return
            this.allies[cellID].img = await this.getChampImg(champID)
            this.allies[cellID].name = await this.getChampName(champID)
            this.allies[cellID].score = this.getChampScore(this.allies[cellID].name, settingsChampions)
        }
        // Rift Mode with bans (doesn't handle clash or tournament yet)
        else if (actions.length == 8) {
            for (let i = 2; i < actions.length; i++) {
                for (let y = 0; y < actions[i].length; ++y) {
                    const champID = actions[i][y].championId
                    if (champID === 0)
                        continue
                    let cellID = actions[i][y].actorCellId
                    if (cellID < 5) {
                        this.allies[cellID].img = await this.getChampImg(champID)
                        this.allies[cellID].name = await this.getChampName(champID)
                        this.allies[cellID].score = this.getChampScore(this.allies[cellID].name, settingsChampions)
                    } else {
                        cellID = cellID - 5
                        this.enemies[cellID].img = await this.getChampImg(champID)
                        this.enemies[cellID].name = await this.getChampName(champID)
                        this.enemies[cellID].score = this.getChampScore(this.enemies[cellID].name, settingsChampions)
                    }
                }
            }
        }
    }
}

export default PlayerProfile