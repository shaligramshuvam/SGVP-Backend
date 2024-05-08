import { Request, Response } from 'express';
import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { IFileService } from '@interfaces';
import {
  statusCodes,
  Messages,
  TYPES,
  FILE_PATHS,
  TEMP_ASSETS,
} from '@constants';
import config from 'config';
import { getMulterInstance } from '@utils';

// Initialize multer for file uploads
const upload = getMulterInstance();

// Define a controller for modules
@controller('/v1/files')
export class FileController {
  private readonly fileService: IFileService;
  private readonly DOMAIN: string;

  constructor(@inject(TYPES.FileService) fileService: IFileService) {
    this.fileService = fileService;
    this.DOMAIN = config.get('URLS.DOMAIN');
  }

  private getUploadedFileName(req: Request, fieldName: string): string | null {
    const field = req.files?.[fieldName]?.[0];
    return field?.filename || null;
  }

  @httpPost('/upload/:accessLevel', upload)
  async uploadFile(req: Request, res: Response) {
    try {
      const uploadedField = Object.keys(req?.files as object)[0];
      const filepath =
        (TEMP_ASSETS.includes(uploadedField)
          ? `${req?.params.accessLevel}/temp`
          : `${req?.params.accessLevel}`) +
        `/${uploadedField}/${this.getUploadedFileName(req, uploadedField)}`;
      const response = {
        baseURL: `${this.DOMAIN}/${FILE_PATHS.BASE_PATH}/`,
        filepath,
      };

      res.status(statusCodes.success_status).json(response);
    } catch (error) {
      return res.status(500).json({
        status: statusCodes.error_status,
        message: Messages.genericError,
        error: (error as Error).message || Messages.genericError,
      });
    }
  }

  // Handle DELETE request to delete a module
  @httpPost('/remove')
  async removeFile(req: Request, res: Response) {
    try {
      const path = req.body.path;
      const deleted = await this.fileService.removeFile(path);
      if (deleted) {
        res.status(deleted.status).json(deleted);
      } else {
        res.status(404).json({ message: Messages.fileNotFound });
      }
    } catch (error) {
      res.status(500).json({ message: Messages.internalServerError });
    }
  }
}
