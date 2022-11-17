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
        for (let i = 0; i < 5; ++i) {
            this.allies[i] = { img : defaultImg, name : defaultName }
            this.enemies[i] = { img : defaultImg, name : defaultName }
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


    public async fillChampSelect(actions) {
        //Custom solo without bans
        if (actions.length == 1) {
            const cellID = actions[0][0].actorCellId
            const champID = actions[0][0].championId
            if (champID === 0)
                return
            this.allies[cellID].img = await this.getChampImg(champID)
            this.allies[cellID].name = await this.getChampName(champID)
        }
        //Custom solo with bans
        if (actions.length == 4) {
            const cellID = actions[3][0].actorCellId
            const champID = actions[3][0].championId
            if (champID === 0)
                return
            this.allies[cellID].img = await this.getChampImg(champID)
            this.allies[cellID].name = await this.getChampName(champID)
        }
        // Rift Mode with bans (doesn't handle clash or tournament yet)
        else if (actions.length == 8) {
            for (let i = 2; i < actions.length; i++) {
                for (let y = 0; y < actions[i].length; ++y) {
                    console.log('i = ' + i)
                    console.log('y = ' + y)
                    const champID = actions[i][y].championId
                    if (champID === 0)
                        continue
                    let cellID = actions[i][y].actorCellId
                    if (cellID < 5) {
                        this.allies[cellID].img = await this.getChampImg(champID)
                        this.allies[cellID].name = await this.getChampName(champID)
                        console.log("CHAMP ID IS " + champID)
                    } else {
                        cellID = cellID - 5
                        console.log("CHAMP ID IS " + champID)
                        console.log("cellID " + cellID)
                        this.enemies[cellID].img = await this.getChampImg(champID)
                        this.enemies[cellID].name = await this.getChampName(champID)
                    }
                }
            }
        }
    }

    // public async fillMyTeam(myTeam) {
    //     for (let i = 0; i < 5; ++i) {
    //         if (myTeam[i]) {
    //             let champID = myTeam[i].championId
    //             if (champID <= 0)
    //                 champID = myTeam[i].championPickIntent
    //             if (champID > 0) {
    //                 this.allies[i].img = await this.getChampImg(champID)
    //                 this.allies[i].name = await this.getChampName(champID)
    //             }
    //         }
    //     }
    // }
    //
    // public async fillTheirTeam(theirTeam) {
    //     for (let i = 0; i < 5; ++i) {
    //         if (theirTeam[i]) {
    //             let champID = theirTeam[i].championId
    //             if (champID <= 0)
    //                 champID = theirTeam[i].championPickIntent
    //             if (champID > 0) {
    //                 this.enemies[i].img = await this.getchampimg(champid)
    //                 this.enemies[i].name = await this.getchampname(champid)
    //             }
    //         }
    //     }
    // }
}

export default PlayerProfile