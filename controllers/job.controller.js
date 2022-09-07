//this file contains the logic for handling the job creation and updation
//only admin with approved status, hr with approved status and approved companyStatus is allowed to create a job and any applicant can apply for job, unless the job is not expired.

const User = require("../models/user.model");
const Job = require("../models/job.model");
const Company = require("../models/company.model");
const { jobStatuses, userTypes, userStatuses } = require("../utils/constants");
const {
  filterJobResponseForApplicant,
  filterJobsSetResponseForApplicant,
} = require("../utils/objectConverter");

exports.create = async (req, res) => {
  try {
    //isAdminOrHr validation already done in middleware
    //fetch the signedInUser details already binded in req.user

    let jobObjectToBeStoredInDB = {
      title: req.body.title,
      description: req.body.description,
      postedBy: req.user._id,
    };

    //check if the signedInuser is hr then take the companyId from there, else consider req.company (since admin has passed that)
    if (req.isAdmin == true) {
      jobObjectToBeStoredInDB.company = req.company._id;
    } else {
      jobObjectToBeStoredInDB.company = req.user.companyId;
    }

    const job = await Job.create(jobObjectToBeStoredInDB);

    //update the company jobsPosted too,need to
    if (req.isAdmin) {
      req.company.jobsPosted.push(job._id);
      await req.company.save();
    } else {
      //need to find the Company of the hr and update there
      const company = await Company.findOne({ _id: req.user.companyId });
      company.jobsPosted.push(job._id);
      await company.save();
    }

    return res.status(201).json({
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.error("Error while creating job ", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    let queryObj = {};
    //if optional queryParam such as status=ACTIVE or EXPIRED,then apply that
    if (req.query.status) {
      queryObj.status = req.query.status;
    }
    const user = await User.findOne({ userId: req.userId });
    let jobs;
    if (user.userType == userTypes.hr) {
      //find all the jobs related to company  to which hr belongs to
      jobs = await Job.find({ ...queryObj, company: user.companyId });
    } else {
      jobs = await Job.find(queryObj);
    }

    if (user.userType == userTypes.applicant) {
      //filter the response to avoid the applicant getting details(ids)
      jobs = await filterJobsSetResponseForApplicant(jobs);
      if (jobs instanceof Error) {
        throw jobs; //throw that error,so it will be catch
      }
    }
    return res.status(200).json({
      documentResultsCount: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.log("Error while fetching job details.", error.message);
    return res.status(500).json({
      message: "Internal server error while fetching the data.",
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    //exclude the all job.applicant id property detail only if req.userId is applicant
    const user = await User.findOne({ userId: req.userId });
    if (user.userType == userTypes.applicant) {
      req.job = await filterJobResponseForApplicant(req.job);
      if (req.job instanceof Error) {
        throw req.job; //throw that error,so it will be catch
      }
    }
    return res.status(200).json({
      data: req.job,
    });
  } catch (error) {
    console.log("Error while fetching job details.", error.message);
    return res.status(500).json({
      message: "Internal server error while fetching the data.",
    });
  }
};

exports.update = async (req, res) => {
  //depending on userType, update is allowed
  try {
    //check if job status is active then only applicant(with approved status) will be able to apply for job
    if (
      req.user.userType === userTypes.applicant &&
      req.user.userStatus === userStatuses.approved
    ) {
      if (req.job.status === jobStatuses.expired) {
        return res.status(400).json({
          message: "Job is not active, its already expired.",
        });
      } else {
        //update the job and user
        req.job.applicants.push(req.user._id);
        await req.job.save();
        req.user.jobsApplied.push(req.job._id);
        await req.user.save();

        return res.status(200).json({
          message: "Job application is successfull.",
        });
      }
    }
    //now the req.user will be either owner or admin, so update is allowed, in update only job status change is allowed.
    if (req.body.status) {
      if (
        ![jobStatuses.active, jobStatuses.expired].includes(req.body.status)
      ) {
        return res.status(400).json({
          message:
            "Job status is not valid value.Allowed values are- ACTIVE AND EXPIRED.",
        });
      }
    }
    //save the job
    req.job.status =
      req.body.status !== undefined ? req.body.status : req.job.status;
    req.job.title =
      req.body.title !== undefined ? req.body.title : req.job.title;
    req.job.description =
      req.body.description !== undefined
        ? req.body.description
        : req.job.description;

    const updatedJob = await req.job.save();
    return res.status(200).json({
      message: "Job updated is successfully done.",
      data: updatedJob,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Some internal error occured.",
    });
  }
};
