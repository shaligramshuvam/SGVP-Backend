/* eslint-disable no-async-promise-executor */
import { Messages } from '@constants';
import { type IRoleQueryParamsDTO, type IRoleDTO } from '@dtos';
import { type IRoleService } from '@interfaces';
import { Role } from '@models';
import { paginatorData } from '@utils';
import { injectable } from 'inversify';
import { type PipelineStage, isValidObjectId } from 'mongoose';

@injectable()
export class RoleService implements IRoleService {
  async createRole(roleData: IRoleDTO) {
    return await new Promise<any>(async (resolve, reject) => {
      try {
        const role = await Role.create(roleData);
        resolve({
          status: true,
          message: Messages.requestCompletedSuccessfully,
          data: role,
        });
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }

  async updateRole(id: string, roleData: IRoleDTO) {
    return await new Promise<any>(async (resolve, reject) => {
      try {
        if (!isValidObjectId(id)) {
          reject(new Error(Messages.invalidId));
        }

        const isExists = await Role.findOne({ roleName: roleData.roleName });
        if (isExists) {
          resolve({
            status: false,
            message: Messages.recordAlreadyExist,
          });
          return;
        }
        const role = await Role.findOneAndUpdate(
          {
            _id: id,
          },
          {
            $set: roleData,
          },
          {
            new: true,
          }
        );
        resolve({
          status: true,
          message: Messages.recordUpdatedSuccessfully,
          data: role,
        });
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }

  async deleteRole(id: string) {
    return await new Promise<any>(async (resolve, reject) => {
      try {
        if (!isValidObjectId(id)) {
          reject(new Error(Messages.invalidId));
        }

        const role = await Role.findOneAndUpdate(
          {
            _id: id,
          },
          {
            $set: { isDeleted: true },
          },
          {
            new: true,
          }
        );
        resolve({
          status: true,
          message: Messages.recordUpdatedSuccessfully,
          data: role,
        });
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }

  async roleListing(params: IRoleQueryParamsDTO) {
    return await new Promise<any>(async (resolve, reject) => {
      try {
        const { skip, limit, sort } = paginatorData(params ?? {});
        const searchFields = ['roleName'];

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

        const result = await Role.aggregate(aggregatePipeline).exec();
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
}
