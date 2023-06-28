const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ totalJobs: jobs.length, jobs });
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
