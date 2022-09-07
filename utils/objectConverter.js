//This util function used to convert the object, in short sending only required values in the user object and excluding the unwanted (like user password) from sending,so filtering the userObject for Response.Also implemented for job object, to hide applicant id details from other applicant or job searcher.

const { userTypes } = require("./constants");
const User = require("../models/user.model");
const Company = require("../models/company.model");

//filter a single user, to send a single user info as repsonse
const filterUserResponse = (userObj) => {
  //pick up only those properties that are needed from the userObj
  const { name, email, userId, userType, userStatus, createdAt, updatedAt } =
    userObj;
  //return an object of the same extracted properties
  const returnedUserObject = {
    name,
    email,
    userId,
    userType,
    userStatus,
    createdAt,
    updatedAt,
  };
  return returnedUserObject;
};

//filter all users, to send all users info as response
const filterUserSetResponse = (users) => {
  const userSetResponse = [];
  for (let user of users) {
    userSetResponse.push(filterUserResponse(user));
  }
  return userSetResponse;
};

//filter a single job, to send a single job info as repsonse
const filterJobResponseForApplicant = async (jobObj) => {
  try {
    //get the company name and address and add it to the returnedJobObj
    const company = await Company.findOne({ _id: jobObj.company });

    //get the postedBy user details
    const postedBy = await User.findOne({ _id: jobObj.postedBy });

    //return an object of the same extracted properties
    const returnedJobObject = {
      _id: jobObj._id,
      title: jobObj.title,
      description: jobObj.description,
      status: jobObj.status,
      company: {
        name: company.name,
        address: company.address,
      },
      postedBy: {
        name: postedBy.name,
        email: postedBy.email,
      },
    };
    return returnedJobObject;
  } catch (error) {
    return error;
  }
};

//filter all jobs, to send all jobs info as response
const filterJobsSetResponseForApplicant = async (jobs) => {
  const jobsSetResponse = [];
  for (let job of jobs) {
    const jobResponse = await filterJobResponseForApplicant(job);
    if (jobResponse instanceof Error) {
      return jobResponse; //error means
    }
    jobsSetResponse.push(jobResponse);
  }
  return jobsSetResponse;
};

module.exports = {
  filterUserResponse,
  filterUserSetResponse,
  filterJobResponseForApplicant,
  filterJobsSetResponseForApplicant,
};
