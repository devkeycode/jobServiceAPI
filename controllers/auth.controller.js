//this file contains the logic for handling the user registration(signUp) and user signIn

/*
3 types of user, in the system
ADMIN->able to registered, and by default userStatus PENDING . Admin with approved status added to the database directly,  so in case a user tries to add or update status as admin,its allowed(since system may have multiple admins if needed) but make userStatus as pending(so approvedAdmin later can change the status to approved), and in the system only admin with approved status allowed to have all the rights.
HR-> able to registred, and by default userStatus pending , only after getting Approved userStatus(provided the companyStatus to which hr belong is approved too,by default company is pendingStatus ,unless provided exclusively by the admin while adding the company)
Usually company after added by the admin into the system, companyId is provided to company(thru communication), so internally compnay can distribute that with the hrs user, which will later can register into the system.
APPLICANT -> able to registered, and get the approved userStatus by default

NOTE- Any user whose status is not Approved, can only be changed to Approved by the approved admin only.
Like in case of Applicant, if status is other than Approved, he/she will not be able to apply for jobs anymore, unless status turned back to Approved again.
Same goes for company Hr too, but in this case the companyStatus also must be approved ,so hr can post a job.
Though a apprroved admin can also post a job, on the behalf of company.
*/
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Company = require("../models/company.model");
const { userTypes, userStatuses } = require("../utils/constants");
const { filterUserResponse } = require("../utils/objectConverter");
const authConfig = require("../configs/auth.config");

exports.signup = async (req, res) => {
  let userStatus = userStatuses.approved; //by default approved userStatus

  //if userType is provided, means the user may be other than default applicant type, so in this case, change the userStatus accordingly
  if (req.body.userType) {
    if (req.body.userType !== userTypes.applicant) {
      userStatus = userStatuses.pending; //make userStatus as pending status, for the user other than applicantUser means a new admin user and hr user userStatus will be pending only
    }
  }
  const userObjectToStoredInDB = {
    name: req.body.name,
    userId: req.body.userId,
    email: req.body.email,
    userType: req.body.userType ? req.body.userType : userTypes.applicant,
    password: bcrypt.hashSync(req.body.password, 8),
    userStatus: userStatus,
  };
  //check if userType is hr, and valid company id is passed(companyId is already verified in the middleware),add it to the userObject
  if (req.body.userType === userTypes.hr && req.body.companyId) {
    userObjectToStoredInDB.companyId = req.body.companyId;
  }
  try {
    //create user
    let user = await User.create(userObjectToStoredInDB);
    console.log(user);

    //if the user is hr  then add current hr userId to the company list of hrs too
    if (user.companyId) {
      const company = await Company.findOne({ _id: user.companyId });
      company.hrs.push(user._id); //push the current userId into company hrs list
      await company.save();
    }

    return res.status(201).json({
      data: filterUserResponse(user),
      message: "User created successfully.",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error , while creating the user.",
    });
  }
};

//controller function to handle signin
exports.signin = async (req, res) => {
  const { userId, password } = req.body;

  try {
    //check whether user with given userId exists or not
    const user = await User.findOne({ userId });
    if (user == null) {
      return res.status(400).json({
        message: "UserId does not exist.Provide a valid userId to signIn.",
      });
    }
    //user exists, now only allow user with APPROVED userStatus to continue,else return  //since checking user apporved status here only, so no need to check again in the following requests as all Api's endpoints need access token to access except signin and signup requests.
    if (user.userStatus !== userStatuses.approved) {
      return res.status(400).json({
        message: `UserStatus is not approved. Current userStatus is - ${user.userStatus}.Contact ADMIN.`,
      });
    }
    //check whether the password matches against the password in the database for the user, to validate the user
    const isPasswordMatched = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: " Password doesn't matched." });
    }
    //since user is validated,so create access token (using jsonwebtoken library) and send it along with other values in response body
    const token = jwt.sign({ id: user.userId }, authConfig.secret, {
      expiresIn: authConfig.expiryPeriod,
    });
    //send the response
    return res.status(200).json({
      data: { ...filterUserResponse(user), accessToken: token },
    });
  } catch (error) {
    console.log("Internal error -> ", error.message);
    res.status(500).json({
      message: "Some internal server error while signin",
    });
  }
};
