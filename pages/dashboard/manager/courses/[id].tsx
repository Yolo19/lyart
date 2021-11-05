import { AppLayout } from "../../../../components/layout/layout";
import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Badge, Steps, Tag, Collapse } from "antd";
import { fetchCourseById } from "../../../../lib/api";
import { useRouter } from "next/router";
import CourseListItem from "../../../../components/course/courseListItem";
import { Course } from "../../../../lib/model/course";

const { Panel } = Collapse;

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  return {
    props: { id },
  };
}

export default function Page(props: { id: number }) {
  const router = useRouter();
  const [courseInfo, setCourseInfo] = useState<Course>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [salesInfo, setSalesInfo] = useState<
    { label: string; value: string | number }[]
  >([]);
  const id = +router.query.id || props.id;

  const getCourseDetails = useCallback(() => {
    fetchCourseById(id).then((res) => {
      console.log(res);
      const data = res.data.data;
      console.log("data", data);
      setCourseInfo(data);
      setActiveChapterIndex(
        data.schedule.chapters.findIndex(
          (item: { id: number }) => item.id === data.schedule.current
        )
      );

      const info = [
        { label: "Price", value: data.sales.price },
        { label: "Batches", value: data.sales.batches },
        { label: "Students", value: data.sales.studentAmount },
        { label: "Earings", value: data.sales.earnings },
      ];
      setSalesInfo(info);
    });
  }, [id]);

  useEffect(() => {
    getCourseDetails();
  }, [getCourseDetails]);

  return (
    <AppLayout>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <CourseListItem {...courseInfo}>
            <Row>
              {salesInfo?.map((item, index) => {
                //console.log(item);
                <Col key={index} span={6}>
                  <b>{item.value}</b>
                  <p>{item.label}</p>
                </Col>;
              })}
            </Row>
          </CourseListItem>
        </Col>
        <Col span={15} offset={1}>
          <Card style={{}}>
            <h2 style={{ color: "blue" }}>Course Detail</h2>
            <h3>Create Time</h3>
            <br></br>
            <h3>Start Time</h3>
            <p>{courseInfo?.startTime}</p>
            <Badge dot={true} color="green" offset={[2, 5]}>
              <h3>Status</h3>
            </Badge>
            <div>
              <Steps
                size="small"
                current={activeChapterIndex}
                style={{ width: "auto" }}
              >
                {courseInfo?.schedule.chapters.map((item: any) => {
                  console.log(item.name);
                  <Steps.Step key={item.id} title={item.name} />;
                })}
              </Steps>
            </div>
            <h3>Course Code</h3>
            <p>{courseInfo?.uid}</p>
            <h3>Class Time</h3>
            <h3>Category</h3>
            <div>
              {courseInfo?.type.map((item) => (
                <Tag color={"geekblue"} key={item.id}>
                  {item.name}
                </Tag>
              ))}
            </div>
            <h3>Description</h3>
            <p>{courseInfo?.detail}</p>
            <h3>Chapter</h3>
            {courseInfo?.schedule && (
              <Collapse defaultActiveKey={courseInfo.schedule.current}>
                {courseInfo.schedule.chapters.map((item: any) => {
                  <Panel
                    header={item.name}
                    key={item.id}
                    extra={<Tag>pending</Tag>}
                  >
                    <p>{item.content}</p>
                  </Panel>;
                })}
              </Collapse>
            )}
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}
