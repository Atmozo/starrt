const logger = require('./logger');
const express = require('express');

const app = express();
const PORT = 3000;

// Middleware to simulate errors
app.use((req, res, next) => {
    logger.info('Request received: %s %s', req.method, req.url);
    next();
});

// Simulate an endpoint with an error
app.get('/error', (req, res) => {
    const error = new Error('Something went wrong!');
    logger.error('Error occurred: %s', error.message, { stack: error.stack });
    res.status(500).send('Internal Server Error');
});


app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
