import { Breadcrumb } from "antd";
import Link from "next/link";

export default function AppBreadcrumb (props) {
  const pathNameArray = props.sub;
  console.log("props.sub", props.sub)
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <a href={"http://localhost:3000/dashboard/manager/student"}>CMS MANAGER SYSTEM</a>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <a href={"http://localhost:3000/dashboard/manager/student"}>{pathNameArray[1]}</a>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{pathNameArray[0]}</Breadcrumb.Item>
    </Breadcrumb>
  );
};
