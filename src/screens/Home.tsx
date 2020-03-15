import React, { CSSProperties } from 'react';
import { Button } from 'antd';

// Styles
const gridContainer = {
  width: "80VW",
  height: "80VH",
  display: "grid",
  gridTemplateAreas: 
  `
      "header header header header"
      "name   name   name   name"
      "name   name   name   name"
      "lobby  lobby  lobby  lobby"
  `,
  margin: "auto", //This centers horizontally
  // border: "3px solid black"
}

const headerStyle = {
  gridArea: "header",
  // border: "3px solid black",
  justifySelf: "center",
  alignSelf: "center"
};

const nameStyle = {
  gridArea: "name",
  border: "3px solid black"
}

const lobbyStyle = {
  gridArea: "lobby",
  // border: "3px solid blue",
  // width: "10%", //Don't need width since justifySelf
  justifySelf: "center"
} as CSSProperties

export default function Home() {
  return (
    <div style={gridContainer}>
      <h1 style={headerStyle}>Welcome to Multi-Player Jeopardy</h1>

      <Button type="primary" style={lobbyStyle}>Enter Lobby</Button>
    </div>
  );
}