const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const cluster = require("cluster");
const os = require("os");
require("dotenv").config();

const app = express();

// Middleware
app.use(compression()); // Enable GZIP compression
app.use(helmet()); // Secure HTTP headers
app.use(morgan("combined")); // Logging

// Import custom middleware
const rateLimiter = require("./middleware/rateLimiter");
const cacheMiddleware = require("./middleware/cache");

app.use(rateLimiter);

// Simple route with caching
app.get("/data", cacheMiddleware, (req, res) => {
  res.json({ message: "Optimized Express App 🚀", timestamp: Date.now() });
});

// Multi-core clusteringserver.js
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
} else {
  app.listen(3000, () => console.log(`Worker ${process.pid} running on port 3000`));
}
