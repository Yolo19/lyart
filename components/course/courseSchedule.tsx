import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import {
  Button,
  Col,
  Input,
  Form,
  Row,
  DatePicker,
  InputNumber,
  Select,
  Upload,
  message,
  TimePicker
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

function CourseSchedule(props:any , ref:any) {
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    handleScheduleForm: () => {
      const values = form.getFieldsValue(["chapters", "classTime"]);
      const submitValue = {
          ... values
      }
      return values;
    },
  }));

  const initialValues = {
    chapters: [{ name: "", content: "" }],
    classTime: [{ weekday: "", time: "" }],
  };

  return (
    <Form
      form={form}
      name="schedule"
      autoComplete="off"
      style={{ padding: "0 1.6%" }}
      initialValues={initialValues}
    >
      <Row style={{ padding: "20px 0" }}>
        <Col span={12}>
          <h2>Chapters</h2>

          <Form.List name="chapters">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, "name"]}
                        fieldKey={[field.fieldKey, "name"]}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter Name" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "content"]}
                        fieldKey={[field.fieldKey, "content"]}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter content" />
                      </Form.Item>
                    </Col>

                    <Col span={2}>
                      <Form.Item>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              remove(field.name);
                            } else {
                              message.warn(
                                "You must set at least one chapter."
                              );
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}

                <Row>
                  <Col span={20}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        size="large"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Chapter
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>

        <Col span={12}>
          <h2>Class times</h2>
          <Form.List name="classTime">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'weekday']}
                        fieldKey={[field.fieldKey, 'weekday']}
                        rules={[{ required: true }]}
                      >
                        <Select>
                          <Option value="Sunday">Sunday</Option>
                          <Option value="Monday">Monday</Option>
                          <Option value="Tuesday">Tuesday</Option>
                          <Option value="Wednesday">Wednesday</Option>
                          <Option value="Thursday">Thursday</Option>
                          <Option value="Friday">Friday</Option>
                          <Option value="Saturday">Saturday</Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'time']}
                        fieldKey={[field.fieldKey, 'time']}
                        rules={[{ required: true }]}
                      >
                        <TimePicker size="large" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>

                    <Col span={2}>
                      <Form.Item>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              remove(field.name);
                            } else {
                              message.warn('You must set at least one class time.');
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}

                <Row>
                  <Col span={20}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        size="large"
                        disabled={fields.length >= 7}
                        onClick={() => {
                          add();
                        }}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Class Time
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
    </Form>
  );
}

export default forwardRef(CourseSchedule);
