import { FILE_PATHS, TYPES, statusCodes, userTypes } from '@constants';
import { type IVendorDTO, type IVendorQueryParamsDTO } from '@dtos';
import { IFileService, IVendorService } from '@interfaces';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from 'inversify-express-utils';

@controller('/v1/admin/vendor')
export class VendorController {
  private readonly vendorService: IVendorService;
  private readonly fileService: IFileService;
  constructor(
    @inject(TYPES.VendorService) _vendorService: IVendorService,
    @inject(TYPES.FileService) _fileService: IFileService
  ) {
    this.vendorService = _vendorService;
    this.fileService = _fileService;
  }

  @httpGet('/vendor-listing')
  async vendorListing(req: Request, res: Response) {
    try {
      const query: IVendorQueryParamsDTO = req.query;
      const vendor = await this.vendorService.vendorListing(query);
      res.status(statusCodes.success_status).json(vendor);
    } catch (error) {
      res
        .status(statusCodes.badRequest_status)
        .json({ error: error.message, status: false });
    }
  }

  @httpGet('/vendor-listing/:id')
  async vendorListingById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const vendor = await this.vendorService.vendorListingById(id);
      res.status(statusCodes.success_status).json(vendor);
    } catch (error) {
      res
        .status(statusCodes.badRequest_status)
        .json({ error: error.message, status: false });
    }
  }

  @httpPost('/create-vendor')
  async createVendor(req: Request, res: Response) {
    try {
      let vendor;
      vendor = await this.vendorService.createVendor(req.body as IVendorDTO);
      if (vendor.data.vendorImg) {
        const relocatedPayload = {
          ...(vendor.data.vendorImg && {
            [FILE_PATHS.VENDOR_IMG]: vendor.data.vendorImg,
          }),
        };
        const result = await this.fileService.relocateFiles(
          relocatedPayload,
          userTypes.vendor,
          vendor.data._id
        );

        const vendorData: IVendorDTO = {
          ...vendor,
          ...result,
        };
        vendor = await this.vendorService.updateVendor(
          vendor.data._id.toString(),
          vendorData
        );
      }
      res.status(statusCodes.success_status).json(vendor);
    } catch (error) {
      res
        .status(statusCodes.badRequest_status)
        .json({ error: error.message, status: false });
    }
  }

  @httpPut('/update-vendor/:id')
  async updateVendor(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = await this.fileService.relocateFiles(
        req.body,
        userTypes.vendor,
        id
      );
      if (result.vendorImg) req.body.vendorImg = result.vendorImg;
      const updateVendor = await this.vendorService.updateVendor(
        id,
        req.body as IVendorDTO
      );
      if (updateVendor) {
        res.status(statusCodes.success_status).json({ ...updateVendor });
      }
    } catch (error) {
      res
        .status(statusCodes.badRequest_status)
        .json({ error: error.message, status: false });
    }
  }

  @httpDelete('/delete-vendor/:id')
  async deleteVendor(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const vendor = await this.vendorService.deleteVendor(id);
      res.status(statusCodes.success_status).json(vendor);
    } catch (error) {
      res
        .status(statusCodes.badRequest_status)
        .json({ error: error.message, status: false });
    }
  }
}
