import { type UserQueryParamsDTO, type UserDetailsDTO } from '@dtos';
import type mongoose from 'mongoose';

// Interface for the UserService
export interface IUserService {
  addNewUser: (userDetails: UserDetailsDTO) => Promise<any>;
  getAllUsers: (values: UserQueryParamsDTO) => Promise<any>;
  editUser: (userId: string, userDetail: UserDetailsDTO) => Promise<any>;

  getUserById: (id: string) => Promise<any>;
  deleteUserAccount: (id: mongoose.Types.ObjectId) => Promise<any>;
}
