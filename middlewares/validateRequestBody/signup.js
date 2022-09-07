//This middleware contains the logic for validating request bodies coming along with  signup requests.

const { isValidObjectId } = require("mongoose");
const User = require("../../models/user.model");
const Company = require("../../models/company.model");
const trimValuesInRequestBody = require("../../utils/trimRequestBody");
const isValueUnique = require("../../utils/checkUniqueValueInModelDoc");

const {
  userTypes,
  companyVerificationStatuses,
} = require("../../utils/constants");

exports.validateSignUpRequestBody = async (req, res, next) => {
  trimValuesInRequestBody(req); //to remove unwanted spaces
  //User REQUEST BODY required properties{name,email,password,userId}
  const { name, email, password, userId } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Name is required field and is not provided.",
    });
  }
  if (!email) {
    return res.status(400).json({
      message: "Email is required field and is not provided.",
    });
  }
  if (!password) {
    return res.status(400).json({
      message: "Password is required field and is not provided.",
    });
  }
  if (!userId) {
    return res.status(400).json({
      message: "UserId is required field and is not provided.",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      message: "Email provided is invalid.",
    });
  }

  //check whether the email(provided in request body) is available to take or not
  let isAvailableToTake = await isValueUnique(User, { email: email });

  if (isAvailableToTake instanceof Error) {
    return res.status(500).json({
      message: "Internal server error while validating the request",
    });
  } else if (isAvailableToTake == false) {
    return res.status(400).json({
      message: "Email is already taken.Not available.",
    });
  }

  //check whether the userId(provided in request body) is unique or not.
  isAvailableToTake = await isValueUnique(User, { userId: userId });
  if (isAvailableToTake instanceof Error) {
    return res.status(500).json({
      message: "Internal server error while validating the request",
    });
  } else if (isAvailableToTake == false) {
    return res.status(400).json({
      message: "User Id is already taken.Not available.",
    });
  }

  if (req.body.userType) {
    //if userType is provided in request body , then ensure userType provided value is one of those values [ADMIN,APPLICANT,HR]
    if (!isUserTypeValid(req.body.userType)) {
      return res.status(400).json({
        message:
          "UserType provided is not correct value. Allowed values for userType: ADMIN, APPLICANT AND HR.",
      });
    }

    //ensure if the userType is hr, a correct CompanyId, must be provided, as without companyId, user registration as hr will be of no use.
    if (req.body.userType == userTypes.hr) {
      if (!req.body.companyId) {
        return res.status(400).json({
          message: "CompanyId need to be provided for registration as HR.",
        });
      } else {
        //companyId is provided, validate the companyId
        //validate companyId is valid ObjectId or not
        if (!isValidObjectId(req.body.companyId)) {
          return res.status(400).json({
            message: "Not a valid companyId.",
          });
        }
        //validate company exists in the db with the given companyId or not
        const company = await Company.findOne({ _id: req.body.companyId });
        if (!company) {
          return res.status(400).json({
            message: "Not a valid companyId.",
          });
        } else if (company.verified !== companyVerificationStatuses.approved) {
          //validate company has approved status in verified
          return res.status(400).json({
            message: `Company provided is not verified yet.Only Company with approved status,Hr's allowed to do registration. Current status of company - ${company.verified}. Contact ADMIN for getting approved status.`,
          });
        }
      }
    }
  }

  //all validation passed, so pass the control to the whosoever is next in request processing pipeline
  next();
};

/**
 *
 * @param {String} email
 * @returns {Boolean} true or false
 * @Description To check email is in valid email format or not
 */
function isValidEmail(email) {
  const regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regExp.test(email);
}

/**
 *
 * @param {String} userType
 * @returns {Boolean} true or false
 * @Description checks whether the given userType is valid or not
 */
function isUserTypeValid(userType) {
  const userTypesList = [userTypes.admin, userTypes.applicant, userTypes.hr];

  return userTypesList.includes(userType);
}
