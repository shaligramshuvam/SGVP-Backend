/* eslint-disable no-async-promise-executor */
import { Messages } from '@constants';
import { type IVendorQueryParamsDTO, type IVendorDTO } from '@dtos';
import { type IVendorService } from '@interfaces';
import { Vendor } from '@models';
import { paginatorData } from '@utils';
import { injectable } from 'inversify';
import { type PipelineStage, isValidObjectId } from 'mongoose';
import config from 'config';

@injectable()
export class VendorService implements IVendorService {
  async createVendor(vendorData: IVendorDTO) {
    return await new Promise<any>(async (resolve, reject) => {
      try {
        const vendor = await Vendor.create(vendorData);
        resolve({
          status: true,
          message: Messages.requestCompletedSuccessfully,
          data: vendor,
        });
      } catch (error) {
        if (error?.code && error?.code === 11000) {
          reject(new Error(Messages.recordAlreadyExist));
        } else {
          reject(new Error(error.message));
        }
      }
    });
  }

  async updateVendor(id: string, vendorData: IVendorDTO) {
    return await new Promise<any>(async (resolve, reject) => {
      try {
        if (!isValidObjectId(id)) {
          reject(new Error(Messages.invalidId));
        }
        const vendor = await Vendor.findOneAndUpdate(
          {
            _id: id,
          },
          {
            $set: vendorData,
          },
          {
            new: true,
          }
        );

        resolve({
          status: true,
          message: Messages.recordUpdatedSuccessfully,
          data: vendor,
        });
      } catch (error) {
        if (error?.code && error?.code === 11000) {
          reject(new Error(Messages.recordAlreadyExist));
        } else {
          reject(new Error(error.message));
        }
      }
    });
  }

  async deleteVendor(id: string) {
    return await new Promise<any>(async (resolve, reject) => {
      try {
        if (!isValidObjectId(id)) {
          reject(new Error(Messages.invalidId));
        }

        const vendor = await Vendor.findOneAndUpdate(
          {
            _id: id,
          },
          {
            $set: {
              isDeleted: true,
            },
          },
          {
            new: true,
          }
        );

        resolve({
          status: true,
          message: Messages.requestCompletedSuccessfully,
          data: vendor,
        });
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }

  async vendorListing(params: IVendorQueryParamsDTO) {
    return await new Promise<any>(async (resolve, reject) => {
      try {
        const { skip, limit, sort } = paginatorData(params ?? {});
        const timezone = config.get('DEFAULT_TIMEZONE');
        const dateFormat = config.get('DATE_FORMAT');
        const searchFields = [
          '_id',
          'firstName',
          'lastName',
          'bussinessName',
          'contactNumber',
          'contactPersonFirstName',
          'contactPersonLastName',
          'contactPersonNumber',
          'alreadyHadDeal',
          'bussinessEmail',
          'vendorType',
        ];

        let searchFilter: any = [];
        const columnFilters = params?.columnFilters;

        if (params?.search) {
          searchFilter = searchFields.map((field) => ({
            [field]: {
              $regex: params?.search,
              $options: 'i',
            },
          }));
        }

        const filterQuery = {
          $match: {
            isDeleted: false,
            ...(searchFilter.length > 0 && { $or: searchFilter }),
            ...(columnFilters &&
              columnFilters.length > 0 && { $and: columnFilters }),
          },
        };

        const lookupQuery = [
          {
            $addFields: {
              _id: { $toString: '$_id' },
              contactNumber: { $toString: '$contactNumber' },
              contactPersonNumber: { $toString: '$contactPersonNumber' },
              alreadyHadDeal: { $toString: '$alreadyHadDeal' },
              updatedAt: {
                $dateToString: {
                  format: dateFormat,
                  date: { $toDate: '$updatedAt' },
                  timezone,
                },
              },
              createdAt: {
                $dateToString: {
                  format: dateFormat,
                  date: { $toDate: '$createdAt' },
                  timezone,
                },
              },
            },
          },
        ];
        const aggregatePipeline: PipelineStage[] = [
          {
            $facet: {
              data: [
                ...lookupQuery,
                filterQuery,
                { $sort: sort },
                { $skip: skip },
                ...(limit > 0 ? [{ $limit: limit }] : []),
              ],
              totalCount: [
                ...lookupQuery,
                filterQuery,
                { $group: { _id: null, count: { $sum: 1 } } },
              ],
            },
          },
          {
            $project: {
              data: 1,
              totalCount: { $arrayElemAt: ['$totalCount.count', 0] },
            },
          },
        ];

        const result = await Vendor.aggregate(aggregatePipeline).exec();
        if (result.length === 0 || result[0].data.length === 0) {
          resolve({
            status: true,
            message: Messages.dataNotFound,
            data: [],
          });
        } else {
          const { data, totalCount } = result[0];
          resolve({
            status: true,
            message: Messages.requestCompletedSuccessfully,
            data,
            metaData: {
              perPage: limit,
              currentPage: params?.pageNum,
              totalCount,
            },
          });
        }
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }

  async vendorListingById(id: string) {
    return await new Promise(async (resolve, reject) => {
      try {
        if (!isValidObjectId(id)) {
          reject(new Error(Messages.invalidId));
        }
        const vendor = await Vendor.findOne({
          $and: [{ _id: id }, { isDeleted: false }],
        });

        if (!vendor) {
          resolve({
            status: false,
            message: Messages.dataNotFound,
          });
          return;
        }
        resolve({
          status: true,
          message: Messages.requestCompletedSuccessfully,
          data: vendor,
        });
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }
}
