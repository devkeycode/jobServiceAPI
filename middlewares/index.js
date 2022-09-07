const {
  validateSignUpRequestBody,
  validateSignInRequestBody,
  validateCompanyRequestBody,
  validateCompanyUpdateRequestBody,
  validateUserUpdateRequestBody,
  validateJobRequestBody,
} = require("./validateRequestBody");

const {
  isAdmin,
  isAdminOrHr,
  isAdminOrOwner,
  isOwnerOrApplicantOrAdmin,
  verifyToken,
} = require("./auth.jwt");

const {
  isValidCompanyIdInReqParam,
  isValidUserIdInReqParam,
  isValidJobIdInReqParam,
} = require("./validateIDInRequestParam");

module.exports = {
  validateSignUpRequestBody,
  validateSignInRequestBody,
  validateCompanyRequestBody,
  validateCompanyUpdateRequestBody,
  validateUserUpdateRequestBody,
  validateJobRequestBody,
  isAdmin,
  isAdminOrHr,
  isAdminOrOwner,
  verifyToken,
  isValidCompanyIdInReqParam,
  isValidUserIdInReqParam,
  isValidJobIdInReqParam,
  isOwnerOrApplicantOrAdmin,
};
