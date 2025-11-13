import { checkSchema } from "express-validator";

export default checkSchema({
  firstName: {
    errorMessage: "First name is required!",
    notEmpty: true,
    trim: true,
  },
  email: {
    errorMessage: "Email is required!",
    notEmpty: true,
    trim: true,
    isEmail: true,
  },
  password: {
    errorMessage: "Password is required!",
    notEmpty: true,
    trim: true,
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: "Min of 8 chars required",
    },
  },
});

// export default [body("email").notEmpty().withMessage("Email is required!")];
