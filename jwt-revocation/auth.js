const jwt = require('jsonwebtoken');
const client = require('./redisClient');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'password';

// Generate JWT
function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION });
}

// Verify JWT (checks if revoked)
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Check if token is blacklisted
    const isBlacklisted = await client.get(token);
    if (isBlacklisted) return res.status(401).json({ error: 'Token revoked' });

    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Revoke JWT
async function revokeToken(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(400).json({ error: 'Token required' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const expiry = decoded.exp - Math.floor(Date.now() / 1000);

    // Store token in Redis until it naturally expires
    await client.setEx(token, expiry, 'revoked');
    return res.json({ message: 'Token revoked successfully' });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid token' });
  }
}

module.exports = { generateToken, verifyToken, revokeToken };

