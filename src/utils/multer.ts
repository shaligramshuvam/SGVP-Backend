import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { ACCEPTED_FIELDS, TEMP_ASSETS, statusCodes } from '@constants';
/**
 *  TODO:- Allow Multiple File Upload
 */

// Define the base path for storing uploaded files.
const UPLOADS_PATH = path.join(__dirname, '../assets/public');
const TEMP_UPLOADS_PATH = path.join(__dirname, '../assets/public/temp');

// Maximum file size in megabytes and its equivalent in bytes.
const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Function to generate a dynamic upload path based on a subfolder.
const generateDynamicUploadPath = async (subfolder) => {
  const uploadDir = path.join(
    TEMP_ASSETS.includes(subfolder) ? TEMP_UPLOADS_PATH : UPLOADS_PATH,
    subfolder
  );
  try {
    // Create the directory with the recursive option to create nested directories if they don't exist.
    await fs.mkdir(uploadDir, { recursive: true });
    return uploadDir;
  } catch (error) {
    console.error('Error creating upload directory:', error);
    throw new Error('Failed to create upload directory.');
  }
};

// Get the appropriate error message based on the error code.
const getErrorMessage = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return `Uploaded file size exceeds the limit of ${MAX_FILE_SIZE_MB} MB.`;
  }
  return 'File uploading error.';
};

// Handle Multer error and send appropriate response.
const handleMulterError = (err, res) => {
  const errorMessage = getErrorMessage(err);
  return res
    .status(statusCodes.badRequest_status)
    .json({ message: errorMessage, error: err.message });
};

// Set up and configure Multer instance.
export const getMulterInstance = () => {
  const storage = multer.diskStorage({
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    destination: async (req, file, cb) => {
      const uploadDir = file.fieldname
        ? await generateDynamicUploadPath(file.fieldname)
        : UPLOADS_PATH;
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    // Define the allowed image MIME types.
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'audio/mpeg',
      'audio/ogg',
      'audio/vnd.wav',
      'audio/mp4',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/epub+zip',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      console.log('Invalid File Type');
      cb(
        new Error(
          'Invalid file type. Only Image, Audio and Document files are allowed.'
        ),
        false
      );
    }
  };

  // Create the Multer instance.
  const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
    fileFilter,
  }).fields(ACCEPTED_FIELDS);

  // Middleware to handle file uploads and errors.
  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError || err) {
        return handleMulterError(err, res);
      }
      next();
    });
  };
};
