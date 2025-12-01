import { checkSchema } from "express-validator";

export default checkSchema({
  name: {
    errorMessage: "Name is required!",
    notEmpty: true,
    trim: true,
    isLength: {
      options: {
        min: 4,
      },
      errorMessage: "Min of 8 chars required in name",
    },
  },
  address: {
    errorMessage: "Address is required!",
    notEmpty: true,
    trim: true,
  },
});
