//this file contains the logic for addressing the signup and signin requests
const authController = require("../controllers/auth.controller");
const {
  validateSignUpRequestBody,
  validateSignInRequestBody,
} = require("../middlewares");

module.exports = (app) => {
  app.post(
    "/jobService/api/v1/auth/signup",
    [validateSignUpRequestBody],
    authController.signup
  );
  app.post(
    "/jobService/api/v1/auth/signin",
    [validateSignInRequestBody],
    authController.signin
  );
};
