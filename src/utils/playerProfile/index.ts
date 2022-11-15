/*
    Path + Filename: src/utils/playerProfile/index.ts
*/

import questionMark from '@public/img/question_mark.jpg'
import malhazar from '@public/img/MalzaharSquare.webp'

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


    // public handlegameflow = (gameflow) => {
    //     if (gameflow && gameflow.phase) {
    //         if (gameflow.phase === 'champselect') {
    //             this.setclientstatustoinside_champ_select()
    //             console.log('changement de graphique')
    //         }
    //     }
    // }
    //
    // public handlefeaturescallbacks = (info) => {
    //     if (info.feature === 'game_flow')
    //         this.handlegameflow(info.info.game_flow)
    // }
}

export default PlayerProfile