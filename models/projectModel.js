const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, "Le titre est obligatoire"],
      trim: true,
      maxlength: [100, "Le titre ne peut pas dépasser 100 caractères"],
    },
    description: {
      type: String,
      required: [true, "La description est obligatoire"],
      trim: true,
    },
    technologies: {
      type: [String],
      required: [true, "Au moins une technologie est requise"],
    },
    lienGithub: {
      type: String,
      trim: true,
      default: null,
    },
    lienDemo: {
      type: String,
      trim: true,
      default: null,
    },
    image: {
      type: String,
      trim: true,
      default: null,
    },
    statut: {
      type: String,
      enum: ["en cours", "terminé", "archivé"],
      default: "en cours",
    },
    dateDebut: {
      type: Date,
      default: Date.now,
    },
    dateFin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // ajoute createdAt et updatedAt automatiquement
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;