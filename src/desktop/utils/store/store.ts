/*
    Path + Filename: src/desktop/utils/store/store.ts
*/

import {
	combineReducers,
	configureStore, createAsyncThunk,
	createSlice,
	PayloadAction
} from '@reduxjs/toolkit'
import Config from '../../components/maincontent/settings/Config'
import {
	Champion,
	championConstructor,
	getDefaultChampion
} from '../../components/maincontent/settings/Champion'
import {
	getChampImg,
	getChampName,
	getChampScore, getChampSquareAsset
} from '@utils/fetchDataDragon/fetchDataDragon'
import {
	fetchAllChampionsJson
} from '@utils/fetchLocalConfigJson/fetchChampionsFromConfigJson'

export type ChampDisplayedType = {
	assignedRole: string
	champ: Champion
	recommendations: Champion[]
}

type ChampSelectDisplayedType = {
	allies: ChampDisplayedType[]
	enemies: ChampDisplayedType[]
}

export function getDefaultRecommendations(): Champion[] {
	const recommendations: Champion[] = []
	for (let i = 0; i < 5; ++i) {
		recommendations.push(getDefaultChampion())
	}
	return recommendations
}

function initChampSelectDisplayed() {
	const champSelectDisplayed: ChampSelectDisplayedType = {
		allies: [],
		enemies: []
	}
	for (let i = 0; i < 5; ++i) {
		champSelectDisplayed.allies.push({
			assignedRole: '',
			champ: getDefaultChampion(),
			recommendations: getDefaultRecommendations()
		})
		champSelectDisplayed.enemies.push({
			assignedRole: '',
			champ: getDefaultChampion(),
			recommendations: getDefaultRecommendations()
		})
	}
	return champSelectDisplayed
}

type StoreStateType = {
	configSerialized: string,
	internalSettings: string,
	footerMessageID: number,
	leagueClientStatus: number,
	champSelectDisplayed: ChampSelectDisplayedType,
	summonerName: string,
	summonerRegion: string,
	encryptedSummonerId: string
}

const initialState = {
	configSerialized: JSON.stringify({settingsPage: false, champions: []}),
	internalSettings: '',
	footerMessageID: -1,
	leagueClientStatus: -1,
	champSelectDisplayed: initChampSelectDisplayed(),
	summonerName: '',
	summonerRegion: '',
	encryptedSummonerId: ''
} as StoreStateType

let g_x = 0

function updateChampSelectDisplayedScores(champSelectDisplayed: ChampSelectDisplayedType, allChamps: Champion[]) {
	for (const elem of champSelectDisplayed.allies) {
		elem.champ.opScore_user = getChampScore(elem.champ.name, allChamps)
	}
	for (const elem of champSelectDisplayed.enemies) {
		elem.champ.opScore_user = getChampScore(elem.champ.name, allChamps)
	}
}

type FillChampSelectDisplayedParamType = {
	actions: never[][],
	localPlayerCellId: number,
	myTeam: never[]
}

function getRecommendations(allies: ChampDisplayedType[], playerId: number, allChamps: Champion[]): Champion[] {
	let assignedRole = allies[playerId].assignedRole
	if (assignedRole == '')
		assignedRole = 'utility'
	const allChampsFilteredWithRole = allChamps.filter(champ => champ.role == assignedRole)
	if (allChampsFilteredWithRole.length == 0) console.error('CSW_error: couldnt get recommendations')
	allChampsFilteredWithRole.sort((a, b) => b.opScore_user - a.opScore_user)
	return allChampsFilteredWithRole.slice(0, 5)
}

type BothTeam = {
	allies: ChampDisplayedType[],
	enemies: ChampDisplayedType[]
}

export const fetchAllChampions = createAsyncThunk<Champion[]>(
	'fetchAllChampions',
	async (thunkParam, {rejectWithValue}) => {
		try {
			return await fetchAllChampionsJson()
		} catch (e) {
			return rejectWithValue(e)
		}
	}
)

