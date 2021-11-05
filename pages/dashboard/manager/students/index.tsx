import React, { useEffect, useState } from "react";
import * as _ from "lodash";
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
  message,
} from "antd";
import style from "../../../../styles/Dashboard.module.css";
import { PlusOutlined } from "@ant-design/icons";
import { formatDistanceToNow } from "date-fns";
import EditStudentForm from "../../../../components/students/editStudentForm";
import {
  fetchStudentList,
  deleteStudent,
  searchStudent,
} from "../../../../lib/api";
import Link from "next/link";
import { SortOrder } from "antd/lib/table/interface";
import { Record } from "../../../../lib/model/student";

const { Search } = Input;

export default function Student() {
  const [totalItems, setTotalItems] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const [isModalDisplay, setModalDisplay] = useState(false);
  const [editInfo, setEditInfo] = useState<Record | null>(null);
  //const [searchValue, setSearchValue] = useState();

  const editStudent = (record: Record) => {
    setEditInfo(record);
    console.log("record", record);
    setModalDisplay(true);
  };

  const handleDeleteStudent = (record: Record) => {
    const id = record.id.toString();
    deleteStudent(id)
      .then((res) => {
        message.success("Success to delete it");
        getStudentList(currentPage, pageSize);
      })
      .catch((error) => {
        message.error(error.response.data.msg);
      });
  };

  const changePage = (current: number) => {
    setCurrentPage(current);
  };

  const getStudentList = (currentPage: number, pageSize: number) => {
    fetchStudentList(currentPage, pageSize).then((res) => {
      console.log("res", res);
      const data = res.data.data.students;
      const total = res.data.data.total;
      console.log("data", data);
      setTotalItems(total);
      setDataSource(data);
    });
  };

  const handleSearchStudent = (name: string) => {
    const queryName = name.toString();
    searchStudent(currentPage, pageSize, queryName).then((res) => {
      const data = res.data.data.students;
      setDataSource(data);
    });
  };

  useEffect(() => {
    getStudentList(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const mapDebounceHandler = _.debounce(handleSearchStudent, 1000);

  const columns = [
    {
      key: "number",
      title: "No",
      render: (_1: Record, _2: Record, index: number) => index + 1,
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      sorter: (a: Record, b: Record) =>
        a.name.substr(0, 1).charCodeAt(0) - b.name.substr(0, 1).charCodeAt(0),
      render: (_: string, record: Record) => {
        return (
          <Link href={"/dashboard/manager/student/${record.id}"}>
            {record.name}
          </Link>
        );
      },
      sortDirections: ["descend", "ascend"] as SortOrder[],
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
      onFilter: (value: string | number | boolean, record: Record) =>
        record.country.indexOf(value.toString()) === 0,
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
      render: (courses: [{ courseId: number; id: number; name: string }]) => {
        const course = courses.map((item) => {
          return `${item.name}`;
        });
        return course.join(",");
      },
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
      onFilter: (value: string | number | boolean, record: Record) =>
        record.type?.name.indexOf(value.toString()) === 0,
      render: (type: { id: number | string; name: string | null }) =>
        type?.name,
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
      render: (record: Record) => (
        <Space size="middle">
          <a onClick={() => editStudent(record)}>Edit</a>
          <Popconfirm
            placement="top"
            title={"Are you sure to delete?"}
            onConfirm={() => handleDeleteStudent(record)}
            okText="Confirm"
            cancelText="Cancel"
          >
            <a>Delete</a>
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
            <Search
              placeholder="Search by name"
              onChange={(e) => {
                mapDebounceHandler(e.target.value);
              }}
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
          title={!!editInfo ? "Edit Student" : "Add Student"}
          centered
          visible={isModalDisplay}
          onCancel={() => {
            setModalDisplay(false);
            setEditInfo(null);
          }}
          footer={null}
          destroyOnClose={true}
        >
          <EditStudentForm
            visible={isModalDisplay}
            editInfo={editInfo as Record}
            onCancel={() => {
              setModalDisplay(false);
              setEditInfo(null);
            }}
            update={() => {
              getStudentList(currentPage, pageSize);
              setModalDisplay(false);
            }}
          />
        </Modal>
      </div>
    </AppLayout>
  );
}
