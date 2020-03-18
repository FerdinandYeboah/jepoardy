import React from 'react';
import { Form, Input, Select, Button, Upload, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

// const {  } = Form

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
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
            label="User Type"
            name="userType"
            rules={[{ required: true, message: 'Please select your user type!' }]}>
            <Select
              placeholder="Are you moderatoring or playing?"
              onChange={() => {}}
              allowClear>
                <Option value="moderator">Moderator</Option>
                <Option value="player">Player</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.userType !== currentValues.userType}>

            {
              ({ getFieldValue }) => { 
                return getFieldValue("userType") === "moderator" ?
                  <Form.Item
                    label="Game File"
                    name="gameFile"
                    rules={[{ required: true, message: 'Please upload file - or use UI generation (Future)' }]}>
                      <Upload>
                        <Button>
                          <UploadOutlined /> Click to Upload
                        </Button>
                      </Upload>
                  </Form.Item>
                :
                  null
              }
            }

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