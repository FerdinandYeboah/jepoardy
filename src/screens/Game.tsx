import React, { CSSProperties, useState, useEffect } from 'react';
import { Table } from 'antd';

import { hardcodedScoreBoardColumns, hardcodedScoreBoardData, hardcodedGameBoardColumns, hardcodedGameBoardData } from '../models/HardcodedData'
import { RouteComponentProps } from 'react-router';
import { useGlobalContext } from '../context/globalContext';
import { RoomFrontendModel, RoomBackendModel, Player } from '../models/Room';
import { UserJoinedGame } from '../models/Events';
import { ScoreBoardModel, convertRoomModelBE2ScoreBoard, GameBoardModel, convertRoomModelBE2GameBoard } from '../models/Game';

// Styles
const gridContainer = {
  width: "80VW",
  maxWidth: "700px",
  // above makes 800px fixed but then 80VW if goes screen size goes under 800px.",
  height: "80VH",
  display: "grid",
  gridTemplateAreas: 
  `
      "scoreboard scoreboard scoreboard scoreboard"
      "gameboard  gameboard  gameboard  gameboard"
      "gameboard  gameboard  gameboard  gameboard"
  `,
  // margin: "auto", //This centers horizontally and seems to center children too.
  // border: "3px solid blue",
  // Below centers both 
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
} as CSSProperties

const scoreBoardStyle = {
  gridArea: "scoreboard",
  // border: "3px solid black",
  // justifySelf: "center",
  // alignSelf: "center"
  // Use below to center and keep width
  // width: "100%",
  // position: "absolute",
  // top: "50%",
  // left: "50%",
  // transform: "translate(-50%, -50%)"

} as CSSProperties

const gameBoardStyle = {
  gridArea: "gameboard",
  // border: "3px solid black",
  // width: "50%",
  // justifySelf: "center",
  // alignSelf: "center"
  // position: "absolute",
  // top: "50%",
  // left: "50%",
  // transform: "translate(-50%, -50%)"
} as CSSProperties


export default function Game(routerState: RouteComponentProps) {
  const { socket } = useGlobalContext();
  const [game, setGame] = useState<RoomBackendModel>();

  //Initialization logic
  useEffect(function(){
    setUp();
  }, [])

  function setUp(){
    //Hard cast since I expect this type
    const game: RoomBackendModel = routerState.location.state as RoomBackendModel

    setGame(game);
  }

  return (
    <div style={gridContainer}>

      <div style={scoreBoardStyle}>
        <ScoreBoard {...convertRoomModelBE2ScoreBoard(game)}></ScoreBoard>
      </div>


      <div style={gameBoardStyle}>
        <GameBoard {...convertRoomModelBE2GameBoard(game)}></GameBoard>
      </div>

    </div>
  );
}

function GameBoard(gameBoardModel: GameBoardModel){

  return (
    <Table bordered pagination={false} columns={gameBoardModel.columns} dataSource={gameBoardModel.data}/>
  )
}


function ScoreBoard(scoreBoardModel: ScoreBoardModel){

  return (
    <Table bordered={true} pagination={false} columns={scoreBoardModel.columns} dataSource={scoreBoardModel.data}/>
  )
}