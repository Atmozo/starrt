class Logger {
  constructor() {
    if (!Logger.instance) {
      this.logs = [];
      Logger.instance = this;
    }
    return Logger.instance;
  }

  log(message) {
    this.logs.push(message);
    console.log(`[LOG] ${message}`);
  }
}

const loggerInstance = new Logger();
Object.freeze(loggerInstance); // Prevent modifications

export default loggerInstance;
class Logger {
  constructor() {
    if (!Logger.instance) {
      this.logs = [];
      Logger.instance = this;
    }
    return Logger.instance;
  }

  log(message) {
    this.logs.push(message);
    console.log(`[LOG] ${message}`);
  }
}

const loggerInstance = new Logger();
Object.freeze(loggerInstance); // Prevent modifications

export default loggerInstance;

