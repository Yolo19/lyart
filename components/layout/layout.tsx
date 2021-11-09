import React, { PropsWithChildren, ReactFragment, useState } from "react";
import { Layout, Menu, Button } from "antd";
import { useRouter } from "next/router";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { LoginOut } from "../../lib/api";
import AppBreadcrumb from "../breadcrumb";
import { SideNav, routes } from "../../lib/model/constant/routes";
import Link from "next/link";
import { useUserRole } from "../custom-hooks/login-state";
import { getActiveKey, generateKey } from "../../lib/util/side-nav";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const getMenuConfig = (
  data: SideNav[]
): { defaultSelectedKeys: string[]; defaultOpenKeys: string[] } => {
  const key = getActiveKey(data);
  const defaultSelectedKeys = [key.split('/').pop()];
  const defaultOpenKeys = key.split('/').slice(0, -1);
  return { defaultSelectedKeys, defaultOpenKeys };
};

export function AppLayout(props: any) {
  const userRole = useUserRole();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  const sideNave: SideNav[] | undefined = routes.get("manager");
  const { defaultOpenKeys, defaultSelectedKeys } = getMenuConfig(sideNave); 

  const renderMenuItems = (data: SideNav[], parent = "") => {
    return data.map((item, index) => {
      const key = generateKey(item, index);
      if (item.subNav) {
        return (
          <SubMenu key={key} title={item.title} icon={item.icon}>
            {renderMenuItems(item.subNav, item.path.join("/"))}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={key}>
            <Link
              href={["/dashboard", userRole, parent, ...item.path].join("/")}
            >
              {item.title}
            </Link>
          </Menu.Item>
        );
      }
    });
  };

  const handleLoginOut = () => {
    LoginOut()
      .then(() => {
        localStorage.clear();
        router.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Layout style={{ height: "100vh"}}>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{position: "fixed", height: "100vh"}}>
        <div
          style={{
            height: "60px",
            color: "white",
            fontSize: "30px",
            textAlign: "center",
            margin: "0 auto",
            //backgroundColor: "pink",
            //width: "8vw"
          }}
        >
          CMS
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={defaultSelectedKeys}
          defaultOpenKeys={defaultOpenKeys}
        >
          {sideNave && renderMenuItems(sideNave)}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{position: "relative", width: "100vw"}}>
          <Button
            style={{marginLeft: "10vw"}}
            onClick={toggle}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          ></Button>
          <Button
            onClick={handleLoginOut}
            style={{ float: "right", marginTop: "15px", marginRight: "15px" }}
          >
            Login Out
          </Button>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            // padding: 24,
            //minHeight: 280,
            position: "relative",
            left: "10vw",
            width: "88vw"
          }}
        >
          <AppBreadcrumb></AppBreadcrumb>
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
}
