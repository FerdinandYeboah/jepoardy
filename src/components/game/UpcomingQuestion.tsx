import React, { CSSProperties } from 'react';
import { UpcomingQuestionModel } from '../../models/UpcomingQuestionModel';

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



export default function UpcomingQuestion(upcomingQuestionModel: UpcomingQuestionModel) {

  const {category, value} = upcomingQuestionModel
  
  // Should time be a configurable property? Not sure yet, wait till implementation details.

  return (
    <div style={flexContainer}>
      <h1>{category}</h1>
      <h1>${value}</h1>
      <h1>Question will be shown in 3 seconds...</h1>
    </div>
  );
}
