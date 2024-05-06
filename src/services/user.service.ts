/* eslint-disable no-case-declarations */
/* eslint-disable no-async-promise-executor */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-base-to-string */
import { type IUserService } from '@interfaces';
import { injectable } from 'inversify';
import { User } from '@models';
import mongoose, { type PipelineStage } from 'mongoose';
import { Messages } from '@constants';
import { type UserQueryParamsDTO, type UserDetailsDTO } from '@dtos';
import { paginatorData } from '@utils';
@injectable()
export class UserService implements IUserService {
  async editUser(userId: string, userDetail: UserDetailsDTO) {
    return await new Promise<any>(async (resolve, reject) => {
      try {
        const isUserExists = await User.find({ _id: userId });
        if (!isUserExists) {
          throw new Error(Messages.userNotFound);
        }
        const user = await User.findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(userId),
          },
          { $set: userDetail }
        );
        resolve({
          status: true,
          message: Messages.userUpdateMessage,
          data: user,
        });
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }

  async getAllUsers(values: UserQueryParamsDTO): Promise<any> {
    return await new Promise(async (resolve, reject) => {
      try {
        const { skip, limit, sort } = paginatorData(values ?? {});

        const searchFields = ['email', 'firstName', 'lastName', 'gender'];

        let searchFilter: any = [];
        const columnFilters = values.columnFilters;

        if (values) {
          searchFilter = searchFields.map((field) => ({
            [field]: {
              $regex: values?.search ?? '',
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

        const aggregatePipeline: PipelineStage[] = [
          {
            $facet: {
              data: [
                filterQuery,
                { $sort: sort },
                { $skip: skip },
                ...(limit > 0 ? [{ $limit: limit }] : []),
              ],
              totalCount: [
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

        const result = await User.aggregate(aggregatePipeline).exec();
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
              currentPage: values?.pageNum,
              totalCount,
            },
          });
        }
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }

  async getUserById(id: string): Promise<any> {
    return await new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({
          isDeleted: false,
          _id: id,
        });
        if (!user) {
          throw new Error(Messages.userNotFound);
        }
        resolve({
          status: true,
          message: Messages.successMessage,
          data: user,
        });
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }

  async addNewUser(userDetails: UserDetailsDTO) {
    return await new Promise<any>(async (resolve, reject) => {
      try {
        const isUserExists = await User.find({
          email: userDetails.email,
        });
        if (isUserExists.length > 0) {
          throw new Error(Messages.foundContact);
        }
        const user: UserDetailsDTO = {
          ...userDetails,
          isDeleted: false,
        };
        const newUser = await User.create(user);

        resolve({
          status: true,
          message: Messages.userCreatedMessage,
          data: newUser,
        });
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }

  async deleteUserAccount(id: mongoose.Types.ObjectId) {
    return await new Promise(async (resolve, reject) => {
      try {
        const isUserExists = await User.findOne({ _id: id });
        if (!isUserExists) {
          throw new Error(Messages.userNotFound);
        }

        const user = await User.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              isDeleted: true,
            },
          }
        );

        resolve({
          status: true,
          message: Messages.recordDeletedSuccessfully,
          data: user,
        });
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }
}
