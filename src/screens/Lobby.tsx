import React, { useState, useEffect, MouseEvent } from 'react';

import { Table, Button } from 'antd';
import { useGlobalContext } from '../context/globalContext';
import { RoomFrontendModel, RoomBackendModel, convertRoomModelListBE2FE, State } from '../models/Room';
import { Redirect } from 'react-router';
import { UserJoinedGame } from '../models/Events';


// Styles
const gridContainer = {
  width: "80VW",
  height: "80VH",
  display: "grid",
  gridTemplateAreas: 
  `
      "header header header header"
      "roomList   roomList   roomList   roomList"
      "roomList   roomList   roomList   roomList"
      "createRoom  createRoom  createRoom  createRoom"
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

const roomListStyle = {
  gridArea: "roomList",
  // border: "3px solid black",
  justifySelf: "center",
  // alignSelf: "center"
};

const createRoomButtonStyle = {
  gridArea: "createRoom",
  // border: "3px solid black",
  justifySelf: "center",
  // alignSelf: "center"
};

export default function Lobby() {

  const { socket, rooms } = useGlobalContext(); //rooms: RoomFrontendModel[]
  const [redirectToCreateRoom, setRedirectToCreateRoom] = useState<Boolean>();
  const [redirectToWaitingRoom, setRedirectToWaitingRoom] = useState<Boolean>();
  const [selectedRoom, setSelectedRoom] = useState<RoomFrontendModel>();

  function openCreateRoom(){
    console.log("Clicked create room")
    setRedirectToCreateRoom(true);
  }

  if (redirectToCreateRoom){
    return <Redirect to={"/create-room"}/>
  }

  function spectateGame(){
    console.log("Spectating games not implemented yet...")
  }

  function joinGame(room: RoomFrontendModel, event: MouseEvent<HTMLButtonElement>){
    console.log("Joining waiting room...")
    console.log("Game: ", room)

    //Move to waiting room - where will join the game
    setSelectedRoom(room);

    let joinedEvent: UserJoinedGame = {
      gameId: room.id
    }

    //Emit event to add player to game
    socket.emit("userJoinedGame", joinedEvent, function(success: Boolean){
      if (success){
        //Move to waiting room - where will join the game
        setRedirectToWaitingRoom(true);
      }
      else {
        alert("Joining game failed. Please try again.")
      } 
    })

  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Players',
      dataIndex: 'numPlayers',
      key: 'numPlayers',
    },
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: function(text: any, record: RoomFrontendModel, index: any){
        switch(record.status) {
          case State.GAME:
            return "In Game"
          case State.LOBBY:
            return "In Lobby"
        }
      }
    },
    {
      title: 'Action',
      render: function(text: any, record: RoomFrontendModel, index: any){
        // console.log("Text: ", text, "Record: ", record, "Index: ", index)
        if (record.status === State.GAME){
          return (
            <Button onClick={spectateGame}>Spectate</Button>
          )
        }
        else if (record.status === State.LOBBY) {
          return (
            <Button type="primary" onClick={joinGame.bind(joinGame, record)}>Join</Button>
          )
        }
      }
    }
  ];

  if (redirectToWaitingRoom && selectedRoom !== undefined){
      return <Redirect to={{
        pathname: "/waiting-room",
        state: {
          ...selectedRoom
          // room: selectedRoom, 
          // gameId: selectedRoom.id,
          // name: selectedRoom.name
        } //Could alternatively use query params instead
      }}/>
  }

  return (
    <div style={gridContainer}>

      {/* HEADING */}
      <h1 style={headerStyle}>Welcome to the Lobby</h1>

      {/* ROOM TABLE */}
      <div style={roomListStyle}>
        <Table columns={columns} dataSource={rooms}/>
      </div>

      <div style={createRoomButtonStyle}>
        <Button type="danger" onClick={openCreateRoom}>Create Room</Button>
      </div>

    </div>
  );
}