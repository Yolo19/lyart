import type { NextPage } from "next"
import styles from "../styles/Dashboard.module.css"
import { Button } from "antd";
import axios from "axios";
import { useRouter } from "next/router";

export default function Dashboard() {
    const router = useRouter();
// const handleLoginOut = () =>{
//     axios({
//         method: "post",
//         url: "https://cms.chtoma.com/api/logout",
//         //data: params,
//       }).then (()=>{
//           //localStorage.getItem("token");
//         localStorage.clear();
//         router.push("/login");
//       })        
// }

  return (
    <div className={styles.container}>
      Dashboard
      <Button>Login Out</Button>
    </div>
  )
}
