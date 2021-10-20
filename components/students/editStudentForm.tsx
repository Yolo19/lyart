import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, Select, Divider, Space, message } from "antd";
import axios from "axios";
import { addStudent, editStudent } from "../../lib/api";

export default function EditStudentForm(props) {
  const getStudents = props.update;
  const [form] = Form.useForm();
  const editInfo = props.editInfo;
  console.log("editInfo2", editInfo)
  const initialFormValues = {
      name: editInfo?.name,
      email: editInfo?.email,
      country: editInfo?.country,
      type: editInfo?.type.name,
      id: editInfo?.id
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { Option } = Select;

  const handleStudent = (data: {
    id: number
    name: string;
    email: string;
    country: string;
    type: string;
  })=>{
    const params = {
      ...data,
      type: parseInt(data.type),
      id: editInfo?.id,
    };
    if(!editInfo){
      addStudent(params)
      .then(()=>{
        message.success("Success to add the student")
        getStudents();
      }).catch((error)=>{
        message.error(error.response.data.msg);
      })
    } else {
      editStudent(params)
      .then(()=>{
        message.success("Success to edit the student")
        getStudents();
      }).catch((error)=>{
        message.error(error.response.data.msg);
      })
    }
  }

  
  return (
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
        onFinish={handleStudent}
        initialValues={initialFormValues}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "name is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your password!" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          name="country"
          label="Area"
          rules={[{ required: true, message: "Area is required" }]}
        >
          <Select
            //onChange={onGenderChange}
            allowClear
          >
            <Option value="China">China</Option>
            <Option value="New Zealand">New Zealand</Option>
            <Option value="Canada">Canada</Option>
            <Option value="Australia">Australia</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="type"
          label="Student Type"
          rules={[{ required: true, message: "Student Type is required" }]}
        >
          <Select
            //onChange={onGenderChange}
            allowClear
          >
            <Option value="1">Tester</Option>
            <Option value="2">Developer</Option>
          </Select>
        </Form.Item>
        <Divider />
        <Form.Item shouldUpdate={true}>
        {() => (
          <Space>
          <Button
            type="primary"
            htmlType="submit"
            onClick={props.onCancel}
          >
            {!!editInfo ? 'Update' : 'Add'}
          </Button>
          <Button type="primary" onClick={props.onCancel}>
            Cancel
          </Button>
        </Space>
        )}
          
      </Form.Item>
      </Form>
  );
}
