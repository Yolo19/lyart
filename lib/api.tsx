import axios from "axios";
import { AES } from "crypto-js";
import { message} from "antd";
import { LoginRequest } from "./model/login";
import { AddStudentRequest } from "./model/student"


const baseURL = "https://cms.chtoma.com/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  responseType: 'json',
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (!config.url.includes('login')) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: 'Bearer ' + token,
      },
    };
  }
  return config;
});


export const login = (data: LoginRequest) => {
    const params = {
      ...data,
      password: AES.encrypt(data.password, "cms").toString(),
    };
    
    return axiosInstance.post(`${baseURL}/login`, params);
  };

  export const LoginOut = () => {
    return axiosInstance.post(`${baseURL}/logout`, {});
  };

  export const fetchStudentList = (currentPage, pageSize) => {
    return axiosInstance.get(`${baseURL}/students/?page=${currentPage}&limit=${pageSize}`);
  };

  export const addStudent = (params:AddStudentRequest) => {
    return axiosInstance.post(`${baseURL}/students`, params);
  };

  export const editStudent = (params:AddStudentRequest) => {
    return axiosInstance.put(`${baseURL}/students`, params);
  };


  // const reqHandlerCurry = (reqHandler, resHandle) => {
//     const requestParams = reqHandler(req);

//     axios(requestParams)
//       .then(res => resHandle(res))
//       .catch(err => message.error(err.message));
// }

// const deleteStudentFromApi = reqHandlerCurry(
//     req => ({
//         method: "delete",
//         url: `https://cms.chtoma.com/api/students/${req.id.toString}`,
//         headers: { Authorization: `Bearer ${token}` },
//     }),
//     res => console.log("res", res),
//     err => console.log("err", err)
// )

export const deleteStudent = (id:string)=>{
  return axiosInstance.delete(`${baseURL}/students/${id}`);
}

export const searchStudent = (currentPage, pageSize, queryName)=>{
  return axiosInstance.get(`${baseURL}/students/?page=${currentPage}&limit=${pageSize}&query=${queryName}`);
}

export const fetchStudentById = (id: string) => {
  return axiosInstance.get(`${baseURL}/students/${id}`);
};

