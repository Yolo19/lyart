import React, { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox, Radio, message, Row, Col } from "antd";
import style from "../styles/Login.module.css";
import { useRouter } from "next/router";
import { login } from "../lib/api";
import { LoginFormValues} from "../lib/model/login";

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState("student");


  const loginToServer = (loginRequest: LoginFormValues) => {
    login(loginRequest)
      .then((res)=>{
        const { token } = res.data.data;
        localStorage.setItem("token", token);
        router.push(`dashboard/${role}`);
      }).catch((error)=>{
        message.error(error.response.data.msg);
      })

    
  };



  return (
    <>
    <h1 className={style.login_form_title}>Course Management Assistant</h1>
    <Row justify="center">
        <Col md={8} sm={24}>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={loginToServer}
        className={style.form_style}
      >
        <Form.Item name="role" initialValue="student">
          <Radio.Group
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
            }}
          >
            <Radio.Button value="student">Student</Radio.Button>
            <Radio.Button value="teacher">Teacher</Radio.Button>
            <Radio.Button value="manager">Manger</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input placeholder="Please input your email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 4, max: 16, message: "Password must be 4-6 characters" },
          ]}
        >
          <Input.Password placeholder="Please input your password" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={style.login_form_button}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
      </Col>
    </Row>
    </>
  );
}
