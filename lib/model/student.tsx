export interface AddStudentRequest {
    email: string;
    name: string;
    country: string;
    type?: number | null;
}

export interface Record {
    country: string;
    course: Array<any>;
    createdAt: string;
    email: string;
    id: number;
    name: string;
    type?: { id: number; name: string } | null;
  }
  


export type AddStudentFormValue = AddStudentRequest;
export type EditStudentFormValue = AddStudentRequest;