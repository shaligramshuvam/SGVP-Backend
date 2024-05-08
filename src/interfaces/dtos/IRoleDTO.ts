import { type IBaseQueryParamsDTO } from './IBaseQueryParamsDTO';
import { type IColumnFilterDTO } from './IColumnFilterDTO';

export interface IRoleDTO {
  roleName: string;
  isDeleted?: boolean;
}

export interface IRoleQueryParamsDTO extends IBaseQueryParamsDTO {
  id?: string;
  columnFilters?: IColumnFilterDTO[];
}
