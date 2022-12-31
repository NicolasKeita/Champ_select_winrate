/*
    Path + Filename: src/desktop/components/maincontent/settings/configRow.tsx
*/

import React, {KeyboardEvent, useState} from 'react'
import styled from 'styled-components'
// import {useAppSelector} from '@utils/hooks'
import Config from '../desktop/components/maincontent/settings/Config'
import {copy} from 'copy-anything'
import {selectAllChampions} from '@utils/store/selectors'
import {Champion} from '../desktop/components/maincontent/settings/Champion'
import {useAppDispatch} from '@utils/hooks'
import {updateChamp} from '@utils/store/store'

const ChampName = styled.h1`
  background: -webkit-linear-gradient(#ab6630, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  width: 110px;
`
const OP_ScoreContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-evenly;
  background: -webkit-linear-gradient(#a95a21, #8d782a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
const InputStyled = styled.input`
  width: 50px;
  margin-left: -30px;
  border-radius: 4px;
  background: rgba(63, 62, 62, 0);
  transition: 0.3s background-color ease-in-out, 0.3s box-shadow ease-in-out;
  text-align: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.24);
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
  }
`
const OP_Score = styled.div``

interface PropsType {
	champName: string,
	opScoreCSW: number,
	opScoreUser: number,
	allChamps: Champion[]
}

function ConfigRow(props: PropsType) {
	//TODO avant faire la technique de useMemo pour que le second render soit propre
	// car lorsque je render 23 items, je recharge les 13 premiers ? j'aimerai juste les ajouter
	//TODO faire la technique de load 13 items puis 23 puis 33 en fonction du scroll du user

	const [opScoreUser, setOpScoreUser] = useState<string>(props.opScoreUser.toString())

	// const allChamps = useAppSelector(selectAllChampions())
	const allChamps = props.allChamps
	const dispatch = useAppDispatch()

	function handleOnChange({target}: {target: HTMLInputElement}) {
		if (!target || (!(/[0-9]/.test(target.value)) && target.value != '')) return
		const valueEntered = parseInt(target.value) || 0
		if (valueEntered == 0 && target.value === '') {
			setOpScoreUser(target.value)
			return
		}
		if (Number.isInteger(valueEntered) && valueEntered <= 100) {
			setOpScoreUser(valueEntered.toString())
			dispatch(updateChamp({
				champName: props.champName,
				champUserScore: valueEntered
			}))

			// const currentChamp = copy(allChamps.find((champ) => champ.name == props.champName))
			// if (currentChamp) {
			// 	currentChamp.opScore_user = valueEntered
			// 	const allChampsUpdated = allChamps.map((champion) => champion.name == props.champName ? currentChamp : champion)
			// 	sessionStorage.setItem('internalConfig', JSON.stringify(allChampsUpdated))
			// }
		}
	}

	function handleOnBlur({target}: {target: HTMLInputElement}) {
		const valueEntered = target.value
		if (valueEntered === '') {
			setOpScoreUser('' + 50)
			const currentChamp = copy(allChamps.find((champ) => champ.name == props.champName))
			if (currentChamp) {
				currentChamp.opScore_user = 50
				const allChampsUpdated = allChamps.map((champion) => champion.name == props.champName ? currentChamp : champion)
				sessionStorage.setItem('internalConfig', JSON.stringify(allChampsUpdated))
			}
		}
	}

	function handleOnKeyDown(event: KeyboardEvent) {
		const target: Partial<HTMLInputElement> = event.target
		if (event.key == 'Escape') {
			if (target.blur)
				target.blur()
		} else if (event.key == 'Enter') {
			if (target.blur)
				target.blur()
		}
	}


	return (
		<div
			style={{display: 'flex', flex: '1'}}>
			<form
				style={{
					display: 'flex',
					flex: '1',
					justifyContent: 'space-evenly'
				}}
				onSubmit={e => e.preventDefault()}
			>
				<label style={{display: 'flex', flex: '1'}}>
					<ChampName>{props.champName}</ChampName>
					<OP_ScoreContainer>
						<InputStyled type={'text'}
									 aria-label={`${props.champName}`}
									 value={opScoreUser}
									 size='xs'
									 width={'50px'}
									 variant={'outline'}
									 fontSize={'14px'}
									 fontWeight={'bold'}
									 borderColor={'grey'}
									 border={'2px'}
									 onKeyDown={handleOnKeyDown}
									 onChange={handleOnChange}
									 onBlur={handleOnBlur}
						/>
						<OP_Score>{props.opScoreCSW}</OP_Score>
					</OP_ScoreContainer>
				</label>
			</form>
		</div>
	)
}

export default ConfigRow
