/* eslint-disable prefer-promise-reject-errors */
import { injectable } from 'inversify';
import { type IFileService } from '@interfaces';
import { statusCodes, Messages, type userTypes, FILE_PATHS } from '@constants';
import fs from 'fs';
import path from 'path';

type FileMoves = Record<string, any>;

@injectable()
export class FileService implements IFileService {
  async relocateFiles(
    fileMoves: FileMoves,
    userType: userTypes,
    userId?: string
  ): Promise<any> {
    try {
      const results = {};
      let filePath;
      let newPath;
      for (const fileType in fileMoves) {
        const oldPaths = fileMoves[fileType];
        switch (fileType) {
          case FILE_PATHS.VENDOR_IMG:
            if (oldPaths.includes('temp/')) {
              filePath = this.getFile(oldPaths);
              newPath = `${FILE_PATHS.PRIVATE}/${userType}/${userId}/${fileType}/${filePath[3]}`;
              await this.relocateFile(newPath, oldPaths);
              results[fileType] = newPath;
            } else {
              results[fileType] = oldPaths;
            }
            break;

          default:
            break;
        }
      }

      return results;
    } catch (error) {
      if (error.status) {
        throw new Error(error.message);
      } else {
        throw new Error(Messages.internalServerError);
      }
    }
  }

  async relocateFile(newPath: string, oldPath: string): Promise<any> {
    return await new Promise((resolve, reject) => {
      try {
        const newFilePath = this.getAbsolutePath(newPath);
        const oldFilePath = this.getAbsolutePath(oldPath);
        const newDir = path.dirname(newFilePath);

        if (fs.existsSync(oldFilePath)) {
          if (!fs.existsSync(newDir)) {
            fs.mkdirSync(newDir, { recursive: true });
          }

          fs.rename(oldFilePath, newFilePath, (err) => {
            if (err) {
              reject({
                status: statusCodes.internal_server,
                message: `Error relocating file: ${err.message}`,
              });
            } else {
              resolve({
                status: statusCodes.success_status,
                message: `${path.basename(
                  oldFilePath
                )} relocated successfully to ${newFilePath}`,
              });
            }
          });
        } else {
          reject({
            status: statusCodes.badRequest_status,
            message: `${path.basename(oldPath)} not found at ${oldPath}`,
          });
        }
      } catch (error) {
        reject({
          status: statusCodes.internal_server,
          message: `Error during file relocation: ${error.message}`,
        });
      }
    });
  }

  getAbsolutePath(filePath: string) {
    return path.join(__dirname, `../${FILE_PATHS.BASE_PATH}/${filePath}`);
  }

  getFile(oldPath: string) {
    return oldPath.split('/');
  }

  async removeFile(uploadedPath: string): Promise<any> {
    try {
      const filePath = path.join(
        __dirname,
        `../${FILE_PATHS.BASE_PATH}/${uploadedPath}`
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);

        return {
          status: statusCodes.success_status,
          message: Messages.successMessage,
        };
      } else {
        return {
          status: statusCodes.not_found,
          message: Messages.dataNotFound,
        };
      }
    } catch (error) {
      return {
        status: statusCodes.badRequest_status,
        message: Messages.badRequest,
      };
    }
  }
}
