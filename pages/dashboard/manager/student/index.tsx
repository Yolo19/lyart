import React, { useEffect, useState } from "react";
import * as _ from "lodash";
import axios from "axios";
import { AppLayout } from "../../../../components/layout/layout";
import {
  Table,
  Button,
  Space,
  Row,
  Col,
  Input,
  Popconfirm,
  Modal,
  message
} from "antd";
import style from "../../../../styles/Dashboard.module.css";
import { PlusOutlined } from "@ant-design/icons";
import { formatDistanceToNow } from "date-fns";
import AddStudentForm from "../../../../components/students/addStudentForm";
import EditStudentForm from "../../../../components/students/editStudentForm";
import {fetchStudentList, deleteStudent, searchStudent} from "../../../../lib/api"
import Link from 'next/link';
import { StudentList } from "../../../../lib/model/student";

const { Search } = Input;

export default function Student() {
  const token = 
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [totalItems, setTotalItems] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1)
  const [dataSource, setDataSource] = useState([]);
  const [isModalDisplay, setModalDisplay] = useState(false);
  const [editInfo, setEditInfo] = useState(null);
  const [searchValue, setSearchValue] = useState();

  const editStudent = (record) => {
      setEditInfo(record);
      setModalDisplay(true);
      //console.log("editInfo",editInfo)
  };

  const handleDeleteStudent = (record) => {
    const id = record.id.toString();
    deleteStudent(id)
      .then((res)=>{
        message.success("Success to delete it")
        getStudentList();
      }).catch((error)=>{message.error(error.response.data.msg);});   
  };

  const changePage = (current:number) =>{
    setCurrentPage(current);
  }

  const getStudentList = () => {
    fetchStudentList(currentPage, pageSize)
      .then((res)=>{
        console.log("res", res);
        const data = res.data.data.students;
        const total = res.data.data.total;
        console.log("data", data);
        setTotalItems(total);
        setDataSource(data);
      })
  };

  const handleSearchStudent = (name)=>{
    const queryName = name.toString();
    searchStudent(currentPage, pageSize, queryName)
    .then((res) => {
      const data = res.data.data.students;
      setDataSource(data);
    });
  }

  useEffect(() => {
    getStudentList();
  }, [currentPage, pageSize]);


  const mapDebounceHandler = _.debounce(handleSearchStudent, 1000);


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
        render: (_, record) => {
          return (
            <Link href={'/dashboard/manager/student/${record.id}'}>
              {record.name}
            </Link>
          );
        },
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
      render: (courses) => {
        const course = courses.map((item) => {
          return `${item.name}`; 
        });
        return course.join(',')
      }
        
    },
    {
      key: "type",
      title: "Student Type",
      dataIndex: "type",
      filters: [
        {
          text: "tester",
          value: "tester",
        },
        {
          text: "developer",
          value: "developer",
        },
      ],
      onFilter: (value, record) => record.type?.name.indexOf(value) === 0,
      render: (type) => type?.name,
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
          onConfirm={()=>handleDeleteStudent(record)}
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
    <AppLayout>
    <div className={style.student_list_container}>
      <Row>
        <Col span={18}>
          <Button
            id="add_button"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setModalDisplay(true);
              setEditInfo(null);
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

      <Modal
        title={!!editInfo ? 'Edit Student' : 'Add Student'}
        centered
        visible={isModalDisplay}
        onCancel={() => {
          setModalDisplay(false); 
          setEditInfo(null);
        }}
        footer={null}
      >
        <EditStudentForm
          visible={isModalDisplay}
          editInfo={editInfo}
          onCancel={() => {
            setModalDisplay(false); 
            setEditInfo(null);
          }}
          update={()=>{getStudentList(); setModalDisplay(false)}}
        />
      </Modal>
    </div>
    </AppLayout>
  );
}
