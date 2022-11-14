/*
    Path + Filename: src/utils/playerProfile/index.ts
*/

class PlayerProfile {
    public readonly clientStatusEnum = {
        CLOSED: 0,
        OPEN: 1,
        INSIDE_CHAMP_SELECT: 2
    }
    public clientStatus: number

    constructor() {
        this.clientStatus = this.clientStatusEnum.CLOSED
    }

    public setClientStatusToCLOSED() { this.clientStatus = this.clientStatusEnum.CLOSED }
    public setClientStatusToOPEN() { this.clientStatus = this.clientStatusEnum.OPEN }
    public setClientStatusToINSIDE_CHAMP_SELECT() { this.clientStatus = this.clientStatusEnum.INSIDE_CHAMP_SELECT }
    public isClientClosed() { return this.clientStatus === this.clientStatusEnum.CLOSED }
    public isClientOpen() { return this.clientStatus >= this.clientStatusEnum.OPEN }
    public isClientInChampSelect() { return this.clientStatus === this.clientStatusEnum.INSIDE_CHAMP_SELECT }


    public handleGameFlow(gameFlow) {
        if (gameFlow && gameFlow.phase) {
            if (gameFlow.phase === 'ChampSelect') {
                this.setClientStatusToINSIDE_CHAMP_SELECT()
                console.log('Changement de Graphique')
            }
        }
    }

    public handleFeaturesCallbacks = (info) => {
        if (info.feature === 'game_flow')
            this.handleGameFlow(info.info.game_flow)
    }
}

export default PlayerProfile