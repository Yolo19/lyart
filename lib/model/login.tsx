export type Role = "student" | "teacher" | "manager";

export interface LoginFormValues {
  role: Role;
  email: string;
  password: string;
}

export type LoginRequest = LoginFormValues;

export interface LoginResponse {
  token: string;
  role: Role;
  userId: number;
}
