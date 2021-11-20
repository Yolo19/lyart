import React, { useState, useRef } from "react";
import { AppLayout } from "../../../../components/layout/layout";
import { Steps } from "antd";
import CreateCourse from "../../../../components/course/createCourse";
import CourseSchedule from "../../../../components/course/courseSchedule";
import Success from "../../../../components/course/success";
import { Button, message } from "antd";
import { addCourse, addCourseSchedule } from "../../../../lib/api";

const { Step } = Steps;

export default function AddCourse() {
  const [current, setCurrent] = useState(0);
  const submitRef = useRef();
  const submitScheduleRef = useRef();
  const createCourse = ()=>{
    const values = submitRef.current.handleForm();
    console.log(values);
    addCourse(values)
      .then(()=>{
        message.success("Success");
        setCurrent(current + 1);
      })
      .catch(()=>{message.error("error")})
  }

  const submitCourse = () => {
    const values = submitScheduleRef.current.handleScheduleForm();
    console.log(values);
    const params = {
      ...values,
    }
    addCourseSchedule(values)
      .then(()=>{
        message.success("Success");
        setCurrent(current + 1);
      })
      .catch(()=>{message.error})
  };

  const steps = [
  {
    title: "Course Detail",
    content: <CreateCourse ref={submitRef} />,
  },
  {
    title: "Course Schedule",
    content: <CourseSchedule ref={submitScheduleRef}/>,
  },
  {
    title: "Success",
    content: <Success />,
  },
];

  return (
    <AppLayout>
      <Steps current={current} type="navigation" style={{margin: "0 20px", padding: "20px 0"}}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action" style={{paddingBottom: "20px"}}>
        {current === 0 && (
          <Button type="primary" style={{ margin: "0 20px" }} onClick={createCourse}>
            Create Course
          </Button>
        )}
        {current === 1 && (
          <Button type="primary" style={{ margin: "0 8px" }} onClick={submitCourse}>
            Submit
          </Button>
        )}
      </div>
    </AppLayout>
  );
}
