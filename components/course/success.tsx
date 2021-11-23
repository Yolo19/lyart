import React from "react";
import { useRouter } from 'next/router';
import { Button, Result} from 'antd';
import { useUserRole } from "../../components/custom-hooks/login-state"

export default function Success(props: any) { 
    const router = useRouter();
    const userRole = useUserRole();

    return (
        <>
        <Result
        status="success"
        title="Successfully Create Course!"
        extra={[
          <Button
            type="primary"
            key="detail"
            onClick={() => router.push(`/dashboard/${userRole}/courses/${props.courseId}`)}
          >
            Go Course
          </Button>,
          <Button
            key="again"
            onClick={() => {
              router.reload();
            }}
          >
            Create Again
          </Button>,
        ]}
      />,
      </>
    )
}