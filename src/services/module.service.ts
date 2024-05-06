import { injectable } from 'inversify';
import { type IModuleService } from '@interfaces';
import { type IModuleDto } from '@dtos';
import { Module } from '@models';
import { statusCodes } from '@constants';
import mongoose from 'mongoose';
// Define a service that handles operations related to modules.
@injectable()
export class ModuleService implements IModuleService {
  // Create a new module.
  async createModule(module: IModuleDto) {
    // Check if a module with the same name already exists.
    const isExists = await Module.exists({
      moduleName: module.moduleName,
      isDeleted: false,
    });

    if (isExists) {
      return {
        status: statusCodes.error_status,
        message: 'Module name already exists',
      };
    }

    // Save the new module.
    const newModule = await Module.create(module);

    // const existsAdminTypes = await AdminType.find();
    // const newPermisssions: IPermissionsDTO[] = existsAdminTypes.map((e) => ({
    //   adminTypeId: e._id.toString(),
    //   moduleId: newModule._id.toString(),
    //   read: false,
    //   write: false,
    // }));
    // await this.AdminTypeService.addPermissions(newPermisssions);

    return {
      status: statusCodes.created_status,
      message: 'Module created successfully',
      data: newModule,
    };
  }

  // Get all modules with optional filtering and pagination.
  async getAllModules(values: any) {
    // Extract pagination parameters.
    const pageNum = values.pageNum ? values.pageNum : 1;
    const limit = values.pageLimit ? values.pageLimit : 5000;
    const skip = limit * (pageNum - 1);
    const adminTypeId = values.jwtTokendata.adminTypeId;

    // Initialize query filters and sorting options.
    let matchQuery: any = {
      isSubModule: false,
    };
    const orFilter: any = [];
    const andFilter: any = {};
    const sortField = values.sortField || '_id'; // Default sorting field is "gender"
    const sortOrder = values.sortOrder === 'asc' ? 1 : -1; // Default sorting order is descending

    // Define the dynamic sort object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sort = {
      [sortField]: sortOrder,
    };
    // Apply search filtering.
    if (values.search) {
      // Sanitize the search input and define searchable fields.
      const specialCharacters = /[.*+?^${}()|[\]\\]/g;
      const sanitizedSearch = values.search.replace(specialCharacters, '\\$&');
      const searchFields = ['moduleName'];
      // Create a regular expression for case-insensitive search.
      orFilter.push(
        ...searchFields.map((field) => ({
          [field]: {
            $regex: sanitizedSearch,
            $options: 'i',
          },
        }))
      );
    }

    // Apply other filters.
    const filterFields = ['moduleName'];

    filterFields.forEach((field) => {
      const value = values[field];
      if (value !== undefined) {
        andFilter[field] = value;
      }
    });
    if (orFilter.length > 0) {
      matchQuery.$or = orFilter;
    }
    matchQuery = {
      isDeleted: false,
      $or: [
        {
          $or: [
            { permissions: { $exists: false } },
            { 'permissions.read': true },
            { 'permissions.write': true },
          ],
        },
      ],
      ...matchQuery,
      ...andFilter,
    };

    const permissionLookup = [
      {
        $lookup: {
          from: 'permissions',
          localField: '_id',
          foreignField: 'moduleId',
          as: 'permissions',
          pipeline: [
            {
              $match: {
                adminTypeId: new mongoose.Types.ObjectId(adminTypeId),
              },
            },
            { $project: { read: 1, write: 1 } },
          ],
        },
      },
    ];

