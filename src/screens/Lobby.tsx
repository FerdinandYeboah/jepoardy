import React from 'react';

import { Table, Tag } from 'antd';

const { Column, ColumnGroup } = Table;

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
  }
];

const data = [
  {
    key: '1',
    name: 'Ferdinand\'s room',
    numPlayers: 5,
    topic: "New Testament",
    status: "In Game",
    // join: 'TBD'
  },
  {
    key: '2',
    name: 'The Way',
    numPlayers: 5,
    topic: "New Testament",
    status: "In Game",
    // join: 'TBD'
  },
  {
    key: '3',
    name: 'LezzGo',
    numPlayers: 3,
    topic: "The Torah",
    status: "In Lobby",
    // join: 'TBD'
  },
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
      "lobby  lobby  lobby  lobby"
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

export default function Lobby() {
  return (
    <div style={gridContainer}>

      {/* HEADING */}
      <h1 style={headerStyle}>Welcome to the Lobby</h1>

      {/* ROOM TABLE */}
      <div style={roomListStyle}>
        <Table columns={columns} dataSource={data}/>
      </div>

    </div>
  );
}