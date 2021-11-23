import React, {useCallback, useState, useEffect} from "react";
import { AppLayout } from "../../../../components/layout/layout";
import { Col, Input, Row, Select, Spin, Tabs } from "antd";
import CreateCourse from "../../../../components/course/createCourse";
import CourseSchedule from "../../../../components/course/courseSchedule";
import { Course } from "../../../../lib/model/course"
import { fetchCourse } from "../../../../lib/api"
import { debounce } from 'lodash';
import storage from "../../../../lib/services/storage";
import { useRouter } from 'next/router';

const { Option } = Select;

export default function EditCourse() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchBy, setSearchBy] = useState<'uid' | 'name' | 'type'>('uid');
  const [searchResult, setSearchResult] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course>(null);
  const router = useRouter();

  const search = useCallback(
    debounce((value: string, cb?: (courses?: Course[]) => void) => {
      if (!value) {
        return;
      }

      setIsSearching(true);

      fetchCourse({ [searchBy]: value, userId: storage.userId })
        .then((res) => {
          console.log(res.data.data);
          const { data } = res.data;

          if (!!data) {
            setSearchResult(data.courses);
            if (!!cb) {
              cb(data.courses);
            }
          }
        })
        .finally(() => {setIsSearching(false)});
    }, 1000), [searchBy]
  );

  useEffect(() => {
    const { uid } = router.query;

    if (uid) {
      search(uid as string, (courses) => {
        setCourse(courses[0]);
      });
    }

  }, [router.query, search]);

  return (
    <AppLayout>
      <Row style={{ padding: "20px 0" }}>
        <Col span={12} style={{ marginLeft: "1.6%" }}>
          <Input.Group compact size="large" style={{ display: "flex" }}>
            <Select defaultValue="uid" onChange={(value) =>setSearchBy(value)}>
              <Option value="uid">Code</Option>
              <Option value="name">Name</Option>
              <Option value="type">Category</Option>
            </Select>
            <Select
              placeholder={`Search course by ${searchBy}`}
              notFoundContent={isSearching ? <Spin size="small" /> : null}
              filterOption={false}
              showSearch
              onSearch={(value) => search(value)}
              style={{ flex: 1 }}
              onSelect={(id) => {
                const course = searchResult.find((item) => item.id === id);

                setCourse(course);
              }}
            >
              {searchResult.map(({ id, name, teacherName, uid }) => (
                <Select.Option key={id} value={id}>
                  {name} - {teacherName} - {uid}
                </Select.Option>
              ))}
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
          <CreateCourse course={course}/>
        </Tabs.TabPane>

        <Tabs.TabPane key="chapter" tab="Course Schedule">
          <CourseSchedule />
        </Tabs.TabPane>
      </Tabs>
    </AppLayout>
  );
}
