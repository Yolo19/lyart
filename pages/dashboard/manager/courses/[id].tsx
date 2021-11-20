import { AppLayout } from "../../../../components/layout/layout";
import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Badge, Steps, Tag, Collapse, Table} from "antd";
import { fetchCourseById } from "../../../../lib/api";
import { useRouter } from "next/router";
import CourseListItem from "../../../../components/course/courseListItem";
import { Course } from "../../../../lib/model/course";
import styled from 'styled-components';

const { Panel } = Collapse;

export enum CourseStatusText {
    'pending',
    'processing',
    'finished',
  }
  
  
  export enum CourseStatusColor {
    'orange',
    'default',
    'green',
  }

const StyledCol = styled(Col)`
    text-align: center;
    margin: 0 auto;
    border: 1px solid #f0f0f0;
    border-left: none;
    border-bottom: none;
    :last-child {
        border-right: none;
    };
    b {
        color: #7356f1;
        font-size: 24px;
    };
    p {
        margin-bottom: 0;
      }
`;

const StepsRow = styled(Row)`
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
  .ant-steps-item-title {
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 6em;
  }
  padding: 10px 0;
`;

const StyledRow = styled(Row)`
  width: calc(100% + 48px);
  margin: 0 0 0 -24px !important;
`;



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

  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const columns = weekDays.map((title: string, index:number)=>{
    const target: string =
    courseInfo?.schedule.classTime.find((item: string) => item.toLocaleLowerCase().includes(title.toLocaleLowerCase())) || '';
    const time = target.split(' ')[1];

    return { title, key: index, render: () => time };
  })

  const dataSource = new Array(1).fill({ id: 0 });

  const getChapterExtra = (source, index) => {
    const activeIndex = source.chapters.findIndex((item) => item.id === source.current);
    //const status = index === activeIndex ? 1 : index < activeIndex ? 0 : 2;
    const status = source.status;
  
    return <Tag color={CourseStatusColor[status]}>{CourseStatusText[status]}</Tag>;
  };

  return (
    <AppLayout>
    <div style={{backgroundColor: "white"}}>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <CourseListItem {...courseInfo}>
            <StyledRow>
              {salesInfo?.map((item, index) => {
                return (
                  <StyledCol key={index} span={6}>
                    <b>{item.value}</b>
                    <p>{item.label}</p>
                  </StyledCol>
                );
              })}
            </StyledRow>
          </CourseListItem>
        </Col>
        <Col span={15} offset={1}>
          <Card>
            <h2 style={{ color: "blue" }}>Course Detail</h2>
            <h3>Create Time</h3>
            <br></br>
            <h3>Start Time</h3>
            <p>{courseInfo?.startTime}</p>
            <Badge dot={true} color="green" offset={[5, 5]}>
              <h3>Status</h3>
            </Badge>
            <StepsRow>
              <Steps
                size="small"
                current={activeChapterIndex}
                style={{ width: "auto"}}
              >
                {courseInfo?.schedule.chapters.map((item: any) => {
                  return <Steps.Step key={item.id} title={item.name} />;
                })}
              </Steps>
            </StepsRow>
            <h3>Course Code</h3>
            <p>{courseInfo?.uid}</p>
            <h3>Class Time</h3>
            <Table bordered columns ={columns} dataSource= {dataSource} pagination={false}/>
            <h3>Category</h3>
            <Row>
              {courseInfo?.type.map((item) => (
                <Tag color={"geekblue"} key={item.id}>
                  {item.name}
                </Tag>
              ))}
            </Row>
            <h3>Description</h3>
            <p>{courseInfo?.detail}</p>
            <h3>Chapter</h3>
            {courseInfo?.schedule && (
              <Collapse defaultActiveKey={courseInfo.schedule.current}>
                {courseInfo.schedule.chapters.map((item: any, index) => {
                  return(
                  <Panel
                    header={item.name}
                    key={item.id}
                    extra={getChapterExtra(courseInfo.schedule, index)}
                  >
                    <p>{item.content}</p>
                  </Panel>);
                })}
              </Collapse>
            )}
          </Card>
        </Col>
      </Row>
    </div>
    </AppLayout>
  );
}
