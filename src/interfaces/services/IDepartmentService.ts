import { type IDepartmentQueryParamsDTO, type IDepartmentDTO } from '@dtos';

export interface IDepartmentService {
  createDepartment: (departmentData: IDepartmentDTO) => Promise<any>;
  updateDepartment: (
    id: string,
    departmentData: IDepartmentDTO
  ) => Promise<any>;
  deleteDepartment: (id: string) => Promise<any>;
  departmentListing: (params: IDepartmentQueryParamsDTO) => Promise<any>;
  departmentListingById: (id: string) => Promise<any>;
}
