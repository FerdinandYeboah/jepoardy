import React from 'react';

import { Button, Divider } from "antd";

import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'

// Styles
const gridContainer = {
  width: "80VW",
  height: "80VH",
  display: "grid",
  gridTemplateAreas: 
  `
      "header header header header"
      "waitingRoom   waitingRoom   waitingRoom   waitingRoom"
      "waitingRoom   waitingRoom   waitingRoom   waitingRoom"
      "create  create  create  create"
  `,
  margin: "auto", //This centers horizontally and seems to center children too.
  // border: "3px solid black"
}

const headerStyle = {
  gridArea: "header",
  // border: "3px solid black",
  justifySelf: "center",
  alignSelf: "center"
};

const waitingRoomStyle = {
  gridArea: "waitingRoom",
  // border: "3px solid black",
  // width: "50%",
  justifySelf: "center",
  // alignSelf: "center"
};


export default function WaitingRoom() {
  return (
    <div style={gridContainer}>

      {/* HEADING */}
    <h1 style={headerStyle}> [X]'s Room </h1>

    <div style={waitingRoomStyle}>
      <Player name="Ferdinand" ready={true}></Player>
      <Player name="Michael" ready={false}></Player>


      <br/><br/><br/>
      <Button type="default">
        LEAVE
      </Button>

      <Divider type="vertical" />
      
      <Button type="primary">
        READY
      </Button>
    </div>
    
    </div>
  );
}


function Player(props: any){
  const name: String = props.name
  const ready: Boolean = props.ready

  return (
    <div>
      {/* <Avatar size="large" style={{ color: 'white', backgroundColor: 'blue' }}> {name.substring(0,2)} </Avatar>  */}
      <span style={{ fontSize: '24px'}}> {name} </span>
      {ready ? <CheckCircleOutlined style={{ fontSize: '24px', color: 'green' }}/> : <LoadingOutlined style={{ fontSize: '24px', color: 'blue' }}/>}
    </div>
  )
}