const rateLimit = require('express-rate-limit');

const graphqlRateLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10, 
  message: {
    error: 'Too many GraphQL requests, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = graphqlRateLimiter;