export const fillChampSelectDisplayed = createAsyncThunk<BothTeam | void, FillChampSelectDisplayedParamType, {state: RootState}>(
	'fillChampSelectDisplayed',
	async (thunkParam, thunkAPI) => {
		if (thunkParam.actions.length == 0)
			return
		const allies: ChampDisplayedType[] = []
		const enemies: ChampDisplayedType[] = []
		const configPlainObject: Config = JSON.parse(thunkAPI.getState().slice.configSerialized)
		const allChamps = configPlainObject.champions

		for (let i = 0; i < 5; ++i) {
			allies.push({
				assignedRole: '',
				champ: getDefaultChampion(),
				recommendations: getDefaultRecommendations()
			})
			enemies.push({
				assignedRole: '',
				champ: getDefaultChampion(),
				recommendations: getDefaultRecommendations()
			})
		}

		async function fillChampNameAndImgUrlFromId(champObject: Champion, championId: number) {
			if (championId == 0) return
			champObject.imageUrl = await getChampImg(championId)
			champObject.name = await getChampName(championId)
			champObject.opScore_user = -1
		}

		function fillAssignedRoleAndRecommendations(allies: ChampDisplayedType[], myTeam: never[], actorCellId: number, allChamps: Champion[], isActorCellRightSide = false) {
			let actorCellIdTeam = actorCellId
			if (isActorCellRightSide) actorCellIdTeam += 5
			for (const {assignedPosition, cellId} of myTeam) {
				if (cellId === actorCellIdTeam) {
					allies[actorCellId].assignedRole = assignedPosition
					allies[actorCellId].recommendations = getRecommendations(allies, actorCellId, allChamps)
				}
			}
		}

		//Custom solo without or with bans
		if (thunkParam.actions.length == 1 || thunkParam.actions.length == 4) {
			let actorCellId: number, championId: number
			if (thunkParam.actions.length == 1)
				({actorCellId, championId} = thunkParam.actions[0][0])
			else
				({actorCellId, championId} = thunkParam.actions[3][0])
			await fillChampNameAndImgUrlFromId(allies[actorCellId].champ, championId)
			fillAssignedRoleAndRecommendations(allies, thunkParam.myTeam, actorCellId, allChamps)
		}
		// Rift Mode with bans (doesn't support clash or tournament yet)
		else if (thunkParam.actions.length == 8) {
			for (let i = 2; i < thunkParam.actions.length; i++) {
				let actorCellId: number, championId: number
				for ({actorCellId, championId} of thunkParam.actions[i]) {
					const isActorCellRightSide = actorCellId >= 5
					if ((actorCellId < 5 && thunkParam.localPlayerCellId < 5) || (actorCellId >= 5 && thunkParam.localPlayerCellId >= 5)) {
						if (actorCellId >= 5)
							actorCellId -= 5
						await fillChampNameAndImgUrlFromId(allies[actorCellId].champ, championId)
						fillAssignedRoleAndRecommendations(allies, thunkParam.myTeam, actorCellId, allChamps, isActorCellRightSide)
					} else {
						if (actorCellId >= 5)
							actorCellId -= 5
						await fillChampNameAndImgUrlFromId(enemies[actorCellId].champ, championId)
					}
				}
			}
		}

		for (const ally of allies) {
			for (const recommendation of ally.recommendations) {
				recommendation.imageUrl = await getChampSquareAsset(recommendation.image)
			}
		}
		return {allies: allies, enemies: enemies}
	})


