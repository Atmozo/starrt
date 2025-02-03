const EventEmitter = require("events");
const fs = require("fs");
const path = require("path");

class Logger extends EventEmitter {
  constructor() {
    super();
    this.logFile = path.join(__dirname, "app.log");

    // Listen for the "log" event
    this.on("log", (message) => {
      this.logToFile(message);
    });
  }

  log(message) {
    console.log(`[LOG]: ${message}`);
    
    // Emit the "log" event
    this.emit("log", message);
  }

  logToFile(message) {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    
    // Append log message to a file
    fs.appendFile(this.logFile, logMessage, (err) => {
      if (err) {
        console.error("Error writing to log file:", err);
      }
    });
  }
}

module.exports = Logger;
