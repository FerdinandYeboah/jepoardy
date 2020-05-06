import React, { useEffect, useState } from 'react';

import { Button, Divider } from "antd";

import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { RoomFrontendModel, Player } from '../models/Room';
import { RouterProps, RouteComponentProps } from 'react-router';
import { useGlobalContext } from '../context/globalContext';
import { UserJoinedGame } from '../models/Events';

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


export default function WaitingRoom(routerState: RouteComponentProps) {
  const { socket } = useGlobalContext();
  const [room, setRoom] = useState<RoomFrontendModel>();

  //Initialization logic
  useEffect(function(){
    setUp();
  }, [])

  function setUp(){
    //Hard cast since I expect this type
    const passedRoom: RoomFrontendModel = routerState.location.state as RoomFrontendModel
    console.log("Room: ", passedRoom);

    setRoom(passedRoom);

    let joinedEvent: UserJoinedGame = {
      gameId: passedRoom.id
    }

    //Emit event to add player to game
    socket.emit("userJoinedGame", joinedEvent)

    //Set up socket listeners for new players joining, leaving, etc... Emitted for all players in this game
    socket.on("userListUpdated", updateUserList)
  }

  function updateUserList(users: Player[]){ //Will pass all users in game.
    console.log("Users: ", users);
  }

  return (
    <div style={gridContainer}>

      {/* HEADING */}
    <h1 style={headerStyle}> [X]'s Room </h1>

    <div style={waitingRoomStyle}>
      <PlayerComponent name="Ferdinand" ready={true}></PlayerComponent>
      <PlayerComponent name="Michael" ready={false}></PlayerComponent>


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


function PlayerComponent(props: any){
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