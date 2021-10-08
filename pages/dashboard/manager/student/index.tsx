import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Space, Row, Col, Input } from "antd";
import style from "../../../../styles/Dashboard.module.css";
import { PlusOutlined } from "@ant-design/icons";
import { formatDistanceToNow } from 'date-fns';
import AddStudentForm from "../../../../components/students/addStudentForm";

const { Search } = Input;

export default function Student() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [dataSource, setDataSource] = useState([]);
  const [isAddModuleDisplay,setAddModuleDisplay] = useState(false);
  console.log("2",isAddModuleDisplay)
  const showModel = ()=>{
    setAddModuleDisplay(true);
  }

  const editStudent = ()=>{
    console.log("111")
  }

  const deleteStudent = ()=>{
    console.log("111")
  }


  const getStudentList = ()=>{
    const res = axios({
        method: "get",
        url: `https://cms.chtoma.com/api/students/?page=1&limit=10`,
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        console.log("res", res);
        const data = res.data.data.students;
        console.log("data", data);
        setDataSource(data);
      });
  }
    
  useEffect(()=>{
    getStudentList();
    console.log("111",dataSource)
  }, []);


  const columns = [
    {
      key: "number",
      title: "No",
      render: (_1, _2, index) => index+1,
      
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Area",
      dataIndex: "country",
      //sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Selected Curriculum",
      dataIndex: "courses",
      render: (courses) =>
        courses.map((course) => {
            return `${course.name},`;
        }),
    },
    {
      title: "Student Type",
      dataIndex: "type",
      render: (type) => type.name,
    },
    {
      title: "Join Time",
      dataIndex: "createdAt",
      render: (value: string) => formatDistanceToNow(new Date(value), { addSuffix: true }),
    },
    {
      key: "action",
      title: "Action",
      render: () => (
        <Space size="middle">
          <a onClick={editStudent}>Edit</a>
          <a>Delete onClick={deleteStudent}</a>
        </Space>
      ),
    },
  ];


  return (
    <div className={style.student_list_container}>
      <Row>
        <Col span={18}>
          <Button type="primary" icon={<PlusOutlined />} onClick={()=>{setAddModuleDisplay(true);}} >
            Add
          </Button>
        </Col>
        <Col span={6}>
          <Search placeholder="Search by name" />
        </Col>
      </Row>
      <br />
      <Row>
        <Table 
            columns={columns} 
            dataSource = {dataSource}
            style={{ width: "100%" }} />
      </Row>
      <AddStudentForm visible={isAddModuleDisplay} onCancel={()=>setAddModuleDisplay(false)}/>
    </div>
  );
}
