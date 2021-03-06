import React, { CSSProperties, useState, useEffect, MouseEvent } from 'react';

import { hardcodedScoreBoardColumns, hardcodedScoreBoardData, hardcodedGameBoardColumns, hardcodedGameBoardData } from '../models/HardcodedData'
import { RouteComponentProps, Redirect } from 'react-router';
import { useGlobalContext } from '../context/globalContext';
import { RoomFrontendModel, RoomBackendModel, Player, Question, State } from '../models/Room';
import { UserJoinedGame, PlayerClickedGameCell, GameOver } from '../models/Events';
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
import { emitter } from '../utils/EventEmitter';
import { notification } from 'antd';

// Styles
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  cell: {
    border: "1px solid black",
    borderCollapse: "collapse",
  },
  controller: {
    backgroundColor: "slateblue"
  },
  blankCell: {
    backgroundColor: "white",
    color: "white",
    cursor: "no-drop"
  }
});

const gridContainer = {
  width: "80VW",
  maxWidth: "700px",
  // above makes 800px fixed but then 80VW if goes screen size goes under 800px.",
  height: "80VH",
  display: "grid",
  // gridTemplateAreas: 
  // `
  //     "scoreboard scoreboard scoreboard scoreboard"
  //     "gameboard  gameboard  gameboard  gameboard"
  //     "gameboard  gameboard  gameboard  gameboard"
  // `,
  gridTemplateRows: "1fr 3fr", //1st item 25% row height 2nd 75% row height.
  // margin: "auto", //This centers horizontally and seems to center children too.
  // border: "3px solid blue",
  // Below centers both 
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
} as CSSProperties

const scoreBoardStyle = {
  // gridArea: "scoreboard",
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

const innerComponentStyle = {
  // maxHeight: "40VH", //If want to limit question box height.
  height: "30VH",
} as CSSProperties

const gameBoardStyle = {
  // gridArea: "gameboard",
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
  const [redirectToWaitingRoom, setRedirectToWaitingRoom] = useState<Boolean>();
  const [newGame, setNewGame] = useState<RoomBackendModel>();


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
    socket.on("showGameBoard", renderGameBoard)
    socket.on("gameOver", handleGameOver)

    //Add event emitter listeners. Seems possible to use addListeners and pass object to add multiple events to a listener.
    emitter.addListener("playerAnsweredCorrectly", updateGame)
    emitter.addListener("playerAnsweredIncorrectly", updateGame)
    emitter.addListener("allPlayersAnsweredIncorrectly", updateGame)

  }
  
  //Redirects
  //If could imperatively (by command, not state) trigger redirect, then would not need newGame variable. 
  //But react is designed to work declaratively (by state, will always resolve to end state)
  if (redirectToWaitingRoom && newGame !== undefined){ 
    return <Redirect to={{
      pathname: "/waiting-room",
      state: {
        ...newGame
      }
    }}/>
  }

  function updateGame(game: RoomBackendModel){
    console.log("Updating game with...: ", game)
    setGame(game)
  }

  function handleGameOver(gameOverResponse: GameOver){
    let { game, winners } = gameOverResponse

    let winnerNames = winners.map((winner: Player) => {
      return winner.name
    })
    console.log("Game over response: ", game)
    openNotification("Game Over!", `The winners are ${winnerNames.join(",")}`)

    //Redirect back to waiting room, race condition will be here if I don't ensure game variable gets updated first
    setTimeout(() => {
      setNewGame(game);
      setRedirectToWaitingRoom(true);
    }, 5000)
    
  }

  const openNotification = (title: string, description: string) => {
    notification.open({
      message: title,
      description:
        description,
    });
  };

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

  function renderGameBoard(game: RoomBackendModel){
    console.log("Rendering game board screen...")

    setScreen(<BoardScreen players={game.players} questions={game.file.questions}></BoardScreen>);
    
  }


  if (!game){
    return <h1>Loading..</h1>;
  }

  return (
    // eslint-disable-next-line no-restricted-globals
    <div style={gridContainer}>
      <div style={scoreBoardStyle}>
        <ScoreBoard players={game.players} controllingPlayerId={game.controllingPlayerId}></ScoreBoard>
      </div>

      <div style={innerComponentStyle}>
        {screen}
      </div>
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
    <div style={gameBoardStyle}>
      <GameBoard {...questions}></GameBoard>
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
                    let classNm = item.hasBeenAnswered ? `${classes.cell} ${classes.blankCell}` : classes.cell;
                    return <TableCell key={uuidv4()} className={classNm} align="center" onClick={clickedGameCell.bind(clickedGameCell, item.category, item.value)}>${item.value}</TableCell>
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


type ScoreBoardProps = {
  players: Player[], 
  controllingPlayerId: string
};

function ScoreBoard(props: ScoreBoardProps){

  let { players, controllingPlayerId } = props;  

  // Use material ui table
  const classes = useStyles();

  //For some strange reason when passed in players becomes an object, not an array. Change it back.
  // players = Object.values(players);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {
              players.map((player: Player, index: number) => {
                  console.log("player.id: ", player.id, "controllerId: ", controllingPlayerId);
                  let classNm = player.id === controllingPlayerId ? `${classes.cell} ${classes.controller}` : classes.cell;
                  return <TableCell key={uuidv4()} className={ classNm } align="center">{player.name}</TableCell>
              })
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