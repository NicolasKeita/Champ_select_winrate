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

    public setClientStatus(status) { this.clientStatus = status }
    public getClientStatus() { return this.clientStatus }
    public isClientClosed() { return this.clientStatus === this.clientStatusEnum.CLOSED }
    public isClientOpen() { return this.clientStatus >= this.clientStatusEnum.OPEN }
    public isClientInChampSelect() { return this.clientStatus === this.clientStatusEnum.INSIDE_CHAMP_SELECT }
}

export default PlayerProfile