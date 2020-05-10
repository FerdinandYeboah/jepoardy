import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Upload, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { TopicBackendModel } from '../models/Topic';
import { httpService } from '../service/HttpService';
import { RoomCreated, UserJoinedGame } from '../models/Events';
import { useGlobalContext } from '../context/globalContext';
import { Redirect } from 'react-router';
import { RoomFrontendModel, RoomBackendModel, convertRoomModelBE2FE } from '../models/Room';

const { Option } = Select;

// const {  } = Form

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

// Styles
const gridContainer = {
  width: "80VW",
  height: "80VH",
  display: "grid",
  gridTemplateAreas: 
  `
      "header header header header"
      "createRoom   createRoom   createRoom   createRoom"
      "createRoom   createRoom   createRoom   createRoom"
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

const createRoomFormStyle = {
  gridArea: "createRoom",
  // border: "3px solid black",
  justifySelf: "center"
}

export default function CreateRoom() {

  let { socket } = useGlobalContext(); 

  const [topics, setTopics] = useState<TopicBackendModel[]>(); 
  const [room, setRoom] = useState<RoomFrontendModel>(); 
  const [redirectToLobby, setRedirectToLobby] = useState<Boolean>(); 
  const [redirectToWaitingRoom, setRedirectToWaitingRoom] = useState<Boolean>(); 

  //Initialization logic, getting topics. Consider storing globally once.
  useEffect(() => {
    setup()
  }, [])

  async function setup(){
    console.log("Getting list of topics...");

    //Make HTTP call with typed axios. Can be a service. Either use await or read the returned promise
    let response: TopicBackendModel[] = await httpService.getTopicsList();
    console.log("topics: ", response);

    //Use topics to construct select? Or maybe just set topics and read in select
    setTopics(response);

    //Set up listener for created room response
    socket.on("createdRoomResponse", autoJoinRoom)
  }

  const onFinish = (values: any) => {
    console.log('Success:', values);
  
    //Send request to create a room
    let room: RoomCreated = {
      roomName: values.roomName,
      fileId: values.topic
    }
  
    socket.emit("roomCreated", room);
  
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  function autoJoinRoom(room: RoomBackendModel){
    //Move into room screen - auto "join" - Set redirect
    setRoom(convertRoomModelBE2FE(room, room.id));

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

  function goBackToLobby(){
    console.log("Clicked go back to lobby")
    setRedirectToLobby(true);
  }

  if (redirectToWaitingRoom && room !== undefined){
    return <Redirect to={{
      pathname: "/waiting-room",
      state: {
        ...room
      } //Could alternatively use query params instead
    }}/>
}

  if (redirectToLobby){
    return <Redirect to={"/lobby"}/>
  }

  return (
    <div style={gridContainer}>

      {/* HEADING */}
      <h1 style={headerStyle}>Create Your Room</h1>

      {/* NAME INPUT */}
      <div style={createRoomFormStyle}>
        <Form
          {...layout}
          name="basic"
          initialValues={{}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed} >

          <Form.Item
            label="Room Name"
            name="roomName"
            rules={[{ required: true, message: 'Please enter room name!' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Topic"
            name="topic"
            rules={[{ required: true, message: 'Please select from the available topics!' }]}>
            <Select
              placeholder="Choose topic"
              onChange={() => {}}
              allowClear>
                {topics ? 
                  topics.map(item => {
                    return <Option value={item.fileId} key={item.fileId}>{item.topic}</Option>
                  }) 
                  : 
                  <Option value="empty">Loading...</Option>}
            </Select>
          </Form.Item>

          <br/> <br/> <br/>


          <Form.Item {...tailLayout}>
            <Button type="default" onClick={goBackToLobby}>
              Back
            </Button>

            <Divider type="vertical" />
            
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>

        </Form>
      </div>

    </div>
  );
}