/*
    Path + Filename: src/desktop/components/main/myContextMenu.tsx
*/

import React, {useReducer} from 'react'
import styled from 'styled-components'
import uniqid from 'uniqid'

import ChampionProfile from '../../championProfile'
import PropTypes from 'prop-types'
import PlayerProfile from '@utils/playerProfile'
import {useSettings} from '@utils/hooks'

const PercentageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  padding: 10px;
  background: -webkit-linear-gradient(#a8540c, #b79e4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const WinrateLine = styled.div`
  height: 2px;
  width: 50px;
  background: ${props => props.isLeft ?
          'linear-gradient(to left, red, transparent 100%);' :
          'linear-gradient(to right, red, transparent 100%);'
  }
  ${props => props.isLeft ? 'margin-right: 10px;' : 'margin-left: 10px;'}
`

const MainContainer = styled.div`
  color: white;
  width: 100%;
  text-align: center;
  background: linear-gradient(to right, #252424, #363636, #252424);
  padding-bottom: 10px;
`

const PlayersGrid = styled.div`
  display: flex;
  justify-content: space-between;
`

const TeamGrid = styled.div`
  display: flex;
  flex-direction: column;
`

const ProfileLine = styled.div`
  height: 2px;
  width: 100% - 10px;
  background: ${props => props.isEnemyTeam ?
          'linear-gradient(to left, #785a28, transparent 100%)' :
          'linear-gradient(to right, #785a28, transparent 100%)'};
  transform: scale(var(--ggs,1));
  margin: 10px
  ${props => props.isEnemyTeam ? '10px' : '0px'}
  10px
  ${props => props.isEnemyTeam ? '0px' : '10px'};

  &:after,
  &:before {
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 6px;
    height: 6px;
    border: 2px solid;
    bottom: -2px;
    transform: rotate(45deg);
    background: transparent;
    color: #785a28;
  }

  //Right side
  &:before {
    content: ${props => props.isEnemyTeam ? `''` : 'none'};
    right: -4px;
  };

  //Left side
  &:after {
    content: ${props => props.isEnemyTeam ? 'none' : `''`};
    left: -4px;
  };
`

function Main(props) {
    const { settings } = useSettings()
    const [, forceUpdate] = useReducer(x => x + 1, 0)

    function syncScores(isEnemyTeam, champName, i) {
        if (champName == 'Champion Name') // TODO careful if i change the default name one day
            return
        const champScore = isEnemyTeam ? props.playerProfile.enemies[i].score : props.playerProfile.allies[i].score
        console.log(champScore)
        const champFromConfig = settings.getChampCurrConfig(champName)
        console.log(champFromConfig)
        if (champFromConfig) {
            if (champScore != champFromConfig.opScore_user) {
                if (isEnemyTeam)
                    props.playerProfile.enemies[i].score = champFromConfig.opScore_user
                else
                    props.playerProfile.allies[i].score = champFromConfig.opScore_user
                forceUpdate()
            }
        }
    }

    function renderPlayersGrid(isEnemyTeam) {
        const profiles = []
        for (let i = 0; i < 5; ++i) {
            const img = isEnemyTeam ? props.playerProfile.enemies[i].img : props.playerProfile.allies[i].img
            const champName = isEnemyTeam ? props.playerProfile.enemies[i].name : props.playerProfile.allies[i].name
            syncScores(isEnemyTeam, champName, i)
            const champScore = isEnemyTeam ? props.playerProfile.enemies[i].score : props.playerProfile.allies[i].score
            profiles.push(<ChampionProfile isEnemyTeam={isEnemyTeam} key={uniqid()} img={img} champName={champName} champScore={champScore}/>)
            if (i < 4)
                profiles.push(<ProfileLine isEnemyTeam={isEnemyTeam} key={uniqid()}/>)
        }
        return <div>{profiles}</div>
    }

    function computeWinrate(allies, enemies) : number {
        let sumAllies = 0
        let sumEnemies = 0
        for (const elem of allies) {
            sumAllies += elem.score
        }
        for (const elem of enemies) {
            sumEnemies += elem.score
        }
        return ((sumAllies / 5 - sumEnemies / 5) / 2 + 50)
    }
    const winrate = computeWinrate(props.playerProfile.allies, props.playerProfile.enemies)

    return (
        <MainContainer>
            <PercentageContainer>
                <WinrateLine isLeft/>
                <h1>{winrate}%</h1>
                <WinrateLine/>
            </PercentageContainer>
            <PlayersGrid>
                <TeamGrid>
                    {renderPlayersGrid(false)}
                </TeamGrid>
                <TeamGrid>
                    {renderPlayersGrid(true)}
                </TeamGrid>
            </PlayersGrid>
        </MainContainer>
    )
}

Main.propTypes = {
    playerProfile: PropTypes.instanceOf(PlayerProfile),
}

export default Main