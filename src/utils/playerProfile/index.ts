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
    public ally1 = { img : '' }

//    public img : string

    constructor() {
        this.clientStatus = this.clientStatusEnum.CLOSED
        this.ally1.img = questionMark
    }

    public resetChampSelect() {
        this.ally1.img = questionMark
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
//        return malhazar
    }
}

export default PlayerProfile