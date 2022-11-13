/*
    Path + Filename: src/utils/LCU/index.ts
*/

/* Overwolf is currently providing the connection to the LCU */

class LCU {

    public listenerOnClientLaunch(callbackFunction) {
        overwolf.games.launchers.onLaunched.addListener(callbackFunction)
    }
}

export default LCU