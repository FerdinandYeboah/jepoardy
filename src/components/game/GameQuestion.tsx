import React, { CSSProperties } from 'react';
import { GameQuestionModel } from '../../models/GameQuestionModel';

import { v4 as uuidv4 } from 'uuid';

// Styles
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



export default function GameQuestion(gameQuestionModel: GameQuestionModel) {

  const {question, answers} = gameQuestionModel
  
  // Should time be a configurable property? Not sure yet, wait till implementation details.

  // Have an internal mapping between numbers and letters?

  return (
    <div style={flexContainer}>

      <div style={answersFlexContainer}>
        <h1>{question}</h1>
  
        <ol>
          {
            Object.keys(answers).map((letterChoice) => (
            <li key={uuidv4()}>{answers[letterChoice]}</li>
            ))
          }
        </ol>
        
      </div>

    </div>
  );
}