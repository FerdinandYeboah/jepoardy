import React from 'react';

import { Table, Button } from 'antd';

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
  },
  {
    title: 'Action',
    render: function(text: any, record: any, index: any){
      // console.log("Text: ", text, "Record: ", record, "Index: ", index)
      if (record.status === "In Game"){
        return (
          <Button>Spectate</Button>
        )
      }
      else {
        return (
          <Button type="primary">Join</Button>
        )
      }
    }
  }
];

const tempData = [
  {
    key: '1',
    name: 'Ferdinand\'s room',
    numPlayers: 5,
    topic: "New Testament",
    status: "In Game",
  },
  {
    key: '2',
    name: 'The Way',
    numPlayers: 5,
    topic: "New Testament",
    status: "In Game",
  },
  {
    key: '3',
    name: 'LezzGo',
    numPlayers: 3,
    topic: "The Torah",
    status: "In Lobby",
  }
];

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
  return (
    <div style={gridContainer}>

      {/* HEADING */}
      <h1 style={headerStyle}>Welcome to the Lobby</h1>

      {/* ROOM TABLE */}
      <div style={roomListStyle}>
        <Table columns={columns} dataSource={tempData}/>
      </div>

      <div style={createRoomButtonStyle}>
        <Button type="danger">Create Room</Button>
      </div>

    </div>
  );
}