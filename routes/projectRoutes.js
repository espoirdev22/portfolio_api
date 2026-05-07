const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

// GET    /api/projects        → public
// POST   /api/projects        → protégé
router.route("/")
  .get(getAllProjects)
  .post(protect, createProject);

// GET    /api/projects/:id    → public
// PUT    /api/projects/:id    → protégé
// DELETE /api/projects/:id   → protégé
router.route("/:id")
  .get(getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;