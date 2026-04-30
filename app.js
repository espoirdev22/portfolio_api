require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectdb");
const projectRoutes = require("./routes/projectRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/projects", projectRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 API Portfolio opérationnelle",
    version: "1.0.0",
    endpoints: {
      "GET    /api/projects":     "Retourner tous les projets",
      "POST   /api/projects":     "Ajouter un projet",
      "GET    /api/projects/:id": "Retourner un projet par ID",
      "PUT    /api/projects/:id": "Modifier un projet",
      "DELETE /api/projects/:id": "Supprimer un projet",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} introuvable`,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erreur interne du serveur",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Serveur démarré sur le port ${PORT}`);
  console.log(`📖 http://localhost:${PORT}/`);
});

module.exports = app;