const slice = createSlice({
	name: 'slice',
	initialState: initialState,
	reducers: {
		toggleSettingsPage: (state) => {
			const configPlainObject = JSON.parse(state.configSerialized)
			configPlainObject.settingsPage = !configPlainObject.settingsPage
			state.configSerialized = JSON.stringify(configPlainObject)
		},
		copyFromAnotherSetting: (state, action: PayloadAction<Config>) => {
			const configDeserialized = new Config(JSON.parse(state.configSerialized))
			configDeserialized.copyFromAnotherSetting(action.payload)
			state.configSerialized = configDeserialized.stringify()
		},
		setUserOPScore: {
			prepare: (score: number, champName: string) => ({
				payload: {score, champName}
			}),
			reducer: (state, action: PayloadAction<{score: number, champName: string}>) => {
				const configDeserialized = new Config(JSON.parse(state.configSerialized))
				const currentChamp = configDeserialized.getChampCurrConfig(action.payload.champName)
				if (currentChamp) {
					currentChamp.opScore_user = action.payload.score
					state.configSerialized = configDeserialized.stringify()
				}
			}
		},
		setInternalSettings: {
			prepare: (score: number, champName: string) => ({
				payload: {score, champName}
			}),
			reducer: (state, action: PayloadAction<{score: number, champName: string}>) => {
				const configDeserialized = new Config(JSON.parse(state.configSerialized))
				const currentChamp = configDeserialized.getChampCurrConfig(action.payload.champName)
				if (currentChamp) {
					currentChamp.opScore_user = action.payload.score
					state.internalSettings = JSON.stringify(configDeserialized.champions)
				}
			}
		},
		updateAllUserScores: (state, action: PayloadAction<Champion[]>) => {
			const configDeserialized = new Config(JSON.parse(state.configSerialized))
			for (const elem of Object.values(action.payload)) {
				const champion = configDeserialized.getChampCurrConfig(elem.name)
				if (champion) champion.opScore_user = elem.opScore_user
				else console.log('CSW_error: couldnt update Score')
			}
			state.configSerialized = configDeserialized.stringify()
			localStorage.setItem('config', configDeserialized.stringify())
			updateChampSelectDisplayedScores(state.champSelectDisplayed, configDeserialized.champions)
		},
		setClientStatus: (state, action: PayloadAction<number>) => {
			state.leagueClientStatus = action.payload
			sessionStorage.setItem('clientStatus', action.payload.toString())
		},
		setFooterMessage: (state, action: PayloadAction<number>) => {
			if ((state.footerMessageID == 200 || state.footerMessageID == 201) && !(action.payload >= 0 && action.payload <= 3))
				return
			state.footerMessageID = action.payload
			sessionStorage.setItem('footerMessageId', action.payload.toString())
		},
		resetChampSelectDisplayed: (state) => {
			state.champSelectDisplayed = initChampSelectDisplayed()
		},
		setSummonerInternal: {
			prepare: (summonerName: string, summonerRegion: string, encryptedSummonerId: string) => ({
				payload: {summonerName, summonerRegion, encryptedSummonerId}
			}),
			reducer: (state, action: PayloadAction<{summonerName: string, summonerRegion: string, encryptedSummonerId: string}>) => {
				state.summonerName = action.payload.summonerName
				state.summonerRegion = action.payload.summonerRegion
				state.encryptedSummonerId = action.payload.encryptedSummonerId
			}
		},
		setSummonerName: (state, action: PayloadAction<string>) => {
			state.summonerName = action.payload
		},
		setSummonerRegion: (state, action: PayloadAction<string>) => {
			state.summonerRegion = action.payload
		},
		resetSettings: (state) => {
			const configPlainObject: Config = JSON.parse(state.configSerialized)
			if (!configPlainObject.champions) return
			configPlainObject.champions.length = 0
			sessionStorage.removeItem('internalConfig')
			const userConfigString = localStorage.getItem('config')
			if (!userConfigString) console.error('CSW_error: config in localstorage not found')
			else {
				const userConfig: Config = JSON.parse(userConfigString)
				for (const champion of userConfig.champions) {
					champion.opScore_user = champion.opScore_CSW
					configPlainObject.champions.push(champion)
				}
				localStorage.setItem('config', JSON.stringify(configPlainObject))
			}
			g_x += 1
			state.configSerialized = JSON.stringify(configPlainObject) + ' '.repeat(g_x)
			updateChampSelectDisplayedScores(state.champSelectDisplayed, configPlainObject.champions)
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fillChampSelectDisplayed.fulfilled, (state, action) => {
			if (action.payload !== undefined) {
				state.champSelectDisplayed.allies = JSON.parse(JSON.stringify(action.payload.allies))
				for (const elem of state.champSelectDisplayed.allies) {
					elem.champ.opScore_user = getChampScore(elem.champ.name, JSON.parse(state.configSerialized).champions)
				}
				state.champSelectDisplayed.enemies = JSON.parse(JSON.stringify(action.payload.enemies))
				for (const elem of state.champSelectDisplayed.enemies) {
					elem.champ.opScore_user = getChampScore(elem.champ.name, JSON.parse(state.configSerialized).champions)
				}
			}
		})
		builder.addCase(fetchAllChampions.fulfilled, (state, action) => {
			const configDeserialized = new Config(JSON.parse(state.configSerialized))
			for (const elem of Object.values(action.payload)) {
				const newChamp = championConstructor(elem.name, elem.opScore_user, elem.opScore_CSW, elem.role, elem.image, elem.imageUrl)
				const duplicate = configDeserialized.champions.find(elemConfig => elemConfig.name === elem.name)
				if (duplicate) {
					duplicate.name = elem.name
					duplicate.opScore_user = elem.opScore_user
					duplicate.opScore_CSW = elem.opScore_CSW
					duplicate.role = elem.role
					duplicate.image = elem.image
					duplicate.imageUrl = elem.imageUrl
				} else configDeserialized.champions.push(newChamp)
			}
			localStorage.setItem('config', configDeserialized.stringify())
			state.configSerialized = configDeserialized.stringify()
			updateChampSelectDisplayedScores(state.champSelectDisplayed, configDeserialized.champions)
		})
		builder.addCase(fetchAllChampions.rejected, (_state, action) => {
			console.error(action.payload)
			console.error('CSW_error: fetchAllChampions failed, retrying in 5sec')
			setTimeout(fetchAllChampions, 5000)
		})
	}
})

export const {
	toggleSettingsPage,
	updateAllUserScores,
	resetChampSelectDisplayed,
	copyFromAnotherSetting,
	setFooterMessage,
	setClientStatus,
	resetSettings
} = slice.actions

const mainReducer = combineReducers({
	slice: slice.reducer
})

export const store = configureStore({
	reducer: mainReducer
})

store.subscribe(() => {
	// console.log('new state : ')
	// console.log(JSON.parse(store.getState().slice.configSerialized))
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch