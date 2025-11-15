import { checkSchema } from "express-validator";

export default checkSchema({
  email: {
    errorMessage: "Email is required!",
    trim: true,
    notEmpty: true,
    isEmail: {
      errorMessage: "Email shoould be a valid email",
    },
  },
  password: {
    errorMessage: "Password is reqiured",
    trim: true,
    notEmpty: true,
  },
});
