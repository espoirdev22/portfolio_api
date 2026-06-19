require("dotenv").config({ silent: true });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectdb");
const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require('./routes/authRoutes');

// ✅ Prometheus
const client = require("prom-client");

// Collecte automatique des métriques système (CPU, RAM, etc.)
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Métrique personnalisée : nombre de requêtes HTTP
const httpRequestCounter = new client.Counter({
  name: "api_http_requests_total",
  help: "Nombre total de requêtes HTTP reçues",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

// Métrique personnalisée : durée des requêtes
const httpRequestDuration = new client.Histogram({
  name: "api_http_request_duration_seconds",
  help: "Durée des requêtes HTTP en secondes",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5],
  registers: [register],
});

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Middleware pour mesurer chaque requête
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode,
    });
    end({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode,
    });
  });
  next();
});

app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);

// ✅ Endpoint Prometheus
app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 API Portfolio opérationnelle",
    version: "1.0.0",
    endpoints: {
      "GET    /api/projects": "Retourner tous les projets",
      "POST   /api/projects": "Ajouter un projet",
      "GET    /api/projects/:id": "Retourner un projet par ID",
      "PUT    /api/projects/:id": "Modifier un projet",
      "DELETE /api/projects/:id": "Supprimer un projet",
      "POST   /api/auth/login": "Connexion admin",
      "GET    /metrics": "Métriques Prometheus",
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
  console.log(`📊 Métriques : http://localhost:${PORT}/metrics`);
});

module.exports = app;