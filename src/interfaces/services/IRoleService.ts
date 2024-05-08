import { type IRoleQueryParamsDTO, type IRoleDTO } from '@dtos';

export interface IRoleService {
  createRole: (roleData: IRoleDTO) => Promise<any>;
  updateRole: (id: string, roleData: IRoleDTO) => Promise<any>;
  deleteRole: (id: string) => Promise<any>;
  roleListing: (params: IRoleQueryParamsDTO) => Promise<any>;
  roleListingById: (id: string) => Promise<any>;
}
