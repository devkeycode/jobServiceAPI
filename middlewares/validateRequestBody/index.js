const { validateSignUpRequestBody } = require("./signup");
const { validateSignInRequestBody } = require("./signin");
const {
  validateCompanyRequestBody,
  validateCompanyUpdateRequestBody,
} = require("./company");
const { validateUserUpdateRequestBody } = require("./user");
const { validateJobRequestBody } = require("./job");

module.exports = {
  validateSignUpRequestBody,
  validateSignInRequestBody,
  validateCompanyRequestBody,
  validateCompanyUpdateRequestBody,
  validateUserUpdateRequestBody,
  validateJobRequestBody,
};
