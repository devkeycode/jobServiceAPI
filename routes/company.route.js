//this file contains the logic for addressing  requests realted to Company resource

const {
  verifyToken,
  isAdmin,
  validateCompanyRequestBody,
  validateCompanyUpdateRequestBody,
  isValidCompanyIdInReqParam,
} = require("../middlewares");

const companyController = require("../controllers/company.controller");

module.exports = (app) => {
  //create a company
  app.post(
    "/jobService/api/v1/companies",
    [verifyToken, isAdmin, validateCompanyRequestBody],
    companyController.create
  );

  //fetch all the companies
  app.get(
    "/jobService/api/v1/companies",
    [verifyToken, isAdmin],
    companyController.findAll
  );

  //fetch specific company
  app.get(
    "/jobService/api/v1/companies/:id",
    [verifyToken, isAdmin, isValidCompanyIdInReqParam],
    companyController.findOne
  );

  //udpate specific company
  app.put(
    "/jobService/api/v1/companies/:id",
    [
      validateCompanyUpdateRequestBody,
      verifyToken,
      isAdmin,
      isValidCompanyIdInReqParam,
    ],
    companyController.update
  );
};
