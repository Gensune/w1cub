import express from "express";
const router = express.Router();

// Example: GET /api/hello
router.get("/hello", (req, res) => {
  res.json({ message: "Hello from API 🚀", time: new Date() });
});

// Example: POST /api/echo
router.post("/echo", (req, res) => {
  res.json({ youSent: req.body });
});

export default router;
