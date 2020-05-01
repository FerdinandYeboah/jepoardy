import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Upload, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { TopicBackendModel } from '../models/Topic';
import { httpService } from '../service/HttpService';
import { RoomCreated } from '../models/Events';
import { useGlobalContext } from '../context/globalContext';

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
  }

  const onFinish = (values: any) => {
    console.log('Success:', values);
  
    //Send request to create a room
    let room: RoomCreated = {
      roomName: values.roomName,
      fileId: values.topic
    }
  
    socket.emit("roomCreated", room);
  
    //Move into room screen - auto "join"
  
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

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
            <Button type="default">
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