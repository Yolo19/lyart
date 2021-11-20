import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import {
  message,
  Col,
  Input,
  Form,
  Row,
  DatePicker,
  InputNumber,
  Select,
  Upload,
  Spin,
} from "antd";
import { fetchCourseCode, fetchTeachers, fetchCourseTypes } from "../../lib/api";
import {
  CloseCircleOutlined,
  InboxOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { AddCourseRequest } from "../../lib/model/course";
import { format, getTime } from 'date-fns';
import moment from "moment";

const { Option } = Select;

const selectAfter = (
  <Select defaultValue="month" className="select-after">
    <Option value="year">year</Option>
    <Option value="month">month</Option>
    <Option value="day">day</Option>
    <Option value="week">week</Option>
    <Option value="hour">hour</Option>
  </Select>
);

const { Dragger } = Upload;

const prop = {
  name: "file",
  multiple: true,
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

function CreateCourse(props, ref) {
  const [form] = Form.useForm();
  const [teachers, setTeachers] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [isTeacherSearching, setIsTeacherSearching] = useState<boolean>(false);

  const getCode = () => {
    fetchCourseCode().then((res) => {
      const uid = res.data.data;
      form.setFieldsValue({ uid });
    });
  };

  const getCourseTypes = ()=>{
    fetchCourseTypes()
        .then((res)=>{
            console.log(res);
            setCourseTypes(res.data.data)
        })
        .catch(()=>{message.error("error")})
  }

  useEffect(() => {
    getCode();
  }, []);

  useImperativeHandle(ref, () => ({
    handleForm: () => {
      const value = form.getFieldsValue(["name", "teacher","type","uid","startTime","price","maxStudents", "duration", "description", "cover"]);   
      const req: AddCourseRequest = {
        ...value,
        startTime: moment(value.startTime).format("YYYY-MM-DD"),
        durationUnit: 2,
        teacherId: value.teacher,
        detail: value.description,
      }
      console.log(value);
      return req;
    },
  }));

  return (
    <Form
      form={form}
      layout="vertical"
      labelCol={{ offset: 1 }}
      wrapperCol={{ offset: 1 }}
    >
      <Row style={{ margin: "20px 0" }}>
        <Col span={8}>
          <Form.Item
            label="Course Name"
            name="name"
            rules={[{ required: true }, { max: 100, min: 3 }]}
          >
            <Input type="text" placeholder="course name" />
          </Form.Item>
        </Col>

        <Col span={5}>
          <Form.Item
            label="Teacher"
            name="teacher"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select teacher"
              showSearch
              notFoundContent={
                isTeacherSearching ? <Spin size="small" /> : null
              }
              onSearch={(query: string) => {
                setIsTeacherSearching(true);
                if (!!query) {
                  fetchTeachers(query)
                    .then((res) => {
                      const data = res.data.data;
                      if (!!data) {
                        setTeachers(data.teachers);
                      }
                      setIsTeacherSearching(false);
                    })
                    .catch(() => {
                      message.error;
                    });
                }
              }}
            >
              {teachers.map(({ id, name }) => (
                <Option key={id} value={id}>
                  {name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={5}>
          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select mode="multiple" onClick={getCourseTypes}>
              {courseTypes.map(({id, name}) => (
                <Option value={id} key={id} >
                  {name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item
            label="Course Code"
            name="uid"
            rules={[{ required: true }]}
          >
            <Input type="text" placeholder="Course Code" disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={8}>
          <Form.Item label="Start Date" name="startTime">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Price" name="price" rules={[{ required: true }]}>
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              //parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              min={0}
            />
          </Form.Item>

          <Form.Item
            label="Student Limit"
            name="maxStudents"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={10} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true }]}
          >
            <Input addonAfter={selectAfter} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea
              placeholder="Course description"
              style={{ height: "290px" }}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="Cover" name="cover">
            <Dragger {...prop} style={{ height: "290px" }}>
              <p
                className="ant-upload-drag-icon"
                style={{ marginTop: "100px" }}
              >
                <InboxOutlined />
              </p>
              <p className="ant-upload-text" style={{ marginBottom: "60px" }}>
                Click or drag file to this area to upload
              </p>
            </Dragger>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default forwardRef(CreateCourse);
