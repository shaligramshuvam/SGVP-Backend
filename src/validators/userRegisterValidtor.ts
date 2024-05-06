import * as yup from 'yup';

const upsertUserRegisterRequestSchema = yup.object({
  email: yup.string().email().required(),
  hash: yup.string(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  gender: yup.mixed().oneOf(['male', 'female', 'boy', 'girl', 'other']),
  birthDate: yup.date(),
});

export { upsertUserRegisterRequestSchema };
