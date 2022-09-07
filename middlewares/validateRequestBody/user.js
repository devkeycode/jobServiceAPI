//This middleware contains the logic for handling request bodies coming along with  requests realted to User resource.

const Company = require("../../models/company.model");
const { companyVerificationStatuses } = require("../../utils/constants");

exports.validateUserUpdateRequestBody = async (req, res, next) => {
  if (req.body.company) {
    //means company updation request also came along, in the hr details
    const company = await Company.findOne({ _id: req.body.company });
    if (!company) {
      return res.status(400).json({
        message: "Company ID NOT VALID",
      });
    } else {
      //company id exists, ensure the company is approved or not, only allowed if compnay is approved
      if (company.verified !== companyVerificationStatuses.approved) {
        return res.status(400).json({
          message:
            "Company provided is not verified yet.Only Company with approved status, you can be part of.",
        });
      } else {
        //means all vaidation passed
        //add the company to req
        req.company = company;
      }
    }
  }
  
  next();
};
