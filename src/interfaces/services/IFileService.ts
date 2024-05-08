import { type userTypes } from '@constants';

// Interface for the FileService
export interface IFileService {
  relocateFiles: (
    fileMoves: any,
    userType: userTypes,
    vendorId?: string
  ) => Promise<any>;
  relocateFile: (newPath: string, oldPath: string) => Promise<any>;
  removeFile: (path: string) => Promise<any>;
}
