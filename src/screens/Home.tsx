import React from 'react';
import { Button } from 'antd';

import { Form, Input } from 'antd';
import { useGlobalContext } from '../context/globalContext';
import { UserJoined } from '../models/Events';

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
  // border: "3px solid black",
  justifySelf: "center"
}


export default function Home() {
  const { socket } = useGlobalContext();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  
    // Create a userJoined Event
    const userJoined: UserJoined = {
      name: values.username
    }

    // Convert to json and emit. Looks like I did not even have to convert to json
    socket.emit("userJoined", userJoined);

  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={gridContainer}>

      {/* HEADING */}
      <h1 style={headerStyle}>Welcome to Multi-Player Jeopardy</h1>

      {/* NAME INPUT */}
      <div style={nameStyle}>
        <Form
          {...layout}
          name="basic"
          initialValues={{}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed} >

            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}>
              <Input />
            </Form.Item>

            <br/> <br/> <br/>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Enter Lobby
              </Button>
            </Form.Item>
          </Form>
        </div>

    </div>
  );
}