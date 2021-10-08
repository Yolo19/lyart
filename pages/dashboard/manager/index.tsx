import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import Student from "./student/index";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

export default function Dashboard() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const handleLoginOut = () => {
    axios({
      method: "post",
      url: "https://cms.chtoma.com/api/logout",
      data: {},
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(() => {
      localStorage.clear();
      router.push("/login");
    });
  };

  const changeContent = (e: any) => {
    console.log("123");
    router.push("manager/student");
    if (e.key === "student_list") {
      router.push("manager/student");
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            height: "60px",
            color: "white",
            fontSize: "30px",
            textAlign: "center",
            margin: "0 auto",
          }}
        >
          CMS
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onClick={changeContent}
        >
          <Menu.Item key="overview" icon={<UserOutlined />}>
            Overview
          </Menu.Item>
          <SubMenu key="student" icon={<UserOutlined />} title="Student">
            <Menu.Item key="student_list">Student List</Menu.Item>
          </SubMenu>
          <SubMenu key="teacher" icon={<UserOutlined />} title="Teacher">
            <Menu.Item key="teacher_list">Teacher List</Menu.Item>
          </SubMenu>
          <SubMenu key="course" icon={<UserOutlined />} title="Course">
            <Menu.Item key="all_course">All Courses</Menu.Item>
            <Menu.Item key="add_course">Add Courses</Menu.Item>
            <Menu.Item key="edit_course">Edit Courses</Menu.Item>
          </SubMenu>
          <Menu.Item key="message" icon={<VideoCameraOutlined />}>
            Message
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <Button
            onClick={toggle}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          ></Button>
          <Button
            onClick={handleLoginOut}
            style={{ float: "right", marginTop: "15px" }}
          >
            Login Out
          </Button>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          <Student />
        </Content>
      </Layout>
    </Layout>
  );
}