    // Define aggregation pipeline stages for query and count.
    let queryDoc: any = [
      // Project stage: Select specific fields and apply transformations.
      {
        $lookup: {
          from: 'modules', // Use the actual collection name here
          localField: '_id',
          foreignField: 'moduleId',
          as: 'submodules',
          pipeline: [{ $match: { isDeleted: false } }, ...permissionLookup],
        },
      },
      ...permissionLookup,
      {
        $project: {
          _id: '$_id',
          permissions: { $arrayElemAt: ['$permissions', 0] },
          isDeleted: 1,
          moduleName: { $ifNull: ['$moduleName', ''] },
          moduleKey: { $ifNull: ['$moduleKey', ''] },
          sequence: { $ifNull: ['$sequence', ''] },
          icon: { $ifNull: ['$icon', ''] },
          link: { $ifNull: ['$link', ''] },
          submodules: {
            $filter: {
              input: '$submodules',
              as: 'sb',
              cond: {
                $eq: [
                  {
                    $getField: {
                      field: 'read',
                      input: { $arrayElemAt: ['$$sb.permissions', 0] },
                    },
                  },
                  true,
                ],
              },
            },
          },
          isSubModule: { $ifNull: ['$isSubModule', false] },
        },
      },
      // Match stage: Apply filtering criteria to the documents.
      {
        $match: matchQuery,
      },
    ];

    let queryCount: any = queryDoc;
    // Add sorting, skipping, and limiting stages.
    queryDoc = [
      ...queryDoc,
      ...[{ $sort: { sequence: 1 } }, { $skip: skip }, { $limit: limit }],
    ];

    // Define aggregation pipeline for counting total filtered documents.
    queryCount = [
      ...queryCount,
      ...[
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ],
    ];

    // Execute aggregation queries.
    const data = await Module.aggregate(queryDoc).exec();
    const totalmodules = await Module.aggregate(queryCount).exec();

    // Calculate total filtered pages and respond with appropriate result.
    const totalFilteredPage =
      totalmodules?.length > 0 && totalmodules[0].count
        ? Math.ceil(totalmodules[0].count / limit)
        : 0;

    if (data && data.length > 0) {
      return {
        status: statusCodes.success_status,
        data,
        metaData: {
          currentPage: pageNum,
          totalFilteredCount: totalmodules[0]?.count
            ? totalmodules[0]?.count
            : 0,
          totalFilteredPage,
        },
        message: 'Request completed successfully',
      };
    } else {
      return {
        status: statusCodes.success_status,
        data: [],
        message: 'No data found',
      };
    }
  }

  // Get module details by ID.
  async getModuleById(id: string) {
    const moduleData = await Module.findById(id);

    if (!moduleData) {
      return {
        status: statusCodes.error_status,
        message: 'Module not found',
      };
    }

    return {
      status: statusCodes.success_status,
      message: 'Request completed successfully',
      data: moduleData,
    };
  }

  // Update module details.
  async editModule(module: IModuleDto) {
    const moduleId = module.id;
    // Check if another module with the same name already exists.
    const isExists = await Module.exists({
      moduleName: module.moduleName,
      _id: { $ne: moduleId },
    });

    if (isExists) {
      return {
        status: statusCodes.error_status,
        message: 'Module name already exists',
      };
    }

    // Update the module data.
    const filter = { _id: moduleId };
    const update = { $set: module };
    const options = { new: true };

    const updatedModuleData = await Module.findByIdAndUpdate(
      filter,
      update,
      options
    );

    if (!updatedModuleData) {
      return {
        status: statusCodes.error_status,
        message: 'Module not found',
      };
    }

    return {
      status: statusCodes.success_status,
      message: 'Module updated successfully',
      data: updatedModuleData,
    };
  }

  // Delete a module by ID.
  async deleteModule(id: string) {
    if (id) {
      const existingModule = await Module.findById(id);

      if (!existingModule) {
        return {
          status: statusCodes.error_status,
          message: 'Module not found',
        };
      }

      await Module.findByIdAndDelete(id);

      return {
        status: statusCodes.success_status,
        message: 'Module has been deleted successfully',
      };
    } else {
      return {
        status: statusCodes.error_status,
        message: 'Missing or invalid module ID',
      };
    }
  }
}
