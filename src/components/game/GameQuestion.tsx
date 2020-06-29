import React, { CSSProperties, useEffect, useState } from 'react';
import { GameQuestionModel } from '../../models/GameQuestionModel';

import { v4 as uuidv4 } from 'uuid';
import { PlayerGaveAnswer, PlayerAnsweredCorrectly, PlayerAnsweredIncorrectly, AllPlayerAnsweredIncorrectly } from '../../models/Events';
import { useGlobalContext } from '../../context/globalContext';
import { emitter } from '../../utils/EventEmitter';

// Styles
const parentContainer = {
  display: "block",
  height: "inherit",
  width: "inherit",
}

const flexContainer = {
  height: "inherit",
  width: "inherit",
  border: "1px solid black",
  // // Use flex for this container
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
} as CSSProperties

const answersFlexContainer = {
  // When leave off width and height it shrinks the container to only the necessary size, no interior space/padding
  display: "flex",
  flexDirection: "column",
} as CSSProperties

const notificationBox = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
} as CSSProperties



export default function GameQuestion(gameQuestionModel: GameQuestionModel) {

  const { socket } = useGlobalContext();
  const {question, answers} = gameQuestionModel

  //State - declarative
  let stableNotificationMessages: NotificationMessage[] = []
  const [notificationMessages, setNotificationMessages] = useState<NotificationMessage[]>([])
  
  let answerListRef = React.createRef<HTMLOListElement>();
  // Should time be a configurable property? Not sure yet, wait till implementation details.

  // Have an internal mapping between numbers and letters?

  // Should have in setup
  useEffect(function(){
    setUp()
  }, [])

  function setUp(){
    //Add keypress listeners
    document.addEventListener("keypress", answerKeyPressListener);

    //Add socket listeners
    socket.on("playerAnsweredCorrectly", handleCorrectAnswer);
    socket.on("playerAnsweredIncorrectly", handleIncorrectAnswer);
    socket.on("allPlayersAnsweredIncorrectly", handleAllIncorrectAnswers);
  }

  function handleCorrectAnswer(data: PlayerAnsweredCorrectly){
    console.log(`${data.playerName} answered correctly with ${data.correctAnswer}`);

    if (data.playerId === socket.id){
      //This player answered correctly
      setNotificationMessages(notificationMessages.concat(
        [{
          message: "You answered correctly",
          color: "green"
        }]
      ))
    }
    else {
      //Someone else answered correctly
      let message: NotificationMessage = {
        message: `${data.playerName} answered correctly with ${data.correctAnswer}`,
        color: "green"
      }

      setNotificationMessages(notificationMessages.concat(
        [message]
      ))
    }

    //Emit event
    console.log("Emitting game event: ", data.game)
    emitter.emitEvent("playerAnsweredCorrectly", [data.game])

    /*For some reason, this only seems to show on one person's screen instead of all...
    Maybe just opera? Or maybe since screen was open the component didn't update idk...*/
    highlightAnswer(data.correctAnswer, true)
  }

  function handleIncorrectAnswer(data: PlayerAnsweredIncorrectly){
    console.log(`${data.playerName} answered incorrectly`);

    highlightAnswer(data.incorrectAnswer, false)

    if (data.playerId === socket.id){
      //This player answered in incorrectly
      stableNotificationMessages = stableNotificationMessages.concat(
        [{
          message: "You answered incorrectly",
          color: "red"
        }]
      )
      setNotificationMessages(stableNotificationMessages)
    }
    else {
      //Someone else answered incorrectly
      stableNotificationMessages = stableNotificationMessages.concat(
        [{
          message: `${data.playerName} answered incorrectly`,
          color: "red"
        }]
      )
      setNotificationMessages(stableNotificationMessages)
    }

    //Emit event. Event should be playerReceivedAnswerFeedback, not updateScoreBoard. Will be consumed by scoreboard though.
    console.log("Emitting game event: ", data.game)
    emitter.emitEvent("playerAnsweredIncorrectly", [data.game])

  }

  function handleAllIncorrectAnswers(data: AllPlayerAnsweredIncorrectly){
    console.log(`All players answered incorrectly. The correct answer is ${data.correctAnswer}`);
    //All players answered incorrectly, show correct answer choice
    highlightAnswer(data.correctAnswer, true)

    setNotificationMessages(stableNotificationMessages.concat(
      [{
        message: `All players answered incorrectly. The correct answer is ${data.correctAnswer}`,
        color: "red"
      }]
    ))

    //Emit event to update scoreboard
    console.log("Emitting game event: ", data.game)
    emitter.emitEvent("allPlayersAnsweredIncorrectly", [data.game])
    
  }

  function highlightAnswer(answerChoice: string, isCorrect: boolean){
    let number: number = letterToNumber(answerChoice);

    if (answerListRef.current != null) {
      if (isCorrect){
        answerListRef.current.children[number-1].classList.add("correct")
      }
      else {
        answerListRef.current.children[number-1].classList.add("incorrect")
      }
    }
  }

  function answerKeyPressListener(event: KeyboardEvent){
    //Get key pressed
    let keyCodePressed = event.which || event.keyCode;
    let stringKey = String.fromCharCode(keyCodePressed).toUpperCase();
    console.log("Pressed: ", stringKey)

    //Validate within options (1...X)
    let numberPressed = -1;

    try {
      numberPressed = parseInt(stringKey); //Catch exception if not numeric key pressed
    }
    catch (exception){
      alert("Must press a number key")
    }

    let letterPressed = numberToLetter(numberPressed);
    console.log("Letter Pressed: ", letterPressed)
    console.log("Answers: ", answers)


    if (!Object.keys(answers).includes(letterPressed)){
      //If not a valid numeric choice
      alert(`${numberPressed} not in answer choices`)
    }

    //Convert to letter and emit answer
    let gaveAnswerEvent: PlayerGaveAnswer = {
      answer: letterPressed
    }

    socket.emit("playerGaveAnswer", gaveAnswerEvent)

  }

  function removeAnswerKeyPressListener(){
    document.removeEventListener("keypress", answerKeyPressListener);
  }

  function numberToLetter(number: number): string {
    let alpha = "0ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    //Return character at index
    return alpha.charAt(number)
  }

  function letterToNumber(letter: string): number {
    let alpha = "0ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    //Return index, if not found will return -1. Future exception handling.
    return alpha.indexOf(letter.toUpperCase());
  }




  return (
    //This onKeyPress does not seem to be working. I guess just add on document as before.
    <div style={parentContainer}>
      <div style={flexContainer}>

        <div style={answersFlexContainer}>
          <h1>{question}</h1>
    
          <ol ref={answerListRef}>
            {
              Object.keys(answers).map((letterChoice) => (
              <li key={uuidv4()}>{answers[letterChoice]}</li>
              ))
            }
          </ol>
          
        </div>

      </div>

      <div style={notificationBox}>
        {/* Could check if msgs is empty here if want to remove edge case out of notification. 
        I think best to have both in notification thought */}
        <NotificationBox messages={notificationMessages}></NotificationBox>
      </div>
    </div>
  );
}

type NotificationBoxProps = {
  messages: NotificationMessage[] | undefined;
}

type NotificationMessage = {
  message: string,
  color: string, //html5 color codes
}

function NotificationBox(props: NotificationBoxProps){

  let { messages } = props;
  
  return (
    <div>
      {
        messages ?
        messages.map((notificationMsg) => {
          return <p key={uuidv4()}>{notificationMsg.message}</p>
        })
        :
        "There are no notifications."
      }
    </div>
  )
}