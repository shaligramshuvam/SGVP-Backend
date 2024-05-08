import { type IVendorQueryParamsDTO, type IVendorDTO } from '@dtos';

export interface IVendorService {
  createVendor: (vendorData: IVendorDTO) => Promise<any>;
  updateVendor: (id: string, vendorData: IVendorDTO) => Promise<any>;
  deleteVendor: (id: string) => Promise<any>;
  vendorListing: (params: IVendorQueryParamsDTO) => Promise<any>;
  vendorListingById: (id: string) => Promise<any>;
}
