import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, Select, Divider } from "antd";
import axios from "axios";

export default function EditStudentForm(props) {
  const[isShow, setShow] = useState(props.visible);
  const editInfo = props.editInfo;
  const initialFormValues = {
      name: editInfo?.name,
      email: editInfo?.email,
      country: editInfo?.country,
      type: editInfo?.type.name,
      id: editInfo?.id
  };

  useEffect(()=>{
    setShow(props.visible);
  },[props.visible])

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { Option } = Select;

  const addStudent = (data: {
    id: number
    name: string;
    email: string;
    country: string;
    type: string;
  }) => {
    const params = {
      ...data,
      type: parseInt(data.type),
      id: editInfo.id
    };
    console.log("param", params);

    axios({
      method: "put",
      url: "https://cms.chtoma.com/api/students",
      data: params,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log(res);
        setShow(props.onCancel);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  return (
    <Modal
      title="Edit Student"
      visible={isShow}
      onCancel={props.onCancel}
      footer={null}
    >
      <Form
        name="basic"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
        onFinish={addStudent}
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
          <Input value="editInfo"/>
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
          <Button type="primary" onClick={props.onCancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
