//this file contains the logic for handling the User Resource

const User = require("../models/user.model");
const Company = require("../models/company.model");

const {
  filterUserSetResponse,
  filterUserResponse,
} = require("../utils/objectConverter");

const { userTypes } = require("../utils/constants");

//get all the list of the users
exports.findAllUsers = async (req, res) => {
  const queryObj = {};
  //if optional queryParam passed along with the request,then add them to the queryObj

  if (req.query.userType) {
    queryObj.userType = req.query.userType;
  }
  if (req.query.userStatus) {
    queryObj.userStatus = req.query.userStatus;
  }

  try {
    const users = await User.find(queryObj);
    return res.status(200).json({
      documentResultsCount: users.length,
      data: filterUserSetResponse(users),
    });
  } catch (error) {
    console.error("Error while fetching all the users", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//get a single user based on userId
exports.findByUserId = async (req, res) => {
  try {
    // user validation happened in the middleware itself and which user to find is  binded already in req.user after passing isValidUserIdInReqParam middleware,so no need to call db again
    return res.status(200).json({
      data: filterUserResponse(req.user),
    });
  } catch (error) {
    console.error("Error while searching the user ", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//update user
//name,userStatus detail
exports.update = async (req, res) => {
  try {
    //isAdminOrOwner already checked in the middleware
    //get the userdetails which to be updated , which is already binded in req.user in isValidUserIdInReqParam middleware(if passed)

    //check if userStatus is provided to be updated , as admin only allowed this update, so checking the req.isAdmin also,then only updating the userStatus
    if (req.body.userStatus && req.isAdmin) {
      req.user.userStatus = req.body.userStatus;
    }

    //name,company update is allowed to the owner
    if (req.body.name) {
      //update user name
      req.user.name = req.body.name;
    }
    if (req.body.companyId) {
      //update the company
      //ensure whether the given companyID is valid companyId, already done in middleware and req.company is binded in validateUserUpdateRequestBody middleware
      req.user.companyId = req.body.companyId;

      //also update in the company hrs list

      //if user is not already in the company hrs list,then only push
      if (!req.company.hrs.includes(req.user._id)) {
        req.company.hrs.push(req.user._id);
        await req.company.save();
      }
    }
    //save the user in the db
    const updatedUser = await req.user.save();

    return res.status(200).json({
      message: "User updated successfully",
      data: filterUserResponse(updatedUser),
    });
  } catch (error) {
    console.log("Error while updating user", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
