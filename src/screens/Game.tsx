import React, { CSSProperties, useState, useEffect } from 'react';

import { hardcodedScoreBoardColumns, hardcodedScoreBoardData, hardcodedGameBoardColumns, hardcodedGameBoardData } from '../models/HardcodedData'
import { RouteComponentProps } from 'react-router';
import { useGlobalContext } from '../context/globalContext';
import { RoomFrontendModel, RoomBackendModel, Player, Question } from '../models/Room';
import { UserJoinedGame } from '../models/Events';
import { ScoreBoardModel, convertRoomModelBE2ScoreBoard, GameBoardModel, convertRoomModelBE2GameBoard, reformatQuestionsByValue, extractCategories } from '../models/Game';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

// Styles
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  cell: {
    border: "1px solid black",
    borderCollapse: "collapse",
  }
});

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

  if (!game){
    return <h1>Loading..</h1>;
  }

  return (
    <div style={gridContainer}>

      <div style={scoreBoardStyle}>
        <ScoreBoard {...game.players}></ScoreBoard>
      </div>


      <div style={gameBoardStyle}>
        <GameBoard {...game.file.questions}></GameBoard>
      </div>

    </div>
  );
}

function GameBoard(questions: Question[]){
  // Use material ui table
  const classes = useStyles();

  //For some strange reason when passed in questions becomes an object, not an array. Change it back.
  questions = Object.values(questions);

  //Get unique list of categories - Future: Sort alphabetically, needed to ensure correct mappings.
  let categories: String[] = extractCategories(questions)

  //Reformat questions to be by value - Future: Sort alphabetically, needed to ensure correct mappings.
  let valueIndexedQuestions = reformatQuestionsByValue(questions)

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {
              categories.map((category) => {
                return <TableCell className={classes.cell} align="center">{category}</TableCell>
              })
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            Object.keys(valueIndexedQuestions).map((amountKey) => (
              <TableRow>
                {
                  valueIndexedQuestions[amountKey].map((item: any) => {
                    return <TableCell className={classes.cell} align="center">${item.value}</TableCell>
                  })
                }
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}


function ScoreBoard(players: Player[]){
  // Use material ui table
  const classes = useStyles();

  //For some strange reason when passed in players becomes an object, not an array. Change it back.
  players = Object.values(players);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {
              players.map((player: Player, index: number) => (
                  <TableCell className={classes.cell} align="center">{player.name}</TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
            {
              players.map((player: Player, index: number) => (
                  <TableCell className={classes.cell} align="center">${player.score}</TableCell>
              ))
            }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

//AntDVersions - Keeping around for now, will remove later
// function GameBoardDeprecated(gameBoardModel: GameBoardModel){

//   return (
//     <Table
//       onRow={
//         (record: any) => {
//           return {
//             onClick: (event: any) => { console.log("on row: ", record)}
//           }
//         }
//       } 
//       bordered pagination={false} columns={gameBoardModel.columns} dataSource={gameBoardModel.data}/>
//   )
// }


// function ScoreBoardDeprecated(scoreBoardModel: ScoreBoardModel){

//   return (
//     <Table bordered={true} pagination={false} columns={scoreBoardModel.columns} dataSource={scoreBoardModel.data}/>
//   )
// }