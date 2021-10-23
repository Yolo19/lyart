export interface AddStudentRequest {
    email: string;
    name: string;
    country: string;
    type?: number | null;
}
  


export type AddStudentFormValue = AddStudentRequest;
export type EditStudentFormValue = AddStudentRequest;