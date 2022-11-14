/*
    Path + Filename: src/utils/LCU/index.ts
*/

/* Overwolf is currently providing the connection to the LCU */

import launch = overwolf.extensions.launch

let onErrorListener, onInfoUpdates2Listener, onNewEventsListener
const g_interestedInFeatures = [
    'game_flow',
    'summoner_info',
    'champ_select',
    'lcu_info',
]

export function registerEvents() {

    onErrorListener = function (info) {
        console.log('Error: ' + JSON.stringify(info))
    }

    onInfoUpdates2Listener = function (info) {
        console.log('Info UPDATE: ' + JSON.stringify(info))
    }

    onNewEventsListener = function (info) {
        console.log("EVENT FIRED: " + JSON.stringify(info))
    }
    overwolf.games.events.onError.addListener(onErrorListener);
    overwolf.games.launchers.events.onInfoUpdates.addListener(onInfoUpdates2Listener);
    overwolf.games.events.onNewEvents.addListener(onNewEventsListener);
}

export function unregisterEvents() {
    overwolf.games.events.onError.removeListener(onErrorListener);
    overwolf.games.events.onInfoUpdates2.removeListener(onInfoUpdates2Listener);
    overwolf.games.events.onNewEvents.removeListener(onNewEventsListener);
}

export function isClientRunning(launcherInfo) {
    if (!launcherInfo) {
        return false
    }

    if (!launcherInfo.launchers[0]) {
        return false
    }

    // NOTE: we divide by 10 to get the launcher class id without it's sequence number
    return Math.floor(launcherInfo.launchers[0].id / 10) == 10902
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

    public isLeagueClient(launcherInfo) {
        console.log(launcherInfo)
        if (launcherInfo.id && Math.floor(launcherInfo.id / 10) == 10902)
            return true
        if (launcherInfo && launcherInfo.launchers && launcherInfo.launchers.length < 1) {
            return false
        }
        return Math.floor(launcherInfo.launchers[0].id / 10) == 10902
    }
    public onClientAbsence(callbackFunction) {
        overwolf.games.launchers.getRunningLaunchersInfo(callbackFunction)
    }
    public onClientAlreadyRunning(callbackFunction) {
        overwolf.games.launchers.getRunningLaunchersInfo(callbackFunction)
    }
    public onClientLaunch(callbackFunction) {
        overwolf.games.launchers.onLaunched.addListener(callbackFunction)
    }
    public onClientClosed(callbackFunction) {
        overwolf.games.launchers.onTerminated.addListener(callbackFunction)
    }
    public addAllListeners(clientsInfos) {
        if (this.isLeagueClient(clientsInfos))
            unregisterEvents()
        registerEvents()
        setTimeout(setFeatures, 1000)
    }
    public removeAllListeners() {
        unregisterEvents()
    }
    // public populateCredentials() {
    //     return (0)
    // }
}

export default LCU