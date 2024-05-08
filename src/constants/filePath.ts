const FILE_PATHS = {
  BASE_PATH: 'assets',
  PUBLIC: 'public',
  AVATAR: 'avatar',
  PRIVATE: 'private',
  ADMIN: 'admin',
  USER: 'user',
  VENDOR_IMG: 'vendorImg',
};

const TEMP_ASSETS = ['vendorImg'];

// Define the accepted fields for file uploads.
const ACCEPTED_FIELDS = [{ name: 'vendorImg', maxCount: 1 }];

export { FILE_PATHS, TEMP_ASSETS, ACCEPTED_FIELDS };
