import { type IBaseQueryParamsDTO } from './IBaseQueryParamsDTO';
import { type IColumnFilterDTO } from './IColumnFilterDTO';

export interface IVendorDTO {
  firstName: string;
  lastName: string;
  bussinessName: string;
  contactNumber: number;
  contactPersonFirstName?: string;
  contactPersonLastName?: string;
  contactPersonNumber?: number;
  alreadyHadDeal?: boolean;
  isDeleted?: boolean;
  vendorImg: string;
  bussinessEmail: string;
  vendorType: string;
}

export interface IVendorQueryParamsDTO extends IBaseQueryParamsDTO {
  id?: string;
  columnFilters?: IColumnFilterDTO[];
}
