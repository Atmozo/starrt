const express = require("express");
const { generateToken, verifyToken, logout } = require("./auth");

const app = express();
app.use(express.json());

// Mock user
const user = { id: 1, username: "admin" };

// Login - Generate Token
app.post("/login", (req, res) => {
  const token = generateToken(user);
  res.json({ token });
});

// Protected Route
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "You have access!", user: req.user });
});

// Logout - Blacklist Token
app.post("/logout", logout);

app.listen(3000, () => console.log("Server running on port 3000"));
