import { type IBaseQueryParamsDTO } from './IBaseQueryParamsDTO';
import { type IColumnFilterDTO } from './IColumnFilterDTO';

export interface UserLoginDTO {
  email: string; // Username or email for login.
  password: string; // Password for login.
}

export interface UserDetailsDTO {
  firstName: string;
  lastName: string;
  email: string;
  hash: string;
  gender: string;
  birthDate: Date;
  isDeleted?: boolean;
}

// // Interface for query parameters data transfer object
export interface UserQueryParamsDTO extends IBaseQueryParamsDTO {
  email?: string; // Optional filter by email
  firstName?: string; // Optional filter by first name
  lastName?: string; // Optional filter by last name
  gender?: string;
  columnFilters?: IColumnFilterDTO[];
}
