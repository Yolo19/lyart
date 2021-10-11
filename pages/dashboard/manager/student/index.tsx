import React, { useEffect, useState } from "react";
import * as _ from "lodash";
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
import EditStudentForm from "../../../../components/students/editStudentForm";

const { Search } = Input;

export default function Student() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [totalItems, setTotalItems] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1)
  const [dataSource, setDataSource] = useState([]);
  const [isAddModuleDisplay, setAddModuleDisplay] = useState(false);
  const [isEditModuleDisplay, setEditModuleDisplay] = useState(false);
  const [editInfo, setEditInfo] = useState();
  const [searchValue, setSearchValue] = useState();

  // const showModel = ()=>{
  //   setAddModuleDisplay(true);
  // }

  const editStudent = (record) => {
      setEditModuleDisplay(true);
      setEditInfo(record);
  };

  const deleteStudentFromApi = (id:string)=>{
    const res = axios({
      method: "delete",
      url: `https://cms.chtoma.com/api/students/${id}`,
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      console.log("res", res);
    });
  }

  const deleteStudent = (record) => {
    console.log("222", record);
    const id = record.id.toString();
    deleteStudentFromApi(id);
  };

  const changePage = (current:number) =>{
    setCurrentPage(current);
  }

  const getStudentList = () => {
    const res = axios({
      method: "get",
      url: `https://cms.chtoma.com/api/students/?page=${currentPage}&limit=${pageSize}`,
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      console.log("res", res);
      const data = res.data.data.students;
      const total = res.data.data.total;
      console.log("data", data);
      setTotalItems(total);
      setDataSource(data);
    });
  };

  const searchStudent = (name)=>{
    console.log("value", name);
    const queryName = name.toString();
    const res = axios({
      method: "get",
      url: `https://cms.chtoma.com/api/students/?query=${queryName}`,
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      console.log("res", res);
      const data = res.data.data.students;
      console.log("data", data);
      setDataSource(data);
    });
  }

  useEffect(() => {
    getStudentList();
  }, [isEditModuleDisplay, isAddModuleDisplay, currentPage, pageSize]);


  const mapDebounceHandler = _.debounce(searchStudent, 1000);


  const columns = [
    {
      key: "number",
      title: "No",
      render: (_1, _2, index) => index + 1,
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) =>
        a.name.substr(0, 1).charCodeAt(0) - b.name.substr(0, 1).charCodeAt(0),
    },
    {
      key: "area",
      title: "Area",
      dataIndex: "country",
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
      key: "email",
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "courses",
      title: "Selected Curriculum",
      dataIndex: "courses",
      width: "20%",
      render: (courses) =>
        courses.map((course) => {
          return `${course.name},`;
        }),
    },
    {
      key: "type",
      title: "Student Type",
      dataIndex: "type",
      render: (type) => type.name,
    },
    {
      key: "createdAt",
      title: "Join Time",
      dataIndex: "createdAt",
      render: (value: string) =>
        formatDistanceToNow(new Date(value), { addSuffix: true }),
    },
    {
      key: "action",
      title: "Action",
      render: (record) => (
        <Space size="middle">
        <a onClick={()=>editStudent(record)}>Edit</a>
        <Popconfirm
          placement="top"
          title={"Are you sure to delete?"}
          onConfirm={()=>deleteStudent(record)}
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
          <Search placeholder="Search by name" 
            onChange={(e)=>{mapDebounceHandler(e.target.value)}}        
          />
        </Col>
      </Row>
      <br />
      <Row>
        <Table
          columns={columns}
          dataSource={dataSource}
          style={{ width: "100%" }}
          scroll={{ y: 500 }}
          pagination={{
            total: totalItems,
            onChange: changePage,
          }}
        />
      </Row>

      <AddStudentForm
        visible={isAddModuleDisplay}
        onCancel={() => setAddModuleDisplay(false)}
      />
      <EditStudentForm
        visible={isEditModuleDisplay}
        onCancel={() => setEditModuleDisplay(false)}
        editInfo={editInfo}
      />
      
    </div>
  );
}
