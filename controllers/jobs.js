const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query;
  console.log(req.query);

  const queryObject = {
    createdBy: req.user.userId,
  };

  // search functionality
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  // filtering status
  if (status && status !== "all") {
    queryObject.status = status;
  }

  // filtering jobType
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  let result = Job.find(queryObject);

  // sorting logic
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }

  if (sort === "oldest") {
    result = result.sort("createdAt");
  }

  if (sort === "a-z") {
    result = result.sort("position");
  }

  if (sort === "z-a") {
    result = result.sort("-position");
  }

  // pagination logic
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  let jobs = await result;
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

const getJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;

  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No Job with jobId : ${jobId}`);
  }

  res.status(StatusCodes.OK).json(job);
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  // job = { ...job, job_id: job._id };
  res.status(StatusCodes.CREATED).json(job);
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    params: { id: jobId },
    user: { userId },
  } = req;

  if (company === "" && position === "") {
    throw new BadRequestError("Must provide entries for updation");
  }

  if (company === "") {
    throw new BadRequestError("Must provide company name");
  }

  if (position === "") {
    throw new BadRequestError("Must provide position of responsibility");
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`No Job with jobId : ${jobId}`);
  }

  res.status(StatusCodes.OK).json(job);
};

const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;

  const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No Job with jobId : ${jobId} exists`);
  }

  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "Deleted successfully" });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
