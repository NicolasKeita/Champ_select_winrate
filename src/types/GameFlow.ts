/*
    Path + Filename: src/types/GameFlow.ts
*/


//TODO remove deprecated
export type GameFlow = {
	phase: 'Lobby' | 'ReadyCheck' | 'ChampSelect' | 'Matchmaking' | 'GameStart'
		| 'InProgress' | 'WaitingForStats' | 'PreEndOfGame' | 'EndOfGame' | 'None'
}