import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import cors from "cors";
import { config } from "./config.js";
import { connectDB } from "./db/mongoose.js";
import apiRoutes from "./routes/api.js";     // existing
import todoRoutes from "./routes/todos.js";  // new 

// Fix __dirname (not available in ES modules by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());        // Parse JSON request bodies
app.use(morgan(config.env === "production" ? "combined" : "dev"));
app.use(cors({
  origin: "https://w1cub.com", // only allow your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// API routes
app.use("/api", apiRoutes);
app.use("/api/todos", todoRoutes);

// Serve static files (frontend build goes in ./public)
app.use(express.static(path.join(__dirname, "public")));

// Catch-all (SPA frontend routing support)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handler (last middleware)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Boot sequence
connectDB(config.mongoUri)
  .then(() => {
    app.listen(config.port, () => {
      console.log(`✅ Running in ${config.env} mode on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
