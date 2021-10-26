import {
    DashboardOutlined,
    DeploymentUnitOutlined,
    MessageOutlined,
    ReadOutlined,
    SolutionOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { Role } from '../login';

export enum Roles {
    student = 'student',
    teacher = 'teacher',
    manager = 'manager',
  }

export enum RoutePath {
    manager = 'manager',
    teachers = 'teachers',
    students = 'students',
    selectStudents = 'selectStudents',
    courses = 'courses',
    addCourse = 'add-course',
    editCourse = 'edit-course',
    own = 'own',
    schedule = 'schedule',
    profile = 'profile',
    message = 'message',
}

export interface SideNav {
    title: string;
    path: string[];
    icon?: JSX.Element;
    subNav?: SideNav[];
}

const overview: SideNav={
    title: "Message",
    path: [],
    icon: <DashboardOutlined />,
}

const students: SideNav={
    title: "Student",
    path: [RoutePath.students],
    icon: <SolutionOutlined />,
    subNav: [{title: "Student List", path:[""], icon: <TeamOutlined />}],
}

const teachers: SideNav={
    title: "Teacher",
    path: [RoutePath.teachers],
    icon: <DeploymentUnitOutlined />,
    subNav: [{title: "Teacher List", path:[""], icon: <TeamOutlined />}],
}

const courses: SideNav={
    title: "Course",
    path: [RoutePath.courses],
    icon: <ReadOutlined />,
    subNav: [
        {title: "All Course", path:[""], icon: <TeamOutlined />},
        {title: "Add Course", path:[RoutePath.addCourse], icon: <TeamOutlined />},
        {title: "Edit Course", path:[RoutePath.editCourse], icon: <TeamOutlined />}
    ],
}

const message: SideNav={
    title: "Message",
    path: [RoutePath.message],
    icon: <MessageOutlined />,
}

export const routes: Map<Role, SideNav[]> = new Map([
    [Roles.manager, [overview, students, teachers, courses, message]],
  ]);

  