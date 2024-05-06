import { type AdminLoginDTO } from '@dtos';

export interface IAuthService {
  login: (loginData: AdminLoginDTO) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  verifyJWTToken: (token: string) => Promise<any>;
  changePassword: (
    currentUser: string,
    userId: string,
    password: string,
    oldPassword: string
  ) => Promise<any>;
  modifyPassword: (
    token: string,
    password: string,
    userId: string,
    oldPassword?: string,
    isResetLink?: boolean,
    userToken?: string
  ) => Promise<any>;
}
