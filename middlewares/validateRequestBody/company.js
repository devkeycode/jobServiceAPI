//This middleware contains the logic for handling request bodies coming along with  requests realted to Company resource.

const trimValuesInRequestBody = require("../../utils/trimRequestBody");
const { companyVerificationStatuses } = require("../../utils/constants");

exports.validateCompanyRequestBody = async (req, res, next) => {
  trimValuesInRequestBody(req); //to remove unwanted spaces
  //Company REQUEST BODY required properties{name,address}
  const { name, address } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Name is required field and is not provided.",
    });
  }
  if (!address) {
    return res.status(400).json({
      message: "Address is required field and is not provided.",
    });
  }
  //if admin wants , can pass verified status to approved, while registring the company itself or can approved later
  if (req.body.verified) {
    //if verified is provided in request body, then check whether a valid type is provided or not
    if (!isCompanyVerificationStatusValid(req.body.verified)) {
      return res.status(400).json({
        message:
          "Verified provided is not correct value. Allowed values for verified: APPROVED, PENDING AND REJECTED.",
      });
    }
  }
  //all validation passed
  next();
};

exports.validateCompanyUpdateRequestBody = async (req, res, next) => {
  trimValuesInRequestBody(req);
  if (req.body.name == "") {
    return res.status(400).json({
      message: "Name can't be empty string.",
    });
  }
  if (req.body.address == "") {
    return res.status(400).json({
      message: "Address can't be empty string.",
    });
  }
  if (req.body.verified) {
    //if verified is provided in request body, then check whether a valid type is provided or not
    if (!isCompanyVerificationStatusValid(req.body.verified)) {
      return res.status(400).json({
        message:
          "Verified provided is not correct value. Allowed values for verified: APPROVED, PENDING AND REJECTED.",
      });
    }
  }
  //all validation passed
  next();
};

/**
 *
 * @param {String} companyVerificationStatus
 * @returns {Boolean} true or false
 * @Description checks whether the given companyVerificationStatus is valid or not
 */
function isCompanyVerificationStatusValid(companyVerificationStatus) {
  const companyVerificationStatusList = [
    companyVerificationStatuses.approved,
    companyVerificationStatuses.pending,
    companyVerificationStatuses.rejected,
  ];

  return companyVerificationStatusList.includes(companyVerificationStatus);
}
