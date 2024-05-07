/* eslint-disable no-async-promise-executor */
import { Messages } from '@constants';
import { type IDepartmentQueryParamsDTO, type IDepartmentDTO } from '@dtos';
import { type IDepartmentService } from '@interfaces';
import { Department } from '@models';
import { paginatorData } from '@utils';
import { injectable } from 'inversify';
import { type PipelineStage, isValidObjectId } from 'mongoose';

@injectable()
export class DepartmentService implements IDepartmentService {
  async createDepartment(departmentData: IDepartmentDTO) {
    return await new Promise<any>(async (resolve, reject) => {
      try {
        const department = await Department.create(departmentData);
        resolve({
          status: true,
          message: Messages.requestCompletedSuccessfully,
          data: department,
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

  async updateDepartment(id: string, departmentData: IDepartmentDTO) {
    return await new Promise<any>(async (resolve, reject) => {
      try {
        if (!isValidObjectId(id)) {
          reject(new Error(Messages.invalidId));
        }

        const isExists = await Department.findOne({
          departmentName: departmentData.departmentName,
        });

        if (isExists) {
          resolve({
            status: false,
            message: Messages.recordAlreadyExist,
          });
          return;
        }

        const department = await Department.findOneAndUpdate(
          { _id: id },
          { $set: departmentData },
          { new: true }
        );
        resolve({
          status: true,
          message: Messages.recordUpdatedSuccessfully,
          data: department,
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

  async deleteDepartment(id: string) {
    return await new Promise<any>(async (resolve, reject) => {
      try {
        if (!isValidObjectId(id)) {
          reject(new Error(Messages.invalidId));
        }
        const department = await Department.findOneAndUpdate(
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
          messages: Messages.requestCompletedSuccessfully,
          data: department,
        });
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }

  async departmentListing(params: IDepartmentQueryParamsDTO) {
    return await new Promise<any>(async (resolve, reject) => {
      try {
        const { skip, limit, sort } = paginatorData(params ?? {});
        const searchFields = [];

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
            ...(params.id && { _id: params.id }),
            ...(searchFilter.length > 0 && { $or: searchFilter }),
            ...(columnFilters &&
              columnFilters.length > 0 && { $and: columnFilters }),
          },
        };

        const lookupQuery = [
          {
            $addFields: {
              _id: { $toString: '$_id' },
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

        const result = await Department.aggregate(aggregatePipeline).exec();
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

  async departmentListingById(id: string) {
    return await new Promise<any>(async (resolve, reject) => {
      try {
        if (!isValidObjectId(id)) {
          reject(new Error(Messages.invalidId));
        }
        const department = await Department.findOne({ _id: id });
        resolve({
          status: true,
          message: Messages.requestCompletedSuccessfully,
          data: department,
        });
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }
}
