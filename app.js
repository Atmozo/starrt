
const Logger = require("./logger");

// Create a logger instance
const logger = new Logger();

// Simulate logging events
logger.log("Server started...");
setTimeout(() => logger.log("User logged in"), 2000);
setTimeout(() => logger.log("User performed an action"), 4000);
setTimeout(() => logger.log("Server shutting down"), 6000);
