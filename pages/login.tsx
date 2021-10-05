import React, { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox, Radio, message, Row, Col } from "antd";
import style from "../styles/Login.module.css";
import axios from "axios";
import { AES } from "crypto-js";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState("student");


  const login = (data: {role: "student"| "teacher" | "manager"; email:string; password: string}) => {
    const params = {
      ...data,
      password: AES.encrypt(data.password, "cms").toString(),
    };
    console.log(params);
    axios({
      method: "post",
      url: "https://cms.chtoma.com/api/login",
      data: params,
    })
      .then((res) => {
        console.log(res);
        const { token } = res.data.data;
        console.log(token);
        localStorage.setItem("token", token);
        router.push(`dashboard/${role}`);
      })
      .catch((error) => {
        console.log(error);
        message.error(error.response.data.msg);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!!token) {
      router.push(`dashboard/${role}`);
    }
  }, []);

  return (
    <>
    <h1 className={style.login_form_title}>Course Management Assistant</h1>
    <Row justify="center">
        <Col md={8} sm={24}>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={login}
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
