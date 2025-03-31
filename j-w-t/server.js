import express from "express";
import { validateJWT } from "./auth.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Secure API route
app.get("/protected", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract JWT
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = await validateJWT(token);
    res.json({ message: "Access granted", user: decoded });
  } catch (err) {
    res.status(403).json({ error: "Unauthorized" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

