import React, {useState,} from "react";
import { AppLayout } from "../../../../components/layout/layout";
import { Col, Input, Row, Select, Spin, Tabs } from "antd";
import CreateCourse from "../../../../components/course/createCourse";
import CourseSchedule from "../../../../components/course/courseSchedule";

const { Option } = Select;

export default function EditCourse() {
  
  const [isSearching, setIsSearching] = useState(false);

  return (
    <AppLayout>
      <Row style={{ padding: "20px 0" }}>
        <Col span={12} style={{ marginLeft: "1.6%" }}>
          <Input.Group compact size="large" style={{ display: "flex" }}>
            <Select defaultValue="uid" >
              <Option value="uid">Code</Option>
              <Option value="name">Name</Option>
              <Option value="type">Category</Option>
            </Select>
            <Select
              //placeholder={`Search course by ${searchBy}`}
              notFoundContent={isSearching ? <Spin size="small" /> : null}
              filterOption={false}
              showSearch
              //onSearch={(value) => search(value)}
              style={{ flex: 1 }}
              // onSelect={(id) => {
              //   const course = searchResult.find((item) => item.id === id);

              //   setCourse(course);
              // }}
            >
              {/* {searchResult.map(({ id, name, teacherName, uid }) => (
                <Select.Option key={id} value={id}>
                  {name} - {teacherName} - {uid}
                </Select.Option>
              ))} */}
            </Select>
          </Input.Group>
        </Col>
      </Row>
      <Tabs
        renderTabBar={(props, DefaultTabBar) => (
          <DefaultTabBar {...props} style={{ marginLeft: '1.6%' }} />
        )}
        type="card"
        size="large"
        animated
      >
        <Tabs.TabPane key="course" tab="Course Detail">
          <CreateCourse />
        </Tabs.TabPane>

        <Tabs.TabPane key="chapter" tab="Course Schedule">
          <CourseSchedule />
        </Tabs.TabPane>
      </Tabs>
    </AppLayout>
  );
}
