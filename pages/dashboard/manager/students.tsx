import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Space, Row, Col, Input } from "antd";
import style from "../../../styles/Dashboard.module.css";
import { PlusOutlined } from "@ant-design/icons";

const { Search } = Input;

export default function Students() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  //获取数据并展示到Table这部分还没有写完
  const getStudentList = () => {
    const res = axios({
      method: "get",
      url: `https://cms.chtoma.com/api/students/?&page=1&limit=10`,
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      console.log("res", res);
      const data = res.data.data.students.map((items: any, index: number) => {
          return({
            key: index,
            name: items.name,
            area: items.country,
            email: items.email,
            selected_curriculum: items.course,
            student_type: items.type.name,
            join_time: items.createdAt,
          })     
      });

      console.log("data", data);
      return data;
    });
  };

  const resData = getStudentList();

  const columns = [
    {
      key: "number",
      title: "No",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Area",
      dataIndex: "area",
      //sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Selected Curriculum",
      dataIndex: "selected_curriculum",
    },
    {
      title: "Student Type",
      dataIndex: "student_type",
    },
    {
      title: "Join Time",
      dataIndex: "join_time",
    },
    {
      key: "action",
      title: "Action",
      render: () => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <div className={style.student_list_container}>
      <Row>
        <Col span={18}>
          <Button type="primary" icon={<PlusOutlined />}>
            Add
          </Button>
        </Col>
        <Col span={6}>
          <Search placeholder="Search by name" />
        </Col>
      </Row>
      <br />
      <Row>
        <Table columns={columns} style={{ width: "100%" }} />
      </Row>
    </div>
  );
}
