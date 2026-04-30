const express = require("express");
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

// ─────────────────────────────────────────────
//  Routes CRUD pour les projets
// ─────────────────────────────────────────────

// POST   /api/projects        → Ajouter un projet
// GET    /api/projects        → Retourner tous les projets
router.route("/").post(createProject).get(getAllProjects);

// GET    /api/projects/:id    → Retourner un projet par ID
// PUT    /api/projects/:id    → Modifier un projet
// DELETE /api/projects/:id   → Supprimer un projet
router
  .route("/:id")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;