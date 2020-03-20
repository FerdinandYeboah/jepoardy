import React, { CSSProperties } from 'react';
import { GameQuestionModel } from '../../models/GameQuestionModel';

// Styles
const flexContainer = {
  width: "80VW",
  maxWidth: "700px",
  // above makes 800px fixed but then 80VW if goes screen size goes under 800px.",
  // textAlign: "center",
  // verticalAlign: 
  height: "80VH",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: "1px solid black",
  // Use flex for this container
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

  return (
    <div style={flexContainer}>

      <div style={answersFlexContainer}>
        <h1>{question}</h1>

        <ol>
          {answers.map((answer) => {
            return <li>{answer}</li>
          })}
        </ol>
      </div>

    </div>
  );
}