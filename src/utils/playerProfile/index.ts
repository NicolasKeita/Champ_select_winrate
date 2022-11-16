/*
    Path + Filename: src/utils/playerProfile/index.ts
*/

import questionMark from '@public/img/question_mark.jpg'
import malhazar from '@public/img/MalzaharSquare.webp'
import {getChampionByKey} from '@utils/playerProfile/getChampionByKey'
import {getChampSquareAsset} from '@utils/playerProfile/getChampionSquareAsset'


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
        this.allies[0] = { img : defaultImg, name : defaultName }
        this.allies[1] = { img : defaultImg, name : defaultName }
        this.allies[2] = { img : defaultImg, name : defaultName }
        this.allies[3] = { img : defaultImg, name : defaultName }
        this.allies[4] = { img : defaultImg, name : defaultName }
        this.enemies[0] = { img : defaultImg, name : defaultName }
        this.enemies[1] = { img : defaultImg, name : defaultName }
        this.enemies[2] = { img : defaultImg, name : defaultName }
        this.enemies[3] = { img : defaultImg, name : defaultName }
        this.enemies[4] = { img : defaultImg, name : defaultName }
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

    public async fillMyTeam(myTeam) {
        for (let i = 0; i < 5; ++i) {
            if (myTeam[i]) {
                let champID = myTeam[i].championId
                if (champID <= 0)
                    champID = myTeam[i].championPickIntent
                if (champID > 0) {
                    this.allies[i].img = await this.getChampImg(champID)
                    this.allies[i].name = await this.getChampName(champID)
                }
            }
        }
    }

    public async fillTheirTeam(theirTeam) {
        for (let i = 0; i < 5; ++i) {
            if (theirTeam[i]) {
                let champID = theirTeam[i].championId
                if (champID <= 0)
                    champID = theirTeam[i].championPickIntent
                if (champID > 0) {
                    this.enemies[i].img = await this.getChampImg(champID)
                    this.enemies[i].name = await this.getChampName(champID)
                }
            }
        }
    }
}

export default PlayerProfile