/* eslint-disable no-async-promise-executor */
import { Messages } from '@constants';
import { Permission } from '@models';
import { injectable } from 'inversify';
import mongoose, { type PipelineStage, isValidObjectId } from 'mongoose';

@injectable()
export class PermissionService {
  async getAdminPermission(adminTypeId: string) {
    return await new Promise<any>(async (resolve, reject) => {
      try {
        if (!isValidObjectId(adminTypeId)) {
          resolve({ status: false, message: Messages.userNotFound });
        }
        const filterQuery = {
          $match: {
            ...(adminTypeId && {
              adminTypeId: new mongoose.Types.ObjectId(adminTypeId),
            }),
          },
        };
        const lookupQuery = [
          {
            $lookup: {
              from: 'modules',
              localField: 'moduleId',
              foreignField: '_id',
              as: 'moduleData',
            },
          },
          {
            $unwind: {
              path: '$moduleData',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: {
              moduleName: '$moduleData.backendModuleName',
            },
          },
        ];

        const aggregatePipeline: PipelineStage[] = [
          ...lookupQuery,
          filterQuery,
          {
            $project: {
              read: 1,
              write: 1,
              moduleName: 1,
              _id: 1,
            },
          },
        ];
        const permission = await Permission.aggregate(aggregatePipeline).exec();
        if (permission.length === 0) {
          resolve({
            status: true,
            message: Messages.dataNotFound,
            data: [],
          });
        } else {
          const data = permission;
          resolve({
            status: true,
            message: Messages.requestCompletedSuccessfully,
            data,
          });
        }
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }
}
