import React, { PropsWithChildren, ReactFragment, useState } from "react";
import { Layout, Menu, Button } from "antd";
import { useRouter } from "next/router";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {LoginOut} from "../../lib/api";
import AppBreadcrumb from "../breadcrumb";
import {SideNav, routes} from "../../lib/model/constant/routes"

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

export function AppLayout(props: any) {
    const [menuName, setMenuName] = useState([]);
    const router = useRouter();
    const path = router.pathname;
    console.log("path ",path );
    const [collapsed, setCollapsed] = useState(false);
    const toggle = () => {
      setCollapsed(!collapsed);
    };
    const sideNave: SideNav[] | undefined = routes.get("manager")

    const renderMenuItems =(data: SideNav[]) =>{
      console.log("123")
      return data.map((item, index)=>{
        //const key = genKey(item);
        if(item.subNav){
          return<SubMenu title={item.title} icon={item.icon}>
            {renderMenuItems(item.subNav)}
          </SubMenu>
        } else {
          return <Menu.Item>{item.title}</Menu.Item>
        }
      })
      }


    const genKey = (data: SideNav): string=>{
      return data.title;
    }

    const handleLoginOut = () => {
        LoginOut()
          .then(()=>{
            localStorage.clear();
            router.push("/login");
          }).catch((err)=>{
            console.log(err);
          });
    };
  
    const changeContent = (e: any) => {
      setMenuName(e.keyPath);
      if (e.key === "student_list") {
        router.push(`${path}/student`);
      }
      if (e.key === "teacher_list") {
        router.push("/");
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
            onClick={(e)=>changeContent(e)}
          >
            {renderMenuItems(sideNave)}
            {/* <Menu.Item key="overview" icon={<UserOutlined />}>
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
            </Menu.Item> */}
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
              //minHeight: 280,
            }}
          >
            <AppBreadcrumb sub={menuName}></AppBreadcrumb>
            {props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }