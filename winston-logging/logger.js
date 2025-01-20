const { createLogger, format, transports } = require('winston');

// Create the logger
const logger = createLogger({
    level: 'info', // Default log level
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }), // Include stack traces for errors
        format.splat(), // Allows string interpolation
        format.json() // Logs in JSON format
    ),
    defaultMeta: { service: 'user-service' }, // Default metadata
    transports: [
        new transports.File({ filename: 'error.log', level: 'error' }), // Logs errors to error.log
        new transports.File({ filename: 'combined.log' }) // Logs everything to combined.log
    ]
});

//  console transport for development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }));
}

module.exports = logger;
