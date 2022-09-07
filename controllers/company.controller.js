//this file contains the logic for handling the company creation and updation
//only admin with approved status is allowed to do so.

const Company = require("../models/company.model");

exports.create = async (req, res) => {
  const companyObjectToStoredInDB = {
    name: req.body.name,
    address: req.body.address,
  };
  if (req.body.verified) {
    //if its provided add it to the companyObj too,else it will take the default value(of pending) by itself in the db
    companyObjectToStoredInDB.verified = req.body.verified;
  }
  const company = await Company.create(companyObjectToStoredInDB);
  return res.status(201).json({
    data: company,
    message: "Company created successfully",
  });
};

exports.update = async (req, res) => {
  try {
    // const company = await Company.findOne({ _id: req.params.id });
    // const company = req.company;
    //update the company
    //getting company details from the request body as it is binded to the request object after isValidCompanyIdInReqParam middleware is passed
    req.company.name =
      req.body.name != undefined ? req.body.name : req.company.name;
    req.company.address =
      req.body.address != undefined ? req.body.address : req.company.address;
    req.company.verified =
      req.body.verified != undefined ? req.body.verified : req.company.verified;

    const updatedCompany = await req.company.save();
    return res.status(200).json({
      data: updatedCompany,
      message: "Company successfully updated.",
    });
  } catch (error) {
    console.log("Error while updating company", error.message);
    return res.status(500).json({
      message: "Internal server error while updating.",
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const companies = await Company.find();
    return res.status(200).json({
      documentResultsCount: companies.length,
      data: companies,
    });
  } catch (error) {
    console.log("Error while fetching company details.", error.message);
    return res.status(500).json({
      message: "Internal server error while fetching the data.",
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    // const company = await Company.findOne({ _id: req.params.id });
    return res.status(200).json({
      data: req.company, //getting company from the request object
    });
  } catch (error) {
    console.log("Error while fetching company details.", error.message);
    return res.status(500).json({
      message: "Internal server error while fetching the data.",
    });
  }
};
