/*
    Path + Filename: src/utils/LCU/index.ts
*/

/* Overwolf is currently providing the connection to the LCU */

let onErrorListener, onInfoUpdates2Listener, onNewEventsListener
const g_interestedInFeatures = [
    'game_flow',
    'summoner_info',
    'champ_select',
    'lcu_info',
]

export function registerEvents(handleFeaturesCallbacks) {
    onErrorListener = function (info) {
        console.log('Error: ' + JSON.stringify(info))
    }
    onInfoUpdates2Listener = (info) => {
        console.log('onInfoUpdatesProc')
        console.log(info)
//        if (info.feature === 'game_flow' && info.info.game_flow.phase === 'ChampSelect') {
//            console.log('Hello CHAMP SELECT')
        handleFeaturesCallbacks(info)
//        }
        //TODO if game_flow autre que champSelect, re setup le clientStatus to open
    }
    onNewEventsListener = function (info) {
        console.log('onNewEventsProc')
        console.log(info)
    }
    overwolf.games.events.onError.addListener(onErrorListener)
    overwolf.games.launchers.events.onInfoUpdates.addListener(onInfoUpdates2Listener)
    overwolf.games.events.onNewEvents.addListener(onNewEventsListener)
}

export function unregisterEvents() {
    overwolf.games.events.onError.removeListener(onErrorListener)
    overwolf.games.events.onInfoUpdates2.removeListener(onInfoUpdates2Listener)
    overwolf.games.events.onNewEvents.removeListener(onNewEventsListener)
}

export function setFeatures() {
    overwolf.games.launchers.events.setRequiredFeatures(
        10902,
        g_interestedInFeatures,
        function(info) {
            if (info.error) {
                console.log(info.error)
                console.log('Trying in 2 seconds')
                window.setTimeout(setFeatures, 2000)
                return
            }
        }
    )
}

class LCU {
    private port: number
    private credentials: string
    constructor() {
        this.port = 0
        this.credentials = ''
    }

    private setFeatures() {
        overwolf.games.launchers.events.setRequiredFeatures(
            10902,
            g_interestedInFeatures,
            function(info) {
                if (info.error) {
                    console.log(info.error)
                    console.log('Trying in 2 seconds')
                    window.setTimeout(setFeatures, 2000)
                    return
                }
            }
        )
    }
    public isLeagueClient(launcherInfo) {
        if (launcherInfo && launcherInfo.launchers && launcherInfo.launchers.length < 1)
            return false
        if (launcherInfo.id && Math.floor(launcherInfo.id / 10) == 10902)
            return true
        return Math.floor(launcherInfo.launchers[0].id / 10) == 10902
    }
    public onClientAlreadyRunningOrNot(callbackFunction) {
        overwolf.games.launchers.getRunningLaunchersInfo(callbackFunction)
    }
    public onClientLaunch(callbackFunction) {
        overwolf.games.launchers.onLaunched.addListener(callbackFunction)
    }
    public onClientClosed(callbackFunction) {
        overwolf.games.launchers.onTerminated.addListener(callbackFunction)
    }
    public addAllListeners(clientsInfos, callbackTMP) {
        if (this.isLeagueClient(clientsInfos))
            unregisterEvents()
        registerEvents(callbackTMP)
        setTimeout(this.setFeatures, 1000)
    }
    public removeAllListeners() {
        unregisterEvents()
    }
    // public populateCredentials() {
    //     return (0)
    // }
}

export default LCU