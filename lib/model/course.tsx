type CourseStatus = 0 | 1 | 2;
type DurationUnit = 1 | 2 | 3 | 4 | 5;
export interface CourseType {
    id: number;
    name: string;
}

export interface CourseSchedule {
    chapters?: [];
    classTime: [];
    createdAt: string;
    current: number;
    id: number;
    status: number;
    updateAt: "string";
}

export interface Course {
    currentPage?: number;
    pageSize?: number;	
    name?: string;	
    uid?: string;	
    typeId?: number;
    userId?: number;
    id?: number;
    detail?: string;
    startTime?: string;
    price?: number;
    maxStudents?: number;
    star?: number;
    status?: CourseStatus;
    duration?: number;
    durationUnit?: DurationUnit;
    cover?: string;
    teacherName?: string;
    teacherId?: number;
    type?: CourseType[];
    ctime?: string;
    scheduleId?: number;
    schedule?: CourseSchedule;
}

export interface AllCourseRequest{
    currentPage?: number;
    pageSize?: number;	
    name?: string;	
    uid?: string;	
    typeId?: number;
    userId?: number;
};  
 