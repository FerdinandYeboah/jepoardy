import React, { useEffect, useState } from 'react';

import { Button, Divider } from "antd";

import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { RoomFrontendModel, Player, PlayerReadyStatus, RoomBackendModel } from '../models/Room';
import { RouterProps, RouteComponentProps, Redirect } from 'react-router';
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
  const [game, setGame] = useState<RoomBackendModel>();
  const [users, setUsers] = useState<Player[]>();
  const [redirectToLobby, setRedirectToLobby] = useState<Boolean>();
  const [redirectToGame, setRedirectToGame] = useState<Boolean>();

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

    /*Hmm.. I see the difficulty that will not get an inital user list when joining. Could be passed in..
      This actually resulted in a react warning that can't perform update on unmounted component,
      still suprised it works and the initial user list is shown as opposed to when another user joins or leaves.
    */

    //Set up socket listeners for new players joining, leaving, etc... Emitted for all players in this game
    socket.on("userListUpdated", updateUserList)

    socket.on("startGame", startGame)
  }

  function updateUserList(users: Player[]){ //Will pass all users in game.
    console.log("Users: ", users);
    setUsers(users);
  }

  function readyUp(){
    socket.emit("playerReadiedUp");
  }

  function leaveRoom(){
    socket.emit("playerLeftRoom", function(success: boolean){
      if (success === true){
        //Go back to lobby
        setRedirectToLobby(true);
      }
      else {
        //Alert player leaving failed so try again.
        alert("Leaving failed. Please try again.")
      }
    });
  }

  function startGame(){
    /*Get full game data and navigate to game board screen*/

    //Make api call to get the full game data - Could be socket endpoint too...
    socket.emit("currentRoomRequested", function(game: RoomBackendModel){
      setGame(game);
      setRedirectToGame(true);
    })
    
  }

  if (redirectToLobby){
    return <Redirect to={"/lobby"}/>
  }

  if (redirectToGame && game !== undefined){
    return <Redirect to={{
      pathname: "/game-board",
      state: {
        ...game
      },
    }}/>
  }

  return (
    <div style={gridContainer}>

      {/* HEADING */}
    <h1 style={headerStyle}> {room ? room.name : "Room"} </h1>

    <div style={waitingRoomStyle}>
      {
        users ?
          users.map(user => {
            return <PlayerComponent name={`${user.name}`} ready={user.status === PlayerReadyStatus.READY}></PlayerComponent>
          })
          :
          "No players currently in room..."
      }


      <br/><br/><br/>
      <Button type="default" onClick={leaveRoom}>
        LEAVE
      </Button>

      <Divider type="vertical" />
      
      <Button type="primary" onClick={readyUp}>
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