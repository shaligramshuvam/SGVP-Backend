const Messages = {
  // Success messages
  successMessage: 'Request completed successfully!',
  loginSuccessMessage: 'Login successful!',
  userCreatedMessage: 'User Registered successfully!',
  userUpdateMessage: 'User Updated successfully!',
  userDeleteMessage: 'User Deleted sucessfully!',
  verificationsuccess: 'Verification successful.',
  resetSuccessful: 'Password reset successful',
  setSuccessful: 'Password set successful',
  changeSuccessful: 'Password change successful',
  recordUpdatedSuccessfully: 'Record saved successfully.',
  recordDeletedSuccessfully: 'Record deleted successfully.',
  recordCreatedSuccessfully: 'Record created successfully.',
  requestCompletedSuccessfully: 'Request completed successfully.',

  // Invalid messages
  invalidEmail: 'Email not found',
  invalidCredentials: 'Invalid credentials',
  invalidIds: 'Please Provide Valid Record IDs',
  invalidId: 'Please provide valid id.',

  // Error messages
  validationError: 'Validation error!',
  internalServerError: 'Internal server error',
  tokenError: 'Invalid Token!!',
  genericError: 'Something went wrong!',
  isNotValid: (field: string) => `${field} is not valid`,
  isCurrentlyInUse: (field: string) => `${field} is currently is use.`,
  fileNotFound: 'File doesnot exists',

  // Not messages
  userNotFound: 'User not found.',
  recordNotCreated: 'Record not created! ',
  dataNotFound: 'Data not found',
  formNotFound: 'Form not found',
  recordDoesNotExist: `Record doesn't exist`,
  unverifiedVerificationCode:
    'Verification code has not been verified. Please verify first.',
  recordNotFound: (field: string) => `${field} not found`,
  recordDoesNotExists: (field: string) => `${field} does not exist`,

  // Failure messages
  formExistsWithThisName: 'Form name is already exists.Try new name',
  badRequest: 'Bad request',
  recordAlreadyExist: 'Record already exists!',
  emailPhoneNumberAlreadyExist: 'Email or Phone Number Already Exists ',
  foundContact: 'User is already been registered.',
  failedToAuthenticate: 'Falied to Authenticate',
  alreadyVerified: 'Verification already completed.',
  expiredVerificationCode:
    'Verification code has expired. Please request a new verification code.',
  newPasswordSameAsOld:
    'New password must be different from the existing password.',
  currentpasswordwrong:
    'Your current password is wrong, please enter the correct password.',

  // Misc. Messages
  verificationEmailSent:
    'A verification email has been sent to your registered email address. Please check your inbox.',

  // Unauthorized
  unauthorizeResourse: 'Requested resource is unauthorized!!',
};

export { Messages };
