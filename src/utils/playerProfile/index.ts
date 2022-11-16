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
    public ally1 = { img : '' }
    public ally2 = { img : '' }
    public ally3 = { img : '' }
    public ally4 = { img : '' }
    public ally5 = { img : '' }
    public enemy1 = { img : '' }
    public enemy2 = { img : '' }
    public enemy3 = { img : '' }
    public enemy4 = { img : '' }
    public enemy5 = { img : '' }

//    public img : string

    constructor() {
        this.clientStatus = this.clientStatusEnum.CLOSED
        this.ally1.img = questionMark
        this.allies[0] = { img : questionMark }
        this.allies[1] = { img : questionMark }
        this.allies[2] = { img : questionMark }
        this.allies[3] = { img : questionMark }
        this.allies[4] = { img : questionMark }
        this.enemies[0] = { img : questionMark }
        this.enemies[1] = { img : questionMark }
        this.enemies[2] = { img : questionMark }
        this.enemies[3] = { img : questionMark }
        this.enemies[4] = { img : questionMark }
    }

    public resetChampSelect() {
        this.ally1.img = questionMark
        this.allies[0] = { img : questionMark }
        this.allies[1] = { img : questionMark }
        this.allies[2] = { img : questionMark }
        this.allies[3] = { img : questionMark }
        this.allies[4] = { img : questionMark }
        this.enemies[0] = { img : questionMark }
        this.enemies[1] = { img : questionMark }
        this.enemies[2] = { img : questionMark }
        this.enemies[3] = { img : questionMark }
        this.enemies[4] = { img : questionMark }
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
    public async fillMyTeam(myTeam) {
        for (let i = 0; i < 5; ++i) {
            if (myTeam[i]) {
                let champID = myTeam[i].championId
                if (champID <= 0)
                    champID = myTeam[i].championPickIntent
                if (champID > 0)
                    this.allies[i].img = await this.getChampImg(champID)
            }
        }
    }

    public async fillTheirTeam(theirTeam) {
        for (let i = 0; i < 5; ++i) {
            if (theirTeam[i]) {
                let champID = theirTeam[i].championId
                if (champID <= 0)
                    champID = theirTeam[i].championPickIntent
                if (champID > 0)
                    this.enemies[i].img = await this.getChampImg(champID)
            }
        }
    }
}

export default PlayerProfile