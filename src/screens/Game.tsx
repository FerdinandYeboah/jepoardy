import React, { CSSProperties, useState, useEffect, MouseEvent } from 'react';

import { hardcodedScoreBoardColumns, hardcodedScoreBoardData, hardcodedGameBoardColumns, hardcodedGameBoardData } from '../models/HardcodedData'
import { RouteComponentProps } from 'react-router';
import { useGlobalContext } from '../context/globalContext';
import { RoomFrontendModel, RoomBackendModel, Player, Question, State } from '../models/Room';
import { UserJoinedGame, PlayerClickedGameCell } from '../models/Events';
import { ScoreBoardModel, convertRoomModelBE2ScoreBoard, GameBoardModel, convertRoomModelBE2GameBoard, reformatQuestionsByValue, extractCategories } from '../models/Game';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import { v4 as uuidv4 } from 'uuid';
import UpcomingQuestion from '../components/game/UpcomingQuestion';
import GameQuestion from '../components/game/GameQuestion';

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
  const [screen, setScreen] = useState<React.ReactNode>(<h1>Loading...</h1>); //Could look into typing further. Ex: <BoardScreen> | <AwaitingQuestion> | <Question> 

  //Initialization logic
  useEffect(function(){
    setUp();
  }, [])

  function setUp(){
    //Hard cast since I expect this type
    const game: RoomBackendModel = routerState.location.state as RoomBackendModel

    setGame(game);
    setScreen(<BoardScreen players={game.players} questions={game.file.questions}></BoardScreen>)

    //Add listener for moving to question screen - All transition listeners here? Or on component that will click from? 
    socket.on("showUpcomingQuestion", renderUpcomingQuestionScreen)
    socket.on("askQuestion", renderQuestionScreen)
  }

  //Screens
  function renderUpcomingQuestionScreen(question: Question){
    console.log("Rendering upcoming question screen...")

    let questionScreen = <UpcomingQuestion category={question.category} value={parseInt(question.value)}/>
    
    setScreen(questionScreen);
    
  }

  function renderQuestionScreen(question: Question){
    console.log("Rendering question screen...")

    setScreen(<GameQuestion question={question.question} answers={question.answers}/>);
    
  }


  if (!game){
    return <h1>Loading..</h1>;
  }

  return (
    // eslint-disable-next-line no-restricted-globals
    <div>
      {screen}
    </div>
  )

}

//Could subcomponents below go into a different file or need in same file for global game state?
type BoardProps = {
  players: Player[], 
  questions: Question[]
};

function BoardScreen(props: BoardProps){

  const { players, questions } = props;

  return (
    <div style={gridContainer}>

      <div style={scoreBoardStyle}>
        <ScoreBoard {...players}></ScoreBoard>
      </div>


      <div style={gameBoardStyle}>
        <GameBoard {...questions}></GameBoard>
      </div>

    </div>
  );

}

function GameBoard(questions: Question[]){
  const { socket } = useGlobalContext();

  //Functions
  function clickedGameCell(category: string, value: string, event: MouseEvent<HTMLTableDataCellElement>){
    console.log(`ClickedGameCell: ${category} ${value}`)
  
    //Emit clicked question
    let clickCellEvent: PlayerClickedGameCell = {
      category: category,
      value: value
    }
  
    socket.emit("playerClickedGameCell", clickCellEvent)
  
    /*Add disabled class to specific game cell (e.target?) - NVM instead of doing it here.. 
    do it on the classes. Check if the question has been answered and then render */

  }

  // Use material ui table
  const classes = useStyles();

  //For some strange reason when passed in questions becomes an object, not an array. Change it back.
  questions = Object.values(questions);

  //Get unique list of categories - TODO Future: Sort alphabetically, needed to ensure correct mappings.
  let categories: String[] = extractCategories(questions)

  //Reformat questions to be by value - TODO Future: Sort alphabetically, needed to ensure correct mappings.
  let valueIndexedQuestions = reformatQuestionsByValue(questions)

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {
              categories.map((category) => {
                return <TableCell key={uuidv4()} className={classes.cell} align="center">{category}</TableCell>
              })
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            Object.keys(valueIndexedQuestions).map((amountKey) => (
              <TableRow key={uuidv4()}>
                {
                  valueIndexedQuestions[amountKey].map((item: any) => {
                    return <TableCell key={uuidv4()} className={classes.cell} align="center" onClick={clickedGameCell.bind(clickedGameCell, item.category, item.value)}>${item.value}</TableCell>
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
                  <TableCell key={uuidv4()} className={classes.cell} align="center">{player.name}</TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
            {
              players.map((player: Player, index: number) => (
                  <TableCell key={uuidv4()} className={classes.cell} align="center">${player.score}</TableCell>
              ))
            }
        </TableBody>
      </Table>
    </TableContainer>
  );
}