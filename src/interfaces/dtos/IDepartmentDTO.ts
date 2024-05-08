import { type IBaseQueryParamsDTO } from './IBaseQueryParamsDTO';
import { type IColumnFilterDTO } from './IColumnFilterDTO';

export interface IDepartmentDTO {
  departmentName: string;
  isDeleted: boolean;
}

export interface IDepartmentQueryParamsDTO extends IBaseQueryParamsDTO {
  id?: string;
  columnFilters?: IColumnFilterDTO[];
}
