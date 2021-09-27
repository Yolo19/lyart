import React, { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox, Radio } from "antd";
import Link from "next/link";
import style from "../styles/Login.module.css";

export default function Login() {
  const [form] = Form.useForm();
  const [role, setRole] = useState("student");

  const onFinish = (values: any) => {
    console.log("Success:", values);

    const res = fetch("https://cms.chtoma.com/api/login", {
        method: "PUT",
        body: JSON.stringify(values),
    });

    console.log(res);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo)
  };

  useEffect(()=>{
    console.log("roleChange",role);
  }, [role])


  return (
    <div className={style.login_form_container}>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className={style.form_style}
      >
        <Form.Item name="role" initialValue="student">
          <Radio.Group value={role} onChange={(e)=>{setRole(e.target.value)}}>
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
          {/* <Link href="/">
            <Button type="primary" htmlType="submit" className={style.submit_button}>
              Submit
            </Button>
          </Link> */}
          <Button type="primary" htmlType="submit" className={style.submit_button}>
              Submit
            </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
