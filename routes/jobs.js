const express = require("express");
const testUser = require("../middleware/testUser");

const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

const router = express.Router();

router.get("/", getAllJobs);
router.post("/", testUser, createJob);
router.get("/:id", getJob);
router.patch("/:id", testUser, updateJob);
router.delete("/:id", testUser, deleteJob);

module.exports = router;
