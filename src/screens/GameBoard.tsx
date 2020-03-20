import React, { CSSProperties } from 'react';
import { Table } from 'antd';

import { hardcodedScoreBoardColumns, hardcodedScoreBoardData, hardcodedGameBoardColumns, hardcodedGameBoardData } from '../models/HardcodedData'

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


export default function GameBoard() {
  return (
    <div style={gridContainer}>

      <div style={scoreBoardStyle}>
        <ScoreBoard></ScoreBoard>
      </div>


      <div style={gameBoardStyle}>
        <Table bordered pagination={false} columns={hardcodedGameBoardColumns} dataSource={hardcodedGameBoardData}/>
      </div>

    </div>
  );
}


function ScoreBoard(props: any){

  return (
    // <div>
    //   ScoreBoard
    // </div>
    <Table bordered={true} pagination={false} columns={hardcodedScoreBoardColumns} dataSource={hardcodedScoreBoardData}/>
  )
}