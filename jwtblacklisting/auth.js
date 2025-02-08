const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient();
redisClient.connect();

const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
};

// Verify JWT Token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(token);
    if (isBlacklisted) {
      return res.status(403).json({ message: "Token is blacklisted" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// Login handler
const login = (req, res) => {
  // Mock user for demonstration
  const user = { id: 1, username: "testuser" };
  const token = generateToken(user);
  res.json({ token });
};

// Logout handler
const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Calculate time until token expiration
    const expiry = decoded.exp - Math.floor(Date.now() / 1000);
    await redisClient.setEx(token, expiry, 'blacklisted');

    res.json({ message: "Successfully logged out" });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  generateToken,
  verifyToken,
  login,
  logout
};