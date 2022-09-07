//this file contains the logic for addressing the  requests related to User resource

const userController = require("../controllers/user.controller");

const {
  verifyToken,
  isAdmin,
  isAdminOrOwner,
  isValidUserIdInReqParam,
  validateUserUpdateRequestBody,
} = require("../middlewares");

module.exports = (app) => {
  //get all the users
  app.get(
    "/jobService/api/v1/users",
    [verifyToken, isAdmin],
    userController.findAllUsers
  );

  //get a single user by id
  app.get(
    "/jobService/api/v1/users/:id",
    [verifyToken, isValidUserIdInReqParam, isAdminOrOwner],
    userController.findByUserId
  );

  //update user
  app.put(
    "/jobService/api/v1/users/:id",
    [
      verifyToken,
      isValidUserIdInReqParam,
      isAdminOrOwner,
      validateUserUpdateRequestBody,
    ],
    userController.update
  );
};
