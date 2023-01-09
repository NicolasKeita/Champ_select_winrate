/*
    Path + Filename: src/desktop/components/maincontent/settings/configRow.tsx
*/

import React, {KeyboardEvent, useState} from 'react'
import styled from 'styled-components'
import {Champion} from '../desktop/components/maincontent/settings/Champion'
import {useAppDispatch} from '@utils/hooks'
import {updateChamp} from '../background/store/slice'
import Collapsible from 'react-collapsible'
import {PlusCircleTwoTone} from '@ant-design/icons'
import {
	TagGroup,
	Tag
} from 'rsuite'
import './rsuite.css'
import './sass/main.css'
import type {MenuProps} from 'antd'
import {Dropdown, Space} from 'antd'
import 'antd/dist/reset.css'
import {Color} from 'react-bootstrap/types'
import {TypeAttributes} from 'rsuite/esm/@types/common'

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
	allChamps: Champion[],
}

function ConfigRowTrigger(props: PropsType) {
	const [opScoreUser, setOpScoreUser] = useState<string>(props.opScoreUser.toString())
	const dispatch = useAppDispatch()

	function handleOnChange({target}: {target: HTMLInputElement}) {
		if (!target || (!(/^[0-9]+$/.test(target.value)) && target.value != ''))
			return
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
		}
	}

	function handleOnBlur({target}: {target: HTMLInputElement}) {
		const valueEntered = target.value
		if (valueEntered === '') {
			setOpScoreUser('' + 50)
			dispatch(updateChamp({
				champName: props.champName,
				champUserScore: 50
			}))
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

	//TODO CSS change the cursor ?

	return (
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
	)
}

function ConfigRow(props: PropsType) {
	//TODO do react-virtuoso and increase the range to check the vh othersize
	// it rerender when opening accordion

	const [tags, setTags] = useState<{name: string, color: string}[]>([])

	const removeTag = tag => {
		const nextTags = tags.filter(item => item !== tag)
		setTags(nextTags)
	}

	const addTag = (text: string, color: string) => {
		const nextTags = [...tags, {name: text, color: color}]
		setTags(nextTags)
	}

	const renderDropDownPlusButton = () => {

		const items: MenuProps['items'] = [
			{
				key: '1',
				label: 'Tank',
				onClick: () => {addTag('Tank', 'cyan')}
			},
			{
				key: '2',
				label: 'Potential Zonyah owner',
				onClick: () => {addTag('Potential Zonyah owner', 'cyan')}
			},
			{
				key: '3',
				label: 'Strong against',
				children: [
					{
						key: '3-1',
						label: 'Tank',
						onClick: () => {addTag('Strong against Tank', 'green')}
					},
					{
						key: '3-2',
						label: 'Potential Zonyah owner',
						onClick: () => {addTag('Strong against Potential Zonyah owner', 'green')}
					}
				]
			},
			{
				key: '4',
				label: 'Weak against',
				children: [
					{
						key: '4-1',
						label: 'Tank',
						onClick: () => {addTag('Weak against Tank', 'red')}
					},
					{
						key: '4-2',
						label: 'Potential Zonyah owner',
						onClick: () => {addTag('Weak against Potential Zonyah owner', 'red')}
					}
				]
			}
		]


		return (
			<Dropdown menu={{items}} trigger={['click']}>
				<a onClick={(e) => e.preventDefault()}>
					<Space>
						<PlusCircleTwoTone style={{
							fontSize: '24px',
							margin: '11px 0 0 6px'
						}} />
					</Space>
				</a>
			</Dropdown>
		)
	}


	return (
		<Collapsible
			transitionTime={10}
			lazyRender={true}
			overflowWhenOpen={'visible'}
			trigger={
				<ConfigRowTrigger
					champName={props.champName}
					opScoreCSW={props.opScoreCSW}
					opScoreUser={props.opScoreUser}
					allChamps={props.allChamps}
				/>
			}>
			<TagGroup style={{display: 'flex', flexWrap: 'wrap'}}>
				{tags.map((tag, i) => (
					<Tag
						key={i} closable
						onClose={() => removeTag(tag)}
						color={tag.color as TypeAttributes.Color}
					>
						{tag.name}
					</Tag>
				))}
				{renderDropDownPlusButton()}
			</TagGroup>
		</Collapsible>
	)
}

export default ConfigRow
