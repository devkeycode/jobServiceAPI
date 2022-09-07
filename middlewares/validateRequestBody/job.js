//This middleware contains the logic for handling request bodies coming along with  requests realted to Job resource.

const trimValuesInRequestBody = require("../../utils/trimRequestBody");
const {
  jobStatuses,
  companyVerificationStatuses,
} = require("../../utils/constants");
const Company = require("../../models/company.model");
const { isValidObjectId } = require("mongoose");

exports.validateJobRequestBody = async (req, res, next) => {
  trimValuesInRequestBody(req); //to remove unwanted spaces
  //Job REQUEST BODY required properties{title,description}
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Title is required field and is not provided.",
    });
  }
  if (!description) {
    return res.status(400).json({
      message: "Description is required field and is not provided.",
    });
  }

  //ensure if userid is admin, then admin must pass the valid companyId
  if (req.isAdmin == true) {
    //ensure a valid companyId is passed by the admin user
    const companyId = req.body.companyId;
    if (!companyId) {
      return res.status(400).json({
        message: "CompanyId need to be passed if admin is creating the job.",
      });
    }
    if (!isValidObjectId(companyId)) {
      return res.status(400).json({
        message: "Not valid CompanyId.",
      });
    }
    //find the compnayId is valid or not
    const company = await Company.findOne({ _id: companyId });
    if (company == null) {
      return res.status(400).json({
        message: "Not valid CompanyId.",
      });
    } else if (company.verified !== companyVerificationStatuses.approved) {
      return res.status(400).json({
        message:
          "Company provided, current verified status is not approved.Only the company with approved status is allowed to create a job.",
      });
    } else {
      //bind the company to req, so to avoid db call
      req.company = company;
    }
  }
  //all validation passed
  next();
};
