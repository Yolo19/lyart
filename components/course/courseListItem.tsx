import React from "react";
import { Card, Row, Col, Button } from "antd";
import styled from "styled-components";
import { HeartFilled, UserOutlined } from "@ant-design/icons";
import { Course } from "../../lib/model/course";

const StyledRow = styled(Row)`
  position: relative;
  :after {
    content: "";
    position: absolute;
    bottom: 0;
    background: #f0f0f0;
    width: 100%;
    height: 1px;
  }
  padding: 10px;
`;

export default function CourseListItem(props: React.PropsWithChildren<Course>) {
  return (
    <Card cover={<img src={props.cover} style={{ height: 260 }} />}>
      <Row>
        <h3>{props.name}</h3>
      </Row>

      <StyledRow justify="space-between">
        <Col>{props.startTime}</Col>
        <Col style={{ display: "flex", alignItems: "center" }}>
          <HeartFilled style={{ marginRight: 5, fontSize: 16, color: "red" }} />
          <b>{props.star}</b>
        </Col>
      </StyledRow>

      <StyledRow justify="space-between">
        <Col>Duration:</Col>
        <Col>
          <b>{props.duration}</b>
        </Col>
      </StyledRow>

      <StyledRow justify="space-between">
        <Col>Teacher:</Col>
        <Col>
          <b>{props.teacherName}</b>
        </Col>
      </StyledRow>

      <Row justify="space-between" style={{ padding: "10px" }}>
        <Col>
          <UserOutlined
            style={{ fontSize: 16, color: "blue", marginRight: 5 }}
          />
          Student Limit:
        </Col>
        <Col>
          <b>{props.maxStudents}</b>
        </Col>
      </Row>
      {props.children}
    </Card>
  );
}
