import type { Request } from "express";

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role?: string | undefined;
  password: string;
}

export interface RegisterUserRequest extends Request {
  body: UserData;
}

export interface AuthRequest extends Request {
  auth: {
    id: number;
    role: string;
  };
}
