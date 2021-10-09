import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Space,
  Row,
  Col,
  Input,
  Popconfirm,
  message,
} from "antd";
import style from "../../../../styles/Dashboard.module.css";
import { PlusOutlined } from "@ant-design/icons";
import { formatDistanceToNow } from "date-fns";
import AddStudentForm from "../../../../components/students/addStudentForm";

const { Search } = Input;

export default function Student() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [dataSource, setDataSource] = useState([]);
  const [isAddModuleDisplay, setAddModuleDisplay] = useState(false);

  // const showModel = ()=>{
  //   setAddModuleDisplay(true);
  // }

  const editStudent = () => {
    console.log("111");
  };

  const deleteStudentFromApi = (id:string)=>{
    // const res = axios({
    //   method: "delete",
    //   url: "https://cms.chtoma.com/api/students",
    //   data: id,
    //   headers: { Authorization: `Bearer ${token}` },
    // }).then((res) => {
    //   console.log("res", res);
    // });
  }

  const deleteStudent = (record) => {
    console.log("222", record);
    const id = record.id.toString();
    deleteStudentFromApi(id);
  };

  const getStudentList = () => {
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
  };

  useEffect(() => {
    getStudentList();
    console.log("111", dataSource);
  }, []);

  const columns = [
    {
      key: "number",
      title: "No",
      render: (_1, _2, index) => index + 1,
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      sortDirections: ["descend", "ascend"],
      width: 150,
      sorter: (a, b) =>
        a.name.substr(0, 1).charCodeAt(0) - b.name.substr(0, 1).charCodeAt(0),
    },
    {
      title: "Area",
      dataIndex: "country",
      width: 150,
      filters: [
        {
          text: "China",
          value: "China",
        },
        {
          text: "New Zealand",
          value: "New Zealand",
        },
        {
          text: "Canada",
          value: "Canada",
        },
        {
          text: "Australia",
          value: "Australia",
        },
      ],
      onFilter: (value, record) => record.country.indexOf(value) === 0,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
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
      width: 100,
    },
    {
      title: "Join Time",
      dataIndex: "createdAt",
      width: 100,
      render: (value: string) =>
        formatDistanceToNow(new Date(value), { addSuffix: true }),
    },
    {
      key: "action",
      title: "Action",
      width: 150,
      render: (record) => (
        <Space size="middle">
        <a onClick={editStudent}>Edit</a>
        <Popconfirm
          placement="top"
          title={"Are you sure to delete?"}
          onConfirm={deleteStudent(record)}
          okText="Confirm"
          cancelText="Cancel"
        >
            <a >Delete</a>
        </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={style.student_list_container}>
      <Row>
        <Col span={18}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setAddModuleDisplay(true);
            }}
          >
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
          dataSource={dataSource}
          style={{ width: "100%" }}
          scroll={{ y: 500 }}
        />
      </Row>

      <AddStudentForm
        visible={isAddModuleDisplay}
        onCancel={() => setAddModuleDisplay(false)}
      />
    </div>
  );
}
