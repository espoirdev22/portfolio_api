const Project = require("../models/projectModel");

// ─────────────────────────────────────────────
//  POST /api/projects  —  Ajouter un projet
// ─────────────────────────────────────────────
const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();

    res.status(201).json({
      success: true,
      message: "Projet créé avec succès",
      data: savedProject,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
//  GET /api/projects  —  Retourner tous les projets
// ─────────────────────────────────────────────
const getAllProjects = async (req, res) => {
  try {
    const { statut, tech, sort } = req.query;

    const filter = {};
    if (statut) filter.statut = statut;
    if (tech) filter.technologies = { $in: [tech] };

    const sortOption = sort === "asc" ? { createdAt: 1 } : { createdAt: -1 };

    const projects = await Project.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
//  GET /api/projects/:id  —  Retourner un projet par ID
// ─────────────────────────────────────────────
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Aucun projet trouvé avec l'id : ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "ID invalide",
      });
    }
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
//  PUT /api/projects/:id  —  Modifier un projet
// ─────────────────────────────────────────────
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,          // retourne le document mis à jour
        runValidators: true, // applique les validations du schéma
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Aucun projet trouvé avec l'id : ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Projet mis à jour avec succès",
      data: project,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors: messages,
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "ID invalide" });
    }
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
//  DELETE /api/projects/:id  —  Supprimer un projet
// ─────────────────────────────────────────────
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Aucun projet trouvé avec l'id : ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Projet supprimé avec succès",
      data: project,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "ID invalide" });
    }
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};